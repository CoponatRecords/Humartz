// components/hero/Hero.tsx
import HeroContent from "./HeroContent";
import GetStartedSection from "./GetStartedSection";
import type { Dictionary } from "@repo/internationalization";

export default function Hero({ dictionary }: { dictionary: Dictionary }) {
  const { web } = dictionary;

  return (
<>
      <div className="w-full relative overflow-hidden text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <HeroContent dictionary={dictionary} />
        </div>
      </div><div className="w-full relative overflow-hidden text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <GetStartedSection dictionary={dictionary} />
        </div>
      </div>
    </>
  );
}