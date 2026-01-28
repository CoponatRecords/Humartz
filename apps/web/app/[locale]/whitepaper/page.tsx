import { cn } from "@repo/design-system/lib/utils";
import { getDictionary } from "@repo/internationalization";
import type { Article, WithContext } from "@repo/seo/json-ld";
import { JsonLd } from "@repo/seo/json-ld";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle, ShieldCheck, Database, Fingerprint, FileAudio, Activity } from "lucide-react";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return createMetadata({
    title: "Humartz White Paper | Proof of Humanity Protocol",
    description: "The technical documentation for the Humartz cryptographic verification protocol.",
  });
};

const WhitePaperPage = async ({ params }: PageProps) => {
  const { locale } = await params;

  const jsonLd: WithContext<Article> = {
    "@type": "Article",
    "@context": "https://schema.org",
    headline: "Humartz White Paper: Proof of Humanity Protocol",
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
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-sm text-muted-foreground w-fit">
                <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                Version 1.0 — January 2026
              </div>
              <h1 className="font-regular text-4xl tracking-tighter md:text-6xl">
                The Humartz Protocol
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Proving human origin in the age of generative AI by establishing a decentralized, cryptographic standard.
              </p>
            </div>
          </div>

          <hr className="border-border/50" />

          {/* Content Section */}
          <article className="prose prose-stone dark:prose-invert max-w-none">

            {/* 1. Abstract */}
            <section className="mb-16">
              <h2 className="text-2xl font-semibold tracking-tight mb-4">1. Abstract</h2>
              <p className="text-muted-foreground leading-7">
                Humartz is an open-source certification protocol for human-created content.
              </p>
              <p className="text-muted-foreground leading-7 mt-4">
                As generative systems make content creation effectively infinite, the economic value of creative work shifts from production to provenance. The central question is no longer how content is made, but whether its human origin can be independently verified.
              </p>
              <p className="text-muted-foreground leading-7 mt-4">
                Humartz addresses this by providing a tamper-resistant certification process that binds verified human identity, creation telemetry, and cryptographic proofs into a publicly verifiable record. Rather than storing or distributing creative works, the protocol anchors proofs of human authorship on-chain, enabling platforms, licensors, and third parties to verify origin without accessing the underlying content.
              </p>
            </section>

            <section className="mb-16">
              <div className="grid gap-6 md:grid-cols-2 mt-6">
                <div className="rounded-lg border p-6 bg-muted/20">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Database className="w-4 h-4 text-orange-500" /> Scale Challenges
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Automated AI systems can generate content at a scale that overwhelms traditional discovery, attribution, and licensing mechanisms.
                  </p>
                </div>
                <div className="rounded-lg border p-6 bg-muted/20">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-red-500" /> Trust Gap
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Platforms and users cannot reliably identify AI-generated content, creating uncertainty about provenance.
                  </p>
                </div>
              </div>
            </section>

            {/* 2. The Solution */}
            <section className="mb-16">
              <h2 className="text-2xl font-semibold tracking-tight mb-4">2. The Solution: Cryptographically Frozen Archive</h2>
              <p className="text-muted-foreground leading-7 mb-6">
                Humartz provides <strong>public cryptographic proof</strong> of your creation's provenance, by anchoring its human status to the blockchain.
              </p>

              <div className="bg-zinc-950 text-zinc-50 rounded-xl p-6 font-mono text-sm overflow-x-auto my-8">
                <div className="text-zinc-500 mb-2">// The Humanity Hash</div>
                <div>Hash = Keccak256(ContentID + Proof Folder Hash)</div>
              </div>

              <p className="text-muted-foreground leading-7 mt-4">
                Humartz does not evaluate artistic quality or originality. The protocol certifies that a specific piece of content was created through a verifiable human-led process at a given point in time.
              </p>

            </section>

            {/* 3. The Certification Workflow */}
            <section className="mb-16">
              <h2 className="text-2xl font-semibold tracking-tight mb-8">3. The Certification Workflow</h2>
              <p className="text-muted-foreground leading-7 mb-8">
                To distinguish a prompted generation from a composed work, Humartz captures the <strong>telemetry of creation</strong>. The certification process verifies final files as well as the effort exerted during the creative process.
              </p>

              <div className="relative border-l-2 border-muted pl-8 ml-4 space-y-12">

                {/* Step 1 */}
                <div className="relative">
                  <div className="absolute -left-[41px] top-1 h-6 w-6 rounded-full border bg-background flex items-center justify-center">
                    <Fingerprint className="h-3 w-3 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">1. Identity Verification</h3>
                  <p className="text-sm text-muted-foreground">
                    The creator provides the auditor with a proof of identity. This binds a specific wallet address to a verified human entity.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <div className="absolute -left-[41px] top-1 h-6 w-6 rounded-full border bg-background flex items-center justify-center">
                    <Activity className="h-3 w-3 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">2. The Proof Folder </h3>
                  <p className="text-sm text-muted-foreground">
                    Unlike automated generation, human creation is iterative and time-bound.
                  </p>
                                    <p className="text-sm text-muted-foreground">
                    Humartz evaluates session-level telemetry derived from project files to assess temporal effort and human intervention.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Signals may include creation timestamps, edit history and track modifications.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    If metadata checks are inconclusive, or if session files cannot be shared due to technical or contractual constraints, a remote video verification may be scheduled to confirm the authenticity of the session without transferring files.
                  </p>
                </div>
                {/* Step 3 */}
<div className="relative">
  <div className="absolute -left-[41px] top-1 h-6 w-6 rounded-full border bg-background flex items-center justify-center">
    <FileAudio className="h-3 w-3 text-green-500" />
  </div>
  <h3 className="text-lg font-medium mb-2">3. Hashing & Blockchain Commitment</h3>
  <p className="text-sm text-muted-foreground">
    The Proof Folder is hashed locally as a single unit. This hash acts as a
    cryptographic fingerprint of the entire certification process.
  </p>
  <p className="text-sm text-muted-foreground mt-2">
    The resulting hash is submitted to the Solana blockchain, which records
    the certification event in a time-stamped tamper-resistant log.
  </p>
  <p className="text-sm text-muted-foreground">
    Humartz does not store creative content, session files, or raw telemetry.
    Only derived metadata and cryptographic commitments are retained.
  </p>
</div>


              </div>
            </section>

          

            {/* 5. Economic Model */}
            <section className="mb-16">
              <h2 className="text-2xl font-semibold tracking-tight mb-4">5. Economic Model</h2>
              <p className="text-muted-foreground leading-7">
                Humartz operates as a certification protocol. Fees are assessed per certification, reflecting the computational, verification, and anchoring costs associated with establishing human provenance.
              </p>
              <p className="text-muted-foreground leading-7 mt-4">
                No recurring royalties, ownership claims, or content custody obligations are imposed by the protocol.
              </p>
            </section>

            {/* 6. Roadmap */}
            {/* <section className="mb-16">
              <h2 className="text-2xl font-semibold tracking-tight mb-4">6. Roadmap</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 border rounded-lg bg-primary/5 border-primary/20">
                  <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <div className="font-semibold text-sm uppercase tracking-wide text-primary">Phase 1: MVP (Current)</div>
                    <div className="text-sm text-muted-foreground">Centralized Curation + Proof Folder Hash</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border rounded-lg opacity-60">
                  <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 shrink-0" />
                  <div>
                    <div className="font-semibold text-sm uppercase tracking-wide">Phase 2: Decentralization</div>
                    <div className="text-sm text-muted-foreground">Publishing Roots to Solana for censorship resistance.</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border rounded-lg opacity-60">
                  <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 shrink-0" />
                  <div>
                    <div className="font-semibold text-sm uppercase tracking-wide">Phase 3: Community Validation</div>
                    <div className="text-sm text-muted-foreground">Staked curators vouching for human origin.</div>
                  </div>
                </div>
              </div>
            </section> */}

            {/* Footer Note */}
            <div className="mt-20 p-8 bg-muted/30 rounded-2xl text-center">
              <h3 className="text-lg font-semibold mb-2">Join the Protocol</h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
                At Humartz we provide the infrastructure to value human intent.
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/contact" className="px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition">
                  Contact Sales
                </Link>
              </div>
            </div>

          </article>
        </div>
      </div>
    </>
  );
};

export default WhitePaperPage;
