import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** @default "blue" */
  tone?: "blue" | "orange" | "success" | "warning" | "danger" | "neutral";
  /** @default "soft" */
  variant?: "soft" | "solid";
  children?: React.ReactNode;
}

/** Small status pill. */
export function Badge(props: BadgeProps): JSX.Element;
