export function Tag({
  variant = "neutral",
  dot = false,
  icon,
  children,
}: {
  variant?: "green" | "brown" | "orange" | "neutral";
  dot?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className={`tag tag-${variant}`}>
      {dot && <span className="tag-dot" />}
      {icon}
      {children}
    </span>
  );
}
