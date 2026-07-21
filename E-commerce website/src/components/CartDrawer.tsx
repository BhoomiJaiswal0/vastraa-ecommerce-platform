import { useCart } from "../context/CartContext";
import type { Page } from "../types";

interface CartDrawerProps {
  navigate: (page: Page) => void;
}

export default function CartDrawer({ navigate }: CartDrawerProps) {
  const { items, isOpen, closeCart, removeItem, updateQuantity, itemCount, subtotal } = useCart();
  const shipping = subtotal > 150 ? 0 : 12;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        onClick={closeCart}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full z-50 flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ width: "min(420px, 100vw)", backgroundColor: "#fdfbf7", borderLeft: "1px solid #d8d1c7" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#d8d1c7]">
          <div>
            <h2
              className="text-xl text-[#1a1a1a]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Your Cart
            </h2>
            <p className="text-xs text-[#7a6f63] tracking-wide mt-0.5">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 flex items-center justify-center text-[#7a6f63] hover:text-[#1a1a1a] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Shipping notice */}
        {subtotal > 0 && subtotal < 150 && (
          <div className="mx-6 mt-3 px-3 py-2 text-xs text-[#b5813e] border border-[#b5813e]/30 bg-[#b5813e]/5">
            Add ₹{(150 - subtotal).toFixed(0)} more for free shipping
          </div>
        )}
        {subtotal >= 150 && (
          <div className="mx-6 mt-3 px-3 py-2 text-xs text-green-700 border border-green-200 bg-green-50">
            ✓ You qualify for free shipping
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d8d1c7" strokeWidth="1">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <p className="text-[#7a6f63] text-sm">Your bag is empty</p>
            </div>
          ) : (
            items.map((item) => {
                const cartKey = `${item.product.id}::${item.size ?? ""}::${item.color ?? ""}`;
              return (
                <div key={cartKey} className="flex gap-4">
                  <div className="w-20 h-24 bg-[#ede8e0] flex-shrink-0 overflow-hidden">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      className="text-sm font-medium text-[#1a1a1a] leading-tight"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {item.product.name}
                    </h4>
                    <div className="text-xs text-[#7a6f63] mt-0.5">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.size && item.color && <span> · </span>}
                      {item.color && <span>{item.color}</span>}
                    </div>
                    <p className="text-sm font-semibold text-[#1a1a1a] mt-1">
                      ₹{(item.product.price * item.quantity).toLocaleString()}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-[#d8d1c7]">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.size, item.color)}
                          className="w-7 h-7 flex items-center justify-center text-[#7a6f63] hover:text-[#1a1a1a] text-sm"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.size, item.color)}
                          className="w-7 h-7 flex items-center justify-center text-[#7a6f63] hover:text-[#1a1a1a] text-sm"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id, item.size, item.color)}
                        className="text-xs text-[#7a6f63] hover:text-red-500 transition-colors tracking-wide underline underline-offset-2"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Summary + CTA */}
        {items.length > 0 && (
          <div className="border-t border-[#d8d1c7] px-6 py-5 space-y-3">
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm text-[#7a6f63]">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-[#7a6f63]">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm text-[#7a6f63]">
                <span>Tax (8%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[#1a1a1a] pt-2 border-t border-[#d8d1c7]">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => {
                closeCart();
                navigate("checkout");
              }}
              className="w-full py-3.5 text-sm tracking-widest uppercase font-medium transition-opacity hover:opacity-80"
              style={{ backgroundColor: "#111111", color: "#f9f6f0" }}
            >
              Proceed to Checkout
            </button>
            <button
              onClick={closeCart}
              className="w-full py-2.5 text-xs tracking-widest uppercase text-[#7a6f63] hover:text-[#1a1a1a] transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
