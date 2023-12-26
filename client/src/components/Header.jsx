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
          <a href="/" className="nav-link">
            Home
          </a>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <a href="/products" className="nav-link">
            Add Stock
          </a>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <a href="/pos" className="nav-link">
            POS
          </a>
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
