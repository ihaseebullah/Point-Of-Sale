import axios from "axios";
import Page from "../components/Page";
import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { Spinner } from "react-bootstrap";
import Loader from "../components/Loader";

function ClientsList({ clients }) {
  const [loading, setLoading] = useState(true);
  return (
    <Table striped bordered hover>
      {clients.length >= 0 ? (
        <>
          <thead>
            <tr>
              <th>Acc. Number</th>
              <th>First Name</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Amount Due</th>
              <th>Assisted By</th>
              <th>Due Date</th>
              <th>Invoices</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client, index) => {
              return (
                <tr key={client._id}>
                  <td>{client.accountNumber}</td>
                  <td>{client.customerName}</td>
                  <td>{client.address}</td>
                  <td>{client.customerPhone}</td>
                  <td>{client.customerEmail}</td>
                  <td>{client.account}</td>
                  <td>{client.assistedBy}</td>
                  <td>{client.dueDate}</td>

                  <td>
                    <button
                      className="btn btn-primary rounded"
                      onClick={() => {
                        document.getElementById(client._id).style.display =
                          document.getElementById(client._id).style.display ===
                          "block"
                            ? "none"
                            : "block";
                      }}
                    >
                      Toggle Invoices
                    </button>
                    <ul style={{ display: "none" }} id={client._id}>
                      {client.invoices.map((invoice) => {
                        return <li key={invoice}>{invoice}</li>;
                      })}
                    </ul>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </>
      ) : (
        <Spinner />
      )}
    </Table>
  );
}

function Clients() {
  const [clients, setClients] = useState([]);
  useEffect(() => {
    axios.get("/clients").then((response) => {
      if (response.data.statusCode === 200) {
        setClients(response.data.clients);
      }
    });
  }, []);
  return (
    <React.Fragment>
      <Page>
        <div className="card">
          <div className="card-header">
            <h5>Clients</h5>
          </div>
          <div className="card-body" style={{ padding: "0rem" }}>
            {clients.length > 0 ? (
              <ClientsList clients={clients} />
            ) : (
              <Loader />
            )}
          </div>
          <div className="card-footer">
            <p>
              The list is updated till{" "}
              {new Date().toLocaleDateString("en-US", { dateStyle: "full" })}
            </p>
          </div>
        </div>
      </Page>
    </React.Fragment>
  );
}

export default Clients;
