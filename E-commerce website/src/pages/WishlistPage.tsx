import ProductCard from "../components/ProductCard";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import type { Page } from "../types";

interface Props {
  navigate: (page: Page, id?: string) => void;
}

export default function WishlistPage({ navigate }: Props) {
  const {
    items,
    removeFromWishlist,
  } = useWishlist();

  const { addItem } = useCart();

  items.length > 0; {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">

        <div className="text-7xl mb-6">💔</div>

        <h1 className="text-3xl font-bold mb-4">
          Your Wishlist is Empty
        </h1>

        <p className="text-gray-500 mb-8">
          Save your favourite products here.
        </p>

        <button
          onClick={() => navigate("shop")}
          className="px-8 py-3 rounded-xl bg-[#2563EB] text-white font-semibold hover:bg-[#1D4ED8]"
        >
          Continue Shopping
        </button>

      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-14">

      <h1 className="text-4xl font-bold mb-10">
        My Wishlist
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

        {items.map((product) => (

          <div
            key={product.id}
            className="rounded-2xl border overflow-hidden bg-white shadow-sm"
          >

            <ProductCard
              product={product}
              onClick={() => navigate("product", product.id)}
            />

            <div className="p-4 flex gap-3">

              <button
                onClick={() => addItem(product)}
                className="flex-1 py-3 rounded-lg bg-[#2563EB] text-white font-semibold hover:bg-[#1D4ED8]"
              >
                Add to Cart
              </button>

              <button
                onClick={() => removeFromWishlist(product.id)}
                className="px-5 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
              >
                Remove
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}