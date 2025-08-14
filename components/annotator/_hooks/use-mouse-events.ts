import { useEffect } from 'react';
import { AnnotatorStatus } from '../annotator.helpers';

interface UseMouseEventsProps {
  status: AnnotatorStatus;
  updateRectangle: (pageX: number, pageY: number) => void;
  onMouseUp: (e: MouseEvent) => void;
}

export function useMouseEvents({ status, updateRectangle, onMouseUp }: UseMouseEventsProps) {
  useEffect(() => {
    const mouseMoveHandler = (e: MouseEvent) => {
      if (status === "hold") {
        updateRectangle(e.pageX, e.pageY);
      }
    };

    const mouseUpHandler = onMouseUp;

    window.addEventListener("mousemove", mouseMoveHandler);
    window.addEventListener("mouseup", mouseUpHandler);
    
    return () => {
      window.removeEventListener("mousemove", mouseMoveHandler);
      window.removeEventListener("mouseup", mouseUpHandler);
    };
  }, [status, updateRectangle, onMouseUp]);
}