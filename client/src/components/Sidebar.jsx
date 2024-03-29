import { useContext } from "react";
import { Link } from "react-router-dom";
import { MainContext } from "../Context/mainContext";

// Define the Sidebar component
const Sidebar = () => {
  const { user } = useContext(MainContext);

  return (
    <>
      {/* Preloader */}

      <aside className="main-sidebar sidebar-dark-primary elevation-5">
        {/* Brand Logo */}
        <a href="index3.html" className="brand-link">
          <img
            src="/src/dist/img/Ddev Logo.jpg"
            alt="AdminLTE Logo"
            className="brand-image img-circle elevation-3"
            style={{ height: "2.3rem", width: "2.3rem", objectFit: "cover" }}
          />
          <span className="brand-text font-weight-light">Point Of Sale</span>
        </a>
        {/* Sidebar */}
        <div className="sidebar">
          {/* Sidebar user panel (optional) */}
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <Link to="/accounts/me">
              <div className="image">
                <img
                  src={user.img ? user.img : "/src/dist/img/Ddev Logo.jpg"}
                  className="img-circle elevation-2"
                  alt="User Image"
                  style={{
                    height: "2.3rem",
                    width: "2.3rem",
                    objectFit: "cover",
                  }}
                />
              </div>
            </Link>
            <div className="info">
              <Link to="/accounts/me" className="d-block">
                {user.firstName} {user.lastName}
              </Link>
            </div>
          </div>
          {/* SidebarSearch Form */}
          <div className="form-inline">
            <div className="input-group" data-widget="sidebar-search">
              <input
                className="form-control form-control-sidebar"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <div className="input-group-append">
                <button className="btn btn-sidebar">
                  <i className="fas fa-search fa-fw" />
                </button>
              </div>
            </div>
          </div>
          {/* Sidebar Menu */}
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              <li className="nav-header">Quick Access</li>
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  <i className="fa-solid fa-house nav-icon"></i>
                  <p>Home</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/addProducts" className="nav-link">
                  <i className="fa-solid fa-plus nav-icon "></i>
                  <p>Add Stock</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/pos" className="nav-link">
                  <i className="nav-icon fas fa-shop" />
                  <p>Pos</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/returns" className="nav-link">
                  <i className="fa-solid fa-rotate-left nav-icon"></i>
                  <p>Returns</p>
                </Link>
              </li>
              <li className="nav-header">Analytics</li>

              <li className="nav-item">
                <Link to="/inventory" className="nav-link">
                  <i className="fa-solid fa-boxes-stacked nav-icon"></i>
                  <p>Inventory</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/sales" className="nav-link">
                  <i className="fa-solid fa-universal-access nav-icon"></i>
                  <p>Sales</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/profit" className="nav-link">
                  <i className="fa-solid fa-tv nav-icon"></i>
                  <p>Profit Monitor</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/invoices" className="nav-link">
                  <i className="fa-solid fa-receipt nav-icon"></i>
                  <p>Invoices</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/Mails" className="nav-link">
                  <i className="fa-solid fa-envelope nav-icon"></i>
                  <p>Mails</p>
                </Link>
              </li>
              <li className="nav-header">Customers and Suppliers</li>
              <li className="nav-item">
                <Link to="/clients" className="nav-link">
                  <i class="fa-solid fa-children nav-icon"></i>
                  <p>Registered Clients</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/suppliers" className="nav-link">
                  <i class="fa-solid fa-user-tie nav-icon"></i>
                  <p>Our Suppliers</p>
                </Link>
              </li>

              <li className="nav-header">Accounts and settings</li>
              <li className="nav-item">
                <Link to="/accounts/me" className="nav-link">
                  <i className="fa-solid fa-user-gear nav-icon"></i>
                  <p>Account Settings</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/accounts/new/role" className="nav-link">
                  <i className="fa-solid fa-user-plus nav-icon"></i>
                  <p>Create Account</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/accounts/delete" className="nav-link">
                  <i className="fa-solid fa-user-xmark nav-icon"></i>
                  <p>Delete Account</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/accounts" className="nav-link">
                  <i className="fa-solid fa-users nav-icon"></i>
                  <p>Manage Accounts</p>
                </Link>
              </li>
            </ul>
          </nav>
          {/* /.sidebar-menu */}
        </div>
        {/* /.sidebar */}
      </aside>
    </>
  );
};

// Export the Sidebar component
export default Sidebar;
