import { showBetaFeature } from "@repo/feature-flags";
import { getDictionary } from "@repo/internationalization";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { CTA } from "./components/cta";
import { FAQ } from "./components/faq";
import { Features } from "./components/features";
import { Hero } from "./components/hero";
import { Stats } from "./components/stats";
import { GridPattern } from "../components/magic-ui/grid-pattern";
import { cn } from "../../../../../packages/design-system/lib/utils";

type HomeProps = {
  params: Promise<{
    locale: string;
  }>;
};

export const generateMetadata = async ({
  params,
}: HomeProps): Promise<Metadata> => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return createMetadata(dictionary.web.home.meta);
};

const Home = async ({ params }: HomeProps) => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  const betaFeature = await showBetaFeature();

  return (
    <>
      {betaFeature && (
        <div className="w-full bg-black py-2 text-center text-white">
          Beta feature now available
        </div>
      )}

          <GridPattern 
        width={30} 
                height={30} 

        className={cn(
          "absolute inset-0 -z-10 opacity-40",
          // Add a fade to the bottom so it doesn't cut off abruptly
          "[mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]"
        )} 
      /> 
      <Hero dictionary={dictionary} />
      {/* <Cases dictionary={dictionary} /> */}
      <Features dictionary={dictionary} />
      <Stats dictionary={dictionary} />
      {/* <Testimonials dictionary={dictionary} /> */}
      <FAQ dictionary={dictionary} />
      <CTA dictionary={dictionary} />

    </>
  );
};

export default Home;
