import { NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Enforce 5GB limit: 5 * 1024 * 1024 * 1024 bytes
const MAX_FILE_SIZE = 5368709120;

const r2 = new S3Client({
  region: 'auto', // Cloudflare R2 usually uses 'auto'
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
})

export async function POST(request: Request) {
  try {
    const { filename, contentType, fileSize, captchaToken } = await request.json()

    // 1. Validate File Size
    if (!fileSize || fileSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds the 5GB limit or is missing.' },
        { status: 400 }
      )
    }

    // 2. Verify reCAPTCHA v3 with Google
    const verifyRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY || '',
        response: captchaToken,
      }).toString(),
    });

    const captchaData = await verifyRes.json();

    // 3. Handle bot detection (Score < 0.5 is usually a bot)
    if (!captchaData.success || captchaData.score < 0.5) {
      return NextResponse.json(
        { error: 'Security verification failed. Please try again.' },
        { status: 403 }
      );
    }

    // 4. Generate the Signed URL
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: filename,
      ContentType: contentType,
      // Optional: Add metadata to track the size in R2
      Metadata: {
        "original-size": fileSize.toString()
      }
    })

    const signedUrl = await getSignedUrl(r2, command, { expiresIn: 60 })

    return NextResponse.json({ url: signedUrl })
  } catch (err) {
    console.error("R2 Signed URL Error:", err)
    return NextResponse.json({ error: 'Failed to generate signed URL' }, { status: 500 })
  }
}