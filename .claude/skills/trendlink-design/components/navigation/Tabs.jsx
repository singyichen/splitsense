import React from "react";

/**
 * TrendLink Tabs — underline tab bar with a sliding golden indicator.
 * Controlled or uncontrolled. items: [{ id, label }].
 */
export function Tabs({ items = [], value, defaultValue, onChange, style }) {
  const [internal, setInternal] = React.useState(defaultValue ?? items[0]?.id);
  const active = value !== undefined ? value : internal;

  const select = (id) => { setInternal(id); onChange && onChange(id); };

  return (
    <div style={{ display: "flex", gap: 4, borderBottom: "2px solid var(--border-subtle)", ...style }}>
      {items.map((it) => {
        const on = it.id === active;
        return (
          <button key={it.id} onClick={() => select(it.id)} style={{
            position: "relative", border: "none", background: "none", cursor: "pointer",
            padding: "12px 18px", marginBottom: -2,
            fontFamily: "var(--font-sans)", fontSize: "var(--text-base)",
            fontWeight: on ? "var(--weight-bold)" : "var(--weight-medium)",
            color: on ? "var(--blue-700)" : "var(--text-muted)",
            transition: "color var(--duration-fast) var(--ease-standard)",
          }}>
            {it.label}
            <span style={{
              position: "absolute", left: 12, right: 12, bottom: 0, height: 3,
              borderRadius: "var(--radius-pill)",
              background: on ? "var(--gradient-accent)" : "transparent",
              transition: "background var(--duration-fast) var(--ease-standard)",
            }}/>
          </button>
        );
      })}
    </div>
  );
}
