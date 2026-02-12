"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Search, X, Music, ArrowRight, Loader2, Disc, ChevronLeft, Fingerprint, Copy, Check, ShieldCheck, XCircle, Sparkles, Library } from "lucide-react";
import Link from "next/link";
import { cn } from "@repo/design-system"; 
import { searchGlobal, type SearchResults } from "@backend/actions/search"; 

// --- TYPES ---
type TrackResult = SearchResults['tracks'][0] & { merkleLeaf?: string | null };

type SearchContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) throw new Error("useSearch must be used within a SearchProvider");
  return context;
};

// --- LOGO COMPONENT (Restored original colors) ---
const HumartzVerificationLogo = ({ status }: { status: string | null }) => {
  let colorClass = "text-orange-500"; 
  let displayLabel = "Pending";

  if (status === 'yes') {
    colorClass = "text-green-500";
    displayLabel = 'Humartz Certified';
  } else if (status === 'no') {
    colorClass = "text-red-500";
    displayLabel = 'Made by AI';
  } else if (status === null ) {
    colorClass = "text-orange-500";
    displayLabel = 'Pending Verification';
  }

  return (
    <div className={cn("ml-2 flex items-center gap-x-1.5", colorClass)} title={`Verification: ${displayLabel}`}>
      <span className="text-[10px] font-bold uppercase tracking-wide opacity-90 hidden sm:block">
        {displayLabel}
      </span>
      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
        <path d="M12 2C7.5 2 4 5.5 4 10V16C4 16.55 4.45 17 5 17C5.55 17 6 16.55 6 16V10C6 6.5 8.5 4 12 4C15.5 4 18 6.5 18 10V18C18 18.55 18.45 19 19 19C19.55 19 20 18.55 20 18V10C20 5.5 16.5 2 12 2ZM12 6C9.5 6 7.5 8 7.5 10.5V17C7.5 17.55 7.95 18 8.5 18C9.05 18 9.5 17.55 9.5 17V10.5C9.5 9 10.5 8 12 8C13.5 8 14.5 9 14.5 10.5V16C14.5 16.55 14.95 17 15.5 17C16.05 17 16.5 16.55 16.5 16V10.5C16.5 8 14.5 6 12 6ZM12 10C11.5 10 11 10.5 11 11V16C11 16.55 11.45 17 12 17C12.55 17 13 16.55 13 16V11C13 10.5 12.5 10 12 10Z" />
      </svg>
    </div>
  );
};


// --- THE PROVIDER ---
export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TrackResult | null>(null);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (query.length < 2) {
        setResults(null);
        return;
      }
      setLoading(true);
      try {
        const data = await searchGlobal(query);
        setResults(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  return (
    <SearchContext.Provider value={{ open, setOpen }}>
      {children}

      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] sm:pt-[15vh]">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-all duration-100"
            onClick={() => setOpen(false)}
          />
          
          {/* Modal Container */}
          <div className="relative z-50 w-full max-w-lg overflow-hidden rounded-xl border border-border bg-background shadow-2xl animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 flex flex-col max-h-[600px]">
            
            {/* Header */}
            <div className="flex items-center border-b border-border px-3 py-2 shrink-0">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Art name, artist, hash..."
                className="flex h-10 w-full rounded-md bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                autoFocus={!selectedItem}
              />
              <button onClick={() => setOpen(false)} className="ml-2 opacity-70 hover:opacity-100 p-1">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto p-2 min-h-[200px]">
              {loading && (
                <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </div>
              )}

              {!loading && selectedItem ? (
                 <div className="animate-in slide-in-from-right-4 duration-200">
                    <button 
                        onClick={() => setSelectedItem(null)}
                        className="mb-4 flex items-center text-xs text-muted-foreground hover:text-foreground px-2 pt-2"
                    >
                        <ChevronLeft className="mr-1 h-3 w-3" /> Back
                    </button>

                    <div className="px-2 pb-4">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-semibold tracking-tight">{selectedItem.title}</h3>
                                <p className="text-sm text-muted-foreground">{selectedItem.artistName}</p>
                            </div>
                            <HumartzVerificationLogo status={selectedItem.verificationStatus} />
                        </div>

                        <div className="space-y-4 rounded-lg border bg-muted/30 p-4 text-sm">
                            <div className="flex flex-col gap-1">
                                <span className="flex items-center text-xs font-semibold text-muted-foreground uppercase">
                                <Fingerprint className="mr-1.5 h-3 w-3" /> Proof Hash
                                </span>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 break-all font-mono text-[10px] bg-background p-2 rounded border text-muted-foreground">
                                        {selectedItem.merkleLeaf || "Pending"}
                                    </code>
                                    {selectedItem.merkleLeaf && (
                                      <button 
                                          onClick={() => copyToClipboard(selectedItem.merkleLeaf || "")}
                                          className="flex h-8 w-8 items-center justify-center rounded border bg-background hover:bg-muted transition-colors"
                                      >
                                          {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                                      </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>
              ) : (
                <>
                  {results && (
                    <>
                      <div className="mb-2 mt-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Search Results
                      </div>
                      {results.tracks.map((track) => (
                        <TrackItem 
                          key={track.id} 
                          track={track} 
                          onClick={() => { setSelectedItem(track); setCopied(false); }} 
                        />
                      ))}
                    </>
                  )}
                </>
              )}
            </div>

            {/* --- GET CERTIFIED FOOTER (B/W Design) --- */}
            <div className="border-t border-border p-3 bg-muted/10 shrink-0">
              <Link 
                href="/get-certified" 
                onClick={() => setOpen(false)}
                className="flex items-center justify-between w-full group rounded-lg border border-border bg-background px-4 py-3 text-sm transition-all hover:bg-secondary/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/5 text-foreground">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-foreground">Get Certified</div>
                    <div className="text-[11px] text-muted-foreground">Verify your tracks on the registry</div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
              </Link>
            </div>

          </div>
        </div>
      )}
    </SearchContext.Provider>
  );
};

// --- Helper Components ---

const TrackItem = ({ track, onClick }: { track: any, onClick: () => void }) => (
  <div 
    onClick={onClick}
    className="flex cursor-pointer items-center rounded-md px-2 py-3 text-sm hover:bg-muted transition-colors group"
  >
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted mr-3">
        <Disc className="h-4 w-4 text-muted-foreground" />
    </div>
    <div className="flex w-full items-center justify-between pr-2 min-w-0">
      <span className="flex flex-col truncate">
        <span className="font-medium truncate text-foreground">{track.title}</span>
        <span className="text-xs text-muted-foreground truncate">{track.artistName}</span>
      </span>
      <div className="shrink-0">
          <HumartzVerificationLogo status={track.verificationStatus} />
      </div>
    </div>
  </div>
);

export const SearchTrigger = ({ className, placeholder = "Search..." }: { className?: string; placeholder?: string }) => {
  const { setOpen } = useSearch();
  return (
    <button onClick={() => setOpen(true)} className={cn("group flex h-9 items-center gap-2 rounded-md border bg-muted/40 px-3 text-sm text-muted-foreground w-full md:w-[280px]", className)}>
      <Search className="h-4 w-4 opacity-50" />
      <span className="flex-1 text-left truncate">{placeholder}</span>
      <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] text-muted-foreground">
    <Library className="h-3 w-3" />
      </kbd>
    </button>
  );
};