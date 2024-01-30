import React, { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { MainContext } from "../Context/mainContext";
import SignIn from "../pages/SignIn";
import { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function Page(props) {
  const { user, setUser, isLoggedIn, setIsLoggedIn, setPrevUrl } =
    React.useContext(MainContext);
  const location = useLocation();

  return (
    <React.Fragment>
      <Toaster position="bottom-right" reverseOrder={true} />

      {isLoggedIn ? (
        <>
          <Header />
          <Sidebar />
          <div className="content-wrapper p-3">
            <div className="content-header">
              <div className="container-fluid"></div>
            </div>

            {/* Main content */}
            {props.children}
          </div>
          <Footer />
        </>
      ) : (
        <SignIn />
      )}
    </React.Fragment>
  );
}
