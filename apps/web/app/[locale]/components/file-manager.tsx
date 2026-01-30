"use client";

import { Button, Input, Label } from "@repo/design-system";
import type { Dictionary } from "@repo/internationalization";
import { 
  CheckCircle2, 
  Loader2, 
  Upload, 
  ShieldCheck, 
  Fingerprint, 
  Clock, 
  TicketPercent,
  AlertCircle,
  FileAudio,
  FolderOpen
} from "lucide-react";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { hashFolder } from "../hashFolder";

const HumartzLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <title>Humartz Fingerprint</title>
    <path d="M12 2C7.5 2 4 5.5 4 10V16C4 16.55 4.45 17 5 17C5.55 17 6 16.55 6 16V10C6 6.5 8.5 4 12 4C15.5 4 18 6.5 18 10V18C18 18.55 18.45 19 19 19C19.55 19 20 18.55 20 18V10C20 5.5 16.5 2 12 2ZM12 6C9.5 6 7.5 8 7.5 10.5V17C7.5 17.55 7.95 18 8.5 18C9.05 18 9.5 17.55 9.5 17V10.5C9.5 9 10.5 8 12 8C13.5 8 14.5 9 14.5 10.5V16C14.5 16.55 14.95 17 15.5 17C16.05 17 16.5 16.55 16.5 16V10.5C16.5 8 14.5 6 12 6ZM12 10C11.5 10 11 10.5 11 11V16C11 16.55 11.45 17 12 17C12.55 17 13 16.55 13 16V11C13 10.5 12.5 10 12 10Z" fill="currentColor" />
  </svg>
);

type FileManagerClientProps = {
  dictionary: Dictionary;
  locale: string;
};

export const FileManagerClient = ({ dictionary, locale }: FileManagerClientProps) => {
  const router = useRouter();
  
  // Scoping translations based on your JSON structure
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
      const folderPrefix = `Email_${sanitize(email)}_Name_${sanitize(name)}_hash_${hash}/`;

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
          promoCode: promoCode.trim(),
          email: email,
          artistName: name,
          trackName: trackName
        }),
      });

      if (!verifyRes.ok) throw new Error("Verification failed");
      const dbData = await verifyRes.json();

      if (dbData.isFree === true) {
        router.push(`/${locale}/success`); 
      } else {
        router.push(`/${locale}/payment`); 
      }
      
    } catch (err: any) {
      console.error("Upload process error:", err);
      setError(err.message || t.errorUpload);
      setIsUploading(false);
    }
  };

  const allFieldsFilled = !!name && !!email && !!trackName && !!masterFile && projectFiles.length > 0;

  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid gap-16 lg:grid-cols-2">
          
          {/* Left Column - Benefits & Instructions from Dictionary */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h1 className="max-w-xl text-left font-bold text-4xl tracking-tighter md:text-6xl">
                {t.title}
              </h1>
              <p className="max-w-md text-left text-lg text-muted-foreground">
                {t.description}
              </p>
            </div>

            <div className="space-y-8">
              {/* Step 1: Preparation */}
              <div className="space-y-4">
                <h3 className="font-bold text-xl flex items-center gap-2">
                  {t.description_title_1}
                </h3>
                <ul className="grid gap-3 text-sm text-muted-foreground ml-9">
                  <li className="flex items-start gap-2 italic">{t.description_subtitle_21}</li>
                  <li className="flex items-start gap-2">{t.description_subtitle_22}</li>
                  <li className="flex items-start gap-2">{t.description_subtitle_23}</li>
                </ul>
              </div>

              {/* Dynamic Benefits Mapping */}
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

          {/* Right Column - Submission Form */}
          <div className="flex items-start justify-center">
            <div className="w-full max-w-md flex flex-col gap-6 rounded-2xl border bg-card p-8 shadow-sm">
              <div className="flex flex-col gap-1 mb-2">
                <h2 className="text-2xl font-bold">{t.uploadTitle}</h2>
                <p className="text-sm text-muted-foreground">{t.description_subtitle_1}</p>
              </div>

              <form onSubmit={handleUpload} className="flex flex-col gap-5">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>{contactFormT.firstName || "Name"}</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} disabled={isUploading} required />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>Email</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isUploading} required />
                  </div>

                  <div className="grid gap-2">
                    <Label>{t.trackName || "Track Title"}</Label>
                    <Input value={trackName} onChange={(e) => setTrackName(e.target.value)} disabled={isUploading} required />
                  </div>

                  <div className="grid gap-2 pt-2">
                    <Label className="flex items-center gap-2">
                      <FolderOpen className="h-4 w-4 text-primary" /> {t.description_title_2}
                    </Label>
                    <Input 
                      type="file" 
                      /* @ts-ignore */ 
                      webkitdirectory="" 
                      multiple 
                      onChange={(e) => e.target.files && setProjectFiles(Array.from(e.target.files))} 
                      disabled={isUploading} 
                      className="bg-muted/20"
                    />
                    <p className="text-[10px] text-muted-foreground">{t.chooseFile}</p>
                  </div>

                  <div className="grid gap-2">
                    <Label className="flex items-center gap-2">
                      <FileAudio className="h-4 w-4 text-primary" /> {t.description_title_3}
                    </Label>
                    <Input 
                      type="file" 
                      accept="audio/*" 
                      onChange={(e) => setMasterFile(e.target.files ? e.target.files[0] : null)} 
                      disabled={isUploading} 
                      className="bg-muted/20"
                    />
                  </div>

                  <div className="grid gap-2 pt-4 border-t mt-2">
                    <Label className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase">
                      <TicketPercent className="h-3.5 w-3.5" /> Promo Code
                    </Label>
                    <Input 
                      placeholder="Enter code" 
                      value={promoCode} 
                      onChange={(e) => { setPromoCode(e.target.value); setError(null); }}
                      disabled={isUploading}
                      className={isFree ? "border-green-500 ring-0 bg-green-500/5" : ""}
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                    <AlertCircle className="h-4 w-4 shrink-0" /> {error}
                  </div>
                )}

                <Button type="submit" size="lg" disabled={!allFieldsFilled || isUploading} className="w-full">
                  {isUploading ? (
                    <>{t.uploading} {uploadProgress}% <Loader2 className="h-4 w-4 animate-spin ml-2" /></>
                  ) : isFree ? (
                    <>Submit Free <CheckCircle2 className="h-4 w-4 ml-2" /></>
                  ) : (
                    <>{globalT.primaryCta} <Upload className="h-4 w-4 ml-2" /></>
                  )}
                </Button>

                <p className="text-[11px] text-center text-muted-foreground leading-tight">
                  {t.description_title_4}
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};