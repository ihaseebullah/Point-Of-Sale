import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { MainContext } from "../Context/mainContext";
import SignIn from "../pages/SignIn";
import { Toaster } from "react-hot-toast";

export default function Page(props) {
  const { user, setUser, isLoggedIn, setIsLoggedIn } =
    React.useContext(MainContext);

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
