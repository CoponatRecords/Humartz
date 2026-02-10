// Hero.tsx
// Note: This file can now be a **Server Component** (no "use client" at top)
"use client"

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
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { GridPattern } from "../../components/magic-ui/grid-pattern";
import { cn } from "@repo/design-system";
import { WordRotate } from "./word-rotate"; 
import { memo, useEffect, useRef } from "react";

// ── Card Content ────────────────────────────────────────────────
const CardContent = memo(({
  card,
  dictionary,
  isMobile = false,
}: {
  card: any;
  dictionary: Dictionary;
  isMobile?: boolean;
}) => {
  const { home } = dictionary.web;

  const demoTracks = [
    {
      title: "Main Symphony",
      status: "certified",
      txHash: "0x7a8f9b...3e2d1f",
    },
    {
      title: "Organic Stem",
      status: "pending",
      txHash: null,
    },
  ];

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border shadow-xl transition-all duration-400",
        "group-hover:shadow-primary/25 group-hover:border-primary/40",
        "group-active:scale-[0.995]",
        card.type === "whitepaper"
          ? "bg-gradient-to-b from-black to-zinc-950 border-white/8"
          : "bg-gradient-to-b from-white to-gray-50/80 border-gray-200/70"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "px-4 sm:px-5 py-3.5 border-b flex items-center justify-between",
          card.headerBg,
          card.type === "whitepaper" ? "border-white/9" : "border-gray-200/60"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/60 ring-1 ring-red-400/30" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60 ring-1 ring-yellow-400/30" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/60 ring-1 ring-green-400/30" />
          </div>
          <span
            className={cn(
              "text-xs sm:text-sm font-extrabold uppercase tracking-wider",
              card.type === "whitepaper" ? "text-zinc-300" : card.textColor
            )}
          >
            {card.title}
          </span>
        </div>

        <ArrowUpRight
          className={cn(
            "h-4 w-4 transition-colors",
            card.type === "whitepaper"
              ? "text-zinc-400 group-hover:text-primary"
              : "text-gray-500 group-hover:text-primary"
          )}
        />
      </div>

      {/* Body */}
      <div className={cn("p-5 sm:p-6", card.color)}>
        {card.type === "dashboard" && (
          <div className="space-y-4">
            {demoTracks.map((item, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-4 rounded-xl border p-4 transition-colors",
                  "hover:bg-primary/5 border-gray-200/60",
                  item.status === "certified" && "border-green-500/30 bg-green-50/40"
                )}
              >
                <div className="relative">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Music2Icon className="h-5 w-5 text-primary" />
                  </div>
                  {item.status === "certified" && (
                    <div className="absolute -bottom-1 -right-1 bg-green-600 text-white rounded-full p-1 shadow-md">
                      <ShieldCheck className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-black truncate leading-tight">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span
                      className={cn(
                        "text-xs font-bold uppercase flex items-center gap-1.5 px-2.5 py-1 rounded-full",
                        item.status === "certified"
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-orange-100 text-orange-800 border border-orange-200"
                      )}
                    >
                      {item.status === "certified" ? (
                        <ShieldCheck className="h-3.5 w-3.5" />
                      ) : (
                        <Clock className="h-3.5 w-3.5" />
                      )}
                      {item.status === "certified" ? "CERTIFIED" : "PENDING"}
                    </span>

                    {item.txHash && (
                      <div className="text-xs text-blue-600 flex items-center gap-1 font-medium">
                        {item.txHash}
                        <ExternalLink className="h-3 w-3 text-blue-600" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full mt-3 text-primary bg-black"
            >
              <div >
                {home?.showcase?.newCertification || "Certify New Track"}{" "}
                <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
              </div>
            </Button>
          </div>
        )}

        {card.type === "arbiscan" && (
          <div className="space-y-5 text-sm">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50/60 p-3.5 rounded-xl border border-blue-200/70 font-mono text-xs text-black">
              <span className="font-medium">Contract • </span>
              0x9953BcE1F56b4bC1051321B394d2B6055c506619
            </div>

            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex justify-between items-center text-xs py-2 border-b border-gray-100 last:border-0"
                >
                  <span className="text-blue-600 font-mono">0x{i}df...4a</span>
                  <span className="text-gray-600 font-medium">Mint / Transfer</span>
                  <span className="text-gray-500">{i * 2} min ago</span>
                </div>
              ))}
            </div>

            <div className="text-xs text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1.5">
              View full contract on Arbiscan
              <ExternalLink className="h-3 w-3" />
            </div>
          </div>
        )}

        {card.type === "whitepaper" && (
          <div className="text-white space-y-5 text-sm">
            <div className="flex items-start gap-4 pb-4 border-b border-white/12">
              <div className="bg-primary/20 p-2.5 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="font-extrabold tracking-tight text-primary text-base">
                  HUMARTZ PROTOCOL
                </div>
                <div className="text-xs text-zinc-500 font-mono mt-0.5">
                  v1.0 • Keccak256 • Arbitrum Anchor
                </div>
              </div>
            </div>

            <p className="text-zinc-300 leading-relaxed text-xs italic opacity-90">
              {home?.showcase?.whitepaperTeaser ||
                "Decentralized cryptographic certification of human authorship — anchoring creative provenance on-chain without exposing original content."}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm">
                <Database className="h-5 w-5 text-orange-400 mb-2" />
                <div className="text-xs font-bold text-zinc-200">STORAGE</div>
                <div className="text-[11px] text-zinc-500 font-mono mt-0.5">Encrypted Database</div>
              </div>
              <div className="p-3.5 border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm">
                <Fingerprint className="h-5 w-5 text-primary mb-2" />
                <div className="text-xs font-bold text-zinc-200">HUMANITY PROOF</div>
                <div className="text-[11px] text-zinc-500 font-mono mt-0.5">Hash Commitment</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className={cn(
          "px-5 py-3.5 border-t text-xs italic flex items-center justify-between",
          card.type === "whitepaper"
            ? "bg-black/40 border-white/8 text-zinc-500"
            : "bg-gray-100/60 border-gray-200/60 text-gray-600"
        )}
      >
        <span>{card.description}</span>
        {card.type === "dashboard" && (
          <span className="text-[10px] text-primary/80 font-medium">
            Powered by Arbitrum
          </span>
        )}
      </div>
    </div>
  );
});

// ── Stacked Cards Showcase ──────────────────────────────────────
export const NextJsShowcase = ({ dictionary }: { dictionary: Dictionary }) => {
  const {
    web: { home, header },
  } = dictionary;

  const dashboardRef = useRef<HTMLDivElement | null>(null);

  const cards = [
    {
      key: "arbiscan",
      title: "Arbiscan",
      description: home?.showcase?.arbiscanDescription || "On-chain verification via Arbitrum One",
      color: "bg-white",
      type: "arbiscan",
      headerBg: "bg-gray-50",
      textColor: "text-gray-500",
      href: "https://arbiscan.io/address/0x9953BcE1F56b4bC1051321B394d2B6055c506619",
    },
    {
      key: "whitepaper",
      title: header?.whitepaper || "Whitepaper",
      description: home?.showcase?.whitepaperDescription || "Cryptographic protocol documentation",
      color: "bg-[#0A0A0A]",
      type: "whitepaper",
      headerBg: "bg-zinc-900",
      textColor: "text-zinc-400",
      href: "/whitepaper",
    },
    {
      key: "dashboard",
      title: header?.dashboard || "My Dashboard",
      description: home?.showcase?.dashboardDescription || "Manage your catalogue & certifications",
      color: "bg-white",
      type: "dashboard",
      isMain: true,
      headerBg: "bg-gray-50",
      textColor: "text-gray-500",
      href: "/dashboard",
    },
  ];

  const mobileCards = [
    cards.find((c) => c.type === "dashboard")!,
    cards.find((c) => c.type === "arbiscan")!,
    cards.find((c) => c.type === "whitepaper")!,
  ];

  return (
    <div className="w-full">
      {/* Desktop – 3D only on lg+ */}
      <div className="hidden lg:flex relative items-center justify-center w-full h-[580px] [perspective:1400px]">
        {cards.map((card) => {
          const zIndex = card.isMain ? 30 : card.key === "whitepaper" ? 20 : 10;

          return (
            <Link
              key={card.key}
              href={card.href}
              target={card.href.startsWith("http") ? "_blank" : undefined}
              className={cn(
                "absolute w-95 xl:w-110 transition-all duration-700 ease-out cursor-pointer group",
                "hover:scale-[1.04] hover:-translate-y-8 hover:z-60 hover:shadow-2xl",

                // 3D transforms → only on lg+
                "lg:[transform:rotateY(-18deg)_rotateX(6deg)_skewY(2deg)]",
                "lg:hover:[transform:rotateY(0deg)_rotateX(0deg)_skewY(0deg)]",

                // Initial position offsets → only on lg+
                card.key === "whitepaper" && "lg:-translate-x-12 lg:-translate-y-6",
                card.key === "arbiscan" && "lg:-translate-x-24 lg:-translate-y-12",

                zIndex === 30 ? "z-30" : zIndex === 20 ? "z-20" : "z-10"
              )}
            >
              <CardContent card={card} dictionary={dictionary} />
            </Link>
          );
        })}
      </div>

      {/* Mobile / Tablet – simple horizontal scroll */}
      <div className="lg:hidden flex gap-5 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-8">
        {mobileCards.map((card) => {
          const isDashboard = card.type === "dashboard";

          return (
            <div
              key={card.key}
              ref={isDashboard ? dashboardRef : null}
              className={cn(
                "min-w-[85vw] max-w-[90vw] sm:min-w-[380px] sm:max-w-[420px]",
                "snap-center",
                isDashboard && "shadow-2xl"
              )}
            >
              <Link
                href={card.href}
                target={card.href.startsWith("http") ? "_blank" : undefined}
                className="block transition-transform active:scale-[0.98]"
              >
                <CardContent card={card} dictionary={dictionary} isMobile />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Get Started Section ─────────────────────────────────────────
const GetStartedSection = ({ dictionary }: { dictionary: Dictionary }) => {
  const { web: { home, global } } = dictionary;

  return (
    <div className="w-full mt-16 lg:mt-24 border-t border-white/5 pt-16 lg:pt-24">
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
};

// ── Main Hero ───────────────────────────────────────────────────
export const Hero = ({ dictionary }: { dictionary: Dictionary }) => {
  const { web: { home, global } } = dictionary;

  return (
    <div className="w-full relative overflow-hidden text-white">
      <GridPattern
        width={40}
        height={40}
        x={-1}
        y={-1}
        strokeDasharray={"4 2"}
        className={cn(
          "absolute inset-0 mask-[radial-gradient(ellipse_at_center,white,transparent_50%)] z-0 opacity-20 pointer-events-none"
        )}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
                <WordRotate />
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

        <GetStartedSection dictionary={dictionary} />
      </div>
    </div>
  );
};