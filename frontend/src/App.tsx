import { useEffect, useState } from "react";
import ClassificationPanel from "./components/ClassificationPanel";
import EventTimeline from "./components/EventTimeline";
import SessionPicker from "./components/SessionPicker";
import { fetchSessions } from "./api";



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
  const [sessions, setSessions] = useState([]);


  useEffect(()=>{
    
        const res = fetchSessions()


        res.then((s)=>{
          setSessions(s);
        }).catch(error => {
          console.error("Failed to fetch sessions:", error);
        });
      

  },[])

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
          <SessionPicker sessions={sessions}/>
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
