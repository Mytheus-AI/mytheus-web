"use client";

import { useState } from "react";
import { Tag } from "@/components/Tag";
import { CheckIcon } from "@/components/icons";
import { useToast } from "@/contexts/ToastContext";

type Column = "today" | "week" | "done";

type Task = {
  id: string;
  title: string;
  meta: string;
  column: Column;
  due?: { label: string; variant: "orange" | "brown" };
  linked?: string;
  blocked?: string;
};

const INITIAL_TASKS: Task[] = [
  {
    id: "t3",
    title: "Share the onboarding flow specs with design",
    meta: "From Design review · the three-step flow won",
    column: "today",
    due: { label: "Due today", variant: "orange" },
  },
  {
    id: "t5",
    title: "Send support the one-price talking points",
    meta: "From Pricing sync · no pilot exceptions",
    column: "today",
    due: { label: "Due today", variant: "orange" },
  },
  {
    id: "t1",
    title: "Update the pricing page to the $29 hold",
    meta: "From Pricing sync · confirmed by Cloe",
    column: "week",
    due: { label: "Due Friday", variant: "orange" },
    linked: "NEX-142 · Jira",
  },
  {
    id: "t2",
    title: "Prepare the churn cohort view",
    meta: "From Weekly meeting · with the data team",
    column: "week",
    due: { label: "Due Tuesday", variant: "brown" },
    blocked: "Waiting on the annual-discounts decision to be confirmed",
  },
  {
    id: "t4",
    title: "Flag the pilot accounts for support",
    meta: "From Pricing sync · done yesterday",
    column: "done",
  },
  {
    id: "t6",
    title: "Book the beta readiness review",
    meta: "From Weekly meeting · done Monday",
    column: "done",
  },
];

const COLUMNS: { id: Column; title: string }[] = [
  { id: "today", title: "Today" },
  { id: "week", title: "This week" },
  { id: "done", title: "Done" },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const toast = useToast();

  const open = tasks.filter((t) => t.column !== "done").length;
  const dueToday = tasks.filter((t) => t.column === "today").length;

  function toggle(id: string) {
    const task = tasks.find((t) => t.id === id);
    if (task && task.column !== "done") toast("Nice. Moved to done.");
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, column: t.column === "done" ? "today" : "done" } : t)));
  }

  return (
    <section className="page" id="page-tasks">
      <div className="page-scroll">
        <div className="page-inner">
          <div className="screen-head reveal">
            <div className="head-text">
              <h1>My tasks</h1>
              <p>Action items your meetings assigned to you</p>
            </div>
            <div className="head-actions">
              <button type="button" className="btn-accent-sm tap" onClick={() => toast("New task added to today")}>
                New task
              </button>
            </div>
          </div>

          <div className="stat-strip reveal" style={{ animationDelay: ".07s" }}>
            <div className="stat-tile">
              <b>{open}</b>
              <span>Open tasks</span>
              <small className="is-flat">across 3 meetings</small>
            </div>
            <div className="stat-tile">
              <b>{dueToday}</b>
              <span>Due today</span>
              <small className="is-flat">both from this week&apos;s syncs</small>
            </div>
            <div className="stat-tile">
              <b>5</b>
              <span>Completed this week</span>
              <small>+2 vs last week</small>
            </div>
            <div className="stat-tile">
              <b>60%</b>
              <span>Capacity, weighted by due date</span>
              <div className="meter" style={{ marginTop: 8 }} role="img" aria-label="Workload 60 percent">
                <i style={{ width: "60%" }}></i>
              </div>
            </div>
          </div>

          <div className="canvas cols-3 is-fill">
            {COLUMNS.map((col, ci) => {
              const colTasks = tasks.filter((t) => t.column === col.id);
              return (
                <div className="panel reveal" style={{ animationDelay: `${0.12 + ci * 0.06}s` }} key={col.id}>
                  <div className="panel-head">
                    <h2>{col.title}</h2>
                    <span className="count-chip">{colTasks.length}</span>
                  </div>

                  {colTasks.map((task) => (
                    <div className={`panel-row is-top${col.id === "done" ? " is-done-row" : ""}`} key={task.id}>
                      <button
                        type="button"
                        className={`task-check tap${col.id === "done" ? " is-checked" : ""}`}
                        aria-label={col.id === "done" ? "Mark not done" : "Mark done"}
                        onClick={() => toggle(task.id)}
                      >
                        <CheckIcon size={12} />
                      </button>
                      <span className="row-body">
                        <strong>{task.title}</strong>
                        <small>{task.meta}</small>
                        {(task.due || task.linked) && (
                          <span className="row-chips">
                            {task.due && (
                              <Tag variant={task.due.variant} dot>
                                {task.due.label}
                              </Tag>
                            )}
                            {task.linked && <Tag variant="neutral">{task.linked}</Tag>}
                          </span>
                        )}
                        {task.blocked && (
                          <span className="dep-warning">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 8.5V13M12 16.5h.01" />
                              <circle cx="12" cy="12" r="8.5" />
                            </svg>
                            {task.blocked}
                          </span>
                        )}
                      </span>
                    </div>
                  ))}

                  {colTasks.length === 0 && <div className="board-empty">Nothing here. Enjoy it.</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
