import * as React from "react";

export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The number/metric (string or node). */
  value?: React.ReactNode;
  /** Caption under the number. */
  label?: React.ReactNode;
  /** Small suffix after the value (e.g. 家, +, %). */
  suffix?: React.ReactNode;
  /** @default "blue" */
  tone?: "blue" | "orange";
  /** @default "left" */
  align?: "left" | "center";
}

/** Big-number proof point for dashboards & marketing. */
export function Stat(props: StatProps): JSX.Element;
