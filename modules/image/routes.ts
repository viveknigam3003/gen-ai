/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import openai from "../../config/open-ai";
const router = express.Router();
import {promises} from "fs";

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

router.post("/extend", async (req, res) => {
    try {
        // download image locally from url
        const file = await promises.readFile('image_test.png');


    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
