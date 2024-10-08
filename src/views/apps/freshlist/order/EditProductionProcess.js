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
  CustomInput,
} from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Routes, Route, useParams } from "react-router-dom";
import Multiselect from "multiselect-react-dropdown";

import "../../../../assets/scss/pages/users.scss";
import {
  ProductListView,
  WarehousetoWareHouseTrx,
  _Post,
  _PostSave,
  _Get,
  _Put,
} from "../../../../ApiEndPoint/ApiCalling";
import "../../../../assets/scss/pages/users.scss";
import {
  UpdateOne_Production,
  ViewOne_Production,
} from "../../../../ApiEndPoint/Api";
import swal from "sweetalert";

let GrandTotal = [];
let SelectedITems = [];
let SelectedSize = [];
const EditProductionProcess = (args) => {
  const [ExtraCharges, setExtraCharges] = useState({
    Other_Expenses: 100,
    GSTApplied: 18,
    Other_charges: 50,
    discount: 10,
  });

  const [Index, setIndex] = useState("");
  const [index, setindex] = useState("");
  const [Loader, setLoader] = useState(false);
  const [ProductList, setProductList] = useState([]);
  const [ProductWTWList, setProductWTWList] = useState([]);
  const [ProductinProduct, setProductionProduct] = useState({});
  const [WareHousetwo, setWareHousetwo] = useState([]);
  const [grandTotalAmt, setGrandTotalAmt] = useState(0);
  const [UserInfo, setUserInfo] = useState({});
  const [MainProduct, setMainProduct] = useState({});

  const [modalOne, setModalOne] = useState(false);
  const toggleOne = () => setModalOne(!modalOne);
  let { id } = useParams();

  const handleExtraCharge = (e) => {
    let { name, value } = e.target;
    setExtraCharges({
      ...ExtraCharges,
      [name]: value,
    });
  };

  const [product, setProduct] = useState([
    {
      product: "",
      productId: "",
      selecetedUnit: "",
      AvailaleQty: null,
      availableQty: "",
      transferQty: 1,
      RequiredQty: "",
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

  const handleProductChangeProduct = (e, index, avalaibleSize) => {
    if (avalaibleSize >= Number(e.target.value)) {
      setIndex(index);
      console.log(product);

      const { name, value } = e.target;
      const list = [...product];
      if (name.includes("transferQty")) {
        // list[index]["Size"] = Number(value);
        let available = Number(list[index]["AvailaleQty"]);
        let Askingfor = Number(value);
        if (available >= Askingfor) {
          list[index][name] = Askingfor;
        } else {
          swal("Can not Transfer More then Stock");
          list[index][name] = available - 1;
        }
      } else {
        list[index][name] = value;
      }
      console.log(GrandTotal);

      let amt = 0;
      if (list.length > 0) {
        const x = list?.map((val) => {
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
    } else {
      return null;
    }
  };
  const handleProductChangeProductTwo = (e, index) => {
    setIndex(index);

    const { name, value } = e.target;
    const list = [...product];
    list[index][name] = value;
    setProduct(list);
  };
  const handleSubmitCharges = (e) => {
    e.preventDefault();
    const list = [...product];
    let amt = 0;
    if (list.length > 0) {
      const x = list?.map((val) => {
        return val?.price * val?.RequiredQty;
      });
      amt = x.reduce((a, b) => a + b);
    }

    let Totalamount =
      amt +
      ExtraCharges?.Other_Expenses +
      (amt * ExtraCharges?.GSTApplied) / 100 +
      ExtraCharges?.Other_charges -
      ExtraCharges?.discount;

    setGrandTotalAmt(Totalamount.toFixed(2));
  };
  const handleProductChangeProductone = (e, index) => {
    setIndex(index);
    const { name, value } = e.target;
    const list = [...product];

    list[index][name] = Number(value);

    let amt = 0;
    if (list.length > 0) {
      const x = list?.map((val) => {
        GrandTotal[index] = val.price * val.RequiredQty;
        list[index]["totalprice"] = val.price * val.RequiredQty;
        return val?.price * val?.RequiredQty;
      });
      amt = x.reduce((a, b) => a + b);
      console.log("GrandTotal", amt);
    }
    setProduct(list);
    setGrandTotalAmt(amt.toFixed(2));
  };
  const handleRemoveSelected = (selectedList, selectedItem, index) => {
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
      updatedProduct.productId = selectedItem?.productId?._id;
      updatedProduct.AvailaleQty = selectedItem?.Size;
      updatedProductList[index] = updatedProduct; // Replace the product at the specified index with the updated one
      return updatedProductList; // Return the updated product list to set the state
    });
  };
  const handleSelectionProduct = (selectedList, selectedItem, index) => {
    SelectedITems.push(selectedItem);
    setProduct((prevProductList) => {
      const updatedProductList = [...prevProductList]; // Create a copy of the productList array
      const updatedProduct = { ...updatedProductList[index] }; // Create a copy of the product at the specified index
      updatedProduct.price = selectedItem?.Product_MRP; // Update the price of the copied product
      updatedProduct.productId = selectedItem?._id;
      updatedProduct.discount = selectedItem?.discount;
      if (selectedItem?.unitType) {
        updatedProduct.unitType = selectedItem?.unitType.split(" ")[1];
      }
      // updatedProduct.AvailaleQty = selectedItem?.Size;
      updatedProductList[index] = updatedProduct; // Replace the product at the specified index with the updated one

      return updatedProductList; // Return the updated product list to set the state
    });
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
      let amt = myarr?.reduce((a, b) => a + b);
      setGrandTotalAmt(amt);
      return updatedProductList; // Return the updated product list to set the state
    });
    // onSelect1(selectedList, selectedItem, index);
  };

  useEffect(() => {
    let userdata = JSON.parse(localStorage.getItem("userData"));
    let URl = ViewOne_Production;
    setLoader(true);
    _Get(URl, id)
      .then((res) => {
        ProductListView(userdata?._id, userdata?.database)
          .then((Response) => {
            console.log(Response?.Product);
            setProductList(Response?.Product);
            let MainProduct_id = res?.Production?.product_name?._id;
            let SeletedMainProduct = Response?.Product?.filter(
              (ele) => ele?._id == MainProduct_id
            );
            let selectRawProduct = res.Production?.productItems?.map(
              (ele, i) => {
                return {
                  productId: ele?.productId?._id,
                  selecetedUnit: ele?.unitType,
                  AvailaleQty: null,
                  //   transferQty: 1,
                  RequiredQty: ele?.qty,
                  price: ele?.price,
                  unitType: ele?.unitType,
                  discount: ele?.productId?.discount,
                };
              }
            );
            let amt = 0;
            if (res.Production?.productItems.length > 0) {
              const x = res.Production?.productItems?.map((val) => {
                GrandTotal[index] = val.price * val.qty;
                return val?.price * val?.qty;
              });
              amt = x.reduce((a, b) => a + b);
              console.log("GrandTotal", amt);
            }
            setGrandTotalAmt(amt.toFixed(2));
            setProduct(selectRawProduct);
            setMainProduct(SeletedMainProduct);
            setProductionProduct(SeletedMainProduct[0]);
            setLoader(false);
          })
          .catch((err) => {
            console.log(err);
          });

        setExtraCharges({
          Other_Expenses: res?.Production?.miscellaneousExpennses,
          GSTApplied: res?.Production?.gstApplied,
          Other_charges: res?.Production?.otherCharges,
          discount: res?.Production?.discount,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userData"));
    // console.log(userInfo);
    setUserInfo(userInfo);
  }, []);

  let addMoreProduct = () => {
    setProduct([
      ...product,
      {
        product: "", //
        productId: "",
        selecetedUnit: "",
        AvailaleQty: null,
        availableQty: "",
        transferQty: 1, //
        RequiredQty: "",
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

  const WareHousetoWareHouse = (e) => {
    e.preventDefault();
    // body: warehouse, productId, Size, unitType, transferQty, price, totalPrice;
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
        currentStock: ele?.transferQty * ele?.Size,
      };
    });
    let payload = {
      productItems: Allproduct,
      warehouseToId: WareHousetwo[0]?._id,
      warehouseFromId: ProductinProduct[0]?._id,
      stockTransferDate: StockTrxdate,
      grandTotal: grandTotalAmt,
      transferStatus: "InProcess",
      created_by: userdata?._id,
    };
    console.log(payload);
    WarehousetoWareHouseTrx(payload)
      .then((res) => {
        //   window.location.reload();
        // history.goBack();
        swal("Stock transerffered is Initiated");

        console.log(res);
      })
      .catch((err) => {
        console.log(err);
        swal("Something Went Wrong");
      });
  };
  const handleAddCharges = (e) => {
    toggleOne();
    e.preventDefault();
  };
  const submitHandler = (e) => {
    e.preventDefault();
    let userdata = JSON.parse(localStorage.getItem("userData"));
    let Allproduct = product?.map((ele, i) => {
      return {
        productId: ele?.productId,
        unit: ele?.unitType,
        price: ele?.price,
        qty: ele?.RequiredQty,
        unitType: ele?.selecetedUnit,
        totalPrice: ele?.price * ele?.RequiredQty,
      };
    });
    let ALL =
      Number(grandTotalAmt) +
      Number(ExtraCharges?.Other_Expenses) +
      Number(ExtraCharges?.Other_charges) +
      (Number(grandTotalAmt) * ExtraCharges?.GSTApplied) / 100 -
      Number(ExtraCharges?.discount);
    let payload = {
      created_by: userdata?._id,
      product_name: ProductinProduct?._id,
      productItems: Allproduct,
      miscellaneousExpennses: ExtraCharges?.Other_Expenses,
      gstApplied: ExtraCharges?.GSTApplied,
      otherCharges: ExtraCharges?.Other_charges,
      discount: ExtraCharges?.discount,
      grandTotal: ALL,
    };

    _Put(UpdateOne_Production, id, payload)
      .then((res) => {
        console.log(res);
        toggleOne();
        swal("Production Process is updated");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const onSelect1 = (selectedList, selectedItem, index) => {
    console.log(selectedList[0]);
    setProductionProduct(selectedList[0]);
    // setProductList(selectedList[0].productItems);
  };
  const onSelectone = (selectedList, selectedItem, index) => {
    console.log(selectedList);

    setProductionProduct(selectedList);
    // const list = [...product];
    let MySelectedwarehouseProduct = selectedList[0].productItems?.map(
      (ele, i) => {
        let myproduct = ele?.productId;
        ele["Product_Title"] = myproduct?.Product_Title;
        ele["Product_id"] = myproduct?._id;
        ele["Product_MRP"] = myproduct?.Product_MRP;
        ele["discount"] = myproduct?.discount;
        ele["transferQty"] = myproduct?.transferQty;
        ele["MIN_stockalert"] = myproduct?.MIN_stockalert;
      }
    );

    console.log(selectedList[0]?.productItems);

    setProductWTWList(selectedList[0]?.productItems);
  };
  const onRemove1 = (selectedList, removedItem, index) => {
    console.log(selectedList);
    console.log(index);
  };
  const onRemoveone = (selectedList, removedItem, index) => {
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
  if (Loader) {
    return (
      <>
        <Card>
          <CardBody>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: window?.innerHeight,
              }}>
              <h3>Loading...</h3>
            </div>
          </CardBody>
        </Card>
      </>
    );
  }
  return (
    <div>
      <Card>
        <Row className="m-2">
          <Col lg="8" md="8" sm="8" className="mb-2 mt-1">
            <div>
              <h1 className="">Edit Production Process</h1>
            </div>
          </Col>
          <Col>
            <div className="float-right">
              <Route
                render={({ history }) => (
                  <Button
                    style={{ cursor: "pointer" }}
                    className="float-right mr-1"
                    color="primary"
                    onClick={() => history.goBack()}>
                    {" "}
                    Back
                  </Button>
                )}
              />
            </div>
          </Col>
        </Row>
        <CardBody>
          <Form className="m-1" onSubmit={handleAddCharges}>
            <Row>
              <Col className="mb-1" lg="2" md="2" sm="12">
                <div className="">
                  <Label>Choose Production Product </Label>

                  <Multiselect
                    required
                    disablePreSelectedValues
                    selectionLimit={1}
                    // showCheckbox="true"
                    isObject="false"
                    // options={ProductList} // Options to display in the dropdown
                    selectedValues={MainProduct} // Preselected value to persist in dropdown
                    // onSelect={onSelect1} // Function will trigger on select event
                    // onRemove={onRemove1} // Function will trigger on remove event
                    displayValue="Product_Title" // Property name to display in the dropdown options
                  />
                </div>
              </Col>
            </Row>
            {product &&
              product?.map((product, index) => {
                let SeletedMainProduct = ProductList?.filter(
                  (ele) => ele?._id == product?.productId
                );

                return (
                  <>
                    <Row className="" key={index}>
                      <Col className="mb-1" lg="2" md="2" sm="12">
                        <div className="">
                          <Label>Choose item *</Label>
                          <Multiselect
                            required
                            selectionLimit={1}
                            // showCheckbox="true"
                            isObject="false"
                            options={ProductList}
                            selectedValues={SeletedMainProduct} // Preselected value to persist in dropdown
                            onSelect={(selectedList, selectedItem) =>
                              handleSelectionProduct(
                                selectedList,
                                selectedItem,
                                index
                              )
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
                      <Col className="mb-1" lg="1" md="1" sm="12">
                        <div className="">
                          <label for="unit">Select Unit</label>
                          <select
                            required
                            className="form-control"
                            name="selecetedUnit"
                            placeholder="selecetedUnit"
                            value={product?.selecetedUnit}
                            onChange={(e) =>
                              handleProductChangeProductTwo(e, index)
                            }
                            id="unit">
                            <option value="">--select Unit--</option>
                            <option value="kg">Kilogram (kg)</option>
                            <option value="Pcs">Pieces (Pcs)</option>
                            <option value="g">Gram (g)</option>
                            <option value="tonne">Metric Ton (tonne)</option>
                            <option value="m">Meter (m)</option>
                            <option value="cm">Centimeter (cm)</option>
                            <option value="mm">Millimeter (mm)</option>
                            <option value="in">Inch (in)</option>
                            <option value="ft">Foot (ft)</option>
                            <option value="m3">Cubic Meter (m³)</option>
                            <option value="L">Liter (L)</option>
                            <option value="ml">Milliliter (ml)</option>
                            <option value="s">Second (s)</option>
                            <option value="min">Minute (min)</option>
                            <option value="hr">Hour (hr)</option>
                            <option value="°C">Celsius (°C)</option>
                            <option value="°F">Fahrenheit (°F)</option>
                            <option value="Pa">Pascal (Pa)</option>
                            <option value="bar">Bar (bar)</option>
                            <option value="m/s">Meters per Second (m/s)</option>
                            <option value="km/h">
                              Kilometers per Hour (km/h)
                            </option>
                            <option value="A">Ampere (A)</option>
                            <option value="V">Volt (V)</option>
                            <option value="W">Watt (W)</option>
                            <option value="kW">Kilowatt (kW)</option>
                          </select>
                        </div>
                      </Col>
                      <Col className="mb-1" lg="1" md="1" sm="12">
                        <div className="">
                          <Label>
                            Price{product?.unitType && product?.unitType}
                          </Label>
                          <Input
                            type="number"
                            name="price"
                            readOnly
                            aria-readonly
                            onChange={(e) =>
                              handleProductChangeProductone(e, index)
                            }
                            placeholder="Price"
                            value={product.price}
                          />
                        </div>
                      </Col>
                      <Col className="mb-1" lg="1" md="1" sm="12">
                        <div className="">
                          <Label>Req_Qty</Label>
                          <Input
                            type="number"
                            min={0}
                            step="any"
                            name="RequiredQty"
                            placeholder="Req_Qty"
                            value={product?.RequiredQty}
                            onChange={(e) =>
                              handleProductChangeProductone(e, index)
                            }
                          />
                        </div>
                      </Col>

                      <Col className="mb-1" lg="1" md="1" sm="12">
                        <div className="">
                          <Label>Discount</Label>
                          <Input
                            type="number"
                            name="discount"
                            readOnly
                            placeholder="Discount"
                            value={product.discount}
                          />
                        </div>
                      </Col>
                      <Col className="mb-1" lg="2" md="2" sm="12">
                        <div className="">
                          <Label>Total Price</Label>
                          <Input
                            type="number"
                            name="totalprice"
                            readOnly
                            placeholder="TtlPrice"
                            value={product?.price * product?.RequiredQty}
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
                  </>
                );
              })}
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
        </CardBody>
      </Card>
      <Modal
        style={{ maxWidth: "1050px" }}
        isOpen={modalOne}
        toggle={toggleOne}
        {...args}>
        <ModalHeader toggle={toggleOne}>Add Charges</ModalHeader>
        <ModalBody>
          <Form className="m-1" onSubmit={submitHandler}>
            <Row>
              <Col className="mb-1" lg="3" md="3" sm="12">
                <div className="">
                  <Label>Miscellaneous Expenses </Label>

                  <input
                    className="form-control"
                    name="Other_Expenses"
                    value={ExtraCharges?.Other_Expenses}
                    onChange={handleExtraCharge}
                    type="number"
                  />
                </div>
              </Col>
              <Col className="mb-1" lg="3" md="3" sm="12">
                <div className="">
                  <Label>GST Applied </Label>

                  <CustomInput
                    className="form-control"
                    name="GSTApplied"
                    value={ExtraCharges?.GSTApplied}
                    onChange={handleExtraCharge}
                    type="select">
                    <option>--select--</option>
                    <option value={18}>18</option>
                    <option value={9}>9</option>
                  </CustomInput>
                </div>
              </Col>
              <Col className="mb-1" lg="3" md="3" sm="12">
                <div className="">
                  <Label>Other Charges </Label>

                  <input
                    className="form-control"
                    name="Other_charges"
                    value={ExtraCharges?.Other_charges}
                    onChange={handleExtraCharge}
                    type="number"
                  />
                </div>
              </Col>
              <Col className="mb-1" lg="3" md="3" sm="12">
                <div className="">
                  <Label>Discount </Label>
                  <input
                    className="form-control"
                    value={ExtraCharges?.discount}
                    name="discount"
                    onChange={handleExtraCharge}
                    type="number"
                  />
                </div>
              </Col>
              {/* <Col className="mb-1" lg="3" md="3" sm="12">
                <div className=" mt-2">
                  <Button color="primary" onClick={handleSubmitCharges}>
                    Add Charges
                  </Button>
                </div>
              </Col> */}
            </Row>
            <Row>
              <Col>
                <div className="d-flex justify-content-end">
                  <strong> SubTotal:</strong>{" "}
                  {grandTotalAmt && grandTotalAmt == "NaN" ? 0 : grandTotalAmt}{" "}
                </div>
                <div className="d-flex justify-content-end">
                  <strong> Miscellaneous:</strong>
                  {ExtraCharges?.Other_Expenses}
                </div>
                <div className="d-flex justify-content-end">
                  <strong> GST:</strong>{" "}
                  {(ExtraCharges?.GSTApplied * grandTotalAmt) / 100}
                </div>
                <div className="d-flex justify-content-end">
                  <strong> other:</strong>
                  {ExtraCharges?.Other_charges}
                </div>
                <div className="d-flex justify-content-end">
                  <strong> Discount: </strong>
                  {ExtraCharges?.discount}
                </div>
                <div className="d-flex justify-content-end">
                  <strong> GrandTotal:</strong>

                  {(
                    Number(grandTotalAmt) +
                    Number(ExtraCharges?.Other_Expenses) +
                    Number(ExtraCharges?.Other_charges) +
                    (Number(grandTotalAmt) * ExtraCharges?.GSTApplied) / 100 -
                    Number(ExtraCharges?.discount)
                  )?.toFixed(2)}
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="d-flex justify-content-center">
                  <Button color="primary" type="submit">
                    Submit
                  </Button>{" "}
                </div>
              </Col>
            </Row>
          </Form>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </Modal>
    </div>
  );
};
export default EditProductionProcess;
