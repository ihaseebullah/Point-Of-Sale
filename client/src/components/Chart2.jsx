import axios from "axios";
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import Loader from "./Loader";

export default function Chart2() {
  const [topSeller, setTopSeller] = useState();
  useEffect(() => {
    axios.get("/pos/topseller").then((res) => {
      let dataSet = {};
      res.data.data.forEach((i) => {
        dataSet[i.productName] = i.amountSold;
      });
      setTopSeller(dataSet);
    });
  }, []);

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
        borderRadius: 4,
        horizontal: true,
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
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <i class="fa-solid fa-chart-bar mr-2"></i>
          Hot Selling Products
        </h3>
      </div>
      <div className="card-body">
        {topSeller != undefined ? (
          <Chart
            type="bar"
            height={350}
            series={options.series}
            chart={options.chart}
            xaxis={options.xaxis.categories}
            options={options}
          />
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
}
