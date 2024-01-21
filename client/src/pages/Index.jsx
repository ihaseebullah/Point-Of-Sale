import Page from "../components/Page";
import React, { useEffect, useState } from "react";
import MonthlySalesChart from "../components/chart";
import axios from "axios";
import Boxes from "../components/Boxes";
import ChatBox from "../components/ChatBox";
import Chart2 from "../components/Chart2";
import TodoList from "../components/TodoList";
import Table from "../components/Table";

const Index = () => {
  const [salesDataSet, setSalesDataSet] = useState({});
  useEffect(() => {
    axios.get("/pos/sales").then(async (res) => {
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
    });
  }, []);

  return (
    <React.Fragment>
      <Page>
        <Boxes />
        <div className="row  p-3">
          <div
            style={{ borderRadius: "10px" }}
            className="col pt-2 col-lg-9 bg-white "
          >
            <MonthlySalesChart monthlySalesData={salesDataSet} />
          </div>
          <div className="col col-lg-3">
            <ChatBox />
          </div>
        </div>
        <div style={{ borderRadius: "10px" }} className="row bg-white p-3 ">
          <br />
          <div className="col col-lg-5 ">
            <TodoList />
          </div>
          <div className="col col-lg-7">
            <Chart2 />
          </div>
        </div>
        <hr />
        <br />
        <Table />
      </Page>
    </React.Fragment>
  );
};

export default Index;
