// 模型階梯：每一層回答前一層答不了的問題。點一列展開超參數與那句轉折。
// 數字正本在本檔；diagrams/model-ladder.html 是 PNG 匯出用的副本，改了要同步。
// 來源：docs/00-research-spec.mdx §7.1、§8.4。

import { useState } from "react";

const NAVY = "#1b4f9c";
const GOLD = "#ed9b26";
const INK = "#262e3d";
const MUTED = "#6c798e";

const HARD_N = "3,153";
const CEILING = "40.5%";

type Score = { label: string; value: string };

type Rung = {
  n: string;
  title: string;
  subtitle: string;
  hyper: string;
  scores: Score[];
  transition: string;
  dashed?: boolean;
};

const RUNGS: Rung[] = [
  {
    n: "0",
    title: "隨機排序",
    subtitle: "地板線",
    hyper: "無超參數",
    scores: [{ label: "Recall@10%", value: "9.5" }],
    transition: "隨機沒有任何訊號，任何方法都該勝過它",
  },
  {
    n: "1",
    title: "可見標籤 entropy",
    subtitle: "「不用機器學習」的對照組",
    hyper: "無超參數",
    scores: [{ label: "Recall@10%", value: "9.9" }],
    transition: "entropy 在難題組恆為 0、等於亂猜——拿它當對照會誇大 ML 的功勞",
  },
  {
    n: "1.5",
    title: "同意標籤先驗",
    subtitle: "四列查表，不用訓練：前兩人同意哪個標籤",
    hyper: "無超參數",
    scores: [{ label: "Recall@10%", value: "18.5" }],
    transition: "查表只用了標籤，完全沒用到文字。拿到最佳模型 85% 效果的透明規則",
  },
  {
    n: "2",
    title: "Logistic Regression",
    subtitle: "第一個真正的 ML 模型。同一個分類器，兩種文字表示",
    hyper: "C（最佳 0.003）；BGE-M3 另加 PCA 64",
    scores: [
      { label: "TF-IDF", value: "19.3" },
      { label: "BGE-M3", value: "21.8" },
    ],
    transition: "換文字表示 +2.45 個百分點；那換模型族呢？",
  },
  {
    n: "3",
    title: "Gradient Boosting",
    subtitle: "檢查非線性模型有無額外增益",
    hyper: "learning_rate、max_depth",
    scores: [{ label: "Recall@10%", value: "19.4" }],
    transition: "沒有。對 TF-IDF LR 的配對差 +0.05 ± 0.27，與 0 分不出來",
  },
  {
    n: "4",
    title: "零樣本大語言模型",
    subtitle: "課堂版不做（Q9）：資料污染使分數不可檢驗。論文階段必做",
    hyper: "未執行",
    scores: [],
    transition: "",
    dashed: true,
  },
];

export default function ModelLadder() {
  const [open, setOpen] = useState<string | null>("2");

  return (
    <div className="not-prose mx-auto max-w-2xl space-y-3">
      <div className="flex items-center justify-between text-xs" style={{ color: MUTED }}>
        <span>笨</span>
        <span>
          難題組 <span className="tabular-nums">{HARD_N}</span> 題，上限{" "}
          <span className="tabular-nums">{CEILING}</span>
        </span>
        <span>聰明</span>
      </div>

      <p className="sr-only">
        模型階梯共六層，數字是難題組的 Recall@10%：0 隨機排序 9.5、1 可見標籤 entropy 9.9、
        1.5 同意標籤先驗 18.5、2 Logistic Regression 以 TF-IDF 為 19.3、換成 BGE-M3 為 21.8、
        3 Gradient Boosting 19.4，另有一層零樣本大語言模型課堂版不做。
        難題組 {HARD_N} 題，理論上限 {CEILING}。展開任一層可看到它的超參數與前一層答不了的問題。
      </p>

      <ol className="space-y-2">
        {RUNGS.map((r) => {
          const expanded = open === r.n;
          const isLadder2 = r.scores.length > 1;
          return (
            <li key={r.n}>
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : r.n)}
                aria-expanded={expanded}
                aria-controls={`rung-${r.n}-panel`}
                id={`rung-${r.n}-button`}
                className={`w-full rounded-lg border px-4 py-3 text-left transition-colors motion-reduce:transition-none ${
                  r.dashed
                    ? "border-dashed border-[#d7dde7] bg-[#fafbfc]"
                    : expanded
                      ? "border-[#adc8e8] bg-white"
                      : "border-[#e1e6ee] bg-[#f9fafc] hover:bg-white"
                }`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <span className="flex items-baseline gap-2">
                    <span
                      className="rounded px-1.5 py-0.5 text-[11px] font-semibold tabular-nums"
                      style={{
                        background: r.dashed ? "#eef1f5" : NAVY,
                        color: r.dashed ? MUTED : "#ffffff",
                      }}
                    >
                      {r.n}
                    </span>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: r.dashed ? MUTED : INK }}
                    >
                      {r.title}
                    </span>
                  </span>

                  {r.scores.length > 0 ? (
                    <span className="flex items-baseline gap-3">
                      {r.scores.map((s) => (
                        <span key={s.label} className="text-right">
                          <span
                            className="text-lg font-semibold tabular-nums"
                            style={{ color: isLadder2 && s.label === "BGE-M3" ? GOLD : NAVY }}
                          >
                            {s.value}
                          </span>
                          <span className="ml-1 text-[11px]" style={{ color: MUTED }}>
                            {s.label}
                          </span>
                        </span>
                      ))}
                    </span>
                  ) : (
                    <span className="text-xs" style={{ color: MUTED }}>
                      未執行
                    </span>
                  )}
                </div>

                <span className="mt-1 block text-xs leading-relaxed" style={{ color: MUTED }}>
                  {r.subtitle}
                </span>

              </button>

              <div
                id={`rung-${r.n}-panel`}
                role="region"
                aria-labelledby={`rung-${r.n}-button`}
                hidden={!expanded}
                className="mt-1 space-y-1.5 rounded-lg border border-[#eef1f5] bg-white px-4 py-2.5"
              >
                <p className="text-xs" style={{ color: MUTED }}>
                  超參數：{r.hyper}
                </p>
                {r.transition && (
                  <p className="text-xs leading-relaxed" style={{ color: INK }}>
                    前一層答不了的：{r.transition}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <p className="rounded-lg bg-[#f6f8fb] px-4 py-3 text-sm leading-relaxed" style={{ color: "#3a4456" }}>
        結論採<span className="font-semibold">階梯 2 ＋ BGE-M3</span>：對查表贏{" "}
        <span className="font-semibold tabular-nums" style={{ color: NAVY }}>
          3.22
        </span>{" "}
        個百分點，5 個 seed 全勝。
      </p>
    </div>
  );
}
