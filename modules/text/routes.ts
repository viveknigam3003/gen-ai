/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import openai, { MODELS } from "../../config/open-ai";
const router = express.Router();

console.log("[INFO] Text AI routes available at /api/text");

router.get("/", async (req, res) => {
  try {
    res.status(200).json({
      message: "You have reached the text AI route",
      routes: {
        "/api/text/chat": "Returns a chat response from the OpenAI API",
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/chat", async (req, res) => {
  try {
    const completion = await openai.createChatCompletion({
      model: MODELS.CHAT,
      messages: [{ role: "user", content: req.body.message }],
    });

    const bestResponse = completion.data.choices[0].message?.content;

    res.status(200).json(bestResponse);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
