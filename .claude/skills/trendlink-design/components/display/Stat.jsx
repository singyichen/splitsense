import React from "react";

/**
 * TrendLink Stat — a big number with label, for dashboards and the
 * marketing "近800家" style proof points.
 */
export function Stat({ value, label, suffix, tone = "blue", align = "left", style, ...rest }) {
  const color = tone === "orange" ? "var(--orange-500)" : "var(--blue-700)";
  return (
    <div style={{ textAlign: align, ...style }} {...rest}>
      <div style={{
        fontFamily: "var(--font-sans)", fontWeight: "var(--weight-black)",
        fontSize: "var(--text-4xl)", lineHeight: 1, color,
        display: "flex", alignItems: "baseline", gap: 2,
        justifyContent: align === "center" ? "center" : "flex-start",
      }}>
        {value}
        {suffix && <span style={{ fontSize: "var(--text-xl)", fontWeight: "var(--weight-bold)" }}>{suffix}</span>}
      </div>
      <div style={{ marginTop: 8, fontSize: "var(--text-sm)", color: "var(--text-muted)", fontWeight: "var(--weight-medium)" }}>
        {label}
      </div>
    </div>
  );
}
