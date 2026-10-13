import React from "react";

/** TrendLink Badge — small status pill. Soft tonal by default. */
export function Badge({ children, tone = "blue", variant = "soft", style, ...rest }) {
  const tones = {
    blue:    { soft: ["var(--blue-50)", "var(--blue-700)"],    solid: ["var(--blue-600)", "#fff"] },
    orange:  { soft: ["var(--orange-50)", "var(--orange-600)"], solid: ["var(--orange-400)", "#fff"] },
    success: { soft: ["var(--success-50)", "var(--success-500)"], solid: ["var(--success-500)", "#fff"] },
    warning: { soft: ["var(--warning-50)", "var(--warning-500)"], solid: ["var(--warning-500)", "#fff"] },
    danger:  { soft: ["var(--danger-50)", "var(--danger-500)"], solid: ["var(--danger-500)", "#fff"] },
    neutral: { soft: ["var(--neutral-100)", "var(--neutral-600)"], solid: ["var(--neutral-600)", "#fff"] },
  };
  const [bg, fg] = (tones[tone] || tones.blue)[variant] || (tones[tone] || tones.blue).soft;

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: "var(--radius-pill)",
      background: bg, color: fg,
      fontFamily: "var(--font-sans)", fontSize: "var(--text-xs)",
      fontWeight: "var(--weight-bold)", letterSpacing: "0.02em",
      lineHeight: 1.4, whiteSpace: "nowrap", ...style,
    }} {...rest}>
      {children}
    </span>
  );
}
