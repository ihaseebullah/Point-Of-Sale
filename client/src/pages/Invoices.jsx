import axios from "axios";
import Page from "../components/Page";
import React, { useEffect } from "react";
function Invoices() {
  useEffect(()=>{
    axios.get('stats').then(stats=>console.log(stats))
  })
  return (
    <React.Fragment>
      <Page>
        <h4>Invoices Page </h4>
      </Page>
    </React.Fragment>
  );
}

export default Invoices;