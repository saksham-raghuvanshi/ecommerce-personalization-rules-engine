import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Personalization Engine Backedn" });
});

app.listen(PORT, () => {
  console.log(`Personalization engine backend running on ${PORT}`);
});
