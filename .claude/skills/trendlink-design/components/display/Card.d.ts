import * as React from "react";

/**
 * Primary content surface — soft rounded, shallow shadow, optional accent stripe.
 * @startingPoint section="Display" subtitle="Cards, badges, tags, avatars & stats" viewport="700x360"
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Top accent stripe color. */
  accent?: false | "blue" | "orange";
  /** Lift + deepen shadow on hover. */
  hoverable?: boolean;
  /** CSS padding value. @default var(--space-6) */
  padding?: string;
  children?: React.ReactNode;
}

export interface CardIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** @default "blue" */
  tone?: "blue" | "orange";
  children?: React.ReactNode;
}

/**
 * Primary content surface — soft rounded, shallow shadow, optional accent stripe.
 */
export function Card(props: CardProps): JSX.Element;
/** Icon medallion for the top of feature cards. */
export function CardIcon(props: CardIconProps): JSX.Element;
