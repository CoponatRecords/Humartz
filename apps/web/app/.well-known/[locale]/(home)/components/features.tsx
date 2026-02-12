import { Dictionary } from "@repo/internationalization";
import { UserCheck, Blocks, Link as LinkIcon, ShieldCheck } from "lucide-react";

type FeaturesProps = {
  dictionary: Dictionary;
};

export const Features = ({ dictionary }: FeaturesProps) => {
  const featureImages = [
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2000&auto=format&fit=crop",
    "https://iq.wiki/cdn-cgi/image/width=1080,quality=70/https://ipfs.everipedia.org/ipfs/QmYSdYU3F16T6tiz66nFVnHjyGeeTWNczx636Hv5iymfjf",
    "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2000&auto=format&fit=crop",
  ];

  return (
    <section className="w-full py-12 lg:py-16 flex items-center min-h-[90vh]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-8">
          {/* --- Header Section --- */}
          <div className="flex flex-col gap-3">
              <h2 className="max-w-xl text-left font-regular text-3xl tracking-tighter md:text-5xl">
              {dictionary.web.home.features.title}
            </h2>
            <p className="max-w-2xl text-left text-base md:text-lg text-muted-foreground leading-snug">
              {dictionary.web.home.features.description}
            </p>
          </div>

          {/* --- Grid Section --- */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:max-h-[600px]">
            
            {/* FEATURE 1: Expert Human Review */}
            <div className="group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-xl p-6 lg:col-span-2">
              <div 
                className="absolute inset-0 bg-cover bg-center duration-700 "
                style={{ backgroundImage: `url('${featureImages[0]}')` }}
              />
              <div className="absolute inset-0 bg-black/60 " />
              <div className="relative z-10 flex h-full flex-col justify-between text-white">
                <UserCheck className="h-7 w-7 text-orange-400" />
                <div>
                  <h3 className="text-lg font-semibold">{dictionary.web.home.features.items[0].title}</h3>
                  <p className="max-w-md text-sm text-gray-200 leading-relaxed">{dictionary.web.home.features.items[0].description}</p>
                </div>
              </div>
            </div>

            {/* FEATURE 2: Cryptographic Proof */}
            <div className="group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-xl p-6">
              <div 
                className="absolute inset-0 bg-cover bg-center "
                style={{ backgroundImage: `url('${featureImages[1]}')` }}
              />
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-opacity" />
              <div className="relative z-10 flex h-full flex-col justify-between text-white">
                <Blocks className="h-7 w-7 text-orange-400" />
                <div>
                  <h3 className="text-lg font-semibold">{dictionary.web.home.features.items[1].title}</h3>
                  <p className="text-sm text-gray-200 leading-relaxed">{dictionary.web.home.features.items[1].description}</p>
                </div>
              </div>
            </div>

            {/* FEATURE 3: Public Verification URL */}
            <div className="group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-xl p-6">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${featureImages[2]}')` }}
              />
              <div className="absolute inset-0 bg-black/60 " />
              <div className="relative z-10 flex h-full flex-col justify-between text-white">
                <LinkIcon className="h-7 w-7 text-orange-400" />
                <div>
                  <h3 className="text-lg font-semibold">{dictionary.web.home.features.items[2].title}</h3>
                  <p className="text-sm text-gray-200 leading-relaxed">{dictionary.web.home.features.items[2].description}</p>
                </div>
              </div>
            </div>

            {/* FEATURE 4: IP Protection */}
            <div className="group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-xl p-6 lg:col-span-2">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${featureImages[3]}')` }}
              />
              <div className="absolute inset-0 bg-black/70 " />
              <div className="relative z-10 flex h-full flex-col justify-between text-white">
                <ShieldCheck className="h-7 w-7 text-orange-400" />
                <div>
                  <h3 className="text-lg font-semibold">{dictionary.web.home.features.items[3].title}</h3>
                  <p className="max-w-md text-sm text-gray-200 leading-relaxed">{dictionary.web.home.features.items[3].description}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};