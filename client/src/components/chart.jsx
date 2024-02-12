import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import Loader from "./Loader";
import axios from "axios";
import toast from "react-hot-toast";
const MonthlySalesChart = () => {
  const [monthlySalesData, setSalesDataSet] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relod, setRelod] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await axios.get("/pos/sales").then(async (res) => {
          var sales = {
            January: 0,
            February: 0,
            March: 0,
            April: 0,
            May: 0,
            June: 0,
            July: 0,
            August: 0,
            September: 0,
            October: 0,
            November: 0,
            December: 0,
          };
          await res.data.data.forEach((i) => {
            const date = new Date(i.date);
            const monthNames = [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ];

            if (!Object.keys(sales).includes(monthNames[date.getMonth()])) {
              sales[monthNames[date.getMonth()]] = parseInt(i.totallWorth);
            } else {
              sales[monthNames[date.getMonth()]] =
                parseInt(sales[monthNames[date.getMonth()]]) +
                parseInt(i.totallWorth);
            }
          });
          setSalesDataSet(sales);
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

  useEffect(() => {}, [monthlySalesData]);
  const chartData = {
    options: {
      plotOptions: {
        bar: {
          horizontal: false,
          endingShape: "rounded",
          columnWidth: "55%",
          distributed: true,
        },
      },
      legend: {
        show: true,
      },
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
      <div
        className="card"
        style={{
          minHeight: "28rem",
          maxHeight: "28rem",
        }}
      >
        <div className="card-header">
          <h3 className="card-title">
            <i className="fa-solid fa-chart-bar mr-2"></i>
            Yearly Sales Report
          </h3>
        </div>
        <div className="card-body">
          {!loading ? (
            error ? (
              <div className="mt-1" style={{ textAlign: "center" }}>
                {error}
                <br />
                <button
                  onClick={() => setRelod(!relod)}
                  className="m-2 btn btn-primary btn-sm rounded-circle"
                >
                  <i className="fa-solid fa-rotate-right"></i>
                </button>
              </div>
            ) : (
              <>
                <Chart
                  options={chartData.options}
                  series={chartData.series}
                  type="bar"
                  height={350}
                />
              </>
            )
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthlySalesChart;
