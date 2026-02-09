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
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

export default async function DashboardPage() {
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

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.firstName || "Artist"} 👋
          </h2>
          <p className="text-muted-foreground">{user?.emailAddresses[0].emailAddress}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle>My Catalogue</CardTitle>
                <CardDescription>
                  You have {tracks.length} tracks in your library.
                </CardDescription>
              </div>
              <Button asChild size="sm">
                <Link href="/get-certified">New Certification</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tracks.length > 0 ? (
                tracks.map((track: { id: Key | null | undefined; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; isVerified: string; txHash: any; folderHash: string; }) => (
                  <div key={track.id} className="flex items-center gap-4 rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                    <div className="bg-primary/10 p-2 rounded-md">
                      <Music2Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{track.title}</p>
                      
                      <div className="flex items-center gap-2">
                        {track.isVerified === "yes" ? (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] flex items-center gap-1 text-green-600 font-bold uppercase">
                              <ShieldCheck className="h-3 w-3" /> Certified
                            </span>
                            {/* Optional: Small Arbiscan text link next to the badge */}
                            {track.txHash && (
                                <a 
                                  href={`${EXPLORER_BASE}${track.txHash}`} 
                                  target="_blank" 
                                  className="text-[9px] text-blue-500 hover:underline flex items-center"
                                >
                                  On-Chain <ExternalLink className="ml-0.5 h-2 w-2" />
                                </a>
                            )}
                          </div>
                        ):(<></>)}
                      </div>

                      <div className="flex items-center gap-2">
                        {track.isVerified === "pending" || track.isVerified === "PENDING" ? (
                          <span className="text-[10px] flex items-center gap-1 text-orange-600 font-bold uppercase">
                            <Clock className="h-3 w-3" /> Pending
                          </span>
                        ):(<></>)}
                      </div>

                      <div className="flex items-center gap-2">
                        {track.isVerified === "no" ? (
                          <span className="text-[10px] flex items-center gap-1 text-red-600 font-bold uppercase">
                            <ClipboardX className="h-3 w-3" /> Not Certified
                          </span>
                        ):(<></>)}
                      </div>
                    </div>

                    <div className="hidden sm:flex flex-col items-end gap-1 px-4 border-l h-8 justify-center">
                        <span className="text-[8px] uppercase text-muted-foreground font-bold flex items-center gap-1">
                           <Fingerprint className="h-2.5 w-2.5" /> Folder Hash
                        </span>
                        <code className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                           {track.folderHash ? `${track.folderHash.substring(0, 6)}...${track.folderHash.slice(-4)}` : "n/a"}
                        </code>
        
                    </div>

                    <div className="hidden sm:flex flex-col items-end gap-1 px-4 border-l h-8 justify-center">

                                      <span className="text-[8px] uppercase text-muted-foreground font-bold flex items-center gap-1">
                           <Fingerprint className="h-2.5 w-2.5" /> Blockchain Transaction
                        </span>
                          <code className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                           {track.txHash ? `${track.txHash.substring(0, 6)}...${track.txHash.slice(-4)}` : "n/a"}
                        </code>
                                            </div>


                    {/* ONLY DISPLAY ARROW IF TRANSACTION HASH EXISTS */}
                    {track.txHash ? (
                        <Button variant="ghost" size="icon" asChild>
                            <a href={`${EXPLORER_BASE}${track.txHash}`} target="_blank" rel="noopener noreferrer">
                                <ArrowUpRight className="h-4 w-4" />
                            </a>
                        </Button>
                    ) : (
                        <div className="w-9" /> // Empty space to maintain alignment
                    )}
                  </div>
                ))
              ) : (
                <div className="py-10 text-center border rounded-lg border-dashed">
                  <p className="text-sm text-muted-foreground">No tracks found. Start by certifying your first work.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="col-span-full lg:col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Database Overview</CardTitle>
                         <p className="text-xs text-muted-foreground italic pb-2">
Verification hashes (fingerprints) are immutably anchored to the Arbitrum L2 network.               </p>
            </CardHeader>
            <CardContent>
    

                           <div className="flex items-start gap-4 p-4  rounded-lg border bg-muted/30">
                             <ExternalLink className="h-5 w-5 text-primary shrink-0" />
                             <div className="overflow-hidden">
                               <p className="text-sm font-medium">Blockchain Address</p>
                               <a href={`https://arbiscan.io/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground hover:underline break-all">
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