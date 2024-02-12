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
  const { user, setUser, isLoggedIn, setIsLoggedIn, setPrevUrl, warned } =
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
              <div className="container-fluid">
                {warned === true && (
                  <div className="alert alert-danger">
                    <h4 className="">
                      Warning &nbsp;
                      <i class="fa-solid fa-triangle-exclamation" />
                    </h4>
                    <p
                      className=""
                      style={{ color: "rgba(255, 255, 255, 0.8)" }}
                    >
                      You have received a warning block, and your registration
                      key is at risk of permanent deletion if you do not respond
                      to the developer or SYS Admin within the next 48 hours.
                      <br />
                      This warning is typically issued by the system
                      administrator upon detecting a violation of policies. To
                      address this issue, please reach out to the system
                      administrator or the developer promptly.
                      <br />
                      Thank you for your cooperation.
                    </p>
                  </div>
                )}
              </div>
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
