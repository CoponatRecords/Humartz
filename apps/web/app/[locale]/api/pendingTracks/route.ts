import { NextResponse } from "next/server";
import { prisma } from "@repo/database";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const user = await currentUser();

    // 1. Better Authorization handling
    if (!user || user.publicMetadata.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Prisma Query
    const pending = await prisma.track.findMany({
      where: {
        // Ensure this matches your schema (e.g., "PENDING" vs "pending")
        txHash : null, 
      },
      select: {
        id: true,
        title: true,
        artistName: true,
        userName: true,
        email: true,
        storagePath: true,
        folderHash: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(pending);
  } catch (err) {
    // This logs the SPECIFIC error to your terminal
    console.error("API_PENDING_TRACKS_ERROR:", err); 
    return NextResponse.json(
      { error: "Internal Server Error", details: err instanceof Error ? err.message : "Unknown error" }, 
      { status: 500 }
    );
  }
}