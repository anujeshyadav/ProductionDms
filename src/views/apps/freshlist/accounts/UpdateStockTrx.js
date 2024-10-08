import React, { useEffect, useState, useContext } from "react";
import { CardBody, Col, Form, Row, Input, Label, Button } from "reactstrap";

import "react-phone-input-2/lib/style.css";

import Multiselect from "multiselect-react-dropdown";

import "../../../../assets/scss/pages/users.scss";
import {
  ProductListView,
  CreateWarehouseList,
  UnitListView,
  StocktrxFtoW,
  WarehousetoWareHouseTrx,
} from "../../../../ApiEndPoint/ApiCalling";
import "../../../../assets/scss/pages/users.scss";

import { useHistory } from "react-router-dom";

let GrandTotal = [];
let SelectedITems = [];
let SelectedSize = [];
const UpdateStockTrx = ({ args, ViewOne }) => {
  console.log(ViewOne);
  const [formData, setFormData] = useState({});
  const [Index, setIndex] = useState("");
  const [StockTrxdate, setStockTrxDate] = useState("");
  const [targetEndDate, settargetEndDate] = useState("");
  const [index, setindex] = useState("");
  const [error, setError] = useState("");
  const [ProductList, setProductList] = useState([]);
  const [PartyList, setPartyList] = useState([]);
  const [Salesperson, setSalesperson] = useState("");
  const [WareHouseone, setWareHouseone] = useState([]);
  const [WareHousetwo, setWareHousetwo] = useState([]);
  const [TypeOfTrx, setTypeOfTrx] = useState("Factorytowarehourse");
  const [grandTotalAmt, setGrandTotalAmt] = useState(0);
  const [UnitList, setUnitList] = useState([]);
  const [UserInfo, setUserInfo] = useState({});
  const [modal, setModal] = useState(false);
  const [items, setItems] = useState("");
  const [audit, setAudit] = useState(false);
  const [WareHouselist, setWarehouseList] = useState([]);

  const history = useHistory();
  const toggle = (item) => {
    setItems(item);
    setModal(!modal);
  };
  useEffect(() => {
    console.log(ViewOne);
    setGrandTotalAmt(ViewOne?.grandTotal);
    // setWareHouseone(ViewOne?.grandTotal);
    setStockTrxDate(ViewOne?.stockTransferDate);
    setProduct(ViewOne?.productItems);
  }, []);

  const audittoggle = () => {
    setAudit(!audit);
    // setModal(!modal);
  };
  const handleopentoggle = (iteam) => {
    toggle(iteam);
  };
  const handleHistory = () => {
    audittoggle();
  };
  const [product, setProduct] = useState([
    {
      product: "",
      productId: "",
      availableQty: "",
      transferQty: 1,
      price: "",
      totalprice: "",
      Size: "",
      unitType: "",
      stockTrxDate: "",
      targetEndDate: "",
      discount: "",
      Shipping: "",
      tax: "",
      grandTotal: "",
    },
  ]);

  const handleProductChangeProduct = (e, index) => {
    // product.price * product?.qty
    setIndex(index);
    console.log(product);
    const { name, value } = e.target;
    const list = [...product];
    list[index][name] = Number(value);
    console.log(GrandTotal);

    let amt = 0;
    if (list.length > 0) {
      const x = list?.map((val) => {
        console.log(val.qty * val.price);
        GrandTotal[index] = val.Size * val.price * val.transferQty;

        list[index]["totalprice"] = val.Size * val.price * val.transferQty;
        return val.Size * val.price * val.transferQty;
      });
      amt = x.reduce((a, b) => a + b);
      console.log("GrandTotal", amt);
    }
    // console.log(list)
    setProduct(list);
    setGrandTotalAmt(amt);
    // setAmount(amt);
  };

  const handleRemoveSelected = (selectedList, selectedItem, index) => {
    // console.log(selectedList);
    // console.log(selectedItem); // removed item
    // console.log(product);
    // console.log(index);
    // console.log(SelectedITems);
    SelectedITems.splice(index, 1);
    let myarr = product?.map((ele, i) => {
      console.log(ele?.qty * selectedItem[i]?.Product_MRP);
      let indextotal = ele?.qty * SelectedITems[i]?.Product_MRP;
      GrandTotal[index] = indextotal;
      return indextotal;
    });

    let amt = myarr.reduce((a, b) => a + b);
    setGrandTotalAmt(amt);
  };
  const handleRemoveSelectedone = (selectedList, selectedItem, index) => {
    // console.log(selectedList);
    // console.log(selectedItem); // removed item
    // console.log(product);
    // console.log(index);
    // console.log(SelectedITems);
    SelectedSize.splice(index, 1);
    let myarr = product?.map((ele, i) => {
      console.log(ele?.Size * ele?.price * SelectedSize[i]?.unitQty);
      let indextotal = ele?.Size * SelectedSize[i]?.unitQty;
      GrandTotal[index] = indextotal;
      return indextotal;
    });

    let amt = myarr.reduce((a, b) => a + b);
    setGrandTotalAmt(amt);
  };
  const handleSelection = (selectedList, selectedItem, index) => {
    SelectedITems.push(selectedItem);
    setProduct((prevProductList) => {
      const updatedProductList = [...prevProductList]; // Create a copy of the productList array
      const updatedProduct = { ...updatedProductList[index] }; // Create a copy of the product at the specified index
      updatedProduct.price = selectedItem?.Product_MRP; // Update the price of the copied product
      updatedProduct.productId = selectedItem?._id;
      updatedProductList[index] = updatedProduct; // Replace the product at the specified index with the updated one

      // let myarr = prevProductList?.map((ele, i) => {
      //   console.log(ele?.transferQty * selectedItem[i]?.Product_MRP);
      //   let indextotal = ele?.transferQty * SelectedITems[i]?.Product_MRP;
      //   GrandTotal[index] = indextotal;
      //   return indextotal;
      // });
      // let amt = myarr.reduce((a, b) => a + b);
      // setGrandTotalAmt(amt);
      return updatedProductList; // Return the updated product list to set the state
    });
    // onSelect1(selectedList, selectedItem, index);
  };
  const handleSelectionone = (selectedList, selectedItem, index) => {
    SelectedSize.push(selectedItem);

    setProduct((prevProductList) => {
      const updatedProductList = [...prevProductList]; // Create a copy of the productList array
      const updatedProduct = { ...updatedProductList[index] }; // Create a copy of the product at the specified index
      updatedProduct.Size = selectedItem?.unitQty; // Update the price of the copied product
      updatedProduct.unitType = selectedItem?.primaryUnit;
      updatedProductList[index] = updatedProduct; // Replace the product at the specified index with the updated one
      let myarr = prevProductList?.map((ele, i) => {
        console.log(ele?.transferQty * ele?.price * SelectedSize[i]?.unitQty);
        let indextotal =
          ele?.transferQty * ele?.price * SelectedSize[i]?.unitQty;
        GrandTotal[index] = indextotal;
        return indextotal;
      });
      let amt = myarr.reduce((a, b) => a + b);
      setGrandTotalAmt(amt);
      return updatedProductList; // Return the updated product list to set the state
    });
    // onSelect1(selectedList, selectedItem, index);
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
  // handleInputChange;
  useEffect(() => {
    console.log(window);
    console.log(product);
    console.log(GrandTotal);
    console.log(Salesperson);
    console.log(StockTrxdate);
    console.log(targetEndDate);
  }, [product, targetEndDate]);

  useEffect(() => {
    let userData = JSON.parse(localStorage.getItem("userData"));
    CreateWarehouseList(userData._id)
      .then((res) => {
        console.log(res?.Warehouse);
        setWarehouseList(res?.Warehouse);
      })
      .catch((err) => {
        console.log(err);
      });
    UnitListView(userData?._id, userData?.database)
      .then((res) => {
        console.log(res?.Unit);
        setUnitList(res?.Unit);
      })
      .catch((err) => {
        console.log(err);
      });
    let userdata = JSON.parse(localStorage.getItem("userData"));

    ProductListView(userdata?._id, userdata?.database)
      .then((res) => {
        console.log(res.Product);
        setProductList(res?.Product);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userData"));
    console.log(userInfo);
    setUserInfo(userInfo);
  }, []);

  let addMoreProduct = () => {
    setProduct([
      ...product,
      {
        product: "", //
        productId: "",
        availableQty: "",
        transferQty: 1, //
        price: "", //
        totalprice: "", //
        Size: "",
        unitType: "",
        stockTrxDate: "",
        targetEndDate: "",
        discount: "",
        Shipping: "",
        tax: "",
        grandTotal: "",
      },
    ]);
  };
  let removeMoreProduct = (i) => {
    let newFormValues = [...product];
    newFormValues.splice(i, 1);
    GrandTotal.splice(i, 1);
    let amt = GrandTotal.reduce((a, b) => a + b);
    setGrandTotalAmt(amt);

    setProduct(newFormValues);
  };
  // let handlePartChange = (i, e) => {
  //   let newFormValues = [...part];
  //   newFormValues[i][e.target.name] = e.target.value;
  //   setPart(newFormValues);
  // };

  const WareHousetoWareHouse = (e) => {
    e.preventDefault();

    let userdata = JSON.parse(localStorage.getItem("userData"));
    let Allproduct = product?.map((ele, i) => {
      console.log(ele);
      return {
        productId: ele?.productId,
        unitType: ele?.unitType,
        price: ele?.price,
        Size: ele?.Size,
        transferQty: ele?.transferQty,
        totalPrice: ele?.totalprice,
      };
    });
    let payload = {
      productItems: Allproduct,
      warehouseToId: WareHouseone[0]?._id,
      warehouseFromId: WareHousetwo[0]?._id,
      stockTransferDate: StockTrxdate,
      grandTotal: grandTotalAmt,
      status: "InProcess",
      created_by: userdata?._id,
    };
    console.log(payload);
    WarehousetoWareHouseTrx(payload)
      .then((res) => {
        //   window.location.reload();
        history.goBack();
        swal("Stock transerffered is Initiated");

        console.log(res);
      })
      .catch((err) => {
        console.log(err);
        swal("Something Went Wrong");
      });
  };
  const submitHandler = (e) => {
    e.preventDefault();
    let userdata = JSON.parse(localStorage.getItem("userData"));

    let Allproduct = product?.map((ele, i) => {
      console.log(ele);
      return {
        productId: ele?.productId,
        unitType: ele?.unitType,
        price: ele?.price,
        Size: ele?.Size,
        transferQty: ele?.transferQty,
        totalPrice: ele?.totalprice,
      };
    });
    let payload = {
      productItems: Allproduct,
      warehouseToId: WareHouseone[0]?._id,
      stockTransferDate: StockTrxdate,
      grandTotal: grandTotalAmt,
      status: "Transferring",
      created_by: userdata?._id,
    };
    console.log(payload);

    if (error) {
      swal("Error occured while Entering Details");
    } else {
      StocktrxFtoW(payload)
        .then((res) => {
          //   window.location.reload();
          history.goBack();
          swal("Stock Assigned to WareHouse");

          // }
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const onSelect1 = (selectedList, selectedItem, index) => {
    console.log(selectedList);
    setWareHouseone(selectedList);
  };
  const onRemove1 = (selectedList, removedItem, index) => {
    console.log(selectedList);
    console.log(index);
  };
  const onSelect2 = (selectedList, selectedItem, index) => {
    console.log(selectedList);
    setWareHousetwo(selectedList);
  };
  const onRemove2 = (selectedList, removedItem, index) => {
    console.log(selectedList);
    console.log(index);
  };
  return (
    <div>
      <Row className="m-2">
        <Col lg="8" md="8" sm="8" className="mb-2 mt-1">
          <div>
            <h1 className="">Update Stock Transfer</h1>
            {/* <div className="choose">
              <h4 className="mb-1">Choose Type of Stock trx</h4>
              <div
                className="form-label-group"
                onChange={(e) => setTypeOfTrx(e.target.value)}
                // onChange={(e) => {
                //   setFormData({
                //     ...formData,
                //     ["status"]: e.target.value,
                //   });
                // }}
              >
                <input
                  required
                  style={{ marginRight: "3px" }}
                  type="radio"
                  name="status"
                  value="Warehousetowarehouse"
                />
                <span style={{ marginRight: "20px" }}>
                  Warehouse to Warehouse
                </span>

                <input
                  required
                  style={{ marginRight: "3px" }}
                  type="radio"
                  name="status"
                  value="Factorytowarehourse"
                />
                <span style={{ marginRight: "3px" }}>
                  Factory to Warehourse
                </span>
              </div>
            </div> */}
          </div>
        </Col>
      </Row>
      <CardBody>
        {TypeOfTrx && TypeOfTrx == "Warehousetowarehouse" && (
          <Form className="mx-1" onSubmit={WareHousetoWareHouse}>
            <Row>
              <Col className="mb-1" lg="3" md="3" sm="12">
                <div className="">
                  <Label>Choose Warehouse(from where) *</Label>
                  <Multiselect
                    required
                    selectionLimit={1}
                    // showCheckbox="true"
                    isObject="false"
                    options={WareHouselist} // Options to display in the dropdown
                    // selectedValues={selectedValue}   // Preselected value to persist in dropdown
                    onSelect={onSelect1} // Function will trigger on select event
                    onRemove={onRemove1} // Function will trigger on remove event
                    displayValue="WarehouseName" // Property name to display in the dropdown options
                  />
                </div>
              </Col>
              <Col className="mb-1" lg="3" md="3" sm="12">
                <div className="">
                  <Label>Choose Warehouse (to be Transfer) * </Label>

                  <Multiselect
                    required
                    selectionLimit={1}
                    // showCheckbox="true"
                    isObject="false"
                    options={WareHouselist} // Options to display in the dropdown
                    // selectedValues={selectedValue}   // Preselected value to persist in dropdown
                    onSelect={onSelect2} // Function will trigger on select event
                    onRemove={onRemove2} // Function will trigger on remove event
                    displayValue="WarehouseName" // Property name to display in the dropdown options
                  />
                </div>
              </Col>
              <Col className="mb-1" lg="2" md="2" sm="12">
                <div className="">
                  <Label>Stock Transfer date</Label>
                  <Input
                    required
                    type="date"
                    name="targetEndDate"
                    placeholder="Date of Delivery"
                    value={StockTrxdate}
                    onChange={(e) => setStockTrxDate(e.target.value)}
                  />
                </div>
              </Col>
            </Row>
            {product &&
              product?.map((product, index) => (
                <Row className="" key={index}>
                  <Col className="mb-1" lg="2" md="2" sm="12">
                    <div className="">
                      <Label>Product Name</Label>
                      <Multiselect
                        required
                        selectionLimit={1}
                        // showCheckbox="true"
                        isObject="false"
                        options={ProductList}
                        // selectedValues={selectedValue}   // Preselected value to persist in dropdown
                        onSelect={(selectedList, selectedItem) =>
                          handleSelection(selectedList, selectedItem, index)
                        }
                        onRemove={(selectedList, selectedItem) => {
                          handleRemoveSelected(
                            selectedList,
                            selectedItem,
                            index
                          );
                        }}
                        displayValue="Product_Title" // Property name to display in the dropdown options
                      />
                    </div>
                  </Col>
                  <Col className="mb-1" lg="2" md="2" sm="12">
                    <div className="">
                      <Label>Size</Label>
                      <Multiselect
                        required
                        selectionLimit={1}
                        // showCheckbox="true"
                        isObject="false"
                        options={UnitList}
                        // selectedValues={selectedValue}   // Preselected value to persist in dropdown
                        onSelect={(selectedList, selectedItem) =>
                          handleSelectionone(selectedList, selectedItem, index)
                        }
                        onRemove={(selectedList, selectedItem) => {
                          handleRemoveSelectedone(
                            selectedList,
                            selectedItem,
                            index
                          );
                        }}
                        displayValue="primaryUnit" // Property name to display in the dropdown options
                      />
                    </div>
                  </Col>
                  <Col className="mb-1" lg="2" md="2" sm="12">
                    <div className="">
                      <Label>Quantity To be Transfer</Label>
                      <Input
                        type="number"
                        name="transferQty"
                        min={0}
                        placeholder="Req_Qty"
                        value={product?.qty}
                        onChange={(e) => handleProductChangeProduct(e, index)}
                      />
                    </div>
                  </Col>
                  <Col className="mb-1" lg="2" md="2" sm="12">
                    <div className="">
                      <Label>Price</Label>
                      <Input
                        type="number"
                        name="price"
                        readOnly
                        placeholder="Price"
                        value={product.price}
                      />
                    </div>
                  </Col>
                  <Col className="mb-1" lg="4" md="4" sm="12">
                    <div className="">
                      <Label>Total Price</Label>
                      <Input
                        type="number"
                        name="totalprice"
                        readOnly
                        placeholder="TtlPrice"
                        value={
                          product.Size * product.price * product.transferQty
                        }
                      />
                    </div>
                  </Col>

                  <Col className="d-flex mt-1 abb" lg="4" md="4" sm="12">
                    <div className="btnStyle">
                      {index ? (
                        <Badge
                          type="button"
                          color="danger"
                          className="button remove "
                          onClick={() => removeMoreProduct(index)}>
                          - Remove
                        </Badge>
                      ) : null}
                    </div>

                    <div className="btnStyle">
                      <Badge
                        className="ml-1 mb-1"
                        color="primary"
                        type="button"
                        onClick={() => addMoreProduct()}>
                        + Add
                      </Badge>
                    </div>
                  </Col>
                </Row>
              ))}

            <Row>
              <Col className="mb-1" lg="12" md="12" sm="12">
                <div className=" d-flex justify-content-end">
                  <Label className="pr-5">
                    Grand Total :{" "}
                    <stron>
                      {grandTotalAmt && grandTotalAmt == "NaN"
                        ? 0
                        : grandTotalAmt}{" "}
                    </stron>
                  </Label>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="d-flex justify-content-center">
                  <Button.Ripple color="primary" type="submit" className="mt-2">
                    Submit
                  </Button.Ripple>
                </div>
              </Col>
            </Row>
          </Form>
        )}
        {TypeOfTrx && TypeOfTrx == "Factorytowarehourse" && (
          <Form className="m-1" onSubmit={submitHandler}>
            <Row>
              <Col className="mb-1" lg="4" md="4" sm="12">
                <div className="">
                  <Label>Choose Warehouse </Label>

                  <Multiselect
                    required
                    selectionLimit={1}
                    // showCheckbox="true"
                    isObject="false"
                    options={WareHouselist} // Options to display in the dropdown
                    // selectedValues={selectedValue}   // Preselected value to persist in dropdown
                    onSelect={onSelect1} // Function will trigger on select event
                    onRemove={onRemove1} // Function will trigger on remove event
                    displayValue="WarehouseName" // Property name to display in the dropdown options
                  />
                </div>
              </Col>

              <Col className="mb-1" lg="4" md="4" sm="12">
                <div className="">
                  <Label>Stock Transfer date</Label>
                  <Input
                    required
                    type="date"
                    name="targetEndDate"
                    placeholder="Date of Delivery"
                    value={StockTrxdate}
                    onChange={(e) => setStockTrxDate(e.target.value)}
                  />
                </div>
              </Col>
              {/* <Col className="mb-1" lg="2" md="2" sm="12">
                  <div className="">
                    <Label>End Date</Label>
                    <Input
                      required
                      type="date"
                      name="targetstartDate"
                      placeholder="Date of Delivery"
                      value={targetEndDate}
                      // value={product.price * product.qty}
                      onChange={(e) => settargetEndDate(e.target.value)}
                    />
                  </div>
                </Col> */}
            </Row>
            {product &&
              product?.map((product, index) => (
                <Row className="" key={index}>
                  <Col className="mb-1" lg="3" md="3" sm="12">
                    <div className="">
                      <Label>Product Name</Label>
                      <Multiselect
                        required
                        selectionLimit={1}
                        // showCheckbox="true"
                        isObject="false"
                        options={ProductList}
                        // selectedValues={selectedValue}   // Preselected value to persist in dropdown
                        onSelect={(selectedList, selectedItem) =>
                          handleSelection(selectedList, selectedItem, index)
                        }
                        onRemove={(selectedList, selectedItem) => {
                          handleRemoveSelected(
                            selectedList,
                            selectedItem,
                            index
                          );
                        }}
                        displayValue="Product_Title" // Property name to display in the dropdown options
                      />
                    </div>
                  </Col>
                  <Col className="mb-1" lg="3" md="3" sm="12">
                    <div className="">
                      <Label>Size</Label>
                      <Multiselect
                        required
                        selectionLimit={1}
                        // showCheckbox="true"
                        isObject="false"
                        options={UnitList}
                        // selectedValues={selectedValue}   // Preselected value to persist in dropdown
                        onSelect={(selectedList, selectedItem) =>
                          handleSelectionone(selectedList, selectedItem, index)
                        }
                        onRemove={(selectedList, selectedItem) => {
                          handleRemoveSelectedone(
                            selectedList,
                            selectedItem,
                            index
                          );
                        }}
                        displayValue="primaryUnit" // Property name to display in the dropdown options
                      />
                    </div>
                  </Col>
                  <Col className="mb-1" lg="3" md="3" sm="12">
                    <div className="">
                      <Label>Quantity To be Transfer</Label>
                      <Input
                        type="number"
                        name="transferQty"
                        placeholder="Req_Qty"
                        min={0}
                        value={product?.qty}
                        onChange={(e) => handleProductChangeProduct(e, index)}
                      />
                    </div>
                  </Col>
                  <Col className="mb-1" lg="3" md="3" sm="12">
                    <div className="">
                      <Label>Price</Label>
                      <Input
                        type="number"
                        name="price"
                        readOnly
                        placeholder="Price"
                        value={product.price}
                      />
                    </div>
                  </Col>
                  <Col className="mb-1" lg="3" md="3" sm="12">
                    <div className="">
                      <Label>Total Price</Label>
                      <Input
                        type="number"
                        name="totalprice"
                        readOnly
                        placeholder="TtlPrice"
                        value={
                          product.Size * product.price * product.transferQty
                        }
                      />
                    </div>
                  </Col>

                  <Col className="d-flex mt-1 abb" lg="3" md="3" sm="12">
                    <div className="btnStyle">
                      {index ? (
                        <Button
                          type="button"
                          color="danger"
                          className="button remove "
                          onClick={() => removeMoreProduct(index)}>
                          - Remove
                        </Button>
                      ) : null}
                    </div>

                    <div className="btnStyle">
                      <Button
                        className="ml-1 mb-1"
                        color="primary"
                        type="button"
                        onClick={() => addMoreProduct()}>
                        + Add
                      </Button>
                    </div>
                  </Col>
                </Row>
              ))}
            <Row>
              {/* <Col className="mb-1" lg="2" md="2" sm="12">
                      <div className="">
                        <Label>Discount</Label>
                        <Input
                          type="number"
                          name="discount"
                          readOnly
                          placeholder="Dissct"
                          value={product.discount}
                        />
                      </div>
                    </Col> */}
              {/* <Col className="mb-1" lg="2" md="2" sm="12">
                      <div className="">
                        <Label>Shipping Cost</Label>
                        <Input
                          type="number"
                          name="Shipcst"
                          readOnly
                          placeholder="Shipcst"
                          value={product.Shipping}
                        />
                      </div>
                    </Col> */}
              {/* <Col className="mb-1" lg="2" md="2" sm="12">
                      <div className="">
                        <Label>Tax</Label>
                        <Input
                          type="number"
                          name="tax"
                          readOnly
                          placeholder="Tax"
                          value={product.tax}
                        />
                      </div>
                    </Col> */}
            </Row>
            <Row>
              <Col className="mb-1" lg="12" md="12" sm="12">
                <div className=" d-flex justify-content-end">
                  <Label className="pr-5">
                    Grand Total :{" "}
                    <stron>
                      {grandTotalAmt && grandTotalAmt == "NaN"
                        ? 0
                        : grandTotalAmt}{" "}
                    </stron>
                  </Label>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="d-flex justify-content-center">
                  <Button.Ripple color="primary" type="submit" className="mt-2">
                    Submit
                  </Button.Ripple>
                </div>
              </Col>
            </Row>
          </Form>
        )}
      </CardBody>
    </div>
  );
};
export default UpdateStockTrx;
