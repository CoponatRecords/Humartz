// app/pricing/page.tsx     ← or wherever this lives
// This should be a Server Component

import { Button } from "@repo/design-system";
import {
  Check,
  Minus,
  MoveRight,
  PhoneCall,
  Music,
  ShieldCheck,
  Copyright,
} from "lucide-react";
import Link from "next/link";
import { getDictionary } from "@repo/internationalization";

// Force dynamic rendering if needed (optional – depends on your i18n strategy)
export const dynamic = 'force-dynamic'; // or 'force-static' if translations are static

interface PricingProps {
  params: { locale: string };
}

export default async function Pricing({ params }: PricingProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  
  // Access pricing section – adjust path if your dictionary nesting is different
  const t = dict.web.pricing;

  // Fallback if dictionary loading fails or section is missing
  if (!t) {
    return <div>Error loading translations</div>;
  }

  const FeatureItem = ({
    label,
    value,
    icon: Icon = Check,
    active = true,
  }: {
    label: string;
    value?: string;
    icon?: any;
    active?: boolean;
  }) => (
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
              {t.title}
            </h2>
            <p className="max-w-xl text-center text-lg text-muted-foreground leading-relaxed tracking-tight">
              {t.subtitle}
            </p>
          </div>

          {/* ─── MOBILE VIEW ─── */}
          <div className="flex flex-col w-full gap-6 pt-12 lg:hidden">
            {/* Artist */}
            <div className="flex flex-col gap-4 p-6 border rounded-2xl bg-background text-left">
              <div className="flex items-center gap-2">
                <Music className="h-5 w-5 text-orange-500" />
                <p className="text-xl font-bold">{t.tiers.artist.name}</p>
              </div>
              <p className="text-4xl font-bold">
                {t.tiers.artist.price}
                <span className="text-sm font-normal text-muted-foreground">
                  {t.tiers.artist.priceUnit}
                </span>
              </p>
              <div className="space-y-1">
                <FeatureItem label={t.features.expertHumanReview} />
                <FeatureItem label={t.features.blockchainTimestamp} />
                <FeatureItem
                  label={t.features.tracksIncluded}
                  value={t.featureValues.artist.tracks}
                />
                <FeatureItem label={t.features.copyrightRiskAudit} active={false} />
                <FeatureItem label={t.features.certifiedHumanBadges} active={false} />
                <FeatureItem
                  label={t.features.turnaroundTime}
                  value={t.featureValues.artist.turnaround}
                />
              </div>
              <Button asChild className="w-full mt-4" variant="outline">
                <Link href={t.tiers.artist.buttonLink}>
                  {t.tiers.artist.button} <MoveRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>

            {/* Producer */}
            <div className="relative flex flex-col gap-4 p-6 border-2 border-primary rounded-2xl bg-muted/20 text-left">
              <div className="absolute top-4 right-4 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary font-bold uppercase">
                {t.mobile.bestValueBadge}
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <p className="text-xl font-bold">{t.tiers.producer.name}</p>
              </div>
              <p className="text-4xl font-bold">
                {t.tiers.producer.price}
                <span className="text-sm font-normal text-muted-foreground">
                  {t.tiers.producer.priceUnit}
                </span>
              </p>
              <div className="space-y-1">
                <FeatureItem label={t.features.expertHumanReview} />
                <FeatureItem label={t.features.blockchainTimestamp} />
                <FeatureItem
                  label={t.features.tracksIncluded}
                  value={t.featureValues.producer.tracks}
                />
                <FeatureItem label={t.features.copyrightRiskAudit} active={false} />
                <FeatureItem label={t.features.certifiedHumanBadges} />
                <FeatureItem
                  label={t.features.turnaroundTime}
                  value={t.featureValues.producer.turnaround}
                />
              </div>
              <Button asChild className="w-full mt-4">
                <Link href={t.tiers.producer.buttonLink}>
                  {t.tiers.producer.button} <MoveRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>

            {/* Label */}
            <div className="flex flex-col gap-4 p-6 border rounded-2xl bg-background text-left">
              <div className="flex items-center gap-2">
                <Copyright className="h-5 w-5 text-blue-600" />
                <p className="text-xl font-bold">{t.tiers.label.name}</p>
              </div>
              <p className="text-4xl font-bold">{t.tiers.label.price}</p>
              <div className="space-y-1">
                <FeatureItem label={t.features.expertHumanReview} />
                <FeatureItem label={t.features.blockchainTimestamp} />
                <FeatureItem
                  label={t.features.tracksIncluded}
                  value={t.featureValues.label.tracks}
                />
                <FeatureItem label={t.features.copyrightRiskAudit} />
                <FeatureItem label={t.features.certifiedHumanBadges} />
                <FeatureItem
                  label={t.features.turnaroundTime}
                  value={t.featureValues.label.turnaround}
                />
              </div>
              <Button asChild className="w-full mt-4" variant="outline">
                <Link href={t.tiers.label.buttonLink}>
                  {t.tiers.label.button} <PhoneCall className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>

          {/* ─── DESKTOP VIEW ─── */}
          <div className="hidden lg:grid w-full grid-cols-4 divide-x pt-20 text-left">
            <div className="lg:col-span-1" />

            {/* Artist column header */}
            <div className="flex flex-col gap-2 px-6 py-4">
              <div className="flex items-center gap-2">
                <Music className="h-5 w-5 text-orange-500" />
                <p className="text-2xl font-medium">{t.tiers.artist.name}</p>
              </div>
              <p className="text-muted-foreground text-sm min-h-[60px]">
                {t.tiers.artist.description}
              </p>
              <p className="mt-4 flex flex-col gap-2 text-xl lg:flex-row lg:items-center">
                <span className="text-4xl font-bold">{t.tiers.artist.price}</span>
                <span className="text-muted-foreground text-sm">{t.tiers.artist.priceUnit}</span>
              </p>
              <Button asChild className="mt-8 gap-4" variant="outline">
                <Link href={t.tiers.artist.buttonLink}>
                  {t.tiers.artist.button} <MoveRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Producer column header */}
            <div className="relative flex flex-col gap-2 px-6 py-4 bg-muted/20 rounded-t-xl lg:rounded-t-none lg:rounded-tl-xl border-t-2 border-primary/30">
              <div className="absolute top-3 right-4 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary font-medium">
                {t.mobile.bestValueBadge}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <p className="text-2xl font-medium">{t.tiers.producer.name}</p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm min-h-[60px]">
                {t.tiers.producer.description}
              </p>
              <p className="mt-4 flex flex-col gap-2 text-xl lg:flex-row lg:items-center">
                <span className="text-4xl font-bold">{t.tiers.producer.price}</span>
                <span className="text-muted-foreground text-sm">{t.tiers.producer.priceUnit}</span>
              </p>
              <Button asChild className="mt-8 gap-4">
                <Link href={t.tiers.producer.buttonLink}>
                  {t.tiers.producer.button} <MoveRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Label column header */}
            <div className="flex flex-col gap-2 px-6 py-4">
              <div className="flex items-center gap-2">
                <Copyright className="h-5 w-5 text-blue-600" />
                <p className="text-2xl font-medium">{t.tiers.label.name}</p>
              </div>
              <p className="text-muted-foreground text-sm min-h-[60px]">
                {t.tiers.label.description}
              </p>
              <p className="mt-4 flex flex-col gap-2 text-xl lg:flex-row lg:items-center">
                <span className="text-4xl font-bold">{t.tiers.label.price}</span>
              </p>
              <Button asChild className="mt-8 gap-4" variant="outline">
                <Link href={t.tiers.label.buttonLink}>
                  {t.tiers.label.button} <PhoneCall className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* ─── FEATURE ROWS ─── */}
            <div className="px-6 py-4 text-lg font-semibold mt-4">
              {t.features.proofAndCertificates}
            </div>
            <div className="mt-4" />
            <div className="bg-muted/20 mt-4" />
            <div className="mt-4" />

            <div className="px-6 py-4 text-muted-foreground">{t.features.expertHumanReview}</div>
            <div className="flex justify-center py-4">
              <Check className="h-5 w-5 text-primary" />
            </div>
            <div className="flex justify-center py-4 bg-muted/20">
              <Check className="h-5 w-5 text-primary" />
            </div>
            <div className="flex justify-center py-4">
              <Check className="h-5 w-5 text-primary" />
            </div>

            <div className="px-6 py-4 text-muted-foreground">{t.features.blockchainTimestamp}</div>
            <div className="flex justify-center py-4">
              <Check className="h-5 w-5 text-primary" />
            </div>
            <div className="flex justify-center py-4 bg-muted/20">
              <Check className="h-5 w-5 text-primary" />
            </div>
            <div className="flex justify-center py-4">
              <Check className="h-5 w-5 text-primary" />
            </div>

            <div className="px-6 py-4 text-muted-foreground">{t.features.tracksIncluded}</div>
            <div className="flex justify-center py-4">
              <span className="text-sm font-medium">{t.featureValues.artist.tracks}</span>
            </div>
            <div className="flex justify-center py-4 bg-muted/20">
              <span className="text-sm font-medium">{t.featureValues.producer.tracks}</span>
            </div>
            <div className="flex justify-center py-4">
              <span className="text-sm font-medium">{t.featureValues.label.tracks}</span>
            </div>

            <div className="px-6 py-4 text-lg font-semibold mt-6">
              {t.features.businessAndLegal}
            </div>
            <div className="mt-6" />
            <div className="bg-muted/20 mt-6" />
            <div className="mt-6" />

            <div className="px-6 py-4 text-muted-foreground">{t.features.copyrightRiskAudit}</div>
            <div className="flex justify-center py-4">
              <Minus className="h-4 w-4 text-muted-foreground/30" />
            </div>
            <div className="flex justify-center py-4 bg-muted/20">
              <Minus className="h-4 w-4 text-muted-foreground/30" />
            </div>
            <div className="flex justify-center py-4">
              <Check className="h-5 w-5 text-primary" />
            </div>

            <div className="px-6 py-4 text-muted-foreground">{t.features.certifiedHumanBadges}</div>
            <div className="flex justify-center py-4">
              <Check className="h-5 w-5 text-primary" />
            </div>
            <div className="flex justify-center py-4 bg-muted/20">
              <Check className="h-5 w-5 text-primary" />
            </div>
            <div className="flex justify-center py-4">
              <Check className="h-5 w-5 text-primary" />
            </div>

            <div className="px-6 py-4 text-muted-foreground">{t.features.turnaroundTime}</div>
            <div className="flex justify-center py-4">
              <span className="text-sm">{t.featureValues.artist.turnaround}</span>
            </div>
            <div className="flex justify-center py-4 bg-muted/20">
              <span className="text-sm font-medium">{t.featureValues.producer.turnaround}</span>
            </div>
            <div className="flex justify-center py-4">
              <span className="text-sm font-medium">{t.featureValues.label.turnaround}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}