import * as React from "react";

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Text label beside the toggle. */
  label?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
}

/** Pill toggle switch, golden when on. */
export function Switch(props: SwitchProps): JSX.Element;
