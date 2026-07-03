"use client";

import { useRef, useState } from "react";
import { SparkleIcon, SendIcon, PlusIcon, BrandMarkIcon } from "@/components/icons";
import { Tag } from "@/components/Tag";

type ThreadItem =
  | { kind: "question"; id: number; text: string }
  | { kind: "thinking"; id: number }
  | { kind: "answer"; id: number; text: string; done: boolean };

const CANNED_ANSWER =
  "You decided to hold launch pricing at $29 and revisit annual discounts after the beta. Keith owns the pricing-page update, due Friday.";

const SUGGESTIONS = [
  "What did we decide about pricing?",
  "Summarize Monday's standup",
  "Who owns the launch checklist?",
];

export default function AskPage() {
  const [thread, setThread] = useState<ThreadItem[]>([]);
  const [input, setInput] = useState("");
  const askingRef = useRef(false);
  const idRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollToEnd() {
    requestAnimationFrame(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    });
  }

  function ask(question: string) {
    if (askingRef.current || !question) return;
    askingRef.current = true;

    const qId = idRef.current++;
    setThread((t) => [...t, { kind: "question", id: qId, text: question }]);
    const thinkId = idRef.current++;
    setThread((t) => [...t, { kind: "thinking", id: thinkId }]);
    scrollToEnd();

    setTimeout(() => {
      const ansId = idRef.current++;
      setThread((t) => [...t.filter((item) => item.id !== thinkId), { kind: "answer", id: ansId, text: "", done: false }]);
      scrollToEnd();

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) {
        setThread((t) => t.map((item) => (item.id === ansId ? { ...item, text: CANNED_ANSWER, done: true } : item)));
        askingRef.current = false;
        return;
      }

      let i = 0;
      const type = setInterval(() => {
        i = Math.min(i + 3, CANNED_ANSWER.length);
        setThread((t) => t.map((item) => (item.id === ansId ? { ...item, text: CANNED_ANSWER.slice(0, i) } : item)));
        scrollToEnd();
        if (i >= CANNED_ANSWER.length) {
          clearInterval(type);
          setThread((t) => t.map((item) => (item.id === ansId ? { ...item, done: true } : item)));
          askingRef.current = false;
        }
      }, 30);
    }, 1300);
  }

  return (
    <section className="page" id="page-ask">
      <div className="ask-scroll" ref={scrollRef}>
        <div className="ask-inner">
          {thread.length === 0 && (
            <div className="ask-intro reveal">
              <SparkleIcon size={34} />
              <h1>Ask about your meetings</h1>
              <p>I remember every meeting you&apos;ve captured.</p>
              <div className="ask-suggest">
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" className="suggest-chip tap" onClick={() => ask(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="ask-thread">
            {thread.map((item) => {
              if (item.kind === "question") {
                return (
                  <div className="ask-q" key={item.id}>
                    {item.text}
                  </div>
                );
              }
              if (item.kind === "thinking") {
                return (
                  <div className="thinking" key={item.id}>
                    <span className="spark">
                      <SparkleIcon size={18} />
                    </span>
                    Thinking
                  </div>
                );
              }
              return (
                <div className="ask-a" key={item.id}>
                  <div className="ask-a-head">
                    <span className="c-av-brand">
                      <BrandMarkIcon width={15} height={9} strokeWidth={14} />
                    </span>
                    <strong>Mytheus</strong>
                  </div>
                  <p className="ask-a-text">{item.text}</p>
                  {item.done && (
                    <div className="ask-sources">
                      <Tag variant="green" dot>
                        Decision · Pricing sync
                      </Tag>
                      <Tag variant="brown" dot>
                        Key point · Weekly meeting
                      </Tag>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="ask-composer-wrap">
        <form
          className="composer"
          id="ask-composer"
          onSubmit={(e) => {
            e.preventDefault();
            const text = input.trim();
            if (!text) return;
            setInput("");
            ask(text);
          }}
        >
          <button type="button" className="comp-add tap" data-tip="Add context" aria-label="Add context">
            <PlusIcon />
          </button>
          <input
            type="text"
            placeholder="Ask anything about your meetings"
            aria-label="Ask anything about your meetings"
            autoComplete="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="comp-send tap" data-tip="Ask" aria-label="Ask">
            <SendIcon />
          </button>
        </form>
      </div>
    </section>
  );
}
