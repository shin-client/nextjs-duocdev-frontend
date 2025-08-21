"use client"

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

function Input({ className, type, onChange, value, ...props }: React.ComponentProps<"input">) {
  const [displayValue, setDisplayValue] = useState("");

  const formatNumber = (num: string) => {
    // Tìm tất cả ký tự không phải số
    const digits = num.replace(/\D/g, "");
    if (!digits) return "";
    // Thêm thousands separator
    return Number(digits).toLocaleString("en-US");
  };

  // Handle number input formatting
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const rawValue = inputValue.replace(/\D/g, "");
    const formatted = formatNumber(rawValue);
    setDisplayValue(formatted);

    // Call original onChange with raw number value
    if (onChange) {
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: rawValue
        }
      };
      onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
    }
  };

  // Sync external value changes
  useEffect(() => {
    if (type === "number" && value !== undefined) {
      setDisplayValue(formatNumber(String(value)));
    }
  }, [value, type]);

  // Use formatted value for number inputs, regular value for others
  const inputValue = type === "number" ? displayValue : value;
  const inputOnChange = type === "number" ? handleNumberChange : onChange;

  return (
    <input
      type={type === "number" ? "text" : type}
      data-slot="input"
      value={inputValue}
      onChange={inputOnChange}
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

export { Input };
