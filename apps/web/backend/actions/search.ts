"use server";

import { prisma as database } from "@repo/database";

export type SearchResults = {
  tracks: { 
    id: number; 
    folderHash: string | null;
    txHash: string | null;
    title: string| null; 
    artistName: string | null;
    userName: string | null;
    verificationStatus: "yes" | "no" | "pending" | null;
  }[];
  users: { 
    id: string; 
    name: string | null; 
    username: string | null; 
    artistname: string | null;
  }[];
};

export async function searchGlobal(query: string): Promise<SearchResults> {
  const cleanQuery = query.trim();

  if (!cleanQuery || cleanQuery.length < 2) {
    return { tracks: [], users: [] };
  }

  try {
    // Parallelize the search for better performance
    const [tracks, users] = await Promise.all([
      database.track.findMany({
        where: {
          OR: [

            { title: { contains: cleanQuery, mode: "insensitive" } },
            { folderHash: { contains: cleanQuery, mode: "insensitive" } },
            { txHash: { contains: cleanQuery, mode: "insensitive" } },
            { artistName: { contains: cleanQuery, mode: "insensitive" } },
            { userName: { contains: cleanQuery, mode: "insensitive" } }
          ]
        },
        take: 10,
        select: {
          id: true,
          title: true,
          isVerified: true,
          artistName: true,
        },
      }),
      database.user.findMany({
        where: {
          OR: [
            { name: { contains: cleanQuery, mode: "insensitive" } },
            { username: { contains: cleanQuery, mode: "insensitive" } },
            { artistname: { contains: cleanQuery, mode: "insensitive" } },
          ]
        },
        take: 5,
        select: {
          name: true,
          username: true,
          artistname: true,
        }
      })
    ]);
    const formattedTracks = tracks.map((t: any) => {
      // Map your string-based isVerified to status levels
      const rawValue = (t.isVerified || "pending").toLowerCase();
      let status: "yes" | "no" | "pending" = "pending";

      if (["true", "yes", "verified"].includes(rawValue)) {
        status = "yes";
      } else if (["false", "no", "ai", "rejected"].includes(rawValue)) {
        status = "no";
      }

      return {
        id: t.id ,
        title: t.title,
        txHash: t.txHash ?? "no txHash",
        folderHash: t.folderHash ?? "no folderHash",
        artistName: t.artistName ?? "Unknown Artist",
        userName: t.userName ?? "Unknown User",
        verificationStatus: status,
      };
    });

    return { 
      tracks: formattedTracks, 
      users: users 
    };
  } catch (error) {
    console.error("❌ Search Execution Failed!", error);
    return { tracks: [], users: [] };
  }
}