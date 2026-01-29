"use client";

/**
 * Hashes an array of files (e.g., a folder) using SHA-256.
 * @param files Array of File objects
 * @returns hex string of the folder hash
 */
export async function hashFolder(files: File[]): Promise<string> {
  // Sort files by their relative path to ensure deterministic hash
  const sortedFiles = [...files].sort((a, b) => {
    const pathA = a.webkitRelativePath || a.name;
    const pathB = b.webkitRelativePath || b.name;
    return pathA.localeCompare(pathB);
  });

  // Concatenate all file contents
  const buffer = await concatenateFiles(sortedFiles);

  // Hash using Web Crypto API
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);

  // Convert ArrayBuffer to hex string
  return bufferToHex(hashBuffer);
}

// Helper: concatenate multiple files into a single ArrayBuffer
async function concatenateFiles(files: File[]): Promise<ArrayBuffer> {
  const buffers: ArrayBuffer[] = [];
  for (const file of files) {
    buffers.push(await file.arrayBuffer());
  }

  const totalLength = buffers.reduce((sum, buf) => sum + buf.byteLength, 0);
  const tmp = new Uint8Array(totalLength);
  let offset = 0;
  for (const buf of buffers) {
    tmp.set(new Uint8Array(buf), offset);
    offset += buf.byteLength;
  }

  return tmp.buffer;
}

// Helper: convert ArrayBuffer to hex string
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
