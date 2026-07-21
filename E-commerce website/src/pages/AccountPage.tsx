import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { Page } from "../types";

interface AccountPageProps {
  navigate: (page: Page) => void;
}

export default function AccountPage({ navigate }: AccountPageProps) {
  const { user, login, register, logout } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (mode === "login") {
      const res = await login(form.email, form.password);
      if (!res.success) setError(res.error ?? "Login failed");
    } else {
      if (form.password !== form.confirm) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
      }
      if (form.password.length < 6) {
        setError("Password must be at least 6 characters.");
        setLoading(false);
        return;
      }
      const res = await register(form.name, form.email, form.password);
      if (!res.success) setError(res.error ?? "Registration failed");
    }
    setLoading(false);
  };

  if (user) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 animate-fadeup">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#b5813e] mb-2">Account</p>
        <h1
          className="text-3xl text-[#1a1a1a] mb-2"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600 }}
        >
          Welcome back, {user.name.split(" ")[0]}.
        </h1>
        <p className="text-[#7a6f63] text-sm mb-10">{user.email}</p>

        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={() => navigate("orders")}
            className="flex items-center justify-between p-5 border border-[#d8d1c7] hover:border-[#111111] transition-colors group"
            style={{ backgroundColor: "#fdfbf7" }}
          >
            <div className="flex items-center gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b5813e" strokeWidth="1.5">
                <path d="M9 11H3l3-8h12l3 8h-6M9 11l-2 9h10l-2-9M9 11h6" />
              </svg>
              <div className="text-left">
                <p className="text-sm font-medium text-[#1a1a1a]">My Orders</p>
                <p className="text-xs text-[#7a6f63]">View your order history</p>
              </div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7a6f63" strokeWidth="1.5" className="group-hover:translate-x-0.5 transition-transform">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>

          <button
            onClick={() => navigate("shop")}
            className="flex items-center justify-between p-5 border border-[#d8d1c7] hover:border-[#111111] transition-colors group"
            style={{ backgroundColor: "#fdfbf7" }}
          >
            <div className="flex items-center gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b5813e" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <div className="text-left">
                <p className="text-sm font-medium text-[#1a1a1a]">Browse Shop</p>
                <p className="text-xs text-[#7a6f63]">Explore our full catalog</p>
              </div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7a6f63" strokeWidth="1.5" className="group-hover:translate-x-0.5 transition-transform">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="mt-10 pt-8 border-t border-[#d8d1c7]">
          <button
            onClick={logout}
            className="text-sm tracking-widest uppercase text-[#7a6f63] hover:text-red-500 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16 animate-fadeup">
      <p className="text-[10px] tracking-[0.3em] uppercase text-[#b5813e] mb-2">Account</p>
      <h1
        className="text-3xl text-[#1a1a1a] mb-8"
        style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600 }}
      >
        {mode === "login" ? "Sign in." : "Create account."}
      </h1>

      {/* Tab toggle */}
      <div className="flex border border-[#d8d1c7] mb-8">
        {(["login", "register"] as const).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setError(""); }}
            className="flex-1 py-2.5 text-xs tracking-widest uppercase transition-colors"
            style={{
              backgroundColor: mode === m ? "#111111" : "transparent",
              color: mode === m ? "white" : "#7a6f63",
            }}
          >
            {m === "login" ? "Sign In" : "Register"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" && (
          <div>
            <label className="block text-xs tracking-wide uppercase text-[#7a6f63] mb-1.5">Full Name</label>
            <input
              type="text" value={form.name} onChange={(e) => set("name", e.target.value)}
              required
              className="w-full px-3 py-2.5 text-sm bg-white border border-[#d8d1c7] focus:outline-none focus:border-[#b5813e] transition-colors"
              placeholder="Jane Doe"
            />
          </div>
        )}
        <div>
          <label className="block text-xs tracking-wide uppercase text-[#7a6f63] mb-1.5">Email</label>
          <input
            type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
            required
            className="w-full px-3 py-2.5 text-sm bg-white border border-[#d8d1c7] focus:outline-none focus:border-[#b5813e] transition-colors"
            placeholder="jane@example.com"
          />
        </div>
        <div>
          <label className="block text-xs tracking-wide uppercase text-[#7a6f63] mb-1.5">Password</label>
          <input
            type="password" value={form.password} onChange={(e) => set("password", e.target.value)}
            required minLength={6}
            className="w-full px-3 py-2.5 text-sm bg-white border border-[#d8d1c7] focus:outline-none focus:border-[#b5813e] transition-colors"
          />
        </div>
        {mode === "register" && (
          <div>
            <label className="block text-xs tracking-wide uppercase text-[#7a6f63] mb-1.5">Confirm Password</label>
            <input
              type="password" value={form.confirm} onChange={(e) => set("confirm", e.target.value)}
              required
              className="w-full px-3 py-2.5 text-sm bg-white border border-[#d8d1c7] focus:outline-none focus:border-[#b5813e] transition-colors"
            />
          </div>
        )}
        {error && (
          <p className="text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-2">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 text-sm tracking-widest uppercase font-medium transition-opacity hover:opacity-80 mt-2"
          style={{ backgroundColor: "#111111", color: "#f9f6f0", opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "…" : mode === "login" ? "Sign In" : "Create Account"}
        </button>
      </form>

      {mode === "login" && (
        <p className="text-xs text-[#7a6f63] mt-5 text-center">
          Demo: register any email/password to create an account.
        </p>
      )}
    </div>
  );
}
