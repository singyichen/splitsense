// 技術架構圖：裝了什麼、誰依賴誰。靜態，不需要 client:* directive。
// 視覺語言與 diagrams/module-pipeline.svg 共用：層級標籤用深色膠囊壓在容器上緣、
// 圓角容器框住每一層、虛線＝選配或非主線。那張畫執行順序，這張畫相依層級。
// 數字取自 docs/40-tech-stack.mdx 的盤點（2026-11-09）。

import type { ReactNode } from "react";
import {
  Archive,
  BookOpen,
  Boxes,
  Cpu,
  Database,
  FileCode2,
  Package,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type NodeTone = "own" | "third" | "opt" | "store";

const CHIP: Record<NodeTone, string> = {
  own: "border-[#adc8e8] bg-white text-[#163f7d]",
  third: "border-[#e1e6ee] bg-[#f6f8fb] text-[#4f5b6e]",
  opt: "border-[#f2b955] bg-white text-[#a04f15]",
  store: "border-[#e1e6ee] bg-white text-[#4f5b6e]",
};

const BOX: Record<NodeTone, string> = {
  own: "border-[#1b4f9c] bg-[#eef4fb]",
  third: "border-[#e1e6ee] bg-white",
  opt: "border-dashed border-[#c7641a] bg-[#fdf4e6]",
  store: "border-[#cbd3df] bg-[#f6f8fb]",
};

function Node({
  icon: Icon,
  label,
  chips,
  tone = "third",
  note,
}: {
  icon: LucideIcon;
  label: string;
  chips: string[];
  tone?: NodeTone;
  note?: string;
}) {
  return (
    <div className={`flex-1 rounded-lg border px-3 py-2.5 ${BOX[tone]}`}>
      <div className="flex items-center gap-1.5">
        <Icon
          size={14}
          className={tone === "opt" ? "text-[#a04f15]" : "text-[#1b4f9c]"}
          aria-hidden="true"
        />
        <span className="font-mono text-[12px] font-bold text-[#262e3d]">{label}</span>
      </div>
      <div className="mt-1.5 flex flex-wrap gap-1">
        {chips.map((c) => (
          <span
            key={c}
            className={`rounded-md border px-1.5 py-0.5 font-mono text-[10.5px] leading-tight ${CHIP[tone]}`}
          >
            {c}
          </span>
        ))}
      </div>
      {note ? (
        <span className="mt-1.5 block text-[10.5px] leading-snug text-[#9aa6b8]">{note}</span>
      ) : null}
    </div>
  );
}

/** 分層容器：標籤膠囊壓在上緣中央，與 module-pipeline 同一套視覺語言 */
function Tier({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="relative rounded-xl border border-[#cbd3df] px-3 pb-3 pt-7">
      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#1b4f9c] px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-white">
        {label}
      </span>
      {children}
    </section>
  );
}

function Swatch({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`inline-block size-3 rounded-sm border ${className}`} />
      <span className="text-[11px] text-[#4f5b6e]">{label}</span>
    </span>
  );
}

export default function TechStackArchitecture() {
  return (
    <div className="not-prose mx-auto w-full max-w-3xl space-y-4">
      <Tier label="執行環境">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Node
            icon={Terminal}
            label="Python"
            chips={["3.13", "uv 0.12.18", "uv.lock"]}
            note="版本全鎖死，從零可完整重跑"
          />
          <Node
            icon={BookOpen}
            label="Node（文件側）"
            chips={["22", "notecraftapp 1.13.0", "recharts", "diagram-design"]}
            note="要操作才懂的用元件，看一眼就走的用靜態圖"
          />
        </div>
      </Tier>

      <Tier label="相依套件">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Node
              icon={Package}
              label="資料與運算"
              chips={["numpy 2.5.4", "pandas 3.1.0", "scipy 1.18.1", "pyarrow 26.0.0"]}
            />
            <Node
              icon={Boxes}
              label="scikit-learn 1.9.1"
              chips={["Pipeline", "GridSearchCV", "GroupKFold", "PCA", "TruncatedSVD"]}
            />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Node
              icon={Cpu}
              label="extra「embed」"
              tone="opt"
              chips={["sentence-transformers", "torch 2.15.0", "Apple MPS", "bge-m3 1024 維"]}
              note="選配。接在建模之後，只換文字表示；沒裝也能跑完主線"
            />
            <Node
              icon={ShieldCheck}
              label="extra「dev」"
              chips={["pytest 9.2.0", "ruff 0.17.3"]}
              note="91 passed、2 skipped；洩漏檢查是不變量"
            />
          </div>
        </div>
      </Tier>

      <Tier label="本專案程式">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Node
            icon={Boxes}
            label="src/splitsense/"
            tone="own"
            chips={["12 個模組", "config 被 24 處 import", "metrics 被 6 處"]}
            note="實驗參數全部集中在 config.py"
          />
          <Node
            icon={FileCode2}
            label="scripts/"
            tone="own"
            chips={[
              "run_eda",
              "build_dataset",
              "embed_texts",
              "run_baselines",
              "run_models",
              "run_error_analysis",
            ]}
            note="6 支，每支剛好寫一個產物目錄"
          />
        </div>
      </Tier>

      <Tier label="儲存">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Node
            icon={Database}
            label="data/"
            tone="store"
            chips={["raw/　上游 parquet"]}
            note="由程式自動下載，不進版控"
          />
          <Node
            icon={Archive}
            label="artifacts/"
            tone="store"
            chips={["eda", "manifests", "embeddings", "baselines", "models", "error_analysis"]}
            note="六個目錄全部不進版控（研究規格 9.3）"
          />
        </div>
      </Tier>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#e1e6ee] pt-3">
        <span className="font-mono text-[10px] tracking-[0.14em] text-[#9aa6b8]">LEGEND</span>
        <Swatch className="border-[#1b4f9c] bg-[#eef4fb]" label="本專案自己寫的" />
        <Swatch className="border-[#e1e6ee] bg-white" label="第三方套件" />
        <Swatch className="border-[#cbd3df] bg-[#f6f8fb]" label="儲存，不進版控" />
        <Swatch
          className="border-dashed border-[#c7641a] bg-[#fdf4e6]"
          label="選配，沒裝也能跑完主線"
        />
        <span className="ml-auto font-mono text-[10px] text-[#9aa6b8]">執行順序見下一節</span>
      </div>
    </div>
  );
}
