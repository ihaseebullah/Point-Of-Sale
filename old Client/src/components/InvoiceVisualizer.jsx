/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts";
import Loader from "./Loader";
import toast from "react-hot-toast";

function InvoiceVisualizer() {
  const [stats, setStats] = useState([]);
  const [temp, setTemp] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relod, setRelod] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/stats").then((res) => {
          setTemp(res.data.data);
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
  useEffect(() => {
    let finalTemp = [];
    temp.map((stat, i) => {
      let newObj = {
        label: stat.monthName,
        value: stat.invoiceCounter  ,
        id: i + 1,
      };
      finalTemp.push(newObj);
    });
    setStats(finalTemp);
  }, [temp]);

  return (
    <div className="card" style={{minHeight:"28rem"}}>
      <div className="card-header">
        <h3 className="card-title">Invoice Activity</h3>
      </div>
      <div
        style={{  display: "grid", alignItems: "center" }}
      >
        <div
          className="card-body"
          style={{ display: "grid", justifyContent: "center" }}
        >
          {loading ? (
            <Loader />
          ) : error ? (
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
          ) : (
            <div style={{ display: "grid", justifyContent: "start" ,overflow:"hidden"}}>
              {stats.length > 0 ?<PieChart
                series={[
                  {
                    data: stats,
                    highlightScope: { faded: "global", highlighted: "item" },
                    faded: {
                      innerRadius: 30,
                      additionalRadius: -30,
                      color: "gray",
                    },
                  },
                ]}
                width={470}
                height={300}
              />:<p>No invoices generated yet</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InvoiceVisualizer;
