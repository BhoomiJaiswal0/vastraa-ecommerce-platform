import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import type { Page, Order, ShippingAddress } from "../types";

interface CheckoutPageProps {
  navigate: (page: Page, orderId?: string) => void;
}

const COUNTRIES = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
];
const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu & Kashmir",
  "Ladakh",
  "Chandigarh",
  "Puducherry",
];
function genOrderId() {
  return "ORD-" + Date.now().toString(36).toUpperCase();
}

export default function CheckoutPage({ navigate }: CheckoutPageProps) {
  const { items, subtotal, clearCart } = useCart();
  const { user, addOrder } = useAuth();
  const shipping = subtotal > 150 ? 0 : 12;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const [step, setStep] = useState<"shipping" | "payment">("shipping");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [address, setAddress] = useState<ShippingAddress>({
    firstName: user?.name.split(" ")[0] ?? "",
    lastName: user?.name.split(" ")[1] ?? "",
    email: user?.email ?? "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
  });

  const [payment, setPayment] = useState({
    card: "",
    name: user?.name ?? "",
    expiry: "",
    cvv: "",
  });

  const setAddr = (k: keyof ShippingAddress, v: string) =>
    setAddress((prev) => ({ ...prev, [k]: v }));

  const validateShipping = () => {
    const errs: Record<string, string> = {};
    if (!address.firstName) errs.firstName = "Required";
    if (!address.lastName) errs.lastName = "Required";
    if (!address.email || !/\S+@\S+\.\S+/.test(address.email)) errs.email = "Valid email required";
    if (!address.street) errs.street = "Required";
    if (!address.city) errs.city = "Required";
    if (!address.zip) errs.zip = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validatePayment = () => {
    const errs: Record<string, string> = {};
    const cleaned = payment.card.replace(/\s/g, "");
    if (cleaned.length < 13 || cleaned.length > 19) errs.card = "Enter a valid card number";
    if (!payment.name) errs.name = "Required";
    if (!payment.expiry || !/^\d{2}\/\d{2}$/.test(payment.expiry)) errs.expiry = "MM/YY format";
    if (!payment.cvv || payment.cvv.length < 3) errs.cvv = "3-4 digits";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const formatCard = (val: string) => {
    const num = val.replace(/\D/g, "").slice(0, 16);
    return num.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val: string) => {
    const num = val.replace(/\D/g, "").slice(0, 4);
    if (num.length >= 3) return num.slice(0, 2) + "/" + num.slice(2);
    return num;
  };

  const handlePlaceOrder = async () => {
    if (!validatePayment()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    const order: Order = {
      id: genOrderId(),
      items: [...items],
      subtotal,
      shipping,
      tax,
      total,
      status: "Processing",
      date: new Date().toISOString(),
      address,
      paymentLast4: payment.card.replace(/\s/g, "").slice(-4),
    };
    addOrder(order);
    clearCart();
    setLoading(false);
    navigate("order-success", order.id);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <p className="text-[#7a6f63] mb-4">Your bag is empty.</p>
        <button
          onClick={() => navigate("shop")}
          className="text-xs tracking-widest uppercase underline text-[#1a1a1a]"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const Field = ({
    label, id, error, children
  }: { label: string; id: string; error?: string; children: React.ReactNode }) => (
    <div>
      <label htmlFor={id} className="block text-xs tracking-wide uppercase text-[#7a6f63] mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );

  const inputCls = (err?: string) =>
    `w-full px-3 py-2.5 text-sm bg-white border ${err ? "border-red-400" : "border-[#d8d1c7]"} focus:outline-none focus:border-[#b5813e] transition-colors`;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <button
          onClick={() => navigate("shop")}
          className="flex items-center gap-2 text-xs tracking-wide text-[#7a6f63] hover:text-[#1a1a1a] transition-colors mb-4"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Shop
        </button>
        <h1
          className="text-3xl text-[#1a1a1a]"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600 }}
        >
          Checkout
        </h1>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-4 mb-10">
        {["Shipping", "Payment"].map((s, i) => {
          const isActive = (i === 0 && step === "shipping") || (i === 1 && step === "payment");
          const isDone = i === 0 && step === "payment";
          return (
            <div key={s} className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
                style={{
                  backgroundColor: isDone ? "#b5813e" : isActive ? "#111111" : "#ede8e0",
                  color: isActive || isDone ? "white" : "#7a6f63",
                }}
              >
                {isDone ? "✓" : i + 1}
              </div>
              <span
                className="text-sm tracking-wide"
                style={{ color: isActive ? "#1a1a1a" : "#7a6f63" }}
              >
                {s}
              </span>
              {i === 0 && <div className="w-8 h-px bg-[#d8d1c7]" />}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
        {/* Form */}
        <div>
          {step === "shipping" && (
            <div className="space-y-5">
              <h2 className="text-base font-medium text-[#1a1a1a] tracking-wide mb-4">
                Shipping Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <Field label="First Name" id="fn" error={errors.firstName}>
                  <input
                    id="fn" type="text" value={address.firstName}
                    onChange={(e) => setAddr("firstName", e.target.value)}
                    className={inputCls(errors.firstName)}
                  />
                </Field>
                <Field label="Last Name" id="ln" error={errors.lastName}>
                  <input
                    id="ln" type="text" value={address.lastName}
                    onChange={(e) => setAddr("lastName", e.target.value)}
                    className={inputCls(errors.lastName)}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Email" id="em" error={errors.email}>
                  <input
                    id="em" type="email" value={address.email}
                    onChange={(e) => setAddr("email", e.target.value)}
                    className={inputCls(errors.email)}
                  />
                </Field>
                <Field label="Phone" id="ph" error={errors.phone}>
                  <input
                    id="ph" type="tel" value={address.phone}
                    onChange={(e) => setAddr("phone", e.target.value)}
                    className={inputCls(errors.phone)}
                    placeholder="Optional"
                  />
                </Field>
              </div>
              <Field label="Street Address" id="st" error={errors.street}>
                <input
                  id="st" type="text" value={address.street}
                  onChange={(e) => setAddr("street", e.target.value)}
                  className={inputCls(errors.street)}
                  placeholder="House No., Street, Locality"
                />
              </Field>
              <div className="grid grid-cols-3 gap-4">
                <Field label="City" id="city" error={errors.city}>
                  <input
                    id="city" type="text" value={address.city}
                    onChange={(e) => setAddr("city", e.target.value)}
                    className={inputCls(errors.city)}
                  />
                </Field>
                <Field label="State" id="state" error={errors.state}>
                  <select
                    id="state" value={address.state}
                    onChange={(e) => setAddr("state", e.target.value)}
                    className={inputCls(errors.state)}
                  >
                    {INDIAN_STATES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="PIP Code" id="zip" error={errors.zip}>
                  <input
                    id="zip" type="text" value={address.zip}
                    onChange={(e) => setAddr("zip", e.target.value)}
                    className={inputCls(errors.zip)}
                    maxLength={10}
                  />
                </Field>
              </div>
              <Field label="Country" id="country" error={errors.country}>
                <select
                  id="country" value={address.country}
                  onChange={(e) => setAddr("country", e.target.value)}
                  className={inputCls()}
                >
                  {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <button
                onClick={() => { if (validateShipping()) setStep("payment"); }}
                className="mt-2 w-full py-3.5 text-sm tracking-widest uppercase font-medium transition-opacity hover:opacity-80"
                style={{ backgroundColor: "#111111", color: "#f9f6f0" }}
              >
                Proceed to Payment
              </button>
            </div>
          )}

          {step === "payment" && (
            <div className="space-y-5">
              <h2 className="text-base font-medium text-[#1a1a1a] tracking-wide mb-4">
                Payment Details
              </h2>
              <div
                className="flex items-center gap-2 px-3 py-2 text-xs text-[#7a6f63] border border-[#d8d1c7] bg-[#f2ede5]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                Payments are simulated — no real charges occur.
              </div>
              <Field label="Card Number" id="card" error={errors.card}>
                <input
                  id="card" type="text" value={payment.card}
                  onChange={(e) => setPayment((p) => ({ ...p, card: formatCard(e.target.value) }))}
                  className={inputCls(errors.card)}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </Field>
              <Field label="Cardholder Name" id="cname" error={errors.name}>
                <input
                  id="cname" type="text" value={payment.name}
                  onChange={(e) => setPayment((p) => ({ ...p, name: e.target.value }))}
                  className={inputCls(errors.name)}
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Expiry (MM/YY)" id="exp" error={errors.expiry}>
                  <input
                    id="exp" type="text" value={payment.expiry}
                    onChange={(e) => setPayment((p) => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                    className={inputCls(errors.expiry)}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </Field>
                <Field label="CVV" id="cvv" error={errors.cvv}>
                  <input
                    id="cvv" type="text" value={payment.cvv}
                    onChange={(e) => setPayment((p) => ({ ...p, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                    className={inputCls(errors.cvv)}
                    placeholder="•••"
                    maxLength={4}
                  />
                </Field>
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => setStep("shipping")}
                  className="flex-1 py-3 text-sm tracking-widest uppercase border border-[#d8d1c7] text-[#7a6f63] hover:border-[#111111] hover:text-[#1a1a1a] transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="flex-[2] py-3.5 text-sm tracking-widest uppercase font-medium transition-opacity hover:opacity-80 flex items-center justify-center gap-2"
                  style={{ backgroundColor: "#111111", color: "#f9f6f0", opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      Processing…
                    </>
                  ) : (
                    `Place Order · ₹{total.toFixed(2)}`
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <aside>
          <div className="border border-[#d8d1c7] p-5" style={{ backgroundColor: "#fdfbf7" }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                  Order Summary
              </h2>

              <span className="text-sm text-gray-500">
                  🛍 {items.length} Items
              </span>
          </div>
            <div className="space-y-4 mb-4 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3">
                  <div className="w-14 h-16 bg-[#ede8e0] flex-shrink-0 overflow-hidden">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#1a1a1a] leading-tight truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-[#7a6f63] mt-0.5">
                      {item.size && `₹{item.size} · `}{item.color && item.color} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-xs font-medium text-[#1a1a1a] flex-shrink-0">
                    ₹{(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-[#d8d1c7] pt-4 space-y-2">
              <div className="flex justify-between text-xs text-[#7a6f63]">
                <span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-[#7a6f63]">
                <span>Shipping</span><span>{shipping === 0 ? "Free Delivery" : `₹{shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹700</span>
            </div>
              <div className="flex justify-between text-xs text-[#7a6f63]">
                <span>GST (18%)</span><span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[#1a1a1a] pt-2 border-t border-[#d8d1c7]">
                <span>Total</span><span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
