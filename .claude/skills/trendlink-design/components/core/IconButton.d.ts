import * as React from "react";

export interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Visual style. @default "soft" */
  variant?: "solid" | "accent" | "soft" | "ghost" | "outline";
  /** @default "md" */
  size?: "sm" | "md" | "lg";
  /** @default "circle" */
  shape?: "circle" | "rounded";
  /** Accessible label (icon-only button). */
  label?: string;
  /** Single icon element. */
  children?: React.ReactNode;
  disabled?: boolean;
}

/** Icon-only control for search, close, and toolbar actions. */
export function IconButton(props: IconButtonProps): JSX.Element;
