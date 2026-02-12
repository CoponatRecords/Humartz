// components/hero/HeroContent.tsx
"use client";

import { Button } from "@repo/design-system";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import { WordRotate } from "./word-rotate"; // assuming this is already client-side
import type { Dictionary } from "@repo/internationalization";

export default function HeroContent({ dictionary }: { dictionary: Dictionary }) {
  const { web } = dictionary;
  const { home, global } = web;

  return (
    <div className="flex flex-col items-center justify-center gap-8 pt-20 lg:pt-32 pb-16 lg:pb-24">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="max-w-4xl font-bold text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter leading-[0.9]">
          {home?.meta?.title}
          <span className="inline-block ml-2 align-middle">
            <svg
              className="h-[0.7em] w-[0.7em] fill-current text-primary"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C7.5 2 4 5.5 4 10V16C4 16.55 4.45 17 5 17C5.55 17 6 16.55 6 16V10C6 6.5 8.5 4 12 4C15.5 4 18 6.5 18 10V18C18 18.55 18.45 19 19 19C19.55 19 20 18.55 20 18V10C20 5.5 16.5 2 12 2ZM12 6C9.5 6 7.5 8 7.5 10.5V17C7.5 17.55 7.95 18 8.5 18C9.05 18 9.5 17.55 9.5 17V10.5C9.5 9 10.5 8 12 8C13.5 8 14.5 9 14.5 10.5V16C14.5 16.55 14.95 17 15.5 17C16.05 17 16.5 16.55 16.5 16V10.5C16.5 8 14.5 6 12 6ZM12 10C11.5 10 11 10.5 11 11V16C11 16.55 11.45 17 12 17C12.55 17 13 16.55 13 16V11C13 10.5 12.5 10 12 10Z" />
            </svg>
          </span>
        </h1>

        <h2 className="max-w-4xl font-medium text-xl sm:text-3xl md:text-4xl tracking-tight flex flex-wrap justify-center gap-3">
          <span>{home?.meta?.subtitle}</span>
          <span className="text-primary italic">
            <WordRotate words={home?.getStartedTags} />
          </span>
        </h2>

        <p className="max-w-2xl text-gray-200 text-lg md:text-xl">
          {home?.meta?.description}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          asChild
          size="lg"
          className="bg-white text-black hover:bg-gray-200 font-bold px-8"
        >
          <Link href="/get-certified">
            {global?.primaryCta} <MoveRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10 px-8"
        >
          <Link href="/about">{global?.aboutUs}</Link>
        </Button>
      </div>
    </div>
  );
}