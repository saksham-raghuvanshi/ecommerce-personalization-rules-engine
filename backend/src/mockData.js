/**
 * 
 * 
 *  Field Supported 
 * SessionId
 * userId:
 * pastPurchaseCount:
 * isReturning:
 * daysSinceLastVisit:
 * events:[
 * 
 * ]
 * 
 * 
 * Event types supported:
 *  - page_view          { page, timestamp }
 *  - product_view       { productId, category, price, durationSec, timestamp }
 *  - search             { query, timestamp }
 *  - filter_applied     { filterType, value, timestamp }
 *  - add_to_cart        { productId, price, timestamp }
 *  - remove_from_cart   { productId, timestamp }
 *  - coupon_field_view  { timestamp }
 *  - coupon_apply       { code, success, timestamp }
 *  - checkout_start     { timestamp }
 *  - purchase           { orderId, amount, timestamp }
 *
 * 
 * 

 */

const CATEGORIES = [
  "sneakers",
  "backpacks",
  "watches",
  "headphones",
  "jackets",
];

function genBrowserSession() {
  return {
    sessionId: "sess_browser_01",
    userId: "user_101",
    pastPurchaseCount: 0,
    isReturning: false,
    daysSinceLastVisit: null,
  };
}

function genComparerSession() {
  return {
    sessionId: "sess_comparer_01",
    userId: "user_102",
    pastPurchaseCount: 0,
    isReturning: true,
    daysSinceLastVisit: 2,
  };
}

function genDiscountSeekerSession() {
  return {
    sessionId: "sess_discount_01",
    userId: "user_103",
    pastPurchaseCount: 1,
    isReturning: true,
    daysSinceLastVisit: 14,
  };
}

function genCartAbandonerSession() {
  return {
    sessionId: "sess_abandoner_01",
    userId: "user_104",
    pastPurchaseCount: 0,
    isReturning: false,
    daysSinceLastVisit: null,
  };
}

function genLoyalCustomerSession() {
  return {
    sessionId: "sess_loyal_01",
    userId: "user_105",
    pastPurchaseCount: 5,
    isReturning: true,
    daysSinceLastVisit: 20,
  };
}

export function getMockSession() {
  return [
    genBrowserSession(),
    genComparerSession(),
    genBrowserSession(),
    genCartAbandonerSession(),
    genDiscountSeekerSession(),
    genLoyalCustomerSession(),
  ];
}

export function getMockSessionById() {}
