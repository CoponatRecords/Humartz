"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Search, X, Music, ArrowRight, Loader2, Disc, ChevronLeft, Fingerprint, Copy, Check, ShieldCheck, XCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@repo/design-system/lib/utils"; 
import { searchGlobal, type SearchResults } from "@backend/actions/search"; 
import { getMerkleProof } from "@backend/actions/verify"; 
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

// --- CONFIGURATION ---
const EXPECTED_ROOT = "0x06bbcd09bd0b4f87ee67a228640c6b71447ce0885ecfd6e7412b9ddb60ad6737";

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

// --- LOGO COMPONENT ---
const HumartzVerificationLogo = ({ status }: { status: string | null }) => {
  let colorClass = "text-orange-500"; 
  let displayLabel = "Pending";

  if (status === 'yes') {
    colorClass = "text-green-500";
    displayLabel = 'Certified Human Made';
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
  
  // Results for specific query
  const [results, setResults] = useState<SearchResults | null>(null);
  // Results for "Latest" (initial view)
  const [recentResults, setRecentResults] = useState<SearchResults | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  const [selectedItem, setSelectedItem] = useState<TrackResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // --- ACTIONS ---

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = async (trackId: number) => {
    setVerifyStatus('loading');
    try {
      const data = await getMerkleProof(trackId);
      const isValid = MerkleTree.verify(
        data.proof,
        data.leaf,
        EXPECTED_ROOT,
        keccak256,
        { sortPairs: true }
      );
      if (isValid) {
        setVerifyStatus('success');
      } else {
        setVerifyStatus('error');
      }
    } catch (err) {
      setVerifyStatus('error');
    }
  };

  // --- AUTOMATIC VERIFICATION TRIGGER ---
  useEffect(() => {
    if (selectedItem?.id && selectedItem.merkleLeaf && selectedItem.verificationStatus === 'yes') {
      handleVerify(selectedItem.id);
    } else {
      setVerifyStatus('idle');
    }
  }, [selectedItem]);

  // --- FETCH RECENT ON OPEN ---
  useEffect(() => {
    if (open && !recentResults) {
      setInitialLoading(true);
      // Calling search with empty string usually returns latest/all in many backends
      // If your backend requires a specific function (e.g. getLatest()), swap this out.
      searchGlobal("") 
        .then((data) => setRecentResults(data))
        .catch((err) => console.error("Failed to load recent", err))
        .finally(() => setInitialLoading(false));
    }
  }, [open, recentResults]);


  // --- HANDLE SEARCH INPUT ---
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

  // Clear Detail View on new search
  useEffect(() => {
    if (selectedItem && query) setSelectedItem(null);
  }, [query]);

  return (
    <SearchContext.Provider value={{ open, setOpen }}>
      {children}

      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] sm:pt-[15vh]">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-background/60 backdrop-blur-[2px] transition-all duration-100"
            onClick={() => setOpen(false)}
          />
          
          {/* Modal Container */}
          <div className="relative z-50 w-full max-w-lg overflow-hidden rounded-xl border border-white/10 bg-background/85 backdrop-blur-md shadow-2xl animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 flex flex-col max-h-[600px]">
            
            {/* Header */}
            <div className="flex items-center border-b border-white/10 px-3 py-2 shrink-0">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tracks, hashes..."
                className="flex h-10 w-full rounded-md bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                autoFocus={!selectedItem}
              />
              <button onClick={() => setOpen(false)} className="ml-2 opacity-70 hover:opacity-100 p-1">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto p-2 min-h-[300px]">
              
              {loading && (
                <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </div>
              )}

              {/* --- DETAIL VIEW --- */}
              {!loading && selectedItem ? (
                 <div className="animate-in slide-in-from-right-4 duration-200">
                    <button 
                        onClick={() => setSelectedItem(null)}
                        className="mb-4 flex items-center text-xs text-muted-foreground hover:text-foreground px-2 pt-2"
                    >
                        <ChevronLeft className="mr-1 h-3 w-3" /> Back
                    </button>

                    <div className="px-2 pb-4">
                        {/* Title & Status */}
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-semibold tracking-tight">{selectedItem.title}</h3>
                                <p className="text-sm text-muted-foreground">{selectedItem.artistName}</p>
                            </div>
                            <HumartzVerificationLogo status={selectedItem.verificationStatus} />
                        </div>

                        {/* Database Info */}
                        <div className="space-y-4 rounded-lg border bg-muted/30 p-4 text-sm">

                            <div className="flex flex-col gap-1">
                                <span className="flex items-center text-xs font-semibold text-muted-foreground uppercase">
                                <Fingerprint className="mr-1.5 h-3 w-3" /> Merkle Leaf
                                </span>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 break-all font-mono text-[10px] bg-background/50 p-2 rounded border text-muted-foreground">
                                        {selectedItem.merkleLeaf || "Pending"}
                                    </code>
                                    {selectedItem.merkleLeaf && (
                                      <button 
                                          onClick={() => copyToClipboard(selectedItem.merkleLeaf || "")}
                                          className="flex h-8 w-8 items-center justify-center rounded border bg-background/50 hover:bg-muted"
                                      >
                                          {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                                      </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* --- BLOCKCHAIN VERIFICATION SECTION --- */}
                        {/* {selectedItem.verificationStatus === 'yes' && (
                            <div className="mt-6 border-t pt-6">
                              <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3">Blockchain Verification</h4>

                              {verifyStatus === 'loading' && (
                                <div className="w-full flex items-center justify-center gap-2 rounded-md bg-muted/50 px-4 py-3 text-sm text-muted-foreground animate-pulse">
                                  <Loader2 className="h-4 w-4 animate-spin" /> 
                                  <span>Verifying cryptographic proof...</span>
                                </div>
                              )}

                              {verifyStatus === 'success' && (
                                <div className="w-full animate-in zoom-in-95 flex flex-col gap-1 rounded-md bg-green-500/10 border border-green-500/20 p-3">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                                        <ShieldCheck className="h-5 w-5" /> 
                                        Verified Match
                                    </div>
                                    <p className="text-[11px] text-green-600/80 pl-7">
                                        Cryptographically proven to be part of the official registry.
                                    </p>
                                </div>
                              )}

                              {verifyStatus === 'error' && (
                                <div className="w-full animate-in zoom-in-95 flex items-center justify-center gap-2 rounded-md bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm font-medium text-red-600">
                                  <XCircle className="h-4 w-4" /> 
                                  Verification Failed (Root Mismatch)
                                </div>
                              )}
                            </div>
                        )} */}
                    </div>
                 </div>
              ) : (
                /* --- LIST VIEW --- */
                <>
                

                  {/* Search Results State */}
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
    className="flex cursor-pointer items-center rounded-md px-2 py-3 text-sm hover:bg-white/10 transition-colors group"
  >
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted/50 mr-3">
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

const CommandLink = ({ href, setOpen, icon, children }: any) => (
  <Link href={href} onClick={() => setOpen(false)} className="flex items-center rounded-sm px-2 py-2 text-sm hover:bg-accent group">
    <span className="mr-3 flex h-4 w-4 items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">{icon}</span>
    {children}
  </Link>
);

export const SearchTrigger = ({ className, placeholder = "Search..." }: { className?: string; placeholder?: string }) => {
  const { setOpen } = useSearch();
  return (
    <button onClick={() => setOpen(true)} className={cn("group flex h-9 items-center gap-2 rounded-md border bg-muted/40 px-3 text-sm text-muted-foreground w-full md:w-[280px]", className)}>
      <Search className="h-4 w-4 opacity-50" />
      <span className="flex-1 text-left truncate">{placeholder}</span>
      <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] text-muted-foreground">
        <span className="text-xs">⌘</span>K
      </kbd>
    </button>
  );
};