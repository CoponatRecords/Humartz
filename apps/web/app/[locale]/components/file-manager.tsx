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
  LayoutDashboard,
  LogIn
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
  const [artistName, setArtistName] = useState(""); 
  const [trackName, setTrackName] = useState("");
  const [promoCode, setPromoCode] = useState("");
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Auto-fill logic for logged-in users
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const fullName = user.fullName || 
                       (user.firstName ? `${user.firstName} ${user.lastName || ""}` : "") || 
                       user.username || "";
      setName(fullName);
      setEmail(user.primaryEmailAddress?.emailAddress || "");
      
      // If artist name is empty, initialize it with the user's name/alias
      if (!artistName) {
        setArtistName(user.username || fullName);
      }
    }
  }, [isLoaded, isSignedIn, user]);

  // Logic: When a guest types their name, auto-fill artist name too
  const handleNameChange = (val: string) => {
    setName(val);
    // Only mirror to artistName if NOT signed in and artistName hasn't been manually diverged yet
    // Or simply always mirror until the user manually touches the artistName field
    if (!isSignedIn) {
      setArtistName(val);
    }
  };

  const validCode = process.env.NEXT_PUBLIC_FREE_UPLOAD_CODE;
  const isFree = promoCode.trim().length > 0 && 
                 promoCode.trim().toUpperCase() === validCode?.toUpperCase();

  const sanitize = (str: string) =>
    str.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9.@_-]/g, "").replace(/_+/g, "_");

  async function uploadToR2(file: File, key: string, onFileProgress: (loaded: number) => void) {
    const presign = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName: key, fileType: file.type }),
    });

    if (!presign.ok) throw new Error(t.errorUpload || "Upload failed");
    const { signedUrl } = await presign.json();

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", signedUrl);
      xhr.setRequestHeader("Content-Type", file.type);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onFileProgress(e.loaded);
      };

      xhr.onload = () => (xhr.status === 200 ? resolve(true) : reject());
      xhr.onerror = () => reject();
      xhr.send(file);
    });
  }

  const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!projectFiles.length || !masterFile) {
      setError(t.noFiles || "Please select all required files");
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(1);

    try {
      const allFiles = [masterFile, ...projectFiles];
      const totalSize = allFiles.reduce((acc, f) => acc + f.size, 0);

      const hashTick = setInterval(() => {
        setUploadProgress((prev) => (prev < 10 ? prev + 1 : prev));
      }, 400);

      const hash = await hashFolder(allFiles);
      clearInterval(hashTick);
      setUploadProgress(10); 
      const timestamp = Date.now();
      const folderPrefix = `userId_${user?.id || 'guest'}/_trackName_${sanitize(trackName)}_promoCode_${promoCode}_timestamp_${timestamp}_folderHash_${hash}/`;
      let totalLoaded = 0;
      const fileLoadMap = new Map<string, number>();

      const runUpload = async (file: File, pathSuffix: string) => {
        const key = folderPrefix + pathSuffix;
        await uploadToR2(file, key, (bytesLoaded) => {
          fileLoadMap.set(key, bytesLoaded);
          const currentTotalLoaded = Array.from(fileLoadMap.values()).reduce((a, b) => a + b, 0);
          const rawPercentage = (currentTotalLoaded / totalSize) * 90;
          setUploadProgress(Math.round(10 + rawPercentage));
        });
      };

      await runUpload(masterFile, "master_" + masterFile.name);

      for (const file of projectFiles) {
        const relativePath = file.webkitRelativePath || file.name;
        await runUpload(file, "project/" + relativePath);
      }

      const verifyRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          endpoint: "verify-promo", 
          userId: user?.id,
          promoCode: promoCode.trim(),
          email,
          artistName: artistName,
          trackName: trackName,
          storagePath: folderPrefix,
          folderHash: hash,
          userName: name,
        }),
      });

      if (!verifyRes.ok) throw new Error("Database sync failed");
      const dbData = await verifyRes.json();
      router.push(dbData.isFree ? `/${locale}/success` : `/${locale}/payment`);
      
    } catch (err: any) {
      setError(err.message || t.errorUpload);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const allFieldsFilled = !!artistName && !!email && !!trackName && !!masterFile && projectFiles.length > 0;

  return (
    <div className="w-full py-12 lg:py-24">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid gap-12 lg:grid-cols-2 items-start">
          
          {/* Left Column (Info) */}
          <div className="flex flex-col gap-10">
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
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="flex items-start justify-center">
            <div className="w-full max-w-md flex flex-col gap-6 rounded-2xl border bg-card p-8 shadow-sm">

              
              
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold">{t.uploadTitle}</h2>
                <p className="text-sm text-muted-foreground">{t.description_subtitle_1}</p>
              </div>

{!isSignedIn && isLoaded && (
  <div className="rounded-lg border bg-muted/40 p-4 text-sm space-y-3">
    <div className="flex items-start gap-3">
      <div>
     <p className="font-medium">
  <span className="inline-flex items-center gap-2">
    <Info className="h-5 w-5 text-primary shrink-0" />
    {dictionary.web.upload.guestDashboardTitle || "Want to track your certification progress?"}
  </span>
</p>
        <p className="text-muted-foreground mt-1">
          {dictionary.web.upload.guestDashboardText || 
            "Sign in or create an account to access your personal dashboard. You'll be able to follow the status of your submission, view certificates, and manage future uploads."}
        </p>
      </div>
    </div>

    <div className="flex items-center gap-3 mt-2">
      <SignInButton mode="modal" forceRedirectUrl={`/${locale}/get-certified`}
  signUpForceRedirectUrl={`/${locale}/get-certified`}>
        <Button variant="outline" size="sm" className="gap-1.5">
          <LogIn className="h-3.5 w-3.5" />
          {dictionary.web.header.signIn}
        </Button>
      </SignInButton>
    </div>
  </div>
)}
              <form onSubmit={handleUpload} className="flex flex-col gap-5">
                <div className="grid gap-4">
                  
                  {/* Account Name - Triggers Artist Name if Guest */}
                  <div className="grid gap-2">
                    <Label>{contactFormT.firstName || "Your Name"}</Label>
                    <Input 
                        value={name} 
                        onChange={(e) => handleNameChange(e.target.value)} 
                        disabled={isUploading || !isLoaded} 
                        placeholder="First and Last Name"
                        required 
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Email</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isUploading || !isLoaded} required />
                  </div>

                  {/* Artist Name Input - Editable independently */}
                  <div className="grid gap-2">
                    <Label>
                      {dictionary.web.upload.files.artistName}
                    </Label>
                    <Input 
                      placeholder="e.g. Stage name / Alias" 
                      value={artistName} 
                      onChange={(e) => setArtistName(e.target.value)} 
                      disabled={isUploading}
                      required 
                    />
                    <p className="text-[10px] text-muted-foreground italic">
                      This name will be displayed on the final certificate.
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label>{t.trackName || "Track Title"}</Label>
                    <Input value={trackName} onChange={(e) => setTrackName(e.target.value)} disabled={isUploading} required />
                  </div>
                  
                  <div className="grid gap-2 pt-2">
                    <Label className="flex items-center gap-2">
                      <FolderOpen className="h-4 w-4 text-primary" /> {t.description_title_2}
                    </Label>
                    <Input type="file" /* @ts-ignore */ webkitdirectory="" multiple onChange={(e) => e.target.files && setProjectFiles(Array.from(e.target.files))} disabled={isUploading} className="bg-muted/20" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label className="flex items-center gap-2">
                      <FileAudio className="h-4 w-4 text-primary" /> {t.description_title_3}
                    </Label>
                    <Input type="file"  onChange={(e) => setMasterFile(e.target.files ? e.target.files[0] : null)} disabled={isUploading} className="bg-muted/20" />
                  </div>
                  
                  <div className="grid gap-2 pt-4 border-t mt-2">
                    <Label className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase">
                      <TicketPercent className="h-3.5 w-3.5" /> Promo Code
                    </Label>
                    <Input placeholder="Enter code" value={promoCode} onChange={(e) => { setPromoCode(e.target.value); setError(null); }} disabled={isUploading} className={isFree ? "border-green-500 ring-0 bg-green-500/5" : ""} />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                    <AlertCircle className="h-4 w-4 shrink-0" /> {error}
                  </div>
                )}


                <Button type="submit" size="lg" disabled={!allFieldsFilled || isUploading} className="w-full">
                  {isUploading ? (
                    <>
                      {uploadProgress < 10 ? "Analyzing files..." : `Uploading ${uploadProgress}%`}
                      <Loader2 className="h-4 w-4 animate-spin ml-2" />
                    </>
                  ) : (
                    <>
                      {isFree ? "Submit Free" : globalT.primaryCta}
                      {isFree ? <CheckCircle2 className="h-4 w-4 ml-2" /> : <Upload className="h-4 w-4 ml-2" />}
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};