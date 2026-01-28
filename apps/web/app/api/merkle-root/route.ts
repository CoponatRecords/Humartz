import { prisma } from '@prisma/prisma';

export async function GET() {
  try {
    const rootRecord = await prisma.merkleRoot.findUnique({ where: { id: 1 } });

    if (!rootRecord) {
      return new Response(JSON.stringify({ root: null }), { status: 404 });
    }

    return new Response(JSON.stringify({ root: rootRecord.root }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to fetch Merkle root' }), { status: 500 });
  }
}
