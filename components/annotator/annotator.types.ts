import { VariantProps } from "class-variance-authority";
import { Rectangle, SelectCallback } from "./annotator-context";
import { annotatorSelectorVariants } from "./annotator-selector";

export type AnnotatorSelectorVariants = VariantProps<typeof annotatorSelectorVariants>;

export interface AnnotatorSelectorProps {
  readonly rectangle: Rectangle;
  readonly borderWidth?: 1 | 2 | 3 | 4;
  readonly variant?: "default" | "selected" | "error" | "warning";
  readonly onSelect?: SelectCallback;
  readonly onSelectEnd?: SelectCallback;
  readonly isSelecting?: boolean;
}