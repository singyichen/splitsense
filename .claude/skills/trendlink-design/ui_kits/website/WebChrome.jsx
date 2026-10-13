// TrendLink marketing site — shared inline icons + header/footer
// Exposes: TLIcons, WebHeader, WebFooter on window.

const TLIcons = {
  search: (p={}) => (<svg width={p.s||20} height={p.s||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>),
  chevDown: (p={}) => (<svg width={p.s||16} height={p.s||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>),
  arrow: (p={}) => (<svg width={p.s||18} height={p.s||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>),
  payroll: (p={}) => (<svg width={p.s||30} height={p.s||30} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M7 15h4"/><circle cx="16.5" cy="15" r="1.2"/></svg>),
  chart: (p={}) => (<svg width={p.s||30} height={p.s||30} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><rect x="7" y="11" width="3" height="6"/><rect x="13" y="7" width="3" height="10"/></svg>),
  shield: (p={}) => (<svg width={p.s||30} height={p.s||30} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>),
  grad: (p={}) => (<svg width={p.s||30} height={p.s||30} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1 3 3 6 3s6-2 6-3v-5"/></svg>),
  users: (p={}) => (<svg width={p.s||30} height={p.s||30} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11"/></svg>),
  doc: (p={}) => (<svg width={p.s||30} height={p.s||30} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/></svg>),
  spark: (p={}) => (<svg width={p.s||30} height={p.s||30} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/></svg>),
  quote: (p={}) => (<svg width={p.s||30} height={p.s||30} viewBox="0 0 24 24" fill="currentColor"><path d="M7 7H4a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2v3a2 2 0 0 1-2 2H3v2h1a4 4 0 0 0 4-4V9a2 2 0 0 0-1-2Zm13 0h-3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2v3a2 2 0 0 1-2 2h-1v2h1a4 4 0 0 0 4-4V9a2 2 0 0 0-1-2Z"/></svg>),
};

const NAV = ["關於我們","最新消息","解決方案","課程與講座","軟體服務","顧問服務","客戶真心話","部落格","客服中心"];

function Logo({ dark }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <img src="../../assets/logo/trendlink-logo.jpeg" alt="TrendLink"
        style={{ width: 44, height: 44, borderRadius: 9, background: "#fff", padding: 2, objectFit: "contain" }} />
      <div style={{ lineHeight: 1 }}>
        <div style={{ fontSize: 19, fontWeight: 900, letterSpacing: ".05em", color: dark ? "#fff" : "var(--blue-700)" }}>聯和趨動</div>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".22em", marginTop: 3, color: dark ? "var(--orange-300)" : "var(--orange-500)" }}>TREND LINK · 7645</div>
      </div>
    </div>
  );
}

function WebHeader() {
  const { IconButton } = window.TrendLinkDesignSystem_b2a0d6;
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 100, height: 76,
      background: "var(--gradient-header)", boxShadow: "var(--shadow-md)",
      display: "flex", alignItems: "center",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 28px", width: "100%", display: "flex", alignItems: "center", gap: 28 }}>
        <Logo dark />
        <nav style={{ display: "flex", gap: 4, marginLeft: "auto" }}>
          {NAV.map((n, i) => (
            <a key={n} href="#" style={{
              display: "flex", alignItems: "center", gap: 3, padding: "8px 11px",
              color: i === 2 ? "#fff" : "rgba(255,255,255,.9)", fontSize: 14.5, fontWeight: i === 2 ? 700 : 500,
              borderRadius: 8, position: "relative",
            }}>{n}{(i===0||i===3||i===4||i===5||i===8) && TLIcons.chevDown({s:13})}</a>
          ))}
        </nav>
        <IconButton variant="accent" label="搜尋" style={{ marginLeft: 4 }}>{TLIcons.search()}</IconButton>
      </div>
    </header>
  );
}

function WebFooter() {
  const cols = [
    ["認識我們", ["關於聯和趨動","顧問團隊","最新消息","永續發展承諾","道德與合規"]],
    ["服務項目", ["一鍵發薪人資系統","日日考核績效系統","勞資法務顧問輔導","職能考核輔導","薪資委外服務","企業培訓"]],
    ["客服中心", ["服務據點","線上諮詢","成為合作夥伴","常見問題"]],
  ];
  return (
    <footer style={{ background: "var(--blue-950)", color: "rgba(255,255,255,.72)", paddingTop: 56 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 28px", display: "grid", gridTemplateColumns: "1.4fr 1fr 1.2fr 1fr", gap: 36 }}>
        <div>
          <Logo dark />
          <div style={{ marginTop: 18, fontSize: 13.5, lineHeight: 2 }}>
            <div>聯和趨動股份有限公司</div>
            <div>高雄市前鎮區復興四路2號四樓之一</div>
            <div>07-973-5000　週一至週五 9:00–17:30</div>
          </div>
        </div>
        {cols.map(([t, items]) => (
          <div key={t}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 14 }}>{t}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {items.map(i => <a key={i} href="#" style={{ color: "rgba(255,255,255,.72)", fontSize: 13.5 }}>{i}</a>)}
            </div>
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 1280, margin: "36px auto 0", padding: "20px 28px", borderTop: "1px solid rgba(255,255,255,.12)", display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
        <span>Copyright © TREND LINK. All rights reserved.</span>
        <span style={{ display: "flex", gap: 18 }}><a href="#" style={{color:"rgba(255,255,255,.6)"}}>網站地圖</a><a href="#" style={{color:"rgba(255,255,255,.6)"}}>使用者條款</a><a href="#" style={{color:"rgba(255,255,255,.6)"}}>個資隱私權聲明</a></span>
      </div>
      <div style={{ height: 24 }} />
    </footer>
  );
}

Object.assign(window, { TLIcons, WebHeader, WebFooter, Logo, NAV });
