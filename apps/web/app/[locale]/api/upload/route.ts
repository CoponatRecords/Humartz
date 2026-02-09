import { NextRequest, NextResponse } from "next/server";
import { getSignedUrlForUpload } from "@api/upload/r2";
import { prisma as database } from "@repo/database";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1️⃣ HANDLE PROMO & DATABASE SYNC
    if (body.endpoint === "verify-promo") {
      const serverSecret = process.env.FREE_UPLOAD_CODE || "HUMARTZFREE2026";
      const userCode = body.promoCode?.trim().toUpperCase();
      const isValid = userCode === serverSecret.toUpperCase();

      const { promoCode, email, userId, trackName, storagePath, folderHash} = body;
      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      try {
        // Create the track in the database linked to the User
        await database.track.create({
          data: {
            promoCode: promoCode || null,
            email: email,
            title: trackName,
            authorId: userId || null, // Links to User.id (Clerk ID)
            audioUrl: storagePath, // Storing the R2 path
            isVerified: "pending",
            slug: `${userId}-${Date.now()}`, 
            folderHash: folderHash
          },
        });

        return NextResponse.json({ isFree: isValid });
      } catch (dbError) {
        console.error("Prisma Error:", dbError);
        return NextResponse.json({ error: "Database save failed" }, { status: 500 });
      }
    }

    // 2️⃣ R2 SIGNED URL LOGIC
    const { fileName, fileType } = body;

    if (!fileName || !fileType) {
      return NextResponse.json({ error: "File name or type missing" }, { status: 400 });
    }

    const signedUrl = await getSignedUrlForUpload(fileName, fileType);
    return NextResponse.json({ signedUrl });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}