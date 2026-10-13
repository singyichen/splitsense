import React from "react";

/**
 * TrendLink IconButton — a square/circular control wrapping a single icon.
 * Used for search, close, nav controls, and toolbar actions.
 */
export function IconButton({
  children,
  variant = "soft",
  size = "md",
  shape = "circle",
  label,
  disabled = false,
  onClick,
  style,
  ...rest
}) {
  const sizes = { sm: 34, md: 42, lg: 52 };
  const dim = sizes[size] || sizes.md;

  const variants = {
    solid:   { background: "var(--blue-700)", color: "#fff", border: "none", "--h": "var(--blue-800)" },
    accent:  { background: "var(--orange-400)", color: "#fff", border: "none", "--h": "var(--orange-500)" },
    soft:    { background: "var(--blue-50)", color: "var(--blue-700)", border: "none", "--h": "var(--blue-100)" },
    ghost:   { background: "transparent", color: "var(--blue-700)", border: "none", "--h": "var(--blue-50)" },
    outline: { background: "#fff", color: "var(--blue-700)", border: "1.5px solid var(--border-default)", "--h": "var(--blue-50)" },
  };
  const v = variants[variant] || variants.soft;

  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: dim,
    height: dim,
    borderRadius: shape === "circle" ? "var(--radius-circle)" : "var(--radius-md)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    transition: "background var(--duration-fast) var(--ease-standard), transform var(--duration-fast)",
    ...v,
    ...style,
  };

  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      style={base}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = v["--h"]; }}
      onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.background = v.background; }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = "scale(0.92)"; }}
      onMouseUp={(e) => { if (!disabled) e.currentTarget.style.transform = "scale(1)"; }}
      {...rest}
    >
      {children}
    </button>
  );
}
