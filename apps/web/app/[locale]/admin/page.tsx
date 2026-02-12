// app/arbitrum/page.tsx
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { ArbitrumForm } from "../components/arbitrum-form";
import { getDictionary } from "@repo/internationalization";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import PendingTracksSection from "../components/PendingTracksSection"; 

type ArbitrumPageProps = {
  params: Promise<{ locale: string }>;
};

export const generateMetadata = async ({ params }: ArbitrumPageProps): Promise<Metadata> => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  return createMetadata(dictionary.web.arbitrum.meta);
};

const ArbitrumPage = async ({ params }: ArbitrumPageProps) => {
  const { locale } = await params;

  const { userId } = await auth();
  if (!userId) redirect(`/${locale}/`);

  const user = await currentUser();
  const role = user?.publicMetadata?.role as string | undefined;

  if (role !== "admin") redirect(`/${locale}`);

  const dictionary = await getDictionary(locale);

  return (
    <div className="min-h-screen bg-background antialiased">
      <div className="container mx-auto px-4 py-8 lg:py-16">
        
        {/* --- Header Section --- */}
        <header className="mb-12 border-b pb-8 border-border/40">
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              Admin Control Center
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Manage blockchain anchors and verify pending track submissions in one place.
            </p>
          </div>
        </header>

        {/* --- Two-Column Layout --- */}
        {/* grid-cols-1 on mobile, grid-cols-2 on Large screens */}
          
          {/* Left Column: Blockchain Actions */}
          <section className="space-y-6 h-full pb-2">
  
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-1">
               <ArbitrumForm dictionary={dictionary} />
            </div>
          </section>

          {/* Right Column: Pending Submissions */}
   
          


               <PendingTracksSection />

      </div>
    </div>
  );
};

export default ArbitrumPage;