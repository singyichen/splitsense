Underline tab bar with a sliding golden indicator, used for product feature sub-nav (出勤 / 休假 / 排班 / 薪資).

```jsx
<Tabs defaultValue="payroll" items={[
  { id: "attendance", label: "出勤" },
  { id: "timeoff", label: "休假" },
  { id: "payroll", label: "薪資計算" },
]} onChange={(id) => ...} />
```
