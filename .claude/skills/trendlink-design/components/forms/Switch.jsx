import React from "react";

/** TrendLink Switch — pill toggle, golden when on. */
export function Switch({ checked, defaultChecked, onChange, disabled, label, id, ...rest }) {
  const inputId = id || React.useId();
  const [internal, setInternal] = React.useState(defaultChecked || false);
  const on = checked !== undefined ? checked : internal;

  return (
    <label htmlFor={inputId} style={{
      display: "inline-flex", alignItems: "center", gap: 10,
      cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1,
      fontFamily: "var(--font-sans)", fontSize: "var(--text-base)", color: "var(--text-body)",
    }}>
      <span style={{
        width: 46, height: 26, borderRadius: "var(--radius-pill)", padding: 3,
        background: on ? "var(--orange-400)" : "var(--neutral-300)",
        transition: "background var(--duration-normal) var(--ease-standard)",
        display: "inline-flex", alignItems: "center", flex: "none",
      }}>
        <span style={{
          width: 20, height: 20, borderRadius: "50%", background: "#fff",
          boxShadow: "var(--shadow-sm)",
          transform: on ? "translateX(20px)" : "translateX(0)",
          transition: "transform var(--duration-normal) var(--ease-out)",
        }}/>
      </span>
      <input id={inputId} type="checkbox" checked={on} disabled={disabled}
        onChange={(e) => { setInternal(e.target.checked); onChange && onChange(e); }}
        style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} {...rest} />
      {label}
    </label>
  );
}
