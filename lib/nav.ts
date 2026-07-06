export type NavKey =
  | "home"
  | "meeting"
  | "recordings"
  | "worklog"
  | "tasks"
  | "decisions"
  | "ask"
  | "settings";

export const NAV_ITEMS: { key: NavKey; href: string; label: string }[] = [
  { key: "home", href: "/home", label: "Home" },
  { key: "meeting", href: "/meetings", label: "Meetings" },
  { key: "recordings", href: "/recordings", label: "Recordings" },
  { key: "worklog", href: "/worklog", label: "Worklog" },
  { key: "tasks", href: "/tasks", label: "My Tasks" },
  { key: "decisions", href: "/decisions", label: "Decisions" },
  { key: "ask", href: "/ask", label: "Ask Mytheus" },
  { key: "settings", href: "/settings", label: "Settings" },
];
