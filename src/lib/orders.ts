// ─────────────────────────────────────────────────────────────────
// src/lib/orders.ts
// Order storage, tracking status computation & cancellation logic
// ─────────────────────────────────────────────────────────────────

export interface OrderItem {
  productId?: string;
  productName: string;
  category?: string;
  quantity: number;
  price: number;
}

export interface KesharOrder {
  id: string;                     // Unique order ID (e.g. KJ-20260916-XXXX)
  razorpayOrderId?: string;       // Razorpay order_id
  razorpayPaymentId?: string;     // Razorpay payment_id
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress: string;
  notes?: string;
  items: OrderItem[];
  totalAmount: number;
  orderedAt: string;              // ISO timestamp when order was placed
  isCancelled: boolean;
  cancelledAt?: string;
}

export type TrackingStatus =
  | "confirmed"
  | "processing"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export interface TrackingStep {
  key: TrackingStatus;
  label: string;
  description: string;
  icon: string;
  estimatedTime: string;         // e.g. "Within 2 hours"
}

export const TRACKING_STEPS: TrackingStep[] = [
  {
    key: "confirmed",
    label: "Order Confirmed",
    description: "Your order has been successfully placed and payment verified.",
    icon: "🎯",
    estimatedTime: "Immediately after payment",
  },
  {
    key: "processing",
    label: "Processing & Quality Check",
    description: "Our expert artisans are carefully verifying your jewellery for quality and hallmark standards.",
    icon: "🔍",
    estimatedTime: "Within 2–6 hours",
  },
  {
    key: "packed",
    label: "Securely Packed",
    description: "Your jewellery has been beautifully gift-wrapped and sealed for safe transit.",
    icon: "🎁",
    estimatedTime: "Within 6–24 hours",
  },
  {
    key: "shipped",
    label: "Shipped & In Transit",
    description: "Your order is on its way! Handed over to our trusted courier partner.",
    icon: "🚚",
    estimatedTime: "1–3 business days",
  },
  {
    key: "out_for_delivery",
    label: "Out for Delivery",
    description: "Your jewellery is with the delivery executive and will reach you today.",
    icon: "🛵",
    estimatedTime: "Same day",
  },
  {
    key: "delivered",
    label: "Delivered",
    description: "Your order has been delivered. Thank you for shopping with Keshar Jewellers!",
    icon: "✅",
    estimatedTime: "Completed",
  },
];

/** Compute current tracking status based on hours elapsed since order */
export function getTrackingStatus(order: KesharOrder): TrackingStatus {
  if (order.isCancelled) return "cancelled";

  const orderedAt = new Date(order.orderedAt).getTime();
  const now = Date.now();
  const hoursElapsed = (now - orderedAt) / (1000 * 60 * 60);

  if (hoursElapsed < 2) return "confirmed";
  if (hoursElapsed < 6) return "processing";
  if (hoursElapsed < 24) return "packed";
  if (hoursElapsed < 72) return "shipped";        // 1–3 days
  if (hoursElapsed < 120) return "out_for_delivery"; // 3–5 days
  return "delivered";
}

/** Returns the step index (0-based) of the current status in TRACKING_STEPS */
export function getStatusIndex(status: TrackingStatus): number {
  if (status === "cancelled") return -1;
  return TRACKING_STEPS.findIndex((s) => s.key === status);
}

/** Returns true if order can still be cancelled (within 3 hours) */
export function canCancelOrder(order: KesharOrder): boolean {
  if (order.isCancelled) return false;
  const orderedAt = new Date(order.orderedAt).getTime();
  const hoursElapsed = (now() - orderedAt) / (1000 * 60 * 60);
  return hoursElapsed <= 3;
}

/** Returns minutes remaining in cancellation window (0 if expired) */
export function minutesLeftToCancel(order: KesharOrder): number {
  if (order.isCancelled) return 0;
  const orderedAt = new Date(order.orderedAt).getTime();
  const windowEnd = orderedAt + 3 * 60 * 60 * 1000; // +3 hours
  const msLeft = windowEnd - now();
  return Math.max(0, Math.floor(msLeft / 60000));
}

function now() {
  return Date.now();
}

// ─── localStorage helpers ──────────────────────────────────────

const STORAGE_KEY = "keshar_orders";

export function getAllOrders(): KesharOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as KesharOrder[];
  } catch {
    return [];
  }
}

export function getOrderById(id: string): KesharOrder | null {
  return getAllOrders().find((o) => o.id === id) ?? null;
}

export function saveOrder(order: KesharOrder): void {
  if (typeof window === "undefined") return;
  const orders = getAllOrders();
  const existingIdx = orders.findIndex((o) => o.id === order.id);
  if (existingIdx >= 0) {
    orders[existingIdx] = order;
  } else {
    orders.unshift(order); // Newest first
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export function cancelOrder(id: string): boolean {
  const orders = getAllOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx < 0) return false;
  const order = orders[idx];
  if (!canCancelOrder(order)) return false;
  orders[idx] = { ...order, isCancelled: true, cancelledAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  return true;
}

/** Generate a human-friendly order ID */
export function generateOrderId(): string {
  const now = new Date();
  const dateStr =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `KJ-${dateStr}-${random}`;
}

/** Format ISO timestamp to readable string */
export function formatOrderDate(isoString: string): string {
  return new Date(isoString).toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
