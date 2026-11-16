// 四階段篩選漏斗：八個子資料集怎麼收斂到 GoEmotions 的 31,603 題。
// 數字正本在本檔；diagrams/dataset-funnel.html 是 PNG 匯出用的副本，改了要同步。
// 來源：docs/10-dataset-card-goemotions.mdx §5、§5.2。

import { useState } from "react";

const NAVY = "#1b4f9c";
const GOLD = "#ed9b26";
const INK = "#262e3d";
const MUTED = "#6c798e";

type Eliminated = { name: string; reason: string };

type Stage = {
  n: string;
  title: string;
  criterion: string;
  remaining: number;
  note: string;
  eliminated: Eliminated[];
};

const STAGES: Stage[] = [
  {
    n: "1",
    title: "保留逐人標註的子資料集",
    criterion: "多數資料集只給投票後的最終答案，那樣看不到分歧怎麼形成",
    remaining: 4,
    note: "TID-8 八個子資料集 → 四個候選",
    eliminated: [],
  },
  {
    n: "2",
    title: "授權篩選",
    criterion: "授權一律追到原始出處——不能因為 Hugging Face 可以下載就假設能用",
    remaining: 3,
    note: "TID-8 的 Dataset Card 授權欄標 unknown，其論文也沒有授權聲明",
    eliminated: [
      { name: "md-agreement", reason: "上游無開源授權、限非商業研究、須填表單申請" },
    ],
  },
  {
    n: "3",
    title: "資料品質篩選",
    criterion: "分歧率太高會讓任何排序都撞到地雷，指標讀不出模型能力",
    remaining: 1,
    note: "目標分布要讓排序看得出差異；圖要連通，annotator 歷史才成立",
    eliminated: [
      { name: "sentiment", reason: "93.7% 分歧、圖碎成 305 塊" },
      { name: "CommitmentBank", reason: "僅 1,200 題、97.9% 分歧" },
    ],
  },
  {
    n: "4",
    title: "GoEmotions 子集篩選",
    criterion: "標註數本身洩漏答案，只取恰好 3 份讓分母固定",
    remaining: 1,
    note: "Apache-2.0、可直接下載、目標分布最平衡",
    eliminated: [],
  },
];

const COUNTS = [
  { value: "57,703", label: "整個 config" },
  { value: "31,766", label: "恰好 3 份標註" },
  { value: "31,603", label: "文字去重後" },
];

export default function DatasetFunnel() {
  const [step, setStep] = useState(0);
  const stage = STAGES[step];
  const atEnd = step === STAGES.length - 1;

  return (
    <div className="not-prose mx-auto max-w-2xl space-y-4">
      <div
        className="rounded-lg bg-[#f6f8fb] px-4 py-3 text-sm font-medium text-[#3a4456]"
        role="img"
        aria-label="篩選總覽：TID-8 的 8 個子資料集先取出 4 個候選，授權與資料品質各淘汰一輪後剩 GoEmotions 1 個，最後取恰好 3 份標註並去重，得到 31,603 題"
      >
        <span className="tabular-nums">8</span> 個子資料集
        <span className="mx-2 text-[#9aa6b8]">→</span>
        <span className="tabular-nums">4</span> 候選
        <span className="mx-2 text-[#9aa6b8]">→</span>
        <span className="tabular-nums">1</span> 定案
        <span className="mx-2 text-[#9aa6b8]">→</span>
        <span className="font-semibold tabular-nums" style={{ color: NAVY }}>
          31,603
        </span>{" "}
        題
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="篩選階段">
        {STAGES.map((s, i) => (
          <button
            key={s.n}
            type="button"
            onClick={() => setStep(i)}
            aria-current={i === step ? "step" : undefined}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors motion-reduce:transition-none ${
              i === step
                ? "border-[#1b4f9c] bg-[#1b4f9c] text-white"
                : i < step
                  ? "border-[#adc8e8] bg-white text-[#1b4f9c]"
                  : "border-[#e1e6ee] bg-[#f6f8fb] text-[#6c798e]"
            }`}
          >
            {s.n}　{s.title}
          </button>
        ))}
      </div>

      <ol className="space-y-2" aria-live="polite">
        {STAGES.slice(0, step + 1).map((s, i) => {
          const current = i === step;
          return (
            <li
              key={s.n}
              className={`rounded-lg border px-4 py-3 transition-opacity motion-reduce:transition-none ${
                current ? "border-[#adc8e8] bg-white opacity-100" : "border-[#e1e6ee] bg-[#f9fafc] opacity-60"
              }`}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-semibold" style={{ color: current ? INK : MUTED }}>
                  {s.n}　{s.title}
                </span>
                <span className="whitespace-nowrap text-xs" style={{ color: MUTED }}>
                  剩餘候選{" "}
                  <span className="text-base font-semibold tabular-nums" style={{ color: current ? NAVY : MUTED }}>
                    {s.remaining}
                  </span>
                </span>
              </div>

              {current && (
                <>
                  <p className="mt-2 text-xs leading-relaxed" style={{ color: MUTED }}>
                    {s.criterion}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed" style={{ color: MUTED }}>
                    {s.note}
                  </p>

                  {s.eliminated.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {s.eliminated.map((e) => (
                        <li
                          key={e.name}
                          className="rounded border border-[#f2d7a8] bg-[#fdf4e6] px-3 py-1.5 text-xs leading-relaxed"
                        >
                          <span className="font-semibold" style={{ color: GOLD }}>
                            {e.name} 出局
                          </span>
                          <span style={{ color: MUTED }}>　{e.reason}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {atEnd && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {COUNTS.map((c, ci) => (
                        <div key={c.value} className="flex items-center gap-2">
                          {ci > 0 && <span className="text-[#9aa6b8]">→</span>}
                          <div className="rounded bg-[#f6f8fb] px-3 py-1.5 text-center">
                            <div
                              className="text-sm font-semibold tabular-nums"
                              style={{ color: ci === COUNTS.length - 1 ? NAVY : INK }}
                            >
                              {c.value}
                            </div>
                            <div className="text-[11px]" style={{ color: MUTED }}>
                              {c.label}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ol>

      <button
        type="button"
        onClick={() => setStep((s) => (s + 1) % STAGES.length)}
        className="rounded-lg border border-[#adc8e8] bg-white px-4 py-2 text-sm font-medium text-[#1b4f9c] hover:bg-[#f6f8fb]"
      >
        {atEnd ? "從頭看一次" : "下一步"}
      </button>
    </div>
  );
}
