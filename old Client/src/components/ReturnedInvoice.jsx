/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import html2pdf from "html2pdf.js";
import axios from "axios";
import toast from "react-hot-toast";
import { Modal } from "react-bootstrap";
export default function ReturnedInvoice({
  cart,
  cartWithoutDupes,
  customerData,
  items,
}) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [invoiceId, setInvoiceId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [paymentDueDate, setPaymentDueDate] = useState("");
  const [account, setAccount] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [discountedTotall, setDiscountedTotall] = useState("");
  const [sentOnce, setSentOnce] = useState(false);
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
  };
  const printDiv = (divId) => {
    const printContents = document.getElementById(divId).innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  };

  const converToPdf = (divId) => {
    const element = document.getElementById(divId);
    html2pdf(element);
  };
  useEffect(() => {
    setDiscountAmount(Math.floor(totallPrice * (customerData.discount / 100)));
    setDiscountedTotall(
      totallPrice - Math.floor(totallPrice * (customerData.discount / 100))
    );
  }, [cart]);
  useEffect(() => {
    setInvoiceId(uuid());
    setOrderId(uuid());
  }, []);
  let totallPrice = 0;
  let renderedCart = [];

  async function sendPostRequest() {
    try {
      let response = await axios.post(
        "/create/invoice/returned",
        {
          customerName: customerData.customerName,
          customerPhone: customerData.customerPhone,
          customerEmail: customerData.customerEmail,
          discount: customerData.discount,
          address: customerData.address,
          paymentMethod: customerData.paymentMethod,
          totallPrice,
          invoiceId,
          orderId,
          paymentDueDate,
          account,
          items: items.itemsList,
          discountAmount,
          discountedTotall,
        },
        { headers }
      );
      toast.success(response.data.message);
    } catch (err) {
      toast.error("Something went wrong");
    }
  }
  return (
    <section id="inv" className="invoice p-5">
      {/* title row */}
      <div className="row">
        <div className="col-12">
          <h2 className="page-header">
            <span className="badge badge-danger">Return</span> <br /><br />
            <i className="fas fa-globe" /> Pharma Store
            <small className="float-right">
              Date: {new Date().toLocaleDateString()}
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
            <strong>{customerData.customerName}</strong>
            <br />
            {customerData.address}
            <br />
            Phone: {customerData.customerPhone}
            <br />
            Email: {customerData.customerEmail}
          </address>
        </div>
        {/* /.col */}
        <div className="col-sm-3 invoice-col">
          To
          <address>
            <strong>{customerData.customerName}</strong>
            <br />
            {customerData.address}
            <br />
            Phone: {customerData.customerPhone}
            <br />
            Email: {customerData.customerEmail}
          </address>
        </div>
        {/* /.col */}
        <div className="col-sm-5 invoice-col">
          <label>Invoice : </label>
          <input
            style={{ border: "none" }}
            type="text"
            onChange={(e) => {
              setInvoiceId(e.target.value);
            }}
            value={` #${invoiceId}`}
          />
          <br />
          <label>Order ID : </label>
          <input
            style={{ border: "none" }}
            type="text"
            onChange={(e) => {
              setOrderId(e.target.value);
            }}
            value={` #${orderId}`}
          />
          <br />
          <label>Payment Due till : </label>
          <input
            style={{ border: "none" }}
            onChange={(e) => {
              setPaymentDueDate(e.target.value);
            }}
            type="date"
          />
          <br />
          <label>Account : </label>
          <input
            onChange={(e) => {
              setAccount(e.target.value);
            }}
            style={{ border: "none" }}
            type="text"
            placeholder="Specify recepient account"
          />
          <br />
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
                <th>Bar Code</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, i) => {
                totallPrice += item.unitPrice;
                if (
                  Object.keys(cartWithoutDupes.itemCountMap).includes(
                    item._id
                  ) &&
                  !renderedCart.includes(item._id)
                ) {
                  renderedCart.push(item._id);
                  return (
                    <tr key={item._id}>
                      <td>{item.barCode}</td>
                      <td key={Math.random() * i + 1}>{item.productName} </td>
                      <td>{cartWithoutDupes.itemCountMap[item._id]}</td>
                      <td>{item.unitPrice}</td>
                      <td>
                        {item.unitPrice *
                          cartWithoutDupes.itemCountMap[item._id]}{" "}
                        PKR
                      </td>
                    </tr>
                  );
                }
              })}
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
          <img
            className="ml-2"
            src="/src/dist/img/credit/visa.png"
            alt="Visa"
          />
          <img
            className="ml-2"
            src="/src/dist/img/credit/mastercard.png"
            alt="Mastercard"
          />
          <img
            className="ml-2"
            src="/src/dist/img/credit/american-express.png"
            alt="American Express"
          />
          <img
            className="ml-2"
            src="/src/dist/img/credit/paypal2.png"
            alt="Paypal"
          />
          <p
            className="text-muted well well-sm shadow-none"
            style={{ marginTop: 10 }}
          >
            {customerData.paymentMethod}
          </p>
        </div>
        {/* /.col */}
        <div className="col-6">
          <p className="lead">Amount Due {new Date().toLocaleDateString()}</p>
          <div className="table-responsive">
            <table className="table">
              <tbody>
                <tr>
                  <th style={{ width: "50%" }}>Sub Totall:</th>
                  <td>{totallPrice} PKR</td>
                </tr>
                <tr>
                  <th>Discount ({customerData.discount} %)</th>
                  <td>
                    {Math.floor(totallPrice * (customerData.discount / 100))}{" "}
                    PKR
                  </td>
                </tr>

                <tr>
                  <th>Total:</th>
                  <td>
                    {Math.floor(
                      totallPrice - totallPrice * (customerData.discount / 100)
                    )}{" "}
                    PKR
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* /.col */}
      </div>
      {/* /.row */}
      <div className="row no-print">
        <div className="col-12">
          <button
            className="btn btn-warning"
            onClick={() => {
              printDiv("inv");
            }}
          >
            Print
          </button>
          <button
            onClick={handleShow}
            type="button"
            className="btn btn-success float-right"
          >
            <i className="far fa-credit-card mr-1" />
            Sell and save invoice
            <></>
          </button>
          <button
            type="button"
            onClick={() => {
              converToPdf("inv");
            }}
            className="btn btn-primary float-right"
            style={{ marginRight: 5 }}
          >
            <i className="fas fa-download" /> Generate PDF
          </button>
        </div>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Customer Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Enim hic
            mollitia, labore accusantium maiores repellat ratione quod
            perspiciatis doloremque sit ducimus nostrum cupiditate cumque
            commodi, expedita qui. Recusandae, ipsum veritatis?
          </p>
          <div className="row">
            <div className="col">
              <button
                onClick={async () => {
                  await sendPostRequest();

                  handleClose();
                }}
                className="btn btn-warning btn-sm"
              >
                Create Inovice
              </button>
              <button
                onClick={handleClose}
                className="mx-2 btn btn-danger btn-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </section>
  );
}
