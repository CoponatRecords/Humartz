// components/hero/CardContent.tsx
import { Button } from "@repo/design-system";
import { ArrowUpRight, Clock, Database, ExternalLink, FileText, Fingerprint, Music2Icon, ShieldCheck } from "lucide-react";
import { cn } from "@repo/design-system";
import type { Dictionary } from "@repo/internationalization";

type CardType = "dashboard" | "arbiscan" | "whitepaper";

type Card = {
  key: string;
  title: string;
  description: string;
  color: string;
  type: CardType;
  headerBg: string;
  textColor: string;
  href: string;
  isMain?: boolean;
};

interface CardContentProps {
  card: Card;
  dictionary: Dictionary;
  isMobile?: boolean;
}

export default function CardContent({ card, dictionary, isMobile = false }: CardContentProps) {
  const { home } = dictionary.web;

  const demoTracks = [
    {
      title: "Main Symphony",
      status: "certified" as const,
      txHash: "0x7a8f9b...3e2d1f",
    },
    {
      title: "Mona Lisa",
      status: "pending" as const,
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
              <div>
                {home?.showcase?.newCertification || "Certify New Track"}{" "}
                <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
              </div>
            </Button>
          </div>
        )}

        {card.type === "arbiscan" && (
          <div className="space-y-5 text-sm">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50/60 p-3.5 rounded-xl border border-blue-200/70 font-mono text-xs text-black">
              <span className="font-medium">The Humartz Contract </span>
              0x9953BcE1F56b4bC1051321B394d2B6055c506619
            </div>

            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex justify-between items-center text-xs py-2 border-b border-gray-100 last:border-0"
                >
                       <span className="text-blue-600 font-mono">txHash 0x{i}df...4a</span>
                  <span className="text-green-950 font-mono">from 0x8ad...cbf04</span>

                  <span className="text-gray-500">{i * 2} min ago</span>
                </div>
              ))}
            </div>

            <div className="text-xs text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1.5">
              View the Humartz contract on Arbiscan
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
}