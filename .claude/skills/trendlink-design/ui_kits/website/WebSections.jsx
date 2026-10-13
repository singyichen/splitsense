// TrendLink marketing site — page sections. Exposes WebHero, WebServices,
// WebFeatures, WebStats, WebTestimonials, WebCTA on window.

function Eyebrow({ children, light }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 13, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: light ? "var(--orange-300)" : "var(--orange-500)" }}>
      <span style={{ width: 28, height: 3, borderRadius: 999, background: "var(--gradient-accent)" }} />{children}
    </span>
  );
}

function WebHero() {
  const { Button, Badge } = window.TrendLinkDesignSystem_b2a0d6;
  return (
    <section style={{ background: "var(--gradient-header)", color: "#fff", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", right: -120, top: -80, width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(237,155,38,.22), transparent 70%)" }} />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "84px 28px 92px", display: "grid", gridTemplateColumns: "1.15fr .85fr", gap: 48, alignItems: "center", position: "relative" }}>
        <div>
          <Badge tone="orange" variant="solid" style={{ marginBottom: 20 }}>第一家取得股票代號的勞資顧問公司 · 7645</Badge>
          <h1 style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.18, color: "#fff", letterSpacing: ".01em" }}>中小企業<br/>最佳的勞資顧問</h1>
          <p style={{ marginTop: 22, fontSize: 18, lineHeight: 1.9, color: "rgba(255,255,255,.86)", maxWidth: 460 }}>運用科技力量，提供全方位的勞資法務、人力資源解決方案，協助企業達成穩定和諧的勞資關係。</p>
          <div style={{ display: "flex", gap: 14, marginTop: 34 }}>
            <Button variant="primary" size="lg" iconRight={window.TLIcons.arrow()}>立即諮詢</Button>
            <Button variant="ghost" size="lg" style={{ color: "#fff", border: "2px solid rgba(255,255,255,.4)" }}>了解解決方案</Button>
          </div>
          <div style={{ display: "flex", gap: 38, marginTop: 44 }}>
            {[["800家+","中小企業輔導"],["20年","團隊輔導經驗"],["2018","在地新創成立"]].map(([v,l]) => (
              <div key={l}><div style={{ fontSize: 32, fontWeight: 900, color: "#fff" }}>{v}</div><div style={{ fontSize: 13, color: "rgba(255,255,255,.7)", marginTop: 4 }}>{l}</div></div>
            ))}
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.18)", borderRadius: 24, padding: 26, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "20px 22px", boxShadow: "var(--shadow-lg)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-strong)" }}>一鍵發薪 · 本月薪資</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--success-500)", background: "var(--success-50)", padding: "3px 10px", borderRadius: 999 }}>法遵 100%</span>
            </div>
            {[["薪資總額","NT$ 3,248,500",1],["出勤異常","2 筆待確認",0],["本月排班","已完成 28/28",1]].map(([k,v,ok]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: "1px solid var(--neutral-100)" }}>
                <span style={{ fontSize: 14, color: "var(--text-muted)" }}>{k}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: ok ? "var(--text-strong)" : "var(--orange-600)" }}>{v}</span>
              </div>
            ))}
            <button style={{ marginTop: 16, width: "100%", height: 42, border: "none", borderRadius: 999, background: "var(--gradient-accent)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "var(--font-sans)" }}>一鍵產生薪資報表</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ icon, tone, eyebrow, title, body }) {
  const { Card, CardIcon } = window.TrendLinkDesignSystem_b2a0d6;
  return (
    <Card accent={tone} hoverable style={{ padding: 30 }}>
      <CardIcon tone={tone}>{icon}</CardIcon>
      <div style={{ marginTop: 18, fontSize: 13, fontWeight: 700, color: tone === "orange" ? "var(--orange-500)" : "var(--blue-600)" }}>{eyebrow}</div>
      <h3 style={{ margin: "6px 0 10px", fontSize: 20, color: "var(--text-strong)" }}>{title}</h3>
      <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.85, color: "var(--text-muted)" }}>{body}</p>
      <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 700, color: "var(--blue-600)" }}>了解更多 {window.TLIcons.arrow({ s: 16 })}</div>
    </Card>
  );
}

function WebServices() {
  const I = window.TLIcons;
  return (
    <section style={{ background: "var(--surface-page)", padding: "var(--section-pad-y) 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 28px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Eyebrow>SOLUTIONS</Eyebrow>
          <h2 style={{ fontSize: 36, color: "var(--text-strong)", marginTop: 14 }}>運用科技力量　提供全方位解決方案</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 22 }}>
          <ServiceCard tone="blue" icon={I.payroll()} eyebrow="一鍵發薪 雲端人資系統" title="提供高效人事管理介面" body="雲端即可完成計薪、排班、休假、差勤管理，提升人資執行力，輕鬆接軌數位轉型。" />
          <ServiceCard tone="orange" icon={I.chart()} eyebrow="日日考核 績效管理系統" title="協助深化人力資本" body="首創行為積分制，鼓勵有助企業目標之日常行為，考核標準更透明，操作更便利。" />
          <ServiceCard tone="blue" icon={I.shield()} eyebrow="顧問服務" title="建立完善人資管理制度" body="透過專業顧問面談與輔導，結合職能分析建立完整人資制度，達成勞資和諧穩健發展。" />
          <ServiceCard tone="orange" icon={I.grad()} eyebrow="企業培訓" title="個案規劃企業人才培訓" body="為企業量身訂製教育訓練課程，由實務經驗豐富的講師，創造最充實的學習經驗。" />
        </div>
      </div>
    </section>
  );
}

function WebFeatures() {
  const items = [
    ["01","豐富企業輔導經驗","經營團隊擁有近 20 年的輔導經驗，為您分析潛藏風險，並給予具體建議與改善計劃。"],
    ["02","量身打造服務內容","依照您面臨的問題，量身規劃最適解決方案，逐步執行，讓管理者與員工皆有所依循。"],
    ["03","持續性的解決方案","以人資系統與顧問輔導，協助企業落實日常執行、樹立管理方針，全面提升執行效率。"],
    ["04","重視管理價值提升","透過系統使用數據，定期產出風險報告與 ESG 資訊，挹注管理價值，協助持續成長。"],
  ];
  return (
    <section style={{ background: "#fff", padding: "var(--section-pad-y) 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 28px" }}>
        <div style={{ marginBottom: 44 }}>
          <Eyebrow>WHY TRENDLINK</Eyebrow>
          <h2 style={{ fontSize: 34, color: "var(--text-strong)", marginTop: 14 }}>持續進步　才能做您堅實的後盾</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 28 }}>
          {items.map(([n,t,b]) => (
            <div key={n} style={{ borderTop: "3px solid var(--blue-100)", paddingTop: 20 }}>
              <div style={{ fontSize: 40, fontWeight: 900, color: "var(--orange-400)", lineHeight: 1 }}>{n}</div>
              <h3 style={{ margin: "14px 0 8px", fontSize: 18, color: "var(--text-strong)" }}>{t}</h3>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.85, color: "var(--text-muted)" }}>{b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WebTestimonials() {
  const data = [
    ["涵曦有限公司","皮拉提斯工作室 · 台北","透過顧問服務分析承攬制度風險，改以僱傭方式合作，確保核心團隊穩定性與法定權益。","涵"],
    ["樂台羽茶","連鎖飲料 · 加盟管理","檢視品牌管理制度，透過員工佈達會與加盟主會議，促進管理規劃落地，避免觸法風險。","樂"],
    ["東明健康福祉集團","長照事業 · 多元職類","協助強化勞資雙方溝通、優化內部管理，為集團長遠發展奠定堅實基礎。","東"],
  ];
  const { Card, Avatar } = window.TrendLinkDesignSystem_b2a0d6;
  return (
    <section style={{ background: "var(--surface-brand-soft)", padding: "var(--section-pad-y) 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 28px" }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <Eyebrow>CUSTOMERS</Eyebrow>
          <h2 style={{ fontSize: 34, color: "var(--text-strong)", marginTop: 14 }}>客戶真心話</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {data.map(([n,role,quote,ini]) => (
            <Card key={n} style={{ padding: 30 }}>
              <div style={{ color: "var(--orange-300)" }}>{window.TLIcons.quote({ s: 34 })}</div>
              <p style={{ margin: "14px 0 24px", fontSize: 15, lineHeight: 1.95, color: "var(--text-body)" }}>{quote}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, borderTop: "1px solid var(--neutral-100)", paddingTop: 18 }}>
                <Avatar name={ini} tone="navy" />
                <div><div style={{ fontWeight: 700, fontSize: 15, color: "var(--text-strong)" }}>{n}</div><div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{role}</div></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function WebCTA() {
  const { Button } = window.TrendLinkDesignSystem_b2a0d6;
  return (
    <section style={{ background: "var(--gradient-header)", color: "#fff", textAlign: "center", padding: "72px 28px" }}>
      <Eyebrow light>CONTACT US</Eyebrow>
      <h2 style={{ fontSize: 36, color: "#fff", margin: "16px 0 10px" }}>讓我們成為您的專業顧問</h2>
      <p style={{ fontSize: 17, color: "rgba(255,255,255,.85)", marginBottom: 30 }}>邁向和諧勞資新關係</p>
      <Button variant="primary" size="lg" iconRight={window.TLIcons.arrow()}>立即諮詢</Button>
    </section>
  );
}

Object.assign(window, { WebHero, WebServices, WebFeatures, WebTestimonials, WebCTA, Eyebrow });
