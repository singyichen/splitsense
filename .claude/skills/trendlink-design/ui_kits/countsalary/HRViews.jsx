// 一鍵發薪 app — content views. Exposes HRDashboard, HRPayroll on window.

function KPI({ label, value, suffix, delta, tone }) {
  const { Card } = window.TrendLinkDesignSystem_b2a0d6;
  return (
    <Card style={{ padding: 20 }}>
      <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginTop: 8 }}>
        <span style={{ fontSize: 30, fontWeight: 900, color: tone === "orange" ? "var(--orange-500)" : "var(--blue-700)" }}>{value}</span>
        {suffix && <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-muted)" }}>{suffix}</span>}
      </div>
      {delta && <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 4, fontSize: 12.5, fontWeight: 700, color: "var(--success-500)" }}>{window.AppIcons.up({ s: 14 })}{delta}</div>}
    </Card>
  );
}

function SectionHead({ title, sub, action }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 16 }}>
      <div>
        <h2 style={{ fontSize: 19, color: "var(--text-strong)", margin: 0 }}>{title}</h2>
        {sub && <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>{sub}</div>}
      </div>
      {action}
    </div>
  );
}

function HRDashboard() {
  const { Card, Badge } = window.TrendLinkDesignSystem_b2a0d6;
  const rows = [
    ["王曉明", "業務部", "正常", "08:58 / 18:02", "success"],
    ["李佩珊", "行政部", "遲到 12 分", "09:12 / 18:05", "warning"],
    ["陳建豪", "技術部", "正常", "08:45 / 19:30", "success"],
    ["林宜蓁", "業務部", "特休", "—", "neutral"],
    ["張家瑋", "技術部", "正常", "09:00 / 18:00", "success"],
  ];
  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 24, color: "var(--text-strong)", margin: 0 }}>早安，曉明 👋</h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", margin: "6px 0 0" }}>2026 年 6 月 · 本月人事管理總覽</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 26 }}>
        <KPI label="在職員工" value="42" suffix="人" delta="+3 本月" />
        <KPI label="本月薪資總額" value="3.24" suffix="M" tone="orange" delta="+5.2%" />
        <KPI label="出勤異常" value="2" suffix="筆" />
        <KPI label="待簽核休假" value="5" suffix="件" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20 }}>
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "18px 20px" }}><SectionHead title="今日出勤" sub="即時打卡狀態" action={<Badge tone="blue">5 / 42 已顯示</Badge>} /></div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
            <thead><tr style={{ background: "var(--surface-sunken)", color: "var(--text-muted)", textAlign: "left" }}>
              {["員工","部門","狀態","上 / 下班"].map(h => <th key={h} style={{ padding: "10px 20px", fontWeight: 600, fontSize: 12.5 }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} style={{ borderTop: "1px solid var(--neutral-100)" }}>
                  <td style={{ padding: "12px 20px", fontWeight: 600, color: "var(--text-strong)" }}>{r[0]}</td>
                  <td style={{ padding: "12px 20px", color: "var(--text-muted)" }}>{r[1]}</td>
                  <td style={{ padding: "12px 20px" }}><Badge tone={r[4]}>{r[2]}</Badge></td>
                  <td style={{ padding: "12px 20px", color: "var(--text-body)", fontVariantNumeric: "tabular-nums" }}>{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card accent="orange" style={{ padding: 22 }}>
          <SectionHead title="法遵提醒" />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[["基本工資調漲","2026/01 起 28,590 元，已套用","success"],["加班時數","技術部 2 人接近月上限","warning"],["勞退提繳","本月已自動試算完成","success"]].map(([t,d,tn]) => (
              <div key={t} style={{ display: "flex", gap: 11, padding: "12px 13px", borderRadius: 10, background: tn === "warning" ? "var(--warning-50)" : "var(--success-50)" }}>
                <span style={{ width: 8, height: 8, borderRadius: 999, background: tn === "warning" ? "var(--warning-500)" : "var(--success-500)", marginTop: 6, flex: "none" }} />
                <div><div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-strong)" }}>{t}</div><div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 2, lineHeight: 1.6 }}>{d}</div></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function HRPayroll() {
  const { Card, Button, Badge, Tabs } = window.TrendLinkDesignSystem_b2a0d6;
  const rows = [
    ["王曉明","業務部","48,000","6,200","2,180","52,020"],
    ["李佩珊","行政部","38,000","1,500","1,710","37,790"],
    ["陳建豪","技術部","62,000","8,400","2,790","67,610"],
    ["林宜蓁","業務部","45,000","0","2,025","42,975"],
    ["張家瑋","技術部","58,000","4,100","2,610","59,490"],
    ["黃詩涵","行政部","40,000","800","1,800","39,000"],
  ];
  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ fontSize: 24, color: "var(--text-strong)", margin: 0 }}>薪資計算</h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", margin: "6px 0 0" }}>2026 年 6 月薪資 · 自動帶入出勤與加班資料</p>
      </div>
      <Tabs defaultValue="payroll" style={{ marginBottom: 20 }} items={[
        { id: "attendance", label: "出勤" }, { id: "timeoff", label: "休假" },
        { id: "scheduling", label: "排班" }, { id: "payroll", label: "薪資計算" }, { id: "report", label: "管理報告" },
      ]} />
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--neutral-100)" }}>
          <div style={{ display: "flex", gap: 10 }}>
            <Badge tone="blue" variant="soft">42 名員工</Badge>
            <Badge tone="success" variant="soft">已試算</Badge>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Button variant="outline" size="sm" iconLeft={window.AppIcons.download({ s: 15 })}>匯出報表</Button>
            <Button variant="primary" size="sm">一鍵發薪</Button>
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
          <thead><tr style={{ background: "var(--surface-sunken)", color: "var(--text-muted)", textAlign: "right" }}>
            {["員工","部門","本薪","加班費","勞健保","實發金額"].map((h,i) => <th key={h} style={{ padding: "11px 20px", fontWeight: 600, fontSize: 12.5, textAlign: i < 2 ? "left" : "right" }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{ borderTop: "1px solid var(--neutral-100)" }}>
                <td style={{ padding: "12px 20px", fontWeight: 600, color: "var(--text-strong)" }}>{r[0]}</td>
                <td style={{ padding: "12px 20px", color: "var(--text-muted)" }}>{r[1]}</td>
                <td style={{ padding: "12px 20px", textAlign: "right", fontVariantNumeric: "tabular-nums", color: "var(--text-body)" }}>{r[2]}</td>
                <td style={{ padding: "12px 20px", textAlign: "right", fontVariantNumeric: "tabular-nums", color: "var(--text-body)" }}>{r[3]}</td>
                <td style={{ padding: "12px 20px", textAlign: "right", fontVariantNumeric: "tabular-nums", color: "var(--text-muted)" }}>-{r[4]}</td>
                <td style={{ padding: "12px 20px", textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 800, color: "var(--blue-700)" }}>{r[5]}</td>
              </tr>
            ))}
          </tbody>
          <tfoot><tr style={{ borderTop: "2px solid var(--neutral-200)", background: "var(--blue-50)" }}>
            <td colSpan="5" style={{ padding: "14px 20px", fontWeight: 700, color: "var(--text-strong)" }}>本月實發總額</td>
            <td style={{ padding: "14px 20px", textAlign: "right", fontWeight: 900, fontSize: 16, color: "var(--blue-700)", fontVariantNumeric: "tabular-nums" }}>NT$ 298,885</td>
          </tr></tfoot>
        </table>
      </Card>
    </div>
  );
}

Object.assign(window, { HRDashboard, HRPayroll, KPI, SectionHead });
