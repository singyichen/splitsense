import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const NAVY = "#1b4f9c";
const GOLD = "#ed9b26";
const GREY = "#cbd3df";

type Row = { 標註數: string; 分歧率: number; 題數: number; kept: boolean };

const DATA: Row[] = [
  { 標註數: "1 份", 分歧率: 0.0, 題數: 1877, kept: false },
  { 標註數: "2 份", 分歧率: 30.7, 題數: 6103, kept: false },
  { 標註數: "3 份", 分歧率: 49.7, 題數: 31766, kept: true },
  { 標註數: "4 份", 分歧率: 88.1, 題數: 5533, kept: false },
  { 標註數: "5 份", 分歧率: 85.5, 題數: 12424, kept: false },
];

function renderTooltip({ active, payload }: { active?: boolean; payload?: { payload: Row }[] }) {
  if (!active || !payload || payload.length === 0) return null;
  const row = payload[0].payload;
  return (
    <div className="rounded-md border border-[#e1e6ee] bg-white px-3 py-2 text-sm shadow-sm">
      <div className="font-semibold text-[#262e3d]">每題 {row.標註數}</div>
      <div className="text-[#4f5b6e]">分歧率 {row.分歧率.toFixed(1)}%</div>
      <div className="text-[#6c798e]">{row.題數.toLocaleString()} 題</div>
    </div>
  );
}

export default function AnnotationCountLeakage() {
  return (
    <div className="not-prose mx-auto max-w-2xl space-y-3">
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={DATA} margin={{ top: 24, right: 8, bottom: 4, left: 0 }}>
            <CartesianGrid vertical={false} stroke="#eef1f6" />
            <XAxis dataKey="標註數" tickLine={false} axisLine={{ stroke: "#cbd3df" }} fontSize={12.5} />
            <YAxis
              unit="%"
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
              fontSize={12}
              width={46}
            />
            <Tooltip content={renderTooltip} cursor={{ fill: "#f6f8fb" }} />
            <Bar dataKey="分歧率" radius={[4, 4, 0, 0]} maxBarSize={64}>
              {DATA.map((row) => (
                <Cell key={row.標註數} fill={row.kept ? NAVY : GREY} />
              ))}
              <LabelList
                dataKey="分歧率"
                position="top"
                fontSize={12.5}
                fill="#3a4456"
                formatter={(value: number) => `${value.toFixed(1)}%`}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#4f5b6e]">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-sm" style={{ background: NAVY }} />
          本專案只用這一組（31,766 題）
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-sm" style={{ background: GREY }} />
          排除
        </span>
      </div>

      <p className="rounded-lg px-4 py-3 text-sm leading-relaxed text-[#3a4456]" style={{ background: "#fdf4e6" }}>
        <span className="font-semibold" style={{ color: GOLD }}>
          標註數本身就洩漏答案。
        </span>{" "}
        4 份與 5 份的分歧率衝到 85% 以上，因為當初就是「這題不清楚」才被加派人手去標。只取恰好 3 份、固定分母，這條路徑才被切斷。
      </p>
    </div>
  );
}
