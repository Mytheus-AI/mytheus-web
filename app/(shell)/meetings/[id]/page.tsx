"use client";

import { use } from "react";
import Link from "next/link";
import { JoinCallButton } from "@/components/JoinCallButton";
import { Tag } from "@/components/Tag";
import { SparkleIcon } from "@/components/icons";
import { findMeeting, type MeetingListItem } from "@/lib/meetings";

const AGENDAS: Record<string, string[]> = {
  "design-review": [
    "Walk the three-step onboarding flow end to end",
    "Progress-dots spec — Rosa's open question from last crit",
    "Confirm hand-off dates for the mobile build",
  ],
};

const PREP: Record<string, { kind: string; text: string }[]> = {
  "design-review": [
    { kind: "decision", text: "The three-step flow decision from Jun 27 is loaded for reference." },
    { kind: "note", text: "Prep brief covers the two questions design left open last time." },
    { kind: "action", text: "Your onboarding-specs task is due today. Expect it to come up." },
    { kind: "question", text: "Rosa asked for the progress-dots spec. It is linked in the brief." },
  ],
};

const FALLBACK_PREP = [{ kind: "note", text: "Your agent assembles the prep brief 15 minutes before the call." }];

type RichSummary = {
  decisions: { text: string; cite: string }[];
  actions: { text: string; due: string; mine?: boolean }[];
  questions: string[];
  quote?: { text: string; cite: string };
};

const RICH_SUMMARIES: Record<string, RichSummary> = {
  "pricing-sync": {
    decisions: [
      { text: "Hold launch pricing at $29 through the beta.", cite: "Confirmed · 00:14:36" },
      { text: "No pilot-account exceptions to the hold.", cite: "Confirmed · 00:15:02" },
    ],
    actions: [
      { text: "Update the pricing page copy", due: "Friday", mine: true },
      { text: "Flag pilot accounts for support", due: "Wednesday" },
      { text: "Churn cohort view for next week's numbers", due: "Tuesday" },
    ],
    questions: ["When do annual discounts come back to this group?"],
    quote: { text: "We hold at $29 through the beta. No exceptions for the pilot accounts.", cite: "Priya · Pricing sync · 00:14:36" },
  },
};

const TALK_TIME = [
  { name: "Cloe", share: 38 },
  { name: "Wayne", share: 26 },
  { name: "Milana", share: 19 },
  { name: "Others", share: 17 },
];

const ATTENDEES = [
  { name: "Cloe", handle: "@cloerose", av: "p-av-3" },
  { name: "Wayne (You)", handle: "@johnwayne", av: "p-av-1" },
  { name: "Milana", handle: "@milanaray", av: "p-av-5" },
  { name: "Sufjan", handle: "@sufjansteven", av: "p-av-2" },
  { name: "Keith", handle: "@keithnorth", av: "p-av-6" },
];

function UpcomingDetail({ meeting }: { meeting: MeetingListItem }) {
  const agenda = AGENDAS[meeting.id];
  const prep = PREP[meeting.id] ?? FALLBACK_PREP;

  return (
    <div className="canvas cols-2">
      <div className="rail-stack">
        <div className="panel reveal" style={{ animationDelay: ".08s" }}>
          <div className="panel-head">
            <h2>Agenda</h2>
          </div>
          {(agenda ?? []).map((item, i) => (
            <div className="panel-row is-top" key={item}>
              <span className="moment-dot" style={{ marginTop: 5 }} aria-hidden="true"></span>
              <span className="row-body">
                <p className="row-sum" style={{ marginTop: 0 }}>
                  {item}
                </p>
              </span>
              <span className="head-when">{String(i + 1).padStart(2, "0")}</span>
            </div>
          ))}
          {!agenda && <div className="board-empty">The agenda lands here when the organizer shares it.</div>}
        </div>

        <div className="panel reveal" style={{ animationDelay: ".12s" }}>
          <div className="panel-head">
            <h2>Attachments</h2>
            <span className="head-when">searchable before the meeting</span>
          </div>
          {["Onboarding-flows-v4.fig", "Progress-dots-spec.pdf"].map((file) => (
            <div className="panel-row" key={file}>
              <span className="int-logo" aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 3.5h9L19.5 8v12.5h-13.5V3.5Z" />
                  <path d="M14.5 3.5V8.5H19.5" />
                </svg>
              </span>
              <span className="row-body">
                <strong>{file}</strong>
                <small>From the calendar invite · indexed for your agent</small>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rail-stack">
        <div className="panel reveal" style={{ animationDelay: ".1s" }}>
          <div className="panel-head">
            <h2>Meeting</h2>
            {meeting.status === "soon" && (
              <span className="live-chip" style={{ marginLeft: "auto" }}>
                <span className="live-dot" aria-hidden="true"></span>
                {meeting.statusLabel}
              </span>
            )}
          </div>
          <div className="panel-body">
            <h3 className="detail-title" style={{ fontSize: 19 }}>
              {meeting.title}
            </h3>
            <p className="detail-by">
              {meeting.when.day} {meeting.when.time} · {meeting.meta}
            </p>
            <div className="pv-lobby">
              <span className="av-stack">
                <i style={{ backgroundImage: "url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=60&auto=format&fit=crop'), linear-gradient(140deg,#e4ddd2,#c9bfae)" }} />
                <i style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=60&auto=format&fit=crop'), linear-gradient(140deg,#e4ddd2,#c9bfae)" }} />
                <i style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=60&auto=format&fit=crop'), linear-gradient(140deg,#e4ddd2,#c9bfae)" }} />
                <span className="av-more">+2</span>
              </span>
              <span className="pv-lobby-note">{meeting.status === "soon" ? "Rosa and Sufjan are already in the lobby" : "Invites accepted by everyone"}</span>
            </div>
          </div>
        </div>

        <div className="panel reveal" style={{ flex: 1, animationDelay: ".14s" }}>
          <div className="panel-head">
            <h2>Your agent is ready</h2>
            <SparkleIcon size={12} />
          </div>
          {prep.map((p) => (
            <div className="panel-row is-top" key={p.text}>
              <span className={`moment-dot is-${p.kind}`} style={{ marginTop: 5 }} aria-hidden="true"></span>
              <span className="row-body">
                <p className="row-sum" style={{ marginTop: 0 }}>
                  {p.text}
                </p>
              </span>
            </div>
          ))}
          <div className="panel-foot agent-foot">
            <SparkleIcon size={13} />
            Notes will be filtered for your role: product engineer.
          </div>
        </div>

        {meeting.status === "soon" ? (
          <JoinCallButton path="/prejoin" className="join-btn tap reveal">
            Join meeting
          </JoinCallButton>
        ) : (
          <p className="rail-note reveal" style={{ animationDelay: ".18s" }}>
            Joining opens 10 minutes before the start. Your prep brief arrives in Slack an hour ahead.
          </p>
        )}
      </div>
    </div>
  );
}

function EndedDetail({ meeting }: { meeting: MeetingListItem }) {
  const rich = RICH_SUMMARIES[meeting.id];

  return (
    <div className="canvas cols-2">
      <div className="panel reveal" style={{ animationDelay: ".08s" }}>
        <div className="panel-head">
          <h2>Your summary</h2>
          <span className="head-when">prepared for Wayne · product engineer</span>
        </div>
        <div className="panel-body">
          {meeting.summary && <p className="rec-sum" style={{ maxWidth: "none" }}>{meeting.summary}</p>}

          {rich ? (
            <>
              <div className="detail-section">Decisions confirmed</div>
              {rich.decisions.map((d) => (
                <div className="mynote" key={d.text} style={{ padding: "5px 0" }}>
                  <span className="moment-dot is-decision" style={{ marginTop: 5 }} aria-hidden="true"></span>
                  <span className="mynote-body">
                    <p>{d.text}</p>
                    <span className="cite-chip">{d.cite}</span>
                  </span>
                </div>
              ))}

              <div className="detail-section">Action items</div>
              {rich.actions.map((a) => (
                <div className="mynote" key={a.text} style={{ padding: "5px 0" }}>
                  <span className="moment-dot is-action" style={{ marginTop: 5 }} aria-hidden="true"></span>
                  <span className="mynote-body">
                    <p>
                      {a.text}
                      {a.mine && <b> — yours</b>}
                    </p>
                    <span className="cite-chip">Due {a.due}</span>
                  </span>
                </div>
              ))}

              <div className="detail-section">Open questions</div>
              {rich.questions.map((q) => (
                <div className="mynote" key={q} style={{ padding: "5px 0" }}>
                  <span className="moment-dot is-question" style={{ marginTop: 5 }} aria-hidden="true"></span>
                  <span className="mynote-body">
                    <p>{q}</p>
                  </span>
                </div>
              ))}

              {rich.quote && (
                <blockquote className="sum-quote">
                  &quot;{rich.quote.text}&quot;
                  <span className="cite-chip" style={{ display: "inline-flex", marginLeft: 8 }}>
                    {rich.quote.cite}
                  </span>
                </blockquote>
              )}
            </>
          ) : (
            <>
              <div className="detail-section">Captured in this meeting</div>
              <div className="row-chips" style={{ marginTop: 4 }}>
                {meeting.counts && (
                  <>
                    <Tag variant="green" dot>
                      {meeting.counts.decisions} {meeting.counts.decisions === 1 ? "decision" : "decisions"}
                    </Tag>
                    <Tag variant="orange" dot>
                      {meeting.counts.actions} {meeting.counts.actions === 1 ? "action" : "actions"}
                    </Tag>
                  </>
                )}
              </div>
              <p className="rail-note" style={{ marginTop: 10 }}>
                Open the transcript for the full record — every decision and action links back to its exact moment.
              </p>
            </>
          )}
        </div>
      </div>

      <div className="rail-stack">
        <div className="panel reveal" style={{ animationDelay: ".1s" }}>
          <div className="panel-head">
            <h2>Artifacts</h2>
          </div>
          {[
            { kicker: "Transcript", desc: "Searchable, with key moments", href: "/transcript", tone: "is-brown" },
            { kicker: "Recording", desc: `Full video · ${meeting.meta.split("·")[0]?.trim() ?? ""}`, href: "/recordings", tone: "is-orange" },
            { kicker: "Decisions", desc: "Traceable back to this meeting", href: "/decisions", tone: "is-green" },
          ].map((a) => (
            <Link href={a.href} className="panel-row related-row tap" key={a.kicker} style={{ margin: 0 }}>
              <span className="row-body">
                <span className={`row-kicker ${a.tone}`}>{a.kicker}</span>
                <span className="related-label">{a.desc}</span>
              </span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--mutedIcon)" }}>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          ))}
        </div>

        <div className="panel reveal" style={{ animationDelay: ".14s" }}>
          <div className="panel-head">
            <h2>Talk time</h2>
          </div>
          <div className="panel-body">
            {TALK_TIME.map((s) => (
              <div className="speaker-row" key={s.name}>
                <span className="speaker-name">{s.name}</span>
                <span className="meter" role="img" aria-label={`${s.name} spoke ${s.share} percent of the time`}>
                  <i style={{ width: `${s.share}%` }}></i>
                </span>
                <span className="speaker-share">{s.share}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel reveal" style={{ animationDelay: ".18s" }}>
          <div className="panel-head">
            <h2>People</h2>
            <span className="head-when">{ATTENDEES.length + 1} attended</span>
          </div>
          <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {ATTENDEES.map((p) => (
              <div className="member-row" key={p.name}>
                <span className={`p-av ${p.av}`}></span>
                <span>
                  <strong>{p.name}</strong> <small>{p.handle}</small>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MeetingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const meeting = findMeeting(id);

  if (!meeting) {
    return (
      <section className="page">
        <div className="empty-wrap">
          <div className="empty-box">
            <h1>Meeting not found</h1>
            <p>This meeting is not in your library. It may have been deleted, or the link is wrong.</p>
            <Link href="/meetings" className="btn-dark tap" style={{ display: "inline-flex" }}>
              All meetings
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const ended = meeting.status === "ended";

  return (
    <section className="page" id="page-meeting-detail">
      <div className="page-scroll">
        <div className="page-inner" style={{ maxWidth: 1240 }}>
          <div className="screen-head reveal">
            <div className="head-text">
              <Link href="/meetings" className="foot-link tap" style={{ display: "inline-block", marginBottom: 6 }}>
                ← All meetings
              </Link>
              <h1>{meeting.title}</h1>
              <p>
                {meeting.when.day} {meeting.when.time} · {meeting.meta}
              </p>
            </div>
            <div className="head-actions">
              {ended ? (
                <Tag variant="neutral">Ended</Tag>
              ) : (
                <Tag variant="green" dot>
                  {meeting.statusLabel}
                </Tag>
              )}
            </div>
          </div>

          {ended ? <EndedDetail meeting={meeting} /> : <UpcomingDetail meeting={meeting} />}
        </div>
      </div>
    </section>
  );
}
