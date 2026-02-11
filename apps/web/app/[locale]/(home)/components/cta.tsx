"use client";

import { Button } from "@repo/design-system";
import type { Dictionary } from "@repo/internationalization";
import { PhoneCall } from "lucide-react";
import Link from "next/link";
import { BackgroundImage } from "../../components/magic-ui/BackgroundImage";
import { cn } from "@repo/design-system";

type CTAProps = {
  dictionary: Dictionary;
};

export const CTA = ({ dictionary }: CTAProps) => (
  <div className="w-full py-20 lg:py-40">
    <div className="container mx-auto">
      {/* 1. We removed 'bg-muted' from the main class 
          2. We added 'isolation-auto' to create a new stacking context 
      */}
      <div className="relative flex flex-col items-center gap-8 rounded-3xl overflow-hidden p-8 text-center lg:p-14 border border-border/50 shadow-2xl">
        
        {/* THE BASE COLOR: We put the grey color on its own layer at the very back */}
        <div className="absolute inset-0 bg-dark -z-30" />

        {/* THE WALLPAPER: Now sits at -10, on top of the grey but behind text */}
        <BackgroundImage
        />

        <div className="flex flex-col gap-4 relative z-10">
          <h3 className="max-w-xl font-bold text-3xl tracking-tighter md:text-5xl">
            {dictionary.web.home.cta.title}
          </h3>
          <p className="max-w-xl text-lg text-muted-foreground leading-relaxed tracking-tight">
            {dictionary.web.home.cta.description}
          </p>
        </div>

        <div className="flex flex-row gap-4 relative z-10">
          <Button 
            asChild 
            className="gap-4 bg-foreground text-background hover:bg-foreground/90 transition-colors" 
          >
            <Link href="/get-certified">
              {dictionary.web.global.primaryCta}
              <PhoneCall className="h-4 w-4" />
            </Link>
          </Button>

          <Button asChild className="gap-4" variant="outline">
            <Link href="/about">
              About Humartz
            </Link>
          </Button>
        </div>
      </div>
    </div>
  </div>
);