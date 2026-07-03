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
        text: "No pricing exceptions for the two pilot accounts — support scripts stay on one price.",
        captured: true,
        relevance: "0.81",
        timestamp: "00:09:33",
      },
    ],
  },
  {
    id: "weekly-meeting",
    title: "Weekly meeting — remote strategy",
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
];

export default function WorklogPage() {
  const [groups, setGroups] = useState(INITIAL_GROUPS);
  const toast = useToast();

  function deleteNote(groupId: string, noteId: string) {
    setGroups((gs) => gs.map((g) => (g.id === groupId ? { ...g, notes: g.notes.filter((n) => n.id !== noteId) } : g)));
  }

  function exportMarkdown() {
    const md = groups.flatMap((g) => g.notes.map((n) => "- " + n.text)).join("\n");
    try {
      navigator.clipboard.writeText(md);
    } catch {
      /* clipboard unavailable */
    }
    toast("Worklog copied as Markdown");
  }

  return (
    <section className="page" id="page-worklog">
      <div className="page-scroll">
        <div className="page-inner">
          <div className="screen-head reveal" style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <h1>My worklog</h1>
              <p>Notes your agent captured for you, grouped by meeting</p>
            </div>
            <button type="button" className="btn-ghost-sm tap" onClick={exportMarkdown}>
              Export as Markdown
            </button>
          </div>

          {groups.map((group, gi) => (
            <div className="wl-group reveal" style={{ animationDelay: `${0.09 + gi * 0.09}s` }} key={group.id}>
              <div className="wl-head">
                <strong>{group.title}</strong>
                <small>{group.when}</small>
              </div>

              {group.notes.map((note) => (
                <div className="wl-note" key={note.id}>
                  <div className="wl-body">
                    <p>{note.text}</p>
                    <div className="wl-meta">
                      {note.captured ? (
                        <Tag variant="orange" icon={<SparkleIcon size={10} />}>
                          Captured by agent
                        </Tag>
                      ) : (
                        <Tag variant="neutral">Added by you</Tag>
                      )}
                      {note.relevance && <Tag variant="neutral">Relevance {note.relevance}</Tag>}
                      <Tag variant="neutral">{note.timestamp}</Tag>
                    </div>
                  </div>
                  <div className="wl-actions">
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
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
