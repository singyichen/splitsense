import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, ChevronLeft, ChevronRight, FileCode2 } from "lucide-react";

// 資料來源：研究規格（00）、Dataset Card（10）、技術棧（40）。
// 這裡只抄「用了什麼技術」，數字以研究規格為準；那邊改了，這裡的 STAGES 要跟著改。
// 狀態（完成與否）的真相在 docs/20-progress.mdx 第 2 節表格，元件只放一個小徽章。

type Tech = { name: string; detail: string };
type Group = { label: string; items: Tech[] };
type Stat = { value: string; label: string };
type Bar = { name: string; value: number; tone: "base" | "rule" | "model" | "best" };

type Stage = {
  no: number;
  name: string;
  goal: string;
  groups: Group[];
  stats: Stat[];
  files: string[];
  bars?: Bar[];
};

const STAGES: Stage[] = [
  {
    no: 1,
    name: "問題描述",
    goal: "把「哪些題目會分歧」寫成一個可排序的二元預測",
    groups: [
      {
        label: "形式化",
        items: [
          { name: "分歧標籤 z_i", detail: "3 份標註不全相同即為 1" },
          { name: "正規化 entropy H_i", detail: "分歧程度的連續度量，當輔助指標" },
          { name: "部分觀測 r=2", detail: "可見 O_i、隱藏 U_i，隱藏標註不得進特徵" },
        ],
      },
      {
        label: "任務設定",
        items: [
          { name: "排序，不是判對錯", detail: "分數 s_i 只用來決定複核順序" },
          { name: "固定預算 b", detail: "b ∈ {5%, 10%, 20%}，主看 10%" },
        ],
      },
    ],
    stats: [
      { value: "49.7%", label: "分歧正例率" },
      { value: "R@10%", label: "主要指標" },
    ],
    files: ["00-research-spec 第 5 章"],
  },
  {
    no: 2,
    name: "資料收集",
    goal: "找一份真實多標註、授權可用、分歧率夠高的英文資料",
    groups: [
      {
        label: "來源",
        items: [
          { name: "TID-8 goemotions-atr", detail: "Apache-2.0，Reddit 留言的情緒標註" },
          { name: "4 類標籤", detail: "positive／negative／neutral／ambiguous" },
        ],
      },
      {
        label: "篩選",
        items: [
          { name: "只取恰好 3 份標註", detail: "標註數本身洩漏答案：4 份 88.1%、5 份 85.5% 分歧" },
          { name: "文字去重", detail: "31,766 → 31,603 個 item" },
        ],
      },
      {
        label: "治理",
        items: [
          { name: "丟棄 author", detail: "PII；subreddit 保留作穩健性分組" },
          { name: "統一 schema", detail: "item_id、text、annotator_id、label、language、source_dataset" },
        ],
      },
    ],
    stats: [
      { value: "31,603", label: "item" },
      { value: "3", label: "每題標註數" },
    ],
    files: ["10-dataset-card-goemotions", "data/ 不進版控"],
  },
  {
    no: 3,
    name: "分析與前處理",
    goal: "切出不洩漏的訓練／測試資料，並把文字與可見標註變成特徵",
    groups: [
      {
        label: "切分與揭露",
        items: [
          { name: "item-level split", detail: "70／15／15；不沿用 TID-8 split（test 96.0% 出現在 train）" },
          { name: "reveal protocol", detail: "每題隨機揭露 2 份，5 個 reveal seed" },
          { name: "洩漏防線", detail: "研究規格 6.4 的 7 條規則，寫成 pytest" },
        ],
      },
      {
        label: "特徵",
        items: [
          { name: "TF-IDF", detail: "ngram (1,2)、min_df=2、max_features 50k、sublinear_tf、不去停用詞" },
          { name: "8 個可見特徵", detail: "visible_disagree、entropy、distinct、vote_margin、count×4" },
        ],
      },
    ],
    stats: [
      { value: "31,451", label: "TF-IDF 維度" },
      { value: "4,741", label: "test item" },
      { value: "3,153", label: "hard 子集" },
    ],
    files: ["scripts/run_eda.py", "scripts/build_dataset.py", "tests/test_leakage.py"],
  },
  {
    no: 4,
    name: "模型訓練",
    goal: "由簡到繁排一條模型階梯，每一層都要贏過前一層才算數",
    groups: [
      {
        label: "模型階梯",
        items: [
          { name: "0 隨機／1 可見 entropy", detail: "不用 ML 的下限" },
          { name: "1.5 同意標籤先驗", detail: "四列查表：neutral 43.8%、ambiguous 34.7%…" },
          { name: "2 TF-IDF + Logistic Regression", detail: "liblinear" },
          { name: "3 TruncatedSVD(200) + HistGradientBoosting", detail: "換模型族的對照" },
        ],
      },
      {
        label: "多語 Embedding",
        items: [
          { name: "BAAI/bge-m3", detail: "rev 5617a9f6、1024 維 unit norm、max_length 512" },
          { name: "PCA 64 → LR", detail: "向量快取在 artifacts/embeddings/" },
        ],
      },
      {
        label: "調參",
        items: [
          { name: "GridSearchCV + GroupKFold", detail: "以 item_id 分組，scoring = Recall@10%" },
          { name: "5 seed 疊訓", detail: "73,596 列／20,406 個 item（hard）" },
        ],
      },
    ],
    stats: [
      { value: "6", label: "方法" },
      { value: "64", label: "PCA 維度" },
    ],
    files: ["scripts/run_models.py", "scripts/embed_texts.py", "src/splitsense/models.py"],
  },
  {
    no: 5,
    name: "模型評估",
    goal: "在固定預算下比排序品質，並確認差距不是 seed 運氣",
    groups: [
      {
        label: "指標與範圍",
        items: [
          { name: "Recall@10%、P@10%、PR-AUC", detail: "主看 Recall@10%" },
          { name: "full 與 hard 並列", detail: "full 已飽和（全部 20.1），以 hard 為主" },
        ],
      },
      {
        label: "可信度",
        items: [
          { name: "5 reveal seeds", detail: "平均 ± 標準差；同分隨機打散" },
          { name: "配對比較", detail: "同一 seed 相減，數幾勝幾負" },
          { name: "混淆矩陣", detail: "門檻由 val 在 10% 預算處取得" },
        ],
      },
    ],
    stats: [
      { value: "+2.45", label: "BGE 對 TF-IDF（5/5 勝）" },
      { value: "+0.05", label: "GB 對 LR（2/5）" },
    ],
    files: ["src/splitsense/metrics.py"],
    bars: [
      { name: "隨機", value: 9.5, tone: "base" },
      { name: "可見 entropy", value: 9.9, tone: "base" },
      { name: "同意標籤先驗", value: 18.5, tone: "rule" },
      { name: "TF-IDF + LR", value: 19.3, tone: "model" },
      { name: "Gradient Boosting", value: 19.4, tone: "model" },
      { name: "BGE-M3 + PCA + LR", value: 21.8, tone: "best" },
    ],
  },
  {
    no: 6,
    name: "結論",
    goal: "說清楚模型贏在哪、輸在哪，以及「不用 ML」能做到幾成",
    groups: [
      {
        label: "錯誤分析",
        items: [
          { name: "只送 neutral 組", detail: "兩個模型都一樣，差別在組內精確率 48.2% 對 52.7%" },
          { name: "否定詞過度觸發", detail: "FP 的否定詞比例 39.6%，高於 TP 的 37.4%；BGE 更明顯" },
        ],
      },
      {
        label: "結論",
        items: [
          { name: "表示 > 模型族", detail: "換文字表示 +2.45，換模型族 +0.05" },
          { name: "查表佔比", detail: "TF-IDF LR 的 95.9%，BGE-M3 LR 的 84.9%" },
          { name: "entropy 不是對照", detail: "hard 子集上恆為常數，等於隨機" },
        ],
      },
    ],
    stats: [
      { value: "95.9%", label: "查表 / TF-IDF LR" },
      { value: "84.9%", label: "查表 / BGE-M3 LR" },
    ],
    files: ["scripts/run_error_analysis.py", "研究規格 8.6.1"],
  },
  {
    no: 9,
    name: "專題程式",
    goal: "從零可重跑，同一個 seed 得到同一組數字",
    groups: [
      {
        label: "工具鏈",
        items: [
          { name: "uv + pyproject.toml", detail: "src/ 佈局，版本鎖在 uv.lock" },
          { name: "Python ≥ 3.12", detail: "本機釘 3.13" },
          { name: "optional extra embed", detail: "sentence-transformers + torch（約 2 GB）" },
        ],
      },
      {
        label: "品質",
        items: [
          { name: "pytest", detail: "洩漏檢查與重現性，91 passed、2 skipped" },
          { name: "ruff", detail: "src／scripts／tests 全掃" },
        ],
      },
    ],
    stats: [
      { value: "91", label: "測試通過" },
      { value: "0", label: "資料檔進版控" },
    ],
    files: ["pyproject.toml", "tests/"],
  },
];

const BAR_TONE: Record<Bar["tone"], string> = {
  base: "bg-[#c3ccd9]", // --neutral-300
  rule: "bg-[#ed9b26]", // --orange-400
  model: "bg-[#7ba6da]", // --blue-300
  best: "bg-[#1b4f9c]", // --blue-700
};
const BAR_MAX = 25;

export default function CourseStageTechniques() {
  const [idx, setIdx] = useState(3); // 預設停在模型訓練：技術最密的一站
  const reduce = useReducedMotion();
  const stage = STAGES[idx];
  const go = (d: number) => setIdx((i) => Math.min(STAGES.length - 1, Math.max(0, i + d)));

  return (
    <div className="not-prose mx-auto max-w-3xl space-y-4">
      {/* 站點列：研究主線 6 站 + 專題程式 */}
      <div role="tablist" aria-label="課程規範項目" className="grid grid-cols-4 gap-1.5 sm:grid-cols-7">
        {STAGES.map((s, i) => {
          const active = i === idx;
          return (
            <button
              key={s.no}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setIdx(i)}
              className={[
                "relative flex flex-col items-start gap-1 rounded-md px-2 py-2 text-left transition-colors",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2c6ebb]",
                active ? "bg-[#1b4f9c] text-white" : "bg-[#f6f8fb] text-[#3a4456] hover:bg-[#eef4fb]",
                s.no === 9 ? "sm:ml-2" : "",
              ].join(" ")}
            >
              <span className="flex w-full items-center justify-between">
                <span className={`text-[11px] tabular-nums ${active ? "text-[#cfe0f3]" : "text-[#6c798e]"}`}>
                  #{s.no}
                </span>
                <Check size={12} strokeWidth={3} aria-label="已完成" className={active ? "text-white" : "text-[#2e9e6b]"} />
              </span>
              <span className="text-[13px] font-semibold leading-tight">{s.name}</span>
            </button>
          );
        })}
      </div>

      {/* 上下站與註腳放在面板上方：面板高度隨站變動，可點的東西才不會跟著跳 */}
      <div className="flex items-center justify-between gap-2 text-xs text-[#6c798e]">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={idx === 0}
          className="inline-flex items-center gap-1 rounded px-2 py-1 hover:bg-[#eef4fb] disabled:opacity-40"
        >
          <ChevronLeft size={14} aria-hidden="true" /> 上一站
        </button>
        <span className="text-center">#7 登記表單、#8 投影片屬行政交付，不涉及技術，狀態見上表</span>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={idx === STAGES.length - 1}
          className="inline-flex items-center gap-1 rounded px-2 py-1 hover:bg-[#eef4fb] disabled:opacity-40"
        >
          下一站 <ChevronRight size={14} aria-hidden="true" />
        </button>
      </div>

      {/* 詳情面板：min-h 以最長的一站為準，切換時下方內文不跳動 */}
      <div role="tabpanel" aria-live="polite" className="min-h-[30rem] md:min-h-[34rem] rounded-lg bg-[#f6f8fb] px-4 py-4 sm:px-5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={stage.no}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 1 } : { opacity: 0, y: -6 }}
            transition={{ duration: reduce ? 0 : 0.22, ease: "easeOut" }}
            className="space-y-4"
          >
            <div className="space-y-1">
              <p className="flex flex-wrap items-center gap-2 text-base font-semibold text-[#163f7d]">
                #{stage.no} {stage.name}
                <span className="rounded-full bg-[#e7f6ee] px-2 py-0.5 text-[11px] font-medium text-[#1f7a52]">完成</span>
              </p>
              <p className="text-sm text-[#4f5b6e]">{stage.goal}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {stage.stats.map((st) => (
                <div key={st.label} className="rounded-md border border-[#e1e6ee] bg-white px-3 py-1.5">
                  <p className="text-lg font-semibold leading-tight tabular-nums text-[#1b4f9c]">{st.value}</p>
                  <p className="text-[11px] text-[#6c798e]">{st.label}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {stage.groups.map((g) => (
                <div key={g.label} className="space-y-1.5">
                  <p className="text-xs font-semibold tracking-wide text-[#c7641a]">{g.label}</p>
                  <ul className="m-0 list-none space-y-1.5 p-0">
                    {g.items.map((t) => (
                      <li key={t.name} className="m-0 list-none border-l-2 border-[#adc8e8] pl-2.5">
                        <p className="text-[13px] font-semibold text-[#262e3d]">{t.name}</p>
                        <p className="text-xs leading-relaxed text-[#4f5b6e]">{t.detail}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {stage.bars && (
              <div className="space-y-1.5">
                <p className="text-xs font-semibold tracking-wide text-[#c7641a]">hard 範圍 Recall@10%（5 seeds 平均）</p>
                {stage.bars.map((b) => (
                  <div key={b.name} className="grid grid-cols-[7.5rem_1fr_2.5rem] items-center gap-2 text-xs">
                    <span className="truncate text-[#3a4456]">{b.name}</span>
                    <span className="h-2.5 rounded-full bg-[#e1e6ee]">
                      <span
                        className={`block h-full rounded-full ${BAR_TONE[b.tone]}`}
                        style={{ width: `${(b.value / BAR_MAX) * 100}%` }}
                      />
                    </span>
                    <span className="text-right font-semibold tabular-nums text-[#262e3d]">{b.value}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-1.5">
              <FileCode2 size={14} className="text-[#6c798e]" aria-hidden="true" />
              {stage.files.map((f) => (
                <span key={f} className="rounded bg-[#eef4fb] px-1.5 py-0.5 font-mono text-[11px] text-[#1b4f9c]">
                  {f}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
