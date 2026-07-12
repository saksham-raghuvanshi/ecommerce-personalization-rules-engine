



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
    <>
    <div className="main-page">
      <header className="header">
       <div className="brand">
        <span className="brand-mark">Personalized <span>.</span></span>
        <span className="brand-sub">Console </span>
       </div>
       <span className="live-dot">Live Classification</span>
      </header>
    </div>
      
    </>
  )
}

export default App
