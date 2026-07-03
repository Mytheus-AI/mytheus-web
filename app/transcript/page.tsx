"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SearchIcon } from "@/components/icons";
import { useToast } from "@/contexts/ToastContext";

type Row = { time: string; speaker: string; cls: string; text: string };

const INITIAL_ROWS: Row[] = [
  { time: "00:02:11", speaker: "Cloe", cls: "sp-1", text: "Let's lock pricing today. We keep circling and the launch page is blocked on it." },
  { time: "00:03:47", speaker: "Wayne", cls: "sp-2", text: "My proposal stands: hold launch pricing at $29 through the beta and revisit annual discounts after." },
  { time: "00:05:19", speaker: "Milana", cls: "sp-3", text: "Agreed on the hold. Annual pricing comes back to this group after launch with real usage data." },
  { time: "00:08:02", speaker: "Speaker 2", cls: "sp-unknown", text: "What about the two pilot accounts? Support keeps asking whether they get the old rate." },
  { time: "00:09:33", speaker: "Cloe", cls: "sp-1", text: "No exceptions for the pilots. One price simplifies the launch story and support scripts." },
  { time: "00:12:45", speaker: "Wayne", cls: "sp-2", text: "Then I'll take the pricing page update. I can have a draft up by Friday." },
  { time: "00:14:22", speaker: "Speaker 2", cls: "sp-unknown", text: "I'll flag the pilot accounts so support knows the plan before tickets come in." },
  { time: "00:41:08", speaker: "Cloe", cls: "sp-1", text: "Last thing — I want the churn cohort view ready before the numbers go to next week's agenda." },
];

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

export default function TranscriptPage() {
  const [rows, setRows] = useState(INITIAL_ROWS);
  const [query, setQuery] = useState("");
  const [assignName, setAssignName] = useState("Keith");
  const [showAssign, setShowAssign] = useState(true);
  const toast = useToast();

  const hasUnknown = rows.some((r) => r.cls === "sp-unknown");

  const rendered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.map((r) => {
      if (!q) return { row: r, html: null, dim: false };
      const idx = r.text.toLowerCase().indexOf(q);
      if (idx === -1) return { row: r, html: null, dim: true };
      const html =
        escapeHtml(r.text.slice(0, idx)) + "<mark>" + escapeHtml(r.text.slice(idx, idx + q.length)) + "</mark>" + escapeHtml(r.text.slice(idx + q.length));
      return { row: r, html, dim: false };
    });
  }, [rows, query]);

  return (
    <section className="page" id="page-transcript">
      <div className="page-scroll">
        <div className="page-inner">
          <div className="screen-head reveal">
            <h1>Pricing sync — transcript</h1>
            <p>Yesterday · 42 min · 6 people · captions were on</p>
          </div>

          <div className="tr-toolbar reveal" style={{ animationDelay: ".09s" }}>
            <div className="tr-search">
              <SearchIcon size={14} />
              <input
                type="text"
                placeholder="Search this transcript"
                aria-label="Search this transcript"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Link href="/recordings" className="btn-ghost-sm tap">
              Back to recordings
            </Link>
          </div>

          {hasUnknown && showAssign && (
            <div className="assign-banner reveal" style={{ animationDelay: ".14s" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="3.4" />
                <path d="M6 19.5c0-3.2 2.7-5.6 6-5.6s6 2.4 6 5.6" />
              </svg>
              Who is Speaker 2?
              <select aria-label="Assign Speaker 2" value={assignName} onChange={(e) => setAssignName(e.target.value)}>
                <option>Keith</option>
                <option>Thomas</option>
                <option>Joji</option>
                <option>Rosa</option>
              </select>
              <button
                type="button"
                className="assign-btn tap"
                onClick={() => {
                  setRows((rs) => rs.map((r) => (r.cls === "sp-unknown" ? { ...r, speaker: assignName, cls: "sp-2" } : r)));
                  setShowAssign(false);
                  toast(`Speaker 2 is now ${assignName}`);
                }}
              >
                Assign
              </button>
            </div>
          )}

          <div className="white-card reveal" style={{ animationDelay: ".18s" }}>
            <div className="tr-list">
              {rendered.map(({ row, html, dim }) => (
                <div className={`tr-row${dim ? " is-dim" : ""}`} key={row.time}>
                  <button type="button" className="tr-time tap" onClick={() => toast(`Jumping to ${row.time} in the recording`)}>
                    {row.time}
                  </button>
                  <span className={`tr-speaker ${row.cls}`}>{row.speaker}</span>
                  {html ? (
                    <p className="tr-text" dangerouslySetInnerHTML={{ __html: html }} />
                  ) : (
                    <p className="tr-text">{row.text}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
