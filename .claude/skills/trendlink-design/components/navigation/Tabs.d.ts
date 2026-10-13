import * as React from "react";

export interface TabItem { id: string; label: React.ReactNode; }

export interface TabsProps {
  items: TabItem[];
  /** Controlled active id. */
  value?: string;
  /** Uncontrolled initial id. */
  defaultValue?: string;
  onChange?: (id: string) => void;
  style?: React.CSSProperties;
}

/** Underline tab bar with sliding golden indicator. */
export function Tabs(props: TabsProps): JSX.Element;
