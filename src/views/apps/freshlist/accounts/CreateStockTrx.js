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
  Badge,
} from "reactstrap";
import { useHistory } from "react-router-dom";
import Multiselect from "multiselect-react-dropdown";

import "../../../../assets/scss/pages/users.scss";
import {
  ProductListView,
  UnitListView,
  StocktrxFtoW,
  WarehousetoWareHouseTrx,
  _Get,
} from "../../../../ApiEndPoint/ApiCalling";
import "../../../../assets/scss/pages/users.scss";
import { Route } from "react-router-dom";
import { WareahouseList_For_addProduct } from "../../../../ApiEndPoint/Api";

let GrandTotal = [];
let SelectedITems = [];
let SelectedSize = [];
const CreateTarget = (args) => {
  let history = useHistory();
  const [formData, setFormData] = useState({});
  const [Index, setIndex] = useState("");
  const [StockTrxdate, setStockTrxDate] = useState("");
  const [index, setindex] = useState("");
  const [error, setError] = useState("");
  const [ProductList, setProductList] = useState([]);
  const [ProductWTWList, setProductWTWList] = useState([]);
  const [WareHouseone, setWareHouseone] = useState([]);
  const [WareHousetwo, setWareHousetwo] = useState([]);
  const [grandTotalAmt, setGrandTotalAmt] = useState(0);
  const [modal, setModal] = useState(false);
  const [items, setItems] = useState("");
  const [audit, setAudit] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [WareHouselist, setWarehouseList] = useState([]);
  const [WareHouseTolist, setToWarehouseList] = useState([]);
  const [WareHouseAll, setWholeWarehosue] = useState([]);
  const toggle = (item) => {
    // setItems(item);
    setModal(!modal);
  };
  const audittoggle = () => {
    setAudit(!audit);
  };

  const [product, setProduct] = useState([
    {
      product: "",
      igstTaxType: false,
      productId: "",
      AvailaleQty: null,
      availableQty: "",
      transferQty: 1,
      price: "",
      gstPercentage: "",
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

      const { name, value } = e.target;
      const list = [...product];
      if (name.includes("transferQty")) {
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

      let amt = 0;
      if (list.length > 0) {
        const x = list?.map((val) => {
          GrandTotal[index] = val.price * val.transferQty;
          list[index]["totalprice"] = Number(
            (val.price * val.transferQty).toFixed(2)
          );
          return val.price * val.transferQty;
        });
        amt = x.reduce((a, b) => a + b);
      }
      // console.log(list)
      setProduct(list);
      setGrandTotalAmt(amt);
    } else {
      return null;
    }
  };

  const handleRemoveSelected = (selectedList, selectedItem, index) => {
    SelectedITems.splice(index, 1);
    let myarr = product?.map((ele, i) => {
      let indextotal = ele?.qty * SelectedITems[i]?.Product_MRP;
      GrandTotal[index] = indextotal;
      return indextotal;
    });

    let amt = myarr?.reduce((a, b) => a + b);
    setGrandTotalAmt(amt);
  };

  const handleSelection = (selectedList, selectedItem, index) => {
    SelectedITems.push(selectedItem);
    setProduct((prevProductList) => {
      const updatedProductList = [...prevProductList];
      const updatedProduct = { ...updatedProductList[index] };
      updatedProduct.price = selectedItem?.Product_MRP;
      updatedProduct.product = selectedItem?.productId;
      updatedProduct.productId = selectedItem?.productId?._id;
      updatedProduct.discount = selectedItem?.discount;
      updatedProduct.Size = selectedItem?.primaryUnit;
      updatedProduct.primaryUnit = selectedItem?.primaryUnit;
      updatedProduct.secondaryUnit = selectedItem?.secondaryUnit;
      updatedProduct.secondarySize = selectedItem?.secondarySize;
      updatedProduct.igstTaxType = selectedItem?.igstTaxType;
      updatedProduct.AvailaleQty = selectedItem?.currentStock;
      updatedProduct.gstPercentage = selectedItem?.GSTRate;
      updatedProductList[index] = updatedProduct; // Replace the product at the specified index with the updated one
      return updatedProductList;
    });
  };

  useEffect(() => {
    let userData = JSON.parse(localStorage.getItem("userData"));
    _Get(WareahouseList_For_addProduct, userData?.database)
      .then((res) => {
        let value = res?.Warehouse;
        setWholeWarehosue(value);
        let List = [];
        if (
          userData?.rolename?.roleName === "MASTER" ||
          userData?.rolename?.roleName === "SuperAdmin"
        ) {
          if (value?.length) {
            List = value;
          }
        } else {
          List = value?.filter((ele) => ele?.created_by?._id == userData?._id);
        }
        if (value?.length) {
          setToWarehouseList(value);
          setWarehouseList(List);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    ProductListView(userData?._id, userData?.database)
      .then((res) => {
        setProductList(res.Product);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  let addMoreProduct = () => {
    setProduct([
      ...product,
      {
        product: "",
        productId: "",
        igstTaxType: false,
        AvailaleQty: null,
        availableQty: "",
        transferQty: 1,
        price: "",
        gstPercentage: "",
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
  };
  let removeMoreProduct = (i) => {
    let newFormValues = [...product];
    newFormValues.splice(i, 1);
    GrandTotal.splice(i, 1);
    let amt = GrandTotal.reduce((a, b) => a + b);
    setGrandTotalAmt(amt);

    setProduct(newFormValues);
  };

  const WareHousetoWareHouse = async (e) => {
    e.preventDefault();
    setLoading(true);
    let userdata = JSON.parse(localStorage.getItem("userData"));
    let Allproduct = product?.map((ele, i) => {
      return {
        productId: ele?.productId,
        primaryUnit: ele?.primaryUnit,
        secondaryUnit: ele?.secondaryUnit,
        secondarySize: ele?.secondarySize,
        price: ele?.price,
        transferQty: ele?.transferQty,
        totalPrice: ele?.totalprice,
        // currentStock: ele?.AvailaleQty,
        gstPercentage: ele?.gstPercentage,
      };
    });

    let payload = {
      productItems: Allproduct,
      warehouseToId: WareHousetwo[0]?._id,
      warehouseFromId: WareHouseone[0]?._id,
      stockTransferDate: StockTrxdate,
      grandTotal: Number(grandTotalAmt.toFixed(2)),
      transferStatus: "InProcess",
      created_by: userdata?._id,
    };

    await WarehousetoWareHouseTrx(payload)
      .then((res) => {
        setLoading(false);

        swal("Stock transerffered is Initiated");
        history.goBack();
      })
      .catch((err) => {
        setLoading(false);

        console.log(err);
        swal("Something Went Wrong");
      });
  };

  const onSelectone = (selectedList, selectedItem, index) => {
    setWareHouseone(selectedList);
    let secondryShow = WareHouseAll?.filter(
      (ele) => ele?._id !== selectedItem?._id
    );
    setToWarehouseList(secondryShow);
    let MySelectedwarehouseProduct = selectedList[0]?.productItems?.map(
      (ele, i) => {
        return {
          ...ele?.productId,
          ...ele,
          Product_Title: ele?.productId?.Product_Title
            ? ele?.productId?.Product_Title
            : "Not Found",
        };
      }
    );

    setProductWTWList(MySelectedwarehouseProduct);
  };

  const onRemoveone = (selectedList, removedItem, index) => {
    console.log(selectedList);
    setToWarehouseList(WareHouseAll);
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
      <Card>
        <Row className="m-2">
          <Col lg="8" md="8" sm="8" className="mb-2 mt-1">
            <div>
              <h1 className="">Create Stock Transfer</h1>
              <div className="choose">
                {/* <h4 className="mb-1">Choose Type of Stock trx</h4> */}
                {/* <div
                  className="form-label-group"
                  onChange={(e) => setTypeOfTrx(e.target.value)}>
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
                </div> */}
              </div>
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
          {/* {TypeOfTrx && TypeOfTrx == "Warehousetowarehouse" && ( */}
          <Form className="mx-1" onSubmit={WareHousetoWareHouse}>
            <Row>
              <Col className="mb-1" lg="3" md="3" sm="12">
                <div className="">
                  <Label>Choose Warehouse(from where) *</Label>
                  <Multiselect
                    required
                    selectionLimit={1}
                    isObject="false"
                    options={WareHouselist} // Options to display in the dropdown
                    onSelect={onSelectone} // Function will trigger on select event
                    onRemove={onRemoveone} // Function will trigger on remove event
                    displayValue="warehouseName" // Property name to display in the dropdown options
                  />
                </div>
              </Col>
              <Col className="mb-1" lg="3" md="3" sm="12">
                <div className="">
                  <Label>Choose Warehouse (to be Transfer) * </Label>

                  <Multiselect
                    required
                    selectionLimit={1}
                    isObject="false"
                    options={WareHouseTolist} // Options to display in the dropdown
                    onSelect={onSelect2} // Function will trigger on select event
                    onRemove={onRemove2} // Function will trigger on remove event
                    displayValue="warehouseName" // Property name to display in the dropdown options
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
                  <Col className="mb-1" lg="3" md="3" sm="12">
                    <div className="">
                      <Label>Product Name</Label>
                      <Multiselect
                        required
                        selectionLimit={1}
                        isObject="true"
                        options={ProductWTWList}
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
                  <Col className="mb-1" lg="1" md="1" sm="12">
                    <div className="">
                      <Label>Primary Unit</Label>
                      <Input
                        type="text"
                        placeholder="PACk"
                        value={product?.Size}
                        readOnly
                      />
                      {/* <Multiselect
                        required
                        selectionLimit={1}
                        isObject="false"
                        options={UnitList}
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
                      /> */}
                    </div>
                  </Col>
                  <Col className="mb-1" lg="1" md="1" sm="12">
                    <div className="">
                      <Label>Available Qty</Label>
                      <Input
                        disabled
                        type="number"
                        min={0}
                        name="AvailaleQty"
                        placeholder="Available Qty"
                        value={product?.AvailaleQty}
                      />
                    </div>
                  </Col>
                  <Col className="mb-1" lg="1" md="1" sm="12">
                    <div className="">
                      <Label>Qty Transfer</Label>
                      <Input
                        type="number"
                        min={0}
                        name="transferQty"
                        placeholder="Req_Qty"
                        value={product?.transferQty}
                        onChange={(e) =>
                          handleProductChangeProduct(
                            e,
                            index,
                            product?.AvailaleQty
                          )
                        }
                      />
                    </div>
                  </Col>

                  {/* <Col className="mb-1" lg="1" md="1" sm="12">
                    <div className="">
                      <Label>Price</Label>
                      <Input
                        type="number"
                        name="price"
                        readOnly
                        placeholder="Price"
                        value={product.price && product.price?.toFixed(2)}
                      />
                    </div>
                  </Col> */}
                  {/* <Col className="mb-1" lg="2" md="2" sm="12">
                    <div className="">
                      <Label>Total Price</Label>
                      <Input
                        type="number"
                        name="totalprice"
                        readOnly
                        placeholder="TtlPrice"
                        value={(product.price * product.transferQty).toFixed(2)}
                      />
                    </div>
                  </Col> */}

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
              {/* <Col className="mb-1" lg="12" md="12" sm="12">
                <div className=" d-flex justify-content-end">
                  <Label className="pr-5">
                    Grand Total :{" "}
                    <strong>
                      {grandTotalAmt && grandTotalAmt == "NaN"
                        ? 0
                        : grandTotalAmt.toFixed(2)}{" "}
                    </strong>
                  </Label>
                </div>
              </Col> */}
            </Row>
            {!Loading && !Loading ? (
              <>
                <Row>
                  <Col>
                    <div className="d-flex justify-content-center">
                      <Button.Ripple
                        color="primary"
                        type="submit"
                        className="mt-2">
                        Submit
                      </Button.Ripple>
                    </div>
                  </Col>
                </Row>
              </>
            ) : (
              <>
                <Row>
                  <Col>
                    <div className="d-flex justify-content-center">
                      <Button.Ripple
                        color="secondary"
                        disabled={Loading ? true : true}
                        className="mt-2">
                        Loading...
                      </Button.Ripple>
                    </div>
                  </Col>
                </Row>
              </>
            )}
          </Form>
          {/* )} */}
          {/* {TypeOfTrx && TypeOfTrx == "Factorytowarehourse" && (
            <Form className="m-1" onSubmit={submitHandler}>
              <Row>
                <Col className="mb-1" lg="3" md="3" sm="12">
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
                      displayValue="warehouseName" // Property name to display in the dropdown options
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
                          isObject="false"
                          options={ProductList}
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
                    <Col className="mb-1" lg="2" md="2" sm="12">
                      <div className="">
                        <Label>Size</Label>
                        <Multiselect
                          required
                          selectionLimit={1}
                          isObject="false"
                          options={UnitList}
                          onSelect={(selectedList, selectedItem) =>
                            handleSelectionone(
                              selectedList,
                              selectedItem,
                              index
                            )
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
                          min={0}
                          name="transferQty"
                          placeholder="Req_Qty"
                          value={product?.transferQty}
                          onChange={(e) =>
                            handleProductChangeProductone(e, index)
                          }
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
                    <Col className="mb-1" lg="2" md="2" sm="12">
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
                    <Button.Ripple
                      color="primary"
                      type="submit"
                      className="mt-2">
                      Submit
                    </Button.Ripple>
                  </div>
                </Col>
              </Row>
            </Form>
          )} */}
        </CardBody>
      </Card>
    </div>
  );
};
export default CreateTarget;
