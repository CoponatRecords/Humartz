// app/actions/search.ts
"use server";

import { prisma } from '../hello-prisma/prisma';

export type SearchResults = {
  tracks: { 
    id: number; 
    title: string; 
    slug: string; 
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
    const [tracks, artists] = await Promise.all([
      // 1. Search Tracks
      prisma.track.findMany({
        where: {
          title: { contains: cleanQuery, mode: "insensitive" },
          published: true,
        },
        take: 5,
        select: {
          id: true,
          title: true,
          slug: true,
          isVerified: true, // <--- FIX: Select the actual DB column name
          artists: {
            take: 1,
            where: { role: "MAIN" },
            select: { artist: { select: { name: true } } },
          },
        },
      }),
      // 2. Search Artists
      prisma.artist.findMany({
        where: { name: { contains: cleanQuery, mode: "insensitive" } },
        take: 5,
        select: { id: true, name: true, slug: true },
      }),
    ]);

    // 3. Format Tracks
    const formattedTracks = tracks.map((t) => ({
      id: t.id,
      title: t.title,
      slug: t.slug,
      artistName: t.artists[0]?.artist.name || "Unknown Artist",
      // Map the DB field 'isVerified' to the frontend prop 'verificationStatus'
      verificationStatus: t.isVerified, 
    }));

    // 4. Format Artists
    const formattedArtists = artists.map((a) => ({
      ...a,
      // If artists don't have this field yet, leave as null or hardcode logic
      verificationStatus: null, 
    }));

    return { tracks: formattedTracks, artists: formattedArtists };
  } catch (error) {
    console.error("Search Error:", error);
    return { tracks: [], artists: [] };
  }
}