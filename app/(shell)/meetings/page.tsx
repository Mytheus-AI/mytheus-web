"use client";

import { useState } from "react";
import Link from "next/link";
import { JoinCallButton } from "@/components/JoinCallButton";
import { Tag } from "@/components/Tag";
import { SearchIcon } from "@/components/icons";
import { UPCOMING_MEETINGS, PAST_MEETINGS, type MeetingListItem } from "@/lib/meetings";

const FILTERS = ["All", "Upcoming", "Ended"] as const;
type Filter = (typeof FILTERS)[number];

function matches(m: MeetingListItem, query: string) {
  return m.title.toLowerCase().includes(query.trim().toLowerCase());
}

export default function MeetingsPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  const upcoming = filter === "Ended" ? [] : UPCOMING_MEETINGS.filter((m) => matches(m, query));
  const past = filter === "Upcoming" ? [] : PAST_MEETINGS.filter((m) => matches(m, query));

  return (
    <section className="page" id="page-meetings">
      <div className="page-scroll">
        <div className="page-inner" style={{ maxWidth: 1240 }}>
          <div className="screen-head reveal">
            <div className="head-text">
              <h1>Meetings</h1>
              <p>Every call, its prep and everything it produced</p>
            </div>
          </div>

          <div className="canvas cols-2">
            <div>
          <div className="tr-toolbar reveal" style={{ animationDelay: ".05s" }}>
            <div className="tr-search">
              <SearchIcon size={14} />
              <input type="text" placeholder="Search meetings" aria-label="Search meetings" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <div className="seg" role="group" aria-label="Filter meetings">
              {FILTERS.map((f) => (
                <button key={f} type="button" className={`seg-btn tap${filter === f ? " is-on" : ""}`} onClick={() => setFilter(f)}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {upcoming.length > 0 && (
            <>
              <div className="section-label reveal" style={{ animationDelay: ".08s", paddingBottom: 9 }}>
                Up next
              </div>
              <div className="rec-list" style={{ marginBottom: 22 }}>
                {upcoming.map((m, i) => (
                  <div className="up-card reveal" style={{ animationDelay: `${0.1 + i * 0.05}s` }} key={m.id}>
                    <span className="up-when">
                      <b>{m.when.time}</b>
                      <span>{m.when.day}</span>
                    </span>
                    <span className="up-body">
                      <strong>{m.title}</strong>
                      <small>{m.meta}</small>
                    </span>
                    {m.status === "soon" ? (
                      <>
                        <span className="live-chip">
                          <span className="live-dot" aria-hidden="true"></span>
                          {m.statusLabel}
                        </span>
                        <Link href={`/meetings/${m.id}`} className="btn-ghost-sm tap">
                          Details
                        </Link>
                        <JoinCallButton path="/prejoin" className="btn-accent-sm tap">
                          Join
                        </JoinCallButton>
                      </>
                    ) : (
                      <>
                        <Tag variant="neutral">{m.statusLabel}</Tag>
                        <Link href={`/meetings/${m.id}`} className="btn-ghost-sm tap">
                          Details
                        </Link>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {past.length > 0 && (
            <>
              <div className="section-label reveal" style={{ animationDelay: ".12s", paddingBottom: 9 }}>
                Past
              </div>
              <div className="rec-list">
                {past.map((m, i) => (
                  <div className="rec-card reveal" style={{ animationDelay: `${0.14 + i * 0.05}s` }} key={m.id}>
                    <Link href={`/meetings/${m.id}`} className="rec-play tap" aria-label={`Open meeting: ${m.title}`}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </Link>
                    <div className="rec-main">
                      <div className="rec-title-row">
                        <strong>{m.title}</strong>
                        <Tag variant="neutral">{m.when.day}</Tag>
                      </div>
                      <div className="rec-meta">{m.meta}</div>
                      {m.summary && <p className="rec-sum">{m.summary}</p>}
                      <div className="rec-tags">
                        {m.counts && (
                          <>
                            <Tag variant="green" dot>
                              {m.counts.decisions} {m.counts.decisions === 1 ? "decision" : "decisions"}
                            </Tag>
                            <Tag variant="orange" dot>
                              {m.counts.actions} {m.counts.actions === 1 ? "action" : "actions"}
                            </Tag>
                          </>
                        )}
                      </div>
                      <div className="meet-links">
                        <Link href={`/meetings/${m.id}`} className="foot-link tap">
                          Open meeting
                        </Link>
                        <Link href="/transcript" className="foot-link tap">
                          Transcript
                        </Link>
                        <Link href="/recordings" className="foot-link tap">
                          Recording
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {upcoming.length === 0 && past.length === 0 && (
            <div className="board-empty" style={{ borderTop: "none" }}>
              No meetings match &quot;{query}&quot;. Try a different search.
            </div>
          )}
            </div>

            <div className="rail-stack">
              <div className="panel reveal" style={{ animationDelay: ".12s" }}>
                <div className="panel-head">
                  <h2>This week</h2>
                </div>
                <div className="panel-body">
                  {[
                    { n: "6", label: "meetings, 4h 12m in calls" },
                    { n: "5", label: "decisions confirmed" },
                    { n: "9", label: "actions captured, 3 yours" },
                    { n: "2", label: "conflicts caught before they shipped" },
                  ].map((d) => (
                    <div className="digest-row" key={d.label}>
                      <b>{d.n}</b>
                      <span>{d.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel reveal" style={{ animationDelay: ".16s" }}>
                <div className="panel-head">
                  <h2>Pinned moment</h2>
                </div>
                <div className="panel-body">
                  <blockquote className="peek-quote" style={{ marginTop: 0 }}>
                    &quot;We hold at $29 through the beta. No exceptions for the pilot accounts.&quot;
                    <cite>Priya · Pricing sync · 00:14:36</cite>
                  </blockquote>
                </div>
              </div>

              <div className="panel reveal" style={{ animationDelay: ".2s" }}>
                <div className="panel-head">
                  <h2>Before your next call</h2>
                </div>
                <div className="panel-body">
                  <p className="rail-note" style={{ marginTop: 0 }}>
                    Your prep brief for <b>Design review · Mobile onboarding</b> lands in Slack an hour before the start. The agenda and both attachments are already indexed for your agent.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
