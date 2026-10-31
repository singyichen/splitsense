import { useState } from "react";
import { Eye, EyeOff, HelpCircle } from "lucide-react";

const NAVY = "#1b4f9c";
const NAVY_SOFT = "#d6e4f5";
const GOLD = "#ed9b26";
const GREY = "#9aa6b8";
const GREY_SOFT = "#e1e6ee";
const GREEN = "#2e9e6b";
const RED = "#d64545";
const INK = "#262e3d";

type Case = {
  key: string;
  tab: string;
  comment: string;
  labels: [string, string, string];
  risk: string;
  takeaway: string;
};

const CASES: Case[] = [
  {
    key: "hidden",
    tab: "看起來沒事，其實有事",
    comment: "（一則語氣模糊的 Reddit 留言）",
    labels: ["neutral", "neutral", "positive"],
    risk: "偏高",
    takeaway:
      "前兩人一致，用「看前兩人吵不吵」的規則會判成安全——這批佔全部題目的 66.5%，其中 24.4% 最後其實有分歧。這就是本專案要抓的對象。",
  },
  {
    key: "obvious",
    tab: "前兩人就吵了",
    comment: "（一則帶反諷的 Reddit 留言）",
    labels: ["negative", "positive", "negative"],
    risk: "確定分歧",
    takeaway:
      "可見的兩份已經不一致，這題必然分歧——這是定義，不需要模型。佔 33.5%，實務上直接送複核就好。",
  },
];

export default function AnnotationRevealSetup() {
  const [caseIndex, setCaseIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const active = CASES[caseIndex];
  const [a, b, c] = active.labels;
  const visibleAgree = a === b;
  const hasDisagreement = new Set(active.labels).size > 1;

  const pick = (index: number) => {
    setCaseIndex(index);
    setRevealed(false);
  };

  return (
    <div className="not-prose mx-auto max-w-2xl space-y-4">
      <div className="flex gap-2">
        {CASES.map((item, index) => (
          <button
            key={item.key}
            type="button"
            onClick={() => pick(index)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              index === caseIndex
                ? "bg-[#1b4f9c] text-white"
                : "bg-[#eef1f6] text-[#4f5b6e] hover:bg-[#e1e6ee]"
            }`}
          >
            {item.tab}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 520 300" width="100%" role="img" aria-label="標註揭露設定示意圖">
        <rect x="150" y="8" width="220" height="40" rx="8" fill={NAVY_SOFT} />
        <text x="260" y="33" textAnchor="middle" fontSize="13" fill={INK}>
          {active.comment}
        </text>
        <path d="M260 48 L260 70" stroke={GREY} strokeWidth="1.5" />
        <path d="M100 70 L420 70" stroke={GREY} strokeWidth="1.5" />

        {[100, 260, 420].map((x, index) => {
          const hidden = index === 2 && !revealed;
          const label = active.labels[index];
          return (
            <g key={x}>
              <path d={`M${x} 70 L${x} 92`} stroke={GREY} strokeWidth="1.5" />
              <circle
                cx={x}
                cy={116}
                r="24"
                fill={hidden ? "#ffffff" : NAVY_SOFT}
                stroke={hidden ? GREY : NAVY}
                strokeWidth="2"
                strokeDasharray={hidden ? "5 4" : undefined}
              />
              <text x={x} y={121} textAnchor="middle" fontSize="13" fontWeight="600" fill={INK}>
                {["A", "B", "C"][index]}
              </text>
              <text x={x} y={158} textAnchor="middle" fontSize="12.5" fill={hidden ? GREY : INK}>
                {hidden ? "？" : label}
              </text>
            </g>
          );
        })}

        <rect x="36" y="178" width="288" height="30" rx="6" fill="none" stroke={NAVY} strokeWidth="1.5" />
        <text x="180" y="198" textAnchor="middle" fontSize="12.5" fontWeight="600" fill={NAVY}>
          模型看得到這兩份
        </text>
        <rect
          x="356"
          y="178"
          width="128"
          height="30"
          rx="6"
          fill="none"
          stroke={revealed ? GOLD : GREY}
          strokeWidth="1.5"
          strokeDasharray={revealed ? undefined : "5 4"}
        />
        <text x="420" y="198" textAnchor="middle" fontSize="12.5" fill={revealed ? GOLD : GREY}>
          {revealed ? "揭曉：只用來算答案" : "藏起來"}
        </text>

        <path d="M180 208 L180 232" stroke={NAVY} strokeWidth="1.5" markerEnd="url(#arrow)" />
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0 0 L6 3 L0 6 z" fill={NAVY} />
          </marker>
        </defs>
        <rect x="60" y="232" width="240" height="40" rx="8" fill={NAVY} />
        <text x="180" y="251" textAnchor="middle" fontSize="12.5" fill="#ffffff">
          預測：這題最後會不會分歧？
        </text>
        <text x="180" y="266" textAnchor="middle" fontSize="12" fill={NAVY_SOFT}>
          風險分數 {active.risk}
        </text>

        {revealed && (
          <>
            <rect
              x="336"
              y="232"
              width="168"
              height="40"
              rx="8"
              fill={hasDisagreement ? "#fbeaea" : "#e7f6ee"}
            />
            <text
              x="420"
              y="257"
              textAnchor="middle"
              fontSize="13"
              fontWeight="600"
              fill={hasDisagreement ? RED : GREEN}
            >
              {hasDisagreement ? "真實答案：有分歧" : "真實答案：一致"}
            </text>
          </>
        )}
      </svg>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setRevealed((value) => !value)}
          className="inline-flex items-center gap-2 rounded-full bg-[#ed9b26] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#e37b24]"
        >
          {revealed ? <EyeOff size={16} /> : <Eye size={16} />}
          {revealed ? "收回第三份標註" : "揭露第三份標註"}
        </button>
        <span className="inline-flex items-center gap-1.5 text-sm text-[#6c798e]">
          <HelpCircle size={14} />
          前兩人{visibleAgree ? "一致" : "已不一致"}
        </span>
      </div>

      <p className="rounded-lg bg-[#f6f8fb] px-4 py-3 text-sm leading-relaxed text-[#3a4456]">
        {active.takeaway}
      </p>
    </div>
  );
}
