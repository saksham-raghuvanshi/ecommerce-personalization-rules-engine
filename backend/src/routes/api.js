import express from "express";
import { getMockSessions, getMockSessionById } from "../mockData.js";

const router = express.Router();

router.get("/sessions", (req, res) => {
  res.json({ sessions: getMockSessions() });
});

router.get("/sessions/:id", (req, res) => {
  const session = getMockSessionById(req.params.id);
  if (!session) return res.status(404).json({ error: "Session not found" });
  res.json({ session });
});

export default router;
