/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import Page from "../components/Page";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../components/Loader";
import ModalComponent from "../components/modal";
import Inovice from "../components/Invoice";
import Search from "../components/search";
import { MainContext } from "../Context/mainContext";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

export default function Pos() {
  const { setPrevUrl, setUser } = useContext(MainContext);
  setPrevUrl("/pos");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState();
  const [cart, setCart] = useState([]);
  const [cartPrice, setCartPrice] = useState(0);
  const [cartWithoutDupes, setCartWithoutDupes] = useState({});
  const [customerData, setCustomerData] = useState({});
  const [items, setItems] = useState({});
  const [byDefault, setByDefault] = useState(true);
  const [search, setSearch] = useState();
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [stockQuantity, setStocks] = useState([]);
  const { setIsLoggedIn } = useContext(MainContext);
  const [category, setCategory] = useState("");
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
      countMap[item.barCode] = (countMap[item.barCode] || 0) + 1;
      return countMap;
    }, {});
    setCartWithoutDupes({ itemCountMap });
    setItems({ itemsList });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get("/pos").then((response) => {
          if (response.data.statusCode === 401) {
            setIsLoggedIn(false);
          }
          if (response.data.statusCode === 4001) {
            setIsLoggedIn(false);
            setUser({});
            Navigate("/signin?msg=Please Login First" + response.data.message);
          }
          setProducts(response.data);
        });
      } catch (error) {
        toast.error(error.response ? error.response.data : error.message);
        setError(error.response ? error.response.data : error.message);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    var stocks = [];
    products.map((i) => {
      stocks.push(i.stockQuantity);
    });
    setStocks(stocks);
  }, [products]);

  const handleSearch = async (search) => {};
  const resetSearch = () => {
    setCategory("");
    setByDefault(true);
  };
  useEffect(() => {
    if (search != null) {
      setByDefault(false);
      setSearch(search);
      let query = products.filter((item) => {
        return (
          item.productName.startsWith(search) || item.barCode.startsWith(search)
        );
      });
      setSearchedProducts(query);
    } else {
      setByDefault(true);
    }
  }, [search]);
  useEffect(() => {
    if (category) {
      let query = products.filter((item) => {
        return item.category === category;
      });
      setByDefault(false);
      setSearchedProducts(query);
    }
    if (category === "non") {
      let query = products.filter((item) => {
        return item.category === undefined;
      });
      setByDefault(false);
      setSearchedProducts(query);
    }
  }, [category]);
  return (
    <Page>
      <div>
        <div className="row">
          <div className="col col-md-8">
            <div className="row">
              <div className="col">
                <h3>Products</h3>
              </div>
              <div className="col">
                <Search
                  value={""}
                  search={992}
                  setSearch={(e) => {
                    setSearch(e);
                  }}
                  reset={resetSearch}
                />
              </div>
            </div>
          </div>
          <div className="col col-md-4">
            <h3>Cart</h3>
          </div>
        </div>
        <hr />
        <div className="container-fluid">
          <div className="row ">
            <div className="col col-md-8">
              <div className="p-3">
                <Stack direction="row" spacing={1}>
                  {Array.from(
                    new Set(products.map((product) => product.category))
                  ).map((categoryi) => (
                    <Chip
                      key={categoryi}
                      className="m-1 "
                      style={{ cursor: "pointer" }}
                      label={categoryi ? categoryi : "Category not mentioned"}
                      onClick={() => {
                        setCategory(categoryi ? categoryi : "non");
                      }}
                      variant={categoryi === category ? " " : "outlined"}
                    />
                  ))}
                  <Chip
                    style={{ cursor: "pointer" }}
                    label={"All"}
                    onClick={() => {
                      setCategory(category);
                      setByDefault(true);
                    }}
                    variant="outlined"
                  />
                </Stack>
              </div>
              {products.length > 1 ? null : error ? (
                error
              ) : byDefault === true ? (
                <Loader />
              ) : (
                <></>
              )}
              {byDefault === true ? (
                <div className="row">
                  {products.length > 0 ? (
                    products.map((item, i) => {
                      return (
                        <div key={item._id} className="col-md-3">
                          <div className="card">
                            <div className="card-body">
                              <h5 className="card-title">{item.productName}</h5>
                              <br />
                              <p
                                className={`badge  ${
                                  item.stockQuantity > 10
                                    ? "badge-success"
                                    : item.stockQuantity === 0
                                    ? "badge-danger"
                                    : "badge-warning"
                                }`}
                                style={{ textAlign: "end" }}
                              >
                                {stockQuantity[i]}
                              </p>
                              <div className="row">
                                <button
                                  disabled={stockQuantity[i] < 1 ? true : false}
                                  onClick={() => {
                                    setCart([...cart, item]);
                                    stockQuantity[i] = stockQuantity[i] - 1;
                                    toast.success("Item added to cart");
                                  }}
                                  className="w-100 btn btn-warning"
                                >
                                  {stockQuantity[i] < 1
                                    ? "Out of stock"
                                    : "Add to Cart"}{" "}
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
              ) : (
                <div className="row">
                  {searchedProducts.length > 0 ? (
                    searchedProducts.map((item, i) => {
                      return (
                        <div key={item._id} className="col-md-3">
                          <div className="card">
                            <div className="card-body">
                              <h5 className="card-title">{item.productName}</h5>
                              <br />
                              <p
                                className={`badge  ${
                                  item.stockQuantity > 10
                                    ? "badge-success"
                                    : item.stockQuantity === 0
                                    ? "badge-danger"
                                    : "badge-warning"
                                }`}
                                style={{ textAlign: "end" }}
                              >
                                {item.unitPrice.toLocaleString("en-PK", {
                                  style: "currency",
                                  currency: "PKR",
                                })}
                              </p>
                              <div className="row">
                                <button
                                  disabled={
                                    item.stockQuantity < 1 ? true : false
                                  }
                                  onClick={() => {
                                    setCart([...cart, item]);
                                    stockQuantity[i] = stockQuantity[i] - 1;
                                    toast.success("Item added to cart");
                                  }}
                                  className="w-100 btn btn-warning"
                                >
                                  {item.stockQuantity < 1
                                    ? "Out of stock"
                                    : "Add to Cart"}{" "}
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
              )}
            </div>
            <div className="col p-0" style={{ border: "none" }} id="sidePanel">
              <div className="card ">
                {/* /.card-header */}
                <div className="card-body p-0">
                  <table
                    style={{
                      margin: "0px",
                      overflowY: "scroll",
                      maxHeight: "60vh",
                      minHeight: "60vh",
                    }}
                    className="table p-0 table-striped"
                  >
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Items</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody style={{ border: "none" }}>
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
                                {item.productName.substring(0, 10)}
                                {"..."}
                              </td>
                              <td>
                                {item.unitPrice.toLocaleString("en-PK", {
                                  style: "currency",
                                  currency: "PKR",
                                })}
                              </td>
                              <td>{cartWithoutDupes.itemCountMap[item._id]}</td>
                              <td>
                                <span
                                  role="button"
                                  onClick={() => {
                                    setCart(
                                      cart.filter((pickedItem) => {
                                        return pickedItem._id != item._id;
                                      })
                                    );
                                  }}
                                  className="badge p-2 badge-danger"
                                >
                                  Drop
                                </span>
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
                    <span style={{ textAlign: "end" }}>
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
