import axios from "axios";
import Page from "../components/Page";
import React, { useContext, useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { MainContext } from "../Context/mainContext";

function UsersTable() {
  const { user } = useContext(MainContext);
  const User = user;
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchUsers = async () => {
      await axios.get("/admin/accounts/manage").then((res) => {
        setUsers(res.data.allUsers);
      });
    };
    fetchUsers();
  }, []);
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
  };
  const changeRole = (id, event) => {
    const selectedRole = event.target.value;

    // Set loading to true when starting the role change
    setLoading(true);

    axios
      .post(
        "/admin/accounts/change-role/" + id,
        { role: selectedRole },
        { headers }
      )
      .then((res) => {
        setRole("");
        setLoading(false);
        setUsers(res.data.allUsers);
      })
      .catch((error) => {
        console.error("Error changing role:", error);
        setLoading(false);
      });
  };
  const blockUser = (id) => {
    axios
      .post(
        "/admin/accounts/block-role/" + id,
        { status: "Blocked" },
        { headers }
      )
      .then((res) => {
        setLoading(false);
        setUsers(res.data.allUsers);
      });
  };
  return (
    <Table striped>
      <thead>
        <tr>
          <th>#</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Address</th>
          <th>Phone</th>
          <th>Username</th>
          <th>Email</th>
          <th>Sales</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, i) => {
          return (
            <tr
              className={`${User._id === user._id && "bg-info"}`}
              key={user._id}
            >
              <td>{i + 1}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.address}</td>
              <td>{user.phone}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                {user.sales.toLocaleString("en-PK", {
                  style: "currency",
                  currency: "PKR",
                })}
              </td>
              <td>
                <select
                  onChange={(event) => changeRole(user._id, event)}
                  value={user.role}
                  className="form-control"
                >
                  <option value={"Salesman"}>Salesman</option>
                  <option value={"Privileged"}>Privileged</option>
                  <option value={"Boss"}>Boss</option>
                </select>
              </td>
              <td>
                <button className="btn btn-danger mr-2">Delete User</button>
                {user.status === "Blocked" ? (
                  <button
                    onClick={() => {
                      blockUser(user._id);
                    }}
                    className="btn btn-success"
                  >
                    Unblock User
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      blockUser(user._id);
                    }}
                    className="btn btn-warning"
                  >
                    Block User
                  </button>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

function ManageAccounts() {
  return (
    <React.Fragment>
      <Page>
        <div className="alert alert-dark">
          <h6>
            <i className="fa fa-info-circle" />
            &nbsp;&nbsp;info
          </h6>
          <ul>
            <li>
              <p>
                A <b>Salesman</b> has the privilege to Add Stock, Process Point
                of Sale (PoS), and Handle Returns.
              </p>
            </li>
            <li>
              <p>
                A <b>Privileged User</b> enjoys unrestricted access to all pages
                within the system.
              </p>
            </li>
            <li>
              <p>
                A <b>Boss</b> has exclusive access to all system pages; there is
                only one Boss role.
              </p>
            </li>
            <li>
              <p>
                A <b>Blocked User</b> has a highly restricted role and can only
                access his profile page.
              </p>
            </li>
            <li>
              <p>
                Instead of <b>Deleting a User</b>, consider blocking them. This
                achieves the same result, and users can choose to delete their
                accounts themselves, aligning with basic human ethics.
              </p>
            </li>
          </ul>
        </div>

        <div className="card ">
          <div className="card-header">
            <div className="card-title">Manage Accounts</div>
          </div>

          <div className="card-body" style={{ padding: "0rem" }}>
            <UsersTable />
          </div>
          <div className="card-footer">
            These are the list of users currently active on the software
          </div>
        </div>
      </Page>
    </React.Fragment>
  );
}

export default ManageAccounts;
