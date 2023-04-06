/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import fs, { promises } from "fs";
import openai from "../../config/open-ai";
const router = express.Router();

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

router.get("/extend", async (req, res) => {
    try {
        // download image locally from url
        const response = await openai.createImageEdit(fs.createReadStream('./modules/image/image_test.png') as any, 'extend this image with content aware fill', fs.createReadStream('./modules/image/image_test.png') as any, 4);

        return res.status(200).json({
            message: "Image extended",
            image: response.data
        });

    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
