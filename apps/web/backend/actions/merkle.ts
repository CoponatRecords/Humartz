// apps/web/backend/utils/merkle.ts
import { prisma } from '@backend/hello-prisma/prisma'; // Adjust path
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

export async function getCanonicalLeaves() {
  // 1. Fetch tracks with EXACTLY the same logic as verification
  const tracks = await prisma.track.findMany({
    where: { 
      merkleLeaf: { not: null } 
    },
    select: { merkleLeaf: true },
    orderBy: { id: 'asc' } 
  });

  // 2. Return them as simple strings
  return tracks.map(t => t.merkleLeaf as string);
}

export function buildTree(leaves: string[]) {
  return new MerkleTree(leaves, keccak256, { 
    sortPairs: true, 
    hashLeaves: false 
  });
}