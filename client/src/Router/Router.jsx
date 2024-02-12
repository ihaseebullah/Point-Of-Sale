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
import { useContext, useEffect, useState } from "react";
import { MainContext } from "../Context/mainContext";
import AccessDenied from "../pages/AccessDenied";
import ManageAccounts from "../pages/ManageAccounts";
import Clients from "../pages/Clients";
import Supplier from "../pages/Suppliers";
import Profit from "../pages/Profit";
import axios from "axios";
import LoadingScreen from "../pages/LoadingScreen";
import Expenses from "../pages/Expenses";

const Router = () => {
  const { user, connectionIsSecure } = useContext(MainContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            connectionIsSecure === true ? (
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
            ) : (
              <LoadingScreen status={connectionIsSecure} />
            )
          }
        ></Route>
        <Route
          path={"/addProducts"}
          element={
            connectionIsSecure === true ? (
              user.status === "Blocked" ? (
                <Profile />
              ) : (
                <AddProduct />
              )
            ) : (
              <LoadingScreen status={connectionIsSecure} />
            )
          }
        ></Route>
        <Route
          path="/pos"
          element={
            connectionIsSecure === true ? (
              user.status === "Blocked" ? (
                <Profile />
              ) : (
                <Pos />
              )
            ) : (
              <LoadingScreen status={connectionIsSecure} />
            )
          }
        ></Route>
        <Route
          path="/inventory"
          element={
            connectionIsSecure === true ? (
              user.status === "Blocked" ? (
                <Profile />
              ) : (
                <Inventory />
              )
            ) : (
              <LoadingScreen status={connectionIsSecure} />
            )
          }
        ></Route>
        <Route
          path="/sales"
          element={
            connectionIsSecure === true ? (
              user.status === "Blocked" ? (
                <Profile />
              ) : (
                <TodaysSales />
              )
            ) : (
              <LoadingScreen status={connectionIsSecure} />
            )
          }
        ></Route>
        <Route
          path="/invoices"
          element={
            connectionIsSecure === true ? (
              user.status === "Blocked" ? (
                <Profile />
              ) : (
                <Invoices />
              )
            ) : (
              <LoadingScreen status={connectionIsSecure} />
            )
          }
        ></Route>
        <Route
          path="/returns"
          element={
            connectionIsSecure === true ? (
              user.status === "Blocked" ? (
                <Profile />
              ) : (
                <Returns />
              )
            ) : (
              <LoadingScreen status={connectionIsSecure} />
            )
          }
        ></Route>
        <Route
          path="/signin"
          element={
            connectionIsSecure === true ? (
              user.status === "Blocked" ? (
                <Profile />
              ) : (
                <SignIn />
              )
            ) : (
              <LoadingScreen status={connectionIsSecure} />
            )
          }
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
        <Route
          path="/clients"
          element={
            user.status != "Blocked" && user.role === "Boss" ? (
              <Clients />
            ) : (
              <AccessDenied />
            )
          }
        ></Route>
        <Route
          path="/suppliers"
          element={
            user.status != "Blocked" && user.role === "Boss" ? (
              <Supplier />
            ) : (
              <AccessDenied />
            )
          }
        ></Route>
        <Route
          path="/profit"
          element={
            user.status != "Blocked" && user.role === "Boss" ? (
              <Profit />
            ) : (
              <AccessDenied />
            )
          }
        ></Route>
        <Route
          path="/expenses"
          element={user.status != "Blocked" && <Expenses />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
