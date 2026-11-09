// 靜態技術架構圖：技術棧怎麼疊起來、誰依賴誰。
// 與 module-pipeline.svg 互補——那張畫資料流（跑哪支腳本產出什麼），這張畫相依層級。
// 數字取自 docs/40-tech-stack.mdx 的盤點（2026-11-09）。
// 純靜態，不需要 client:* directive。

import {
  Archive,
  ArrowDown,
  BookOpen,
  Boxes,
  Cpu,
  CornerLeftDown,
  FileCode2,
  ShieldCheck,
  Sigma,
  Terminal,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Tone = "env" | "third" | "own" | "opt";

type ToneStyle = {
  card: string;
  tile: string;
  chip: string;
  index: string;
};

const TONE: Record<Tone, ToneStyle> = {
  env: {
    card: "border-[#e1e6ee] bg-[#f6f8fb]",
    tile: "bg-[#e1e6ee] text-[#4f5b6e]",
    chip: "border-[#e1e6ee] bg-white text-[#4f5b6e]",
    index: "text-[#9aa6b8]",
  },
  third: {
    card: "border-[#adc8e8] bg-white",
    tile: "bg-[#d6e4f5] text-[#1b4f9c]",
    chip: "border-[#e1e6ee] bg-[#f6f8fb] text-[#4f5b6e]",
    index: "text-[#7ba6da]",
  },
  own: {
    card: "border-[#1b4f9c] bg-[#eef4fb]",
    tile: "bg-[#1b4f9c] text-white",
    chip: "border-[#adc8e8] bg-white text-[#163f7d]",
    index: "text-[#1b4f9c]",
  },
  opt: {
    card: "border-dashed border-[#c7641a] bg-[#fdf4e6]",
    tile: "bg-[#f6cd86] text-[#a04f15]",
    chip: "border-[#f2b955] bg-white text-[#a04f15]",
    index: "text-[#c7641a]",
  },
};

type Block = {
  index?: string;
  icon: LucideIcon;
  title: string;
  path?: string;
  chips: string[];
  note?: string;
  tone: Tone;
};

const LAYERS: Block[] = [
  {
    index: "1",
    icon: Terminal,
    title: "執行環境",
    chips: ["Python 3.13", "uv 0.12.18", "uv.lock"],
    note: "版本全鎖死，從零可完整重跑",
    tone: "env",
  },
  {
    index: "2",
    icon: Sigma,
    title: "資料與運算",
    chips: ["numpy 2.5.4", "pandas 3.1.0", "scipy 1.18.1", "pyarrow 26.0.0"],
    tone: "third",
  },
  {
    index: "3",
    icon: Workflow,
    title: "建模",
    chips: [
      "scikit-learn 1.9.1",
      "Pipeline",
      "GridSearchCV",
      "GroupKFold",
      "PCA",
      "TruncatedSVD",
    ],
    tone: "third",
  },
  {
    index: "4",
    icon: Boxes,
    title: "專案套件",
    path: "src/splitsense/",
    chips: ["12 個模組", "config 被 24 處 import"],
    note: "實驗參數全部集中在 config.py",
    tone: "own",
  },
  {
    index: "5",
    icon: FileCode2,
    title: "可執行腳本",
    path: "scripts/",
    chips: ["run_eda", "build_dataset", "embed_texts", "run_models", "run_error_analysis"],
    note: "每支只做一件事，依序執行",
    tone: "own",
  },
  {
    index: "6",
    icon: Archive,
    title: "產物",
    path: "artifacts/",
    chips: ["eda", "manifests", "models", "error_analysis", "embeddings"],
    note: "全部不進版控（研究規格 9.3）",
    tone: "env",
  },
];

const ASIDES: Block[] = [
  {
    icon: Cpu,
    title: "選配　extra「embed」",
    chips: ["sentence-transformers", "torch 2.15.0", "Apple MPS", "bge-m3 1024 維"],
    note: "接在第 3 層建模之後：同一個 Logistic Regression，只把文字表示從 TF-IDF 換成 bge-m3。沒裝也能跑完主線，只少掉 BGE 那一列",
    tone: "opt",
  },
  {
    icon: ShieldCheck,
    title: "品質閘　extra「dev」",
    chips: ["pytest 9.2.0", "ruff 0.17.3"],
    note: "91 passed、2 skipped；洩漏檢查是不變量",
    tone: "third",
  },
  {
    icon: BookOpen,
    title: "文件與視覺化",
    chips: ["Node 22", "notecraftapp 1.13.0", "recharts", "diagram-design"],
    note: "要操作才懂的用元件，看一眼就走的用靜態圖",
    tone: "env",
  },
];

function Card({ block }: { block: Block }) {
  const tone = TONE[block.tone];
  const Icon = block.icon;
  return (
    <div className={`flex items-start gap-3 rounded-xl border px-3.5 py-3 ${tone.card}`}>
      <span className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg ${tone.tile}`}>
        <Icon size={17} strokeWidth={2} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          {block.index ? (
            <span className={`font-mono text-[11px] font-bold ${tone.index}`}>{block.index}</span>
          ) : null}
          <span className="text-[13.5px] font-bold text-[#262e3d]">{block.title}</span>
          {block.path ? (
            <code className="font-mono text-[11.5px] text-[#4f5b6e]">{block.path}</code>
          ) : null}
        </div>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {block.chips.map((chip) => (
            <span
              key={chip}
              className={`rounded-md border px-1.5 py-0.5 font-mono text-[10.5px] leading-tight ${tone.chip}`}
            >
              {chip}
            </span>
          ))}
        </div>
        {block.note ? (
          <span className="mt-1 block text-[11px] leading-snug text-[#9aa6b8]">{block.note}</span>
        ) : null}
      </div>
    </div>
  );
}

function LegendSwatch({ tone, label }: { tone: Tone; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`inline-block size-3 rounded-sm border ${TONE[tone].card}`} />
      <span className="text-[11px] text-[#4f5b6e]">{label}</span>
    </span>
  );
}

export default function TechStackArchitecture() {
  return (
    <div className="not-prose mx-auto w-full max-w-4xl">
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div>
          {LAYERS.map((layer, i) => (
            <div key={layer.index}>
              <Card block={layer} />
              {i < LAYERS.length - 1 ? (
                <div className="flex justify-center py-1" aria-hidden="true">
                  <ArrowDown size={15} className="text-[#9aa6b8]" />
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 lg:h-full lg:justify-between lg:gap-4">
          <div className="flex items-center gap-1.5 text-[11px] text-[#9aa6b8]">
            <CornerLeftDown size={13} aria-hidden="true" />
            <span>旁支：接在主幹上，不在主線裡</span>
          </div>
          {ASIDES.map((aside) => (
            <Card key={aside.title} block={aside} />
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#e1e6ee] pt-3">
        <span className="font-mono text-[10px] tracking-[0.14em] text-[#9aa6b8]">LEGEND</span>
        <LegendSwatch tone="own" label="本專案自己寫的" />
        <LegendSwatch tone="third" label="第三方套件" />
        <LegendSwatch tone="env" label="環境與產物" />
        <LegendSwatch tone="opt" label="選配，沒裝也能跑完主線" />
        <span className="ml-auto font-mono text-[10px] text-[#9aa6b8]">
          版本為 2026-11-09 盤點值
        </span>
      </div>
    </div>
  );
}
