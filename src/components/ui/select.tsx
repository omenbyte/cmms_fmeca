"use client";
import * as React from "react";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={
        "h-8 rounded border px-2 text-sm focus:outline-none " + (className ?? "")
      }
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";
