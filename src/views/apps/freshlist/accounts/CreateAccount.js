import React, { useEffect, useState, useContext } from "react";
import Multiselect from "multiselect-react-dropdown";
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
  Spinner,
} from "reactstrap";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { Route, useHistory, useParams } from "react-router-dom";

import swal from "sweetalert";
import "../../../../../src/layouts/assets/scss/pages/users.scss";

import {
  CreateAccountSave,
  CreateAccountUpdate,
  Get_RoleList,
  _BulkUpload,
  _Get,
  _GetList,
  _Post,
  _PostSave,
  _Put,
} from "../../../../ApiEndPoint/ApiCalling";

import "../../../../assets/scss/pages/users.scss";
import UserContext from "../../../../context/Context";

import {
  Assign_Role_To_SuperAdmin,
  Bulk_Update_Product,
  Bulk_Update_User,
  Bulk_Upload_User,
  Created_Warehouse,
  Image_URL,
  ListBranch,
  Role_list_by_Master,
  Rule_List,
  SubscriptinPlanList,
  Super_Admin_List,
  Update_Role_To_SuperAdmin,
  View_User_By_Id,
  Working_Hours_get,
  country_state_City_List,
} from "../../../../ApiEndPoint/Api";
import { FaUpload } from "react-icons/fa";
import { el } from "date-fns/locale";
import ClosingStock from "../customer/ProductWIKI/ClosingStock";

const CreateAccount = () => {
  const [WareHouseList, setWareHouseList] = useState([]);
  const [SelectedWareHouse, setSelectedWareHouse] = useState([]);
  const [Rule, setRule] = useState([]);
  const [shiftList, setShiftList] = useState([]);
  const [Branch, setBranch] = useState([]);
  const [BulkImport, setBulkImport] = useState(null);
  const [Master, setMaster] = useState(false);
  const [Loader, setLoader] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [Image, setImage] = useState(null);
  const [dropdownValue, setdropdownValue] = useState([]);
  const [Country_State_city, setCountry_State_city] = useState([]);
  const [SelectedRules, SetRules] = useState([]);
  const [AllAssignRoleList, setAllAssignRoleList] = useState([]);
  const [SubsCriptionList, setSubsCriptionList] = useState([]);
  const [SelectedRoleToAssign, setSelectedRoleToAssign] = useState([]);
  const [index, setindex] = useState("");
  const [Mode, setMode] = useState("");
  const [error, setError] = useState("");

  const [WareHouseIncharge, setWareHouseIncharge] = useState(false);
  const [BulkUpload, setBulkUpload] = useState(false);

  const Context = useContext(UserContext);
  let history = useHistory();
  let Params = useParams();
 
  useEffect(() => {
    let userData = JSON.parse(localStorage.getItem("userData"));
    if (userData?.database) {
      setFormData({
        ...formData,
        ["database"]: userData?.database,
      });
    }
  }, []);

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("userData"));
    let url = SubscriptinPlanList;
    _GetList(url, user?.database).then((res) => {
      let value = res?.Subscription;
      if (value?.length) {
        setSubsCriptionList(value);
      }
    });
    if (Params?.id == 0) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const date = new Date(position.timestamp);
            // const CurentTime = date.toLocaleString();
            formData.geotagging = `${position.coords.latitude},${position.coords.longitude}`;
            formData.latitude = position.coords.latitude;
            formData.longitude = position.coords.longitude;
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
    if (Params?.id == 0) {
      setMode("Create");
    } else {
      setMode("Update");
      (async () => {
        await _Get(View_User_By_Id, Params?.id)
          .then((res) => {
            let UserData = res?.User;
            UserData["branch"] = UserData?.branch?._id;
            UserData["rolename"] = UserData?.rolename?._id;
            UserData["shift"] = UserData?.shift?._id;
            SetRules(res?.User?.setRule);

            if (res?.User?.warehouse?.length > 0) {
              let value = res?.User?.warehouse;
              let selectedwarehouse = value?.map((element) => {
                return element?.id;
              });
              setWareHouseIncharge(true);
              setSelectedWareHouse(selectedwarehouse);
            }
            let selectedaRole;
            (async () => {
              await Get_RoleList(res?.User?._id, res?.User?.database)
                .then((resp) => {
                  // console.log(res?.Role);
                  selectedaRole = resp?.Role?.filter(
                    (element) => element?._id == res?.User?.rolename
                  );
                  if (resp?.Role?.length > 0) {
                    setSelectedRoleToAssign(resp?.Role);
                  } else {
                    setSelectedRoleToAssign([]);
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            })();
            // let values = {
            //   ...res?.User,
            //   ...{
            //     rolename: selectedaRole[0]?._id,
            //     position: selectedaRole[0]?.roleName,
            //   },
            // };

            // setFormData(res?.User);
            setFormData(UserData);
          })
          .catch((err) => {
            console.log(err);
          });
      })();
    }
  }, []);

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
        } else {
          setError(
            "Please enter a valid number with a maximum length of 10 digits"
          );
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
    let userInfo = JSON.parse(localStorage.getItem("userData"));

    _Get(Rule_List, userInfo?.database)
      .then((res) => {
        console.log(res.Rule);
        setRule(res?.Rule);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    let userInfo = JSON.parse(localStorage.getItem("userData"));
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;

            // console.log(position.coords);
          },
          (error) => {
            swal("error", error);
          },
          { enableHighAccuracy: true }
        );
      } else {
        swal("Your Browser does not support Location");
      }
      _Get(Created_Warehouse, userInfo?.database)
        .then((res) => {
          setWareHouseList(res?.Warehouse);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getLocation();
  }, []);

  useEffect(() => {
    let userdata = JSON.parse(localStorage.getItem("userData"));
    _GetList(country_state_City_List)
      .then((res) => {
        setCountry_State_city(res);
      })
      .catch((err) => {
        console.log(err);
      });

    _Get(Working_Hours_get, userdata?.database)
      .then((res) => {
        setShiftList(res?.WorkingHours);
      })
      .catch((err) => {
        console.log(err);
      });
    _Get(ListBranch, userdata?.database)
      .then((res) => {
        console.log("branchList", res?.Branch);
        setBranch(res?.Branch);
      })
      .catch((err) => {
        console.log(err);
      });

    if (userdata?.rolename?.roleName === "MASTER") {
      setMaster(true);
      _Get(Role_list_by_Master, userdata?._id)
        .then((res) => {
          let Superadmin = res?.Role?.filter((ele) =>
            ele?.roleName?.toLowerCase()?.includes("superadmin")
          );
          let WithoutSuperadmin = res?.Role?.filter(
            (ele) => ele?.roleName !== "SuperAdmin"
          );
          let WithoutSuperadminandMaster = WithoutSuperadmin?.filter(
            (ele) => ele?.roleName !== "MASTER"
          );
          let WithoutMaster = res?.Role?.filter(
            (ele) => ele?.roleName !== "MASTER"
          );
          if (Superadmin) {
            setdropdownValue(Superadmin);
          }

          if (WithoutMaster) {
            setAllAssignRoleList(WithoutMaster);
          }
        })
        .catch((err) => {
          console.log(err);
          swal("Roles List Not found");
        });
    } else {
      Get_RoleList(userdata?._id, userdata?.database)
        .then((res) => {
          let ShowList = res?.Role?.filter(
            (item, i) => item?.roleName !== "Customer"
          );
          let ShowLists = ShowList?.filter(
            (item, i) => item?.roleName !== "Transporter"
          );
          let AllRoles = ShowLists?.filter(
            (item, i) => item?.roleName !== "SuperAdmin"
          );

          setdropdownValue(AllRoles);
        })
        .catch((err) => {
          console.log(err);
          swal("Roles List Not found");
        });
    }
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    let userData = JSON.parse(localStorage.getItem("userData"));

    let formdata = new FormData();

    // if (formData?.firstName) {
    //   formdata.append(`id`, formData?.firstName);
    // }
    if (Master) {
      formData["position"] = 1;
    }
    if (SelectedRules?.length) {
      formdata.append(`setRule`, JSON.stringify(SelectedRules));
    }
    if (Image) {
      formdata.append(`file`, Image);
    }
    if (formData?.setRule) {
      delete formData?.setRule;
    }
    if (formData?.warehouse) {
      delete formData?.warehouse;
    }
    if (WareHouseIncharge) {
      let wareHouse = SelectedWareHouse?.map((ele) => {
        return { id: ele?._id };
      });
      formdata.append(`warehouse`, JSON.stringify(wareHouse));
    }
    for (const [key, value] of Object.entries(formData)) {
      let type = typeof value;
      if (type == "object") {
      } else {
        if (value != undefined || null) {
          formdata.append(`${key}`, `${value}`);
        }
      }
    }

    if (BulkImport !== null || BulkImport != undefined) {
      let formdata = new FormData();
      formdata.append("file", BulkImport);
      formdata.append("database", userData?.database);
      setLoader(true);
      if (formData?.UploadStatus == "Update") {
        let URl = `${Bulk_Update_User}/${userData?.database}`;
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
        let URl = `${Bulk_Upload_User}/${userData?.database}`;
        await _BulkUpload(URl, formdata)
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
      if (Params?.id == 0) {
        if (formData?.rolename && formData?.email && formData?.firstName) {
          if (error) {
            swal("Error occured while Entering Details");
          } else {
            CreateAccountSave(formdata)
              .then((res) => {
                setLoader(false);
                if (res?.status) {
                  let userData = JSON.parse(localStorage.getItem("userData"));
                  let AssignDataBase = [];

                  if (SelectedRoleToAssign?.length) {
                    AssignDataBase = SelectedRoleToAssign?.map((ele) => {
                      return {
                        role: {
                          roleName: ele?.roleName,
                          position: 0,
                          desc: ele?.desc,
                          id: ele?.id,
                          // roleId: ele?.id,
                          rank: 0,
                          rolePermission: ele?.rolePermission,
                          database: formData["database"],
                          createdBy: userData?._id,
                        },
                      };
                    });
                    let payload = {
                      Roles: AssignDataBase,
                    };

                    if (res?.User?._id) {
                      _PostSave(Assign_Role_To_SuperAdmin, payload)
                        .then((response) => {
                          (async () => {
                            await Get_RoleList(
                              res?.User?._id,
                              res?.User?.database
                            )
                              .then((RoleList) => {
                                let SuperAdminRole = RoleList?.Role?.filter(
                                  (ele) => ele?.roleName == "SuperAdmin"
                                );

                                let AssignUpdatedRole = async () => {
                                  await _Put(
                                    Update_Role_To_SuperAdmin,
                                    res?.User?._id,
                                    {
                                      rolename: SuperAdminRole[0]?._id,
                                    }
                                  );
                                };
                                AssignUpdatedRole();
                              })
                              .catch((err) => {
                                console.log(err);
                              });
                          })();
                          _GetList(Super_Admin_List)
                            .then((resp) => {
                              localStorage.setItem(
                                "AllSuper",
                                JSON.stringify(resp?.SuperAdmin)
                              );
                            })
                            .catch((err) => {
                              console.log(err);
                            });
                          console.log(res);
                        })
                        .catch((err) => {
                          // setLoader(false);

                          console.log(err);
                        });
                    }
                  }
                  swal("User Created Successfully");
                  history.goBack();
                }
              })
              .catch((err) => {
                setLoader(false);

                if (!!err.response?.data?.message) {
                  swal(`${err.response?.data?.message}`);
                }
              });
          }
        } else {
          setLoader(false);
          swal("Enter User Name Email and Select Role");
        }
      } else {
        CreateAccountUpdate(Params?.id, formdata)
          .then((res) => {
            if (res?.status) {
              let userData = JSON.parse(localStorage.getItem("userData"));
              let AssignDataBase = [];

              if (SelectedRoleToAssign?.length) {
                AssignDataBase = SelectedRoleToAssign?.map((ele) => {
                  return {
                    role: {
                      roleName: ele?.roleName,
                      position: 0,
                      desc: ele?.desc,
                      id: ele?.id,
                      rank: 0,
                      rolePermission: ele?.rolePermission,
                      database: formData["database"],
                      createdBy: userData?._id,
                    },
                  };
                });
                let payload = {
                  Roles: AssignDataBase,
                };

                _PostSave(Assign_Role_To_SuperAdmin, payload)
                  .then((res) => {
                    // console.log(res);

                    _GetList(Super_Admin_List)
                      .then((res) => {
                        localStorage.setItem(
                          "AllSuper",
                          JSON.stringify(res?.SuperAdmin)
                        );
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                    console.log(res);
                  })
                  .catch((err) => {
                    // setLoader(false);

                    console.log(err);
                  });
              }
            }
            if (res?.status) {
              swal("User Updated Successfully");
              history.goBack();
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };
  const onSelect1 = (selectedList, selectedItem) => {
    console.log(selectedList);
    setSelectedRoleToAssign(selectedList);
  };
  const onRemove1 = (selectedList, removedItem) => {
    console.log(selectedList);
    setSelectedRoleToAssign(selectedList);
  };

  return (
    <div>
      <div>
        <Card
          style={{
            paddingLeft: "15px",
            paddingRight: "15px",
            paddingBottom: "15px",
          }}
          className="UserRegistrationform">
          <Row className="">
            <Col></Col>
            <Col className="text-center   mt-1">
              <h1 className="float-center">{Mode && Mode} User</h1>
            </Col>
            <Col lg="1"></Col>
            {!BulkUpload && !BulkUpload ? (
              <>
                <Col lg="2" xs="7" className="d-flex justify-content-end mt-1">
                  <Button
                    style={{
                      cursor: "pointer",
                      backgroundColor: "rgb(8, 91, 245)",
                      color: "white",
                      fontWeight: "600",
                      height: "43px",
                    }}
                    color="#39cccc"
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
                <Col xs="2" className="d-flex justify-content-end mt-1">
                  <Button
                    style={{
                      cursor: "pointer",
                      backgroundColor: "rgb(8, 91, 245)",
                      color: "white",
                      fontWeight: "600",
                      height: "43px",
                    }}
                    color="#39cccc"
                    onClick={(e) => {
                      e.preventDefault();
                      setBulkUpload(false);
                    }}>
                    Back
                  </Button>
                </Col>
              </>
            )}

            {!BulkUpload && !BulkUpload && (
              <Col lg="1" className="mt-1">
                <div className="float-right">
                  <Route
                    render={({ history }) => (
                      <Button
                        style={{
                          cursor: "pointer",
                          backgroundColor: "rgb(8, 91, 245)",
                          color: "white",
                          fontWeight: "600",
                          height: "43px",
                        }}
                        color="#39cccc"
                        onClick={() => history.goBack()}>
                        {" "}
                        Back
                      </Button>
                    )}
                  />
                </div>
              </Col>
            )}
          </Row>
          <Row></Row>
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
                        setBulkImport(e.target.files[0]);
                      }}
                    />
                  </div>
                </div>
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
                                  Full Name
                                  <span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input
                                  required
                                  placeholder="Enter First Name"
                                  type="text"
                                  name="firstName"
                                  value={formData?.firstName}
                                  onChange={(e) => {
                                    const inputPan =
                                      e.target.value?.toUpperCase();
                                    const filteredValue = inputPan.replace(
                                      /\s/g,
                                      ""
                                    );
                                    setFormData({
                                      ...formData,
                                      // ["id"]: filteredValue,
                                      ["firstName"]: inputPan,
                                    });
                                  }}
                                  // onChange={handleInputChange}
                                />
                              </FormGroup>
                            </Col>
                            {/* <Col lg="6" md="6" sm="12">
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
                            </Col> */}
                            <Col lg="6" md="6" sm="12">
                              <FormGroup className="cssforproductlist">
                                <Label>
                                  DOB <span style={{ color: "red" }}>*</span>
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
                                    ["e", "E", "+", "-"].includes(e.key) &&
                                      e.preventDefault();
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
                                    ["e", "E", "+", "-"].includes(e.key) &&
                                      e.preventDefault();
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
                                    ["e", "E", "+", "-"].includes(e.key) &&
                                      e.preventDefault();
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
                                        if (Params?.id == 0) {
                                          setFormData({
                                            ...formData,
                                            ["Aadhar_No"]: inputPan,
                                            ["id"]: inputPan,
                                            ["IsValid_Aadhar_No"]:
                                              panRegex.test(inputPan),
                                          });
                                        } else {
                                          setFormData({
                                            ...formData,
                                            ["Aadhar_No"]: inputPan,
                                            ["IsValid_Aadhar_No"]:
                                              panRegex.test(inputPan),
                                          });
                                        }
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
                                      <span style={{ color: "red" }}>*</span>
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
                                        if (Params?.id == 0) {
                                          setFormData({
                                            ...formData,
                                            ["Aadhar_No"]: inputPan,
                                            ["id"]: inputPan,
                                            ["IsValid_Aadhar_No"]:
                                              panRegex.test(inputPan),
                                          });
                                        } else {
                                          setFormData({
                                            ...formData,
                                            ["Aadhar_No"]: inputPan,
                                            ["IsValid_Aadhar_No"]:
                                              panRegex.test(inputPan),
                                          });
                                        }
                                      }}
                                      // onChange={handleInputChange}
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
                                          {formData?.Aadhar_No?.length > 16 ||
                                            (formData?.Aadhar_No?.length <
                                              15 && (
                                              <span style={{ color: "red" }}>
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
                                        if (Params?.id == 0) {
                                          setFormData({
                                            ...formData,
                                            ["Pan_No"]: inputPan,
                                            ["id"]: inputPan,
                                            ["IsValid_Pan_No"]:
                                              panRegex.test(inputPan),
                                          });
                                        } else {
                                          setFormData({
                                            ...formData,
                                            ["Pan_No"]: inputPan,
                                            ["IsValid_Pan_No"]:
                                              panRegex.test(inputPan),
                                          });
                                        }
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
                                      <span style={{ color: "red" }}>*</span>
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
                                        if (Params?.id == 0) {
                                          setFormData({
                                            ...formData,
                                            ["Pan_No"]: inputPan,
                                            ["id"]: inputPan,

                                            ["IsValid_Pan_No"]:
                                              panRegex.test(inputPan),
                                          });
                                        } else {
                                          setFormData({
                                            ...formData,
                                            ["Pan_No"]: inputPan,

                                            ["IsValid_Pan_No"]:
                                              panRegex.test(inputPan),
                                          });
                                        }
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
                                          {formData?.Pan_No?.length > 9 && (
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

                                    if (SelectedCity?.length) {
                                      setFormData({
                                        ...formData,
                                        ["State"]: SelectedCity[0]?.StateName,
                                        ["City"]: SelectedCity[0]?.District,
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
                            <Col lg="6" md="6" sm="12">
                              <FormGroup className="cssforproductlist">
                                <Label>
                                  Address{" "}
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
                            <Col className="mt-2 mb-2" lg="12" md="12" sm="12">
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
                                            const reader = new FileReader();
                                            reader.onload = (e) => {
                                              setFormData({
                                                ...formData,

                                                ["imageuri"]: e.target.result,
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
                              Select Role
                              <span style={{ color: "red" }}>*</span>
                            </Label>

                            <CustomInput
                              required
                              id="122"
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
                                if (selectedPosition == "WareHouse Incharge") {
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
                                  <option value="NA">--select Shift--</option>
                                  {shiftList &&
                                    shiftList?.length &&
                                    shiftList?.map((ele, i) => {
                                      return (
                                        <option
                                          data-id={ele?.shiftName}
                                          data-name={ele?.database}
                                          value={ele?._id}>
                                          {ele?.shiftName}(
                                          {`${ele?.fromTime}-${ele?.toTime}`})
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
                                  <option value="NA">--select Branch--</option>
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
                                  // showCheckbox
                                  isObject="false"
                                  options={WareHouseList}
                                  selectedValues={SelectedWareHouse}
                                  onSelect={(selectedList, selectedItem) => {
                                    setSelectedWareHouse(selectedList);
                                  }}
                                  onRemove={(selectedList, removedItem) => {
                                    setSelectedWareHouse(selectedList);
                                  }}
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
                                    <span style={{ color: "red" }}>*</span>
                                  </Label>
                                  <CustomInput
                                    required
                                    type="select"
                                    value={formData["subscriptionPlan"]}
                                    onChange={(e) => {
                                      setFormData({
                                        ...formData,
                                        ["subscriptionPlan"]: e.target.value,
                                      });
                                    }}>
                                    <option value="0">
                                      ----select Plan----
                                    </option>
                                    {SubsCriptionList?.length > 0 && (
                                      <>
                                        {SubsCriptionList?.map((ele, index) => (
                                          <option key={index} value={ele?._id}>
                                            {ele?.planName} (Price -
                                            {ele?.subscriptionCost})(
                                            {ele?.subscriptionType == 1
                                              ? "Yearly"
                                              : "One Time"}
                                            )
                                          </option>
                                        ))}
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
                            {/* <Col lg="6" md="6" sm="12">
                              <FormGroup className="cssforproductlist">
                                <Label>
                                  Address{" "}
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
                            </Col> */}
                            <Col lg="6" md="6" sm="12">
                              <FormGroup className="cssforproductlist">
                                <Label>
                                  Address
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
                              disabled
                              value={formData?.Aadhar_No}
                              onChange={e => {
                                const inputPan = e.target.value;
                                const panRegex = /^\d{12}$/;

                                setFormData({
                                  ...formData,
                                  ["Aadhar_No"]: inputPan,
                                  ["id"]: inputPan,
                                  ["IsValid_Aadhar_No"]:
                                    panRegex.test(inputPan),
                                });
                              }}
                              // value={formData.id}
                              // onChange={(e) => {
                              //   setFormData({
                              //     ...formData,
                              //     id: e.target.value,
                              //   });
                              // }}
                            />
                          </FormGroup>
                        </Col> */}

                        <Col lg="6" md="6" sm="12">
                          <FormGroup className="cssforproductlist">
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
                                  value={formData?.last_job_AppoitmentDate}
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
                                    Area <span style={{ color: "red" }}>*</span>
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
                                    if (/^\d{0,2}$/.test(inputValue)) {
                                      setFormData({
                                        ...formData,
                                        ["pfPercentage"]: inputValue,
                                      });
                                    }
                                  }}
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
                                onSelect={(selectedList, selectedItem) => {
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
                            {formData.rolename !== "SuperAdmin" && (
                              <>
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
                                      <option value="">
                                        ----select Type----
                                      </option>
                                      <option value="debit">Dr</option>
                                      <option value="credit">Cr</option>
                                    </CustomInput>
                                  </FormGroup>
                                </Col>
                              </>
                            )}
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
        </Card>
      </div>
    </div>
  );
};
export default CreateAccount;
