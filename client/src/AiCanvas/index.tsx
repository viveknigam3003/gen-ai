import { Box, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import React, { useState } from "react";
import ImageCropper, { CROPPER_HEIGHT, CROPPER_WIDTH } from "./ImageCropper";

enum UIState {
  IDLE = "idle",
  LOADING = "loading",
  ERROR = "error",
  SUCCESS = "success",
}

const AiCanvas = () => {
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [extendedImageUrl, setExtendedImageUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<UIState>(UIState.IDLE);

  /**
   * Handles the upload to the API and returns the extended image
   * @param dataUrl The cropped image dataUrl
   */
  const handleCroppedImage = async (dataUrl: string) => {
    setCroppedImageUrl(dataUrl);
    setExtendedImageUrl(null);
    setStatus(UIState.LOADING);
    notifications.show({
      id: "load-data",
      loading: true,
      title: "Extending your image",
      message: "Hang tight, this may take a few seconds",
      autoClose: false,
      withCloseButton: false,
    });
    try {
      const extendedImage = await getExtendedBackground(dataUrl);
      setStatus(UIState.SUCCESS);
      setExtendedImageUrl(extendedImage);
      notifications.update({
        id: "load-data",
        color: "teal",
        title: "Image extended successfully",
        message: "It might take a few seconds to load",
        autoClose: 5000,
      });
    } catch (e) {
      console.log(e);
      setStatus(UIState.ERROR);
      notifications.update({
        id: "load-data",
        color: "teal",
        title: "Image extension failed",
        message: "Please check your internet connection and try again",
        autoClose: 2000,
      });
    } finally {
      setStatus(UIState.IDLE);
    }
  };

  /**
   * Calls the API to extend the background
   * @param dataUrl The cropped image dataUrl
   * @returns Extended image dataUrl
   */
  const getExtendedBackground = async (dataUrl: string) => {
    // Convert dataUrl to a Blob or File object
    const response = await fetch(dataUrl);
    const imageBlob = await response.blob();

    // Prepare the FormData to send to the API
    const formData = new FormData();
    formData.append("image", imageBlob);

    formData.append(
      "prompt",
      "Extend the background seamlessly into the transparent area"
    );
    const res = await axios.post(
      "http://localhost:8080/api/image/extend",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const extendedImage = res.data.image.data[0].url;
    return extendedImage;
  };

  return (
    <Box>
      <Box>
        <ImageCropper
          onCrop={handleCroppedImage}
          extendedImageUrl={extendedImageUrl}
          isFetchingImage={status === UIState.LOADING}
        />
      </Box>
      <Group spacing={"xl"}>
        {croppedImageUrl && (
          <div>
            <h3>Cropped Image:</h3>
            <img
              src={croppedImageUrl}
              style={{ border: "2px solid #000" }}
              alt="Cropped"
            />
          </div>
        )}
        {extendedImageUrl && (
          <div>
            <h3>Extended Image:</h3>
            <img
              src={extendedImageUrl}
              width={CROPPER_WIDTH}
              height={CROPPER_HEIGHT}
              style={{ border: "2px solid #000" }}
              alt="Extended"
            />
          </div>
        )}
      </Group>
    </Box>
  );
};

export default AiCanvas;
