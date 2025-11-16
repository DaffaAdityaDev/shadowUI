import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

const button = cva(
  "inline-flex items-center justify-center font-medium rounded transition focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        filled: "bg-indigo-600 text-white hover:bg-green-500 active:bg-indigo-800",
        outline: "bg-transparent border border-gray-300 text-gray-900 hover:bg-gray-50",
        ghost: "bg-transparent text-gray-900 hover:bg-gray-100",
      },
      size: {
        sm: "h-8 px-2 text-sm",
        md: "h-10 px-4 text-base",
        lg: "h-12 px-6 text-lg",
      },
      tone: {
        default: "",
        danger: "bg-red-600 hover:bg-red-700 text-white",
      },
    },
    defaultVariants: {
      variant: "filled",
      size: "md",
      tone: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, tone, disabled, children, ...rest }, ref) => {
    const classes = twMerge(button({ variant, size, tone }), className);
    return (
      <button
        ref={ref}
        className={clsx(classes, disabled && "opacity-50 cursor-not-allowed")}
        disabled={disabled}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";