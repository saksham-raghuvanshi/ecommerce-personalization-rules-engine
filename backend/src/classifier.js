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
}
