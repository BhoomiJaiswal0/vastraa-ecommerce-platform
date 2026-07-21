import { useState } from "react";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import type { Page } from "../types";

interface ProductDetailPageProps {
  productId: string;
  navigate: (page: Page, productId?: string) => void;
}

export default function ProductDetailPage({ productId, navigate }: ProductDetailPageProps) {
  const product = products.find((p) => p.id === productId);
  const { addItem } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product?.sizes?.[0]
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product?.colors?.[0]
  );
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
if (!product) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <p className="text-[#7a6f63]">Product not found.</p>

      <button
        onClick={() => navigate("shop")}
        className="text-xs tracking-widest uppercase underline text-[#1a1a1a]"
      >
        Back to Shop
      </button>
    </div>
  );
}

const liked = isWishlisted(product.id);

const related = products
  .filter((p) => p.category === product.category && p.id !== product.id)
  .slice(0, 4);

const handleBuyNow = () => {
    addItem(product, qty, selectedSize, selectedColor);

    navigate("checkout");
  };
  const handleAddToCart = () => {
    addItem(product, qty, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
<div className="max-w-7xl mx-auto px-6 py-14">      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs tracking-wide text-[#7a6f63] mb-8">
        <button onClick={() => navigate("shop")} className="hover:text-[#1a1a1a] transition-colors">
          Shop
        </button>
        <span>/</span>
        <button
          onClick={() => navigate("shop")}
          className="hover:text-[#1a1a1a] transition-colors"
        >
          {product.category}
        </button>
        <span>/</span>
        <span className="text-[#1a1a1a] truncate max-w-[180px]">{product.name}</span>
      </nav>

      {/* Product Layout */}
        <div className="grid lg:grid-cols-2 gap-20 items-start mb-24">
          {/* Images */}
        <div className="flex gap-3">
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex flex-col gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-16 h-20 overflow-hidden border-2 transition-colors flex-shrink-0 ₹{
                    activeImg === i ? "border-[#111111]" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
          {/* Main image */}
          <div className="relative overflow-hidden rounded-3xl bg-[#f8f8f8] shadow-xl aspect-[4/5]">
            <img
              src={product.images[activeImg]}
              alt={product.name}
              className="w-full h-full object-cover transition duration-700 hover:scale-110"
            />
            {product.badge && (
              <span
                className="absolute top-4 left-4 text-[10px] tracking-widest uppercase px-2 py-1 font-medium"
                style={{
                  backgroundColor:
                    product.badge === "Sale" ? "#e63946" : product.badge === "New" ? "#111111" : "#b5813e",
                  color: "white",
                }}
              >
                {product.badge}
              </span>
            )}
            {product.originalPrice && (
              <div
                className="absolute bottom-4 right-4 text-xs px-2 py-1"
                style={{ backgroundColor: "#e63946", color: "white" }}
              >
                Save ₹{product.originalPrice-product.price}
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <p className="uppercase tracking-[0.35em] text-blue-600 text-xs font-semibold mb-2">
            VASTRAA PREMIUM
          </p>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#b5813e] mb-2">
            {product.category}
          </p>
          <h1
            className="text-3xl md:text-4xl text-[#1a1a1a] leading-tight mb-3"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600 }}
          >
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  width="12"
                  height="12"
                  viewBox="0 0 10 10"
                  fill={i < Math.floor(product.rating) ? "#b5813e" : "#d8d1c7"}
                >
                  <polygon points="5,0 6.18,3.64 10,3.64 6.91,5.9 8.09,9.51 5,7.27 1.91,9.51 3.09,5.9 0,3.64 3.82,3.64" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-[#7a6f63]">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span
              className="text-2xl font-semibold text-[#1a1a1a]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-base text-[#7a6f63] line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <p className="text-sm text-[#5a5249] leading-relaxed mb-6">{product.description}</p>

          {product.originalPrice && (
  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
    {Math.round(
      ((product.originalPrice - product.price) /
        product.originalPrice) *
        100
    )}
    % OFF
  </span>
)}

          {/* Size selector */}
          {product.sizes && (
            <div className="mb-5">
              <p className="text-xs tracking-widest uppercase text-[#7a6f63] mb-2">
                Size — <span className="text-[#1a1a1a]">{selectedSize}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`min-w-[40px] h-9 px-3 text-xs tracking-wide border transition-all ${
                      selectedSize === s
                        ? "border-[#111111] bg-[#111111] text-white"
                        : "border-[#d8d1c7] bg-white text-[#1a1a1a] hover:border-[#111111]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color selector */}
          {product.colors && (
            <div className="mb-6">
              <p className="text-xs tracking-widest uppercase text-[#7a6f63] mb-2">
                Color — <span className="text-[#1a1a1a]">{selectedColor}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-3 h-8 text-xs border transition-all ${
                      selectedColor === c
                        ? "border-[#111111] bg-[#111111] text-white"
                        : "border-[#d8d1c7] bg-white text-[#1a1a1a] hover:border-[#111111]"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Add to cart */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center border border-[#d8d1c7]">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-12 flex items-center justify-center text-[#7a6f63] hover:text-[#1a1a1a] text-lg"
              >
                −
              </button>
              <span className="w-10 text-center text-sm font-medium">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                className="w-10 h-12 flex items-center justify-center text-[#7a6f63] hover:text-[#1a1a1a] text-lg"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className={`w-full h-14 rounded-xl font-semibold text-base transition-all duration-300 ${
                added
                  ? "bg-green-600 text-white"
                  : "bg-[#111827] text-white hover:bg-black"
              }`}
            >
              {added ? "✓ Added to Cart" : "Add to Cart"}
            </button>
            <button
              onClick={() => toggleWishlist(product)}
              className={`w-full h-12 rounded-xl border transition-all duration-300 font-medium ${
                liked
                  ? "border-red-500 bg-red-500 text-white"
                  : "border-gray-300 hover:border-red-500 hover:text-red-500"
              }`}
            >
              {liked ? "♥ Remove from Wishlist" : "♡ Add to Wishlist"}
            </button>
          </div>

          <button
            onClick={handleBuyNow}
            className="w-full h-14 rounded-xl bg-[#2563EB] text-white font-semibold text-base transition-all duration-300 hover:bg-[#1D4ED8] hover:shadow-xl"
          >
            Buy Now
          </button>

          {/* Stock */}
          <p className="text-xs text-[#7a6f63] mb-6">
            {product.stock <= 5 ? (
              <span className="text-[#e63946]">Only {product.stock} left in stock</span>
            ) : (
              <span>In stock — ships within 2–4 business days</span>
            )}
          </p>

          {/* Delivery & Trust Card */}

<div className="mt-8 rounded-3xl border border-gray-200 bg-white shadow-sm p-6">

  <h3 className="text-lg font-semibold text-gray-900 mb-5">
    Why You'll Love It
  </h3>

  <div className="space-y-5">

    {/* Delivery */}

    <div className="flex items-start gap-4">

      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
        🚚
      </div>

      <div>

        <h4 className="font-semibold text-gray-800">
          Free Delivery
        </h4>

        <p className="text-sm text-gray-500 mt-1">
          Free shipping on all orders above ₹100.
          Delivered within 2–4 business days.
        </p>

      </div>

    </div>

    {/* Returns */}

    <div className="flex items-start gap-4">

      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl">
        🔄
      </div>

      <div>

        <h4 className="font-semibold text-gray-800">
          Easy Returns
        </h4>

        <p className="text-sm text-gray-500 mt-1">
          Hassle-free 7-day return & exchange policy.
        </p>

      </div>

    </div>

    {/* Payment */}

    <div className="flex items-start gap-4">

      <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-2xl">
        💳
      </div>

      <div>

        <h4 className="font-semibold text-gray-800">
          Secure Payments
        </h4>

        <p className="text-sm text-gray-500 mt-1">
          UPI, Credit Card, Debit Card,
          Net Banking & Cash on Delivery available.
        </p>

      </div>

    </div>

    {/* Authentic */}

    <div className="flex items-start gap-4">

      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-2xl">
        ✔️
      </div>

      <div>

        <h4 className="font-semibold text-gray-800">
          100% Authentic Products
        </h4>

        <p className="text-sm text-gray-500 mt-1">
          Every product is quality checked before shipping.
        </p>

      </div>

    </div>

  </div>

</div>

          {/* Details accordion */}
          <div className="border-t border-[#d8d1c7] pt-5">
            <p className="text-xs tracking-widest uppercase text-[#7a6f63] mb-3">Product Details</p>
            <ul className="space-y-1.5">
              {product.details.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#5a5249]">
                  <span className="text-[#b5813e] mt-0.5 flex-shrink-0">—</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section>
          <div className="flex items-baseline gap-4 mb-8">
            <h2
              className="text-2xl text-[#1a1a1a]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600 }}
            >
              You might also like
            </h2>
            <div className="flex-1 border-t border-[#d8d1c7]" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
            {related.map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                index={i}
                onClick={() => navigate("product", p.id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
