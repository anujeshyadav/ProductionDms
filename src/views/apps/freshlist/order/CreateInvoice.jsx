import React, { useEffect, useState, useContext } from "react";
import { Route, useHistory } from "react-router-dom";
import { history } from "../../../../history";

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
  Table,
} from "reactstrap";
import "react-phone-input-2/lib/style.css";
import Multiselect from "multiselect-react-dropdown";
import "../../../../assets/scss/pages/users.scss";

import {
  SaveOrder,
  ProductListView,
  UnitListView,
  CreateCustomerList,
  _Get,
  _PostSave,
} from "../../../../ApiEndPoint/ApiCalling";
import "../../../../assets/scss/pages/users.scss";
import {
  Create_Existing_Invoice,
  PurchaseProductList_Product,
  WareHouse_Current_Stock,
} from "../../../../ApiEndPoint/Api";
import UserContext from "../../../../context/Context";
import { GstCalculation } from "./GstCalculation";
import swal from "sweetalert";
let GrandTotal = [];
let SelectedITems = [];
let SelectedSize = [];
let geotagging = "";

const CreateInvoice = (args) => {
  const [InvoiceNumber, setInvoiceNumber] = useState("");
  const [ARN, setARN] = useState("");
  const [CustomerLimit, setCustomerLimit] = useState(0);
  const [CustomerTerm, setCustomerTerm] = useState("");
  const [PartyLogin, setPartyLogin] = useState(false);
  const [Loading, setLoading] = useState(false);

  const [ProductList, setProductList] = useState([]);
  const [GSTData, setGSTData] = useState({});
  const [PartyList, setPartyList] = useState([]);
  const [PartyId, setPartyId] = useState("");
  const [Party, setParty] = useState({});
  const [UnitList, setUnitList] = useState([]);

  const [UserInfo, setUserInfo] = useState({});

  const [orderDate, setOrderDate] = useState("");
  const [product, setProduct] = useState([
    {
      productId: "",
      productData: "",
      disCountPercentage: 0,
      availableQty: 0,
      wholeQty: 0,
      qty: 1,
      weight: "",
      price: 0,
      Size: 0,
      unitType: "",
      unitPriceAfterDiscount: "",
      totalprice: "",
      taxableAmount: 0,
      gstPercentage: 0,
      sgstRate: 0,
      cgstRate: 0,
      igstRate: 0,
      grandTotal: 0,
    },
  ]);

  const Context = useContext(UserContext);
  let History = useHistory();

  const handleRequredQty = (e, index, avalaibleSize, CustomerTerm) => {
    const list = [...product];
    const { name, value } = e.target;
    let currentvalue = Number(value);
    currentvalue =
      name == "GrossQty"
        ? list[index]?.secondarySize * Number(value)
        : (currentvalue = Number(value));
    if (Number(currentvalue) <= avalaibleSize) {
      if (Number(value != 0)) {
        if (name == "GrossQty") {
          list[index]["GrossQty"] = Number(value);
          list[index]["qty"] = Number(
            list[index]?.secondarySize * Number(value)
          );
        } else {
          list[index][name] = Number(value);
          list[index]["GrossQty"] = Number(
            (list[index]["qty"] / list[index]?.secondarySize).toFixed(3)
          );
        }

        const gstdetails = GstCalculation(Party, list, Context);

        setGSTData(gstdetails);
        list[index]["taxableAmount"] = gstdetails?.gstDetails[index]?.taxable;
        list[index]["sgstRate"] = gstdetails?.gstDetails[index]?.sgstRate;
        list[index]["cgstRate"] = gstdetails?.gstDetails[index]?.cgstRate;
        list[index]["igstRate"] = gstdetails?.gstDetails[index]?.igstRate;
        list[index]["grandTotal"] = gstdetails?.gstDetails[index]?.grandTotal;
        list[index]["gstPercentage"] =
          gstdetails?.gstDetails[index]?.gstPercentage;
        list[index]["disCountPercentage"] =
          gstdetails?.gstDetails[index]?.discountPercentage;
        setProduct(list);

        // if (CustomerTerm == "Cash") {
        //   setProduct(list);
        // } else {
        //   if (gstdetails?.Tax.GrandTotal < CustomerLimit) {
        //     setBorderColor("green");
        //     setProduct(list);
        //   } else {
        //     setBorderColor("red");
        //   }
        // }
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "b") {
        console.log("Ctrl+b was pressed", event.key);
      } else {
        console.log("was pressed", event.key);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  const handleSelectionParty = async (selectedList, selectedItem) => {
    setPartyId(selectedItem._id);
    setParty(selectedItem);
    const gstdetails = GstCalculation(selectedItem, product, Context);
    setGSTData(gstdetails);
    // let paymentTermCash = selectedItem?.paymentTerm
    //   .toLowerCase()
    //   ?.includes("cash");
    // if (!paymentTermCash) {
    //   let URL = "order/check-party-limit/";
    //   await _Get(URL, selectedItem._id)
    //     .then((res) => {
    //       setCustomerTerm("");
    //       setCustomerLimit(Number(res?.CustomerLimit));
    //       let grandTotal =
    //         gstdetails?.Tax?.GrandTotal > 0 ? gstdetails?.Tax?.GrandTotal : 0;
    //       if (grandTotal < Number(res?.CustomerLimit)) {
    //         setBorderColor("green");
    //       } else {
    //         setBorderColor("red");
    //       }
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // } else {
    //   setCustomerLimit(0);
    //   setCustomerTerm("Cash");
    //   if (paymentTermCash) {
    //     setBorderColor("green");
    //   }
    // }
  };

  const handleSelection = async (selectedList, selectedItem, index) => {
    if (selectedItem?.Opening_Stock > 0) {
      const userdata = JSON.parse(localStorage.getItem("userData"));

      SelectedITems.push(selectedItem);
      let costPrice = Number(
        (
          selectedItem?.Product_MRP /
          (((100 +
            Number(Party?.category?.discount ? Party?.category?.discount : 0)) /
            100) *
            ((100 + Number(selectedItem?.GSTRate)) / 100))
        ).toFixed(2)
      );

      setProduct((prevProductList) => {
        const updatedProductList = [...prevProductList];
        const updatedProduct = { ...updatedProductList[index] }; // Create a copy of the product at the specified index
        updatedProduct.price = selectedItem?.Product_MRP; // Update the price of the copied product
        updatedProduct.productId = selectedItem?._id;
        updatedProduct.productData = selectedItem;
        updatedProduct.basicPrice = costPrice;
        updatedProduct.weight = selectedItem?.weight;
        updatedProduct.HSN_Code = selectedItem?.HSN_Code;
        updatedProduct.primaryUnit = selectedItem?.primaryUnit;
        updatedProduct.secondaryUnit = selectedItem?.secondaryUnit;
        updatedProduct.secondarySize = selectedItem?.secondarySize;
        updatedProduct.GrossQty = Number(
          (1 / selectedItem?.secondarySize).toFixed(3)
        );

        updatedProduct.disCountPercentage =
          Party?.category?.discount && Party?.category?.discount
            ? Party?.category?.discount
            : 0;
        updatedProduct.availableQty = selectedItem?.qty;
        updatedProduct.wholeQty = selectedItem?.qty;

        updatedProductList[index] = updatedProduct;
        const gstdetails = GstCalculation(Party, updatedProductList, Context);
        setGSTData(gstdetails);

        updatedProduct["taxableAmount"] =
          gstdetails?.gstDetails[index]?.taxable;
        updatedProduct["sgstRate"] = gstdetails?.gstDetails[index]?.sgstRate;
        updatedProduct["cgstRate"] = gstdetails?.gstDetails[index]?.cgstRate;
        updatedProduct["igstRate"] = gstdetails?.gstDetails[index]?.igstRate;
        updatedProduct["grandTotal"] =
          gstdetails?.gstDetails[index]?.grandTotal;
        updatedProduct["gstPercentage"] =
          gstdetails?.gstDetails[index]?.gstPercentage;
        updatedProduct["disCountPercentage"] =
          gstdetails?.gstDetails[index]?.discountPercentage;

        return updatedProductList; // Return the updated product list to set the state
      });
    } else {
      swal("Error", "Stock Not Available", "error");
    }
  };

  const handleSelectionUnit = (selectedList, selectedItem, index) => {
    SelectedSize.push(selectedItem);
    let unit = selectedItem?.secondaryUnit;
    setProduct((prevProductList) => {
      const updatedUnitList = [...prevProductList];
      const updatedProduct = { ...updatedUnitList[index] }; // Create a copy of the product at the specified index
      updatedProduct.Size = selectedItem.unitQty;
      updatedProduct.availableQty =
        updatedProduct.wholeQty / selectedItem.unitQty;
      updatedProduct.unitType = selectedItem.primaryUnit;
      updatedProduct.qty = 1;
      updatedUnitList[index] = updatedProduct;
      let myarr = prevProductList?.map((ele, i) => {
        updatedUnitList[index]["totalprice"] = ele?.qty * ele.price;
        let indextotal = ele?.price * ele.qty;
        GrandTotal[index] = indextotal;
        return indextotal;
      });
      let amt = myarr.reduce((a, b) => a + b);

      const gstdetails = GstCalculation(Party, updatedUnitList, Context);

      setGSTData(gstdetails);

      updatedProduct["taxableAmount"] = gstdetails?.gstDetails[index]?.taxable;
      updatedProduct["sgstRate"] = gstdetails?.gstDetails[index]?.sgstRate;
      updatedProduct["cgstRate"] = gstdetails?.gstDetails[index]?.cgstRate;
      updatedProduct["igstRate"] = gstdetails?.gstDetails[index]?.igstRate;
      updatedProduct["grandTotal"] = gstdetails?.gstDetails[index]?.grandTotal;
      updatedProduct["gstPercentage"] =
        gstdetails?.gstDetails[index]?.gstPercentage;
      updatedProduct["disCountPercentage"] =
        gstdetails?.gstDetails[index]?.discountPercentage;
      return updatedUnitList; // Return the updated product list
    });
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const date = new Date(position.timestamp);
          const CurentTime = date.toLocaleString();
          geotagging = `${position.coords.latitude},${position.coords.longitude}`;
        },
        (error) => {
          swal(`Error: ${error}`);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else {
      swal(`Error: Geolocation not found`);
    }
    let userdata = JSON.parse(localStorage.getItem("userData"));

    let findParty = userdata?.rolename?.roleName == "Customer";
    if (findParty) {
      setPartyLogin(true);
      setPartyId(userdata?._id);
      setParty(userdata);
      let URL = "order/check-party-limit/";
      _Get(URL, userdata?._id)
        .then((res) => {
          setCustomerLimit(Number(res?.CustomerLimit));

          console.log(res?.CustomerLimit);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    _Get(PurchaseProductList_Product, userdata?.database)
      .then((res) => {
        setProductList(res?.Product);
      })
      .catch((err) => {
        console.log(err);
      });

    CreateCustomerList(userdata?._id, userdata?.database)
      .then((res) => {
        let value = res?.Customer;
        if (value?.length) {
          const formattedData = value?.map((item) => ({
            ...item,
            displayLabel: `${item.CompanyName} (Grade: ${
              item?.category?.grade
                ? item?.category?.grade?.toUpperCase()
                : "NA"
            })`,
          }));
          setPartyList(formattedData);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    UnitListView(userdata?._id, userdata?.database)
      .then((res) => {
        setUnitList(res.Unit);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(today.getDate()).padStart(2, "0"); // Day of the month
    const formattedDate = `${year}-${month}-${day}`; // YYYY-MM-DD format
    setOrderDate(formattedDate);
    const userInfo = JSON.parse(localStorage.getItem("userData"));
    setUserInfo(userInfo);
  }, []);

  let addMoreProduct = () => {
    setProduct([
      ...product,
      {
        productId: "",
        productData: "",
        disCountPercentage: "",
        availableQty: 0,
        wholeQty: 0,
        weight: "",
        qty: 1,
        Size: "",
        price: "",
        totalprice: "",
        unitPriceAfterDiscount: "",
        unitQty: "",
        unitType: "",
        taxableAmount: "",
        gstPercentage: "",
        sgstRate: "",
        cgstRate: "",
        igstRate: "",
        grandTotal: "",
      },
    ]);
  };
  let removeMoreProduct = (i) => {
    let newFormValues = [...product];
    newFormValues.splice(i, 1);
    GrandTotal.splice(i, 1);
    let amt = GrandTotal.reduce((a, b) => a + b, 0);
    setProduct(newFormValues);
    const gstdetails = GstCalculation(Party, newFormValues, Context);
    setGSTData(gstdetails);
  };

  const handleChangePrice = (e, index) => {
    const { name, value } = e.target;
    if (Number(value != 0)) {
      const list = [...product];
      list[index][name] = Number(value);
      list[index]["price"] = Number(
        (
          Number(value) *
          ((100 + Number(list[index].gstPercentage)) / 100) *
          ((100 +
            Number(Party?.category?.discount ? Party?.category?.discount : 0)) /
            100)
        ).toFixed(2)
      );

      const gstdetails = GstCalculation(Party, list, Context);
      setGSTData(gstdetails);
      list[index]["taxableAmount"] = gstdetails?.gstDetails[index]?.taxable;
      list[index]["sgstRate"] = gstdetails?.gstDetails[index]?.sgstRate;
      list[index]["cgstRate"] = gstdetails?.gstDetails[index]?.cgstRate;
      list[index]["igstRate"] = gstdetails?.gstDetails[index]?.igstRate;
      list[index]["grandTotal"] = gstdetails?.gstDetails[index]?.grandTotal;
      list[index]["gstPercentage"] =
        gstdetails?.gstDetails[index]?.gstPercentage;
      list[index]["disCountPercentage"] =
        gstdetails?.gstDetails[index]?.discountPercentage;
      setProduct(list);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const gstdetails = GstCalculation(Party, product, Context);
    let Product = product?.map((ele) => {
      if (ele?.disCountPercentage > 1) {
        return {
          productId: ele?.productId,
          discountPercentage: ele?.disCountPercentage,
          qty: ele?.qty,
          price: ele?.price,
          primaryUnit: ele?.primaryUnit,
          secondaryUnit: ele?.secondaryUnit,
          secondarySize: ele?.secondarySize,

          totalPrice: ele?.qty * ele?.price,
          sgstRate: ele?.sgstRate,
          cgstRate: ele?.cgstRate,
          gstPercentage: ele?.gstPercentage,
          igstRate: ele?.igstRate,
          grandTotal: ele?.grandTotal,
          taxableAmount: ele?.taxableAmount,
          totalPriceWithDiscount: ele?.grandTotal,
        };
      } else {
        return {
          productId: ele?.productId,
          discountPercentage: ele?.disCountPercentage,

          qty: ele?.qty,
          price: ele?.price,
          primaryUnit: ele?.primaryUnit,
          secondaryUnit: ele?.secondaryUnit,
          secondarySize: ele?.secondarySize,
          totalPrice: ele?.qty * ele?.price,
          sgstRate: ele?.sgstRate,
          cgstRate: ele?.cgstRate,
          gstPercentage: ele?.gstPercentage,
          igstRate: ele?.igstRate,
          grandTotal: ele?.grandTotal,
          taxableAmount: ele?.taxableAmount,
          totalPriceWithDiscount: ele?.grandTotal,
        };
      }
    });
    let arnStatus = false;
    let arnNumber = Number((gstdetails?.Tax?.GrandTotal).toFixed(2));
    if (arnNumber > 49999) {
      arnStatus = true;
    }
    const fullname = Party?.CompanyName;
    const payload = {
      userId: Party?.created_by?._id,
      partyId: PartyId,
      invoiceId: InvoiceNumber,
      database: UserInfo?.database,
      ARN: arnNumber ? ARN : "",
      ARNStatus: arnStatus,
      discountPercentage: Party?.category ? Party?.category?.discount : 0,
      SuperAdmin: Context?.CompanyDetails?.created_by,
      fullName: fullname,
      address: Party?.address,
      igstTaxType: gstdetails?.Tax?.IgstTaxType,
      grandTotal: Number((gstdetails?.Tax?.GrandTotal).toFixed(2)),
      roundOff: Number(gstdetails?.Tax?.RoundOff?.toFixed(2)),
      amount: Number((gstdetails?.Tax?.Amount).toFixed(2)),
      sgstTotal: Number(gstdetails?.Tax?.CgstTotal.toFixed(2)),
      cgstTotal: Number(gstdetails?.Tax?.CgstTotal.toFixed(2)),
      igstTotal: Number(gstdetails?.Tax?.IgstTotal.toFixed(2)),
      gstDetails: gstdetails?.gstDetails,
      MobileNo: Party?.contactNumber,
      pincode: Party?.pincode,
      state: Party?.State,
      date: orderDate,
      city: Party?.City,
      orderItems: Product,
      DateofDelivery: "",
      geotagging: geotagging,
    };

    await _PostSave(Create_Existing_Invoice, payload)
      .then((res) => {
        setLoading(false);
        swal("Invoice Created Successfully");
        History.push("/app/softNumen/order/confirmedOrder");
      })
      .catch((err) => {
        setLoading(false);
        swal("SomeThing Went Wrong");
      });
  };

  const onRemove1 = (selectedList, removedItem, index) => {
    console.log(selectedList);
  };
  return (
    <div>
      <div>
        <Card>
          <Row className="m-1">
            <Col className="">
              <div>
                <h1 className="">Create Existing Invoice</h1>
              </div>
            </Col>
            <Col>
              <Route
                render={({ history }) => (
                  <Button
                    className="btn float-right"
                    color="danger"
                    onClick={() =>
                      history.push("/app/softnumen/order/orderList")
                    }>
                    Back
                  </Button>
                )}
              />
            </Col>
          </Row>

          <CardBody>
            <Form className="" onSubmit={submitHandler}>
              <Row>
                {PartyLogin && PartyLogin ? null : (
                  <>
                    <Col className="mb-1" lg="3" md="3" sm="12">
                      <div className="">
                        <Label>
                          Choose Party <span style={{ color: "red" }}>*</span>{" "}
                        </Label>

                        <Multiselect
                          required
                          selectionLimit={1}
                          isObject="false"
                          options={PartyList}
                          onSelect={(selectedList, selectedItem) =>
                            handleSelectionParty(selectedList, selectedItem)
                          }
                          onRemove={onRemove1}
                          displayValue="displayLabel"
                        />
                      </div>
                    </Col>
                    <Col className="mb-1" lg="2" md="2" sm="12">
                      <div className="">
                        <Label>
                          order Date <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Input
                          required
                          type="date"
                          name="orderDate"
                          value={orderDate}
                          onChange={(e) => setOrderDate(e.target.value)}
                        />
                      </div>
                    </Col>
                    <Col className="mb-1" lg="2" md="2" sm="12">
                      <div className="">
                        <Label>
                          Invoice Number <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Input
                          required
                          type="text"
                          placeholder="Enter Invoice Number"
                          name="InvoiceNumber"
                          value={InvoiceNumber}
                          onChange={(e) => setInvoiceNumber(e.target.value)}
                        />
                      </div>
                    </Col>
                    {!!GSTData?.Tax?.GrandTotal &&
                      GSTData?.Tax?.GrandTotal > 49999 && (
                        <Col className="" lg="2" md="2" sm="12">
                          <div className="">
                            <Label>
                              ARN Number <span style={{ color: "red" }}>*</span>
                            </Label>
                            <Input
                              required
                              type="text"
                              placeholder="Enter ARN Number"
                              name="ARN"
                              value={ARN}
                              onChange={(e) => setARN(e.target.value)}
                            />
                          </div>
                        </Col>
                      )}
                    {/* {CustomerLimit > 0 && (
                      <Col className="mb-1" lg="2" md="2" sm="12">
                        <div className="">
                          <Label>
                            Balance Amount{" "}
                            <span style={{ color: "red" }}>*</span>{" "}
                          </Label>
                          <Input
                            readOnly
                            type="text"
                            name="CustomerLimit"
                            placeholder="Balance Amount"
                            value={CustomerLimit?.toFixed(2)}
                            // onChange={e => setDateofDelivery(e.target.value)}
                          />
                        </div>
                      </Col>
                    )} */}
                    {/* {CustomerLimit > 0 ? (
                      <Col className="mb-1" lg="2" md="2" sm="12">
                        <div className="">
                          <Label>
                            <span style={{ color: borderColor }}>
                              Net Balance *
                            </span>{" "}
                          </Label>
                          <Input
                            readOnly
                            type="text"
                            id="netBal"
                            name="NetBalance"
                            placeholder="Net Balance"
                            style={{ border: `3px solid ${borderColor}` }}
                            value={
                              !!GSTData?.Tax?.GrandTotal
                                ? (
                                    CustomerLimit - GSTData?.Tax?.GrandTotal
                                  ).toFixed(2)
                                : CustomerLimit
                            }
                          />
                        </div>
                      </Col>
                    ) : (
                      <>
                        <Col className="mb-1" lg="2" md="2" sm="12">
                          <div className="">
                            <Label>
                              Payment Mode{" "}
                              <span style={{ color: "red" }}>*</span>{" "}
                            </Label>
                            <Input
                              readOnly
                              type="text"
                              name="NetBalance"
                              placeholder=" Net Balance"
                              value={CustomerTerm}
                            />
                          </div>
                        </Col>
                      </>
                    )} */}
                  </>
                )}
                <Col className="mb-1" lg="4" md="4" sm="12"></Col>
              </Row>
              {/* <Table responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>ProductName</th>
                    <th>Available Size</th>
                    <th>Choose Unit</th>
                    <th>Purchase Quantity</th>
                    <th>Discount Percentage</th>
                    <th>Product Price </th>
                    <th>Taxable Amount</th>
                    <th>GST Percentage</th>
                    {GSTData?.Tax?.IgstTaxType ? (
                      <th> IGST Amount </th>
                    ) : (
                      <>
                        <th> SGST Amount </th>
                        <th> CGST Amount</th>
                      </>
                    )}
                    <th> Total Price</th>
                    <th> Action</th>
                  </tr>
                </thead>
                <tbody>
                  {product &&
                    product?.map((product, index) => (
                      <tr key={index}>
                        <td>1</td>
                        <td>
                          {" "}
                          <Multiselect
                            required
                            selectionLimit={1}
                            isObject="false"
                            options={ProductList}
                            onSelect={(selectedList, selectedItem) =>
                              handleSelection(selectedList, selectedItem, index)
                            }
                            onRemove={(selectedList, selectedItem) => {
                              onRemove1(selectedList, selectedItem, index);
                            }}
                            displayValue="Product_Title" // Property name to display in the dropdown options
                          />
                        </td>
                        <td>{product?.availableQty} </td>
                        <td>
                          {" "}
                          <Multiselect
                            required
                            selectionLimit={1}
                            isObject="false"
                            options={UnitList}
                            onSelect={(selectedList, selectedItem) =>
                              handleSelectionUnit(
                                selectedList,
                                selectedItem,
                                index
                              )
                            }
                            onRemove={(selectedList, selectedItem) => {
                              onRemove1(selectedList, selectedItem, index);
                            }}
                            displayValue="primaryUnit"
                          />
                        </td>
                        <td>
                          {" "}
                          <Input
                            type="number"
                            name="qty"
                            min={0}
                            placeholder="Req_Qty"
                            required
                            autocomplete="off"
                            value={product?.qty}
                            onChange={(e) =>
                              handleRequredQty(e, index, product?.availableQty)
                            }
                          />
                        </td>
                        <td>{product?.disCountPercentage}</td>
                        <td>{product.price}</td>
                        <td>{product.taxableAmount}</td>
                        <td>{product.gstPercentage}</td>
                        {GSTData?.Tax?.IgstTaxType ? (
                          <td>{product.igstRate}</td>
                        ) : (
                          <>
                            <td>{product.sgstRate}</td>
                            <td>{product.cgstRate}</td>
                          </>
                        )}
                        <td>{product.grandTotal}</td>
                        <td>
                          {" "}
                          {index ? (
                            <Button
                              type="button"
                              color="danger"
                              className="button remove pt-1"
                              onClick={() => removeMoreProduct(index)}>
                              x
                            </Button>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table> */}
              {product?.length > 0 &&
                product?.map((product, index) => (
                  <Row className="" key={index}>
                    <Col>
                      <div className="viewspacebetween">
                        <div style={{ width: "300px" }}>
                          <Label>
                            Select Product{" "}
                            <span style={{ color: "red" }}>*</span>
                          </Label>
                          <Multiselect
                            required
                            selectionLimit={1}
                            isObject="false"
                            options={ProductList}
                            onSelect={(selectedList, selectedItem) =>
                              handleSelection(selectedList, selectedItem, index)
                            }
                            onRemove={(selectedList, selectedItem) => {
                              onRemove1(selectedList, selectedItem, index);
                            }}
                            displayValue="Product_Title" // Property name to display in the dropdown options
                          />
                        </div>
                        <div
                          className="viewspacebetween2"
                          style={{ width: "120px" }}>
                          <Label>HSN Code</Label>
                          <Input
                            readOnly
                            type="text"
                            name="HSN_Code"
                            placeholder="Req_Qty"
                            required
                            value={product?.HSN_Code}
                          />
                        </div>
                        <div
                          className="viewspacebetween1"
                          style={{ width: "120px" }}>
                          <Label>Weight</Label>
                          <Input
                            readOnly
                            type="text"
                            name="weight"
                            placeholder="weight"
                            required
                            value={product?.weight}
                            // onChange={(e) => handleRequredQty(e, index)}
                          />
                        </div>
                        <div
                          className="viewspacebetween2"
                          style={{ width: "90px" }}>
                          <Label>Gross Unit</Label>
                          <Input
                            type="text"
                            name="secondaryUnit"
                            readOnly
                            placeholder="Gross Unit"
                            value={product.secondaryUnit}
                          />
                        </div>
                        <div
                          className="viewspacebetween2"
                          style={{ width: "90px" }}>
                          <Label>Gross Qty</Label>
                          <Input
                            required
                            type="number"
                            name="GrossQty"
                            placeholder="Gross Qty"
                            value={product?.GrossQty}
                            onChange={(e) =>
                              handleRequredQty(
                                e,
                                index,
                                product?.availableQty,
                                CustomerTerm
                              )
                            }
                          />
                        </div>
                        <div
                          className="viewspacebetween2"
                          style={{ width: "90px" }}>
                          <Label>
                            Avail Qty <span style={{ color: "red" }}>*</span>
                          </Label>
                          <Input
                            type="number"
                            name="availQty"
                            min={0}
                            placeholder="availableQty"
                            readOnly
                            autocomplete="off"
                            value={product?.availableQty}
                          />
                        </div>
                        <div
                          className="viewspacebetween2"
                          style={{ width: "90px" }}>
                          <Label>
                            Net Qty <span style={{ color: "red" }}>*</span>
                          </Label>
                          <Input
                            required
                            type="number"
                            name="qty"
                            min={1}
                            placeholder="Req_Qty"
                            value={product?.qty}
                            onChange={(e) =>
                              handleRequredQty(
                                e,
                                index,
                                product?.availableQty,
                                CustomerTerm
                              )
                            }
                          />
                        </div>
                        <div
                          className="viewspacebetween2"
                          style={{ width: "90px" }}>
                          <Label>Net Unit</Label>
                          <Input
                            type="text"
                            name="primaryUnit"
                            disabled
                            placeholder="Unit"
                            value={product?.primaryUnit}
                          />
                        </div>
                        <div
                          className="viewspacebetween2"
                          style={{ width: "90px" }}>
                          <Label>Sales Price</Label>
                          <Input
                            type="number"
                            name="price"
                            disabled
                            placeholder="Price"
                            value={product?.price && product?.price?.toFixed(2)}
                          />
                        </div>
                        <div
                          className="viewspacebetween2"
                          style={{ width: "90px" }}>
                          <Label>Dis(%)</Label>
                          <Input
                            type="text"
                            name="disCountPercentage"
                            disabled
                            placeholder="Discount Percentage"
                            value={product?.disCountPercentage}
                          />
                        </div>
                        <div
                          className="viewspacebetween2"
                          style={{ width: "90px" }}>
                          <Label>Basic Price</Label>
                          <Input
                            type="number"
                            name="basicPrice"
                            min={1}
                            step="0.01"
                            onChange={(e) => handleChangePrice(e, index)}
                            placeholder="Basic Price"
                            value={product?.basicPrice}
                          />
                        </div>

                        <div
                          className="viewspacebetween2"
                          style={{ width: "90px" }}>
                          <Label>Tax %</Label>
                          <Input
                            type="text"
                            name="gstPercentage"
                            disabled
                            placeholder="GST Percentage %"
                            value={product.gstPercentage}
                          />
                        </div>
                        <div
                          className="viewspacebetween2"
                          style={{ width: "90px" }}>
                          <Label>Basic Total</Label>
                          <Input
                            type="number"
                            name="taxableAmount"
                            disabled
                            placeholder="Basic Total"
                            value={
                              product?.taxableAmount &&
                              product?.taxableAmount?.toFixed(2)
                            }
                          />
                        </div>
                      </div>
                    </Col>

                    <Col className="d-flex mt-1 abb">
                      <div className="btnStyle">
                        {index ? (
                          <Button
                            type="button"
                            color="danger"
                            className="button remove pt-1 pb-1"
                            size="sm"
                            onClick={() => removeMoreProduct(index)}>
                            X
                          </Button>
                        ) : null}
                      </div>
                    </Col>
                  </Row>
                ))}
              <Row>
                <Col lg="12" sm="12" md="12">
                  <div className="btnStyle d-flex justify-content-end">
                    <Button
                      className="ml-1 mb-1"
                      color="primary"
                      type="button"
                      size="sm"
                      onClick={() => addMoreProduct()}>
                      Add
                    </Button>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col className="mb-1 mt-1" lg="12" md="12" sm="12">
                  <div className=" d-flex justify-content-end">
                    <ul className="subtotal">
                      <li>
                        <div className="totalclas">
                          <span className="">Basic Total:</span>
                          <span className="">
                            {!!GSTData?.Tax?.Amount && GSTData?.Tax?.Amount
                              ? (GSTData?.Tax?.Amount).toFixed(2)
                              : 0}
                          </span>
                        </div>
                      </li>
                      {GSTData?.Tax?.IgstTaxType &&
                      GSTData?.Tax?.IgstTaxType ? (
                        <li>
                          <div className="totalclas">
                            <span className="">IGST Tax: </span>
                            <strong>
                              {!!GSTData?.Tax?.IgstTotal &&
                              GSTData?.Tax?.IgstTotal
                                ? (GSTData?.Tax?.IgstTotal).toFixed(2)
                                : 0}
                            </strong>
                          </div>
                        </li>
                      ) : (
                        <>
                          <li>
                            <div className="totalclas">
                              <span className="">SGST Tax: </span>
                              <strong>
                                {!!GSTData?.Tax?.SgstTotal &&
                                GSTData?.Tax?.SgstTotal
                                  ? (GSTData?.Tax?.SgstTotal).toFixed(2)
                                  : 0}
                              </strong>
                            </div>
                          </li>
                          <li>
                            <div className="totalclas">
                              <span className="">CGST Tax: </span>
                              <strong>
                                {!!GSTData?.Tax?.CgstTotal &&
                                GSTData?.Tax?.CgstTotal
                                  ? (GSTData?.Tax?.CgstTotal).toFixed(2)
                                  : 0}
                              </strong>
                            </div>
                          </li>
                        </>
                      )}
                      <li>
                        <div className="totalclas">
                          <span className="">RoundOff: </span>
                          <strong>
                            {!!GSTData?.Tax?.RoundOff && GSTData?.Tax?.RoundOff
                              ? (GSTData?.Tax?.RoundOff).toFixed(2)
                              : 0}
                          </strong>
                        </div>
                      </li>
                      <hr />
                      <li>
                        {" "}
                        <div className="totalclas">
                          <span className="">Grand Total : </span>
                          <strong>
                            {!!GSTData?.Tax?.GrandTotal
                              ? (GSTData?.Tax?.GrandTotal).toFixed(2)
                              : 0}
                          </strong>
                        </div>
                      </li>
                      <hr />
                    </ul>
                  </div>
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
                        Submit
                      </Button.Ripple>
                    </div>
                  </Col>
                  {/* {GSTData?.Tax?.GrandTotal > 0 && (
                    <Row>
                      {borderColor == "green" ? (
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
                      ) : (
                        <>
                          <Col>
                            <div className="d-flex justify-content-center">
                              <Button.Ripple
                                color="danger"
                                disabled={true}
                                className="mt-2">
                                Limit Exceeded
                              </Button.Ripple>
                            </div>
                          </Col>
                        </>
                      )}
                    </Row>
                  )} */}
                </>
              ) : (
                <Row>
                  <Col>
                    <div className="d-flex justify-content-center">
                      <Button.Ripple
                        disabled={true}
                        color="secondary"
                        className="mt-2">
                        Submitting...
                      </Button.Ripple>
                    </div>
                  </Col>
                </Row>
              )}
            </Form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
export default CreateInvoice;
