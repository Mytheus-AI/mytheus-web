"use client";

import { useEffect, useRef, useState } from "react";

export function CountUp({ target, delay = 0 }: { target: number; delay?: number }) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      const raf = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(raf);
    }

    const dur = 800;
    let raf: number;
    const start = performance.now() + delay;

    function tick(now: number) {
      const t = Math.min(1, (now - start) / dur);
      if (t >= 0) setValue(Math.round(target * (1 - Math.pow(1 - Math.max(t, 0), 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setValue(target);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, delay]);

  return <b className="count-up">{value}</b>;
}
