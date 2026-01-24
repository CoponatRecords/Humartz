import { Dictionary } from "@repo/internationalization";
import { UserCheck, Blocks, Link as LinkIcon, ShieldCheck } from "lucide-react";

type FeaturesProps = {
  dictionary: Dictionary;
};

export const Features = ({ dictionary }: FeaturesProps) => {
  const featureImages = [
    // 1. Expert Human Review (Studio Image)
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2000&auto=format&fit=crop",
    
    // 2. Cryptographic Proof (Blockchain/Nodes Image)
"https://www.chainalysis.com/wp-content/uploads/2022/08/shutterstock-2176242673-scaled-1-1500x970.jpg",   
    // 3. Public Verification URL (Your Selected Image)
    "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1000&auto=format&fit=crop",
    
    // 4. IP Protection (Security Lock Image)
    "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2000&auto=format&fit=crop",
  ];
  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col items-start gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="max-w-xl text-left font-regular text-3xl tracking-tighter md:text-5xl">
                {dictionary.web.home.features.title}
              </h2>
              <p className="max-w-xl text-left text-lg text-muted-foreground leading-relaxed tracking-tight lg:max-w-lg">
                {dictionary.web.home.features.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            
            {/* --- FEATURE 1: Expert Human Review (Large) --- */}
            <div className="group relative flex aspect-square h-full flex-col justify-between overflow-hidden rounded-md p-6 lg:col-span-2 lg:aspect-auto">
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${featureImages[0]}')` }}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 transition-opacity group-hover:bg-black/70" />
              
              {/* Content */}
              <div className="relative z-10 flex h-full flex-col justify-between text-white">
                <UserCheck className="h-8 w-8 stroke-1 text-orange-400" />
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl tracking-tight font-medium">
                    {dictionary.web.home.features.items[0].title}
                  </h3>
                  <p className="max-w-md text-base text-gray-200">
                    {dictionary.web.home.features.items[0].description}
                  </p>
                </div>
              </div>
            </div>

            {/* --- FEATURE 2: Cryptographic Proof (Standard) --- */}
            <div className="group relative flex aspect-square flex-col justify-between overflow-hidden rounded-md p-6">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${featureImages[1]}')` }}
              />
              <div className="absolute inset-0 bg-black/60 transition-opacity group-hover:bg-black/70" />
              
              <div className="relative z-10 flex h-full flex-col justify-between text-white">
                <Blocks className="h-8 w-8 stroke-1 text-orange-400" />
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl tracking-tight font-medium">
                    {dictionary.web.home.features.items[1].title}
                  </h3>
                  <p className="max-w-xs text-base text-gray-200">
                    {dictionary.web.home.features.items[1].description}
                  </p>
                </div>
              </div>
            </div>

            {/* --- FEATURE 3: Public Verification URL (Standard) --- */}
            <div className="group relative flex aspect-square flex-col justify-between overflow-hidden rounded-md p-6">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${featureImages[2]}')` }}
              />
              <div className="absolute inset-0 bg-black/60 transition-opacity group-hover:bg-black/70" />
              
              <div className="relative z-10 flex h-full flex-col justify-between text-white">
                <LinkIcon className="h-8 w-8 stroke-1 text-orange-400" />
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl tracking-tight font-medium">
                    {dictionary.web.home.features.items[2].title}
                  </h3>
                  <p className="max-w-xs text-base text-gray-200">
                    {dictionary.web.home.features.items[2].description}
                  </p>
                </div>
              </div>
            </div>

            {/* --- FEATURE 4: IP Protection (Large) --- */}
            <div className="group relative flex aspect-square h-full flex-col justify-between overflow-hidden rounded-md p-6 lg:col-span-2 lg:aspect-auto">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${featureImages[3]}')` }}
              />
              <div className="absolute inset-0 bg-black/70 transition-opacity group-hover:bg-black/80" />
              
              <div className="relative z-10 flex h-full flex-col justify-between text-white">
                <ShieldCheck className="h-8 w-8 stroke-1 text-orange-400" />
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl tracking-tight font-medium">
                    {dictionary.web.home.features.items[3].title}
                  </h3>
                  <p className="max-w-md text-base text-gray-200">
                    {dictionary.web.home.features.items[3].description}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};