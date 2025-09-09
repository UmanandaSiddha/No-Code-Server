import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { fromPrompt, fromDrawing } from "./routes/generate";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));

app.post("/api/generate/from-prompt", fromPrompt);
app.post("/api/generate/from-drawing", fromDrawing);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
