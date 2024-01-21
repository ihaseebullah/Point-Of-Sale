import React, { useEffect, useRef, useState } from "react";
import Page from "../components/Page";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";

export default function AddProduct() {
  // Rendering Table
  const [products, setProducts] = useState({});
  const [refresh, setRefresh] = useState(true);
  const [error, setError] = useState(null);
  function relod() {
    setRefresh(!refresh);
    setProducts({});
    setError(null);
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/add/product");
        setProducts(response.data);
      } catch (error) {
        setError(error.response ? error.response.data : error.message);
      }
    };

    fetchData();
  }, [refresh]);
  //Submitting new product
  const [productName, setProductName] = useState(null);
  const [barCode, setBarCode] = useState(null);
  const [unitPrice, setUnitPrice] = useState(null);
  const [purchasedAmount, setPurchasedAmount] = useState(null);
  const [purchaseDate, selectPurchaseDate] = useState(null);
  const [stock, setStock] = useState(null);
  const [batchNo, setBatchNo] = useState(null);
  const [dealerName, setDealerName] = useState(null);
  const [dealerPhone, setDealerPhone] = useState(null);
  const [category, setCategory] = useState(null);
  const [description, setDescription] = useState(null);
  const [formData, setFormData] = useState({});
  const [foundProduct, setFoundProduct] = useState({});
  const [newProduct, setNewProduct] = useState(true);
  useEffect(()=>{
    
      setProductName(foundProduct.productName);
      setBarCode(foundProduct.barCode);
      setUnitPrice(foundProduct.unitPrice);
      setPurchasedAmount(foundProduct.purchasedAmount);
      selectPurchaseDate(new Date().toLocaleDateString());
      setBatchNo(foundProduct.batchNo + 1);
      setDealerName(foundProduct.dealerName);
      setDealerPhone(foundProduct.dealerPhone);
      setCategory(foundProduct.category);
      setDescription(foundProduct.description);
      setFormData({
        productName,
        barCode,
        unitPrice,
        purchasedAmount,
        purchaseDate,
        stock,
        batchNo,
        dealerName,
        dealerPhone,
        category,
        description,
      });
   
  },[foundProduct])
  useEffect(() => {
    axios.get(`/add/postAdditionSearchQuery/${barCode}`).then((res) => {
      if (Object.keys(res.data).includes("product")) {
        setFoundProduct(res.data.product);
        setNewProduct(false);
      } else {
        setNewProduct(true);
        setFormData({});
      }
    });
  }, [barCode]);
  const checkBox = useRef();
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
  };
  async function submitForm(ev) {
    ev.preventDefault();
    try {
      await axios
        .post(
          "/add/product",
          {
            productName: productName,
            barCode: barCode,
            unitPrice: unitPrice,
            purchaseDate: purchaseDate,
            purchasedAmount: unitPrice * stock,
            stock: stock,
            batchNo: batchNo,
            dealerName: dealerName,
            dealerPhone: dealerPhone,
            category: category,
            description: description,
          },
          { headers }
        )
        .then((response) => {
          console.log(response);
          if (response.data.errorCode) {
            toast.error(response.data.message);
          } else {
            toast.success(response.data.message);
          }
        });
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <React.Fragment>
      <Toaster />
      <Page>
        <div className="card card-primary">
          <div className="card-header">
            <h3 className="card-title">Add Product</h3>
          </div>
          {/* /.card-header */}
          {/* form start */}
          <form onSubmit={submitForm}>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="productName">Product Name</label>
                    <input
                      onChange={(event) => {
                        setProductName(event.target.value);
                        setFormData({ ...formData, productName });
                      }}
                      type="text"
                      className="form-control"
                      id="productName"
                      value={productName}
                      // name="productName"
                      placeholder="Enter the name of the product"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="barcode">Bar Code</label>
                    <input
                      onChange={(event) => {
                        setBarCode(event.target.value);
                        setFormData({ ...formData, barCode });
                      }}
                      type="text"
                      className="form-control"
                      id="barcode"
                      // name="barCode"
                      placeholder="Enter barcode if available"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="unitPrice">Unit Price</label>
                    <input
                      onChange={(event) => {
                        setUnitPrice(event.target.value);
                        setFormData({ ...formData, unitPrice });
                      }}
                      type="number"
                      step="0.01"
                      className="form-control"
                      id="unitPrice"
                      value={unitPrice}
                      // name="unitPrice"
                      placeholder="Enter the unit price per item"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="amountPurchased">
                      Amount Purchased (*Stock)
                    </label>
                    <input
                      onChange={(event) => {
                        setStock(event.target.value);
                        setFormData({ ...formData, stock });
                      }}
                      type="number"
                      className="form-control"
                      id="amountPurchased"
                      // name="stockQuantity"
                      placeholder={
                        newProduct
                          ? "Enter the number of items purchased"
                          : "Reload Stock Number"
                      }
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="purchasedAmount">Purchased Amount</label>
                    <input
                      onChange={(event) => {
                        setPurchasedAmount(event.target.value);
                        setFormData({ ...formData, purchasedAmount });
                      }}
                      type="number"
                      className="form-control"
                      value={unitPrice * stock}
                      id="purchasedAmount"
                      // name="purchasedAmount"
                      placeholder="Enter the total amount spent"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="purchaseDate">Purchased Date</label>
                    <input
                      onChange={(event) => {
                        selectPurchaseDate(event.target.value);
                        setFormData({ ...formData, purchaseDate });
                      }}
                      value={purchaseDate}
                      type="text"
                      className="form-control"
                      id="purchaseDate"
                      // name="purchaseDate"
                      placeholder="Select the date of purchase"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="batchNo">Batch No:</label>
                    <input
                      onChange={(event) => {
                        setBatchNo(event.target.value);
                        setFormData({ ...formData, batchNo });
                      }}
                      type="text"
                      className="form-control"
                      value={batchNo}
                      id="batchNo"
                      // name="batchNo"
                      placeholder="Enter the batch number (if applicable)"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="dealerName">Dealer Name</label>
                    <input
                      onChange={(event) => {
                        setDealerName(event.target.value);
                        setFormData({ ...formData, dealerName });
                      }}
                      type="text"
                      className="form-control"
                      value={dealerName}
                      id="dealerName"
                      // name="dealerName"
                      placeholder={
                        newProduct
                          ? `Enter the name of the dealer name`
                          : `Old dealer name was ${foundProduct.dealerName}`
                      }
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="dealerPhone">Dealer Phone</label>
                    <input
                      onChange={(event) => {
                        setDealerPhone(event.target.value);
                        setFormData({ ...formData, dealerPhone });
                      }}
                      type="text"
                      className="form-control"
                      value={dealerPhone}
                      id="dealerPhone"
                      // name="dealerPhone"
                      placeholder={
                        newProduct
                          ? `Enter the phone number of the dealer`
                          : `Old dealer phone number was ${foundProduct.dealerPhone}`
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                      onChange={(event) => {
                        setCategory(event.target.value);
                        setFormData({ ...formData, category });
                      }}
                      value={category}
                      id="category"
                      // name="category"
                      className="form-control select2"
                      style={{ width: "100%" }}
                    >
                      <option value="Analgesics">Analgesics</option>
                      <option value="Antibiotics">Antibiotics</option>
                      <option value="Antidepressants">Antidepressants</option>
                      <option value="Antidiabetics">Antidiabetics</option>
                      <option value="Antihypertensives">
                        Antihypertensives
                      </option>
                      <option value="Antihistamines">Antihistamines</option>
                      <option value="Anti-inflammatory">
                        Anti-inflammatory
                      </option>
                      <option value="Antipyretics">Antipyretics</option>
                      <option value="Cardiovascular">Cardiovascular</option>
                      <option value="Dermatological">Dermatological</option>
                      <option value="Gastrointestinal">Gastrointestinal</option>
                      <option value="Hormones">Hormones</option>
                      <option value="Immunizations">Immunizations</option>
                      <option value="Respiratory">Respiratory</option>
                      <option value="Vaccines">Vaccines</option>
                      <option value="Vitamins_and_Supplements">
                        Vitamins and Supplements
                      </option>
                      <option value="Diagnostic_Kits">Diagnostic Kits</option>
                      <option value="Medical_Devices">Medical Devices</option>
                      <option value="Ophthalmic">Ophthalmic</option>
                      <option value="Veterinary_Pharmaceuticals">
                        Veterinary Pharmaceuticals
                      </option>
                    </select>
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="form-group">
                    <label htmlFor="dealerName">Description</label>
                    <input
                      onChange={(event) => {
                        setDescription(event.target.value);
                        setFormData({ ...formData, description });
                      }}
                      type="text"
                      value={
                        description
                      }
                      className="form-control"
                      id="description"
                      // name="description"
                      placeholder="Enter a short description"
                    />
                  </div>
                </div>
              </div>
              <div className="form-check">
                <input
                  ref={checkBox}
                  type="checkbox"
                  className="form-check-input"
                  id="exampleCheck1"
                />
                <label className="form-check-label" htmlFor="exampleCheck1">
                  I have Double checked the data and I am sure it is correct
                </label>
              </div>
            </div>
            {/* /.card-body */}
            <div className="card-footer">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="card card-primary">
              <div className="card-header">
                <div className="row">
                  <div className="col">
                    <h3 className="card-title">Purchased Products</h3>
                  </div>
                  <div className="col" style={{ textAlign: "end" }}>
                    <span
                      className="badge badge-warning"
                      style={{ cursor: "pointer" }}
                      onClick={relod}
                    >
                      {" "}
                      Relod
                    </span>
                  </div>
                </div>
              </div>

              <div className="card-body">
                {products.length > 0 ? (
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Barcode</th>
                        <th>Product Name</th>
                        <th>Batch No</th>
                        <th>Stock Quantity</th>
                        <th>Category</th>
                        <th>Unit Price</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.length > 0
                        ? products.map((product, index) => {
                            return (
                              <tr key={product._id}>
                                <td key={Math.random() * (index + 1)}>
                                  {product.createdAt}
                                </td>
                                <td key={Math.random() * (index + 1)}>
                                  {product.barCode}
                                </td>
                                <td key={Math.random() * (index + 1)}>
                                  {product.productName}
                                </td>
                                <td key={Math.random() * (index + 1)}>
                                  {product.batchNo}
                                </td>
                                <td key={Math.random() * (index + 1)}>
                                  {product.stockQuantity}
                                </td>
                                <td key={Math.random() * (index + 1)}>
                                  {product.category}
                                </td>
                                <td key={Math.random() * (index + 1)}>
                                  {product.unitPrice}
                                </td>
                                <td key={Math.random() * (index + 1)}>
                                  {product.description}
                                </td>
                              </tr>
                            );
                          })
                        : null}
                    </tbody>
                  </table>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "50vh",
                    }}
                  >
                    {error ? (
                      error
                    ) : (
                      <Spinner animation="border" role="status" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Page>
    </React.Fragment>
  );
}
