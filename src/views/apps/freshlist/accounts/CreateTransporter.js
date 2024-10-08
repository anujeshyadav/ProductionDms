import React, { useEffect, useState, useContext } from "react";
import {
  Card,
  CardBody,
  Col,
  Form,
  Row,
  Input,
  Label,
  Button,
  FormGroup,
  Spinner,
  CustomInput,
} from "reactstrap";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { Route, useHistory, useParams } from "react-router-dom";

import swal from "sweetalert";
import "../../../../../src/layouts/assets/scss/pages/users.scss";

import {
  Createtransportersave,
  Get_RoleList,
  _BulkUpload,
  _Get,
  _GetList,
  _PostSave,
  _Put,
} from "../../../../ApiEndPoint/ApiCalling";
import "../../../../assets/scss/pages/users.scss";
import UserContext from "../../../../context/Context";

import {
  Bulk_Upload_transporter,
  Bulk_Upate_transporterUpload,
  GST_Verification_Api,
  Image_URL,
  Pan_Verification_API,
  Pan_Verification_key,
  Update_TransporterByID,
  View_TransporterByID,
  country_state_City_List,
} from "../../../../ApiEndPoint/Api";
import { FaUpload } from "react-icons/fa";

const CreateCustomer = () => {
  const [Country_State_city, setCountry_State_city] = useState([]);
  const [BulkUpload, setBulkUpload] = useState(false);
  const [Image, setImage] = useState({});
  const [Loader, setLoader] = useState(false);
  const [BulkImport, setBulkImport] = useState(null);
  const [Cities, setCities] = useState([]);
  const [formData, setFormData] = useState({});
  const [transporterType, settransporterType] = useState("Add");
  const [index, setindex] = useState("");
  const [error, setError] = useState("");
  const [Loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState([
    {
      BMName: "",
      address: "",
      contactNumber: "",
      gstNumber: "",
      contactNumber: "",
      otherContactNumber: "",
      pincode: "",
      city: "",
      state: "",
    },
  ]);

  const Context = useContext(UserContext);
  let history = useHistory();
  let Params = useParams();

  // start
  let handleChange = (i, e) => {
    let newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
  };
  let handleChangePhone = (i, phone) => {
    let newFormValues = [...formValues];
    newFormValues[i]["contactNumber"] = phone;
    setFormValues(newFormValues);
  };

  let addFormFields = () => {
    setFormValues([
      ...formValues,
      {
        BMName: "",
        address: "",
        contactNumber: "",
        gstNumber: "",
        contactNumber: "",
        otherContactNumber: "",
        pincode: "",
        city: "",
        state: "",
      },
    ]);
  };

  let removeFormFields = (i) => {
    let newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };

  // end add  more

  const handleFileChange = (e, type, i) => {
    const { name, value, checked } = e.target;
    let allimages = Array.from(e.target.files);
    setindex(i);
    setFormData({
      ...formData,
      [name]: allimages,
    });
  };

  const handleInputChange = (e, type, i) => {
    const { name, value, checked } = e.target;
    setindex(i);
    if (type == "checkbox") {
      if (checked) {
        setFormData({
          ...formData,
          [name]: checked,
        });
      } else {
        setFormData({
          ...formData,
          [name]: checked,
        });
      }
    } else {
      if (type == "number") {
        if (/^\d{0,10}$/.test(value)) {
          setFormData({
            ...formData,
            [name]: value,
          });
          setError("");
        }
      } else if (type == "file") {
        if (e.target.files) {
          setFormData({
            ...formData,
            [name]: e.target.files[0],
          });
        }
      } else {
        if (value.length <= 10) {
          setFormData({
            ...formData,
            [name]: value,
          });

          setError("");
        } else {
          setFormData({
            ...formData,
            [name]: value,
          });
        }
      }
    }
  };
  useEffect(() => {
    _GetList(country_state_City_List)
      .then((res) => {
        setCountry_State_city(res);
      })
      .catch((err) => {
        console.log(err);
      });
    if (Params?.id == 0) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const date = new Date(position.timestamp);
            const CurentTime = date.toLocaleString();
            formData.geotagging = `${position.coords.latitude},${position.coords.longitude}`;
          },
          (error) => {
            swal(`Error: ${error}`);
          },
          { timeout: 10000, enableHighAccuracy: true }
        );
      } else {
        swal(`Error: Geolocation not found`);
      }
    }
  }, []);
  const handleVerifyCompanyPan = async (inputPan) => {
    let payload = {
      api_key: Pan_Verification_key,
      pan: inputPan,
    };
    await _PostSave(Pan_Verification_API, payload)
      .then((res) => {
        console.log(res);
        if (res?.flag) {
          setFormData({
            ...formData,
            ["comPanNo"]: inputPan,
            ["IsValid_comPanNo"]: true,
          });
          swal("success", "Pan Card Verified with GST");
        } else {
          setFormData({
            ...formData,
            ["comPanNo"]: inputPan,
            ["IsValid_comPanNo"]: false,
          });
          swal("Error", "Pan Card notVerified with GST");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    let userdata = JSON.parse(localStorage.getItem("userData"));
    if (Params?.id == 0) {
      Get_RoleList(userdata?._id, userdata?.database)
        .then((res) => {
          let ShowList = res?.Role?.filter((item, i) =>
            item?.roleName?.toLowerCase()?.includes("transporter")
          );

          setFormData({
            ...formData,
            ["rolename"]: ShowList[0]?._id,
            ["database"]: userdata?.database,
          });
        })
        .catch((err) => {
          console.log(err);
          swal("Roles List Not found");
        });
    }
  }, []);

  useEffect(() => {
    if (Params?.id == 0) {
      settransporterType("Add");
    } else {
      settransporterType("Edit");

      _Get(View_TransporterByID, Params?.id)
        .then((res) => {
          let transporter = res?.Transporter;
          transporter["rolename"] = transporter?.rolename?._id;
          setFormValues(transporter?.serviceArea);
          setFormData(transporter);
          // transporter.Duedate = transporter?.Duedate?.split("T")[0];
          // if (transporter?.Country) {
          //   let countryselected = Country?.getAllCountries()?.filter(
          //     (ele, i) => ele?.name == transporter?.Country
          //   );
          //   setCountry(countryselected);
          //   if (transporter?.State) {
          //     let stateselected = State?.getStatesOfCountry(
          //       countryselected[0]?.isoCode
          //     )?.filter((ele, i) => ele?.name == transporter?.State);
          //     setState(stateselected);
          //     console.log(stateselected);
          //     if (transporter?.City) {
          //       // let cityselected = City.getCitiesOfState(
          //       //   stateselected[0]?.countryCode,
          //       //   stateselected[0]?.isoCode
          //       // )?.filter((ele, i) => ele?.name == transporter?.City);
          //       setCities(transporter?.City);
          //     }
          //   }
          // }
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    setLoader(true);
    let userData = JSON.parse(localStorage.getItem("userData"));

    if (formData?.serviceArea) {
      delete formData?.serviceArea;
    }
    if (formData?.image) {
      delete formData?.image;
    }
    if (BulkImport !== null || BulkImport != undefined) {
      let formdata = new FormData();
      formdata.append("file", BulkImport);
      formdata.append("database", userData?.database);
      setLoader(true);
      if (formData?.UploadStatus == "Update") {
        let URl = `${Bulk_Upate_transporterUpload}/${userData?.database}`;
        await _BulkUpload(URl, formdata)
          .then((res) => {
            setLoading(false);
            history.goBack();
            swal(`${res?.message}`);
          })
          .catch((err) => {
            setLoading(false);
            console.log(err.response);
            swal("Something Went Wrong");
          });
      } else if (formData?.UploadStatus == "New Upload") {
        let URl = `${Bulk_Upload_transporter}/${userData?.database}`;
        await _BulkUpload(URl, formdata)
          .then((res) => {
            setLoader(false);
            swal(`${res?.message}`);
          })
          .catch((err) => {
            console.log(err);
            setLoader(false);

            swal("Something Went Wrong");
          });
      } else {
        swal("error", "Choose Type of Upload", "error");
      }
    } else {
      let formdata = new FormData();

      for (const [key, value] of Object.entries(formData)) {
        formdata.append(`${key}`, `${value}`);
        console.log(key, value);
      }

      if (formValues?.length) {
        formdata.append("serviceArea", JSON.stringify(formValues));
      }
      // if (formData?.companyName) {
      //   formdata.append("id", formData?.companyName);
      // }

      if (Image !== null || Image !== undefined) {
        formdata.append("file", Image);
      }

      formdata.forEach((value, key) => {
        console.log(key, value);
      });

      if (error) {
        // swal("Error occured while Entering Details");
      } else {
        if (Params?.id == "0") {
          Createtransportersave(formdata)
            .then((res) => {
              console.log(res);
              setLoader(false);

              // if (res.status) {
              history.goBack();
              swal("Transporter Created Successfully");
              // }
            })
            .catch((err) => {
              setLoader(false);

              console.log(err.response);
              swal("Please Fill correct details");
            });
        } else {
          _Put(Update_TransporterByID, Params?.id, formdata)
            .then((res) => {
              console.log(res);
              setLoader(false);

              if (res.status) {
                history.goBack();
                swal("Transporter Updated Successfully");
              }
            })
            .catch((err) => {
              setLoader(false);

              console.log(err);
            });
        }
      }
    }
  };
  const onSelect1 = (selectedList, selectedItem) => {
    setCities(selectedList);
    console.log(selectedList);
  };
  const onRemove1 = (selectedList, selectedItem) => {
    console.log(selectedList);
    setCities(selectedList);
  };
  useEffect(() => {
    console.log(formData);
    // console.log(Image);
    console.log(formValues);
  }, [formValues, formData]);
  const handleChangeBulk = (e) => {
    setFormData({
      ...formData,
      ["UploadStatus"]: e.target.value,
    });
  };
  return (
    <div>
      <div>
        <Card>
          <Row className="m-2">
            <Col>
              <h1 className="float-left">
                {transporterType && transporterType} Transporter
              </h1>
            </Col>
            {Params?.id == "0" && (
              <>
                {!BulkUpload && !BulkUpload ? (
                  <>
                    <Col
                      lg="2"
                      md="2"
                      xs="6"
                      className="d-flex justify-content-end">
                      <Button
                        color="primary"
                        onClick={(e) => {
                          e.preventDefault();
                          setBulkUpload(true);
                        }}>
                        Bulk Upload
                      </Button>
                    </Col>
                  </>
                ) : (
                  <>
                    <Col className="d-flex justify-content-end" lg="1" md="2">
                      <Button
                        color="primary"
                        onClick={(e) => {
                          e.preventDefault();
                          setBulkUpload(false);
                        }}>
                        Back
                      </Button>
                    </Col>
                  </>
                )}
              </>
            )}
            {!BulkUpload && !BulkUpload && (
              <Col lg="1" md="2" xs="6">
                <div className="float-right">
                  <Route
                    render={({ history }) => (
                      <Button
                        style={{ cursor: "pointer" }}
                        className="float-right "
                        color="primary"
                        onClick={() =>
                          history.push("/app/ajgroup/CreateTransportList")
                        }>
                        {" "}
                        Back
                      </Button>
                    )}
                  />
                </div>
              </Col>
            )}
          </Row>
          {/* <hr /> */}

          <CardBody>
            <Form className="m-1" onSubmit={submitHandler}>
              {BulkUpload && BulkUpload ? (
                <>
                  <Row>
                    <Col className="d-flex justify-content-center">
                      <Label>
                        Choose Type of Upload{" "}
                        <span style={{ color: "red" }}>*</span>
                      </Label>

                      <div
                        className="form-label-group mx-2"
                        onChange={handleChangeBulk}>
                        <input
                          required
                          checked={formData?.UploadStatus == "New Upload"}
                          style={{ marginRight: "3px" }}
                          type="radio"
                          name="UploadStatus"
                          value="New Upload"
                        />
                        <span style={{ marginRight: "20px" }}>New Upload</span>

                        <input
                          required
                          checked={formData?.UploadStatus == "Update"}
                          style={{ marginRight: "3px" }}
                          type="radio"
                          name="UploadStatus"
                          value="Update"
                        />
                        <span style={{ marginRight: "3px" }}>Update</span>
                      </div>
                    </Col>
                  </Row>

                  <div className="parent">
                    <div className="file-upload mb-3">
                      <FaUpload color="green" size={50} />

                      <p>Click box to upload</p>
                      {/* <p>Maximun file size 10mb</p> */}
                      <input
                        required
                        type="file"
                        name="file"
                        onChange={(e) => {
                          console.log(e.target.files[0]);
                          setBulkImport(e.target.files[0]);
                        }}
                      />
                    </div>
                  </div>
                  <Row>
                    {Loader && Loader ? (
                      <>
                        <Col className="d-flex justify-content-center">
                          <Spinner>Loading...</Spinner>
                        </Col>
                      </>
                    ) : (
                      <>
                        <Col>
                          <div className="d-flex justify-content-center">
                            <Button.Ripple
                              color="primary"
                              type="submit"
                              className="mr-1 mt-2 mx-2">
                              Import
                            </Button.Ripple>
                          </div>
                        </Col>
                      </>
                    )}
                  </Row>
                </>
              ) : (
                <>
                  {/* start  */}

                  <Row>
                    <Row>
                      <Col className="mb-2" lg="12" md="12" sm="12">
                        <CardBody className="userRegiBody">
                          <div className="d-flex justify-content-center mb-2">
                            <h1>
                              {transporterType && transporterType} Information
                            </h1>
                          </div>
                          <Row>
                            {/* <Col lg="6" md="6" sm="12">
                                <FormGroup>
                                  <Label>
                                    First Name
                                    <span style={{ color: "red" }}>*</span>
                                  </Label>
                                  <Input
                                    required
                                    placeholder="Enter First Name"
                                    type="text"
                                    name="firstName"
                                    value={formData?.firstName}
                                    onChange={handleInputChange}
                                  />
                                </FormGroup>
                              </Col>
                              <Col lg="6" md="6" sm="12">
                                <FormGroup>
                                  <Label>
                                    Last Name{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </Label>
                                  <Input
                                    required
                                    placeholder="Enter Last Name"
                                    type="text"
                                    name="lastName"
                                    value={formData?.lastName}
                                    onChange={handleInputChange}
                                  />
                                </FormGroup>
                              </Col> */}
                            <Col lg="4" md="6" sm="12">
                              <FormGroup>
                                <Label>
                                  Incharge Name{" "}
                                  <span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input
                                  required
                                  placeholder="Enter Incharge Name"
                                  type="text"
                                  name="name"
                                  value={formData?.name}
                                  onChange={handleInputChange}
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="4" md="6" sm="12">
                              <FormGroup>
                                <Label>
                                  Contact Number{" "}
                                  <span style={{ color: "red" }}>*</span>{" "}
                                </Label>
                                <PhoneInput
                                  required
                                  inputClass="myphoneinput"
                                  country={"in"}
                                  onKeyDown={(e) => {
                                    ["e", "E", "+", "-"].includes(e.key) &&
                                      e.preventDefault();
                                  }}
                                  countryCodeEditable={false}
                                  name="contactNumber"
                                  value={JSON.stringify(
                                    formData?.contactNumber
                                  )}
                                  onChange={(phone) => {
                                    setFormData({
                                      ...formData,
                                      ["contactNumber"]: phone,
                                    });
                                  }}
                                />
                              </FormGroup>
                            </Col>

                            <Col lg="4" md="6" sm="12">
                              <FormGroup>
                                <Label>
                                  Pin Code Number{" "}
                                  <span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input
                                  required
                                  onKeyDown={(e) => {
                                    ["e", "E", "+", "-"].includes(e.key) &&
                                      e.preventDefault();
                                  }}
                                  type="number"
                                  placeholder="Enter Pin Code here"
                                  name="pincode"
                                  value={formData?.pincode}
                                  onChange={(e) => {
                                    let SelectedCity =
                                      Country_State_city?.filter(
                                        (ele) => ele?.Pincode == e.target.value
                                      );
                                    // console.log(SelectedCity);
                                    if (SelectedCity?.length) {
                                      setFormData({
                                        ...formData,
                                        ["state"]: SelectedCity[0]?.StateName,
                                        ["city"]: SelectedCity[0]?.District,
                                        ["pincode"]: Number(e.target.value),
                                        ["transporterDetail"]: 0,
                                      });
                                    } else {
                                      setFormData({
                                        ...formData,
                                        ["pincode"]: Number(e.target.value),
                                        ["transporterDetail"]: 0,
                                      });
                                    }
                                  }}
                                />
                              </FormGroup>
                            </Col>

                            <Col lg="4" md="6" sm="12">
                              <FormGroup>
                                <Label>City</Label>
                                <Input
                                  readOnly
                                  placeholder="City name"
                                  type="text"
                                  name="city"
                                  value={formData?.city}
                                  // onChange={handleInputChange}
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="4" md="6" sm="12">
                              <FormGroup>
                                <Label>State</Label>
                                <Input
                                  readOnly
                                  placeholder="State name"
                                  type="text"
                                  name="state"
                                  value={formData?.state}
                                  // onChange={handleInputChange}
                                />
                              </FormGroup>
                            </Col>
                            {/* <Col lg="6" md="6" sm="12">
                                <FormGroup>
                                  <Label>
                                    Address
                                    <span style={{ color: "red" }}>*</span>
                                  </Label>
                                  <Input
                                    required
                                    className="form-control"
                                    placeholder="address name"
                                    type="text"
                                    name="address"
                                    value={formData?.address}
                                    onChange={handleInputChange}
                                  />
                                </FormGroup>
                              </Col> */}
                            <Col sm="12" lg="4" md="6">
                              <Label>
                                GST Number
                                <span style={{ color: "red" }}>*</span>
                              </Label>
                              <Input
                                type="text"
                                required
                                minLength={15}
                                maxLength={15}
                                name="gstNumber"
                                className="from-control"
                                placeholder=" Enter Correct GST Number"
                                value={formData.gstNumber}
                                onChange={(e) => {
                                  let value = e.target.value;
                                  setFormData({
                                    ...formData,
                                    ["gstNumber"]: e.target.value,
                                  });
                                  if (value?.length == 15) {
                                    setLoader(true);
                                    (async () => {
                                      await _Get(GST_Verification_Api, value)
                                        .then((res) => {
                                          setLoader(false);

                                          console.log(res);
                                          const parts =
                                            res?.data?.pradr?.adr.split(",");

                                          const part1 = parts[0].trim(); // First part
                                          const part2 = parts
                                            .slice(1)
                                            .join(",")
                                            .trim();

                                          if (res?.flag) {
                                            setFormData({
                                              ...formData,
                                              ["companyName"]:
                                                res?.data?.tradeNam,
                                              ["address1"]: part1,
                                              ["address2"]: part2,
                                              ["gstNumber"]: e.target.value,
                                              ["id"]: value?.slice(2, 12),
                                            });
                                          } else {
                                            setFormData({
                                              ...formData,
                                              ["companyName"]: "",
                                              ["address1"]: "",
                                              ["address2"]: "",
                                              ["gstNumber"]: e.target.value,
                                              ["id"]: value?.slice(2, 12),
                                            });
                                          }
                                          setLoader(false);
                                        })
                                        .catch((err) => {
                                          setLoader(false);
                                          if (value?.length == 15) {
                                            setFormData({
                                              ...formData,
                                              ["gstNumber"]: value,
                                              ["id"]: value?.slice(2, 12),
                                            });
                                          } else {
                                            setFormData({
                                              ...formData,
                                              ["gstNumber"]: value,
                                            });
                                          }
                                          swal("error", "somthing went Wrong");
                                          console.log(err);
                                        });
                                    })();
                                  }
                                }}
                              />
                              {Loader && Loader ? (
                                <div className="" style={{ color: "red" }}>
                                  Getting GST Information..
                                </div>
                              ) : null}
                            </Col>
                            <Col lg="4" md="6" sm="12">
                              <FormGroup>
                                <Label>Transporter Name</Label>
                                <Input
                                  className="form-control"
                                  placeholder="Transporter Name"
                                  type="text"
                                  name="companyName"
                                  value={formData?.companyName}
                                  // onChange={handleInputChange}
                                  onChange={(e) => {
                                    const inputPan = e.target.value;
                                    const filteredValue = inputPan.replace(
                                      /\s/g,
                                      ""
                                    );
                                    setFormData({
                                      ...formData,
                                      ["id"]: filteredValue,
                                      ["companyName"]: inputPan,
                                    });
                                  }}
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="4" md="6" sm="12">
                              <FormGroup>
                                <Label>
                                  Address 1st{" "}
                                  <span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input
                                  // readOnly
                                  required
                                  className="form-control"
                                  placeholder="address name"
                                  type="text"
                                  name="address1"
                                  value={formData?.address1}
                                  onChange={handleInputChange}
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="4" md="6" sm="12">
                              <FormGroup>
                                <Label>
                                  Address 2nd
                                  <span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input
                                  // readOnly
                                  required
                                  className="form-control"
                                  placeholder="address name"
                                  type="text"
                                  name="address2"
                                  value={formData?.address2}
                                  onChange={handleInputChange}
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="4" md="6" sm="12">
                              <FormGroup>
                                <Label>Email Id</Label>
                                <Input
                                  placeholder="Email id .."
                                  type="email"
                                  name="email"
                                  value={formData?.email}
                                  onChange={handleInputChange}
                                />
                              </FormGroup>
                            </Col>
                            {/* <Col lg="4" md="6" sm="12">
                              <FormGroup>
                                <Label>
                                  Id <span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input
                                  placeholder="Id"
                                  type="text"
                                  name="id"
                                  value={formData?.id}
                                  onChange={handleInputChange}
                                />
                              </FormGroup>
                            </Col> */}
                            <Col lg="4" md="6" sm="12">
                              <FormGroup>
                                <Label>
                                  Password{" "}
                                  <span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input
                                  required
                                  placeholder="Enter Password here"
                                  type="password"
                                  name="password"
                                  value={formData?.password}
                                  onChange={handleInputChange}
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="6" md="6" sm="12">
                              <FormGroup className="cssforproductlist">
                                <Label>
                                  Opening Balance{" "}
                                  <span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input
                                  required
                                  className="form-control"
                                  placeholder="Opening Balance"
                                  type="number"
                                  name="OpeningBalance"
                                  value={formData?.OpeningBalance}
                                  onChange={handleInputChange}
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="6" md="6" sm="12">
                              <FormGroup className="cssforproductlist">
                                <Label>
                                  O/P Balance Type
                                  <span style={{ color: "red" }}>*</span>
                                </Label>
                                <CustomInput
                                  required
                                  className="form-control"
                                  placeholder="Opening Balance"
                                  type="select"
                                  name="Type"
                                  value={formData?.Type}
                                  onChange={handleInputChange}>
                                  <option value="">----select Type----</option>
                                  <option value="debit">Dr</option>
                                  <option value="credit">Cr</option>
                                </CustomInput>
                              </FormGroup>
                            </Col>
                          </Row>
                        </CardBody>
                      </Col>
                      {/* <Col lg="12" md="12" sm="12">
                          <CardBody className="userRegiBody">
                            <div className="d-flex justify-content-center">
                              <h1>Other information</h1>
                            </div>
                            <Row>
                              <Col lg="6" md="6" sm="12">
                                <FormGroup>
                                  <Label>
                                    Password{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </Label>
                                  <Input
                                    required
                                    placeholder="Enter Password here"
                                    type="password"
                                    name="password"
                                    value={formData?.password}
                                    onChange={handleInputChange}
                                  />
                                </FormGroup>
                              </Col>
                              <Col lg="6" md="6" sm="12">
                                <FormGroup>
                                  <Label>Geotagging</Label>
                                  <Input
                                    readOnly
                                    placeholder="Enter Password here"
                                    type="text"
                                    name="geotagging"
                                    value={formData?.geotagging}
                                    // onChange={handleInputChange}
                                  />
                                </FormGroup>
                              </Col>

                              <Col lg="6" md="6" sm="12">
                                <FormGroup>
                                  <Label>
                                    Due Date{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </Label>
                                  <Input
                                    required
                                    className="form-control"
                                    placeholder="Due Date"
                                    type="number"
                                    name="duedate"
                                    value={formData?.duedate}
                                    onChange={(e) => {
                                      setFormData({
                                        ...formData,
                                        ["duedate"]: Number(e.target.value),
                                      });
                                    }}
                                  />
                                </FormGroup>
                              </Col>
                              <Col lg="6" md="6" sm="12">
                                <FormGroup>
                                  <Label>
                                    Lock In Time{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </Label>
                                  <Input
                                    required
                                    className="form-control"
                                    placeholder="Lock In time in days"
                                    type="number"
                                    name="lockInTime"
                                    value={formData?.lockInTime}
                                    onChange={(e) => {
                                      setFormData({
                                        ...formData,
                                        ["lockInTime"]: Number(e.target.value),
                                      });
                                    }}
                                  />
                                </FormGroup>
                              </Col>
                              <Col lg="6" md="6" sm="12">
                                <FormGroup>
                                  <Label>
                                    Limit{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </Label>
                                  <Input
                                    required
                                    className="form-control"
                                    placeholder="Lock In time in days"
                                    type="number"
                                    name="limit"
                                    value={formData?.limit}
                                    onChange={(e) => {
                                      setFormData({
                                        ...formData,
                                        ["limit"]: Number(e.target.value),
                                      });
                                    }}
                                  />
                                </FormGroup>
                              </Col>
                              <Col lg="6" md="6" sm="12">
                                <FormGroup>
                                  <Label>
                                    Payment Term{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </Label>
                                  <Input
                                    required
                                    className="form-control"
                                    placeholder="Lock In time in days"
                                    type="number"
                                    name="paymentTerm"
                                    value={formData?.paymentTerm}
                                    onChange={(e) => {
                                      setFormData({
                                        ...formData,
                                        ["paymentTerm"]: Number(e.target.value),
                                      });
                                    }}
                                  />
                                </FormGroup>
                              </Col>

                              <Col lg="12" md="12" sm="12">
                                <FormGroup>
                                  <Label>
                                    Service Area{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </Label>
                                  <textarea
                                    required
                                    rows={5}
                                    className="form-control"
                                    placeholder="Service Area"
                                    type="text"
                                    name="serviceArea"
                                    value={formData?.serviceArea}
                                    onChange={handleInputChange}
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                          </CardBody>
                        </Col> */}
                    </Row>

                    {/* <Col lg="6" md="6" sm="12">
                      <Col lg="12" md="12" sm="12">
                        <CardBody className="userRegiBody">
                          <div className="d-flex justify-content-center">
                            <h1>Company Information</h1>
                          </div>
                          <Row>
                            <Col lg="6" md="6" sm="12">
                              <FormGroup>
                                <Label className="mb-1">Party Type</Label>
                                <CustomInput
                                  name="partyType"
                                  value={formData?.partyType}
                                  onChange={(e) => {
                                    setFormData({
                                      ...formData,
                                      ["partyType"]: Number(e.target.value),
                                    });
                                  }}
                                  type="select">
                                  <option>--Select--</option>
                                  <option value={0}>Debiter</option>
                                  <option value={1}>Crediter</option>
                                </CustomInput>
                              </FormGroup>
                            </Col>
                            <Col lg="6" md="6" sm="12">
                              <FormGroup>
                                <Label className="mb-1">
                                  Registration Type
                                </Label>
                                <CustomInput
                                  name="registrationType"
                                  value={formData?.registrationType}
                                  onChange={(e) => {
                                    setFormData({
                                      ...formData,
                                      ["registrationType"]: Number(
                                        e.target.value
                                      ),
                                    });
                                  }}
                                  type="select">
                                  <option value={null}>--Select--</option>
                                  <option value={0}>UnKnown</option>
                                  <option value={1}>Regular</option>
                                  <option value={2}>UnRegister</option>
                                </CustomInput>
                              </FormGroup>
                            </Col>
                            {formData?.registrationType !== 2 && (
                              <>
                                <Col sm="12" lg="6" md="6">
                                  <Label>
                                    GST Number
                                    <span style={{ color: "red" }}>*</span>
                                  </Label>
                                  <Input
                                    type="text"
                                    required
                                    minLength={15}
                                    maxLength={15}
                                    name="gstNumber"
                                    className="from-control"
                                    placeholder=" Enter Correct GST Number"
                                    value={formData?.gstNumber}
                                    onChange={(e) => {
                                      let value = e.target.value;

                                      if (value?.length == 15) {
                                        (async () => {
                                          await _Get(
                                            GST_Verification_Api,
                                            value
                                          )
                                            .then((res) => {
                                              console.log(res);
                                              const parts =
                                                res?.data?.pradr?.adr.split(
                                                  ","
                                                );

                                              const part1 = parts[0].trim(); // First part
                                              const part2 = parts
                                                .slice(1)
                                                .join(",")
                                                .trim();

                                              if (res?.flag) {
                                                setFormData({
                                                  ...formData,
                                                  ["companyName"]:
                                                    res?.data?.tradeNam,
                                                  ["address1"]: part1,
                                                  ["address2"]: part2,
                                                });
                                              } else {
                                                setFormData({
                                                  ...formData,
                                                  ["companyName"]: "",
                                                  ["address1"]: "",
                                                  ["address2"]: "",
                                                });
                                              }
                                            })
                                            .catch((err) => {
                                              swal(
                                                "error",
                                                "somthing went Wrong"
                                              );
                                              console.log(err);
                                            });
                                        })();
                                      }
                                    }}
                                  />
                                </Col>
                              </>
                            )}
                            <Col lg="6" md="6" sm="12">
                              <FormGroup>
                                <Label>
                                  PAN Number{" "}
                                  <span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input
                                  required
                                  minLength={10}
                                  maxLength={10}
                                  placeholder="Enter Company Pan Number"
                                  type="text"
                                  name="comPanNo"
                                  value={formData?.comPanNo}
                                  onChange={(e) => {
                                    const inputPan =
                                      e.target.value?.toUpperCase();
                                    const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
                                    setFormData({
                                      ...formData,
                                      ["comPanNo"]: inputPan,
                                      // ["IsValid_comPanNo"]: panRegex.test(inputPan),
                                    });
                                    if (inputPan?.length == 10) {
                                      handleVerifyCompanyPan(inputPan);
                                    }
                                  }}
                                />
                                <span>
                                  {formData?.IsValid_comPanNo &&
                                  formData?.IsValid_comPanNo ? (
                                    <>
                                      <span style={{ color: "green" }}>
                                        Verified
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      {formData?.comPanNo?.length < 10 && (
                                        <span style={{ color: "red" }}>
                                          Enter Correct PAN Number
                                        </span>
                                      )}
                                    </>
                                  )}
                                </span>
                              </FormGroup>
                            </Col>
                            <Col lg="6" md="6" sm="12">
                              <FormGroup>
                                <Label>Email Id</Label>
                                <Input
                                  placeholder="last job firm name"
                                  type="email"
                                  name="email"
                                  value={formData?.email}
                                  onChange={handleInputChange}
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="6" md="6" sm="12">
                              <FormGroup>
                                <Label>Deals in Prouduct</Label>
                                <Input
                                  placeholder="Deals In Products"
                                  type="text"
                                  name="dealsInProducts"
                                  value={formData?.dealsInProducts}
                                  onChange={handleInputChange}
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="6" md="6" sm="12">
                              <FormGroup>
                                <Label>Annual TurnOver</Label>
                                <Input
                                  placeholder="Deals In Products"
                                  type="number"
                                  name="annualTurnover"
                                  value={formData?.annualTurnover}
                                  onChange={(e) => {
                                    setFormData({
                                      ...formData,
                                      ["annualTurnover"]: Number(
                                        e.target.value
                                      ),
                                    });
                                  }}
                                />
                              </FormGroup>
                            </Col>
                            {formData?.registrationType == 2 ? (
                              <>
                                <Col lg="6" md="6" sm="12">
                                  <FormGroup>
                                    <Label>Company Name</Label>
                                    <Input
                                      className="form-control"
                                      placeholder="Company Name"
                                      type="text"
                                      name="companyName"
                                      value={formData?.companyName}
                                      onChange={handleInputChange}
                                    />
                                  </FormGroup>
                                </Col>
                                <Col lg="6" md="6" sm="12">
                                  <FormGroup>
                                    <Label>
                                      Address 1st{" "}
                                      <span style={{ color: "red" }}>*</span>
                                    </Label>
                                    <Input
                                      required
                                      className="form-control"
                                      placeholder="address name"
                                      type="text"
                                      name="address1"
                                      value={formData?.address1}
                                      onChange={handleInputChange}
                                    />
                                  </FormGroup>
                                </Col>
                                <Col lg="6" md="6" sm="12">
                                  <FormGroup>
                                    <Label>
                                      Address 2nd
                                      <span style={{ color: "red" }}>*</span>
                                    </Label>
                                    <Input
                                      required
                                      className="form-control"
                                      placeholder="address name"
                                      type="text"
                                      name="address2"
                                      value={formData?.address2}
                                      onChange={handleInputChange}
                                    />
                                  </FormGroup>
                                </Col>
                              </>
                            ) : (
                              <>
                                <Col lg="6" md="6" sm="12">
                                  <FormGroup>
                                    <Label>Company Name</Label>
                                    <Input
                                      readOnly
                                      className="form-control"
                                      placeholder="last job firm name"
                                      type="text"
                                      name="companyName"
                                      value={formData?.companyName}
                                      onChange={handleInputChange}
                                    />
                                  </FormGroup>
                                </Col>
                                <Col lg="6" md="6" sm="12">
                                  <FormGroup>
                                    <Label>
                                      Address 1st{" "}
                                      <span style={{ color: "red" }}>*</span>
                                    </Label>
                                    <Input
                                      readOnly
                                      required
                                      className="form-control"
                                      placeholder="address name"
                                      type="text"
                                      name="address1"
                                      value={formData?.address1}
                                      onChange={handleInputChange}
                                    />
                                  </FormGroup>
                                </Col>
                                <Col lg="6" md="6" sm="12">
                                  <FormGroup>
                                    <Label>
                                      Address 2nd
                                      <span style={{ color: "red" }}>*</span>
                                    </Label>
                                    <Input
                                      readOnly
                                      required
                                      className="form-control"
                                      placeholder="address name"
                                      type="text"
                                      name="address2"
                                      value={formData?.address2}
                                      onChange={handleInputChange}
                                    />
                                  </FormGroup>
                                </Col>
                              </>
                            )}
                            <Col lg="6" md="6" sm="12">
                              <FormGroup>
                                <Label>Contact Number</Label>
                                <Input
                                  className="form-control"
                                  placeholder="last job firm name"
                                  type="text"
                                  name="contactNumber"
                                  value={formData?.contactNumber}
                                  onChange={(e) => {
                                    setFormData({
                                      ...formData,
                                      ["contactNumber"]: Number(e.target.value),
                                    });
                                  }}
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="6" md="6" sm="12">
                              <FormGroup>
                                <Label>
                                  Pin Code Number{" "}
                                  <span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input
                                  required
                                  onKeyDown={(e) => {
                                    ["e", "E", "+", "-"].includes(e.key) &&
                                      e.preventDefault();
                                  }}
                                  type="number"
                                  placeholder="Enter Pin Code here"
                                  name="pincode"
                                  value={formData?.pincode}
                                  onChange={(e) => {
                                    let SelectedCity =
                                      Country_State_city?.filter(
                                        (ele) => ele?.Pincode == e.target.value
                                      );
                                    // console.log(SelectedCity);
                                    if (SelectedCity?.length) {
                                      setFormData({
                                        ...formData,
                                        ["State"]: SelectedCity[0]?.StateName,
                                        ["City"]: SelectedCity[0]?.District,
                                        ["pincode"]: Number(e.target.value),
                                      });
                                    } else {
                                      setFormData({
                                        ...formData,
                                        ["pincode"]: Number(e.target.value),
                                      });
                                    }
                                  }}
                                />
                              </FormGroup>
                            </Col>

                            <Col lg="6" md="6" sm="12">
                              <FormGroup>
                                <Label>City</Label>
                                <Input
                                  readOnly
                                  placeholder="City name"
                                  type="text"
                                  name="City"
                                  value={formData?.City}
                                  // onChange={handleInputChange}
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="6" md="6" sm="12">
                              <FormGroup>
                                <Label>State</Label>
                                <Input
                                  readOnly
                                  placeholder="State name"
                                  type="text"
                                  name="State"
                                  value={formData?.State}
                                  // onChange={handleInputChange}
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="6" md="6" sm="12">
                              <FormGroup>
                                <Label>
                                  ShopSize{" "}
                                  <span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input
                                  required
                                  className="form-control"
                                  placeholder="address name"
                                  type="text"
                                  name="shopSize"
                                  value={formData?.shopSize}
                                  onChange={handleInputChange}
                                />
                              </FormGroup>
                            </Col>

                            <Col className="mt-2 mb-2" lg="12" md="12" sm="12">
                              <Row>
                                <Col lg="6" md="6" sm="6" xs="12">
                                  <div className="d-flex justify-content-center">
                                    <Label>Shop Photo</Label>
                                  </div>

                                  <div className="parent">
                                    <div className="file-upload">
                                      <FaUpload color="green" size={35} />

                                      <p>Click box to upload</p>

                                      <input
                                        multiple
                                        type="file"
                                        name="shopPhotos"
                                        onChange={(e) => {
                                          let allimages = Array.from(
                                            e.target.files
                                          );
                                          setPhotoimags(allimages);
                                          setFormData({
                                            ...formData,
                                            ["shopPhotos"]: allimages,
                                          });
                                          const fiels = e.target.files;
                                          for (
                                            let i = 0;
                                            i < fiels.length;
                                            i++
                                          ) {
                                            const reader = new FileReader();
                                            reader.onload = (event) => {
                                              setImageUris((prevUris) => [
                                                ...prevUris,
                                                event.target.result,
                                              ]);
                                            };
                                            reader.readAsDataURL(fiels[i]);
                                          }
                                        }}
                                      />
                                    </div>
                                  </div>
                                </Col>
                                {imageUri &&
                                  imageUri?.map((ele, i) => {
                                    return (
                                      <>
                                        <Col key={i} lg="4" md="4" sm="6">
                                          <img
                                            style={{ borderRadius: "8px" }}
                                            src={ele}
                                            height={100}
                                            width="100%"
                                            alt="image"
                                          />
                                        </Col>
                                      </>
                                    );
                                  })}

                                {formData?.shopPhoto &&
                                  formData?.shopPhoto?.map((ele, i) => (
                                    <Col
                                      key={i}
                                      className="mt-1 mb-1"
                                      lg="4"
                                      md="4"
                                      sm="6">
                                      <img
                                        style={{ borderRadius: "8px" }}
                                        src={`${Image_URL}/Images/${ele}`}
                                        height={100}
                                        width={120}
                                        alt="image"
                                      />
                                    </Col>
                                  ))}
                              </Row>
                            </Col>
                          </Row>
                        </CardBody>
                      </Col>
                    </Col> */}
                  </Row>
                  {formValues.map((element, index) => (
                    <>
                      <Row>
                        <Col lg="12" md="12" sm="12">
                          <div className="d-flex justify-content-center">
                            <h3 key={index}>
                              {" "}
                              Service Location -({index + 1})
                            </h3>
                          </div>
                        </Col>
                      </Row>
                      <Row className="mb-2">
                        <Col className="mb-2" key={index} lg="4" md="4" sm="12">
                          <Label>Branch Manager Name</Label>
                          <Input
                            type="text"
                            placeholder="Branch Manage Name"
                            name="BMName"
                            value={element.BMName || ""}
                            onChange={(e) => handleChange(index, e)}
                          />
                        </Col>
                        {/* <Col lg="4" md="4" sm="12">
                          <FormGroup>
                            <Label>
                              Mobile No. <span style={{ color: "red" }}>*</span>
                            </Label>
                            <Input
                              required
                              onKeyDown={e => {
                                ["e", "E", "+", "-"].includes(e.key) &&
                                  e.preventDefault();
                              }}
                              type="number"
                              placeholder="Enter Mobile No."
                              name="contactNumber"
                              value={element.contactNumber || ""}
                              onChange={e => handleChange(index, e)}
                            />
                          </FormGroup>
                        </Col> */}
                        <Col lg="4" md="6" sm="12">
                          <FormGroup>
                            <Label>
                              Mobile No. <span style={{ color: "red" }}>*</span>
                            </Label>
                            <PhoneInput
                              required
                              inputClass="myphoneinput"
                              country={"in"}
                              onKeyDown={(e) => {
                                ["e", "E", "+", "-"].includes(e.key) &&
                                  e.preventDefault();
                              }}
                              countryCodeEditable={false}
                              // value={JSON.stringify(formData?.contactNumber)}
                              // onChange={phone => {
                              //   setFormData({
                              //     ...formData,
                              //     ["contactNumber"]: phone,
                              //   });
                              // }}
                              name="contactNumber"
                              value={JSON.stringify(
                                element.contactNumber || ""
                              )}
                              onChange={(phone) => {
                                let newFormValues = [...formValues];
                                newFormValues[index]["contactNumber"] = phone;
                                setFormValues(newFormValues);
                                // handleChangePhone(index, phone)
                              }}
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="4" md="4" sm="12">
                          <FormGroup>
                            <Label>
                              Pin Code <span style={{ color: "red" }}>*</span>
                            </Label>
                            <Input
                              required
                              onKeyDown={(e) => {
                                ["e", "E", "+", "-"].includes(e.key) &&
                                  e.preventDefault();
                              }}
                              type="number"
                              placeholder="Enter Pin Code here"
                              name="pincode"
                              value={element.pincode || ""}
                              onChange={(e) => {
                                handleChange(index, e);
                                let SelectedCity = Country_State_city?.filter(
                                  (ele) => ele?.Pincode == e.target.value
                                );

                                let newFormValues = [...formValues];
                                if (SelectedCity?.length) {
                                  newFormValues[index] = {
                                    ...newFormValues[index],
                                    state: SelectedCity[0]?.StateName,
                                    city: SelectedCity[0]?.District,
                                    pincode: Number(e.target.value),
                                  };
                                  // console.log(newFormValues);
                                  setFormValues(newFormValues);
                                } else {
                                  newFormValues[index] = {
                                    ...newFormValues[index],
                                    pincode: Number(e.target.value),
                                  };
                                  // console.log(newFormValues);
                                  setFormValues(newFormValues);
                                }
                              }}
                            />
                          </FormGroup>
                        </Col>

                        <Col lg="4" md="4" sm="12">
                          <FormGroup>
                            <Label>Branch Location</Label>
                            <Input
                              readOnly
                              placeholder="City name"
                              type="text"
                              name="city"
                              value={element.city || ""}
                              // onChange={handleInputChange}
                            />
                          </FormGroup>
                        </Col>
                        {/* <Col lg="4" md="4" sm="12">
                          <FormGroup>
                            <Label>State</Label>
                            <Input
                              readOnly
                              placeholder="State"
                              type="text"
                              name="state"
                              value={element.state || ""}
                              // onChange={handleInputChange}
                            />
                          </FormGroup>
                        </Col> */}

                        <Col className="mb-2" key={index} lg="4" md="4" sm="12">
                          <Label>GST Number</Label>
                          <Input
                            minLength={15}
                            maxLength={15}
                            type="text"
                            placeholder="Branch GST No"
                            name="gstNumber"
                            value={element.gstNumber || ""}
                            onChange={(e) => {
                              let value = e.target.value;

                              let newFormValues = [...formValues];
                              if (value?.length == 15) {
                                setLoader(true);
                                newFormValues[index] = {
                                  ...newFormValues[index],
                                  ["gstNumber"]: value,
                                };

                                setFormValues(newFormValues);
                                (async () => {
                                  await _Get(GST_Verification_Api, value)
                                    .then((res) => {
                                      setLoader(false);

                                      console.log(res);
                                      const parts =
                                        res?.data?.pradr?.adr.split(",");

                                      const part1 = parts[0].trim(); // First part
                                      const part2 = parts
                                        .slice(1)
                                        .join(",")
                                        .trim();
                                      if (res?.flag) {
                                        newFormValues[index] = {
                                          ...newFormValues[index],
                                          ["CompanyName"]: res?.data?.tradeNam,
                                          ["address"]: `${part1}, ${part2}`,
                                          ["gstNumber"]: value,
                                        };

                                        setFormValues(newFormValues);
                                      } else {
                                        newFormValues[index] = {
                                          ...newFormValues[index],
                                          ["CompanyName"]: "",
                                          ["address"]: "",
                                          ["gstNumber"]: value,
                                        };

                                        setFormValues(newFormValues);
                                      }
                                    })
                                    .catch((err) => {
                                      setLoader(false);

                                      swal("error", "somthing went Wrong");
                                      console.log(err);
                                    });
                                })();
                              } else {
                                newFormValues[index] = {
                                  ...newFormValues[index],

                                  ["gstNumber"]: value,
                                };

                                setFormValues(newFormValues);
                              }
                              setLoader(false);
                            }}
                            // onChange={(e) => handleChange(index, e)}
                          />
                          {Loader && Loader ? (
                            <div className="" style={{ color: "red" }}>
                              Getting GST Information..
                            </div>
                          ) : null}
                        </Col>
                        <Col className="mb-2" key={index} lg="4" md="4" sm="12">
                          <Label>Address</Label>
                          <Input
                            readOnly
                            type="text"
                            placeholder="Branch Address"
                            name="address"
                            value={element.address || ""}
                            onChange={(e) => handleChange(index, e)}
                          />
                        </Col>

                        <Col className="mb-2" key={index} lg="4" md="4" sm="12">
                          <Label>Other Contact Number</Label>
                          <Input
                            minLength={10}
                            maxLength={10}
                            type="number"
                            placeholder="Branch Contact Number"
                            name="otherContactNumber"
                            value={element.otherContactNumber || ""}
                            onChange={(e) => handleChange(index, e)}
                          />
                        </Col>
                        {/* <Col className="mb-2" key={index} lg="4" md="4" sm="12">
                          <Label>Email Id</Label>
                          <Input
                            type="email"
                            placeholder="Branch Email"
                            name="bemail"
                            value={element.bemail || ""}
                            onChange={(e) => handleChange(index, e)}
                          />
                        </Col>
                        <Col className="mb-2" key={index} lg="4" md="4" sm="12">
                          <Label>GST Number</Label>
                          <Input
                            type="text"
                            placeholder="Branch GST"
                            name="BgstNumber"
                            value={element.BgstNumber || ""}
                            onChange={(e) => handleChange(index, e)}
                          />
                        </Col> */}
                        <Col key={index} lg="4" md="4" sm="12">
                          <div className="d-flex justify-content-space-around">
                            {index ? (
                              <Button
                                color="info"
                                type="button"
                                className="button remove mt-2"
                                onClick={() => removeFormFields(index)}>
                                x
                              </Button>
                            ) : null}
                          </div>
                        </Col>
                      </Row>
                    </>
                  ))}
                  <Row>
                    <Col lg="12" md="12" sm="12">
                      <div className="d-flex justify-content-end">
                        <Button
                          color="primary"
                          className="button add mt-2"
                          type="button"
                          onClick={() => addFormFields()}>
                          Add
                        </Button>
                      </div>
                    </Col>
                  </Row>
                  <Row></Row>

                  <Row>
                    {Loader && Loader ? (
                      <>
                        <Row>
                          <Col className="d-flex justify-content-center">
                            <Spinner>Loading...</Spinner>
                          </Col>
                        </Row>
                      </>
                    ) : (
                      <>
                        <Row style={{ width: "100%" }}>
                          <Col lg="2" md="2">
                            <Row>
                              <Col lg="12" md="12">
                                <div className="d-flex justify-content-center">
                                  <Label>Image</Label>
                                </div>

                                <div className="parent">
                                  <div className="file-upload">
                                    <FaUpload color="green" size={35} />

                                    <p>Click box to upload</p>
                                    {/* <p>Maximun file size 10mb</p> */}
                                    <input
                                      type="file"
                                      name="Photo"
                                      onChange={(e) => {
                                        const fiels = e.target.files[0];

                                        setImage(fiels);
                                        if (fiels) {
                                          const reader = new FileReader();
                                          reader.onload = (e) => {
                                            setFormData({
                                              ...formData,
                                              ["PhotoUrl"]: e.target.result,
                                            });
                                          };
                                          reader.readAsDataURL(fiels);
                                        }
                                      }}
                                    />
                                  </div>
                                </div>
                              </Col>
                              {formData?.PhotoUrl && (
                                <Col lg="6" md="6" sm="12">
                                  <img
                                    style={{ borderRadius: "8px" }}
                                    src={formData?.PhotoUrl}
                                    height={100}
                                    width={120}
                                    alt="image"
                                  />
                                </Col>
                              )}

                              {formData?.image && formData?.image && (
                                <Col lg="6" md="6" sm="12">
                                  <img
                                    style={{ borderRadius: "8px" }}
                                    src={`${Image_URL}/Images/${formData?.image}`}
                                    height={100}
                                    width={120}
                                    alt="image"
                                  />
                                </Col>
                              )}
                            </Row>
                          </Col>
                          <Col lg="2" md="2">
                            <div className=" text-center">
                              <Label style={{ textAlign: "start" }}>
                                Status
                              </Label>
                              <div
                                className="form-label-group"
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    ["status"]: e.target.value,
                                  });
                                }}>
                                <input
                                  checked={formData?.status == "Active"}
                                  required
                                  style={{ marginRight: "3px" }}
                                  type="radio"
                                  name="status"
                                  value="Active"
                                />
                                <span style={{ marginRight: "20px" }}>
                                  Active
                                </span>

                                <input
                                  required
                                  checked={formData?.status == "Deactive"}
                                  style={{ marginRight: "3px" }}
                                  type="radio"
                                  name="status"
                                  value="Deactive"
                                />
                                <span style={{ marginRight: "3px" }}>
                                  Deactive
                                </span>
                              </div>
                            </div>
                          </Col>
                          <Col lg="2" md="2">
                            <div className="d-flex justify-content-center">
                              <Button.Ripple
                                color="primary"
                                type="submit"
                                className="mr-1 mt-2 mx-2">
                                Submit
                              </Button.Ripple>
                            </div>
                          </Col>
                        </Row>
                      </>
                    )}
                  </Row>

                  {/* end new */}
                </>
              )}
            </Form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
export default CreateCustomer;
