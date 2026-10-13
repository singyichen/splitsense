import React from "react";

/** TrendLink Select — native dropdown styled to match Input. */
export function Select({ label, hint, error, size = "md", children, id, style, ...rest }) {
  const selId = id || React.useId();
  const heights = { sm: 38, md: 46, lg: 54 };
  const h = heights[size] || heights.md;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      {label && (
        <label htmlFor={selId} style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-medium)", color: "var(--text-body)" }}>
          {label}
        </label>
      )}
      <div style={{ position: "relative", display: "flex" }}>
        <select id={selId} style={{
          appearance: "none", WebkitAppearance: "none",
          width: "100%", height: h, padding: "0 40px 0 16px",
          background: "#fff",
          border: `1.5px solid ${error ? "var(--danger-500)" : "var(--border-default)"}`,
          borderRadius: "var(--radius-md)",
          fontFamily: "var(--font-sans)", fontSize: "var(--text-base)",
          color: "var(--text-strong)", cursor: "pointer", outline: "none",
        }} {...rest}>
          {children}
        </select>
        <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--text-muted)", display: "flex" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </span>
      </div>
      {(hint || error) && (
        <span style={{ fontSize: "var(--text-xs)", color: error ? "var(--danger-500)" : "var(--text-muted)" }}>{error || hint}</span>
      )}
    </div>
  );
}
