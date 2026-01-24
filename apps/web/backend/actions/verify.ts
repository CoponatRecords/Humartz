"use server";

import { prisma } from '@backend/hello-prisma/prisma'; // Adjust path to your prisma client
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

export async function getMerkleProof(trackId: number) {
  // 1. Get the track the user is asking about
  const targetTrack = await prisma.track.findUnique({
    where: { id: trackId },
  });

  if (!targetTrack?.merkleLeaf ) {
    throw new Error("Track not found or not verified");
  }

  // 2. Re-build the Tree to generate the proof path
  // (We fetch only the leaves to keep it fast)
  const allVerified = await prisma.track.findMany({
    where: { isVerified: 'yes', merkleLeaf: { not: null } },
    select: { merkleLeaf: true },
    orderBy: { id: 'asc' } // CRITICAL: Order must match generate-root.ts
  });

  const leaves = allVerified.map(t => t.merkleLeaf!);
  
  const tree = new MerkleTree(leaves, keccak256, { 
    sortPairs: true, 
    hashLeaves: false 
  });

  // 3. Generate the specific proof for this track
  const proof = tree.getHexProof(targetTrack.merkleLeaf);
  const root = tree.getHexRoot();

  return {
    proof,      // The path up the tree
    leaf: targetTrack.merkleLeaf, 
    root        // We send this just for debugging, frontend uses EXPECTED_ROOT
  };
}