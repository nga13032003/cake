import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home/home";
import Product from "./components/Product/Product";
import Contact from "./components/Product/Contact";
import Bank from "./components/Product/Bank";
import ProductDetail from "./components/Product/ProductDetail";
import Notes from "./components/Product/Note";
import PhuKien from "./components/Product/PhuKien";
import TruongHop from "./components/Product/TruongHop";

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
          <Route path="/notes" element={<Notes />} />
          <Route path="/phukien" element={<PhuKien />} />
          <Route path="/truonghop" element={<TruongHop />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
