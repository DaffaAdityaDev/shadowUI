// packages/ui/src/components/Button/button.types.ts
import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { VariantProps } from "class-variance-authority";
import type { buttonVariants } from "./button.variants";

export type ButtonTheme = "primer" | "fluid-glass" | (string & {});

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  theme?: ButtonTheme;
  "data-theme"?: string;
}
