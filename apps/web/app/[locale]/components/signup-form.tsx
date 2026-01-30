"use client";

import { useState } from "react";
import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import { Label } from "@repo/design-system/components/ui/label";
import { UserPlus, Star, ShieldCheck, Zap, Loader2 } from "lucide-react";
import Link from "next/link";
import type { Dictionary } from "@repo/internationalization";

export const SignupFormClient = ({ dictionary, locale, plan }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/stripe/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, email, name, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl px-6">
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Left Column */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl tracking-tighter md:text-5xl font-regular">Elevate your Music</h1>
            <p className="max-w-sm text-lg text-muted-foreground leading-relaxed">
              Join the elite circle of producers with the {plan.name} status.
            </p>
          </div>
          <div className="flex flex-col gap-6 mt-4">
            <div className="flex items-start gap-4">
              <Star className="mt-1 h-6 w-6 text-primary shrink-0" />
              <div>
                <p className="font-medium text-lg">Certified Human Label</p>
                <p className="text-sm text-muted-foreground mt-1">Verified badge to stand out from AI noise.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <ShieldCheck className="mt-1 h-6 w-6 text-primary shrink-0" />
              <div>
                <p className="font-medium text-lg">Secure Licensing</p>
                <p className="text-sm text-muted-foreground mt-1">Legally binding contracts generated automatically.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Zap className="mt-1 h-6 w-6 text-primary shrink-0" />
              <div>
                <p className="font-medium text-lg">Priority Support</p>
                <p className="text-sm text-muted-foreground mt-1">Direct feedback from our mastering engineers.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6 items-center lg:items-end">
          <div className="w-full max-w-md flex flex-col gap-6 rounded-lg border p-8 bg-background shadow-lg ring-1 ring-primary/10">
            <div className="flex flex-col gap-2 p-4 rounded-md bg-primary/5 border border-primary/20">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{plan.tagline}</span>
                <span className="text-2xl font-bold">${plan.price}<span className="text-sm font-normal text-muted-foreground">/mo</span></span>
              </div>
              <h3 className="text-xl font-bold">{plan.name} Membership</h3>
            </div>

            <form onSubmit={handleSignup} className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" className="w-full gap-2 mt-2 h-11" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Start Membership <UserPlus className="h-4 w-4" /></>}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};