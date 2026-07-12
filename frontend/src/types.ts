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