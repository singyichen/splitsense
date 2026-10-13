/* @ds-bundle: {"format":3,"namespace":"TrendLinkDesignSystem_b2a0d6","components":[{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Avatar","sourcePath":"components/display/Avatar.jsx"},{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"CardIcon","sourcePath":"components/display/Card.jsx"},{"name":"Stat","sourcePath":"components/display/Stat.jsx"},{"name":"Tag","sourcePath":"components/display/Tag.jsx"},{"name":"Alert","sourcePath":"components/feedback/Alert.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/core/Button.jsx":"e59893ee0943","components/core/IconButton.jsx":"ddfe504ee582","components/display/Avatar.jsx":"46c21d2d989a","components/display/Badge.jsx":"780cef308c72","components/display/Card.jsx":"0e5f7fb59fa6","components/display/Stat.jsx":"14df86753fe4","components/display/Tag.jsx":"8c9d49a8bae5","components/feedback/Alert.jsx":"562079172095","components/forms/Checkbox.jsx":"4911d981e25a","components/forms/Input.jsx":"c08091e8a083","components/forms/Select.jsx":"3a0ff0bacd3c","components/forms/Switch.jsx":"8f8bd922ab76","components/navigation/Tabs.jsx":"ad8755884f07","ui_kits/countsalary/AppShell.jsx":"5d47c9227590","ui_kits/countsalary/HRViews.jsx":"0e15be4d5a1e","ui_kits/dutymate/DutyCalendar.jsx":"f2dc1718e1dd","ui_kits/dutymate/DutyKit.jsx":"ed0e1c65939f","ui_kits/dutymate/DutyPageHarness.jsx":"ee59f65614b3","ui_kits/dutymate/DutyShell.jsx":"bd5e028bf9d5","ui_kits/dutymate/DutyViewShared.jsx":"fdf013255c93","ui_kits/dutymate/views/ActivityView.jsx":"075743c8153b","ui_kits/dutymate/views/ConstraintView.jsx":"e82e5cdc8d8f","ui_kits/dutymate/views/DraftView.jsx":"8da93ac3aad4","ui_kits/dutymate/views/ExcludeView.jsx":"a530e378c3d2","ui_kits/dutymate/views/ImportView.jsx":"e504236e69b9","ui_kits/dutymate/views/OfficialView.jsx":"292d226cd9a6","ui_kits/dutymate/views/StatsView.jsx":"f651098a0431","ui_kits/dutymate/views/SwapView.jsx":"e0cfce1b9183","ui_kits/dutymate/views/UsersView.jsx":"638a878174f2","ui_kits/dutymate/views/WorkTaskView.jsx":"71d7a1ce8a79","ui_kits/website/WebChrome.jsx":"767b30af8c37","ui_kits/website/WebSections.jsx":"157bcafdb211"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.TrendLinkDesignSystem_b2a0d6 = window.TrendLinkDesignSystem_b2a0d6 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * TrendLink Button — the brand's primary action control.
 * Primary = signature golden pill (CTA), secondary = navy, plus
 * outline / ghost. Pill radius by default, matching the site CTAs.
 */
function Button({
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
    sm: {
      padding: "0 16px",
      height: 36,
      fontSize: "var(--text-sm)",
      gap: 6
    },
    md: {
      padding: "0 24px",
      height: 46,
      fontSize: "var(--text-base)",
      gap: 8
    },
    lg: {
      padding: "0 34px",
      height: 56,
      fontSize: "var(--text-md)",
      gap: 10
    }
  };
  const variants = {
    primary: {
      background: "var(--action-primary)",
      color: "#fff",
      border: "2px solid transparent",
      "--hover-bg": "var(--action-primary-hover)",
      "--hover-shadow": "var(--shadow-accent)"
    },
    secondary: {
      background: "var(--action-secondary)",
      color: "#fff",
      border: "2px solid transparent",
      "--hover-bg": "var(--action-secondary-hover)",
      "--hover-shadow": "var(--shadow-brand)"
    },
    outline: {
      background: "transparent",
      color: "var(--blue-700)",
      border: "2px solid var(--blue-500)",
      "--hover-bg": "var(--blue-50)",
      "--hover-shadow": "none"
    },
    ghost: {
      background: "transparent",
      color: "var(--blue-700)",
      border: "2px solid transparent",
      "--hover-bg": "var(--blue-50)",
      "--hover-shadow": "none"
    }
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
    ...style
  };
  const onEnter = e => {
    if (disabled) return;
    e.currentTarget.style.background = v["--hover-bg"];
    if (v["--hover-shadow"] !== "none") e.currentTarget.style.boxShadow = v["--hover-shadow"];
  };
  const onLeave = e => {
    if (disabled) return;
    e.currentTarget.style.background = v.background;
    e.currentTarget.style.boxShadow = "none";
  };
  const onDown = e => {
    if (!disabled) e.currentTarget.style.transform = "scale(0.97)";
  };
  const onUp = e => {
    if (!disabled) e.currentTarget.style.transform = "scale(1)";
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    style: base,
    onMouseEnter: onEnter,
    onMouseLeave: onLeave,
    onMouseDown: onDown,
    onMouseUp: onUp
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * TrendLink IconButton — a square/circular control wrapping a single icon.
 * Used for search, close, nav controls, and toolbar actions.
 */
function IconButton({
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
  const sizes = {
    sm: 34,
    md: 42,
    lg: 52
  };
  const dim = sizes[size] || sizes.md;
  const variants = {
    solid: {
      background: "var(--blue-700)",
      color: "#fff",
      border: "none",
      "--h": "var(--blue-800)"
    },
    accent: {
      background: "var(--orange-400)",
      color: "#fff",
      border: "none",
      "--h": "var(--orange-500)"
    },
    soft: {
      background: "var(--blue-50)",
      color: "var(--blue-700)",
      border: "none",
      "--h": "var(--blue-100)"
    },
    ghost: {
      background: "transparent",
      color: "var(--blue-700)",
      border: "none",
      "--h": "var(--blue-50)"
    },
    outline: {
      background: "#fff",
      color: "var(--blue-700)",
      border: "1.5px solid var(--border-default)",
      "--h": "var(--blue-50)"
    }
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
    ...style
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    disabled: disabled,
    onClick: onClick,
    style: base,
    onMouseEnter: e => {
      if (!disabled) e.currentTarget.style.background = v["--h"];
    },
    onMouseLeave: e => {
      if (!disabled) e.currentTarget.style.background = v.background;
    },
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.transform = "scale(0.92)";
    },
    onMouseUp: e => {
      if (!disabled) e.currentTarget.style.transform = "scale(1)";
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/display/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** TrendLink Avatar — circular initials/image badge with brand tones. */
function Avatar({
  name = "",
  src,
  size = "md",
  tone = "blue",
  style,
  ...rest
}) {
  const sizes = {
    sm: 32,
    md: 44,
    lg: 56,
    xl: 72
  };
  const dim = sizes[size] || sizes.md;
  const tones = {
    blue: ["var(--blue-100)", "var(--blue-700)"],
    orange: ["var(--orange-100)", "var(--orange-600)"],
    navy: ["var(--blue-700)", "#fff"]
  };
  const [bg, fg] = tones[tone] || tones.blue;
  const initials = name.trim().slice(0, 2);
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: dim,
      height: dim,
      borderRadius: "50%",
      overflow: "hidden",
      background: bg,
      color: fg,
      flex: "none",
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--weight-bold)",
      fontSize: dim * 0.38,
      ...style
    }
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }) : initials);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/display/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** TrendLink Badge — small status pill. Soft tonal by default. */
function Badge({
  children,
  tone = "blue",
  variant = "soft",
  style,
  ...rest
}) {
  const tones = {
    blue: {
      soft: ["var(--blue-50)", "var(--blue-700)"],
      solid: ["var(--blue-600)", "#fff"]
    },
    orange: {
      soft: ["var(--orange-50)", "var(--orange-600)"],
      solid: ["var(--orange-400)", "#fff"]
    },
    success: {
      soft: ["var(--success-50)", "var(--success-500)"],
      solid: ["var(--success-500)", "#fff"]
    },
    warning: {
      soft: ["var(--warning-50)", "var(--warning-500)"],
      solid: ["var(--warning-500)", "#fff"]
    },
    danger: {
      soft: ["var(--danger-50)", "var(--danger-500)"],
      solid: ["var(--danger-500)", "#fff"]
    },
    neutral: {
      soft: ["var(--neutral-100)", "var(--neutral-600)"],
      solid: ["var(--neutral-600)", "#fff"]
    }
  };
  const [bg, fg] = (tones[tone] || tones.blue)[variant] || (tones[tone] || tones.blue).soft;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      padding: "3px 10px",
      borderRadius: "var(--radius-pill)",
      background: bg,
      color: fg,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-xs)",
      fontWeight: "var(--weight-bold)",
      letterSpacing: "0.02em",
      lineHeight: 1.4,
      whiteSpace: "nowrap",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * TrendLink Card — the workhorse surface. Soft rounded, shallow
 * shadow that lifts on hover, optional top accent stripe and icon.
 */
function Card({
  children,
  accent,
  // false | "blue" | "orange"
  hoverable = false,
  padding = "var(--space-6)",
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const accentColor = accent === "orange" ? "var(--orange-400)" : accent === "blue" ? "var(--blue-500)" : null;
  const base = {
    background: "var(--surface-card)",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--border-subtle)",
    borderTop: accentColor ? `4px solid ${accentColor}` : "1px solid var(--border-subtle)",
    boxShadow: hover && hoverable ? "var(--shadow-md)" : "var(--shadow-sm)",
    transform: hover && hoverable ? "translateY(-3px)" : "none",
    transition: "box-shadow var(--duration-normal) var(--ease-standard), transform var(--duration-normal) var(--ease-standard)",
    padding,
    ...style
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: base,
    onMouseEnter: () => hoverable && setHover(true),
    onMouseLeave: () => hoverable && setHover(false)
  }, rest), children);
}

/** Icon medallion used at the top of feature cards. */
function CardIcon({
  children,
  tone = "blue",
  style
}) {
  const tones = {
    blue: {
      bg: "var(--blue-50)",
      fg: "var(--blue-600)"
    },
    orange: {
      bg: "var(--orange-50)",
      fg: "var(--orange-500)"
    }
  };
  const t = tones[tone] || tones.blue;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 56,
      height: 56,
      borderRadius: "var(--radius-lg)",
      background: t.bg,
      color: t.fg,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Card, CardIcon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/Stat.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * TrendLink Stat — a big number with label, for dashboards and the
 * marketing "近800家" style proof points.
 */
function Stat({
  value,
  label,
  suffix,
  tone = "blue",
  align = "left",
  style,
  ...rest
}) {
  const color = tone === "orange" ? "var(--orange-500)" : "var(--blue-700)";
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      textAlign: align,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--weight-black)",
      fontSize: "var(--text-4xl)",
      lineHeight: 1,
      color,
      display: "flex",
      alignItems: "baseline",
      gap: 2,
      justifyContent: align === "center" ? "center" : "flex-start"
    }
  }, value, suffix && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xl)",
      fontWeight: "var(--weight-bold)"
    }
  }, suffix)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontSize: "var(--text-sm)",
      color: "var(--text-muted)",
      fontWeight: "var(--weight-medium)"
    }
  }, label));
}
Object.assign(__ds_scope, { Stat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Stat.jsx", error: String((e && e.message) || e) }); }

// components/display/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** TrendLink Tag — outlined chip for categories & filters, optionally removable. */
function Tag({
  children,
  active = false,
  onRemove,
  onClick,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    onClick: onClick,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "5px 12px",
      borderRadius: "var(--radius-pill)",
      border: `1.5px solid ${active ? "var(--blue-500)" : "var(--border-default)"}`,
      background: active ? "var(--blue-50)" : "#fff",
      color: active ? "var(--blue-700)" : "var(--text-body)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-sm)",
      fontWeight: "var(--weight-medium)",
      lineHeight: 1.4,
      cursor: onClick ? "pointer" : "default",
      whiteSpace: "nowrap",
      transition: "all var(--duration-fast) var(--ease-standard)",
      ...style
    }
  }, rest), children, onRemove && /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      onRemove();
    },
    "aria-label": "remove",
    style: {
      border: "none",
      background: "none",
      cursor: "pointer",
      padding: 0,
      display: "flex",
      color: "currentColor",
      opacity: 0.6
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 6 6 18M6 6l12 12"
  }))));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Alert.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * TrendLink Alert — inline message banner with status tone, optional
 * title and leading icon. Soft tinted background + accent left edge.
 */
function Alert({
  children,
  title,
  tone = "info",
  icon,
  style,
  ...rest
}) {
  const tones = {
    info: ["var(--info-50)", "var(--info-500)", "var(--blue-800)"],
    success: ["var(--success-50)", "var(--success-500)", "#1d6b48"],
    warning: ["var(--warning-50)", "var(--warning-500)", "#8a6206"],
    danger: ["var(--danger-50)", "var(--danger-500)", "#8f2b2b"]
  };
  const [bg, edge, fg] = tones[tone] || tones.info;
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "alert",
    style: {
      display: "flex",
      gap: 12,
      padding: "14px 18px",
      background: bg,
      borderLeft: `4px solid ${edge}`,
      borderRadius: "var(--radius-md)",
      fontFamily: "var(--font-sans)",
      ...style
    }
  }, rest), icon && /*#__PURE__*/React.createElement("span", {
    style: {
      color: edge,
      flex: "none",
      display: "flex",
      marginTop: 2
    }
  }, icon), /*#__PURE__*/React.createElement("div", null, title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: "var(--weight-bold)",
      color: fg,
      fontSize: "var(--text-base)",
      marginBottom: 2
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--text-body)",
      fontSize: "var(--text-sm)",
      lineHeight: 1.7
    }
  }, children)));
}
Object.assign(__ds_scope, { Alert });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Alert.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** TrendLink Checkbox — square check with brand-blue fill when checked. */
function Checkbox({
  label,
  checked,
  defaultChecked,
  onChange,
  disabled,
  id,
  ...rest
}) {
  const inputId = id || React.useId();
  const [internal, setInternal] = React.useState(defaultChecked || false);
  const isChecked = checked !== undefined ? checked : internal;
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-base)",
      color: "var(--text-body)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 22,
      height: 22,
      borderRadius: "var(--radius-xs)",
      border: `2px solid ${isChecked ? "var(--blue-600)" : "var(--border-strong)"}`,
      background: isChecked ? "var(--blue-600)" : "#fff",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all var(--duration-fast) var(--ease-standard)",
      flex: "none"
    }
  }, isChecked && /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "3.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6 9 17l-5-5"
  }))), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    type: "checkbox",
    checked: isChecked,
    disabled: disabled,
    onChange: e => {
      setInternal(e.target.checked);
      onChange && onChange(e);
    },
    style: {
      position: "absolute",
      opacity: 0,
      width: 0,
      height: 0
    }
  }, rest)), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * TrendLink Input — labelled text field with optional leading icon,
 * helper text, and error state. Soft rounded, pale focus ring.
 */
function Input({
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
  const heights = {
    sm: 38,
    md: 46,
    lg: 54
  };
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
    transition: "border-color var(--duration-fast), box-shadow var(--duration-fast)"
  };
  const field = {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    fontFamily: "var(--font-sans)",
    fontSize: "var(--text-base)",
    color: "var(--text-strong)",
    minWidth: 0
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontSize: "var(--text-sm)",
      fontWeight: "var(--weight-medium)",
      color: "var(--text-body)"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: wrap
  }, iconLeft && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-muted)",
      display: "flex"
    }
  }, iconLeft), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    style: field,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false)
  }, rest))), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      color: error ? "var(--danger-500)" : "var(--text-muted)"
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** TrendLink Select — native dropdown styled to match Input. */
function Select({
  label,
  hint,
  error,
  size = "md",
  children,
  id,
  style,
  ...rest
}) {
  const selId = id || React.useId();
  const heights = {
    sm: 38,
    md: 46,
    lg: 54
  };
  const h = heights[size] || heights.md;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: selId,
    style: {
      fontSize: "var(--text-sm)",
      fontWeight: "var(--weight-medium)",
      color: "var(--text-body)"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex"
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: selId,
    style: {
      appearance: "none",
      WebkitAppearance: "none",
      width: "100%",
      height: h,
      padding: "0 40px 0 16px",
      background: "#fff",
      border: `1.5px solid ${error ? "var(--danger-500)" : "var(--border-default)"}`,
      borderRadius: "var(--radius-md)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-base)",
      color: "var(--text-strong)",
      cursor: "pointer",
      outline: "none"
    }
  }, rest), children), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: 14,
      top: "50%",
      transform: "translateY(-50%)",
      pointerEvents: "none",
      color: "var(--text-muted)",
      display: "flex"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6"
  })))), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      color: error ? "var(--danger-500)" : "var(--text-muted)"
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** TrendLink Switch — pill toggle, golden when on. */
function Switch({
  checked,
  defaultChecked,
  onChange,
  disabled,
  label,
  id,
  ...rest
}) {
  const inputId = id || React.useId();
  const [internal, setInternal] = React.useState(defaultChecked || false);
  const on = checked !== undefined ? checked : internal;
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-base)",
      color: "var(--text-body)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 46,
      height: 26,
      borderRadius: "var(--radius-pill)",
      padding: 3,
      background: on ? "var(--orange-400)" : "var(--neutral-300)",
      transition: "background var(--duration-normal) var(--ease-standard)",
      display: "inline-flex",
      alignItems: "center",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      height: 20,
      borderRadius: "50%",
      background: "#fff",
      boxShadow: "var(--shadow-sm)",
      transform: on ? "translateX(20px)" : "translateX(0)",
      transition: "transform var(--duration-normal) var(--ease-out)"
    }
  })), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    type: "checkbox",
    checked: on,
    disabled: disabled,
    onChange: e => {
      setInternal(e.target.checked);
      onChange && onChange(e);
    },
    style: {
      position: "absolute",
      opacity: 0,
      width: 0,
      height: 0
    }
  }, rest)), label);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
/**
 * TrendLink Tabs — underline tab bar with a sliding golden indicator.
 * Controlled or uncontrolled. items: [{ id, label }].
 */
function Tabs({
  items = [],
  value,
  defaultValue,
  onChange,
  style
}) {
  const [internal, setInternal] = React.useState(defaultValue ?? items[0]?.id);
  const active = value !== undefined ? value : internal;
  const select = id => {
    setInternal(id);
    onChange && onChange(id);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      borderBottom: "2px solid var(--border-subtle)",
      ...style
    }
  }, items.map(it => {
    const on = it.id === active;
    return /*#__PURE__*/React.createElement("button", {
      key: it.id,
      onClick: () => select(it.id),
      style: {
        position: "relative",
        border: "none",
        background: "none",
        cursor: "pointer",
        padding: "12px 18px",
        marginBottom: -2,
        fontFamily: "var(--font-sans)",
        fontSize: "var(--text-base)",
        fontWeight: on ? "var(--weight-bold)" : "var(--weight-medium)",
        color: on ? "var(--blue-700)" : "var(--text-muted)",
        transition: "color var(--duration-fast) var(--ease-standard)"
      }
    }, it.label, /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        left: 12,
        right: 12,
        bottom: 0,
        height: 3,
        borderRadius: "var(--radius-pill)",
        background: on ? "var(--gradient-accent)" : "transparent",
        transition: "background var(--duration-fast) var(--ease-standard)"
      }
    }));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/countsalary/AppShell.jsx
try { (() => {
// 一鍵發薪 app — shell (sidebar + topbar) and shared icons.
// Exposes AppIcons, AppShell on window.

const AppIcons = {
  grid: (p = {}) => /*#__PURE__*/React.createElement("svg", {
    width: p.s || 20,
    height: p.s || 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.9",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "3",
    width: "7",
    height: "7",
    rx: "1.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14",
    y: "3",
    width: "7",
    height: "7",
    rx: "1.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "14",
    width: "7",
    height: "7",
    rx: "1.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14",
    y: "14",
    width: "7",
    height: "7",
    rx: "1.5"
  })),
  clock: (p = {}) => /*#__PURE__*/React.createElement("svg", {
    width: p.s || 20,
    height: p.s || 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.9",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 7v5l3 2"
  })),
  cal: (p = {}) => /*#__PURE__*/React.createElement("svg", {
    width: p.s || 20,
    height: p.s || 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.9",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "4",
    width: "18",
    height: "18",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 2v4M8 2v4M3 10h18"
  })),
  layers: (p = {}) => /*#__PURE__*/React.createElement("svg", {
    width: p.s || 20,
    height: p.s || 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.9",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m12 2 9 5-9 5-9-5 9-5Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m3 12 9 5 9-5M3 17l9 5 9-5"
  })),
  money: (p = {}) => /*#__PURE__*/React.createElement("svg", {
    width: p.s || 20,
    height: p.s || 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.9",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "5",
    width: "20",
    height: "14",
    rx: "2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6 12h.01M18 12h.01"
  })),
  report: (p = {}) => /*#__PURE__*/React.createElement("svg", {
    width: p.s || 20,
    height: p.s || 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.9",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 3v18h18"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "7",
    y: "11",
    width: "3",
    height: "6"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "13",
    y: "7",
    width: "3",
    height: "10"
  })),
  bell: (p = {}) => /*#__PURE__*/React.createElement("svg", {
    width: p.s || 20,
    height: p.s || 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.9",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10.3 21a1.94 1.94 0 0 0 3.4 0"
  })),
  search: (p = {}) => /*#__PURE__*/React.createElement("svg", {
    width: p.s || 18,
    height: p.s || 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m21 21-4.3-4.3"
  })),
  up: (p = {}) => /*#__PURE__*/React.createElement("svg", {
    width: p.s || 16,
    height: p.s || 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m5 12 7-7 7 7M12 5v14"
  })),
  download: (p = {}) => /*#__PURE__*/React.createElement("svg", {
    width: p.s || 16,
    height: p.s || 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
  }))
};
const MENU = [["grid", "總覽 Dashboard", "dashboard"], ["clock", "出勤管理", "attendance"], ["cal", "休假管理", "timeoff"], ["layers", "排班管理", "scheduling"], ["money", "薪資計算", "payroll"], ["report", "管理報告", "report"]];
function AppShell({
  active,
  onNav,
  children
}) {
  const {
    Avatar,
    IconButton,
    Badge
  } = window.TrendLinkDesignSystem_b2a0d6;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      minHeight: 760,
      background: "var(--surface-page)",
      fontFamily: "var(--font-sans)"
    }
  }, /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 240,
      background: "#fff",
      borderRight: "1px solid var(--border-subtle)",
      display: "flex",
      flexDirection: "column",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 64,
      display: "flex",
      alignItems: "center",
      gap: 9,
      padding: "0 18px",
      borderBottom: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo/trendlink-logo.jpeg",
    alt: "",
    style: {
      width: 34,
      height: 34,
      borderRadius: 7,
      objectFit: "contain"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      lineHeight: 1.05
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 900,
      color: "var(--blue-700)"
    }
  }, "\u4E00\u9375\u767C\u85AA"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: ".14em",
      color: "var(--orange-500)"
    }
  }, "CLOUD HR"))), /*#__PURE__*/React.createElement("nav", {
    style: {
      padding: "14px 12px",
      display: "flex",
      flexDirection: "column",
      gap: 3
    }
  }, MENU.map(([ic, label, id]) => {
    const on = id === active;
    return /*#__PURE__*/React.createElement("button", {
      key: id,
      onClick: () => onNav(id),
      style: {
        display: "flex",
        alignItems: "center",
        gap: 11,
        padding: "11px 13px",
        border: "none",
        borderRadius: 10,
        cursor: "pointer",
        textAlign: "left",
        width: "100%",
        background: on ? "var(--blue-50)" : "transparent",
        color: on ? "var(--blue-700)" : "var(--text-muted)",
        fontWeight: on ? 700 : 500,
        fontSize: 14.5,
        fontFamily: "var(--font-sans)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: on ? "var(--blue-600)" : "var(--neutral-400)",
        display: "flex"
      }
    }, AppIcons[ic]()), label);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "auto",
      margin: 12,
      padding: 14,
      borderRadius: 12,
      background: "var(--gradient-header)",
      color: "#fff"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700
    }
  }, "\u9700\u8981\u9867\u554F\u5354\u52A9\uFF1F"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      opacity: .85,
      margin: "5px 0 10px",
      lineHeight: 1.6
    }
  }, "\u52DE\u52D5\u6CD5\u52D9\u5168\u65B9\u4F4D\u8AEE\u8A62"), /*#__PURE__*/React.createElement("button", {
    style: {
      width: "100%",
      height: 34,
      border: "none",
      borderRadius: 999,
      background: "var(--gradient-accent)",
      color: "#fff",
      fontWeight: 700,
      fontSize: 12.5,
      cursor: "pointer",
      fontFamily: "var(--font-sans)"
    }
  }, "\u9810\u7D04\u8AEE\u8A62"))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      height: 64,
      background: "#fff",
      borderBottom: "1px solid var(--border-subtle)",
      display: "flex",
      alignItems: "center",
      gap: 16,
      padding: "0 24px",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9,
      height: 40,
      padding: "0 14px",
      background: "var(--surface-sunken)",
      borderRadius: 999,
      width: 280,
      color: "var(--text-muted)"
    }
  }, AppIcons.search(), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5
    }
  }, "\u641C\u5C0B\u54E1\u5DE5\u3001\u5831\u8868\u2026")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto",
      display: "flex",
      alignItems: "center",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "success",
    variant: "soft"
  }, "\u6CD5\u9075\u67E5\u6838 100%"), /*#__PURE__*/React.createElement(IconButton, {
    variant: "soft",
    label: "\u901A\u77E5"
  }, AppIcons.bell()), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "\u738B",
    tone: "navy",
    size: "sm"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      lineHeight: 1.15
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      fontWeight: 700,
      color: "var(--text-strong)"
    }
  }, "\u738B\u66C9\u660E"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-muted)"
    }
  }, "\u6DB5\u66E6\u6709\u9650\u516C\u53F8"))))), /*#__PURE__*/React.createElement("main", {
    style: {
      padding: 28,
      overflow: "auto"
    }
  }, children)));
}
Object.assign(window, {
  AppIcons,
  AppShell,
  MENU
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/countsalary/AppShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/countsalary/HRViews.jsx
try { (() => {
// 一鍵發薪 app — content views. Exposes HRDashboard, HRPayroll on window.

function KPI({
  label,
  value,
  suffix,
  delta,
  tone
}) {
  const {
    Card
  } = window.TrendLinkDesignSystem_b2a0d6;
  return /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--text-muted)",
      fontWeight: 500
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 3,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 30,
      fontWeight: 900,
      color: tone === "orange" ? "var(--orange-500)" : "var(--blue-700)"
    }
  }, value), suffix && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      fontWeight: 700,
      color: "var(--text-muted)"
    }
  }, suffix)), delta && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      display: "flex",
      alignItems: "center",
      gap: 4,
      fontSize: 12.5,
      fontWeight: 700,
      color: "var(--success-500)"
    }
  }, window.AppIcons.up({
    s: 14
  }), delta));
}
function SectionHead({
  title,
  sub,
  action
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 19,
      color: "var(--text-strong)",
      margin: 0
    }
  }, title), sub && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--text-muted)",
      marginTop: 4
    }
  }, sub)), action);
}
function HRDashboard() {
  const {
    Card,
    Badge
  } = window.TrendLinkDesignSystem_b2a0d6;
  const rows = [["王曉明", "業務部", "正常", "08:58 / 18:02", "success"], ["李佩珊", "行政部", "遲到 12 分", "09:12 / 18:05", "warning"], ["陳建豪", "技術部", "正常", "08:45 / 19:30", "success"], ["林宜蓁", "業務部", "特休", "—", "neutral"], ["張家瑋", "技術部", "正常", "09:00 / 18:00", "success"]];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 24,
      color: "var(--text-strong)",
      margin: 0
    }
  }, "\u65E9\u5B89\uFF0C\u66C9\u660E \uD83D\uDC4B"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: "var(--text-muted)",
      margin: "6px 0 0"
    }
  }, "2026 \u5E74 6 \u6708 \xB7 \u672C\u6708\u4EBA\u4E8B\u7BA1\u7406\u7E3D\u89BD")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 16,
      marginBottom: 26
    }
  }, /*#__PURE__*/React.createElement(KPI, {
    label: "\u5728\u8077\u54E1\u5DE5",
    value: "42",
    suffix: "\u4EBA",
    delta: "+3 \u672C\u6708"
  }), /*#__PURE__*/React.createElement(KPI, {
    label: "\u672C\u6708\u85AA\u8CC7\u7E3D\u984D",
    value: "3.24",
    suffix: "M",
    tone: "orange",
    delta: "+5.2%"
  }), /*#__PURE__*/React.createElement(KPI, {
    label: "\u51FA\u52E4\u7570\u5E38",
    value: "2",
    suffix: "\u7B46"
  }), /*#__PURE__*/React.createElement(KPI, {
    label: "\u5F85\u7C3D\u6838\u4F11\u5047",
    value: "5",
    suffix: "\u4EF6"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.6fr 1fr",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: 0,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px 20px"
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    title: "\u4ECA\u65E5\u51FA\u52E4",
    sub: "\u5373\u6642\u6253\u5361\u72C0\u614B",
    action: /*#__PURE__*/React.createElement(Badge, {
      tone: "blue"
    }, "5 / 42 \u5DF2\u986F\u793A")
  })), /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: 13.5
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      background: "var(--surface-sunken)",
      color: "var(--text-muted)",
      textAlign: "left"
    }
  }, ["員工", "部門", "狀態", "上 / 下班"].map(h => /*#__PURE__*/React.createElement("th", {
    key: h,
    style: {
      padding: "10px 20px",
      fontWeight: 600,
      fontSize: 12.5
    }
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    style: {
      borderTop: "1px solid var(--neutral-100)"
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "12px 20px",
      fontWeight: 600,
      color: "var(--text-strong)"
    }
  }, r[0]), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "12px 20px",
      color: "var(--text-muted)"
    }
  }, r[1]), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "12px 20px"
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: r[4]
  }, r[2])), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "12px 20px",
      color: "var(--text-body)",
      fontVariantNumeric: "tabular-nums"
    }
  }, r[3])))))), /*#__PURE__*/React.createElement(Card, {
    accent: "orange",
    style: {
      padding: 22
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    title: "\u6CD5\u9075\u63D0\u9192"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, [["基本工資調漲", "2026/01 起 28,590 元，已套用", "success"], ["加班時數", "技術部 2 人接近月上限", "warning"], ["勞退提繳", "本月已自動試算完成", "success"]].map(([t, d, tn]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: "flex",
      gap: 11,
      padding: "12px 13px",
      borderRadius: 10,
      background: tn === "warning" ? "var(--warning-50)" : "var(--success-50)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: 999,
      background: tn === "warning" ? "var(--warning-500)" : "var(--success-500)",
      marginTop: 6,
      flex: "none"
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      fontWeight: 700,
      color: "var(--text-strong)"
    }
  }, t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: "var(--text-muted)",
      marginTop: 2,
      lineHeight: 1.6
    }
  }, d))))))));
}
function HRPayroll() {
  const {
    Card,
    Button,
    Badge,
    Tabs
  } = window.TrendLinkDesignSystem_b2a0d6;
  const rows = [["王曉明", "業務部", "48,000", "6,200", "2,180", "52,020"], ["李佩珊", "行政部", "38,000", "1,500", "1,710", "37,790"], ["陳建豪", "技術部", "62,000", "8,400", "2,790", "67,610"], ["林宜蓁", "業務部", "45,000", "0", "2,025", "42,975"], ["張家瑋", "技術部", "58,000", "4,100", "2,610", "59,490"], ["黃詩涵", "行政部", "40,000", "800", "1,800", "39,000"]];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 24,
      color: "var(--text-strong)",
      margin: 0
    }
  }, "\u85AA\u8CC7\u8A08\u7B97"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: "var(--text-muted)",
      margin: "6px 0 0"
    }
  }, "2026 \u5E74 6 \u6708\u85AA\u8CC7 \xB7 \u81EA\u52D5\u5E36\u5165\u51FA\u52E4\u8207\u52A0\u73ED\u8CC7\u6599")), /*#__PURE__*/React.createElement(Tabs, {
    defaultValue: "payroll",
    style: {
      marginBottom: 20
    },
    items: [{
      id: "attendance",
      label: "出勤"
    }, {
      id: "timeoff",
      label: "休假"
    }, {
      id: "scheduling",
      label: "排班"
    }, {
      id: "payroll",
      label: "薪資計算"
    }, {
      id: "report",
      label: "管理報告"
    }]
  }), /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: 0,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 20px",
      borderBottom: "1px solid var(--neutral-100)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "blue",
    variant: "soft"
  }, "42 \u540D\u54E1\u5DE5"), /*#__PURE__*/React.createElement(Badge, {
    tone: "success",
    variant: "soft"
  }, "\u5DF2\u8A66\u7B97")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    iconLeft: window.AppIcons.download({
      s: 15
    })
  }, "\u532F\u51FA\u5831\u8868"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm"
  }, "\u4E00\u9375\u767C\u85AA"))), /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: 13.5
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      background: "var(--surface-sunken)",
      color: "var(--text-muted)",
      textAlign: "right"
    }
  }, ["員工", "部門", "本薪", "加班費", "勞健保", "實發金額"].map((h, i) => /*#__PURE__*/React.createElement("th", {
    key: h,
    style: {
      padding: "11px 20px",
      fontWeight: 600,
      fontSize: 12.5,
      textAlign: i < 2 ? "left" : "right"
    }
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    style: {
      borderTop: "1px solid var(--neutral-100)"
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "12px 20px",
      fontWeight: 600,
      color: "var(--text-strong)"
    }
  }, r[0]), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "12px 20px",
      color: "var(--text-muted)"
    }
  }, r[1]), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "12px 20px",
      textAlign: "right",
      fontVariantNumeric: "tabular-nums",
      color: "var(--text-body)"
    }
  }, r[2]), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "12px 20px",
      textAlign: "right",
      fontVariantNumeric: "tabular-nums",
      color: "var(--text-body)"
    }
  }, r[3]), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "12px 20px",
      textAlign: "right",
      fontVariantNumeric: "tabular-nums",
      color: "var(--text-muted)"
    }
  }, "-", r[4]), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "12px 20px",
      textAlign: "right",
      fontVariantNumeric: "tabular-nums",
      fontWeight: 800,
      color: "var(--blue-700)"
    }
  }, r[5])))), /*#__PURE__*/React.createElement("tfoot", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      borderTop: "2px solid var(--neutral-200)",
      background: "var(--blue-50)"
    }
  }, /*#__PURE__*/React.createElement("td", {
    colSpan: "5",
    style: {
      padding: "14px 20px",
      fontWeight: 700,
      color: "var(--text-strong)"
    }
  }, "\u672C\u6708\u5BE6\u767C\u7E3D\u984D"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "14px 20px",
      textAlign: "right",
      fontWeight: 900,
      fontSize: 16,
      color: "var(--blue-700)",
      fontVariantNumeric: "tabular-nums"
    }
  }, "NT$ 298,885"))))));
}
Object.assign(window, {
  HRDashboard,
  HRPayroll,
  KPI,
  SectionHead
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/countsalary/HRViews.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dutymate/DutyCalendar.jsx
try { (() => {
// Duty Mate — reusable month calendar. Provides the grid shell + weekday header
// + optional month nav; delegates each day's body to a renderCell(ctx) prop.
// Exposes window.Duty.MonthCalendar + DayCell helpers.

const {
  WK,
  dstr,
  daysInMonth,
  isWeekend,
  MONTH_LABEL
} = window.Duty;
function MonthNav({
  year,
  month,
  onPrev,
  onNext,
  onToday,
  locked,
  right
}) {
  const {
    DutyIcons
  } = window.Duty;
  const btn = {
    width: 38,
    height: 38,
    borderRadius: 10,
    border: "1px solid var(--border-default)",
    background: "#fff",
    color: "var(--text-body)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: locked ? "not-allowed" : "pointer",
    opacity: locked ? 0.4 : 1
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: btn,
    onClick: () => !locked && onPrev(),
    "aria-label": "\u4E0A\u500B\u6708"
  }, DutyIcons.chevL(18)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 800,
      color: "var(--text-strong)",
      minWidth: 130,
      textAlign: "center"
    }
  }, MONTH_LABEL(year, month)), /*#__PURE__*/React.createElement("button", {
    style: btn,
    onClick: () => !locked && onNext(),
    "aria-label": "\u4E0B\u500B\u6708"
  }, DutyIcons.chevR(18))), onToday && /*#__PURE__*/React.createElement("button", {
    onClick: () => !locked && onToday(),
    style: {
      height: 38,
      padding: "0 14px",
      borderRadius: 10,
      border: "1px solid var(--border-default)",
      background: "#fff",
      color: "var(--text-body)",
      fontWeight: 600,
      fontSize: 13.5,
      cursor: "pointer",
      fontFamily: "var(--font-sans)",
      opacity: locked ? 0.4 : 1
    }
  }, "\u672C\u6708"), locked && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: "var(--text-muted)",
      display: "inline-flex",
      alignItems: "center",
      gap: 5
    }
  }, DutyIcons.lock(14), " \u9396\u5B9A\u7576\u524D\u6708\u4EFD"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto"
    }
  }, right));
}
function MonthCalendar({
  year,
  month,
  renderCell,
  weekStart = 0
}) {
  const total = daysInMonth(year, month);
  const firstDow = new Date(year, month, 1).getDay();
  const lead = (firstDow - weekStart + 7) % 7;
  const todayStr = (() => {
    const t = new Date();
    return dstr(t.getFullYear(), t.getMonth(), t.getDate());
  })();
  const header = Array.from({
    length: 7
  }, (_, i) => WK[(weekStart + i) % 7]);
  const cells = [];
  for (let i = 0; i < lead; i++) cells.push(/*#__PURE__*/React.createElement("div", {
    key: "p" + i,
    className: "dm-cell dm-cell-empty"
  }));
  for (let d = 1; d <= total; d++) {
    const date = new Date(year, month, d);
    const ds = dstr(year, month, d);
    const ctx = {
      date,
      dateStr: ds,
      day: d,
      isToday: ds === todayStr,
      isWeekend: isWeekend(date),
      dow: date.getDay()
    };
    cells.push(/*#__PURE__*/React.createElement(React.Fragment, {
      key: ds
    }, renderCell(ctx)));
  }
  while (cells.length % 7 !== 0) cells.push(/*#__PURE__*/React.createElement("div", {
    key: "t" + cells.length,
    className: "dm-cell dm-cell-empty"
  }));
  return /*#__PURE__*/React.createElement("div", {
    className: "dm-cal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-weekhead"
  }, header.map((w, i) => /*#__PURE__*/React.createElement("div", {
    key: w,
    className: "dm-wh",
    style: {
      color: (weekStart + i) % 7 === 0 || (weekStart + i) % 7 === 6 ? "var(--text-muted)" : "var(--text-body)"
    }
  }, w))), /*#__PURE__*/React.createElement("div", {
    className: "dm-grid"
  }, cells));
}

// A standard styled day cell shell used by most views.
function DayCell({
  ctx,
  tone = "default",
  disabled,
  onClick,
  ribbon,
  children,
  selected
}) {
  // tone: default | off | adjust | muted
  const toneStyle = {
    default: {
      background: "#fff",
      borderColor: "var(--border-subtle)"
    },
    off: {
      background: "var(--danger-50)",
      borderColor: "color-mix(in srgb, var(--danger-500) 22%, var(--border-subtle))"
    },
    adjust: {
      background: "var(--success-50)",
      borderColor: "color-mix(in srgb, var(--success-500) 26%, var(--border-subtle))"
    },
    muted: {
      background: "var(--neutral-50)",
      borderColor: "var(--border-subtle)"
    }
  }[tone];
  return /*#__PURE__*/React.createElement("div", {
    className: "dm-cell" + (onClick && !disabled ? " dm-clickable" : "") + (selected ? " dm-selected" : ""),
    onClick: () => onClick && !disabled && onClick(ctx),
    style: {
      ...toneStyle,
      cursor: onClick && !disabled ? "pointer" : "default",
      opacity: disabled ? 0.55 : 1,
      outline: ctx.isToday ? "2px solid var(--blue-500)" : "none",
      outlineOffset: -2
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-cell-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-daynum",
    style: {
      color: ctx.dow === 0 || ctx.dow === 6 ? "var(--text-muted)" : "var(--text-strong)"
    }
  }, ctx.day), ribbon), /*#__PURE__*/React.createElement("div", {
    className: "dm-cell-body"
  }, children));
}
Object.assign(window.Duty, {
  MonthCalendar,
  MonthNav,
  DayCell
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dutymate/DutyCalendar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dutymate/DutyKit.jsx
try { (() => {
// Duty Mate 值日生排班 — shared data, icons, helpers, recommendation engine.
// Exposes window.Duty namespace.

/* ----------------------------- Icons (line, ~1.9 stroke) ----------------------------- */
const ic = (paths, s = 20) => /*#__PURE__*/React.createElement("svg", {
  width: s,
  height: s,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.9",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, paths);
const DutyIcons = {
  calendar: s => ic(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "4",
    width: "18",
    height: "18",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 2v4M8 2v4M3 10h18"
  })), s),
  exclude: s => ic(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "4",
    width: "18",
    height: "18",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 2v4M8 2v4M3 10h18M9.5 14.5l5 5M14.5 14.5l-5 5"
  })), s),
  constraint: s => ic(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "3",
    width: "18",
    height: "18",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 8h8M8 12h8M8 16h5"
  })), s),
  draft: s => ic(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14 2v6h6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m11.5 13-2.5 2.5L8 18l2.5-1 2.5-2.5a1 1 0 0 0-1.5-1.5Z"
  })), s),
  official: s => ic(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "4",
    width: "18",
    height: "18",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 2v4M8 2v4M3 10h18"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m9 16 2 2 4-4"
  })), s),
  activity: s => ic(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1"
  })), s),
  users: s => ic(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "9",
    cy: "7",
    r: "4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M22 21v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11"
  })), s),
  stats: s => ic(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M3 3v18h18"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "7",
    y: "11",
    width: "3",
    height: "6"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "13",
    y: "7",
    width: "3",
    height: "10"
  })), s),
  import: s => ic(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
  })), s),
  swap: s => ic(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M16 3h5v5M21 3l-7 7M8 21H3v-5M3 21l7-7"
  })), s),
  logout: s => ic(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
  })), s),
  bell: s => ic(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10.3 21a1.94 1.94 0 0 0 3.4 0"
  })), s),
  chevL: s => ic(/*#__PURE__*/React.createElement("path", {
    d: "m15 18-6-6 6-6"
  }), s),
  chevR: s => ic(/*#__PURE__*/React.createElement("path", {
    d: "m9 18 6-6-6-6"
  }), s),
  chevDown: s => ic(/*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6"
  }), s),
  plus: s => ic(/*#__PURE__*/React.createElement("path", {
    d: "M12 5v14M5 12h14"
  }), s),
  x: s => ic(/*#__PURE__*/React.createElement("path", {
    d: "M18 6 6 18M6 6l12 12"
  }), s),
  check: s => ic(/*#__PURE__*/React.createElement("path", {
    d: "M20 6 9 17l-5-5"
  }), s),
  menu: s => ic(/*#__PURE__*/React.createElement("path", {
    d: "M4 6h16M4 12h16M4 18h16"
  }), s),
  filter: s => ic(/*#__PURE__*/React.createElement("path", {
    d: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z"
  }), s),
  spark: s => ic(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"
  })), s),
  trash: s => ic(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"
  })), s),
  edit: s => ic(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z"
  })), s),
  warn: s => ic(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 9v4M12 17h.01"
  })), s),
  note: s => ic(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M15 3v6h6M9 13h6M9 17h4"
  })), s),
  task: s => ic(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M16 4h2a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 3h6a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m9.5 13 1.8 1.8 3.7-3.8"
  })), s),
  user: s => ic(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "8",
    r: "4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 21a8 8 0 0 1 16 0"
  })), s),
  lock: s => ic(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    x: "4",
    y: "11",
    width: "16",
    height: "10",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 11V7a4 4 0 0 1 8 0v4"
  })), s),
  mail: s => ic(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "4",
    width: "20",
    height: "16",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m22 7-10 5L2 7"
  })), s)
};

/* ----------------------------- Sample data ----------------------------- */
const USERS = [{
  id: "u1",
  name: "劉亭筠",
  role: "duty",
  include: true,
  email: "tingyun.liu@trendlink.com.tw"
}, {
  id: "u2",
  name: "張耘瑄",
  role: "duty",
  include: true,
  email: "yunxuan.chang@trendlink.com.tw"
}, {
  id: "u3",
  name: "吳金燕",
  role: "admin",
  include: true,
  email: "jinyan.wu@trendlink.com.tw"
}, {
  id: "u4",
  name: "陳舒珊",
  role: "duty",
  include: true,
  email: "shushan.chen@trendlink.com.tw"
}, {
  id: "u5",
  name: "Vicky Huang",
  role: "duty",
  include: false,
  email: "vicky.huang@trendlink.com.tw"
}, {
  id: "u6",
  name: "黃喻靖",
  role: "duty",
  include: true,
  email: "yujing.huang@trendlink.com.tw"
}, {
  id: "u7",
  name: "黃宣凱",
  role: "duty",
  include: true,
  email: "xuankai.huang@trendlink.com.tw"
}];

// "current" month for the demo: 2026 年 6 月
const SEED_YEAR = 2026,
  SEED_MONTH = 5; // 0-indexed (June)

// Activities: 端午節 (停班) + 補班 (調整上班日)
const SEED_ACTIVITIES = {
  "2026-06-19": {
    type: "off",
    note: "端午節"
  },
  "2026-06-20": {
    type: "adjust",
    note: "端午節補班"
  }
};

// 排除時段（各值日生不能排的日期）
const SEED_EXCLUSIONS = {
  u1: ["2026-06-08", "2026-06-09"],
  u2: ["2026-06-15"],
  u4: ["2026-06-22", "2026-06-23"],
  u6: ["2026-06-11"],
  u7: ["2026-06-03", "2026-06-29"]
};
const SEED_TASKS = [{
  id: "t1",
  text: "上午 8:30 前開啟辦公室門窗與冷氣"
}, {
  id: "t2",
  text: "倒茶水間與影印區垃圾、更換垃圾袋"
}, {
  id: "t3",
  text: "補充茶水間紙杯與飲用水"
}, {
  id: "t4",
  text: "下班前巡檢會議室電源與門窗"
}];

/* ----------------------------- Date helpers ----------------------------- */
const WK = ["日", "一", "二", "三", "四", "五", "六"];
const pad2 = n => String(n).padStart(2, "0");
const dstr = (y, m, d) => `${y}-${pad2(m + 1)}-${pad2(d)}`;
const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
const isWeekend = date => {
  const w = date.getDay();
  return w === 0 || w === 6;
};
const MONTH_LABEL = (y, m) => `${y} 年 ${m + 1} 月`;

// schedulable: a base weekday that isn't 停班日, OR a weekend that's 調整上班日
function isSchedulable(date, dateStr, activities) {
  const a = activities[dateStr];
  if (a && a.type === "off") return false;
  if (isWeekend(date)) return !!(a && a.type === "adjust");
  return true;
}
function schedulableDays(year, month, activities) {
  const out = [];
  for (let d = 1; d <= daysInMonth(year, month); d++) {
    const date = new Date(year, month, d);
    const ds = dstr(year, month, d);
    if (isSchedulable(date, ds, activities)) out.push(ds);
  }
  return out;
}

// pool = users that are 列入排班
const schedulingPool = users => users.filter(u => u.include);
function counts(schedule, pool) {
  const c = {};
  pool.forEach(u => c[u.id] = 0);
  Object.values(schedule).forEach(uid => {
    if (c[uid] != null) c[uid]++;
  });
  return c;
}

// 推薦演算法：排除停班日、納入調整上班日、平均分配、間隔 ≥3 天、避開排除時段。
// 不覆蓋既有指派（PRD：推薦僅針對尚未排班的部分）。
function recommend(year, month, users, exclusions, activities, existing = {}) {
  const pool = schedulingPool(users);
  const days = schedulableDays(year, month, activities);
  const result = {
    ...existing
  };
  const cnt = counts(result, pool);
  const last = {};
  Object.keys(result).forEach(ds => {
    const d = parseInt(ds.slice(-2), 10);
    if (last[result[ds]] == null || d > last[result[ds]]) last[result[ds]] = d;
  });
  const open = days.filter(ds => !result[ds]);
  for (const ds of open) {
    const dnum = parseInt(ds.slice(-2), 10);
    let cand = pool.filter(u => !(exclusions[u.id] || []).includes(ds));
    const spaced = cand.filter(u => last[u.id] == null || dnum - last[u.id] >= 3);
    let use = spaced.length ? spaced : cand;
    if (!use.length) continue; // 無人可排 → 留空（發布時提醒）
    use = use.slice().sort((a, b) => cnt[a.id] - cnt[b.id] || (last[a.id] || 0) - (last[b.id] || 0));
    const pick = use[0];
    result[ds] = pick.id;
    cnt[pick.id]++;
    last[pick.id] = dnum;
  }
  return result;
}
const userById = (users, id) => users.find(u => u.id === id);
const roleLabel = r => r === "admin" ? "排班負責人" : "值日生";
window.Duty = {
  DutyIcons,
  USERS,
  SEED_YEAR,
  SEED_MONTH,
  SEED_ACTIVITIES,
  SEED_EXCLUSIONS,
  SEED_TASKS,
  WK,
  pad2,
  dstr,
  daysInMonth,
  isWeekend,
  MONTH_LABEL,
  isSchedulable,
  schedulableDays,
  schedulingPool,
  counts,
  recommend,
  userById,
  roleLabel
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dutymate/DutyKit.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dutymate/DutyPageHarness.jsx
try { (() => {
// Duty Mate — single-page harness.
// Each page in pages/*.html sets window.__DUTY_PAGE = "<id>" then renders <DutyPage>.
// The harness reuses the exact state shape + localStorage persistence as the
// integrated index.html, but routing between pages becomes real navigation
// (go("draft") → draft.html), so each page can be developed in isolation while
// still sharing one source of truth (localStorage "dutymate_v1").
// Exposes window.DutyPage + window.mountDutyPage(id).

const {
  useState,
  useEffect
} = React;
const DUTY_ALLOWED = {
  admin: ["official", "exclude", "constraint", "draft", "activity", "worktask", "users", "stats", "import", "swap"],
  duty: ["official", "exclude", "activity", "swap"]
};
const DUTY_VIEW_EXPORT = {
  official: "OfficialView",
  exclude: "ExcludeView",
  constraint: "ConstraintView",
  draft: "DraftView",
  activity: "ActivityView",
  worktask: "WorkTaskView",
  users: "UsersView",
  stats: "StatsView",
  import: "ImportView",
  swap: "SwapView"
};
const dutySeed = () => {
  const D = window.Duty;
  return {
    users: D.USERS,
    activities: D.SEED_ACTIVITIES,
    exclusions: D.SEED_EXCLUSIONS,
    draft: {},
    official: {},
    publishedMonths: [],
    taskList: D.SEED_TASKS,
    year: D.SEED_YEAR,
    month: D.SEED_MONTH
  };
};
const dutyLoadState = () => {
  try {
    return JSON.parse(localStorage.getItem("dutymate_v1"));
  } catch (e) {
    return null;
  }
};
const dutyLoadAccount = () => {
  try {
    return JSON.parse(localStorage.getItem("dutymate_account"));
  } catch (e) {
    return null;
  }
};
function DutyPage({
  page
}) {
  const Duty = window.Duty;
  const [account, setAccount] = useState(dutyLoadAccount);
  const [viewRole, setViewRole] = useState(() => localStorage.getItem("dutymate_role") || "admin");
  const [state, setState] = useState(() => {
    const s = dutyLoadState();
    return s ? {
      ...dutySeed(),
      ...s
    } : dutySeed();
  });
  const [toast, setToast] = useState(null);
  window.__dmActivities = state.activities;
  useEffect(() => {
    try {
      localStorage.setItem("dutymate_v1", JSON.stringify(state));
    } catch (e) {}
  }, [state]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);
  const set = patch => setState(s => ({
    ...s,
    ...patch
  }));
  const showToast = msg => setToast({
    msg,
    id: Date.now()
  });
  const go = pg => {
    if (pg !== page) window.location.href = pg + ".html";
  };
  if (!account) {
    return /*#__PURE__*/React.createElement(Duty.Login, {
      onLogin: u => {
        const role = u.role === "admin" ? "admin" : "duty";
        localStorage.setItem("dutymate_account", JSON.stringify(u));
        localStorage.setItem("dutymate_role", role);
        if (DUTY_ALLOWED[role].includes(page)) {
          setAccount(u);
          setViewRole(role);
        } else window.location.href = "official.html";
      }
    });
  }

  // Role can't access this page → bounce to home.
  if (!DUTY_ALLOWED[viewRole].includes(page)) {
    window.location.replace("official.html");
    return null;
  }
  const onNav = id => {
    if (id === "__logout") {
      localStorage.removeItem("dutymate_account");
      setAccount(null);
      return;
    }
    if (id !== page) window.location.href = id + ".html";
  };
  const onRole = r => {
    localStorage.setItem("dutymate_role", r);
    setViewRole(r);
    if (!DUTY_ALLOWED[r].includes(page)) window.location.href = "official.html";
  };
  const View = Duty[DUTY_VIEW_EXPORT[page]] || Duty.OfficialView;
  const props = {
    state,
    set,
    viewRole,
    account,
    toast: showToast,
    go
  };
  return /*#__PURE__*/React.createElement(Duty.AppShell, {
    account: account,
    viewRole: viewRole,
    onRole: onRole,
    page: page,
    onNav: onNav
  }, /*#__PURE__*/React.createElement(View, props), toast && /*#__PURE__*/React.createElement("div", {
    className: "dm-toast",
    key: toast.id
  }, Duty.DutyIcons.check(16), toast.msg));
}
function mountDutyPage(id) {
  ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(DutyPage, {
    page: id
  }));
}
Object.assign(window, {
  DutyPage,
  mountDutyPage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dutymate/DutyPageHarness.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dutymate/DutyShell.jsx
try { (() => {
// Duty Mate — Login screen + App shell (sidebar, topbar, role switch) + shared atoms.
// Exposes window.Duty.Login, AppShell, and atoms.

const D = window.Duty;

/* ----------------------------- Shared atoms ----------------------------- */
function NameChip({
  name,
  tone = "blue",
  absent,
  onRemove,
  small
}) {
  const tones = {
    blue: ["var(--blue-50)", "var(--blue-700)", "color-mix(in srgb,var(--blue-500) 30%, transparent)"],
    gold: ["var(--orange-50)", "var(--orange-600)", "color-mix(in srgb,var(--orange-400) 36%, transparent)"],
    me: ["var(--blue-600)", "#fff", "var(--blue-600)"]
  };
  const [bg, fg, bd] = tones[tone] || tones.blue;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      maxWidth: "100%",
      padding: small ? "2px 7px" : "3px 9px",
      borderRadius: 999,
      background: bg,
      color: fg,
      border: `1px solid ${bd}`,
      fontSize: small ? 11.5 : 12.5,
      fontWeight: 700,
      textDecoration: absent ? "line-through" : "none",
      opacity: absent ? 0.7 : 1,
      whiteSpace: "nowrap"
    }
  }, name, onRemove && /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      onRemove();
    },
    "aria-label": "\u79FB\u9664",
    style: {
      border: "none",
      background: "none",
      padding: 0,
      display: "flex",
      cursor: "pointer",
      color: "currentColor",
      opacity: 0.7
    }
  }, D.DutyIcons.x(12)));
}
function ActivityRibbon({
  type
}) {
  if (!type) return null;
  const map = {
    off: ["var(--danger-500)", "停班"],
    adjust: ["var(--success-500)", "補班"]
  }[type];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10.5,
      fontWeight: 800,
      color: "#fff",
      background: map[0],
      borderRadius: 5,
      padding: "1px 6px",
      letterSpacing: ".03em",
      lineHeight: 1.5
    }
  }, map[1]);
}
function PageHeader({
  icon,
  title,
  desc,
  actions
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 16,
      marginBottom: 22,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 44,
      height: 44,
      borderRadius: 12,
      background: "var(--blue-50)",
      color: "var(--blue-600)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none"
    }
  }, icon), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 22,
      color: "var(--text-strong)",
      margin: 0,
      lineHeight: 1.2
    }
  }, title), desc && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13.5,
      color: "var(--text-muted)",
      margin: "5px 0 0",
      lineHeight: 1.5
    }
  }, desc))), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto",
      display: "flex",
      gap: 10,
      alignItems: "center",
      flexWrap: "wrap"
    }
  }, actions));
}
function Legend({
  items
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 16,
      flexWrap: "wrap",
      alignItems: "center"
    }
  }, items.map(([color, label]) => /*#__PURE__*/React.createElement("span", {
    key: label,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontSize: 12.5,
      color: "var(--text-muted)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 12,
      height: 12,
      borderRadius: 4,
      background: color,
      flex: "none"
    }
  }), label)));
}

/* ----------------------------- Person stat panel ----------------------------- */
function StatPanel({
  users,
  schedule,
  year,
  month,
  title = "人員排班統計",
  highlightId,
  onPick
}) {
  const pool = D.schedulingPool(users);
  const days = D.schedulableDays(year, month, window.__dmActivities || {});
  const avg = pool.length ? days.length / pool.length : 0;
  const cnt = D.counts(schedule, pool);
  return /*#__PURE__*/React.createElement("div", {
    className: "dm-card",
    style: {
      padding: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15,
      color: "var(--text-strong)",
      margin: 0
    }
  }, title), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "var(--text-muted)"
    }
  }, "\u61C9\u6392 ", days.length, " \u5929")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: "var(--text-muted)",
      marginBottom: 14
    }
  }, "\u5E73\u5747\u6B21\u6578 ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: "var(--orange-600)"
    }
  }, avg.toFixed(1)), " \u6B21 / \u4EBA"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 11
    }
  }, pool.map(u => {
    const c = cnt[u.id];
    const reached = avg > 0 ? c >= Math.round(avg) : c > 0;
    const pct = avg > 0 ? Math.min(100, c / avg * 100) : c > 0 ? 100 : 0;
    const on = highlightId === u.id;
    return /*#__PURE__*/React.createElement("div", {
      key: u.id,
      onClick: () => onPick && onPick(u.id),
      style: {
        cursor: onPick ? "pointer" : "default",
        opacity: highlightId && !on ? 0.5 : 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 5
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: on ? 800 : 600,
        color: on ? "var(--blue-700)" : "var(--text-body)"
      }
    }, u.name), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12.5,
        fontWeight: 700,
        color: reached ? "var(--success-500)" : "var(--orange-600)",
        fontVariantNumeric: "tabular-nums"
      }
    }, c, " ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--text-muted)",
        fontWeight: 500
      }
    }, "/ ", avg.toFixed(1)))), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 7,
        borderRadius: 999,
        background: "var(--neutral-100)",
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: `${pct}%`,
        height: "100%",
        borderRadius: 999,
        background: reached ? "var(--blue-500)" : "var(--gradient-accent)",
        transition: "width .35s var(--ease-out)"
      }
    })));
  })));
}

/* ----------------------------- Login ----------------------------- */
function Login({
  onLogin
}) {
  const [email, setEmail] = React.useState("jinyan.wu@trendlink.com.tw");
  const [pw, setPw] = React.useState("dutymate2026");
  const [err, setErr] = React.useState("");
  const {
    Input,
    Button
  } = window.TrendLinkDesignSystem_b2a0d6;
  const submit = e => {
    e.preventDefault();
    const u = D.USERS.find(x => x.email === email.trim().toLowerCase());
    if (!u || pw.length < 8) {
      setErr("帳號不存在或密碼錯誤");
      return;
    }
    onLogin(u);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "dm-login"
  }, /*#__PURE__*/React.createElement("form", {
    className: "dm-login-card",
    onSubmit: submit
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-brand",
    style: {
      marginBottom: 26
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-logo-mark"
  }, "\u503C"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "dm-wordmark"
  }, "Duty Mate"), /*#__PURE__*/React.createElement("div", {
    className: "dm-wordmark-sub"
  }, "\u503C\u65E5\u751F\u6392\u73ED \xB7 \u806F\u548C\u8DA8\u52D5"))), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 22,
      color: "var(--text-strong)",
      margin: "0 0 6px"
    }
  }, "\u6B61\u8FCE\u56DE\u4F86"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13.5,
      color: "var(--text-muted)",
      margin: "0 0 24px"
    }
  }, "\u8ACB\u4F7F\u7528\u516C\u53F8\u90F5\u7BB1\u767B\u5165\u6392\u73ED\u7CFB\u7D71"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "\u516C\u53F8\u90F5\u7BB1",
    type: "email",
    value: email,
    iconLeft: D.DutyIcons.mail(18),
    onChange: e => {
      setEmail(e.target.value);
      setErr("");
    },
    placeholder: "you@trendlink.com.tw"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "\u5BC6\u78BC",
    type: "password",
    value: pw,
    iconLeft: D.DutyIcons.lock(18),
    onChange: e => {
      setPw(e.target.value);
      setErr("");
    },
    placeholder: "\u81F3\u5C11 8 \u78BC\uFF0C\u542B\u5B57\u6BCD\u8207\u6578\u5B57",
    error: err || undefined
  })), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    variant: "primary",
    fullWidth: true,
    size: "lg",
    style: {
      marginTop: 24
    }
  }, "\u767B\u5165\u7CFB\u7D71"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      fontSize: 12,
      color: "var(--text-muted)",
      textAlign: "center",
      lineHeight: 1.7
    }
  }, "\u793A\u7BC4\u5E33\u865F\u5DF2\u9810\u586B\uFF08\u6392\u73ED\u8CA0\u8CAC\u4EBA \xB7 \u5433\u91D1\u71D5\uFF09", /*#__PURE__*/React.createElement("br", null), "\u5E33\u865F\u7531\u7BA1\u7406\u54E1\u5EFA\u7ACB\uFF0C\u5FD8\u8A18\u5BC6\u78BC\u8ACB\u6D3D\u904B\u7DAD\u4EBA\u54E1")), /*#__PURE__*/React.createElement("div", {
    className: "dm-login-aside"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 360
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "tl-eyebrow",
    style: {
      color: "var(--orange-300)"
    }
  }, "INTERNAL TOOL"), /*#__PURE__*/React.createElement("h2", {
    style: {
      color: "#fff",
      fontSize: 34,
      margin: "16px 0 14px",
      lineHeight: 1.3
    }
  }, "\u96C6\u773E\u4EBA\u4E4B\u529B", /*#__PURE__*/React.createElement("br", null), "\u628A\u6392\u73ED\u4EA4\u7D66\u7CFB\u7D71"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "rgba(255,255,255,.82)",
      fontSize: 15,
      lineHeight: 1.9
    }
  }, "\u503C\u65E5\u751F\u81EA\u52A9\u586B\u5BEB\u4E0D\u80FD\u6392\u7684\u6642\u9593\uFF0C\u7CFB\u7D71\u4E00\u9375\u7522\u751F\u5E73\u5747\u3001\u7121\u885D\u7A81\u7684\u63A8\u85A6\u73ED\u8868\uFF0C\u8CA0\u8CAC\u4EBA\u5FAE\u8ABF\u5F8C\u5373\u53EF\u767C\u5E03\u2014\u2014\u628A\u7E41\u7463\u7684\u5354\u8ABF\u5F9E\u4E00\u500B\u4EBA\u8EAB\u4E0A\u89E3\u653E\u51FA\u4F86\u3002"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 26,
      marginTop: 30
    }
  }, [["7", "位成員"], ["1鍵", "產生推薦"], ["≥3天", "排班間隔"]].map(([v, l]) => /*#__PURE__*/React.createElement("div", {
    key: l
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#fff",
      fontSize: 26,
      fontWeight: 900
    }
  }, v), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "rgba(255,255,255,.7)",
      fontSize: 12.5,
      marginTop: 3
    }
  }, l)))))));
}

/* ----------------------------- App shell ----------------------------- */
const NAV = [{
  sect: "排班作業"
}, {
  id: "official",
  label: "正式班表",
  icon: "official",
  roles: ["admin", "duty"]
}, {
  id: "exclude",
  label: "排除時段",
  icon: "exclude",
  roles: ["admin", "duty"]
}, {
  id: "constraint",
  label: "排班限制表",
  icon: "constraint",
  roles: ["admin"]
}, {
  id: "draft",
  label: "草稿班表",
  icon: "draft",
  roles: ["admin"]
}, {
  sect: "設定與管理"
}, {
  id: "activity",
  label: "活動設定",
  icon: "activity",
  roles: ["admin", "duty"]
}, {
  id: "worktask",
  label: "工作任務設定",
  icon: "task",
  roles: ["admin"]
}, {
  id: "users",
  label: "用戶管理",
  icon: "users",
  roles: ["admin"]
}, {
  id: "stats",
  label: "出勤統計",
  icon: "stats",
  roles: ["admin"]
}, {
  id: "import",
  label: "過往班表匯入",
  icon: "import",
  roles: ["admin"]
}, {
  id: "swap",
  label: "申請換班",
  icon: "swap",
  roles: ["admin", "duty"],
  soon: true
}];
function AppShell({
  account,
  viewRole,
  onRole,
  page,
  onNav,
  children
}) {
  const [openMobile, setOpenMobile] = React.useState(false);
  const items = NAV.filter(n => n.sect || n.roles.includes(viewRole));
  const current = NAV.find(n => n.id === page);
  const navList = /*#__PURE__*/React.createElement("nav", {
    className: "dm-nav"
  }, items.map((n, i) => n.sect ? /*#__PURE__*/React.createElement("div", {
    key: "s" + i,
    className: "dm-nav-sect"
  }, n.sect) : /*#__PURE__*/React.createElement("button", {
    key: n.id,
    className: "dm-nav-item" + (page === n.id ? " active" : ""),
    onClick: () => {
      onNav(n.id);
      setOpenMobile(false);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-nav-ic"
  }, D.DutyIcons[n.icon](19)), /*#__PURE__*/React.createElement("span", null, n.label), n.soon && /*#__PURE__*/React.createElement("span", {
    className: "dm-soon"
  }, "\u5373\u5C07\u63A8\u51FA"))));
  return /*#__PURE__*/React.createElement("div", {
    className: "dm-app"
  }, /*#__PURE__*/React.createElement("aside", {
    className: "dm-sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-brand dm-sidebar-brand"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-logo-mark"
  }, "\u503C"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "dm-wordmark"
  }, "Duty Mate"), /*#__PURE__*/React.createElement("div", {
    className: "dm-wordmark-sub"
  }, "\u503C\u65E5\u751F\u6392\u73ED"))), navList, /*#__PURE__*/React.createElement("div", {
    className: "dm-sidebar-foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-help"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      fontWeight: 700,
      color: "var(--text-strong)"
    }
  }, "\u6BCF\u6708\u6392\u73ED\u9031\u671F"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: "var(--text-muted)",
      marginTop: 4,
      lineHeight: 1.6
    }
  }, "\u586B\u5BEB\u6392\u9664 \u2192 \u7522\u751F\u63A8\u85A6 \u2192 \u5FAE\u8ABF \u2192 \u767C\u5E03 \u2192 \u7D71\u8A08")))), openMobile && /*#__PURE__*/React.createElement("div", {
    className: "dm-scrim",
    onClick: () => setOpenMobile(false)
  }), /*#__PURE__*/React.createElement("aside", {
    className: "dm-sidebar dm-sidebar-mobile" + (openMobile ? " open" : "")
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-brand dm-sidebar-brand"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-logo-mark"
  }, "\u503C"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "dm-wordmark"
  }, "Duty Mate"), /*#__PURE__*/React.createElement("div", {
    className: "dm-wordmark-sub"
  }, "\u503C\u65E5\u751F\u6392\u73ED")), /*#__PURE__*/React.createElement("button", {
    className: "dm-iconbtn",
    style: {
      marginLeft: "auto"
    },
    onClick: () => setOpenMobile(false)
  }, D.DutyIcons.x(18))), navList), /*#__PURE__*/React.createElement("div", {
    className: "dm-main"
  }, /*#__PURE__*/React.createElement("header", {
    className: "dm-topbar"
  }, /*#__PURE__*/React.createElement("button", {
    className: "dm-iconbtn dm-only-mobile",
    onClick: () => setOpenMobile(true),
    "aria-label": "\u9078\u55AE"
  }, D.DutyIcons.menu(20)), /*#__PURE__*/React.createElement("div", {
    className: "dm-topbar-title"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-only-desktop",
    style: {
      color: "var(--blue-600)"
    }
  }, current && D.DutyIcons[current.icon](18)), /*#__PURE__*/React.createElement("span", null, current ? current.label : "Duty Mate")), /*#__PURE__*/React.createElement("div", {
    className: "dm-topbar-right"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-roleswitch",
    role: "tablist",
    "aria-label": "\u8996\u89D2\u5207\u63DB"
  }, /*#__PURE__*/React.createElement("button", {
    className: viewRole === "admin" ? "on" : "",
    onClick: () => onRole("admin")
  }, "\u8CA0\u8CAC\u4EBA"), /*#__PURE__*/React.createElement("button", {
    className: viewRole === "duty" ? "on" : "",
    onClick: () => onRole("duty")
  }, "\u503C\u65E5\u751F\u9810\u89BD")), /*#__PURE__*/React.createElement("button", {
    className: "dm-iconbtn dm-only-desktop",
    "aria-label": "\u901A\u77E5"
  }, D.DutyIcons.bell(19)), /*#__PURE__*/React.createElement("div", {
    className: "dm-user"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-avatar"
  }, viewRole === "duty" ? "劉" : account.name[0]), /*#__PURE__*/React.createElement("div", {
    className: "dm-only-desktop",
    style: {
      lineHeight: 1.15
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: "var(--text-strong)"
    }
  }, viewRole === "duty" ? "劉亭筠" : account.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-muted)"
    }
  }, D.roleLabel(viewRole)))), /*#__PURE__*/React.createElement("button", {
    className: "dm-iconbtn",
    "aria-label": "\u767B\u51FA",
    onClick: () => onNav("__logout")
  }, D.DutyIcons.logout(19)))), viewRole === "duty" && /*#__PURE__*/React.createElement("div", {
    className: "dm-previewbar"
  }, D.DutyIcons.user(15), " \u503C\u65E5\u751F\u8996\u89D2\u9810\u89BD \u2014 \u50C5\u986F\u793A\u503C\u65E5\u751F\u53EF\u4F7F\u7528\u7684\u529F\u80FD\u8207\u81EA\u5DF1\u7684\u8CC7\u6599\u3002", /*#__PURE__*/React.createElement("button", {
    onClick: () => onRole("admin")
  }, "\u56DE\u5230\u8CA0\u8CAC\u4EBA\u8996\u89D2")), /*#__PURE__*/React.createElement("main", {
    className: "dm-content"
  }, children)));
}
Object.assign(window.Duty, {
  Login,
  AppShell,
  NameChip,
  ActivityRibbon,
  PageHeader,
  Legend,
  StatPanel
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dutymate/DutyShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dutymate/DutyViewShared.jsx
try { (() => {
// Duty Mate — shared view helpers used across pages.
// fmtDate + AssignDialog were previously local to DutyViewsA; lifted here so any
// single page (正式班表 / 草稿班表 / 活動設定…) can load them independently.
// Exposes window.Duty.fmtDate + window.Duty.AssignDialog.

const D = window.Duty;
const fmtDate = ds => {
  const [y, m, d] = ds.split("-").map(Number);
  return `${m} 月 ${d} 日（週${D.WK[new Date(y, m - 1, d).getDay()]}）`;
};

/* ---------- Assign dialog (shared by 草稿班表 + 正式班表編輯) ---------- */
function AssignDialog({
  dateStr,
  users,
  exclusions,
  assignedId,
  onAssign,
  onClear,
  onClose
}) {
  if (!dateStr) return null;
  const pool = D.schedulingPool(users);
  return /*#__PURE__*/React.createElement("div", {
    className: "dm-modal-scrim",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-modal",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-modal-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: "var(--text-muted)"
    }
  }, "\u6307\u6D3E\u503C\u65E5\u751F"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      fontWeight: 800,
      color: "var(--text-strong)"
    }
  }, fmtDate(dateStr))), /*#__PURE__*/React.createElement("button", {
    className: "dm-iconbtn",
    onClick: onClose
  }, D.DutyIcons.x(18))), /*#__PURE__*/React.createElement("div", {
    className: "dm-modal-body"
  }, pool.map(u => {
    const excluded = (exclusions[u.id] || []).includes(dateStr);
    const on = assignedId === u.id;
    return /*#__PURE__*/React.createElement("button", {
      key: u.id,
      disabled: excluded,
      className: "dm-pick" + (on ? " on" : ""),
      onClick: () => onAssign(u.id)
    }, /*#__PURE__*/React.createElement("span", {
      className: "dm-avatar sm"
    }, u.name[0]), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 600
      }
    }, u.name), excluded && /*#__PURE__*/React.createElement("span", {
      className: "dm-pick-tag"
    }, "\u5DF2\u6392\u9664"), on && /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: "auto",
        color: "var(--success-500)"
      }
    }, D.DutyIcons.check(18)));
  })), /*#__PURE__*/React.createElement("div", {
    className: "dm-modal-foot"
  }, assignedId ? /*#__PURE__*/React.createElement("button", {
    className: "dm-btn-text danger",
    onClick: onClear
  }, D.DutyIcons.trash(15), " \u6E05\u9664\u6307\u6D3E") : /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "var(--text-muted)"
    }
  }, "\u540C\u4E00\u5929\u50C5\u80FD\u6307\u6D3E\u4E00\u4F4D\u503C\u65E5\u751F"), /*#__PURE__*/React.createElement("button", {
    className: "dm-btn-text",
    onClick: onClose
  }, "\u53D6\u6D88"))));
}
Object.assign(window.Duty, {
  fmtDate,
  AssignDialog
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dutymate/DutyViewShared.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dutymate/views/ActivityView.jsx
try { (() => {
// Duty Mate — 活動設定（單一頁面元件）
// 依賴：DutyKit / DutyCalendar / DutyShell / DutyViewShared 先載入。Exposes window.Duty.ActivityView.
const D = window.Duty;
function ActivityView(p) {
  const {
    state,
    set,
    viewRole
  } = p;
  const {
    Button
  } = window.TrendLinkDesignSystem_b2a0d6;
  const isAdmin = viewRole === "admin";
  const [edit, setEdit] = React.useState(false);
  const [dlg, setDlg] = React.useState(null);
  const [type, setType] = React.useState("off");
  const [note, setNote] = React.useState("");
  const open = ds => {
    const a = state.activities[ds];
    setType(a ? a.type : "off");
    setNote(a ? a.note : "");
    setDlg(ds);
  };
  const save = () => {
    set({
      activities: {
        ...state.activities,
        [dlg]: {
          type,
          note: note || (type === "off" ? "停班日" : "調整上班日")
        }
      }
    });
    setDlg(null);
    p.toast("已儲存活動設定");
  };
  const remove = () => {
    const n = {
      ...state.activities
    };
    delete n[dlg];
    set({
      activities: n
    });
    setDlg(null);
    p.toast("已刪除活動");
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(D.PageHeader, {
    icon: D.DutyIcons.activity(22),
    title: "\u6D3B\u52D5\u8A2D\u5B9A",
    desc: "\u8A2D\u5B9A\u505C\u73ED\u65E5\uFF08\u570B\u5B9A\u5047\u65E5\u3001\u98B1\u98A8\u5730\u9707\u7B49\uFF09\u8207\u8ABF\u6574\u4E0A\u73ED\u65E5\uFF08\u88DC\u73ED\uFF09\u3002\u505C\u73ED\u65E5\u4E0D\u6392\u503C\u65E5\u751F\uFF0C\u88DC\u73ED\u65E5\u53EF\u6392\u3002",
    actions: isAdmin && /*#__PURE__*/React.createElement(Button, {
      variant: edit ? "secondary" : "outline",
      size: "sm",
      iconLeft: D.DutyIcons.edit(15),
      onClick: () => setEdit(!edit)
    }, edit ? "完成編輯" : "編輯活動")
  }), /*#__PURE__*/React.createElement("div", {
    className: "dm-card",
    style: {
      padding: 18
    }
  }, /*#__PURE__*/React.createElement(D.MonthNav, {
    year: state.year,
    month: state.month,
    onPrev: () => set({
      month: state.month === 0 ? 11 : state.month - 1,
      year: state.month === 0 ? state.year - 1 : state.year
    }),
    onNext: () => set({
      month: state.month === 11 ? 0 : state.month + 1,
      year: state.month === 11 ? state.year + 1 : state.year
    }),
    onToday: () => set({
      year: D.SEED_YEAR,
      month: D.SEED_MONTH
    }),
    right: edit && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12.5,
        color: "var(--blue-600)"
      }
    }, "\u9EDE\u9078\u65E5\u671F\u4EE5\u8A2D\u5B9A\u6D3B\u52D5")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 16
    }
  }), /*#__PURE__*/React.createElement(D.MonthCalendar, {
    year: state.year,
    month: state.month,
    renderCell: ctx => {
      const a = state.activities[ctx.dateStr];
      return /*#__PURE__*/React.createElement(D.DayCell, {
        ctx: ctx,
        tone: a ? a.type === "off" ? "off" : "adjust" : ctx.isWeekend ? "muted" : "default",
        onClick: isAdmin && edit ? () => open(ctx.dateStr) : undefined,
        ribbon: a && /*#__PURE__*/React.createElement(D.ActivityRibbon, {
          type: a.type
        })
      }, a ? /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 11.5,
          fontWeight: 700,
          color: a.type === "off" ? "var(--danger-500)" : "var(--success-500)"
        }
      }, a.note) : isAdmin && edit ? /*#__PURE__*/React.createElement("span", {
        className: "dm-addslot subtle"
      }, D.DutyIcons.plus(14)) : null);
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement(D.Legend, {
    items: [["var(--danger-50)", "停班日 (不可排)"], ["var(--success-50)", "調整上班日 (可排)"], ["var(--neutral-100)", "週末"]]
  }))), dlg && /*#__PURE__*/React.createElement("div", {
    className: "dm-modal-scrim",
    onClick: () => setDlg(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-modal sm",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-modal-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: "var(--text-muted)"
    }
  }, "\u8A2D\u5B9A\u6D3B\u52D5"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      fontWeight: 800,
      color: "var(--text-strong)"
    }
  }, D.fmtDate(dlg))), /*#__PURE__*/React.createElement("button", {
    className: "dm-iconbtn",
    onClick: () => setDlg(null)
  }, D.DutyIcons.x(18))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "4px 22px 18px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      fontWeight: 600,
      color: "var(--text-body)",
      margin: "8px 0"
    }
  }, "\u6D3B\u52D5\u985E\u578B"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10
    }
  }, [["off", "停班日", "var(--danger-500)"], ["adjust", "調整上班日", "var(--success-500)"]].map(([v, l, c]) => /*#__PURE__*/React.createElement("button", {
    key: v,
    onClick: () => setType(v),
    className: "dm-typebtn",
    style: {
      borderColor: type === v ? c : "var(--border-default)",
      background: type === v ? `color-mix(in srgb, ${c} 10%, #fff)` : "#fff",
      color: type === v ? c : "var(--text-body)",
      fontWeight: type === v ? 700 : 500
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      fontWeight: 600,
      color: "var(--text-body)",
      margin: "16px 0 6px"
    }
  }, "\u6D3B\u52D5\u8A3B\u8A18"), /*#__PURE__*/React.createElement("input", {
    className: "dm-input",
    value: note,
    onChange: e => setNote(e.target.value),
    placeholder: type === "off" ? "例：端午節、颱風停班" : "例：端午節補班"
  })), /*#__PURE__*/React.createElement("div", {
    className: "dm-modal-foot"
  }, state.activities[dlg] ? /*#__PURE__*/React.createElement("button", {
    className: "dm-btn-text danger",
    onClick: remove
  }, D.DutyIcons.trash(15), " \u522A\u9664") : /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "dm-btn-text",
    onClick: () => setDlg(null)
  }, "\u53D6\u6D88"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    onClick: save
  }, "\u5132\u5B58"))))));
}
Object.assign(window.Duty, {
  ActivityView
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dutymate/views/ActivityView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dutymate/views/ConstraintView.jsx
try { (() => {
// Duty Mate — 排班限制表（單一頁面元件）
// 依賴：DutyKit / DutyCalendar / DutyShell / DutyViewShared 先載入。Exposes window.Duty.ConstraintView.
const D = window.Duty;
function ConstraintView(p) {
  const {
    state,
    set
  } = p;
  const today = new Date();
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(D.PageHeader, {
    icon: D.DutyIcons.constraint(22),
    title: "\u6392\u73ED\u9650\u5236\u8868",
    desc: "\u5F59\u6574\u6240\u6709\u503C\u65E5\u751F\u586B\u5BEB\u7684\u6392\u9664\u6642\u6BB5\uFF0C\u65BC\u6BCF\u500B\u53EF\u6392\u73ED\u65E5\u5217\u51FA\u7576\u5929\u300C\u4E0D\u80FD\u6392\u300D\u7684\u4EBA\u54E1\uFF0C\u4F5C\u70BA\u6392\u73ED\u53C3\u8003\u3002"
  }), /*#__PURE__*/React.createElement("div", {
    className: "dm-card",
    style: {
      padding: 18
    }
  }, /*#__PURE__*/React.createElement(D.MonthNav, {
    year: state.year,
    month: state.month,
    onPrev: () => set({
      month: state.month === 0 ? 11 : state.month - 1,
      year: state.month === 0 ? state.year - 1 : state.year
    }),
    onNext: () => set({
      month: state.month === 11 ? 0 : state.month + 1,
      year: state.month === 11 ? state.year + 1 : state.year
    }),
    onToday: () => set({
      year: D.SEED_YEAR,
      month: D.SEED_MONTH
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 16
    }
  }), /*#__PURE__*/React.createElement(D.MonthCalendar, {
    year: state.year,
    month: state.month,
    renderCell: ctx => {
      const a = state.activities[ctx.dateStr];
      const schedulable = D.isSchedulable(ctx.date, ctx.dateStr, state.activities);
      const off = a && a.type === "off";
      const blocked = D.schedulingPool(state.users).filter(u => (state.exclusions[u.id] || []).includes(ctx.dateStr));
      return /*#__PURE__*/React.createElement(D.DayCell, {
        ctx: ctx,
        tone: off ? "off" : a && a.type === "adjust" ? "adjust" : !schedulable ? "muted" : "default",
        disabled: !schedulable,
        ribbon: a && /*#__PURE__*/React.createElement(D.ActivityRibbon, {
          type: a.type
        })
      }, off ? /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 11.5,
          color: "var(--danger-500)",
          fontWeight: 700
        }
      }, a.note) : schedulable ? /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          flexWrap: "wrap",
          gap: 3
        }
      }, blocked.length ? blocked.map(u => /*#__PURE__*/React.createElement(D.NameChip, {
        key: u.id,
        name: u.name,
        tone: "gold",
        small: true
      })) : /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 11.5,
          color: "var(--success-500)"
        }
      }, "\u5168\u54E1\u53EF\u6392")) : null);
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement(D.Legend, {
    items: [["var(--orange-100)", "當天不能排的人員"], ["var(--success-50)", "補班 (可排)"], ["var(--danger-50)", "停班日"]]
  }))));
}
Object.assign(window.Duty, {
  ConstraintView
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dutymate/views/ConstraintView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dutymate/views/DraftView.jsx
try { (() => {
// Duty Mate — 草稿班表（單一頁面元件）
// 依賴：DutyKit / DutyCalendar / DutyShell / DutyViewShared 先載入。Exposes window.Duty.DraftView.
const D = window.Duty;
function DraftView(p) {
  const {
    state,
    set
  } = p;
  const {
    Button
  } = window.TrendLinkDesignSystem_b2a0d6;
  const monthKey = `${state.year}-${D.pad2(state.month + 1)}`;
  const published = state.publishedMonths.includes(monthKey);
  const draft = state.draft[monthKey] || {};
  const [dlg, setDlg] = React.useState(null);
  const [confirm, setConfirm] = React.useState(null);
  const saveDraft = next => set({
    draft: {
      ...state.draft,
      [monthKey]: next
    }
  });
  const doRecommend = () => {
    const r = D.recommend(state.year, state.month, state.users, state.exclusions, state.activities, draft);
    saveDraft(r);
    p.toast("已產生推薦班表（僅填補未排班日）");
  };
  const doClear = () => {
    saveDraft({});
    setConfirm(null);
    p.toast("已清除草稿班表");
  };
  const assign = uid => {
    saveDraft({
      ...draft,
      [dlg]: uid
    });
    setDlg(null);
  };
  const clear = () => {
    const n = {
      ...draft
    };
    delete n[dlg];
    saveDraft(n);
    setDlg(null);
  };
  const publish = () => {
    const days = D.schedulableDays(state.year, state.month, state.activities);
    const blanks = days.filter(d => !draft[d]).length;
    setConfirm(null);
    set({
      official: {
        ...state.official,
        [monthKey]: {
          ...draft
        }
      },
      publishedMonths: state.publishedMonths.includes(monthKey) ? state.publishedMonths : [...state.publishedMonths, monthKey]
    });
    p.toast(blanks ? `已發布，但有 ${blanks} 天尚未排班，可於正式班表補上` : "已發布正式班表 🎉");
    p.go("official");
  };
  const days = D.schedulableDays(state.year, state.month, state.activities);
  const filled = days.filter(d => draft[d]).length;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(D.PageHeader, {
    icon: D.DutyIcons.draft(22),
    title: "\u8349\u7A3F\u73ED\u8868",
    desc: "\u4E00\u9375\u7522\u751F\u5E73\u5747\u3001\u7121\u885D\u7A81\u7684\u63A8\u85A6\u73ED\u8868\uFF0C\u53EF\u624B\u52D5\u9EDE\u683C\u5B50\u6307\u6D3E\u6216\u79FB\u9664\u503C\u65E5\u751F\uFF1B\u767C\u5E03\u5F8C\u8F49\u70BA\u6B63\u5F0F\u73ED\u8868\u3002",
    actions: !published && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      size: "sm",
      iconLeft: D.DutyIcons.trash(15),
      onClick: () => setConfirm("clear")
    }, "\u6E05\u9664"), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      onClick: () => p.toast("已儲存草稿")
    }, "\u5132\u5B58\u8349\u7A3F"), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "sm",
      iconLeft: D.DutyIcons.spark(15),
      onClick: doRecommend
    }, "\u4E00\u9375\u7522\u751F\u63A8\u85A6"))
  }), published && /*#__PURE__*/React.createElement("div", {
    className: "dm-banner warn",
    style: {
      marginBottom: 16
    }
  }, D.DutyIcons.lock(16), " ", D.MONTH_LABEL(state.year, state.month), "\u5DF2\u767C\u5E03\uFF0C\u8349\u7A3F\u9396\u5B9A\u3002\u5982\u9700\u8ABF\u6574\u8ACB\u81F3\u300C\u6B63\u5F0F\u73ED\u8868\u300D\u7DE8\u8F2F\u3002"), /*#__PURE__*/React.createElement("div", {
    className: "dm-split"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-card",
    style: {
      padding: 18
    }
  }, /*#__PURE__*/React.createElement(D.MonthNav, {
    year: state.year,
    month: state.month,
    onPrev: () => set({
      month: state.month === 0 ? 11 : state.month - 1,
      year: state.month === 0 ? state.year - 1 : state.year
    }),
    onNext: () => set({
      month: state.month === 11 ? 0 : state.month + 1,
      year: state.month === 11 ? state.year + 1 : state.year
    }),
    right: /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12.5,
        color: filled === days.length ? "var(--success-500)" : "var(--text-muted)",
        fontWeight: 600
      }
    }, "\u5DF2\u6392 ", filled, "/", days.length, " \u5929")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 16
    }
  }), /*#__PURE__*/React.createElement(D.MonthCalendar, {
    year: state.year,
    month: state.month,
    renderCell: ctx => {
      const a = state.activities[ctx.dateStr];
      const schedulable = D.isSchedulable(ctx.date, ctx.dateStr, state.activities);
      const off = a && a.type === "off";
      const who = draft[ctx.dateStr];
      const canEdit = !published && schedulable;
      return /*#__PURE__*/React.createElement(D.DayCell, {
        ctx: ctx,
        tone: off ? "off" : a && a.type === "adjust" ? "adjust" : !schedulable ? "muted" : "default",
        disabled: off,
        onClick: canEdit ? () => setDlg(ctx.dateStr) : undefined,
        ribbon: a && /*#__PURE__*/React.createElement(D.ActivityRibbon, {
          type: a.type
        })
      }, who ? /*#__PURE__*/React.createElement(D.NameChip, {
        name: D.userById(state.users, who).name,
        small: true
      }) : canEdit ? /*#__PURE__*/React.createElement("span", {
        className: "dm-addslot"
      }, D.DutyIcons.plus(15)) : null, a && a.note && /*#__PURE__*/React.createElement("div", {
        className: "dm-daynote"
      }, a.note));
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(D.Legend, {
    items: [["var(--blue-50)", "已指派"], ["var(--success-50)", "補班"], ["var(--danger-50)", "停班 (鎖定)"]]
  }), !published && /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    iconLeft: D.DutyIcons.check(16),
    onClick: () => setConfirm("publish")
  }, "\u767C\u5E03\u73ED\u8868"))), /*#__PURE__*/React.createElement(D.StatPanel, {
    users: state.users,
    schedule: draft,
    year: state.year,
    month: state.month,
    title: "\u4EBA\u54E1\u6392\u73ED\u7D71\u8A08\uFF08\u5373\u6642\uFF09"
  })), !published && /*#__PURE__*/React.createElement(D.AssignDialog, {
    dateStr: dlg,
    users: state.users,
    exclusions: state.exclusions,
    assignedId: dlg ? draft[dlg] : null,
    onAssign: assign,
    onClear: clear,
    onClose: () => setDlg(null)
  }), confirm && /*#__PURE__*/React.createElement("div", {
    className: "dm-modal-scrim",
    onClick: () => setConfirm(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-modal sm",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "22px 22px 6px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      alignItems: "center",
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: confirm === "clear" ? "var(--danger-500)" : "var(--blue-600)"
    }
  }, confirm === "clear" ? D.DutyIcons.warn(22) : D.DutyIcons.check(22)), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: 17,
      color: "var(--text-strong)"
    }
  }, confirm === "clear" ? "清除草稿班表？" : "發布正式班表？")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13.5,
      color: "var(--text-muted)",
      lineHeight: 1.7,
      margin: 0
    }
  }, confirm === "clear" ? "將清除本月所有排班資料，回到初始狀態，此動作無法復原。" : `將 ${D.MONTH_LABEL(state.year, state.month)} 草稿發布為正式班表，全體值日生即可查看。${filled < days.length ? `目前有 ${days.length - filled} 天尚未排班。` : ""}`)), /*#__PURE__*/React.createElement("div", {
    className: "dm-modal-foot"
  }, /*#__PURE__*/React.createElement("button", {
    className: "dm-btn-text",
    onClick: () => setConfirm(null)
  }, "\u53D6\u6D88"), /*#__PURE__*/React.createElement(Button, {
    variant: confirm === "clear" ? "secondary" : "primary",
    size: "sm",
    onClick: confirm === "clear" ? doClear : publish
  }, confirm === "clear" ? "確認清除" : "確認發布")))));
}
Object.assign(window.Duty, {
  DraftView
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dutymate/views/DraftView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dutymate/views/ExcludeView.jsx
try { (() => {
// Duty Mate — 排除時段（單一頁面元件）
// 依賴：DutyKit / DutyCalendar / DutyShell / DutyViewShared 先載入。Exposes window.Duty.ExcludeView.
const D = window.Duty;
function ExcludeView(p) {
  const {
    state,
    set,
    viewRole
  } = p;
  const {
    Button
  } = window.TrendLinkDesignSystem_b2a0d6;
  const isAdmin = viewRole === "admin";
  const [target, setTarget] = React.useState(viewRole === "duty" ? "u1" : "u1");
  React.useEffect(() => {
    if (viewRole === "duty") setTarget("u1");
  }, [viewRole]);
  const monthKey = `${state.year}-${D.pad2(state.month + 1)}`;
  const published = state.publishedMonths.includes(monthKey);
  const mine = state.exclusions[target] || [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const pool = D.schedulingPool(state.users);
  const toggle = (ds, date) => {
    if (published || date < today) return;
    const has = mine.includes(ds);
    const next = has ? mine.filter(x => x !== ds) : [...mine, ds];
    set({
      exclusions: {
        ...state.exclusions,
        [target]: next
      }
    });
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(D.PageHeader, {
    icon: D.DutyIcons.exclude(22),
    title: "\u6392\u9664\u6642\u6BB5",
    desc: "\u9EDE\u9078\u65E5\u66C6\u6A19\u8A18\u300C\u4E0D\u80FD\u6392\u300D\u7684\u65E5\u671F\uFF0C\u91CD\u8907\u9EDE\u64CA\u53EF\u53D6\u6D88\u3002\u8CC7\u6599\u4F9B\u6392\u73ED\u8CA0\u8CAC\u4EBA\u6392\u73ED\u53C3\u8003\u3002",
    actions: /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "sm",
      onClick: () => p.toast("已儲存排除時段")
    }, "\u5132\u5B58")
  }), isAdmin && /*#__PURE__*/React.createElement("div", {
    className: "dm-card",
    style: {
      padding: "12px 16px",
      marginBottom: 16,
      display: "flex",
      gap: 8,
      alignItems: "center",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: "var(--text-muted)"
    }
  }, D.DutyIcons.users(15), " \u4EE3\u586B\u540C\u4EC1"), pool.map(u => /*#__PURE__*/React.createElement("button", {
    key: u.id,
    className: "dm-fchip" + (target === u.id ? " on" : ""),
    onClick: () => setTarget(u.id)
  }, u.name))), /*#__PURE__*/React.createElement("div", {
    className: "dm-card",
    style: {
      padding: 18
    }
  }, /*#__PURE__*/React.createElement(D.MonthNav, {
    year: state.year,
    month: state.month,
    onPrev: () => set({
      month: state.month === 0 ? 11 : state.month - 1,
      year: state.month === 0 ? state.year - 1 : state.year
    }),
    onNext: () => set({
      month: state.month === 11 ? 0 : state.month + 1,
      year: state.month === 11 ? state.year + 1 : state.year
    }),
    onToday: () => set({
      year: D.SEED_YEAR,
      month: D.SEED_MONTH
    }),
    right: published && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12.5,
        color: "var(--warning-500)",
        display: "inline-flex",
        gap: 5,
        alignItems: "center"
      }
    }, D.DutyIcons.lock(14), " \u5DF2\u767C\u5E03\uFF0C\u672C\u6708\u9396\u5B9A")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 16
    }
  }), /*#__PURE__*/React.createElement(D.MonthCalendar, {
    year: state.year,
    month: state.month,
    renderCell: ctx => {
      const a = state.activities[ctx.dateStr];
      const schedulable = D.isSchedulable(ctx.date, ctx.dateStr, state.activities);
      const past = ctx.date < today;
      const excluded = mine.includes(ctx.dateStr);
      const off = a && a.type === "off";
      const editable = schedulable && !past && !published;
      return /*#__PURE__*/React.createElement(D.DayCell, {
        ctx: ctx,
        tone: off ? "off" : a && a.type === "adjust" ? "adjust" : !schedulable ? "muted" : excluded ? "off" : "default",
        disabled: !schedulable,
        onClick: editable ? () => toggle(ctx.dateStr, ctx.date) : undefined,
        ribbon: a ? /*#__PURE__*/React.createElement(D.ActivityRibbon, {
          type: a.type
        }) : excluded && /*#__PURE__*/React.createElement("span", {
          style: {
            color: "var(--orange-500)"
          }
        }, D.DutyIcons.x(15))
      }, excluded && !off ? /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 11.5,
          fontWeight: 800,
          color: "var(--orange-600)"
        }
      }, "\u4E0D\u80FD\u6392") : editable ? /*#__PURE__*/React.createElement("span", {
        className: "dm-addslot subtle"
      }, "\u9EDE\u9078\u6A19\u8A18") : null);
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      display: "flex",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(D.Legend, {
    items: [["var(--orange-100)", "不能排"], ["var(--neutral-100)", "週末 / 不可排"], ["var(--danger-50)", "停班日"]]
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: "var(--text-muted)"
    }
  }, "\u672C\u6708\u5DF2\u6A19\u8A18 ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: "var(--orange-600)"
    }
  }, mine.filter(d => d.startsWith(monthKey)).length), " \u5929"))));
}
Object.assign(window.Duty, {
  ExcludeView
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dutymate/views/ExcludeView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dutymate/views/ImportView.jsx
try { (() => {
// Duty Mate — 過往班表匯入（單一頁面元件）
// 依賴：DutyKit / DutyCalendar / DutyShell / DutyViewShared 先載入。Exposes window.Duty.ImportView.
const D = window.Duty;
function ImportView(p) {
  const {
    Button,
    Badge
  } = window.TrendLinkDesignSystem_b2a0d6;
  const [done, setDone] = React.useState(false);
  const sample = [["2026-05-02", "劉亭筠"], ["2026-05-05", "張耘瑄"], ["2026-05-06", "黃喻靖"], ["2026-05-07", "陳舒珊"], ["2026-05-08", "黃宣凱"]];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(D.PageHeader, {
    icon: D.DutyIcons.import(22),
    title: "\u904E\u5F80\u73ED\u8868\u532F\u5165",
    desc: "\u532F\u5165\u904E\u5F80\u7684\u503C\u65E5\u751F\u73ED\u8868\uFF0C\u7D2F\u8A08\u622A\u81F3\u76EE\u524D\u7684\u51FA\u52E4\u7D71\u8A08\u3002\u652F\u63F4 CSV\uFF08\u65E5\u671F, \u503C\u65E5\u751F\u59D3\u540D\uFF09\u3002"
  }), /*#__PURE__*/React.createElement("div", {
    className: "dm-split"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-card",
    style: {
      padding: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-drop",
    onClick: () => setDone(true)
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--blue-500)"
    }
  }, D.DutyIcons.import(34)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700,
      color: "var(--text-strong)",
      marginTop: 10
    }
  }, "\u62D6\u66F3\u6A94\u6848\u5230\u6B64\u8655\uFF0C\u6216\u9EDE\u64CA\u4E0A\u50B3"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: "var(--text-muted)",
      marginTop: 4
    }
  }, "CSV / Excel \xB7 \u6700\u5927 5MB")), /*#__PURE__*/React.createElement("div", {
    className: "dm-banner",
    style: {
      marginTop: 16
    }
  }, D.DutyIcons.note(16), " \u683C\u5F0F\u7BC4\u4F8B\uFF1A", /*#__PURE__*/React.createElement("code", {
    style: {
      fontFamily: "var(--font-latin)"
    }
  }, "\u65E5\u671F,\u503C\u65E5\u751F\u59D3\u540D"), "\u3000\u6BCF\u5217\u4E00\u7B46\uFF0C\u65E5\u671F\u70BA YYYY-MM-DD\u3002")), /*#__PURE__*/React.createElement("div", {
    className: "dm-card",
    style: {
      padding: 0,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 18px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      color: "var(--text-strong)",
      fontSize: 14
    }
  }, "\u9810\u89BD \xB7 2026 \u5E74 5 \u6708.csv"), done ? /*#__PURE__*/React.createElement(Badge, {
    tone: "success",
    variant: "soft"
  }, "\u5DF2\u89E3\u6790 ", sample.length, " \u7B46") : /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral",
    variant: "soft"
  }, "\u5F85\u4E0A\u50B3")), /*#__PURE__*/React.createElement("table", {
    className: "dm-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "\u65E5\u671F"), /*#__PURE__*/React.createElement("th", null, "\u503C\u65E5\u751F"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "right"
    }
  }, "\u72C0\u614B"))), /*#__PURE__*/React.createElement("tbody", null, sample.map(([d, n]) => /*#__PURE__*/React.createElement("tr", {
    key: d
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      fontFamily: "var(--font-latin)",
      color: "var(--text-body)"
    }
  }, d), /*#__PURE__*/React.createElement("td", {
    style: {
      fontWeight: 600,
      color: "var(--text-strong)"
    }
  }, n), /*#__PURE__*/React.createElement("td", {
    style: {
      textAlign: "right"
    }
  }, done ? /*#__PURE__*/React.createElement(Badge, {
    tone: "success",
    variant: "soft"
  }, "\u5C0D\u61C9\u6210\u529F") : /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-muted)",
      fontSize: 12.5
    }
  }, "\u2014")))))), /*#__PURE__*/React.createElement("div", {
    className: "dm-modal-foot"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "var(--text-muted)"
    }
  }, done ? "確認無誤後匯入，將併入出勤統計。" : ""), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    disabled: !done,
    onClick: () => p.toast("已匯入 5 筆過往班表")
  }, "\u532F\u5165")))));
}
Object.assign(window.Duty, {
  ImportView
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dutymate/views/ImportView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dutymate/views/OfficialView.jsx
try { (() => {
// Duty Mate — 正式班表（單一頁面元件）
// 依賴：DutyKit / DutyCalendar / DutyShell / DutyViewShared 先載入。Exposes window.Duty.OfficialView.
const D = window.Duty;
function OfficialView(p) {
  const {
    state,
    set,
    viewRole,
    account
  } = p;
  const {
    Button,
    Badge
  } = window.TrendLinkDesignSystem_b2a0d6;
  const isAdmin = viewRole === "admin";
  const monthKey = `${state.year}-${D.pad2(state.month + 1)}`;
  const published = state.publishedMonths.includes(monthKey);
  const sched = state.official[monthKey] || {};
  const [edit, setEdit] = React.useState(false);
  const [dlg, setDlg] = React.useState(null);
  const [filter, setFilter] = React.useState(viewRole === "duty" ? "u1" : "all");
  React.useEffect(() => {
    setFilter(viewRole === "duty" ? "u1" : "all");
    setEdit(false);
  }, [viewRole]);
  const pool = D.schedulingPool(state.users);
  const assign = uid => {
    const next = {
      ...sched,
      [dlg]: uid
    };
    set({
      official: {
        ...state.official,
        [monthKey]: next
      }
    });
    setDlg(null);
    p.toast(`已指派 ${D.userById(state.users, uid).name} · ${D.fmtDate(dlg)}`);
  };
  const clear = () => {
    const n = {
      ...sched
    };
    delete n[dlg];
    set({
      official: {
        ...state.official,
        [monthKey]: n
      }
    });
    setDlg(null);
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(D.PageHeader, {
    icon: D.DutyIcons.official(22),
    title: "\u6B63\u5F0F\u73ED\u8868",
    desc: isAdmin ? "已發布的班表，可篩選人員、編輯臨時調整，並查看工作任務備註。" : "查看自己的值日安排與工作任務，可篩選只看自己。",
    actions: isAdmin && published && /*#__PURE__*/React.createElement(Button, {
      variant: edit ? "secondary" : "outline",
      size: "sm",
      iconLeft: D.DutyIcons.edit(15),
      onClick: () => setEdit(!edit)
    }, edit ? "完成編輯" : "編輯班表")
  }), !published ? /*#__PURE__*/React.createElement("div", {
    className: "dm-card",
    style: {
      padding: 18
    }
  }, /*#__PURE__*/React.createElement(D.MonthNav, {
    year: state.year,
    month: state.month,
    onPrev: () => set({
      month: state.month === 0 ? 11 : state.month - 1,
      year: state.month === 0 ? state.year - 1 : state.year
    }),
    onNext: () => set({
      month: state.month === 11 ? 0 : state.month + 1,
      year: state.month === 11 ? state.year + 1 : state.year
    }),
    onToday: () => set({
      year: D.SEED_YEAR,
      month: D.SEED_MONTH
    })
  }), /*#__PURE__*/React.createElement("div", {
    className: "dm-empty",
    style: {
      padding: "40px 26px 16px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-empty-ic"
  }, D.DutyIcons.official(30)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 700,
      color: "var(--text-strong)"
    }
  }, D.MONTH_LABEL(state.year, state.month), "\u5C1A\u672A\u767C\u5E03\u73ED\u8868"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13.5,
      color: "var(--text-muted)",
      margin: "6px 0 16px"
    }
  }, isAdmin ? "請至「草稿班表」產生推薦並發布，或切換月份查看其他班表。" : "請等待排班負責人發布本月班表，或切換月份查看其他班表。"), isAdmin && /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    onClick: () => p.go("draft")
  }, "\u524D\u5F80\u8349\u7A3F\u73ED\u8868"))) : /*#__PURE__*/React.createElement("div", {
    className: "dm-split"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-card",
    style: {
      padding: 18
    }
  }, /*#__PURE__*/React.createElement(D.MonthNav, {
    year: state.year,
    month: state.month,
    onPrev: () => set({
      month: state.month === 0 ? 11 : state.month - 1,
      year: state.month === 0 ? state.year - 1 : state.year
    }),
    onNext: () => set({
      month: state.month === 11 ? 0 : state.month + 1,
      year: state.month === 11 ? state.year + 1 : state.year
    }),
    onToday: () => set({
      year: D.SEED_YEAR,
      month: D.SEED_MONTH
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "16px 0",
      display: "flex",
      gap: 8,
      flexWrap: "wrap",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: "var(--text-muted)",
      marginRight: 2
    }
  }, "\u7BE9\u9078"), /*#__PURE__*/React.createElement("button", {
    className: "dm-fchip" + (filter === "all" ? " on" : ""),
    onClick: () => setFilter("all")
  }, "\u5168\u90E8"), pool.map(u => /*#__PURE__*/React.createElement("button", {
    key: u.id,
    className: "dm-fchip" + (filter === u.id ? " on" : ""),
    onClick: () => setFilter(u.id)
  }, u.name))), /*#__PURE__*/React.createElement(D.MonthCalendar, {
    year: state.year,
    month: state.month,
    renderCell: ctx => {
      const a = state.activities[ctx.dateStr];
      const schedulable = D.isSchedulable(ctx.date, ctx.dateStr, state.activities);
      const who = sched[ctx.dateStr];
      const off = a && a.type === "off";
      const tone = off ? "off" : a && a.type === "adjust" ? "adjust" : !schedulable ? "muted" : "default";
      const canEdit = isAdmin && edit && schedulable;
      const dim = filter !== "all" && who && who !== filter;
      return /*#__PURE__*/React.createElement(D.DayCell, {
        ctx: ctx,
        tone: tone,
        disabled: off && !who,
        onClick: canEdit ? () => setDlg(ctx.dateStr) : undefined,
        ribbon: a && /*#__PURE__*/React.createElement(D.ActivityRibbon, {
          type: a.type
        })
      }, who ? /*#__PURE__*/React.createElement("div", {
        style: {
          opacity: dim ? 0.28 : 1
        }
      }, /*#__PURE__*/React.createElement(D.NameChip, {
        name: D.userById(state.users, who).name,
        tone: filter === who ? "me" : "blue",
        absent: off,
        small: true
      }), off && /*#__PURE__*/React.createElement("div", {
        className: "dm-absent"
      }, "\u7121\u6CD5\u51FA\u52E4")) : schedulable && isAdmin && edit ? /*#__PURE__*/React.createElement("span", {
        className: "dm-addslot"
      }, D.DutyIcons.plus(15)) : null, a && a.note && /*#__PURE__*/React.createElement("div", {
        className: "dm-daynote"
      }, a.note));
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement(D.Legend, {
    items: [["var(--blue-50)", "已排班"], ["var(--success-50)", "補班 (可排)"], ["var(--danger-50)", "停班 (不可排)"], ["var(--blue-500)", "今日 / 篩選中"]]
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-card",
    style: {
      padding: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--orange-500)"
    }
  }, D.DutyIcons.note(18)), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15,
      margin: 0,
      color: "var(--text-strong)"
    }
  }, "\u503C\u65E5\u751F\u5DE5\u4F5C\u4EFB\u52D9")), state.taskList && state.taskList.length ? /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      padding: "0 0 0 18px",
      display: "flex",
      flexDirection: "column",
      gap: 5
    }
  }, state.taskList.map(it => /*#__PURE__*/React.createElement("li", {
    key: it.id,
    style: {
      fontSize: 13.5,
      color: "var(--text-body)",
      lineHeight: 1.7
    }
  }, it.text))) : /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: "var(--text-muted)",
      margin: 0
    }
  }, "\u5C1A\u672A\u8A2D\u5B9A\u5DE5\u4F5C\u4EFB\u52D9\u3002"), isAdmin && /*#__PURE__*/React.createElement("button", {
    className: "dm-btn-text",
    style: {
      padding: "10px 0 0",
      color: "var(--blue-600)"
    },
    onClick: () => p.go("worktask")
  }, D.DutyIcons.edit(14), " ", state.taskList && state.taskList.length ? "編輯工作任務" : "前往設定工作任務")), /*#__PURE__*/React.createElement(D.StatPanel, {
    users: state.users,
    schedule: sched,
    year: state.year,
    month: state.month,
    title: "\u672C\u6708\u5BE6\u969B\u6392\u73ED"
  }))), edit && /*#__PURE__*/React.createElement(D.AssignDialog, {
    dateStr: dlg,
    users: state.users,
    exclusions: state.exclusions,
    assignedId: dlg ? sched[dlg] : null,
    onAssign: assign,
    onClear: clear,
    onClose: () => setDlg(null)
  }));
}
Object.assign(window.Duty, {
  OfficialView
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dutymate/views/OfficialView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dutymate/views/StatsView.jsx
try { (() => {
// Duty Mate — 出勤統計（單一頁面元件）
// 依賴：DutyKit / DutyCalendar / DutyShell / DutyViewShared 先載入。Exposes window.Duty.StatsView.
const D = window.Duty;
function StatsView(p) {
  const {
    state,
    set
  } = p;
  const pool = D.schedulingPool(state.users);
  const [yr, setYr] = React.useState(state.year);
  const [pick, setPick] = React.useState(null);
  const [cm, setCm] = React.useState(state.month); // calendar month

  // gather published months in selected year
  const months = state.publishedMonths.filter(mk => mk.startsWith(String(yr)));
  const rows = pool.map(u => {
    let actual = 0,
      absent = 0,
      schedTotal = 0;
    months.forEach(mk => {
      const [yy, mm] = mk.split("-").map(Number);
      const sched = state.official[mk] || {};
      schedTotal += D.schedulableDays(yy, mm - 1, state.activities).length;
      Object.entries(sched).forEach(([ds, uid]) => {
        if (uid === u.id) {
          const a = state.activities[ds];
          if (a && a.type === "off") absent++;else actual++;
        }
      });
    });
    const avg = pool.length ? schedTotal / pool.length : 0;
    return {
      u,
      avg,
      actual,
      absent
    };
  });
  const cmKey = `${yr}-${D.pad2(cm + 1)}`;
  const cmSched = state.official[cmKey] || {};
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(D.PageHeader, {
    icon: D.DutyIcons.stats(22),
    title: "\u51FA\u52E4\u7D71\u8A08",
    desc: "\u6AA2\u8996\u5404\u503C\u65E5\u751F\u7684\u6392\u73ED\u5E73\u5747\u6B21\u6578\u3001\u5BE6\u969B\u6392\u73ED\u6B21\u6578\u8207\u7F3A\u52E4\u6B21\u6578\uFF0C\u78BA\u8A8D\u6392\u73ED\u662F\u5426\u5E73\u5747\u3002",
    actions: /*#__PURE__*/React.createElement("label", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12.5,
        color: "var(--text-muted)"
      }
    }, D.DutyIcons.calendar(15), " \u7D71\u8A08\u5E74\u5EA6"), /*#__PURE__*/React.createElement("select", {
      className: "dm-input",
      style: {
        width: "auto",
        height: 38,
        fontWeight: 700
      },
      value: yr,
      onChange: e => setYr(Number(e.target.value))
    }, Array.from({
      length: 6
    }, (_, i) => state.year - i).map(y => /*#__PURE__*/React.createElement("option", {
      key: y,
      value: y
    }, y, " \u5E74"))))
  }), months.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "dm-banner",
    style: {
      marginBottom: 16
    }
  }, D.DutyIcons.warn(16), " ", yr, " \u5E74\u5C1A\u7121\u5DF2\u767C\u5E03\u7684\u73ED\u8868\uFF0C\u6578\u64DA\u5C07\u65BC\u767C\u5E03\u5F8C\u7D2F\u8A08\u3002"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-card",
    style: {
      padding: 0,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "dm-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "\u503C\u65E5\u751F"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "right"
    }
  }, "\u5E73\u5747\u6B21\u6578"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "right"
    }
  }, "\u5BE6\u969B\u6B21\u6578"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "right"
    }
  }, "\u7F3A\u52E4"))), /*#__PURE__*/React.createElement("tbody", null, rows.map(({
    u,
    avg,
    actual,
    absent
  }) => /*#__PURE__*/React.createElement("tr", {
    key: u.id,
    className: "dm-rowsel" + (pick === u.id ? " on" : ""),
    onClick: () => setPick(pick === u.id ? null : u.id)
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-avatar sm"
  }, u.name[0]), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      color: pick === u.id ? "var(--blue-700)" : "var(--text-strong)"
    }
  }, u.name))), /*#__PURE__*/React.createElement("td", {
    style: {
      textAlign: "right",
      color: "var(--text-muted)",
      fontVariantNumeric: "tabular-nums"
    }
  }, avg.toFixed(1)), /*#__PURE__*/React.createElement("td", {
    style: {
      textAlign: "right",
      fontWeight: 800,
      color: "var(--blue-700)",
      fontVariantNumeric: "tabular-nums"
    }
  }, actual), /*#__PURE__*/React.createElement("td", {
    style: {
      textAlign: "right",
      fontVariantNumeric: "tabular-nums",
      color: absent ? "var(--danger-500)" : "var(--text-muted)",
      fontWeight: absent ? 700 : 400
    }
  }, absent))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 16px",
      fontSize: 12,
      color: "var(--text-muted)",
      borderTop: "1px solid var(--border-subtle)"
    }
  }, "\u9EDE\u9078\u503C\u65E5\u751F\u59D3\u540D\uFF0C\u4E0B\u65B9\u65E5\u66C6\u7BE9\u9078\u5176\u51FA\u52E4\u72C0\u6CC1\u3002")), /*#__PURE__*/React.createElement("div", {
    className: "dm-card",
    style: {
      padding: 18
    }
  }, /*#__PURE__*/React.createElement(D.MonthNav, {
    year: yr,
    month: cm,
    onPrev: () => setCm(cm === 0 ? 11 : cm - 1),
    onNext: () => setCm(cm === 11 ? 0 : cm + 1)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: "var(--text-muted)",
      margin: "10px 0 14px"
    }
  }, pick ? `篩選：${D.userById(state.users, pick).name}` : "顯示全部值日生"), /*#__PURE__*/React.createElement(D.MonthCalendar, {
    year: yr,
    month: cm,
    renderCell: ctx => {
      const a = state.activities[ctx.dateStr];
      const who = cmSched[ctx.dateStr];
      const off = a && a.type === "off";
      const show = who && (!pick || who === pick);
      return /*#__PURE__*/React.createElement(D.DayCell, {
        ctx: ctx,
        tone: off ? "off" : a && a.type === "adjust" ? "adjust" : "default",
        disabled: !D.isSchedulable(ctx.date, ctx.dateStr, state.activities) && !who
      }, show ? off ? /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 10.5,
          fontWeight: 700,
          color: "var(--danger-500)"
        }
      }, "\u7F3A\u52E4\xB7", D.userById(state.users, who).name) : /*#__PURE__*/React.createElement(D.NameChip, {
        name: D.userById(state.users, who).name,
        small: true,
        tone: pick ? "me" : "blue"
      }) : null);
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(D.Legend, {
    items: [["var(--blue-50)", "出勤"], ["var(--danger-50)", "缺勤 (停班)"]]
  })))));
}
Object.assign(window.Duty, {
  StatsView
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dutymate/views/StatsView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dutymate/views/SwapView.jsx
try { (() => {
// Duty Mate — 申請換班（追加）（單一頁面元件）
// 依賴：DutyKit / DutyCalendar / DutyShell / DutyViewShared 先載入。Exposes window.Duty.SwapView.
const D = window.Duty;
function SwapView() {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(D.PageHeader, {
    icon: D.DutyIcons.swap(22),
    title: "\u7533\u8ACB\u63DB\u73ED",
    desc: "\u503C\u65E5\u751F\u6709\u4E8B\u6642\uFF0C\u53EF\u7533\u8ACB\u8207\u5176\u4ED6\u540C\u4EC1\u63DB\u73ED\uFF0C\u5C0D\u65B9\u540C\u610F\u5373\u751F\u6548\uFF0C\u7121\u9808\u7BA1\u7406\u54E1\u5BE9\u6838\u3002"
  }), /*#__PURE__*/React.createElement("div", {
    className: "dm-card dm-empty"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-empty-ic",
    style: {
      background: "var(--orange-50)",
      color: "var(--orange-500)"
    }
  }, D.DutyIcons.swap(30)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 700,
      color: "var(--text-strong)"
    }
  }, "\u7533\u8ACB\u63DB\u73ED\u529F\u80FD\u958B\u767C\u4E2D"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13.5,
      color: "var(--text-muted)",
      margin: "6px 0 0",
      maxWidth: 420,
      lineHeight: 1.8
    }
  }, "\u5C6C\u7B2C 5 \u968E\u6BB5\u8FFD\u52A0\u529F\u80FD\u3002\u4E0A\u7DDA\u524D\u5982\u9700\u81E8\u6642\u8ABF\u6574\uFF0C\u8ACB\u7531\u6392\u73ED\u8CA0\u8CAC\u4EBA\u65BC\u300C\u6B63\u5F0F\u73ED\u8868\u300D\u7DE8\u8F2F\u6A21\u5F0F\u8ABF\u6574\u3002")));
}
Object.assign(window.Duty, {
  SwapView
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dutymate/views/SwapView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dutymate/views/UsersView.jsx
try { (() => {
// Duty Mate — 用戶管理（單一頁面元件）
// 依賴：DutyKit / DutyCalendar / DutyShell / DutyViewShared 先載入。Exposes window.Duty.UsersView.
const D = window.Duty;
function UsersView(p) {
  const {
    state,
    set,
    account
  } = p;
  const {
    Button,
    Badge,
    Switch
  } = window.TrendLinkDesignSystem_b2a0d6;
  const [form, setForm] = React.useState(null); // {id?, name, email, role, include}
  const [del, setDel] = React.useState(null);
  const blank = {
    name: "",
    email: "",
    password: "",
    role: "duty",
    include: true
  };
  const valid = form && form.name.trim().length >= 2 && /\S+@\S+\.\S+/.test(form.email) && (form.id || form.password.length >= 8);
  const saveUser = () => {
    if (form.id) set({
      users: state.users.map(u => u.id === form.id ? {
        ...u,
        name: form.name,
        email: form.email,
        role: u.id === account.id ? u.role : form.role,
        include: form.include
      } : u)
    });else set({
      users: [...state.users, {
        ...form,
        id: "u" + Date.now(),
        email: form.email.toLowerCase()
      }]
    });
    p.toast(form.id ? "已更新用戶" : "已新增用戶");
    setForm(null);
  };
  const doDelete = () => {
    set({
      users: state.users.filter(u => u.id !== del.id)
    });
    p.toast(`已刪除 ${del.name}`);
    setDel(null);
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(D.PageHeader, {
    icon: D.DutyIcons.users(22),
    title: "\u7528\u6236\u7BA1\u7406",
    desc: "\u65B0\u589E\u3001\u4FEE\u6539\u3001\u522A\u9664\u7CFB\u7D71\u7528\u6236\uFF0C\u8A2D\u5B9A\u89D2\u8272\u8207\u662F\u5426\u5217\u5165\u6392\u73ED\u3002",
    actions: /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "sm",
      iconLeft: D.DutyIcons.plus(16),
      onClick: () => setForm(blank)
    }, "\u65B0\u589E\u7528\u6236")
  }), /*#__PURE__*/React.createElement("div", {
    className: "dm-card",
    style: {
      padding: 0,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "dm-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "\u59D3\u540D"), /*#__PURE__*/React.createElement("th", null, "\u516C\u53F8\u90F5\u7BB1"), /*#__PURE__*/React.createElement("th", null, "\u89D2\u8272"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "center"
    }
  }, "\u5217\u5165\u6392\u73ED"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "right"
    }
  }, "\u64CD\u4F5C"))), /*#__PURE__*/React.createElement("tbody", null, state.users.map(u => {
    const self = u.id === account.id;
    return /*#__PURE__*/React.createElement("tr", {
      key: u.id
    }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "dm-avatar sm"
    }, u.name[0]), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 600,
        color: "var(--text-strong)"
      }
    }, u.name, self && /*#__PURE__*/React.createElement("span", {
      className: "dm-self"
    }, "\u4F60")))), /*#__PURE__*/React.createElement("td", {
      style: {
        color: "var(--text-muted)",
        fontFamily: "var(--font-latin)"
      }
    }, u.email), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Badge, {
      tone: u.role === "admin" ? "blue" : "neutral"
    }, D.roleLabel(u.role))), /*#__PURE__*/React.createElement("td", {
      style: {
        textAlign: "center"
      }
    }, u.include ? /*#__PURE__*/React.createElement(Badge, {
      tone: "success",
      variant: "soft"
    }, "\u662F") : /*#__PURE__*/React.createElement(Badge, {
      tone: "neutral",
      variant: "soft"
    }, "\u5426")), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 6,
        justifyContent: "flex-end"
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "dm-iconbtn sm",
      onClick: () => setForm({
        id: u.id,
        name: u.name,
        email: u.email,
        password: "",
        role: u.role,
        include: u.include
      }),
      "aria-label": "\u7DE8\u8F2F"
    }, D.DutyIcons.edit(16)), /*#__PURE__*/React.createElement("button", {
      className: "dm-iconbtn sm danger",
      disabled: self,
      style: {
        opacity: self ? 0.35 : 1,
        cursor: self ? "not-allowed" : "pointer"
      },
      onClick: () => !self && setDel(u),
      "aria-label": "\u522A\u9664"
    }, D.DutyIcons.trash(16)))));
  })))), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: "var(--text-muted)",
      marginTop: 12,
      lineHeight: 1.7
    }
  }, "\u203B \u8CA0\u8CAC\u4EBA\u7121\u6CD5\u4FEE\u6539\u81EA\u5DF1\u7684\u89D2\u8272\u6216\u522A\u9664\u81EA\u5DF1\uFF0C\u4EE5\u514D\u5931\u53BB\u7BA1\u7406\u6B0A\u9650\u3002\u96FB\u5B50\u90F5\u4EF6\u5728\u7CFB\u7D71\u4E2D\u552F\u4E00\u3002"), form && /*#__PURE__*/React.createElement("div", {
    className: "dm-modal-scrim",
    onClick: () => setForm(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-modal",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-modal-head"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      fontWeight: 800,
      color: "var(--text-strong)"
    }
  }, form.id ? "編輯用戶" : "新增用戶"), /*#__PURE__*/React.createElement("button", {
    className: "dm-iconbtn",
    onClick: () => setForm(null)
  }, D.DutyIcons.x(18))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "8px 22px 18px",
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "dm-field"
  }, /*#__PURE__*/React.createElement("span", null, "\u59D3\u540D"), /*#__PURE__*/React.createElement("input", {
    className: "dm-input",
    value: form.name,
    onChange: e => setForm({
      ...form,
      name: e.target.value
    }),
    placeholder: "2\u201320 \u5B57\uFF0C\u4E2D\u82F1\u6587"
  })), /*#__PURE__*/React.createElement("label", {
    className: "dm-field"
  }, /*#__PURE__*/React.createElement("span", null, "\u516C\u53F8\u90F5\u7BB1"), /*#__PURE__*/React.createElement("input", {
    className: "dm-input",
    type: "email",
    value: form.email,
    onChange: e => setForm({
      ...form,
      email: e.target.value
    }),
    placeholder: "name@trendlink.com.tw"
  })), !form.id && /*#__PURE__*/React.createElement("label", {
    className: "dm-field"
  }, /*#__PURE__*/React.createElement("span", null, "\u5BC6\u78BC"), /*#__PURE__*/React.createElement("input", {
    className: "dm-input",
    type: "password",
    value: form.password,
    onChange: e => setForm({
      ...form,
      password: e.target.value
    }),
    placeholder: "\u81F3\u5C11 8 \u78BC\uFF0C\u542B\u5B57\u6BCD\u8207\u6578\u5B57"
  })), /*#__PURE__*/React.createElement("label", {
    className: "dm-field"
  }, /*#__PURE__*/React.createElement("span", null, "\u89D2\u8272"), /*#__PURE__*/React.createElement("select", {
    className: "dm-input",
    value: form.role,
    disabled: form.id === account.id,
    onChange: e => setForm({
      ...form,
      role: e.target.value
    })
  }, /*#__PURE__*/React.createElement("option", {
    value: "duty"
  }, "\u503C\u65E5\u751F"), /*#__PURE__*/React.createElement("option", {
    value: "admin"
  }, "\u6392\u73ED\u8CA0\u8CAC\u4EBA")), form.id === account.id && /*#__PURE__*/React.createElement("small", {
    style: {
      color: "var(--text-muted)",
      fontSize: 11.5
    }
  }, "\u7121\u6CD5\u4FEE\u6539\u81EA\u5DF1\u7684\u89D2\u8272")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "4px 2px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      color: "var(--text-body)",
      fontWeight: 600
    }
  }, "\u5217\u5165\u6392\u73ED"), /*#__PURE__*/React.createElement(Switch, {
    checked: form.include,
    onChange: e => setForm({
      ...form,
      include: e.target.checked
    })
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dm-modal-foot"
  }, /*#__PURE__*/React.createElement("button", {
    className: "dm-btn-text",
    onClick: () => setForm(null)
  }, "\u53D6\u6D88"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    disabled: !valid,
    onClick: saveUser
  }, form.id ? "儲存" : "新增")))), del && /*#__PURE__*/React.createElement("div", {
    className: "dm-modal-scrim",
    onClick: () => setDel(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-modal sm",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "22px 22px 6px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      alignItems: "center",
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--danger-500)"
    }
  }, D.DutyIcons.warn(22)), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: 17,
      color: "var(--text-strong)"
    }
  }, "\u522A\u9664\u7528\u6236\uFF1F")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13.5,
      color: "var(--text-muted)",
      lineHeight: 1.7,
      margin: 0
    }
  }, "\u5C07\u522A\u9664\u300C", del.name, "\u300D\uFF0C\u8A72\u5E33\u865F\u5C07\u7121\u6CD5\u518D\u767B\u5165\u3002\u6B64\u52D5\u4F5C\u7121\u6CD5\u5FA9\u539F\u3002")), /*#__PURE__*/React.createElement("div", {
    className: "dm-modal-foot"
  }, /*#__PURE__*/React.createElement("button", {
    className: "dm-btn-text",
    onClick: () => setDel(null)
  }, "\u53D6\u6D88"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    onClick: doDelete
  }, "\u78BA\u8A8D\u522A\u9664")))));
}
Object.assign(window.Duty, {
  UsersView
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dutymate/views/UsersView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dutymate/views/WorkTaskView.jsx
try { (() => {
// Duty Mate — 工作任務設定（單一頁面元件）
// 依賴：DutyKit / DutyCalendar / DutyShell / DutyViewShared 先載入。Exposes window.Duty.WorkTaskView.
const D = window.Duty;
function WorkTaskView(p) {
  const {
    state,
    set
  } = p;
  const {
    Button
  } = window.TrendLinkDesignSystem_b2a0d6;
  const MAX = 200;
  const list = state.taskList || [];
  const [draft, setDraft] = React.useState("");
  const [editId, setEditId] = React.useState(null);
  const [editText, setEditText] = React.useState("");
  const addTask = () => {
    const t = draft.trim();
    if (!t || t.length > MAX) return;
    set({
      taskList: [...list, {
        id: "t" + Date.now(),
        text: t
      }]
    });
    setDraft("");
    p.toast("已新增工作任務");
  };
  const startEdit = it => {
    setEditId(it.id);
    setEditText(it.text);
  };
  const saveEdit = () => {
    const t = editText.trim();
    if (!t || t.length > MAX) return;
    set({
      taskList: list.map(x => x.id === editId ? {
        ...x,
        text: t
      } : x)
    });
    setEditId(null);
    p.toast("已更新工作任務");
  };
  const removeTask = id => {
    set({
      taskList: list.filter(x => x.id !== id)
    });
    if (editId === id) setEditId(null);
    p.toast("已刪除工作任務");
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(D.PageHeader, {
    icon: D.DutyIcons.task(22),
    title: "\u5DE5\u4F5C\u4EFB\u52D9\u8A2D\u5B9A",
    desc: "\u8A2D\u5B9A\u503C\u65E5\u751F\u7684\u5DE5\u4F5C\u4EFB\u52D9\u6E05\u55AE\uFF0C\u5167\u5BB9\u6703\u4EE5\u5099\u8A3B\u5F62\u5F0F\u5957\u7528\u5230\u6B63\u5F0F\u73ED\u8868\uFF0C\u8B93\u6BCF\u4F4D\u503C\u65E5\u751F\u6E05\u695A\u8981\u5B8C\u6210\u7684\u5DE5\u4F5C\u3002\u53EF\u9010\u689D\u65B0\u589E\u3001\u7DE8\u8F2F\u6216\u522A\u9664\u3002"
  }), /*#__PURE__*/React.createElement("div", {
    className: "dm-split"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-card",
    style: {
      padding: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("input", {
    className: "dm-input",
    value: draft,
    onChange: e => setDraft(e.target.value),
    onKeyDown: e => {
      if (e.key === "Enter" && !e.nativeEvent.isComposing) addTask();
    },
    style: {
      flex: 1
    },
    placeholder: "\u65B0\u589E\u4E00\u9805\u5DE5\u4F5C\u4EFB\u52D9\uFF0C\u4F8B\u5982\uFF1A\u5012\u8336\u6C34\u9593\u5783\u573E"
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "md",
    iconLeft: D.DutyIcons.plus(16),
    disabled: !draft.trim() || draft.length > MAX,
    onClick: addTask,
    style: {
      height: 42
    }
  }, "\u65B0\u589E")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      margin: "6px 2px 0"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      color: "var(--text-muted)"
    }
  }, "\u5171 ", list.length, " \u9805\u4EFB\u52D9"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      fontVariantNumeric: "tabular-nums",
      color: draft.length > MAX ? "var(--danger-500)" : "var(--text-muted)"
    }
  }, draft.length, " / ", MAX)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, list.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "dm-empty",
    style: {
      padding: "34px 16px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-empty-ic",
    style: {
      width: 52,
      height: 52,
      borderRadius: 14,
      marginBottom: 12
    }
  }, D.DutyIcons.task(24)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14.5,
      fontWeight: 700,
      color: "var(--text-strong)"
    }
  }, "\u5C1A\u672A\u8A2D\u5B9A\u5DE5\u4F5C\u4EFB\u52D9"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12.5,
      color: "var(--text-muted)",
      margin: "5px 0 0"
    }
  }, "\u65BC\u4E0A\u65B9\u8F38\u5165\u4E26\u65B0\u589E\u7B2C\u4E00\u9805\u5DE5\u4F5C\u4EFB\u52D9\u3002")) : list.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: it.id,
    className: "dm-task-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-task-no"
  }, i + 1), editId === it.id ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", {
    className: "dm-input",
    value: editText,
    autoFocus: true,
    style: {
      flex: 1,
      height: 38
    },
    onChange: e => setEditText(e.target.value),
    onKeyDown: e => {
      if (e.nativeEvent.isComposing) return;
      if (e.key === "Enter") saveEdit();
      if (e.key === "Escape") setEditId(null);
    }
  }), /*#__PURE__*/React.createElement("button", {
    className: "dm-iconbtn sm",
    onClick: saveEdit,
    "aria-label": "\u5132\u5B58",
    disabled: !editText.trim() || editText.length > MAX,
    style: {
      color: "var(--success-500)"
    }
  }, D.DutyIcons.check(16)), /*#__PURE__*/React.createElement("button", {
    className: "dm-iconbtn sm",
    onClick: () => setEditId(null),
    "aria-label": "\u53D6\u6D88"
  }, D.DutyIcons.x(16))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontSize: 14,
      color: "var(--text-body)",
      lineHeight: 1.6
    }
  }, it.text), /*#__PURE__*/React.createElement("button", {
    className: "dm-iconbtn sm",
    onClick: () => startEdit(it),
    "aria-label": "\u7DE8\u8F2F"
  }, D.DutyIcons.edit(15)), /*#__PURE__*/React.createElement("button", {
    className: "dm-iconbtn sm danger",
    onClick: () => removeTask(it.id),
    "aria-label": "\u522A\u9664"
  }, D.DutyIcons.trash(15))))))), /*#__PURE__*/React.createElement("div", {
    className: "dm-card",
    style: {
      padding: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--orange-500)"
    }
  }, D.DutyIcons.note(18)), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15,
      margin: 0,
      color: "var(--text-strong)"
    }
  }, "\u6B63\u5F0F\u73ED\u8868\u9810\u89BD")), list.length ? /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 12,
      border: "1px solid var(--border-subtle)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-brand-soft)",
      padding: "10px 14px",
      fontSize: 12.5,
      fontWeight: 700,
      color: "var(--blue-700)",
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, D.DutyIcons.note(15), " \u503C\u65E5\u751F\u5DE5\u4F5C\u4EFB\u52D9"), /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      padding: "12px 16px 12px 30px",
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, list.map(it => /*#__PURE__*/React.createElement("li", {
    key: it.id,
    style: {
      fontSize: 13.5,
      color: "var(--text-body)",
      lineHeight: 1.7
    }
  }, it.text)))) : /*#__PURE__*/React.createElement("div", {
    className: "dm-empty",
    style: {
      padding: "30px 16px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-empty-ic",
    style: {
      width: 52,
      height: 52,
      borderRadius: 14,
      marginBottom: 12
    }
  }, D.DutyIcons.note(24)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: "var(--text-strong)"
    }
  }, "\u6C92\u6709\u5DE5\u4F5C\u4EFB\u52D9"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12.5,
      color: "var(--text-muted)",
      margin: "5px 0 0"
    }
  }, "\u65B0\u589E\u5F8C\u5373\u6703\u5957\u7528\u5230\u6B63\u5F0F\u73ED\u8868\u3002")))));
}
Object.assign(window.Duty, {
  WorkTaskView
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dutymate/views/WorkTaskView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/WebChrome.jsx
try { (() => {
// TrendLink marketing site — shared inline icons + header/footer
// Exposes: TLIcons, WebHeader, WebFooter on window.

const TLIcons = {
  search: (p = {}) => /*#__PURE__*/React.createElement("svg", {
    width: p.s || 20,
    height: p.s || 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.4",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m21 21-4.3-4.3"
  })),
  chevDown: (p = {}) => /*#__PURE__*/React.createElement("svg", {
    width: p.s || 16,
    height: p.s || 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6"
  })),
  arrow: (p = {}) => /*#__PURE__*/React.createElement("svg", {
    width: p.s || 18,
    height: p.s || 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12h14M13 6l6 6-6 6"
  })),
  payroll: (p = {}) => /*#__PURE__*/React.createElement("svg", {
    width: p.s || 30,
    height: p.s || 30,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "4",
    width: "18",
    height: "16",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 10h18M7 15h4"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "16.5",
    cy: "15",
    r: "1.2"
  })),
  chart: (p = {}) => /*#__PURE__*/React.createElement("svg", {
    width: p.s || 30,
    height: p.s || 30,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 3v18h18"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "7",
    y: "11",
    width: "3",
    height: "6"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "13",
    y: "7",
    width: "3",
    height: "10"
  })),
  shield: (p = {}) => /*#__PURE__*/React.createElement("svg", {
    width: p.s || 30,
    height: p.s || 30,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m9 12 2 2 4-4"
  })),
  grad: (p = {}) => /*#__PURE__*/React.createElement("svg", {
    width: p.s || 30,
    height: p.s || 30,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M22 10 12 5 2 10l10 5 10-5Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6 12v5c0 1 3 3 6 3s6-2 6-3v-5"
  })),
  users: (p = {}) => /*#__PURE__*/React.createElement("svg", {
    width: p.s || 30,
    height: p.s || 30,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "9",
    cy: "7",
    r: "4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M22 21v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11"
  })),
  doc: (p = {}) => /*#__PURE__*/React.createElement("svg", {
    width: p.s || 30,
    height: p.s || 30,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14 2v6h6M9 13h6M9 17h6"
  })),
  spark: (p = {}) => /*#__PURE__*/React.createElement("svg", {
    width: p.s || 30,
    height: p.s || 30,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"
  })),
  quote: (p = {}) => /*#__PURE__*/React.createElement("svg", {
    width: p.s || 30,
    height: p.s || 30,
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7 7H4a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2v3a2 2 0 0 1-2 2H3v2h1a4 4 0 0 0 4-4V9a2 2 0 0 0-1-2Zm13 0h-3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2v3a2 2 0 0 1-2 2h-1v2h1a4 4 0 0 0 4-4V9a2 2 0 0 0-1-2Z"
  }))
};
const NAV = ["關於我們", "最新消息", "解決方案", "課程與講座", "軟體服務", "顧問服務", "客戶真心話", "部落格", "客服中心"];
function Logo({
  dark
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo/trendlink-logo.jpeg",
    alt: "TrendLink",
    style: {
      width: 44,
      height: 44,
      borderRadius: 9,
      background: "#fff",
      padding: 2,
      objectFit: "contain"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      lineHeight: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 19,
      fontWeight: 900,
      letterSpacing: ".05em",
      color: dark ? "#fff" : "var(--blue-700)"
    }
  }, "\u806F\u548C\u8DA8\u52D5"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: ".22em",
      marginTop: 3,
      color: dark ? "var(--orange-300)" : "var(--orange-500)"
    }
  }, "TREND LINK \xB7 7645")));
}
function WebHeader() {
  const {
    IconButton
  } = window.TrendLinkDesignSystem_b2a0d6;
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 100,
      height: 76,
      background: "var(--gradient-header)",
      boxShadow: "var(--shadow-md)",
      display: "flex",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: "0 auto",
      padding: "0 28px",
      width: "100%",
      display: "flex",
      alignItems: "center",
      gap: 28
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    dark: true
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      gap: 4,
      marginLeft: "auto"
    }
  }, NAV.map((n, i) => /*#__PURE__*/React.createElement("a", {
    key: n,
    href: "#",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 3,
      padding: "8px 11px",
      color: i === 2 ? "#fff" : "rgba(255,255,255,.9)",
      fontSize: 14.5,
      fontWeight: i === 2 ? 700 : 500,
      borderRadius: 8,
      position: "relative"
    }
  }, n, (i === 0 || i === 3 || i === 4 || i === 5 || i === 8) && TLIcons.chevDown({
    s: 13
  })))), /*#__PURE__*/React.createElement(IconButton, {
    variant: "accent",
    label: "\u641C\u5C0B",
    style: {
      marginLeft: 4
    }
  }, TLIcons.search())));
}
function WebFooter() {
  const cols = [["認識我們", ["關於聯和趨動", "顧問團隊", "最新消息", "永續發展承諾", "道德與合規"]], ["服務項目", ["一鍵發薪人資系統", "日日考核績效系統", "勞資法務顧問輔導", "職能考核輔導", "薪資委外服務", "企業培訓"]], ["客服中心", ["服務據點", "線上諮詢", "成為合作夥伴", "常見問題"]]];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: "var(--blue-950)",
      color: "rgba(255,255,255,.72)",
      paddingTop: 56
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: "0 auto",
      padding: "0 28px",
      display: "grid",
      gridTemplateColumns: "1.4fr 1fr 1.2fr 1fr",
      gap: 36
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Logo, {
    dark: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      fontSize: 13.5,
      lineHeight: 2
    }
  }, /*#__PURE__*/React.createElement("div", null, "\u806F\u548C\u8DA8\u52D5\u80A1\u4EFD\u6709\u9650\u516C\u53F8"), /*#__PURE__*/React.createElement("div", null, "\u9AD8\u96C4\u5E02\u524D\u93AE\u5340\u5FA9\u8208\u56DB\u8DEF2\u865F\u56DB\u6A13\u4E4B\u4E00"), /*#__PURE__*/React.createElement("div", null, "07-973-5000\u3000\u9031\u4E00\u81F3\u9031\u4E94 9:00\u201317:30"))), cols.map(([t, items]) => /*#__PURE__*/React.createElement("div", {
    key: t
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#fff",
      fontWeight: 700,
      fontSize: 15,
      marginBottom: 14
    }
  }, t), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 9
    }
  }, items.map(i => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: "#",
    style: {
      color: "rgba(255,255,255,.72)",
      fontSize: 13.5
    }
  }, i)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: "36px auto 0",
      padding: "20px 28px",
      borderTop: "1px solid rgba(255,255,255,.12)",
      display: "flex",
      justifyContent: "space-between",
      fontSize: 12.5
    }
  }, /*#__PURE__*/React.createElement("span", null, "Copyright \xA9 TREND LINK. All rights reserved."), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: "rgba(255,255,255,.6)"
    }
  }, "\u7DB2\u7AD9\u5730\u5716"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: "rgba(255,255,255,.6)"
    }
  }, "\u4F7F\u7528\u8005\u689D\u6B3E"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: "rgba(255,255,255,.6)"
    }
  }, "\u500B\u8CC7\u96B1\u79C1\u6B0A\u8072\u660E"))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 24
    }
  }));
}
Object.assign(window, {
  TLIcons,
  WebHeader,
  WebFooter,
  Logo,
  NAV
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/WebChrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/WebSections.jsx
try { (() => {
// TrendLink marketing site — page sections. Exposes WebHero, WebServices,
// WebFeatures, WebStats, WebTestimonials, WebCTA on window.

function Eyebrow({
  children,
  light
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: ".14em",
      textTransform: "uppercase",
      color: light ? "var(--orange-300)" : "var(--orange-500)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 28,
      height: 3,
      borderRadius: 999,
      background: "var(--gradient-accent)"
    }
  }), children);
}
function WebHero() {
  const {
    Button,
    Badge
  } = window.TrendLinkDesignSystem_b2a0d6;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--gradient-header)",
      color: "#fff",
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right: -120,
      top: -80,
      width: 480,
      height: 480,
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(237,155,38,.22), transparent 70%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: "0 auto",
      padding: "84px 28px 92px",
      display: "grid",
      gridTemplateColumns: "1.15fr .85fr",
      gap: 48,
      alignItems: "center",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Badge, {
    tone: "orange",
    variant: "solid",
    style: {
      marginBottom: 20
    }
  }, "\u7B2C\u4E00\u5BB6\u53D6\u5F97\u80A1\u7968\u4EE3\u865F\u7684\u52DE\u8CC7\u9867\u554F\u516C\u53F8 \xB7 7645"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 52,
      fontWeight: 900,
      lineHeight: 1.18,
      color: "#fff",
      letterSpacing: ".01em"
    }
  }, "\u4E2D\u5C0F\u4F01\u696D", /*#__PURE__*/React.createElement("br", null), "\u6700\u4F73\u7684\u52DE\u8CC7\u9867\u554F"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 22,
      fontSize: 18,
      lineHeight: 1.9,
      color: "rgba(255,255,255,.86)",
      maxWidth: 460
    }
  }, "\u904B\u7528\u79D1\u6280\u529B\u91CF\uFF0C\u63D0\u4F9B\u5168\u65B9\u4F4D\u7684\u52DE\u8CC7\u6CD5\u52D9\u3001\u4EBA\u529B\u8CC7\u6E90\u89E3\u6C7A\u65B9\u6848\uFF0C\u5354\u52A9\u4F01\u696D\u9054\u6210\u7A69\u5B9A\u548C\u8AE7\u7684\u52DE\u8CC7\u95DC\u4FC2\u3002"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14,
      marginTop: 34
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    iconRight: window.TLIcons.arrow()
  }, "\u7ACB\u5373\u8AEE\u8A62"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "lg",
    style: {
      color: "#fff",
      border: "2px solid rgba(255,255,255,.4)"
    }
  }, "\u4E86\u89E3\u89E3\u6C7A\u65B9\u6848")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 38,
      marginTop: 44
    }
  }, [["800家+", "中小企業輔導"], ["20年", "團隊輔導經驗"], ["2018", "在地新創成立"]].map(([v, l]) => /*#__PURE__*/React.createElement("div", {
    key: l
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 32,
      fontWeight: 900,
      color: "#fff"
    }
  }, v), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "rgba(255,255,255,.7)",
      marginTop: 4
    }
  }, l))))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(255,255,255,.08)",
      border: "1px solid rgba(255,255,255,.18)",
      borderRadius: 24,
      padding: 26,
      backdropFilter: "blur(4px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff",
      borderRadius: 16,
      padding: "20px 22px",
      boxShadow: "var(--shadow-lg)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      fontWeight: 700,
      color: "var(--text-strong)"
    }
  }, "\u4E00\u9375\u767C\u85AA \xB7 \u672C\u6708\u85AA\u8CC7"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: "var(--success-500)",
      background: "var(--success-50)",
      padding: "3px 10px",
      borderRadius: 999
    }
  }, "\u6CD5\u9075 100%")), [["薪資總額", "NT$ 3,248,500", 1], ["出勤異常", "2 筆待確認", 0], ["本月排班", "已完成 28/28", 1]].map(([k, v, ok]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "11px 0",
      borderBottom: "1px solid var(--neutral-100)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: "var(--text-muted)"
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: ok ? "var(--text-strong)" : "var(--orange-600)"
    }
  }, v))), /*#__PURE__*/React.createElement("button", {
    style: {
      marginTop: 16,
      width: "100%",
      height: 42,
      border: "none",
      borderRadius: 999,
      background: "var(--gradient-accent)",
      color: "#fff",
      fontWeight: 700,
      fontSize: 14,
      cursor: "pointer",
      fontFamily: "var(--font-sans)"
    }
  }, "\u4E00\u9375\u7522\u751F\u85AA\u8CC7\u5831\u8868")))));
}
function ServiceCard({
  icon,
  tone,
  eyebrow,
  title,
  body
}) {
  const {
    Card,
    CardIcon
  } = window.TrendLinkDesignSystem_b2a0d6;
  return /*#__PURE__*/React.createElement(Card, {
    accent: tone,
    hoverable: true,
    style: {
      padding: 30
    }
  }, /*#__PURE__*/React.createElement(CardIcon, {
    tone: tone
  }, icon), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      fontSize: 13,
      fontWeight: 700,
      color: tone === "orange" ? "var(--orange-500)" : "var(--blue-600)"
    }
  }, eyebrow), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: "6px 0 10px",
      fontSize: 20,
      color: "var(--text-strong)"
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14.5,
      lineHeight: 1.85,
      color: "var(--text-muted)"
    }
  }, body), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      display: "flex",
      alignItems: "center",
      gap: 6,
      fontSize: 14,
      fontWeight: 700,
      color: "var(--blue-600)"
    }
  }, "\u4E86\u89E3\u66F4\u591A ", window.TLIcons.arrow({
    s: 16
  })));
}
function WebServices() {
  const I = window.TLIcons;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--surface-page)",
      padding: "var(--section-pad-y) 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: "0 auto",
      padding: "0 28px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginBottom: 48
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "SOLUTIONS"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 36,
      color: "var(--text-strong)",
      marginTop: 14
    }
  }, "\u904B\u7528\u79D1\u6280\u529B\u91CF\u3000\u63D0\u4F9B\u5168\u65B9\u4F4D\u89E3\u6C7A\u65B9\u6848")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 22
    }
  }, /*#__PURE__*/React.createElement(ServiceCard, {
    tone: "blue",
    icon: I.payroll(),
    eyebrow: "\u4E00\u9375\u767C\u85AA \u96F2\u7AEF\u4EBA\u8CC7\u7CFB\u7D71",
    title: "\u63D0\u4F9B\u9AD8\u6548\u4EBA\u4E8B\u7BA1\u7406\u4ECB\u9762",
    body: "\u96F2\u7AEF\u5373\u53EF\u5B8C\u6210\u8A08\u85AA\u3001\u6392\u73ED\u3001\u4F11\u5047\u3001\u5DEE\u52E4\u7BA1\u7406\uFF0C\u63D0\u5347\u4EBA\u8CC7\u57F7\u884C\u529B\uFF0C\u8F15\u9B06\u63A5\u8ECC\u6578\u4F4D\u8F49\u578B\u3002"
  }), /*#__PURE__*/React.createElement(ServiceCard, {
    tone: "orange",
    icon: I.chart(),
    eyebrow: "\u65E5\u65E5\u8003\u6838 \u7E3E\u6548\u7BA1\u7406\u7CFB\u7D71",
    title: "\u5354\u52A9\u6DF1\u5316\u4EBA\u529B\u8CC7\u672C",
    body: "\u9996\u5275\u884C\u70BA\u7A4D\u5206\u5236\uFF0C\u9F13\u52F5\u6709\u52A9\u4F01\u696D\u76EE\u6A19\u4E4B\u65E5\u5E38\u884C\u70BA\uFF0C\u8003\u6838\u6A19\u6E96\u66F4\u900F\u660E\uFF0C\u64CD\u4F5C\u66F4\u4FBF\u5229\u3002"
  }), /*#__PURE__*/React.createElement(ServiceCard, {
    tone: "blue",
    icon: I.shield(),
    eyebrow: "\u9867\u554F\u670D\u52D9",
    title: "\u5EFA\u7ACB\u5B8C\u5584\u4EBA\u8CC7\u7BA1\u7406\u5236\u5EA6",
    body: "\u900F\u904E\u5C08\u696D\u9867\u554F\u9762\u8AC7\u8207\u8F14\u5C0E\uFF0C\u7D50\u5408\u8077\u80FD\u5206\u6790\u5EFA\u7ACB\u5B8C\u6574\u4EBA\u8CC7\u5236\u5EA6\uFF0C\u9054\u6210\u52DE\u8CC7\u548C\u8AE7\u7A69\u5065\u767C\u5C55\u3002"
  }), /*#__PURE__*/React.createElement(ServiceCard, {
    tone: "orange",
    icon: I.grad(),
    eyebrow: "\u4F01\u696D\u57F9\u8A13",
    title: "\u500B\u6848\u898F\u5283\u4F01\u696D\u4EBA\u624D\u57F9\u8A13",
    body: "\u70BA\u4F01\u696D\u91CF\u8EAB\u8A02\u88FD\u6559\u80B2\u8A13\u7DF4\u8AB2\u7A0B\uFF0C\u7531\u5BE6\u52D9\u7D93\u9A57\u8C50\u5BCC\u7684\u8B1B\u5E2B\uFF0C\u5275\u9020\u6700\u5145\u5BE6\u7684\u5B78\u7FD2\u7D93\u9A57\u3002"
  }))));
}
function WebFeatures() {
  const items = [["01", "豐富企業輔導經驗", "經營團隊擁有近 20 年的輔導經驗，為您分析潛藏風險，並給予具體建議與改善計劃。"], ["02", "量身打造服務內容", "依照您面臨的問題，量身規劃最適解決方案，逐步執行，讓管理者與員工皆有所依循。"], ["03", "持續性的解決方案", "以人資系統與顧問輔導，協助企業落實日常執行、樹立管理方針，全面提升執行效率。"], ["04", "重視管理價值提升", "透過系統使用數據，定期產出風險報告與 ESG 資訊，挹注管理價值，協助持續成長。"]];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "#fff",
      padding: "var(--section-pad-y) 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: "0 auto",
      padding: "0 28px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 44
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "WHY TRENDLINK"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 34,
      color: "var(--text-strong)",
      marginTop: 14
    }
  }, "\u6301\u7E8C\u9032\u6B65\u3000\u624D\u80FD\u505A\u60A8\u5805\u5BE6\u7684\u5F8C\u76FE")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 28
    }
  }, items.map(([n, t, b]) => /*#__PURE__*/React.createElement("div", {
    key: n,
    style: {
      borderTop: "3px solid var(--blue-100)",
      paddingTop: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 40,
      fontWeight: 900,
      color: "var(--orange-400)",
      lineHeight: 1
    }
  }, n), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: "14px 0 8px",
      fontSize: 18,
      color: "var(--text-strong)"
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      lineHeight: 1.85,
      color: "var(--text-muted)"
    }
  }, b))))));
}
function WebTestimonials() {
  const data = [["涵曦有限公司", "皮拉提斯工作室 · 台北", "透過顧問服務分析承攬制度風險，改以僱傭方式合作，確保核心團隊穩定性與法定權益。", "涵"], ["樂台羽茶", "連鎖飲料 · 加盟管理", "檢視品牌管理制度，透過員工佈達會與加盟主會議，促進管理規劃落地，避免觸法風險。", "樂"], ["東明健康福祉集團", "長照事業 · 多元職類", "協助強化勞資雙方溝通、優化內部管理，為集團長遠發展奠定堅實基礎。", "東"]];
  const {
    Card,
    Avatar
  } = window.TrendLinkDesignSystem_b2a0d6;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--surface-brand-soft)",
      padding: "var(--section-pad-y) 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: "0 auto",
      padding: "0 28px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginBottom: 44
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "CUSTOMERS"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 34,
      color: "var(--text-strong)",
      marginTop: 14
    }
  }, "\u5BA2\u6236\u771F\u5FC3\u8A71")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 24
    }
  }, data.map(([n, role, quote, ini]) => /*#__PURE__*/React.createElement(Card, {
    key: n,
    style: {
      padding: 30
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--orange-300)"
    }
  }, window.TLIcons.quote({
    s: 34
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "14px 0 24px",
      fontSize: 15,
      lineHeight: 1.95,
      color: "var(--text-body)"
    }
  }, quote), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      borderTop: "1px solid var(--neutral-100)",
      paddingTop: 18
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: ini,
    tone: "navy"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 15,
      color: "var(--text-strong)"
    }
  }, n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: "var(--text-muted)"
    }
  }, role))))))));
}
function WebCTA() {
  const {
    Button
  } = window.TrendLinkDesignSystem_b2a0d6;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--gradient-header)",
      color: "#fff",
      textAlign: "center",
      padding: "72px 28px"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    light: true
  }, "CONTACT US"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 36,
      color: "#fff",
      margin: "16px 0 10px"
    }
  }, "\u8B93\u6211\u5011\u6210\u70BA\u60A8\u7684\u5C08\u696D\u9867\u554F"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 17,
      color: "rgba(255,255,255,.85)",
      marginBottom: 30
    }
  }, "\u9081\u5411\u548C\u8AE7\u52DE\u8CC7\u65B0\u95DC\u4FC2"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    iconRight: window.TLIcons.arrow()
  }, "\u7ACB\u5373\u8AEE\u8A62"));
}
Object.assign(window, {
  WebHero,
  WebServices,
  WebFeatures,
  WebTestimonials,
  WebCTA,
  Eyebrow
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/WebSections.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.CardIcon = __ds_scope.CardIcon;

__ds_ns.Stat = __ds_scope.Stat;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Alert = __ds_scope.Alert;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
