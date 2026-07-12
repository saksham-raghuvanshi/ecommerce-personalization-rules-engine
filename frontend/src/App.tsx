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
  const [sessions, setSessions] = useState<any[]>([]);
  const [activeSession, setActiveSession] = useState<any>(blankSession());


  useEffect(()=>{
    
        const res = fetchSessions()


        res.then((s)=>{
          setSessions(s);
        }).catch(error => {
          console.error("Failed to fetch sessions:", error);
        });
      

  },[])


  function selectSession(a){
    setActiveSession(JSON.parse(JSON.stringify(s)))
  }


  function handleNewBlank(){
    setActiveSession(blankSession())
  }


  function handleAddEvent(event: any) {
    setActiveSession((prev) => ({ ...prev, events: [...prev.events, event] }));
  }



  function handleRemoveEvent(index) {
    setActiveSession((prev) => ({
      ...prev,
      events: prev.events.filter((_, i) => i !== index),
    }));
  }

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
          <SessionPicker sessions={sessions} activeId={activeSession.sessionId} onselect={selectSession} onNew={handleNewBlank} />
          <EventTimeline events={activeSession.events} onAdd={handleAddEvent} onRemove={handleRemoveEvent} />
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
