import React, { useState } from "react";
import Loader from "../components/Loader";
export default function LoadingScreen({ connectionIsSecure }) {
  const [status, setStatus] = useState(true);
  const [takingLongerThenUsual, setTakingLongerThenUsual] = useState(false);
  setTimeout(() => {
    setStatus(connectionIsSecure);
  }, 15000);
  setTimeout(() => {
    setTakingLongerThenUsual(true);
  }, 5000);

  return (
    <React.Fragment>
      {status === true ? (
        <>
          <Loader />
          <p style={{ textAlign: "center" }}>
            Checking authenticity of your connection...
          </p>
          <p style={{ textAlign: "center" }}>
            <span className="badge badge-md badge-primary p-2">{`${
              takingLongerThenUsual
                ? "The request is taking longer then usual might be your internet"
                : "Please wait"
            }`}</span>
          </p>
        </>
      ) : (
        <div
          className="bg-danger"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            margin: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div>
              <h1 style={{ textAlign: "center" }}>
              <i class="fa-regular fa-face-frown fa-2x" ></i>
              </h1>
              <br />
              <h3 style={{ textAlign: "center" }}>
                Connection Verification Failed
              </h3>
              <p style={{ textAlign: "center" }}>
                This issue may be attributed to your internet connection or the
                usage of a modified software version that cannot authenticate
                necessary credentials with the server. <br /> Please reach out
                to your developer for assistance.
              </p>
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <p style={{ fontSize: "14px" }}>
                  &copy; {new Date().getFullYear()} Decent Developers . All
                  Rights Reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
