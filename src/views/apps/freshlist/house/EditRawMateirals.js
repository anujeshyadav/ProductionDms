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
import "react-phone-input-2/lib/style.css";
import { useParams, useHistory } from "react-router-dom";
import swal from "sweetalert";
import "../../../../../src/layouts/assets/scss/pages/users.scss";
import { FaUpload } from "react-icons/fa";
import {
  AllCategoryList,
  _Get,
  _Put,
} from "../../../../ApiEndPoint/ApiCalling";
import "../../../../assets/scss/pages/users.scss";
import UserContext from "../../../../context/Context";
import {
  Image_URL,
  Update_Product,
  WareahouseList_For_addProduct,
} from "../../../../ApiEndPoint/Api";
import { MdCancel } from "react-icons/md";
import {
  Update_Raw_Material,
  ViewOne_Raw_Material,
} from "../../../../ApiEndPoint/ProductionApi";
import { Unit_List } from "../../../../ApiEndPoint/Unitlist";

const EditRawMateirals = () => {
  const history = useHistory();
  const [categoryList, setcategoryList] = useState([]);
  const [wareHouseList, setWareHouseList] = useState([]);
  const [formImages, setFormImages] = useState([]);
  const [formValues, setFormValues] = useState([{ unit: "" }]);
  const [Loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [imageUri, setImageUris] = useState([]);
  const [Image, setImage] = useState([]);
  const [subcatlist, setsubcatlist] = useState([]);
  const [Data, setData] = useState({
    database: "",
    category: "",
    SubCategory: "",
    warehouse: "",
    Product_Title: "",
    MIN_stockalert: "",
    status: "",
  });

  const Context = useContext(UserContext);
  const Params = useParams();
  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    if (name == "Unit") {
      const selectedOptionValue = e.target.value;
      const selectedIndex = e.target.selectedIndex;
      const selectedOptionText = e.target.options[selectedIndex]?.text;

      setData({
        ...Data,
        unitType: selectedOptionText,
        unitQty: selectedOptionValue,
        [name]: value,
      });
    } else {
      setData({
        ...Data,
        [name]: value,
      });
    }
  };
  const changeHandler1 = (e) => {
    setData({
      ...Data,
      ["status"]: e.target.value,
    });
  };

  useEffect(() => {
    let userData = JSON.parse(localStorage.getItem("userData"));

    _Get(ViewOne_Raw_Material, Params?.id)
      .then((res) => {
        setData(res?.Product);
        setFormValues(res?.Product?.Units);
        AllCategoryList(userData?._id, userData?.database)
          .then((resp) => {
            if (resp?.Category) {
              let selectedcat = resp?.Category?.filter(
                (ele) => ele?.name == res?.Product?.category
              );
              let AllSubCategoried = selectedcat[0]?.subcategories;
              let selectedSubCat = AllSubCategoried?.filter(
                (ele) => ele?.name == res?.Product?.SubCategory
              );
              setcategoryList(resp.Category);
              setsubcatlist(AllSubCategoried);
            }
          })
          .catch((err) => {
            console.log(err);
          });

        _Get(WareahouseList_For_addProduct, userData?.database)
          .then((values) => {
            let value = values?.Warehouse;
            if (value) {
              setWareHouseList(value);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleRemoveImage = (index) => {
    setFormImages((prevFormImages) =>
      prevFormImages.filter((_, i) => i !== index)
    );
    let Images = [...Image];
    Images.splice(index, 1);
    setImage(Images);
  };
  const handleFileChange = (e) => {
    const files = e.target.files;
    const filesArray = Array.from(files); // Convert FileList to array
    // setImage(e.target.files[0]);
    Image.push(e.target.files[0]);

    filesArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({
          ...formData,

          ["imageuri"]: event.target.result,
        });
        console.log("event.target.result", event.target.result);
        setFormImages((prevFormImages) => [
          ...prevFormImages,
          event.target.result,
        ]);
      };
      reader.readAsDataURL(file);
    });
  };
  const validate = () => {
    const errors = {};
    if (!Data?.warehouse) {
      errors.warehouse = "Please select a Warehouse";
    }
    let findUnit = formValues?.some((item) => item?.unit == Data?.stockUnit);

    if (!findUnit) {
      errors.stockUnit = "Unit Mismatch with selected Stock Unit";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    let userData = JSON.parse(localStorage.getItem("userData"));
    let payload = {
      database: userData?.database,
      Units: formValues,
      category: Data?.category,
      SubCategory: Data?.SubCategory,
      warehouse: Data?.warehouse,
      stockUnit: Data?.stockUnit,
      Product_Title: Data?.Product_Title,
      Opening_Stock: Number(Data?.Opening_Stock),
      MIN_stockalert: Number(Data?.MIN_stockalert),
      status: Data?.status,
    };

    // for (let pair of formdata.entries()) {
    //   console.log(pair[0] + ": " + pair[1]);
    // }
    // for (const value of formdata.values()) {
    //   console.log(value);
    // }
    if (validate()) {
      await _Put(Update_Raw_Material, Params?.id, payload)
        .then((res) => {
          setLoading(false);

          history.goBack();
          if (res?.status) {
            swal("Product Details Updated Successfully");
          }
        })
        .catch((err) => {
          setLoading(false);

          console.log(err);
          swal("Error", "SomeThing went wrong ", "error");
        });
    } else {
      setLoading(false);
    }
  };
  const handlechangeSubcat = (e) => {
    console.log(e.target.value);
    if (e.target.value != "NA") {
      let selecteddata = categoryList?.filter(
        (ele, i) => ele?.name == e.target.value
      );
      setsubcatlist(selecteddata[0]?.subcategories);
    } else {
      swal("Select Category");
    }
  };

  let handleChange = (i, e, type) => {
    let newFormValues = [...formValues];
    let { name, value } = e.target;
    newFormValues[i][name] = name == "qty" ? +value : value;
    newFormValues[i]["type"] = type;
    setFormValues(newFormValues);
  };

  let addFormFields = () => {
    setFormValues([...formValues, { unit: "" }]);
  };

  let removeFormFields = (i) => {
    let newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };
  return (
    <div>
      <div>
        <Card>
          {/* <hr /> */}

          <CardBody className="p-1 pb-0">
            <div className="d-flex justify-content-center">
              <h4>Edit Product</h4>
            </div>
            <Form className="m-1" onSubmit={submitHandler}>
              <Row className="mb-2">
                <Col className="mb-1" lg="3" md="3">
                  <Label>
                    Warehouse <span style={{ color: "red" }}>*</span>
                  </Label>
                  <CustomInput
                    required
                    type="select"
                    placeholder="Select WareHouse"
                    name="warehouse"
                    style={{
                      border: formErrors?.warehouse
                        ? "1px solid red"
                        : "1px solid #cccccc",
                    }}
                    value={Data.warehouse}
                    onChange={handleInputChange}>
                    <option value="NA">--Select WareHouse--</option>

                    {wareHouseList &&
                      wareHouseList?.map((whList) => {
                        return (
                          <option value={whList?._id} key={whList?._id}>
                            {whList?.warehouseName}
                          </option>
                        );
                      })}
                  </CustomInput>
                </Col>
                <Col className="mb-1" lg="3" md="3">
                  <Label className="">
                    Category <span style={{ color: "red" }}>*</span>
                  </Label>
                  <CustomInput
                    required
                    type="select"
                    placeholder="Select Category"
                    name="category"
                    value={Data.category}
                    onChange={(e) => {
                      handleInputChange(e);
                      handlechangeSubcat(e);
                    }}>
                    <option value="NA">--Select Category--</option>
                    {categoryList &&
                      categoryList?.map((cat) => (
                        <option value={cat?.name} key={cat?._id}>
                          {cat?.name}
                        </option>
                      ))}
                  </CustomInput>
                </Col>
                <Col className="mb-1" lg="3" md="3">
                  <Label>
                    SubCategory <span style={{ color: "red" }}>*</span>
                  </Label>
                  <CustomInput
                    required
                    type="select"
                    placeholder="Select Category"
                    name="SubCategory"
                    value={Data.SubCategory}
                    onChange={handleInputChange}>
                    <option value="NA">--Select SubCategory--</option>
                    {subcatlist &&
                      subcatlist?.map((cat) => (
                        <option value={cat?.name} key={cat?._id}>
                          {cat?.name}
                        </option>
                      ))}
                  </CustomInput>
                </Col>

                <Col className="mb-1" lg="3" md="3">
                  <Label>
                    Product Name <span style={{ color: "red" }}>*</span>
                  </Label>
                  <Input
                    required
                    id="unitType"
                    type="text"
                    name="Product_Title"
                    placeholder="Product Title"
                    value={Data.Product_Title}
                    onChange={(e) => {
                      let value = e.target.value?.toUpperCase();
                      setData({
                        ...Data,
                        Product_Title: value,
                      });
                    }}
                    // onChange={handleInputChange}
                  />
                </Col>

                <Col className="mb-1" lg="3" md="3">
                  <Label>
                    Product Min stock <span style={{ color: "red" }}>*</span>
                  </Label>
                  <Input
                    required
                    id="MIN_stockalert"
                    type="number"
                    name="MIN_stockalert"
                    placeholder="Product Min stock alert"
                    value={Data.MIN_stockalert}
                    onChange={handleInputChange}
                  />
                </Col>
                <Col lg="3" md="3">
                  <Label>
                    Stock Unit <span style={{ color: "red" }}>*</span>
                  </Label>
                  <CustomInput
                    name="stockUnit"
                    required
                    type="select"
                    style={{
                      border: formErrors?.stockUnit
                        ? "1px solid red"
                        : "1px solid #cccccc",
                    }}
                    placeholder="stockUnit"
                    onChange={handleInputChange}
                    value={Data?.stockUnit}>
                    <option value="">--Select--</option>
                    {Unit_List?.map((ele) => (
                      <option value={ele?.value}>{ele?.title}</option>
                    ))}
                  </CustomInput>
                </Col>
                <Col className="mb-1" lg="3" md="3">
                  <Label>
                    {" "}
                    Opening Stock <span style={{ color: "red" }}>*</span>
                  </Label>
                  <Input
                    required
                    id="Opening_Stock"
                    type="text"
                    name="Opening_Stock"
                    placeholder="Opening_Stock"
                    value={Data.Opening_Stock}
                    onChange={handleInputChange}
                  />
                </Col>
                <Col lg="3" md="3" sm="6" className="d-flex  mt-3">
                  <div className="mb-0 mr-1">Status</div>
                  <div className="form-label-group" onChange={changeHandler1}>
                    <input
                      checked={Data?.status == "Active"}
                      style={{ marginRight: "3px" }}
                      type="radio"
                      name="status"
                      value="Active"
                    />
                    <span style={{ marginRight: "20px" }}>Active</span>

                    <input
                      style={{ marginRight: "3px" }}
                      checked={Data?.status == "Deactive"}
                      type="radio"
                      name="status"
                      value="Deactive"
                    />
                    <span style={{ marginRight: "3px" }}>Deactive</span>
                  </div>
                </Col>
              </Row>
              <>
                <div style={{ color: "red", fontWeight: 500 }}>
                  {formErrors?.stockUnit && formErrors?.stockUnit}
                </div>
              </>
              {formValues?.length &&
                formValues?.map((element, index) => (
                  <>
                    <Row className="mt-1" key={index}>
                      <Col className=" " lg="3" md="3">
                        <Label>Unit *</Label>

                        <CustomInput
                          name="unit"
                          required
                          type="select"
                          placeholder="unit"
                          value={element?.unit}
                          onChange={(e) => {
                            const selected =
                              e.target.options[
                                e.target.selectedIndex
                              ].getAttribute("type");
                            handleChange(index, e, selected);
                          }}>
                          <option value="">--Select--</option>
                          {Unit_List?.map((ele) => (
                            <option type={ele?.type} value={ele?.value}>
                              {ele?.title}
                            </option>
                          ))}
                        </CustomInput>
                      </Col>
                      <Col className=" " lg="3" md="3">
                        <Label>Quantity {index + 1}*</Label>

                        <Input
                          name="qty"
                          required
                          type="number"
                          placeholder="Enter Qty"
                          value={element?.qty}
                          onChange={(e) => {
                            handleChange(index, e, "text");
                          }}></Input>
                      </Col>
                      <Col lg="3" md="3">
                        {index ? (
                          <Button
                            color="danger"
                            className="mt-2 pt-1"
                            onClick={() => removeFormFields(index)}>
                            Remove
                          </Button>
                        ) : null}
                      </Col>
                    </Row>
                  </>
                ))}
              <div className="float-left mt-1 mb-1">
                <Button
                  className="button add mx-1"
                  color="primary"
                  onClick={() => addFormFields()}>
                  Add
                </Button>
              </div>
              <Row>
                {!Loading && !Loading ? (
                  <>
                    <Col className="" lg="12" md="12" sm="12">
                      <div className="d-flex justify-content-center">
                        <Button.Ripple
                          color="primary"
                          type="submit"
                          className="mt-2">
                          Submit
                        </Button.Ripple>
                      </div>
                    </Col>
                  </>
                ) : (
                  <>
                    <Col className="" lg="12" md="12" sm="12">
                      <div className="d-flex justify-content-center">
                        <Button.Ripple
                          color="primary"
                          // type="submit"
                          className="mt-2">
                          Loading...
                        </Button.Ripple>
                      </div>
                    </Col>
                  </>
                )}
              </Row>
            </Form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
export default EditRawMateirals;
