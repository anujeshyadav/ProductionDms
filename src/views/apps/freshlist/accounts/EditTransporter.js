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
  CustomInput,
  Badge,
} from "reactstrap";
import { history } from "../../../../history";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import moment from "moment-timezone";
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
  Bulk_Upload_Customer,
  Create_transporter_xmlView,
  GST_Verification_Api,
  Image_URL,
  Pan_Verification_API,
  Pan_Verification_key,
  Update_TransporterByID,
  View_TransporterByID,
  country_state_City_List,
} from "../../../../ApiEndPoint/Api";
import Multiselect from "multiselect-react-dropdown";
import { FaUpload } from "react-icons/fa";

const CreateCustomer = () => {
  const [Country_State_city, setCountry_State_city] = useState([]);
  // const [RoleList, setRoleList] = useState([]);
  const [BulkUpload, setBulkUpload] = useState(false);
  const [Image, setImage] = useState({});
  const [PhotoImage, setPhotoimags] = useState([]);
  const [imageUri, setImageUris] = useState([]);
  const [Countries, setCountry] = useState({});
  const [BulkImport, setBulkImport] = useState(null);
  const [States, setState] = useState({});
  const [Cities, setCities] = useState([]);
  const [formData, setFormData] = useState({});
  const [transporterType, settransporterType] = useState("Create");
  const [index, setindex] = useState("");
  const [error, setError] = useState("");
  const [formValues, setFormValues] = useState([
    {
      BMName: "",
      address: "",
      contactNumber: "",
      pincode: "",
      city: "",
      state: "",
      // bemail: "",
      // BgstNumber: "",
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

  let addFormFields = () => {
    setFormValues([
      ...formValues,
      {
        BMName: "",
        address: "",
        contactNumber: "",
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
          // setRoleList(ShowList);
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
      settransporterType("Create");
    } else {
      settransporterType("View");

      _Get(View_TransporterByID, Params?.id)
        .then((res) => {
          let transporter = res?.Transporter;
          setFormValues(transporter?.serviceArea);
          setFormData(res?.Transporter);
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (formData?.serviceArea) {
      delete formData?.serviceArea;
    }
    if (formData?.image) {
      delete formData?.image;
    }
    if (BulkImport !== null || BulkImport != undefined) {
      let formdata = new FormData();
      formdata.append("file", BulkImport);

      await _BulkUpload(Bulk_Upload_Customer, formdata)
        .then((res) => {
          swal(`${res?.message}`);
        })
        .catch((err) => {
          console.log(err);
          swal("Something Went Wrong");
        });
    } else {
      let formdata = new FormData();
      for (const [key, value] of Object.entries(formData)) {
        formdata.append(`${key}`, `${value}`);
        // console.log(key, value);
      }

      if (formValues?.length) {
        formdata.append("serviceArea", JSON.stringify(formValues));
      }

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

              if (res.status) {
                history.goBack();
                swal("Transporter Created Successfully");
              }
            })
            .catch((err) => {
              console.log(err.response);
              swal("Please Fill correct details");
            });
        } else {
          _Put(Update_TransporterByID, Params?.id, formdata)
            .then((res) => {
              console.log(res);
              if (res.status) {
                history.goBack();
                swal("Transporter Updated Successfully");
              }
            })
            .catch((err) => {
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
    console.log(Image);
    console.log(formValues);
  }, [formData]);
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
                    <Col lg="3" md="3">
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
                    <Col lg="2" md="2">
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
              <Col lg="2" md="2">
                <div className="float-right">
                  <Route
                    render={({ history }) => (
                      <Button
                        style={{ cursor: "pointer" }}
                        className="float-right mr-1"
                        color="primary"
                        onClick={() =>
                          history.push("/app/ajgroup/CreateTransportList")
                        }>
                        {" "}
                        Back
                        {/* <FaPlus size={15} /> Create User */}
                      </Button>
                    )}
                  />
                </div>
              </Col>
            )}
          </Row>
          {/* <hr /> */}

          <CardBody>
            {BulkUpload && BulkUpload ? (
              <>
                <Form className="m-1" onSubmit={submitHandler}>
                  <Row>
                    <Col lg="6" md="6" sm="6" xs="12">
                      <div className="d-flex justify-content-center">
                        <Label>Bulk Import(.xlsx Only)</Label>
                      </div>

                      <div className="parent">
                        <div className="file-upload">
                          <FaUpload color="green" size={35} />

                          <p>Click box to upload</p>
                          {/* <p>Maximun file size 10mb</p> */}
                          <input
                            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            type="file"
                            name="Photo"
                            onChange={(e) => {
                              setBulkImport(e.target.files[0]);
                            }}
                          />
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row>
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
                  </Row>
                </Form>
              </>
            ) : (
              <>
                {/* start  */}

                <Form className="m-1" onSubmit={submitHandler}>
                  <Row>
                    <Col lg="12" md="12" sm="12">
                      <Row>
                        <Col className="mb-2" lg="12" md="12" sm="12">
                          <CardBody className="userRegiBody">
                            <div className="d-flex justify-content-center">
                              <h1>
                                {transporterType && transporterType} Information
                              </h1>
                            </div>
                            <Row>
                              <Col lg="4" md="4" xl="4" sm="12">
                                <FormGroup>
                                  <Label>
                                    Name <span style={{ color: "red" }}>*</span>
                                  </Label>
                                  <Input
                                    readOnly
                                    required
                                    placeholder="Enter Last Name"
                                    type="text"
                                    name="name"
                                    value={formData?.name}
                                    onChange={handleInputChange}
                                  />
                                </FormGroup>
                              </Col>
                              <Col lg="4" md="4" xl="4" sm="12">
                                <FormGroup>
                                  <Label>
                                    Contact Number{" "}
                                    <span style={{ color: "red" }}>*</span>{" "}
                                  </Label>
                                  <PhoneInput
                                    required
                                    readOnly
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

                              <Col lg="4" md="4" xl="4" sm="12">
                                <FormGroup>
                                  <Label>
                                    Pin Code Number{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </Label>
                                  <Input
                                    readOnly
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
                                          (ele) =>
                                            ele?.Pincode == e.target.value
                                        );
                                      // console.log(SelectedCity);
                                      if (SelectedCity?.length) {
                                        setFormData({
                                          ...formData,
                                          ["state"]: SelectedCity[0]?.StateName,
                                          ["city"]: SelectedCity[0]?.District,
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

                              <Col lg="4" md="4" xl="4" sm="12">
                                <FormGroup>
                                  <Label>City</Label>
                                  <Input
                                    readOnly
                                    placeholder="City name"
                                    type="text"
                                    name="city"
                                    value={formData?.city}
                                  />
                                </FormGroup>
                              </Col>
                              <Col lg="4" md="4" xl="4" sm="12">
                                <FormGroup>
                                  <Label>State</Label>
                                  <Input
                                    readOnly
                                    placeholder="State name"
                                    type="text"
                                    name="state"
                                    value={formData?.state}
                                  />
                                </FormGroup>
                              </Col>

                              <Col lg="4" md="4" xl="4" sm="12">
                                <Label>
                                  GST Number
                                  <span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input
                                  type="text"
                                  required
                                  readOnly
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
                                      (async () => {
                                        await _Get(GST_Verification_Api, value)
                                          .then((res) => {
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
                                              });
                                            } else {
                                              setFormData({
                                                ...formData,
                                                ["companyName"]: "",
                                                ["address1"]: "",
                                                ["address2"]: "",
                                                ["gstNumber"]: e.target.value,
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
                              <Col lg="4" md="4" xl="4" sm="12">
                                <FormGroup>
                                  <Label>Company Name</Label>
                                  <Input
                                    readOnly
                                    className="form-control"
                                    placeholder="Company Name"
                                    type="text"
                                    name="companyName"
                                    value={formData?.companyName}
                                    onChange={handleInputChange}
                                  />
                                </FormGroup>
                              </Col>
                              <Col lg="4" md="4" xl="4" sm="12">
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
                              <Col lg="4" md="4" xl="4" sm="12">
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
                              <Col lg="4" md="4" xl="4" sm="12">
                                <FormGroup>
                                  <Label>Email Id</Label>
                                  <Input
                                    readOnly
                                    placeholder="last job firm name"
                                    type="email"
                                    name="email"
                                    value={formData?.email}
                                    onChange={handleInputChange}
                                  />
                                </FormGroup>
                              </Col>
                              <Col lg="4" md="4" xl="4" sm="12">
                                <FormGroup>
                                  <Label>Id</Label>
                                  <Input
                                    readOnly
                                    placeholder="id"
                                    type="text"
                                    name="id"
                                    value={formData?.id}
                                    onChange={handleInputChange}
                                  />
                                </FormGroup>
                              </Col>
                              <Col lg="4" md="4" xl="4" sm="12">
                                <FormGroup>
                                  <Label>
                                    Password{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </Label>
                                  <Input
                                    readOnly
                                    required
                                    placeholder="Enter Password here"
                                    type="password"
                                    name="password"
                                    value={formData?.password}
                                    onChange={handleInputChange}
                                  />
                                </FormGroup>
                              </Col>
                              <Col
                                className="mt-2 mb-2"
                                lg="12"
                                md="12"
                                sm="12">
                                <Row>
                                  <Col lg="6" md="6" sm="6" xs="12">
                                    <div className="d-flex justify-content-center">
                                      <Label>Image</Label>
                                    </div>

                                    <div className="parent">
                                      <div className="file-upload">
                                        <FaUpload color="green" size={35} />

                                        <p>Click box to upload</p>
                                        {/* <p>Maximun file size 10mb</p> */}
                                        <input
                                          readOnly
                                          type="file"
                                          name="Photo"
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
                            </Row>
                          </CardBody>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  {formValues?.length > 0 &&
                    formValues?.map((element, index) => (
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
                          <Col
                            className="mb-2"
                            key={index}
                            lg="4"
                            md="4"
                            sm="12">
                            <Label>Branch Manager Name</Label>
                            <Input
                              readOnly
                              type="text"
                              placeholder="Branch Manage Name"
                              name="BMName"
                              value={element.BMName || ""}
                              onChange={(e) => handleChange(index, e)}
                            />
                          </Col>
                          <Col lg="4" md="4" sm="12">
                            <FormGroup>
                              <Label>
                                Pin Code Number{" "}
                                <span style={{ color: "red" }}>*</span>
                              </Label>
                              <Input
                                readOnly
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
                              <Label>City</Label>
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
                          <Col lg="4" md="4" sm="12">
                            <FormGroup>
                              <Label>State</Label>
                              <Input
                                readOnly
                                placeholder="State name"
                                type="text"
                                name="state"
                                value={element.state || ""}
                                // onChange={handleInputChange}
                              />
                            </FormGroup>
                          </Col>
                          <Col
                            className="mb-2"
                            key={index}
                            lg="4"
                            md="4"
                            sm="12">
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
                          <Col
                            className="mb-2"
                            key={index}
                            lg="4"
                            md="4"
                            sm="12">
                            <Label>Contact Number</Label>
                            <Input
                              readOnly
                              minLength={10}
                              maxLength={10}
                              type="number"
                              placeholder="Branch Contact Number"
                              name="contactNumber"
                              value={element.contactNumber || ""}
                              onChange={(e) => handleChange(index, e)}
                            />
                          </Col>
                        </Row>
                      </>
                    ))}

                  <Row>
                    <Col lg="6" md="6" sm="6" className="mb-2 mt-1">
                      <Label className="mb-0">Status</Label>
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
                        <span style={{ marginRight: "20px" }}>Active</span>

                        <input
                          required
                          checked={formData?.status == "Deactive"}
                          style={{ marginRight: "3px" }}
                          type="radio"
                          name="status"
                          value="Deactive"
                        />
                        <span style={{ marginRight: "3px" }}>Deactive</span>
                      </div>
                    </Col>
                  </Row>
                </Form>

                {/* end new */}
              </>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
export default CreateCustomer;
