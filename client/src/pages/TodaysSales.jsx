import axios from "axios";
import Page from "../components/Page";
import React, { useContext, useEffect, useState } from "react";
import Chart2 from "../components/Chart2";
import { toast, Toaster } from "react-hot-toast";
import Loader from "../components/Loader";
import { MainContext } from "../Context/mainContext";
function TodaysSales() {
  const { setPrevUrl } = useContext(MainContext);
  setPrevUrl("/sales");
  const [sales, setSales] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relod, setRelod] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get("/pos/sales/today").then((res) => {
          setSales(res.data.data);
          setLoading(false);
        });
      } catch (err) {
        setError(err.response ? err.response.data : err.message);
        toast.error(err.response ? err.response.data : err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [relod]);
  return (
    <React.Fragment>
      <Page>
        <Toaster />
        <h4>Sales Page</h4>
        <Chart2 />
        <div className="row">
          <div className="col-12">
            <div className="card" style={{ borderRadius: "10px" }}>
              <div className="card-header">
                <h3 className="card-title">{"Today's Sale"}</h3>
                <div className="card-tools">
                  <div
                    className="input-group input-group-sm"
                    style={{ width: 150 }}
                  >
                    <input
                      type="text"
                      name="table_search"
                      className="form-control float-right"
                      placeholder="Search"
                    />
                    <div className="input-group-append">
                      <button type="submit" className="btn btn-default">
                        <i className="fas fa-search" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* /.card-header */}
              <div
                className="card-body table-responsive p-0"
                style={{
                  minHeight: "38rem",
                  maxHeight: "38rem",
                  overflowY: "scroll",
                }}
              >
                {loading ? (
                  <Loader />
                ) : !error ? (
                  <table className="table table-hover text-nowrap">
                    <thead>
                      <tr>
                        <th>Barcode</th>
                        <th>Product Name</th>
                        <th>Stock</th>
                        <th>Unit Price</th>
                        <th>Discount Given</th>
                        <th>Buyer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sales.map((saleItem) => {
                        let discount = saleItem.discountGiven;
                        return (
                          <tr
                            key={saleItem._id}
                            className={
                              discount >= 30
                                ? "bg-success"
                                : discount >= 20
                                ? "bg-warning"
                                : discount >= 10
                                ? "bg-info"
                                : "bg-danger"
                            }
                          >
                            <td>{saleItem.itemBarcode}</td>
                            <td>{saleItem.productName}</td>
                            <td>{saleItem.stockPurchased}</td>
                            <td>{saleItem.price}</td>
                            <td>
                              {(
                                (saleItem.discountGiven / 100) *
                                saleItem.price
                              ).toLocaleString("en-PK", {
                                style: "currency",
                                currency: "PKR",
                              })}
                              &nbsp; ({saleItem.discountGiven}%)
                            </td>
                            <td>{saleItem.buyerName}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ textAlign: "center" }}>
                    {error}
                    <br />
                    <button
                      onClick={() => setRelod(!relod)}
                      className="m-2 btn btn-primary btn-sm rounded-circle"
                    >
                      <i className="fa-solid fa-rotate-right"></i>
                    </button>
                  </p>
                )}
              </div>
              {/* /.card-body */}
            </div>
            {/* /.card */}
          </div>
        </div>
      </Page>
    </React.Fragment>
  );
}

export default TodaysSales;
