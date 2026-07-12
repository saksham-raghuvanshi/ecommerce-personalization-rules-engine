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

function ts(minutesFromStart) {
  const base = new Date("2026-07-10T10:00:00Z").getTime();
  return new Date(base + minutesFromStart * 60000).toISOString();
}

function genBrowserSession() {
  return {
    sessionId: "sess_browser_01",
    userId: "user_101",
    pastPurchaseCount: 0,
    isReturning: false,
    daysSinceLastVisit: null,
    events: [
      { type: "page_view", page: "/home", timestamp: ts(0) },
      {
        type: "product_view",
        productId: "P12",
        category: "sneakers",
        price: 79,
        durationSec: 8,
        timestamp: ts(1),
      },
      {
        type: "page_view",
        page: "/collections/new-arrivals",
        timestamp: ts(2),
      },
      {
        type: "product_view",
        productId: "P45",
        category: "watches",
        price: 129,
        durationSec: 5,
        timestamp: ts(3),
      },
    ],
  };
}

function genComparerSession() {
  return {
    sessionId: "sess_comparer_01",
    userId: "user_102",
    pastPurchaseCount: 0,
    isReturning: true,
    daysSinceLastVisit: 2,
    events: [
      { type: "page_view", page: "/collections/headphones", timestamp: ts(0) },
      {
        type: "product_view",
        productId: "H01",
        category: "headphones",
        price: 199,
        durationSec: 45,
        timestamp: ts(1),
      },
      {
        type: "product_view",
        productId: "H02",
        category: "headphones",
        price: 179,
        durationSec: 60,
        timestamp: ts(3),
      },
      {
        type: "filter_applied",
        filterType: "price",
        value: "150-200",
        timestamp: ts(4),
      },
      {
        type: "product_view",
        productId: "H03",
        category: "headphones",
        price: 189,
        durationSec: 55,
        timestamp: ts(6),
      },
      {
        type: "product_view",
        productId: "H01",
        category: "headphones",
        price: 199,
        durationSec: 30,
        timestamp: ts(9),
      },
      {
        type: "search",
        query: "best noise cancelling headphones",
        timestamp: ts(10),
      },
    ],
  };
}

function genDiscountSeekerSession() {
  return {
    sessionId: "sess_discount_01",
    userId: "user_103",
    pastPurchaseCount: 1,
    isReturning: true,
    daysSinceLastVisit: 14,
    events: [
      {
        type: "product_view",
        productId: "J01",
        category: "jackets",
        price: 149,
        durationSec: 20,
        timestamp: ts(0),
      },
      { type: "add_to_cart", productId: "J01", price: 149, timestamp: ts(2) },
      { type: "coupon_field_view", timestamp: ts(3) },
      {
        type: "coupon_apply",
        code: "SAVE10",
        success: false,
        timestamp: ts(3.5),
      },
      { type: "search", query: "jacket discount code", timestamp: ts(4) },
      {
        type: "coupon_apply",
        code: "WELCOME15",
        success: false,
        timestamp: ts(5),
      },
      { type: "page_view", page: "/pages/offers", timestamp: ts(6) },
    ],
  };
}

function genCartAbandonerSession() {
  return {
    sessionId: "sess_abandoner_01",
    userId: "user_104",
    pastPurchaseCount: 0,
    isReturning: false,
    daysSinceLastVisit: null,
    events: [
      {
        type: "product_view",
        productId: "B02",
        category: "backpacks",
        price: 89,
        durationSec: 25,
        timestamp: ts(0),
      },
      { type: "add_to_cart", productId: "B02", price: 89, timestamp: ts(1) },
      {
        type: "product_view",
        productId: "B05",
        category: "backpacks",
        price: 99,
        durationSec: 15,
        timestamp: ts(2),
      },
      { type: "add_to_cart", productId: "B05", price: 99, timestamp: ts(3) },
      { type: "checkout_start", timestamp: ts(4) },
    ],
  };
}

function genLoyalCustomerSession() {
  return {
    sessionId: "sess_loyal_01",
    userId: "user_105",
    pastPurchaseCount: 5,
    isReturning: true,
    daysSinceLastVisit: 20,
    events: [
      { type: "page_view", page: "/account/orders", timestamp: ts(0) },
      {
        type: "product_view",
        productId: "S09",
        category: "sneakers",
        price: 119,
        durationSec: 12,
        timestamp: ts(1),
      },
      { type: "add_to_cart", productId: "S09", price: 119, timestamp: ts(2) },
      { type: "checkout_start", timestamp: ts(3) },
      { type: "purchase", orderId: "ORD-9981", amount: 119, timestamp: ts(4) },
    ],
  };
}

export function getMockSessions() {
  return [
    genBrowserSession(),
    genComparerSession(),
    genBrowserSession(),
    genCartAbandonerSession(),
    genDiscountSeekerSession(),
    genLoyalCustomerSession(),
  ];
}

export function getMockSessionById(sessionId) {
  return getMockSessions().find((s) => s.sessionId === sessionId) || null;
}
