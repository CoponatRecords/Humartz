import { blog } from "@repo/cms";
import { Feed } from "@repo/cms/components/feed";
import { Button } from "@repo/design-system/components/ui/button";
import type { Dictionary } from "@repo/internationalization";
import { MoveRight, PhoneCall } from "lucide-react";
import Link from "next/link";
import { env } from "@/env";
import { SearchProvider, SearchTrigger } from "./search-command";

type HeroProps = {
  dictionary: Dictionary;
};

export const Hero = async ({ dictionary }: HeroProps) => (
  <div className="w-full">
  <div className="container mx-auto px-4 sm:px-6 md:px-8">
    <div className="flex flex-col items-center justify-center gap-8 py-16 sm:py-20 lg:py-40">  {/* Announcement / Feed */}

        {/* Hero Heading */}
        <div className="flex flex-col items-center gap-4">
          <h1 className="max-w-2xl flex flex-wrap items-center justify-center gap-2 text-center font-bold text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter">
            {dictionary.web.home.meta.title}
            <svg
              className="inline-block align-text-bottom h-[1em] w-[1em] fill-current dark:text-white"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Humartz Fingerprint</title>
              <path
                d="M12 2C7.5 2 4 5.5 4 10V16C4 16.55 4.45 17 5 17C5.55 17 6 16.55 6 16V10C6 6.5 8.5 4 12 4C15.5 4 18 6.5 18 10V18C18 18.55 18.45 19 19 19C19.55 19 20 18.55 20 18V10C20 5.5 16.5 2 12 2ZM12 6C9.5 6 7.5 8 7.5 10.5V17C7.5 17.55 7.95 18 8.5 18C9.05 18 9.5 17.55 9.5 17V10.5C9.5 9 10.5 8 12 8C13.5 8 14.5 9 14.5 10.5V16C14.5 16.55 14.95 17 15.5 17C16.05 17 16.5 16.55 16.5 16V10.5C16.5 8 14.5 6 12 6ZM12 10C11.5 10 11 10.5 11 11V16C11 16.55 11.45 17 12 17C12.55 17 13 16.55 13 16V11C13 10.5 12.5 10 12 10Z"
                fill="currentColor"
              />
            </svg>
          </h1>

          {/* Subtitle */}
          <h2 className="max-w-2xl text-center font-medium text-2xl sm:text-3xl md:text-4xl tracking-tight">
            {dictionary.web.home.meta.subtitle}
          </h2>

          {/* Description */}
          <p className="max-w-3xl text-center text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed tracking-tight">
            {dictionary.web.home.meta.description}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mt-4">
          <Button asChild className="gap-2 sm:gap-4 w-full sm:w-auto" size="lg" variant="outline">
            <Link href="/contact">
              Get in touch <PhoneCall className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </Button>
          <Button asChild className="gap-2 sm:gap-4 w-full sm:w-auto" size="lg">
            {/* <Link href={env.NEXT_PUBLIC_APP_URL}>
              Sign up <MoveRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link> */}
          </Button>
        </div>

        {/* Search */}
<div className="sm:gap-4 w-full sm:w-auto">
          <SearchProvider >
            <SearchTrigger placeholder="Search for tracks, artists..." />
          </SearchProvider></div>
      </div>
    </div>
  </div>
);
