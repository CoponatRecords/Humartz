'use client';

import React, { useState } from "react";
import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import { Label } from "@repo/design-system/components/ui/label";
import type { Dictionary } from "@repo/internationalization";
import { Wallet, Loader2, CheckCircle2, AlertCircle, MoveRight, ExternalLink } from "lucide-react";
import { Interface } from "ethers/lib/utils";

// Contract Constants
const CONTRACT_ADDRESS = "0x9953BcE1F56b4bC1051321B394d2B6055c506619";
const CONTRACT_ABI = [
  "function setGreeting(string _greeting)",
  "function getGreeting() view returns (string)"
];

type ArbitrumFormProps = { dictionary: Dictionary };

export const ArbitrumForm = ({ dictionary }: ArbitrumFormProps) => {
  // WRITE STATE
  const [greeting, setGreeting] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  // READ STATE
  const [readHash, setReadHash] = useState("");
  const [readResult, setReadResult] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [readError, setReadError] = useState<string | null>(null);

  // WRITE FUNCTION
  const submitGreeting = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);
    setTxHash(null);

    if (!window.ethereum) {
      setErrorMessage("No wallet found. Please install Metamask.");
      setIsLoading(false);
      return;
    }

    try {
      const { BrowserProvider, Contract } = await import("ethers");
      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);

      const network = await provider.getNetwork();
      if (network.chainId !== 42161n) {
        setErrorMessage("Please switch your wallet to the Arbitrum network.");
        setIsLoading(false);
        return;
      }

      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.setGreeting(greeting);
      setTxHash(tx.hash);
      await tx.wait();

      setIsSuccess(true);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.reason || "Transaction failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // READ FUNCTION BY TX HASH
  const readGreetingByTxHash = async (e: React.FormEvent) => {
    e.preventDefault();
    setReadError(null);
    setReadResult(null);
    setIsReading(true);

    if (!window.ethereum) {
      setReadError("No wallet found. Please install Metamask.");
      setIsReading(false);
      return;
    }

    try {
      const { BrowserProvider } = await import("ethers");
      const provider = new BrowserProvider(window.ethereum);

      // Fetch transaction
      const tx = await provider.getTransaction(readHash);
      if (!tx) throw new Error("Transaction not found");

      // Decode the input using the ABI
      const iface = new Interface(CONTRACT_ABI);
      const decoded = iface.decodeFunctionData("setGreeting", tx.data);
      setReadResult(decoded._greeting);

    } catch (err: any) {
      console.error(err);
      setReadError(err.message || "Failed to decode transaction");
    } finally {
      setIsReading(false);
    }
  };

  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto max-w-6xl grid gap-10 lg:grid-cols-2">

        {/* LEFT SIDE: Contract Info & Results */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h4 className="text-3xl md:text-5xl font-regular tracking-tighter">On-Chain Interaction</h4>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-sm">
              Securely write and read data on the Arbitrum L2 network. Ensure your wallet is connected to the correct RPC.
            </p>
          </div>

          <div className="flex flex-row items-start gap-6 text-left">
            <ExternalLink className="mt-2 h-4 w-4 text-primary" />
            <div className="flex flex-col gap-1">
              <p>Contract Address</p>
              <a href={`https://arbiscan.io/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary break-all underline">
                {CONTRACT_ADDRESS}
              </a>
            </div>
          </div>

          {txHash && (
            <div className="flex flex-row items-start gap-6 mt-4 text-left">
              <ExternalLink className="mt-2 h-4 w-4 text-green-600" />
              <div className="flex flex-col gap-1">
                <p>Transaction Hash</p>
                <a href={`https://arbiscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer"
                  className="text-sm text-green-500 hover:text-green-400 break-all underline">{txHash}</a>
              </div>
            </div>
          )}

          {readResult && (
            <div className="mt-6 p-4 rounded-md bg-green-50 text-green-700">
              <p className="font-medium">Greeting in transaction:</p>
              <p className="break-words">{readResult}</p>
            </div>
          )}
        </div>

        {/* RIGHT SIDE: Forms */}
        <div className="flex flex-col items-center justify-center gap-8">

          {/* WRITE FORM */}
          <div className="flex w-full max-w-sm flex-col gap-4 rounded-md border p-8 bg-background shadow-sm">
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center text-center py-10 gap-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-medium">Success!</h3>
                  <p className="text-muted-foreground mt-2 text-sm">
                    Your greeting has been recorded on the Arbitrum blockchain.
                  </p>
                </div>
                <Button variant="outline" className="mt-4" onClick={() => { setIsSuccess(false); setGreeting(""); setTxHash(null); }}>
                  Write another message
                </Button>
              </div>
            ) : (
              <form onSubmit={submitGreeting} className="flex flex-col gap-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="h-5 w-5 text-primary" />
                  <p className="font-semibold text-lg">Archive on the blockchain</p>
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="greeting">Submit Greeting</Label>
                  <Input id="greeting" type="text" placeholder="Write your Proof Folder Hash on the Blockchain !"
                    value={greeting} onChange={(e) => setGreeting(e.target.value)} required />
                </div>

                {errorMessage && (
                  <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-xs">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <p>{errorMessage}</p>
                  </div>
                )}

                <Button className="w-full gap-4 mt-2" type="submit" disabled={isLoading || !greeting}>
                  {isLoading ? <>Processing... <Loader2 className="h-4 w-4 animate-spin" /></> : <>Sign & Send <MoveRight className="h-4 w-4" /></>}
                </Button>
              </form>
            )}
          </div>

          {/* READ FORM */}
          <div className="flex w-full max-w-sm flex-col gap-4 rounded-md border p-8 bg-background shadow-sm">
            <form onSubmit={readGreetingByTxHash} className="flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="h-5 w-5 text-primary" />
                <p className="font-semibold text-lg">Read Blockchain by Transaction Hash</p>
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="readHash">Transaction Hash</Label>
                <Input id="readHash" type="text" placeholder="Enter the transaction hash"
                  value={readHash} onChange={(e) => setReadHash(e.target.value)} required />
              </div>

              {readError && (
                <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-xs">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <p>{readError}</p>
                </div>
              )}

              <Button className="w-full gap-4 mt-2" type="submit" disabled={isReading || !readHash}>
                {isReading ? <>Fetching... <Loader2 className="h-4 w-4 animate-spin" /></> : <>Read Contract <MoveRight className="h-4 w-4" /></>}
              </Button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
