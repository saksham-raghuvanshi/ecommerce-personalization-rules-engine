const STATES = {
  LOYAL_CUSTOMER: "loyal_customer",
  CART_ABANDONER: "cart_abandoner",
  DISCOUNT_SEEKER: "discount_seeker",
  COMPARER: "comparer",
  BROWSER: "browser",
};

export function extractFeatures(session) {
  const events = session.events || [];

  const productViews = events.filter((e) => e.type === "product_view");
  const cartAdds = events.filter((e) => e.type === "add_to_cart");
  const cartRemoves = events.filter((e) => e.type === "remove_from_cart");
  const couponEvents = events.filter(
    (e) => e.type === "coupon_field_view" || e.type === "coupon_apply",
  );
  const failedCouponAttempts = events.filter(
    (e) => e.type === "coupon_apply" && e.success === false,
  );

  const searches = events.filter((e) => e.type === "search");
  const checkoutStarted = events.some((e) => e.type === "checkout_start");
  const purchased = events.some((e) => e.type === "purchase");

  // category count
  const categoryCounts = {};
  for (const pv of productViews) {
    categoryCounts[pv.category] = (categoryCounts[pv.category] || 0) + 1;
  }

  const maxCategoryRepeat = Math.max(0, ...Object.values(categoryCounts));

  const totalDwellSec = productViews.reduce(
    (sum, e) => sum + (e.durationSec || 0),
    0,
  );
  const avgDwellSec = productViews.length
    ? totalDwellSec / productViews.length
    : 0;

  let sessionDurationMin = 0;

  if (events.length >= 2) {
    const t0 = new Date(events[0].timestamp).getTime();
    const t1 = new Date(events[events.length - 1].timestamp).getTime();
    sessionDurationMin = Math.max(0, (t1 - t0) / 60000);
  }

  return {
    sessionId: session.sessionId,
    userId: session.userId,
    productViewCount: productViews.length,
    uniqueCategoriesViewed: Object.keys(categoryCounts).length,
    maxCategoryRepeat,
    avgDwellSec: Number(avgDwellSec.toFixed(1)),
    cartAddCount: cartAdds.length,
    cartRemoveCount: cartRemoves.length,
    couponInteractionCount: couponEvents.length,
    failedCouponAttempts: failedCouponAttempts.length,
    searchCount: searches.length,
    checkoutStarted,
    purchased,
    sessionDurationMin: Number(sessionDurationMin.toFixed(1)),
    pastPurchaseCount: session.pastPurchaseCount || 0,
    isReturning: !!session.isReturning,
    daysSinceLastVisit: session.daysSinceLastVisit ?? null,
  };
}

function scoreStates(f) {
  const scores = {};

  // Loyal customer: history of purchases + returning + converts efficiently
  scores[STATES.LOYAL_CUSTOMER] =
    (f.pastPurchaseCount >= 3 ? 45 : f.pastPurchaseCount * 12) +
    (f.isReturning ? 20 : 0) +
    (f.purchased ? 25 : 0) +
    (f.cartAddCount > 0 && f.checkoutStarted ? 10 : 0);

  // Cart abandoner: added to cart / started checkout but did NOT purchase
  scores[STATES.CART_ABANDONER] = !f.purchased
    ? (f.cartAddCount > 0 ? 35 : 0) +
      (f.checkoutStarted ? 40 : 0) +
      (f.cartAddCount > 0 &&
      f.searchCount === 0 &&
      f.couponInteractionCount === 0
        ? 10
        : 0)
    : 0;

  // Discount seeker: actively hunting for a coupon/promo, esp. failed attempts
  scores[STATES.DISCOUNT_SEEKER] =
    (f.couponInteractionCount > 0 ? 35 : 0) +
    f.failedCouponAttempts * 20 +
    (f.searchCount > 0 && f.couponInteractionCount > 0 ? 15 : 0) +
    (f.cartAddCount > 0 && f.couponInteractionCount > 0 && !f.purchased
      ? 15
      : 0);

  // Comparer: repeated views within one category, decent dwell time, no cart yet
  scores[STATES.COMPARER] =
    (f.maxCategoryRepeat >= 3 ? 40 : f.maxCategoryRepeat >= 2 ? 20 : 0) +
    (f.avgDwellSec >= 25 ? 20 : f.avgDwellSec >= 10 ? 10 : 0) +
    (f.productViewCount >= 3 ? 15 : 0) +
    (f.cartAddCount === 0 ? 15 : -10) +
    (f.searchCount > 0 ? 10 : 0);

  // Browser: low engagement across the board (baseline / fallback)
  scores[STATES.BROWSER] =
    f.productViewCount <= 2 &&
    f.cartAddCount === 0 &&
    f.couponInteractionCount === 0 &&
    f.searchCount === 0
      ? 40
      : 10;

  for (const k of Object.keys(scores)) {
    scores[k] = Math.max(0, Math.min(100, scores[k]));
  }

  return scores;
}
