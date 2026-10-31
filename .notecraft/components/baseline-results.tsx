import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const NAVY = "#1b4f9c";
const GOLD = "#ed9b26";
const GREY = "#cbd3df";
const MUTED = "#6c798e";
const INK = "#262e3d";

const CEILING = 40.5;
const FLOOR = 9.5;

type Row = { 方法: string; "R@10%": number; tone: "floor" | "rule" | "model" };

const BARS: Row[] = [
  { 方法: "隨機排序", "R@10%": 9.5, tone: "floor" },
  { 方法: "可見 entropy", "R@10%": 9.9, tone: "floor" },
  { 方法: "同意標籤查表", "R@10%": 18.5, tone: "rule" },
  { 方法: "Logistic Reg.", "R@10%": 19.4, tone: "model" },
  { 方法: "Gradient Boost.", "R@10%": 19.4, tone: "model" },
];

const TONE: Record<Row["tone"], string> = { floor: GREY, rule: GOLD, model: NAVY };

// 逐 seed 的實測 R@10%（artifacts/models），用於配對斜線圖
const PAIRED: { seed: number; prior: number; logreg: number }[] = [
  { seed: 0, prior: 17.83, logreg: 18.6 },
  { seed: 1, prior: 18.96, logreg: 19.72 },
  { seed: 2, prior: 19.41, logreg: 20.56 },
  { seed: 3, prior: 17.79, logreg: 18.84 },
  { seed: 4, prior: 18.88, logreg: 19.39 },
];

const SLOPE_W = 520;
const SLOPE_H = 280;
const LEFT_X = 150;
const RIGHT_X = 390;
const Y_MIN = 17.0;
const Y_MAX = 21.0;
const toY = (value: number) =>
  36 + (1 - (value - Y_MIN) / (Y_MAX - Y_MIN)) * (SLOPE_H - 80);

function SlopeChart() {
  return (
    <svg viewBox={`0 0 ${SLOPE_W} ${SLOPE_H}`} width="100%" role="img" aria-label="逐 seed 配對比較斜線圖">
      <line x1={LEFT_X} y1="30" x2={LEFT_X} y2={SLOPE_H - 44} stroke="#e1e6ee" strokeWidth="1.5" />
      <line x1={RIGHT_X} y1="30" x2={RIGHT_X} y2={SLOPE_H - 44} stroke="#e1e6ee" strokeWidth="1.5" />
      <text x={LEFT_X} y={SLOPE_H - 24} textAnchor="middle" fontSize="12.5" fontWeight="600" fill={GOLD}>
        同意標籤查表
      </text>
      <text x={RIGHT_X} y={SLOPE_H - 24} textAnchor="middle" fontSize="12.5" fontWeight="600" fill={NAVY}>
        Logistic Regression
      </text>

      {PAIRED.map((row) => {
        const y1 = toY(row.prior);
        const y2 = toY(row.logreg);
        return (
          <g key={row.seed}>
            <line x1={LEFT_X} y1={y1} x2={RIGHT_X} y2={y2} stroke={NAVY} strokeWidth="1.8" opacity="0.65" />
            <circle cx={LEFT_X} cy={y1} r="4.5" fill={GOLD} />
            <circle cx={RIGHT_X} cy={y2} r="4.5" fill={NAVY} />
            <text x={LEFT_X - 12} y={y1 + 4} textAnchor="end" fontSize="11.5" fill={MUTED} className="tabular-nums">
              {row.prior.toFixed(2)}
            </text>
            <text x={RIGHT_X + 12} y={y2 + 4} textAnchor="start" fontSize="11.5" fill={INK} className="tabular-nums">
              {row.logreg.toFixed(2)}
            </text>
            <text x={LEFT_X - 60} y={y1 + 4} textAnchor="end" fontSize="11" fill="#9aa6b8">
              seed {row.seed}
            </text>
          </g>
        );
      })}

      <text x={SLOPE_W / 2} y="18" textAnchor="middle" fontSize="12" fill={MUTED}>
        五條線全部向上，但每條都只翹一點點
      </text>
    </svg>
  );
}

export default function BaselineResults() {
  const [tab, setTab] = useState<"bars" | "paired">("bars");

  return (
    <div className="not-prose mx-auto max-w-2xl space-y-4">
      <div className="flex gap-2">
        {([
          ["bars", "排序成績"],
          ["paired", "配對比較"],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === key ? "bg-[#1b4f9c] text-white" : "bg-[#eef1f6] text-[#4f5b6e] hover:bg-[#e1e6ee]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "bars" ? (
        <>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BARS} margin={{ top: 28, right: 12, bottom: 4, left: 0 }}>
                <CartesianGrid vertical={false} stroke="#eef1f6" />
                <XAxis dataKey="方法" tickLine={false} axisLine={{ stroke: "#cbd3df" }} fontSize={11.5} interval={0} />
                <YAxis unit="%" domain={[0, 45]} tickLine={false} axisLine={false} fontSize={12} width={46} />
                <ReferenceLine
                  y={CEILING}
                  stroke={MUTED}
                  strokeDasharray="5 4"
                  label={{ value: `理論上限 ${CEILING}%`, position: "insideTopRight", fontSize: 11.5, fill: MUTED }}
                />
                <ReferenceLine y={FLOOR} stroke={GREY} strokeDasharray="4 3" />
                <Bar dataKey="R@10%" radius={[4, 4, 0, 0]} maxBarSize={58}>
                  {BARS.map((row) => (
                    <Cell key={row.方法} fill={TONE[row.tone]} />
                  ))}
                  <LabelList
                    dataKey="R@10%"
                    position="top"
                    fontSize={12.5}
                    fill="#3a4456"
                    formatter={(value: number) => `${value.toFixed(1)}`}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="rounded-lg bg-[#f6f8fb] px-4 py-3 text-sm leading-relaxed text-[#3a4456]">
            可見 entropy 貼著隨機地板線——它在這個子集恆為常數，等於亂猜。
            <span className="font-semibold" style={{ color: GOLD }}>
              {" "}而一張四列查表（18.5）幾乎與模型（19.4）等高。
            </span>
          </p>
        </>
      ) : (
        <>
          <SlopeChart />
          <p className="rounded-lg bg-[#f6f8fb] px-4 py-3 text-sm leading-relaxed text-[#3a4456]">
            兩者跑在相同的 5 組 reveal seed 上，所以可以逐組相減：配對差{" "}
            <span className="font-semibold text-[#1b4f9c]">+0.85 ± 0.26</span>、
            <span className="font-semibold text-[#1b4f9c]">5/5 全勝</span>。
            配對後標準差從各自的 ±0.8 掉到 0.26——優勢是真的，但很小。
          </p>
        </>
      )}
    </div>
  );
}
