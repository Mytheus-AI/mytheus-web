"use client";

import { useState } from "react";
import { EditIcon, TrashIcon, SparkleIcon } from "@/components/icons";
import { Tag } from "@/components/Tag";
import { useToast } from "@/contexts/ToastContext";

type Note = {
  id: string;
  text: string;
  captured: boolean;
  relevance?: string;
  timestamp: string;
};

type Group = { id: string; title: string; when: string; notes: Note[] };

const INITIAL_GROUPS: Group[] = [
  {
    id: "pricing-sync",
    title: "Pricing sync",
    when: "Yesterday · 42 min",
    notes: [
      {
        id: "n1",
        text: "Launch pricing holds at $29 through the beta. You own the pricing-page update, due Friday.",
        captured: true,
        relevance: "0.92",
        timestamp: "00:12:45",
      },
      {
        id: "n2",
        text: "No pricing exceptions for the two pilot accounts. Support scripts stay on one price.",
        captured: true,
        relevance: "0.81",
        timestamp: "00:09:33",
      },
    ],
  },
  {
    id: "weekly-meeting",
    title: "Weekly meeting · Remote strategy",
    when: "Monday · 1h 04m",
    notes: [
      {
        id: "n3",
        text: "The beta ships July 21. Your onboarding specs need to reach the design team before then.",
        captured: true,
        relevance: "0.88",
        timestamp: "00:22:10",
      },
      {
        id: "n4",
        text: "Churn numbers move to next week so the data team can finish the cohort view.",
        captured: false,
        timestamp: "00:58:41",
      },
    ],
  },
  {
    id: "design-review",
    title: "Design review · Mobile onboarding",
    when: "Jun 27 · 51 min",
    notes: [
      {
        id: "n5",
        text: "The three-step flow wins. Progress dots replace the percentage bar in your onboarding spec.",
        captured: true,
        relevance: "0.9",
        timestamp: "00:37:02",
      },
    ],
  },
];

export default function WorklogPage() {
  const [groups, setGroups] = useState(INITIAL_GROUPS);
  const toast = useToast();

  const noteCount = groups.reduce((n, g) => n + g.notes.length, 0);

  function deleteNote(groupId: string, noteId: string) {
    setGroups((gs) => gs.map((g) => (g.id === groupId ? { ...g, notes: g.notes.filter((n) => n.id !== noteId) } : g)));
  }

  function exportMarkdown() {
    const md = groups.flatMap((g) => g.notes.map((n) => "- " + n.text)).join("\n");
    navigator.clipboard?.writeText(md).catch(() => {
      /* clipboard unavailable */
    });
    toast("Worklog copied as Markdown");
  }

  return (
    <section className="page" id="page-worklog">
      <div className="page-scroll">
        <div className="page-inner">
          <div className="screen-head reveal">
            <div className="head-text">
              <h1>My worklog</h1>
              <p>Notes your agent captured for you, grouped by meeting</p>
            </div>
            <div className="head-actions">
              <button type="button" className="btn-ghost-sm tap" onClick={exportMarkdown}>
                Export as Markdown
              </button>
              <button type="button" className="btn-accent-sm tap" onClick={() => toast("New note added to today's log")}>
                Add note
              </button>
            </div>
          </div>

          <div className="canvas cols-2 is-fill">
            <div className="rail-stack">
              {groups.map((group, gi) => (
                <div className="panel reveal" style={{ animationDelay: `${0.09 + gi * 0.06}s` }} key={group.id}>
                  <div className="panel-head">
                    <h2>{group.title}</h2>
                    <span className="head-when">{group.when}</span>
                  </div>

                  {group.notes.map((note) => (
                    <div className="panel-row is-top" key={note.id}>
                      <span className="row-body">
                        <p className="row-sum" style={{ marginTop: 0 }}>
                          {note.text}
                        </p>
                        <span className="row-chips">
                          {note.captured ? (
                            <Tag variant="orange" icon={<SparkleIcon size={10} />}>
                              Captured by agent
                            </Tag>
                          ) : (
                            <Tag variant="neutral">Added by you</Tag>
                          )}
                          {note.relevance && <Tag variant="neutral">Relevance {note.relevance}</Tag>}
                          <Tag variant="neutral">{note.timestamp}</Tag>
                        </span>
                      </span>
                      <span className="wl-actions">
                        <button type="button" className="label-icon-btn tap" data-tip="Edit" aria-label="Edit note">
                          <EditIcon />
                        </button>
                        <button
                          type="button"
                          className="label-icon-btn tap"
                          data-tip="Delete"
                          aria-label="Delete note"
                          onClick={() => deleteNote(group.id, note.id)}
                        >
                          <TrashIcon />
                        </button>
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="rail-stack">
              <div className="panel reveal" style={{ animationDelay: ".14s" }}>
                <div className="panel-head">
                  <h2>This week</h2>
                </div>
                <div className="panel-body">
                  <div className="digest-row">
                    <b>{noteCount}</b>
                    <span>notes in your log</span>
                  </div>
                  <div className="digest-row">
                    <b>3</b>
                    <span>meetings covered</span>
                  </div>
                  <div className="digest-row">
                    <b>4</b>
                    <span>turned into tasks</span>
                  </div>
                </div>
              </div>

              <div className="panel reveal" style={{ animationDelay: ".2s" }}>
                <div className="panel-head">
                  <h2>How capture works</h2>
                </div>
                <div className="panel-body">
                  <p className="rail-note" style={{ marginTop: 0 }}>
                    Your agent listens for your role, your skills and your name, then files anything relevant here with a relevance score. Edit or
                    delete freely; the transcript stays untouched.
                  </p>
                  <div className="row-chips">
                    <Tag variant="orange" icon={<SparkleIcon size={10} />}>
                      Filtered for product engineer
                    </Tag>
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
