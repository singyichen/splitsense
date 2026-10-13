import React from "react";

/** TrendLink Avatar — circular initials/image badge with brand tones. */
export function Avatar({ name = "", src, size = "md", tone = "blue", style, ...rest }) {
  const sizes = { sm: 32, md: 44, lg: 56, xl: 72 };
  const dim = sizes[size] || sizes.md;
  const tones = {
    blue:   ["var(--blue-100)", "var(--blue-700)"],
    orange: ["var(--orange-100)", "var(--orange-600)"],
    navy:   ["var(--blue-700)", "#fff"],
  };
  const [bg, fg] = tones[tone] || tones.blue;
  const initials = name.trim().slice(0, 2);

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: dim, height: dim, borderRadius: "50%", overflow: "hidden",
      background: bg, color: fg, flex: "none",
      fontFamily: "var(--font-sans)", fontWeight: "var(--weight-bold)",
      fontSize: dim * 0.38, ...style,
    }} {...rest}>
      {src ? <img src={src} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initials}
    </span>
  );
}
