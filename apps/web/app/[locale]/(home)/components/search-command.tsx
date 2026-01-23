"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Search, X, Music, FileText, CheckCircle, ArrowRight, Loader2, Disc, Mic2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@repo/design-system/lib/utils"; 
// Adjust this import path if needed based on your file structure
import { searchGlobal, type SearchResults } from "../../../../backend/actions/search"; 

// --- 1. CONTEXT SETUP ---
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

// --- Utility: Debounce Hook ---
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// --- NEW COMPONENT: Your Custom Logo Logic ---
const HumartzVerificationLogo = ({ status }: { status: string | null }) => {
  let colorClass = "text-orange-500"; // Default (null/pending) -> Orange

  if (status === 'yes') {
    colorClass = "text-green-500";
  } else if (status === 'no') {
    colorClass = "text-red-500";
  }

  return (
    <div className={cn("ml-2 flex items-center justify-center", colorClass)} title={`Verification: ${status || 'Pending'}`}>
      <svg
        className="h-4 w-4 fill-current" // Using standard size 4 (16px)
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Humartz Fingerprint</title>
        <path
          d="M12 2C7.5 2 4 5.5 4 10V16C4 16.55 4.45 17 5 17C5.55 17 6 16.55 6 16V10C6 6.5 8.5 4 12 4C15.5 4 18 6.5 18 10V18C18 18.55 18.45 19 19 19C19.55 19 20 18.55 20 18V10C20 5.5 16.5 2 12 2ZM12 6C9.5 6 7.5 8 7.5 10.5V17C7.5 17.55 7.95 18 8.5 18C9.05 18 9.5 17.55 9.5 17V10.5C9.5 9 10.5 8 12 8C13.5 8 14.5 9 14.5 10.5V16C14.5 16.55 14.95 17 15.5 17C16.05 17 16.5 16.55 16.5 16V10.5C16.5 8 14.5 6 12 6ZM12 10C11.5 10 11 10.5 11 11V16C11 16.55 11.45 17 12 17C12.55 17 13 16.55 13 16V11C13 10.5 12.5 10 12 10Z"
        />
      </svg>
    </div>
  );
};

// --- 2. THE PROVIDER ---
export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle CMD+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Reset state on close
  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults(null);
    }
  }, [open]);

  // Perform Search
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedQuery.length < 2) {
        setResults(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await searchGlobal(debouncedQuery);
        setResults(data);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  return (
    <SearchContext.Provider value={{ open, setOpen }}>
      {children}

      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] sm:pt-[15vh]">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-all duration-100"
            onClick={() => setOpen(false)}
          />
          
          {/* Dialog */}
          <div className="relative z-50 w-full max-w-lg overflow-hidden rounded-xl border bg-background shadow-2xl animate-in fade-in-0 zoom-in-95 slide-in-from-top-2">
            
            {/* Input Header */}
            <div className="flex items-center border-b px-3 py-1">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tracks, artists..."
                className="flex h-12 w-full rounded-md bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                autoFocus
              />
              <button 
                onClick={() => setOpen(false)}
                className="ml-2 rounded-sm opacity-70 hover:opacity-100 focus:outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Results Body */}
            <div className="max-h-[300px] overflow-y-auto p-2">
              
              {/* LOADING */}
              {loading && (
                <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </div>
              )}

              {/* DEFAULT VIEW (No Query) */}
              {!query && !results && !loading && (
                <>
                  <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Platform
                  </div>
                  <CommandLink href="/" setOpen={setOpen} icon={<Music className="h-4 w-4" />}>
                    Home
                  </CommandLink>
                  <CommandLink href="/docs" setOpen={setOpen} icon={<FileText className="h-4 w-4" />}>
                    Documentation
                  </CommandLink>
                  <CommandLink href="/verify" setOpen={setOpen} icon={<CheckCircle className="h-4 w-4" />}>
                    Verify a Track
                  </CommandLink>
                  <div className="mt-4 mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Support
                  </div>
                  <CommandLink href="/contact" setOpen={setOpen} icon={<ArrowRight className="h-4 w-4" />}>
                    Contact Sales
                  </CommandLink>
                </>
              )}

              {/* SEARCH RESULTS */}
              {results && (
                <>
                  {/* Tracks */}
                  {results.tracks.length > 0 && (
                    <>
                      <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Tracks
                      </div>
                      {results.tracks.map((track) => (
                        <CommandLink 
                          key={track.id} 
                          href={`/track/${track.slug}`} 
                          setOpen={setOpen} 
                          icon={<Disc className="h-4 w-4" />}
                        >
                          <div className="flex w-full items-center justify-between pr-2">
                            <span className="flex flex-col truncate">
                              <span className="font-medium">{track.title}</span>
                              <span className="text-xs text-muted-foreground">{track.artistName}</span>
                            </span>
                            
                            {/* HUMARTZ LOGO BADGE */}
                            <HumartzVerificationLogo status={track.verificationStatus} />
                          </div>
                        </CommandLink>
                      ))}
                    </>
                  )}

                  {/* Artists */}
                  {results.artists.length > 0 && (
                    <>
                      <div className="mt-2 mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Artists
                      </div>
                      {results.artists.map((artist) => (
                        <CommandLink 
                          key={artist.id} 
                          href={`/artist/${artist.slug}`} 
                          setOpen={setOpen} 
                          icon={<Mic2 className="h-4 w-4" />}
                        >
                          <div className="flex w-full items-center justify-between pr-2">
                            <span className="font-medium">{artist.name}</span>

                            {/* HUMARTZ LOGO BADGE (Optional for Artists) */}
                            {/* If artists don't have verificationStatus yet, this will default to orange */}
                            {artist.verificationStatus !== undefined && (
                               <HumartzVerificationLogo status={artist.verificationStatus} />
                            )}
                          </div>
                        </CommandLink>
                      ))}
                    </>
                  )}

                  {/* Empty State */}
                  {results.tracks.length === 0 && results.artists.length === 0 && !loading && (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      No results found for "{query}".
                    </div>
                  )}
                </>
              )}
            </div>
            
            {/* Footer */}
            <div className="flex items-center justify-between border-t bg-muted/20 px-4 py-2 text-xs text-muted-foreground">
              <span>Search powered by Humartz</span>
              <div className="flex gap-2">
                <span className="hidden sm:inline">Select &uarr;&darr;</span>
                <span className="hidden sm:inline">Open &crarr;</span>
                <span className="sm:hidden">Tap to select</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </SearchContext.Provider>
  );
};

// --- 3. THE TRIGGER BUTTON ---
export const SearchTrigger = ({ className, placeholder = "Search..." }: { className?: string; placeholder?: string }) => {
  const { setOpen } = useSearch();

  return (
    <button
      onClick={() => setOpen(true)}
      className={cn(
        "group relative flex h-9 items-center gap-2 rounded-md border bg-muted/40 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground w-full md:w-[280px] whitespace-nowrap",
        className
      )}
    >
      <Search className="h-4 w-4 opacity-50 shrink-0" />
      <span className="flex-1 text-left truncate">{placeholder}</span>
      <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 text-muted-foreground shrink-0">
        <span className="text-xs">⌘</span>K
      </kbd>
    </button>
  );
};

// --- Helper Component ---
const CommandLink = ({ href, setOpen, icon, children }: any) => (
  <Link
    href={href}
    onClick={() => setOpen(false)}
    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground group transition-colors"
  >
    <span className="mr-3 flex h-4 w-4 items-center justify-center text-muted-foreground group-hover:text-primary transition-colors shrink-0">
      {icon}
    </span>
    <div className="flex-1 min-w-0">{children}</div>
  </Link>
);