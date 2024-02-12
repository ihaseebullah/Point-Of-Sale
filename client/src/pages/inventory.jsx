import axios from "axios";
import Page from "../components/Page";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { MainContext } from "../Context/mainContext";
import { useNavigate } from "react-router-dom";
function Inventory() {
  const Navigate = useNavigate();
  const { setPrevUrl, setUser } = useContext(MainContext);
  setPrevUrl("/inventory");
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relod, setRelod] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get("/pos/inventory").then((res) => {
          if (res.data.statusCode === 4001) {
            Navigate("/signin?msg=Please Login First" + res.data.message);
            setUser({});
            setIsLoggedIn(false);
            setLoading(false);
          }
          setInventory(res.data.data);
          setLoading(false);
        });
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <React.Fragment>
      <Page>
        <div className="row">
          <div className="col-12">
            <div className="card " style={{ borderRadius: "10px" }}>
              <div className="card-header">
                <h3 className="card-title">Inventory</h3>
                <div className="card-tools"></div>
              </div>
              {/* /.card-header */}
              <div className="card-body  p-0">
                {loading ? (
                  <Loader />
                ) : (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Barcode</th>
                        <th>Batch No</th>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Purchased Price</th>
                        <th>Sale Price</th>
                        <th>Profit</th>
                        <th>Expiray Date</th>
                        <th>Purchased Date</th>
                        <th>Stocks Consumption</th>
                        <th style={{ width: 40 }}>Label</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventory.map((product, i) => {
                        let dynamicWidth =
                          (product.purchasedQuantity - product.stockQuantity) /
                          product.purchasedQuantity;
                        const progressBarClass =
                          dynamicWidth >= 0.75
                            ? "bg-danger"
                            : dynamicWidth >= 0.5
                            ? "bg-warning"
                            : dynamicWidth >= 0.25
                            ? "bg-info"
                            : "bg-success";
                        return (
                          <tr key={product._id}>
                            <td>{product.barCode}</td>
                            <td>{product.batchNo}</td>
                            <td>{product.productName}</td>
                            <td>
                              {product.category
                                ? product.category
                                : "Not mentioned"}
                            </td>
                            <td>{product.purchasedPrice}</td>
                            <td>{product.unitPrice}</td>
                            <td>{`${
                              Math.round(product.profit) != NaN
                                ? Math.round(product.profit)
                                : "Not recorded"
                            } %`}</td>
                            <td>{product.expirayDate}</td>
                            <td>
                              {new Date(product.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )}
                            </td>
                            <td>
                              <div className="progress progress-xs">
                                <div
                                  className={`progress-bar ${progressBarClass}`}
                                  style={{ width: `${dynamicWidth * 100}%` }}
                                />
                              </div>
                            </td>
                            <td>
                              <span className={`badge ${progressBarClass}`}>
                                {`${Math.max(
                                  product.purchasedQuantity -
                                    product.stockQuantity,
                                  0
                                )} / ${product.purchasedQuantity}`}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="card-footer  pl-3">Since 2023</div>
            </div>
          </div>
        </div>
      </Page>
    </React.Fragment>
  );
}

export default Inventory;
