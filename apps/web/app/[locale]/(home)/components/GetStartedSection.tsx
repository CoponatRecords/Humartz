// components/hero/GetStartedSection.tsx
import { Button } from "@repo/design-system";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import {NextJsShowcase} from "./NextJsShowcase";
import type { Dictionary } from "@repo/internationalization";
import { cn } from "@repo/design-system";

export default function GetStartedSection({ dictionary }: { dictionary: Dictionary }) {
  const { web } = dictionary;
  const { home, global } = web;

  return (
    <div className="w-full mt-16 lg:mt-24 pt-16 lg:pt-24">
      <div className="mb-10 text-center lg:text-left">
        <h2 className="font-regular text-3xl tracking-tight md:text-5xl">
          {home?.getStartedTitle || "Get started in seconds"}
          <p className="text-gray-500 font-normal mt-2">
            {home?.getStartedSubtitle || "Secured on the blockchain"}
          </p>
        </h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="flex flex-col gap-8 order-2 lg:order-1">
          <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
            {home?.getStartedTags?.map((tag: string, i: number) => (
              <span
                key={i}
                className={cn(
                  "px-3 py-1 rounded-full border text-[11px] font-medium",
                  i === 0 && "border-blue-500/30 bg-blue-500/10 text-blue-500",
                  i === 1 && "border-purple-500/30 bg-purple-500/10 text-purple-500",
                  i === 2 && "border-green-500/30 bg-green-500/10 text-green-500",
                  i === 3 && "border-yellow-500/30 bg-yellow-500/10 text-yellow-500",
                  i === 4 && "border-orange-500/30 bg-orange-500/10 text-orange-500"
                )}
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="space-y-6 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
            <p className="text-lg text-gray-400 leading-relaxed">{home?.getStartedP1}</p>
            <p className="text-lg text-gray-400 leading-relaxed">{home?.getStartedP2}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button
              asChild
              size="lg"
              className="bg-white text-black hover:bg-gray-200 font-bold px-8"
            >
              <Link href="/get-certified">
                {global?.primaryCtaNow} <MoveRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <NextJsShowcase dictionary={dictionary} />
        </div>
      </div>
    </div>
  );
}