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
} from "reactstrap";
import swal from "sweetalert";
import { Route, useParams } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "../../../../../../src/layouts/assets/scss/pages/users.scss";

import {
  CreateWarehousesave,
  _Get,
  _Put,
} from "../../../../../ApiEndPoint/ApiCalling";

import "../../../../../assets/scss/pages/users.scss";
import {
  Update_Wareahouse_Byid,
  View_Wareahouse_Byid,
} from "../../../../../ApiEndPoint/Api";
// import UserContext from "../../../../../context/Context";

const CreateWareHouse = () => {
  const [CreatWarehouseView, setCreatWarehouseView] = useState({});
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [Heading, setHeading] = useState("Create");

  let Params = useParams();
  useEffect(() => {
    const userInfor = JSON.parse(localStorage.getItem("userData"));

    if (Params?.id == 0) {
      setHeading("Create");
    } else {
      setHeading("Update");
      _Get(View_Wareahouse_Byid, Params?.id)
        .then((res) => {
          let warehoue = res?.Warehouse;
          setFormData({
            Username: warehoue?.Username,
            Password: warehoue?.Password,
            warehouseName: warehoue?.warehouseName,
            warehouseAddress: warehoue?.address,
            warehouseMobile: warehoue?.mobileNo,
            landlineNumber: warehoue?.landlineNumber,
            status: warehoue?.status,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
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
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const userInfor = JSON.parse(localStorage.getItem("userData"));
    let payload = {
      Username: formData?.Username,
      Password: formData?.Password,
      warehouseName: formData?.warehouseName,
      id: formData?.id,
      mobileNo: formData?.warehouseMobile,
      address: formData?.warehouseAddress,
      landlineNumber: formData?.landlineNumber,
      database: userInfor?.database,
      status: formData?.status,
    };
    if (Params?.id == 0) {
      CreateWarehousesave(payload)
        .then((res) => {
          setFormData({
            warehouseName: "",
            warehouseMobile: "",
            address: "",
            landlineNumber: "",
            status: "",
          });
          swal(`Warehouse  ${res.message}`);
        })
        .catch((err) => {
          console.log(err);
          swal("Somthing Went Wrong");
        });
      // if (error) {
      //   swal("Error occured while Entering Details");
      // } else {

      // }
    } else {
      _Put(Update_Wareahouse_Byid, Params?.id, payload)
        .then((res) => {
          console.log(res);

          swal("Updated Successfully");
        })
        .catch((err) => {
          console.log(err);
          swal("Somthing Went Wrong");
        });
    }
  };

  return (
    <div>
      <div>
        <Card>
          <Row className="m-2">
            <Col>
              <h1 className="float-left">{Heading && Heading} WareHouse</h1>
            </Col>
            <Col>
              <Route
                render={({ history }) => (
                  <Button
                    className=" btn btn-danger float-right"
                    onClick={() =>
                      history.push("/app/softNumen/system/WareHouseListSoft")
                    }>
                    Back
                  </Button>
                )}
              />
            </Col>
          </Row>

          <CardBody>
            <Form className="m-1" onSubmit={submitHandler}>
              <Row>
                <Col lg="3" md="3" sm="12">
                  <FormGroup>
                    <Label>
                      UserName <span style={{ color: "red" }}>*</span>
                    </Label>
                    <Input
                      required
                      type="text"
                      placeholder="Enter UserName"
                      name="Username"
                      value={formData["Username"]}
                      onChange={(e) => {
                        const inputPan = e.target.value;
                        setFormData({
                          ...formData,
                          ["Username"]: inputPan,
                        });
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col lg="3" md="3" sm="12">
                  <FormGroup>
                    <Label>
                      Password <span style={{ color: "red" }}>*</span>
                    </Label>
                    <Input
                      required
                      type="password"
                      placeholder="Enter UserName"
                      name="Password"
                      value={formData["Password"]}
                      onChange={(e) => {
                        const inputPan = e.target.value;
                        setFormData({
                          ...formData,
                          ["Password"]: inputPan,
                        });
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col lg="3" md="3" sm="12">
                  <FormGroup>
                    <Label>
                      WareHouse Name <span style={{ color: "red" }}>*</span>
                    </Label>
                    <Input
                      required
                      type="text"
                      placeholder="Enter Name"
                      name="warehouseName"
                      value={formData["warehouseName"]}
                      onChange={(e) => {
                        const inputPan = e.target.value;
                        const filteredValue = inputPan.replace(/\s/g, "");
                        setFormData({
                          ...formData,
                          ["id"]: filteredValue,
                          ["warehouseName"]: inputPan,
                        });
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col lg="3" md="3" sm="12">
                  <FormGroup>
                    <Label>
                      WareHouse Address <span style={{ color: "red" }}>*</span>
                    </Label>
                    <Input
                      required
                      type="text"
                      placeholder="Enter Address"
                      name="warehouseAddress"
                      value={formData["warehouseAddress"]}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col lg="3" md="3" sm="12">
                  <FormGroup>
                    <Label>
                      WareHouse Mobile <span style={{ color: "red" }}>*</span>
                    </Label>
                    <Input
                      required
                      type="number"
                      placeholder="Enter Mobile No."
                      name="warehouseMobile"
                      value={formData["warehouseMobile"]}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col lg="3" md="3" sm="12">
                  <FormGroup>
                    <Label>
                      WareHouse LandLine Number{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Label>
                    <Input
                      required
                      type="number"
                      placeholder="Enter LandLine Number"
                      name="landlineNumber"
                      value={formData["landlineNumber"]}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row className="mb-2">
                {/* {CreatWarehouseView &&
                  CreatWarehouseView?.input?.map((ele, i) => {
                    if (!!ele?.phoneinput) {
                      return (
                        <>
                          <>
                            <Col key={i} lg="6" md="6" sm="12">
                              <FormGroup>
                                <Label>{ele?.label?._text}</Label>
                                <PhoneInput
                                  inputClass="myphoneinput"
                                  country={"us"}
                                  onKeyDown={(e) => {
                                    if (
                                      ele?.type?._attributes?.type == "number"
                                    ) {
                                      ["e", "E", "+", "-"].includes(e.key) &&
                                        e.preventDefault();
                                    }
                                  }}
                                  countryCodeEditable={false}
                                  name={ele?.name?._text}
                                  value={formData[ele?.name?._text]}
                                  onChange={(phone) => {
                                    console.log(phone);
                                    setFormData({
                                      ...formData,
                                      [ele?.name?._text]: phone,
                                    });
                                  }}
                                  // onChange={handleInputChange}
                                />
                                {index === i ? (
                                  <>
                                    {error && (
                                      <span style={{ color: "red" }}>
                                        {error}
                                      </span>
                                    )}
                                  </>
                                ) : (
                                  <></>
                                )}
                              </FormGroup>
                            </Col>
                          </>
                        </>
                      );
                    } else if (ele?.type?._attributes?.type == "text") {
                      return (
                        <Col key={i} lg="3" md="3" sm="12">
                          <FormGroup key={i}>
                            <Label>{ele?.label?._text}</Label>
                            <Input
                              type={ele?.type?._attributes?.type}
                              placeholder={ele?.placeholder?._text}
                              name={ele?.name?._text}
                              value={formData[ele?.name?._text]}
                              onChange={(e) => {
                                handleInputChange(
                                  e,
                                  ele?.type?._attributes?.type,
                                  i
                                );
                              }}
                            />
                            {index === i ? (
                              <>
                                {error && (
                                  <span style={{ color: "red" }}>{error}</span>
                                )}
                              </>
                            ) : (
                              <></>
                            )}
                          </FormGroup>
                        </Col>
                      );
                    } else {
                      return (
                        <Col key={i} lg="3" md="3" sm="12">
                          <FormGroup key={i}>
                            <Label>{ele?.label?._text}</Label>
                            <Input
                              type={ele?.type?._attributes?.type}
                              placeholder={ele?.placeholder?._text}
                              name={ele?.name?._text}
                              value={formData[ele?.name?._text]}
                              onChange={(e) => {
                                handleInputChange(
                                  e,
                                  ele?.type?._attributes?.type,
                                  i
                                );
                              }}
                            />
                            {index === i ? (
                              <>
                                {error && (
                                  <span style={{ color: "red" }}>{error}</span>
                                )}
                              </>
                            ) : (
                              <></>
                            )}
                          </FormGroup>
                        </Col>
                      );
                    }
                  })} */}
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
                      checked={formData["status"] == "Active"}
                      style={{ marginRight: "3px" }}
                      type="radio"
                      name="status"
                      value="Active"
                    />
                    <span style={{ marginRight: "20px" }}>Active</span>
                    <input
                      checked={formData["status"] == "Deactive"}
                      style={{ marginRight: "3px" }}
                      type="radio"
                      name="status"
                      value="Deactive"
                    />
                    <span style={{ marginRight: "3px" }}>Deactive</span>
                  </div>
                </Col>
              </Row>
              <hr />
              <Row>
                <Button.Ripple
                  color="primary"
                  type="submit"
                  className="mr-1 mt-2 mx-2">
                  {Heading && Heading}
                </Button.Ripple>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
export default CreateWareHouse;
