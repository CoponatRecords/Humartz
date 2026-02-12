// components/hero/NextJsShowcase.tsx
import Link from "next/link";
import { cn } from "@repo/design-system";
import type { Dictionary } from "@repo/internationalization";
import CardContent from "./CardContentHero";

export const NextJsShowcase = ({ dictionary }: { dictionary: Dictionary }) => {
  const { web: { home, header } } = dictionary;

  const cards = [
    {
      key: "arbiscan",
      title: "Blockchain Explorer",
      description: home?.showcase?.arbiscanDescription || "On-chain verification via Arbitrum One",
      color: "bg-white",
      type: "arbiscan" as const,
      headerBg: "bg-gray-50",
      textColor: "text-gray-500",
      href: "https://arbiscan.io/address/0x9953BcE1F56b4bC1051321B394d2B6055c506619",
    },
    {
      key: "whitepaper",
      title: header?.whitepaper || "How It Works",
      description: home?.showcase?.whitepaperDescription || "Cryptographic protocol documentation",
      color: "bg-[#0A0A0A]",
      type: "whitepaper" as const,
      headerBg: "bg-zinc-900",
      textColor: "text-zinc-400",
      href: "/whitepaper",
    },
    {
      key: "dashboard",
      title: header?.dashboard || "My Dashboard",
      description: home?.showcase?.dashboardDescription || "Manage your catalogue & certifications",
      color: "bg-white",
      type: "dashboard" as const,
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
      {/* Desktop – 3D effect on lg+ */}
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
                "lg:[transform:rotateY(-18deg)_rotateX(6deg)_skewY(2deg)]",
                "lg:hover:[transform:rotateY(0deg)_rotateX(0deg)_skewY(0deg)]",
                card.key === "whitepaper" && "lg:-translate-x-12 lg:-translate-y-11",
                card.key === "arbiscan" && "lg:-translate-x-24 lg:-translate-y-22",
                zIndex === 30 ? "z-30" : zIndex === 20 ? "z-20" : "z-10"
              )}
            >
              <CardContent card={card} dictionary={dictionary} />
            </Link>
          );
        })}
      </div>

      {/* Mobile – horizontal scroll carousel */}
      <div
        className={cn(
          "lg:hidden flex gap-5 overflow-x-auto snap-x snap-mandatory",
          "-mx-4 px-4 pb-8",
          "-webkit-overflow-scrolling-touch",      // smooth momentum on iOS
          "overscroll-x-contain"                    // prevents weird chain/parent scroll
        )}
      >
        {mobileCards.map((card) => {
          const isDashboard = card.type === "dashboard";

          return (
            <div
              key={card.key}
              className={cn(
                "min-w-[85vw] max-w-[90vw] sm:min-w-[380px] sm:max-w-[420px]",
                "snap-center shrink-0",               // snap + no shrink
                isDashboard && "shadow-2xl"
              )}
            >
              <Link
                href={card.href}
                target={card.href.startsWith("http") ? "_blank" : undefined}
                className="block h-full w-full transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <CardContent card={card} dictionary={dictionary} />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};