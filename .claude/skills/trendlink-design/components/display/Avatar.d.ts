import * as React from "react";

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Name — first 2 chars become the fallback initials. */
  name?: string;
  /** Image URL; falls back to initials if omitted. */
  src?: string;
  /** @default "md" */
  size?: "sm" | "md" | "lg" | "xl";
  /** @default "blue" */
  tone?: "blue" | "orange" | "navy";
}

/** Circular initials/image avatar. */
export function Avatar(props: AvatarProps): JSX.Element;
