const CATEGORIES = [
  "sneakers",
  "backpacks",
  "watches",
  "headphones",
  "jackets",
];

function genBrowserSession() {}

function genComparerSession() {}

function genDiscountSeekerSession() {}

function genCartAbandonerSession() {}

function genLoyalCustomerSession() {}

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
