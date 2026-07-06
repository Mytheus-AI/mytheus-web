"use client";

import { useEffect, useState } from "react";

/** Types text in progressively with a caret, like agent output streaming, then settles. */
export function StreamText({ text, speed = 28, onDone }: { text: string; speed?: number; onDone?: () => void }) {
  const [count, setCount] = useState(0);
  const done = count >= text.length;

  useEffect(() => {
    if (done) {
      onDone?.();
      return;
    }
    const id = setTimeout(() => setCount((c) => Math.min(text.length, c + 1 + Math.floor(Math.random() * 3))), speed);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, done, text, speed]);

  return (
    <>
      {text.slice(0, count)}
      {!done && <span className="stream-caret" aria-hidden="true" />}
    </>
  );
}
