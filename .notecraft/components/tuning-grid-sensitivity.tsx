// C 格線的敏感度：切換「只看平均」與「含誤差棒」，看排名在誤差面前解體。
// 數字正本是 docs/00-research-spec.mdx §8.4.1 的格線表（2026-11-09 那次執行）。
// 格線是 C ∈ {0.001, 0.003, 0.01, 0.1, 1.0, 10.0} × class_weight ∈ {None, balanced} = 12 個點；
// 規格只記錄了四個格點的 CV 分數，這裡就只畫這四個，不補值。

import { useState } from "react";

const NAVY = "#1b4f9c";
const GOLD = "#ed9b26";
const INK = "#262e3d";
const MUTED = "#6c798e";

type Point = { rank: number; c: string; mean: number; sd: number; note?: string };

const POINTS: Point[] = [
  { rank: 1, c: "0.003", mean: 19.422, sd: 0.749, note: "定案" },
  { rank: 2, c: "0.01", mean: 19.4164, sd: 0.673 },
  { rank: 3, c: "0.1", mean: 19.3755, sd: 1.134 },
  { rank: 6, c: "0.001", mean: 19.2009, sd: 0.63, note: "延伸格線後掉到第 6" },
];

const TOP3_SPREAD = 0.05; // 前三名的差距（個百分點）
const WIDTH = 540;
const LEFT = 86;
const RIGHT = 24;
const PLOT_W = WIDTH - LEFT - RIGHT;
const ROW_H = 38;

// x 軸範圍要容得下最寬的誤差棒
const LO = 17.9;
const HI = 20.8;
const x = (v: number) => LEFT + ((v - LO) / (HI - LO)) * PLOT_W;

export default function TuningGridSensitivity() {
  const [showError, setShowError] = useState(true);

  return (
    <div className="not-prose mx-auto max-w-2xl space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setShowError(false)}
          aria-pressed={!showError}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors motion-reduce:transition-none ${
            !showError
              ? "border-[#ed9b26] bg-[#ed9b26] text-white"
              : "border-[#e1e6ee] bg-[#f6f8fb] text-[#6c798e]"
          }`}
        >
          只看平均
        </button>
        <button
          type="button"
          onClick={() => setShowError(true)}
          aria-pressed={showError}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors motion-reduce:transition-none ${
            showError
              ? "border-[#1b4f9c] bg-[#1b4f9c] text-white"
              : "border-[#e1e6ee] bg-[#f6f8fb] text-[#6c798e]"
          }`}
        >
          含 CV 標準差
        </button>
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${POINTS.length * ROW_H + 46}`}
        width="100%"
        role="img"
        aria-label={
          "Logistic Regression 的 C 格線敏感度。四個有記錄的格點，CV Recall@10% 與標準差：" +
          "C=0.003 第 1 名 19.42 ± 0.75；C=0.01 第 2 名 19.42 ± 0.67；C=0.1 第 3 名 19.38 ± 1.13；" +
          "C=0.001 第 6 名 19.20 ± 0.63。前三名的差距只有 0.05 個百分點，標準差卻是 0.6 到 1.1，" +
          "誤差棒大幅重疊，這三個 C 在 CV 上分不出高下。C=0.001 掉到第 6 表示最佳值已被格線包住，不再是邊界解。"
        }
      >
        {POINTS.map((p, i) => {
          const y = i * ROW_H + 24;
          const isTop3 = p.rank <= 3;
          return (
            <g key={p.c}>
              <text x={8} y={y + 4} fontSize="11.5" fontWeight="600" fill={isTop3 ? INK : MUTED}>
                C = {p.c}
              </text>
              <text x={66} y={y + 4} fontSize="10.5" textAnchor="end" fill={MUTED}>
                #{p.rank}
              </text>

              {showError && (
                <>
                  <line
                    x1={x(p.mean - p.sd)}
                    x2={x(p.mean + p.sd)}
                    y1={y}
                    y2={y}
                    stroke={isTop3 ? "#adc8e8" : "#d7dde7"}
                    strokeWidth="9"
                    strokeLinecap="round"
                  />
                  <line x1={x(p.mean - p.sd)} x2={x(p.mean - p.sd)} y1={y - 7} y2={y + 7} stroke="#8fb0d8" strokeWidth="1.5" />
                  <line x1={x(p.mean + p.sd)} x2={x(p.mean + p.sd)} y1={y - 7} y2={y + 7} stroke="#8fb0d8" strokeWidth="1.5" />
                </>
              )}

              <circle cx={x(p.mean)} cy={y} r="4.5" fill={p.note === "定案" ? GOLD : NAVY} />
              <text x={x(p.mean) + 10} y={y + 4} fontSize="11" className="tabular-nums" fill={INK}>
                {p.mean.toFixed(2)}
              </text>
              {p.note && (
                <text x={WIDTH - RIGHT} y={y + 4} fontSize="10" textAnchor="end" fill={p.note === "定案" ? GOLD : MUTED}>
                  {p.note}
                </text>
              )}
            </g>
          );
        })}

        <line
          x1={LEFT}
          x2={WIDTH - RIGHT}
          y1={POINTS.length * ROW_H + 10}
          y2={POINTS.length * ROW_H + 10}
          stroke="#e1e6ee"
        />
        <text x={LEFT} y={POINTS.length * ROW_H + 26} fontSize="10" fill={MUTED}>
          CV Recall@10%（%）
        </text>
        <text x={WIDTH - RIGHT} y={POINTS.length * ROW_H + 26} fontSize="10" textAnchor="end" fill={MUTED}>
          格線 6 個 C × 2 個 class_weight ＝ 12 點，此處畫有記錄的 4 點
        </text>
      </svg>

      <p
        className="rounded-lg px-4 py-3 text-sm leading-relaxed"
        style={{ background: showError ? "#f6f8fb" : "#fdf4e6", color: "#3a4456" }}
        aria-live="polite"
      >
        {showError ? (
          <>
            前三名的差距是 <span className="font-semibold tabular-nums">{TOP3_SPREAD}</span> 個百分點，
            CV 標準差是 <span className="font-semibold tabular-nums">0.6–1.1</span>——
            <span className="font-semibold" style={{ color: NAVY }}>
              誤差棒幾乎完全重疊，這三個 C 在 CV 上分不出高下
            </span>
            。test 從 19.4 掉到 19.3 只是這個分不出來的選擇造成的噪音，不是延伸格線讓模型變差。
          </>
        ) : (
          <>
            <span className="font-semibold" style={{ color: GOLD }}>
              只看平均，排名看起來很有說服力
            </span>
            ：0.003 &gt; 0.01 &gt; 0.1 &gt; 0.001，順序乾淨。表格就是長這樣——
            但這個順序沒有資料支持。切到「含 CV 標準差」看為什麼。
          </>
        )}
      </p>

      <p className="text-xs leading-relaxed" style={{ color: MUTED }}>
        `0.001` 掉到第 6 是另一回事，而且是好消息：v0.12.0 時最佳值落在格線最小值 `0.01`，那是邊界解；
        往下延伸後最佳值被包住，<span className="font-semibold">邊界疑慮解除</span>。
      </p>
    </div>
  );
}
