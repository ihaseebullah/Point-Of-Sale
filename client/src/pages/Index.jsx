import Page from "../components/Page";
import React, { useContext, useEffect, useState } from "react";
import MonthlySalesChart from "../components/chart";
import axios from "axios";
import Boxes from "../components/Boxes";
import ChatBox from "../components/ChatBox";
import Chart2 from "../components/Chart2";
import TodoList from "../components/TodoList";
import Table from "../components/Table";
import toast from "react-hot-toast";
import InvoiceVisualizer from "../components/InvoiceVisualizer";
import CustomerLocationChart from "../components/CustomerLocationChart";
import { MainContext } from "../Context/mainContext";
import SignIn from "./SignIn";
import { useParams } from "react-router-dom";

const Index = () => {
  const { setPrevUrl } = React.useContext(MainContext);
  setPrevUrl("/");
  const queryParams = new URLSearchParams(location.search);
  const msg = queryParams.get("msg");

  return (
    <React.Fragment>
      <Page>
        <Boxes />
        <div className="row  my-2">
          <div
            style={{ borderRadius: "10px" }}
            className="col pt-2 col-lg-8 bg-white "
          >
            <MonthlySalesChart />
          </div>
          <div className="col col-lg-4 pt-2 bg-white">
            <InvoiceVisualizer />
          </div>
        </div>
        <br />
        <div
          style={{ borderRadius: "10px" }}
          className="row bg-white py-1  my-2"
        >
          <br />
          <div className="col col-lg-5 ">
            <TodoList />
          </div>
          <div className="col col-lg-7">
            <Chart2 />
          </div>
        </div>
        <br />
        <div className="row my-2 bg-white py-2">
          <div className="col col-lg-8">
            <CustomerLocationChart />
          </div>
          <div className="col col-lg-4">
            <div className="card">
              <div className="card-header">Chats</div>
              <div className="card-body">
                <ChatBox />
                <ChatBox />
                <ChatBox />
                <ChatBox />
                <ChatBox />
                <ChatBox />
                <ChatBox />
              </div>
            </div>
          </div>
        </div>
      </Page>
    </React.Fragment>
  );
};

export default Index;
