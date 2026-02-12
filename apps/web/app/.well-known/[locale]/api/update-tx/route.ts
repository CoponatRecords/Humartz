// app/api/tracks/update-tx/route.ts
import { NextResponse } from "next/server";
import { prisma as database } from "@repo/database";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { trackId, transactionHash } = await req.json();

    await database.track.update({
      where: { id: trackId },
      data: { 
        txHash: transactionHash,
        isVerified: "yes" // Update status to certified simultaneously
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}