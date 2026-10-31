import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const NAVY = "#1b4f9c";
const BLUE_SOFT = "#adc8e8";
const GOLD = "#ed9b26";

type Row = { 同意的標籤: string; 分歧率: number; 送複核率: number; 精確率: number | null };

const DATA: Row[] = [
  { 同意的標籤: "neutral", 分歧率: 46.5, 送複核率: 36.5, 精確率: 48.1 },
  { 同意的標籤: "ambiguous", 分歧率: 29.3, 送複核率: 0, 精確率: null },
  { 同意的標籤: "negative", 分歧率: 20.8, 送複核率: 0, 精確率: null },
  { 同意的標籤: "positive", 分歧率: 12.3, 送複核率: 0, 精確率: null },
];

export default function NeutralOnlyFlagging() {
  return (
    <div className="not-prose mx-auto max-w-2xl space-y-3">
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={DATA} margin={{ top: 24, right: 8, bottom: 4, left: 0 }}>
            <CartesianGrid vertical={false} stroke="#eef1f6" />
            <XAxis dataKey="同意的標籤" tickLine={false} axisLine={{ stroke: "#cbd3df" }} fontSize={12.5} />
            <YAxis unit="%" domain={[0, 55]} tickLine={false} axisLine={false} fontSize={12} width={46} />
            <Legend verticalAlign="top" height={28} iconType="square" wrapperStyle={{ fontSize: 12.5 }} />
            <Bar dataKey="分歧率" fill={BLUE_SOFT} radius={[4, 4, 0, 0]} maxBarSize={44} name="該組真實分歧率">
              <LabelList
                dataKey="分歧率"
                position="top"
                fontSize={12}
                fill="#4f5b6e"
                formatter={(value: number) => `${value.toFixed(1)}`}
              />
            </Bar>
            <Bar dataKey="送複核率" fill={NAVY} radius={[4, 4, 0, 0]} maxBarSize={44} name="模型送複核的比例">
              <LabelList
                dataKey="送複核率"
                position="top"
                fontSize={12}
                fill="#1b4f9c"
                formatter={(value: number) => (value > 0 ? `${value.toFixed(1)}` : "0")}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="rounded-lg px-4 py-3 text-sm leading-relaxed text-[#3a4456]" style={{ background: "#fdf4e6" }}>
        <span className="font-semibold" style={{ color: GOLD }}>
          模型送複核的題目，100% 來自「兩人同意 neutral」這一組
        </span>
        ，其他三組一題都沒送。而在 neutral 組裡面，送出的精確率 48.1% 只比該組本來的分歧率 46.5% 高 1.6 個百分點——文字只是在組內微調。這就是四列查表能拿到 95% 的機制。
      </p>
    </div>
  );
}
