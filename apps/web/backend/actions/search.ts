// app/actions/search.ts
"use server";

import { prisma } from '@backend/hello-prisma/prisma';

export type SearchResults = {
  tracks: { 
    id: number; 
    merkleLeaf: string | null;
    title: string; 
    slug: string| null; 
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
  // published: true, // Note: Your schema doesn't actually have a 'published' field on Track yet, so keep this commented out or verify against 'releaseDate'.
  
  OR: [
    // 1. Search Track Title
    { title: { contains: cleanQuery, mode: "insensitive" } },
    
    // 2. Search Merkle Leaf
    { merkleLeaf: { contains: cleanQuery, mode: "insensitive" } },

    // 3. Search Artist Name (Through the TrackArtist join table)
    { 
      artists: { 
        some: { 
          artist: {
            name: { contains: cleanQuery, mode: "insensitive" }
          }
        } 
      } 
    }
  ]
},
        take: 5,
        select: {
          id: true,
          title: true,
          slug: true,
          isVerified: true,
          merkleLeaf: true, 
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
      merkleLeaf: t.merkleLeaf,
      artistName: t.artists[0]?.artist.name || "Unknown Artist",
      verificationStatus: t.isVerified, 
    }));

    // 4. Format Artists
    const formattedArtists = artists.map((a) => ({
      ...a,
      verificationStatus: null, 
    }));

    return { tracks: formattedTracks, artists: formattedArtists };
  } catch (error) {
    console.error("Search Error:", error);
    return { tracks: [], artists: [] };
  }
}