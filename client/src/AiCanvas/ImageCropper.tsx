import React, { useEffect, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Rect } from "react-konva";
import Konva from "konva";
import { Box, Button, createStyles, FileInput } from "@mantine/core";
import { Circle } from "react-konva";

const createDottedPattern = (spacing: number) => {
  const dots = [];

  for (let y = 0; y < window.innerHeight; y += spacing) {
    for (let x = 0; x < window.innerWidth; x += spacing) {
      dots.push(
        <Circle
          key={`${x}-${y}`}
          x={x}
          y={y}
          radius={1}
          fill="rgba(0, 0, 0, 0.2)"
        />
      );
    }
  }

  return dots;
};

interface ImageCropperProps {
  onCrop: (dataUrl: string) => void;
  extendedImageUrl?: string | null;
  isFetchingImage?: boolean;
}

const CANVAS_WIDTH = window.innerWidth;
const CANVAS_HEIGHT = window.innerHeight;

export const CROPPER_WIDTH = 256;
export const CROPPER_HEIGHT = 256;

const ImageCropper: React.FC<ImageCropperProps> = ({
  onCrop,
  extendedImageUrl,
  isFetchingImage,
}) => {
  const { classes } = useStyles();
  const [image, setUploadedImage] = useState(new window.Image());
  const [cropperPosition, setCropperPosition] = useState({ x: 0, y: 0 });
  const layerRef = React.useRef<null | Konva.Layer>(null);
  const cropperRef = React.useRef<Konva.Rect>(null);

  const layer = layerRef.current;

  /**
   * Prepares the canvas stage
   * @param stage Canvas stage
   */
  const handleStageReady = (stage: Konva.Stage) => {
    const layer = new Konva.Layer();
    stage.add(layer);
    if (layerRef && layerRef.current) {
      layerRef.current = layer;
    }
  };

  /**
   * Handles the image crop which is under the cropper
   */
  const cropImage = () => {
    const stage = new Konva.Stage({
      container: "temp-container",
      width: CROPPER_WIDTH,
      height: CROPPER_HEIGHT,
    });

    const layer = new Konva.Layer();
    stage.add(layer);

    const croppedImage = new Konva.Image({
      x: -cropperPosition.x,
      y: -cropperPosition.y,
      image: image,
    });

    layer.add(croppedImage);
    layer.draw();

    const dataUrl = stage.toDataURL();
    onCrop(dataUrl);

    stage.destroy();
  };

  /**
   * Prevents cropper from being dragged outside the canvas
   * @param e Konva event object
   */
  const handleCropperDrag = (e: Konva.KonvaEventObject<DragEvent>) => {
    const newX = Math.max(
      Math.min(e.target.x(), CANVAS_WIDTH - CROPPER_WIDTH),
      0
    );
    const newY = Math.max(
      Math.min(e.target.y(), CANVAS_HEIGHT - CROPPER_HEIGHT),
      0
    );

    e.target.x(newX);
    e.target.y(newY);
  };

  /**
   * Draws the extended image on the canvas, under the cropper
   * @returns void
   */
  const drawImage = () => {
    const newImage = new window.Image();
    if (!extendedImageUrl) return;

    newImage.src = extendedImageUrl;

    newImage.onload = () => {
      const layer = layerRef?.current;
      if (!layer) return;

      const cropper = cropperRef.current;
      if (!cropper) return;

      const { x, y, width, height } = cropperRef.current.getClientRect();
      const extendedImage = new Konva.Image({
        x: x,
        y: y,
        width: width,
        height: height,
        image: newImage,
      });

      layer.add(extendedImage);

      layer.draw();
    };
  };

  /**
   * Handles the image upload from system
   * @param file File object
   */
  const handleImageUpload = (file: File) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageObject = new Image();
        imageObject.src = e.target?.result as string;
        imageObject.onload = () => {
          setUploadedImage(imageObject);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    // Whenever the extended image url changes, draw the image on the canvas
    drawImage();
  }, [extendedImageUrl]);

  // Whenever the original image changes, draw the image on the canvas
  useEffect(() => {
    if (image) {
      if (!layer) return;
      // Remove the existing image from the canvas (if any)
      const existingImageNode = layer.findOne(".originalImage");
      if (existingImageNode) {
        existingImageNode.remove();
      }

      // Create and add the new image to the canvas
      const newImage = new Konva.Image({
        x: 0,
        y: 0,
        image,
        name: "originalImage",
      });

      layer.add(newImage);
      layer.draw();
    }
  }, [image, layer]);

  return (
    <>
      <FileInput
        placeholder="Pick a png image file"
        accept="image/png"
        classNames={{ input: classes.fileInput }}
        onChange={handleImageUpload}
      />
      <Stage
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onReady={handleStageReady}
      >
        <Layer>{createDottedPattern(20)}</Layer>
        <Layer ref={layerRef}>
          <KonvaImage image={image} name={"originalImage"} />
        </Layer>
        <Layer>
          <Rect
            ref={cropperRef}
            x={cropperPosition.x}
            y={cropperPosition.y}
            width={CROPPER_WIDTH}
            height={CROPPER_HEIGHT}
            fill="rgba(0, 0, 0, 0.1)"
            stroke="white"
            strokeWidth={2}
            draggable={!isFetchingImage}
            onDragMove={handleCropperDrag}
            onDragEnd={(e) => {
              setCropperPosition({ x: e.target.x(), y: e.target.y() });
            }}
            onDblClick={cropImage}
          />
        </Layer>
      </Stage>
      <Button onClick={cropImage}>Crop</Button>
      <Box id="temp-container" style={{ display: "none" }}></Box>
    </>
  );
};

export default ImageCropper;

const useStyles = createStyles(() => ({
  fileInput: {
    margin: "2rem auto",
    // Add a fixed with, soft and deep shadow and remove border
    boxShadow: "0 0 0 1px #eaeaea, 0 4px 11px rgba(0, 0, 0, 0.1)",
    border: "none",
    width: 650,
  },
}));
