import { InputHTMLAttributes, forwardRef } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ className = "", label, error, id, ...props }, ref) => {
    return (
      <label className="flex w-full flex-col gap-1.5" htmlFor={id}>
        {label ? (
          <span className="text-sm font-bold text-text">{label}</span>
        ) : null}
        <input
          ref={ref}
          id={id}
          className={`w-full rounded-2xl border border-line bg-surface px-4 py-3.5 text-base text-text outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/20 ${error ? "border-danger" : ""} ${className}`}
          {...props}
        />
        {error ? <span className="text-xs text-danger">{error}</span> : null}
      </label>
    );
  }
);

Input.displayName = "Input";
