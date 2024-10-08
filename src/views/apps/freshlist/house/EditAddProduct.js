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
  UnitListView,
  _Get,
  _Put,
} from "../../../../ApiEndPoint/ApiCalling";
import "../../../../assets/scss/pages/users.scss";
import UserContext from "../../../../context/Context";
import {
  Image_URL,
  Update_Product,
  ViewOne_Product,
  WareahouseList_For_addProduct,
} from "../../../../ApiEndPoint/Api";
import { MdCancel } from "react-icons/md";

const EditAddProduct = () => {
  const history = useHistory();
  const [categoryList, setcategoryList] = useState([]);
  const [UnitList, setUnitList] = useState([]);
  const [wareHouseList, setWareHouseList] = useState([]);
  const [formImages, setFormImages] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [imageUri, setImageUris] = useState([]);
  const [Image, setImage] = useState([]);
  const [subcatlist, setsubcatlist] = useState([]);
  const [Data, setData] = useState({
    database: "",
    unitType: "",
    unitQty: "",
    category: "",
    SubCategory: "",
    warehouse: "",
    Unit: "",
    Product_Title: "",
    Size: "",
    discount: "",
    HSN_Code: "",
    GSTRate: "",
    Product_Desc: "",
    Product_image: "",
    Product_MRP: "",
    MIN_stockalert: "",
    status: "",
  });

  const Context = useContext(UserContext);
  const Params = useParams();
  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    if (name == "Unit") {
      let values = document.getElementById("unitType").value;
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

    _Get(ViewOne_Product, Params?.id)
      .then((res) => {
    
        setData(res?.Product);

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

  // const handleFileChange = (e) => {
  //   // const { name } = e.target;
  //   let images = Array.from(e.target.files);
  //   setImage(images);
  //   const fiels = e.target.files;
  //   for (let i = 0; i < fiels.length; i++) {
  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //       setImageUris((prevUris) => [...prevUris, event.target.result]);
  //     };
  //     reader.readAsDataURL(fiels[i]);
  //   }
  // };

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
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    let formdata = new FormData();
    let userData = JSON.parse(localStorage.getItem("userData"));
    let payload = {
      database: userData?.database,

      category: Data?.category,
      SubCategory: Data?.SubCategory,
      warehouse: Data?.warehouse,
      Product_Title: Data?.Product_Title,
      Product_MRP: Number(Data?.Product_MRP),
      igstType: Boolean(Data?.purchaseStatus),
      price: Number(Data?.Product_MRP),

      HSN_Code: Data?.HSN_Code,
      GSTRate: Number(Data?.GSTRate),
      Product_Desc: Data?.Product_Desc,
      gstPercentage: Number(Data?.GSTRate),
      primaryUnit: Data?.primaryUnit,
      secondaryUnit: Data?.secondaryUnit,
      secondarySize: Data?.secondarySize,
      Opening_Stock: Number(Data?.Opening_Stock),
      Purchase_Rate: Number(Data?.Purchase_Rate),
      MIN_stockalert: Number(Data?.MIN_stockalert),
      weight: Number(Data.weight),

      status: Data?.status,
    };
    formdata.append("created_by", userData?._id);
    for (const key in payload) {
      if (payload.hasOwnProperty(key)) {
        formdata.append(key, payload[key]);
      }
    }
    if (Image?.length) {
      // formdata.append("files", ele);
      // debugger;
      Image?.map((ele) => {
        formdata.append("files", ele);
      });
    }
    // for (let pair of formdata.entries()) {
    //   console.log(pair[0] + ": " + pair[1]);
    // }
    // for (const value of formdata.values()) {
    //   console.log(value);
    // }
    await _Put(Update_Product, Params?.id, formdata)
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

  return (
    <div>
      <div>
        <Card>
          {/* <hr /> */}

          <CardBody className="p-1 pb-0">
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
                {/* <Col className="" lg="3" md="3">
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
                {/* <Col className="mb-1" lg="3" md="3">
                  <div className="">
                    <label for="unit">Select Unit</label>
                    <select
                      id="unitType"
                      className="form-control"
                      name="Unit"
                      placeholder="selecetedUnit"
                      value={Data.Unit}
                      onChange={handleInputChange}>
                      <option value="">--select Unit--</option>
                      {UnitList?.length > 0 &&
                        UnitList?.map((cat) => (
                          <option
                            data-order={cat.primaryUnit}
                            value={cat?.unitQty}
                            key={cat?._id}>
                            {cat?.primaryUnit}
                          </option>
                        ))}

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
                    </select>
                  </div>
                </Col> */}

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
                <Col className="mb-1" lg="3" md="3">
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
                <Col className="mb-1" lg="3" md="3">
                  <Label>
                    GST Percentage <span style={{ color: "red" }}>*</span>
                  </Label>
                  <Input
                    required
                    id="GSTRate"
                    type="text"
                    name="GSTRate"
                    placeholder="Product GSTRate"
                    value={Data.GSTRate}
                    onChange={handleInputChange}
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
                <Col className="mb-1" lg="3" md="3">
                  <div className="">
                    <label for="unit">
                      Select Primary Unit{" "}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <CustomInput
                      id="unitType"
                      className="form-control"
                      name="primaryUnit"
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
                <Col className="mb-1" lg="3" md="3">
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
                  <Col className="mb-1" lg="3" md="3">
                    <Label>
                      Secondary Qty <span style={{ color: "red" }}>*</span>
                    </Label>
                    <Input
                      required
                      id="Product_MRP"
                      type="number"
                      name="secondarySize"
                      placeholder="secondary QTY"
                      value={Data?.secondarySize}
                      onChange={handleInputChange}
                    />
                  </Col>
                )}
                <Col className="mb-1" lg="3" md="3">
                  <Label>Product Desc </Label>
                  <Input
                    id="Product_Desc"
                    type="text"
                    name="Product_Desc"
                    placeholder="Product Product Desc"
                    value={
                      Data.Product_Desc == "undefined" ? "" : Data.Product_Desc
                    }
                    onChange={handleInputChange}
                  />
                </Col>

                {/* <Col className="mb-1" lg="3" md="3">
                  <Label>Product Min stock *</Label>
                  <Input
                    required
                    id="MIN_stockalert"
                    type="number"
                    name="MIN_stockalert"
                    placeholder="Product Min stock alert"
                    value={Data.MIN_stockalert}
                    onChange={handleInputChange}
                  />
                </Col> */}
                <Col lg="3" md="3">
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
                <Col className="" lg="3" md="3">
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
                <Col className="" lg="3" md="3">
                  <Label>
                    {" "}
                    Purchase Rate(Basic Rate){" "}
                    <span style={{ color: "red" }}>*</span>
                  </Label>
                  <Input
                    required
                    type="number"
                    id="Purchase_Rate"
                    step="0.01"
                    name="Purchase_Rate"
                    placeholder="PurchaseRate"
                    value={Data.Purchase_Rate}
                    onChange={(e) => {
                      let value = e.target.value;
                      setData({
                        ...Data,
                        ["Purchase_Rate"]: +value,
                      });
                    }}
                    // onChange={handleInputChange}
                  />
                </Col>
                <Col className="mb-1" lg="3" md="3">
                  <Label>
                    Product MRP <span style={{ color: "red" }}>*</span>
                  </Label>
                  {Data.landedCost ? (
                    <Input
                      readOnly
                      id="Product_MRP"
                      type="text"
                      name="Product_MRP"
                      placeholder="Product MRP"
                      value={
                        Data?.Product_MRP > 0 && Data.Product_MRP?.toFixed(2)
                      }
                      // onChange={(e) => {
                      //   let value = e.target.value;
                      // }}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <Input
                      readOnly
                      id="Product_MRP"
                      type="text"
                      // min={Data.Purchase_Rate * 1.05}
                      name="Product_MRP"
                      placeholder="Product MRP"
                      value={Data.Product_MRP}
                      onChange={handleInputChange}
                    />
                  )}
                </Col>
                <Col className="mb-1" lg="3" md="3">
                  <Label>
                    Landed Price (Basic Rate){" "}
                    <span style={{ color: "red" }}>*</span>
                  </Label>
                  <Input
                    readOnly
                    id="Product_MRP"
                    type="number"
                    name="landedCost"
                    placeholder="Product landed Cost"
                    value={Data.landedCost}
                    onChange={handleInputChange}
                  />
                </Col>
                {/* <Col className="mt-1" lg="3" md="3">
                  <Label>Product Image *</Label>
                  <Input
                    multiple
                    // id="MIN_stockalert"
                    type="file"
                    className="form-control"
                    // name="Product_image"
                    placeholder="Product Min stock alert"
                    onChange={handleFileChange}
                  />
                </Col>
                {imageUri &&
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
                {!!Data?.Product_image?.length > 0 &&
                  Data?.Product_image?.map((ele, i) => {
                    console.log(ele);
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
                            style={{ borderRadius: "12px" }}
                            src={`${Image_URL}/Images/${ele}`}
                            className="p-2"
                            height={100}
                            width="95%"
                            alt="image"
                          />
                        </Col>
                      </>
                    );
                  })}
                <Col lg="3" md="3" sm="6" className="">
                  <Label className="mb-0">Status</Label>
                  <div className="form-label-group" onChange={changeHandler1}>
                    <input
                      checked={Data["status"] == "Active"}
                      style={{ marginRight: "3px" }}
                      type="radio"
                      name="status"
                      value="Active"
                    />
                    <span style={{ marginRight: "20px" }}>Active</span>

                    <input
                      style={{ marginRight: "3px" }}
                      checked={Data["status"] == "Deactive"}
                      type="radio"
                      name="status"
                      value="Deactive"
                    />
                    <span style={{ marginRight: "3px" }}>Deactive</span>
                  </div>
                </Col>
                <Col lg="3" md="3" sm="6" className="">
                  <Button
                    disabled={!Loading ? false : true}
                    color="primary"
                    type="submit"
                    className="mr-1">
                    {!Loading ? "Submit" : "Submitting..."}
                  </Button>
                </Col>
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
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
export default EditAddProduct;
