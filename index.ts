import { config } from "dotenv";
import cors from "cors";
import express from "express";
import TextRouter from "./modules/text/routes";
import ImageRouter from "./modules/image/routes";

config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/text', TextRouter);
app.use('/api/image', ImageRouter);

app.listen(port, () => {
  console.info(`[INFO] Server Started on PORT: ${port}`);
})