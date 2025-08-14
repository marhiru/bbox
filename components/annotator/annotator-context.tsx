import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

export interface Rectangle {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
}

export type SelectionStatus = "started" | "ended";

export interface SelectionData {
  readonly id: string;
  readonly rectangle: Rectangle;
  readonly timestamp: number;
  readonly status: SelectionStatus;
}

export type SelectCallback = (data: SelectionData) => void;
export type SelectEndCallback = (data: SelectionData) => void;

export interface AnnotatorContextType {
  readonly isSelecting: boolean;
  readonly activeSelection: number;
  readonly totalSelections: number;
  readonly selections: readonly SelectionData[];
  readonly setIsSelecting: (selecting: boolean) => void;
  readonly addSelection: (selection: SelectionData) => void;
  readonly updateSelection: (
    id: string,
    updates: Partial<SelectionData>
  ) => void;
  readonly setActiveSelection: (count: number) => void;
  readonly maxSelections?: number;
  readonly canAddSelection: boolean;
}

const AnnotatorContext = createContext<AnnotatorContextType | undefined>(
  undefined
);

export function AnnotatorProvider({
  children,
  maxSelections,
}: {
  children: React.ReactNode;
  maxSelections?: number;
}) {
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [activeSelection, setActiveSelection] = useState<number>(0);
  const [totalSelections, setTotalSelections] = useState<number>(0);
  const [selections, setSelections] = useState<SelectionData[]>([]);

  useEffect(() => {
    localStorage.setItem("annotator-selecting", JSON.stringify(isSelecting));
  }, [isSelecting]);

  useEffect(() => {
    localStorage.setItem(
      "annotator-data",
      JSON.stringify({
        activeSelection,
        totalSelections,
        selections,
      })
    );
  }, [activeSelection, totalSelections, selections]);

  const addSelection = useCallback((selection: SelectionData): void => {
    setSelections((prev) => [...prev, selection]);
    setTotalSelections((prev) => prev + 1);
  }, []);

  const updateSelection = useCallback(
    (id: string, updates: Partial<SelectionData>): void => {
      setSelections((prev) =>
        prev.map((sel) => (sel.id === id ? { ...sel, ...updates } : sel))
      );
    },
    []
  );

  const canAddSelection = useMemo(() => {
    if (maxSelections === undefined) return true;
    return activeSelection < maxSelections;
  }, [totalSelections, maxSelections]);

  const contextValue: AnnotatorContextType = {
    isSelecting,
    activeSelection,
    totalSelections,
    selections,
    setIsSelecting,
    addSelection,
    updateSelection,
    setActiveSelection,
    maxSelections,
    canAddSelection,
  };

  return (
    <AnnotatorContext.Provider value={contextValue}>
      {children}
    </AnnotatorContext.Provider>
  );
}

export function useAnnotator(): AnnotatorContextType {
  const context = useContext(AnnotatorContext);
  if (!context) {
    throw new Error("useAnnotator must be used within AnnotatorProvider");
  }
  return context;
}
