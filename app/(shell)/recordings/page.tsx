"use client";

import { useState } from "react";
import Link from "next/link";
import { Tag } from "@/components/Tag";
import { MoreDotsIcon, SparkleIcon, SearchIcon } from "@/components/icons";

type Recording = {
  id: string;
  title: string;
  date: string;
  length: string;
  people: number;
  summary: string;
  decisions?: number;
  keyPoints?: number;
  tags: ("decisions" | "keypoints")[];
  askAbout?: boolean;
  transcript?: { who: string; cls: string; text: string }[];
};

const RECORDINGS: Recording[] = [
  {
    id: "pricing-sync",
    title: "Pricing sync",
    date: "Yesterday",
    length: "42 min",
    people: 6,
    summary: "Launch pricing holds at $29. Annual discounts wait until after the beta. Keith owns the pricing-page update, due Friday.",
    decisions: 2,
    keyPoints: 5,
    tags: ["decisions", "keypoints"],
    askAbout: true,
    transcript: [
      { who: "Priya", cls: "t-p", text: "We hold at $29 through the beta. No exceptions for the pilot accounts." },
      { who: "Milana", cls: "t-m", text: "Agreed. Annual pricing comes back to this group after launch." },
      { who: "Daniel", cls: "t-d", text: "I'll flag the two pilot accounts so support knows the plan." },
    ],
  },
  {
    id: "weekly-meeting",
    title: "Weekly meeting · Remote strategy",
    date: "Monday",
    length: "1h 04m",
    people: 16,
    summary: "The beta ships July 21. Churn numbers move to next week's agenda so the data team can finish the cohort view.",
    decisions: 3,
    keyPoints: 7,
    tags: ["decisions", "keypoints"],
  },
  {
    id: "standup",
    title: "Standup · Core team",
    date: "Monday",
    length: "14 min",
    people: 8,
    summary: "No decisions. Two blockers cleared: staging access and the flaky upload test.",
    keyPoints: 2,
    tags: ["keypoints"],
  },
  {
    id: "design-review",
    title: "Design review · Mobile onboarding",
    date: "Jun 27",
    length: "51 min",
    people: 5,
    summary: "The three-step flow wins. Progress dots replace the percentage bar.",
    decisions: 1,
    tags: ["decisions"],
  },
  {
    id: "retro",
    title: "Sprint retro · Core team",
    date: "Jun 25",
    length: "38 min",
    people: 9,
    summary: "Review cycles are the bottleneck. The team trials a 24-hour first-response rule for two sprints.",
    decisions: 1,
    keyPoints: 4,
    tags: ["decisions", "keypoints"],
  },
];

const SPEAKERS = [
  { name: "Cloe", share: 34 },
  { name: "Wayne", share: 27 },
  { name: "Milana", share: 21 },
  { name: "Keith", share: 18 },
];

export default function RecordingsPage() {
  const [filter, setFilter] = useState<"all" | "decisions" | "keypoints">("all");
  const [query, setQuery] = useState("");

  const list = RECORDINGS.filter(
    (r) =>
      (filter === "all" || r.tags.includes(filter)) &&
      (!query.trim() || (r.title + " " + r.summary).toLowerCase().includes(query.trim().toLowerCase()))
  );

  return (
    <section className="page" id="page-recordings">
      <div className="page-scroll">
        <div className="page-inner">
          <div className="screen-head reveal">
            <div className="head-text">
              <h1>Recordings</h1>
              <p>12 meetings captured this month · 8h 40m of conversation</p>
            </div>
            <div className="head-actions">
              <div className="tool-search" style={{ width: 240 }}>
                <SearchIcon size={14} />
                <input type="text" placeholder="Search recordings" aria-label="Search recordings" value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>
              <div className="seg" role="group" aria-label="Filter recordings">
                {(["all", "decisions", "keypoints"] as const).map((f) => (
                  <button key={f} type="button" className={`seg-btn tap${filter === f ? " is-on" : ""}`} onClick={() => setFilter(f)}>
                    {f === "all" ? "All" : f === "decisions" ? "Decisions" : "Key points"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="canvas cols-2 is-fill">
            <div className="panel reveal" style={{ animationDelay: ".09s" }}>
              <div className="panel-head">
                <h2>Library</h2>
                <span className="count-chip">{list.length}</span>
              </div>

              {list.map((rec) => (
                <div className="panel-row is-top" key={rec.id}>
                  <Link href="/transcript" className="rec-play tap" aria-label={`Open transcript: ${rec.title}`}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                    </svg>
                  </Link>
                  <span className="row-body">
                    <span className="row-title-line">
                      <strong>{rec.title}</strong>
                      <small>
                        {rec.date} · {rec.length} · {rec.people} people
                      </small>
                      <button type="button" className="label-icon-btn tap" data-tip="More" aria-label="More options">
                        <MoreDotsIcon />
                      </button>
                    </span>
                    <p className="row-sum">{rec.summary}</p>
                    <span className="row-chips">
                      {rec.decisions !== undefined && (
                        <Tag variant="green" dot>
                          {rec.decisions} decision{rec.decisions === 1 ? "" : "s"}
                        </Tag>
                      )}
                      {rec.keyPoints !== undefined && (
                        <Tag variant="brown" dot>
                          {rec.keyPoints} key points
                        </Tag>
                      )}
                      {rec.askAbout && (
                        <Tag variant="orange" icon={<SparkleIcon size={11} />}>
                          Ask about this
                        </Tag>
                      )}
                      <Link href="/transcript" className="recap-link tap" style={{ marginLeft: "auto" }}>
                        Open transcript
                      </Link>
                    </span>
                    {rec.transcript && (
                      <div className="transcript">
                        {rec.transcript.map((row) => (
                          <div className="t-row" key={row.who}>
                            <span className={`t-av ${row.cls}`} aria-hidden="true">
                              {row.who[0]}
                            </span>
                            <p className="t-text">
                              <b>{row.who}</b> {row.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </span>
                </div>
              ))}

              <div className="panel-foot">
                <button type="button" className="foot-link tap">Show older recordings</button>
              </div>
            </div>

            <div className="rail-stack">
              <div className="panel reveal" style={{ animationDelay: ".14s" }}>
                <div className="panel-head">
                  <h2>This month</h2>
                </div>
                <div className="panel-body">
                  <div className="digest-row">
                    <b>12</b>
                    <span>meetings captured</span>
                  </div>
                  <div className="digest-row">
                    <b>18</b>
                    <span>decisions confirmed</span>
                  </div>
                  <div className="digest-row">
                    <b>42</b>
                    <span>key points extracted</span>
                  </div>
                  <div className="digest-row">
                    <b>31</b>
                    <span>action items assigned</span>
                  </div>
                </div>
              </div>

              <div className="panel reveal" style={{ animationDelay: ".2s" }}>
                <div className="panel-head">
                  <h2>Talk time this month</h2>
                </div>
                <div className="panel-body">
                  {SPEAKERS.map((s) => (
                    <div className="speaker-row" key={s.name}>
                      <span className="speaker-name">{s.name}</span>
                      <span className="meter" role="img" aria-label={`${s.name} spoke ${s.share} percent of the time`}>
                        <i style={{ width: `${s.share}%` }}></i>
                      </span>
                      <span className="speaker-share">{s.share}%</span>
                    </div>
                  ))}
                  <p className="rail-note">Balanced meetings run shorter. Your agent flags any voice above 50%.</p>
                </div>
              </div>

              <div className="panel reveal" style={{ animationDelay: ".26s" }}>
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
