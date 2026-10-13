// 一鍵發薪 app — shell (sidebar + topbar) and shared icons.
// Exposes AppIcons, AppShell on window.

const AppIcons = {
  grid: (p={}) => (<svg width={p.s||20} height={p.s||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>),
  clock: (p={}) => (<svg width={p.s||20} height={p.s||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>),
  cal: (p={}) => (<svg width={p.s||20} height={p.s||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>),
  layers: (p={}) => (<svg width={p.s||20} height={p.s||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/></svg>),
  money: (p={}) => (<svg width={p.s||20} height={p.s||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 12h.01M18 12h.01"/></svg>),
  report: (p={}) => (<svg width={p.s||20} height={p.s||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><rect x="7" y="11" width="3" height="6"/><rect x="13" y="7" width="3" height="10"/></svg>),
  bell: (p={}) => (<svg width={p.s||20} height={p.s||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>),
  search: (p={}) => (<svg width={p.s||18} height={p.s||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>),
  up: (p={}) => (<svg width={p.s||16} height={p.s||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7M12 5v14"/></svg>),
  download: (p={}) => (<svg width={p.s||16} height={p.s||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>),
};

const MENU = [
  ["grid", "總覽 Dashboard", "dashboard"],
  ["clock", "出勤管理", "attendance"],
  ["cal", "休假管理", "timeoff"],
  ["layers", "排班管理", "scheduling"],
  ["money", "薪資計算", "payroll"],
  ["report", "管理報告", "report"],
];

function AppShell({ active, onNav, children }) {
  const { Avatar, IconButton, Badge } = window.TrendLinkDesignSystem_b2a0d6;
  return (
    <div style={{ display: "flex", minHeight: 760, background: "var(--surface-page)", fontFamily: "var(--font-sans)" }}>
      {/* Sidebar */}
      <aside style={{ width: 240, background: "#fff", borderRight: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column", flex: "none" }}>
        <div style={{ height: 64, display: "flex", alignItems: "center", gap: 9, padding: "0 18px", borderBottom: "1px solid var(--border-subtle)" }}>
          <img src="../../assets/logo/trendlink-logo.jpeg" alt="" style={{ width: 34, height: 34, borderRadius: 7, objectFit: "contain" }} />
          <div style={{ lineHeight: 1.05 }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: "var(--blue-700)" }}>一鍵發薪</div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".14em", color: "var(--orange-500)" }}>CLOUD HR</div>
          </div>
        </div>
        <nav style={{ padding: "14px 12px", display: "flex", flexDirection: "column", gap: 3 }}>
          {MENU.map(([ic, label, id]) => {
            const on = id === active;
            return (
              <button key={id} onClick={() => onNav(id)} style={{
                display: "flex", alignItems: "center", gap: 11, padding: "11px 13px", border: "none",
                borderRadius: 10, cursor: "pointer", textAlign: "left", width: "100%",
                background: on ? "var(--blue-50)" : "transparent",
                color: on ? "var(--blue-700)" : "var(--text-muted)",
                fontWeight: on ? 700 : 500, fontSize: 14.5, fontFamily: "var(--font-sans)",
              }}>
                <span style={{ color: on ? "var(--blue-600)" : "var(--neutral-400)", display: "flex" }}>{AppIcons[ic]()}</span>
                {label}
              </button>
            );
          })}
        </nav>
        <div style={{ marginTop: "auto", margin: 12, padding: 14, borderRadius: 12, background: "var(--gradient-header)", color: "#fff" }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>需要顧問協助？</div>
          <div style={{ fontSize: 11.5, opacity: .85, margin: "5px 0 10px", lineHeight: 1.6 }}>勞動法務全方位諮詢</div>
          <button style={{ width: "100%", height: 34, border: "none", borderRadius: 999, background: "var(--gradient-accent)", color: "#fff", fontWeight: 700, fontSize: 12.5, cursor: "pointer", fontFamily: "var(--font-sans)" }}>預約諮詢</button>
        </div>
      </aside>
      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header style={{ height: 64, background: "#fff", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: 16, padding: "0 24px", flex: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, height: 40, padding: "0 14px", background: "var(--surface-sunken)", borderRadius: 999, width: 280, color: "var(--text-muted)" }}>
            {AppIcons.search()}<span style={{ fontSize: 13.5 }}>搜尋員工、報表…</span>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14 }}>
            <Badge tone="success" variant="soft">法遵查核 100%</Badge>
            <IconButton variant="soft" label="通知">{AppIcons.bell()}</IconButton>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <Avatar name="王" tone="navy" size="sm" />
              <div style={{ lineHeight: 1.15 }}><div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-strong)" }}>王曉明</div><div style={{ fontSize: 11, color: "var(--text-muted)" }}>涵曦有限公司</div></div>
            </div>
          </div>
        </header>
        <main style={{ padding: 28, overflow: "auto" }}>{children}</main>
      </div>
    </div>
  );
}

Object.assign(window, { AppIcons, AppShell, MENU });
