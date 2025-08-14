import { cva } from "class-variance-authority";
import {
  AnnotatorStatus,
  EntryWithMeta,
  ANNOTATOR_CONSTANTS,
} from "./annotator.helpers";
import { useAnnotator } from "./annotator-context";
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
import {
  calculateRectangle,
  cropCoordinates,
  calculateImageDimensions,
  processEntriesForChange,
  createNewEntry,
  updateEntryHoverState,
  removeEntryById,
  validateInitialStatus,
  type EntryType,
  type Pointer,
  type Offset,
} from "./annotator.helpers";

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

const entryVariants = cva(
  "absolute font-mono text-sm text-red-500 border-red-500",
  {
    variants: {
      borderWidth: {
        1: "border",
        2: "border-2",
        3: "border-3",
        4: "border-4",
      },
      showCloseButton: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      borderWidth: 2,
      showCloseButton: false,
    },
  }
);

const closeButtonVariants = cva(
  "absolute -top-2 -right-2 w-4 h-4 p-4 pt-4 overflow-hidden text-white bg-green-800 border-2 border-white rounded-full cursor-pointer select-none text-center",
  {
    variants: {
      borderWidth: {
        1: "border",
        2: "border-2",
        3: "border-3",
        4: "border-4",
      },
    },
    defaultVariants: {
      borderWidth: 2,
    },
  }
);

function AnnotatorContent({
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
  const [pointer, setPointer] = useState<Pointer>(null);
  const [offset, setOffset] = useState<Offset>(null);
  const [entries, setEntries] = useState<EntryWithMeta[]>([]);
  const [multiplier, setMultiplier] = useState(1);
  const [status, setStatus] = useState<AnnotatorStatus>(
    validateInitialStatus(initialStatus)
  );
  const [annotatorStyle, setAnnotatorStyle] = useState<{
    width?: number;
    height?: number;
  }>({});
  const [imageFrameStyle, setImageFrameStyle] = useState<{
    width?: number;
    height?: number;
    backgroundImageSrc?: string;
  }>({});

  // Separate DOM ref from custom ref
  const annotatorRef = useRef<HTMLDivElement>(null);
  const labelInputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);

  const { setActiveSelection } = useAnnotator();

  // Move all handlers from Annotator
  const handleEntriesChange = useCallback(
    (newEntries: EntryWithMeta[]) => {
      const processedEntries = processEntriesForChange(newEntries, multiplier);
      onChange(processedEntries);
    },
    [multiplier, onChange]
  );

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
      const newEntry = createNewEntry(rect, label);
      const newEntries = [...entries, newEntry];
      setEntries(newEntries);
      handleEntriesChange(newEntries);
      setStatus("free");
      setPointer(null);
      setOffset(null);
    },
    [offset, pointer, entries, handleEntriesChange]
  );

  const mouseDownHandler = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
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
    [status, crop]
  );

  const removeEntry = useCallback(
    (id: string) => {
      const newEntries = removeEntryById(entries, id);
      setEntries(newEntries);
      handleEntriesChange(newEntries);
    },
    [entries, handleEntriesChange]
  );

  const updateEntryHover = useCallback((id: string, show: boolean) => {
    setEntries((prev) => updateEntryHoverState(prev, id, show));
  }, []);

  // Use useImperativeHandle for custom ref methods
  useImperativeHandle(
    ref as React.Ref<AnnotatorRef>,
    () => ({
      reset: () => {
        setEntries([]);
        handleEntriesChange([]);
      },
    }),
    [handleEntriesChange]
  );

  useEffect(() => {
    setActiveSelection(entries.length);
  }, [entries.length, setActiveSelection]);

  useEffect(() => {
    const getMaxWidth = () => {
      const containerWidth = annotatorRef.current?.offsetWidth;
      const result =
        containerWidth && containerWidth > 200 ? containerWidth : 800;
      return result;
    };

    const loadImage = () => {
      const maxWidth = getMaxWidth();
      const imageElement = new Image();

      imageElement.src = url;

      imageElement.onload = function () {
        const {
          multiplier: newMultiplier,
          displayWidth,
          displayHeight,
        } = calculateImageDimensions(
          imageElement.width,
          imageElement.height,
          maxWidth
        );

        setMultiplier(newMultiplier);
        setAnnotatorStyle({
          width: displayWidth,
          height: displayHeight,
        });
        setImageFrameStyle({
          backgroundImageSrc: imageElement.src,
          width: displayWidth,
          height: displayHeight,
        });
      };

      imageElement.onerror = function () {
        throw new Error(`Invalid image URL: ${url}`);
      };
    };

    loadImage();

    const resizeObserver = new ResizeObserver(() => {
      loadImage();
    });

    if (annotatorRef.current) {
      resizeObserver.observe(annotatorRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [url]);

  useEffect(() => {
    const mouseMoveHandler = (e: MouseEvent) => {
      if (status === "hold") {
        updateRectangle(e.pageX, e.pageY);
      }
    };

    window.addEventListener("mousemove", mouseMoveHandler);
    return () => window.removeEventListener("mousemove", mouseMoveHandler);
  }, [status, updateRectangle]);

  useEffect(() => {
    const mouseUpHandler = (e: MouseEvent) => {
      if (status === "hold") {
        updateRectangle(e.pageX, e.pageY);
        setStatus("input");
        labelInputRef.current?.focus();
      }
    };

    window.addEventListener("mouseup", mouseUpHandler);
    return () => window.removeEventListener("mouseup", mouseUpHandler);
  }, [status, updateRectangle]);

  // Calculate rect
  const rect = useMemo(() => {
    return calculateRectangle(offset, pointer);
  }, [offset, pointer]);

  return (
    <div
      className={cn(
        annotatorVariants({
          status,
          borderWidth,
        }),
        "relative flex items-center justify-center"
      )}
      style={{
        width: `${annotatorStyle?.width || 800}px`,
        height: `${annotatorStyle?.height || 600}px`,
      }}
      ref={annotatorRef} // This is the DOM ref
      onMouseDown={mouseDownHandler}
      {...props}
    >
      <div
        className={cn(imageFrameVariants({ status }), "w-full h-full")}
        style={{
          width: `${imageFrameStyle?.width}px`,
          height: `${imageFrameStyle?.height}px`,
          backgroundImage: `url(${imageFrameStyle?.backgroundImageSrc})`,
        }}
      >
        {(status === "hold" || status === "input") && (
          <AnnotatorSelector
            rectangle={rect}
            isSelecting={status === "hold"}
            onSelect={(data) => {
              console.log("Seleção iniciada:", data.id, data);
            }}
            onSelectEnd={(data) => {
              console.log("Seleção finalizada:", data.id, data);
            }}
          />
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

        {entries.map((entry) => (
          <div
            key={entry.id}
            className={cn(
              entryVariants({
                borderWidth,
                showCloseButton: entry.showCloseButton,
              })
            )}
            style={{
              top: `${entry.top - borderWidth}px`,
              left: `${entry.left - borderWidth}px`,
              width: `${entry.width}px`,
              height: `${entry.height}px`,
            }}
            onMouseOver={() => updateEntryHover(entry.id, true)}
            onMouseLeave={() => updateEntryHover(entry.id, false)}
          >
            {entry.showCloseButton && (
              <div
                className={cn(
                  closeButtonVariants({ borderWidth }),
                  "flex items-center justify-center -top-4 -right-4"
                )}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => removeEntry(entry.id)}
              >
                <span className="text-xs font-bold leading-none">×</span>
              </div>
            )}

            <div className="absolute text-primary -top-8 whitespace-nowrap">
              {entry.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

AnnotatorContent.displayName = "AnnotatorContent";

export default AnnotatorContent;
