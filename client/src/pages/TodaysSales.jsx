import axios from "axios";
import Page from "../components/Page";
import React, { useEffect, useState } from "react";
import Chart2 from "../components/Chart2";
function TodaysSales() {
  const [sales, setSales] = useState([]);
  useEffect(() => {
    axios.get("/pos/sales/today").then((res) => setSales(res.data.data));
  }, []);
  return (
    <React.Fragment>
      <Page>
        <h4>Sales Page</h4>
        <Chart2 />
        <div className="row">
          <div className="col-12">
            <div className="card" style={{ borderRadius: "10px" }}>
              <div className="card-header">
                <h3 className="card-title">Today's Sale</h3>
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
              <div className="card-body table-responsive p-0">
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
                    {sales.map((saleItem, index) => {
                      let discount = saleItem.discountGiven;
                      return (
                        <tr
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
                            })}&nbsp;
                            ({saleItem.discountGiven}%)
                          </td>
                          <td>{saleItem.buyerName}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
