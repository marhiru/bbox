import React, {
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
  forwardRef,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import AnnotatorSelector from "./annotator-selector";
import {
  generateId,
  calculateRectangle,
  cropCoordinates,
  calculateImageDimensions,
  processEntriesForChange,
  createNewEntry,
  updateEntryHoverState,
  removeEntryById,
  validateInitialStatus,
  ANNOTATOR_CONSTANTS,
  type EntryType,
  type EntryWithMeta,
  type AnnotatorStatus,
  type Pointer,
  type Offset,
} from "./annotator.helpers";

const annotatorVariants = cva(
  "relative",
  {
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
  }
);

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

type AnnotatorVariants = VariantProps<typeof annotatorVariants>;

interface AnnotatorProps extends AnnotatorVariants, Omit<React.ComponentProps<"div">, 'onChange'> {
  url: string;
  inputMethod: "text" | "select";
  labels?: string | string[];
  onChange: (entries: EntryType[]) => void;
  borderWidth?: 1 | 2 | 3 | 4;
}

interface AnnotatorRef {
  reset: () => void;
}

function Annotator(
  {
    url,
    borderWidth = ANNOTATOR_CONSTANTS.DEFAULT_BORDER_WIDTH,
    inputMethod,
    labels,
    onChange,
    status: initialStatus,
    className,
    ...props
  }: AnnotatorProps,
  ref: React.ForwardedRef<AnnotatorRef>
) {
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

  const annotatorRef = useRef<HTMLDivElement>(null);
  const labelInputRef = useRef<HTMLDivElement>(null);

  const handleEntriesChange = useCallback(
    (newEntries: EntryWithMeta[]) => {
      const processedEntries = processEntriesForChange(newEntries, multiplier);
      onChange(processedEntries);
    },
    [multiplier, onChange]
  );

  useEffect(() => {
    handleEntriesChange(entries);
  }, [entries, handleEntriesChange]);

  useEffect(() => {
    const maxWidth = annotatorRef.current?.offsetWidth || 1;
    const imageElement = new Image();

    imageElement.src = url;

    imageElement.onload = function () {
      const { multiplier: newMultiplier, displayWidth, displayHeight } = 
        calculateImageDimensions(imageElement.width, imageElement.height, maxWidth);

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
  }, [url]);

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

  const rect = React.useMemo(() => {
    return calculateRectangle(offset, pointer);
  }, [offset, pointer]);

  const addEntry = useCallback(
    (label: string) => {
      const newEntry = createNewEntry(rect, label);
      setEntries((prev) => [...prev, newEntry]);
      setStatus("free");
      setPointer(null);
      setOffset(null);
    },
    [rect]
  );

  const mouseDownHandler = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if ((status === "free" || status === "input") && e.button !== ANNOTATOR_CONSTANTS.MOUSE_BUTTON_RIGHT) {
        const croppedCoords = crop(e.pageX, e.pageY);
        setOffset(croppedCoords);
        setPointer(croppedCoords);
        setStatus("hold");
      }
    },
    [status, crop]
  );

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => removeEntryById(prev, id));
  }, []);

  const updateEntryHover = useCallback((id: string, show: boolean) => {
    setEntries((prev) => updateEntryHoverState(prev, id, show));
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      reset: () => setEntries([]),
    }),
    []
  );

  return (
    <div
      className={cn(
        annotatorVariants({ status, borderWidth }),
        "w-full h-full",
        className
      )}
      style={{
        width: `${annotatorStyle.width}px`,
        height: `${annotatorStyle.height}px`,
      }}
      ref={annotatorRef}
      onMouseDown={mouseDownHandler}
      {...props}
    >
      <div
        className={cn(imageFrameVariants({ status }), "w-full h-full")}
        style={{
          width: `${imageFrameStyle.width}px`,
          height: `${imageFrameStyle.height}px`,
          backgroundImage: `url(${imageFrameStyle.backgroundImageSrc})`,
        }}
      >
        {(status === "hold" || status === "input") && (
          <AnnotatorSelector rectangle={rect} borderWidth={borderWidth} />
        )}

        {entries.map((entry) => (
          <div
            key={entry.id}
            className={cn(
              entryVariants({
                borderWidth,
                showCloseButton: entry.showCloseButton,
              }),
              "overflow-hidden"
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
                  "flex items-center justify-center"
                )}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => removeEntry(entry.id)}
              >
                <span className="text-xs font-bold leading-none">×</span>
              </div>
            )}

            <div className="overflow-hidden">{entry.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const AnnotatorWithRef = forwardRef<AnnotatorRef, AnnotatorProps>(Annotator);

AnnotatorWithRef.displayName = "Annotator";

export default AnnotatorWithRef;
