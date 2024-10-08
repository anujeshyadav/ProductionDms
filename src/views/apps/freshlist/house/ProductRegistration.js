// import React, { Component, useDebugValue } from "react";
import React, { useEffect, useState } from "react";

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
// import { history } from "../../../../history";

import axiosConfig from "../../../../axiosConfig";
import Multiselect from "multiselect-react-dropdown";
import Select from "react-select";

import swal from "sweetalert";
import "../../../../../src/layouts/assets/scss/pages/users.scss";
import { Route } from "react-router-dom";
import { CloudLightning } from "react-feather";
import { timers } from "jquery";
const selectItem1 = [];
const selectstate2 = [];

const AllunSelectedCity = [];
const Selectedarray = [];

const ProductRegistration = () => {
  // const [Address, setAddress] = useState("");
  const [Viewpermisson, setViewpermisson] = useState(null);
  const [Editpermisson, setEditpermisson] = useState(null);
  const [Createpermisson, setCreatepermisson] = useState(null);
  const [Deletepermisson, setDeletepermisson] = useState(null);
  const [fullname, setfullname] = useState("");
  const [GSTIN, setGSTIN] = useState("");
  const [StateList, setStateList] = useState([]);
  const [CityList, setCityList] = useState([]);
  const [SelectedSCity, setSelectedSCity] = useState([]);
  const [SelectedState, setSelectedState] = useState([]);
  const [B_City, setB_City] = useState("");
  const [checkbox, setcheckbox] = useState("");
  const [S_City, setS_City] = useState("");
  const [Mobile_no, setMobile_no] = useState("");
  const [B_Country, setB_Country] = useState("");
  const [S_Country, setS_Country] = useState("");
  const [Phone_no, setPhone_no] = useState("");
  const [Place_of_Supply, setPlace_of_Supply] = useState("");
  const [B_State, setB_State] = useState("");
  const [S_State, setS_State] = useState("");
  const [B_Street, setB_Street] = useState("");
  const [S_Street, setS_Street] = useState("");
  const [B_PinCode, setB_PinCode] = useState("");
  const [S_PinCode, setS_PinCode] = useState("");
  const [setuserList, setsetuserList] = useState(false);
  const [multiSelect, setmultiSelect] = useState([]);
  const [selectedOptions, setselectedOptions] = useState([]);
  const [password, setpassword] = useState("");
  const [email, setemail] = useState("");
  const [status, setstatus] = useState("");
  const [AssignRole, setAssignRole] = useState("");
  const [CompanyName, setCompanyName] = useState("");
  const [Companytype, setCompanytype] = useState("");
  const [Selectuser, setSelectuser] = useState("");
  const [UserName, setUserName] = useState("");
  const [productName, setproductName] = useState([]);
  const [City, setCity] = useState("");
  const [formValues, setFormValues] = useState([
    { partname: "", partseriel: "", quantity: "" },
  ]);
  useEffect(() => {
    let pageparmission = JSON.parse(localStorage.getItem("userData"));
    let newparmisson = pageparmission?.role?.find(
      (value) => value?.pageName === "Create Account"
    );
    setViewpermisson(newparmisson?.permission.includes("View"));
    setCreatepermisson(newparmisson?.permission.includes("Create"));
    setEditpermisson(newparmisson?.permission.includes("Edit"));

    setDeletepermisson(newparmisson?.permission.includes("Delete"));

    const formdata = new FormData();
    formdata.append("user_id", pageparmission?.Userinfo?.id);
    formdata.append("role", pageparmission?.Userinfo?.role);
    axiosConfig.post("/getrolelistdropdown", formdata).then((response) => {
      // console.log(response);
      const propertyNames = Object.values(response.data?.data?.roles);

      // console.log(propertyNames);
      setproductName(propertyNames);
    });
    // state List
    axiosConfig
      .get("/getallstates")
      .then((response) => {
        setStateList(response.data?.states);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    let pageparmission = JSON.parse(localStorage.getItem("userData"));
    let uniqueChars = [...new Set(selectItem1)];
    let selectedOption = [...new Set(selectedOptions)];

    const formdata = new FormData();

    formdata.append("created_by", pageparmission?.Userinfo?.id);
    formdata.append("password", password);
    formdata.append("full_name", fullname);
    formdata.append("gstin_no", GSTIN);
    formdata.append("username", UserName);
    formdata.append("city", B_City);
    formdata.append("mobile", Mobile_no);
    formdata.append("email", email);
    formdata.append("status", status);
    formdata.append("role", AssignRole);
    formdata.append("company_name", CompanyName);
    formdata.append("company_type", Companytype);
    formdata.append("place_supply", Place_of_Supply);
    formdata.append("billing_street", B_Street);
    formdata.append("billing_city", B_City);
    formdata.append("billing_state", B_State);
    formdata.append("billing_country", B_Country);
    formdata.append("billing_pincode", B_PinCode);
    formdata.append("shipping_street", S_Street);
    formdata.append("shipping_city", S_City);
    formdata.append("shipping_state", S_State);
    formdata.append("shipping_country", S_Country);
    formdata.append("shipping_pincode", S_PinCode);
    formdata.append("phone_no", Phone_no);
    if (selectedOption.length > 0) {
      formdata.append("state_id", multiSelect.toString());
    } else {
      formdata.append("state_id", SelectedState);
    }

    formdata.append("city_id", uniqueChars);

    axiosConfig
      .post("/createuser", formdata)
      .then((response) => {
        if (response.data?.success) {
          swal("Success!", "Submitted SuccessFull!", "success");
          setAssignRole("");
          setstatus("");
          setemail("");
          setCity("");
          setPhone_no("");
          setUserName("");
          setfullname("");
          setpassword("");
          setS_Country("");
          setS_State("");
          setS_City("");
          setS_Street("");
          setS_PinCode("");
        }
        // this.props.history.push("/app/softNumen/order/placeorder");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleMatchaddress = (e, value) => {
    setcheckbox(value);
    if (value) {
      setS_Country(B_Country);
      setS_State(B_State);
      setS_City(B_City);
      setS_Street(B_Street);
      setS_PinCode(B_PinCode);
    } else {
      setS_Country("");
      setS_State("");
      setS_City("");
      setS_Street("");
      setS_PinCode("");
    }
  };
  const onSelect = (selectedList, selectedItem) => {
    console.log(selectedList);

    if (selectedList.length) {
      for (var i = 0; i < selectedList.length; i++) {
        selectItem1.push(selectedList[i].id);
      }
    }
  };
  const onSelect1 = (selectedList, selectedItem) => {
    if (selectedList.length) {
      for (var i = 0; i < selectedList.length; i++) {
        selectedOptions.push(selectedList[i].id);
      }
    }

    let arr = selectedList.map((ele) => ele.id);
    setmultiSelect(arr);
    // console.log(multiSelect);

    let uniqueChars = [...new Set(selectedOptions)];

    if (uniqueChars.length === 1) {
      let value = uniqueChars[0];
      const formdata = new FormData();
      formdata.append("state_id", value);
      axiosConfig
        .post(`/getcity`, formdata)
        .then((res) => {
          setCityList(res?.data?.cities);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setCityList([]);
    }
  };
  const onRemove1 = (selectedList, removedItem) => {
    // debugger;
    // setselectedOptions("");
    // console.log(selectedList);
    // setmultiSelect(selectedList);

    let arr = selectedList.map((ele) => ele.id);
    // console.log(arr);
    setmultiSelect(arr);
    // console.log(multiSelect);
    // if (selectedList.length) {
    //   for (var i = 0; i < selectedList.length; i++) {
    //     selectedOptions.push(selectedList[i].id);
    //   }
    // }
    // let uniqueChars = [...new Set(selectedOptions)];
    // console.log(uniqueChars);
  };

  const onRemove = (selectedList, removedItem) => {
    console.log(selectedList);
    console.log(removedItem);
  };

  let handleChange = (i, e) => {
    let newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
  };

  let addFormFields = () => {
    setFormValues([...formValues, { name: "", partseriel: "", quantity: "" }]);
  };

  let removeFormFields = (i) => {
    let newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };

  let handleSubmit = (event) => {
    event.preventDefault();
    alert(JSON.stringify(formValues));
  };

  return (
    <div>
      <div>
        <Card>
          <Row className="m-2">
            <Col>
              <h1 className="float-left">Product Registration</h1>
            </Col>
          </Row>
          {/* <div className="container ">
            <form onSubmit={handleSubmit}>
              {formValues.map((element, index) => (
                <div className="form-inline my-2" key={index}>
                  <FormGroup>
                    <Label>Part Name</Label>
                    <Input
                      type="text"
                      name="name"
                      placeholder="Part Name"
                      value={element.name || ""}
                      onChange={e => handleChange(index, e)}
                    />
                  </FormGroup>

                  <Label>Part Serial No.</Label>
                  <Input
                    type="text"
                    name="partseriel"
                    placeholder="Part Seriel"
                    value={element.partseriel || ""}
                    onChange={e => handleChange(index, e)}
                  />
                  <Label>Quantity </Label>
                  <Input
                    type="text"
                    name="quantity"
                    placeholder="Quantity"
                    value={element.quantity || ""}
                    onChange={e => handleChange(index, e)}
                  />
                  {index ? (
                    <Button
                      className="button remove ml-1"
                      color="primary"
                      onClick={() => removeFormFields(index)}
                    >
                      Remove
                    </Button>
                  ) : null}
                </div>
              ))}
              <div className="button-section">
                <Button
                  onClick={() => addFormFields()}
                  color="primary"
                  className="mr-1 mt-2 mx-2"
                >
                  Add
                </Button>
                <Button
                  color="primary"
                  className="mr-1 mt-2 mx-2 button submit"
                  // className="button submit"
                  type="submit"
                >
                  Submit
                </Button>
              </div>
            </form>
          </div> */}

          <CardBody>
            <Form className="m-1" onSubmit={submitHandler}>
              <Row className="mb-2">
                <Col lg="6" md="6">
                  <FormGroup>
                    <Label>Mobile Number</Label>
                    <Input type="number" placeholder="Mobile Number"></Input>
                  </FormGroup>
                </Col>
                <Col lg="6" md="6">
                  <FormGroup>
                    <Row></Row>
                    <Label for="cars"> Product Seriel No. *</Label>
                    {/* {AssignRole === "supplier" ? ( */}
                    <>
                      <Multiselect
                        required
                        showCheckbox="true"
                        isObject="false"
                        options={StateList} // Options to display in the dropdown
                        // selectedValues={selectedValue}   // Preselected value to persist in dropdown
                        onSelect={onSelect1} // Function will trigger on select event
                        onRemove={onRemove1} // Function will trigger on remove event
                        displayValue="state_title" // Property name to display in the dropdown options
                      />
                    </>
                    {/* ) : (
                      <>
                        <select
                          required
                          name="SelectedState"
                          value={SelectedState}
                          onChange={e => {
                            const formdata = new FormData();
                            setSelectedState(e.target.value);
                            formdata.append("state_id", e.target.value);
                            axiosConfig
                              .post(`/getcity`, formdata)
                              .then(res => {
                                setCityList(res?.data?.cities);
                              })
                              .catch(err => {
                                console.log(err);
                              });
                          }}
                          className="form-control"
                        >
                          <option value="volvo">--Select State--</option>
                          {StateList &&
                            StateList?.map((ele, i) => (
                              <option key={i} value={ele?.id}>
                                {ele?.state_title}
                              </option>
                            ))}
                        </select>
                      </>
                    )} */}
                  </FormGroup>
                </Col>
                <Col lg="6" md="6">
                  <FormGroup>
                    <Row></Row>
                    <Label for="cars"> Associate Serial No. *</Label>
                    {/* {AssignRole === "supplier" ? ( */}
                    <>
                      <Multiselect
                        required
                        showCheckbox="true"
                        isObject="false"
                        options={StateList} // Options to display in the dropdown
                        // selectedValues={selectedValue}   // Preselected value to persist in dropdown
                        onSelect={onSelect1} // Function will trigger on select event
                        onRemove={onRemove1} // Function will trigger on remove event
                        displayValue="state_title" // Property name to display in the dropdown options
                      />
                    </>
                    {/* ) : (
                      <>
                        <select
                          required
                          name="SelectedState"
                          value={SelectedState}
                          onChange={e => {
                            const formdata = new FormData();
                            setSelectedState(e.target.value);
                            formdata.append("state_id", e.target.value);
                            axiosConfig
                              .post(`/getcity`, formdata)
                              .then(res => {
                                setCityList(res?.data?.cities);
                              })
                              .catch(err => {
                                console.log(err);
                              });
                          }}
                          className="form-control"
                        >
                          <option value="volvo">--Select State--</option>
                          {StateList &&
                            StateList?.map((ele, i) => (
                              <option key={i} value={ele?.id}>
                                {ele?.state_title}
                              </option>
                            ))}
                        </select>
                      </>
                    )} */}
                  </FormGroup>
                </Col>
                <Col lg="6" md="6">
                  <FormGroup>
                    <Label> Select Modal*</Label>
                    <CustomInput
                      required
                      id="AssignRole"
                      type="select"
                      name="AssignRole"
                      value={AssignRole}
                      // onChange={changeHandler}
                      onChange={(e) => setAssignRole(e.target.value)}
                    >
                      <option value="">--Select Role--</option>

                      {productName &&
                        productName?.map((value, index) => (
                          <option key={index} value={value}>
                            {value}
                          </option>
                        ))}
                    </CustomInput>
                  </FormGroup>
                </Col>
                <Col lg="6" md="6">
                  <FormGroup>
                    <Label> Select Variant</Label>
                    <CustomInput
                      required
                      id="AssignRole"
                      type="select"
                      name="AssignRole"
                      value={AssignRole}
                      // onChange={changeHandler}
                      onChange={(e) => setAssignRole(e.target.value)}
                    >
                      <option value="">--Select Variant--</option>

                      {productName &&
                        productName?.map((value, index) => (
                          <option key={index} value={value}>
                            {value}
                          </option>
                        ))}
                    </CustomInput>
                  </FormGroup>
                </Col>
                <Col lg="6" md="6">
                  <FormGroup>
                    <Label> Select Product Type</Label>
                    <CustomInput
                      required
                      id="AssignRole"
                      type="select"
                      name="AssignRole"
                      value={AssignRole}
                      // onChange={changeHandler}
                      onChange={(e) => setAssignRole(e.target.value)}
                    >
                      <option value="">--Select Product Type--</option>

                      {productName &&
                        productName?.map((value, index) => (
                          <option key={index} value={value}>
                            {value}
                          </option>
                        ))}
                    </CustomInput>
                  </FormGroup>
                </Col>
                <Col lg="6" md="6">
                  <FormGroup>
                    <Label> Select Product Name</Label>
                    <CustomInput
                      required
                      id="AssignRole"
                      type="select"
                      name="AssignRole"
                      value={AssignRole}
                      // onChange={changeHandler}
                      onChange={(e) => setAssignRole(e.target.value)}
                    >
                      <option value="">--Select Product Name--</option>

                      {productName &&
                        productName?.map((value, index) => (
                          <option key={index} value={value}>
                            {value}
                          </option>
                        ))}
                    </CustomInput>
                  </FormGroup>
                </Col>

                <Col lg="6" md="6">
                  <FormGroup>
                    <Label> Select Fuel Type</Label>
                    <CustomInput
                      required
                      id="AssignRole"
                      type="select"
                      name="AssignRole"
                      value={AssignRole}
                      // onChange={changeHandler}
                      onChange={(e) => setAssignRole(e.target.value)}
                    >
                      <option value="">--Select Fuel Type--</option>
                      <option>Diesel</option>
                      <option>Petrol</option>
                      <option>Electric </option>

                      {/* {productName &&
                        productName?.map((value, index) => (
                          <option key={index} value={value}>
                            {value}
                          </option>
                        ))} */}
                    </CustomInput>
                  </FormGroup>
                </Col>
                <Col lg="6" md="6">
                  <FormGroup>
                    <Label> Select Engine</Label>
                    <CustomInput
                      required
                      id="AssignRole"
                      type="select"
                      name="AssignRole"
                      value={AssignRole}
                      // onChange={changeHandler}
                      onChange={(e) => setAssignRole(e.target.value)}
                    >
                      <option value="">--Select Engine--</option>
                      <option>2000</option>
                      <option>1900</option>

                      {/* {productName &&
                        productName?.map((value, index) => (
                          <option key={index} value={value}>
                            {value}
                          </option>
                        ))} */}
                    </CustomInput>
                  </FormGroup>
                </Col>
                <Col lg="6" md="6">
                  <FormGroup>
                    <Label> Select Engine Type</Label>
                    <CustomInput
                      required
                      id="AssignRole"
                      type="select"
                      name="AssignRole"
                      value={AssignRole}
                      // onChange={changeHandler}
                      onChange={(e) => setAssignRole(e.target.value)}
                    >
                      <option value="">--Select Engine Type--</option>
                      <option>1.5 ltr kry</option>
                      <option>2.0 ltr kry</option>
                      <option>2.5 ltr kry</option>
                      <option>3.0 ltr kry</option>

                      {/* {productName &&
                        productName?.map((value, index) => (
                          <option key={index} value={value}>
                            {value}
                          </option>
                        ))} */}
                    </CustomInput>
                  </FormGroup>
                </Col>
                <Col lg="6" md="6">
                  <FormGroup>
                    <Label> Select Cylinders</Label>
                    <CustomInput
                      required
                      id="AssignRole"
                      type="select"
                      name="AssignRole"
                      value={AssignRole}
                      // onChange={changeHandler}
                      onChange={(e) => setAssignRole(e.target.value)}
                    >
                      <option value="">--Select Cylinders--</option>
                      <option>2 Cylinders</option>
                      <option>4 Cylinders</option>

                      {/* {productName &&
                        productName?.map((value, index) => (
                          <option key={index} value={value}>
                            {value}
                          </option>
                        ))} */}
                    </CustomInput>
                  </FormGroup>
                </Col>
                <Col lg="6" md="6">
                  <FormGroup>
                    <Label> Select Volves</Label>
                    <CustomInput
                      required
                      id="AssignRole"
                      type="select"
                      name="AssignRole"
                      value={AssignRole}
                      // onChange={changeHandler}
                      onChange={(e) => setAssignRole(e.target.value)}
                    >
                      <option value="">--Select Volves--</option>
                      <option>2 Volves </option>
                      <option>4 Volves</option>

                      {/* {productName &&
                        productName?.map((value, index) => (
                          <option key={index} value={value}>
                            {value}
                          </option>
                        ))} */}
                    </CustomInput>
                  </FormGroup>
                </Col>
                <Col lg="6" md="6">
                  <FormGroup>
                    <Label> Select Transmition</Label>
                    <CustomInput
                      required
                      id="AssignRole"
                      type="select"
                      name="AssignRole"
                      value={AssignRole}
                      // onChange={changeHandler}
                      onChange={(e) => setAssignRole(e.target.value)}
                    >
                      <option value="">--Select Transmition--</option>
                      <option>Manual </option>
                      <option>Automatic</option>

                      {/* {productName &&
                        productName?.map((value, index) => (
                          <option key={index} value={value}>
                            {value}
                          </option>
                        ))} */}
                    </CustomInput>
                  </FormGroup>
                </Col>
                <Col lg="6" md="6" sm="6" className="mb-2">
                  <Label className="">
                    <h4>Charger</h4>
                  </Label>
                  <div
                    className="form-label-group"
                    onChange={(e) => setstatus(e.target.value)}
                  >
                    <input
                      style={{ marginRight: "3px" }}
                      type="radio"
                      name="Charger"
                      value="Yes"
                    />
                    <span style={{ marginRight: "20px" }}>Yes</span>

                    <input
                      style={{ marginRight: "3px" }}
                      type="radio"
                      name="Charger"
                      value="No"
                    />
                    <span style={{ marginRight: "3px" }}>No</span>
                  </div>
                </Col>
                <Col lg="6" md="6">
                  <FormGroup>
                    <Label> Select Emission Standards </Label>
                    <CustomInput
                      required
                      id="AssignRole"
                      type="select"
                      name="AssignRole"
                      value={AssignRole}
                      // onChange={changeHandler}
                      onChange={(e) => setAssignRole(e.target.value)}
                    >
                      <option value="">--Select Emission Standards--</option>
                      <option>BS IV (Euro 4) </option>
                      <option>BS VI (Euro 6)</option>
                    </CustomInput>
                  </FormGroup>
                </Col>
                <Col lg="6" md="6">
                  <FormGroup>
                    <Label> Length</Label>
                    <Input type="text" placeholder="Length" />
                  </FormGroup>
                </Col>
                <Col lg="6" md="6">
                  <FormGroup>
                    <Label> Width </Label>
                    <Input type="text" placeholder="Width" />
                  </FormGroup>
                </Col>
                <Col lg="6" md="6">
                  <FormGroup>
                    <Label> Height </Label>
                    <Input type="text" placeholder="Height" />
                  </FormGroup>
                </Col>
                <Col lg="6" md="6">
                  <FormGroup>
                    <Label> WheelBase </Label>
                    <Input type="text" placeholder="WheelBase" />
                  </FormGroup>
                </Col>
                <Col lg="6" md="6">
                  <FormGroup>
                    <Label> GroundClearance </Label>
                    <Input type="text" placeholder="GroundClearance" />
                  </FormGroup>
                </Col>
                <Col lg="6" md="6">
                  <FormGroup>
                    <Label> KerbWeight </Label>
                    <Input type="text" placeholder="KerbWeight" />
                  </FormGroup>
                </Col>

                <Col lg="6" md="6">
                  <FormGroup>
                    <Label> No. Of Doors</Label>
                    <CustomInput
                      required
                      id="AssignRole"
                      type="select"
                      name="AssignRole"
                      value={AssignRole}
                      // onChange={changeHandler}
                      onChange={(e) => setAssignRole(e.target.value)}
                    >
                      <option value="">--Select No. Of Doors--</option>
                      <option>2 Door </option>
                      <option>4 Door </option>
                    </CustomInput>
                  </FormGroup>
                </Col>
                <Col lg="6" md="6">
                  <FormGroup>
                    <Label> Seating Capacity</Label>
                    <CustomInput
                      required
                      id="AssignRole"
                      type="select"
                      name="AssignRole"
                      value={AssignRole}
                      // onChange={changeHandler}
                      onChange={(e) => setAssignRole(e.target.value)}
                    >
                      <option value="">--Select Seating Capacity--</option>
                      <option>4 </option>
                      <option>5 </option>
                      <option>6 </option>
                      <option>7</option>
                      <option>8 </option>
                    </CustomInput>
                  </FormGroup>
                </Col>
                <Col lg="6" md="6">
                  <FormGroup>
                    <Label> No Of Seating Rows </Label>
                    <Input type="text" placeholder="No Of Seating Rows" />
                  </FormGroup>
                </Col>
                <Col lg="6" md="6">
                  <FormGroup>
                    <Label> Body Style</Label>
                    <CustomInput
                      required
                      id="AssignRole"
                      type="select"
                      name="AssignRole"
                      value={AssignRole}
                      // onChange={changeHandler}
                      onChange={(e) => setAssignRole(e.target.value)}
                    >
                      <option value="">--Select Body Style--</option>
                      <option>Suv</option>
                      <option>Sedan </option>
                      <option>Coupe </option>
                      <option>Hatchback </option>
                    </CustomInput>
                  </FormGroup>
                </Col>
                <Col lg="6" md="6">
                  <FormGroup>
                    <Label> Colors</Label>
                    <CustomInput
                      required
                      id="AssignRole"
                      type="select"
                      name="AssignRole"
                      value={AssignRole}
                      // onChange={changeHandler}
                      onChange={(e) => setAssignRole(e.target.value)}
                    >
                      <option value="">--Select Body Style--</option>
                      <option>White</option>
                      <option>Blue </option>
                      <option>Black </option>
                      <option>Red </option>
                    </CustomInput>
                  </FormGroup>
                </Col>
                <Col lg="6" md="6">
                  <Label> Over Speed Warning</Label>
                  <div class="form-check">
                    <Input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="flexCheckDefault"
                      checked
                    />
                    <label class="form-check-label" for="flexCheckDefault">
                      Yes
                    </label>
                  </div>
                  <div class="form-check">
                    <Input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="flexCheckChecked"
                    />
                    <label class="form-check-label" for="flexCheckChecked">
                      No
                    </label>
                  </div>
                </Col>

                <Col lg="6" md="6">
                  <Label> Anti Lock Breaking System </Label>
                  <div class="form-check">
                    <Input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="flexCheckDefault"
                      checked
                    />
                    <label class="form-check-label" for="flexCheckDefault">
                      Yes
                    </label>
                  </div>
                  <div class="form-check">
                    <Input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="flexCheckChecked"
                    />
                    <label class="form-check-label" for="flexCheckChecked">
                      No
                    </label>
                  </div>
                </Col>
                <Col lg="6" md="6">
                  <Label> Brake Assist</Label>
                  <div class="form-check">
                    <Input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="flexCheckDefault"
                      checked
                    />
                    <label class="form-check-label" for="flexCheckDefault">
                      Yes
                    </label>
                  </div>
                  <div class="form-check">
                    <Input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="flexCheckChecked"
                    />
                    <label class="form-check-label" for="flexCheckChecked">
                      No
                    </label>
                  </div>
                </Col>
                <Col lg="6" md="6">
                  <Label>Hillhold Control</Label>
                  <div class="form-check">
                    <Input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="flexCheckDefault"
                      checked
                    />
                    <label class="form-check-label" for="flexCheckDefault">
                      Yes
                    </label>
                  </div>
                  <div class="form-check">
                    <Input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="flexCheckChecked"
                    />
                    <label class="form-check-label" for="flexCheckChecked">
                      No
                    </label>
                  </div>
                </Col>
                <Col lg="6" md="6">
                  <FormGroup>
                    <Label> AirBags</Label>
                    <CustomInput
                      required
                      id="AssignRole"
                      type="select"
                      name="AssignRole"
                      value={AssignRole}
                      // onChange={changeHandler}
                      onChange={(e) => setAssignRole(e.target.value)}
                    >
                      <option value="">--Select AirBags--</option>
                      <option>2 AirBags</option>
                      <option>6 AirBags </option>
                    </CustomInput>
                  </FormGroup>
                </Col>
                <Col lg="6" md="6">
                  <Label>Seat Belt Warning </Label>
                  <div class="form-check">
                    <Input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="flexCheckDefault"
                      checked
                    />
                    <label class="form-check-label" for="flexCheckDefault">
                      Yes
                    </label>
                  </div>
                  <div class="form-check">
                    <Input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="flexCheckChecked"
                    />
                    <label class="form-check-label" for="flexCheckChecked">
                      No
                    </label>
                  </div>
                </Col>
                <Col lg="6" md="6">
                  <Label> Child Seat Anchor Points</Label>
                  <div class="form-check">
                    <Input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="flexCheckDefault"
                      checked
                    />
                    <label class="form-check-label" for="flexCheckDefault">
                      Yes
                    </label>
                  </div>
                  <div class="form-check">
                    <Input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="flexCheckChecked"
                    />
                    <label class="form-check-label" for="flexCheckChecked">
                      No
                    </label>
                  </div>
                </Col>
                <Col lg="6" md="6">
                  <Label> Type Pressure Monitoring System </Label>
                  <div class="form-check">
                    <Input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="flexCheckDefault"
                      checked
                    />
                    <label class="form-check-label" for="flexCheckDefault">
                      Yes
                    </label>
                  </div>
                  <div class="form-check">
                    <Input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="flexCheckChecked"
                    />
                    <label class="form-check-label" for="flexCheckChecked">
                      No
                    </label>
                  </div>
                </Col>
              </Row>

              <Row>
                <Button.Ripple
                  color="primary"
                  type="submit"
                  className="mr-1 mt-2 mx-2"
                >
                  Submit
                </Button.Ripple>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
export default ProductRegistration;
