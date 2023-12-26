import { useEffect, useState } from "react";
import Page from "../components/Page";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../components/Loader";
import ModalComponent from "../components/modal";
import Inovice from "../components/Invoice";

export default function Pos() {
  const [products, setProducts] = useState({});
  const [error, setError] = useState();
  const [cart, setCart] = useState([]);
  const [cartPrice, setCartPrice] = useState(0);
  const [cartWithoutDupes, setCartWithoutDupes] = useState({});
  const [customerData, setCustomerData] = useState({});
  const [items, setItems] = useState({});
  let totallPrice = 0;
  let renderedCart = [];
  const handleData = (data) => {
    setCustomerData(data);
  };
  const showInvoice = () => {
    if (!customerData != {}) toast.error("Create invoice first");
  };

  useEffect(() => {
    setCartPrice(totallPrice);
    const itemCountMap = cart.reduce((countMap, item) => {
      countMap[item._id] = (countMap[item._id] || 0) + 1;
      return countMap;
    }, {});
    const itemsList = cart.reduce((countMap, item) => {
      countMap[item.productName] = (countMap[item.productName] || 0) + 1;
      return countMap;
    }, {});
    setCartWithoutDupes({ itemCountMap });
    setItems({ itemsList });
    console.log(cartWithoutDupes);
  }, [cart]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/pos");
        setProducts(response.data);
      } catch (error) {
        toast.error(error.response ? error.response.data : error.message);
        setError(error.response ? error.response.data : error.message);
      }
    };
    fetchData();
  }, []);

  return (
    <Page>
      <Toaster />
      <div>
        <div className="row">
          <div className="col col-md-8">
            <h3>Products</h3>
          </div>
          <div className="col col-md-4">
            <h3>Cart</h3>
          </div>
        </div>
        <hr />
        <div className="container-fluid">
          <div className="row p-1">
            <div className="col col-md-8">
              {products.length > 1 ? null : error ? error : <Loader />}
              <div className="row">
                {products.length > 0 ? (
                  products.map((item) => {
                    return (
                      <div key={item._id} className="col-md-3">
                        <div className="card">
                          {/* <img src="product_image.jpg" class="card-img-top" alt="Product Image"> */}
                          <div className="card-body">
                            <h5 className="card-title">{item.productName}</h5>
                            <br />
                            <p
                              className="badge badge-danger"
                              style={{ textAlign: "end" }}
                            >
                              {item.unitPrice} PKR
                            </p>
                            <div className="row">
                              <button
                                onClick={() => {
                                  setCart([...cart, item]);
                                  toast.success("Item added to cart");
                                }}
                                className="w-100 btn btn-warning"
                              >
                                Add to Cart{" "}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "50vh",
                    }}
                  ></div>
                )}
              </div>
            </div>
            <div className="col  rounded" id="sidePanel">
              <div
                className="card "
                style={{
                  margin: "0px",
                  overflowY: "scroll",
                  maxHeight: "60vh",
                  minHeight: "60vh",
                }}
              >
                {/* /.card-header */}
                <div className="card-body p-0">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Actions</th>
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
                              <td key={Math.random() * i + 1}>
                                {item.productName}{" "}
                              </td>
                              <td>{item.unitPrice} PKR</td>
                              <td>{cartWithoutDupes.itemCountMap[item._id]}</td>
                              <td>
                                <button
                                  onClick={() => {
                                    setCart(
                                      cart.filter((pickedItem) => {
                                        return pickedItem._id != item._id;
                                      })
                                    );
                                  }}
                                  className="badge badge-danger"
                                >
                                  Drop
                                </button>
                              </td>
                            </tr>
                          );
                        }
                      })}
                    </tbody>
                  </table>
                </div>

                {/* /.card-body */}
              </div>
              <div className="card-header bg-white">
                <div className="row">
                  <div className="col-6">
                    <h5>Totall</h5>
                  </div>
                  <div className="col-6" style={{ textAlign: "end" }}>
                    <span
                      style={{ textAlign: "end" }}
                      className="badge badge-warning"
                    >
                      <h6> {cartPrice} PKR</h6>
                    </span>
                  </div>
                </div>
                <hr></hr>
                <div className="row my-2">
                  <div className="col-6">
                    <ModalComponent getData={handleData} />
                  </div>
                  <div className="col-6 " style={{ textAlign: "end" }}>
                    <button
                      onClick={showInvoice}
                      className="btn btn-success btn-sm"
                    >
                      Show Invoice
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {customerData.customerName && (
          <>
            <h2>Invoices</h2>
            <hr />
            <Inovice
              cart={cart}
              cartWithoutDupes={cartWithoutDupes}
              customerData={customerData}
              setData={setCart}
              items={items}
            />
          </>
        )}
      </div>
    </Page>
  );
}
