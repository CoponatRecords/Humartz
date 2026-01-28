import { createRequire } from "module";
import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
const require = createRequire(import.meta.url);
const { PrismaClient } = require("@generated/prisma/client");

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

export { prisma }