import type { Page } from "../types";

interface FooterProps {
  navigate: (page: Page) => void;
}

export default function Footer({ navigate }: FooterProps) {
  return (
    <footer style={{ backgroundColor: "#111111", color: "#f9f6f0" }} className="mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 flex items-center justify-center" style={{ backgroundColor: "#b5813e" }}>
              <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                <rect x="0" y="0" width="6" height="6" fill="white" />
                <rect x="8" y="0" width="6" height="6" fill="white" opacity="0.5" />
                <rect x="0" y="8" width="6" height="6" fill="white" opacity="0.5" />
                <rect x="8" y="8" width="6" height="6" fill="white" />
              </svg>
            </div>
            <span
              className="text-white text-base tracking-widest uppercase"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Vastraa
            </span>
          </div>
          <p className="text-white/40 text-sm leading-relaxed max-w-xs">
            Premium fashion inspired by modern India.
            Designed for comfort, confidence and timeless style.          
          </p>
        </div>

        <div className="flex gap-4 mt-6">

        <button>📘</button>

        <button>📸</button>

        <button>🐦</button>

        <button>▶️</button>

        </div>

        {/* Shop */}
        <div>
          <h4 className="text-xs tracking-widest uppercase text-white/30 mb-4">Shop</h4>
          <ul className="space-y-2">
            {[
              "Men",
              "Women",
              "Electronics",
              "Home & Living",
              "Accessories",
            ].map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => navigate("shop")}
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Account */}
        <div>
          <h4 className="text-xs tracking-widest uppercase text-white/30 mb-4">Account</h4>
          <ul className="space-y-2">
            {[
              { label: "My Profile", page: "account" },
              { label: "My Orders", page: "orders" },
              { label: "Wishlist", page: "account" },
              { label: "Cart", page: "shop" },
            ].map(({ label, page }) => (
              <li key={label}>
                <button
                  onClick={() => navigate(page as Page)}
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Info */}
        <div>
          <h4 className="text-xs tracking-widest uppercase text-white/30 mb-4">Info</h4>
          <ul className="space-y-2">
            {[
              "About Us",
              "Shipping Policy",
              "Return Policy",
              "FAQs",
              "Contact Us",
            ].map((item) => (
              <li key={item}>
                <span className="text-sm text-white/60 cursor-default">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 space-y-2 text-sm text-white/60">

          <p>📧 support@vastraa.store</p>

          <p>📞 +91 98765 43210</p>

          <p>📍 New Delhi, India</p>

          </div>
      </div>

      <div
        className="border-t border-white/10 max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2"
      >
        <p className="text-xs text-white/25 tracking-wide">
          © {new Date().getFullYear()} Archvé. All rights reserved.
        </p>
        <p className="text-xs text-white/25">
          Built as intern project — frontend + backend simulation
        </p>
      </div>
    </footer>
  );
}
