"use client";

import { Button } from "@repo/design-system";
import type { Dictionary } from "@repo/internationalization";
import { 
  ArrowUpRight, 
  Clock, 
  Database, 
  Fingerprint, 
  MoveRight, 
  Music2Icon, 
  ShieldCheck, 
  FileText, 
} from "lucide-react";
import Link from "next/link";
import { GridPattern } from "../../components/magic-ui/grid-pattern";
import { cn } from "@repo/design-system";
import { WordRotate } from "./word-rotate";

// ── Stacked Cards Showcase ──
export const NextJsShowcase = ({ dictionary }: { dictionary: Dictionary }) => {
  const { web: { home, header } } = dictionary;

  const cards = [
    {
      key: "arbiscan",
      title: "Arbiscan",
      description: home?.showcase?.arbiscanDescription || "On-chain verification",
      color: "bg-white",
      // Reduced offsets for mobile to prevent overflow
      offset: "-translate-x-12 sm:-translate-x-[100px] -translate-y-4 sm:-translate-y-[30px] z-10 opacity-40 scale-90",
      type: "arbiscan",
      headerBg: "bg-gray-50",
      textColor: "text-gray-500",
      href: "https://arbiscan.io/address/0x9953BcE1F56b4bC1051321B394d2B6055c506619",
    },
    {
      key: "whitepaper",
      title: header?.whitepaper || "Whitepaper",
      description: home?.showcase?.whitepaperDescription || "Cryptographic protocol",
      color: "bg-[#0A0A0A]",
      offset: "-translate-x-6 sm:-translate-x-[50px] -translate-y-2 sm:-translate-y-[15px] z-20 opacity-70 scale-95",
      type: "whitepaper",
      headerBg: "bg-zinc-900",
      textColor: "text-zinc-400",
      href: "/whitepaper",
    },
    {
      key: "dashboard",
      title: header?.dashboard || "My Dashboard",
      description: home?.showcase?.dashboardDescription || "Manage your catalogue",
      color: "bg-white",
      offset: "translate-x-0 translate-y-0 z-30 opacity-100 scale-100",
      isMain: true,
      type: "dashboard",
      headerBg: "bg-gray-50",
      textColor: "text-gray-500",
      href: "/dashboard",
    },
  ];

  return (
    // Reduced height on mobile to keep content tight
    <div className="relative flex items-center justify-center w-full h-[380px] sm:h-[450px] lg:h-[550px] [perspective:1000px] sm:[perspective:1200px] overflow-visible">
      {cards.map((card) => (
        <Link
          key={card.key}
          href={card.href}
          target={card.href.startsWith('http') ? "_blank" : undefined}
          className={cn(
            "absolute w-[280px] sm:w-[380px] md:w-[420px] transition-all duration-500 ease-in-out cursor-pointer group",
            "[transform:rotateY(-15deg)_rotateX(5deg)] sm:[transform:rotateY(-20deg)_rotateX(5deg)_skewY(1deg)]",
            "hover:[transform:rotateY(0deg)_rotateX(0deg)_translateY(-15px)]",
            "active:scale-95 sm:active:scale-100",
            "hover:z-50 hover:opacity-100",
            card.offset
          )}
        >
          <div className={cn(
            "overflow-hidden rounded-xl border shadow-xl sm:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-300 group-hover:shadow-primary/20 group-hover:border-primary/50",
            card.type === "whitepaper" ? "border-white/10" : "border-gray-200"
          )}>
            {/* Header */}
            <div className={cn(
              "px-3 py-2 sm:px-4 sm:py-2.5 border-b flex items-center justify-between",
              card.headerBg,
              card.type === "whitepaper" ? "border-white/5" : "border-gray-100"
            )}>
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  <div className="h-1 w-1 rounded-full bg-red-400/50" />
                  <div className="h-1 w-1 rounded-full bg-orange-400/50" />
                  <div className="h-1 w-1 rounded-full bg-green-400/50" />
                </div>
                <span className={cn("text-[8px] sm:text-[9px] font-bold uppercase tracking-widest ml-1", card.textColor)}>
                  {card.title}
                </span>
              </div>
              <ArrowUpRight className="h-3 w-3 text-gray-300 group-hover:text-primary transition-colors" />
            </div>

            {/* Body */}
            <div className={cn("min-h-[180px] sm:min-h-[220px] w-full p-4 sm:p-5", card.color)}>
              {card.type === "dashboard" && (
                <div className="flex flex-col gap-2.5 text-black">
                  {[
                    { t: "Main Symphony", s: "certified" },
                    { t: "Organic Stem", s: "pending" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 rounded-lg border border-gray-100 bg-gray-50/50 p-2 sm:p-2.5">
                      <Music2Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
                      <div className="flex-1">
                        <p className="text-[9px] sm:text-[10px] font-bold leading-none">{item.t}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={cn(
                            "text-[7px] sm:text-[8px] font-bold uppercase flex items-center gap-1",
                            item.s === "certified" ? "text-green-600" : "text-orange-600"
                          )}>
                            {item.s === "certified" ? <ShieldCheck className="h-2 w-2 sm:h-2.5 sm:w-2.5" /> : <Clock className="h-2 w-2 sm:h-2.5 sm:w-2.5" />}
                            {item.s}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="mt-1 py-2 rounded-lg bg-black text-white text-[8px] sm:text-[9px] font-bold flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-black transition-all">
                    {home?.showcase?.openDashboard || "Open Dashboard"} <ArrowUpRight className="h-3 w-3" />
                  </div>
                </div>
              )}

              {card.type === "arbiscan" && (
                <div className="text-black space-y-3 sm:space-y-4">
                  <div className="bg-blue-50 p-2 rounded border border-blue-100 text-[8px] sm:text-[9px] text-blue-700 font-mono truncate">
                    0x9953...6619
                  </div>
                  <div className="space-y-1.5">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex justify-between items-center text-[8px] border-b border-gray-50 pb-1">
                        <span className="text-blue-500 font-mono underline opacity-70">0x{i}df...4a</span>
                        <span className="text-gray-500">{i * 2}m ago</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {card.type === "whitepaper" && (
                <div className="text-white space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-[9px] font-bold tracking-tight text-primary uppercase">Protocol Spec</span>
                  </div>
                  <p className="text-[7px] leading-relaxed text-zinc-400 font-mono italic line-clamp-3">
                    {home?.showcase?.whitepaperTeaser}
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="p-1.5 border border-white/5 rounded bg-white/[0.03] flex items-center gap-1.5">
                      <Database className="h-2.5 w-2.5 text-orange-400" />
                      <span className="text-[6px] font-bold uppercase text-zinc-300">Arweave</span>
                    </div>
                    <div className="p-1.5 border border-white/5 rounded bg-white/[0.03] flex items-center gap-1.5">
                      <Fingerprint className="h-2.5 w-2.5 text-primary" />
                      <span className="text-[6px] font-bold uppercase text-zinc-300">Auth</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

// ── Get Started Section ──
const GetStartedSection = ({ dictionary }: { dictionary: Dictionary }) => {
  const { web: { home, global } } = dictionary;

  return (
    <div className="w-full mt-16 sm:mt-20 lg:mt-32 border-t border-white/5 pt-16 sm:pt-20">
      <div className="mb-10 text-center lg:text-left">
        <h2 className="font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight">
          {home?.getStartedTitle}
          <span className="block text-gray-500 font-normal text-xl sm:text-2xl mt-1">
            {home?.getStartedSubtitle}
          </span>
        </h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Mobile order: Showcase first, then text */}
        <div className="order-1 lg:order-2">
          <NextJsShowcase dictionary={dictionary} />
        </div>

        <div className="flex flex-col gap-6 sm:gap-8 order-2 lg:order-1 items-center lg:items-start text-center lg:text-left">
          <div className="flex flex-wrap justify-center lg:justify-start gap-2">
            {home?.getStartedTags?.map((tag: string, i: number) => (
              <span key={i} className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] sm:text-[11px] font-medium text-gray-400">
                {tag}
              </span>
            ))}
          </div>

          <div className="space-y-4 sm:space-y-6 max-w-md">
            <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
              {home?.getStartedP1}
            </p>
          </div>

          <Button asChild size="lg" className="w-full sm:w-auto bg-white text-black hover:bg-gray-200 font-bold px-8">
            <Link href="/get-certified">
              {global?.primaryCtaNow} <MoveRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

// ── Main Hero ──
export const Hero = ({ dictionary }: { dictionary: Dictionary }) => {
  const { web: { home, global } } = dictionary;

  return (
    <div className="w-full relative overflow-hidden text-white min-h-[90vh] flex flex-col justify-center">
      <GridPattern
        width={40}
        height={40}
        x={-1}
        y={-1}
        strokeDasharray={"4 2"}
        className={cn("[mask-image:radial-gradient(ellipse_at_center,white,transparent_50%)] z-0 opacity-10 sm:opacity-20")}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-12 sm:pt-20">
        <div className="flex flex-col items-center justify-center gap-6 sm:gap-8 lg:pt-10">
          <div className="flex flex-col items-center gap-4 text-center">
            {/* Optimized Heading for Mobile */}
            <h1 className="max-w-4xl font-bold text-4xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter leading-[1] sm:leading-[0.9]">
              {home?.meta?.title}
              <span className="inline-block ml-1 sm:ml-2 align-middle">
                <svg className="h-[0.7em] w-[0.7em] fill-current text-primary" viewBox="0 0 24 24">
                  <path d="M12 2C7.5 2 4 5.5 4 10V16C4 16.55 4.45 17 5 17C5.55 17 6 16.55 6 16V10C6 6.5 8.5 4 12 4C15.5 4 18 6.5 18 10V18C18 18.55 18.45 19 19 19C19.55 19 20 18.55 20 18V10C20 5.5 16.5 2 12 2ZM12 6C9.5 6 7.5 8 7.5 10.5V17C7.5 17.55 7.95 18 8.5 18C9.05 18 9.5 17.55 9.5 17V10.5C9.5 9 10.5 8 12 8C13.5 8 14.5 9 14.5 10.5V16C14.5 16.55 14.95 17 15.5 17C16.05 17 16.5 16.55 16.5 16V10.5C16.5 8 14.5 6 12 6ZM12 10C11.5 10 11 10.5 11 11V16C11 16.55 11.45 17 12 17C12.55 17 13 16.55 13 16V11C13 10.5 12.5 10 12 10Z" />
                </svg>
              </span>
            </h1>

            <h2 className="max-w-4xl font-medium text-lg sm:text-3xl md:text-4xl tracking-tight flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3">
              <span>{home?.meta?.subtitle}</span>
              <span className="text-primary italic"><WordRotate /></span>
            </h2>

            <p className="max-w-xl text-gray-400 text-base sm:text-xl px-4">
              {home?.meta?.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto px-6 sm:px-0">
            <Button asChild size="lg" className="bg-white text-black hover:bg-gray-200 font-bold h-12 sm:h-auto">
              <Link href="/get-certified" className="flex items-center justify-center">
                {global?.primaryCta} <MoveRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 h-12 sm:h-auto">
              <Link href="/about" className="flex items-center justify-center">{global?.aboutUs}</Link>
            </Button>
          </div>
        </div>

        <GetStartedSection dictionary={dictionary} />
      </div>
    </div>
  );
};