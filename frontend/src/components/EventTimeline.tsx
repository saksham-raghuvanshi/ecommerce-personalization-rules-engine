import { useState } from "react";

const EVENT_TYPES = [
  "page_view",
  "product_view",
  "search",
  "filter_applied",
  "add_to_cart",
  "remove_from_cart",
  "coupon_field_view",
  "coupon_apply",
  "checkout_start",
  "purchase",
];


function formatTime(iso) {
  try {
    const d = new Date(iso);
    return d.toISOString().slice(11, 16);
  } catch {
    return "--:--";
  }
}


function eventDetail(e) {
  switch (e.type) {
    case "product_view":
      return `${e.category || "?"} · $${e.price ?? "?"} · ${e.durationSec ?? 0}s`;
    case "add_to_cart":
    case "remove_from_cart":
      return `${e.productId || ""} · $${e.price ?? "?"}`;
    case "search":
      return `"${e.query || ""}"`;
    case "filter_applied":
      return `${e.filterType || ""}: ${e.value || ""}`;
    case "coupon_apply":
      return `${e.code || ""} · ${e.success ? "success" : "failed"}`;
    case "purchase":
      return `${e.orderId || ""} · $${e.amount ?? "?"}`;
    case "page_view":
      return e.page || "";
    default:
      return "";
  }
}



export default function EventTimeline() {

      const [type, setType] = useState("product_view");
  const [category, setCategory] = useState("sneakers");
  return (
    <div>
      
    </div>
  )
}
