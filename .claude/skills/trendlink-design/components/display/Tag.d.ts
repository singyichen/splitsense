import * as React from "react";

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Highlighted/selected state. */
  active?: boolean;
  /** Show a remove (×) button and call this when clicked. */
  onRemove?: () => void;
  children?: React.ReactNode;
}

/** Outlined chip for categories & filters; optionally removable. */
export function Tag(props: TagProps): JSX.Element;
