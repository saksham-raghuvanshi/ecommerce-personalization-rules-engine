import { useEffect, useRef, useState } from "react";
import SessionPicker from "./components/SessionPicker.jsx";
import EventTimeline from "./components/EventTimeline.jsx";
import ClassificationPanel from "./components/ClassificationPanel.jsx";
import { fetchSessions, classify, explain } from "./api";
import type { Session, SessionEvent, ClassificationResult, Explanation } from "./types";

function blankSession(): Session {
  return {
    sessionId: "sess_custom",
    userId: "user_custom",
    pastPurchaseCount: 0,
    isReturning: false,
    daysSinceLastVisit: null,
    events: [],
  };
}

export default function App() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<Session>(() => blankSession());
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [explanation, setExplanation] = useState<Explanation | null>(null);
  const [explainLoading, setExplainLoading] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchSessions()
      .then((s: Session[]) => {
        const data = Array.isArray(s) ? s : [];

        console.log("[fetchSessions] raw response:", data);

        setSessions(data);

        if (data.length) {
          selectSession(data[0]);
        }
      })
      .catch(console.error);
  }, []);

  // Live, deterministic classification — runs instantly on every event change
  useEffect(() => {
    let cancelled = false;
    classify(activeSession)
      .then((r) => {
        if (!cancelled) setResult(r);
      })
      .catch(() => {});
    setExplanation(null);
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSession]);

  // Debounced LLM explanation — avoids firing on every keystroke/click
  useEffect(() => {
    if (!result) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      runExplain();
    }, 700);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  function runExplain() {
    if (!result) return;
    setExplainLoading(true);
    explain(result)
      .then((exp) => setExplanation(exp))
      .catch(() => setExplanation(null))
      .finally(() => setExplainLoading(false));
  }

  function selectSession(s: Session) {
    if (!s.events) {
      console.warn(
        `[selectSession] "${s.sessionId}" has no events array — the list endpoint likely isn't sending full session data.`
      );
    }

    setActiveSession(JSON.parse(JSON.stringify(s)));
  }

  function handleNewBlank() {
    setActiveSession(blankSession());
  }

  function handleAddEvent(event: SessionEvent) {
    setActiveSession((prev) => ({
      ...prev,
      events: [...(prev.events || []), event],
    }));
  }

  function handleRemoveEvent(index: number) {
    setActiveSession((prev) => ({
      ...prev,
      events: (prev.events || []).filter((_, i) => i !== index),
    }));
  }

  return (
    <div className="app-shell">
      <header className="header">
        <div className="brand">
          <span className="brand-mark">
            Personlized<span>.</span>
          </span>
          <span className="brand-sub">console</span>
        </div>
        <span className="live-dot">live classification</span>
      </header>

      <div className="main-grid">
        <div className="pane">
          <div className="pane-title">Session simulator</div>
          <SessionPicker
            sessions={sessions}
            activeId={activeSession.sessionId}
            onSelect={selectSession}
            onNew={handleNewBlank}
          />
          {/* key forces a clean remount when the session changes —
              guarantees no leftover internal state from the previous session */}
          <EventTimeline
            key={activeSession.sessionId}
            events={activeSession.events || []}
            onAdd={handleAddEvent}
            onRemove={handleRemoveEvent}
          />
        </div>

        <div className="pane">
          <div className="pane-title">Classification</div>
          <ClassificationPanel
            result={result}
            explanation={explanation}
            explainLoading={explainLoading}
            onRefreshExplanation={runExplain}
          />
        </div>
      </div>
    </div>
  );
}