# Meeting Software — Gap Notes (Draft vs. Docs)

_Comparing what `mytheus-docs` says the **meeting software** should do against what the current **draft** (`mytheus-web`) actually surfaces. Dashboards/org-wide surfaces are out of scope per the brief — this is the live-meeting experience and its directly-attached surfaces only._

**Legend**
- ✅ **Built** — surfaced in the draft (even if wired to mock data)
- 🟡 **Partial** — exists but incomplete, passive, or in the wrong place (e.g. post-call only)
- ❌ **Missing** — no surface in the draft at all
- ⚙️ **Backend/infra** — expected to be non-visual; the draft is a UI mock, so not counted as a UI gap (listed at the end for completeness)
- ⚠️ **Divergence** — the draft has it, but the docs don't spec it (needs reconciling)

---

## TL;DR — the headline gaps

The draft nails the **agent sidebar** (Needs-you cards, feed, conflict → peek) and the **post-call artifacts** (transcript, decisions, tasks, worklog, recordings, ask). The real holes are **in the live meeting itself**:

1. **❌ Live captions in-call** — the single biggest miss. Docs make live transcription the flagship real-time surface (interim→final, p95 < 2s). The draft in-call has **no caption strip/panel** anywhere; the transcript only exists as a post-call page.
2. **❌ Action items get no confirm surface** — decisions & questions have Needs-you cards, but detected actions only appear as passive feed text ("captured as an action item"). Docs require Confirm/Edit before any action commits.
3. **❌ Proactive alerts beyond conflict** — only the conflict card is built. Workload warnings, missing-stakeholder suggestions, and dependency warnings (all ProactiveAgent outputs) have no UI.
4. **❌ In-meeting "ask your sources" (RAG) panel** — cited-source lookups during the call. Draft has "Ask Mytheus" only as a separate post-call page.
5. **❌ Edit modal is inert** — the "Edit" button on decision cards is a dead tooltip; docs require an Edit modal pre-filled with the extracted content.
6. **❌ No meetings list / meeting-detail hub** — you can only reach a meeting via home "Up next". No browsable `/meetings` list or per-meeting pre/post detail page.
7. **🟡 Progressive streaming** — agent output pops in fully-formed; docs want tokens streaming in then settling.

---

## Priority-ranked missing surfaces (the actual to-do list)

### Tier 1 — In-meeting surfaces (this IS the meeting software)
| # | Gap | Status | Docs source |
|---|-----|--------|-------------|
| 1 | **Live captions** (interim→final, click-to-jump, speaker-colored) rendered during the call | ❌ | `10-realtime-and-transcription §3.2/§4.1`; `20-frontend §7` |
| 2 | **ActionAgent card** — Confirm/Edit/Dismiss for detected action items (currently passive feed text only) | ❌ | `08-ai-agent §2.1`; `20-frontend §5.1` |
| 3 | **Workload warning** alert (assignee at 80%/95% capacity) | ❌ | `08-ai-agent §2.1`; `20-frontend §5.1` |
| 4 | **Missing-stakeholder** suggestion + **dependency warning** | ❌ | `08-ai-agent §2.1` |
| 5 | **In-meeting RAG context panel** — source cards with the frozen citation contract | ❌ | `20-frontend §7.1` |
| 6 | **Edit modal** for decisions/actions (pre-filled extracted content/rationale/assignee/due-date) | ❌ (button is inert) | `20-frontend §5.1`; `08-ai-agent §2.2` |
| 7 | **Progressive/streamed agent output** (tokens stream → draft swaps for confirmed card) | 🟡 (pops in whole) | `10-realtime §5`; `20-frontend §5.2` |
| 8 | **Priority strip / pre-emption** — frozen red(1)/yellow(2)/blue(3) language; urgent alerts pin above the feed | 🟡 (kind-colored, no priority queue) | `20-frontend §5.3` |
| 9 | **Recording/transcription consent gate** at join | ❌ (proposed, not canon) | `12-compliance §3.3`; `plan-3-4 §8` |

### Tier 2 — Lifecycle / structural surfaces
| # | Gap | Status | Docs source |
|---|-----|--------|-------------|
| 10 | **`/meetings` list + `/meetings/[id]` detail** (pre/post hub) | ❌ (only home "Up next") | `20-frontend §2.2/§7` |
| 11 | **Per-participant post-meeting summary** artifact (confirmed decisions/actions/open questions + citations) | 🟡 (transcript "Overview" only) | `diagrams/06 §3.4`; `21-integration §4.3` |
| 12 | **Server-anchored meeting clock** (draft timer is a hardcoded count-up) | 🟡 | `plan-3-4 §7` |
| 13 | **Live presence** — real join/leave roster + in-call count (currently static) | 🟡 | `10-realtime §4.1`; `plan-3-4 §3.2` |
| 14 | **Collapse-to-rail + mobile bottom-sheet** — sidebar collapses to a thin rail w/ unread counts; drag-up sheet on mobile; conflict auto-expands | 🟡 (full hide/show only) | `20-frontend §5.4/§5.6` |

### Tier 3 — Config/settings the docs imply but the draft lacks
| # | Gap | Status | Docs source |
|---|-----|--------|-------------|
| 15 | **PII redaction** toggle | ❌ | `plan-3-4 §3.5`; `12-compliance §5` |
| 16 | **Data-residency region** selector (us/eu/ap) | ❌ | `plan-3-4 §3.5-3.6`; `12-compliance §6` |
| 17 | **Per-tenant agent confidence thresholds** override | ❌ | `08-ai-agent §6.1` |
| 18 | **Per-tenant token-budget alerts** (80%/95%/cap) surfaced in-app | ❌ | `08-ai-agent §4.1/§4.4` |

---

## Full diff by area

### A. Pre-join / device setup — **strong**
- ✅ Pre-join device check (camera/mic preview + device pickers)
- ✅ In-app prep brief (decisions/notes/actions/questions loaded, role-filtered)
- ✅ Countdown, lobby-status text, meeting details
- ❌ Consent gate (recording/transcription) — see Tier 1 #9
- ⚙️ Participant-verified join / short-TTL LiveKit token mint (join is a plain link)

### B. In-call media — **mostly built (as mock)**
- ✅ Controls: mute / camera / screen-share / leave
- ✅ Speaker stage + participant thumbnails, pin, mic state, speaking wave
- 🟡 Video grid: docs scope 1–9 tiles (6 nominal); draft shows 1 + 3 thumbs + "12+" and "change layout" is inert
- ⚙️ SFU transport, adaptive simulcast, media reconnect/re-hydrate

### C. Participants & roster
- ✅ Roster list, speaker labels/avatars, invite/options affordances
- 🟡 Live presence (static counts) — Tier 2 #13
- ⚙️ Roster from calendar email-match

### D. Live transcription & captions — **the big hole**
- ❌ **Live captions in-call** — Tier 1 #1
- ✅ Transcript replay page (searchable, key moments, talk-time)
- ✅ **Speaker-mapping UI** (assign "Speaker 2" → a user) — already in the transcript page
- ❌ PII redaction / data-residency config — Tier 3
- ⚙️ Single diarized Deepgram stream, finals-only durable store, caption reconnect

### E. In-meeting AI agents (the six)
- ✅ **DecisionAgent** — Needs-you card w/ confidence 0.86, Confirm/Dismiss (Edit inert)
- ✅ **QuestionAgent** — suggestion card w/ Ask now / Save-for-later / Dismiss
- ✅ **ContextGapAgent** — "context added from Milana's agent" feed entry w/ source
- 🟡 **PersonalListenerAgent** — notes appear in the agent feed (blended, not a distinct live "My Notes" section)
- ❌ **ActionAgent** confirm surface — Tier 1 #2
- 🟡 **ProactiveAgent** — conflict ✅; workload / stakeholder / dependency ❌ (Tier 1 #3–4)
- 🟡 Streamed output — Tier 1 #7
- ❌ Token-budget alerts — Tier 3 #18

### F. Real-time collaboration during the call
- ✅ In-meeting chat (typing, reactions, host/brand badges, composer)
- 🟡 Confirm/Edit/Dismiss — decisions ✅, actions ❌, Edit modal ❌ (Tier 1 #2/#6)
- ✅ Save-for-later question queue (surface present; cross-meeting persistence is mock)
- ❌ In-meeting RAG source panel — Tier 1 #5
- 🟡 Collapse-to-rail / mobile sheet — Tier 2 #14

### G. Recording & post-call artifacts — **strong**
- ✅ Decisions (log + confidence + lineage), Tasks (action items), Worklog, Recordings library, Ask (Q&A w/ citations), Transcript replay
- ✅ Record toggle in-call (mock)
- 🟡 Per-participant personalized summary — Tier 2 #11
- ⚙️ LiveKit egress → region-pinned bucket, Slack delivery of summary

### H. Meeting lifecycle
- ✅ Prep brief (prejoin) + Slack/summary/reminder prefs shown in Settings
- ✅ Integrations surfaced (Google Calendar, Slack, Jira, Linear connect toggles)
- ❌ `/meetings` list + detail — Tier 2 #10
- 🟡 Server-anchored clock — Tier 2 #12
- ⚙️ Calendar auto-create, Temporal lifecycle/follow-up workflows, Jira/Linear two-way sync, status webhooks

### I. Notifications / status
- ✅ Toast system (ToastContext) + "Listening" live status
- 🟡 Conflict is a card, not a top-pinned pre-emptive banner — Tier 1 #8
- 🟡 No frozen red/yellow/blue priority strip — Tier 1 #8
- ⚙️ realtime-gateway fan-out, graceful degradation under congestion

### J. Permissions / roles
- ✅ Role concept surfaced ("notes filtered for your role: product engineer")
- ⚙️ role_in_meeting token grants, participant-only tenant-scoped access, A2A authz
- ❌ Per-tenant agent overrides / theming / locale — Tier 3

---

## ⚠️ Divergences — the draft has these, the docs DON'T spec them

These aren't "missing" — they're the reverse. Either the docs need to catch up, or the draft is showing features that won't ship. **Decision needed on each:**

| Draft feature | Docs position |
|---------------|---------------|
| **Host-admit lobby** ("Lisbon wants to join" → Admit/Deny card) | Docs spec only a *pre-join device check* — explicitly **no** waiting-room / host-admit flow |
| **Raise-hand** control | No documented feature |
| **Emoji reactions** on chat messages | No documented feature |
| **Manual Record toggle** as a per-user call control | Docs record via LiveKit egress tied to lifecycle/consent, not a free toggle |
| **Large-meeting affordances** ("16 in call", "12+", change-layout) | Docs scope video to 1–9 tiles (6 nominal) |

---

## ⚙️ Backend/infra not wired (expected — the draft is a UI mock)

Not UI gaps, but listed so nobody mistakes the mock for a working system: LiveKit SFU + token mint, Deepgram diarized streaming, Redis presence, socket reconnect/re-hydration, Temporal `MeetingLifecycleWorkflow` + `ActionFollowUpWorkflow`, event topics (`transcript-chunks`, `agent-results`, `meeting-events`…), A2A authorization, egress recording to region-pinned buckets, multi-region residency, per-tenant token metering. Latency SLOs that shape UX: token-mint p95 < 250 ms, captions p95 < 2 s, agent output p50 < 2 s.

---

_Sources: `mytheus-docs` — `08-ai-agent-architecture`, `10-realtime-and-transcription`, `12-compliance-and-privacy`, `20-frontend-architecture`, `21-integration-architecture`, `22-roadmap-and-phasing`, `adr/0003`, `adr/0012`, `diagrams/06`, `diagrams/12`, `plan/plan-3-4`. Draft: `mytheus-web/app/(call)/*`, `app/(shell)/*`, `components/*`._
