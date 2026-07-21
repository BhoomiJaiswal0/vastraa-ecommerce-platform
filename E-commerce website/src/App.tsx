import { useState } from "react";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import ShopPage from "./pages/ShopPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import AccountPage from "./pages/AccountPage";
import OrdersPage from "./pages/OrdersPage";
import type { Page } from "./types";
import { WishlistProvider } from "./context/WishlistContext";

function AppInner() {
  const [page, setPage] = useState<Page>("shop");
  const [productId, setProductId] = useState<string>("");
  const [orderId, setOrderId] = useState<string>("");

  const navigate = (to: Page, id?: string) => {
    if (to === "product" && id) setProductId(id);
    if (to === "order-success" && id) setOrderId(id);
    setPage(to);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9f6f0", display: "flex", flexDirection: "column" }}>
      <Header currentPage={page} navigate={navigate} />
      <CartDrawer navigate={navigate} />

      <main style={{ flex: 1 }}>
        {page === "shop" && <ShopPage navigate={navigate} />}
        {page === "product" && (
          <ProductDetailPage productId={productId} navigate={navigate} />
        )}
        {page === "checkout" && <CheckoutPage navigate={navigate} />}
        {page === "order-success" && (
          <OrderSuccessPage orderId={orderId} navigate={navigate} />
        )}
        {page === "account" && <AccountPage navigate={navigate} />}
        {page === "orders" && <OrdersPage navigate={navigate} />}
      </main>

      <Footer navigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
  <CartProvider>
    <WishlistProvider>
      <AppInner />
    </WishlistProvider>
  </CartProvider>
</AuthProvider>
  );
}
