import { useState } from "react";

const NAVY = "#1b4f9c";
const NAVY_SOFT = "#d6e4f5";
const GOLD = "#ed9b26";
const GOLD_SOFT = "#fbe7c6";
const GREY = "#9aa6b8";
const GREY_SOFT = "#eef1f6";
const INK = "#262e3d";
const MUTED = "#6c798e";

type Step = { title: string; note: string; lit: string[] };

const STEPS: Step[] = [
  {
    title: "1　標註陸續進來",
    note: "測試集 4,741 題。每題已有前兩人的標註，第三份還沒到。",
    lit: ["in", "gate"],
  },
  {
    title: "2　前兩人已經不一致的，直接送複核",
    note: "1,588 題（33.5%）。這批百分之百有分歧——是定義，不需要模型判斷。",
    lit: ["in", "gate", "no", "review"],
  },
  {
    title: "3　看起來一致的，才交給模型排序",
    note: "3,153 題（66.5%），其中 24.7% 其實有分歧。模型在這裡排序，取前 10%（315 題）。",
    lit: ["in", "gate", "yes", "model", "topk", "review"],
  },
];

export default function ReviewRoutingFlow() {
  const [step, setStep] = useState(STEPS.length - 1);
  const on = (key: string) => STEPS[step].lit.includes(key);
  const dim = (key: string) => (on(key) ? 1 : 0.22);

  return (
    <div className="not-prose mx-auto max-w-2xl space-y-4">
      <div className="flex flex-wrap gap-2">
        {STEPS.map((item, index) => (
          <button
            key={item.title}
            type="button"
            onClick={() => setStep(index)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              index === step
                ? "bg-[#1b4f9c] text-white"
                : "bg-[#eef1f6] text-[#4f5b6e] hover:bg-[#e1e6ee]"
            }`}
          >
            {index + 1}
          </button>
        ))}
        <span className="self-center text-sm font-semibold text-[#262e3d]">{STEPS[step].title}</span>
      </div>

      <svg viewBox="0 0 540 330" width="100%" role="img" aria-label="複核分流流程圖">
        <defs>
          <marker id="flowArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0 0 L6 3 L0 6 z" fill={GREY} />
          </marker>
        </defs>

        <g opacity={dim("in")}>
          <rect x="190" y="8" width="160" height="38" rx="8" fill={NAVY_SOFT} />
          <text x="270" y="27" textAnchor="middle" fontSize="13" fontWeight="600" fill={INK}>
            標註陸續進來
          </text>
          <text x="270" y="41" textAnchor="middle" fontSize="11.5" fill={MUTED}>
            4,741 題
          </text>
          <path d="M270 46 L270 70" stroke={GREY} strokeWidth="1.5" markerEnd="url(#flowArrow)" />
        </g>

        <g opacity={dim("gate")}>
          <path d="M270 72 L368 112 L270 152 L172 112 Z" fill="#ffffff" stroke={NAVY} strokeWidth="2" />
          <text x="270" y="108" textAnchor="middle" fontSize="12.5" fontWeight="600" fill={NAVY}>
            前兩人
          </text>
          <text x="270" y="124" textAnchor="middle" fontSize="12.5" fontWeight="600" fill={NAVY}>
            意見一致？
          </text>
        </g>

        <g opacity={dim("no")}>
          <path d="M172 112 L92 112 L92 186" stroke={GREY} strokeWidth="1.5" fill="none" markerEnd="url(#flowArrow)" />
          <text x="130" y="105" textAnchor="middle" fontSize="12" fontWeight="600" fill={GOLD}>
            否
          </text>
          <text x="130" y="131" textAnchor="middle" fontSize="11.5" fill={MUTED}>
            1,588（33.5%）
          </text>
          <rect x="16" y="188" width="152" height="46" rx="8" fill={GOLD_SOFT} stroke={GOLD} strokeWidth="1.5" />
          <text x="92" y="208" textAnchor="middle" fontSize="12.5" fontWeight="600" fill={INK}>
            直接送複核
          </text>
          <text x="92" y="224" textAnchor="middle" fontSize="11.5" fill={MUTED}>
            不需要模型
          </text>
        </g>

        <g opacity={dim("yes")}>
          <path d="M368 112 L448 112 L448 186" stroke={GREY} strokeWidth="1.5" fill="none" markerEnd="url(#flowArrow)" />
          <text x="410" y="105" textAnchor="middle" fontSize="12" fontWeight="600" fill={NAVY}>
            是
          </text>
          <text x="410" y="131" textAnchor="middle" fontSize="11.5" fill={MUTED}>
            3,153（66.5%）
          </text>
        </g>

        <g opacity={dim("model")}>
          <rect x="372" y="188" width="152" height="46" rx="8" fill={NAVY} />
          <text x="448" y="208" textAnchor="middle" fontSize="12.5" fontWeight="600" fill="#ffffff">
            模型排序
          </text>
          <text x="448" y="224" textAnchor="middle" fontSize="11.5" fill={NAVY_SOFT}>
            其中 24.7% 有分歧
          </text>
          <path d="M448 234 L448 262" stroke={GREY} strokeWidth="1.5" markerEnd="url(#flowArrow)" />
        </g>

        <g opacity={dim("topk")}>
          <rect x="372" y="264" width="152" height="44" rx="8" fill="#ffffff" stroke={NAVY} strokeWidth="1.5" />
          <text x="448" y="283" textAnchor="middle" fontSize="12.5" fontWeight="600" fill={NAVY}>
            取前 10%
          </text>
          <text x="448" y="299" textAnchor="middle" fontSize="11.5" fill={MUTED}>
            315 題
          </text>
        </g>

        <g opacity={dim("review")}>
          <path d="M92 234 L92 286 L364 286" stroke={GREY} strokeWidth="1.5" fill="none" />
          <path d="M372 286 L364 286" stroke={GREY} strokeWidth="1.5" />
          <rect x="176" y="266" width="140" height="40" rx="8" fill={GREY_SOFT} />
          <text x="246" y="291" textAnchor="middle" fontSize="12.5" fontWeight="600" fill={INK}>
            人工複核佇列
          </text>
        </g>
      </svg>

      <p className="rounded-lg bg-[#f6f8fb] px-4 py-3 text-sm leading-relaxed text-[#3a4456]">
        {STEPS[step].note}
      </p>
    </div>
  );
}
