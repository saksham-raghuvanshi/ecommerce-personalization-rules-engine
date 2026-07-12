import express from "express";
import rateLimit from "express-rate-limit";

import { getMockSessions, getMockSessionById } from "../mockData.js";
import { classifySession } from "../classifier.js";
import { explainClassification } from "../limExplainer.js";

const router = express.Router();

const explainLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error:
      "Too many explanation requests — please wait a bit before trying again.",
    detail: "Rate limit: 10 Claude calls per minute per IP.",
  },
});
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

router.post("/explain", explainLimiter, async (req, res) => {
  const { state, confidence, features, evidence } = req.body;
  if (!state || !features) {
    return res.status(400).json({ error: "state and features are required" });
  }
  try {
    const explanation = await explainClassification({
      state,
      confidence,
      features,
      evidence: evidence || [],
    });
    res.json(explanation);
  } catch (err) {
    console.error("LLM explain error:", err.message);
    res
      .status(500)
      .json({ error: "Explanation generation failed", detail: err.message });
  }
});
export default router;
