import axios from "axios";
import Page from "../components/Page";
import React, { useEffect, useState } from "react";
function Inventory() {
  const [inventory, setInventory] = useState([]);
  useEffect(() => {
    axios.get("/pos/inventory").then((res) => setInventory(res.data.data));
  });
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
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ width: 10 }}>#</th>
                      <th>Barcode</th>
                      <th>Product Name</th>
                      <th>Batch No</th>
                      <th>Date</th>
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
                          <td>{i + 1}.</td>
                          <td>{product.barCode}</td>
                          <td>{product.productName}</td>
                          
                          <td>{`00${product.batchNo}`}</td>
                          <td>{new Date(product.createdAt).toLocaleDateString("en-US",{ day: 'numeric', month: 'long', year: 'numeric' })}</td>
                          <td>
                            <div className="progress progress-xs">
                              <div
                                className={`progress-bar ${progressBarClass}`}
                                style={{ width: `${dynamicWidth * 100}%` }}
                              />
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${progressBarClass}`}>{`${(product.purchasedQuantity - product.stockQuantity)} /
                        ${product.purchasedQuantity}`}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
