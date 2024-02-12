import axios from "axios";
import Page from "../components/Page";
import React, { useContext, useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import toast from "react-hot-toast";
import { MainContext } from "../Context/mainContext";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { Spinner } from "react-bootstrap";

function Supplier() {
  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const Navigate = useNavigate();

  const { setIsLoggedIn, setUser } = useContext(MainContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/add/product");
        if (response.data.statusCode === 401) {
          setIsLoggedIn(false);
        } else if (response.data.statusCode === 4001) {
          setUser({});
          setLoading(false);
          setIsLoggedIn(false);
          Navigate("/signin?msg=Please Login First" + response.data.message);
        }
        setSuppliers(response.data);
      } catch (error) {
        setError(error.response ? error.response.data : error.message);
      }
    };
    fetchData();
  }, [setIsLoggedIn, setUser, Navigate]);

  const toggleRowVisibility = (dealerId) => {
    setSuppliers((prevSuppliers) =>
      prevSuppliers.map((dealer) =>
        dealer._id === dealerId
          ? { ...dealer, visible: !dealer.visible }
          : dealer
      )
    );
  };

  return (
    <React.Fragment>
      <Page>
        <div className="card">
          <div className="card-header">
            <h4>Our Suppliers</h4>
          </div>
          <div className="card-body p-0">
            {suppliers.length > 0 ? (
              <Table bordered>
                <thead>
                  <tr>
                    <th>Dealer Account Number</th>
                    <th>Dealer Name</th>
                    <th>Dealer Phone</th>
                    <th>Dues</th>
                    <th>Aliance Since</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map((dealer, index) => (
                    <React.Fragment key={dealer._id}>
                      <tr>
                        <td>{dealer.accountNumber}</td>
                        <td>{dealer.name}</td>
                        <td>{dealer.phone}</td>
                        <td>{dealer.account}</td>
                        <td>
                          {new Date(dealer.createdAt).toLocaleDateString(
                            "en-US",
                            { dateStyle: "full" }
                          )}
                        </td>
                        <td>
                          <button
                            onClick={() => toggleRowVisibility(dealer._id)}
                            className="btn btn-success"
                          >
                            {dealer.visible ? "Hide Details" : "Show Details"}
                          </button>
                        </td>
                      </tr>
                      {dealer.visible && (
                        <tr>
                          <td className="p-0" colSpan={6}>
                            {dealer.purchases.length >= 1 ? (
                              <Table striped="columns" className="p-0">
                                <thead>
                                  <tr className="bg-dark">
                                    <th>Barcode</th>
                                    <th>Product Name</th>
                                    <th>Quantity</th>
                                    <th>Totall Bill</th>
                                    <th>Amount Paid</th>
                                    <th>Amount Due</th>
                                    <th>Date</th>
                                  </tr>
                                </thead>
                                <tbody className="p-0">
                                  {dealer.purchases.map((item, i) => {
                                    return (
                                      <tr key={i + 1}>
                                        <td>{item.barCode}</td>
                                        <td>{item.productName}</td>
                                        <td>{item.stock}</td>
                                        <td>
                                          {parseInt(item.amountPaid) +
                                            parseInt(item.amountRemaining)}
                                        </td>
                                        <td>{item.amountPaid}</td>
                                        <td>{item.amountRemaining}</td>
                                        <td>{item.date}</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </Table>
                            ) : (
                              <p className="text-center">
                                No invoices on the record
                              </p>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "50vh",
                }}
              >
                {error ? error : <Spinner animation="border" role="status" />}
              </div>
            )}
          </div>
          <div className="card-footer"></div>
        </div>
      </Page>
    </React.Fragment>
  );
}

export default Supplier;
