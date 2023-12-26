import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-hot-toast";

function ModalComponent({ getData }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [customerName, setCustomerName] = useState(null);
  const [customerPhone, setCustomerPhone] = useState(null);
  const [address, setAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [customerEmail, setCustomerEmail] = useState(null);
  const [discount, setDiscount] = useState(null);
  const saveCustomerData = (e) => {
    e.preventDefault();
    if (
      (customerName,
      customerPhone,
      address,
      paymentMethod,
      customerEmail,
      discount != null)
    ) {
      getData({
        customerName,
        customerPhone,
        address,
        paymentMethod,
        customerEmail,
        discount,
      });
      toast.success("Invoice Created");
    } else {
      toast.error("Please validate the form");
    }
  };

  return (
    <>
      <button onClick={handleShow} className="btn btn-warning btn-sm">
        Create Inovice
      </button>

      <Modal
        show={show}
        size="lg"
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Customer Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className=" ">
            {/* /.card-header */}
            {/* form start */}
            <form onSubmit={saveCustomerData}>
              <div className="">
                <div className="row">
                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="buyerName">Customer Name *</label>
                      <input
                        onChange={(e) => setCustomerName(e.target.value)}
                        type="text"
                        className="form-control"
                        id="buyerName"
                        placeholder="Enter buyer name"
                      />
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="CustomerPhone">Phone *</label>
                      <input
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        type="text"
                        className="form-control"
                        id="CustomerPhone"
                        placeholder="Enter customer phone number"
                      />
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="Address">Address *</label>
                      <input
                        onChange={(e) => setAddress(e.target.value)}
                        type="text"
                        className="form-control"
                        id="Address"
                        placeholder="Customer Address"
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="Payment">Payment Method *</label>
                      <select
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        type="text"
                        className="form-control"
                        id="Payment"
                      >
                        <option value="Credit Card">Credit Card</option>
                        <option value="Cash">Cash</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="Email">Customer Email (Optional)</label>
                      <input
                        type="email"
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="form-control"
                        id="Email"
                        placeholder="Customer Email Address"
                      />
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="Discount">Discount</label>
                      <input
                        onChange={(e) => setDiscount(e.target.value)}
                        type="Number"
                        className="form-control"
                        id="Discount"
                        placeholder="Enter the discount amount for all products"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* /.card-body */}
              <div className="">
                <button
                  onClick={() => {
                    if (
                      (customerName,
                      customerPhone,
                      address,
                      paymentMethod,
                      customerEmail,
                      discount != null)
                    ) {
                      handleClose();
                    }
                  }}
                  type="submit"
                  className="btn btn-success"
                >
                  Create Invoice
                </button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ModalComponent;
