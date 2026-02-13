import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import type { NextRequest } from "next/server";
import { createI18nMiddleware } from "next-international/middleware";
import languine from "./languine.json" with { type: "json" };

const locales = [languine.locale.source, ...languine.locale.targets];

const I18nMiddleware = createI18nMiddleware({
  locales,
  defaultLocale: "en",
  urlMappingStrategy: "rewriteDefault",
  resolveLocaleFromRequest: (request: NextRequest) => {
    try {
      const headers = Object.fromEntries(request.headers.entries());
      const negotiator = new Negotiator({ headers });
      const acceptedLanguages = negotiator.languages();

      // Validate and sanitize accepted languages
      const validLanguages = acceptedLanguages.filter((lang) => {
        try {
          // Test if the language tag is valid
          Intl.getCanonicalLocales(lang);
          return true;
        } catch {
          return false;
        }
      });

      // If no valid languages, fall back to default
      if (validLanguages.length === 0) {
        return "en";
      }

      const matchedLocale = matchLocale(validLanguages, locales, "en");
      return matchedLocale;
    } catch (error) {
      // If anything fails, fall back to default locale
      console.error("Locale resolution failed:", error);
      return "en";
    }
  },
});

export const internationalizationMiddleware = (request: NextRequest) =>
  I18nMiddleware(request);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

//https://nextjs.org/docs/app/building-your-application/routing/internationalization
//https://github.com/vercel/next.js/tree/canary/examples/i18n-routing
//https://github.com/QuiiBz/next-international
//https://next-international.vercel.app/docs/app-middleware-configuration