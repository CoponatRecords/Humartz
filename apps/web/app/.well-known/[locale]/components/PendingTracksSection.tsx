// app/arbitrum/PendingTracksSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@repo/design-system";
import { Loader2, Download, AlertCircle } from "lucide-react";

type PendingTrack = {
  folderHash: string;
  id: string;
  title?: string | null;
  artistName?: string | null;
  userName?: string | null;
  email?: string | null;
  createdAt: string;
  storagePath?: string | null;
};

export default function PendingTracksSection() {
  const [tracks, setTracks] = useState<PendingTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await fetch('/api/pendingTracks', {
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        setTracks(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load pending tracks');
      } finally {
        setLoading(false);
      }
    };

    fetchPending();
  }, []);

  const handleDownload = (trackId: string) => {
    setDownloading(trackId);
    const url = `/api/downloadTracks?trackId=${encodeURIComponent(trackId)}`;

    // Trigger download
    window.location.href = url;

    // Reset button after a delay (rough UX fix)
    setTimeout(() => {
      setDownloading(null);
    }, 4500);
  };

  return (
    <div className="border rounded-xl bg-card shadow-sm p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold">Pending Submissions</h2>
        <span className="text-sm text-muted-foreground">
          {tracks.length} track{tracks.length !== 1 ? 's' : ''}
        </span>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center text-destructive gap-3">
          <AlertCircle className="h-10 w-10" />
          <p className="text-sm">{error}</p>
        </div>
      ) : tracks.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <p>No pending tracks to review</p>
        </div>
      ) : (
        <div className="overflow-x-auto flex-1 -mx-1 px-1">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 font-medium">Artist / Title</th>
                <th className="text-left py-2 font-medium hidden md:table-cell">User</th>
                <th className="text-left py-2 font-medium hidden md:table-cell">Folder Hash</th>
                <th className="text-left py-2 font-medium hidden md:table-cell">Track ID</th>

                <th className="text-right py-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((track) => (
                <tr key={track.id} className="border-b last:border-0 hover:bg-muted/40 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="font-medium">
                      {track.artistName || 'Unknown artist'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {track.title || 'Untitled'} • {new Date(track.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-3 pr-4 hidden md:table-cell text-muted-foreground text-xs">
                    {track.userName || track.email?.split('@')[0] || '—'}
                  </td>
                             <td className="py-3 pr-4 hidden md:table-cell text-muted-foreground text-xs">
                    {track.folderHash || '—'}
                  </td>

                                          <td className="py-3 pr-4 hidden md:table-cell text-muted-foreground text-xs">
                    {track.id || '—'}
                  </td>
                  <td className="py-3 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(track.id)}
                      disabled={downloading === track.id}
                      className="gap-1.5"
                    >
                      {downloading === track.id ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="h-3.5 w-3.5" />
                          Download
                        </>
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}