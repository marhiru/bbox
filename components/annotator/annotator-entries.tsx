import { cn } from "@/lib/utils";
import { EntryWithMeta } from "./annotator.helpers";
import { cva } from "class-variance-authority";

interface AnnotatorEntriesProps {
  entries: EntryWithMeta[];
  borderWidth:  1 | 2 | 3 | 4;
  onRemove: (id: string) => void;
  onHover: (id: string, show: boolean) => void;
}

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

export function AnnotatorEntries({
  entries,
  borderWidth,
  onRemove,
  onHover,
}: AnnotatorEntriesProps) {
  return (
    <>
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
          onMouseOver={() => onHover(entry.id, true)}
          onMouseLeave={() => onHover(entry.id, false)}
        >
          {entry.showCloseButton && (
            <div
              className={cn(
                closeButtonVariants({ borderWidth }),
                "flex items-center justify-center -top-4 -right-4"
              )}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => onRemove(entry.id)}
            >
              <span className="text-xs font-bold leading-none">×</span>
            </div>
          )}

          <div className="absolute z-50 text-primary -top-8 whitespace-nowrap">
            {entry.label}
          </div>
        </div>
      ))}
    </>
  );
}
