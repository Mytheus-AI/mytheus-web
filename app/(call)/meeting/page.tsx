"use client";

import { useEffect, useRef, useState } from "react";
import { MicIcon, CamIcon, WaveIcon, MoreDotsIcon, PeopleIcon, SendIcon, PlusIcon, BrandMarkIcon, SparkleIcon, SearchIcon } from "@/components/icons";
import { leaveCallWindow } from "@/lib/callWindow";
import { CollapseSection } from "@/components/CollapseSection";
import { EditCardModal, type EditCardTarget } from "@/components/EditCardModal";
import { StreamText } from "@/components/StreamText";
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

type FeedKind = "conflict" | "question" | "decision" | "note" | "context" | "action";
type FeedResolution = "confirmed" | "asked" | "saved" | "dismissed" | "invited" | "acknowledged" | "created";

type FeedEntry = {
  id: string;
  kind: FeedKind;
  time: string;
  text: string;
  cite?: string;
  resolved?: FeedResolution;
  isNew?: boolean;
};

type NeedsKind = "question" | "decision" | "action" | "workload" | "stakeholder" | "dependency";

type NeedsYouCard = {
  id: string;
  kind: NeedsKind;
  prio: 1 | 2 | 3;
  label: string;
  meta: string;
  text: React.ReactNode;
  isNew?: boolean;
};

const KIND_LABEL: Record<FeedKind, string> = {
  conflict: "Conflict",
  question: "Question",
  decision: "Decision",
  note: "Note",
  context: "Shared context",
  action: "Action",
};

const RES_LABEL: Record<FeedResolution, string> = {
  confirmed: "Confirmed",
  asked: "Asked",
  saved: "Saved for later",
  dismissed: "Dismissed",
  invited: "Invite sent",
  acknowledged: "Acknowledged",
  created: "Task created",
};

const SUGGESTED_QUESTION = "Which pilot accounts are excluded from the $29 hold?";

const INITIAL_NEEDS_YOU: NeedsYouCard[] = [
  { id: "question", kind: "question", prio: 2, label: "Suggested question", meta: "for your role", text: SUGGESTED_QUESTION },
  { id: "decision", kind: "decision", prio: 2, label: "Decision detected", meta: "0.86", text: "Hold launch pricing at $29 through the beta." },
  {
    id: "action",
    kind: "action",
    prio: 2,
    label: "Action detected",
    meta: "0.78",
    text: (
      <>
        <b>Sufjan</b> owns the churn export, due <b>Friday</b>.
      </>
    ),
  },
];

const LATE_CARDS: { at: number; card: NeedsYouCard }[] = [
  {
    at: 18000,
    card: {
      id: "workload",
      kind: "workload",
      prio: 1,
      label: "Workload warning",
      meta: "95% capacity",
      text: (
        <>
          The churn export puts <b>Sufjan</b> at 95% capacity this week — six open actions already.
        </>
      ),
      isNew: true,
    },
  },
  {
    at: 34000,
    card: {
      id: "stakeholder",
      kind: "stakeholder",
      prio: 2,
      label: "Missing stakeholder",
      meta: "pricing owner",
      text: (
        <>
          Pricing is being discussed without <b>Priya</b> — she owns the May 12 decision.
        </>
      ),
      isNew: true,
    },
  },
  {
    at: 52000,
    card: {
      id: "dependency",
      kind: "dependency",
      prio: 3,
      label: "Dependency",
      meta: "fyi",
      text: "The churn export depends on the warehouse migration, which lands Wednesday.",
      isNew: true,
    },
  },
];

const INITIAL_FEED: FeedEntry[] = [
  {
    id: "f-note-churn",
    kind: "note",
    time: "00:41",
    text: "Cloe wants the churn cohort view ready before the numbers go to next week's agenda.",
    cite: "From transcript · 00:41:08",
  },
  {
    id: "f-ctx-beta",
    kind: "context",
    time: "00:12",
    text: "Beta date moved to July 21 in Monday's meeting, added from Milana's agent.",
    cite: "Milana's agent · Weekly meeting",
  },
];

const INITIAL_CHAT: ChatMessage[] = [
  { id: "c1", kind: "received", who: "Keith", av: "c-av-keith", time: "3 min ago", text: "@johnwayne u can check this one : ", link: { label: "dribble.com/shot46769" }, reactions: "👌👍❤️" },
  { id: "c2", kind: "received", who: "Mytheus", isBrand: true, host: true, time: "2 min ago", text: "I think this webinar will provide us with some great insights." },
  { id: "c3", kind: "sent", who: "You", av: "c-av-you", time: "1 min ago", text: "Thankyou, Keith!" },
  { id: "typing", kind: "typing", who: "Thomas", av: "c-av-thomas" },
];

/* Live caption script — interim lines build word by word, then settle as finals. */
const CAPTION_SCRIPT = [
  { cls: "cs-1", name: "Cloe", text: "The churn cohort view has to be ready before the numbers go out next week." },
  { cls: "cs-3", name: "Sufjan", text: "I can have the export running by Thursday if the warehouse migration lands." },
  { cls: "cs-2", name: "Wayne", text: "Let's keep the beta invite list at fifty accounts until the pricing page is final." },
  { cls: "cs-1", name: "Cloe", text: "Annual discounts can wait. We hold at twenty-nine through the beta." },
];

type MyNote = { id: string; text: string; cite?: string; streaming?: boolean };

const INITIAL_NOTES: MyNote[] = [
  { id: "n1", text: "The churn cohort view is the gating deliverable for next week's numbers.", cite: "From transcript · 00:41" },
  { id: "n2", text: "Design wants your onboarding specs before Thursday's crit.", cite: "Filtered for your role" },
];

type SourceCard = {
  id: string;
  kicker: string;
  kickerTone: "orange" | "brown" | "green";
  snippet: string;
  cites: string[];
  href?: string;
  isNew?: boolean;
};

const INITIAL_SOURCES: SourceCard[] = [
  {
    id: "s1",
    kicker: "Transcript · Pricing sync",
    kickerTone: "brown",
    snippet: "“We hold at $29 through the beta. No exceptions for the pilot accounts.”",
    cites: ["Priya · 00:14:36"],
    href: "/transcript",
  },
  {
    id: "s2",
    kicker: "Document · Pricing one-pager",
    kickerTone: "green",
    snippet: "Launch tiers: a single $29 plan through beta; annual pricing revisited after launch.",
    cites: ["§ Launch tiers"],
  },
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** A personal-listener note that streams in token by token, then shows its citation. */
function StreamingNote({ text, cite }: { text: string; cite?: string }) {
  const [done, setDone] = useState(false);
  return (
    <div className="mynote is-new">
      <span className="moment-dot is-note" aria-hidden="true"></span>
      <span className="mynote-body">
        <p>
          <StreamText text={text} onDone={() => setDone(true)} />
        </p>
        {done && cite && <span className="cite-chip">{cite}</span>}
      </span>
    </div>
  );
}

export default function MeetingPage() {
  const { sideVisible, toggleSide, admitParticipant } = useMeetingUI();
  const toast = useToast();

  const [secs, setSecs] = useState(56 * 60 + 32);
  const [micOff, setMicOff] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [recOn, setRecOn] = useState(false);
  const [handUp, setHandUp] = useState(false);
  const [captionsOn, setCaptionsOn] = useState(true);
  const [cap, setCap] = useState({ line: 0, words: 0 });
  const [joinCardVisible, setJoinCardVisible] = useState(true);
  const [joinCardLeaving, setJoinCardLeaving] = useState(false);
  const [participants, setParticipants] = useState(INITIAL_PARTICIPANTS);
  const [chat, setChat] = useState(INITIAL_CHAT);
  const [chatInput, setChatInput] = useState("");
  const [pinned, setPinned] = useState("milana");
  const [conflictOpen, setConflictOpen] = useState(true);
  const [conflictLeaving, setConflictLeaving] = useState(false);
  const [needsYou, setNeedsYou] = useState(INITIAL_NEEDS_YOU);
  const [leavingIds, setLeavingIds] = useState<Set<string>>(new Set());
  const [peekOpen, setPeekOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<(EditCardTarget & { cardId: string }) | null>(null);
  const [feed, setFeed] = useState(INITIAL_FEED);
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [sources, setSources] = useState(INITIAL_SOURCES);
  const [srcInput, setSrcInput] = useState("");
  const [srcThinking, setSrcThinking] = useState(false);
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
      if (e.key === "Escape") {
        setPeekOpen(false);
        return;
      }
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === "m") setMicOff((v) => !v);
      if (k === "v") setCamOff((v) => !v);
      if (k === "r") setRecOn((v) => !v);
      if (k === "h") setHandUp((v) => !v);
      if (k === "c") setCaptionsOn((v) => !v);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // Interim captions build word by word, hold a beat, then the line settles as the final.
  useEffect(() => {
    if (!captionsOn) return;
    const id = setInterval(() => {
      setCap((c) => {
        const words = CAPTION_SCRIPT[c.line].text.split(" ").length;
        if (c.words >= words + 3) return { line: (c.line + 1) % CAPTION_SCRIPT.length, words: 0 };
        return { ...c, words: c.words + 1 };
      });
    }, 300);
    return () => clearInterval(id);
  }, [captionsOn]);

  // The agent keeps working mid-meeting: cards, notes and feed entries tick in over time.
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(
      setTimeout(() => {
        setNotes((n) => [...n, { id: "n3", text: "Pricing page copy is yours — draft due Friday, pilots get no exceptions.", cite: "From transcript · 00:57", streaming: true }]);
      }, 14000)
    );

    for (const { at, card } of LATE_CARDS) {
      timers.push(setTimeout(() => setNeedsYou((cards) => [...cards, card]), at));
    }

    timers.push(
      setTimeout(() => {
        setFeed((f) => [
          {
            id: "f-note-action",
            kind: "note",
            time: "00:57",
            text: "Sufjan owns the churn export, captured as an action item.",
            cite: "From transcript · 00:57:02",
            isNew: true,
          },
          ...f,
        ]);
      }, 30000)
    );

    timers.push(
      setTimeout(() => {
        setNotes((n) => [...n, { id: "n4", text: "Milana brings warehouse migration timing to tomorrow's data review.", cite: "From transcript · 01:02", streaming: true }]);
      }, 46000)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  function nowTime() {
    return `${pad(Math.floor(secs / 3600))}:${pad(Math.floor((secs % 3600) / 60))}`;
  }

  function resolveCard(id: string, entry?: Omit<FeedEntry, "id" | "time" | "isNew">) {
    const time = nowTime();
    setLeavingIds((s) => new Set(s).add(id));
    setTimeout(() => {
      setNeedsYou((cards) => cards.filter((c) => c.id !== id));
      setLeavingIds((s) => {
        const next = new Set(s);
        next.delete(id);
        return next;
      });
      if (entry) setFeed((f) => [{ ...entry, id: `${id}-resolved-${Date.now()}`, time, isNew: true }, ...f]);
    }, 230);
  }

  function dismissConflict() {
    setConflictLeaving(true);
    setTimeout(() => {
      setConflictOpen(false);
      setConflictLeaving(false);
      setFeed((f) => [
        {
          id: "conflict-resolved",
          kind: "conflict",
          time: nowTime(),
          text: "Annual discounts after the beta contradicts the May 12 pricing sync.",
          resolved: "dismissed",
          isNew: true,
        },
        ...f,
      ]);
    }, 230);
  }

  function saveEdit(edited: EditCardTarget & { cardId: string }) {
    const { cardId } = edited;
    setEditTarget(null);
    if (edited.kind === "decision") {
      toast("Decision saved with your edits");
      resolveCard(cardId, { kind: "decision", text: edited.text, cite: "Saved to decision history", resolved: "confirmed" });
    } else if (cardId === "workload") {
      toast(`Churn export reassigned to ${edited.assignee}`);
      resolveCard(cardId, { kind: "action", text: `${edited.assignee} owns the churn export, due ${edited.due || "Friday"}.`, resolved: "created" });
    } else {
      toast(`Task created · ${edited.assignee}, ${edited.due || "Friday"}`);
      resolveCard(cardId, { kind: "action", text: edited.text, cite: "Added to My Tasks", resolved: "created" });
    }
  }

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

  function askSources(e: React.FormEvent) {
    e.preventDefault();
    const q = srcInput.trim();
    if (!q || srcThinking) return;
    setSrcInput("");
    setSrcThinking(true);
    setTimeout(() => {
      setSrcThinking(false);
      setSources((s) => [
        {
          id: `a-${Date.now()}`,
          kicker: "Answer",
          kickerTone: "orange",
          snippet: "No accounts are excluded from the $29 hold — the May 12 pricing sync ruled out pilot exceptions.",
          cites: ["Pricing sync · 00:14:36", "Pricing one-pager · §2"],
          isNew: true,
        },
        ...s,
      ]);
    }, 1100);
  }

  const timeStr = `${pad(Math.floor(secs / 3600))}:${pad(Math.floor((secs % 3600) / 60))}:${pad(secs % 60)}`;

  const interimLine = CAPTION_SCRIPT[cap.line];
  const interimText = interimLine.text.split(" ").slice(0, cap.words).join(" ");
  const finalLine = CAPTION_SCRIPT[(cap.line + CAPTION_SCRIPT.length - 1) % CAPTION_SCRIPT.length];

  const needsCount = needsYou.length + (conflictOpen ? 1 : 0);

  return (
    <section className={`page meeting-page${sideVisible ? "" : " side-collapsed"}`} id="page-meeting">
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

          {captionsOn && (
            <div className="captions" role="log" aria-live="off" aria-label="Live captions">
              <div className="cap-line">
                <b className={finalLine.cls}>{finalLine.name}</b>
                {finalLine.text}
              </div>
              <div className="cap-interim">
                {interimText}
                {interimText && <span className="stream-caret" aria-hidden="true" />}
              </div>
            </div>
          )}

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
              className={`ctl tap${captionsOn ? " is-active" : ""}`}
              data-tip={captionsOn ? "Hide captions · C" : "Show captions · C"}
              aria-label="Toggle live captions"
              aria-pressed={captionsOn}
              onClick={() => setCaptionsOn((v) => !v)}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4.5" width="18" height="15" rx="3" />
                <path d="M10.5 10.2a2.4 2.4 0 0 0-4 1.8 2.4 2.4 0 0 0 4 1.8M17.5 10.2a2.4 2.4 0 0 0-4 1.8 2.4 2.4 0 0 0 4 1.8" />
              </svg>
            </button>
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

            <button type="button" className="ctl-leave tap" aria-label="Leave meeting" onClick={leaveCallWindow}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 14.5c5-4 11-4 16 0l-1.5 3c-.5 1-1.6 1.3-2.6.8l-2.4-1.2a2 2 0 0 1-1-2.3l.2-.8h-1.4l.2.8a2 2 0 0 1-1 2.3l-2.4 1.2c-1 .5-2.1.2-2.6-.8L4 14.5Z" />
              </svg>
              Leave
            </button>
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
        {!sideVisible && (
          <div className="side-mini" role="toolbar" aria-label="Collapsed panel">
            {conflictOpen && (
              <button className="mini-btn is-alert tap" data-tip="Conflict needs you" aria-label="Expand panel: conflict needs you" onClick={toggleSide}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3.5 22 20H2L12 3.5Z" />
                  <path d="M12 10v4.5M12 17.3v.2" />
                </svg>
                <span className="mini-badge is-alert">!</span>
              </button>
            )}
            <button className="mini-btn tap" data-tip="My agent" aria-label={`Expand panel: my agent, ${needsYou.length} items need you`} onClick={toggleSide}>
              <SparkleIcon size={17} />
              {needsYou.length > 0 && <span className="mini-badge">{needsYou.length}</span>}
            </button>
            <button className="mini-btn tap" data-tip="Sources" aria-label="Expand panel: sources" onClick={toggleSide}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 3.5h9L19.5 8v12.5h-13.5V3.5Z" />
                <path d="M14.5 3.5V8.5H19.5M9 12.5h6M9 16h6" />
              </svg>
            </button>
            <span className="mini-sep" aria-hidden="true"></span>
            <button className="mini-btn tap" data-tip="Participants" aria-label={`Expand panel: ${participants.length} participants`} onClick={toggleSide}>
              <PeopleIcon size={16} />
              <span className="mini-badge">{participants.length}</span>
            </button>
            <button className="mini-btn tap" data-tip="Live chat" aria-label="Expand panel: live chat" onClick={toggleSide}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.5 12a8.5 8.5 0 1 0-3.4 6.8L20.5 20l-.9-3.7A8.4 8.4 0 0 0 20.5 12Z" />
              </svg>
              <span className="mini-badge">12</span>
            </button>
          </div>
        )}

        {sideVisible && (
        <div className="side-inner">
            {conflictOpen && (
              <div className={`conflict-banner${conflictLeaving ? " is-leaving" : ""}`} role="alert">
                <div className="cbn-kind">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3.5 22 20H2L12 3.5Z" />
                    <path d="M12 10v4.5M12 17.3v.2" />
                  </svg>
                  Possible conflict
                  <span className="cbn-meta">now</span>
                </div>
                <p className="cbn-text">
                  &quot;Annual discounts after the beta&quot; contradicts a decision from the <b>May 12 pricing sync</b>.
                </p>
                <div className="nfy-acts">
                  <button className="nfy-act tap" onClick={() => setPeekOpen(true)}>
                    View that decision
                  </button>
                  <button className="nfy-act is-quiet tap" onClick={dismissConflict}>
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            <div className="reveal" style={{ animationDelay: ".14s" }}>
              <CollapseSection
                title="My agent"
                countChip={
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 4c.9 4.4 3.6 7.1 8 8-4.4.9-7.1 3.6-8 8-.9-4.4-3.6-7.1-8-8 4.4-.9 7.1-3.6 8-8Z" />
                    </svg>
                    <span className="live-chip">
                      <span className="live-dot" aria-hidden="true"></span>Listening
                    </span>
                  </>
                }
                actions={
                  <a href="/settings" target="_blank" rel="noopener" className="label-icon-btn tap" data-tip="Agent settings" aria-label="Agent settings">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3 1a7 7 0 0 0-2-1.2L14.2 3H9.8l-.4 2.7a7 7 0 0 0-2 1.2l-2.3-1-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-1a7 7 0 0 0 2 1.2l.4 2.7h4.4l.4-2.7a7 7 0 0 0 2-1.2l2.3 1 2-3.4-2-1.5c.1-.4.1-.8.1-1.2Z" />
                    </svg>
                  </a>
                }
              >
                <div className="agent-panel">
                  {needsYou.length > 0 && (
                    <div className="nfy">
                      <div className="nfy-head">
                        Needs you <b>{needsCount}</b>
                      </div>
                      {needsYou.map((card) => (
                        <div
                          className={`nfy-card is-${card.kind} is-p${card.prio}${leavingIds.has(card.id) ? " is-leaving" : ""}${card.isNew ? " is-new" : ""}`}
                          key={card.id}
                          role={card.prio === 1 ? "alert" : undefined}
                        >
                          <div className="nfy-kind">
                            {card.label} <span className="nfy-meta">{card.meta}</span>
                          </div>
                          <p className="nfy-text">{card.text}</p>
                          <div className="nfy-acts">
                            {card.kind === "question" && (
                              <>
                                <button
                                  className="nfy-act tap"
                                  onClick={() => {
                                    navigator.clipboard?.writeText(SUGGESTED_QUESTION).catch(() => {
                                      /* clipboard unavailable */
                                    });
                                    toast("Question copied. Paste it into chat.");
                                    resolveCard("question", { kind: "question", text: SUGGESTED_QUESTION, resolved: "asked" });
                                  }}
                                >
                                  Ask now
                                </button>
                                <button
                                  className="nfy-act is-quiet tap"
                                  onClick={() => {
                                    toast("Saved. It will be waiting in your next meeting.");
                                    resolveCard("question", { kind: "question", text: SUGGESTED_QUESTION, resolved: "saved" });
                                  }}
                                >
                                  Save for later
                                </button>
                                <button className="nfy-act is-quiet tap" onClick={() => resolveCard("question", { kind: "question", text: SUGGESTED_QUESTION, resolved: "dismissed" })}>
                                  Dismiss
                                </button>
                              </>
                            )}
                            {card.kind === "decision" && (
                              <>
                                <button
                                  className="nfy-act tap"
                                  onClick={() => {
                                    toast("Decision saved to history");
                                    resolveCard("decision", {
                                      kind: "decision",
                                      text: "Hold launch pricing at $29 through the beta.",
                                      cite: "Saved to decision history",
                                      resolved: "confirmed",
                                    });
                                  }}
                                >
                                  Confirm
                                </button>
                                <button
                                  className="nfy-act is-quiet tap"
                                  onClick={() =>
                                    setEditTarget({
                                      cardId: "decision",
                                      kind: "decision",
                                      text: "Hold launch pricing at $29 through the beta.",
                                      rationale: "One price simplifies the launch story and support scripts.",
                                    })
                                  }
                                >
                                  Edit
                                </button>
                                <button
                                  className="nfy-act is-quiet tap"
                                  onClick={() => resolveCard("decision", { kind: "decision", text: "Hold launch pricing at $29 through the beta.", resolved: "dismissed" })}
                                >
                                  Dismiss
                                </button>
                              </>
                            )}
                            {card.kind === "action" && (
                              <>
                                <button
                                  className="nfy-act tap"
                                  onClick={() => {
                                    toast("Task created · Sufjan, Friday");
                                    resolveCard("action", { kind: "action", text: "Sufjan owns the churn export, due Friday.", cite: "Added to My Tasks", resolved: "created" });
                                  }}
                                >
                                  Create task
                                </button>
                                <button
                                  className="nfy-act is-quiet tap"
                                  onClick={() => setEditTarget({ cardId: "action", kind: "action", text: "Own the churn export", assignee: "Sufjan", due: "Friday" })}
                                >
                                  Edit
                                </button>
                                <button
                                  className="nfy-act is-quiet tap"
                                  onClick={() => resolveCard("action", { kind: "action", text: "Sufjan owns the churn export, due Friday.", resolved: "dismissed" })}
                                >
                                  Dismiss
                                </button>
                              </>
                            )}
                            {card.kind === "workload" && (
                              <>
                                <button className="nfy-act tap" onClick={() => setEditTarget({ cardId: "workload", kind: "action", text: "Own the churn export", assignee: "Rosa", due: "Friday" })}>
                                  Reassign
                                </button>
                                <button
                                  className="nfy-act is-quiet tap"
                                  onClick={() => resolveCard("workload", { kind: "note", text: "Sufjan's 95% workload acknowledged — keeping the churn export with him.", resolved: "acknowledged" })}
                                >
                                  Acknowledge
                                </button>
                              </>
                            )}
                            {card.kind === "stakeholder" && (
                              <>
                                <button
                                  className="nfy-act tap"
                                  onClick={() => {
                                    toast("Invite sent to Priya");
                                    resolveCard("stakeholder", { kind: "note", text: "Priya invited — she owns the May 12 pricing decision.", resolved: "invited" });
                                  }}
                                >
                                  Invite Priya
                                </button>
                                <button
                                  className="nfy-act is-quiet tap"
                                  onClick={() => resolveCard("stakeholder", { kind: "note", text: "Pricing discussed without Priya.", resolved: "dismissed" })}
                                >
                                  Dismiss
                                </button>
                              </>
                            )}
                            {card.kind === "dependency" && (
                              <button
                                className="nfy-act is-quiet tap"
                                onClick={() => resolveCard("dependency", { kind: "note", text: "Churn export waits on the warehouse migration, landing Wednesday.", resolved: "acknowledged" })}
                              >
                                Noted
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mynotes">
                    <div className="nfy-head">My notes</div>
                    {notes.map((n) =>
                      n.streaming ? (
                        <StreamingNote key={n.id} text={n.text} cite={n.cite} />
                      ) : (
                        <div className="mynote" key={n.id}>
                          <span className="moment-dot is-note" aria-hidden="true"></span>
                          <span className="mynote-body">
                            <p>{n.text}</p>
                            {n.cite && <span className="cite-chip">{n.cite}</span>}
                          </span>
                        </div>
                      )
                    )}
                  </div>

                  <div className="afeed" role="log" aria-live="polite">
                    <div className="nfy-head" style={{ paddingBottom: 4 }}>
                      Activity
                    </div>
                    {feed.map((e) => (
                      <div className={`afeed-item is-${e.kind}${e.resolved ? " is-resolved" : ""}${e.isNew ? " is-new" : ""}`} key={e.id}>
                        <div className="afeed-kind">
                          <b>{KIND_LABEL[e.kind]}</b>
                          {e.resolved && <span className={`afeed-res${e.resolved === "dismissed" ? " is-muted" : ""}`}>· {RES_LABEL[e.resolved]}</span>}
                          <span className="afeed-time">{e.time}</span>
                        </div>
                        <p className="afeed-text">{e.text}</p>
                        {e.cite && <span className="cite-chip">{e.cite}</span>}
                      </div>
                    ))}
                    <div className="afeed-start">Agent joined · 00:00</div>
                  </div>
                </div>
              </CollapseSection>
            </div>

            <div className="sources reveal" style={{ animationDelay: ".16s" }}>
              <CollapseSection
                title="Sources"
                countChip={<span className="count-chip">{sources.length}</span>}
              >
                <form className="src-ask" onSubmit={askSources}>
                  <SearchIcon size={13} />
                  <input
                    type="text"
                    placeholder="Ask your sources"
                    aria-label="Ask your sources"
                    autoComplete="off"
                    value={srcInput}
                    onChange={(e) => setSrcInput(e.target.value)}
                  />
                </form>
                {srcThinking && (
                  <div className="thinking">
                    <span className="spark">
                      <SparkleIcon size={13} />
                    </span>
                    Checking your meetings…
                  </div>
                )}
                {sources.map((s) => (
                  <div className={`src-card${s.isNew ? " is-new" : ""}`} key={s.id}>
                    <div className={`row-kicker is-${s.kickerTone}`}>{s.kicker}</div>
                    <p className="src-snippet">{s.snippet}</p>
                    <div className="src-foot">
                      {s.cites.map((c) => (
                        <span className="cite-chip" key={c}>
                          {c}
                        </span>
                      ))}
                      {s.href && (
                        <a href={s.href} target="_blank" rel="noopener" className="src-open tap">
                          Open
                        </a>
                      )}
                    </div>
                  </div>
                ))}
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
                                <BrandMarkIcon width={15} height={9} strokeWidth={10} />
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
        )}
        </aside>

      {peekOpen && (
        <div className="peek-scrim" onClick={() => setPeekOpen(false)}>
          <div className="peek-card" role="dialog" aria-modal="true" aria-labelledby="peek-title" onClick={(e) => e.stopPropagation()}>
            <div className="peek-kind">Decision · Pricing sync · May 12</div>
            <h2 className="peek-title" id="peek-title">
              Hold launch pricing at $29 through the beta.
            </h2>
            <div className="peek-meta">
              <span className="tag tag-green">
                <span className="tag-dot"></span>Confirmed
              </span>
              <span>Priya, Milana, Daniel</span>
            </div>
            <blockquote className="peek-quote">
              &quot;We hold at $29 through the beta. No exceptions for the pilot accounts. Annual pricing comes back to this group after launch.&quot;
              <cite>Priya · Pricing sync · 00:14:36</cite>
            </blockquote>
            <p className="peek-note">Today&apos;s &quot;annual discounts after the beta&quot; proposal contradicts this decision.</p>
            <div className="peek-actions">
              <a href="/decisions" target="_blank" rel="noopener" className="btn-accent-sm tap">
                Open in Mytheus
              </a>
              <button type="button" className="btn-ghost-sm tap" onClick={() => setPeekOpen(false)} autoFocus>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {editTarget && (
        <EditCardModal
          target={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={(edited) => saveEdit({ ...edited, cardId: editTarget.cardId })}
        />
      )}
    </section>
  );
}
