"use client";

import { useState } from "react";
import { Tag } from "@/components/Tag";
import { Toggle } from "@/components/Toggle";
import { useToast } from "@/contexts/ToastContext";

const INTEGRATIONS = [
  {
    id: "gcal",
    name: "Google Calendar",
    desc: "New events create meetings and prep briefs",
    connected: true,
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3.5" y="5" width="17" height="16" rx="3" />
        <path d="M3.5 10h17M8 2.5V6M16 2.5V6" />
      </svg>
    ),
  },
  {
    id: "slack",
    name: "Slack",
    desc: "Prep briefs 1 hour before · summaries after",
    connected: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
        <path d="M9 4v16M15 4v16M4 9h16M4 15h16" />
      </svg>
    ),
  },
  {
    id: "jira",
    name: "Jira",
    desc: "Two-way sync for action items",
    connected: false,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
        <path d="m12 2.5 9.5 9.5-9.5 9.5L2.5 12 12 2.5Z" />
      </svg>
    ),
  },
  {
    id: "linear",
    name: "Linear",
    desc: "Alternative to Jira — pick one",
    connected: false,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <path d="m8.5 12 2.5 2.5 4.5-5" />
      </svg>
    ),
  },
];

const NOTIFICATION_PREFS = [
  { id: "prep", title: "Prep brief before each meeting", desc: "Sent to Slack one hour before" },
  { id: "summary", title: "Summary after each meeting", desc: "One per meeting, sent as a DM" },
  { id: "reminders", title: "Task reminders", desc: "Day 1, 3 and 7 — then your lead is looped in" },
];

const AGENT_PREFS = [
  { id: "capture", title: "Capture notes during meetings", desc: "Role-filtered notes into your worklog" },
  { id: "suggest", title: "Suggest questions in real time", desc: "Only when past meetings hold missing context" },
  { id: "alerts", title: "Proactive alerts", desc: "Conflicts, workload and missing stakeholders" },
  { id: "answer", title: "Answer other agents' questions", desc: "Teammates' agents can ask yours for context from meetings you attended" },
];

export default function SettingsPage() {
  const [connected, setConnected] = useState<Record<string, boolean>>(
    Object.fromEntries(INTEGRATIONS.map((i) => [i.id, i.connected]))
  );
  const toast = useToast();

  return (
    <section className="page" id="page-settings">
      <div className="page-scroll">
        <div className="page-inner" style={{ maxWidth: 1040 }}>
          <div className="screen-head reveal">
            <h1>Settings</h1>
            <p>Integrations and how your agent behaves</p>
          </div>

          <div className="settings-grid">
            <div className="profile-stack reveal" style={{ animationDelay: ".09s" }}>
              <div className="white-card">
                <div className="section-label" style={{ padding: "0 0 6px" }}>
                  Integrations
                </div>
                {INTEGRATIONS.map((integration) => (
                  <div className="int-row" key={integration.id}>
                    <span className="int-logo">{integration.icon}</span>
                    <span className="int-body">
                      <strong>{integration.name}</strong>
                      <small>{integration.desc}</small>
                    </span>
                    {connected[integration.id] ? (
                      <Tag variant="green" dot>
                        Connected
                      </Tag>
                    ) : (
                      <button
                        type="button"
                        className="connect-btn tap"
                        onClick={() => {
                          setConnected((c) => ({ ...c, [integration.id]: true }));
                          toast("Connected — action items will sync both ways");
                        }}
                      >
                        Connect
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="white-card">
                <div className="section-label" style={{ padding: "0 0 6px" }}>
                  Notifications
                </div>
                {NOTIFICATION_PREFS.map((pref) => (
                  <div className="pref-row" key={pref.id}>
                    <span className="pref-body">
                      <strong>{pref.title}</strong>
                      <small>{pref.desc}</small>
                    </span>
                    <Toggle defaultOn label={pref.title} />
                  </div>
                ))}
              </div>
            </div>

            <div className="profile-stack reveal" style={{ animationDelay: ".18s" }}>
              <div className="white-card">
                <div className="section-label" style={{ padding: "0 0 6px" }}>
                  My agent
                </div>
                {AGENT_PREFS.map((pref) => (
                  <div className="pref-row" key={pref.id}>
                    <span className="pref-body">
                      <strong>{pref.title}</strong>
                      <small>{pref.desc}</small>
                    </span>
                    <Toggle defaultOn label={pref.title} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
