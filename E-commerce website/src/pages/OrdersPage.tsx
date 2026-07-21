import { useAuth } from "../context/AuthContext";
import type { Page } from "../types";

interface OrdersPageProps {
  navigate: (page: Page) => void;
}

const STATUS_COLOR: Record<string, string> = {
  Processing: "#b5813e",
  Shipped: "#2563eb",
  Delivered: "#16a34a",
};

export default function OrdersPage({ navigate }: OrdersPageProps) {
  const { user, orders } = useAuth();

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <p className="text-[#7a6f63] mb-4">Sign in to view your orders.</p>
        <button
          onClick={() => navigate("account")}
          className="px-6 py-3 text-sm tracking-widest uppercase font-medium transition-opacity hover:opacity-80"
          style={{ backgroundColor: "#111111", color: "#f9f6f0" }}
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 animate-fadeup">
      <p className="text-[10px] tracking-[0.3em] uppercase text-[#b5813e] mb-2">Account</p>
      <h1
        className="text-3xl text-[#1a1a1a] mb-8"
        style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600 }}
      >
        Order History
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[#d8d1c7]">
          <p className="text-[#7a6f63] text-sm mb-4">You haven't placed any orders yet.</p>
          <button
            onClick={() => navigate("shop")}
            className="text-xs tracking-widest uppercase underline text-[#1a1a1a] hover:text-[#b5813e] transition-colors"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-[#d8d1c7] overflow-hidden"
              style={{ backgroundColor: "#fdfbf7" }}
            >
              {/* Order header */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-[#d8d1c7] bg-[#f2ede5]">
                <div>
                  <p className="font-mono text-xs font-medium text-[#1a1a1a]">{order.id}</p>
                  <p className="text-xs text-[#7a6f63] mt-0.5">
                    {new Date(order.date).toLocaleDateString("en-US", {
                      month: "long", day: "numeric", year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className="text-[10px] tracking-widest uppercase px-2 py-1 font-medium"
                    style={{ backgroundColor: STATUS_COLOR[order.status] + "20", color: STATUS_COLOR[order.status] }}
                  >
                    {order.status}
                  </span>
                  <span className="text-sm font-semibold text-[#1a1a1a]">${order.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Items */}
              <div className="px-5 py-4 space-y-3">
                {order.items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <div className="w-10 h-12 bg-[#ede8e0] overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#1a1a1a] truncate">{item.product.name}</p>
                      <p className="text-xs text-[#7a6f63]">
                        {item.size && `${item.size} · `}{item.color} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-xs font-medium text-[#1a1a1a]">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-[#d8d1c7] flex items-center justify-between">
                <p className="text-xs text-[#7a6f63]">
                  Shipped to {order.address.city}, {order.address.state} · ···· {order.paymentLast4}
                </p>
                <button
                  onClick={() => navigate("shop")}
                  className="text-xs tracking-wide text-[#b5813e] hover:underline"
                >
                  Reorder →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
