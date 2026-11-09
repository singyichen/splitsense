// 靜態技術架構圖：技術棧怎麼疊起來、誰依賴誰。
// 與 module-pipeline.svg 互補——那張畫資料流（跑哪支腳本產出什麼），這張畫相依層級。
// 數字取自 docs/40-tech-stack.mdx 的盤點（2026-11-09）。

const NAVY = "#1b4f9c";
const AZURE = "#2c6ebb";
const GOLD_LINE = "#c7641a";
const GOLD_FILL = "rgba(237,155,38,0.10)";
const INK = "#262e3d";
const MUTED = "#4f5b6e";
const SOFT = "#9aa6b8";
const LINE = "#cbd3df";
const PALE = "#eef4fb";
const PAPER = "#f6f8fb";

type Layer = {
  y: number;
  index: string;
  title: string;
  body: string;
  mono?: string;
  tone: "neutral" | "brand" | "focus";
};

const CARD_X = 24;
const CARD_W = 552;
const CARD_H = 76;

const LAYERS: Layer[] = [
  {
    y: 14,
    index: "1",
    title: "執行環境",
    body: "Python 3.13（pyproject 要求 >=3.12）、套件管理 uv 0.12.18",
    mono: "版本鎖在 uv.lock，從零可完整重跑",
    tone: "neutral",
  },
  {
    y: 104,
    index: "2",
    title: "資料與運算",
    body: "numpy 2.5.4 · pandas 3.1.0 · scipy 1.18.1 · pyarrow 26.0.0",
    mono: "讀上游 parquet、manifest、稀疏矩陣串接",
    tone: "brand",
  },
  {
    y: 194,
    index: "3",
    title: "建模",
    body: "scikit-learn 1.9.1",
    mono: "Pipeline · GridSearchCV · GroupKFold · PCA · TruncatedSVD · ColumnTransformer",
    tone: "brand",
  },
  {
    y: 284,
    index: "4",
    title: "專案套件　src/splitsense/",
    body: "12 個模組。實驗參數全部集中在 config.py",
    mono: "config 被 24 處 import、metrics 被 6 處",
    tone: "focus",
  },
  {
    y: 374,
    index: "5",
    title: "可執行腳本　scripts/",
    body: "6 支。run_eda → build_dataset → run_baselines／embed_texts → run_models → run_error_analysis",
    mono: "每支只做一件事，產物寫進對應目錄",
    tone: "focus",
  },
  {
    y: 464,
    index: "6",
    title: "產物　artifacts/",
    body: "eda · manifests · baselines · models · error_analysis · embeddings",
    mono: "六個目錄全部不進版控（資料治理，研究規格 9.3）",
    tone: "neutral",
  },
];

const TONE: Record<Layer["tone"], { fill: string; stroke: string; bar: string }> = {
  neutral: { fill: PAPER, stroke: LINE, bar: SOFT },
  brand: { fill: "#ffffff", stroke: AZURE, bar: AZURE },
  focus: { fill: PALE, stroke: NAVY, bar: NAVY },
};

const SIDE_X = 604;
const SIDE_W = 352;

export default function TechStackArchitecture() {
  return (
    <div className="not-prose mx-auto w-full max-w-4xl">
      <svg
        viewBox="0 0 980 580"
        width="100%"
        role="img"
        aria-labelledby="tsa-title tsa-desc"
      >
        <title id="tsa-title">SplitSense 技術架構：六層相依與三塊旁支</title>
        <desc id="tsa-desc">
          由下而上六層：執行環境（Python 3.13、uv）、資料與運算（numpy、pandas、scipy、pyarrow）、
          建模（scikit-learn 1.9.1）、專案套件 src/splitsense 的 12 個模組、6 支可執行腳本、
          以及不進版控的 artifacts 產物目錄。右側三塊旁支：選配的 embed extra
          （sentence-transformers 與 torch，跑 BAAI/bge-m3，以虛線接到建模層）、
          品質閘（pytest 91 passed 2 skipped、ruff）、文件與視覺化鏈（Node 22、notecraftapp、recharts、diagram-design）。
        </desc>

        <defs>
          <marker
            id="tsa-arrow"
            viewBox="0 0 8 8"
            refX="7"
            refY="4"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
          >
            <path d="M 0 0.5 L 7.5 4 L 0 7.5 z" fill={SOFT} />
          </marker>
          <marker
            id="tsa-arrow-gold"
            viewBox="0 0 8 8"
            refX="7"
            refY="4"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
          >
            <path d="M 0 0.5 L 7.5 4 L 0 7.5 z" fill={GOLD_LINE} />
          </marker>
        </defs>

        {/* 主幹：六層 */}
        {LAYERS.map((layer, i) => {
          const tone = TONE[layer.tone];
          return (
            <g key={layer.index}>
              <rect
                x={CARD_X}
                y={layer.y}
                width={CARD_W}
                height={CARD_H}
                rx={10}
                fill={tone.fill}
                stroke={tone.stroke}
              />
              <rect
                x={CARD_X}
                y={layer.y + 14}
                width={4}
                height={CARD_H - 28}
                rx={2}
                fill={tone.bar}
              />
              <text
                x={CARD_X + 20}
                y={layer.y + 26}
                fontSize={11}
                fontWeight={700}
                fill={tone.bar}
                fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
              >
                {layer.index}
              </text>
              <text x={CARD_X + 40} y={layer.y + 26} fontSize={13} fontWeight={700} fill={INK}>
                {layer.title}
              </text>
              <text x={CARD_X + 40} y={layer.y + 46} fontSize={11} fill={MUTED}>
                {layer.body}
              </text>
              {layer.mono ? (
                <text
                  x={CARD_X + 40}
                  y={layer.y + 64}
                  fontSize={9.5}
                  fill={SOFT}
                  fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                >
                  {layer.mono}
                </text>
              ) : null}
              {i < LAYERS.length - 1 ? (
                <line
                  x1={CARD_X + CARD_W / 2}
                  y1={layer.y + CARD_H}
                  x2={CARD_X + CARD_W / 2}
                  y2={layer.y + CARD_H + 13}
                  stroke={SOFT}
                  strokeWidth={1.5}
                  markerEnd="url(#tsa-arrow)"
                />
              ) : null}
            </g>
          );
        })}

        {/* 旁支一：選配 extra（虛線，接回建模層） */}
        <rect
          x={SIDE_X}
          y={194}
          width={SIDE_W}
          height={CARD_H}
          rx={10}
          fill={GOLD_FILL}
          stroke={GOLD_LINE}
          strokeDasharray="5,4"
        />
        <text x={SIDE_X + 20} y={216} fontSize={13} fontWeight={700} fill={INK}>
          選配　extra 「embed」
        </text>
        <text x={SIDE_X + 20} y={236} fontSize={11} fill={MUTED}>
          sentence-transformers 6.2.0 → torch 2.15.0（Apple MPS）
        </text>
        <text
          x={SIDE_X + 20}
          y={254}
          fontSize={9.5}
          fill={SOFT}
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        >
          BAAI/bge-m3 1024 維，環境多約 2 GB；沒裝也能跑完主線
        </text>
        <line
          x1={SIDE_X}
          y1={194 + CARD_H / 2}
          x2={CARD_X + CARD_W + 12}
          y2={194 + CARD_H / 2}
          stroke={GOLD_LINE}
          strokeWidth={1.5}
          strokeDasharray="5,4"
          markerEnd="url(#tsa-arrow-gold)"
        />

        {/* 旁支二：品質閘 */}
        <rect
          x={SIDE_X}
          y={284}
          width={SIDE_W}
          height={CARD_H}
          rx={10}
          fill="#ffffff"
          stroke={LINE}
        />
        <text x={SIDE_X + 20} y={306} fontSize={13} fontWeight={700} fill={INK}>
          品質閘（dev extra）
        </text>
        <text x={SIDE_X + 20} y={326} fontSize={11} fill={MUTED}>
          pytest 9.2.0 · ruff 0.17.3
        </text>
        <text
          x={SIDE_X + 20}
          y={344}
          fontSize={9.5}
          fill={SOFT}
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        >
          91 passed、2 skipped；洩漏檢查與重現性是不變量
        </text>

        {/* 旁支三：文件與視覺化 */}
        <rect
          x={SIDE_X}
          y={374}
          width={SIDE_W}
          height={166}
          rx={10}
          fill={PAPER}
          stroke={LINE}
        />
        <text x={SIDE_X + 20} y={396} fontSize={13} fontWeight={700} fill={INK}>
          文件與視覺化（Node 側）
        </text>
        <text x={SIDE_X + 20} y={418} fontSize={11} fill={MUTED}>
          Node ≥ 22 · notecraftapp 1.13.0（port 4326）
        </text>
        <text x={SIDE_X + 20} y={440} fontSize={11} fill={MUTED}>
          React 18 + recharts 2.15.4 → 互動元件
        </text>
        <text x={SIDE_X + 20} y={462} fontSize={11} fill={MUTED}>
          diagram-design v2.6.136 → 靜態 SVG
        </text>
        <line
          x1={SIDE_X + 20}
          y1={476}
          x2={SIDE_X + SIDE_W - 20}
          y2={476}
          stroke={LINE}
          strokeWidth={0.8}
        />
        <text
          x={SIDE_X + 20}
          y={496}
          fontSize={9.5}
          fill={SOFT}
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        >
          分工以用途切，不以位置切
        </text>
        <text x={SIDE_X + 20} y={516} fontSize={9.5} fill={SOFT}>
          要讀者操作才懂的用元件，看一眼就走的用靜態圖
        </text>

        {/* 圖例 */}
        <line x1={24} y1={558} x2={956} y2={558} stroke={LINE} strokeWidth={0.8} />
        <text
          x={24}
          y={574}
          fontSize={9}
          fill={MUTED}
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          letterSpacing="0.14em"
        >
          LEGEND
        </text>
        <rect x={110} y={566} width={14} height={9} rx={2} fill={PALE} stroke={NAVY} />
        <text x={130} y={574} fontSize={9.5} fill={MUTED}>
          本專案自己寫的
        </text>
        <rect x={222} y={566} width={14} height={9} rx={2} fill="#ffffff" stroke={AZURE} />
        <text x={242} y={574} fontSize={9.5} fill={MUTED}>
          第三方套件
        </text>
        <rect x={318} y={566} width={14} height={9} rx={2} fill={PAPER} stroke={LINE} />
        <text x={338} y={574} fontSize={9.5} fill={MUTED}>
          環境與產物
        </text>
        <rect
          x={414}
          y={566}
          width={14}
          height={9}
          rx={2}
          fill={GOLD_FILL}
          stroke={GOLD_LINE}
          strokeDasharray="3,2"
        />
        <text x={434} y={574} fontSize={9.5} fill={MUTED}>
          選配，沒裝也能跑完主線
        </text>
        <text
          x={956}
          y={574}
          fontSize={9.5}
          fill={SOFT}
          textAnchor="end"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        >
          版本為 2026-11-09 盤點值
        </text>
      </svg>
    </div>
  );
}
