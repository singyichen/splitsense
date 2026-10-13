import * as React from "react";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Text label beside the box. */
  label?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
}

/** Square checkbox with brand-blue fill when checked. */
export function Checkbox(props: CheckboxProps): JSX.Element;
