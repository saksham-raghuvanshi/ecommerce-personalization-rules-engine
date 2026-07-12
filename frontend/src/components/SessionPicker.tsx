import type { Session } from "../types";

interface SessionPickerProps {
  sessions: Session[];
  activeId: string;
  onSelect: (session: Session) => void;
  onNew: () => void;
}

export default function SessionPicker({ sessions, activeId, onSelect, onNew }: SessionPickerProps) {
  return (
    <div className="session-picker">
    
      {sessions.map((s) => (
        <button
          key={s.sessionId}
          className={`session-chip ${activeId === s.sessionId ? "active" : ""}`}
          onClick={() => onSelect(s)}
        >
          {s.sessionId}
        </button>
      ))}
      <button className="session-chip" onClick={onNew}>
        + blank session
      </button>
    </div>
  );
}