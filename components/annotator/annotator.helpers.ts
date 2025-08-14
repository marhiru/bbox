export type EntryType = {
  left: number;
  top: number;
  width: number;
  height: number;
  label: string;
};

export type EntryWithMeta = EntryType & {
  id: string;
  showCloseButton: boolean;
};

export type AnnotatorStatus = "free" | "input" | "hold";

export type Pointer = { x: number; y: number } | null;
export type Offset = { x: number; y: number } | null;

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

export const calculateRectangle = (offset: Offset, pointer: Pointer) => {
  if (!offset || !pointer) {
    return { left: 0, top: 0, width: 0, height: 0 };
  }

  const x1 = Math.min(offset.x, pointer.x);
  const x2 = Math.max(offset.x, pointer.x);
  const y1 = Math.min(offset.y, pointer.y);
  const y2 = Math.max(offset.y, pointer.y);

  return {
    left: x1,
    top: y1,
    width: x2 - x1 + 1,
    height: y2 - y1 + 1,
  };
};

export const cropCoordinates = (
  pageX: number,
  pageY: number,
  ref: React.RefObject<HTMLDivElement>,
  imageWidth?: number,
  imageHeight?: number
) => {
  if (!ref.current || !imageWidth || !imageHeight) {
    return { x: 0, y: 0 };
  }

  return {
    x: Math.min(
      Math.max(
        Math.round(pageX - ref.current.offsetLeft),
        0
      ),
      Math.round(imageWidth - 1)
    ),
    y: Math.min(
      Math.max(Math.round(pageY - ref.current.offsetTop), 0),
      Math.round(imageHeight - 1)
    ),
  };
};

export const calculateImageDimensions = (
  imageWidth: number,
  imageHeight: number,
  maxWidth: number
) => {
  if (imageWidth > maxWidth) {
    const multiplier = imageWidth / maxWidth;
    return {
      multiplier,
      displayWidth: maxWidth,
      displayHeight: imageHeight / multiplier,
    };
  } else {
    return {
      multiplier: 1,
      displayWidth: imageWidth,
      displayHeight: imageHeight,
    };
  }
};

export const processEntriesForChange = (
  entries: EntryWithMeta[],
  multiplier: number
): EntryType[] => {
  return entries.map((entry) => ({
    width: Math.round(entry.width * multiplier),
    height: Math.round(entry.height * multiplier),
    top: Math.round(entry.top * multiplier),
    left: Math.round(entry.left * multiplier),
    label: entry.label,
  }));
};

export const createNewEntry = (
  rect: ReturnType<typeof calculateRectangle>,
  label: string
): EntryWithMeta => {
  return {
    ...rect,
    label,
    id: generateId(),
    showCloseButton: false,
  };
};

export const updateEntryHoverState = (
  entries: EntryWithMeta[],
  id: string,
  show: boolean
): EntryWithMeta[] => {
  return entries.map((entry) =>
    entry.id === id ? { ...entry, showCloseButton: show } : entry
  );
};

export const removeEntryById = (
  entries: EntryWithMeta[],
  id: string
): EntryWithMeta[] => {
  return entries.filter((entry) => entry.id !== id);
};

export const validateInitialStatus = (
  status: AnnotatorStatus | null | undefined
): AnnotatorStatus => {
  return status || "free";
};

export const ANNOTATOR_CONSTANTS = {
  DEFAULT_BORDER_WIDTH: 2,
  DEFAULT_STATUS: "free" as const,
  MOUSE_BUTTON_RIGHT: 2,
} as const;