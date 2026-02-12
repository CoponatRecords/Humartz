// middleware.ts
import { authMiddleware } from "@repo/auth/proxy";
import { parseError } from "@repo/observability/error";
import { secure } from "@repo/security";
import {
  noseconeOptions,
  noseconeOptionsWithToolbar,
  securityMiddleware,
} from "@repo/security/proxy";
import { createNEMO } from "@rescale/nemo";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/env";

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|ingest|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};

// Security headers (with or without toolbar)
const securityHeaders = env.FLAGS_SECRET
  ? securityMiddleware(noseconeOptionsWithToolbar)
  : securityMiddleware(noseconeOptions);

// Arcjet bot protection
const arcjetMiddleware = async (request: NextRequest) => {
  if (!env.ARCJET_KEY) {
    return NextResponse.next();
  }

  try {
    await secure(
      [
        "CATEGORY:SEARCH_ENGINE",
        "CATEGORY:PREVIEW",
        "CATEGORY:MONITOR",
      ],
      request
    );
    return NextResponse.next();
  } catch (error) {
    const message = parseError(error);
    return NextResponse.json({ error: message }, { status: 403 });
  }
};

// ───────────────────────────────────────────────
// SAFE LOCALE DETECTION (no external libs, no Intl.getCanonicalLocales risk)
// ───────────────────────────────────────────────
const SUPPORTED_LOCALES = ["en", "fr", "es", "de"] as const; // ← CHANGE THIS to your actual supported locales
const DEFAULT_LOCALE = "en";

// Very defensive locale parser
function getSafeLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language");

  // Handle most common crash cases early
  if (!acceptLanguage || acceptLanguage === "*" || acceptLanguage.trim() === "") {
    return DEFAULT_LOCALE;
  }

  // Take the first language tag (before any ',', ';', or quality values)
  const firstTag = acceptLanguage
    .split(",")[0]
    .split(";")[0]
    .trim()
    .toLowerCase();

  if (!firstTag) {
    return DEFAULT_LOCALE;
  }

  // Basic validation + normalization
  // We only check prefix match to support en-US → en, fr-CA → fr, etc.
  for (const locale of SUPPORTED_LOCALES) {
    if (
      firstTag === locale ||
      firstTag.startsWith(`${locale}-`) ||
      firstTag.startsWith(`${locale}_`)
    ) {
      return locale;
    }
  }

  // Fallback if nothing matches
  return DEFAULT_LOCALE;
}

// Safe i18n middleware – sets a custom header (most flexible & safe)
const safeI18nMiddleware = (request: NextRequest) => {
  const locale = getSafeLocale(request);

  const headers = new Headers(request.headers);
  headers.set("x-locale", locale); // you can read this in app/layout or server components

  // Alternative: path rewrite (uncomment if you prefer /en/, /fr/ URLs)
  // const { pathname } = request.nextUrl;
  // if (pathname === "/" || !SUPPORTED_LOCALES.some(l => pathname.startsWith(`/${l}`))) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  //   return NextResponse.rewrite(url);
  // }

  return NextResponse.next({
    request: { headers },
  });
};

// ───────────────────────────────────────────────
// COMPOSE MIDDLEWARE
// ───────────────────────────────────────────────
const composedMiddleware = createNEMO(
  {},
  {
    before: [safeI18nMiddleware, arcjetMiddleware],
  }
);

// ───────────────────────────────────────────────
// FINAL EXPORT (Clerk wrapper)
// ───────────────────────────────────────────────
export default authMiddleware(async (_auth, request: NextRequest) => {
  const { pathname } = request.nextUrl;

  // Bypass for webhooks
  if (pathname.startsWith("/api/webhooks")) {
    return NextResponse.next();
  }

  // Apply security headers
  const headersResponse = securityHeaders();

  // Run i18n + arcjet
  const middlewareResponse = await composedMiddleware(request, {});

  return middlewareResponse || headersResponse;
}) as any; // type assertion — common when mixing Clerk with custom middleware