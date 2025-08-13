import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

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
    // Variants padrão
    defaultVariants: {
      borderWidth: 2,
      variant: 'default',
    },
  }
);

// Extrair tipos dos variants
type annotatorSelectorVariants = VariantProps<typeof annotatorSelectorVariants>;

interface IAnnotatorSelectorProps extends annotatorSelectorVariants {
  rectangle: { left: number; top: number; width: number; height: number };
  borderWidth?: 1 | 2 | 3 | 4;
  variant?: 'default' | 'selected' | 'error' | 'warning';
}

function AnnotatorSelector ({ 
  rectangle, 
  borderWidth = 2, 
  variant = 'default' 
}: IAnnotatorSelectorProps)  {
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
};

export default AnnotatorSelector;