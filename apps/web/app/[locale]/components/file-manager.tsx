"use client";

import { Button, Input, Label } from "@repo/design-system";
import type { Dictionary } from "@repo/internationalization";
import { 
  CheckCircle2, 
  Loader2, 
  Upload, 
  ShieldCheck, 
  Fingerprint, 
  TicketPercent,
  AlertCircle,
  FileAudio,
  FolderOpen,
  Info,
  LayoutDashboard
} from "lucide-react";
import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser, SignInButton } from "@clerk/nextjs"; 
import { hashFolder } from "../hashFolder";
import Link from "next/link";

type FileManagerClientProps = {
  dictionary: Dictionary;
  locale: string;
};

export const FileManagerClient = ({ dictionary, locale }: FileManagerClientProps) => {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  
  const t = dictionary.web?.upload?.files ?? {};
  const globalT = dictionary.web?.global ?? {};
  const contactFormT = dictionary.web?.contact?.hero?.form ?? {};

  const [projectFiles, setProjectFiles] = useState<File[]>([]);
  const [masterFile, setMasterFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [trackName, setTrackName] = useState("");
  const [promoCode, setPromoCode] = useState("");
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const fullName = user.fullName || 
                       (user.firstName ? `${user.firstName} ${user.lastName || ""}` : "") || 
                       user.username || "";
      setName(fullName);
      setEmail(user.primaryEmailAddress?.emailAddress || "");
    }
  }, [isLoaded, isSignedIn, user]);

  const validCode = process.env.NEXT_PUBLIC_FREE_UPLOAD_CODE;
  const isFree = promoCode.trim().length > 0 && 
                 promoCode.trim().toUpperCase() === validCode?.toUpperCase();

  const sanitize = (str: string) =>
    str.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9.@_-]/g, "").replace(/_+/g, "_");

  async function uploadToR2(file: File, key: string) {
    const presign = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName: key, fileType: file.type }),
    });
    if (!presign.ok) throw new Error(t.errorUpload || "Upload failed");
    const { signedUrl } = await presign.json();
    await fetch(signedUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
  }

  const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!projectFiles.length || !masterFile) {
      setError(t.noFiles || "Please select all required files");
      return;
    }
    setIsUploading(true);
    setError(null);
    try {
      const allFiles = [masterFile, ...projectFiles];
      const hash = await hashFolder(allFiles);
      const folderPrefix = `user_${user?.id || 'guest'}/${sanitize(trackName)}_${hash}/`;
      let uploaded = 0;
      await uploadToR2(masterFile, folderPrefix + "master_" + masterFile.name);
      uploaded++;
      for (const file of projectFiles) {
        const relativePath = file.webkitRelativePath || file.name;
        await uploadToR2(file, folderPrefix + "project/" + relativePath);
        uploaded++;
        setUploadProgress(Math.round((uploaded / allFiles.length) * 100));
      }
      const verifyRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          endpoint: "verify-promo", 
          userId: user?.id || null,
          promoCode: promoCode.trim(),
          email,
          artistName: name,
          trackName,
          storagePath: folderPrefix,
          folderHash: hash 
        }),
      });
      if (!verifyRes.ok) throw new Error("Database sync failed");
      const dbData = await verifyRes.json();
      router.push(dbData.isFree ? `/${locale}/success` : `/${locale}/payment`);
    } catch (err: any) {
      setError(err.message || t.errorUpload);
      setIsUploading(false);
    }
  };

  const allFieldsFilled = !!name && !!email && !!trackName && !!masterFile && projectFiles.length > 0;

  return (
    <div className="w-full py-12 lg:py-24">
      <div className="container mx-auto max-w-6xl px-4">
        
        {/* We removed the full-width header div from here */}

        <div className="grid gap-12 lg:grid-cols-2 items-start">
          
          {/* Left Column - Header + Benefits */}
          <div className="flex flex-col gap-10">
            {/* The Title is now part of the left column */}
            <div className="space-y-4">
              <h1 className="font-bold text-4xl tracking-tighter md:text-5xl lg:text-6xl leading-tight">
                {t.title}
              </h1>
              <p className="text-xl text-muted-foreground max-w-[500px]">
                {t.description}
              </p>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="font-bold text-xl flex items-center gap-2">
                  {t.description_title_1}
                </h3>
                <ul className="grid gap-3 text-sm text-muted-foreground ml-9">
                  <li className="italic">{t.description_subtitle_21}</li>
                  <li>{t.description_subtitle_22}</li>
                  <li>{t.description_subtitle_23}</li>
                </ul>
              </div>

              <div className="grid gap-6 border-t pt-8">
                {t.benefitsUpload?.map((benefit: any, index: number) => (
                  <div key={index} className="flex items-start gap-4">
                    {index === 0 && <ShieldCheck className="h-6 w-6 text-primary shrink-0" />}
                    {index === 1 && <Fingerprint className="h-6 w-6 text-primary shrink-0" />}
                    <div>
                      <p className="font-semibold text-lg">{benefit.title}</p>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                ))}

                <div className="mt-auto pt-8 border-t border-dashed">
                  {isSignedIn ? (
                    <Button asChild variant="secondary" className="gap-2 w-full md:w-auto">
                      <Link href={`/${locale}/dashboard`}>
                        <LayoutDashboard className="h-4 w-4" />
                        Access my dashboard
                      </Link>
                    </Button>
                  ) : (
                    <SignInButton mode="modal">
                      <Button variant="secondary" className="gap-2 w-full md:w-auto">
                        <LayoutDashboard className="h-4 w-4" />
                        Access my dashboard
                      </Button>
                    </SignInButton>
                  )}
                  <p className="text-[10px] text-muted-foreground mt-2 px-1">
                    View your previous certifications and transaction history.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="flex items-start justify-center">
            <div className="w-full max-w-md flex flex-col gap-6 rounded-2xl border bg-card p-8 shadow-sm">
              
              {/* Conditional Pro-Tip for Guests */}
              {!isSignedIn && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10 text-xs text-primary">
                  <Info className="h-4 w-4 shrink-0" />
                  <p>
                    <strong>Pro tip:</strong> Signing in lets you track your certifications in a personal dashboard, but it&apos;s not required to upload!
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold">{t.uploadTitle}</h2>
                <p className="text-sm text-muted-foreground">{t.description_subtitle_1}</p>
              </div>

              <form onSubmit={handleUpload} className="flex flex-col gap-5">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>{contactFormT.firstName || "Name"}</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={!isLoaded ? "Loading..." : ""} disabled={isUploading || !isLoaded} required />
                  </div>
                  <div className="grid gap-2">
                    <Label>Email</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={!isLoaded ? "Loading..." : ""} disabled={isUploading || !isLoaded} required />
                  </div>
                  <div className="grid gap-2">
                    <Label>{t.trackName || "Track Title"}</Label>
                    <Input value={trackName} onChange={(e) => setTrackName(e.target.value)} disabled={isUploading} required />
                  </div>
                  <div className="grid gap-2 pt-2">
                    <Label className="flex items-center gap-2"><FolderOpen className="h-4 w-4 text-primary" /> {t.description_title_2}</Label>
                    <Input type="file" /* @ts-ignore */ webkitdirectory="" multiple onChange={(e) => e.target.files && setProjectFiles(Array.from(e.target.files))} disabled={isUploading} className="bg-muted/20" />
                  </div>
                  <div className="grid gap-2">
                    <Label className="flex items-center gap-2"><FileAudio className="h-4 w-4 text-primary" /> {t.description_title_3}</Label>
                    <Input type="file" accept="audio/*" onChange={(e) => setMasterFile(e.target.files ? e.target.files[0] : null)} disabled={isUploading} className="bg-muted/20" />
                  </div>
                  <div className="grid gap-2 pt-4 border-t mt-2">
                    <Label className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase"><TicketPercent className="h-3.5 w-3.5" /> Promo Code</Label>
                    <Input placeholder="Enter code" value={promoCode} onChange={(e) => { setPromoCode(e.target.value); setError(null); }} disabled={isUploading} className={isFree ? "border-green-500 ring-0 bg-green-500/5" : ""} />
                  </div>
                </div>

                {error && <div className="flex items-center gap-2 text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20"><AlertCircle className="h-4 w-4 shrink-0" /> {error}</div>}

                <Button type="submit" size="lg" disabled={!allFieldsFilled || isUploading} className="w-full">
                  {isUploading ? <>{t.uploading} {uploadProgress}% <Loader2 className="h-4 w-4 animate-spin ml-2" /></> : isFree ? <>Submit Free <CheckCircle2 className="h-4 w-4 ml-2" /></> : <>{globalT.primaryCta} <Upload className="h-4 w-4 ml-2" /></>}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};