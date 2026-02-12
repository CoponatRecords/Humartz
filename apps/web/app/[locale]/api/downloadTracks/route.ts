import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "@repo/database";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const R2_BUCKET = process.env.R2_BUCKET!;

// Use consistent naming (S3)
const S3 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY
  }
});

export async function GET(request: NextRequest) {
  const trackId = request.nextUrl.searchParams.get("trackId");

  if (!trackId) {
    return NextResponse.json({ error: "trackId required" }, { status: 400 });
  }

  try {
    const track = await prisma.track.findUnique({
      // Ensure your Prisma ID type matches (Number vs String)
      // If your ID is an Int, use Number(trackId)
where: { id: Number(trackId) }, // This becomes 20      
select: { storagePath: true, title: true, artistName: true },
    });

    if (!track?.storagePath) {
      return NextResponse.json({ error: "Track not found" }, { status: 404 });
    }

    const prefix = track.storagePath.endsWith("/")
      ? track.storagePath
      : `${track.storagePath}/`;

    // 1. Corrected 's3' to 'S3'
    const list = await S3.send(
      new ListObjectsV2Command({
        Bucket: R2_BUCKET,
        Prefix: prefix,
      })
    );

    if (!list.Contents?.length) {
      return NextResponse.json({ error: "No files found in R2" }, { status: 404 });
    }

    const zip = new JSZip();

    for (const obj of list.Contents) {
      if (!obj.Key || obj.Key.endsWith("/")) continue;

      const get = await S3.send(
        new GetObjectCommand({
          Bucket: R2_BUCKET,
          Key: obj.Key,
        })
      );

      if (!get.Body) continue;

      // 2. More robust way to convert stream to Buffer
      const streamToBuffer = async (stream: any): Promise<Buffer> => {
        const chunks = [];
        for await (const chunk of stream) {
          chunks.push(Buffer.from(chunk));
        }
        return Buffer.concat(chunks);
      };

      const buffer = await streamToBuffer(get.Body);
      const relative = obj.Key.slice(prefix.length);
      zip.file(relative || "unnamed", buffer);
    }

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    const safeName = (track.title || track.artistName || "track")
      .replace(/[^a-z0-9]/gi, "_")
      .slice(0, 40);

    return new NextResponse(new Uint8Array(zipBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${safeName}.zip"`,
        "Content-Length": zipBuffer.length.toString(),
      },
    });

  } catch (err: any) {
    console.error("Download error:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message }, 
      { status: 500 }
    );
  }
}