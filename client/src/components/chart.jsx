import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import Loader from "./Loader";

const MonthlySalesChart = ({ monthlySalesData }) => {
  const [sales, setSales] = useState();

  useEffect(() => {
    setSales(monthlySalesData);
  }, [monthlySalesData]);
  const chartData = {
    options: {
      chart: {
        type: "area",
        height: 350,
        zoom: {
          enabled: true,
        },
      },
      xaxis: {
        categories: Object.keys(monthlySalesData),
      },
      yaxis: {
        title: {
          text: "Sales",
        },
      },
    },
    series: [
      {
        name: "Monthly Sales",
        data: Object.values(monthlySalesData),
      },
    ],
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <i class="fa-solid fa-chart-bar mr-2"></i>
            Hot Selling Products
          </h3>
        </div>
        <div className="card-body">
          {sales != undefined ? (
            <Chart
              options={chartData.options}
              series={chartData.series}
              type="bar"
              height={350}
            />
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthlySalesChart;
