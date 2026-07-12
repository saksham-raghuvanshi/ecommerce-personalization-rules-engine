import { useState } from "react";
import type { ClassificationResult, Explanation, ShopperState } from "../types";

const STATE_LABELS: Record<ShopperState, string> = {
  browser: "Browser",
  comparer: "Comparer",
  discount_seeker: "Discount Seeker",
  cart_abandoner: "Cart Abandoner",
  loyal_customer: "Loyal Customer",
};

interface ConfidenceMeterProps {
  confidence: number;
  color: string;
}

function ConfidenceMeter({ confidence, color }: ConfidenceMeterProps) {
  const totalBars = 10;
  const filled = Math.round((confidence / 100) * totalBars);
  return (
    <div className="confidence-meter">
      <div className="confidence-bars">
        {Array.from({ length: totalBars }).map((_, i) => (
          <div
            key={i}
            className={`confidence-bar ${i < filled ? "filled" : ""}`}
            style={{
              height: `${8 + i * 1.3}px`,
              background: i < filled ? color : undefined,
            }}
          />
        ))}
      </div>
      <span className="confidence-value">{confidence}% confidence</span>
    </div>
  );
}

interface ClassificationPanelProps {
  result: ClassificationResult | null;
  explanation: Explanation | null;
  explainLoading: boolean;
  onRefreshExplanation: () => void;
}

export default function ClassificationPanel({
  result,
  explanation,
  explainLoading,
  onRefreshExplanation,
}: ClassificationPanelProps) {
  const [showFeatures, setShowFeatures] = useState(false);

  if (!result) {
    return <div className="explain-loading">Waiting for events</div>;
  }

  const color = `var(--c-${result.state})`;
  const rankedScores = Object.entries(result.scores).sort((a, b) => b[1] - a[1]) as [ShopperState, number][];

  return (
    <div>
      <div className="state-card">
        <div className="state-badge" >
          {STATE_LABELS[result.state] || result.state}
        </div>
        <div className="state-caption">{result.features.sessionId}</div>

        <ConfidenceMeter confidence={result.confidence} color={color} />

        <div className="score-grid">
          {rankedScores.map(([state, score]) => (
            <div className="score-row" key={state}>
              <span>{STATE_LABELS[state]}</span>
              <div className="score-track">
                <div className="score-fill" style={{ width: `${score}%` }} />
              </div>
              <span>{score}</span>
            </div>
          ))}
        </div>

        <div className="section-label">Rule-based evidence</div>
        <ul className="evidence-list">
          {result.evidence.map((e, i) => (
            <li key={i}>{e}</li>
          ))}
        </ul>

        <div className="section-label">Claude explanation &amp; recommended action</div>
        {explainLoading && <div className="explain-loading">Generating</div>}
        {!explainLoading && explanation && (
          <>
            <div className="narrative-box">{explanation.narrative}</div>
            <div className="action-box">
              <div className="action-label">Recommended action</div>
              <div className="action-text">{explanation.recommended_action}</div>
              <div className="action-rationale">{explanation.action_rationale}</div>
            </div>
          </>
        )}
        {!explainLoading && !explanation && (
          <button className="btn-refresh" onClick={onRefreshExplanation}>
            Generate explanation →
          </button>
        )}
        {!explainLoading && explanation && (
          <button className="btn-refresh" onClick={onRefreshExplanation}>
            ↻ Regenerate
          </button>
        )}

        <div className="features-toggle">
          <button className="btn-refresh" onClick={() => setShowFeatures((v) => !v)}>
            {showFeatures ? "Hide" : "Show"} computed features
          </button>
          {showFeatures && <pre className="features-json">{JSON.stringify(result.features, null, 2)}</pre>}
        </div>
      </div>
    </div>
  );
}