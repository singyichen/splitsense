import * as React from "react";

/**
 * Primary action control for TrendLink interfaces.
 * @startingPoint section="Core" subtitle="Buttons — CTA pill, navy, outline & ghost" viewport="700x180"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. primary = golden CTA pill, secondary = navy, plus outline/ghost. */
  variant?: "primary" | "secondary" | "outline" | "ghost";
  /** Control height/padding. @default "md" */
  size?: "sm" | "md" | "lg";
  /** Corner style. @default "pill" */
  shape?: "pill" | "rounded";
  /** Icon element rendered before the label. */
  iconLeft?: React.ReactNode;
  /** Icon element rendered after the label. */
  iconRight?: React.ReactNode;
  /** Stretch to container width. */
  fullWidth?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}

/**
 * Primary action control for TrendLink interfaces.
 */
export function Button(props: ButtonProps): JSX.Element;
