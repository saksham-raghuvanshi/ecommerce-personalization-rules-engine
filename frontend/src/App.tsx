import { useEffect, useState } from "react";
import SessionPicker from "./components/SessionPicker.jsx";
import EventTimeline from "./components/EventTimeline.jsx";
import ClassificationPanel from "./components/ClassificationPanel.jsx";
import { fetchSessions } from "./api.js";
import type { Session, SessionEvent } from "./types";

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

  function selectSession(s: Session) {
    // 🔍 DEBUG — check what's inside the session that was clicked.
    console.log("[selectSession] switching to:", s.sessionId, "events:", s.events);

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
          <ClassificationPanel />
        </div>
      </div>
    </div>
  );
}