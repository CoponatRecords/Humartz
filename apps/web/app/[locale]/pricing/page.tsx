import { Button } from "@repo/design-system/components/ui/button";
import { Check, Minus, MoveRight, PhoneCall, ShieldCheck, Music, Copyright } from "lucide-react";
import Link from "next/link";
import { env } from "@/env";

const Pricing = () => {
  // Helper for mobile feature rows to keep code clean
  const FeatureItem = ({ label, value, icon: Icon = Check, active = true }: { label: string, value?: string, icon?: any, active?: boolean }) => (
    <div className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      {value ? (
        <span className="text-sm font-medium">{value}</span>
      ) : active ? (
        <Icon className="h-4 w-4 text-primary" />
      ) : (
        <Minus className="h-4 w-4 text-muted-foreground/30" />
      )}
    </div>
  );

  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex flex-col gap-2">
            <h2 className="max-w-xl text-center font-regular text-3xl tracking-tighter md:text-5xl">
              Protect your craft. Secure your rights.
            </h2>
            <p className="max-w-xl text-center text-lg text-muted-foreground leading-relaxed tracking-tight">
              Choose the plan that fits your career—from single releases to entire catalogs.
            </p>
          </div>

          {/* --- MOBILE VIEW (Vertical Cards) --- */}
          <div className="flex flex-col w-full gap-6 pt-12 lg:hidden">
            {/* Artist Mobile */}
            <div className="flex flex-col gap-4 p-6 border rounded-2xl bg-background text-left">
              <div className="flex items-center gap-2">
                <Music className="h-5 w-5 text-orange-500" />
                <p className="text-xl font-bold">Artist</p>
              </div>
              <p className="text-4xl font-bold">$15<span className="text-sm font-normal text-muted-foreground">/track</span></p>
              <div className="space-y-1">
                <FeatureItem label="Human Review" />
                <FeatureItem label="Blockchain" />
                <FeatureItem label="Tracks" value="1 Track" />
                <FeatureItem label="Copyright Audit" active={false} />
                <FeatureItem label="Store Badges" active={false} />
                <FeatureItem label="Turnaround" value="72 Hours" />
              </div>
              <Button asChild className="w-full mt-4" variant="outline">
                <Link href="/verify">Verify Track <MoveRight className="h-4 w-4 ml-2" /></Link>
              </Button>
            </div>

            {/* Producer Mobile */}
            <div className="flex flex-col gap-4 p-6 border-2 border-primary rounded-2xl bg-muted/20 text-left relative">
              <div className="absolute top-4 right-4 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary font-bold uppercase">Best Value</div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <p className="text-xl font-bold">Producer</p>
              </div>
              <p className="text-4xl font-bold">$49<span className="text-sm font-normal text-muted-foreground">/month</span></p>
              <div className="space-y-1">
                <FeatureItem label="Human Review" />
                <FeatureItem label="Blockchain" />
                <FeatureItem label="Tracks" value="5 Tracks / mo" />
                <FeatureItem label="Copyright Audit" active={false} />
                <FeatureItem label="Store Badges" />
                <FeatureItem label="Turnaround" value="24 Hours" />
              </div>
              <Button asChild className="w-full mt-4">
                <Link href="/signup">Start Subscription <MoveRight className="h-4 w-4 ml-2" /></Link>
              </Button>
            </div>

            {/* Label Mobile */}
            <div className="flex flex-col gap-4 p-6 border rounded-2xl bg-background text-left">
              <div className="flex items-center gap-2">
                <Copyright className="h-5 w-5 text-blue-600" />
                <p className="text-xl font-bold">Label / Sync</p>
              </div>
              <p className="text-4xl font-bold">Custom</p>
              <div className="space-y-1">
                <FeatureItem label="Human Review" />
                <FeatureItem label="Blockchain" />
                <FeatureItem label="Tracks" value="Unlimited" />
                <FeatureItem label="Copyright Audit" />
                <FeatureItem label="Store Badges" />
                <FeatureItem label="Turnaround" value="SLA Contract" />
              </div>
              <Button asChild className="w-full mt-4" variant="outline">
                <Link href="/contact">Contact Sales <PhoneCall className="h-4 w-4 ml-2" /></Link>
              </Button>
            </div>
          </div>

          {/* --- COMPUTER VIEW (The Original Grid) --- */}
          <div className="hidden lg:grid w-full grid-cols-4 divide-x pt-20 text-left">
            
            {/* Empty Top Left Corner */}
            <div className="lg:col-span-1" />

            {/* TIER 1: ARTIST */}
            <div className="flex flex-col gap-2 px-6 py-4">
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
                <Link href="/upload">
                  Verify Track <MoveRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* TIER 2: PRODUCER */}
            <div className="flex flex-col gap-2 px-6 py-4 bg-muted/20 rounded-t-xl lg:rounded-t-none lg:rounded-tl-xl border-t-2 border-primary lg:border-t-0">
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

            {/* TIER 3: LABEL */}
            <div className="flex flex-col gap-2 px-6 py-4">
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

            {/* --- COMPUTER FEATURE ROWS (UNTRAVERSED) --- */}
            <div className="px-6 py-4 text-lg font-semibold mt-4">Proof & Certificates</div>
            <div className="mt-4" /><div className="bg-muted/20 mt-4" /><div className="mt-4" />

            <div className="px-6 py-4 text-muted-foreground">Expert Human Review</div>
            <div className="flex justify-center py-4"><Check className="h-5 w-5 text-primary" /></div>
            <div className="flex justify-center py-4 bg-muted/20"><Check className="h-5 w-5 text-primary" /></div>
            <div className="flex justify-center py-4"><Check className="h-5 w-5 text-primary" /></div>

            <div className="px-6 py-4 text-muted-foreground">Blockchain Timestamp</div>
            <div className="flex justify-center py-4"><Check className="h-5 w-5 text-primary" /></div>
            <div className="flex justify-center py-4 bg-muted/20"><Check className="h-5 w-5 text-primary" /></div>
            <div className="flex justify-center py-4"><Check className="h-5 w-5 text-primary" /></div>

            <div className="px-6 py-4 text-muted-foreground">Tracks Included</div>
            <div className="flex justify-center py-4"><span className="text-sm font-medium">1 Track</span></div>
            <div className="flex justify-center py-4 bg-muted/20"><span className="text-sm font-medium">5 Tracks / mo</span></div>
            <div className="flex justify-center py-4"><span className="text-sm font-medium">Unlimited / Bulk</span></div>

            <div className="px-6 py-4 text-lg font-semibold mt-6">Business & Legal</div>
            <div className="mt-6" /><div className="bg-muted/20 mt-6" /><div className="mt-6" />

            <div className="px-6 py-4 text-muted-foreground">Copyright Risk Audit</div>
            <div className="flex justify-center py-4"><Minus className="h-4 w-4 text-muted-foreground/30" /></div>
            <div className="flex justify-center py-4 bg-muted/20"><Minus className="h-4 w-4 text-muted-foreground/30" /></div>
            <div className="flex justify-center py-4"><Check className="h-5 w-5 text-primary" /></div>

            <div className="px-6 py-4 text-muted-foreground">"Certified Human" Badges</div>
            <div className="flex justify-center py-4"><Minus className="h-4 w-4 text-muted-foreground/30" /></div>
            <div className="flex justify-center py-4 bg-muted/20"><Check className="h-5 w-5 text-primary" /></div>
            <div className="flex justify-center py-4"><Check className="h-5 w-5 text-primary" /></div>

            <div className="px-6 py-4 text-muted-foreground">Turnaround Time</div>
            <div className="flex justify-center py-4"><span className="text-sm">72 Hours</span></div>
            <div className="flex justify-center py-4 bg-muted/20"><span className="text-sm font-medium">24 Hours</span></div>
            <div className="flex justify-center py-4"><span className="text-sm font-medium">SLA Contract</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;