"use client";

import { useState } from "react";
import { Tag } from "@/components/Tag";
import { Toggle } from "@/components/Toggle";
import { Select } from "@/components/Select";
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
    desc: "Prep briefs an hour before, summaries after",
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
    desc: "Alternative to Jira, pick one",
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
  { id: "reminders", title: "Task reminders", desc: "Day 1, 3 and 7, then your lead is looped in" },
];

const AGENT_PREFS = [
  { id: "capture", title: "Capture notes during meetings", desc: "Role-filtered notes into your worklog" },
  { id: "suggest", title: "Suggest questions in real time", desc: "Only when past meetings hold missing context" },
  { id: "alerts", title: "Proactive alerts", desc: "Conflicts, workload and missing stakeholders" },
  { id: "answer", title: "Answer other agents' questions", desc: "Teammates' agents can ask yours for context from meetings you attended" },
];

const SECTIONS = [
  { id: "integrations", label: "Integrations" },
  { id: "notifications", label: "Notifications" },
  { id: "agent", label: "My agent" },
  { id: "data", label: "Data & privacy" },
];

export default function SettingsPage() {
  const [connected, setConnected] = useState<Record<string, boolean>>(
    Object.fromEntries(INTEGRATIONS.map((i) => [i.id, i.connected]))
  );
  const [active, setActive] = useState("integrations");
  const [surfacing, setSurfacing] = useState("Balanced");
  const toast = useToast();

  function jumpTo(id: string) {
    setActive(id);
    document.getElementById(`settings-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="page" id="page-settings">
      <div className="page-scroll">
        <div className="page-inner" style={{ maxWidth: 1240 }}>
          <div className="screen-head reveal">
            <div className="head-text">
              <h1>Settings</h1>
              <p>Integrations and how your agent behaves</p>
            </div>
          </div>

          <div className="canvas cols-2r is-fill" style={{ gridTemplateColumns: "230px minmax(0,1fr)" }}>
            <div className="panel settings-nav reveal" style={{ animationDelay: ".07s" }}>
              {SECTIONS.map((s) => (
                <button key={s.id} type="button" className={`panel-row facet-row tap${active === s.id ? " is-selected" : ""}`} onClick={() => jumpTo(s.id)}>
                  <span className="facet-name">{s.label}</span>
                </button>
              ))}
            </div>

            <div className="rail-stack">
              <div className="panel reveal" id="settings-integrations" style={{ animationDelay: ".1s" }}>
                <div className="panel-head">
                  <h2>Integrations</h2>
                  <span className="head-when">2 of 4 connected</span>
                </div>
                {INTEGRATIONS.map((integration) => (
                  <div className="panel-row" key={integration.id}>
                    <span className="int-logo">{integration.icon}</span>
                    <span className="row-body">
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
                          toast("Connected. Action items now sync both ways.");
                        }}
                      >
                        Connect
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="panel reveal" id="settings-notifications" style={{ animationDelay: ".14s" }}>
                <div className="panel-head">
                  <h2>Notifications</h2>
                </div>
                {NOTIFICATION_PREFS.map((pref) => (
                  <div className="panel-row" key={pref.id}>
                    <span className="row-body">
                      <strong>{pref.title}</strong>
                      <small>{pref.desc}</small>
                    </span>
                    <Toggle defaultOn label={pref.title} />
                  </div>
                ))}
              </div>

              <div className="panel reveal" id="settings-agent" style={{ animationDelay: ".18s" }}>
                <div className="panel-head">
                  <h2>My agent</h2>
                </div>
                {AGENT_PREFS.map((pref) => (
                  <div className="panel-row" key={pref.id}>
                    <span className="row-body">
                      <strong>{pref.title}</strong>
                      <small>{pref.desc}</small>
                    </span>
                    <Toggle defaultOn label={pref.title} />
                  </div>
                ))}
                <div className="panel-row">
                  <span className="row-body">
                    <strong>Surfacing threshold</strong>
                    <small>How confident the agent must be before it interrupts you in a meeting</small>
                  </span>
                  <div className="seg" role="group" aria-label="Surfacing threshold">
                    {["Surface more", "Balanced", "High only"].map((option) => (
                      <button key={option} type="button" className={`seg-btn tap${surfacing === option ? " is-on" : ""}`} onClick={() => setSurfacing(option)}>
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="panel-row">
                  <span className="row-body">
                    <strong>AI usage this month</strong>
                    <small>62% of included usage · you get an alert at 80% and 95%</small>
                    <span className="meter" style={{ maxWidth: 220, marginTop: 7 }} role="img" aria-label="62 percent of monthly AI usage used">
                      <i style={{ width: "62%" }}></i>
                    </span>
                  </span>
                </div>
              </div>

              <div className="panel reveal" id="settings-data" style={{ animationDelay: ".22s" }}>
                <div className="panel-head">
                  <h2>Data &amp; privacy</h2>
                </div>
                <div className="panel-row">
                  <span className="row-body">
                    <strong>Redact personal data in transcripts</strong>
                    <small>Emails, phone numbers and IDs become placeholders like ‹EMAIL› before anything is stored</small>
                  </span>
                  <Toggle label="Redact personal data in transcripts" />
                </div>
                <div className="panel-row">
                  <span className="row-body">
                    <strong>Data residency</strong>
                    <small>Where recordings, transcripts and notes are stored</small>
                  </span>
                  <div style={{ width: 172, flexShrink: 0 }}>
                    <Select
                      label="Data residency"
                      compact
                      options={["United States", "European Union", "Asia-Pacific"]}
                      onChange={(region) => toast(`New recordings will be stored in ${region}`)}
                    />
                  </div>
                </div>
                <div className="panel-row">
                  <span className="row-body">
                    <strong>Recording retention</strong>
                    <small>Recordings and transcripts are kept for 12 months, then deleted</small>
                  </span>
                  <Tag variant="neutral">12 months</Tag>
                </div>
                <div className="panel-row">
                  <span className="row-body">
                    <strong>Export your data</strong>
                    <small>Transcripts, decisions and worklog as a single archive</small>
                  </span>
                  <button type="button" className="btn-ghost-sm tap" onClick={() => toast("Export started. We will email you a download link.")}>
                    Request export
                  </button>
                </div>
                <div className="panel-row">
                  <span className="row-body">
                    <strong>Delete my data</strong>
                    <small>Removes every recording, transcript and note tied to your account</small>
                  </span>
                  <button type="button" className="btn-ghost-sm tap danger-btn" onClick={() => toast("Deletion requires a confirmation email. Check your inbox.")}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
