import { cva } from "class-variance-authority";
import {
  AnnotatorStatus,
  ANNOTATOR_CONSTANTS,
  cropCoordinates,
  calculateRectangle,
  validateInitialStatus,
  type Pointer,
  type Offset,
} from "./annotator.helpers";
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useImperativeHandle,
  JSX,
  useMemo,
} from "react";
import { cn } from "@/lib/utils";
import { AnnotatorProps, AnnotatorRef, annotatorVariants } from "./annotator";
import AnnotatorSelector from "./annotator-selector";
import AnnotatorLabel from "./annotator-label";
import { useImageLoader } from "./_hooks/use-image-loader";
import { useMouseEvents } from "./_hooks/use-mouse-events";
import { useEntriesManager } from "./_hooks/use-entries-manager";
import { AnnotatorEntries } from "./annotator-entries";
import { useAnnotator } from "./annotator-context";
import { useMaskGenerator } from "./_hooks/use-mask-generator";

const imageFrameVariants = cva("relative bg-cover bg-center bg-no-repeat", {
  variants: {
    status: {
      free: "",
      input: "",
      hold: "",
    },
  },
  defaultVariants: {
    status: "free",
  },
});

function AnnotatorContent({
  url,
  borderWidth = ANNOTATOR_CONSTANTS.DEFAULT_BORDER_WIDTH,
  inputMethod,
  labels,
  onChange,
  status: initialStatus,
  maxSelections,
  className,
  ref,
  ...props
}: AnnotatorProps): JSX.Element {
  const [pointer, setPointer] = useState<Pointer>(null);
  const [offset, setOffset] = useState<Offset>(null);
  const [status, setStatus] = useState<AnnotatorStatus>(
    validateInitialStatus(initialStatus)
  );

  const labelInputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);

  const { multiplier, annotatorStyle, imageFrameStyle, annotatorRef } =
    useImageLoader(url);

  const {
    entries,
    totalSelections,
    canAddSelection,
    createAndAddEntry,
    removeEntry,
    resetEntries,
    updateEntryHover,
    setEntries,
  } = useEntriesManager(multiplier, onChange);
  const { setActiveSelection } = useAnnotator();

  const crop = useCallback(
    (pageX: number, pageY: number) => {
      return cropCoordinates(
        pageX,
        pageY,
        annotatorRef as React.RefObject<HTMLDivElement>,
        imageFrameStyle.width,
        imageFrameStyle.height
      );
    },
    [imageFrameStyle.width, imageFrameStyle.height]
  );

  const updateRectangle = useCallback(
    (pageX: number, pageY: number) => {
      setPointer(crop(pageX, pageY));
    },
    [crop]
  );
  const addEntry = useCallback(
    (label: string) => {
      const rect = calculateRectangle(offset, pointer);
      createAndAddEntry(rect, label || "none");
      setStatus("free");
      setPointer(null);
      setOffset(null);
    },
    [offset, pointer, createAndAddEntry]
  );

  const mouseDownHandler = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!canAddSelection) return;

      if (
        (status === "free" || status === "input") &&
        e.button !== ANNOTATOR_CONSTANTS.MOUSE_BUTTON_RIGHT
      ) {
        const croppedCoords = crop(e.pageX, e.pageY);
        setOffset(croppedCoords);
        setPointer(croppedCoords);
        setStatus("hold");
      }
    },
    [status, crop, canAddSelection]
  );

  const onMouseUp = useCallback(
    (e: MouseEvent) => {
      if (status === "hold") {
        updateRectangle(e.pageX, e.pageY);

        if (inputMethod === "none") {
          const rect = calculateRectangle(offset, pointer);
          createAndAddEntry(rect, "none");
          setStatus("free");
          setPointer(null);
          setOffset(null);
        } else {
          setStatus("input");
          labelInputRef.current?.focus();
        }
      }
    },
    [status, updateRectangle, inputMethod, offset, pointer, createAndAddEntry]
  );

  useMouseEvents({ status, updateRectangle, onMouseUp });

  useImperativeHandle(
    ref as React.Ref<AnnotatorRef>,
    () => ({
      reset: () => {
        setEntries([]);
        resetEntries();
      },
    }),
    [setEntries, resetEntries]
  );

  useEffect(() => {
    setActiveSelection(entries.length);
  }, [entries.length, setActiveSelection]);

  const rect = useMemo(
    () => calculateRectangle(offset, pointer),
    [offset, pointer]
  );

  // Gerar máscara SVG usando as dimensões da imagem e as entradas existentes
  const maskImage = useMaskGenerator(entries, imageFrameStyle?.width, imageFrameStyle?.height);

  return (
    <div
      className={cn(
        annotatorVariants({
          status,
          borderWidth,
        }),
        "flex items-center justify-center"
      )}
      style={{
        width: `${annotatorStyle?.width || 800}px`,
        height: `${annotatorStyle?.height || 600}px`,
      }}
      ref={annotatorRef}
      onMouseDown={mouseDownHandler}
      {...props}
    >
      <div
        className={cn(imageFrameVariants({ status }), "w-full h-full")}
        style={{
          width: `${imageFrameStyle?.width}px`,
          height: `${imageFrameStyle?.height}px`,
          backgroundImage: `url(${imageFrameStyle?.backgroundImageSrc})`,
          // Aplicar máscara apenas quando há entradas
          ...(maskImage && {
            maskImage: maskImage,
            WebkitMaskImage: maskImage,
            filter: "brightness(0.3)",
          }),
        }}
      >
        {(status === "hold" || status === "input") && (
          <AnnotatorSelector rectangle={rect} isSelecting={status === "hold"} />
        )}

        {status === "input" && rect && (
          <AnnotatorLabel
            left={rect.left + rect.width / 2}
            top={rect.top + rect.height}
            inputMethod={inputMethod}
            labels={labels}
            onSubmit={addEntry}
            ref={labelInputRef}
          />
        )}

        <AnnotatorEntries
          entries={entries}
          borderWidth={borderWidth}
          onRemove={removeEntry}
          onHover={updateEntryHover}
        />
      </div>

      {maxSelections && !canAddSelection && (
        <div className="absolute -top-12 left-0 bg-input/80 cursor-auto select-none border text-foreground px-2 py-1 rounded text-sm">
          Limite de seleções atingido ({totalSelections}/{maxSelections})
        </div>
      )}
    </div>
  );
}

AnnotatorContent.displayName = "AnnotatorContent";

export default AnnotatorContent;
