import ClassificationPanel from "./components/ClassificationPanel";
import EventTimeline from "./components/EventTimeline";
import SessionPicker from "./components/SessionPicker";




function blankSession() {
  return {
    sessionId: "sess_custom",
    userId: "user_custom",
    pastPurchaseCount: 0,
    isReturning: false,
    daysSinceLastVisit: null,
    events: [],
  };
}

function App() {

  return (
  
    <div className="main-page">
      <header className="header">
       <div className="brand">
        <span className="brand-mark">Personalized <span>.</span></span>
        <span className="brand-sub">Console </span>
       </div>
       <span className="live-dot">Live Classification</span>
      </header>

      <div className="main-grid">
        <div className="pane">
          <div className="pane-title">Session Simulator</div>
          <SessionPicker/>
          <EventTimeline/>
        </div>

        <div className="pane">
          <div className="pane-title">Classification</div>
          <ClassificationPanel/>

        </div>

      </div>
    </div>

  )
}

export default App
