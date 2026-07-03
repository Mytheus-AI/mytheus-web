import Link from "next/link";
import { CountUp } from "@/components/CountUp";
import { Tag } from "@/components/Tag";
import { CamIcon } from "@/components/icons";

const upcoming = [
  {
    time: "10:30",
    when: "Today",
    title: "Design review — mobile onboarding",
    meta: "45 min · 5 people",
    avatars: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=60&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=60&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=60&auto=format&fit=crop",
    ],
    more: "+2",
    cta: { label: "Join", href: "/prejoin", accent: true },
  },
  {
    time: "09:15",
    when: "Tomorrow",
    title: "Standup — core team",
    meta: "15 min · 8 people",
    avatars: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=60&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=60&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=60&auto=format&fit=crop",
    ],
    more: "+5",
    cta: { label: "Remind me", href: null, accent: false },
  },
];

const recaps = [
  {
    title: "Pricing sync",
    when: "Yesterday · 42 min",
    summary: "Launch pricing holds at $29. Annual discounts wait until after the beta.",
    decisions: 2,
    keyPoints: 5,
  },
  {
    title: "Weekly meeting — remote strategy",
    when: "Monday · 1h 04m",
    summary: "The beta ships July 21. Churn numbers move to next week's agenda.",
    decisions: 3,
    keyPoints: 7,
  },
];

export default function HomePage() {
  return (
    <section className="page" id="page-home">
      <div className="page-scroll">
        <div className="page-inner">
          <div className="screen-head reveal">
            <h1>Good morning, Wayne</h1>
            <p>Wednesday, July 2 · 2 meetings today</p>
          </div>

          <div className="hero-card reveal" style={{ animationDelay: ".09s" }}>
            <svg className="hero-squiggle" viewBox="0 0 200 100" fill="none" aria-hidden="true">
              <path
                d="M14 64 C 22 30, 50 24, 54 46 C 58 68, 30 76, 28 56 C 26 38, 52 28, 68 38 C 84 48, 74 68, 92 64 C 112 59, 106 34, 130 38 C 158 43, 158 52, 190 48"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
            <div className="hero-label">This week</div>
            <h2 className="hero-headline">Your week, remembered.</h2>
            <p className="hero-sub">Every conversation is captured, summarized, and ready to search.</p>
            <div className="hero-stats">
              <div className="hero-stat">
                <CountUp target={6} />
                <span>Meetings</span>
              </div>
              <div className="hero-stat">
                <CountUp target={9} delay={90} />
                <span>Decisions</span>
              </div>
              <div className="hero-stat">
                <CountUp target={24} delay={180} />
                <span>Key points</span>
              </div>
            </div>
            <div className="hero-ctas">
              <Link href="/meeting" className="btn-dark tap">
                <CamIcon size={16} />
                Start a meeting
              </Link>
              <button type="button" className="btn-ghost tap">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3.5" y="5" width="17" height="16" rx="3" />
                  <path d="M3.5 10h17M8 2.5V6M16 2.5V6" />
                </svg>
                Schedule
              </button>
            </div>
          </div>

          <div className="home-cols">
            <div className="col-stack reveal" style={{ animationDelay: ".18s" }}>
              <div className="section-label">Up next</div>

              {upcoming.map((item) => (
                <div className="up-card" key={item.title}>
                  <div className="up-when">
                    <b>{item.time}</b>
                    <span>{item.when}</span>
                  </div>
                  <div className="up-body">
                    <strong>{item.title}</strong>
                    <small>{item.meta}</small>
                    <div className="av-stack">
                      {item.avatars.map((url) => (
                        <i key={url} style={{ backgroundImage: `url('${url}'), linear-gradient(140deg,#e4ddd2,#c9bfae)` }} />
                      ))}
                      <span className="av-more">{item.more}</span>
                    </div>
                  </div>
                  {item.cta.href ? (
                    <Link href={item.cta.href} className={`${item.cta.accent ? "btn-accent-sm" : "btn-ghost-sm"} tap`}>
                      {item.cta.label}
                    </Link>
                  ) : (
                    <button type="button" className="btn-ghost-sm tap">
                      {item.cta.label}
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="col-stack reveal" style={{ animationDelay: ".27s" }}>
              <div className="section-label">Catch up</div>

              {recaps.map((recap) => (
                <div className="recap-card" key={recap.title}>
                  <div className="recap-top">
                    <strong>{recap.title}</strong>
                    <small>{recap.when}</small>
                  </div>
                  <p className="recap-sum">{recap.summary}</p>
                  <div className="recap-foot">
                    <Tag variant="green" dot>
                      {recap.decisions} decisions
                    </Tag>
                    <Tag variant="brown" dot>
                      {recap.keyPoints} key points
                    </Tag>
                    <Link href="/recordings" className="recap-link tap">
                      Open recap
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
