
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home/home";
import Product from "./components/Product/Product";
import Contact from "./components/Product/Contact";
import Bank from "./components/Product/Bank";
import ProductDetail from "./components/Product/ProductDetail";
import Notes from "./components/Product/Note";
import PhuKien from "./components/Product/PhuKien";
import TruongHop from "./components/Product/TruongHop";
import Login from "./components/Login/login";


// PrivateRoute để bảo vệ các trang cần login
const PrivateRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter basename="/cake">
      <Routes>
        {/* Login page */}
        <Route path="/login" element={<Login />} />

        {/* Trang chính, chỉ mở khi đã login */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        >
          <Route index element={<Product />} />
          <Route path="products" element={<Product />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="contact" element={<Contact />} />
          <Route path="bank" element={<Bank />} />
          <Route path="notes" element={<Notes />} />
          <Route path="phukien" element={<PhuKien />} />
          <Route path="truonghop" element={<TruongHop />} />
        </Route>

        {/* Mặc định: chưa login → redirect login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
