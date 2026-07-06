"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon, CheckIcon } from "./icons";

export function Select({
  label,
  options,
  value,
  defaultValue,
  onChange,
  openUp = false,
  compact = false,
}: {
  label?: string;
  options: string[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Open the option list above the button (for controls near the bottom of the screen). */
  openUp?: boolean;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState(defaultValue ?? options[0]);
  const selected = value ?? internal;
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function pick(option: string) {
    setInternal(option);
    onChange?.(option);
    setOpen(false);
  }

  return (
    <div className={`select${open ? " is-open" : ""}${compact ? " is-compact" : ""}`} ref={rootRef}>
      {label && !compact && <span className="select-label">{label}</span>}
      <button type="button" className="select-btn tap" aria-haspopup="listbox" aria-expanded={open} aria-label={label} onClick={() => setOpen((v) => !v)}>
        {selected}
        <ChevronDownIcon className="select-chev" />
      </button>
      {open && (
        <div className={`select-pop${openUp ? " is-up" : ""}`} role="listbox" aria-label={label}>
          {options.map((option) => (
            <button
              type="button"
              role="option"
              aria-selected={option === selected}
              key={option}
              className={`select-opt${option === selected ? " is-selected" : ""}`}
              onClick={() => pick(option)}
            >
              {option}
              {option === selected && <CheckIcon size={12} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
