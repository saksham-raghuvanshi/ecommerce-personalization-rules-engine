export interface SessionEvent {
  type: string;
  timestamp: string;
  category?: string;
  price?: number;
  durationSec?: number;
  productId?: string;
  query?: string;
  filterType?: string;
  value?: string;
  code?: string;
  success?: boolean;
  orderId?: string;
  amount?: number;
  page?: string;
}

export interface Session {
  sessionId: string;
  userId: string;
  pastPurchaseCount: number;
  isReturning: boolean;
  daysSinceLastVisit: number | null;
  events: SessionEvent[];
}

export type ShopperState =
  | "browser"
  | "comparer"
  | "discount_seeker"
  | "cart_abandoner"
  | "loyal_customer";

// The numeric/behavioural features computed by the backend's rules engine
export interface SessionFeatures {
  sessionId: string;
  userId: string;
  productViewCount: number;
  uniqueCategoriesViewed: number;
  maxCategoryRepeat: number;
  avgDwellSec: number;
  cartAddCount: number;
  cartRemoveCount: number;
  couponInteractionCount: number;
  failedCouponAttempts: number;
  searchCount: number;
  checkoutStarted: boolean;
  purchased: boolean;
  sessionDurationMin: number;
  pastPurchaseCount: number;
  isReturning: boolean;
  daysSinceLastVisit: number | null;
}

// What POST /api/classify returns — the rules engine's output
export interface ClassificationResult {
  state: ShopperState;
  confidence: number;
  scores: Record<ShopperState, number>;
  features: SessionFeatures;
  evidence: string[];
}

// What POST /api/explain returns — Claude's narrative + recommended action
export interface Explanation {
  narrative: string;
  recommended_action: string;
  action_rationale: string;
}