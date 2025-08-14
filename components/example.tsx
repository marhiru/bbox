"use client";
import {
  ImageCrop,
  ImageCropApply,
  ImageCropContent,
  ImageCropReset,
} from "@/components/test";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { XIcon } from "lucide-react";
import Image from "next/image";
import { type ChangeEvent, useState } from "react";
import { type PixelCrop, type PercentCrop } from "react-image-crop";

const Example = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  // Add state for crop values
  const [cropValues, setCropValues] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setCroppedImage(null);
    }
  };
  const handleReset = () => {
    setSelectedFile(null);
    setCroppedImage(null);
  };
  if (!selectedFile) {
    return (
      <Input
        accept="image/*"
        className="w-fit max-w-full"
        onChange={handleFileChange}
        type="file"
      />
    );
  }
  if (croppedImage) {
    return (
      <div className="space-y-4">
        <Image
          alt="Cropped"
          height={100}
          src={croppedImage}
          unoptimized
          width={100}
        />
        <Button onClick={handleReset} size="icon" type="button" variant="ghost">
          <XIcon className="size-4" />
        </Button>
      </div>
    );
  }

  const handleCropComplete = (pixelCrop: PixelCrop, percentCrop: PercentCrop) => {
    console.log('Pixel crop:', pixelCrop);
    console.log('Percent crop:', percentCrop);
    
    setCropValues({
      top: pixelCrop.y,
      left: pixelCrop.x,
      width: pixelCrop.width,
      height: pixelCrop.height
    });
  };

  return (
    <div className="space-y-4">
      <ImageCrop
        aspect={1}
        file={selectedFile}
        maxImageSize={1024 * 1024} // 1MB
        onChange={console.log}
        onComplete={handleCropComplete} // Use the new handler
        onCrop={setCroppedImage}
      >
        <ImageCropContent className="max-w-md" />
        
        {/* Display crop values */}
        {cropValues && (
          <div className="text-sm text-muted-foreground space-y-1">
            <div>Top: {cropValues.top}px</div>
            <div>Left: {cropValues.left}px</div>
            <div>Width: {cropValues.width}px</div>
            <div>Height: {cropValues.height}px</div>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <ImageCropApply />
          <ImageCropReset />
          <Button
            onClick={handleReset}
            size="icon"
            type="button"
            variant="ghost"
          >
            <XIcon className="size-4" />
          </Button>
        </div>
      </ImageCrop>
    </div>
  );
};
export default Example;
