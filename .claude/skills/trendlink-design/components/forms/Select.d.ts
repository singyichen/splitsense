import * as React from "react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  /** @default "md" */
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
}

/** Native select styled to match Input, with custom chevron. */
export function Select(props: SelectProps): JSX.Element;
