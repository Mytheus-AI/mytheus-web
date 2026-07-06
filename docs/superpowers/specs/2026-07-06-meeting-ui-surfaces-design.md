# Meeting UI Surfaces — Design (approved)

_2026-07-06 · Closes the UI gaps in `meeting-gap-notes.md`. UI/UX only — mock data, no backend. Everything follows the existing mytheus.css design language (warm paper surfaces, accent orange, scrim pills, collapsible panels)._

**Approach (approved):** Extend the meeting side panel in place — no tabs, no split rail. New pages follow existing shell patterns.

## 1. Live captions (in-call)
- Overlay strip at the bottom of the speaker stage, above the controls, styled as a wide scrim pill.
- New **CC control** in the toolbar (keyboard `C`), on by default so the surface is visible in the demo.
- Behavior mock: interim text renders faded/italic and mutates; after ~1.5s it settles into a final line with a speaker-colored name (same `sp-*` palette as the transcript page). Rotating scripted lines.

## 2. Side panel (extend in place)
- **Conflict banner:** the conflict leaves the "Needs you" stack and becomes a red banner pinned above all sections, single subtle pulse on appearance. Actions: View that decision (opens existing peek) · Dismiss.
- **Priority queue ("Needs you"):** every card gets the frozen priority strip — p1 red (act now), p2 yellow (attention), p3 blue (informational). New card kinds:
  - **Action detected** (p2): text + assignee + due date, Confirm / Edit / Dismiss. Confirm → toast "Task created" + feed entry.
  - **Workload warning** (p1): "Sufjan is at 90% capacity…", Acknowledge / Reassign (opens Edit modal on the action).
  - **Missing stakeholder** (p2): "Priya owns pricing but isn't here", Invite · Dismiss.
  - **Dependency warning** (p3): informational card, Dismiss.
- **My notes:** distinct sub-stream inside "My agent" (personal listener) — live notes that *stream in token-by-token* (mock animation), then settle. Notes pinnable.
- **Sources:** new collapsible section — in-meeting RAG. Mini composer ("Ask your sources…") + cited source cards using the citation contract: transcript cites (meeting · speaker · timestamp, clickable) and document cites (doc name · section). Includes the "Context added from Milana's agent" card with source-meeting link.
- **Streamed agent output:** new feed entries type in progressively then swap to the settled card (CSS/JS mock).
- **Collapse-to-rail:** the AppBar panel toggle now collapses the panel to a thin (~46px) rail showing per-section icons with unread-count badges and a red conflict dot; clicking the rail (or the toggle) re-expands. Replaces today's all-or-nothing hide.

## 3. Edit modal (shared)
- One modal for decision/action editing, patterned on the existing peek-card dialog: fields pre-filled with extracted content — statement, rationale, assignee (Select), due date; Save commits (toast + feed entry "edited"), Cancel returns.
- Wired from: decision card Edit (currently inert), action card Edit, workload Reassign.

## 4. `/meetings` list (shell)
- New shell page + Rail nav item. Sections: **Up next** (live/soon meetings with Join via `JoinCallButton`) and **Past** (rows: title, date, duration, people, status chip, artifact links → transcript/recording/decisions).
- Search input + segmented filter (All / Upcoming / Ended), same patterns as recordings page.

## 5. `/meetings/[id]` detail (shell)
- Dynamic route, mock data keyed by id, two exemplar states:
  - **Upcoming** (design review): time/countdown, participants, agenda, prep brief (mirrors prejoin content), attachments row, Join button.
  - **Ended** (pricing sync): **per-participant summary** — confirmed decisions, your action items (with due dates), open questions, your notes — each block cited; links to transcript/recording; talk-time meters.

## 6. Prejoin consent gate
- Notice card in the prejoin right column: "This meeting is recorded and transcribed" + agent-listening note; **Join stays disabled until the acknowledgment is checked**. Decline path = existing Cancel.

## 7. Settings additions
- **Data & privacy:** PII redaction toggle (with placeholder explanation ‹EMAIL›-style), Data residency Select (US / EU / Asia-Pacific).
- **My agent:** confidence threshold segmented control (Surface more / Balanced / High confidence only) + AI usage meter row (e.g. 62% of monthly included usage, note about 80%/95% alerts).

## Non-goals
- No backend, no LiveKit/Deepgram wiring, no real streaming, no consent 428 flow, no tenant theming/locale, no mobile bottom-sheet (desktop mock is 1024px+ only).
- Divergences (host-admit, raise-hand, reactions, record toggle, 16+ affordances) stay as-is pending doc reconciliation.

## Verification
- `npm run lint` clean; every new surface reachable by click from home; visual pass over each surface; tooltips/keyboard shortcuts consistent with existing conventions.
