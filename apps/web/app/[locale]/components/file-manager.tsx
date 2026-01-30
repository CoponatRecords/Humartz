"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import { Label } from "@repo/design-system/components/ui/label";
import type { Dictionary } from "@repo/internationalization";
import { CheckCircle2, Loader2, Upload, FolderKanban, Headphones, Clock } from "lucide-react";
import Link from "next/link";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { hashFolder } from "../hashFolder";

type FileManagerClientProps = {
  dictionary: Dictionary;
  locale: string;
};

const MAX_TOTAL_SIZE = 5 * 1024 * 1024 * 1024;

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const FileManagerClient = ({ dictionary, locale }: FileManagerClientProps) => {
  const router = useRouter();
  const t = dictionary.web?.upload?.files ?? {};

  const [projectFiles, setProjectFiles] = useState<File[]>([]);
  const [masterFile, setMasterFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [trackName, setTrackName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const totalSize = [masterFile, ...projectFiles].reduce((acc, f) => acc + (f?.size || 0), 0);

  const sanitize = (str: string) =>
    str.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9.@_-]/g, "").replace(/_+/g, "_");

  async function uploadToR2(file: File, key: string) {
    const presign = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName: key, fileType: file.type, fileSize: file.size }),
    });
    
    if (!presign.ok) throw new Error("Upload initialization failed");
    
    const { signedUrl } = await presign.json();
    const res = await fetch(signedUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
    
    if (!res.ok) throw new Error("Upload failed");
  }

  const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!projectFiles.length || !masterFile) {
      setError("Please upload a project folder and a master file");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const allFiles = [masterFile, ...projectFiles];
      const hash = await hashFolder(allFiles);
      const folderPrefix = `Email_${sanitize(email)}_Name_${sanitize(name)}_TrackName_${sanitize(trackName)}_hash_${hash}/`;

      let uploaded = 0;
      await uploadToR2(masterFile, folderPrefix + "master_" + masterFile.name);
      uploaded++;

      for (const file of projectFiles) {
        const relativePath = file.webkitRelativePath || file.name;
        await uploadToR2(file, folderPrefix + "project/" + relativePath);
        uploaded++;
        setUploadProgress(Math.round((uploaded / allFiles.length) * 100));
      }

      await fetch("/api/db/add-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artistName: name, trackName: trackName, folderHash: hash, email }),
      });

      // Navigate to your new payment page
      router.push(`/${locale}/payment`);
      
    } catch (err: any) {
      setError(err.message || "Upload failed");
      setIsUploading(false);
    }
  };

  const allFieldsFilled = !!name && !!email && !!trackName && !!masterFile && projectFiles.length > 0;

  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-2">
          
          {/* Left column: Restored Icons & Info */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h4 className="max-w-xl text-left font-regular text-3xl tracking-tighter md:text-5xl">
                {t.title || "File Manager"}
              </h4>
              <p className="max-w-sm text-left text-lg text-muted-foreground leading-relaxed tracking-tight">
                {dictionary.web?.upload?.files?.description}
              </p>
            </div>

            <div className="flex flex-col gap-6 mt-4">
              <div className="flex items-start gap-4">
                <FolderKanban className="mt-1 h-6 w-6 text-primary shrink-0" />
                <div>
                  <p className="font-medium text-lg">
                    {dictionary.web?.upload?.files?.description_title_1 || "Organized & traceable uploads"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{dictionary.web?.upload?.files?.description_subtitle_21}</p>
                  <p className="text-sm text-muted-foreground mt-1">{dictionary.web?.upload?.files?.description_subtitle_22}</p>
                  <p className="text-sm text-muted-foreground mt-1">{dictionary.web?.upload?.files?.description_subtitle_23}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Upload className="mt-1 h-6 w-6 text-primary flex-shrink-0" />
                <div>
                  <p className="font-medium text-lg">
                    {dictionary.web?.upload?.files?.description_title_2 || "Easy folder & multi-file upload"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Headphones className="mt-1 h-6 w-6 text-primary flex-shrink-0" />
                <div>
                  <p className="font-medium text-lg">
                    {dictionary.web?.upload?.files?.description_title_3 || "High-fidelity processing"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="mt-1 h-6 w-6 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {dictionary.web?.upload?.files?.description_title_4 || "Fast turnaround times"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: The Form */}
          <div className="flex items-start justify-center p-6">
            <div className="w-full max-w-md flex flex-col gap-6 rounded-lg border p-8 bg-background shadow-sm">
              <form onSubmit={handleUpload} className="flex flex-col gap-6">
                <p className="font-semibold text-xl">{t.uploadTitle || "Upload your files"}</p>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>Your Name</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} disabled={isUploading} required />
                  </div>
                  <div className="grid gap-2">
                    <Label>Email</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isUploading} required />
                  </div>
                  <div className="grid gap-2">
                    <Label>Track / Project Name</Label>
                    <Input value={trackName} onChange={(e) => setTrackName(e.target.value)} disabled={isUploading} required />
                  </div>

                  <div className="grid gap-2">
                    <Label>Project Folder (Max 5GB)</Label>
                    <Input
                      type="file"
                      // @ts-ignore
                      webkitdirectory=""
                      multiple
                      onChange={(e) => e.target.files && setProjectFiles(Array.from(e.target.files))}
                      disabled={isUploading}
                    />
                    {projectFiles.length > 0 && (
                      <p className="text-sm text-muted-foreground">{projectFiles.length} files - {formatBytes(totalSize)}</p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label>Master Audio File</Label>
                    <Input type="file" accept="audio/*" onChange={(e) => setMasterFile(e.target.files ? e.target.files[0] : null)} disabled={isUploading} />
                  </div>
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button type="submit" disabled={!allFieldsFilled || isUploading} className="w-full gap-2 mt-1">
                  {isUploading ? (
                    <>Uploading {uploadProgress}% <Loader2 className="h-4 w-4 animate-spin ml-2" /></>
                  ) : (
                    <>Proceed to Payment <Upload className="h-4 w-4 ml-2" /></>
                  )}
                </Button>

<div className="flex flex-col items-center justify-center mt-4 gap-1">
  <p className="text-muted-foreground text-sm text-center">
    Prefer a manual review where your files are never uploaded, or have a   <Link 
    href="/signup" 
    className="text-primary text-sm text-center  hover:text-primary/80"
  >
   Producer Subscription
  </Link> ?
  </p>
  <Link 
    href="/contact" 
    className="text-primary text-sm text-center underline hover:text-primary/80"
  >
    Contact us.
  </Link>
</div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};