import { getDictionary } from "@repo/internationalization";
import type { Article, WithContext } from "@repo/seo/json-ld";
import { JsonLd } from "@repo/seo/json-ld";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  ShieldCheck,
  Database,
  Fingerprint,
  FileAudio,
  Activity,
} from "lucide-react";
import WallpaperImg from "../components/magic-ui/wallpaper.jpg";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  const t = dictionary.web?.whitepaper?.meta;

  return createMetadata({
    title: t?.title ?? "Humartz White Paper | Proof of Humanity Protocol",
    description:
      t?.description ??
      "The technical documentation for the Humartz cryptographic verification protocol.",
  });
}

export default async function WhitePaperPage({ params }: PageProps) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  const t = dictionary.web?.whitepaper;

  if (!t) {
    return <div>Error loading translations</div>;
  }

  const jsonLd: WithContext<Article> = {
    "@type": "Article",
    "@context": "https://schema.org",
    headline: t.headline,
    author: {
      "@type": "Organization",
      name: "Humartz",
    },
    datePublished: "2026-01-23",
  };

  return (
    <>
      <JsonLd code={jsonLd} />

      <div className="w-full py-20 lg:py-32">
        <div className="container mx-auto flex flex-col gap-14 max-w-4xl px-6">
          {/* Header Section */}
          <div className="flex flex-col gap-6">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> {t.backToHome}
            </Link>

            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-sm text-muted-foreground w-fit">
                <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                {t.version}
              </div>
              <h1 className="font-regular text-4xl tracking-tighter md:text-6xl">
                {t.headline}
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                {t.subtitle}
              </p>
            </div>
          </div>

          <hr className="border-border/50" />

          {/* Content */}
          <article className="prose prose-stone dark:prose-invert max-w-none">
            {/* 1. Abstract */}
            <section className="mb-16">
              <h2 className="text-2xl font-semibold tracking-tight mb-4">
                {t.sections.abstract.title}
              </h2>
              <p className="text-muted-foreground leading-7">
                {t.sections.abstract.p1.split("open-source")[0]}
                <a
                  href="https://github.com/CoponatRecords/humartz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-foreground underline decoration-muted-foreground/50 underline-offset-4"
                >
                  {t.sections.abstract.p1_link_text}
                </a>
                {t.sections.abstract.p1.split("open-source")[1]}
              </p>
              <p className="text-muted-foreground leading-7 mt-4">
                {t.sections.abstract.p2}
              </p>
              <p className="text-muted-foreground leading-7 mt-4">
                {t.sections.abstract.p3}
              </p>
            </section>

            {/* Challenges grid */}
            <section className="mb-16">
              <div className="grid gap-6 md:grid-cols-2 mt-6">
                <div className="rounded-lg border p-6 bg-muted/20">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Database className="w-4 h-4 text-orange-500" />
                    {t.sections.challenges.scale.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t.sections.challenges.scale.description}
                  </p>
                </div>
                <div className="rounded-lg border p-6 bg-muted/20">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-red-500" />
                    {t.sections.challenges.trust.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t.sections.challenges.trust.description}
                  </p>
                </div>
              </div>
            </section>

            {/* 2. The Solution */}
            <section className="mb-16">
              <h2 className="text-2xl font-semibold tracking-tight mb-4">
                {t.sections.solution.title}
              </h2>
              <p
                className="text-muted-foreground leading-7 mb-6"
                dangerouslySetInnerHTML={{
                  __html: t.sections.solution.intro,
                }}
              />
{/* 
              <div className="bg-zinc-950 text-zinc-50 rounded-xl p-6 font-mono text-sm overflow-x-auto my-8">
                <div className="text-zinc-500 mb-2">
                  {t.sections.solution.humanityHashComment}
                </div>
                <div>{t.sections.solution.humanityHash}</div>
              </div> */}

              <p className="text-muted-foreground leading-7 mt-4">
                {t.sections.solution.note}
              </p>
            </section>

            {/* 3. Certification Workflow */}
            <section className="mb-16">
              <h2 className="text-2xl font-semibold tracking-tight mb-8">
                {t.sections.workflow.title}
              </h2>
              <p
                className="text-muted-foreground leading-7 mb-8"
                dangerouslySetInnerHTML={{
                  __html: t.sections.workflow.intro,
                }}
              />

              <div className="relative border-l-2 border-muted pl-8 ml-4 space-y-12">
                {t.sections.workflow.steps.map((step, index) => (
                  <div className="relative" key={index}>
                    <div className="absolute -left-[41px] top-1 h-6 w-6 rounded-full border bg-background flex items-center justify-center">
                      {index === 0 && <Fingerprint className="h-3 w-3 text-primary" />}
                      {index === 1 && <Activity className="h-3 w-3 text-blue-500" />}
                      {index === 2 && <FileAudio className="h-3 w-3 text-green-500" />}
                    </div>
                    <h3 className="text-lg font-medium mb-2">{step.title}</h3>

                    {index === 0 && (
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    )}

                    {index === 1 && (
                      <>
                        <p className="text-sm text-muted-foreground">{step.p1}</p>
                        <p className="text-sm text-muted-foreground mt-2">{step.p2}</p>
                        <p className="text-sm text-muted-foreground mt-2">{step.p3}</p>
                        <p className="text-sm text-muted-foreground mt-2">{step.p4}</p>
                      </>
                    )}

                    {index === 2 && (
                      <>
                        <p className="text-sm text-muted-foreground">{step.p1}</p>
                        <p className="text-sm text-muted-foreground mt-2">{step.p2}</p>
                        <p className="text-sm text-muted-foreground mt-2">{step.p3}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* 4. Economic Model */}
            <section className="mb-16">
              <h2 className="text-2xl font-semibold tracking-tight mb-4">
                {t.sections.economic.title}
              </h2>
              <p className="text-muted-foreground leading-7">
                {t.sections.economic.p1}
              </p>
              <p className="text-muted-foreground leading-7 mt-4">
                {t.sections.economic.p2}
              </p>
            </section>

            {/* Join / CTA footer */}
            <div className="relative mt-20 overflow-hidden rounded-2xl p-12 text-center border">
              <div
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage: `url(${WallpaperImg.src})`,
                  backgroundSize: "100% auto",
                  backgroundRepeat: "no-repeat",
                  backgroundColor: "black",
                }}
              />
              <div className="absolute inset-0 z-10 bg-black/70 backdrop-blur-[2px]" />

              <div className="relative z-20">
                <h3 className="text-2xl font-semibold mb-2 text-white tracking-tight">
                  {t.sections.join.title}
                </h3>
                <p className="text-zinc-300 text-sm mb-8 max-w-md mx-auto leading-relaxed">
                  {t.sections.join.description}
                </p>
                <div className="flex justify-center gap-4">
                  <Link
                    href="/contact"
                    className="px-8 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-all active:scale-95 shadow-lg"
                  >
                    {t.sections.join.button}
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}