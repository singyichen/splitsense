import React from "react";

/** TrendLink Checkbox — square check with brand-blue fill when checked. */
export function Checkbox({ label, checked, defaultChecked, onChange, disabled, id, ...rest }) {
  const inputId = id || React.useId();
  const [internal, setInternal] = React.useState(defaultChecked || false);
  const isChecked = checked !== undefined ? checked : internal;

  return (
    <label htmlFor={inputId} style={{
      display: "inline-flex", alignItems: "center", gap: 10,
      cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1,
      fontFamily: "var(--font-sans)", fontSize: "var(--text-base)", color: "var(--text-body)",
    }}>
      <span style={{
        width: 22, height: 22, borderRadius: "var(--radius-xs)",
        border: `2px solid ${isChecked ? "var(--blue-600)" : "var(--border-strong)"}`,
        background: isChecked ? "var(--blue-600)" : "#fff",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        transition: "all var(--duration-fast) var(--ease-standard)", flex: "none",
      }}>
        {isChecked && (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
        )}
      </span>
      <input id={inputId} type="checkbox" checked={isChecked} disabled={disabled}
        onChange={(e) => { setInternal(e.target.checked); onChange && onChange(e); }}
        style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} {...rest} />
      {label}
    </label>
  );
}
