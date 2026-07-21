import { createContext, useContext, useState, type ReactNode } from "react";
import type { User, Order } from "../types";

interface AuthContextType {
  user: User | null;
  orders: Order[];
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  addOrder: (order: Order) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_USERS_KEY = "shop_users";
const SESSION_KEY = "shop_session";
const ORDERS_KEY = "shop_orders";

function loadUsers(): { name: string; email: string; password: string }[] {
  try {
    return JSON.parse(localStorage.getItem(MOCK_USERS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function loadSession(): User | null {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) ?? "null");
  } catch {
    return null;
  }
}

function loadOrders(userId: string): Order[] {
  try {
    const all = JSON.parse(localStorage.getItem(ORDERS_KEY) ?? "{}");
    return all[userId] ?? [];
  } catch {
    return [];
  }
}

function saveOrder(userId: string, order: Order) {
  try {
    const all = JSON.parse(localStorage.getItem(ORDERS_KEY) ?? "{}");
    all[userId] = [order, ...(all[userId] ?? [])];
    localStorage.setItem(ORDERS_KEY, JSON.stringify(all));
  } catch {}
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadSession);
  const [orders, setOrders] = useState<Order[]>(() =>
    user ? loadOrders(user.id) : []
  );

  const login = async (email: string, password: string) => {
    const users = loadUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) return { success: false, error: "Invalid email or password." };
    const u: User = { id: btoa(email), name: found.name, email: found.email };
    setUser(u);
    setOrders(loadOrders(u.id));
    localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    return { success: true };
  };

  const register = async (name: string, email: string, password: string) => {
    const users = loadUsers();
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: "An account with that email already exists." };
    }
    users.push({ name, email, password });
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
    const u: User = { id: btoa(email), name, email };
    setUser(u);
    setOrders([]);
    localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setOrders([]);
    localStorage.removeItem(SESSION_KEY);
  };

  const addOrder = (order: Order) => {
    if (!user) return;
    saveOrder(user.id, order);
    setOrders((prev) => [order, ...prev]);
  };

  return (
    <AuthContext.Provider value={{ user, orders, login, register, logout, addOrder }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
