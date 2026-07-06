export type MeetingStatus = "live" | "soon" | "scheduled" | "ended";

export type MeetingListItem = {
  id: string;
  title: string;
  when: { day: string; time: string };
  meta: string;
  status: MeetingStatus;
  statusLabel: string;
  summary?: string;
  counts?: { decisions: number; actions: number };
};

export const UPCOMING_MEETINGS: MeetingListItem[] = [
  {
    id: "design-review",
    title: "Design review · Mobile onboarding",
    when: { day: "Today", time: "14:30" },
    meta: "45 min · 5 people invited",
    status: "soon",
    statusLabel: "Starts in 4 min",
  },
  {
    id: "product-sync",
    title: "Product sync · Q3 roadmap",
    when: { day: "Tomorrow", time: "10:00" },
    meta: "60 min · 8 people invited",
    status: "scheduled",
    statusLabel: "Tomorrow",
  },
];

export const PAST_MEETINGS: MeetingListItem[] = [
  {
    id: "pricing-sync",
    title: "Pricing sync",
    when: { day: "Yesterday", time: "11:00" },
    meta: "42 min · 6 people · recorded",
    status: "ended",
    statusLabel: "Ended",
    summary: "Launch pricing holds at $29 through the beta, no exceptions for pilots. Wayne owns the pricing page update by Friday.",
    counts: { decisions: 2, actions: 3 },
  },
  {
    id: "weekly-remote",
    title: "Weekly meeting · Remote strategy",
    when: { day: "Jul 2", time: "09:30" },
    meta: "56 min · 16 people · recorded",
    status: "ended",
    statusLabel: "Ended",
    summary: "Beta date moved to July 21. Sufjan owns the churn export; the cohort view is due before next week's numbers.",
    counts: { decisions: 1, actions: 4 },
  },
  {
    id: "design-crit",
    title: "Design crit · Onboarding flows",
    when: { day: "Jun 30", time: "15:00" },
    meta: "38 min · 4 people · recorded",
    status: "ended",
    statusLabel: "Ended",
    summary: "The three-step flow won over the wizard. Rosa asked for the progress-dots spec, linked in the brief.",
    counts: { decisions: 1, actions: 2 },
  },
  {
    id: "data-review",
    title: "Data review · Churn cohorts",
    when: { day: "Jun 27", time: "13:00" },
    meta: "30 min · 5 people",
    status: "ended",
    statusLabel: "Ended",
    summary: "Cohort definitions locked to signup month. Milana flagged the warehouse migration as a dependency.",
    counts: { decisions: 1, actions: 1 },
  },
];

export function findMeeting(id: string): MeetingListItem | undefined {
  return [...UPCOMING_MEETINGS, ...PAST_MEETINGS].find((m) => m.id === id);
}
