import { JSX, useEffect, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  useAnnotator,
  type Rectangle,
  type SelectionData,
  type SelectCallback
} from './annotator-context';

const annotatorSelectorVariants = cva(
  'absolute border-dotted',
  {
    variants: {
      borderWidth: {
        1: 'border',
        2: 'border-2',
        3: 'border-3',
        4: 'border-4',
      },
      variant: {
        default: 'border-green-400',
        selected: 'border-blue-500',
        error: 'border-red-500',
        warning: 'border-yellow-500',
      },
    },
    defaultVariants: {
      borderWidth: 2,
      variant: 'default',
    },
  }
);

type AnnotatorSelectorVariants = VariantProps<typeof annotatorSelectorVariants>;

export interface AnnotatorSelectorProps extends AnnotatorSelectorVariants {
  readonly rectangle: Rectangle;
  readonly borderWidth?: 1 | 2 | 3 | 4;
  readonly variant?: 'default' | 'selected' | 'error' | 'warning';
  readonly onSelect?: SelectCallback;
  readonly onSelectEnd?: SelectCallback;
  readonly isSelecting?: boolean;
}

export function AnnotatorSelector({ 
  rectangle, 
  borderWidth = 2, 
  variant = 'default',
  onSelect,
  onSelectEnd,
  isSelecting = false
}: AnnotatorSelectorProps): JSX.Element {
  const { addSelection, updateSelection, totalSelections } = useAnnotator();
  const hasTriggeredSelect = useRef(false);
  const hasTriggeredSelectEnd = useRef(false);
  
  useEffect(() => {
    if (isSelecting && !hasTriggeredSelect.current) {
      hasTriggeredSelect.current = true;
      hasTriggeredSelectEnd.current = false;
      
      const selectionId = `selection-${totalSelections + 1}`;
      const data: SelectionData = { 
        id: selectionId,
        rectangle, 
        timestamp: Date.now(), 
        status: 'started'
      };
      addSelection(data);
      onSelect?.(data);
    }
  }, [isSelecting, totalSelections, addSelection, onSelect, rectangle]);

  useEffect(() => {
    if (!isSelecting && !hasTriggeredSelectEnd.current) {
      hasTriggeredSelectEnd.current = true;
      hasTriggeredSelect.current = false;
      
      const currentSelection = `selection-${totalSelections}`;
      updateSelection(currentSelection, { 
        status: 'ended',
        timestamp: Date.now()
      });
      
      const data: SelectionData = { 
        id: currentSelection,
        rectangle, 
        timestamp: Date.now(), 
        status: 'ended'
      };
      onSelectEnd?.(data);
    }
  }, [isSelecting, totalSelections, updateSelection, onSelectEnd, rectangle]);

  return (
    <div
      className={cn(
        annotatorSelectorVariants({ borderWidth, variant }),
        'pointer-events-none'
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