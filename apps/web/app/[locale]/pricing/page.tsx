import { Button } from "@repo/design-system/components/ui/button";
import { Check, Minus, MoveRight, PhoneCall, ShieldCheck, Music, Copyright } from "lucide-react";
import Link from "next/link";
import { env } from "@/env";

const Pricing = () => (
  <div className="w-full py-20 lg:py-40">
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="flex flex-col gap-2">
          <h2 className="max-w-xl text-center font-regular text-3xl tracking-tighter md:text-5xl">
            Protect your craft. Secure your rights.
          </h2>
          <p className="max-w-xl text-center text-lg text-muted-foreground leading-relaxed tracking-tight">
            Choose the plan that fits your career—from single releases to entire catalogs.
          </p>
        </div>
        
        {/* PRICING GRID */}
        <div className="grid w-full grid-cols-3 divide-x pt-20 text-left lg:grid-cols-4">
          
          {/* Empty Top Left Corner */}
          <div className="col-span-3 lg:col-span-1" />

          {/* TIER 1: THE INDIE ARTIST (Marketing Focus) */}
          <div className="flex flex-col gap-2 px-3 py-1 md:px-6 md:py-4">
            <div className="flex items-center gap-2">
              <Music className="h-5 w-5 text-orange-500" />
              <p className="text-2xl font-medium">Artist</p>
            </div>
            <p className="text-muted-foreground text-sm min-h-[60px]">
              For independent artists who want to stand out. Prove your single is 100% human-made.
            </p>
            <p className="mt-4 flex flex-col gap-2 text-xl lg:flex-row lg:items-center">
              <span className="text-4xl font-bold">$15</span>
              <span className="text-muted-foreground text-sm"> / track</span>
            </p>
            <Button asChild className="mt-8 gap-4" variant="outline">
              <Link href="/verify">
                Verify Track <MoveRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* TIER 2: THE BEAT SELLER (Premium/Volume Focus) */}
          <div className="flex flex-col gap-2 px-3 py-1 md:px-6 md:py-4 bg-muted/20 rounded-t-xl lg:rounded-t-none lg:rounded-tl-xl border-t-2 border-primary lg:border-t-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <p className="text-2xl font-medium">Producer</p>
              </div>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary font-medium">
                Best Value
              </span>
            </div>
            <p className="text-muted-foreground text-sm min-h-[60px]">
              For beatmakers and career musicians. Sell "Certified Human" beats at a premium.
            </p>
            <p className="mt-4 flex flex-col gap-2 text-xl lg:flex-row lg:items-center">
              <span className="text-4xl font-bold">$49</span>
              <span className="text-muted-foreground text-sm"> / month</span>
            </p>
            <Button asChild className="mt-8 gap-4">
              <Link href="/signup">
                Start Subscription <MoveRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* TIER 3: THE LABEL (Risk/Legal Focus) */}
          <div className="flex flex-col gap-2 px-3 py-1 md:px-6 md:py-4">
            <div className="flex items-center gap-2">
              <Copyright className="h-5 w-5 text-blue-600" />
              <p className="text-2xl font-medium">Label / Sync</p>
            </div>
            <p className="text-muted-foreground text-sm min-h-[60px]">
              Protect your catalog from non-copyrightable AI content. Due diligence for A&R.
            </p>
            <p className="mt-4 flex flex-col gap-2 text-xl lg:flex-row lg:items-center">
              <span className="text-4xl font-bold">Custom</span>
            </p>
            <Button asChild className="mt-8 gap-4" variant="outline">
              <Link href="/contact">
                Contact Sales <PhoneCall className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* --- FEATURE ROWS --- */}

          {/* Feature Header */}
          <div className="col-span-3 px-3 py-4 lg:col-span-1 lg:px-6 text-lg font-semibold mt-4">
            Proof & Certificates
          </div>
          <div className="hidden lg:block mt-4" />
          <div className="hidden lg:block bg-muted/20 mt-4" />
          <div className="hidden lg:block mt-4" />

          {/* Row: Manual Review */}
          <div className="col-span-3 px-3 py-4 lg:col-span-1 lg:px-6 text-muted-foreground">
            Expert Human Review
          </div>
          <div className="flex justify-center px-3 py-1 md:px-6 md:py-4 border-t lg:border-t-0">
            <Check className="h-5 w-5 text-primary" />
          </div>
          <div className="flex justify-center px-3 py-1 md:px-6 md:py-4 bg-muted/20 border-t lg:border-t-0">
            <Check className="h-5 w-5 text-primary" />
          </div>
          <div className="flex justify-center px-3 py-1 md:px-6 md:py-4 border-t lg:border-t-0">
            <Check className="h-5 w-5 text-primary" />
          </div>

          {/* Row: Solana Anchor */}
          <div className="col-span-3 px-3 py-4 lg:col-span-1 lg:px-6 text-muted-foreground">
            Blockchain Timestamp
          </div>
          <div className="flex justify-center px-3 py-1 md:px-6 md:py-4">
            <Check className="h-5 w-5 text-primary" />
          </div>
          <div className="flex justify-center px-3 py-1 md:px-6 md:py-4 bg-muted/20">
            <Check className="h-5 w-5 text-primary" />
          </div>
          <div className="flex justify-center px-3 py-1 md:px-6 md:py-4">
            <Check className="h-5 w-5 text-primary" />
          </div>

          {/* Row: Volume */}
          <div className="col-span-3 px-3 py-4 lg:col-span-1 lg:px-6 text-muted-foreground">
            Tracks Included
          </div>
          <div className="flex justify-center px-3 py-1 md:px-6 md:py-4">
            <span className="text-sm font-medium">1 Track</span>
          </div>
          <div className="flex justify-center px-3 py-1 md:px-6 md:py-4 bg-muted/20">
            <span className="text-sm font-medium">5 Tracks / mo</span>
          </div>
          <div className="flex justify-center px-3 py-1 md:px-6 md:py-4">
            <span className="text-sm font-medium">Unlimited / Bulk</span>
          </div>

          {/* Section Header */}
          <div className="col-span-3 px-3 py-4 lg:col-span-1 lg:px-6 text-lg font-semibold mt-6">
            Business & Legal
          </div>
          <div className="hidden lg:block mt-6" />
          <div className="hidden lg:block bg-muted/20 mt-6" />
          <div className="hidden lg:block mt-6" />

          {/* Row: Copyright Audit */}
          <div className="col-span-3 px-3 py-4 lg:col-span-1 lg:px-6 text-muted-foreground">
            Copyright Risk Audit
          </div>
          <div className="flex justify-center px-3 py-1 md:px-6 md:py-4 border-t lg:border-t-0">
            <Minus className="h-4 w-4 text-muted-foreground/30" />
          </div>
          <div className="flex justify-center px-3 py-1 md:px-6 md:py-4 bg-muted/20 border-t lg:border-t-0">
            <Minus className="h-4 w-4 text-muted-foreground/30" />
          </div>
          <div className="flex justify-center px-3 py-1 md:px-6 md:py-4 border-t lg:border-t-0">
            <Check className="h-5 w-5 text-primary" />
          </div>

          {/* Row: Store Badges */}
          <div className="col-span-3 px-3 py-4 lg:col-span-1 lg:px-6 text-muted-foreground">
            "Certified Human" Store Badges
          </div>
          <div className="flex justify-center px-3 py-1 md:px-6 md:py-4">
            <Minus className="h-4 w-4 text-muted-foreground/30" />
          </div>
          <div className="flex justify-center px-3 py-1 md:px-6 md:py-4 bg-muted/20">
            <Check className="h-5 w-5 text-primary" />
          </div>
          <div className="flex justify-center px-3 py-1 md:px-6 md:py-4">
            <Check className="h-5 w-5 text-primary" />
          </div>

          {/* Row: Priority */}
          <div className="col-span-3 px-3 py-4 lg:col-span-1 lg:px-6 text-muted-foreground">
            Turnaround Time
          </div>
          <div className="flex justify-center px-3 py-1 md:px-6 md:py-4">
            <span className="text-sm">72 Hours</span>
          </div>
          <div className="flex justify-center px-3 py-1 md:px-6 md:py-4 bg-muted/20">
            <span className="text-sm font-medium">24 Hours (Priority)</span>
          </div>
          <div className="flex justify-center px-3 py-1 md:px-6 md:py-4">
            <span className="text-sm font-medium">SLA Contract</span>
          </div>

        </div>
      </div>
    </div>
  </div>
);

export default Pricing;