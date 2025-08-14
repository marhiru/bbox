import React, { JSX } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  ANNOTATOR_CONSTANTS,
  type EntryType
} from "./annotator.helpers";
import { AnnotatorProvider } from "./annotator-context";
import AnnotatorContent from "./annotator-content";

export const annotatorVariants = cva("relative", {
  variants: {
    status: {
      free: "cursor-crosshair",
      input: "cursor-crosshair",
      hold: "cursor-crosshair",
    },
    borderWidth: {
      1: "border",
      2: "border-2",
      3: "border-3",
      4: "border-4",
    },
  },
  defaultVariants: {
    status: "free",
    borderWidth: 2,
  },
});

type AnnotatorVariants = VariantProps<typeof annotatorVariants>;

export interface AnnotatorProps
  extends AnnotatorVariants,
    Omit<React.ComponentProps<"div">, "onChange"> {
  url: string;
  inputMethod: "text" | "select" | "none";
  labels?: string | string[];
  onChange: (entries: EntryType[]) => void;
  borderWidth?: 1 | 2 | 3 | 4;
}

export interface AnnotatorRef {
  reset: () => void;
}

function Annotator({
  url,
  borderWidth = ANNOTATOR_CONSTANTS.DEFAULT_BORDER_WIDTH,
  inputMethod,
  labels,
  onChange,
  status: initialStatus,
  className,
  ref,
  ...props
}: AnnotatorProps): JSX.Element {
  return (
    <AnnotatorProvider>
      <AnnotatorContent
        ref={ref}
        url={url}
        borderWidth={borderWidth}
        inputMethod={inputMethod}
        labels={labels}
        onChange={onChange}
        status={initialStatus || "free"}
        className={className}
        {...props}
      />
    </AnnotatorProvider>
  );
}

Annotator.displayName = "Annotator";

export default Annotator;
