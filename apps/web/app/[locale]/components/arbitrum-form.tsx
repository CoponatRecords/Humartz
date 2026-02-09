'use client';

import React, { useState } from "react";
import { Button, Input, Label } from "@repo/design-system";
import type { Dictionary } from "@repo/internationalization";
import { 
  Wallet, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Database,
  Fingerprint,
  Cloud 
} from "lucide-react";
import { BrowserProvider, Contract, Interface } from "ethers";

// Constants
const CONTRACT_ADDRESS = "0x9953BcE1F56b4bC1051321B394d2B6055c506619";
const R2_HOST_URL = "https://dash.cloudflare.com/ca283c02a398d33e182bde7f760eefd2/r2/default/buckets/humartz/"; // Replace with your actual R2 host URL
const CONTRACT_ABI = [
  "function setGreeting(string _greeting)",
  "function getGreeting() view returns (string)"
];

const ARBITRUM_CHAIN_ID = "0xa4b1"; 

type ArbitrumFormProps = { dictionary: Dictionary };

export const ArbitrumForm = ({ dictionary }: ArbitrumFormProps) => {
  // --- DATABASE & SUBMISSION STATE ---
  const [trackId, setTrackId] = useState(""); 
  const [dbStatus, setDbStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [greeting, setGreeting] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  // --- READ/VERIFY STATE ---
  const [readHash, setReadHash] = useState("");
  const [readResult, setReadResult] = useState<string | null>(null);
  const [readTxLink, setReadTxLink] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [readError, setReadError] = useState<string | null>(null);

  // API Helper
  const updateDatabaseWithHash = async (id: string, hash: string) => {
    setDbStatus("saving");
    try {
      const res = await fetch("/api/tracks/update-tx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackId: id, transactionHash: hash }),
      });
      if (!res.ok) throw new Error("DB update failed");
      setDbStatus("saved");
    } catch (err) {
      setDbStatus("error");
    }
  };

  const submitGreeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackId) {
        setErrorMessage("Please enter a valid Track ID.");
        return;
    }
    setErrorMessage(null);
    setIsLoading(true);

    if (!window.ethereum) {
      setErrorMessage("No wallet found.");
      setIsLoading(false);
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ARBITRUM_CHAIN_ID }],
      });

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.setGreeting(greeting);
      setTxHash(tx.hash);
      await tx.wait();

      // Sync to DB
      await updateDatabaseWithHash(trackId, tx.hash);
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err?.reason || err?.message || "Transaction failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const readGreetingByTxHash = async (e: React.FormEvent) => {
    e.preventDefault();
    setReadError(null);
    setIsReading(true);
    try {
      const provider = new (window as any).ethers.JsonRpcProvider("https://arb1.arbitrum.io/rpc");
      const tx = await provider.getTransaction(readHash);
      if (!tx) throw new Error("Transaction not found");
      const iface = new Interface(CONTRACT_ABI);
      const parsed = iface.decodeFunctionData("setGreeting", tx.data);
      setReadResult(parsed[0]);
      setReadTxLink(`https://arbiscan.io/tx/${readHash}`);
    } catch (err: any) {
      setReadError("Failed to find or decode transaction.");
    } finally {
      setIsReading(false);
    }
  };

  return (
    <div className="w-full py-12 lg:py-24">
      <div className="container mx-auto max-w-6xl px-4 grid gap-10 lg:grid-cols-2">
        
        {/* LEFT COLUMN: INFO & STATUS */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h4 className="text-3xl md:text-5xl font-bold tracking-tighter">Blockchain Proof</h4>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Submit your proof folder hash to the Arbitrum blockchain to establish a permanent, immutable timestamp.
            </p>
          </div>

          <div className="space-y-4">
            {/* CONTRACT ADDRESS BOX */}
            <div className="flex items-start gap-4 p-4 rounded-lg border bg-muted/30">
              <ExternalLink className="h-5 w-5 text-primary shrink-0" />
              <div className="overflow-hidden">
                <p className="text-sm font-medium">Contract Address</p>
                <a href={`https://arbiscan.io/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground hover:underline break-all">
                  {CONTRACT_ADDRESS}
                </a>
              </div>
            </div>

            {/* R2 HOST QUICK ACCESS BOX */}
            <div className="flex items-start gap-4 p-4 rounded-lg border bg-muted/30">
              <Cloud className="h-5 w-5 text-orange-400 shrink-0" />
              <div className="overflow-hidden">
                <p className="text-sm font-medium">R2 Storage Host</p>
                <a href={R2_HOST_URL} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground hover:underline break-all">
                  {R2_HOST_URL.replace("https://", "")}
                </a>
              </div>
            </div>

            {/* DB SYNC STATUS BOX */}
            {dbStatus === "saved" && (
              <div className="flex items-start gap-4 p-4 rounded-lg border border-blue-200 bg-blue-50/50">
                <Database className="h-5 w-5 text-blue-600 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Database Synchronized</p>
                  <p className="text-xs text-blue-600">The transaction hash is now linked to track ID: {trackId}</p>
                </div>
              </div>
            )}

            {txHash && (
              <div className="flex items-start gap-4 p-4 rounded-lg border border-green-200 bg-green-50/50">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-green-800">Transaction Confirmed</p>
                  <a href={`https://arbiscan.io/tx/${txHash}`} target="_blank" rel="noreferrer" className="text-xs text-green-700 hover:underline break-all">
                    View on Arbiscan
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: FORMS */}
        <div className="flex flex-col gap-6">
          
          {/* SUBMIT FORM */}
          <div className="p-6 border rounded-xl bg-card shadow-sm">
            {isSuccess ? (
              <div className="text-center py-6 space-y-4">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
                <h3 className="text-xl font-bold">Hash Anchored!</h3>
                <Button variant="outline" onClick={() => { setIsSuccess(false); setGreeting(""); setDbStatus("idle"); }}>
                  New Submission
                </Button>
              </div>
            ) : (
              <form onSubmit={submitGreeting} className="space-y-4">
                <div className="flex items-center gap-2 border-b pb-2 mb-4">
                  <Wallet className="h-5 w-5 text-primary" />
                  <span className="font-bold uppercase text-xs tracking-widest text-muted-foreground">Submit Proof</span>
                </div>
                
                <div className="space-y-3">
                    <div className="space-y-1">
                        <Label className="text-[10px] uppercase text-muted-foreground">Track ID (From Dashboard)</Label>
                        <Input placeholder="Enter internal ID..." value={trackId} onChange={(e) => setTrackId(e.target.value)} required />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-[10px] uppercase text-muted-foreground">Folder Hash</Label>
                        <Input placeholder="Data to write..." value={greeting} onChange={(e) => setGreeting(e.target.value)} required />
                    </div>
                </div>

                {errorMessage && (
                  <div className="flex items-center gap-2 p-3 text-xs bg-destructive/10 text-destructive rounded-lg">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {errorMessage}
                  </div>
                )}
                
                <Button className="w-full py-6 text-md" type="submit" disabled={isLoading || dbStatus === "saving"}>
                  {isLoading ? <Loader2 className="animate-spin" /> : dbStatus === "saving" ? "Syncing DB..." : "Sign & Anchor Proof"}
                </Button>
              </form>
            )}
          </div>

          {/* READ FORM */}
          <div className="p-6 border rounded-xl bg-card shadow-sm">
            <form onSubmit={readGreetingByTxHash} className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2 mb-4">
                <Fingerprint className="h-5 w-5 text-primary" />
                <span className="font-bold uppercase text-xs tracking-widest text-muted-foreground">Verify Transaction</span>
              </div>
              <Input placeholder="Transaction hash..." value={readHash} onChange={(e) => setReadHash(e.target.value)} required />
              <Button variant="secondary" className="w-full" type="submit" disabled={isReading}>
                {isReading ? <Loader2 className="animate-spin" /> : "Read Data"}
              </Button>
              {readError && <p className="text-xs text-destructive">{readError}</p>}
              {readResult && (
                <div className="p-3 bg-muted rounded-lg text-sm break-all">
                  <span className="font-bold block mb-1">Decoded Data:</span>
                  {readResult}
                </div>
              )}
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};