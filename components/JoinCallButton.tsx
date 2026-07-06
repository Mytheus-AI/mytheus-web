"use client";

import { openCallWindow } from "@/lib/callWindow";

/** Opens the call experience in its own window instead of navigating the app away. */
export function JoinCallButton({ path, className, children }: { path: string; className?: string; children: React.ReactNode }) {
  return (
    <button type="button" className={className} onClick={() => openCallWindow(path)}>
      {children}
    </button>
  );
}
