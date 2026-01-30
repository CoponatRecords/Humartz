'use client';

import React, { useState } from "react";
import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import { Label } from "@repo/design-system/components/ui/label";
import type { Dictionary } from "@repo/internationalization";
import { Wallet, Loader2, CheckCircle2, AlertCircle, MoveRight, ExternalLink } from "lucide-react";
import { BrowserProvider, Contract, Interface } from "ethers";

const CONTRACT_ADDRESS = "0x9953BcE1F56b4bC1051321B394d2B6055c506619";
const CONTRACT_ABI = [
  "function setGreeting(string _greeting)",
  "function getGreeting() view returns (string)"
];

const ARBITRUM_CHAIN_ID = "0xa4b1"; // 42161 in hex

type ArbitrumFormProps = { dictionary: Dictionary };

export const ArbitrumForm = ({ dictionary }: ArbitrumFormProps) => {
  const [greeting, setGreeting] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const [readHash, setReadHash] = useState("");
  const [readResult, setReadResult] = useState<string | null>(null);
  const [readTxLink, setReadTxLink] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [readError, setReadError] = useState<string | null>(null);

  const submitGreeting = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    // 1. MOBILE DEEP LINKING LOGIC
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile && !window.ethereum) {
      const dappUrl = window.location.href.split("//")[1];
      window.location.href = `https://metamask.app.link/dapp/${dappUrl}`;
      setIsLoading(false);
      return;
    }

    // 2. DESKTOP/INTERNAL BROWSER CHECK
    if (!window.ethereum) {
      setErrorMessage("No wallet found. Please use the MetaMask app browser.");
      setIsLoading(false);
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      
      // 3. AUTO-NETWORK SWITCH
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: ARBITRUM_CHAIN_ID }],
        });
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: ARBITRUM_CHAIN_ID,
              chainName: 'Arbitrum One',
              rpcUrls: ['https://arb1.alphaknight.com/rpc'],
              nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
              blockExplorerUrls: ['https://arbiscan.io']
            }],
          });
        } else {
          throw switchError;
        }
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.setGreeting(greeting);
      setTxHash(tx.hash);
      await tx.wait();

      setIsSuccess(true);
    } catch (err: any) {
      console.error(err);
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
      // Use a public RPC provider if window.ethereum isn't present for reading
      const provider = window.ethereum 
        ? new BrowserProvider(window.ethereum) 
        : new BrowserProvider(new (window as any).ethers.JsonRpcProvider("https://arb1.arbitrum.io/rpc"));
      
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
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h4 className="text-3xl md:text-5xl font-bold tracking-tighter">Blockchain Proof</h4>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Submit your proof folder hash to the Arbitrum blockchain to establish a permanent, immutable timestamp.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-lg border bg-muted/30">
              <ExternalLink className="h-5 w-5 text-primary shrink-0" />
              <div className="overflow-hidden">
                <p className="text-sm font-medium">Contract Address</p>
                <a href={`https://arbiscan.io/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground hover:underline break-all">
                  {CONTRACT_ADDRESS}
                </a>
              </div>
            </div>

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

        <div className="flex flex-col gap-6">
          <div className="p-6 border rounded-xl bg-card shadow-sm">
            {isSuccess ? (
              <div className="text-center py-6 space-y-4">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
                <h3 className="text-xl font-bold">Hash Anchored!</h3>
                <Button variant="outline" onClick={() => { setIsSuccess(false); setGreeting(""); }}>
                  New Submission
                </Button>
              </div>
            ) : (
              <form onSubmit={submitGreeting} className="space-y-4">
                <div className="flex items-center gap-2 border-b pb-2 mb-4">
                  <Wallet className="h-5 w-5 text-primary" />
                  <span className="font-bold uppercase text-xs tracking-widest text-muted-foreground">Submit Proof Folder Hash</span>
                </div>
                <div className="space-y-2">
                  <Input 
                    id="greeting" 
                    placeholder="Data to write on the blockchain..." 
                    value={greeting} 
                    onChange={(e) => setGreeting(e.target.value)} 
                    required 
                  />
                </div>
                {errorMessage && (
                  <div className="flex items-center gap-2 p-3 text-xs bg-destructive/10 text-destructive rounded-lg">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {errorMessage}
                  </div>
                )}
                <Button className="w-full py-6 text-md" type="submit" disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin" /> : "Sign & Anchor Proof"}
                </Button>
              </form>
            )}
          </div>

          <div className="p-6 border rounded-xl bg-card shadow-sm">
            <form onSubmit={readGreetingByTxHash} className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2 mb-4">
                <ExternalLink className="h-5 w-5 text-primary" />
                <span className="font-bold uppercase text-xs tracking-widest text-muted-foreground">Verify Transaction</span>
              </div>
              <Input 
                placeholder="Transaction hash..." 
                value={readHash} 
                onChange={(e) => setReadHash(e.target.value)} 
                required 
              />
              <Button variant="secondary" className="w-full" type="submit" disabled={isReading}>
                {isReading ? <Loader2 className="animate-spin" /> : "Read Data"}
              </Button>
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