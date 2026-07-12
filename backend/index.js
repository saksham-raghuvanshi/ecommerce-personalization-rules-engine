import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors);
app.use(express.json());

app.listen(4000, () => {
  console.log(`Personalization engine backend running on ${PORT}`);
});
