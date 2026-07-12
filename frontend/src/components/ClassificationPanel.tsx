import { useState } from "react";


const STATE_LABELS = {
  browser: "Browser",
  comparer: "Comparer",
  discount_seeker: "Discount Seeker",
  cart_abandoner: "Cart Abandoner",
  loyal_customer: "Loyal Customer",
};

export default function ClassificationPanel({ result, explanation, explainLoading, onRefreshExplanation }) {
      const [showFeatures, setShowFeatures] = useState(false);


if (!result) {
    return <div className="explain-loading">Waiting for events</div>;
  }
  return (
    <div>
      
    </div>
  )
}
