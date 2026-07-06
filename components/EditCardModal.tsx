"use client";

import { useEffect, useState } from "react";
import { Select } from "./Select";

export type EditCardTarget = {
  kind: "decision" | "action";
  text: string;
  rationale?: string;
  assignee?: string;
  due?: string;
};

const ASSIGNEES = ["Sufjan", "Wayne", "Cloe", "Milana", "Rosa", "Keith"];

/** Shared edit dialog for agent-extracted decisions and actions — nothing commits without you. */
export function EditCardModal({
  target,
  onSave,
  onClose,
}: {
  target: EditCardTarget;
  onSave: (edited: EditCardTarget) => void;
  onClose: () => void;
}) {
  const [text, setText] = useState(target.text);
  const [rationale, setRationale] = useState(target.rationale ?? "");
  const [assignee, setAssignee] = useState(target.assignee ?? ASSIGNEES[0]);
  const [due, setDue] = useState(target.due ?? "");

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const isDecision = target.kind === "decision";

  return (
    <div className="peek-scrim" onClick={onClose}>
      <div className="peek-card" role="dialog" aria-modal="true" aria-labelledby="edit-title" onClick={(e) => e.stopPropagation()}>
        <div className="peek-kind">{isDecision ? "Edit decision" : "Edit action item"} · extracted from this meeting</div>
        <h2 className="peek-title" id="edit-title">
          Adjust before saving
        </h2>
        <p className="peek-note" style={{ marginTop: 6 }}>
          Your agent drafted this from the conversation. Nothing is saved until you confirm.
        </p>

        <div className="modal-fields">
          <label className="field">
            <span>{isDecision ? "Decision" : "Action"}</span>
            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={2} autoFocus />
          </label>

          {isDecision ? (
            <label className="field">
              <span>Rationale</span>
              <textarea value={rationale} onChange={(e) => setRationale(e.target.value)} rows={2} placeholder="Why this was decided" />
            </label>
          ) : (
            <div className="modal-2col">
              <div className="field">
                <span>Assignee</span>
                <Select options={ASSIGNEES} value={assignee} onChange={setAssignee} />
              </div>
              <label className="field">
                <span>Due</span>
                <input type="text" value={due} onChange={(e) => setDue(e.target.value)} placeholder="Friday" />
              </label>
            </div>
          )}
        </div>

        <div className="peek-actions">
          <button type="button" className="btn-ghost-sm tap" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-accent-sm tap"
            onClick={() => onSave({ kind: target.kind, text: text.trim() || target.text, rationale, assignee, due })}
          >
            {isDecision ? "Save decision" : "Create task"}
          </button>
        </div>
      </div>
    </div>
  );
}
