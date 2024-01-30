import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "../pages/Index";
import AddProduct from "../pages/AddProduct";
import Pos from "../pages/Pos";
import TodaysSales from "../pages/TodaysSales";
import Inventory from "../pages/inventory";
import Invoices from "../pages/Invoices";
import Returns from "../pages/Return";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/signup";

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
        <Route path="/returns" element={<Returns />}></Route>
        <Route path="/signin" element={<SignIn />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
