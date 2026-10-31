import { useState } from "react";

const TOTAL = 4741;
const CERTAIN = 1588; // 可見已不一致，必然分歧
const HARD = TOTAL - CERTAIN;
const HARD_RATE = 0.2467;
const POSITIVES = CERTAIN + Math.round(HARD * HARD_RATE);

const NAVY = "#1b4f9c";
const GOLD = "#ed9b26";
const GOLD_SOFT = "#fbe7c6";
const BLUE_SOFT = "#d6e4f5";
const INK = "#262e3d";
const MUTED = "#6c798e";

const WIDTH = 540;
const BAR_X = 20;
const BAR_W = WIDTH - 40;

export default function MetricSaturation() {
  const [budget, setBudget] = useState(10);
  const k = Math.floor((budget / 100) * TOTAL);
  const fromCertain = Math.min(k, CERTAIN);
  const fromHard = Math.max(0, k - CERTAIN) * HARD_RATE;
  const precision = ((fromCertain + fromHard) / k) * 100;
  const recall = ((fromCertain + fromHard) / POSITIVES) * 100;
  const saturated = k <= CERTAIN;

  const certainW = (CERTAIN / TOTAL) * BAR_W;
  const kW = (k / TOTAL) * BAR_W;

  return (
    <div className="not-prose mx-auto max-w-2xl space-y-4">
      <svg viewBox={`0 0 ${WIDTH} 150`} width="100%" role="img" aria-label="預算與確定陽性的比例圖">
        <rect x={BAR_X} y="36" width={certainW} height="44" fill={GOLD_SOFT} />
        <rect x={BAR_X + certainW} y="36" width={BAR_W - certainW} height="44" fill={BLUE_SOFT} />
        <rect x={BAR_X} y="36" width={BAR_W} height="44" fill="none" stroke="#cbd3df" />

        <text x={BAR_X + certainW / 2} y="62" textAnchor="middle" fontSize="12" fontWeight="600" fill={INK}>
          可見已不一致 1,588
        </text>
        <text x={BAR_X + certainW / 2} y="76" textAnchor="middle" fontSize="11" fill={MUTED}>
          100% 有分歧
        </text>
        <text x={BAR_X + certainW + (BAR_W - certainW) / 2} y="62" textAnchor="middle" fontSize="12" fontWeight="600" fill={INK}>
          可見一致 3,153
        </text>
        <text x={BAR_X + certainW + (BAR_W - certainW) / 2} y="76" textAnchor="middle" fontSize="11" fill={MUTED}>
          24.7% 有分歧
        </text>

        <rect x={BAR_X} y="28" width={kW} height="60" fill="none" stroke={NAVY} strokeWidth="2.5" />
        <path d={`M${BAR_X + kW} 88 L${BAR_X + kW} 104`} stroke={NAVY} strokeWidth="2" />
        <text x={Math.min(BAR_X + kW, WIDTH - 58)} y="120" textAnchor="middle" fontSize="12" fontWeight="600" fill={NAVY}>
          K = {k.toLocaleString()}
        </text>

        <path
          d={`M${BAR_X + certainW} 24 L${BAR_X + certainW} 36`}
          stroke={GOLD}
          strokeWidth="2"
          strokeDasharray="4 3"
        />
        <text x={BAR_X + certainW} y="18" textAnchor="middle" fontSize="11.5" fontWeight="600" fill={GOLD}>
          33.5%
        </text>
      </svg>

      <div className="space-y-2">
        <label className="flex items-center gap-3 text-sm font-medium text-[#3a4456]">
          <span className="whitespace-nowrap">複核預算</span>
          <input
            type="range"
            min={1}
            max={60}
            step={1}
            value={budget}
            onChange={(event) => setBudget(Number(event.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[#e1e6ee] accent-[#1b4f9c]"
            aria-label="複核預算百分比"
          />
          <span className="w-14 text-right tabular-nums font-semibold text-[#1b4f9c]">{budget}%</span>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-[#f6f8fb] px-4 py-3">
          <div className="text-xs text-[#6c798e]">Precision@K</div>
          <div className="text-2xl font-semibold tabular-nums" style={{ color: saturated ? GOLD : INK }}>
            {precision.toFixed(1)}%
          </div>
        </div>
        <div className="rounded-lg bg-[#f6f8fb] px-4 py-3">
          <div className="text-xs text-[#6c798e]">Recall@K</div>
          <div className="text-2xl font-semibold tabular-nums text-[#262e3d]">{recall.toFixed(1)}%</div>
        </div>
      </div>

      <p className="rounded-lg px-4 py-3 text-sm leading-relaxed text-[#3a4456]" style={{ background: saturated ? "#fdf4e6" : "#f6f8fb" }}>
        {saturated ? (
          <>
            <span className="font-semibold" style={{ color: GOLD }}>
              預算還沒吃完「必然分歧」那一塊，所以 Precision 必為 100%。
            </span>{" "}
            任何方法只要把這批排前面都拿滿分，指標分不出模型好壞——實務常用的 10% 正好落在這裡。
          </>
        ) : (
          <>
            預算超過 <span className="font-semibold">33.5%</span> 之後才開始吃到「可見一致」那一塊，Precision 這時才會下降、指標也才開始有鑑別力。但 33.5% 遠高於實務會用的複核預算。
          </>
        )}
      </p>
    </div>
  );
}
