/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import fs from "fs";
import openai from "../../config/open-ai";
const router = express.Router();
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

console.log("[INFO] Image AI routes available at /api/image");

router.get("/", async (req, res) => {
  try {
    res.status(200).json({
      message: "You have reached the image AI route",
      routes: {
        "/api/image/extend": "Returns an extended image of the given image",
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/extend", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image provided" });
    }
    const { buffer } = req.file;

    // Cast the buffer to `any` so that we can set the `name` property
    const file: any = buffer;
    // Set a `name` that ends with .png so that the API knows it's a PNG image
    file.name = "image.png";

    // download image locally from url
    const response = await openai.createImageEdit(file, req.body.prompt);

    console.log("[INFO] /image/extend SUCCESS");
    return res.status(200).json({
      message: "Image extended",
      image: response.data,
    });
  } catch (error: any) {
    console.log("[ERROR] /image/extend ERROR", error.message);
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
    res.status(500).json({ message: error.message });
  }
});

export default router;
