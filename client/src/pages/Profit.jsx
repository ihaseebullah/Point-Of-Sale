import React, { useEffect, useState } from "react";
import Page from "../components/Page";
import Table from "react-bootstrap/Table";
import ProfitVisualizer from "../components/profitVisualizer";
import axios from "axios";

export default function Profit() {
  const [profit, setProfit] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/profit");
        setProfit(response.data.profit);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);
  return (
    <React.Fragment>
      <Page>
        <div className="card">
          <div className="card-header">Profit Visualizer</div>
          <div className="card-body">
            <ProfitVisualizer />
          </div>
        </div>
        <div className="card">
          <div className="card-header">Detailed Overview</div>
          <div className="card-body p-0">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Barcode</th>
                  <th>Product Name</th>
                  <th>Profit made</th>
                  <th>Item Sold</th>
                  <th>Updated At</th>
                </tr>
              </thead>
              <tbody>
                {profit.map((item, i) => {
                  return (
                    <tr key={item._id}>
                      <td>{i + 1}</td>
                      <td>{item.barCode}</td>
                      <td>{item.productName}</td>
                      <td>
                        {parseInt(item.profit).toLocaleString("en-PK", {
                          style: "currency",
                          currency: "PKR",
                        })}
                      </td>
                      <td>{item.itemSold}</td>
                      <td>
                        {new Date(item.updatedAt).toLocaleDateString("en-US", {
                          dateStyle: "full",
                        })}
                        ,
                        {new Date(item.updatedAt).toLocaleTimeString("en-US", {
                          timeStyle: "medium",
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
          <div className="card-footer">
            <b>Note :</b> No returns are counted in calculating the profit.Will
            soon be avialabale in the next version update
          </div>
        </div>
      </Page>
    </React.Fragment>
  );
}
