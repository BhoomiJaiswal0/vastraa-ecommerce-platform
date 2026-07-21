import { useAuth } from "../context/AuthContext";
import type { Page } from "../types";

interface OrderSuccessPageProps {
  orderId: string;
  navigate: (page: Page) => void;
}

const STATUS_STEPS = ["Order Placed", "Processing", "Shipped", "Delivered"];

export default function OrderSuccessPage({ orderId, navigate }: OrderSuccessPageProps) {
  const { orders } = useAuth();
  const order = orders.find((o) => o.id === orderId) ?? orders[0];

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 text-center animate-fadeup">
      {/* Check icon */}
      <div
        className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
        style={{ backgroundColor: "#b5813e" }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <p className="text-[10px] tracking-[0.3em] uppercase text-[#b5813e] mb-2">Order Confirmed</p>
      <h1
        className="text-3xl text-[#1a1a1a] mb-3"
        style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600 }}
      >
        Thank you for your order.
      </h1>
      <p className="text-[#7a6f63] text-sm leading-relaxed mb-8">
        {order
          ? `Order ₹${order.id} has been placed. A confirmation will be sent to ${order.address.email}.`
          : "Your order has been placed successfully."}
      </p>

      {order && (
        <div className="text-left border border-[#d8d1c7] p-6 mb-8" style={{ backgroundColor: "#fdfbf7" }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs tracking-widest uppercase text-[#7a6f63]">Order ID</p>
              <p className="font-mono text-sm font-medium text-[#1a1a1a] mt-0.5">{order.id}</p>
            </div>
            <div className="text-right">
              <p className="text-xs tracking-widest uppercase text-[#7a6f63]">Date</p>
              <p className="text-sm text-[#1a1a1a] mt-0.5">
                {new Date(order.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-5">
            <p className="text-xs tracking-widest uppercase text-[#7a6f63] mb-3">Status</p>
            <div className="flex items-center">
              {STATUS_STEPS.map((s, i) => {
                const active = s === order.status || (order.status === "Processing" && i === 0);
                const done = STATUS_STEPS.indexOf(order.status) > i;
                return (
                  <div key={s} className="flex-1 flex flex-col items-center relative">
                    {i < STATUS_STEPS.length - 1 && (
                      <div
                        className="absolute top-3 left-1/2 w-full h-px"
                        style={{ backgroundColor: done ? "#b5813e" : "#d8d1c7" }}
                      />
                    )}
                    <div
                      className="relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs"
                      style={{
                        backgroundColor: done || active ? "#b5813e" : "#ede8e0",
                        color: done || active ? "white" : "#7a6f63",
                        border: active && !done ? "2px solid #b5813e" : "none",
                      }}
                    >
                      {done ? "✓" : i + 1}
                    </div>
                    <p className="text-[9px] tracking-wide uppercase text-[#7a6f63] mt-1.5 text-center leading-tight">
                      {s}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items */}
          <div className="space-y-3 mb-4">
            {order.items.map((item) => (
              <div key={item.product.id} className="flex items-center gap-3">
                <div className="w-10 h-12 bg-[#ede8e0] overflow-hidden flex-shrink-0">
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#1a1a1a] truncate">{item.product.name}</p>
                  <p className="text-xs text-[#7a6f63]">× {item.quantity}</p>
                </div>
                <p className="text-xs font-medium text-[#1a1a1a]">
                  ₹{(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-[#d8d1c7] pt-3 space-y-1">
            <div className="flex justify-between text-xs text-[#7a6f63]">
              <span>Subtotal</span><span>₹{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-[#7a6f63]">
              <span>Shipping</span><span>{order.shipping === 0 ? "Free" : `₹${order.shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-xs text-[#7a6f63]">
              <span>GST</span><span>₹{order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-[#1a1a1a] pt-1.5 border-t border-[#d8d1c7]">
              <span>Total</span><span>₹{order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Ship to */}
          <div className="mt-4 pt-4 border-t border-[#d8d1c7]">
            <p className="text-xs tracking-widest uppercase text-[#7a6f63] mb-1">Ship to</p>
            <p className="text-xs text-[#1a1a1a]">
              {order.address.firstName} {order.address.lastName}<br />
              {order.address.street}, {order.address.city}, {order.address.state} {order.address.zip}<br />
              {order.address.country}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={() => navigate("shop")}
          className="px-8 py-3 text-sm tracking-widest uppercase font-medium transition-opacity hover:opacity-80"
          style={{ backgroundColor: "#111111", color: "#f9f6f0" }}
        >
          Continue Shopping
        </button>
        <button
          onClick={() => navigate("orders")}
          className="px-8 py-3 text-sm tracking-widest uppercase border border-[#d8d1c7] text-[#7a6f63] hover:border-[#111111] hover:text-[#1a1a1a] transition-colors"
        >
          View All Orders
        </button>
      </div>
    </div>
  );
}
