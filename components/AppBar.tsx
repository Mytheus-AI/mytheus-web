"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMarkIcon, PeopleIcon, SearchIcon, BellIcon } from "./icons";
import { useMeetingUI } from "@/contexts/MeetingUIContext";
import { useToast } from "@/contexts/ToastContext";

export default function AppBar() {
  const pathname = usePathname();
  const inMeeting = pathname === "/meeting";
  const { sideVisible, toggleSide, inCallCount, invitedCount } = useMeetingUI();
  const toast = useToast();

  return (
    <header className="appbar">
      <Link href="/home" className="brand tap" id="brand-home" aria-label="Mytheus home">
        <span className="brand-mark">
          <BrandMarkIcon />
        </span>
        <span className="brand-name">Mytheus</span>
      </Link>

      {inMeeting && (
        <>
          <span className="chip meeting-only">
            <PeopleIcon />
            In call ·{" "}
            <b>{inCallCount}</b>
          </span>
          <span className="chip meeting-only">
            <PeopleIcon checkVariant />
            Invited ·{" "}
            <b>{invitedCount}</b>
          </span>
          <h1 className="appbar-title meeting-only">Weekly Meeting – Remote Strategy Session</h1>
        </>
      )}

      <div className="appbar-right">
        {inMeeting && (
          <>
            <button
              type="button"
              className="chip chip-btn tap meeting-only"
              data-tip="Copy meeting link"
              onClick={() => {
                try {
                  navigator.clipboard.writeText(window.location.href);
                } catch {
                  /* clipboard unavailable */
                }
                toast("Meeting link copied");
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 14a4.5 4.5 0 0 0 6.4.4l3-3a4.5 4.5 0 0 0-6.4-6.4l-1.7 1.7" />
                <path d="M14 10a4.5 4.5 0 0 0-6.4-.4l-3 3a4.5 4.5 0 0 0 6.4 6.4l1.7-1.7" />
              </svg>
              Share link
            </button>
            <button
              type="button"
              className={`icon-shell tap meeting-only${sideVisible ? " is-on" : ""}`}
              onClick={toggleSide}
              data-tip={sideVisible ? "Hide panel" : "Show panel"}
              aria-label="Hide side panel"
              aria-pressed={sideVisible}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="16" rx="4" />
                <path d="M15 4v16" />
              </svg>
            </button>
          </>
        )}
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
