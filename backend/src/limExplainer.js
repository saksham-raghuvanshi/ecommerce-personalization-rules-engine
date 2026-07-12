import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

const STATE_ACTION_HINTS = {
  loyal_customer:
    "loyalty perks, early access, referral prompts, subscribe & save",
  cart_abandoner:
    "exit-intent reminder, cart recovery email/SMS, urgency (stock/price), free-shipping nudge",
  discount_seeker:
    "time-boxed discount, bundle offer, loyalty-points-as-discount, first-order coupon",
  comparer:
    "comparison table, reviews/ratings, spec highlights, live chat / buying guide",
  browser:
    "editorial content, trending/bestseller carousel, low-friction newsletter signup",
};

const FALLBACK_ACTIONS = {
  loyal_customer: {
    action:
      "Show a loyalty-points banner and an early-access badge on the next product they view.",
    rationale:
      "Repeat, returning buyers respond well to being recognised rather than discounted.",
  },
  cart_abandoner: {
    action:
      "Trigger a cart-recovery email/SMS within 1 hour, highlighting the exact items left in cart.",
    rationale:
      "The cart was started but checkout was never completed — a timely nudge recovers most of these.",
  },
  discount_seeker: {
    action:
      "Surface a time-boxed 10% coupon directly on the cart page before they leave.",
    rationale:
      "Repeated coupon attempts signal price is the last blocker to purchase.",
  },
  comparer: {
    action:
      "Show a side-by-side comparison table or reviews widget for the products they've been viewing.",
    rationale:
      "Multiple views within one category signal active evaluation, not lack of interest.",
  },
  browser: {
    action:
      "Show a low-friction newsletter signup or a trending-products carousel — no hard sell yet.",
    rationale:
      "Engagement is still too low for a discount or urgency-based nudge to be worth showing.",
  },
};

function hasValidApiKey() {
  const key = process.env.ANTHROPIC_API_KEY;
  return !!key && key.startsWith("sk-ant-");
}

/** Built locally, no API call — used when no real Anthropic key is configured */
function buildFallbackExplanation({ state, evidence }) {
  const fallback = FALLBACK_ACTIONS[state] || FALLBACK_ACTIONS.browser;
  return {
    narrative: `${evidence.join(". ")}. Based on this evidence, the rules engine classified this session as "${state}".`,
    recommended_action: fallback.action,
    action_rationale: fallback.rationale,
    _fallback: true, // lets the frontend show a small "no API key" badge if you want
  };
}

let client = null;
if (hasValidApiKey()) {
  client = new Anthropic();
}

export async function explainClassification({
  state,
  confidence,
  features,
  evidence,
}) {
  if (!client) {
    // No real key configured — skip the API call entirely instead of failing.
    return buildFallbackExplanation({ state, evidence });
  }

  const actionHints = STATE_ACTION_HINTS[state] || "general engagement nudge";

  const prompt = `You are a personalization strategist for an e-commerce site.

A rules engine has already classified a shopper session. Do NOT change or second-guess the classification — only explain it and recommend an action.

Classification: ${state}
Confidence: ${confidence}%

Computed features (ground truth, do not invent anything beyond this):
${JSON.stringify(features, null, 2)}

Rule-based evidence bullets already generated:
${evidence.map((e) => `- ${e}`).join("\n")}

Typical nudge categories for this state: ${actionHints}

Respond ONLY with a JSON object, no markdown fences, no preamble, in this exact shape:
{
  "narrative": "2-3 sentence plain-English explanation of why this shopper fits this state, grounded only in the features given",
  "recommended_action": "one specific, concrete site action or nudge to show this shopper right now",
  "action_rationale": "one sentence on why this specific action fits this shopper"
}`;

  const response = await client.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 500,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("")
    .trim();

  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/```$/, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    // graceful fallback if the model returns non-JSON for any reason
    return {
      narrative: evidence.join(". ") + ".",
      recommended_action:
        "Review session manually — narrative generation failed.",
      action_rationale: "Fallback: could not parse model output.",
      _raw: text,
    };
  }
}
