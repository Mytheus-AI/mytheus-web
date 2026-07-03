"use client";

import { useState } from "react";
import Link from "next/link";
import { Tag } from "@/components/Tag";
import { MoreDotsIcon, SparkleIcon } from "@/components/icons";

type Recording = {
  id: string;
  title: string;
  meta: string;
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
    meta: "Yesterday · 42 min · 6 people",
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
    title: "Weekly meeting — remote strategy",
    meta: "Monday · 1h 04m · 16 people",
    summary: "The beta ships July 21. Churn numbers move to next week's agenda so the data team can finish the cohort view.",
    decisions: 3,
    keyPoints: 7,
    tags: ["decisions", "keypoints"],
  },
  {
    id: "standup",
    title: "Standup — core team",
    meta: "Monday · 14 min · 8 people",
    summary: "No decisions. Two blockers cleared — staging access and the flaky upload test.",
    keyPoints: 2,
    tags: ["keypoints"],
  },
  {
    id: "design-review",
    title: "Design review — mobile onboarding",
    meta: "Jun 27 · 51 min · 5 people",
    summary: "The three-step flow wins. Progress dots replace the percentage bar.",
    decisions: 1,
    tags: ["decisions"],
  },
];

export default function RecordingsPage() {
  const [filter, setFilter] = useState<"all" | "decisions" | "keypoints">("all");

  return (
    <section className="page" id="page-recordings">
      <div className="page-scroll">
        <div className="page-inner">
          <div className="screen-head reveal">
            <h1>Recordings</h1>
            <p>12 meetings captured this month</p>
          </div>

          <div className="filters reveal" style={{ animationDelay: ".09s" }} role="group" aria-label="Filter recordings">
            {(["all", "decisions", "keypoints"] as const).map((f) => (
              <button
                key={f}
                type="button"
                className={`filter-chip tap${filter === f ? " is-on" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f === "all" ? "All" : f === "decisions" ? "Decisions" : "Key points"}
              </button>
            ))}
          </div>

          <div className="rec-list">
            {RECORDINGS.filter((r) => filter === "all" || r.tags.includes(filter)).map((rec, i) => (
              <div className="rec-card reveal" style={{ animationDelay: `${0.18 + i * 0.09}s` }} key={rec.id}>
                <Link href="/transcript" className="rec-play tap" aria-label={`Open transcript: ${rec.title}`}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                  </svg>
                </Link>
                <div className="rec-main">
                  <div className="rec-title-row">
                    <strong>{rec.title}</strong>
                    <button type="button" className="label-icon-btn tap" data-tip="More" aria-label="More options">
                      <MoreDotsIcon />
                    </button>
                  </div>
                  <p className="rec-meta">{rec.meta}</p>
                  <p className="rec-sum">{rec.summary}</p>
                  <div className="rec-tags">
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
                  </div>
                  {rec.transcript && (
                    <div className="transcript">
                      {rec.transcript.map((row) => (
                        <div className="t-row" key={row.who}>
                          <span className={`t-av ${row.cls}`} aria-hidden="true">
                            {row.who[0]}
                          </span>
                          <p className="t-text">
                            <b>{row.who}</b> — {row.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
