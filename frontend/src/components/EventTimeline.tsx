import { useState } from "react";
import type { SessionEvent } from "../types";

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

interface EventTimelineProps {
  events: SessionEvent[];
  onAdd: (event: SessionEvent) => void;
  onRemove: (index: number) => void;
}

function formatTime(iso: string) {
  try {
    const d = new Date(iso);
    return d.toISOString().slice(11, 16);
  } catch {
    return "--:--";
  }
}

function eventDetail(e: SessionEvent) {
  switch (e.type) {
    case "product_view":
      return `${e.category || "?"} · ₹${e.price ?? "?"} · ${e.durationSec ?? 0}s`;
    case "add_to_cart":
    case "remove_from_cart":
      return `${e.productId || ""} · ₹${e.price ?? "?"}`;
    case "search":
      return `"${e.query || ""}"`;
    case "filter_applied":
      return `${e.filterType || ""}: ${e.value || ""}`;
    case "coupon_apply":
      return `${e.code || ""} · ${e.success ? "success" : "failed"}`;
    case "purchase":
      return `${e.orderId || ""} · ₹${e.amount ?? "?"}`;
    case "page_view":
      return e.page || "";
    default:
      return "";
  }
}

export default function EventTimeline({ events, onAdd, onRemove }: EventTimelineProps) {
  const [type, setType] = useState("product_view");
  const [category, setCategory] = useState("sneakers");
  const [price, setPrice] = useState(99);
  const [duration, setDuration] = useState(20);
  const [query, setQuery] = useState("discount code");
  const [couponSuccess, setCouponSuccess] = useState(false);

  function handleAdd() {
    const timestamp = new Date().toISOString();
    let event: SessionEvent = { type, timestamp };

    if (type === "product_view") {
      event = {
        ...event,
        productId: `P${Math.floor(Math.random() * 90 + 10)}`,
        category,
        price: Number(price),
        durationSec: Number(duration),
      };
    } else if (type === "add_to_cart" || type === "remove_from_cart") {
      event = { ...event, productId: `P${Math.floor(Math.random() * 90 + 10)}`, price: Number(price) };
    } else if (type === "search") {
      event = { ...event, query };
    } else if (type === "filter_applied") {
      event = { ...event, filterType: "price", value: `0-${price}` };
    } else if (type === "coupon_apply") {
      event = { ...event, code: "TRYME10", success: couponSuccess };
    } else if (type === "purchase") {
      event = { ...event, orderId: `ORD-${Math.floor(Math.random() * 9000 + 1000)}`, amount: Number(price) };
    } else if (type === "page_view") {
      event = { ...event, page: "/collections/all" };
    }

    onAdd(event);
  }

  return (
    <div>
      <div className="event-log">
        {events.length === 0 && (
          <div className="event-empty">No events yet — add one below to start the simulation</div>
        )}
        {events.map((e, i) => (
          <div className="event-row" key={i}>
            <span className="event-time">{formatTime(e.timestamp)}</span>
            <span>
              <span className="event-type">{e.type}</span>
              <span className="event-detail">{eventDetail(e)}</span>
            </span>
            <button className="event-remove" onClick={() => onRemove(i)} aria-label={`Remove event ${e.type}`}>
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="add-event">
        <select value={type} onChange={(e) => setType(e.target.value)} aria-label="Event type">
          {EVENT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {type === "product_view" && (
          <>
            <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category">
              {["sneakers", "backpacks", "watches", "headphones", "jackets"].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="price"
              style={{ width: 70 }}
            />
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              placeholder="dwell sec"
              style={{ width: 80 }}
            />
          </>
        )}

        {(type === "add_to_cart" || type === "remove_from_cart" || type === "purchase" || type === "filter_applied") && (
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="price"
            style={{ width: 70 }}
          />
        )}

        {type === "search" && (
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search query"
            style={{ width: 160 }}
          />
        )}

        {type === "coupon_apply" && (
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--text-muted)",
            }}
          >
            <input type="checkbox" checked={couponSuccess} onChange={(e) => setCouponSuccess(e.target.checked)} />
            success
          </label>
        )}

        <button className="btn-add" onClick={handleAdd}>
          + Add event
        </button>
      </div>
    </div>
  );
}