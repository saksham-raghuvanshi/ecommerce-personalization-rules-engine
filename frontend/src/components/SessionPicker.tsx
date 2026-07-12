
interface SessionPickerProps {
  sessions: Array<{ sessionId: string }>;
}

export default function SessionPicker({sessions}: SessionPickerProps) {
  return (
    <div className="session-picker">
    {sessions.map((s)=>(
        <button key={s.sessionId} className="session-chip">
            {s.sessionId}
        </button>
    ))}

    <button className="session-chip">
        + blank session
    </button>
    </div>
  )
}
