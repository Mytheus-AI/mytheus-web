"use client";

import { useId, useState } from "react";
import { ChevronDownIcon } from "./icons";

export function CollapseSection({
  title,
  countChip,
  actions,
  children,
  defaultOpen = true,
  onToggle,
}: {
  title: React.ReactNode;
  countChip?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  onToggle?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const bodyId = useId();

  return (
    <div>
      <div className="section-label" style={{ paddingBottom: 8 }}>
        <button
          type="button"
          className="collapse-toggle tap"
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={() => {
            const next = !open;
            setOpen(next);
            onToggle?.(next);
          }}
        >
          <ChevronDownIcon className="collapse-chev" />
          {title}
          {countChip}
        </button>
        {actions && <div className="label-actions">{actions}</div>}
      </div>
      <div className={`collapse-body${open ? "" : " is-closed"}`} id={bodyId}>
        <div className="collapse-inner">{children}</div>
      </div>
    </div>
  );
}
