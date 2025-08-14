import { JSX, RefObject, useEffect, useMemo, useRef } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useAnnotator, type SelectionData } from "./annotator-context";
import {
  AnnotatorSelectorProps,
  AnnotatorSelectorVariants,
} from "./annotator.types";

export const annotatorSelectorVariants = cva("absolute border-dotted", {
  variants: {
    borderWidth: {
      1: "border",
      2: "border-2",
      3: "border-3",
      4: "border-4",
    },
    variant: {
      default: "border-green-400",
      selected: "border-blue-500",
      error: "border-red-500",
      warning: "border-yellow-500",
    },
  },
  defaultVariants: {
    borderWidth: 2,
    variant: "default",
  },
});

export function AnnotatorSelector({
  rectangle,
  borderWidth = 2,
  variant = "default",
  onSelect,
  onSelectEnd,
  isSelecting = false,
}: AnnotatorSelectorProps & AnnotatorSelectorVariants): JSX.Element {
  const { addSelection, updateSelection, totalSelections, canAddSelection, maxSelections } = useAnnotator();
  const selectTrigger: RefObject<boolean> = useRef(false);
  const selectTriggerEnd: RefObject<boolean> = useRef(false);

  useEffect(() => {
    if (isSelecting && !selectTrigger.current) {
      if (!canAddSelection) return;

      selectTrigger.current = true;
      selectTriggerEnd.current = false;

      const selectionId = `selection-${totalSelections + 1}`;
      const data: SelectionData = {
        id: selectionId,
        rectangle,
        timestamp: Date.now(),
        status: "started",
      };
      addSelection(data);
      onSelect?.(data);
    }
  }, [isSelecting, totalSelections, addSelection, onSelect, rectangle, canAddSelection]);

  useEffect(() => {
    if (!isSelecting && !selectTriggerEnd.current) {
      selectTriggerEnd.current = true;
      selectTrigger.current = false;

      const currentSelection = `selection-${totalSelections}`;
      updateSelection(currentSelection, {
        status: "ended",
        timestamp: Date.now(),
      });

      const data: SelectionData = {
        id: currentSelection,
        rectangle,
        timestamp: Date.now(),
        status: "ended",
      };
      onSelectEnd?.(data);
    }
  }, [isSelecting, totalSelections, updateSelection, onSelectEnd, rectangle]);

  const selectorVariant = useMemo(() => {
    if (maxSelections && !canAddSelection) {
      return "warning";
    }
    return variant;
  }, [variant, maxSelections, canAddSelection]);

  return (
    <div
      className={cn(
        annotatorSelectorVariants({ borderWidth, variant: selectorVariant }),
        "pointer-events-none"
      )}
      style={{
        left: `${rectangle.left - borderWidth}px`,
        top: `${rectangle.top - borderWidth}px`,
        width: `${rectangle.width}px`,
        height: `${rectangle.height}px`,
      }}
    />
  );
}

export default AnnotatorSelector;
