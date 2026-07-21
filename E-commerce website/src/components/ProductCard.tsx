import type { Product } from "../types";
import { useWishlist } from "../context/WishlistContext";
interface ProductCardProps {
  product: Product;
  onClick: () => void;
  index?: number;
}

export default function ProductCard({
  product,
  onClick,
  index = 0,
}: ProductCardProps) {
        const { toggleWishlist, isWishlisted } = useWishlist();

      const liked = isWishlisted(product.id);
  return (
    <article
      className="group cursor-pointer animate-fadeup hover:-translate-y-2 transition-all duration-500"
      style={{
        animationDelay: `${index * 60}ms`,
        animationFillMode: "both",
      }}
      onClick={onClick}
    >
      {/* Product Image */}
      <div className="relative overflow-hidden bg-[#F8F8F8] rounded-3xl shadow-sm hover:shadow-2xl aspect-[4/5] mb-5 transition-all duration-500">

        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-4 right-4 z-20 w-10 h-10 rounded-full shadow-lg flex items-center justify-center text-lg transition-all duration-300 ${
            liked
              ? "bg-red-500 text-white"
              : "bg-white text-gray-700 hover:bg-red-500 hover:text-white"
          }`}
        >
          {liked ? "♥" : "♡"}
        </button>
        {/* Badge */}
        {product.badge && (
          <span
            className="absolute top-4 left-4 z-20 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest shadow-lg"
            style={{
              backgroundColor:
                product.badge === "Sale"
                  ? "#DC2626"
                  : product.badge === "New"
                  ? "#111827"
                  : "#2563EB",
              color: "#fff",
            }}
          >
            {product.badge}
          </span>
        )}

        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300 flex items-end">

          <div className="w-full p-5 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">

            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="w-full py-3 rounded-full bg-white text-black font-semibold tracking-wider uppercase text-xs hover:bg-blue-600 hover:text-white transition"
            >
              Quick View
            </button>

          </div>

        </div>

      </div>

      {/* Product Info */}

      <div>

        <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-2">
          {product.category}
        </p>

        <h3
          className="text-lg font-semibold text-gray-900 leading-snug mb-3 group-hover:text-blue-600 transition-colors duration-300"
          style={{
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {product.name}
        </h3>

        {/* Price */}

        <div className="flex items-center gap-3 mb-3">

          <span className="text-xl font-bold text-blue-600">
            ₹{product.price.toLocaleString()}
          </span>

          {product.originalPrice && (
            <span className="text-base text-gray-400 line-through">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}

        </div>

        {/* Rating */}

        <div className="flex items-center">

          <div className="flex gap-1">

            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                width="14"
                height="14"
                viewBox="0 0 10 10"
                fill={
                  i < Math.floor(product.rating)
                    ? "#FBBF24"
                    : "#D1D5DB"
                }
              >
                <polygon points="5,0 6.18,3.64 10,3.64 6.91,5.9 8.09,9.51 5,7.27 1.91,9.51 3.09,5.9 0,3.64 3.82,3.64" />
              </svg>
            ))}

          </div>

          <span className="text-sm text-gray-500 ml-2">
            ({product.reviews})
          </span>

        </div>

      </div>

    </article>
  );
}