import React from "react";

/** TrendLink Tag — outlined chip for categories & filters, optionally removable. */
export function Tag({ children, active = false, onRemove, onClick, style, ...rest }) {
  return (
    <span
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "5px 12px", borderRadius: "var(--radius-pill)",
        border: `1.5px solid ${active ? "var(--blue-500)" : "var(--border-default)"}`,
        background: active ? "var(--blue-50)" : "#fff",
        color: active ? "var(--blue-700)" : "var(--text-body)",
        fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)",
        fontWeight: "var(--weight-medium)", lineHeight: 1.4,
        cursor: onClick ? "pointer" : "default", whiteSpace: "nowrap",
        transition: "all var(--duration-fast) var(--ease-standard)", ...style,
      }}
      {...rest}
    >
      {children}
      {onRemove && (
        <button onClick={(e) => { e.stopPropagation(); onRemove(); }} aria-label="remove"
          style={{ border: "none", background: "none", cursor: "pointer", padding: 0, display: "flex", color: "currentColor", opacity: 0.6 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      )}
    </span>
  );
}
