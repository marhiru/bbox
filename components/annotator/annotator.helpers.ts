// Tipos principais
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

// Função para gerar IDs únicos (sem dependência externa)
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

// Função para calcular retângulo baseado em offset e pointer
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

// Função para crop das coordenadas
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

// Função para calcular dimensões da imagem
export const calculateImageDimensions = (
  imageWidth: number,
  imageHeight: number,
  maxWidth: number
) => {
  const multiplier = imageWidth / maxWidth;
  
  return {
    multiplier,
    displayWidth: imageWidth / multiplier,
    displayHeight: imageHeight / multiplier,
  };
};

// Função para processar entradas para onChange
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

// Função para criar nova entrada
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

// Função para atualizar showCloseButton de uma entrada
export const updateEntryHoverState = (
  entries: EntryWithMeta[],
  id: string,
  show: boolean
): EntryWithMeta[] => {
  return entries.map((entry) =>
    entry.id === id ? { ...entry, showCloseButton: show } : entry
  );
};

// Função para remover entrada por ID
export const removeEntryById = (
  entries: EntryWithMeta[],
  id: string
): EntryWithMeta[] => {
  return entries.filter((entry) => entry.id !== id);
};

// Função para validar status inicial
export const validateInitialStatus = (
  status: AnnotatorStatus | null | undefined
): AnnotatorStatus => {
  return status || "free";
};

// Constantes
export const ANNOTATOR_CONSTANTS = {
  DEFAULT_BORDER_WIDTH: 2,
  DEFAULT_STATUS: "free" as const,
  MOUSE_BUTTON_RIGHT: 2,
} as const;
  