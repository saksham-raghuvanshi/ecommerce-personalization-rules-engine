import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import api from "./src/routes/api.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());

app.use("/api", api);

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Personalization Engine Backend" });
});
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRouter from "./src/routes/api.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.get("/", (req, res) => {
  res.json({ status: "ok", service: "personalization-engine-backend" });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(
      `Personalization engine backend running on http://localhost:${PORT}`,
    );
  });
}

export default app;
