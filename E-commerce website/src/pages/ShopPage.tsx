import { useState, useMemo } from "react";
import { products, categories } from "../data/products";
import ProductCard from "../components/ProductCard";
import type { Page } from "../types";

interface ShopPageProps {
  navigate: (page: Page, productId?: string) => void;
}

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest" },
];
const SIZES = ["All", "XS", "S", "M", "L", "XL", "2XL"];
export default function ShopPage({ navigate }: ShopPageProps) {
  const [activeCategory, setActiveCategory] = useState("All");
const [sort, setSort] = useState("featured");
const [search, setSearch] = useState("");
const [maxPrice, setMaxPrice] = useState(5000);
const [selectedSize, setSelectedSize] = useState("All");
const [minRating, setMinRating] = useState(0);

// New Filters (reserved for future filter UI)

const filtered = useMemo(() => {
  let list = [...products];

  if (activeCategory !== "All") {
    list = list.filter((p) => p.category === activeCategory);
  }

  if (search.trim()) {
    const q = search.toLowerCase();

    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }
list = list.filter((p) => p.price <= maxPrice);
if (selectedSize !== "All") {
  list = list.filter(
    (p) =>
      p.sizes &&
      p.sizes.includes(selectedSize)
  );
}

list = list.filter((p) => p.rating >= minRating);

switch (sort) {
  case "price-asc":
    list.sort((a, b) => a.price - b.price);
    break;

  case "price-desc":
    list.sort((a, b) => b.price - a.price);
    break;

  case "rating":
    list.sort((a, b) => b.rating - a.rating);
    break;

  case "newest":
    list = list
      .filter((p) => p.badge === "New")
      .concat(list.filter((p) => p.badge !== "New"));
    break;
}

return list;
}, [
  activeCategory,
  sort,
  search,
  maxPrice,
  minRating,
  selectedSize
]);
  return (
    <div>
{/* ================= HERO ================= */}

<section className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900">

  <div className="absolute inset-0 bg-black/30"></div>

  <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">

    <div className="grid lg:grid-cols-2 gap-20 items-center">

      {/* LEFT */}

      <div>

        <span className="inline-block px-5 py-2 rounded-full bg-blue-600 text-white text-xs uppercase tracking-[0.25em] mb-7">
          New Arrival 2026
        </span>

        <h1
          className="text-5xl md:text-7xl leading-tight text-white"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
          }}
        >
          Fashion
          <br />
          made for
          <br />

          <span className="text-blue-400">
            Everyday India.
          </span>
        </h1>

        <p className="mt-8 text-lg leading-8 text-gray-300 max-w-xl">

          Discover handcrafted styles, premium fabrics and
          modern designs curated specially for today's generation.

        </p>

        <div className="flex flex-wrap gap-5 mt-10">

          <button

            onClick={() =>
              document
                .getElementById("catalog")
                ?.scrollIntoView({ behavior: "smooth" })
            }

            className="px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300 shadow-xl"

          >
            Shop Collection
          </button>

          <button

            className="px-8 py-4 rounded-full border border-white/30 text-white hover:bg-white hover:text-slate-900 transition-all"

          >
            Explore
          </button>

        </div>

        <div className="grid grid-cols-3 gap-8 mt-16">

          <div>

            <h2 className="text-3xl font-bold text-white">
              15K+
            </h2>

            <p className="text-gray-400">
              Customers
            </p>

          </div>

          <div>

            <h2 className="text-3xl font-bold text-white">
              650+
            </h2>

            <p className="text-gray-400">
              Products
            </p>

          </div>

          <div>

            <h2 className="text-3xl font-bold text-white">
              4.9★
            </h2>

            <p className="text-gray-400">
              Rating
            </p>

          </div>

        </div>

      </div>

      {/* RIGHT */}

      <div className="grid grid-cols-2 gap-5">

        {products.slice(0,4).map((product,index)=>(

          <div

            key={product.id}

            onClick={()=>navigate("product",product.id)}

            className={`overflow-hidden rounded-3xl cursor-pointer shadow-2xl group
            ${
              index===1
                ? "translate-y-10"
                : index===2
                ? "-translate-y-10"
                : ""
            }`}

          >

            <img

              src={product.image}

              alt={product.name}

              className="w-full h-[320px] object-cover group-hover:scale-110 transition duration-700"

            />

          </div>

        ))}

      </div>

    </div>

  </div>

</section>
{/* ================= FEATURES ================= */}

<section className="bg-white border-y">

<div className="max-w-7xl mx-auto py-10 px-6 grid md:grid-cols-4 gap-8">

<div className="text-center">

<div className="text-4xl mb-3">🚚</div>

<h3 className="font-semibold">
Free Delivery
</h3>

<p className="text-sm text-gray-500 mt-2">
On orders above ₹999
</p>

</div>

<div className="text-center">

<div className="text-4xl mb-3">🔄</div>

<h3 className="font-semibold">
Easy Returns
</h3>

<p className="text-sm text-gray-500 mt-2">
7 Days Return Policy
</p>

</div>

<div className="text-center">

<div className="text-4xl mb-3">💳</div>

<h3 className="font-semibold">
Secure Payment
</h3>

<p className="text-sm text-gray-500 mt-2">
UPI • Cards • COD
</p>

</div>

<div className="text-center">

<div className="text-4xl mb-3">⭐</div>

<h3 className="font-semibold">
Trusted Brand
</h3>

<p className="text-sm text-gray-500 mt-2">
15,000+ Happy Customers
</p>

</div>

</div>

</section>

      <section id="catalog" className="max-w-7xl mx-auto px-6 py-14">
        {/* Catalog Heading */}

<div className="mb-12">

  <p className="uppercase tracking-[0.3em] text-blue-600 text-sm font-semibold mb-3">
    Collections
  </p>

  <h2
    className="text-5xl font-bold text-[#111827]"
    style={{
      fontFamily: "'Playfair Display', serif",
    }}
  >
    Shop the Latest
  </h2>

  <p className="text-gray-500 mt-4 max-w-xl leading-7">
    Discover premium fashion curated for every occasion.
    From timeless essentials to the latest trends,
    explore styles crafted for modern India.
  </p>

</div>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a6f63]"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search shirts, dresses, sneakers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-[#d8d1c7] text-[#1a1a1a] placeholder:text-[#7a6f63]/50 focus:outline-none focus:border-[#b5813e] transition-colors"
            />
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-xs tracking-wider uppercase border border-[#d8d1c7] bg-white px-4 py-2 text-[#1a1a1a] focus:outline-none focus:border-[#b5813e] cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-1.5 text-xs tracking-widest uppercase transition-all ₹{
                activeCategory === cat
                  ? "bg-[#111111] text-white"
                  : "bg-transparent border border-[#d8d1c7] text-[#7a6f63] hover:border-[#111111] hover:text-[#1a1a1a]"
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto flex-shrink-0 text-xs text-[#7a6f63]">
            {filtered.length} {filtered.length === 1 ? "product" : "products"}
          </span>
        </div>

        {/* Active Filters */}

<div className="flex flex-wrap items-center gap-3 mb-8">

  {activeCategory !== "All" && (
    <button
      onClick={() => setActiveCategory("All")}
      className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm hover:bg-blue-200 transition"
    >
      {activeCategory} ✕
    </button>
  )}

  {search && (
    <button
      onClick={() => setSearch("")}
      className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition"
    >
      "{search}" ✕
    </button>
  )}

  {(activeCategory !== "All" ||
 search ||
 maxPrice !== 5000 ||
 minRating !== 0) && (
    <button
      onClick={() => {
          setActiveCategory("All");
          setSearch("");
          setMaxPrice(5000);
          setSelectedSize("All");
          setMinRating(0);
      }}
      className="text-sm font-medium text-red-500 hover:text-red-700"
    >
      Clear All
    </button>
  )}

</div>
{/* Price Range */}

<div className="mb-10 bg-white rounded-2xl p-5 shadow-sm border">

  <div className="flex justify-between items-center mb-3">

    <h3 className="font-semibold text-gray-800">
      Price Range
    </h3>

    <span className="text-blue-600 font-semibold">
      ₹{maxPrice}
    </span>

  </div>

  <input
    type="range"
    min="0"
    max="5000"
    step="100"
    value={maxPrice}
    onChange={(e) => setMaxPrice(Number(e.target.value))}
    className="w-full cursor-pointer"
  />

  <div className="flex justify-between text-sm text-gray-500 mt-2">

    <span>₹0</span>

    <span>₹5000</span>

  </div>

</div>

{/* Size Filter */}

<div className="mt-8">

  <p className="text-sm font-semibold mb-4 text-gray-700">
    Size
  </p>

  <div className="flex flex-wrap gap-3">

    {SIZES.map((size) => (

      <button
        key={size}
        onClick={() => setSelectedSize(size)}
        className={`w-12 h-12 rounded-full border text-sm font-medium transition-all duration-300
          ${
            selectedSize === size
              ? "bg-[#2563EB] text-white border-[#2563EB]"
              : "bg-white text-gray-700 border-gray-300 hover:border-[#2563EB]"
          }`}
      >
        {size}
      </button>
    ))}

  </div>

</div>

{/* Rating Filter */}

<div className="mb-8 bg-white rounded-2xl p-5 shadow-sm border">

  <h3 className="font-semibold text-gray-800 mb-4">
    Customer Rating
  </h3>

  <div className="space-y-2">

    {[4, 3, 2, 1].map((rating) => (
      <button
        key={rating}
        onClick={() => setMinRating(rating)}
        className={`w-full text-left px-4 py-2 rounded-xl transition ₹{
          minRating === rating
            ? "bg-blue-600 text-white"
            : "hover:bg-gray-100"
        }`}
      >
        {"★".repeat(rating)}
        {"☆".repeat(5 - rating)}
        {" "}
        & Up
      </button>
    ))}

    <button
      onClick={() => setMinRating(0)}
      className="w-full text-left px-4 py-2 rounded-xl hover:bg-gray-100"
    >
      All Ratings
    </button>

  </div>

</div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-[#7a6f63]">
            <p className="text-base">No products found.</p>
            <button
              onClick={() => { setSearch(""); setActiveCategory("All"); }}
              className="mt-4 text-xs tracking-widest uppercase underline hover:text-[#1a1a1a]"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
            {filtered.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i}
                onClick={() => navigate("product", product.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Editorial Banner */}
      <section className="mx-6 mb-16 max-w-7xl md:mx-auto">
        <div
          className="relative overflow-hidden p-10 md:p-16 grid md:grid-cols-2 gap-8 items-center"
          style={{ backgroundColor: "#f2ede5" }}
        >
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#b5813e] mb-3">
              Our Promise
            </p>
            <h2
              className="text-3xl md:text-4xl text-[#1a1a1a] leading-tight mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600 }}
            >
              Fashion that
              <br />
              <em>defines you.</em>
            </h2>
            <p className="text-[#7a6f63] text-sm leading-relaxed max-w-sm">
              Every item in our catalog is reviewed for materials, manufacturing
              ethics, and long-term durability. We curate slowly so you can shop
              with confidence.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { stat: "100%", label: "Vetted suppliers" },
              { stat: "30d", label: "Free returns" },
              { stat: "4.8★", label: "Average rating" },
            ].map(({ stat, label }) => (
              <div key={label}>
                <p
                  className="text-2xl md:text-3xl text-[#1a1a1a]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700 }}
                >
                  {stat}
                </p>
                <p className="text-[10px] tracking-wide uppercase text-[#7a6f63] mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
