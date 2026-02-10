"use server";

import { prisma as database } from "@repo/database";

export type SearchResults = {
  tracks: { 
    id: number; 
    folderHash: string | null;
    txHash: string | null;
    title: string; 
    slug: string | null; 
    artistName: string; 
    verificationStatus: string | null 
  }[];
  artists: { 
    id: number; 
    name: string; 
    slug: string; 
    verificationStatus: string | null 
  }[];
};

export async function searchGlobal(query: string): Promise<SearchResults> {
  const cleanQuery = query.trim();

  if (!cleanQuery || cleanQuery.length < 2) {
    return { tracks: [], artists: [] };
  }

  try {
    // 1. We remove the complex 'some' relation because your schema uses a String for artists
    // 2. We add txHash and folderHash to the select block
    const tracks = await database.track.findMany({
      where: {
        OR: [
          { title: { contains: cleanQuery, mode: "insensitive" } },
          { folderHash: { contains: cleanQuery, mode: "insensitive" } },
          { txHash: { contains: cleanQuery, mode: "insensitive" } },
          { artists: { contains: cleanQuery, mode: "insensitive" } }
        ]
      },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        isVerified: true,
        txHash: true,      // Fix: Added missing field
        folderHash: true,  // Fix: Added missing field
        artists: true,     // Fix: This is a string in your schema
      },
    });

    // Note: Your schema doesn't have an 'Artist' model, only an 'artists' string on Track.
    // If you plan to add an Artist model later, you'll need to update the schema.
    // For now, we return an empty array for artists to prevent crashes.
    const artists: any[] = []; 

    const formattedTracks = tracks.map((t: {
      artistName: string; isVerified: any; id: any; title: any; slug: any; txHash: any; folderHash: any; artists: any; 
}) => {
      const rawValue = (t.isVerified || "").trim().toLowerCase();
      
      let status: string | null = null; 

      if (rawValue === "true" || rawValue === "yes" || rawValue === "verified") {
        status = "yes"; // Green
      } else if (rawValue === "false" || rawValue === "no" || rawValue === "ai") {
        status = "no";  // Red
      } else {
        status = null;  // Orange (Pending)
      }

      return {
        id: t.id,
        title: t.title,
        slug: t.slug,
        txHash: t.txHash,
        folderHash: t.folderHash,
        // Since 'artists' is a string in your DB, we use it directly
        artistName: t.artistName ?? "Unknown Artist",
        verificationStatus: status, 
      };
    });

    return { 
      tracks: formattedTracks, 
      artists: [] 
    };
  } catch (error) {
    console.error("❌ Search Execution Failed!", error);
    return { tracks: [], artists: [] };
  }
}