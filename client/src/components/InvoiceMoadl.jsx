import * as React from "react";
import Button from "@mui/joy/Button";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Switch from "@mui/joy/Switch";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalClose from "@mui/joy/ModalClose";
import DialogTitle from "@mui/joy/DialogTitle";
import Stack from "@mui/joy/Stack";
import axios from "axios";
import Loader from "./Loader";

export default function InvoiceMoadl(props) {
  const [layout, setLayout] = React.useState(undefined);
  const [scroll, setScroll] = React.useState(false);
  const [invoiceData, setInvoiceData] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const fetchData = async () => {
      await axios.get("/pos/dasboard/invoice/" + props.id).then((res) => {
        setInvoiceData(res.data.data);
        setLoading(false);
      });
    };
    fetchData();
  }, [layout]);
  const triggered = () => {
    setLayout("fullscreen");
  };
  return (
    <React.Fragment>
      <Stack direction="row" spacing={1}>
        <Button variant="outlined" color="neutral" onClick={triggered}>
          Show Invoice
        </Button>
      </Stack>
      <Modal
        open={!!layout}
        onClose={() => {
          setLayout(undefined);
        }}
      >
        <ModalDialog layout={layout}>
          <ModalClose />
          <DialogTitle>Generated Invoices</DialogTitle>
          <List
            sx={{
              overflow: scroll ? "scroll" : "initial",
              mx: "calc(-1 * var(--ModalDialog-padding))",
              px: "var(--ModalDialog-padding)",
            }}
          >
            {loading ? (
              <Loader />
            ) : invoiceData ? (
              <div className="invoice p-3 mb-3">
                {/* title row */}
                <div className="row">
                  <div className="col-12">
                    <h2 className="page-header">
                      {invoiceData.returned === true ? (
                        <>
                          <span className="badge badge-danger">Returned</span>{" "}
                          <br />
                          <br />
                        </>
                      ) : (
                        <>
                          <span className="badge badge-success">Sold</span>{" "}
                          <br />
                          <br />
                        </>
                      )}
                      <i className="fas fa-globe" /> Pharma Store Inc.
                      <small className="float-right">
                        Date:{" "}
                        {new Date(invoiceData.createdAt).toLocaleDateString(
                          "en-US",
                          { dateStyle: "full" }
                        )}
                      </small>
                    </h2>
                  </div>
                  {/* /.col */}
                </div>
                {/* info row */}
                <div className="row invoice-info">
                  <div className="col-sm-4 invoice-col">
                    From
                    <address>
                      <strong>Pharma Store, Inc.</strong>
                      <br />
                      795 Folsom Ave, Suite 600
                      <br />
                      San Francisco, CA 94107
                      <br />
                      Phone: (804) 123-5432
                      <br />
                      Email: info@almasaeedstudio.com
                    </address>
                  </div>
                  {/* /.col */}
                  <div className="col-sm-3 invoice-col">
                    To
                    <address>
                      <strong>{invoiceData.customerName}</strong>
                      <br />
                      {invoiceData.address}
                      <br />
                      Phone: {invoiceData.customerPhone}
                      <br />
                      Email: {invoiceData.customerEmail}
                    </address>
                  </div>
                  {/* /.col */}
                  <div className="col-sm-4 invoice-col">
                    <b>Invoice #{invoiceData._id}</b>
                    <br />
                    <br />
                    <b>Order ID:</b> {invoiceData.orderID}
                    <br />
                    <b>Payment Due:</b> {invoiceData.paymentDueDate}
                    <br />
                    <b>Account:</b> {invoiceData.customerAccount}
                  </div>
                  {/* /.col */}
                </div>
                {/* /.row */}
                {/* Table row */}
                <div className="row">
                  <div className="col-12 table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Qty</th>
                          <th>Barcode</th>
                          <th>Product Name</th>
                          <th>Unit Price</th>
                          <th>Discount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!loading ? (
                          invoiceData.items === undefined ? null : (
                            Object.keys(invoiceData.items).map((item, i) => {
                              const selectedProduct = props.products.filter(
                                (product) => {
                                  return product.barCode === item;
                                }
                              );

                              return (
                                <tr
                                  key={(((i + 1) * Math.random()) / 200) * 231}
                                >
                                  <td>{invoiceData.items[item]}</td>
                                  <td>{item}</td>
                                  <td>{selectedProduct[0].productName}</td>
                                  <td>
                                    {selectedProduct[0].unitPrice.toLocaleString(
                                      "en-PK",
                                      { style: "currency", currency: "PKR" }
                                    )}
                                  </td>
                                  <td>
                                    {invoiceData.discountOffered}%{" "}
                                    {`(${(
                                      (invoiceData.discountOffered / 100) *
                                      selectedProduct[0].unitPrice
                                    ).toLocaleString("en-PK", {
                                      style: "currency",
                                      currency: "PKR",
                                    })})`}
                                  </td>
                                </tr>
                              );
                            })
                          )
                        ) : (
                          <Loader />
                        )}
                      </tbody>
                    </table>
                  </div>
                  {/* /.col */}
                </div>
                {/* /.row */}
                <div className="row">
                  {/* accepted payments column */}
                  <div className="col-6">
                    <p className="lead">Payment Methods:</p>
                    <img src="/src/dist/img/credit/visa.png" alt="Visa" />
                    <img
                      src="/src/dist/img/credit/mastercard.png"
                      alt="Mastercard"
                    />
                    <img
                      src="/src/dist/img/credit/american-express.png"
                      alt="American Express"
                    />
                    <img src="/src/dist/img/credit/paypal2.png" alt="Paypal" />
                    <p
                      className="text-muted well well-sm shadow-none"
                      style={{ marginTop: 10 }}
                    >
                      {invoiceData.paymentMethod}
                    </p>
                  </div>
                  {/* /.col */}
                  <div className="col-6">
                    <p className="lead">
                      Amount Due {invoiceData.paymentDueDate}
                    </p>
                    <div className="table-responsive">
                      <table className="table">
                        <tbody>
                          <tr>
                            <th style={{ width: "50%" }}>Subtotal:</th>
                            <td>
                              {invoiceData.totallWithoutDiscount.toLocaleString(
                                "en-PK",
                                { currency: "PKR", style: "currency" }
                              )}
                            </td>
                          </tr>
                          <tr>
                            <th>Discount ({invoiceData.discountOffered}%)</th>
                            <td>
                              -
                              {invoiceData.discountAmount.toLocaleString(
                                "en-PK",
                                { currency: "PKR", style: "currency" }
                              )}
                            </td>
                          </tr>

                          <tr>
                            <th>Total:</th>
                            <td>
                              {invoiceData.totallWithDiscount.toLocaleString(
                                "en-PK",
                                { currency: "PKR", style: "currency" }
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {/* /.col */}
                </div>
                {/* /.row */}
                {/* this row will not appear when printing */}
                <div className="row no-print">
                  <div className="col-12">
                    <a
                      href="invoice-print.html"
                      rel="noopener"
                      target="_blank"
                      className="btn btn-default"
                    >
                      <i className="fas fa-print" /> Print
                    </a>
                    <button
                      type="button"
                      className="btn btn-success float-right"
                    >
                      <i className="far fa-credit-card" /> Submit Payment
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary float-right"
                      style={{ marginRight: 5 }}
                    >
                      <i className="fas fa-download" /> Generate PDF
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Loader />
            )}
          </List>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}
