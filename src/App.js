import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home/home";
import Product from "./components/Product/Product";
import Contact from "./components/Product/Contact";
import Bank from "./components/Product/Bank";
import ProductDetail from "./components/Product/ProductDetail";

function App() {
  return (
    <BrowserRouter basename="/cake">
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<Product />} />
          <Route path="products" element={<Product />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="contact" element={<Contact />} />
          <Route path="bank" element={<Bank />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
