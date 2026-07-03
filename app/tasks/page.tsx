"use client";

import { useState } from "react";
import { Tag } from "@/components/Tag";
import { CheckIcon } from "@/components/icons";

type Task = {
  id: string;
  title: string;
  meta: string;
  tags: { variant: "orange" | "brown" | "green" | "neutral"; dot?: boolean; icon?: React.ReactNode; label: string }[];
  done?: boolean;
  blocked?: string;
};

const INITIAL_TASKS: Task[] = [
  {
    id: "t1",
    title: "Update the pricing page to the $29 hold",
    meta: "From Pricing sync · confirmed by Cloe",
    tags: [
      { variant: "orange", dot: true, label: "Due Friday" },
      { variant: "neutral", label: "In progress" },
      {
        variant: "neutral",
        label: "NEX-142 · Jira",
        icon: (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 14a4.5 4.5 0 0 0 6.4.4l3-3a4.5 4.5 0 0 0-6.4-6.4l-1.7 1.7" />
            <path d="M14 10a4.5 4.5 0 0 0-6.4-.4l-3 3a4.5 4.5 0 0 0 6.4 6.4l1.7-1.7" />
          </svg>
        ),
      },
    ],
  },
  {
    id: "t2",
    title: "Prepare the churn cohort view",
    meta: "From Weekly meeting · with the data team",
    tags: [
      { variant: "brown", dot: true, label: "Due Tuesday" },
      { variant: "neutral", label: "To do" },
    ],
    blocked: 'Blocked — waiting on the "annual discounts" decision to be confirmed',
  },
  {
    id: "t3",
    title: "Share the onboarding flow specs with design",
    meta: "From Design review · three-step flow won",
    tags: [
      { variant: "orange", dot: true, label: "Due today" },
      { variant: "neutral", label: "To do" },
    ],
  },
  {
    id: "t4",
    title: "Flag the pilot accounts for support",
    meta: "From Pricing sync · done yesterday",
    tags: [{ variant: "green", dot: true, label: "Done" }],
    done: true,
  },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  function toggle(id: string) {
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  return (
    <section className="page" id="page-tasks">
      <div className="page-scroll">
        <div className="page-inner">
          <div className="screen-head reveal">
            <h1>My tasks</h1>
            <p>Action items your meetings assigned to you</p>
          </div>

          <div className="workload-card reveal" style={{ animationDelay: ".09s" }}>
            <div className="workload-info">
              <strong>You&apos;re at 60% capacity</strong>
              <small>3 open tasks weighted by due date. Your agent flags new assignments past 80%.</small>
            </div>
            <div className="workload-bar" role="img" aria-label="Workload 60 percent">
              <i></i>
            </div>
          </div>

          <div className="reveal" style={{ animationDelay: ".18s" }}>
            {tasks.map((task) => (
              <div className={`task-row${task.done ? " is-done" : ""}`} key={task.id}>
                <button type="button" className="task-check tap" aria-label={task.done ? "Mark not done" : "Mark done"} onClick={() => toggle(task.id)}>
                  <CheckIcon size={12} />
                </button>
                <div className="task-body">
                  <strong>{task.title}</strong>
                  <small>{task.meta}</small>
                  <div className="task-meta">
                    {task.tags.map((tag) => (
                      <Tag key={tag.label} variant={tag.variant} dot={tag.dot} icon={tag.icon}>
                        {tag.label}
                      </Tag>
                    ))}
                  </div>
                  {task.blocked && (
                    <div className="dep-warning">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 8.5V13M12 16.5h.01" />
                        <circle cx="12" cy="12" r="8.5" />
                      </svg>
                      {task.blocked}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
