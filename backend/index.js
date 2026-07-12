import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import api from "./src/routes/api.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());

app.use("/", api);

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Personalization Engine Backend" });
});

app.listen(PORT, () => {
  console.log(`Personalization engine backend running on ${PORT}`);
});
