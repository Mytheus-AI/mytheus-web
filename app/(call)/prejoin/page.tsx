"use client";

import { useState } from "react";
import Link from "next/link";
import { WaveIcon, CamIcon, MicIcon, SparkleIcon, CheckIcon } from "@/components/icons";
import { Select } from "@/components/Select";
import { leaveCallWindow } from "@/lib/callWindow";

const AGENT_PREP = [
  { kind: "decision", text: "The three-step flow decision from Jun 27 is loaded for reference." },
  { kind: "note", text: "Prep brief covers the two questions design left open last time." },
  { kind: "action", text: "Your onboarding-specs task is due today. Expect it to come up." },
  { kind: "question", text: "Rosa asked for the progress-dots spec. It is linked in the brief." },
];

export default function PrejoinPage() {
  const [micOff, setMicOff] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [agreed, setAgreed] = useState(false);

  return (
    <section className="page" id="page-prejoin">
      <div className="page-scroll">
        <div className="page-inner" style={{ maxWidth: 1240 }}>
          <div className="screen-head reveal">
            <div className="head-text">
              <h1>Ready to join?</h1>
              <p>Check your camera and mic. Your agent joins with you and starts taking notes.</p>
            </div>
          </div>

          <div className="canvas is-fill" style={{ gridTemplateColumns: "minmax(0,1fr) 380px" }}>
            <div className="pv-left">
            <div className={`pv-stage reveal${camOff ? " is-cam-off" : ""}`} style={{ animationDelay: ".07s" }} role="img" aria-label="Your camera preview">
              {camOff && (
                <span className="pv-initials" aria-hidden="true">
                  WS
                </span>
              )}
              <span className="preview-name scrim-pill">
                {!micOff && <WaveIcon />}
                Wayne · camera is {camOff ? "off" : "on"}
              </span>
              {!micOff && (
                <span className="mic-meter scrim-pill" role="img" aria-label="Microphone level">
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                </span>
              )}
              <div className="controls" role="toolbar" aria-label="Preview controls">
                <button
                  className={`ctl tap${micOff ? " is-off" : ""}`}
                  data-tip={micOff ? "Unmute" : "Mute"}
                  aria-label="Toggle microphone"
                  aria-pressed={micOff}
                  onClick={() => setMicOff((v) => !v)}
                >
                  <MicIcon off={micOff} />
                </button>
                <button
                  className={`ctl tap${camOff ? " is-off" : ""}`}
                  data-tip={camOff ? "Camera on" : "Camera off"}
                  aria-label="Toggle camera"
                  aria-pressed={camOff}
                  onClick={() => setCamOff((v) => !v)}
                >
                  <CamIcon off={camOff} />
                </button>
              </div>
            </div>

            <div className="panel reveal" style={{ animationDelay: ".18s" }}>
              <div className="panel-body" style={{ padding: "14px 18px 16px", display: "flex", gap: 14 }}>
                <Select label="Camera" options={["Built-in HD camera", "USB webcam"]} openUp />
                <Select label="Microphone" options={["Built-in microphone", "Headset"]} openUp />
              </div>
            </div>
            </div>

            <div className="rail-stack">
              <div className="panel reveal" style={{ animationDelay: ".12s" }}>
                <div className="panel-head">
                  <h2>Meeting</h2>
                  <span className="live-chip" style={{ marginLeft: "auto" }}>
                    <span className="live-dot" aria-hidden="true"></span>Starts in 4 min
                  </span>
                </div>
                <div className="panel-body">
                  <h3 className="detail-title" style={{ fontSize: 19 }}>
                    Design review · Mobile onboarding
                  </h3>
                  <p className="detail-by">45 min · 5 people invited</p>
                  <div className="pv-lobby">
                    <span className="av-stack">
                      <i style={{ backgroundImage: "url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=60&auto=format&fit=crop'), linear-gradient(140deg,#e4ddd2,#c9bfae)" }} />
                      <i style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=60&auto=format&fit=crop'), linear-gradient(140deg,#e4ddd2,#c9bfae)" }} />
                      <i style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=60&auto=format&fit=crop'), linear-gradient(140deg,#e4ddd2,#c9bfae)" }} />
                      <span className="av-more">+2</span>
                    </span>
                    <span className="pv-lobby-note">Rosa and Sufjan are already in the lobby</span>
                  </div>
                </div>
              </div>

              <div className="panel reveal" style={{ flex: 1, animationDelay: ".17s" }}>
                <div className="panel-head">
                  <h2>Your agent is ready</h2>
                  <SparkleIcon size={12} />
                </div>
                {AGENT_PREP.map((p) => (
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

              <div className="consent-card reveal" style={{ animationDelay: ".21s" }}>
                <div className="consent-row">
                  <span className="consent-ic" aria-hidden="true">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <circle cx="12" cy="12" r="8.5" />
                      <circle cx="12" cy="12" r="3.5" fill="currentColor" stroke="none" />
                    </svg>
                  </span>
                  <span className="consent-body">
                    <strong>This meeting is recorded and transcribed</strong>
                    <small>Your agent listens to take notes. The recording and transcript stay in your workspace and follow its retention rules.</small>
                  </span>
                </div>
                <button type="button" className="consent-check tap" role="checkbox" aria-checked={agreed} onClick={() => setAgreed((v) => !v)}>
                  <span className={`task-check${agreed ? " is-checked" : ""}`} aria-hidden="true">
                    <CheckIcon size={11} />
                  </span>
                  I understand — join with recording on
                </button>
              </div>

              <div className="pv-actions reveal" style={{ animationDelay: ".24s" }}>
                <button type="button" className="btn-ghost tap" onClick={leaveCallWindow}>
                  Cancel
                </button>
                {agreed ? (
                  <Link href="/meeting" className="join-btn tap">
                    <CamIcon size={16} />
                    Join meeting
                  </Link>
                ) : (
                  <button type="button" className="join-btn is-locked" aria-disabled="true" data-tip="Acknowledge recording to join">
                    <CamIcon size={16} />
                    Join meeting
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
