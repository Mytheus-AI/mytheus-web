import Link from "next/link";
import { CamIcon, SparkleIcon } from "@/components/icons";
import { SQUIGGLE_PATH } from "@/components/squiggle-path";
import { Tag } from "@/components/Tag";
import { JoinCallButton } from "@/components/JoinCallButton";

const STATS = [
  { value: "6", label: "Meetings this week", delta: "+2 vs last week" },
  { value: "9", label: "Decisions captured", delta: "1 awaiting confirmation", flat: true },
  { value: "24", label: "Key points", delta: "+9 vs last week" },
  { value: "3", label: "Open tasks", delta: "1 due today", flat: true },
];

const LATER_MEETINGS = [
  {
    time: "09:15",
    when: "Tomorrow",
    title: "Standup · Core team",
    meta: "15 min · 8 people",
  },
  {
    time: "14:00",
    when: "Thursday",
    title: "Beta launch readiness",
    meta: "30 min · 6 people",
  },
  {
    time: "11:00",
    when: "Friday",
    title: "1:1 with Cloe",
    meta: "30 min · 2 people",
  },
];

const RECAPS = [
  {
    title: "Pricing sync",
    when: "Yesterday · 42 min",
    summary: "Launch pricing holds at $29. Annual discounts wait until after the beta.",
    decisions: 2,
    keyPoints: 5,
  },
  {
    title: "Weekly meeting · Remote strategy",
    when: "Monday · 1h 04m",
    summary: "The beta ships July 21. Churn numbers move to next week's agenda.",
    decisions: 3,
    keyPoints: 7,
  },
  {
    title: "Standup · Core team",
    when: "Monday · 14 min",
    summary: "Two blockers cleared: staging access and the flaky upload test.",
    keyPoints: 2,
  },
  {
    title: "Design review · Mobile onboarding",
    when: "Jun 27 · 51 min",
    summary: "The three-step flow wins. Progress dots replace the percentage bar.",
    decisions: 1,
  },
];

export default function HomePage() {
  return (
    <section className="page" id="page-home">
      <div className="page-scroll">
        <div className="page-inner">
          <div className="screen-head reveal">
            <div className="head-text">
              <h1>Good morning, Wayne</h1>
              <p>Wednesday, July 2 · 2 meetings on your calendar</p>
            </div>
            <div className="head-actions">
              <button type="button" className="btn-ghost tap">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3.5" y="5" width="17" height="16" rx="3" />
                  <path d="M3.5 10h17M8 2.5V6M16 2.5V6" />
                </svg>
                Schedule
              </button>
              <JoinCallButton path="/meeting" className="btn-dark tap">
                <CamIcon size={16} />
                Start a meeting
              </JoinCallButton>
            </div>
          </div>

          <div className="stat-strip reveal" style={{ animationDelay: ".07s" }}>
            {STATS.map((s) => (
              <div className="stat-tile" key={s.label}>
                <b>{s.value}</b>
                <span>{s.label}</span>
                <small className={s.flat ? "is-flat" : ""}>{s.delta}</small>
              </div>
            ))}
          </div>

          <div className="canvas cols-3 is-fill home-canvas">
            <div className="panel reveal" style={{ animationDelay: ".14s" }}>
              <div className="panel-head">
                <h2>Up next</h2>
                <span className="count-chip">4</span>
              </div>

              <div className="next-card">
                <svg className="next-squiggle" viewBox="0 0 200 100" fill="none" aria-hidden="true">
                  <path d={SQUIGGLE_PATH} stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="next-kicker">Starts in 45 min · Today 10:30</div>
                <div className="next-title">Design review · Mobile onboarding</div>
                <div className="next-meta">45 min · 5 people · prep brief ready</div>
                <div className="next-foot">
                  <span className="av-stack">
                    <i style={{ backgroundImage: "url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=60&auto=format&fit=crop'), linear-gradient(140deg,#e4ddd2,#c9bfae)" }} />
                    <i style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=60&auto=format&fit=crop'), linear-gradient(140deg,#e4ddd2,#c9bfae)" }} />
                    <i style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=60&auto=format&fit=crop'), linear-gradient(140deg,#e4ddd2,#c9bfae)" }} />
                    <span className="av-more">+2</span>
                  </span>
                  <JoinCallButton path="/prejoin" className="btn-accent-sm tap" >
                    Join
                  </JoinCallButton>
                </div>
              </div>

              {LATER_MEETINGS.map((m) => (
                <div className="panel-row" key={m.title}>
                  <span className="up-time">
                    <b>{m.time}</b>
                    <span>{m.when}</span>
                  </span>
                  <span className="row-body">
                    <strong>{m.title}</strong>
                    <small>{m.meta}</small>
                  </span>
                  <button type="button" className="btn-ghost-sm tap">
                    Remind me
                  </button>
                </div>
              ))}

              <div className="panel-foot">
                <button type="button" className="foot-link tap">Open calendar</button>
              </div>
            </div>

            <div className="panel reveal" style={{ animationDelay: ".2s" }}>
              <div className="panel-head">
                <h2>Catch up</h2>
                <span className="count-chip">4</span>
              </div>

              {RECAPS.map((recap) => (
                <div className="panel-row is-top" key={recap.title}>
                  <span className="row-body">
                    <span className="row-title-line">
                      <strong>{recap.title}</strong>
                      <small>{recap.when}</small>
                    </span>
                    <p className="row-sum">{recap.summary}</p>
                    <span className="row-chips">
                      {recap.decisions && (
                        <Tag variant="green" dot>
                          {recap.decisions} decision{recap.decisions === 1 ? "" : "s"}
                        </Tag>
                      )}
                      {recap.keyPoints && (
                        <Tag variant="brown" dot>
                          {recap.keyPoints} key points
                        </Tag>
                      )}
                      <Link href="/recordings" className="recap-link tap" style={{ marginLeft: "auto" }}>
                        Open recap
                      </Link>
                    </span>
                  </span>
                </div>
              ))}

              <div className="panel-foot">
                <Link href="/recordings" className="foot-link tap">
                  All recordings
                </Link>
              </div>
            </div>

            <div className="panel reveal" style={{ animationDelay: ".26s" }}>
              <div className="panel-head">
                <h2>Needs attention</h2>
                <span className="count-chip">3</span>
              </div>

              <div className="panel-row is-top">
                <span className="row-body">
                  <span className="row-kicker is-brown">Pending decision</span>
                  <strong>Annual discounts wait until after the beta</strong>
                  <small>Pricing sync · confidence 0.64</small>
                  <span className="row-chips">
                    <Link href="/decisions" className="btn-accent-sm tap" style={{ height: 28, fontSize: 11 }}>
                      Review
                    </Link>
                  </span>
                </span>
              </div>

              <div className="panel-row is-top">
                <span className="row-body">
                  <span className="row-kicker is-orange">Task due today</span>
                  <strong>Share the onboarding flow specs with design</strong>
                  <small>From Design review · the three-step flow won</small>
                  <span className="row-chips">
                    <Link href="/tasks" className="btn-ghost-sm tap" style={{ height: 28, fontSize: 11 }}>
                      Open task
                    </Link>
                  </span>
                </span>
              </div>

              <div className="panel-row is-top">
                <span className="row-body">
                  <span className="row-kicker">Saved question</span>
                  <strong>Which pilot accounts are excluded from the $29 hold?</strong>
                  <small>Saved from the weekly meeting, ready for the next pricing sync</small>
                  <span className="row-chips">
                    <Link href="/ask" className="btn-ghost-sm tap" style={{ height: 28, fontSize: 11 }}>
                      Ask Mytheus
                    </Link>
                  </span>
                </span>
              </div>

              <div className="panel-foot agent-foot">
                <SparkleIcon size={13} />
                Prep brief for the 10:30 design review is in your Slack.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
