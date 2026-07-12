import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env

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

export async function explainClassification({
  state,
  confidence,
  features,
  evidence,
}) {
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
    model: "claude-sonnet-4-6",
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
