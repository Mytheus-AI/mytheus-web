"use client";

import Link from "next/link";
import { BrandMarkIcon, SearchIcon, BellIcon } from "./icons";
import { useToast } from "@/contexts/ToastContext";

export default function AppBar() {
  const toast = useToast();

  return (
    <header className="appbar">
      <Link href="/home" className="brand tap" id="brand-home" aria-label="Mytheus home">
        <span className="brand-mark">
          <BrandMarkIcon />
        </span>
        <span className="brand-name">Mytheus</span>
      </Link>

      <div className="appbar-right">
        <Link href="/search" className="icon-shell tap" data-tip="Search" aria-label="Search">
          <SearchIcon />
        </Link>
        <button type="button" className="icon-shell bell-dot tap" data-tip="Notifications" aria-label="Notifications, unread" onClick={() => toast("No new notifications")}>
          <BellIcon />
        </button>
        <Link href="/profile" className="appbar-avatar tap" data-tip="Profile" aria-label="Profile: Wayne"></Link>
      </div>
    </header>
  );
}
