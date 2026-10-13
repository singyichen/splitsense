import * as React from "react";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Status color. @default "info" */
  tone?: "info" | "success" | "warning" | "danger";
  /** Bold heading line. */
  title?: React.ReactNode;
  /** Leading icon element. */
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

/** Inline status message banner. */
export function Alert(props: AlertProps): JSX.Element;
