// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSignedUrlForUpload } from "../../upload/r2";
import { prisma } from "@prisma/prisma"; // adjust to your path

export async function POST(request: NextRequest) {
  try {
    const { 
      fileName, 
      fileType, 
      captchaToken, 
      artistId, 
      trackTitle, 
      folderHash 
    } = await request.json();

    // 1️⃣ Validate required fields
    if (!captchaToken) {
      return NextResponse.json({ error: "CAPTCHA token is missing" }, { status: 400 });
    }
    if (!fileName || !fileType) {
      return NextResponse.json({ error: "File name or type missing" }, { status: 400 });
    }
    if (!artistId || !trackTitle || !folderHash) {
      return NextResponse.json({ error: "Artist ID, track title, or folder hash missing" }, { status: 400 });
    }

    // 2️⃣ Verify reCAPTCHA
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verifyRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: secretKey || "", response: captchaToken }).toString(),
    });
    const captchaData = await verifyRes.json();
    if (!captchaData.success || captchaData.score < 0.5) {
      return NextResponse.json({ error: "Security check failed" }, { status: 400 });
    }

    // 3️⃣ Generate signed URL for R2
    const signedUrl = await getSignedUrlForUpload(fileName, fileType);

    // 4️⃣ Save Track and link to artist
    const track = await prisma.track.create({
      data: {
        title: trackTitle,
        merkleLeaf: folderHash,
        authorId: artistId, // assuming the artist is also a "User"
        artists: {
          create: {
            artistId,
            role: "MAIN",
          },
        },
      },
      include: { artists: true },
    });

    return NextResponse.json({ signedUrl, trackId: track.id });
  } catch (error: any) {
    console.error("Upload API Error:", error);
    return NextResponse.json({ error: error.message || "Error processing upload request" }, { status: 500 });
  }
}
