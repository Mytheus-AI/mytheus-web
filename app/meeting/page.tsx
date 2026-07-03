"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MicIcon, CamIcon, WaveIcon, MoreDotsIcon, PeopleIcon, SendIcon, PlusIcon } from "@/components/icons";
import { CollapseSection } from "@/components/CollapseSection";
import { useMeetingUI } from "@/contexts/MeetingUIContext";
import { useToast } from "@/contexts/ToastContext";

type Participant = { id: string; name: string; handle: string; av: string; status: "mic" | "cam" | "speaking" };

const INITIAL_PARTICIPANTS: Participant[] = [
  { id: "wayne", name: "Wayne (You)", handle: "@johnwayne", av: "p-av-1", status: "cam" },
  { id: "cloe", name: "Cloe", handle: "@cloerose", av: "p-av-3", status: "speaking" },
  { id: "sufjan", name: "Sufjan", handle: "@sufjansteven", av: "p-av-2", status: "mic" },
  { id: "joji", name: "Joji", handle: "@itsjoji", av: "p-av-4", status: "cam" },
  { id: "milana", name: "Milana", handle: "@milanaray", av: "p-av-5", status: "mic" },
  { id: "keith", name: "Keith", handle: "@keithnorth", av: "p-av-6", status: "cam" },
  { id: "thomas", name: "Thomas", handle: "@thomasup", av: "p-av-7", status: "mic" },
];

type ChatMessage = {
  id: string;
  kind: "received" | "sent" | "typing";
  who?: string;
  av?: string;
  isBrand?: boolean;
  host?: boolean;
  time?: string;
  text?: string;
  link?: { label: string };
  reactions?: string;
};

const INITIAL_CHAT: ChatMessage[] = [
  { id: "c1", kind: "received", who: "Keith", av: "c-av-keith", time: "3 min ago", text: "@johnwayne u can check this one : ", link: { label: "dribble.com/shot46769" }, reactions: "👌👍❤️" },
  { id: "c2", kind: "received", who: "Mytheus", isBrand: true, host: true, time: "2 min ago", text: "I think this webinar will provide us with some great insights." },
  { id: "c3", kind: "sent", who: "You", av: "c-av-you", time: "1 min ago", text: "Thankyou, Keith!" },
  { id: "typing", kind: "typing", who: "Thomas", av: "c-av-thomas" },
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function MeetingPage() {
  const { sideVisible, admitParticipant } = useMeetingUI();
  const toast = useToast();

  const [secs, setSecs] = useState(56 * 60 + 32);
  const [micOff, setMicOff] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [recOn, setRecOn] = useState(false);
  const [handUp, setHandUp] = useState(false);
  const [joinCardVisible, setJoinCardVisible] = useState(true);
  const [joinCardLeaving, setJoinCardLeaving] = useState(false);
  const [participants, setParticipants] = useState(INITIAL_PARTICIPANTS);
  const [chat, setChat] = useState(INITIAL_CHAT);
  const [chatInput, setChatInput] = useState("");
  const [pinned, setPinned] = useState("milana");
  const [sug1Visible, setSug1Visible] = useState(true);
  const [decCard, setDecCard] = useState<"pending" | "confirmed" | "dismissed">("pending");
  const chatBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (chatBodyRef.current) chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === "m") setMicOff((v) => !v);
      if (k === "v") setCamOff((v) => !v);
      if (k === "r") setRecOn((v) => !v);
      if (k === "h") setHandUp((v) => !v);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function dismissJoinCard() {
    setJoinCardLeaving(true);
    setTimeout(() => setJoinCardVisible(false), 240);
  }

  function acceptJoin() {
    dismissJoinCard();
    admitParticipant();
    setParticipants((p) => [{ id: "lisbon", name: "Lisbon", handle: "@lisbon", av: "p-av-lisbon", status: "mic" }, ...p]);
  }

  function sendChat(e: React.FormEvent) {
    e.preventDefault();
    const text = chatInput.trim();
    if (!text) return;
    setChat((c) => [...c.filter((m) => m.id !== "typing"), { id: `sent-${Date.now()}`, kind: "sent", who: "You", av: "c-av-you", time: "Now", text }, ...c.filter((m) => m.id === "typing")]);
    setChatInput("");
    requestAnimationFrame(() => {
      if (chatBodyRef.current) chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    });
  }

  const timeStr = `${pad(Math.floor(secs / 3600))}:${pad(Math.floor((secs % 3600) / 60))}:${pad(secs % 60)}`;

  return (
    <section className={`page meeting-page${sideVisible ? "" : " side-hidden"}`} id="page-meeting">
      <section className="stage" aria-label="Meeting stage">
        <div className="main-video reveal" style={{ animationDelay: ".09s" }} role="img" aria-label="Cloe's video, speaking">
          <div className={`timer-pill scrim-pill${recOn ? " is-rec" : ""}`}>
            <span className="rec-dot" aria-hidden="true"></span>
            <svg width="15" height="12" viewBox="0 0 16 14" fill="currentColor">
              <rect x="0" y="4" width="2.2" height="6" rx="1.1" />
              <rect x="4.6" y="1" width="2.2" height="12" rx="1.1" />
              <rect x="9.2" y="5" width="2.2" height="4" rx="1.1" />
              <rect x="13.8" y="2.5" width="2.2" height="9" rx="1.1" />
            </svg>
            <span>{timeStr}</span>
          </div>

          {joinCardVisible && (
            <div className={`join-card${joinCardLeaving ? " is-leaving" : ""}`}>
              <span className="join-avatar" aria-hidden="true"></span>
              <span className="join-text">
                <small>Wants to join the meeting</small>
                <strong>Lisbon</strong>
              </span>
              <button className="join-deny tap" data-tip="Deny" aria-label="Deny Lisbon" onClick={dismissJoinCard}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
              <button className="join-accept tap" data-tip="Admit" aria-label="Admit Lisbon" onClick={acceptJoin}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m4.5 12.5 5 5 10-11" />
                </svg>
              </button>
            </div>
          )}

          <div className="name-pill scrim-pill">
            <WaveIcon />
            Cloe&nbsp;<small>· Speaking</small>
          </div>

          <div className="controls" role="toolbar" aria-label="Call controls">
            <button
              className={`ctl tap${micOff ? " is-off" : ""}`}
              data-tip={micOff ? "Unmute · M" : "Mute · M"}
              aria-label="Mute microphone"
              aria-pressed={micOff}
              onClick={() => setMicOff((v) => !v)}
            >
              <MicIcon off={micOff} />
            </button>
            <button
              className={`ctl tap${camOff ? " is-off" : ""}`}
              data-tip={camOff ? "Camera on · V" : "Camera off · V"}
              aria-label="Turn camera off"
              aria-pressed={camOff}
              onClick={() => setCamOff((v) => !v)}
            >
              <CamIcon off={camOff} />
            </button>
            <button className="ctl tap" data-tip="Share screen · S" aria-label="Share screen">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4.5" width="18" height="13" rx="2.5" />
                <path d="m9 11 3-3 3 3M12 8v6M8 21h8" />
              </svg>
            </button>
            <button
              className={`ctl tap${recOn ? " is-active" : ""}`}
              data-tip={recOn ? "Stop recording · R" : "Record · R"}
              aria-label="Start recording"
              aria-pressed={recOn}
              onClick={() => setRecOn((v) => !v)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="8.5" />
                <circle cx="12" cy="12" r="3.5" fill="currentColor" stroke="none" />
              </svg>
            </button>

            <span className="ctl-sep" aria-hidden="true"></span>

            <button
              className={`ctl tap${handUp ? " is-active" : ""}`}
              data-tip={handUp ? "Lower hand · H" : "Raise hand · H"}
              aria-label="Raise hand"
              aria-pressed={handUp}
              onClick={() => setHandUp((v) => !v)}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 12V5.5a1.5 1.5 0 0 1 3 0V11M11 11V4a1.5 1.5 0 0 1 3 0v7M14 11V5.5a1.5 1.5 0 0 1 3 0V13" />
                <path d="M8 12l-1.8-2a1.6 1.6 0 0 0-2.5 2l4 6a6 6 0 0 0 5 3h1.3a5 5 0 0 0 5-5v-4" />
              </svg>
            </button>
            <button className="ctl tap" data-tip="Change layout · L" aria-label="Change layout">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <rect x="3.5" y="3.5" width="7" height="7" rx="2" />
                <rect x="13.5" y="3.5" width="7" height="7" rx="2" />
                <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
                <rect x="13.5" y="13.5" width="7" height="7" rx="2" />
              </svg>
            </button>

            <Link href="/home" className="ctl-leave tap" aria-label="Leave meeting">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 14.5c5-4 11-4 16 0l-1.5 3c-.5 1-1.6 1.3-2.6.8l-2.4-1.2a2 2 0 0 1-1-2.3l.2-.8h-1.4l.2.8a2 2 0 0 1-1 2.3l-2.4 1.2c-1 .5-2.1.2-2.6-.8L4 14.5Z" />
              </svg>
              Leave
            </Link>
          </div>
        </div>

        <div className="thumbs" aria-label="Participant videos">
          {[
            { id: "milana", cls: "thumb-1", name: "Milana", speaking: true, mic: "on", label: "Milana's video, speaking" },
            { id: "rosa", cls: "thumb-2", name: "Rosa", speaking: false, mic: "muted", label: "Rosa's video, muted" },
            { id: "sufjan", cls: "thumb-3", name: "Sufjan", speaking: false, mic: "on", label: "Sufjan's video" },
          ].map((t, i) => (
            <div className={`thumb ${t.cls}${t.speaking ? " is-speaking" : ""} reveal`} style={{ animationDelay: `${0.18 + i * 0.09}s` }} role="img" aria-label={t.label} key={t.id}>
              <button
                className={`thumb-pin tap${pinned === t.id ? " is-pinned" : ""}`}
                data-tip={pinned === t.id ? "Unpin" : "Pin"}
                aria-label={`${pinned === t.id ? "Unpin" : "Pin"} ${t.name}`}
                aria-pressed={pinned === t.id}
                onClick={() => setPinned((p) => (p === t.id ? "" : t.id))}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 4h6l1 7 2.5 2.5h-13L8 11l1-7Z" />
                  <path d="M12 13.5V21" />
                </svg>
              </button>
              <span className="thumb-name scrim-pill">
                {t.speaking && <WaveIcon />}
                {t.name}
              </span>
              <span className={`thumb-mic is-${t.mic}`} aria-label={t.mic === "muted" ? "Microphone muted" : "Microphone on"}>
                <MicIcon size={11} off={t.mic === "muted"} />
              </span>
            </div>
          ))}

          <button className="more-pill tap reveal" style={{ animationDelay: ".45s" }} aria-label="Show 12 more participants">
            <span className="mini-av mini-av-1"></span>
            <span className="mini-av mini-av-2"></span>
            <b>12+</b>
          </button>
        </div>
      </section>

      <aside className="side">
        <div className="side-inner">
            <div className="reveal" style={{ animationDelay: ".14s" }}>
              <CollapseSection
                title="My agent"
                countChip={
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 4c.9 4.4 3.6 7.1 8 8-4.4.9-7.1 3.6-8 8-.9-4.4-3.6-7.1-8-8 4.4-.9 7.1-3.6 8-8Z" />
                  </svg>
                }
                actions={
                  <Link href="/settings" className="label-icon-btn tap" data-tip="Agent settings" aria-label="Agent settings">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3 1a7 7 0 0 0-2-1.2L14.2 3H9.8l-.4 2.7a7 7 0 0 0-2 1.2l-2.3-1-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-1a7 7 0 0 0 2 1.2l.4 2.7h4.4l.4-2.7a7 7 0 0 0 2-1.2l2.3 1 2-3.4-2-1.5c.1-.4.1-.8.1-1.2Z" />
                    </svg>
                  </Link>
                }
              >
                <div className="agent-stack">
                  <div className="conflict-banner" role="alert">
                    <b>Possible conflict.</b> &quot;Annual discounts after the beta&quot; contradicts a decision from the May 12 pricing sync.
                    <Link href="/decisions" className="conflict-link tap">
                      View that decision
                    </Link>
                  </div>

                  {sug1Visible && (
                    <div className="sug-card sug-urgent">
                      <div className="sug-kind">
                        Suggested question <span className="conf">for your role</span>
                      </div>
                      <p className="sug-text">Which pilot accounts are excluded from the $29 hold?</p>
                      <div className="sug-actions">
                        <button
                          className="sug-btn sug-btn-primary tap"
                          onClick={(e) => {
                            try {
                              navigator.clipboard.writeText("Which pilot accounts are excluded from the $29 hold?");
                            } catch {
                              /* clipboard unavailable */
                            }
                            (e.target as HTMLButtonElement).textContent = "Copied";
                            toast("Question copied — paste it into chat");
                          }}
                        >
                          Ask now
                        </button>
                        <button
                          className="sug-btn tap"
                          onClick={() => {
                            setSug1Visible(false);
                            toast("Saved — it will be waiting in your next meeting");
                          }}
                        >
                          Save for later
                        </button>
                        <button className="sug-btn tap" onClick={() => setSug1Visible(false)}>
                          Dismiss
                        </button>
                      </div>
                    </div>
                  )}

                  {decCard !== "dismissed" && (
                    <div className="sug-card sug-useful">
                      <div className="sug-kind">
                        Decision detected <span className="conf">0.86</span>
                      </div>
                      <p className="sug-text">Hold launch pricing at $29 through the beta.</p>
                      {decCard === "confirmed" ? (
                        <div className="sug-actions">
                          <span className="tag tag-green">
                            <span className="tag-dot"></span>Confirmed — saved to decision history
                          </span>
                        </div>
                      ) : (
                        <div className="sug-actions">
                          <button
                            className="sug-btn sug-btn-primary tap"
                            onClick={() => {
                              setDecCard("confirmed");
                              toast("Decision saved to history");
                            }}
                          >
                            Confirm
                          </button>
                          <button className="sug-btn tap" data-tip="Edit before saving">
                            Edit
                          </button>
                          <button className="sug-btn tap" onClick={() => setDecCard("dismissed")}>
                            Dismiss
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="agent-note">
                    Cloe wants the churn cohort view ready before the numbers go to next week&apos;s agenda.
                    <br />
                    <span className="cite-chip">From transcript · 00:41:08</span>
                  </div>

                  <div className="agent-note">
                    Context added from Milana&apos;s agent — the beta date moved to July 21 in Monday&apos;s meeting.
                    <br />
                    <span className="cite-chip">Milana&apos;s agent · Weekly meeting</span>
                  </div>
                </div>
              </CollapseSection>
            </div>

            <div className="participants reveal" style={{ animationDelay: ".18s" }}>
              <CollapseSection
                title="Participants"
                countChip={<span className="count-chip">{participants.length}</span>}
                actions={
                  <>
                    <button className="label-icon-btn tap" data-tip="Invite people" aria-label="Invite people">
                      <PeopleIcon size={15} />
                    </button>
                    <button className="label-icon-btn tap" data-tip="Participant options" aria-label="Participant options">
                      <MoreDotsIcon />
                    </button>
                  </>
                }
              >
                <div className="p-list">
                  {participants.map((p) => (
                    <div className={`p-row${p.id === "lisbon" ? " is-new" : ""}`} key={p.id}>
                      <span className={`p-av ${p.av}`}></span>
                      <span className="p-id">
                        <strong>{p.name}</strong>
                        <small>{p.handle}</small>
                      </span>
                      <span className="p-status">
                        {p.status === "speaking" ? (
                          <span className="st-speaking wave" aria-label="Speaking">
                            <i></i>
                            <i></i>
                            <i></i>
                            <i></i>
                          </span>
                        ) : p.status === "mic" ? (
                          <MicIcon size={14} />
                        ) : (
                          <CamIcon size={14} />
                        )}
                      </span>
                    </div>
                  ))}
                </div>
                <button className="p-footer tap">View all {participants.length} participants</button>
              </CollapseSection>
            </div>

            <div className="livechat reveal" style={{ animationDelay: ".27s" }}>
              <CollapseSection title="Live Chat" countChip={<span className="count-chip">12</span>} actions={<button className="label-icon-btn tap" data-tip="Chat options" aria-label="Chat options"><MoreDotsIcon /></button>}>
                <div className="chat-card">
                  <div className="chat-body" ref={chatBodyRef}>
                    {chat.map((m) => {
                      if (m.kind === "typing") {
                        return (
                          <div className="cmsg" key={m.id}>
                            <div className="cmsg-meta">
                              <span className={`c-av ${m.av}`}></span>
                              <strong>{m.who}</strong>
                              <span className="time">typing…</span>
                            </div>
                            <div className="typing-bubble" aria-label={`${m.who} is typing`}>
                              <i></i>
                              <i></i>
                              <i></i>
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div className={`cmsg${m.kind === "sent" ? " is-sent" : ""}`} key={m.id}>
                          <div className="cmsg-meta">
                            {m.isBrand ? (
                              <span className="c-av-brand">
                                <svg width="15" height="9" viewBox="0 0 200 100" fill="none">
                                  <path
                                    d="M14 64 C 22 30, 50 24, 54 46 C 58 68, 30 76, 28 56 C 26 38, 52 28, 68 38 C 84 48, 74 68, 92 64 C 112 59, 106 34, 130 38 C 158 43, 158 52, 190 48"
                                    stroke="currentColor"
                                    strokeWidth="14"
                                    strokeLinecap="round"
                                  />
                                </svg>
                              </span>
                            ) : (
                              <span className={`c-av ${m.av}`}></span>
                            )}
                            <strong>{m.who}</strong>
                            {m.host && <span className="host-badge">Host</span>}
                            <span className="time">{m.time}</span>
                          </div>
                          {m.kind === "sent" ? (
                            <div className="cbubble-sent">{m.text}</div>
                          ) : (
                            <div className="cbubble">
                              {m.text}
                              {m.link && <a href="#">{m.link.label}</a>}
                            </div>
                          )}
                          {m.reactions && <span className="reactions">{m.reactions}</span>}
                        </div>
                      );
                    })}
                  </div>

                  <form className="composer" onSubmit={sendChat}>
                    <button type="button" className="comp-add tap" data-tip="Add attachment" aria-label="Add attachment">
                      <PlusIcon />
                    </button>
                    <input
                      type="text"
                      placeholder="Message everyone"
                      aria-label="Message everyone"
                      autoComplete="off"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                    />
                    <button type="submit" className="comp-send tap" data-tip="Send" aria-label="Send message">
                      <SendIcon />
                    </button>
                  </form>
                </div>
              </CollapseSection>
            </div>
          </div>
        </aside>
    </section>
  );
}
