import { Button } from "@repo/design-system/components/ui/button";
import { Check, Minus, MoveRight, PhoneCall, ShieldCheck, Music, Copyright } from "lucide-react";
import Link from "next/link";

const Pricing = () => (
  <div className="w-full py-20 lg:py-40">
    <div className="container mx-auto">
      {/* --- HEADER --- */}
      <div className="flex flex-col items-center justify-center gap-4 text-center px-4">
        <h2 className="max-w-xl text-3xl font-regular tracking-tighter md:text-5xl">
          Protect your craft. Secure your rights.
        </h2>
        <p className="max-w-xl text-lg text-muted-foreground leading-relaxed tracking-tight">
          Choose the plan that fits your career—from single releases to entire catalogs.
        </p>
      </div>

      {/* --- PRICING GRID --- */}
      <div className="mt-16 flex flex-col gap-8 lg:grid lg:grid-cols-4 lg:divide-x lg:gap-0">
        {/* TIER 1 */}
        <div className="flex flex-col gap-4 px-6 py-6 border rounded-lg lg:rounded-none lg:border-0">
          <div className="flex items-center gap-2">
            <Music className="h-5 w-5 text-orange-500" />
            <p className="text-2xl font-medium">Artist</p>
          </div>
          <p className="text-sm text-muted-foreground">
            For independent artists who want to stand out. Prove your single is 100% human-made.
          </p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-bold">$15</span>
            <span className="text-sm text-muted-foreground">/ track</span>
          </div>
          <Button asChild className="mt-6 gap-2" variant="outline">
            <Link href="/verify">
              Verify Track <MoveRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* TIER 2 */}
        <div className="flex flex-col gap-4 px-6 py-6 bg-muted/20 rounded-lg lg:rounded-none border-t-2 lg:border-t-0 lg:border-l-2 border-primary">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <p className="text-2xl font-medium">Producer</p>
            </div>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary font-medium">
              Best Value
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            For beatmakers and career musicians. Sell "Certified Human" beats at a premium.
          </p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-bold">$49</span>
            <span className="text-sm text-muted-foreground">/ month</span>
          </div>
          <Button asChild className="mt-6 gap-2">
            <Link href="/signup">
              Start Subscription <MoveRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* TIER 3 */}
        <div className="flex flex-col gap-4 px-6 py-6 border rounded-lg lg:rounded-none lg:border-0">
          <div className="flex items-center gap-2">
            <Copyright className="h-5 w-5 text-blue-600" />
            <p className="text-2xl font-medium">Label / Sync</p>
          </div>
          <p className="text-sm text-muted-foreground">
            Protect your catalog from non-copyrightable AI content. Due diligence for A&R.
          </p>
          <div className="mt-4 text-4xl font-bold">Custom</div>
          <Button asChild className="mt-6 gap-2" variant="outline">
            <Link href="/contact">
              Contact Sales <PhoneCall className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* FEATURE GRID */}
        <div className="hidden lg:grid lg:grid-rows-6 lg:gap-4">
          <p className="text-lg font-semibold mt-6">Proof & Certificates</p>
          <p className="text-muted-foreground">Expert Human Review</p>
          <p className="text-muted-foreground">Blockchain Timestamp</p>
          <p className="text-muted-foreground">Tracks Included</p>
          <p className="text-lg font-semibold mt-6">Business & Legal</p>
          <p className="text-muted-foreground">Copyright Risk Audit</p>
        </div>
      </div>

      {/* --- MOBILE FEATURES STACK --- */}
      <div className="mt-12 flex flex-col gap-6 lg:hidden px-6">
        <div className="flex justify-between items-center">
          <span>Expert Human Review</span>
          <Check className="h-5 w-5 text-primary" />
        </div>
        <div className="flex justify-between items-center">
          <span>Blockchain Timestamp</span>
          <Check className="h-5 w-5 text-primary" />
        </div>
        <div className="flex justify-between items-center">
          <span>Tracks Included</span>
          <span className="text-sm font-medium">1 Track / 5 Tracks / Unlimited</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Copyright Risk Audit</span>
          <Minus className="h-4 w-4 text-muted-foreground/30" />
        </div>
      </div>
    </div>
  </div>
);

export default Pricing;
