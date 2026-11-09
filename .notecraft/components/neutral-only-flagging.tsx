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
const TFIDF = "#9dbde4";
const GREY = "#cbd3df";
const GOLD = "#ed9b26";

type Row = {
  同意的標籤: string;
  分歧率: number;
  "TF-IDF 送複核率": number;
  "BGE-M3 送複核率": number;
};

// artifacts/error_analysis/{tfidf,bge}/agreed_label_profile.csv
const DATA: Row[] = [
  { 同意的標籤: "neutral", 分歧率: 46.5, "TF-IDF 送複核率": 36.6, "BGE-M3 送複核率": 33.6 },
  { 同意的標籤: "ambiguous", 分歧率: 29.3, "TF-IDF 送複核率": 0, "BGE-M3 送複核率": 0 },
  { 同意的標籤: "negative", 分歧率: 20.8, "TF-IDF 送複核率": 0, "BGE-M3 送複核率": 0 },
  { 同意的標籤: "positive", 分歧率: 12.3, "TF-IDF 送複核率": 0, "BGE-M3 送複核率": 0 },
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
            <Bar dataKey="分歧率" fill={GREY} radius={[4, 4, 0, 0]} maxBarSize={32} name="該組真實分歧率">
              <LabelList
                dataKey="分歧率"
                position="top"
                fontSize={11.5}
                fill="#4f5b6e"
                formatter={(value: number) => `${value.toFixed(1)}`}
              />
            </Bar>
            <Bar
              dataKey="TF-IDF 送複核率"
              fill={TFIDF}
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
              name="TF-IDF 送複核比例"
            >
              <LabelList
                dataKey="TF-IDF 送複核率"
                position="top"
                fontSize={11.5}
                fill="#4f5b6e"
                formatter={(value: number) => (value > 0 ? `${value.toFixed(1)}` : "0")}
              />
            </Bar>
            <Bar
              dataKey="BGE-M3 送複核率"
              fill={NAVY}
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
              name="BGE-M3 送複核比例"
            >
              <LabelList
                dataKey="BGE-M3 送複核率"
                position="top"
                fontSize={11.5}
                fill="#1b4f9c"
                formatter={(value: number) => (value > 0 ? `${value.toFixed(1)}` : "0")}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="rounded-lg px-4 py-3 text-sm leading-relaxed text-[#3a4456]" style={{ background: "#fdf4e6" }}>
        <span className="font-semibold" style={{ color: GOLD }}>
          兩個模型送複核的題目都 100% 來自「兩人同意 neutral」這一組
        </span>
        ，其他三組一題都沒送。差別在組內：TF-IDF 的精確率 48.2%，只比該組基礎分歧率 46.5% 高 1.7 個百分點；BGE-M3 是 52.7%，高 6.2 個百分點。
        查表只能把 neutral 組排前面、組內是隨機的——TF-IDF 幾乎沒超過這件事，BGE 才真的在組內排出了順序。
      </p>
    </div>
  );
}
