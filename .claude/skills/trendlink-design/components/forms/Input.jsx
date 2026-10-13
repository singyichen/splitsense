import React from "react";

/**
 * TrendLink Input — labelled text field with optional leading icon,
 * helper text, and error state. Soft rounded, pale focus ring.
 */
export function Input({
  label,
  hint,
  error,
  iconLeft,
  size = "md",
  id,
  style,
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  const inputId = id || React.useId();
  const heights = { sm: 38, md: 46, lg: 54 };
  const h = heights[size] || heights.md;

  const wrap = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    height: h,
    padding: iconLeft ? "0 16px 0 14px" : "0 16px",
    background: "#fff",
    border: `1.5px solid ${error ? "var(--danger-500)" : focused ? "var(--blue-500)" : "var(--border-default)"}`,
    borderRadius: "var(--radius-md)",
    boxShadow: focused && !error ? "0 0 0 3px color-mix(in srgb, var(--sky-500) 22%, transparent)" : "none",
    transition: "border-color var(--duration-fast), box-shadow var(--duration-fast)",
  };
  const field = {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    fontFamily: "var(--font-sans)",
    fontSize: "var(--text-base)",
    color: "var(--text-strong)",
    minWidth: 0,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      {label && (
        <label htmlFor={inputId} style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-medium)", color: "var(--text-body)" }}>
          {label}
        </label>
      )}
      <div style={wrap}>
        {iconLeft && <span style={{ color: "var(--text-muted)", display: "flex" }}>{iconLeft}</span>}
        <input
          id={inputId}
          style={field}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
      </div>
      {(hint || error) && (
        <span style={{ fontSize: "var(--text-xs)", color: error ? "var(--danger-500)" : "var(--text-muted)" }}>
          {error || hint}
        </span>
      )}
    </div>
  );
}
