import { useNavigate } from "react-router-dom";
import Page from "../components/Page";
import React, { useContext } from "react";
import axios from "axios";
import { MainContext } from "../Context/mainContext";
function AccessDenied() {
  const navigate = useNavigate();
  const { setUser } = useContext(MainContext);

  const logout = () => {
    axios.get("/logout").then(() => {
      setUser({});
      navigate("/signin");
    });
  };

  return (
    <React.Fragment>
      <div className="bg-dark text-white py-5" style={{ minHeight: "51rem" }}>
        <div className="container py-5">
          <div className="row">
            <div className="col-md-2 text-center">
              <p>
                <i className="fa fa-exclamation-triangle fa-5x" />
                <br />
                Status Code: 403
              </p>
            </div>
            <div className="col-md-10">
              <h3>OPPSSS!!!! Sorry...</h3>
              <p>
                Sorry, your access is refused due to security reasons of our
                server and also our sensitive data.
                <br />
                Please go back to the previous page to continue browsing.
              </p>
              <a
                onClick={() => {
                  navigate("/addProducts");
                }}
                className="btn btn-danger"
              >
                Back to safe zon
              </a>
              <a onClick={logout} className="btn ml-2 btn-success">
                Login with another account
              </a>
            </div>
          </div>
        </div>
        <div id="footer" className="text-center">
          2023-24 All rights reserved Decent Developers
        </div>
      </div>
    </React.Fragment>
  );
}

export default AccessDenied;
