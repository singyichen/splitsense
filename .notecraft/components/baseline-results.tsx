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
const TFIDF = "#9dbde4";
const GOLD = "#ed9b26";
const GREY = "#cbd3df";
const MUTED = "#6c798e";
const INK = "#262e3d";

const CEILING = 40.5;
const FLOOR = 9.5;

type Row = { 方法: string; "R@10%": number; tone: "floor" | "rule" | "tfidf" | "bge" };

const BARS: Row[] = [
  { 方法: "隨機排序", "R@10%": 9.5, tone: "floor" },
  { 方法: "可見 entropy", "R@10%": 9.9, tone: "floor" },
  { 方法: "同意標籤查表", "R@10%": 18.5, tone: "rule" },
  { 方法: "LR（TF-IDF）", "R@10%": 19.3, tone: "tfidf" },
  { 方法: "GB（TF-IDF）", "R@10%": 19.4, tone: "tfidf" },
  { 方法: "LR（BGE-M3）", "R@10%": 21.8, tone: "bge" },
];

const TONE: Record<Row["tone"], string> = {
  floor: GREY,
  rule: GOLD,
  tfidf: TFIDF,
  bge: NAVY,
};

// 逐 seed 的實測 R@10%，直接取自 artifacts/models/per_seed_r10_hard.csv，不是從平均反推
const PAIRED: { seed: number; prior: number; tfidf: number; bge: number }[] = [
  { seed: 0, prior: 17.83, tfidf: 18.73, bge: 21.45 },
  { seed: 1, prior: 18.96, tfidf: 19.47, bge: 22.0 },
  { seed: 2, prior: 19.41, tfidf: 20.56, bge: 22.09 },
  { seed: 3, prior: 17.79, tfidf: 18.84, bge: 22.27 },
  { seed: 4, prior: 18.88, tfidf: 19.14, bge: 21.17 },
];

const SLOPE_W = 520;
const SLOPE_H = 300;
const LEFT_X = 118;
const MID_X = 268;
const RIGHT_X = 418;
const Y_MIN = 17.4;
const Y_MAX = 22.6;
const TOP_Y = 34;
const BOT_Y = SLOPE_H - 58;
const toY = (value: number) =>
  BOT_Y - ((value - Y_MIN) / (Y_MAX - Y_MIN)) * (BOT_Y - TOP_Y);

/** 標籤太近就往下推開，資料點本身不動 */
function nudged(values: number[], gap = 12) {
  const ys = values.map(toY);
  const order = [...ys.keys()].sort((a, b) => ys[a] - ys[b]);
  const out = [...ys];
  for (let k = 1; k < order.length; k += 1) {
    const prev = order[k - 1];
    const cur = order[k];
    if (out[cur] - out[prev] < gap) out[cur] = out[prev] + gap;
  }
  return out;
}

function SlopeChart() {
  const priorLabels = nudged(PAIRED.map((r) => r.prior));
  const tfidfLabels = nudged(PAIRED.map((r) => r.tfidf), 13);
  const bgeLabels = nudged(PAIRED.map((r) => r.bge));

  return (
    <svg
      viewBox={`0 0 ${SLOPE_W} ${SLOPE_H}`}
      width="100%"
      role="img"
      aria-label="三欄斜線圖：五個 reveal seed 上查表、TF-IDF Logistic Regression 與 BGE-M3 Logistic Regression 的 Recall@10%"
    >
      {[LEFT_X, MID_X, RIGHT_X].map((x) => (
        <line key={x} x1={x} y1={TOP_Y - 14} x2={x} y2={BOT_Y} stroke="#e1e6ee" strokeWidth="1.5" />
      ))}

      {PAIRED.map((row, i) => (
        <g key={row.seed}>
          <line x1={LEFT_X} y1={toY(row.prior)} x2={MID_X} y2={toY(row.tfidf)} stroke="#b4bdcb" strokeWidth="1.6" />
          <line x1={MID_X} y1={toY(row.tfidf)} x2={RIGHT_X} y2={toY(row.bge)} stroke={NAVY} strokeWidth="2" opacity="0.7" />
          <circle cx={LEFT_X} cy={toY(row.prior)} r="4" fill={GOLD} />
          <circle cx={MID_X} cy={toY(row.tfidf)} r="4" fill={TFIDF} />
          <circle cx={RIGHT_X} cy={toY(row.bge)} r="4" fill={NAVY} />
          <text x={LEFT_X - 10} y={priorLabels[i] + 4} textAnchor="end" fontSize="11" fill={MUTED} className="tabular-nums">
            {row.prior.toFixed(2)}
          </text>
          <text x={MID_X + 8} y={tfidfLabels[i] + 13} fontSize="11" fill={MUTED} className="tabular-nums">
            {row.tfidf.toFixed(2)}
          </text>
          <text x={RIGHT_X + 10} y={bgeLabels[i] + 4} fontSize="11" fill={INK} className="tabular-nums">
            {row.bge.toFixed(2)}
          </text>
          <text x={LEFT_X - 52} y={priorLabels[i] + 4} textAnchor="end" fontSize="10.5" fill="#9aa6b8">
            seed {row.seed}
          </text>
        </g>
      ))}

      <text x={LEFT_X} y={SLOPE_H - 32} textAnchor="middle" fontSize="12" fontWeight="600" fill={GOLD}>
        同意標籤查表
      </text>
      <text x={MID_X} y={SLOPE_H - 32} textAnchor="middle" fontSize="12" fontWeight="600" fill="#4f5b6e">
        LR（TF-IDF）
      </text>
      <text x={RIGHT_X} y={SLOPE_H - 32} textAnchor="middle" fontSize="12" fontWeight="600" fill={NAVY}>
        LR（BGE-M3）
      </text>
      <text x={SLOPE_W / 2} y="16" textAnchor="middle" fontSize="12" fill={MUTED}>
        第一段小而穩，第二段大而穩——兩段都是 5/5 全勝
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
              {" "}一張四列查表（18.5）幾乎與 TF-IDF 模型（19.3）等高；
            </span>
            <span className="font-semibold" style={{ color: NAVY }}>
              真正拉開差距的是換掉文字表示（21.8）。
            </span>
          </p>
        </>
      ) : (
        <>
          <SlopeChart />
          <p className="rounded-lg bg-[#f6f8fb] px-4 py-3 text-sm leading-relaxed text-[#3a4456]">
            三者跑在相同的 5 組 reveal seed 上，所以可以逐組相減。對查表：TF-IDF LR{" "}
            <span className="font-semibold text-[#6c798e]">+0.77 ± 0.38</span>、BGE-M3 LR{" "}
            <span className="font-semibold text-[#1b4f9c]">+3.22 ± 0.86</span>，兩者都是 5/5 全勝。
            兩個模型互比是{" "}
            <span className="font-semibold text-[#1b4f9c]">+2.45 ± 0.72、5/5</span>——
            BGE 的五個 seed 全部高過 TF-IDF 的最高分 20.56。
          </p>
        </>
      )}
    </div>
  );
}
