"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SearchIcon } from "@/components/icons";
import { Tag } from "@/components/Tag";

type Result = {
  id: string;
  type: "transcript" | "document";
  title: string;
  meta: string;
  snippetPre: string;
  match: string;
  snippetPost: string;
  footLabel: string;
  footAction: string;
  footHref?: string;
  searchText: string;
};

const RESULTS: Result[] = [
  {
    id: "r1",
    type: "transcript",
    title: "Pricing sync",
    meta: "Yesterday · 00:03:47",
    snippetPre: '"My proposal stands: hold launch ',
    match: "pricing",
    snippetPost: ' at $29 through the beta and revisit annual discounts after."',
    footLabel: "Transcript · Wayne",
    footAction: "Open transcript",
    footHref: "/transcript",
    searchText: "my proposal stands hold launch pricing at 29 through the beta wayne pricing sync",
  },
  {
    id: "r2",
    type: "transcript",
    title: "Weekly meeting · Remote strategy",
    meta: "Monday · 00:31:12",
    snippetPre: '"Annual ',
    match: "pricing",
    snippetPost: ' comes back to this group after launch with real usage data."',
    footLabel: "Transcript · Milana",
    footAction: "Open transcript",
    footHref: "/transcript",
    searchText: "annual pricing comes back to this group after launch milana weekly meeting",
  },
  {
    id: "r3",
    type: "document",
    title: "Pricing one-pager.pdf",
    meta: "Shared in Pricing sync",
    snippetPre: '"launch ',
    match: "pricing",
    snippetPost: ' stays flat at $29 with no tiering until annual plans are introduced"',
    footLabel: "Document · page 2",
    footAction: "Open document",
    searchText: "pricing one pager tiers 29 launch document pdf",
  },
];

const RECENT = ["pricing", "churn cohort", "beta date", "onboarding flow"];

export default function SearchPage() {
  const [query, setQuery] = useState("pricing");
  const [filter, setFilter] = useState<"all" | "transcript" | "document">("all");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RESULTS.filter((r) => (filter === "all" || r.type === filter) && (!q || r.searchText.includes(q)));
  }, [query, filter]);

  const counts = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = RESULTS.filter((r) => !q || r.searchText.includes(q));
    return {
      all: base.length,
      transcript: base.filter((r) => r.type === "transcript").length,
      document: base.filter((r) => r.type === "document").length,
    };
  }, [query]);

  return (
    <section className="page" id="page-search">
      <div className="page-scroll">
        <div className="page-inner">
          <div className="screen-head reveal">
            <div className="head-text">
              <h1>Search</h1>
              <p>Everything said in meetings and everything shared with them</p>
            </div>
          </div>

          <div className="search-hero reveal" style={{ animationDelay: ".07s" }}>
            <SearchIcon size={17} />
            <input type="text" aria-label="Search meetings and documents" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>

          <div className="canvas cols-2r is-fill">
            <div className="rail-stack">
              <div className="panel reveal" style={{ animationDelay: ".12s" }}>
                <div className="panel-head">
                  <h2>Show</h2>
                </div>
                {(["all", "transcript", "document"] as const).map((f) => (
                  <button key={f} type="button" className={`panel-row facet-row tap${filter === f ? " is-selected" : ""}`} onClick={() => setFilter(f)}>
                    <span className="facet-name">{f === "all" ? "Everything" : f === "transcript" ? "Transcripts" : "Documents"}</span>
                    <span className="count-chip">{counts[f]}</span>
                  </button>
                ))}
              </div>

              <div className="panel reveal" style={{ animationDelay: ".18s" }}>
                <div className="panel-head">
                  <h2>Recent searches</h2>
                </div>
                <div className="panel-body">
                  <div className="row-chips" style={{ marginTop: 0 }}>
                    {RECENT.map((r) => (
                      <button key={r} type="button" className="filter-chip tap" onClick={() => setQuery(r)}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="panel reveal" style={{ animationDelay: ".24s" }}>
                <div className="panel-head">
                  <h2>Tip</h2>
                </div>
                <div className="panel-body">
                  <p className="rail-note" style={{ marginTop: 0 }}>
                    Search matches spoken words, not just titles. Try a phrase you remember hearing, then jump straight to that moment in the
                    recording.
                  </p>
                </div>
              </div>
            </div>

            <div className="panel reveal" style={{ animationDelay: ".12s" }}>
              <div className="panel-head">
                <h2>Results</h2>
                <span className="count-chip">{results.length}</span>
                {query.trim() && <span className="head-when">for &quot;{query.trim()}&quot;</span>}
              </div>

              {results.map((r) => (
                <div className="panel-row is-top" key={r.id}>
                  <span className="row-body">
                    <span className="row-title-line">
                      <strong>{r.title}</strong>
                      <small>{r.meta}</small>
                    </span>
                    <p className="result-snippet">
                      {r.snippetPre}
                      <mark>{r.match}</mark>
                      {r.snippetPost}
                    </p>
                    <span className="row-chips">
                      {r.type === "document" ? (
                        <Tag variant="brown" dot>
                          {r.footLabel}
                        </Tag>
                      ) : (
                        <Tag variant="neutral">{r.footLabel}</Tag>
                      )}
                      {r.footHref ? (
                        <Link href={r.footHref} className="recap-link tap" style={{ marginLeft: "auto" }}>
                          {r.footAction}
                        </Link>
                      ) : (
                        <button type="button" className="recap-link tap" style={{ marginLeft: "auto" }}>
                          {r.footAction}
                        </button>
                      )}
                    </span>
                  </span>
                </div>
              ))}

              {results.length === 0 && (
                <div className="board-empty">
                  No matches for &quot;{query.trim()}&quot;. Try a phrase someone said, or clear a filter.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
