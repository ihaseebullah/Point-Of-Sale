import axios from "axios";
import { MainContext } from "../Context/mainContext";
import Page from "../components/Page";
import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Loader from "../components/Loader";
import CameraIcon from "../components/CameraIcon";

function Profile() {
  const { user, setUser } = useContext(MainContext);
  const [show, setShow] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [showDiag, setShowDiag] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [showEditor, setShowEditor] = useState(false);
  const closeEditor = () => setShowEditor(false);
  const openEditor = () => setShowEditor(true);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const Navigate = useNavigate();
  const [currentPasword, setCurrentPasword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passphrase, setPassphrase] = useState("");
  const [img, setImg] = useState(null);
  const [imgUrl, setImgUrl] = useState("");
  const [showUploadImage, setShowUploadImage] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const handleHovered = () => {
    setIsHovered(true);
  };
  const handleUnHovered = () => {
    setIsHovered(false);
  };
  const style = {
    opacity: isHovered ? 0.3 : 1,
    // add other styles as needed
  };
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    phone: user.phone,
    dob: user.dob,
    gender: user.gender, // Default value for gender
    address: user.address,
    city: user.city,
  });

  const handleUploadImageModalClose = () => {
    setShowUploadImage(false);
  };
  const handleUploadImageModalShow = () => {
    setShowUploadImage(true);
  };
  const postToDatabase = async () => {
    axios
      .post("/updateProfileImage/", { img: imgUrl }, { headers })
      .then((res) => {
        if (res.data.statusCode === 200) {
          console.log(res);
          toast.success(res.data.message);
          setImg(null);
          setImgUrl("");
          setShowUploadImage(false);
          setUser(res.data.user);
          window.location.reload();
        } else {
          toast.error(res.data.message);
        }
      });
    handleUploadImageModalClose();
  };
  const uploadImage = async (e) => {
    e.preventDefault();
    setUploadLoading(true);
    try {
      const data = new FormData();
      data.append("file", img);
      data.append("upload_preset", "pos preset");
      data.append("cloud_name", "dkscouusb");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dkscouusb/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const cloudData = await res.json();
      setImgUrl(cloudData.url);
      setUploadLoading(false);
      toast.success("Image Upload Successfully");
    } catch (e) {
      console.log(e);
    }
  };

  const handleShowDiag = () => {
    setShowDiag(true);
  };
  const handleCloseDiag = () => {
    setShowDiag(false);
  };
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };
  const handleDeleteAccount = () => {
    axios.get("/account/me/delete/" + user._id).then((response) => {
      if (response.data.statusCode === 200) {
        window.location.reload();
      } else {
        toast.error(response.data.message);
      }
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios.post("/accounts/me/update", formData, { headers }).then((res) => {
      console.log(res.data.statusCode);
      if (res.data.statusCode === 200) {
        setUser(res.data.user);
        setLoading(false);
        toast.success(
          "New Data has been saved successfully.Login agian to view the new data"
        );
        closeEditor();
        window.location.reload();
      } else {
        closeEditor();
        toast.error(res.data.message);
        setLoading(false);
      }
    });
    console.log("Form Data:", formData);
  };

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
  };
  useEffect(() => {
    if (currentPasword ? currentPasword.length > 2 : passphrase.length > 7) {
      axios
        .post(
          "/api/user/checkOldPassword/" + user._id,
          { currentPasword: currentPasword ? currentPasword : passphrase },
          {
            headers,
          }
        )
        .then((res) => {
          if (res.data.statusCode === 200) {
            setCorrect(true);
          } else {
            setCorrect(false);
          }
        });
    }
  }, [passphrase, currentPasword]);
  const submitForm = async () => {
    if (newPassword === confirmPassword) {
      await axios
        .post(
          "/accounts/me/changePassword",
          {
            currentPasword: currentPasword,
            newPassword: newPassword,
          },
          { headers }
        )
        .then((res) => {
          if (res.data.statusCode === 200) {
            toast.success(res.data.message, { duration: 6000, icon: "👌" });
            handleClose();
            window.location.reload();
          } else if (res.data.statusCode === 400) {
            toast.error(res.data.message, { duration: 6000 });
            Navigate("/signin");
          }
        });
    } else {
      toast.error("Passwords do not match", {
        duration: 6000,
        icon: "�",
      });
    }
  };
  return (
    <React.Fragment>
      <Page>
        <div
          style={{ marginTop: "-2.5rem" }}
          className="card card-widget widget-user shadow"
        >
          {/* Add the bg color to the header using any of the bg-* classes */}
          <div className="widget-user-header bg-secondary">
            {user.status === "Blocked" && (
              <h2>
                <span className="badge badge-dark text-danger">
                  You account has been blocked by the Boss
                </span>
              </h2>
            )}
          </div>

          <div
            onMouseEnter={handleHovered}
            onMouseLeave={handleUnHovered}
            style={{ cursor: "pointer" }}
            onClick={handleUploadImageModalShow}
            className="widget-user-image"
          >
            <img
              className="rounded-circle elevation-2"
              style={{
                height: "10rem",
                width: "11rem",
                textAlign: "center",
                marginLeft: "-2.5rem",
                objectFit: "cover",
                opacity: isHovered ? 0.6 : 1,
                cursor: "pointer",
              }}
              src={!user.img ? "/src/dist/img/user1-128x128.jpg" : user.img}
              alt="User Avatar"
            />

            {/* Conditionally render the camera icon based on hover state */}
            {isHovered && (
              <CameraIcon
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "2rem",
                  color: "white",
                }}
              />
            )}
          </div>
          <div className="card-footer bg-white mt-5">
            <div className="row mt-3">
              <div className="col-sm-4 border-right">
                <div className="description-block">
                  <h5 className="description-header">
                    {user.sales
                      ? user.sales.toLocaleString("en-PK", {
                          style: "currency",
                          currency: "PKR",
                        })
                      : (0).toLocaleString("en-PK", {
                          style: "currency",
                          currency: "PKR",
                        })}
                  </h5>
                  <span className="description-text">SALES</span>
                </div>
                {/* /.description-block */}
              </div>
              {/* /.col */}
              <div className="col-sm-4 border-right">
                <div className="description-block">
                  <h3 className="widget-user-username">
                    {user.firstName} {user.lastName}
                  </h3>
                  <h5 className="widget-user-desc">
                    {user.role ? user.role : "Non Designated"}
                  </h5>
                </div>
                {/* /.description-block */}
              </div>
              {/* /.col */}
              <div className="col-sm-4">
                <div className="description-block">
                  <h5 className="description-header">
                    {user.registeredRoles ? user.registeredRoles : "0"}
                  </h5>
                  <span className="description-text">User's Registered</span>
                </div>
                {/* /.description-block */}
              </div>
              {/* /.col */}
            </div>
            {/* /.row */}
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h4>Personal Information</h4>
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <strong>Username:</strong>{" "}
                    <span id="user-name">{user.username}</span>
                  </li>
                  <li className="list-group-item">
                    <strong>Role:</strong>{" "}
                    <span id="user-role">{user.role}</span>
                  </li>
                  <li className="list-group-item">
                    <strong>Address:</strong>{" "}
                    <span id="user-address">{user.address}</span>
                  </li>
                  <li className="list-group-item">
                    <strong>Gender:</strong>{" "}
                    <span id="user-address">{user.gender}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h4>Other Information</h4>
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <strong>Email:</strong>{" "}
                    <span id="user-email">
                      {!user.email ? user.username + "@pharma.pk" : user.email}
                    </span>
                  </li>

                  <li className="list-group-item">
                    <strong>Phone:</strong>{" "}
                    <span id="user-phone">{user.phone}</span>
                  </li>
                  <li className="list-group-item">
                    <strong>Date Of Birth:</strong>{" "}
                    <span id="user-address">{user.dob}</span>
                  </li>
                  <li className="list-group-item">
                    <strong>Registered By:</strong>{" "}
                    <span id="user-address">{user.registeredBy}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col col-12 card card-widget widget-user shadow">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <i className="fa-solid text-primary fa-camera text-secondary"></i>{" "}
                &nbsp;
                <a
                  className="text-decoration-none "
                  style={{ color: "black", cursor: "pointer" }}
                  onClick={handleUploadImageModalShow}
                >
                  Upload profile picture
                </a>
              </li>
              <li className="list-group-item">
                <i className="fa-solid text-primary fa-user-pen"></i> &nbsp;
                <a
                  className="text-decoration-none "
                  style={{ color: "black", cursor: "pointer" }}
                  onClick={openEditor}
                >
                  Edit Personal Info
                </a>
              </li>
              <li className="list-group-item">
                <div className="row">
                  <div className="col-6">
                    <i className="fa-solid text-success fa-key"></i> &nbsp;
                    <a
                      className="text-decoration-none "
                      style={{ color: "black", cursor: "pointer" }}
                      onClick={handleShow}
                    >
                      Change Password
                    </a>
                  </div>
                  <div className="col-6" style={{ textAlign: "end" }}>
                    {user.lastPasswordUpdated ? (
                      <>
                        Last password update was on:{" "}
                        <span className="badge badge-primary">
                          {new Date(
                            user.lastPasswordUpdated
                          ).toLocaleDateString("en-US", {
                            dateStyle: "full",
                          })}
                        </span>
                      </>
                    ) : (
                      "Password has never been changed"
                    )}
                  </div>
                </div>
              </li>
              <li className="list-group-item">
                <i className="fa-solid text-warning fa-shield"></i> &nbsp;
                <a
                  className="text-decoration-none"
                  style={{ color: "black", cursor: "pointer" }}
                >
                  Change Role
                </a>
              </li>
              <li className="list-group-item">
                <i className="fa-solid fa-trash text-danger"></i> &nbsp;
                <a
                  className="text-decoration-none"
                  style={{ color: "black", cursor: "pointer" }}
                  onClick={handleShowDiag}
                >
                  Delete Account
                </a>
              </li>
            </ul>
          </div>
        </div>
        <>
          <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header>
              <Modal.Title>Change Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form>
                <div className="">
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="buyerName">Old Password *</label>
                        <input
                          onChange={(e) => {
                            setCurrentPasword(e.target.value);
                            checkOldPassword();
                          }}
                          type="password"
                          className={`form-control ${
                            correct === true
                              ? "border-success"
                              : currentPasword.length > 0
                              ? "border-danger"
                              : "border-primary"
                          }`}
                          id="buyerName"
                          placeholder="Enter your current password"
                        />
                        <p
                          className={`
                         ${
                           correct === true
                             ? "text-success"
                             : currentPasword.length > 0
                             ? "text-danger"
                             : "text-primary"
                         }`}
                        >
                          {correct
                            ? "The password is correct"
                            : currentPasword.length > 0
                            ? "Old password entered is incorrect"
                            : "Please enter your old password"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <div className="form-group">
                        <label htmlFor="buyerName">New Password *</label>
                        <input
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                          }}
                          type="password"
                          className="form-control"
                          id="buyerName"
                          placeholder="New Password"
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <label htmlFor="buyerName">Confirm Password *</label>
                        <input
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                          }}
                          type="password"
                          className="form-control"
                          id="buyerName"
                          placeholder="Confirm Password"
                        />
                      </div>
                    </div>
                  </div>
                  <p
                    className={`${
                      newPassword.length > 7 ? "text-success" : "text-danger"
                    }`}
                  >
                    {newPassword.length > 7 ? (
                      <i className="fa-solid fa-check nav-icon"></i>
                    ) : (
                      <i className="fa-solid fa-xmark nav-icon"></i>
                    )}
                    Password must contain at least 7 letters{" "}
                  </p>
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button
                variant="primary"
                disabled={
                  newPassword.length > 0 && newPassword === confirmPassword
                    ? correct === true
                      ? newPassword.length > 7
                        ? false
                        : true
                      : true
                    : true
                }
                onClick={submitForm}
              >
                Change
              </Button>
            </Modal.Footer>
          </Modal>
        </>
        <>
          <Modal size="lg" show={showEditor} onHide={closeEditor}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Personal Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="firstName">First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        required
                        placeholder="Enter your first name"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="lastName">Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="lastName"
                        required
                        placeholder="Enter your last name"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="username">Username</label>
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        required
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        id="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="phone">Phone</label>
                      <input
                        type="tel"
                        required
                        className="form-control"
                        id="phone"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="dob">Date of Birth</label>
                      <input
                        type="date"
                        required
                        className="form-control"
                        id="dob"
                        value={formData.dob}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="gender">Gender</label>
                      <select
                        className="form-control"
                        id="gender"
                        required
                        value={formData.gender}
                        onChange={handleChange}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="address">Address</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        id="address"
                        placeholder="Enter your address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="city">City</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        id="city"
                        placeholder="Enter your city"
                        value={formData.city}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeEditor}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </>

        <>
          <Modal show={showDiag} onHide={handleCloseDiag}>
            <Modal.Header closeButton>
              <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="form-group">
                <label htmlFor="city">
                  {" "}
                  To confirm your identity, please enter your password
                </label>
                <input
                  type="password"
                  className="form-control"
                  onChange={(e) => {
                    setPassphrase(e.target.value);
                  }}
                  required
                  id="city"
                  placeholder="Enter your password"
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="success" onClick={handleCloseDiag}>
                Abort
              </Button>
              <Button
                disabled={correct === true ? false : true}
                variant="danger"
                onClick={handleDeleteAccount}
              >
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </>
        <>
          <Modal show={showUploadImage} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Update Profile Picture</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {uploadLoading ? (
                <Loader />
              ) : (
                <form onSubmit={uploadImage}>
                  <div className="row">
                    <div className="col-8">
                      <div className="form-group">
                        <label htmlFor="">Select Image</label>
                        <input
                          className="form-control"
                          onChange={(e) => {
                            setImg(e.target.files[0]);
                          }}
                          type="file"
                        />
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="form-group">
                        <label htmlFor="">Upload</label>
                        <button
                          className="form-control btn btn-success"
                          type="submit"
                        >
                          Upload
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleUploadImageModalClose}>
                Close
              </Button>
              <Button
                disabled={!uploadLoading ? (imgUrl ? false : true) : true}
                variant="primary"
                onClick={postToDatabase}
              >
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      </Page>
    </React.Fragment>
  );
}

export default Profile;
