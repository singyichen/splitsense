import React from "react";

/**
 * TrendLink Button — the brand's primary action control.
 * Primary = signature golden pill (CTA), secondary = navy, plus
 * outline / ghost. Pill radius by default, matching the site CTAs.
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  shape = "pill",
  iconLeft,
  iconRight,
  fullWidth = false,
  disabled = false,
  onClick,
  type = "button",
  style,
  ...rest
}) {
  const sizes = {
    sm: { padding: "0 16px", height: 36, fontSize: "var(--text-sm)", gap: 6 },
    md: { padding: "0 24px", height: 46, fontSize: "var(--text-base)", gap: 8 },
    lg: { padding: "0 34px", height: 56, fontSize: "var(--text-md)", gap: 10 },
  };

  const variants = {
    primary: {
      background: "var(--action-primary)",
      color: "#fff",
      border: "2px solid transparent",
      "--hover-bg": "var(--action-primary-hover)",
      "--hover-shadow": "var(--shadow-accent)",
    },
    secondary: {
      background: "var(--action-secondary)",
      color: "#fff",
      border: "2px solid transparent",
      "--hover-bg": "var(--action-secondary-hover)",
      "--hover-shadow": "var(--shadow-brand)",
    },
    outline: {
      background: "transparent",
      color: "var(--blue-700)",
      border: "2px solid var(--blue-500)",
      "--hover-bg": "var(--blue-50)",
      "--hover-shadow": "none",
    },
    ghost: {
      background: "transparent",
      color: "var(--blue-700)",
      border: "2px solid transparent",
      "--hover-bg": "var(--blue-50)",
      "--hover-shadow": "none",
    },
  };

  const v = variants[variant] || variants.primary;
  const sz = sizes[size] || sizes.md;

  const base = {
    display: fullWidth ? "flex" : "inline-flex",
    width: fullWidth ? "100%" : "auto",
    alignItems: "center",
    justifyContent: "center",
    gap: sz.gap,
    height: sz.height,
    padding: sz.padding,
    fontFamily: "var(--font-sans)",
    fontWeight: "var(--weight-bold)",
    fontSize: sz.fontSize,
    lineHeight: 1,
    letterSpacing: "0.02em",
    borderRadius: shape === "pill" ? "var(--radius-pill)" : "var(--radius-md)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    transition: "background var(--duration-fast) var(--ease-standard), box-shadow var(--duration-normal) var(--ease-standard), transform var(--duration-fast) var(--ease-standard)",
    whiteSpace: "nowrap",
    ...v,
    ...style,
  };

  const onEnter = (e) => {
    if (disabled) return;
    e.currentTarget.style.background = v["--hover-bg"];
    if (v["--hover-shadow"] !== "none") e.currentTarget.style.boxShadow = v["--hover-shadow"];
  };
  const onLeave = (e) => {
    if (disabled) return;
    e.currentTarget.style.background = v.background;
    e.currentTarget.style.boxShadow = "none";
  };
  const onDown = (e) => { if (!disabled) e.currentTarget.style.transform = "scale(0.97)"; };
  const onUp = (e) => { if (!disabled) e.currentTarget.style.transform = "scale(1)"; };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={base}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onMouseDown={onDown}
      onMouseUp={onUp}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
}
