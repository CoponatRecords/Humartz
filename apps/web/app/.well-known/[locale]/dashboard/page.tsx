import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma as database } from "@repo/database";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  Button 
} from "@repo/design-system";
import { Music2Icon, ArrowUpRight, ShieldCheck, Clock, ClipboardX, Fingerprint, ExternalLink } from "lucide-react";
import Link from "next/link";
import { getDictionary } from "@repo/internationalization";
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react";

type DashboardProps = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardPage({ params }: DashboardProps) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  const t = dictionary.web?.dashboard;

  if (!t) {
    // Fallback – in production you might want better error handling
    return <div>Error loading translations</div>;
  }

  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect("/sign-in");
  }

  const tracks = await database.track.findMany({
    where: {
      authorId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Explorer URL - change to 'sepolia.arbiscan.io' if on testnet
  const EXPLORER_BASE = "https://arbiscan.io/tx/";
  const CONTRACT_ADDRESS = "0x9953BcE1F56b4bC1051321B394d2B6055c506619";

  // Simple plural helper (you can replace with a real i18n plural function)
  const catalogueDesc = tracks.length === 1 
    ? t.catalogueDescription_one 
    : t.catalogueDescription_other.replace("{count}", tracks.length.toString());

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {t.welcome}, {user?.firstName || t.noNameFallback} 👋
          </h2>
          <p className="text-muted-foreground">
            {user?.emailAddresses?.[0]?.emailAddress}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle>{t.myCatalogue}</CardTitle>
                <CardDescription>{catalogueDesc}</CardDescription>
              </div>
              <Button asChild size="sm">
                <Link href="/get-certified">
                  {t.newCertification} <ArrowUpRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tracks.length > 0 ? (
                tracks.map((track: {
                  artistName: any; id: Key | null | undefined; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; isVerified: string; txHash: string; folderHash: string; 
}) => (
                  <div 
                    key={track.id} 
                    className="flex items-center gap-4 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="bg-primary/10 p-2 rounded-md">
                      <Music2Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{track.title}</p>
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        {track.isVerified === "yes" ? (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] flex items-center gap-1 text-green-600 font-bold uppercase">
                              <ShieldCheck className="h-3 w-3" /> {t.certified}
                            </span>
                            {track.txHash && (
                              <a 
                                href={`${EXPLORER_BASE}${track.txHash}`} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[9px] text-blue-500 hover:underline flex items-center"
                              >
                                On-Chain <ExternalLink className="ml-0.5 h-2 w-2" />
                              </a>
                            )}
                          </div>
                        ) : null}

                        {track.isVerified === "pending" || track.isVerified === "PENDING" ? (
                          <span className="text-[10px] flex items-center gap-1 text-orange-600 font-bold uppercase">
                            <Clock className="h-3 w-3" /> {t.pending}
                          </span>
                        ) : null}

                        {track.isVerified === "no" ? (
                          <span className="text-[10px] flex items-center gap-1 text-red-600 font-bold uppercase">
                            <ClipboardX className="h-3 w-3" /> {t.notCertified}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="hidden sm:flex flex-col items-end gap-1 px-4 border-l h-8 justify-center">
                      <span className="text-[8px] uppercase text-muted-foreground font-bold flex items-center gap-1">
                        <Fingerprint className="h-2.5 w-2.5" /> {t.folderHashLabel}
                      </span>
                      <code className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        {track.folderHash 
                          ? `${track.folderHash.substring(0, 6)}...${track.folderHash.slice(-4)}` 
                          : "n/a"}
                      </code>
                    </div>

                    <div className="hidden sm:flex flex-col items-end gap-1 px-4 border-l h-8 justify-center">
                      <span className="text-[8px] uppercase text-muted-foreground font-bold flex items-center gap-1">
                        <Fingerprint className="h-2.5 w-2.5" /> Artist Name
                      </span>
                      <code className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        {track.artistName 
                          ? `${track.artistName.substring(0, 6)}...${track.artistName.slice(-4)}` 
                          : "n/a"}
                      </code>
                    </div>


                    <div className="hidden sm:flex flex-col items-end gap-1 px-4 border-l h-8 justify-center">
                      <span className="text-[8px] uppercase text-muted-foreground font-bold flex items-center gap-1">
                        <Fingerprint className="h-2.5 w-2.5" /> {t.txHashLabel}
                      </span>
                      <code className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        {track.txHash 
                          ? `${track.txHash.substring(0, 6)}...${track.txHash.slice(-4)}` 
                          : "n/a"}
                      </code>
                    </div>

                                

                    {track.txHash ? (
                      <Button variant="ghost" size="icon" asChild>
                        <a 
                          href={`${EXPLORER_BASE}${track.txHash}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      </Button>
                    ) : (
                      <div className="w-9" /> // spacer
                    )}
                  </div>
                ))
              ) : (
                <div className="py-10 text-center border rounded-lg border-dashed">
                  <p className="text-sm text-muted-foreground">{t.noTracks}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="col-span-full lg:col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">{t.databaseOverview}</CardTitle>
              <p className="text-xs text-muted-foreground italic pb-2">
                {t.verificationNote}
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4 p-4 rounded-lg border bg-muted/30">
                <ExternalLink className="h-5 w-5 text-primary shrink-0" />
                <div className="overflow-hidden">
                  <p className="text-sm font-medium">{t.blockchainAddress}</p>
                  <a 
                    href={`https://arbiscan.io/address/${CONTRACT_ADDRESS}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-xs text-muted-foreground hover:underline break-all"
                  >
                    {CONTRACT_ADDRESS}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}