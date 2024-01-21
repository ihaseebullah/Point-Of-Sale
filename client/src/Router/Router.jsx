import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "../pages/Index";
import AddProduct from "../pages/AddProduct";
import Pos from "../pages/Pos";
import TodaysSales from "../pages/TodaysSales";
import Inventory from "../pages/inventory";
import Invoices from "../pages/Invoices";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />}></Route>
        <Route path="/products" element={<AddProduct />}></Route>
        <Route path="/pos" element={<Pos />}></Route>
        <Route path="/inventory" element={<Inventory />}></Route>
        <Route path="/sales" element={<TodaysSales />}></Route>
        <Route path="/invoices" element={<Invoices />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
