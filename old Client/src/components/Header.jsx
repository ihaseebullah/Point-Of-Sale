import { Link } from "react-router-dom";

const Header = () => {
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
          <Link to="/" className="nav-link">
          <i className="fa-solid fa-house"></i> Home
          </Link>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
        <Link to="/products" className="nav-link">
        <i className="fa-solid fa-plus"></i> Add Stock
          </Link>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
        <Link to="/pos" className="nav-link">
        <i className="fa-solid fa-shop"></i> POS
          </Link>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
        <Link to="/returns" className="nav-link">
        <i className="fa-solid fa-rotate-left nav-icon"></i> Returns
          </Link>
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
      </ul>
    </nav>
  );
};

export default Header;
