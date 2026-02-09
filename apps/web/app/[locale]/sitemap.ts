import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

const locales = ['en'];
const baseUrl = "https://humartz.com";

/**
 * Automatically scans the app/[locale] directory for pages
 */
function getPages() {
  // Path to your localized app directory
  const appDirectory = path.join(process.cwd(), "app/[locale]");
  
  // Check if directory exists to avoid build errors
  if (!fs.existsSync(appDirectory)) return [""];

  const entries = fs.readdirSync(appDirectory, { withFileTypes: true });

  const routes = entries
    .filter((entry) => entry.isDirectory())
    .filter((entry) => {
      // Exclude Next.js route groups (e.g., (home)) and dynamic routes (e.g., [id])
      return !entry.name.startsWith("(") && !entry.name.startsWith("[");
    })
    .map((entry) => entry.name);

  // Return with the root path included
  return ["", ...routes];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = getPages();

  return locales.flatMap((locale) =>
    pages.map((page) => ({
      url: `${baseUrl}/${locale}${page ? `/${page}` : ""}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: page === "" ? 1 : 0.8,
    }))
  );
}