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
    title: "Weekly meeting — remote strategy",
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
    snippetPre: '"…launch ',
    match: "pricing",
    snippetPost: ' stays flat at $29 with no tiering until annual plans are introduced…"',
    footLabel: "Document · page 2",
    footAction: "Open document",
    searchText: "pricing one pager tiers 29 launch document pdf",
  },
];

export default function SearchPage() {
  const [query, setQuery] = useState("pricing");
  const [filter, setFilter] = useState<"all" | "transcript" | "document">("all");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RESULTS.filter((r) => (filter === "all" || r.type === filter) && (!q || r.searchText.includes(q)));
  }, [query, filter]);

  return (
    <section className="page" id="page-search">
      <div className="page-scroll">
        <div className="page-inner">
          <div className="screen-head reveal">
            <h1>Search</h1>
            <p>Everything said in meetings and everything shared with them</p>
          </div>

          <div className="search-hero reveal" style={{ animationDelay: ".09s" }}>
            <SearchIcon size={17} />
            <input type="text" aria-label="Search meetings and documents" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>

          <div className="filters reveal" style={{ animationDelay: ".14s" }} role="group" aria-label="Filter results">
            {(["all", "transcript", "document"] as const).map((f) => (
              <button key={f} type="button" className={`filter-chip tap${filter === f ? " is-on" : ""}`} onClick={() => setFilter(f)}>
                {f === "all" ? "All" : f === "transcript" ? "Transcripts" : "Documents"}
              </button>
            ))}
          </div>

          <div className="reveal" style={{ animationDelay: ".18s" }}>
            {results.map((r) => (
              <div className="result-card" key={r.id}>
                <div className="result-top">
                  <strong>{r.title}</strong>
                  <small>{r.meta}</small>
                </div>
                <p className="result-snippet">
                  {r.snippetPre}
                  <mark>{r.match}</mark>
                  {r.snippetPost}
                </p>
                <div className="result-foot">
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
