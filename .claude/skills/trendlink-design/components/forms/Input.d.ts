import * as React from "react";

/**
 * Labelled text input with focus ring, helper & error states.
 * @startingPoint section="Forms" subtitle="Form fields — input, select, checkbox, switch" viewport="700x320"
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Field label rendered above the control. */
  label?: string;
  /** Helper text below the field. */
  hint?: string;
  /** Error message — overrides hint and switches to danger styling. */
  error?: string;
  /** Icon element rendered inside, before the text. */
  iconLeft?: React.ReactNode;
  /** @default "md" */
  size?: "sm" | "md" | "lg";
}

/**
 * Labelled text input with focus ring, helper & error states.
 */
export function Input(props: InputProps): JSX.Element;
