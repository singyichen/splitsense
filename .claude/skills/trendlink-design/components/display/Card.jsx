import React from "react";

/**
 * TrendLink Card — the workhorse surface. Soft rounded, shallow
 * shadow that lifts on hover, optional top accent stripe and icon.
 */
export function Card({
  children,
  accent,          // false | "blue" | "orange"
  hoverable = false,
  padding = "var(--space-6)",
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const accentColor = accent === "orange" ? "var(--orange-400)"
    : accent === "blue" ? "var(--blue-500)" : null;

  const base = {
    background: "var(--surface-card)",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--border-subtle)",
    borderTop: accentColor ? `4px solid ${accentColor}` : "1px solid var(--border-subtle)",
    boxShadow: hover && hoverable ? "var(--shadow-md)" : "var(--shadow-sm)",
    transform: hover && hoverable ? "translateY(-3px)" : "none",
    transition: "box-shadow var(--duration-normal) var(--ease-standard), transform var(--duration-normal) var(--ease-standard)",
    padding,
    ...style,
  };

  return (
    <div
      style={base}
      onMouseEnter={() => hoverable && setHover(true)}
      onMouseLeave={() => hoverable && setHover(false)}
      {...rest}
    >
      {children}
    </div>
  );
}

/** Icon medallion used at the top of feature cards. */
export function CardIcon({ children, tone = "blue", style }) {
  const tones = {
    blue: { bg: "var(--blue-50)", fg: "var(--blue-600)" },
    orange: { bg: "var(--orange-50)", fg: "var(--orange-500)" },
  };
  const t = tones[tone] || tones.blue;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 56, height: 56, borderRadius: "var(--radius-lg)",
      background: t.bg, color: t.fg, ...style,
    }}>
      {children}
    </span>
  );
}
