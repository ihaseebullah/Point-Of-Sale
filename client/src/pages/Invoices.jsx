/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import axios from "axios";
import Page from "../components/Page";
import React, { useContext, useEffect, useState } from "react";
import InvoiceVisualizer from "../components/InvoiceVisualizer";
import InvoiceMoadl from "../components/InvoiceMoadl";
import Loader from "../components/Loader";
import toast, { Toaster } from "react-hot-toast";
import { MainContext } from "../Context/mainContext";
import { useNavigate } from "react-router-dom";
function Invoices() {
  const { setPrevUrl, setUser } = useContext(MainContext);
  setPrevUrl("/invoices");
  const [InvoicesTable, setInvoicesTable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState(null);
  const [relod, setRelod] = useState(false);
  const Navigate = useNavigate();
  useEffect(() => {
    axios.get("/products").then((res) => {
      setProducts(res.data.data);
    });
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios
          .get("/pos/dashboard/getInvoices")
          .then((res) => {
            if (res.data.statusCode === 4001) {
              Navigate("/signin?msg=Please Login First" + res.data.message);
              setIsloggedIn(false);
              setUser({});
            }
            setInvoicesTable(res.data.data);
            setLoading(false);
          });
      } catch (error) {
        toast.error(error.response ? error.response.data : error.message);
        setError(error.response ? error.response.data : error.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [relod]);
  return (
    <React.Fragment>
      <Page>
        <h4>Invoices Page </h4>
        <InvoiceVisualizer loading={loading} />
        <div className="card">
          <div className="card-body">
            {loading ? (
              <Loader />
            ) : (
              <div>
                <table className="table table-hover text-nowrap">
                  <thead>
                    <tr>
                      <th>Date Created</th>
                      <th>Customer Name</th>
                      <th>Discount</th>
                      <th>Totall Amount</th>
                      <th>Items</th>
                      <th>Returned</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {InvoicesTable.map((invoices) => {
                      return (
                        <tr key={invoices._id}>
                          <td>
                            {new Date(invoices.createdAt).toLocaleDateString(
                              "en-US",
                              { month: "long", year: "numeric", day: "2-digit" }
                            )}
                          </td>
                          <td>{invoices.customerName}</td>
                          <td>{invoices.discountOffered}%</td>
                          <td>
                            {invoices.totallWithDiscount.toLocaleString(
                              "en-PK",
                              {
                                style: "currency",
                                currency: "PKR",
                              }
                            )}
                          </td>
                          <td>
                            {Object.keys(invoices.items).map((item, i) => {
                              return (
                                (i != 0 ? "," : "") +
                                item +
                                `(${invoices.items[item]})`
                              );
                            })}
                          </td>
                          <td>
                            <p>{invoices.returned ? "Yes" : "No"}</p>
                          </td>
                          <td>
                            <InvoiceMoadl
                              products={products}
                              id={invoices._id}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {
                  <p style={{ textAlign: "center" }}>
                    {loading ? null : error}
                    <br />

                    <button
                      onClick={() => setRelod(!relod)}
                      className="m-2 btn rounded-circle btn-primary btn-sm "
                    >
                      <i className="fa-solid fa-rotate-right"></i>
                    </button>
                  </p>
                }
              </div>
            )}
          </div>
        </div>
      </Page>
    </React.Fragment>
  );
}

export default Invoices;
