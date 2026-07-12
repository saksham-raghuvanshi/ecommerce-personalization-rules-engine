import express from "express";
import { getMockSessions, getMockSessionById } from "../mockData.js";
import { classifySession } from "../classifier.js";

const router = express.Router();

router.get("/sessions", (req, res) => {
  res.json({ sessions: getMockSessions() });
});

router.get("/sessions/:id", (req, res) => {
  const session = getMockSessionById(req.params.id);
  if (!session) return res.status(404).json({ error: "Session not found" });
  res.json({ session });
});

router.post("/classify", (req, res) => {
  const { session } = req.body;

  if (!session || !Array.isArray(session.events)) {
    return res.status(400).json({ error: "Session with event required" });
  }

  try {
    const result = classifySession(session);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Classification failed" });
  }
});

export default router;
