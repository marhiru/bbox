import React, { useState, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";

const annotatorLabelVariants = cva("absolute", {
  variants: {
    inputMethod: {
      text: "",
      select: "",
      none: ""
    },
    size: {
      default: "min-w-[120px]",
      sm: "min-w-[100px]",
      lg: "min-w-[140px]",
    },
  },
  defaultVariants: {
    inputMethod: "text",
    size: "default",
  },
});

type AnnotatorLabelVariants = VariantProps<typeof annotatorLabelVariants>;

interface AnnotatorLabelProps extends AnnotatorLabelVariants {
  left: number;
  top: number;
  inputMethod?: "text" | "select" | "none";
  labels?: string | string[];
  onSubmit: (label: string) => void;
  className?: string;
}

const AnnotatorLabel = forwardRef<
  HTMLInputElement | HTMLSelectElement,
  AnnotatorLabelProps
>(
  (
    {
      inputMethod,
      size,
      left,
      top,
      labels = ["object"],
      onSubmit,
      className,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = useState("");

    const labelArray = typeof labels === "string" ? [labels] : labels;

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const newValue = e.target.value;
      setValue(newValue);
      if (inputMethod === "select") {
        onSubmit(newValue);
      }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onSubmit(value);
      }
    };

    const positionStyles: React.CSSProperties = {
      left: `${left}px`,
      top: `${top}px`,
    };

    const renderInput = () => {
      const baseInputClasses = cn(
        "px-3 py-2 text-sm border rounded-md",
        "bg-background text-foreground",
        "focus:outline-none focus:ring-2 focus:ring-ring",
        "transition-all duration-200",
        "placeholder:text-muted-foreground"
      );

      switch (inputMethod) {
        case "select":
          return (
            <select
              className={cn(baseInputClasses, "cursor-pointer")}
              name="label"
              ref={ref as React.Ref<HTMLSelectElement>}
              onChange={handleChange}
              onMouseDown={(e) => e.stopPropagation()}
              defaultValue=""
            >
              <option value="" disabled>
                Escolha um item
              </option>
              {labelArray.map((label) => (
                <option key={label} value={label}>
                  {label}
                </option>
              ))}
            </select>
          );

        case "text":
          return (
            <Input
              className={cn(baseInputClasses, "cursor-text")}
              name="label"
              type="text"
              value={value}
              ref={ref as React.Ref<HTMLInputElement>}
              onKeyDown={handleKeyPress}
              onChange={handleChange}
              onMouseDown={(e) => e.stopPropagation()}
              placeholder="Digite o label..."
            />
          );
        case 'none':
          return;

        default:
          throw new Error(`Método de input inválido: ${inputMethod}`);
      }
    };

    return (
      <div
        className={cn(annotatorLabelVariants({ inputMethod, size }), className)}
        style={positionStyles}
        {...props}
      >
        {renderInput()}
      </div>
    );
  }
);

AnnotatorLabel.displayName = "AnnotatorLabel";

export default AnnotatorLabel;
