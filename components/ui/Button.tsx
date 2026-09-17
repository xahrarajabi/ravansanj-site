import { ButtonHTMLAttributes, forwardRef } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "md" | "lg" | "sm";
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ className = "", variant = "primary", size = "md", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2 focus-visible:ring-offset-bg";
    const variants = {
      primary:
        "bg-primary text-white shadow-[0_8px_24px_rgba(107,158,196,0.28)] hover:bg-primary-dark active:scale-[0.98]",
      secondary:
        "bg-card text-text border border-line hover:border-primary/35 hover:bg-primary-soft",
      outline:
        "bg-transparent text-primary border border-primary/40 hover:bg-primary-soft",
      ghost: "bg-transparent text-primary hover:bg-primary-soft",
    };
    const sizes = {
      sm: "min-h-9 px-3.5 py-2 text-sm",
      md: "min-h-11 px-5 py-2.5 text-[0.95rem]",
      lg: "min-h-12 px-8 py-3 text-base",
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
