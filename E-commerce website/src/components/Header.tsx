import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import type { Page } from "../types";

interface HeaderProps {
  currentPage: Page;
  navigate: (page: Page) => void;
}

export default function Header({ currentPage, navigate }: HeaderProps) {
  const { itemCount: wishlistCount } = useWishlist();
  const { itemCount, openCart } = useCart();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      style={{ backgroundColor: "#0F172A" }}
      className="sticky top-0 z-40 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate("shop")}
          className="flex items-center gap-3 group"
        >
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-blue-600 text-white font-bold">
            V
          </div>

          <span
            className="text-white text-lg tracking-widest uppercase"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              letterSpacing: "0.08em",
            }}
          >
            Vastraa
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {(["shop", "account"] as Page[]).map((p) => (
            <button
              key={p}
              onClick={() => navigate(p)}
              className={`text-sm tracking-wider uppercase transition-colors duration-200 ${
                currentPage === p
                  ? "text-white"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {p === "account"
                ? user
                  ? user.name.split(" ")[0]
                  : "Profile"
                : "Shop"}
            </button>
          ))}

          {user && (
            <button
              onClick={() => navigate("orders")}
              className={`text-sm tracking-wider uppercase transition-colors duration-200 ${
                  currentPage === "orders"
                    ? "text-white"
                    : "text-white/50 hover:text-white"
                }`}
            >
              My Orders
            </button>
          )}

          {user && (
            <button
              onClick={logout}
              className="text-sm tracking-wider uppercase text-white/40 hover:text-white transition-colors"
            >
              Logout
            </button>
          )}
        </nav>
        <button
  onClick={() => navigate("wishlist")}
  className="relative flex items-center gap-2 text-white/70 hover:text-white transition-colors"
>
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
      2 5.42 4.42 3 7.5 3
      c1.74 0 3.41.81 4.5 2.09
      C13.09 3.81 14.76 3 16.5 3
      19.58 3 22 5.42 22 8.5
      c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>

  {wishlistCount > 0 && (
    <span
      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-semibold flex items-center justify-center"
    >
      {wishlistCount}
    </span>
  )}

  <span className="hidden sm:block text-sm tracking-wider uppercase">
    Wishlist
  </span>
</button>
        {/* Cart */}
        <div className="flex items-center gap-4">
          <button
            onClick={openCart}
            className="relative flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>

            {itemCount > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-white text-[9px] font-semibold flex items-center justify-center"
                style={{ backgroundColor: "#2563EB" }}
              >
                {itemCount}
              </span>
            )}

            <span className="hidden sm:block text-sm tracking-wider uppercase">
              Cart
            </span>
          </button>

          {/* Mobile Menu */}
          <button
            className="md:hidden text-white/60 hover:text-white transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div
          className="md:hidden border-t border-white/10 px-6 py-4 flex flex-col gap-4"
          style={{ backgroundColor: "#0F172A" }}
        >
          {(["shop", "account"] as Page[]).map((p) => (
            <button
              key={p}
              onClick={() => {
                navigate(p);
                setMenuOpen(false);
              }}
              className="text-sm tracking-widest uppercase text-left text-white/70 hover:text-white"
            >
              {p === "account"
                ? user
                  ? user.name
                  : "Profile"
                : "Shop"}
            </button>
          ))}

          {user && (
            <button
              onClick={() => {
                navigate("orders");
                setMenuOpen(false);
              }}
              className="text-sm tracking-widest uppercase text-left text-white/70 hover:text-white"
            >
              My Orders
            </button>
          )}

          {user && (
            <button
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="text-sm tracking-widest uppercase text-left text-white/40 hover:text-white"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}