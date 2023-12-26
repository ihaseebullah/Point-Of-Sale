import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function Page(props) {
  return (
    <React.Fragment>
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
    </React.Fragment>
  );
}
