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
import Multiselect from "multiselect-react-dropdown";
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
  CreateCustomerUpdate,
  CreateCustomersave,
  CreateCustomerxmlView,
  Get_RoleList,
  _BulkUpload,
  _Get,
  _GetList,
  _Post,
  _PostSave,
} from "../../../../ApiEndPoint/ApiCalling";

import "../../../../assets/scss/pages/users.scss";
import UserContext from "../../../../context/Context";

import { FaUpload } from "react-icons/fa";
import {
  Bulk_Upload_Customer,
  Create_Transporter_List,
  GST_Verification_Api,
  Image_URL,
  Pan_Verification_API,
  Pan_Verification_key,
  View_CustomerGroup,
  View_Customer_ById,
  country_state_City_List,
} from "../../../../ApiEndPoint/Api";
import { MdCancel } from "react-icons/md";
let TransPorterToShow = [];
const CreateCustomer = () => {
  const [Country_State_city, setCountry_State_city] = useState([]);

  const [TransporterList, setTransporterList] = useState([]);
  const [AllTransporterList, setAllTransporterList] = useState([]);
  const [Countries, setCountry] = useState({});
  const [BulkImport, setBulkImport] = useState(null);
  const [States, setState] = useState({});
  const [Image, setImage] = useState({});
  const [PhotoImage, setPhotoimags] = useState([]);
  const [Cities, setCities] = useState({});
  const [Selectedtransporter, setSelectedtransporter] = useState([]);
  const [imageUri, setImageUris] = useState([]);
  const [formData, setFormData] = useState({});

  const [CustomerGroup, setCustomerGroup] = useState([]);
  const [Mode, setMode] = useState("Create");
  const [error, setError] = useState("");
  const [BulkUpload, setBulkUpload] = useState(false);

  const Context = useContext(UserContext);
  let history = useHistory();
  let Params = useParams();

  const handleInputChange = (e, type, i) => {
    const { name, value, checked } = e.target;
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
        setFormData({
          ...formData,
          [name]: Number(value),
        });
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
          // console.log(value);
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
      .then(res => {
        setCountry_State_city(res);
      })
      .catch(err => {
        console.log(err);
      });
    if (Params?.id == 0) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const date = new Date(position.timestamp);
            const CurentTime = date.toLocaleString();
            formData.geotagging = `${position.coords.latitude},${position.coords.longitude}`;
          },
          error => {
            swal(`Error: ${error}`);
          },
          { timeout: 10000, enableHighAccuracy: true }
        );
      } else {
        swal(`Error: Geolocation not found`);
      }
    }
  }, []);

  useEffect(() => {
    let userData = JSON.parse(localStorage.getItem("userData"));

    _Get(Create_Transporter_List, userData?.database)
      .then(res => {
        let value = res?.Transporter;

        if (value?.length) {
          setTransporterList(value);
          setAllTransporterList(value);
        }
      })
      .catch(err => {
        console.log(err);
      });
    if (Params?.id == 0) {
      setMode("Create");
    } else {
      setMode("View");

      _Get(View_Customer_ById, Params?.id)
        .then(res => {
          let value = res?.Customer;

          let object = { ...value };
          object.category = object?.category?._id;
          setFormData(object);

          if (value?.assignTransporter?.length) {
            setSelectedtransporter(value?.assignTransporter);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, []);

  useEffect(() => {
    let userdata = JSON.parse(localStorage.getItem("userData"));
    _Get(View_CustomerGroup, userdata?.database)
      .then(res => {
        let myActive = res?.CustomerGroup?.filter(
          ele => ele?.status == "Active"
        );
        setCustomerGroup(myActive);
      })
      .catch(err => {
        console.log(err);
      });
    if (Params?.id == 0) {
      Get_RoleList(userdata?._id, userdata?.database)
        .then(res => {
          let ShowList = res?.Role?.filter((item, i) =>
            item?.roleName?.toLowerCase()?.includes("customer")
          );
          setFormData({
            ...formData,
            ["rolename"]: ShowList[0]?._id,
            ["roleName"]: ShowList[0]?.roleName,
          });
        })
        .catch(err => {
          console.log(err);
          swal("Roles List Not found");
        });
    }
  }, []);

  const handleVerifyCompanyPan = async inputPan => {
    let payload = {
      api_key: Pan_Verification_key,
      pan: inputPan,
    };
    await _PostSave(Pan_Verification_API, payload)
      .then(res => {
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
      .catch(err => {
        console.log(err);
      });
  };

  const submitHandler = async e => {
    e.preventDefault();
    let formdata = new FormData();
    console.log(formData);
    if (formData?.assignTransporter) {
      delete formData?.assignTransporter;
    }
    if (formData?.shopPhoto) {
      delete formData?.shopPhoto;
    }
    if (BulkImport !== null || BulkImport != undefined) {
      formdata.append("file", BulkImport);

      await _BulkUpload(Bulk_Upload_Customer, formdata)
        .then(res => {
          swal(`${res?.message}`);
        })
        .catch(err => {
          console.log(err);
          swal("Something Went Wrong");
        });
    } else {
      let userdata = JSON.parse(localStorage.getItem("userData"));
      for (const [key, value] of Object.entries(formData)) {
        formdata.append(`${key}`, `${value}`);
      }

      if (Image !== null) {
        formdata.append("file", Image);
      }
      if (PhotoImage?.length) {
        PhotoImage?.map(ele => {
          formdata.append("files", ele);
        });
      }
      // if (Params?.id == 0) {
      if (Selectedtransporter?.length) {
        formdata.append(
          "assignTransporter",
          JSON.stringify(Selectedtransporter)
        );
      }
      // }

      // formdata.append("status", formData?.status);

      // formdata.append("rolename", formData?.rolename);
      for (let [key, value] in formdata.values()) {
        console.log(key), value;
      }

      if (error) {
      } else {
        if (Params?.id == 0) {
          formdata.append("database", userdata?.database);

          CreateCustomersave(formdata)
            .then(res => {
              console.log(res);
              setFormData({});
              if (res.status) {
                history.goBack();
                swal("Customer Created Successfully");
              }
            })
            .catch(err => {
              console.log(err.response);
              swal("something Went Wrong");
            });
        } else {
          CreateCustomerUpdate(Params?.id, formdata)
            .then(res => {
              console.log(res);
              setFormData({});
              if (res.status) {
                history.goBack();
                swal("Customer Updated Successfully");
              }
            })
            .catch(err => {
              console.log(err.response);
              swal("something Went Wrong");
            });

          // CreateCustomerUpdate
        }
      }
    }
  };
  const handleSetShowTransporter = VALUE => {
    let list = [...AllTransporterList];
    TransPorterToShow = [];
    list?.map(ele => {
      ele?.City?.map(val => {
        if (val?.name.includes(formData?.City)) {
          TransPorterToShow?.push(ele);
        }
      });
    });

    setTransporterList(TransPorterToShow);
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const onSelect1 = (selectedList, selectedItem) => {
    setSelectedtransporter(selectedList);
    // console.log(selectedList);
  };
  const onRemove1 = (selectedList, selectedItem) => {
    // console.log(selectedList);
    setSelectedtransporter(selectedList);
  };

  return (
    <div>
      <div>
        <Card>
          <Row className="m-2">
            <Col lg="3" md="3">
              <h1 className="float-left">{Mode && Mode} Customer</h1>
            </Col>
            <Col></Col>
            {Params?.id == 0 && (
              <>
                {!BulkUpload && !BulkUpload ? (
                  <>
                    <Col lg="2" md="2" xs="8">
                      <Button
                        color="primary"
                        onClick={e => {
                          e.preventDefault();
                          setBulkUpload(true);
                        }}
                      >
                        Bulk Upload
                      </Button>
                    </Col>
                  </>
                ) : (
                  <>
                    <Col lg="2" md="2" xs="12">
                      <Button
                        className="p-1"
                        color="primary"
                        onClick={e => {
                          e.preventDefault();
                          setBulkUpload(false);
                        }}
                      >
                        Back
                      </Button>
                    </Col>
                  </>
                )}
              </>
            )}
            {Params?.id == 0 && (
              <>
                {!BulkUpload && !BulkUpload && (
                  <>
                    <Col lg="2" md="2" xs="4">
                      <div className="float-right">
                        <Route
                          render={({ history }) => (
                            <Button
                              style={{ cursor: "pointer" }}
                              className="float-right mr-1"
                              color="primary"
                              onClick={() =>
                                history.push(
                                  `/app/ajgroup/house/CustomerGroupList`
                                )
                              }
                            >
                              {" "}
                              + Group
                            </Button>
                          )}
                        />
                      </div>
                    </Col>
                  </>
                )}
              </>
            )}
            <Col lg="2" md="2">
              <div className="float-right">
                <Route
                  render={({ history }) => (
                    <Button
                      style={{ cursor: "pointer" }}
                      className="float-right mr-1"
                      color="primary"
                      onClick={() =>
                        history.push("/app/SoftNumen/CustomerSearch")
                      }
                    >
                      Back
                    </Button>
                  )}
                />
              </div>
            </Col>
          </Row>
          {/* <hr /> */}

          <CardBody>
            {BulkUpload && BulkUpload ? (
              <>
                <Form className="m-1" onSubmit={submitHandler}>
                  <Row>
                    <Col lg="6" md="6" sm="6" xs="12">
                      <div className="d-flex justify-content-center">
                        <Label>Upload</Label>
                      </div>

                      <div className="parent">
                        <div className="file-upload">
                          <FaUpload color="green" size={35} />

                          <p>Click box to upload</p>
                          {/* <p>Maximun file size 10mb</p> */}
                          <input
                            type="file"
                            name="BulkImport"
                            onChange={e => {
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
                          className="mr-1 mt-2 mx-2"
                        >
                          Import
                        </Button.Ripple>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </>
            ) : (
              <>
                <Form className="m-1" onSubmit={submitHandler}>
                  <Row>
                    <Col lg="6" md="6">
                      <CardBody className="userRegiBody">
                        <div className="d-flex justify-content-center">
                          <h1>Personal Information</h1>
                        </div>
                        <Row style={{ paddingBottom: "9rem" }}>
                          <Col lg="6" md="6" sm="12">
                            <FormGroup>
                              <Label>
                                First Name
                                {/* <span style={{ color: "red" }}>*</span> */}
                              </Label>
                              <Input
                                readOnly
                                // required
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
                                {/* <span style={{ color: "red" }}>*</span> */}
                              </Label>
                              <Input
                                readOnly
                                // required
                                placeholder="Enter Last Name"
                                type="text"
                                name="lastName"
                                value={formData?.lastName}
                                onChange={handleInputChange}
                              />
                            </FormGroup>
                          </Col>
                          <Col lg="6" md="6" sm="12">
                            <FormGroup>
                              <Label>
                                Owner Name{" "}
                                <span style={{ color: "red" }}>*</span>
                              </Label>
                              <Input
                                readOnly
                                required
                                placeholder="Enter Last Name"
                                type="text"
                                name="ownerName"
                                value={formData?.ownerName}
                                onChange={handleInputChange}
                              />
                            </FormGroup>
                          </Col>

                          <Col lg="6" md="6" sm="12">
                            <FormGroup>
                              <Label>
                                Mobile Number{" "}
                                <span style={{ color: "red" }}>*</span>{" "}
                              </Label>
                              <PhoneInput
                                readOnly
                                required
                                inputClass="myphoneinput"
                                country={"in"}
                                onKeyDown={e => {
                                  ["e", "E", "+", "-"].includes(e.key) &&
                                    e.preventDefault();
                                }}
                                countryCodeEditable={false}
                                name="mobileNumber"
                                value={JSON.stringify(formData?.mobileNumber)}
                                // value={formData.mobileNumber}
                                onChange={phone => {
                                  setFormData({
                                    ...formData,
                                    ["mobileNumber"]: Number(phone),
                                  });
                                }}
                              />
                            </FormGroup>
                          </Col>

                          <Col lg="6" md="6" sm="12">
                            <FormGroup>
                              <Label>Passport Number</Label>
                              <Input
                                readOnly
                                placeholder="Enter Passport number"
                                type="text"
                                name="passPortNo"
                                value={formData?.passPortNo}
                                onChange={handleInputChange}
                              />
                            </FormGroup>
                          </Col>

                          <Col lg="6" md="6" sm="12">
                            <FormGroup>
                              <Label>
                                Aadhar Number{" "}
                                <span style={{ color: "red" }}>*</span>
                              </Label>
                              <Input
                                readOnly
                                required
                                minLength={12}
                                maxLength={12}
                                pattern="[0-9]*"
                                placeholder="Enter Addhar Number"
                                type="number"
                                name="aadharNo"
                                value={formData?.aadharNo}
                                onChange={e => {
                                  const inputPan = e.target.value;
                                  const panRegex = /^\d{12}$/;

                                  setFormData({
                                    ...formData,
                                    ["aadharNo"]: Number(inputPan),
                                    ["IsValid_Aadhar_No"]:
                                      panRegex.test(inputPan),
                                  });
                                }}
                              />
                              <span>
                                {formData?.IsValid_Aadhar_No &&
                                formData?.IsValid_Aadhar_No ? (
                                  <>
                                    <span style={{ color: "green" }}>
                                      Correct
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    {formData?.aadharNo?.length > 16 ||
                                      (formData?.aadharNo?.length < 15 && (
                                        <span style={{ color: "red" }}>
                                          Enter Correct AadharNo
                                        </span>
                                      ))}
                                  </>
                                )}
                              </span>
                            </FormGroup>
                          </Col>
                          <Col lg="6" md="6" sm="12">
                            <FormGroup>
                              <Label>
                                Pan Number{" "}
                                <span style={{ color: "red" }}>*</span>
                              </Label>
                              <Input
                                required
                                readOnly
                                minLength={10}
                                maxLength={10}
                                placeholder="Enter Pan Number"
                                type="text"
                                name="panNo"
                                value={formData?.panNo}
                                onChange={e => {
                                  const inputPan =
                                    e.target.value?.toUpperCase();
                                  const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
                                  setFormData({
                                    ...formData,
                                    ["panNo"]: inputPan,
                                    ["IsValid_Pan_No"]: panRegex.test(inputPan),
                                  });
                                }}
                              />
                              <span>
                                {formData?.IsValid_Pan_No &&
                                formData?.IsValid_Pan_No ? (
                                  <>
                                    <span style={{ color: "green" }}>
                                      Correct
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    {formData?.panNo?.length > 9 && (
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
                              <Label>
                                Pin Code Number{" "}
                                <span style={{ color: "red" }}>*</span>
                              </Label>
                              <Input
                                readOnly
                                required
                                onKeyDown={e => {
                                  ["e", "E", "+", "-"].includes(e.key) &&
                                    e.preventDefault();
                                }}
                                type="number"
                                placeholder="Enter Pin Code here"
                                name="personalPincode"
                                value={formData?.personalPincode}
                                onChange={e => {
                                  let SelectedCity = Country_State_city?.filter(
                                    ele => ele?.Pincode == e.target.value
                                  );
                                  // console.log(SelectedCity);
                                  if (SelectedCity?.length) {
                                    setFormData({
                                      ...formData,
                                      ["Pstate"]: SelectedCity[0]?.StateName,
                                      ["Pcity"]: SelectedCity[0]?.District,
                                      ["personalPincode"]: Number(
                                        e.target.value
                                      ),
                                    });
                                  } else {
                                    setFormData({
                                      ...formData,
                                      ["personalPincode"]: Number(
                                        e.target.value
                                      ),
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
                                name="Pcity"
                                value={formData?.Pcity}
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
                                name="Pstate"
                                value={formData?.Pstate}
                                // onChange={handleInputChange}
                              />
                            </FormGroup>
                          </Col>
                          <Col lg="6" md="6" sm="12">
                            <FormGroup>
                              <Label>
                                Address
                                <span style={{ color: "red" }}>*</span>
                              </Label>
                              <Input
                                required
                                readOnly
                                className="form-control"
                                placeholder="address name"
                                type="text"
                                name="address"
                                value={formData?.address}
                                onChange={handleInputChange}
                              />
                            </FormGroup>
                          </Col>
                          <Col className="mt-2 mb-2" lg="12" md="12" sm="12">
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
                                      type="file"
                                      name="Photo"
                                      // onChange={(e) => {
                                      //   const fiels = e.target.files[0];

                                      //   setImage(fiels);
                                      //   if (fiels) {
                                      //     const reader = new FileReader();
                                      //     reader.onload = (e) => {
                                      //       setFormData({
                                      //         ...formData,

                                      //         ["PhotoUrl"]: e.target.result,
                                      //       });
                                      //     };
                                      //     reader.readAsDataURL(fiels);
                                      //   }
                                      // }}
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

                              {formData?.Photo && formData?.Photo && (
                                <Col lg="6" md="6" sm="12">
                                  <img
                                    style={{ borderRadius: "8px" }}
                                    src={`${Image_URL}/Images/${formData?.Photo}`}
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
                    <Col lg="6" md="6">
                      <CardBody className="userRegiBody">
                        <div className="d-flex justify-content-center">
                          <h1>Company Information</h1>
                        </div>
                        <Row>
                          <Col lg="6" md="6" sm="12">
                            <FormGroup>
                              <Label className="">Party Type</Label>
                              <CustomInput
                                readOnly
                                name="partyType"
                                value={formData?.partyType}
                                onChange={e => {
                                  setFormData({
                                    ...formData,
                                    ["partyType"]: e.target.value,
                                  });
                                }}
                                type="select"
                              >
                                <option value="Debtor">Debtor</option>
                                <option value="Creditor">Creditor</option>
                              </CustomInput>
                            </FormGroup>
                          </Col>
                          <Col lg="6" md="6" sm="12">
                            <FormGroup>
                              <Label className="">Registration Type</Label>
                              <CustomInput
                                readOnly
                                name="registrationType"
                                value={formData?.registrationType}
                                onChange={e => {
                                  setFormData({
                                    ...formData,
                                    ["registrationType"]: e.target.value,
                                  });
                                }}
                                type="select"
                              >
                                <option value="UnKnown">UnKnown</option>
                                <option value="Regular">Regular</option>
                                <option value="UnRegister">UnRegister</option>
                              </CustomInput>
                            </FormGroup>
                          </Col>
                          {formData?.registrationType !== "UnKnown" && (
                            <>
                              {formData?.registrationType !== "UnRegister" && (
                                <>
                                  <Col sm="12" lg="6" md="6">
                                    <Label>
                                      GST Number
                                      <span style={{ color: "red" }}>*</span>
                                    </Label>
                                    <Input
                                      readOnly
                                      type="text"
                                      required
                                      minLength={15}
                                      maxLength={15}
                                      name="gstNumber"
                                      className="from-control"
                                      placeholder=" Enter Correct GST Number"
                                      value={formData?.gstNumber}
                                      onChange={e => {
                                        let value = e.target.value;

                                        if (value?.length == 15) {
                                          (async () => {
                                            await _Get(
                                              GST_Verification_Api,
                                              value
                                            )
                                              .then(res => {
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
                                                    ["CompanyName"]:
                                                      res?.data?.tradeNam,
                                                    ["address1"]: part1,
                                                    ["address2"]: part2,
                                                  });
                                                } else {
                                                  setFormData({
                                                    ...formData,
                                                    ["CompanyName"]: "",
                                                    ["address1"]: "",
                                                    ["address2"]: "",
                                                  });
                                                }
                                              })
                                              .catch(err => {
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
                                    readOnly
                                    required
                                    minLength={10}
                                    maxLength={10}
                                    placeholder="Enter Company Pan Number"
                                    type="text"
                                    name="comPanNo"
                                    value={formData?.comPanNo}
                                    onChange={e => {
                                      const inputPan =
                                        e.target.value?.toUpperCase();
                                      const panRegex =
                                        /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
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
                            </>
                          )}
                          <Col lg="6" md="6" sm="12">
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
                          <Col lg="6" md="6" sm="12">
                            <FormGroup>
                              <Label>Id</Label>
                              <Input
                                readOnly
                                placeholder="ID"
                                type="text"
                                name="id"
                                value={formData?.id}
                                onChange={handleInputChange}
                              />
                            </FormGroup>
                          </Col>
                          <Col lg="6" md="6" sm="12">
                            <FormGroup>
                              <Label>Deals in Prouduct</Label>
                              <Input
                                readOnly
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
                                readOnly
                                placeholder="Deals In Products"
                                type="number"
                                name="annualTurnover"
                                value={formData?.annualTurnover}
                                onChange={e => {
                                  setFormData({
                                    ...formData,
                                    ["annualTurnover"]: Number(e.target.value),
                                  });
                                }}
                              />
                            </FormGroup>
                          </Col>
                          {formData?.registrationType == "UnRegister" ? (
                            <>
                              <Col lg="6" md="6" sm="12">
                                <FormGroup>
                                  <Label>Company Name</Label>
                                  <Input
                                    readOnly
                                    className="form-control"
                                    placeholder="Company Name"
                                    type="text"
                                    name="CompanyName"
                                    value={formData?.CompanyName}
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
                                    name="CompanyName"
                                    value={formData?.CompanyName}
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
                                readOnly
                                className="form-control"
                                placeholder="last job firm name"
                                type="text"
                                name="contactNumber"
                                value={formData?.contactNumber}
                                onChange={e => {
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
                                readOnly
                                onKeyDown={e => {
                                  ["e", "E", "+", "-"].includes(e.key) &&
                                    e.preventDefault();
                                }}
                                type="number"
                                placeholder="Enter Pin Code here"
                                name="pincode"
                                value={formData?.pincode}
                                onChange={e => {
                                  let SelectedCity = Country_State_city?.filter(
                                    ele => ele?.Pincode == e.target.value
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
                                ShopSize <span style={{ color: "red" }}>*</span>
                              </Label>
                              <Input
                                readOnly
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
                                      readOnly
                                      multiple
                                      type="file"
                                      name="shopPhotos"
                                      onChange={e => {
                                        let allimages = Array.from(
                                          e.target.files
                                        );
                                        setPhotoimags(allimages);
                                        setFormData({
                                          ...formData,
                                          ["shopPhotos"]: allimages,
                                        });
                                        const fiels = e.target.files;
                                        for (let i = 0; i < fiels.length; i++) {
                                          const reader = new FileReader();
                                          reader.onload = event => {
                                            setImageUris(prevUris => [
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
                                        <span
                                          onClick={() => {
                                            let uri = [...imageUri];
                                            uri.splice(i, 1);
                                            setImageUris(uri);
                                          }}
                                        >
                                          <span
                                            style={{
                                              cursor: "pointer",
                                              position: "absolute",
                                              right: 40,
                                              color: "red",
                                            }}
                                          >
                                            <MdCancel color="red" size="30" />
                                          </span>
                                        </span>
                                        <img
                                          style={{ borderRadius: "8px" }}
                                          src={ele}
                                          className="p-1"
                                          height={140}
                                          width="90%"
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
                                    sm="6"
                                  >
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
                  </Row>
                  <Row>
                    <Col>
                      <CardBody className="userRegiBody mt-2 mb-2">
                        <div className="d-flex justify-content-center">
                          <h1>Other information</h1>
                        </div>
                        <Row>
                          <Col lg="6" md="6">
                            <FormGroup>
                              <Label>
                                Password <span style={{ color: "red" }}>*</span>
                              </Label>
                              <Input
                                required
                                readOnly
                                placeholder="Enter Password here"
                                type="password"
                                name="password"
                                value={formData?.password}
                                onChange={handleInputChange}
                              />
                            </FormGroup>
                          </Col>
                          <Col lg="6" md="6">
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
                          <Col llg="6" md="6">
                            <FormGroup>
                              <Label className="">
                                Category <span style={{ color: "red" }}>*</span>
                              </Label>
                              <CustomInput
                                readOnly
                                name="category"
                                value={formData?.category}
                                onChange={e => {
                                  setFormData({
                                    ...formData,
                                    ["category"]: e.target.value,
                                  });
                                }}
                                type="select"
                              >
                                {/* { } <option>--Select Category--</option> */}
                                {CustomerGroup &&
                                  CustomerGroup?.map((ele, i) => (
                                    <option key={ele?._id} value={ele?._id}>
                                      {ele?.groupName} Discount:{ele?.discount}{" "}
                                      Grade: {ele?.grade}
                                    </option>
                                  ))}
                              </CustomInput>
                            </FormGroup>
                          </Col>
                          <Col lg="6" md="6">
                            <FormGroup>
                              <Label>
                                Due Date <span style={{ color: "red" }}>*</span>
                              </Label>
                              <Input
                                required
                                readOnly
                                className="form-control"
                                placeholder="Due Date"
                                type="number"
                                name="duedate"
                                value={formData?.duedate}
                                onChange={e => {
                                  setFormData({
                                    ...formData,
                                    ["duedate"]: Number(e.target.value),
                                  });
                                }}
                              />
                            </FormGroup>
                          </Col>
                          <Col llg="6" md="6">
                            <FormGroup>
                              <Label>
                                Lock In Time{" "}
                                <span style={{ color: "red" }}>*</span>
                              </Label>
                              <Input
                                required
                                readOnly
                                className="form-control"
                                placeholder="Lock In time in days"
                                type="number"
                                name="lockInTime"
                                value={formData?.lockInTime}
                                onChange={e => {
                                  setFormData({
                                    ...formData,
                                    ["lockInTime"]: Number(e.target.value),
                                  });
                                }}
                              />
                            </FormGroup>
                          </Col>
                          <Col lg="6" md="6">
                            <FormGroup>
                              <Label>
                                Limit <span style={{ color: "red" }}>*</span>
                              </Label>
                              <Input
                                required
                                readOnly
                                className="form-control"
                                placeholder="Lock In time in days"
                                type="number"
                                name="limit"
                                value={formData?.limit}
                                onChange={e => {
                                  setFormData({
                                    ...formData,
                                    ["limit"]: Number(e.target.value),
                                  });
                                }}
                              />
                            </FormGroup>
                          </Col>
                          <Col lg="6" md="6">
                            <FormGroup>
                              <Label>
                                Payment Term{" "}
                                <span style={{ color: "red" }}>*</span>
                              </Label>
                              <Input
                                required
                                readOnly
                                className="form-control"
                                placeholder="Lock In time in days"
                                type="number"
                                name="paymentTerm"
                                value={formData?.paymentTerm}
                                onChange={e => {
                                  setFormData({
                                    ...formData,
                                    ["paymentTerm"]: Number(e.target.value),
                                  });
                                }}
                              />
                            </FormGroup>
                          </Col>
                          <Col lg="6" md="6">
                            <FormGroup>
                              <Label>Transporter Details</Label>
                              <CustomInput
                                readOnly
                                name="transporterDetail"
                                value={formData?.transporterDetail}
                                onChange={e => {
                                  if (e.target.value == "other") {
                                    handleSetShowTransporter(e.target.value);
                                  }
                                  setFormData({
                                    ...formData,
                                    ["transporterDetail"]: Number(
                                      e.target.value
                                    ),
                                  });
                                }}
                                type="select"
                              >
                                <option value={null}>
                                  --Select Transporter Type--
                                </option>
                                <option value={0}>Local</option>
                                <option value={1}>Other</option>
                              </CustomInput>
                            </FormGroup>
                          </Col>
                          {formData?.transporterDetail == 1 &&
                          formData?.transporterDetail == 1 ? (
                            <>
                              <Col lg="6" md="6">
                                <FormGroup>
                                  <Label className="mb-1">
                                    Transporter List
                                  </Label>
                                  <Multiselect
                                    required
                                    readOnly
                                    isObject="false"
                                    options={TransporterList} // Options to display in the dropdown
                                    selectedValues={
                                      Selectedtransporter && Selectedtransporter
                                    } // Preselected value to persist in dropdown
                                    onSelect={onSelect1} // Function will trigger on select event
                                    onRemove={onRemove1} // Function will trigger on remove event
                                    displayValue="firstName" // Property name to display in the dropdown options
                                  />
                                </FormGroup>
                              </Col>
                            </>
                          ) : null}
                          <Col lg="6" md="6">
                            <FormGroup>
                              <Label>
                                Service Area{" "}
                                <span style={{ color: "red" }}>*</span>
                              </Label>
                              <textarea
                                readOnly
                                required
                                rows={3}
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
                    </Col>
                  </Row>
                  {/* <Row>
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
                  </Row> */}
                  {/* <Row>
                    <Col>
                      <div className="d-flex justify-content-center">
                        <Button.Ripple
                          color="primary"
                          type="submit"
                          className="mr-1 mt-2 mx-2">
                          Submit
                        </Button.Ripple>
                      </div>
                    </Col>
                  </Row> */}
                </Form>
              </>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
export default CreateCustomer;

// import React, { useEffect, useState, useContext } from "react";
// import {
//   Card,
//   CardBody,
//   Col,
//   Form,
//   Row,
//   Input,
//   Label,
//   Button,
//   FormGroup,
//   CustomInput,
//   Badge,
// } from "reactstrap";
// import Multiselect from "multiselect-react-dropdown";
// import { history } from "../../../../history";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import { Country, State, City } from "country-state-city";
// import Select from "react-select";
// import moment from "moment-timezone";
// import { Route, useHistory, useParams } from "react-router-dom";

// import swal from "sweetalert";
// import "../../../../../src/layouts/assets/scss/pages/users.scss";

// import {
//   CreateCustomerUpdate,
//   CreateCustomersave,
//   CreateCustomerxmlView,
//   Get_RoleList,
//   _BulkUpload,
//   _Get,
//   _GetList,
//   _Post,
//   _PostSave,
// } from "../../../../ApiEndPoint/ApiCalling";

// import "../../../../assets/scss/pages/users.scss";
// import UserContext from "../../../../context/Context";

// import { FaUpload } from "react-icons/fa";
// import {
//   Bulk_Upload_Customer,
//   Create_Transporter_List,
//   GST_Verification_Api,
//   Image_URL,
//   Pan_Verification_API,
//   Pan_Verification_key,
//   View_CustomerGroup,
//   View_Customer_ById,
//   country_state_City_List,
// } from "../../../../ApiEndPoint/Api";
// import { MdCancel } from "react-icons/md";
// let TransPorterToShow = [];
// const CreateCustomer = () => {
//   const [Country_State_city, setCountry_State_city] = useState([]);

//   const [TransporterList, setTransporterList] = useState([]);
//   const [AllTransporterList, setAllTransporterList] = useState([]);
//   const [Countries, setCountry] = useState({});
//   const [BulkImport, setBulkImport] = useState(null);
//   const [States, setState] = useState({});
//   const [Image, setImage] = useState({});
//   const [PhotoImage, setPhotoimags] = useState([]);
//   const [Cities, setCities] = useState({});
//   const [Selectedtransporter, setSelectedtransporter] = useState([]);
//   const [imageUri, setImageUris] = useState([]);
//   const [formData, setFormData] = useState({});

//   const [CustomerGroup, setCustomerGroup] = useState([]);
//   const [Mode, setMode] = useState("Create");
//   const [error, setError] = useState("");
//   const [BulkUpload, setBulkUpload] = useState(false);

//   const Context = useContext(UserContext);
//   let history = useHistory();
//   let Params = useParams();

//   const handleInputChange = (e, type, i) => {
//     const { name, value, checked } = e.target;
//     if (type == "checkbox") {
//       if (checked) {
//         setFormData({
//           ...formData,
//           [name]: checked,
//         });
//       } else {
//         setFormData({
//           ...formData,
//           [name]: checked,
//         });
//       }
//     } else {
//       if (type == "number") {
//         setFormData({
//           ...formData,
//           [name]: Number(value),
//         });
//       } else if (type == "file") {
//         if (e.target.files) {
//           setFormData({
//             ...formData,
//             [name]: e.target.files[0],
//           });
//         }
//       } else {
//         if (value.length <= 10) {
//           setFormData({
//             ...formData,
//             [name]: value,
//           });
//           // console.log(value);
//           setError("");
//         } else {
//           setFormData({
//             ...formData,
//             [name]: value,
//           });
//         }
//       }
//     }
//   };
//   useEffect(() => {
//     _GetList(country_state_City_List)
//       .then((res) => {
//         setCountry_State_city(res);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//     if (Params?.id == 0) {
//       if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//           (position) => {
//             const date = new Date(position.timestamp);
//             const CurentTime = date.toLocaleString();
//             formData.geotagging = `${position.coords.latitude},${position.coords.longitude}`;
//           },
//           (error) => {
//             swal(`Error: ${error}`);
//           },
//           { timeout: 10000, enableHighAccuracy: true }
//         );
//       } else {
//         swal(`Error: Geolocation not found`);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     let userData = JSON.parse(localStorage.getItem("userData"));

//     _Get(Create_Transporter_List, userData?.database)
//       .then((res) => {
//         let value = res?.Transporter;

//         if (value?.length) {
//           setTransporterList(value);
//           setAllTransporterList(value);
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//     if (Params?.id == 0) {
//       setMode("Create");
//     } else {
//       setMode("View");

//       _Get(View_Customer_ById, Params?.id)
//         .then((res) => {
//           let value = res?.Customer[0];

//           let object = { ...value };
//           object.category = object?.category?._id;
//           setFormData(object);

//           if (value?.assignTransporter?.length) {
//             setSelectedtransporter(value?.assignTransporter);
//           }
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     }
//   }, []);

//   useEffect(() => {
//     let userdata = JSON.parse(localStorage.getItem("userData"));
//     _Get(View_CustomerGroup, userdata?.database)
//       .then((res) => {
//         let myActive = res?.CustomerGroup?.filter(
//           (ele) => ele?.status == "Active"
//         );
//         setCustomerGroup(myActive);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//     if (Params?.id == 0) {
//       Get_RoleList(userdata?._id, userdata?.database)
//         .then((res) => {
//           let ShowList = res?.Role?.filter((item, i) =>
//             item?.roleName?.toLowerCase()?.includes("customer")
//           );
//           setFormData({
//             ...formData,
//             ["rolename"]: ShowList[0]?._id,
//             ["roleName"]: ShowList[0]?.roleName,
//           });
//         })
//         .catch((err) => {
//           console.log(err);
//           swal("Roles List Not found");
//         });
//     }
//   }, []);

//   const handleVerifyCompanyPan = async (inputPan) => {
//     let payload = {
//       api_key: Pan_Verification_key,
//       pan: inputPan,
//     };
//     await _PostSave(Pan_Verification_API, payload)
//       .then((res) => {
//         console.log(res);
//         if (res?.flag) {
//           setFormData({
//             ...formData,
//             ["comPanNo"]: inputPan,
//             ["IsValid_comPanNo"]: true,
//           });
//           swal("success", "Pan Card Verified with GST");
//         } else {
//           setFormData({
//             ...formData,
//             ["comPanNo"]: inputPan,
//             ["IsValid_comPanNo"]: false,
//           });
//           swal("Error", "Pan Card notVerified with GST");
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     let formdata = new FormData();
//     console.log(formData);
//     if (formData?.assignTransporter) {
//       delete formData?.assignTransporter;
//     }
//     if (formData?.shopPhoto) {
//       delete formData?.shopPhoto;
//     }
//     if (BulkImport !== null || BulkImport != undefined) {
//       formdata.append("file", BulkImport);

//       await _BulkUpload(Bulk_Upload_Customer, formdata)
//         .then((res) => {
//           swal(`${res?.message}`);
//         })
//         .catch((err) => {
//           console.log(err);
//           swal("Something Went Wrong");
//         });
//     } else {
//       let userdata = JSON.parse(localStorage.getItem("userData"));
//       for (const [key, value] of Object.entries(formData)) {
//         formdata.append(`${key}`, `${value}`);
//       }

//       if (Image !== null) {
//         formdata.append("file", Image);
//       }
//       if (PhotoImage?.length) {
//         PhotoImage?.map((ele) => {
//           formdata.append("files", ele);
//         });
//       }
//       // if (Params?.id == 0) {
//       if (Selectedtransporter?.length) {
//         formdata.append(
//           "assignTransporter",
//           JSON.stringify(Selectedtransporter)
//         );
//       }
//       // }

//       // formdata.append("status", formData?.status);

//       // formdata.append("rolename", formData?.rolename);
//       for (let [key, value] in formdata.values()) {
//         console.log(key), value;
//       }

//       if (error) {
//       } else {
//         if (Params?.id == 0) {
//           formdata.append("database", userdata?.database);

//           CreateCustomersave(formdata)
//             .then((res) => {
//               console.log(res);
//               setFormData({});
//               if (res.status) {
//                 history.goBack();
//                 swal("Customer Created Successfully");
//               }
//             })
//             .catch((err) => {
//               console.log(err.response);
//               swal("something Went Wrong");
//             });
//         } else {
//           CreateCustomerUpdate(Params?.id, formdata)
//             .then((res) => {
//               console.log(res);
//               setFormData({});
//               if (res.status) {
//                 history.goBack();
//                 swal("Customer Updated Successfully");
//               }
//             })
//             .catch((err) => {
//               console.log(err.response);
//               swal("something Went Wrong");
//             });

//           // CreateCustomerUpdate
//         }
//       }
//     }
//   };
//   const handleSetShowTransporter = (VALUE) => {
//     let list = [...AllTransporterList];
//     TransPorterToShow = [];
//     list?.map((ele) => {
//       ele?.City?.map((val) => {
//         if (val?.name.includes(formData?.City)) {
//           TransPorterToShow?.push(ele);
//         }
//       });
//     });

//     setTransporterList(TransPorterToShow);
//   };

//   useEffect(() => {
//     console.log(formData);
//   }, [formData]);

//   const onSelect1 = (selectedList, selectedItem) => {
//     setSelectedtransporter(selectedList);
//     // console.log(selectedList);
//   };
//   const onRemove1 = (selectedList, selectedItem) => {
//     // console.log(selectedList);
//     setSelectedtransporter(selectedList);
//   };

//   return (
//     <div>
//       <div>
//         <Card>
//           <Row className="m-2">
//             <Col lg="3" md="3">
//               <h1 className="float-left">{Mode && Mode} Customer</h1>
//             </Col>
//             <Col></Col>
//             {Params?.id == 0 && (
//               <>
//                 {!BulkUpload && !BulkUpload ? (
//                   <>
//                     <Col lg="2" md="2" xs="8">
//                       <Button
//                         color="primary"
//                         onClick={(e) => {
//                           e.preventDefault();
//                           setBulkUpload(true);
//                         }}>
//                         Bulk Upload
//                       </Button>
//                     </Col>
//                   </>
//                 ) : (
//                   <>
//                     <Col lg="2" md="2" xs="12">
//                       <Button
//                         className="p-1"
//                         color="primary"
//                         onClick={(e) => {
//                           e.preventDefault();
//                           setBulkUpload(false);
//                         }}>
//                         Back
//                       </Button>
//                     </Col>
//                   </>
//                 )}
//               </>
//             )}
//             {Params?.id == 0 && (
//               <>
//                 {!BulkUpload && !BulkUpload && (
//                   <>
//                     <Col lg="2" md="2" xs="4">
//                       <div className="float-right">
//                         <Route
//                           render={({ history }) => (
//                             <Button
//                               style={{ cursor: "pointer" }}
//                               className="float-right mr-1"
//                               color="primary"
//                               onClick={() =>
//                                 history.push(
//                                   `/app/ajgroup/house/CustomerGroupList`
//                                 )
//                               }>
//                               {" "}
//                               + Group
//                             </Button>
//                           )}
//                         />
//                       </div>
//                     </Col>
//                   </>
//                 )}
//               </>
//             )}
//             <Col lg="2" md="2">
//               <div className="float-right">
//                 <Route
//                   render={({ history }) => (
//                     <Button
//                       style={{ cursor: "pointer" }}
//                       className="float-right mr-1"
//                       color="primary"
//                       onClick={() =>
//                         history.push("/app/SoftNumen/CustomerSearch")
//                       }>
//                       Back
//                     </Button>
//                   )}
//                 />
//               </div>
//             </Col>
//           </Row>
//           {/* <hr /> */}

//           <CardBody>
//             {BulkUpload && BulkUpload ? (
//               <>
//                 <Form className="m-1" onSubmit={submitHandler}>
//                   <Row>
//                     <Col lg="6" md="6" sm="6" xs="12">
//                       <div className="d-flex justify-content-center">
//                         <Label>Upload</Label>
//                       </div>

//                       <div className="parent">
//                         <div className="file-upload">
//                           <FaUpload color="green" size={35} />

//                           <p>Click box to upload</p>
//                           {/* <p>Maximun file size 10mb</p> */}
//                           <input
//                             type="file"
//                             name="BulkImport"
//                             onChange={(e) => {
//                               setBulkImport(e.target.files[0]);
//                             }}
//                           />
//                         </div>
//                       </div>
//                     </Col>
//                   </Row>
//                   <Row>
//                     <Col>
//                       <div className="d-flex justify-content-center">
//                         <Button.Ripple
//                           color="primary"
//                           type="submit"
//                           className="mr-1 mt-2 mx-2">
//                           Import
//                         </Button.Ripple>
//                       </div>
//                     </Col>
//                   </Row>
//                 </Form>
//               </>
//             ) : (
//               <>
//                 <Form className="m-1" onSubmit={submitHandler}>
//                   <Row>
//                     <Col lg="6" md="6">
//                       <CardBody className="userRegiBody">
//                         <div className="d-flex justify-content-center">
//                           <h1>Personal Information</h1>
//                         </div>
//                         <Row style={{ paddingBottom: "9rem" }}>
//                           <Col lg="6" md="6" sm="12">
//                             <FormGroup>
//                               <Label>
//                                 First Name
//                                 <span style={{ color: "red" }}>*</span>
//                               </Label>
//                               <Input
//                                 readOnly
//                                 required
//                                 placeholder="Enter First Name"
//                                 type="text"
//                                 name="firstName"
//                                 value={formData?.firstName}
//                                 onChange={handleInputChange}
//                               />
//                             </FormGroup>
//                           </Col>
//                           <Col lg="6" md="6" sm="12">
//                             <FormGroup>
//                               <Label>
//                                 Last Name{" "}
//                                 <span style={{ color: "red" }}>*</span>
//                               </Label>
//                               <Input
//                                 readOnly
//                                 required
//                                 placeholder="Enter Last Name"
//                                 type="text"
//                                 name="lastName"
//                                 value={formData?.lastName}
//                                 onChange={handleInputChange}
//                               />
//                             </FormGroup>
//                           </Col>
//                           <Col lg="6" md="6" sm="12">
//                             <FormGroup>
//                               <Label>
//                                 Owner Name{" "}
//                                 <span style={{ color: "red" }}>*</span>
//                               </Label>
//                               <Input
//                                 readOnly
//                                 required
//                                 placeholder="Enter Last Name"
//                                 type="text"
//                                 name="ownerName"
//                                 value={formData?.ownerName}
//                                 onChange={handleInputChange}
//                               />
//                             </FormGroup>
//                           </Col>

//                           <Col lg="6" md="6" sm="12">
//                             <FormGroup>
//                               <Label>
//                                 Mobile Number{" "}
//                                 <span style={{ color: "red" }}>*</span>{" "}
//                               </Label>
//                               <PhoneInput
//                                 readOnly
//                                 required
//                                 inputClass="myphoneinput"
//                                 country={"in"}
//                                 onKeyDown={(e) => {
//                                   ["e", "E", "+", "-"].includes(e.key) &&
//                                     e.preventDefault();
//                                 }}
//                                 countryCodeEditable={false}
//                                 name="mobileNumber"
//                                 value={JSON.stringify(formData?.mobileNumber)}
//                                 // value={formData.mobileNumber}
//                                 onChange={(phone) => {
//                                   setFormData({
//                                     ...formData,
//                                     ["mobileNumber"]: Number(phone),
//                                   });
//                                 }}
//                               />
//                             </FormGroup>
//                           </Col>

//                           <Col lg="6" md="6" sm="12">
//                             <FormGroup>
//                               <Label>Passport Number</Label>
//                               <Input
//                                 readOnly
//                                 placeholder="Enter Passport number"
//                                 type="text"
//                                 name="passPortNo"
//                                 value={formData?.passPortNo}
//                                 onChange={handleInputChange}
//                               />
//                             </FormGroup>
//                           </Col>

//                           <Col lg="6" md="6" sm="12">
//                             <FormGroup>
//                               <Label>
//                                 Aadhar Number{" "}
//                                 <span style={{ color: "red" }}>*</span>
//                               </Label>
//                               <Input
//                                 readOnly
//                                 required
//                                 minLength={12}
//                                 maxLength={12}
//                                 pattern="[0-9]*"
//                                 placeholder="Enter Addhar Number"
//                                 type="number"
//                                 name="aadharNo"
//                                 value={formData?.aadharNo}
//                                 onChange={(e) => {
//                                   const inputPan = e.target.value;
//                                   const panRegex = /^\d{12}$/;

//                                   setFormData({
//                                     ...formData,
//                                     ["aadharNo"]: Number(inputPan),
//                                     ["IsValid_Aadhar_No"]:
//                                       panRegex.test(inputPan),
//                                   });
//                                 }}
//                               />
//                               <span>
//                                 {formData?.IsValid_Aadhar_No &&
//                                 formData?.IsValid_Aadhar_No ? (
//                                   <>
//                                     <span style={{ color: "green" }}>
//                                       Correct
//                                     </span>
//                                   </>
//                                 ) : (
//                                   <>
//                                     {formData?.aadharNo?.length > 16 ||
//                                       (formData?.aadharNo?.length < 15 && (
//                                         <span style={{ color: "red" }}>
//                                           Enter Correct AadharNo
//                                         </span>
//                                       ))}
//                                   </>
//                                 )}
//                               </span>
//                             </FormGroup>
//                           </Col>
//                           <Col lg="6" md="6" sm="12">
//                             <FormGroup>
//                               <Label>
//                                 Pan Number{" "}
//                                 <span style={{ color: "red" }}>*</span>
//                               </Label>
//                               <Input
//                                 required
//                                 readOnly
//                                 minLength={10}
//                                 maxLength={10}
//                                 placeholder="Enter Pan Number"
//                                 type="text"
//                                 name="panNo"
//                                 value={formData?.panNo}
//                                 onChange={(e) => {
//                                   const inputPan =
//                                     e.target.value?.toUpperCase();
//                                   const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
//                                   setFormData({
//                                     ...formData,
//                                     ["panNo"]: inputPan,
//                                     ["IsValid_Pan_No"]: panRegex.test(inputPan),
//                                   });
//                                 }}
//                               />
//                               <span>
//                                 {formData?.IsValid_Pan_No &&
//                                 formData?.IsValid_Pan_No ? (
//                                   <>
//                                     <span style={{ color: "green" }}>
//                                       Correct
//                                     </span>
//                                   </>
//                                 ) : (
//                                   <>
//                                     {formData?.panNo?.length > 9 && (
//                                       <span style={{ color: "red" }}>
//                                         Enter Correct PAN Number
//                                       </span>
//                                     )}
//                                   </>
//                                 )}
//                               </span>
//                             </FormGroup>
//                           </Col>

//                           <Col lg="6" md="6" sm="12">
//                             <FormGroup>
//                               <Label>
//                                 Pin Code Number{" "}
//                                 <span style={{ color: "red" }}>*</span>
//                               </Label>
//                               <Input
//                                 readOnly
//                                 required
//                                 onKeyDown={(e) => {
//                                   ["e", "E", "+", "-"].includes(e.key) &&
//                                     e.preventDefault();
//                                 }}
//                                 type="number"
//                                 placeholder="Enter Pin Code here"
//                                 name="personalPincode"
//                                 value={formData?.personalPincode}
//                                 onChange={(e) => {
//                                   let SelectedCity = Country_State_city?.filter(
//                                     (ele) => ele?.Pincode == e.target.value
//                                   );
//                                   // console.log(SelectedCity);
//                                   if (SelectedCity?.length) {
//                                     setFormData({
//                                       ...formData,
//                                       ["Pstate"]: SelectedCity[0]?.StateName,
//                                       ["Pcity"]: SelectedCity[0]?.District,
//                                       ["personalPincode"]: Number(
//                                         e.target.value
//                                       ),
//                                     });
//                                   } else {
//                                     setFormData({
//                                       ...formData,
//                                       ["personalPincode"]: Number(
//                                         e.target.value
//                                       ),
//                                     });
//                                   }
//                                 }}
//                               />
//                             </FormGroup>
//                           </Col>

//                           <Col lg="6" md="6" sm="12">
//                             <FormGroup>
//                               <Label>City</Label>
//                               <Input
//                                 readOnly
//                                 placeholder="City name"
//                                 type="text"
//                                 name="Pcity"
//                                 value={formData?.Pcity}
//                                 // onChange={handleInputChange}
//                               />
//                             </FormGroup>
//                           </Col>
//                           <Col lg="6" md="6" sm="12">
//                             <FormGroup>
//                               <Label>State</Label>
//                               <Input
//                                 readOnly
//                                 placeholder="State name"
//                                 type="text"
//                                 name="Pstate"
//                                 value={formData?.Pstate}
//                                 // onChange={handleInputChange}
//                               />
//                             </FormGroup>
//                           </Col>
//                           <Col lg="6" md="6" sm="12">
//                             <FormGroup>
//                               <Label>
//                                 Address
//                                 <span style={{ color: "red" }}>*</span>
//                               </Label>
//                               <Input
//                                 required
//                                 readOnly
//                                 className="form-control"
//                                 placeholder="address name"
//                                 type="text"
//                                 name="address"
//                                 value={formData?.address}
//                                 onChange={handleInputChange}
//                               />
//                             </FormGroup>
//                           </Col>
//                           <Col className="mt-2 mb-2" lg="12" md="12" sm="12">
//                             <Row>
//                               <Col lg="6" md="6" sm="6" xs="12">
//                                 <div className="d-flex justify-content-center">
//                                   <Label>Image</Label>
//                                 </div>

//                                 <div className="parent">
//                                   <div className="file-upload">
//                                     <FaUpload color="green" size={35} />

//                                     <p>Click box to upload</p>
//                                     {/* <p>Maximun file size 10mb</p> */}
//                                     <input
//                                       type="file"
//                                       name="Photo"
//                                       // onChange={(e) => {
//                                       //   const fiels = e.target.files[0];

//                                       //   setImage(fiels);
//                                       //   if (fiels) {
//                                       //     const reader = new FileReader();
//                                       //     reader.onload = (e) => {
//                                       //       setFormData({
//                                       //         ...formData,

//                                       //         ["PhotoUrl"]: e.target.result,
//                                       //       });
//                                       //     };
//                                       //     reader.readAsDataURL(fiels);
//                                       //   }
//                                       // }}
//                                     />
//                                   </div>
//                                 </div>
//                               </Col>
//                               {formData?.PhotoUrl && (
//                                 <Col lg="6" md="6" sm="12">
//                                   <img
//                                     style={{ borderRadius: "8px" }}
//                                     src={formData?.PhotoUrl}
//                                     height={100}
//                                     width={120}
//                                     alt="image"
//                                   />
//                                 </Col>
//                               )}

//                               {formData?.Photo && formData?.Photo && (
//                                 <Col lg="6" md="6" sm="12">
//                                   <img
//                                     style={{ borderRadius: "8px" }}
//                                     src={`${Image_URL}/Images/${formData?.Photo}`}
//                                     height={100}
//                                     width={120}
//                                     alt="image"
//                                   />
//                                 </Col>
//                               )}
//                             </Row>
//                           </Col>
//                         </Row>
//                       </CardBody>
//                     </Col>
//                     <Col lg="6" md="6">
//                       <CardBody className="userRegiBody">
//                         <div className="d-flex justify-content-center">
//                           <h1>Company Information</h1>
//                         </div>
//                         <Row>
//                           <Col lg="6" md="6" sm="12">
//                             <FormGroup>
//                               <Label className="mb-1">Party Type</Label>
//                               <CustomInput
//                                 readOnly
//                                 name="partyType"
//                                 value={formData?.partyType}
//                                 onChange={(e) => {
//                                   setFormData({
//                                     ...formData,
//                                     ["partyType"]: e.target.value,
//                                   });
//                                 }}
//                                 type="select">
//                                 <option>--Select--</option>
//                                 <option value="Debtor">Debtor</option>
//                                 <option value="Creditor">Creditor</option>
//                               </CustomInput>
//                             </FormGroup>
//                           </Col>
//                           <Col lg="6" md="6" sm="12">
//                             <FormGroup>
//                               <Label className="mb-1">Registration Type</Label>
//                               <CustomInput
//                                 readOnly
//                                 name="registrationType"
//                                 value={formData?.registrationType}
//                                 onChange={(e) => {
//                                   setFormData({
//                                     ...formData,
//                                     ["registrationType"]: e.target.value,
//                                   });
//                                 }}
//                                 type="select">
//                                 <option value="NA">--Select--</option>
//                                 <option value="UnKnown">UnKnown</option>
//                                 <option value="Regular">Regular</option>
//                                 <option value="UnRegister">UnRegister</option>
//                               </CustomInput>
//                             </FormGroup>
//                           </Col>
//                           {formData?.registrationType !== "UnKnown" && (
//                             <>
//                               {formData?.registrationType !== "UnRegister" && (
//                                 <>
//                                   <Col sm="12" lg="6" md="6">
//                                     <Label>
//                                       GST Number
//                                       <span style={{ color: "red" }}>*</span>
//                                     </Label>
//                                     <Input
//                                       readOnly
//                                       type="text"
//                                       required
//                                       minLength={15}
//                                       maxLength={15}
//                                       name="gstNumber"
//                                       className="from-control"
//                                       placeholder=" Enter Correct GST Number"
//                                       value={formData?.gstNumber}
//                                       onChange={(e) => {
//                                         let value = e.target.value;

//                                         if (value?.length == 15) {
//                                           (async () => {
//                                             await _Get(
//                                               GST_Verification_Api,
//                                               value
//                                             )
//                                               .then((res) => {
//                                                 console.log(res);
//                                                 const parts =
//                                                   res?.data?.pradr?.adr.split(
//                                                     ","
//                                                   );

//                                                 const part1 = parts[0].trim(); // First part
//                                                 const part2 = parts
//                                                   .slice(1)
//                                                   .join(",")
//                                                   .trim();

//                                                 if (res?.flag) {
//                                                   setFormData({
//                                                     ...formData,
//                                                     ["CompanyName"]:
//                                                       res?.data?.tradeNam,
//                                                     ["address1"]: part1,
//                                                     ["address2"]: part2,
//                                                   });
//                                                 } else {
//                                                   setFormData({
//                                                     ...formData,
//                                                     ["CompanyName"]: "",
//                                                     ["address1"]: "",
//                                                     ["address2"]: "",
//                                                   });
//                                                 }
//                                               })
//                                               .catch((err) => {
//                                                 swal(
//                                                   "error",
//                                                   "somthing went Wrong"
//                                                 );
//                                                 console.log(err);
//                                               });
//                                           })();
//                                         }
//                                       }}
//                                     />
//                                   </Col>
//                                 </>
//                               )}
//                               <Col lg="6" md="6" sm="12">
//                                 <FormGroup>
//                                   <Label>
//                                     PAN Number{" "}
//                                     <span style={{ color: "red" }}>*</span>
//                                   </Label>
//                                   <Input
//                                     readOnly
//                                     required
//                                     minLength={10}
//                                     maxLength={10}
//                                     placeholder="Enter Company Pan Number"
//                                     type="text"
//                                     name="comPanNo"
//                                     value={formData?.comPanNo}
//                                     onChange={(e) => {
//                                       const inputPan =
//                                         e.target.value?.toUpperCase();
//                                       const panRegex =
//                                         /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
//                                       setFormData({
//                                         ...formData,
//                                         ["comPanNo"]: inputPan,
//                                         // ["IsValid_comPanNo"]: panRegex.test(inputPan),
//                                       });
//                                       if (inputPan?.length == 10) {
//                                         handleVerifyCompanyPan(inputPan);
//                                       }
//                                     }}
//                                   />
//                                   <span>
//                                     {formData?.IsValid_comPanNo &&
//                                     formData?.IsValid_comPanNo ? (
//                                       <>
//                                         <span style={{ color: "green" }}>
//                                           Verified
//                                         </span>
//                                       </>
//                                     ) : (
//                                       <>
//                                         {formData?.comPanNo?.length < 10 && (
//                                           <span style={{ color: "red" }}>
//                                             Enter Correct PAN Number
//                                           </span>
//                                         )}
//                                       </>
//                                     )}
//                                   </span>
//                                 </FormGroup>
//                               </Col>
//                             </>
//                           )}
//                           <Col lg="6" md="6" sm="12">
//                             <FormGroup>
//                               <Label>Email Id</Label>
//                               <Input
//                                 readOnly
//                                 placeholder="last job firm name"
//                                 type="email"
//                                 name="email"
//                                 value={formData?.email}
//                                 onChange={handleInputChange}
//                               />
//                             </FormGroup>
//                           </Col>
//                           <Col lg="6" md="6" sm="12">
//                             <FormGroup>
//                               <Label>Id</Label>
//                               <Input
//                                 readOnly
//                                 placeholder="ID"
//                                 type="text"
//                                 name="id"
//                                 value={formData?.id}
//                                 onChange={handleInputChange}
//                               />
//                             </FormGroup>
//                           </Col>
//                           <Col lg="6" md="6" sm="12">
//                             <FormGroup>
//                               <Label>Deals in Prouduct</Label>
//                               <Input
//                                 readOnly
//                                 placeholder="Deals In Products"
//                                 type="text"
//                                 name="dealsInProducts"
//                                 value={formData?.dealsInProducts}
//                                 onChange={handleInputChange}
//                               />
//                             </FormGroup>
//                           </Col>
//                           <Col lg="6" md="6" sm="12">
//                             <FormGroup>
//                               <Label>Annual TurnOver</Label>
//                               <Input
//                                 readOnly
//                                 placeholder="Deals In Products"
//                                 type="number"
//                                 name="annualTurnover"
//                                 value={formData?.annualTurnover}
//                                 onChange={(e) => {
//                                   setFormData({
//                                     ...formData,
//                                     ["annualTurnover"]: Number(e.target.value),
//                                   });
//                                 }}
//                               />
//                             </FormGroup>
//                           </Col>
//                           {formData?.registrationType == "UnRegister" ? (
//                             <>
//                               <Col lg="6" md="6" sm="12">
//                                 <FormGroup>
//                                   <Label>Company Name</Label>
//                                   <Input
//                                     readOnly
//                                     className="form-control"
//                                     placeholder="Company Name"
//                                     type="text"
//                                     name="CompanyName"
//                                     value={formData?.CompanyName}
//                                     onChange={handleInputChange}
//                                   />
//                                 </FormGroup>
//                               </Col>
//                               <Col lg="6" md="6" sm="12">
//                                 <FormGroup>
//                                   <Label>
//                                     Address 1st{" "}
//                                     <span style={{ color: "red" }}>*</span>
//                                   </Label>
//                                   <Input
//                                     readOnly
//                                     required
//                                     className="form-control"
//                                     placeholder="address name"
//                                     type="text"
//                                     name="address1"
//                                     value={formData?.address1}
//                                     onChange={handleInputChange}
//                                   />
//                                 </FormGroup>
//                               </Col>
//                               <Col lg="6" md="6" sm="12">
//                                 <FormGroup>
//                                   <Label>
//                                     Address 2nd
//                                     <span style={{ color: "red" }}>*</span>
//                                   </Label>
//                                   <Input
//                                     readOnly
//                                     required
//                                     className="form-control"
//                                     placeholder="address name"
//                                     type="text"
//                                     name="address2"
//                                     value={formData?.address2}
//                                     onChange={handleInputChange}
//                                   />
//                                 </FormGroup>
//                               </Col>
//                             </>
//                           ) : (
//                             <>
//                               <Col lg="6" md="6" sm="12">
//                                 <FormGroup>
//                                   <Label>Company Name</Label>
//                                   <Input
//                                     readOnly
//                                     className="form-control"
//                                     placeholder="last job firm name"
//                                     type="text"
//                                     name="CompanyName"
//                                     value={formData?.CompanyName}
//                                     onChange={handleInputChange}
//                                   />
//                                 </FormGroup>
//                               </Col>
//                               <Col lg="6" md="6" sm="12">
//                                 <FormGroup>
//                                   <Label>
//                                     Address 1st{" "}
//                                     <span style={{ color: "red" }}>*</span>
//                                   </Label>
//                                   <Input
//                                     readOnly
//                                     required
//                                     className="form-control"
//                                     placeholder="address name"
//                                     type="text"
//                                     name="address1"
//                                     value={formData?.address1}
//                                     onChange={handleInputChange}
//                                   />
//                                 </FormGroup>
//                               </Col>
//                               <Col lg="6" md="6" sm="12">
//                                 <FormGroup>
//                                   <Label>
//                                     Address 2nd
//                                     <span style={{ color: "red" }}>*</span>
//                                   </Label>
//                                   <Input
//                                     readOnly
//                                     required
//                                     className="form-control"
//                                     placeholder="address name"
//                                     type="text"
//                                     name="address2"
//                                     value={formData?.address2}
//                                     onChange={handleInputChange}
//                                   />
//                                 </FormGroup>
//                               </Col>
//                             </>
//                           )}
//                           <Col lg="6" md="6" sm="12">
//                             <FormGroup>
//                               <Label>Contact Number</Label>
//                               <Input
//                                 readOnly
//                                 className="form-control"
//                                 placeholder="last job firm name"
//                                 type="text"
//                                 name="contactNumber"
//                                 value={formData?.contactNumber}
//                                 onChange={(e) => {
//                                   setFormData({
//                                     ...formData,
//                                     ["contactNumber"]: Number(e.target.value),
//                                   });
//                                 }}
//                               />
//                             </FormGroup>
//                           </Col>
//                           <Col lg="6" md="6" sm="12">
//                             <FormGroup>
//                               <Label>
//                                 Pin Code Number{" "}
//                                 <span style={{ color: "red" }}>*</span>
//                               </Label>
//                               <Input
//                                 required
//                                 readOnly
//                                 onKeyDown={(e) => {
//                                   ["e", "E", "+", "-"].includes(e.key) &&
//                                     e.preventDefault();
//                                 }}
//                                 type="number"
//                                 placeholder="Enter Pin Code here"
//                                 name="pincode"
//                                 value={formData?.pincode}
//                                 onChange={(e) => {
//                                   let SelectedCity = Country_State_city?.filter(
//                                     (ele) => ele?.Pincode == e.target.value
//                                   );
//                                   // console.log(SelectedCity);
//                                   if (SelectedCity?.length) {
//                                     setFormData({
//                                       ...formData,
//                                       ["State"]: SelectedCity[0]?.StateName,
//                                       ["City"]: SelectedCity[0]?.District,
//                                       ["pincode"]: Number(e.target.value),
//                                     });
//                                   } else {
//                                     setFormData({
//                                       ...formData,
//                                       ["pincode"]: Number(e.target.value),
//                                     });
//                                   }
//                                 }}
//                               />
//                             </FormGroup>
//                           </Col>

//                           <Col lg="6" md="6" sm="12">
//                             <FormGroup>
//                               <Label>City</Label>
//                               <Input
//                                 readOnly
//                                 placeholder="City name"
//                                 type="text"
//                                 name="City"
//                                 value={formData?.City}
//                                 // onChange={handleInputChange}
//                               />
//                             </FormGroup>
//                           </Col>
//                           <Col lg="6" md="6" sm="12">
//                             <FormGroup>
//                               <Label>State</Label>
//                               <Input
//                                 readOnly
//                                 placeholder="State name"
//                                 type="text"
//                                 name="State"
//                                 value={formData?.State}
//                                 // onChange={handleInputChange}
//                               />
//                             </FormGroup>
//                           </Col>
//                           <Col lg="6" md="6" sm="12">
//                             <FormGroup>
//                               <Label>
//                                 ShopSize <span style={{ color: "red" }}>*</span>
//                               </Label>
//                               <Input
//                                 readOnly
//                                 required
//                                 className="form-control"
//                                 placeholder="address name"
//                                 type="text"
//                                 name="shopSize"
//                                 value={formData?.shopSize}
//                                 onChange={handleInputChange}
//                               />
//                             </FormGroup>
//                           </Col>

//                           <Col className="mt-2 mb-2" lg="12" md="12" sm="12">
//                             <Row>
//                               <Col lg="6" md="6" sm="6" xs="12">
//                                 <div className="d-flex justify-content-center">
//                                   <Label>Shop Photo</Label>
//                                 </div>

//                                 <div className="parent">
//                                   <div className="file-upload">
//                                     <FaUpload color="green" size={35} />

//                                     <p>Click box to upload</p>

//                                     <input
//                                       readOnly
//                                       multiple
//                                       type="file"
//                                       name="shopPhotos"
//                                       onChange={(e) => {
//                                         let allimages = Array.from(
//                                           e.target.files
//                                         );
//                                         setPhotoimags(allimages);
//                                         setFormData({
//                                           ...formData,
//                                           ["shopPhotos"]: allimages,
//                                         });
//                                         const fiels = e.target.files;
//                                         for (let i = 0; i < fiels.length; i++) {
//                                           const reader = new FileReader();
//                                           reader.onload = (event) => {
//                                             setImageUris((prevUris) => [
//                                               ...prevUris,
//                                               event.target.result,
//                                             ]);
//                                           };
//                                           reader.readAsDataURL(fiels[i]);
//                                         }
//                                       }}
//                                     />
//                                   </div>
//                                 </div>
//                               </Col>
//                               {imageUri &&
//                                 imageUri?.map((ele, i) => {
//                                   return (
//                                     <>
//                                       <Col key={i} lg="4" md="4" sm="6">
//                                         <span
//                                           onClick={() => {
//                                             let uri = [...imageUri];
//                                             uri.splice(i, 1);
//                                             setImageUris(uri);
//                                           }}>
//                                           <span
//                                             style={{
//                                               cursor: "pointer",
//                                               position: "absolute",
//                                               right: 40,
//                                               color: "red",
//                                             }}>
//                                             <MdCancel color="red" size="30" />
//                                           </span>
//                                         </span>
//                                         <img
//                                           style={{ borderRadius: "8px" }}
//                                           src={ele}
//                                           className="p-1"
//                                           height={140}
//                                           width="90%"
//                                           alt="image"
//                                         />
//                                       </Col>
//                                     </>
//                                   );
//                                 })}

//                               {formData?.shopPhoto &&
//                                 formData?.shopPhoto?.map((ele, i) => (
//                                   <Col
//                                     key={i}
//                                     className="mt-1 mb-1"
//                                     lg="4"
//                                     md="4"
//                                     sm="6">
//                                     <img
//                                       style={{ borderRadius: "8px" }}
//                                       src={`${Image_URL}/Images/${ele}`}
//                                       height={100}
//                                       width={120}
//                                       alt="image"
//                                     />
//                                   </Col>
//                                 ))}
//                             </Row>
//                           </Col>
//                         </Row>
//                       </CardBody>
//                     </Col>
//                   </Row>
//                   <Row>
//                     <Col>
//                       <CardBody className="userRegiBody mt-2 mb-2">
//                         <div className="d-flex justify-content-center">
//                           <h1>Other information</h1>
//                         </div>
//                         <Row>
//                           <Col lg="6" md="6">
//                             <FormGroup>
//                               <Label>
//                                 Password <span style={{ color: "red" }}>*</span>
//                               </Label>
//                               <Input
//                                 required
//                                 readOnly
//                                 placeholder="Enter Password here"
//                                 type="password"
//                                 name="password"
//                                 value={formData?.password}
//                                 onChange={handleInputChange}
//                               />
//                             </FormGroup>
//                           </Col>
//                           <Col lg="6" md="6">
//                             <FormGroup>
//                               <Label>Geotagging</Label>
//                               <Input
//                                 readOnly
//                                 placeholder="Enter Password here"
//                                 type="text"
//                                 name="geotagging"
//                                 value={formData?.geotagging}
//                                 // onChange={handleInputChange}
//                               />
//                             </FormGroup>
//                           </Col>
//                           <Col llg="6" md="6">
//                             <FormGroup>
//                               <Label className="">
//                                 Category <span style={{ color: "red" }}>*</span>
//                               </Label>
//                               <CustomInput
//                                 readOnly
//                                 name="category"
//                                 value={formData?.category}
//                                 onChange={(e) => {
//                                   setFormData({
//                                     ...formData,
//                                     ["category"]: e.target.value,
//                                   });
//                                 }}
//                                 type="select">
//                                 <option>--Select Category--</option>
//                                 {CustomerGroup &&
//                                   CustomerGroup?.map((ele, i) => (
//                                     <option key={ele?._id} value={ele?._id}>
//                                       {ele?.groupName}
//                                     </option>
//                                   ))}
//                               </CustomInput>
//                             </FormGroup>
//                           </Col>
//                           <Col lg="6" md="6">
//                             <FormGroup>
//                               <Label>
//                                 Due Date <span style={{ color: "red" }}>*</span>
//                               </Label>
//                               <Input
//                                 required
//                                 readOnly
//                                 className="form-control"
//                                 placeholder="Due Date"
//                                 type="number"
//                                 name="duedate"
//                                 value={formData?.duedate}
//                                 onChange={(e) => {
//                                   setFormData({
//                                     ...formData,
//                                     ["duedate"]: Number(e.target.value),
//                                   });
//                                 }}
//                               />
//                             </FormGroup>
//                           </Col>
//                           <Col llg="6" md="6">
//                             <FormGroup>
//                               <Label>
//                                 Lock In Time{" "}
//                                 <span style={{ color: "red" }}>*</span>
//                               </Label>
//                               <Input
//                                 required
//                                 readOnly
//                                 className="form-control"
//                                 placeholder="Lock In time in days"
//                                 type="number"
//                                 name="lockInTime"
//                                 value={formData?.lockInTime}
//                                 onChange={(e) => {
//                                   setFormData({
//                                     ...formData,
//                                     ["lockInTime"]: Number(e.target.value),
//                                   });
//                                 }}
//                               />
//                             </FormGroup>
//                           </Col>
//                           <Col lg="6" md="6">
//                             <FormGroup>
//                               <Label>
//                                 Limit <span style={{ color: "red" }}>*</span>
//                               </Label>
//                               <Input
//                                 required
//                                 readOnly
//                                 className="form-control"
//                                 placeholder="Lock In time in days"
//                                 type="number"
//                                 name="limit"
//                                 value={formData?.limit}
//                                 onChange={(e) => {
//                                   setFormData({
//                                     ...formData,
//                                     ["limit"]: Number(e.target.value),
//                                   });
//                                 }}
//                               />
//                             </FormGroup>
//                           </Col>
//                           <Col lg="6" md="6">
//                             <FormGroup>
//                               <Label>
//                                 Payment Term{" "}
//                                 <span style={{ color: "red" }}>*</span>
//                               </Label>
//                               <Input
//                                 required
//                                 readOnly
//                                 className="form-control"
//                                 placeholder="Lock In time in days"
//                                 type="number"
//                                 name="paymentTerm"
//                                 value={formData?.paymentTerm}
//                                 onChange={(e) => {
//                                   setFormData({
//                                     ...formData,
//                                     ["paymentTerm"]: Number(e.target.value),
//                                   });
//                                 }}
//                               />
//                             </FormGroup>
//                           </Col>
//                           <Col lg="6" md="6">
//                             <FormGroup>
//                               <Label>Transporter Details</Label>
//                               <CustomInput
//                                 readOnly
//                                 name="transporterDetail"
//                                 value={formData?.transporterDetail}
//                                 onChange={(e) => {
//                                   if (e.target.value == "other") {
//                                     handleSetShowTransporter(e.target.value);
//                                   }
//                                   setFormData({
//                                     ...formData,
//                                     ["transporterDetail"]: Number(
//                                       e.target.value
//                                     ),
//                                   });
//                                 }}
//                                 type="select">
//                                 <option value={null}>
//                                   --Select Transporter Type--
//                                 </option>
//                                 <option value={0}>Local</option>
//                                 <option value={1}>Other</option>
//                               </CustomInput>
//                             </FormGroup>
//                           </Col>
//                           {formData?.transporterDetail == 1 &&
//                           formData?.transporterDetail == 1 ? (
//                             <>
//                               <Col lg="6" md="6">
//                                 <FormGroup>
//                                   <Label className="mb-1">
//                                     Transporter List
//                                   </Label>
//                                   <Multiselect
//                                     required
//                                     readOnly
//                                     isObject="false"
//                                     options={TransporterList} // Options to display in the dropdown
//                                     selectedValues={
//                                       Selectedtransporter && Selectedtransporter
//                                     } // Preselected value to persist in dropdown
//                                     onSelect={onSelect1} // Function will trigger on select event
//                                     onRemove={onRemove1} // Function will trigger on remove event
//                                     displayValue="firstName" // Property name to display in the dropdown options
//                                   />
//                                 </FormGroup>
//                               </Col>
//                             </>
//                           ) : null}
//                           <Col lg="6" md="6">
//                             <FormGroup>
//                               <Label>
//                                 Service Area{" "}
//                                 <span style={{ color: "red" }}>*</span>
//                               </Label>
//                               <textarea
//                                 readOnly
//                                 required
//                                 rows={3}
//                                 className="form-control"
//                                 placeholder="Service Area"
//                                 type="text"
//                                 name="serviceArea"
//                                 value={formData?.serviceArea}
//                                 onChange={handleInputChange}
//                               />
//                             </FormGroup>
//                           </Col>
//                         </Row>
//                       </CardBody>
//                     </Col>
//                   </Row>
//                   {/* <Row>
//                     <Col lg="6" md="6" sm="6" className="mb-2 mt-1">
//                       <Label className="mb-0">Status</Label>
//                       <div
//                         className="form-label-group"
//                         onChange={(e) => {
//                           setFormData({
//                             ...formData,
//                             ["status"]: e.target.value,
//                           });
//                         }}>
//                         <input
//                           checked={formData?.status == "Active"}
//                           required
//                           style={{ marginRight: "3px" }}
//                           type="radio"
//                           name="status"
//                           value="Active"
//                         />
//                         <span style={{ marginRight: "20px" }}>Active</span>

//                         <input
//                           required
//                           checked={formData?.status == "Deactive"}
//                           style={{ marginRight: "3px" }}
//                           type="radio"
//                           name="status"
//                           value="Deactive"
//                         />
//                         <span style={{ marginRight: "3px" }}>Deactive</span>
//                       </div>
//                     </Col>
//                   </Row> */}
//                   {/* <Row>
//                     <Col>
//                       <div className="d-flex justify-content-center">
//                         <Button.Ripple
//                           color="primary"
//                           type="submit"
//                           className="mr-1 mt-2 mx-2">
//                           Submit
//                         </Button.Ripple>
//                       </div>
//                     </Col>
//                   </Row> */}
//                 </Form>
//               </>
//             )}
//           </CardBody>
//         </Card>
//       </div>
//     </div>
//   );
// };
// export default CreateCustomer;
