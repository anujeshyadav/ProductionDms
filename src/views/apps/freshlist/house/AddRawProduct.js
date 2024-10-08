import React, { useEffect, useState, useContext } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Form,
  FormGroup,
  CustomInput,
  Label,
  Input,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { FaUpload } from "react-icons/fa";
import { useHistory, Route, useParams } from "react-router-dom";
import swal from "sweetalert";
import { IoIosAdd } from "react-icons/io";
import "../../../../../src/layouts/assets/scss/pages/users.scss";
import {
  AllCategoryList,
  CreateCategory,
  CreateSubCategory,
  CreateWarehousesave,
  SaveProduct,
  UnitListView,
  _BulkUpload,
  _Get,
  _PostSave,
} from "../../../../ApiEndPoint/ApiCalling";
import "../../../../assets/scss/pages/users.scss";
import UserContext from "../../../../context/Context";
import {
  Bulk_Update_Product,
  Bulk_Upload_Product,
  WareahouseList_For_addProduct,
} from "../../../../ApiEndPoint/Api";
import { MdCancel } from "react-icons/md";
import { previousDay } from "date-fns";
import { Unit_List } from "../../../../ApiEndPoint/Unitlist";
import {
  Add_Raw_Material,
  ViewOne_Raw_Material,
} from "../../../../ApiEndPoint/ProductionApi";

const AddRawProduct = () => {
  const [categoryList, setcategoryList] = useState([]);
  const [wareHouseList, setWareHouseList] = useState([]);
  const [formValues, setFormValues] = useState([{ unit: "" }]);
  const [subcatlist, setsubcatlist] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [formCatData, setFormCatData] = useState({});
  const [formSubCategory, setformSubCategory] = useState({});
  const [Image, setImage] = useState([]);
  const [Data, setData] = useState({
    database: "",
    category: "",
    SubCategory: "",
    warehouse: "",
    Product_Title: "",
    MIN_stockalert: "",
    status: "",
  });
  const [BulkImport, setBulkImport] = useState(null);
  const [BulkUpload, setBulkUpload] = useState(false);
  const Context = useContext(UserContext);
  const history = useHistory();
  const [imageUri, setImageUris] = useState([]);
  const [formImages, setFormImages] = useState([]);
  const [warehouseModal, setWarehouseModal] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);
  const [subCategoryModal, setSubCategoryModal] = useState(false);

  let Params = useParams();
  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    if (name == "Unit") {
      const selectedOptionValue = e.target.value;
      const selectedIndex = e.target.selectedIndex;
      const selectedOptionText = e.target.options[selectedIndex]?.text;

      setData({
        ...Data,
        unitType: selectedOptionText,
        Size: selectedOptionValue,
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

  const handleInputCategoryChange = (e) => {
    const { value, files, name } = e.target;
    setFormCatData({
      ...formCatData,
      [name]: value,
    });
  };
  const handleSubCategoryChange = (e) => {
    const { value, files, name } = e.target;
    setformSubCategory({
      ...formSubCategory,
      [name]: value,
    });
  };
  const handleWarehouseSave = (e) => {
    e.preventDefault();
    const userInfor = JSON.parse(localStorage.getItem("userData"));
    let payload = {
      warehouseName: formData?.warehouseName,
      mobileNo: formData?.warehouseMobile,
      address: formData?.warehouseAddress,
      landlineNumber: formData?.landlineNumber,
      database: userInfor?.database,
      status: formData?.status,
    };
    CreateWarehousesave(payload)
      .then((res) => {
        handleWarehouse(userInfor);
        getWarehouseList();
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
  };
  const handleCategorySave = (e) => {
    e.preventDefault();

    let pageparmission = JSON.parse(localStorage.getItem("userData"));
    const data = new FormData();
    data.append("created_by", pageparmission?._id);
    data.append("name", formCatData?.category_name);
    data.append("description", formCatData?.description);
    data.append("status", formCatData?.status);

    CreateCategory(data)
      .then((res) => {
        handleCategory();
        catogaryList(pageparmission);
        swal("Success!", "Category Created", "Success");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleSubCategorySave = async (e) => {
    e.preventDefault();
    let pageparmission = JSON.parse(localStorage.getItem("userData"));
    const data = new FormData();
    data.append("created_by", pageparmission?._id);
    data.append("name", formSubCategory?.subcategory_name);
    data.append("unitType", formSubCategory?.unitName);
    data.append("category", formSubCategory?.category);
    data.append("description", formSubCategory?.Description);
    data.append("status", formSubCategory?.status);

    await CreateSubCategory(data)
      .then((res) => {
        console.log(res);
        swal("Success!", "Your Subcategory has been Added", "success");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const changeHandler1 = (e) => {
    setData({
      ...Data,
      ["status"]: e.target.value,
    });
  };

  useEffect(() => {
    let userData = JSON.parse(localStorage.getItem("userData"));
    catogaryList(userData);
    getWarehouseList(userData);
  }, []);
  const getWarehouseList = async (userData) => {
    let allWare = await _Get(WareahouseList_For_addProduct, userData?.database)
      .then((res) => {
        let value = res?.Warehouse;
        if (value) {
          setWareHouseList(value);
        }
        // console.log(res?.Warehouse);
      })
      .catch((err) => {
        console.log(err);
      });
    return allWare;
  };
  const catogaryList = async (userData) => {
    let allCate = await AllCategoryList(userData?._id, userData?.database)
      .then((res) => {
        if (res?.Category) {
          setcategoryList(res.Category);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    return allCate;
  };
  const handleRemoveImage = (index) => {
    setFormImages((prevFormImages) =>
      prevFormImages.filter((_, i) => i !== index)
    );
    let Images = [...Image];
    Images.splice(index, 1);
    setImage(Images);
  };
  // const handleFileChange = e => {
  //   // const { name } = e.target;
  //   let images = Array.from(e.target.files);
  //   setImage(images);
  //   const fiels = e.target.files;
  //   for (let i = 0; i < fiels.length; i++) {
  //     const reader = new FileReader();
  //     reader.onload = event => {
  //       setImageUris(prevUris => [...prevUris, event.target.result]);
  //     };
  //     reader.readAsDataURL(fiels[i]);
  //   }
  // };

  const handleFileChange = (e) => {
    const files = e.target.files;
    const filesArray = Array.from(files); // Convert FileList to array

    Image.push(e.target.files[0]);

    filesArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({
          ...formData,

          ["imageuri"]: event.target.result,
        });

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
    let userData = JSON.parse(localStorage.getItem("userData"));
    e.preventDefault();
    setLoading(true);
    if (BulkImport !== null || BulkImport != undefined) {
      let formdata = new FormData();
      formdata.append("file", BulkImport);
      formdata.append("database", userData?.database);
      if (formData?.UploadStatus == "Update") {
        let URl = `${Bulk_Update_Product}/${userData?.database}`;

        await _BulkUpload(URl, formdata)
          .then((res) => {
            setLoading(false);
            history.push("/app/freshlist/house/houseProductList");
            swal(`${res?.message}`);
          })
          .catch((err) => {
            setBulkImport({});
            setLoading(false);
            console.log(err.response);
            swal("Something Went Wrong");
          });
      } else if (formData?.UploadStatus == "New Upload") {
        let URl = `${Bulk_Upload_Product}/${userData?.database}`;
        await _BulkUpload(URl, formdata)
          .then((res) => {
            setLoading(false);
            history.push("/app/freshlist/house/houseProductList");
            swal(`${res?.message}`);
          })
          .catch((err) => {
            setBulkImport({});
            setLoading(false);
            console.log(err.response);
            swal("Something Went Wrong");
          });
      } else {
        swal("error", "Choose Type of Upload", "error");
      }
    } else {
      let payload = {
        id: Data?.id,
        database: userData?.database,
        warehouse: Data?.warehouse,
        category: Data?.category,
        SubCategory: Data?.SubCategory,
        Product_Title: Data?.Product_Title,
        Opening_Stock: Number(Data?.Opening_Stock),
        MIN_stockalert: Number(Data?.MIN_stockalert),
        status: Data?.status,
        stockUnit: Data?.stockUnit,
        Units: formValues,
        created_by: userData?._id,
      };

      if (validate()) {
        _PostSave(Add_Raw_Material, payload)
          .then((res) => {
            if (res?.status) {
              setLoading(false);
              history.goBack();
              swal("Product Created Successfully");
            }
          })
          .catch((err) => {
            setLoading(false);
            console.log(err?.response?.data?.message);
            if (!!err?.response?.data?.message) {
              swal(err?.response?.data?.message);
            }
          });
      } else {
        setLoading(false);
      }
    }
  };

  const handleWarehouse = () => setWarehouseModal(!warehouseModal);
  const handleCategory = () => setCategoryModal(!categoryModal);
  const handleSubCategory = () => setSubCategoryModal(!subCategoryModal);

  const handlechangeSubcat = (e) => {
    if (e.target.value != "NA") {
      let selecteddata = categoryList?.filter(
        (ele, i) => ele?.name == e.target.value
      );
      // console.log(selecteddata[0]?.subcategories);
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
          <CardBody className="p-1 pb-0">
            <Row>
              <Col lg="8" md="8" sm="8" className=""></Col>
              {/* {!BulkUpload && !BulkUpload && (
                <>
                  <Col lg="3" md="3">
                    <div className="d-flex justify-content-end ">
                      <Button
                        color="primary"
                        onClick={(e) => {
                          e.preventDefault();
                          setBulkUpload(true);
                        }}>
                        Bulk Upload
                      </Button>
                    </div>
                  </Col>
                  <Col lg="1" md="1">
                    <div className="">
                      <Route
                        render={({ history }) => (
                          <Button
                            style={{ cursor: "pointer" }}
                            className=" mr-1"
                            color="primary"
                            onClick={() => history.goBack()}>
                            Back
                          </Button>
                        )}
                      />
                    </div>
                  </Col>
                </>
              )} */}
              {/* (
                <Col className="d-flex justify-content-end" lg="2" md="2">
                  <div className="mr-1 ml-1">
                    <Button
                      color="primary"
                      onClick={e => {
                        e.preventDefault();
                        setBulkUpload(false);
                      }}
                    >
                      Back
                    </Button>
                  </div>
                </Col>
              )  */}

              {/* {!BulkUpload && !BulkUpload && (
                
              )} */}
            </Row>
            {BulkUpload && BulkUpload ? (
              <>
                <Form className="m-1" onSubmit={submitHandler}>
                  <Label>
                    Choose Type of Upload
                    <span style={{ color: "red" }}>*</span>
                  </Label>
                  <Row>
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
                  </Row>
                  <Row>
                    <Col lg="3" md="3" sm="12">
                      <FormGroup>
                        <Label>Bulk Import</Label>

                        <Input
                          required
                          className="form-control"
                          type="file"
                          name="BulkImport"
                          onChange={(e) => {
                            setBulkImport(e.target.files[0]);
                          }}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  {!Loading && !Loading ? (
                    <>
                      <Col>
                        <div className="d-flex justify-content-center">
                          <Button.Ripple
                            color="primary"
                            type="submit"
                            className="mt-2">
                            Import
                          </Button.Ripple>
                        </div>
                      </Col>
                    </>
                  ) : (
                    <>
                      <Col>
                        <div className="d-flex justify-content-center">
                          <Button.Ripple color="primary" className="mt-2">
                            Submitting...
                          </Button.Ripple>
                        </div>
                      </Col>
                    </>
                  )}
                </Form>
              </>
            ) : (
              <>
                <Form className="m-1" onSubmit={submitHandler}>
                  <Row className="">
                    <Col className="mt-1" lg="3" md="3">
                      <Label>
                        Warehouse <span style={{ color: "red" }}>*</span>
                      </Label>
                      <span
                        onClick={handleWarehouse}
                        style={{
                          cursor: "pointer",
                          boxShadow: "0 6px 8px rgba(0, 0, 0, 0.1)",
                          border: "1px solid #ccc",
                          backgroundColor: "lightblue",
                          borderRadius: "15px",
                        }}
                        size="sm">
                        <IoIosAdd size={17} color="blue" />
                      </span>
                      <CustomInput
                        required
                        type="select"
                        placeholder="Select WareHouse"
                        style={{
                          border: formErrors?.warehouse
                            ? "1px solid red"
                            : "1px solid #cccccc",
                        }}
                        name="warehouse"
                        value={Data?.warehouse}
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
                    <Col className="mt-1" lg="3" md="3">
                      <Label className="">
                        Category <span style={{ color: "red" }}>*</span>
                      </Label>
                      <span
                        onClick={handleCategory}
                        style={{
                          cursor: "pointer",
                          boxShadow: "0 6px 8px rgba(0, 0, 0, 0.1)",
                          border: "1px solid #ccc",
                          backgroundColor: "lightblue",
                          borderRadius: "15px",
                        }}
                        size="sm">
                        <IoIosAdd size={17} color="blue" />
                      </span>
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
                    <Col className="mt-1" lg="3" md="3">
                      <Label style={{ padding: "2px" }}>
                        SubCategory
                        <span className="mendatory">*</span>
                      </Label>
                      <span
                        onClick={handleSubCategory}
                        style={{
                          cursor: "pointer",
                          boxShadow: "0 6px 8px rgba(0, 0, 0, 0.1)",
                          border: "1px solid #ccc",
                          backgroundColor: "lightblue",
                          borderRadius: "15px",
                        }}
                        size="sm">
                        <IoIosAdd size={17} color="blue" />
                      </span>
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
                    {/* <Col className="mt-1" lg="3" md="3">
                    <Label style={{ padding: "2px" }}>
                      GST Type
                      <span className="mendatory">*</span>
                    </Label>
                    <CustomInput
                      required
                      type="select"
                      placeholder="Select igstType"
                      name="purchaseStatus"
                      value={Data?.purchaseStatus}
                      onChange={handleInputChange}>
                      <option value="NA">--Select IGST Type--</option>
                      <option value={false}>CGST/SGST</option>
                      <option value={true}>IGST</option>
                    </CustomInput>
                  </Col> */}
                    <Col className="mt-1" lg="3" md="3">
                      <Label>
                        Product Name <span style={{ color: "red" }}>*</span>
                      </Label>
                      <Input
                        required
                        id="unitType"
                        type="text"
                        name="Product_Title"
                        placeholder="Product Name"
                        value={Data.Product_Title}
                        // onChange={handleInputChange}
                        onChange={(e) => {
                          const inputPan = e.target.value;
                          const filteredValue = inputPan.replace(/\s/g, "");
                          setData({
                            ...Data,
                            ["id"]: filteredValue,
                            ["Product_Title"]: inputPan?.toUpperCase(),
                          });
                        }}
                      />
                    </Col>
                    {/* <Col className="mb-1" lg="3" md="3">
                    <Label>Size *</Label>
                    <Input
                      required
                      id="unitType"
                      type="text"
                      name="Size"
                      placeholder="Product Size"
                      value={Data.Size}
                      onChange={handleInputChange}
                    />
                  </Col> */}
                    {/* <Col className="mt-1" lg="3" md="3">
                      <Label>
                        HSN <span style={{ color: "red" }}>*</span>
                      </Label>
                      <Input
                        required
                        id="HSN_Code"
                        type="text"
                        name="HSN_Code"
                        placeholder="Product HSN_Code"
                        value={Data.HSN_Code}
                        onChange={handleInputChange}
                      />
                    </Col> */}
                    {/* <Col className="mt-1" lg="3" md="3">
                      <Label>
                        GST Percentage <span style={{ color: "red" }}>*</span>
                      </Label>
                      <Input
                        required
                        id="GSTRate"
                        type="number"
                        name="GSTRate"
                        placeholder="Product GSTRate"
                        value={Data.GSTRate}
                        onChange={handleInputChange}
                      />
                    </Col> */}
                    {/* <Col className="mb-1" lg="3" md="3">
                    <Label>Discount *</Label>
                    <Input
                      required
                      id="discount"
                      type="number"
                      name="discount"
                      placeholder="Product discount"
                      value={Data.discount}
                      onChange={handleInputChange}
                    />
                  </Col> */}
                    <Col className="mt-1" lg="3" md="3">
                      <Label>
                        Product Min stock{" "}
                        <span style={{ color: "red" }}>*</span>
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
                    <Col className="mt-1" lg="3" md="3">
                      <Label>
                        Stock Unit <span style={{ color: "red" }}>*</span>
                      </Label>
                      <CustomInput
                        style={{
                          border: formErrors?.stockUnit
                            ? "1px solid red"
                            : "1px solid #cccccc",
                        }}
                        name="stockUnit"
                        required
                        type="select"
                        placeholder="stockUnit"
                        onChange={handleInputChange}
                        value={Data?.stockUnit}>
                        <option value="">--Select--</option>
                        {Unit_List?.map((ele) => (
                          <option value={ele?.value}>{ele?.title}</option>
                        ))}
                      </CustomInput>
                    </Col>

                    <Col className=" mt-1" lg="3" md="3">
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
                      <div
                        className="form-label-group"
                        onChange={changeHandler1}>
                        <input
                          style={{ marginRight: "3px" }}
                          type="radio"
                          name="status"
                          value="Active"
                        />
                        <span style={{ marginRight: "20px" }}>Active</span>

                        <input
                          style={{ marginRight: "3px" }}
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
                        <Row key={index} className="mt-1">
                          <Col className=" " lg="3" md="3">
                            <Label>Unit {index + 1}*</Label>

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
              </>
            )}
          </CardBody>
        </Card>

        <Modal
          isOpen={warehouseModal}
          toggle={handleWarehouse}
          backdrop="static">
          <ModalHeader toggle={handleWarehouse}>Create WareHouse</ModalHeader>
          <ModalBody>
            <Form className="m-1" onSubmit={handleWarehouseSave}>
              <Row>
                <Col lg="6" md="6" sm="12">
                  <FormGroup>
                    <Label>WareHouse Name</Label>
                    <Input
                      required
                      type="text"
                      placeholder="Enter Name"
                      name="warehouseName"
                      value={formData["warehouseName"]}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col lg="6" md="6" sm="12">
                  <FormGroup>
                    <Label>WareHouse Address</Label>
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
                <Col lg="6" md="6" sm="12" className="mt-2">
                  <FormGroup>
                    <Label>WareHouse Mobile </Label>
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
                <Col lg="6" md="6" sm="12">
                  <FormGroup>
                    <Label>WareHouse LandLine Number</Label>
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
                <Col lg="6" md="6" sm="6" className="">
                  <Button.Ripple
                    color="primary"
                    type="submit"
                    className="mr-1 mt-2 mx-2">
                    Submit
                  </Button.Ripple>
                </Col>
              </Row>
            </Form>
          </ModalBody>
        </Modal>
        <Modal isOpen={categoryModal} toggle={handleCategory} backdrop="static">
          <ModalHeader toggle={handleCategory}>Create Category</ModalHeader>
          <ModalBody>
            <Form className="m-1" onSubmit={handleCategorySave}>
              <Row>
                <Col lg="6" md="6" sm="12">
                  <FormGroup>
                    <Label>
                      Category Name <span className="mendatory">*</span>
                    </Label>
                    <Input
                      required
                      type="text"
                      placeholder="Category Name"
                      name="category_name"
                      value={formCatData["category_name"]}
                      onChange={handleInputCategoryChange}
                    />
                  </FormGroup>
                </Col>

                <Col lg="6" md="6" sm="12" className="">
                  <FormGroup>
                    <Label>
                      Description <span className="mendatory">*</span>
                    </Label>
                    <Input
                      required
                      type="textarea"
                      placeholder="typing"
                      name="description"
                      value={formCatData["description"]}
                      onChange={handleInputCategoryChange}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col lg="6" md="6" sm="6" className="mb-2 mt-1">
                  <Label className="mb-0">Status</Label>
                  <div
                    className="form-label-group"
                    onChange={(e) => {
                      setFormCatData({
                        ...formCatData,
                        ["status"]: e.target.value,
                      });
                    }}>
                    <input
                      checked={formCatData["status"] == "Active"}
                      style={{ marginRight: "3px" }}
                      type="radio"
                      name="status"
                      value="Active"
                    />
                    <span style={{ marginRight: "20px" }}>Active</span>
                    <input
                      checked={formCatData["status"] == "Deactive"}
                      style={{ marginRight: "3px" }}
                      type="radio"
                      name="status"
                      value="Deactive"
                    />
                    <span style={{ marginRight: "3px" }}>Deactive</span>
                  </div>
                </Col>
                <Col lg="6" md="6" sm="6" className="">
                  <Button.Ripple
                    color="primary"
                    type="submit"
                    className="mr-1 mt-2 mx-2">
                    Submit
                  </Button.Ripple>
                </Col>
              </Row>
            </Form>
          </ModalBody>
        </Modal>
        <Modal
          isOpen={subCategoryModal}
          toggle={handleSubCategory}
          backdrop="static">
          <ModalHeader toggle={handleSubCategory}>
            Create SubCategory
          </ModalHeader>
          <ModalBody>
            <Form className="m-1" onSubmit={handleSubCategorySave}>
              <Row className="mb-2">
                <Col lg="6" md="6" className="mb-2">
                  <Label>Category *</Label>
                  <CustomInput
                    required
                    type="select"
                    placeholder="Select Category"
                    name="category"
                    value={formSubCategory["category"]}
                    onChange={handleSubCategoryChange}>
                    <option>--Select Category--</option>
                    {categoryList?.map((cat) => (
                      <option value={cat?._id} key={cat?._id}>
                        {cat?.name}
                      </option>
                    ))}
                  </CustomInput>
                </Col>

                <Col lg="6" md="6">
                  <FormGroup>
                    <Label> Sub-Category Name</Label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="subcategory name "
                      name="subcategory_name"
                      value={formSubCategory["subcategory_name"]}
                      onChange={handleSubCategoryChange}
                    />
                  </FormGroup>
                </Col>
                <Col lg="6" md="6">
                  <FormGroup>
                    <Label> Sub-Category Description</Label>
                    <textarea
                      type="textarea"
                      className="form-control"
                      placeholder="Category Description"
                      name="Description"
                      value={formSubCategory["Description"]}
                      onChange={handleSubCategoryChange}
                    />
                  </FormGroup>
                </Col>

                <Col lg="6" md="6" sm="6" className="mb-2 mt-1">
                  <Label className="mb-0">Status</Label>
                  <div
                    className="form-label-group"
                    onChange={handleSubCategoryChange}>
                    <input
                      style={{ marginRight: "3px" }}
                      type="radio"
                      name="status"
                      value="Active"
                    />
                    <span style={{ marginRight: "20px" }}>Active</span>

                    <input
                      style={{ marginRight: "3px" }}
                      type="radio"
                      name="status"
                      value="Deactive"
                    />
                    <span style={{ marginRight: "3px" }}>Deactive</span>
                  </div>
                </Col>
              </Row>

              <Row>
                <Button.Ripple
                  color="primary"
                  type="submit"
                  className="mr-1 mb-1">
                  + Add
                </Button.Ripple>
              </Row>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    </div>
  );
};
export default AddRawProduct;
