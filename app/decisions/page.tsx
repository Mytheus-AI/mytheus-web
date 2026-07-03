"use client";

import { useState } from "react";
import { Tag } from "@/components/Tag";

type Decision = {
  id: string;
  title: string;
  meta: string;
  pending?: boolean;
  confidence: string;
};

const DECISIONS: Decision[] = [
  { id: "pricing", title: "Hold launch pricing at $29 through the beta", meta: "Pricing sync · yesterday · confirmed by Cloe", confidence: "0.86" },
  { id: "beta-date", title: "The beta ships July 21", meta: "Weekly meeting · Monday · confirmed by Milana", confidence: "0.91" },
  { id: "onboarding", title: "The three-step onboarding flow wins", meta: "Design review · Jun 27 · confirmed by Wayne", confidence: "0.78" },
  { id: "annual-discounts", title: "Annual discounts wait until after the beta", meta: "Pricing sync · yesterday · awaiting confirmation", pending: true, confidence: "0.64" },
];

export default function DecisionsPage() {
  const [selected, setSelected] = useState("pricing");
  const selectedDecision = DECISIONS.find((d) => d.id === selected)!;

  return (
    <section className="page" id="page-decisions">
      <div className="page-scroll">
        <div className="page-inner" style={{ maxWidth: 1080 }}>
          <div className="screen-head reveal">
            <h1>Decisions</h1>
            <p>Every confirmed decision, traceable back to its meeting</p>
          </div>

          <div className="dec-layout reveal" style={{ animationDelay: ".09s" }}>
            <div>
              {DECISIONS.map((d) => (
                <div
                  key={d.id}
                  className={`dec-row${selected === d.id ? " is-selected" : ""}${d.pending ? " is-pending" : ""}`}
                  onClick={() => setSelected(d.id)}
                >
                  <span className="dec-dot"></span>
                  <div className="dec-body">
                    <strong>{d.title}</strong>
                    <small>{d.meta}</small>
                    <div className="dec-meta">
                      {d.pending ? (
                        <Tag variant="brown" dot>
                          Pending
                        </Tag>
                      ) : (
                        <Tag variant="green" dot>
                          Confirmed
                        </Tag>
                      )}
                      <Tag variant="neutral">Confidence {d.confidence}</Tag>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="white-card lineage-card">
              <h3>Lineage</h3>
              <small>{selectedDecision.title}</small>
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
                  FOLLOWS_FROM
                </text>
                <line x1="400" y1="102" x2="465" y2="62" stroke="#bbafa3" strokeWidth="1.5" markerEnd="url(#arr)" />
                <text x="405" y="75" fontSize="8.5" fontWeight="800" fill="#a39a8e" letterSpacing="0.6">
                  RELATES_TO
                </text>
                <line x1="400" y1="130" x2="430" y2="175" stroke="#bbafa3" strokeWidth="1.5" markerEnd="url(#arr)" />
                <text x="408" y="150" fontSize="8.5" fontWeight="800" fill="#a39a8e" letterSpacing="0.6">
                  ASSIGNED_TO
                </text>

                <rect x="40" y="35" width="150" height="40" rx="12" fill="#f3efe9" />
                <text x="115" y="52" fontSize="8" fontWeight="800" fill="#a39a8e" textAnchor="middle" letterSpacing="0.8">
                  MEETING
                </text>
                <text x="115" y="66" fontSize="10.5" fontWeight="700" fill="#1f1e1d" textAnchor="middle">
                  Pricing sync
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
                  Hold pricing at $29
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
                  Pricing page → Wayne
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
