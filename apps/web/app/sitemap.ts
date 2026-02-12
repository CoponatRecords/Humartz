import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

const locales = ['en'];
const baseUrl = "https://humartz.com";

// This forces Next.js to run the sitemap generation ONLY at build time
// → static output → no runtime fs calls → no 5xx errors for Googlebot
export const dynamic = 'force-static';

function getPages(): string[] {
  // Adjust path if your [locale] folder is in a different location
  // In monorepo: process.cwd() usually points to the NEXT.js app root (apps/web)
  const appDirectory = path.join(process.cwd(), "app/[locale]");

  if (!fs.existsSync(appDirectory)) {
    console.warn("app/[locale] directory not found – returning only homepage");
    return [""];
  }

  const entries = fs.readdirSync(appDirectory, { withFileTypes: true });

  const routes = entries
    .filter((entry) => entry.isDirectory())
    .filter((entry) => {
      const name = entry.name;
      // Exclude:
      // - Next.js route groups: (folder)
      // - Dynamic segments: [folder]
      // - Internal/private routes that should not be indexed
      return (
        !name.startsWith("(") &&
        !name.startsWith("[") &&
        !["admin", "api", "components", "dashboard", "payment", "signup", "success"].includes(name)
      );
    })
    .map((entry) => entry.name);

  // Include root homepage ("") + discovered public pages
  return ["", ...routes];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = getPages();

  return locales.flatMap((locale) =>
    pages.map((page) => ({
      url: `${baseUrl}/${locale}${page ? `/${page}` : ""}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: page === "" ? 1 : 0.8,
    }))
  );
}