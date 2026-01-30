"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import { Label } from "@repo/design-system/components/ui/label";
import type { Dictionary } from "@repo/internationalization";
import { CheckCircle2, Loader2, Upload, FolderKanban, Loader, Headphones, Clock } from "lucide-react";
import Link from "next/link";
import { useState, FormEvent } from "react";
import { hashFolder } from "../hashFolder";

type FileManagerClientProps = {
  dictionary: Dictionary;
  locale: string;
};

// 5GB Limit
const MAX_TOTAL_SIZE = 5 * 1024 * 1024 * 1024;

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const FileManagerClient = ({ dictionary, locale }: FileManagerClientProps) => {
  const t = dictionary.web?.upload?.files ?? {};

  const [projectFiles, setProjectFiles] = useState<File[]>([]);
  const [masterFile, setMasterFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [trackName, setTrackName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [folderHash, setFolderHash] = useState<string | null>(null);

  const totalSize = [masterFile, ...projectFiles].reduce((acc, f) => acc + (f?.size || 0), 0);

  const sanitize = (str: string) =>
    str
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9.@_-]/g, "")
      .replace(/_+/g, "_");

  async function uploadToR2(file: File, key: string) {
    const presign = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        fileName: key, 
        fileType: file.type,
        fileSize: file.size
      }),
    });
    
    if (!presign.ok) {
      const errorData = await presign.json();
      throw new Error(errorData.error || "Upload initialization failed");
    }
    
    const { signedUrl } = await presign.json();
    const res = await fetch(signedUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
    
    if (!res.ok) throw new Error("Upload failed");
  }

  const handleProjectFilesChange = (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);
    const size = fileArray.reduce((acc, f) => acc + (f?.size || 0), 0);

    if (size > MAX_TOTAL_SIZE) {
      setError(`Project folder is too large! Max 5GB. Selected: ${formatBytes(size)}`);
      setProjectFiles([]);
      return;
    }
    setError(null);
    setProjectFiles(fileArray);
  };

  const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!projectFiles.length || !masterFile) {
      setError("Please upload a project folder and a master file");
      return;
    }

    if (totalSize > MAX_TOTAL_SIZE) {
      setError(`Project is too large. Max limit is 5GB. Current size: ${formatBytes(totalSize)}`);
      return;
    }

    if (!name.trim() || !email.trim() || !trackName.trim()) {
      setError("Please fill in name, email and track name");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // 1. Prepare files and calculate Hash first
      const allFiles = [masterFile, ...projectFiles];
      const hash = await hashFolder(allFiles);
      setFolderHash(hash);

      // 2. Define prefix including the hash
      const safeName = sanitize(name);
      const safeEmail = sanitize(email);
      const safeTrack = sanitize(trackName);
      
      const folderPrefix = `Email_${safeEmail}_Name_${safeName}_TrackName_${safeTrack}_hash_${hash}/`;

      let uploaded = 0;

      // 3. Upload master file
      await uploadToR2(masterFile, folderPrefix + "master_" + masterFile.name);
      uploaded++;
      setUploadProgress(Math.round((uploaded / allFiles.length) * 100));

      // 4. Upload project folder
      for (const file of projectFiles) {
        const relativePath = file.webkitRelativePath || file.name;
        const key = folderPrefix + "project/" + relativePath;
        await uploadToR2(file, key);
        uploaded++;
        setUploadProgress(Math.round((uploaded / allFiles.length) * 100));
      }

      // 5. Update Database
      await fetch("/api/db/add-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artistName: name,
          trackName: trackName,
          folderHash: hash,
          email,
        }),
      });

      setIsSuccess(true);
      setProjectFiles([]);
      setMasterFile(null);
      setName("");
      setEmail("");
      setTrackName("");
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const allFieldsFilled = !!name && !!email && !!trackName && !!masterFile && projectFiles.length > 0;

  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Left column */}
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
                  <p className="text-sm text-muted-foreground mt-1">
                    {dictionary.web?.upload?.files?.description_subtitle_21}
                  </p>
                                    <p className="text-sm text-muted-foreground mt-1">
                    {dictionary.web?.upload?.files?.description_subtitle_22}
                  </p>
                                    <p className="text-sm text-muted-foreground mt-1">
                    {dictionary.web?.upload?.files?.description_subtitle_23}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Upload className="mt-1 h-6 w-6 text-primary flex-shrink-0" />
                <div>
                  <p className="font-medium text-lg">
                    {dictionary.web?.upload?.files?.description_title_2 || "Easy folder & multi-file upload"}
                  </p>
                </div>
</div>           <div className="flex items-start gap-4">

                <Headphones className="mt-1 h-6 w-6 text-primary flex-shrink-0" />
                <div>
                

                                    <p className="font-medium text-lg">
                    {dictionary.web?.upload?.files?.description_title_3 || "Easy folder & multi-file upload"}
                  </p>

                </div>
              </div>
              <div className="flex items-start gap-4">

                <Clock className="mt-1 h-6 w-6 text-primary flex-shrink-0" />
                <div>
                

                                    <p className="text-sm text-muted-foreground mt-1">
                    {dictionary.web?.upload?.files?.description_title_4 || "Easy folder & multi-file upload"}
                  </p>

                </div>
              </div>
             
            </div>
          </div>

          {/* Right column */}
          <div className="flex items-start justify-center">
            <div className="w-full max-md flex flex-col gap-6 rounded-lg border p-8 bg-background shadow-sm">
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center text-center py-12 gap-6">
                  <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-medium">Upload Complete!</h3>
                    {folderHash && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Folder Hash: <code>{folderHash}</code>
                      </p>
                    )}
                  </div>
                  <Button variant="outline" onClick={() => setIsSuccess(false)}>
                    Upload more files
                  </Button>
                </div>
              ) : (
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
                        webkitdirectory=""
                        multiple
                        onChange={(e) => handleProjectFilesChange(e.target.files)}
                        disabled={isUploading}
                      />
                      {projectFiles.length > 0 && (
                        <p className={`text-sm mt-1 ${totalSize > MAX_TOTAL_SIZE ? "text-destructive" : "text-muted-foreground"}`}>
                          {projectFiles.length} files selected - Total size: {formatBytes(totalSize)}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label>Master Audio File</Label>
                      <Input type="file" accept="audio/*" onChange={(e) => setMasterFile(e.target.files ? e.target.files[0] : null)} disabled={isUploading} />
                      {masterFile && <p className="text-sm text-muted-foreground">{masterFile.name}</p>}
                    </div>
                  </div>

                  {error && <p className="text-sm text-destructive pt-1">{error}</p>}

                  <Button type="submit" disabled={!allFieldsFilled || isUploading} className="w-full gap-2 mt-1">
                    {isUploading ? (
                      <>
                        Uploading {uploadProgress}% <Loader2 className="h-4 w-4 animate-spin ml-2" />
                      </>
                    ) : (
                      <>
                        Upload <Upload className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>

                  <p className="text-muted-foreground text-sm text-center mt-4">
                    Prefer not to share your session files or have a proof folder over 5GB ?{" "}

                  </p>
                  <p className="text-muted-foreground text-sm text-center">

                                      <Link href="/contact" className="text-primary underline hover:text-primary/80">
                      Schedule a manual review.
                    </Link>                  </p>

                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};