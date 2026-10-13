import React from "react";

/**
 * TrendLink Alert — inline message banner with status tone, optional
 * title and leading icon. Soft tinted background + accent left edge.
 */
export function Alert({ children, title, tone = "info", icon, style, ...rest }) {
  const tones = {
    info:    ["var(--info-50)", "var(--info-500)", "var(--blue-800)"],
    success: ["var(--success-50)", "var(--success-500)", "#1d6b48"],
    warning: ["var(--warning-50)", "var(--warning-500)", "#8a6206"],
    danger:  ["var(--danger-50)", "var(--danger-500)", "#8f2b2b"],
  };
  const [bg, edge, fg] = tones[tone] || tones.info;

  return (
    <div role="alert" style={{
      display: "flex", gap: 12, padding: "14px 18px",
      background: bg, borderLeft: `4px solid ${edge}`,
      borderRadius: "var(--radius-md)",
      fontFamily: "var(--font-sans)", ...style,
    }} {...rest}>
      {icon && <span style={{ color: edge, flex: "none", display: "flex", marginTop: 2 }}>{icon}</span>}
      <div>
        {title && <div style={{ fontWeight: "var(--weight-bold)", color: fg, fontSize: "var(--text-base)", marginBottom: 2 }}>{title}</div>}
        <div style={{ color: "var(--text-body)", fontSize: "var(--text-sm)", lineHeight: 1.7 }}>{children}</div>
      </div>
    </div>
  );
}
