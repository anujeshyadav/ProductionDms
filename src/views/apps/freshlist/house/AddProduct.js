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

const AddProduct = () => {
  const [categoryList, setcategoryList] = useState([]);
  const [wareHouseList, setWareHouseList] = useState([]);
  const [subcatlist, setsubcatlist] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [formCatData, setFormCatData] = useState({});
  const [formSubCategory, setformSubCategory] = useState({});
  const [Image, setImage] = useState([]);
  const [Data, setData] = useState({
    database: "",
    unitType: "",
    unitQty: "",
    category: "",
    SubCategory: "",
    warehouse: "",
    // Unit: "",
    Product_Title: "",
    Size: "",
    // discount: "",
    HSN_Code: "",
    GSTRate: "",
    // Product_Desc: "",
    Product_image: "",
    Product_MRP: "",
    MIN_stockalert: "",
    // gstPercentage: "",
    price: "",
    purchaseStatus: "",
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
    console.log(formSubCategory);
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
  const getWarehouseList = (userData) => {
    _Get(WareahouseList_For_addProduct, userData?.database)
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
  };
  const catogaryList = (userData) => {
    AllCategoryList(userData?._id, userData?.database)
      .then((res) => {
        if (res?.Category) {
          setcategoryList(res.Category);
        }
      })
      .catch((err) => {
        console.log(err);
      });
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
    if (!Data?.primaryUnit) {
      errors.primaryUnit = "Please select a primaryUnit";
    }
    if (!Data?.secondaryUnit) {
      errors.secondaryUnit = "Please select a secondaryUnit";
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
      let formdata = new FormData();
      let payload = {
        id: Data?.id,
        database: userData?.database,
        // ProfitPercentage: 0,

        // unitType: Data?.unitType,
        // unitQty: Number(Data?.unitQty),
        category: Data?.category,
        SubCategory: Data?.SubCategory,
        warehouse: Data?.warehouse,
        // Unit: Number(Data?.Unit),
        Product_Title: Data?.Product_Title,
        price: Number(Data?.Product_MRP),
        Product_MRP: Number(Data?.Product_MRP),
        igstType: Boolean(Data?.purchaseStatus),
        Size: Number(Data?.Size),
        HSN_Code: Data?.HSN_Code,
        GSTRate: Number(Data?.GSTRate),
        gstPercentage: Number(Data?.GSTRate),
        primaryUnit: Data?.primaryUnit,
        secondaryUnit: Data?.secondaryUnit,
        secondarySize: Data?.secondarySize,
        Opening_Stock: Number(Data?.Opening_Stock),
        Purchase_Rate: Number(Data?.Purchase_Rate),
        landedCost: Number(Data?.Purchase_Rate),
        // files: Image,
        MIN_stockalert: Number(Data?.MIN_stockalert),

        status: Data?.status,
        weight: Number(Data.weight),
        // discount: Number(Data?.discount),
        // Product_Desc: Data?.Product_Desc,
      };
      formdata.append("created_by", userData?._id);
      for (const key in payload) {
        if (payload.hasOwnProperty(key)) {
          formdata.append(key, payload[key]);
        }
      }

      if (Image?.length) {
        Image?.map((ele) => {
          formdata.append("files", ele);
        });
      }
      if (validate()) {
        SaveProduct(formdata)
          .then((res) => {
            if (res?.status) {
              setLoading(false);
              history.goBack();
              swal("Product Created Successfully");
            }
          })
          .catch((err) => {
            setLoading(false);
            console.log(err.response);
            // swal("Enter All Details");
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
    console.log(e.target.value);
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

  return (
    <div>
      <div>
        <Card>
          <CardBody className="p-1 pb-0">
            <Row>
              <Col lg="8" md="8" sm="8" className=""></Col>
              {!BulkUpload && !BulkUpload && (
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
              )}
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
                    <Col className="mt-1" lg="3" md="3">
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
                    </Col>
                    <Col className="mt-1" lg="3" md="3">
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
                    </Col>
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
                      <div className="">
                        <label for="unit">
                          Select Primary Unit{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <CustomInput
                          id="unitType"
                          className="form-control"
                          name="primaryUnit"
                          style={{
                            border: formErrors?.primaryUnit
                              ? "1px solid red"
                              : "1px solid #cccccc",
                          }}
                          type="select"
                          placeholder="selecetedUnit"
                          value={Data?.primaryUnit}
                          onChange={handleInputChange}>
                          <option value="">--Select Unit--</option>
                          <option value="Bag">BAGS(Bag)</option>
                          <option value="Btl">BOTTLES(Btl)</option>
                          <option value="Box">BOX(Box)</option>
                          <option value="Bdl">BUNDLES(Bdl)</option>
                          <option value="Can">CANS(Can)</option>
                          <option value="Ctn">CARTONS(Ctn)</option>
                          <option value="Dzn">DOZENS(Dzn)</option>
                          <option value="Gm">GRAMMES(Gm)</option>
                          <option value="Kg">KILOGRAMS(Kg)</option>
                          <option value="Ltr">LITRE(Ltr)</option>
                          <option value="Mtr">METERS(Mtr)</option>
                          <option value="Ml">MILILITRE(Ml)</option>
                          <option value="Nos">NUMBERS(Nos)</option>
                          <option value="Pac">PACKS(Pac)</option>
                          <option value="Prs">PAIRS(Prs)</option>
                          <option value="Pcs">PIECES(Pcs)</option>
                          <option value="Qtl">QUINTAL(Qtl)</option>
                          <option value="Rol">ROLLS(Rol)</option>
                          <option value="Sqf">SQUARE FEET(Sqf)</option>

                          <option data-order="kg" value="kg">
                            Kilogram(kg)
                          </option>
                          <option data-order="Pcs" value="Pcs">
                            Pieces(Pcs)
                          </option>
                          <option data-order="g" value="g">
                            Gram(g)
                          </option>
                          <option data-order="tonne" value="tonne">
                            Metric Ton(tonne)
                          </option>
                          <option data-order="m" value="m">
                            Meter(m)
                          </option>
                          <option data-order="cm" value="cm">
                            Centimeter(cm)
                          </option>
                          <option data-order="mm" value="mm">
                            Millimeter(mm)
                          </option>
                          <option data-order="in" value="in">
                            Inch(in)
                          </option>
                          <option data-order="ft" value="ft">
                            Foot(ft)
                          </option>
                          <option data-order="m3" value="m3">
                            Cubic Meter(m³)
                          </option>
                          <option data-order="L" value="L">
                            Liter(L)
                          </option>
                          <option data-order="ml" value="ml">
                            Milliliter(ml)
                          </option>
                          <option data-order="s" value="s">
                            Second(s)
                          </option>
                          <option data-order="min" value="min">
                            Minute(min)
                          </option>
                          <option data-order="hr" value="hr">
                            Hour(hr)
                          </option>
                          <option data-order="°C" value="°C">
                            Celsius(°C)
                          </option>
                          <option data-order="°F" value="°F">
                            Fahrenheit(°F)
                          </option>
                          <option data-order="Pa" value="Pa">
                            Pascal(Pa)
                          </option>
                          <option data-order="bar" value="bar">
                            Bar(bar)
                          </option>
                          <option data-order="m/s" value="m/s">
                            Meters per Second(m/s)
                          </option>
                          <option data-order="km/h" value="km/h">
                            Kilometers per Hour(km/h)
                          </option>
                          <option data-order="A" value="A">
                            Ampere(A)
                          </option>
                          <option data-order="V" value="V">
                            Volt(V)
                          </option>
                          <option data-order="W" value="W">
                            Watt(W)
                          </option>
                          <option data-order="kW" value="kW">
                            Kilowatt(kW)
                          </option>
                        </CustomInput>
                      </div>
                    </Col>
                    <Col className="mt-1" lg="3" md="3">
                      <div className="">
                        <label for="unit">
                          Select Seconday Unit{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <CustomInput
                          id="unitType"
                          className="form-control"
                          name="secondaryUnit"
                          type="select"
                          style={{
                            border: formErrors?.secondaryUnit
                              ? "1px solid red"
                              : "1px solid #cccccc",
                          }}
                          placeholder="selecetedUnit"
                          value={Data?.secondaryUnit}
                          onChange={handleInputChange}>
                          <option value="">--Select Unit--</option>
                          <option value="Bag">BAGS(Bag)</option>
                          <option value="Btl">BOTTLES(Btl)</option>
                          <option value="Box">BOX(Box)</option>
                          <option value="Bdl">BUNDLES(Bdl)</option>
                          <option value="Can">CANS(Can)</option>
                          <option value="Ctn">CARTONS(Ctn)</option>
                          <option value="Dzn">DOZENS(Dzn)</option>
                          <option value="Gm">GRAMMES(Gm)</option>
                          <option value="Kg">KILOGRAMS(Kg)</option>
                          <option value="Ltr">LITRE(Ltr)</option>
                          <option value="Mtr">METERS(Mtr)</option>
                          <option value="Ml">MILILITRE(Ml)</option>
                          <option value="Nos">NUMBERS(Nos)</option>
                          <option value="Pac">PACKS(Pac)</option>
                          <option value="Prs">PAIRS(Prs)</option>
                          <option value="Pcs">PIECES(Pcs)</option>
                          <option value="Qtl">QUINTAL(Qtl)</option>
                          <option value="Rol">ROLLS(Rol)</option>
                          <option value="Sqf">SQUARE FEET(Sqf)</option>

                          <option data-order="kg" value="kg">
                            Kilogram(kg)
                          </option>
                          <option data-order="Pcs" value="Pcs">
                            Pieces(Pcs)
                          </option>
                          <option data-order="g" value="g">
                            Gram(g)
                          </option>
                          <option data-order="tonne" value="tonne">
                            Metric Ton(tonne)
                          </option>
                          <option data-order="m" value="m">
                            Meter(m)
                          </option>
                          <option data-order="cm" value="cm">
                            Centimeter(cm)
                          </option>
                          <option data-order="mm" value="mm">
                            Millimeter(mm)
                          </option>
                          <option data-order="in" value="in">
                            Inch(in)
                          </option>
                          <option data-order="ft" value="ft">
                            Foot(ft)
                          </option>
                          <option data-order="m3" value="m3">
                            Cubic Meter(m³)
                          </option>
                          <option data-order="L" value="L">
                            Liter(L)
                          </option>
                          <option data-order="ml" value="ml">
                            Milliliter(ml)
                          </option>
                          <option data-order="s" value="s">
                            Second(s)
                          </option>
                          <option data-order="min" value="min">
                            Minute(min)
                          </option>
                          <option data-order="hr" value="hr">
                            Hour(hr)
                          </option>
                          <option data-order="°C" value="°C">
                            Celsius(°C)
                          </option>
                          <option data-order="°F" value="°F">
                            Fahrenheit(°F)
                          </option>
                          <option data-order="Pa" value="Pa">
                            Pascal(Pa)
                          </option>
                          <option data-order="bar" value="bar">
                            Bar(bar)
                          </option>
                          <option data-order="m/s" value="m/s">
                            Meters per Second(m/s)
                          </option>
                          <option data-order="km/h" value="km/h">
                            Kilometers per Hour(km/h)
                          </option>
                          <option data-order="A" value="A">
                            Ampere(A)
                          </option>
                          <option data-order="V" value="V">
                            Volt(V)
                          </option>
                          <option data-order="W" value="W">
                            Watt(W)
                          </option>
                          <option data-order="kW" value="kW">
                            Kilowatt(kW)
                          </option>
                        </CustomInput>
                      </div>
                    </Col>
                    {!!Data?.secondaryUnit && (
                      <Col className="mt-1" lg="3" md="3">
                        <Label>
                          Secondary Qty <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Input
                          required
                          id="Product_MRP"
                          min={1}
                          type="number"
                          name="secondarySize"
                          placeholder="secondary QTY"
                          value={Data?.secondarySize}
                          onChange={handleInputChange}
                        />
                      </Col>
                    )}

                    {/* <Col className="mb-1 mt-1" lg="3" md="3">
                    <Label>Product Desc *</Label>
                    <Input
                      required
                      id="Product_Desc"
                      type="text"
                      name="Product_Desc"
                      placeholder="Product Product Desc"
                      value={Data.Product_Desc}
                      onChange={handleInputChange}
                    />
                  </Col> */}
                    <Col className=" mt-1" lg="3" md="3">
                      <Label>
                        {" "}
                        Weight<span style={{ color: "red" }}>*</span>
                      </Label>
                      <Input
                        required
                        id="Opening_Stock"
                        type="text"
                        name="weight"
                        placeholder="weight"
                        value={Data.weight}
                        onChange={handleInputChange}
                      />
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
                    <Col className="mb-1 mt-1" lg="3" md="3">
                      <Label className="mb-1">Product Image </Label>
                      <div className="d-flex file-upload">
                        <FaUpload className="mr-1" color="green" size={30} />

                        <input
                          type="file"
                          name="images"
                          onChange={handleFileChange}
                        />
                        <FaUpload className="mx-1" color="green" size={30} />

                        <input
                          type="file"
                          name="images"
                          onChange={handleFileChange}
                        />
                        <FaUpload className="mx-1" color="green" size={30} />
                        <input
                          type="file"
                          name="images"
                          onChange={handleFileChange}
                        />

                        <FaUpload className="mx-1" color="green" size={30} />

                        <input
                          type="file"
                          name="images"
                          onChange={handleFileChange}
                        />
                        <FaUpload className="mx-1" color="green" size={30} />

                        <input
                          type="file"
                          name="images"
                          onChange={handleFileChange}
                        />
                      </div>
                    </Col>
                    <Col className="mt-1" lg="3" md="3">
                      <Label>
                        {" "}
                        Purchase Rate(Basic Rate){" "}
                        <span style={{ color: "red" }}>*</span>
                      </Label>
                      <Input
                        required
                        type="number"
                        id="Purchase_Rate"
                        name="Purchase_Rate"
                        placeholder="PurchaseRate"
                        value={Data.Purchase_Rate}
                        onChange={(e) => {
                          let value = e.target.value;
                          // let mrp =
                          //   Number(value) *
                          //   1.02 *
                          //   Number(
                          //     ((100 + Number(Data?.GSTRate)) / 100).toFixed(2)
                          //   );

                          setData({
                            ...Data,
                            ["Purchase_Rate"]: value,
                            // ["saleRate"]: value*1.03,
                            // ["Product_MRP"]: Number(mrp?.toFixed(2)),
                          });
                        }}
                        // onChange={handleInputChange}
                      />
                    </Col>
                    {/* <Col className="mt-1" lg="3" md="3">
                      <Label>
                        Product MRP <span style={{ color: "red" }}>*</span>
                      </Label>
                      <Input
                        readOnly
                        id="Product_MRP"
                        type="number"
                        // min={Data.Purchase_Rate * 1.05}
                        name="Product_MRP"
                        placeholder="Product MRP"
                        value={Data.Product_MRP}
                        onChange={(e) => {
                          let value = e.target.value;

                          if (Data?.Purchase_Rate !== undefined) {
                            if (value <= Data?.Purchase_Rate) {
                              setData({
                                ...Data,
                                ["Product_MRP"]: value,
                              });
                            } else {
                              let mrp = Data?.Purchase_Rate * 1.05;
                              if (value >= mrp) {
                                setData({
                                  ...Data,
                                  ["Product_MRP"]: value,
                                });
                              }
                            }
                          } else {
                            swal("error", "Enter Purchase Rate", "error");
                          }
                        }}
                        // onChange={handleInputChange}
                      />
                    </Col> */}
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
                    {!Loading && !Loading ? (
                      <>
                        <Col className="" lg="3" md="3" sm="6">
                          <div className="d-flex justify-content-end">
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
                        <Col className="" lg="3" md="3" sm="6">
                          <div className="d-flex justify-content-end">
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
                  <Row>
                    {/* {imageUri &&
                      imageUri?.map((ele, i) => {
                        return (
                          <>
                            <Col key={i} lg="2" md="2" sm="4">
                              <span
                                onClick={() => {
                                  let uri = [...imageUri];
                                  let Images = [...Image];
                                  uri.splice(i, 1);
                                  Images.splice(i, 1);
                                  setImageUris(uri);
                                  setImage(Images);
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
                                style={{ borderRadius: "12px" }}
                                src={ele}
                                className="p-2"
                                height={100}
                                width="95%"
                                alt="image"
                              />
                            </Col>
                          </>
                        );
                      })} */}
                    {/* {formImage?.imageuri && (
                      <Col lg="6" md="6" sm="12">
                        <img
                          style={{ borderRadius: "8px" }}
                          src={formImage?.imageuri}
                          height={100}
                          width={120}
                          alt="image"
                        />
                      </Col>
                    )} */}
                    {formImages &&
                      formImages?.map((ele, i) => {
                        {
                          console.log("Images", ele);
                        }
                        return (
                          <Col key={i} lg="2" md="2" sm="4">
                            <span onClick={() => handleRemoveImage(i)}>
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
                              key={i}
                              style={{ borderRadius: "12px" }}
                              src={ele}
                              height={100}
                              width="95%"
                              alt={`Uploaded Preview ${i + 1}`}
                            />
                          </Col>
                        );
                      })}
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
export default AddProduct;
