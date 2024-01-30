import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MainContext } from "../Context/mainContext";
import toast from "react-hot-toast";
import axios from "axios";

const Header = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(MainContext);
  const logout = () => {
    axios.get("/logout").then(() => {
      setUser({});
      navigate("/signin");
    });
  };
  const isBoss = user.role === "Boss" || user.role === "Privileged";
  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      {/* Left navbar links */}
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" data-widget="pushmenu" href="#" role="button">
            <i className="fas fa-bars" />
          </a>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <span
            onClick={() => {
              navigate(-1);
            }}
            className="nav-link"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </span>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          {isBoss ? (
            <Link to="/" className="nav-link">
              <i className="fa-solid fa-house"></i> Home
            </Link>
          ) : (
            <button
              style={{ border: "none", backgroundColor: "white" }}
              onClick={() => toast.error("You cannot access this page")}
              className="nav-link"
            >
              <i className="fa-solid fa-house"></i> Home
            </button>
          )}
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          {user.role === "Salesman" || isBoss ? (
            <Link to="/addProducts" className="nav-link">
              <i className="fa-solid fa-plus"></i> Add Stock
            </Link>
          ) : null}
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          {user.role === "Salesman" || isBoss ? (
            <Link to="/pos" className="nav-link">
              <i className="fa-solid fa-shop"></i> POS
            </Link>
          ) : null}
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          {user.role === "Salesman" || isBoss ? (
            <Link to="/returns" className="nav-link">
              <i className="fa-solid fa-rotate-left nav-icon"></i> Returns
            </Link>
          ) : null}
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          {user.role === "Blocked" ? (
            <Link to="/profile" className="nav-link">
              <i className="fas fa-user"></i> Profile
            </Link>
          ) : null}
        </li>
      </ul>
      {/* Right navbar links */}
      <ul className="navbar-nav ml-auto">
        {/* Navbar Search */}

        <li className="nav-item">
          <a
            className="nav-link"
            data-widget="fullscreen"
            href="#"
            role="button"
          >
            <i className="fas fa-expand-arrows-alt" />
          </a>
        </li>
        <li className="nav-item">
          <a onClick={logout} className="nav-link" href="#" role="button">
            <i className="fas fa-right-from-bracket" />
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
