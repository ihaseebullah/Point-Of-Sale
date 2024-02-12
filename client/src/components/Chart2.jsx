import axios from "axios";
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import Loader from "./Loader";
import toast from "react-hot-toast";

export default function Chart2() {
  const [topSeller, setTopSeller] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relod, setRelod] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await axios.get("/pos/topseller").then((res) => {
          let dataSet = {};
          res.data.data.forEach((i) => {
            dataSet[i.productName] = i.amountSold;
          });
          setTopSeller(dataSet);
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

  var options = {
    series: [
      {
        data: topSeller != undefined ? Object.values(topSeller) : [0],
      },
    ],

    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        endingShape: "rounded",
        columnWidth: "30%",
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories:
        topSeller != undefined ? Object.keys(topSeller) : ["Nothing to show"],
    },
  };

  return (
    <div
      className="card"
      style={{
        minHeight: "28rem",
        maxHeight: "28rem",
        overflowY: "scroll",
      }}
    >
      <div className="card-header">
        <h3 className="card-title">
          <i className="fa-solid fa-chart-bar mr-2"></i>
          Hot Selling Products
        </h3>
      </div>
      <div className="card-body">
        {!loading ? (
          error ? (
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
            <Chart
              type="bar"
              height={350}
              series={options.series}
              chart={options.chart}
              xaxis={options.xaxis.categories}
              options={options}
            />
          )
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
}
