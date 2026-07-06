"use client";

import { useState } from "react";
import Link from "next/link";
import { Tag } from "@/components/Tag";
import { useToast } from "@/contexts/ToastContext";

type Decision = {
  id: string;
  title: string;
  meeting: string;
  when: string;
  by: string;
  pending?: boolean;
  confidence: number;
  quote: string;
  cite: string;
  related: { kind: string; label: string; href: string }[];
};

const DECISIONS: Decision[] = [
  {
    id: "pricing",
    title: "Hold launch pricing at $29 through the beta",
    meeting: "Pricing sync",
    when: "Yesterday",
    by: "Confirmed by Cloe",
    confidence: 0.86,
    quote: "We hold at $29 through the beta. No exceptions for the pilot accounts.",
    cite: "Priya · Pricing sync · 00:14:36",
    related: [
      { kind: "Task", label: "Update the pricing page, due Friday · Wayne", href: "/tasks" },
      { kind: "Decision", label: "Annual discounts wait until after the beta", href: "/decisions" },
    ],
  },
  {
    id: "beta-date",
    title: "The beta ships July 21",
    meeting: "Weekly meeting",
    when: "Monday",
    by: "Confirmed by Milana",
    confidence: 0.91,
    quote: "July 21 is locked. Everything downstream plans against that date now.",
    cite: "Milana · Weekly meeting · 00:18:04",
    related: [
      { kind: "Task", label: "Book the beta readiness review · done", href: "/tasks" },
      { kind: "Meeting", label: "Beta launch readiness · Thursday 14:00", href: "/home" },
    ],
  },
  {
    id: "onboarding",
    title: "The three-step onboarding flow wins",
    meeting: "Design review",
    when: "Jun 27",
    by: "Confirmed by Wayne",
    confidence: 0.78,
    quote: "Three steps with progress dots. The percentage bar tested worse in every session.",
    cite: "Wayne · Design review · 00:37:02",
    related: [{ kind: "Task", label: "Share the onboarding flow specs with design", href: "/tasks" }],
  },
  {
    id: "annual-discounts",
    title: "Annual discounts wait until after the beta",
    meeting: "Pricing sync",
    when: "Yesterday",
    by: "Awaiting confirmation",
    pending: true,
    confidence: 0.64,
    quote: "Revisit annual discounts after the beta, once we have real usage data.",
    cite: "Wayne · Pricing sync · 00:03:47",
    related: [
      { kind: "Decision", label: "Hold launch pricing at $29 through the beta", href: "/decisions" },
      { kind: "Task", label: "Churn cohort view is blocked on this", href: "/tasks" },
    ],
  },
];

export default function DecisionsPage() {
  const [selected, setSelected] = useState("pricing");
  const [filter, setFilter] = useState<"all" | "confirmed" | "pending">("all");
  const toast = useToast();

  const list = DECISIONS.filter((d) => filter === "all" || (filter === "pending" ? d.pending : !d.pending));
  const detail = DECISIONS.find((d) => d.id === selected) ?? list[0] ?? DECISIONS[0];

  return (
    <section className="page" id="page-decisions">
      <div className="page-scroll">
        <div className="page-inner">
          <div className="screen-head reveal">
            <div className="head-text">
              <h1>Decisions</h1>
              <p>Every confirmed decision, traceable back to its meeting</p>
            </div>
            <div className="head-actions">
              <div className="seg" role="group" aria-label="Filter decisions">
                {(["all", "confirmed", "pending"] as const).map((f) => (
                  <button key={f} type="button" className={`seg-btn tap${filter === f ? " is-on" : ""}`} onClick={() => setFilter(f)}>
                    {f[0].toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="canvas cols-2r is-fill">
            <div className="panel reveal" style={{ animationDelay: ".09s" }}>
              <div className="panel-head">
                <h2>Decision log</h2>
                <span className="count-chip">{list.length}</span>
              </div>
              {list.map((d) => (
                <button
                  type="button"
                  key={d.id}
                  className={`panel-row is-top dec-item tap${detail.id === d.id ? " is-selected" : ""}`}
                  onClick={() => setSelected(d.id)}
                >
                  <span className={`moment-dot${d.pending ? " is-note" : " is-decision"}`} style={{ marginTop: 5 }} aria-hidden="true"></span>
                  <span className="row-body">
                    <strong>{d.title}</strong>
                    <small>
                      {d.meeting} · {d.when}
                    </small>
                  </span>
                  <Tag variant={d.pending ? "brown" : "green"} dot>
                    {d.pending ? "Pending" : "Confirmed"}
                  </Tag>
                </button>
              ))}

              <div className="panel-foot">
                <span className="pv-lobby-note">
                  {DECISIONS.filter((d) => !d.pending).length} confirmed · {DECISIONS.filter((d) => d.pending).length} awaiting confirmation · all
                  traceable to a meeting
                </span>
              </div>
            </div>

            <div className="panel reveal" style={{ animationDelay: ".14s" }}>
              <div className="panel-head">
                <h2>
                  {detail.meeting} · {detail.when}
                </h2>
                <div className="label-actions">
                  {detail.pending ? (
                    <Tag variant="brown" dot>
                      Pending
                    </Tag>
                  ) : (
                    <Tag variant="green" dot>
                      Confirmed
                    </Tag>
                  )}
                </div>
              </div>

              <div className="panel-body">
                <h3 className="detail-title">{detail.title}</h3>
                <p className="detail-by">{detail.by}</p>

                <div className="conf-row">
                  <span className="conf-label">Confidence {detail.confidence.toFixed(2)}</span>
                  <span className="meter" role="img" aria-label={`Confidence ${detail.confidence}`}>
                    <i style={{ width: `${detail.confidence * 100}%` }}></i>
                  </span>
                </div>

                <blockquote className="peek-quote">
                  &quot;{detail.quote}&quot;
                  <cite>{detail.cite}</cite>
                </blockquote>

                {detail.pending && (
                  <div className="row-chips" style={{ marginTop: 12 }}>
                    <button type="button" className="btn-accent-sm tap" onClick={() => toast("Decision confirmed and saved to the log")}>
                      Confirm decision
                    </button>
                    <button type="button" className="btn-ghost-sm tap" onClick={() => toast("Sent back to the next pricing sync")}>
                      Needs discussion
                    </button>
                  </div>
                )}

                <div className="detail-cols">
                  <div>
                    <div className="detail-section">Linked to this decision</div>
                    {detail.related.map((r) => (
                      <Link href={r.href} className={`related-row is-${r.kind.toLowerCase()} tap`} key={r.label}>
                        <span className="row-kicker" style={{ marginBottom: 0, width: 58, flexShrink: 0 }}>
                          {r.kind}
                        </span>
                        <span className="related-label">{r.label}</span>
                      </Link>
                    ))}
                  </div>

                  <div>
                    <div className="detail-section">Lineage</div>
                    <svg className="lineage-svg" viewBox="0 0 600 250" role="img" aria-label="Decision lineage graph">
                  <defs>
                    <marker id="arr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                      <path d="M0 0 8 4 0 8Z" fill="#bbafa3" />
                    </marker>
                  </defs>
                  <line x1="160" y1="62" x2="255" y2="105" stroke="#bbafa3" strokeWidth="1.5" markerEnd="url(#arr)" />
                  <text x="168" y="78" fontSize="8.5" fontWeight="800" fill="#a39a8e" letterSpacing="0.6">
                    PRODUCED
                  </text>
                  <line x1="150" y1="185" x2="245" y2="140" stroke="#bbafa3" strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#arr)" />
                  <text x="130" y="172" fontSize="8.5" fontWeight="800" fill="#a39a8e" letterSpacing="0.6">
                    FOLLOWS FROM
                  </text>
                  <line x1="400" y1="102" x2="465" y2="62" stroke="#bbafa3" strokeWidth="1.5" markerEnd="url(#arr)" />
                  <text x="405" y="75" fontSize="8.5" fontWeight="800" fill="#a39a8e" letterSpacing="0.6">
                    RELATES TO
                  </text>
                  <line x1="400" y1="130" x2="430" y2="175" stroke="#bbafa3" strokeWidth="1.5" markerEnd="url(#arr)" />
                  <text x="408" y="150" fontSize="8.5" fontWeight="800" fill="#a39a8e" letterSpacing="0.6">
                    ASSIGNED TO
                  </text>

                  <rect x="40" y="35" width="150" height="40" rx="12" fill="#f3efe9" />
                  <text x="115" y="52" fontSize="8" fontWeight="800" fill="#a39a8e" textAnchor="middle" letterSpacing="0.8">
                    MEETING
                  </text>
                  <text x="115" y="66" fontSize="10.5" fontWeight="700" fill="#1f1e1d" textAnchor="middle">
                    {detail.meeting}
                  </text>

                  <rect x="30" y="170" width="160" height="40" rx="12" fill="#ecefe5" />
                  <text x="110" y="187" fontSize="8" fontWeight="800" fill="#5f7355" textAnchor="middle" letterSpacing="0.8">
                    DECISION
                  </text>
                  <text x="110" y="201" fontSize="10.5" fontWeight="700" fill="#1f1e1d" textAnchor="middle">
                    Beta ships July 21
                  </text>

                  <rect x="235" y="95" width="170" height="46" rx="12" fill="#ecefe5" stroke="#d97757" strokeWidth="2" />
                  <text x="320" y="113" fontSize="8" fontWeight="800" fill="#5f7355" textAnchor="middle" letterSpacing="0.8">
                    DECISION
                  </text>
                  <text x="320" y="128" fontSize="10.5" fontWeight="700" fill="#1f1e1d" textAnchor="middle">
                    {detail.title.length > 28 ? detail.title.slice(0, 26) + "…" : detail.title}
                  </text>

                  <rect x="455" y="30" width="110" height="38" rx="12" fill="#f4ecdf" />
                  <text x="510" y="46" fontSize="8" fontWeight="800" fill="#9a7b4f" textAnchor="middle" letterSpacing="0.8">
                    TOPIC
                  </text>
                  <text x="510" y="60" fontSize="10.5" fontWeight="700" fill="#1f1e1d" textAnchor="middle">
                    Pricing
                  </text>

                  <rect x="400" y="178" width="175" height="46" rx="12" fill="#f7e9e1" />
                  <text x="487" y="196" fontSize="8" fontWeight="800" fill="#c15f3c" textAnchor="middle" letterSpacing="0.8">
                    ACTION
                  </text>
                      <text x="487" y="211" fontSize="10.5" fontWeight="700" fill="#1f1e1d" textAnchor="middle">
                        Pricing page · Wayne
                      </text>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
