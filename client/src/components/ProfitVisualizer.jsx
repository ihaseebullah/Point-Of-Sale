import axios from "axios";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import Loader from "./Loader";

export default function ProfitVisualizer() {
  const [profit, setProfit] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartDataSet, setChartData] = useState({});

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
  useEffect(() => {
    const dataSet = {};
    profit
      .sort((a, b) => {
        const profitA = parseInt(a.profit) || 0;
        const profitB = parseInt(b.profit) || 0;
        return profitB - profitA;
      })
      .forEach((item) => {
        dataSet[item.productName] = parseInt(item.profit) || 0;
      });
  
    setChartData(dataSet);
  }, [profit]);
  
  const chartData = {
    series: [
      {
        name: "Profit",
        data: Object.values(chartDataSet),
      },
      // You can add more series for different data points if needed
    ],
    options: {
      chart: {
        type: "bar",
        width: 800,
        height: 500,
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        categories: Object.keys(chartDataSet),
      },
      title: {
        text: "Profit Overview",
        align: "center",
        style: {
          fontSize: "20px",
          fontWeight: "bold",
          color: "#333",
        },
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          endingShape: "rounded",
          columnWidth: "30%",
          distributed: true,
        },
      },
      legend: {
        show: true,
      },
      grid: {
        borderColor: "#eee",
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              height: 300,
            },
          },
        },
      ],
    },
  };

  return (
    <div>
      {loading ? (
        <p><Loader /></p>
      ) : (
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={350}
        />
      )}
    </div>
  );
}
