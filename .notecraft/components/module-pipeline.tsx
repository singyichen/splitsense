// 管線圖：從上游資料到產物，四層各自的模組、腳本與不變量。靜態，不需要 client:* directive。
// 視覺語言與 tech-stack-architecture.tsx 共用：深色膠囊壓在容器上緣標層級、圓角容器框住每層、
// 虛線＝選配或非主線。那張畫相依層級，這張畫執行順序。
// 數字正本在本檔；diagrams/module-pipeline.html 是 PNG 匯出用的副本，改了要同步。

import {
  Database,
  Download,
  FileCode2,
  GitBranch,
  HardDrive,
  Layers,
  Settings2,
  ShieldAlert,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Layer = {
  n: string;
  title: string;
  icon: LucideIcon;
  modules: string[];
  script: string;
  invariant: string;
  store: string[];
};

const LAYERS: Layer[] = [
  {
    n: "1",
    title: "取得資料",
    icon: Download,
    modules: ["data.py", "eda.py"],
    script: "run_eda.py",
    invariant: "切 split 前先文字去重，同一段文字不得同時落在 train 與 test",
    store: ["data/raw/", "artifacts/eda/"],
  },
  {
    n: "2",
    title: "資料協議",
    icon: GitBranch,
    modules: ["split.py", "reveal.py"],
    script: "build_dataset.py",
    invariant: "只用可見的 2 份建特徵；隱藏標註不得進入特徵或統計",
    store: ["artifacts/manifests/"],
  },
  {
    n: "3",
    title: "特徵",
    icon: Layers,
    modules: ["features.py", "embeddings.py"],
    script: "embed_texts.py",
    invariant: "兩者都只由 training 決定；PCA 在 Pipeline 裡逐折 fit",
    store: ["artifacts/embeddings/"],
  },
  {
    n: "4",
    title: "模型與分析",
    icon: Settings2,
    modules: ["baselines.py", "models.py", "error_analysis.py"],
    script: "run_models.py 等 3 支",
    invariant: "只取恰好 3 份標註的 item，分母固定",
    store: ["artifacts/baselines/", "artifacts/models/", "artifacts/error_analysis/"],
  },
];

const LAYER_SPECS: Record<string, string[]> = {
  "2": ["item-level 70/15/15", "揭露 2 份"],
  "3": ["TF-IDF 31,451 維", "bge-m3 → PCA 64"],
  "4": ["階梯 0–3 ＋ BGE", "full／hard", "配對比較"],
};

const ORDER = [
  "run_eda",
  "build_dataset",
  "embed_texts",
  "run_models",
  "run_error_analysis",
  "run_error_analysis --model bge",
];

function Chip({ text, mono = true }: { text: string; mono?: boolean }) {
  return (
    <span
      className={`rounded-md border border-[#e1e6ee] bg-[#f6f8fb] px-1.5 py-0.5 text-[10.5px] leading-tight text-[#4f5b6e] ${
        mono ? "font-mono" : ""
      }`}
    >
      {text}
    </span>
  );
}

export default function ModulePipeline() {
  return (
    <div className="not-prose mx-auto w-full max-w-3xl space-y-3">
      <div className="rounded-lg border border-dashed border-[#cbd3df] bg-[#f9fafc] px-3 py-2">
        <div className="flex items-center gap-1.5">
          <Database size={14} className="text-[#6c798e]" aria-hidden="true" />
          <span className="text-[12px] font-bold text-[#4f5b6e]">外部來源</span>
        </div>
        <div className="mt-1.5 flex flex-wrap gap-1">
          <Chip text="HuggingFace MichiganNLP/TID-8" />
          <Chip text="goemotions-atr" />
          <Chip text="恰好 3 份標註" />
        </div>
      </div>

      <div
        className="space-y-3"
        role="img"
        aria-label="分層架構圖。由上而下四層：1 取得資料（data.py、eda.py，跑 run_eda.py，不變量是切 split 前先文字去重）；2 資料協議（split.py、reveal.py，跑 build_dataset.py，item-level 70/15/15、揭露 2 份，隱藏標註不得進入特徵或統計）；3 特徵（features.py、embeddings.py，跑 embed_texts.py，TF-IDF 31,451 維、bge-m3 經 PCA 降到 64 維，兩者都只由 training 決定）；4 模型與分析（baselines.py、models.py、error_analysis.py，跑 run_models.py 等 3 支，只取恰好 3 份標註的 item）。每層右側標出它寫出的目錄。底部是六支腳本的執行順序，以及四層共用的 config.py 與 metrics.py"
      >
        {LAYERS.map((layer) => {
          const Icon = layer.icon;
          return (
            <section
              key={layer.n}
              className="relative rounded-xl border border-[#cbd3df] px-3 pb-3 pt-7"
            >
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#1b4f9c] px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-white">
                {layer.n}　{layer.title}
              </span>

              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex-1 rounded-lg border border-[#1b4f9c] bg-[#eef4fb] px-3 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <Icon size={14} className="text-[#1b4f9c]" aria-hidden="true" />
                    <span className="text-[12px] font-bold text-[#262e3d]">模組與腳本</span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {layer.modules.map((m) => (
                      <Chip key={m} text={m} />
                    ))}
                    <span className="rounded-md border border-[#adc8e8] bg-white px-1.5 py-0.5 font-mono text-[10.5px] leading-tight text-[#163f7d]">
                      {layer.script}
                    </span>
                  </div>
                  {LAYER_SPECS[layer.n] && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {LAYER_SPECS[layer.n].map((s) => (
                        <Chip key={s} text={s} mono={false} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-lg border border-dashed border-[#cbd3df] bg-[#f6f8fb] px-3 py-2.5 sm:w-52">
                  <div className="flex items-center gap-1.5">
                    <HardDrive size={14} className="text-[#6c798e]" aria-hidden="true" />
                    <span className="text-[12px] font-bold text-[#4f5b6e]">寫出</span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {layer.store.map((s) => (
                      <Chip key={s} text={s} />
                    ))}
                  </div>
                </div>
              </div>

              <p className="mt-2 flex items-start gap-1.5 text-[10.5px] leading-snug text-[#a04f15]">
                <ShieldAlert size={13} className="mt-px shrink-0" aria-hidden="true" />
                <span>{layer.invariant}</span>
              </p>
            </section>
          );
        })}
      </div>

      <div className="rounded-lg border border-[#e1e6ee] bg-white px-3 py-2.5">
        <div className="flex items-center gap-1.5">
          <FileCode2 size={14} className="text-[#1b4f9c]" aria-hidden="true" />
          <span className="text-[12px] font-bold text-[#262e3d]">執行順序</span>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-1">
          {ORDER.map((s, i) => (
            <span key={s} className="flex items-center gap-1">
              {i > 0 && <span className="text-[#9aa6b8]">→</span>}
              <Chip text={s} />
            </span>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-1">
          <span className="text-[10.5px] text-[#9aa6b8]">四層共用：</span>
          <Chip text="config.py" />
          <Chip text="metrics.py" />
        </div>
      </div>
    </div>
  );
}
