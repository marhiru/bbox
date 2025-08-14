import { useState, useEffect, useRef } from 'react';
import { calculateImageDimensions } from '../annotator.helpers';

export function useImageLoader(url: string) {
  const [multiplier, setMultiplier] = useState(1);
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

  useEffect(() => {
    const getMaxWidth = () => {
      const containerWidth = annotatorRef.current?.offsetWidth;
      return containerWidth && containerWidth > 200 ? containerWidth : 800;
    };

    const loadImage = () => {
      const maxWidth = getMaxWidth();
      const imageElement = new Image();
      imageElement.src = url;

      imageElement.onload = function () {
        const { multiplier: newMultiplier, displayWidth, displayHeight } =
          calculateImageDimensions(imageElement.width, imageElement.height, maxWidth);

        setMultiplier(newMultiplier);
        setAnnotatorStyle({ width: displayWidth, height: displayHeight });
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

    const resizeObserver = new ResizeObserver(loadImage);
    if (annotatorRef.current) {
      resizeObserver.observe(annotatorRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [url]);

  return {
    multiplier,
    annotatorStyle,
    imageFrameStyle,
    annotatorRef,
  };
}