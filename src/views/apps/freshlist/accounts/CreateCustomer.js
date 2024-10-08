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
  Spinner,
} from "reactstrap";
import Multiselect from "multiselect-react-dropdown";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { Route, useHistory, useParams } from "react-router-dom";

import swal from "sweetalert";
import "../../../../../src/layouts/assets/scss/pages/users.scss";

import {
  CreateCustomerUpdate,
  CreateCustomersave,
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
  Bulk_Update_Customer,
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
  const [BulkImport, setBulkImport] = useState(null);
  const [Image, setImage] = useState({});
  const [PhotoImage, setPhotoimags] = useState([]);
  const [Selectedtransporter, setSelectedtransporter] = useState([]);
  const [imageUri, setImageUris] = useState([]);
  const [formData, setFormData] = useState({});
  const [Loader, setLoader] = useState(false);
  const [Loading, setLoading] = useState(false);
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

  useEffect(() => {
    let userData = JSON.parse(localStorage.getItem("userData"));
    _Get(Create_Transporter_List, userData?.database)
      .then((res) => {
        let value = res?.Transporter;
        if (value?.length) {
          // setTransporterList(value);
          setAllTransporterList(value);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    if (Params?.id == 0) {
      setMode("Create");
    } else {
      setMode("Edit");

      _Get(View_Customer_ById, Params?.id)
        .then((res) => {
          let value = res?.Customer;
          let object = { ...value };
          object["rolename"] = object?.rolename?._id;

          if (object?.category?._id) {
            object["category"] = object?.category?._id;
          }
          setFormData(object);
          if (value?.assignTransporter?.length) {
            setSelectedtransporter(value?.assignTransporter);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  useEffect(() => {
    let userdata = JSON.parse(localStorage.getItem("userData"));
    _Get(View_CustomerGroup, userdata?.database)
      .then((res) => {
        let myActive = res?.CustomerGroup?.filter(
          (ele) => ele?.status == "Active"
        );
        setCustomerGroup(myActive);
      })
      .catch((err) => {
        console.log(err);
      });
    if (Params?.id == 0) {
      Get_RoleList(userdata?._id, userdata?.database)
        .then((res) => {
          let ShowList = res?.Role?.filter((item, i) =>
            item?.roleName?.toLowerCase()?.includes("customer")
          );
          setFormData({
            ...formData,
            ["rolename"]: ShowList[0]?._id,
            ["roleName"]: ShowList[0]?.roleName,
          });
        })
        .catch((err) => {
          console.log(err);
          swal("Roles List Not found");
        });
    }
  }, []);

  const handleVerifyCompanyPan = async (inputPan) => {
    let payload = {
      api_key: Pan_Verification_key,
      pan: inputPan,
    };
    await _PostSave(Pan_Verification_API, payload)
      .then((res) => {
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
          // swal("Error", "Pan Card notVerified with GST");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    let userData = JSON.parse(localStorage.getItem("userData"));
    setLoader(true);

    let formdata = new FormData();
    if (formData?.assignTransporter) {
      delete formData?.assignTransporter;
    }
    if (formData?.shopPhotos) {
      delete formData?.shopPhotos;
    }

    if (BulkImport !== null || BulkImport != undefined) {
      const formdatas = new FormData();
      formdatas.append("file", BulkImport);
      formdatas.append("database", userData?.database);
      if (formData?.UploadStatus == "Update") {
        let URl = `${Bulk_Update_Customer}/${userData?.database}`;

        await _BulkUpload(URl, formdatas)
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
        let URl = `${Bulk_Upload_Customer}/${userData?.database}`;
        await _BulkUpload(URl, formdatas)
          .then((res) => {
            setLoader(false);
            swal(`${res?.message}`);
          })
          .catch((err) => {
            setLoader(false);
            console.log(err?.response);
            swal("Something Went Wrong");
          });
      } else {
        swal("error", "Choose Type of Upload", "error");
      }
    } else {
      let userdata = JSON.parse(localStorage.getItem("userData"));

      formData["id"] = formData?.comPanNo
        ? formData?.comPanNo
        : formData?.aadharNo;

      for (const [key, value] of Object.entries(formData)) {
        if (!!value) {
          formdata.append(`${key}`, `${value}`);
        }
      }

      if (Image !== null) {
        formdata.append("file", Image);
      }
      if (PhotoImage?.length) {
        PhotoImage?.map((ele) => {
          formdata.append("files", ele);
        });
      }

      if (Selectedtransporter?.length) {
        formdata.append(
          "assignTransporter",
          JSON.stringify(Selectedtransporter)
        );
      }

      if (error) {
      } else {
        if (Params?.id == 0) {
          formdata.append("database", userdata?.database);

          CreateCustomersave(formdata)
            .then((res) => {
              setLoader(false);

              if (res.status) {
                history.push("/app/Ajgroup/account/AssignTeamMember");
                swal("success","Assign Sales Person","success");
              }
            })
            .catch((err) => {
              setLoader(false);
               console.log(err?.response)
              swal("error",err?.response?.data.message ? err?.response?.data?.message : "Error Occured","error");
            });
        } else {
          CreateCustomerUpdate(Params?.id, formdata)
            .then((res) => {
              setLoader(false);

              if (res.status) {
                history.goBack();
                swal("Customer Updated Successfully");
              }
            })
            .catch((err) => {
              setLoader(false);
              swal("something Went Wrong");
            });
        }
      }
    }
  };
  const handleSetShowTransporter = (VALUE) => {
    let list = [...AllTransporterList];
    TransPorterToShow = [];
    list?.map((ele) => {
      ele?.serviceArea?.map((val) => {
        if (val?.city.includes(formData?.City)) {
          TransPorterToShow?.push(ele);
        }
      });
    });

    setTransporterList(TransPorterToShow);
  };

  const onSelect1 = (selectedList, selectedItem) => {
    setSelectedtransporter(selectedList);
  };
  const onRemove1 = (selectedList, selectedItem) => {
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
                    <Col lg="2" md="2">
                      <div className="float-right mt-1">
                        <Button
                          style={{ width: "12rem", fontSize: "16px" }}
                          color="primary"
                          onClick={(e) => {
                            e.preventDefault();
                            setBulkUpload(true);
                          }}>
                          Bulk Upload
                        </Button>
                      </div>
                    </Col>
                  </>
                ) : (
                  <>
                    <Col
                      className="d-flex justify-content-end"
                      lg="2"
                      md="2"
                      xs="12">
                      <Button
                        className="p-1"
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
            {Params?.id == 0 && (
              <>
                {!BulkUpload && !BulkUpload && (
                  <>
                    <Col lg="2" md="2">
                      <div className="float-right mt-1">
                        <Route
                          render={({ history }) => (
                            <Button
                              style={{
                                cursor: "pointer",
                                width: "10rem",
                                fontSize: "16px",
                              }}
                              className=""
                              color="primary"
                              onClick={() =>
                                history.push(
                                  `/app/ajgroup/house/CustomerGroupList`
                                )
                              }>
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
            {!BulkUpload ? (
              <>
                <Col lg="2" md="2">
                  <div className="float-right d-flex justify-content-end mt-1">
                    <Route
                      render={({ history }) => (
                        <Button
                          style={{
                            cursor: "pointer",
                            width: "10rem",
                            fontSize: "16px",
                          }}
                          className="float-right "
                          color="primary"
                          onClick={() =>
                            history.push("/app/SoftNumen/CustomerSearch")
                          }>
                          Back
                        </Button>
                      )}
                    />
                  </div>
                </Col>
              </>
            ) : null}
          </Row>
          {/* <hr /> */}

          <CardBody>
            {BulkUpload && BulkUpload ? (
              <>
                {/* <Form className="m-1" onSubmit={submitHandler}>
                  <Row>
                    <Col>
                      <div className="d-flex justify-content-center">
                        <Label>Upload</Label>
                      </div>

                      <div className="parent d-flex justify-content-center">
                        <div className="file-upload">
                          <FaUpload color="green" size={35} />

                          <p>Click box to upload</p>
                          <input
                            required
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
                              className="mr-1 mt-2 mx-2"
                            >
                              Import
                            </Button.Ripple>
                          </div>
                        </Col>
                      </>
                    )}
                  </Row>
                </Form> */}
                <Form onSubmit={submitHandler}>
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
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                ["UploadStatus"]: e.target.value,
                              });
                            }}>
                            <input
                              required
                              checked={formData?.UploadStatus == "New Upload"}
                              style={{ marginRight: "3px" }}
                              type="radio"
                              name="UploadStatus"
                              value="New Upload"
                            />
                            <span style={{ marginRight: "20px" }}>
                              New Upload
                            </span>

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
                              setBulkImport(e.target.files[0]);
                            }}
                          />
                        </div>
                      </div>
                      {/* <Col lg="4" md="4" sm="12">
                  <FormGroup>
                    <Label>Bulk Import</Label>

                    <Input
                      type="file"
                      placeholder=""
                      name="BulkImport"
                      onChange={(e) => {
                        setBulkImport(e.target.files[0]);
                      }}
                    />
                  </FormGroup>
                </Col> */}
                    </>
                  ) : (
                    <>
                      <Row className="mt-1">
                        <Col lg="6" md="6" sm="12">
                          <Row>
                            <Col className="mb-2" lg="12" md="12" sm="12">
                              <CardBody
                                className="userRegiBody"
                                style={{ paddingBottom: "7.4rem" }}>
                                <div className="d-flex justify-content-center">
                                  <h1>Personal Information</h1>
                                </div>
                                <Row>
                                  <Col lg="6" md="6" sm="12">
                                    <FormGroup className="cssforproductlist">
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
                                        onChange={(e) => {
                                          const inputPan = e.target.value;
                                          const filteredValue =
                                            inputPan.replace(/\s/g, "");
                                          setFormData({
                                            ...formData,
                                            ["firstName"]: filteredValue,
                                          });
                                        }}

                                        // onChange={handleInputChange}
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col lg="6" md="6" sm="12">
                                    <FormGroup className="cssforproductlist">
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
                                  </Col>
                                  <Col lg="6" md="6" sm="12">
                                    <FormGroup className="cssforproductlist">
                                      <Label>
                                        DOB{" "}
                                        <span style={{ color: "red" }}>*</span>
                                      </Label>
                                      <Input
                                        required
                                        // placeholder="one or two or three ..."
                                        type="date"
                                        name="DOB"
                                        value={formData?.DOB}
                                        onChange={handleInputChange}
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col lg="6" md="6" sm="12">
                                    <FormGroup className="cssforproductlist">
                                      <Label>
                                        Mobile Number{" "}
                                        <span style={{ color: "red" }}>*</span>{" "}
                                      </Label>
                                      <PhoneInput
                                        required
                                        inputClass="myphoneinput"
                                        country={"in"}
                                        onKeyDown={(e) => {
                                          ["e", "E", "+", "-"].includes(
                                            e.key
                                          ) && e.preventDefault();
                                        }}
                                        countryCodeEditable={false}
                                        name="mobileNumber"
                                        value={formData?.mobileNumber}
                                        onChange={(phone) => {
                                          setFormData({
                                            ...formData,
                                            ["mobileNumber"]: phone,
                                          });
                                        }}
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col lg="6" md="6" sm="12">
                                    <FormGroup className="cssforproductlist">
                                      <Label>
                                        Email{" "}
                                        <span style={{ color: "red" }}>*</span>{" "}
                                      </Label>
                                      <Input
                                        required
                                        placeholder="Enter Email id here"
                                        type="email"
                                        name="email"
                                        value={formData?.email}
                                        onChange={handleInputChange}
                                      />
                                    </FormGroup>
                                  </Col>

                                  <Col lg="6" md="6" sm="12">
                                    <FormGroup className="cssforproductlist">
                                      <Label>
                                        Father Name{" "}
                                        <span style={{ color: "red" }}>*</span>
                                      </Label>
                                      <Input
                                        required
                                        placeholder="Enter Father name"
                                        type="text"
                                        name="Father_name"
                                        value={formData?.Father_name}
                                        onChange={handleInputChange}
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col lg="6" md="6" sm="12">
                                    <FormGroup className="cssforproductlist">
                                      <Label>
                                        Father Mobile Number{" "}
                                        <span style={{ color: "red" }}>*</span>
                                      </Label>
                                      <PhoneInput
                                        required
                                        inputClass="myphoneinput"
                                        country={"in"}
                                        onKeyDown={(e) => {
                                          ["e", "E", "+", "-"].includes(
                                            e.key
                                          ) && e.preventDefault();
                                        }}
                                        countryCodeEditable={false}
                                        name="Father_MobileNo"
                                        value={formData?.Father_MobileNo}
                                        onChange={(phone) => {
                                          setFormData({
                                            ...formData,
                                            ["Father_MobileNo"]: phone,
                                          });
                                        }}
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col lg="6" md="6" sm="12">
                                    <FormGroup className="cssforproductlist">
                                      <Label>
                                        Mother Mobile Number{" "}
                                        <span style={{ color: "red" }}>*</span>
                                      </Label>
                                      <PhoneInput
                                        inputClass="myphoneinput"
                                        country={"in"}
                                        onKeyDown={(e) => {
                                          ["e", "E", "+", "-"].includes(
                                            e.key
                                          ) && e.preventDefault();
                                        }}
                                        countryCodeEditable={false}
                                        name="MotherMobileNo"
                                        value={formData?.MotherMobileNo}
                                        onChange={(phone) => {
                                          setFormData({
                                            ...formData,
                                            ["MotherMobileNo"]: phone,
                                          });
                                        }}
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col lg="6" md="6" sm="12">
                                    <FormGroup className="cssforproductlist">
                                      <Label>
                                        Thana Name{" "}
                                        <span style={{ color: "red" }}>*</span>
                                      </Label>
                                      <Input
                                        required
                                        placeholder="Enter Thana name"
                                        type="text"
                                        name="Thananame"
                                        value={formData?.Thananame}
                                        onChange={handleInputChange}
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col lg="6" md="6" sm="12">
                                    <FormGroup className="cssforproductlist">
                                      <Label>Passport Number</Label>
                                      <Input
                                        placeholder="Enter Passport number"
                                        type="text"
                                        name="PassportNo"
                                        value={formData?.PassportNo}
                                        onChange={handleInputChange}
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col lg="6" md="6" sm="12">
                                    <FormGroup className="cssforproductlist">
                                      <Label>Driving License Number</Label>
                                      <Input
                                        placeholder="Enter Driving License Number"
                                        type="text"
                                        name="DL_Num"
                                        value={formData?.DL_Num}
                                        onChange={handleInputChange}
                                      />
                                    </FormGroup>
                                  </Col>
                                  {formData?.Pan_No?.length == 10 ? (
                                    <>
                                      <Col lg="6" md="6" sm="12">
                                        <FormGroup className="cssforproductlist">
                                          <Label>Aadhar Number</Label>
                                          <Input
                                            minLength={12}
                                            maxLength={12}
                                            pattern="[0-9]*"
                                            placeholder="Enter Addhar Number"
                                            type="text"
                                            name="Aadhar_No"
                                            value={formData?.Aadhar_No}
                                            onChange={(e) => {
                                              const inputPan = e.target.value;
                                              const panRegex = /^\d{12}$/;

                                              setFormData({
                                                ...formData,
                                                ["Aadhar_No"]: inputPan,
                                                ["IsValid_Aadhar_No"]:
                                                  panRegex.test(inputPan),
                                              });
                                            }}
                                            // onChange={handleInputChange}
                                          />
                                          {/* <span>
                                      {formData?.IsValid_Aadhar_No &&
                                      formData?.IsValid_Aadhar_No ? (
                                        <>
                                          <span style={{ color: "green" }}>
                                            Correct
                                          </span>
                                        </>
                                      ) : (
                                        <>
                                          {formData?.Aadhar_No?.length > 16 ||
                                            (formData?.Aadhar_No?.length <
                                              15 && (
                                              <span style={{ color: "red" }}>
                                                Enter Correct AadharNo
                                              </span>
                                            ))}
                                        </>
                                      )}
                                    </span> */}
                                        </FormGroup>
                                      </Col>
                                    </>
                                  ) : (
                                    <>
                                      <Col lg="6" md="6" sm="12">
                                        <FormGroup className="cssforproductlist">
                                          <Label>
                                            Aadhar Number{" "}
                                            <span style={{ color: "red" }}>
                                              *
                                            </span>
                                          </Label>
                                          <Input
                                            required
                                            minLength={12}
                                            maxLength={12}
                                            pattern="[0-9]*"
                                            placeholder="Enter Addhar Number"
                                            type="text"
                                            name="Aadhar_No"
                                            value={formData?.Aadhar_No}
                                            onChange={(e) => {
                                              const inputPan = e.target.value;
                                              const panRegex = /^\d{12}$/;

                                              setFormData({
                                                ...formData,
                                                ["Aadhar_No"]: inputPan,
                                                ["IsValid_Aadhar_No"]:
                                                  panRegex.test(inputPan),
                                              });
                                            }}
                                            // onChange={handleInputChange}
                                          />
                                          <span>
                                            {formData?.IsValid_Aadhar_No &&
                                            formData?.IsValid_Aadhar_No ? (
                                              <>
                                                <span
                                                  style={{ color: "green" }}>
                                                  Correct
                                                </span>
                                              </>
                                            ) : (
                                              <>
                                                {formData?.Aadhar_No?.length >
                                                  16 ||
                                                  (formData?.Aadhar_No?.length <
                                                    15 && (
                                                    <span
                                                      style={{ color: "red" }}>
                                                      Enter Correct AadharNo
                                                    </span>
                                                  ))}
                                              </>
                                            )}
                                          </span>
                                        </FormGroup>
                                      </Col>
                                    </>
                                  )}

                                  {formData?.Aadhar_No?.length == 12 ? (
                                    <>
                                      <Col lg="6" md="6" sm="12">
                                        <FormGroup className="cssforproductlist">
                                          <Label>Pan Number </Label>
                                          <Input
                                            minLength={10}
                                            maxLength={10}
                                            placeholder="Enter Pan Number"
                                            type="text"
                                            name="Pan_No"
                                            value={formData?.Pan_No}
                                            onChange={(e) => {
                                              const inputPan =
                                                e.target.value?.toUpperCase();
                                              const panRegex =
                                                /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
                                              setFormData({
                                                ...formData,
                                                ["Pan_No"]: inputPan,
                                                ["IsValid_Pan_No"]:
                                                  panRegex.test(inputPan),
                                              });
                                            }}
                                          />
                                          {/* <span>
                                      {formData?.IsValid_Pan_No &&
                                      formData?.IsValid_Pan_No ? (
                                        <>
                                          <span style={{ color: "green" }}>
                                            Correct
                                          </span>
                                        </>
                                      ) : (
                                        <>
                                          {formData?.Pan_No?.length > 9 && (
                                            <span style={{ color: "red" }}>
                                              Enter Correct PAN Number
                                            </span>
                                          )}
                                        </>
                                      )}
                                    </span> */}
                                        </FormGroup>
                                      </Col>
                                    </>
                                  ) : (
                                    <>
                                      <Col lg="6" md="6" sm="12">
                                        <FormGroup className="cssforproductlist">
                                          <Label>
                                            Pan Number{" "}
                                            <span style={{ color: "red" }}>
                                              *
                                            </span>
                                          </Label>
                                          <Input
                                            required
                                            minLength={10}
                                            maxLength={10}
                                            placeholder="Enter Pan Number"
                                            type="text"
                                            name="Pan_No"
                                            value={formData?.Pan_No}
                                            onChange={(e) => {
                                              const inputPan =
                                                e.target.value?.toUpperCase();
                                              const panRegex =
                                                /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
                                              setFormData({
                                                ...formData,
                                                ["Pan_No"]: inputPan,

                                                ["IsValid_Pan_No"]:
                                                  panRegex.test(inputPan),
                                              });
                                            }}
                                          />
                                          <span>
                                            {formData?.IsValid_Pan_No &&
                                            formData?.IsValid_Pan_No ? (
                                              <>
                                                <span
                                                  style={{ color: "green" }}>
                                                  Correct
                                                </span>
                                              </>
                                            ) : (
                                              <>
                                                {formData?.Pan_No?.length >
                                                  9 && (
                                                  <span
                                                    style={{ color: "red" }}>
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
                                    <FormGroup className="cssforproductlist">
                                      <Label>
                                        Bank Name{" "}
                                        <span style={{ color: "red" }}>*</span>
                                      </Label>
                                      <Input
                                        required
                                        placeholder="Enter Bank Name"
                                        type="text"
                                        name="Account_Name"
                                        value={formData?.Account_Name}
                                        onChange={handleInputChange}
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col lg="6" md="6" sm="12">
                                    <FormGroup className="cssforproductlist">
                                      <Label>
                                        Account Number{" "}
                                        <span style={{ color: "red" }}>*</span>
                                      </Label>
                                      <Input
                                        required
                                        placeholder="Enter Account Number"
                                        type="text"
                                        name="Account_No"
                                        value={formData?.Account_No}
                                        onChange={handleInputChange}
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col lg="6" md="6" sm="12">
                                    <FormGroup className="cssforproductlist">
                                      <Label>
                                        Ifsc code{" "}
                                        <span style={{ color: "red" }}>*</span>
                                      </Label>
                                      <Input
                                        required
                                        placeholder="Enter Ifsc code"
                                        type="text"
                                        name="Ifsc_code"
                                        value={formData?.Ifsc_code}
                                        onChange={handleInputChange}
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col lg="6" md="6" sm="12">
                                    <FormGroup className="cssforproductlist">
                                      <Label>
                                        Pin Code Number{" "}
                                        <span style={{ color: "red" }}>*</span>
                                      </Label>
                                      <Input
                                        required
                                        onKeyDown={(e) => {
                                          ["e", "E", "+", "-"].includes(
                                            e.key
                                          ) && e.preventDefault();
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

                                          if (SelectedCity?.length) {
                                            setFormData({
                                              ...formData,
                                              ["State"]:
                                                SelectedCity[0]?.StateName,
                                              ["City"]:
                                                SelectedCity[0]?.District,
                                              ["pincode"]: e.target.value,
                                            });
                                          } else {
                                            setFormData({
                                              ...formData,
                                              ["pincode"]: e.target.value,
                                            });
                                          }
                                        }}
                                      />
                                    </FormGroup>
                                  </Col>

                                  <Col lg="6" md="6" sm="12">
                                    <FormGroup className="cssforproductlist">
                                      <Label>City</Label>
                                      <Input
                                        readOnly
                                        placeholder="City name"
                                        type="text"
                                        name="City"
                                        value={formData?.City}
                                        onChange={handleInputChange}
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col lg="6" md="6" sm="12">
                                    <FormGroup className="cssforproductlist">
                                      <Label>State</Label>
                                      <Input
                                        readOnly
                                        placeholder="State name"
                                        type="text"
                                        name="State"
                                        value={formData?.State}
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
                                          <Label>Images</Label>
                                        </div>

                                        <div className="parent">
                                          <div className="file-upload">
                                            <FaUpload color="green" size={35} />

                                            <p>Click box to upload</p>
                                            <p>Maximun file size 1 MB</p>
                                            <input
                                              type="file"
                                              name="images"
                                              onChange={(e) => {
                                                let myfile = e.target.files[0];
                                                if (myfile) {
                                                  const sizeInMB =
                                                    myfile.size / (1024 * 1024); // Convert bytes to MB
                                                  if (sizeInMB > 1) {
                                                    swal(
                                                      "Error",
                                                      "The file is larger than 1 MB.",
                                                      "error"
                                                    );
                                                  }
                                                }
                                                const fiels = e.target.files[0];

                                                setImage(e.target.files[0]);
                                                if (fiels) {
                                                  const reader =
                                                    new FileReader();
                                                  reader.onload = (e) => {
                                                    setFormData({
                                                      ...formData,

                                                      ["imageuri"]:
                                                        e.target.result,
                                                    });
                                                  };
                                                  reader.readAsDataURL(fiels);
                                                }
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </Col>
                                      {/* <Col lg="6" md="6" sm="12">
                                  <FormGroup>
                                    <Label>Image</Label>
                                    <Input
                                      required
                                      placeholder="Enter Ifsc code"
                                      type="file"
                                      name="file"
                                      // value={formData?.Ifsc_code}
                                      onChange={(e) => {
                                        const fiels = e.target.files[0];
                                        if (fiels) {
                                          const reader = new FileReader();
                                          reader.onload = (e) => {
                                            setFormData({
                                              ...formData,
                                              ["file"]: fiels,
                                              ["imageuri"]: e.target.result,
                                            });
                                          };
                                          reader.readAsDataURL(fiels);
                                        }
                                      }}
                                    />
                                  </FormGroup>
                                </Col> */}
                                      {formData?.imageuri && (
                                        <Col lg="6" md="6" sm="12">
                                          <img
                                            style={{ borderRadius: "8px" }}
                                            src={formData?.imageuri}
                                            height={100}
                                            width={120}
                                            alt="image"
                                          />
                                        </Col>
                                      )}
                                      {formData?.profileImage && (
                                        <Col lg="6" md="6" sm="12">
                                          <img
                                            style={{ borderRadius: "8px" }}
                                            src={`${Image_URL}/Images/${formData?.profileImage}`}
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
                        <Col lg="6" md="6" sm="12">
                          <CardBody className="userRegiBody">
                            <div className="d-flex justify-content-center">
                              <h1>Last Working Details</h1>
                            </div>
                            <Row>
                              <Col lg="6" md="6" sm="12">
                                <FormGroup className="cssforproductlist">
                                  <Label>
                                    Firm Name
                                    {/* <span style={{ color: "red" }}>*</span> */}
                                  </Label>
                                  <Input
                                    // required
                                    className="form-control"
                                    placeholder="last job firm name"
                                    type="text"
                                    name="last_job_firm_name"
                                    value={formData?.last_job_firm_name}
                                    onChange={handleInputChange}
                                  />
                                </FormGroup>
                              </Col>
                              <Col lg="6" md="6" sm="12">
                                <FormGroup className="cssforproductlist">
                                  <Label>
                                    Profile Name{" "}
                                    {/* <span style={{ color: "red" }}>*</span> */}
                                  </Label>
                                  <Input
                                    // required
                                    className="form-control"
                                    placeholder="last job Profile Name"
                                    type="text"
                                    name="last_job_Profile"
                                    value={formData?.last_job_Profile}
                                    onChange={handleInputChange}
                                  />
                                </FormGroup>
                              </Col>
                              <Col lg="6" md="6" sm="12">
                                <FormGroup className="cssforproductlist">
                                  <Label>
                                    Address
                                    {/* <span style={{ color: "red" }}>*</span> */}
                                  </Label>
                                  <Input
                                    // required
                                    className="form-control"
                                    placeholder="last job Address"
                                    type="text"
                                    name="last_job_address"
                                    value={formData?.last_job_address}
                                    onChange={handleInputChange}
                                  />
                                </FormGroup>
                              </Col>

                              <Col lg="6" md="6" sm="12">
                                <FormGroup className="cssforproductlist">
                                  <Label>
                                    Contact Number{" "}
                                    {/* <span style={{ color: "red" }}>*</span> */}
                                  </Label>
                                  <PhoneInput
                                    inputClass="myphoneinput"
                                    country={"in"}
                                    onKeyDown={(e) => {
                                      ["e", "E", "+", "-"].includes(e.key) &&
                                        e.preventDefault();
                                    }}
                                    countryCodeEditable={false}
                                    name="last_job_PhNo"
                                    value={formData?.last_job_PhNo}
                                    onChange={(phone) => {
                                      setFormData({
                                        ...formData,
                                        ["last_job_PhNo"]: phone,
                                      });
                                    }}
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                          </CardBody>

                          <CardBody className="userRegiBody mt-2">
                            <div className="d-flex justify-content-center">
                              <h1>
                                Reference information{" "}
                                <span style={{ color: "red" }}>*</span>
                              </h1>
                            </div>
                            <Row>
                              <Col lg="6" md="6" sm="6">
                                <FormGroup className="cssforproductlist">
                                  <Label>Name</Label>
                                  <Input
                                    className="form-control"
                                    placeholder="Refernece name"
                                    type="text"
                                    name="Ref_name_one"
                                    value={formData?.Ref_name_one}
                                    onChange={handleInputChange}
                                  />
                                </FormGroup>
                              </Col>
                              <Col lg="6" md="6" sm="6">
                                <FormGroup className="cssforproductlist">
                                  <Label>Relation</Label>
                                  <Input
                                    className="form-control"
                                    placeholder="Refernece Relation"
                                    type="text"
                                    name="refer_Relation_one"
                                    value={formData?.refer_Relation_one}
                                    onChange={handleInputChange}
                                  />
                                </FormGroup>
                              </Col>

                              <Col lg="6" md="6" sm="6">
                                <FormGroup className="cssforproductlist">
                                  <Label>Mobile Number</Label>
                                  <PhoneInput
                                    inputClass="myphoneinput"
                                    country={"in"}
                                    onKeyDown={(e) => {
                                      ["e", "E", "+", "-"].includes(e.key) &&
                                        e.preventDefault();
                                    }}
                                    countryCodeEditable={false}
                                    name="Ref_Mob_No_one"
                                    value={formData?.Ref_Mob_No_one}
                                    onChange={(phone) => {
                                      setFormData({
                                        ...formData,
                                        ["Ref_Mob_No_one"]: phone,
                                      });
                                    }}
                                  />
                                </FormGroup>
                              </Col>
                              <hr />

                              <Col lg="6" md="6" sm="6">
                                <FormGroup className="cssforproductlist">
                                  <Label>Name</Label>
                                  <Input
                                    className="form-control"
                                    placeholder="Refernece name"
                                    type="text"
                                    name="Ref_name_sec"
                                    value={formData?.Ref_name_sec}
                                    onChange={handleInputChange}
                                  />
                                </FormGroup>
                              </Col>
                              <Col lg="6" md="6" sm="6">
                                <FormGroup className="cssforproductlist">
                                  <Label>Relation</Label>
                                  <Input
                                    className="form-control"
                                    placeholder="Refernece Relation"
                                    type="text"
                                    name="refer_Relation_two"
                                    value={formData?.refer_Relation_two}
                                    onChange={handleInputChange}
                                  />
                                </FormGroup>
                              </Col>

                              <Col lg="6" md="6" sm="6">
                                <FormGroup className="cssforproductlist">
                                  <Label>Mobile Number</Label>
                                  <PhoneInput
                                    inputClass="myphoneinput"
                                    country={"in"}
                                    onKeyDown={(e) => {
                                      ["e", "E", "+", "-"].includes(e.key) &&
                                        e.preventDefault();
                                    }}
                                    countryCodeEditable={false}
                                    name="Ref_Mob_No_two"
                                    value={formData?.Ref_Mob_No_two}
                                    onChange={(phone) => {
                                      setFormData({
                                        ...formData,
                                        ["Ref_Mob_No_two"]: phone,
                                      });
                                    }}
                                  />
                                </FormGroup>
                              </Col>
                              <hr />

                              <Col lg="6" md="6" sm="6">
                                <FormGroup className="cssforproductlist">
                                  <Label>Name</Label>
                                  <Input
                                    className="form-control"
                                    placeholder="Refernece name"
                                    type="text"
                                    name="Ref_name_third"
                                    value={formData?.Ref_name_third}
                                    onChange={handleInputChange}
                                  />
                                </FormGroup>
                              </Col>
                              <Col lg="6" md="6" sm="6">
                                <FormGroup className="cssforproductlist">
                                  <Label>Relation</Label>
                                  <Input
                                    className="form-control"
                                    placeholder="Refernece Relation"
                                    type="text"
                                    name="refer_Relation_third"
                                    value={formData?.refer_Relation_third}
                                    onChange={handleInputChange}
                                  />
                                </FormGroup>
                              </Col>

                              <Col lg="6" md="6" sm="6">
                                <FormGroup className="cssforproductlist">
                                  <Label>Mobile Number</Label>
                                  <PhoneInput
                                    inputClass="myphoneinput"
                                    country={"in"}
                                    onKeyDown={(e) => {
                                      ["e", "E", "+", "-"].includes(e.key) &&
                                        e.preventDefault();
                                    }}
                                    countryCodeEditable={false}
                                    name="Ref_Mob_No_third"
                                    value={formData?.Ref_Mob_No_third}
                                    onChange={(phone) => {
                                      setFormData({
                                        ...formData,
                                        ["Ref_Mob_No_third"]: phone,
                                      });
                                    }}
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                          </CardBody>

                          <CardBody className="userRegiBody mt-2">
                            <div className="d-flex justify-content-center">
                              <h1>Official information</h1>
                            </div>
                            <Row style={{ paddingBottom: "2.3rem" }}>
                              <Col lg="6" md="6" sm="12">
                                <FormGroup className="cssforproductlist">
                                  <Label>
                                    select Role{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </Label>
                                  <CustomInput
                                    required
                                    type="select"
                                    name="rolename"
                                    value={formData.rolename}
                                    onChange={(e) => {
                                      // const selectedName =
                                      //   e.target.options[
                                      //     e.target.selectedIndex
                                      //   ].getAttribute("data-name");
                                      const selectedPosition =
                                        e.target.options[
                                          e.target.selectedIndex
                                        ].getAttribute("data-id");
                                      if (
                                        selectedPosition == "WareHouse Incharge"
                                      ) {
                                        setWareHouseIncharge(true);
                                      } else {
                                        setWareHouseIncharge(false);
                                      }
                                      if (
                                        selectedPosition
                                          ?.toLowerCase()
                                          ?.includes("admin") ||
                                        selectedPosition
                                          ?.toLowerCase()
                                          ?.includes("superadmin")
                                      ) {
                                        let userdata = JSON.parse(
                                          localStorage.getItem("userData")
                                        );

                                        formData["created_by"] = userdata?._id;
                                      }

                                      setFormData({
                                        ...formData,
                                        ["rolename"]: e.target.value,
                                        ["position"]: selectedPosition,
                                      });
                                    }}>
                                    <option>--select Role--</option>
                                    {dropdownValue &&
                                      dropdownValue?.length &&
                                      dropdownValue?.map((ele, i) => {
                                        return (
                                          <option
                                            data-id={ele?.roleName}
                                            data-name={ele?.database}
                                            value={ele?._id}>
                                            {ele?.roleName}
                                          </option>
                                        );
                                      })}
                                  </CustomInput>
                                </FormGroup>
                              </Col>
                              {!Master && !Master && (
                                <>
                                  <Col lg="6" md="6" sm="12">
                                    <FormGroup className="cssforproductlist">
                                      <Label>
                                        Select Shift{" "}
                                        <span style={{ color: "red" }}>*</span>
                                      </Label>
                                      <CustomInput
                                        required
                                        type="select"
                                        name="shift"
                                        value={formData.shift}
                                        onChange={(e) => {
                                          const selectedPosition =
                                            e.target.options[
                                              e.target.selectedIndex
                                            ].getAttribute("data-id");

                                          setFormData({
                                            ...formData,
                                            ["shift"]: e.target.value,
                                          });
                                        }}>
                                        <option value="NA">
                                          --select Shift--
                                        </option>
                                        {shiftList &&
                                          shiftList?.length &&
                                          shiftList?.map((ele, i) => {
                                            return (
                                              <option
                                                data-id={ele?.shiftName}
                                                data-name={ele?.database}
                                                value={ele?._id}>
                                                {ele?.shiftName}(
                                                {`${ele?.fromTime}-${ele?.toTime}`}
                                                )
                                              </option>
                                            );
                                          })}
                                      </CustomInput>
                                    </FormGroup>
                                  </Col>
                                  <Col lg="6" md="6" sm="12">
                                    <FormGroup className="cssforproductlist">
                                      <Label>
                                        Select Branch{" "}
                                        <span style={{ color: "red" }}>*</span>
                                      </Label>
                                      <CustomInput
                                        required
                                        type="select"
                                        name="branch"
                                        value={formData.branch}
                                        onChange={(e) => {
                                          const selectedPosition =
                                            e.target.options[
                                              e.target.selectedIndex
                                            ].getAttribute("data-id");

                                          setFormData({
                                            ...formData,
                                            ["branch"]: e.target.value,
                                          });
                                        }}>
                                        <option value="NA">
                                          --select Branch--
                                        </option>
                                        {Branch &&
                                          Branch?.length &&
                                          Branch?.map((ele, i) => {
                                            return (
                                              <option
                                                data-id={ele?.branchName}
                                                data-name={ele?.database}
                                                value={ele?._id}>
                                                {ele?.branchName}({ele?.city})
                                              </option>
                                            );
                                          })}
                                      </CustomInput>
                                    </FormGroup>
                                  </Col>
                                </>
                              )}
                              {WareHouseIncharge && WareHouseIncharge && (
                                <>
                                  <Col className="mb-1" lg="6" md="6" sm="12">
                                    <div className="cssforproductlist">
                                      <Label>Selected WareHouse </Label>
                                      <Multiselect
                                        style={{ height: "43px" }}
                                        required
                                        showCheckbox="true"
                                        isObject="false"
                                        options={WareHouseList} // Options to display in the dropdown
                                        selectedValues={SelectedWareHouse} // Preselected value to persist in dropdown
                                        onSelect={(
                                          selectedList,
                                          selectedItem
                                        ) => {
                                          setSelectedWareHouse(selectedList);
                                        }} // Function will trigger on select event
                                        onRemove={(
                                          selectedList,
                                          removedItem
                                        ) => {
                                          setSelectedWareHouse(selectedList);
                                        }} // Function will trigger on remove event
                                        displayValue="warehouseName" // Property name to display in the dropdown options
                                      />
                                    </div>
                                  </Col>
                                </>
                              )}
                              {Master && Master && (
                                <>
                                  <Col className="mb-1" lg="6" md="6" sm="12">
                                    <div className="">
                                      <Label>Select Roles to Assign * </Label>

                                      <Multiselect
                                        required
                                        showCheckbox="true"
                                        isObject="false"
                                        options={AllAssignRoleList} // Options to display in the dropdown
                                        selectedValues={SelectedRoleToAssign} // Preselected value to persist in dropdown
                                        onSelect={onSelect1} // Function will trigger on select event
                                        onRemove={onRemove1} // Function will trigger on remove event
                                        displayValue="roleName" // Property name to display in the dropdown options
                                      />
                                    </div>
                                  </Col>
                                  {Mode !== "Update" && (
                                    <Col lg="6" md="6" sm="12">
                                      <FormGroup className="cssforproductlist">
                                        <Label>
                                          Plan Name{" "}
                                          <span style={{ color: "red" }}>
                                            *
                                          </span>
                                        </Label>
                                        <CustomInput
                                          required
                                          type="select"
                                          value={formData["subscriptionPlan"]}
                                          onChange={(e) => {
                                            setFormData({
                                              ...formData,
                                              ["subscriptionPlan"]:
                                                e.target.value,
                                            });
                                          }}>
                                          <option value="0">
                                            ----select Plan----
                                          </option>
                                          {SubsCriptionList?.length > 0 && (
                                            <>
                                              {SubsCriptionList?.map(
                                                (ele, index) => (
                                                  <option
                                                    key={index}
                                                    value={ele?._id}>
                                                    {ele?.planName} (Price -
                                                    {ele?.subscriptionCost})(
                                                    {ele?.subscriptionType == 1
                                                      ? "Yearly"
                                                      : "One Time"}
                                                    )
                                                  </option>
                                                )
                                              )}
                                            </>
                                          )}
                                        </CustomInput>
                                      </FormGroup>
                                    </Col>
                                  )}
                                  <Col lg="6" md="6" sm="12">
                                    <FormGroup className="cssforproductlist">
                                      <Label>
                                        Database Name{" "}
                                        <span style={{ color: "red" }}>*</span>
                                      </Label>
                                      <Input
                                        required
                                        placeholder="one or two or three ..."
                                        type="text"
                                        value={formData["database"]}
                                        onChange={(e) => {
                                          setFormData({
                                            ...formData,
                                            ["database"]: e.target.value,
                                          });
                                        }}
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col lg="6" md="6" sm="12">
                                    <FormGroup className="cssforproductlist">
                                      <Label>
                                        Lat Long{" "}
                                        <span style={{ color: "red" }}>*</span>
                                      </Label>
                                      <Input
                                        required
                                        placeholder="Enter Lat Long Of user ..."
                                        type="text"
                                        value={formData["late_long"]}
                                        onChange={(e) => {
                                          setFormData({
                                            ...formData,
                                            ["late_long"]: e.target.value,
                                          });
                                        }}
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col lg="6" md="6" sm="12">
                                    <FormGroup className="cssforproductlist">
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
                                    <FormGroup className="cssforproductlist">
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
                              )}
                              {/* <Col lg="6" md="6" sm="12">
                                <FormGroup className="cssforproductlist">
                                  <Label>Id</Label>
                                  <Input
                                    readOnly
                                    placeholder="Ex. 1254f55d545de545edg44"
                                    type="text"
                                    name="id"
                                    value={formData.id}
                                    onChange={e => {
                                      setFormData({
                                        ...formData,
                                        id: e.target.value,
                                      });
                                    }}
                                  />
                                </FormGroup>
                              </Col> */}

                              <Col lg="6" md="6" sm="12">
                                <FormGroup className="cssforproductlist">
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

                              {!Master && !Master && (
                                <>
                                  <Col lg="6" md="6" sm="12">
                                    <FormGroup className="cssforproductlist">
                                      <Label>
                                        Appointment Date{" "}
                                        <span style={{ color: "red" }}>*</span>
                                      </Label>
                                      <Input
                                        required
                                        className="form-control"
                                        placeholder="Appointment Date"
                                        type="date"
                                        name="last_job_AppoitmentDate"
                                        value={
                                          formData?.last_job_AppoitmentDate
                                        }
                                        onChange={handleInputChange}
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col lg="6" md="6" sm="12">
                                    <FormGroup className="cssforproductlist">
                                      <Label>
                                        Designation{" "}
                                        <span style={{ color: "red" }}>*</span>
                                      </Label>
                                      <Input
                                        required
                                        className="form-control"
                                        placeholder="last Job Designation"
                                        type="text"
                                        name="last_job_Designation"
                                        value={formData?.last_job_Designation}
                                        onChange={handleInputChange}
                                      />
                                    </FormGroup>
                                  </Col>

                                  {formData?.position == "Sales Person" && (
                                    <Col lg="6" md="6" sm="12">
                                      <FormGroup className="cssforproductlist">
                                        <Label>
                                          Area{" "}
                                          <span style={{ color: "red" }}>
                                            *
                                          </span>
                                        </Label>
                                        <Input
                                          required
                                          className="form-control"
                                          placeholder=" Enter Area"
                                          type="text"
                                          name="area"
                                          value={formData?.area}
                                          onChange={handleInputChange}
                                        />
                                      </FormGroup>
                                    </Col>
                                  )}
                                  <Col lg="6" md="6" sm="12">
                                    <FormGroup className="cssforproductlist">
                                      <Label>
                                        Base Salary/Month{" "}
                                        <span style={{ color: "red" }}>*</span>
                                      </Label>
                                      <Input
                                        required
                                        className="form-control"
                                        placeholder="Base Salary"
                                        type="number"
                                        name="last_job_Salary"
                                        value={formData?.last_job_Salary}
                                        onChange={handleInputChange}
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col lg="6" md="6" sm="12">
                                    <FormGroup className="cssforproductlist">
                                      <Label>
                                        PF Percentage{" "}
                                        <span style={{ color: "red" }}>*</span>
                                      </Label>
                                      <Input
                                        required
                                        className="form-control"
                                        placeholder="Pf Percentage like 8 "
                                        maxLength={2}
                                        type="number"
                                        name="pfPercentage"
                                        value={formData?.pfPercentage}
                                        onChange={(e) => {
                                          const inputValue = e.target.value;
                                          // Check if the input value is a number and has at most 2 digits
                                          if (/^\d{0,2}$/.test(inputValue)) {
                                            setFormData({
                                              ...formData,
                                              ["pfPercentage"]: inputValue,
                                            });
                                          }
                                        }}
                                        // onChange={handleInputChange}
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col className="mb-1" lg="6" md="6" sm="12">
                                    <Label>
                                      Employee Rule{" "}
                                      <span style={{ color: "red" }}>*</span>{" "}
                                    </Label>
                                    <Multiselect
                                      required
                                      showCheckbox="true"
                                      isObject="false"
                                      options={Rule} // Options to display in the dropdown
                                      selectedValues={SelectedRules} // Preselected value to persist in dropdown
                                      onSelect={(
                                        selectedList,
                                        selectedItem
                                      ) => {
                                        SetRules(selectedList);
                                        // setSelectedWareHouse(selectedList);
                                      }} // Function will trigger on select event
                                      onRemove={(selectedList, removedItem) => {
                                        SetRules(selectedList);

                                        // setSelectedWareHouse(selectedList);
                                      }} // Function will trigger on remove event
                                      displayValue="title" // Property name to display in the dropdown options
                                    />
                                  </Col>
                                </>
                              )}
                            </Row>
                          </CardBody>
                        </Col>
                      </Row>
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
                              required
                              checked={formData?.status == "Active"}
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
                    </>
                  )}
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
                      <Row>
                        <Col>
                          <div className="d-flex justify-content-center">
                            <Button.Ripple
                              color="primary"
                              type="submit"
                              className="mr-1 mt-2 mx-2">
                              {Mode && Mode}
                            </Button.Ripple>
                          </div>
                        </Col>
                      </Row>
                    </>
                  )}
                </Form>
              </>
            ) : (
              <>
                <Form className="m-1" onSubmit={submitHandler}>
                  <Row>
                    {/* <Col lg="6" md="6" sm="12">
                      <Row>
                        <Col className="mb-2" lg="12" md="12" sm="12">
                          <CardBody className="userRegiBody">
                            <div className="d-flex justify-content-center">
                              <h1>Personal Information</h1>
                            </div>
                            <Row style={{ paddingBottom: "16rem" }}>
                              <Col lg="6" md="6" sm="12">
                                <FormGroup>
                                  <Label>
                                    Full Name{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </Label>
                                  <Input
                                    required
                                    placeholder="Enter First Name"
                                    type="text"
                                    name="firstName"
                                    value={formData?.firstName}
                                    onChange={(e) => {
                                      const inputPan = e.target.value;
                                      const filteredValue = inputPan.replace(
                                        /\s/g,
                                        ""
                                      );
                                      setFormData({
                                        ...formData,
                                        
                                        ["firstName"]: inputPan,
                                      });
                                    }}
                                    
                                  />
                                </FormGroup>
                              </Col>
                              <Col lg="6" md="6" sm="12">
                                <FormGroup>
                                  <Label>Last Name</Label>
                                  <Input
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
                                    required
                                    inputClass="myphoneinput"
                                    country={"in"}
                                    onKeyDown={(e) => {
                                      ["e", "E", "+", "-"].includes(e.key) &&
                                        e.preventDefault();
                                    }}
                                    countryCodeEditable={false}
                                    name="mobileNumber"
                                    value={JSON.stringify(
                                      formData?.mobileNumber
                                    )}
                                   
                                    onChange={(phone) => {
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
                                    required
                                    minLength={12}
                                    maxLength={12}
                                    pattern="[0-9]*"
                                    placeholder="Enter Addhar Number"
                                    type="number"
                                    name="aadharNo"
                                    value={formData?.aadharNo}
                                    onChange={(e) => {
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
                                    minLength={10}
                                    maxLength={10}
                                    placeholder="Enter Pan Number"
                                    type="text"
                                    name="panNo"
                                    value={formData?.panNo}
                                    onChange={(e) => {
                                      const inputPan =
                                        e.target.value?.toUpperCase();
                                      const panRegex =
                                        /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
                                      setFormData({
                                        ...formData,
                                        ["panNo"]: inputPan,
                                        ["IsValid_Pan_No"]:
                                          panRegex.test(inputPan),
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
                                    required
                                    onKeyDown={(e) => {
                                      ["e", "E", "+", "-"].includes(e.key) &&
                                        e.preventDefault();
                                    }}
                                    type="number"
                                    placeholder="Enter Pin Code here"
                                    name="personalPincode"
                                    value={formData?.personalPincode}
                                    onChange={(e) => {
                                      let SelectedCity =
                                        Country_State_city?.filter(
                                          (ele) =>
                                            ele?.Pincode == e.target.value
                                        );
                                      
                                      if (SelectedCity?.length) {
                                        setFormData({
                                          ...formData,
                                          ["Pstate"]:
                                            SelectedCity[0]?.StateName,
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
                                    className="form-control"
                                    placeholder="address name"
                                    type="text"
                                    name="address"
                                    value={formData?.address}
                                    onChange={handleInputChange}
                                  />
                                </FormGroup>
                              </Col>

                              <Col className="mt-2 " lg="12" md="12" sm="12">
                                <Row>
                                  <Col lg="6" md="6" sm="6" xs="12">
                                    <div className="d-flex justify-content-center">
                                      <Label>Image</Label>
                                    </div>

                                    <div className="parent">
                                      <div className="file-upload">
                                        <FaUpload color="green" size={35} />

                                        <p
                                          style={{
                                            fontWeight: "800",
                                            fontSize: "14px",
                                            color: "gray",
                                          }}>
                                          Mandatory Document Pancard
                                        </p>

                                        <input
                                          type="file"
                                          name="Photo"
                                          onChange={(e) => {
                                            let myfile = e.target.files[0];
                                            if (myfile) {
                                              const sizeInMB =
                                                myfile.size / (1024 * 1024); 
                                              if (sizeInMB > 1) {
                                                swal(
                                                  "Error",
                                                  "The file is larger than 1 MB.",
                                                  "error"
                                                );
                                              }
                                            }
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
                                    <Col
                                      lg="6"
                                      md="6"
                                      sm="12"
                                      style={{ paddingBottom: "-1rem" }}>
                                      <img
                                        style={{ borderRadius: "8px" }}
                                        src={`${Image_URL}/Images/${formData?.Photo}`}
                                        height={100}
                                        width={120}
                                        alt="image"
                                      />
                                    </Col>
                                  )}
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          </CardBody>
                        </Col>
                      </Row>
                    </Col> */}
                    <Col lg="6" md="6" sm="12">
                      <CardBody className="userRegiBody">
                        <div className="d-flex justify-content-center">
                          <h1> Company Information</h1>
                        </div>
                        <Row>
                          <Col lg="6" md="6" sm="12">
                            <FormGroup>
                              <Label>
                                Full Name{" "}
                                <span style={{ color: "red" }}>*</span>
                              </Label>
                              <Input
                                required
                                placeholder="Enter First Name"
                                type="text"
                                name="ownerName"
                                value={formData?.ownerName}
                                onChange={(e) => {
                                  const inputPan =
                                    e.target.value?.toUpperCase();
                                  const filteredValue = inputPan.replace(
                                    /\s/g,
                                    ""
                                  );
                                  setFormData({
                                    ...formData,
                                    ["ownerName"]: inputPan,
                                  });
                                }}
                                // onChange={handleInputChange}
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
                                required
                                inputClass="myphoneinput"
                                country={"in"}
                                onKeyDown={(e) => {
                                  ["e", "E", "+", "-"].includes(e.key) &&
                                    e.preventDefault();
                                }}
                                countryCodeEditable={false}
                                name="mobileNumber"
                                value={JSON.stringify(formData?.mobileNumber)}
                                // value={formData.mobileNumber}
                                onChange={(phone) => {
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
                              <Label>
                                Aadhar Number{" "}
                                <span style={{ color: "red" }}>*</span>
                              </Label>
                              <Input
                                required
                                minLength={12}
                                maxLength={12}
                                pattern="[0-9]*"
                                placeholder="Enter Addhar Number"
                                type="number"
                                name="aadharNo"
                                value={formData?.aadharNo}
                                onChange={(e) => {
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
                          {/* <Col lg="6" md="6" sm="12">
                            <FormGroup>
                              <Label>
                                Personal Pan Number{" "}
                                <span style={{ color: "red" }}>*</span>
                              </Label>
                              <Input
                                required
                                minLength={10}
                                maxLength={10}
                                placeholder="Enter Pan Number"
                                type="text"
                                name="panNo"
                                value={formData?.panNo}
                                onChange={(e) => {
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
                          </Col> */}

                          <Col lg="6" md="6" sm="12">
                            <FormGroup>
                              <Label className="">Party Type </Label>
                              <CustomInput
                                name="partyType"
                                value={formData?.partyType}
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    ["partyType"]: e.target.value,
                                  });
                                }}
                                type="select">
                                <option value="N/A">--Select--</option>

                                <option value="eCommerce">E-Commerce</option>
                                <option value="Debitor">Debitor</option>
                                <option value="Creditor">Creditor</option>
                              </CustomInput>
                            </FormGroup>
                          </Col>
                          <Col lg="6" md="6" sm="12">
                            <FormGroup>
                              <Label className="">Registration Type</Label>
                              <CustomInput
                                name="registrationType"
                                value={formData?.registrationType}
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    ["registrationType"]: e.target.value,
                                  });
                                }}
                                type="select">
                                <option>--Select--</option>

                                <option value="UnKnown">UnKnown</option>
                                <option value="Regular">Regular</option>
                                <option value="UnRegister">UnRegister</option>
                              </CustomInput>
                            </FormGroup>
                          </Col>
                          {formData?.registrationType !== "UnKnown" && (
                            <>
                              {formData?.registrationType !== "UnRegister" && (
                                <Col sm="12" lg="6" md="6">
                                  <Label>
                                    GST Number
                                    <span style={{ color: "red" }}> *</span>
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
                                      let value = e.target.value?.toUpperCase();

                                      if (value?.length == 15) {
                                        setLoader(true);
                                        (async () => {
                                          await _Get(
                                            GST_Verification_Api,
                                            value
                                          )
                                            .then((res) => {
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
                                                  ["gstNumber"]: value,
                                                });
                                                setLoader(false);
                                              } else {
                                                setFormData({
                                                  ...formData,
                                                  ["CompanyName"]: "",
                                                  ["address1"]: "",
                                                  ["address2"]: "",
                                                  ["gstNumber"]: value,
                                                });
                                              }
                                            })
                                            .catch((err) => {
                                              // swal(
                                              //   "error",
                                              //   "somthing went Wrong"
                                              // );

                                              if (value?.length == 15) {
                                                setFormData({
                                                  ...formData,
                                                  ["gstNumber"]: value,
                                                  ["comPanNo"]: value?.slice(
                                                    2,
                                                    12
                                                  ),
                                                });
                                              } else {
                                                setFormData({
                                                  ...formData,
                                                  ["gstNumber"]: value,
                                                });
                                              }

                                              setLoader(false);
                                            });
                                        })();
                                      } else {
                                        setFormData({
                                          ...formData,
                                          ["gstNumber"]: value,
                                        });
                                      }
                                    }}
                                  />
                                  {Loader && Loader ? (
                                    <div className="" style={{ color: "red" }}>
                                      Getting GST Information..
                                    </div>
                                  ) : null}
                                </Col>
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
                                      const panRegex =
                                        /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
                                      setFormData({
                                        ...formData,
                                        ["comPanNo"]: inputPan,
                                        //   ? formData?.comPanNo
                                        //   : inputPan,

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

                          {/* <Col lg="6" md="6" sm="12">
                            <FormGroup>
                              <Label>
                                Email Id <span style={{ color: "red" }}>*</span>
                              </Label>

                              <Input
                                placeholder="last job firm name"
                                type="email"
                                name="email"
                                value={formData?.email}
                                onChange={handleInputChange}
                              />
                            </FormGroup>
                          </Col> */}
                          {/* <Col lg="6" md="6" sm="12">
                            <FormGroup>
                              <Label>Id</Label>
                              <Input
                                placeholder="Enter ID "
                                type="text"
                                name="id"
                                value={formData?.id}
                                onChange={handleInputChange}
                              />
                            </FormGroup>
                          </Col> */}
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
                                placeholder="party Turnover"
                                type="number"
                                name="annualTurnover"
                                value={formData?.annualTurnover}
                                onChange={(e) => {
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
                              </Col>
                              {/* <Col lg="6" md="6" sm="12">
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
                              </Col> */}
                            </>
                          ) : (
                            <>
                              <Col lg="6" md="6" sm="12">
                                <FormGroup>
                                  <Label>
                                    Company Name{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </Label>
                                  <Input
                                    // readOnly
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
                                    Address
                                    <span style={{ color: "red" }}> *</span>
                                  </Label>
                                  <Input
                                    // readOnly
                                    required
                                    className="form-control"
                                    placeholder="address name"
                                    type="text"
                                    name="address"
                                    value={formData?.address}
                                    onChange={handleInputChange}
                                  />
                                </FormGroup>
                              </Col>
                              {/* <Col lg="6" md="6" sm="12">
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
                              </Col> */}
                            </>
                          )}
                          <Col lg="6" md="6" sm="12">
                            <FormGroup>
                              <Label>
                                Owner Number{" "}
                                <span style={{ color: "red" }}>*</span>
                              </Label>
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
                                  let SelectedCity = Country_State_city?.filter(
                                    (ele) => ele?.Pincode == e.target.value
                                  );
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
                                required
                                className="form-control"
                                placeholder="Shop Size Ex-120*100"
                                type="text"
                                name="shopSize"
                                value={formData?.shopSize}
                                onChange={handleInputChange}
                              />
                            </FormGroup>
                          </Col>

                          <Col className="mt-2 mb-2" lg="12" md="12" sm="12">
                            <Row>
                              <Col>
                                <div className="d-flex justify-content-center">
                                  <Label>Image</Label>
                                </div>

                                <div className="parent">
                                  <div className="file-upload">
                                    <FaUpload color="green" size={35} />

                                    <p
                                      style={{
                                        fontWeight: "800",
                                        fontSize: "14px",
                                        color: "gray",
                                      }}>
                                      Mandatory Document Pancard
                                    </p>

                                    <input
                                      type="file"
                                      name="Photo"
                                      onChange={(e) => {
                                        let myfile = e.target.files[0];
                                        if (myfile) {
                                          const sizeInMB =
                                            myfile.size / (1024 * 1024); // Convert bytes to MB
                                          if (sizeInMB > 1) {
                                            swal(
                                              "Error",
                                              "The file is larger than 1 MB.",
                                              "error"
                                            );
                                          }
                                        }
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
                                  <Col
                                    lg="6"
                                    md="6"
                                    sm="12"
                                    style={{ paddingBottom: "-1rem" }}>
                                    <img
                                      style={{ borderRadius: "8px" }}
                                      src={`${Image_URL}/Images/${formData?.Photo}`}
                                      height={100}
                                      width={120}
                                      alt="image"
                                    />
                                  </Col>
                                )}
                              </Col>
                              <Col>
                                <div className="d-flex justify-content-center">
                                  <Label>Shop Photo</Label>
                                </div>

                                <div className="parent">
                                  <div className="file-upload">
                                    <FaUpload color="green" size={35} />

                                    <p
                                      style={{
                                        fontWeight: "800",
                                        fontSize: "14px",
                                        color: "gray",
                                      }}>
                                      Mandatory Document GST Cirtificate
                                    </p>
                                    <p
                                      style={{
                                        fontWeight: "800",
                                        fontSize: "14px",
                                        color: "red",
                                      }}>
                                      Max Upload file Size 1 MB
                                    </p>

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
                                          i < fiels?.length;
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
                                {imageUri &&
                                  imageUri?.map((ele, i) => {
                                    return (
                                      <>
                                        <Col key={i} lg="6" md="6" sm="6">
                                          <span
                                            onClick={() => {
                                              let uri = [...imageUri];
                                              uri.splice(i, 1);
                                              setImageUris(uri);
                                            }}>
                                            <span
                                              style={{
                                                cursor: "pointer",
                                                position: "absolute",
                                                right: 40,
                                                color: "red",
                                              }}>
                                              <MdCancel color="red" size="30" />
                                            </span>
                                          </span>
                                          <img
                                            style={{ borderRadius: "8px" }}
                                            src={ele}
                                            className="p-2"
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
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </CardBody>
                    </Col>
                    {/* </Row>
                  <Row className="mt-1"> */}
                    <Col lg="6" md="6" sm="6">
                      <CardBody className="userRegiBody">
                        <div className="d-flex justify-content-center">
                          <h1>Other information</h1>
                        </div>
                        <Row>
                          <Col lg="6" md="6" sm="12">
                            <FormGroup className="cssforproductlist">
                              <Label>
                                Email <span style={{ color: "red" }}>*</span>{" "}
                              </Label>
                              <Input
                                required
                                placeholder="Enter Email id here"
                                type="email"
                                name="email"
                                value={formData?.email}
                                onChange={handleInputChange}
                              />
                            </FormGroup>
                          </Col>
                          <Col lg="6" md="6" xl="6">
                            <FormGroup>
                              <Label>
                                Password <span style={{ color: "red" }}>*</span>
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
                          <Col lg="6" md="6" xl="6">
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
                          <Col lg="6" md="6" xl="6">
                            <FormGroup>
                              <Label className="">
                                Category <span style={{ color: "red" }}>*</span>
                              </Label>
                              <CustomInput
                                name="category"
                                value={formData?.category}
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    ["category"]: e.target.value,
                                  });
                                }}
                                type="select">
                                <option value="">--Select Category--</option>

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
                          {/* <Col lg="3" md="3" xl="3">
                            <FormGroup>
                              <Label>
                                Payment Term Cash Credit{" "}
                                <span style={{ color: "red" }}>*</span>
                              </Label>
                              <Input
                                required
                                className="form-control"
                                placeholder="Enter Paymen Term"
                                type="text"
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
                          </Col> */}
                          <Col lg="6" md="6" xl="6">
                            <FormGroup>
                              <Label>
                                Payment Term{" "}
                                <span style={{ color: "red" }}>*</span>
                              </Label>
                              <CustomInput
                                required
                                className="form-control"
                                placeholder="Enter Paymen Term"
                                type="select"
                                name="paymentTerm"
                                value={formData?.paymentTerm}
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    ["paymentTerm"]: e.target.value,
                                  });
                                }}>
                                <option value="N/A">--Select--</option>
                                <option value="cash">Cash</option>
                                <option value="credit">Credit</option>
                              </CustomInput>
                            </FormGroup>
                          </Col>

                          {formData.paymentTerm == "credit" && (
                            <>
                              <Col lg="6" md="6" xl="6">
                                <FormGroup>
                                  <Label>
                                    Due Date{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </Label>
                                  <Input
                                    required
                                    min={1}
                                    max={30}
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
                              <Col lg="6" md="6" xl="6">
                                <FormGroup>
                                  <Label>
                                    Credit Period{" "}
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
                              <Col lg="6" md="6" xl="6">
                                <FormGroup>
                                  <Label>
                                    Amount Limit{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </Label>
                                  <Input
                                    required
                                    className="form-control"
                                    placeholder=" Party Limit Ex 5,00,000"
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
                            </>
                          )}

                          <Col lg="6" md="6" xl="6">
                            <FormGroup>
                              <Label className="">Assigned Transport</Label>
                              <CustomInput
                                name="transporterDetail"
                                value={formData?.transporterDetail}
                                onChange={(e) => {
                                  if (formData?.City) {
                                    if (e.target.value == 1) {
                                      handleSetShowTransporter(e.target.value);
                                    }
                                  } else {
                                    swal("Enter Company Pincode Details");
                                  }
                                  setFormData({
                                    ...formData,
                                    ["transporterDetail"]: Number(
                                      e.target.value
                                    ),
                                  });
                                }}
                                type="select">
                                <option value={null}>
                                  --Select Transporter Type--
                                </option>
                                <option value={0}>Local</option>
                                <option value={1}>Assign Transporter</option>
                              </CustomInput>
                            </FormGroup>
                          </Col>
                          {formData?.transporterDetail == 1 &&
                          formData?.transporterDetail == 1 ? (
                            <>
                              <Col lg="6" md="6" xl="6" xs="12">
                                <FormGroup>
                                  <Label className="mb-1">
                                    Transporter List
                                  </Label>
                                  <Multiselect
                                    required
                                    isObject="false"
                                    options={TransporterList} // Options to display in the dropdown
                                    selectedValues={
                                      Selectedtransporter && Selectedtransporter
                                    } // Preselected value to persist in dropdown
                                    onSelect={onSelect1} // Function will trigger on select event
                                    onRemove={onRemove1} // Function will trigger on remove event
                                    displayValue="companyName" // Property name to display in the dropdown options
                                  />
                                </FormGroup>
                              </Col>
                            </>
                          ) : null}
                          <Col lg="6" md="6" xl="6">
                            <FormGroup>
                              <Label>
                                Service Area{" "}
                                <span style={{ color: "red" }}>*</span>
                              </Label>
                              <textarea
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
                  </Row>

                  <Row
                    className="mt-4 text-center"
                    style={{ display: "flex", justifyContent: "center" }}>
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
                        <Row>
                          <Col>
                            <div className="d-flex justify-content-center">
                              <Button.Ripple
                                style={{ marginLeft: "15px" }}
                                color="primary"
                                type="submit"
                                className="">
                                Submit
                              </Button.Ripple>
                            </div>
                          </Col>
                        </Row>
                      </>
                    )}
                  </Row>
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
