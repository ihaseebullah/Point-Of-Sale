import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Index from "../pages/Index";
import AddProduct from "../pages/AddProduct";
import Pos from "../pages/Pos";
import TodaysSales from "../pages/TodaysSales";
import Inventory from "../pages/inventory";
import Invoices from "../pages/Invoices";
import Returns from "../pages/Return";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/signup";
import Profile from "../pages/profile";
import { useContext } from "react";
import { MainContext } from "../Context/mainContext";
import AccessDenied from "../pages/AccessDenied";
import ManageAccounts from "../pages/ManageAccounts";

const Router = () => {
  const { user } = useContext(MainContext);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            user.status != "Blocked" ? (
              user.role === "Boss" ? (
                <Index />
              ) : user.role === "Privileged" ? (
                <Index />
              ) : (
                <AccessDenied />
              )
            ) : (
              <AccessDenied />
            )
          }
        ></Route>
        <Route
          path={"/addProducts"}
          element={user.status === "Blocked" ? <Profile /> : <AddProduct />}
        ></Route>
        <Route
          path="/pos"
          element={user.status === "Blocked" ? <Profile /> : <Pos />}
        ></Route>
        <Route
          path="/inventory"
          element={user.status === "Blocked" ? <Profile /> : <Inventory />}
        ></Route>
        <Route
          path="/sales"
          element={user.status === "Blocked" ? <Profile /> : <TodaysSales />}
        ></Route>
        <Route
          path="/invoices"
          element={user.status === "Blocked" ? <Profile /> : <Invoices />}
        ></Route>
        <Route
          path="/returns"
          element={user.status === "Blocked" ? <Profile /> : <Returns />}
        ></Route>
        <Route
          path="/signin"
          element={user.status === "Blocked" ? <Profile /> : <SignIn />}
        ></Route>
        <Route
          path="/accounts/new/role"
          element={
            user.status != "Blocked" && user.role === "Boss" ? (
              <SignUp />
            ) : (
              <AccessDenied />
            )
          }
        ></Route>
        <Route path="/accounts/me" element={<Profile />}></Route>
        <Route
          path="/accounts"
          element={
            user.status != "Blocked" && user.role === "Boss" ? (
              <ManageAccounts />
            ) : (
              <AccessDenied />
            )
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
