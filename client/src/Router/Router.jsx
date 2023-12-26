import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "../pages/Index";
import AddProduct from "../pages/AddProduct";
import Pos from "../pages/pos";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />}></Route>
        <Route path="/products" element={<AddProduct />}></Route>
        <Route path="/pos" element={<Pos />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
