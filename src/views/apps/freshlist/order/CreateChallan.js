import React, { useEffect, useState, useContext } from "react";
import { Route, useHistory } from "react-router-dom";
import { history } from "../../../../history";
import CryptoJS from "crypto-js"; // Importing CryptoJS

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
} from "../../../../ApiEndPoint/ApiCalling";
import "../../../../assets/scss/pages/users.scss";
import {
  PurchaseProductList_Product,
  WareHouse_Current_Stock,
} from "../../../../ApiEndPoint/Api";
import UserContext from "../../../../context/Context";
import { GstCalculation } from "./GstCalculation";
import swal from "sweetalert";
import { handleKey } from "./HandleKeyPress";
let GrandTotal = [];
let SelectedITems = [];
let SelectedSize = [];
let geotagging = "";

const CreateOrder = (args) => {
  const [Index, setIndex] = useState("");
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

  const [dateofDelivery, setDateofDelivery] = useState("");
  const [product, setProduct] = useState([
    {
      productId: "",
      productData: "",
      disCountPercentage: 0,
      availableQty: 0,
      wholeQty: 0,
      qty: 1,
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

  const handleRequredQty = (e, index, avalaibleSize) => {
    const { name, value } = e.target;
    if (Number(value) <= avalaibleSize) {
      if (Number(value != 0)) {
        setIndex(index);
        const list = [...product];
        list[index][name] = Number(value);
        let amt = 0;
        if (list.length > 0) {
          const x = list?.map((val) => {
            GrandTotal[index] = val.qty * val.price;
            list[index]["totalprice"] = val.qty * val.price;
            return val.qty * val.price;
          });
          amt = x.reduce((a, b) => a + b);
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
        if (CustomerTerm == "Cash") {
          setProduct(list);
        } else {
          if (amt < CustomerLimit) {
            // const gstdetails = GstCalculation(Party, list, Context);

            // setGSTData(gstdetails);
            // list[index]["taxableAmount"] =
            //   gstdetails?.gstDetails[index]?.taxable;
            // list[index]["sgstRate"] = gstdetails?.gstDetails[index]?.sgstRate;
            // list[index]["cgstRate"] = gstdetails?.gstDetails[index]?.cgstRate;
            // list[index]["igstRate"] = gstdetails?.gstDetails[index]?.igstRate;
            // list[index]["grandTotal"] =
            //   gstdetails?.gstDetails[index]?.grandTotal;
            // list[index]["gstPercentage"] =
            //   gstdetails?.gstDetails[index]?.gstPercentage;
            // list[index]["disCountPercentage"] =
            //   gstdetails?.gstDetails[index]?.discountPercentage;

            setProduct(list);
          } else {
            swal("Error", `Your Max Limit is ${CustomerLimit}`);
          }
        }
      }
    }
  };

  useEffect(() => {
    const handleKeyPress = async (event) => handleKey(event);
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const handleSelectionParty = async (selectedList, selectedItem) => {
    setPartyId(selectedItem._id);
    setParty(selectedItem);
    let paymentTermCash = selectedItem?.paymentTerm
      .toLowerCase()
      ?.includes("cash");

    if (!paymentTermCash) {
      let URL = "order/check-party-limit/";
      await _Get(URL, selectedItem._id)
        .then((res) => {
          setCustomerLimit(Number(res?.CustomerLimit));
          // swal(`${res?.message}`);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setCustomerLimit(0);
      setCustomerTerm("Cash");
    }
    const gstdetails = GstCalculation(selectedItem, product, Context);
    setGSTData(gstdetails);
  };

  const handleSelection = async (selectedList, selectedItem, index) => {
    const userdata = JSON.parse(localStorage.getItem("userData"));

    let landedCost = selectedItem?.landedCost * 1.05;
    let PurchaseRate = selectedItem?.Purchase_Rate * 1.05;

    // let costPrice = Number(
    //   (
    //     selectedItem?.Product_MRP /
    //     ((100 + Number(selectedItem?.GSTRate)) / 100)
    //   ).toFixed(2)
    // );
    // if (costPrice <= landedCost || PurchaseRate >= costPrice) {
    //   swal(
    //     "error",
    //     `${
    //       costPrice <= landedCost
    //         ? "MRP is less Then Landed Cost"
    //         : "Base Price is Less then Purchase Rate"
    //     }`,
    //     "error"
    //   );
    // } else {
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
    // let URl = `${WareHouse_Current_Stock}${selectedItem?.warehouse?._id}/`;
    // var Stock;
    // await _Get(URl, selectedItem?._id)
    //   .then(res => {
    //     console.log(res?.currentStock);
    //     console.log(res?.currentStock.currentStock);
    //     Stock = res?.currentStock;
    //   })
    //   .catch(err => {
    //     if (!!err.response?.data?.message) {
    //       swal("Error", `${err.response?.data?.message}`, "error");
    //     }
    //   });

    setProduct((prevProductList) => {
      const updatedProductList = [...prevProductList];
      const updatedProduct = { ...updatedProductList[index] }; // Create a copy of the product at the specified index
      updatedProduct.price = selectedItem?.Product_MRP; // Update the price of the copied product
      updatedProduct.productId = selectedItem?._id;
      updatedProduct.productData = selectedItem;
      updatedProduct.basicPrice = costPrice;

      updatedProduct.HSN_Code = selectedItem?.HSN_Code;
      updatedProduct.primaryUnit = selectedItem?.primaryUnit;
      updatedProduct.secondaryUnit = selectedItem?.secondaryUnit;
      updatedProduct.secondarySize = selectedItem?.secondarySize;

      updatedProduct.disCountPercentage =
        Party?.category?.discount && Party?.category?.discount
          ? Party?.category?.discount
          : 0;
      updatedProduct.availableQty = selectedItem?.Opening_Stock;
      updatedProduct.wholeQty = selectedItem?.Opening_Stock;
      // updatedProduct.availableQty = Stock?.currentStock;
      // updatedProduct.wholeQty = Stock?.currentStock;
      updatedProductList[index] = updatedProduct;
      const gstdetails = GstCalculation(Party, updatedProductList, Context);
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

      return updatedProductList; // Return the updated product list to set the state
    });
    // }
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
    // ProductListView(userdata?._id, userdata?.database)
    //   .then((res) => {
    //     let product = res?.Product?.filter(
    //       (ele) => ele?.addProductType == "Product"
    //     );
    //     setProductList(res?.Product);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    CreateCustomerList(userdata?._id, userdata?.database)
      .then((res) => {
        let value = res?.Customer;
        if (value?.length) {
          const formattedData = value?.map((item) => ({
            ...item,
            displayLabel: `${item.firstName} (Grade: ${
              item?.category?.grade ? item?.category?.grade : "NA"
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

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const gstdetails = GstCalculation(Party, product, Context);
    let Product = product?.map((ele) => {
      if (ele?.disCountPercentage > 1) {
        return {
          productId: ele?.productId,
          // productData: ele?.productData,
          discountPercentage: ele?.disCountPercentage,
          availableQty: ele?.wholeQty - ele?.qty,
          // availableQty: ele?.wholeQty - ele?.qty * ele?.price,
          qty: ele?.qty,
          price: ele?.price,
          primaryUnit: ele?.primaryUnit,
          secondaryUnit: ele?.secondaryUnit,
          secondarySize: ele?.secondarySize,
          // Size: ele?.Size,
          // unitQty: ele?.Size,
          // unitType: ele?.unitType,
          totalPrice: ele?.totalprice,
          sgstRate: ele?.sgstRate,
          cgstRate: ele?.cgstRate,
          gstPercentage: ele?.gstPercentage,
          igstRate: ele?.igstRate,
          grandTotal: ele?.grandTotal,
          taxableAmount: ele?.taxableAmount,
          totalPriceWithDiscount: Number(
            ((ele?.totalprice * (100 - ele?.disCountPercentage)) / 100).toFixed(
              2
            )
          ),
        };
      } else {
        return {
          productId: ele?.productId,
          // productData: ele?.productData,
          discountPercentage: ele?.disCountPercentage,
          availableQty: ele?.wholeQty - ele?.qty,
          // availableQty: ele?.wholeQty - ele?.qty * ele?.price,

          qty: ele?.qty,
          price: ele?.price,
          // Size: ele?.Size,
          primaryUnit: ele?.primaryUnit,
          secondaryUnit: ele?.secondaryUnit,
          secondarySize: ele?.secondarySize,
          totalPrice: ele?.totalprice,
          sgstRate: ele?.sgstRate,
          cgstRate: ele?.cgstRate,
          gstPercentage: ele?.gstPercentage,
          igstRate: ele?.igstRate,
          grandTotal: ele?.grandTotal,
          taxableAmount: ele?.taxableAmount,
          // unitQty: ele?.Size,
          // unitType: ele?.unitType,
          totalPriceWithDiscount: ele?.totalprice,
        };
      }
    });
    let arnStatus = false;
    let arnNumber = Number((gstdetails?.Tax?.GrandTotal).toFixed(2));
    if (arnNumber > 49999) {
      arnStatus = true;
    }
    const fullname = Party?.firstName + " " + Party?.lastName;
    const payload = {
      database: UserInfo?.database,
      ARN: "",
      // ARN: Party?.rolename + 11544341546556,
      ARNStatus: arnStatus,
      partyId: PartyId,
      discountPercentage: Party?.category ? Party?.category?.discount : 0,
      SuperAdmin: Context?.CompanyDetails?.created_by,
      fullName: fullname,
      address: `${Party?.address1} ${Party?.address2}`,
      igstTaxType: gstdetails?.Tax?.IgstTaxType,
      grandTotal: Number((gstdetails?.Tax?.GrandTotal).toFixed(2)),
      roundOff: Number(gstdetails?.Tax?.RoundOff?.toFixed(2)),
      // roundOff: Number(
      //   (gstdetails?.Tax?.GrandTotal - gstdetails?.Tax?.RoundOff).toFixed(2)
      // ),
      amount: Number((gstdetails?.Tax?.Amount).toFixed(2)),
      sgstTotal: Number(gstdetails?.Tax?.CgstTotal.toFixed(2)),
      cgstTotal: Number(gstdetails?.Tax?.CgstTotal.toFixed(2)),
      igstTotal: Number(gstdetails?.Tax?.IgstTotal.toFixed(2)),
      gstDetails: gstdetails?.gstDetails,
      MobileNo: Party?.contactNumber,
      pincode: Party?.pincode,
      state: Party?.State,
      city: Party?.City,
      orderItems: Product,
      DateofDelivery: dateofDelivery,
      geotagging: geotagging,
    };
    if (CustomerTerm == "Cash") {
      await SaveOrder(payload)
        .then((res) => {
          setLoading(false);
          console.log(res);
          swal("Order Created Successfully");
          History.goBack();
        })
        .catch((err) => {
          swal("SomeThing Went Wrong");
          console.log(err.response);
        });
    } else {
      if (GSTData?.Tax?.GrandTotal < CustomerLimit) {
        // const gstdetails = GstCalculation(Party, product, Context);
        // let Product = product?.map((ele) => {
        //   if (ele?.disCountPercentage > 1) {
        //     return {
        //       productId: ele?.productId,
        //       productData: ele?.productData,
        //       discountPercentage: ele?.disCountPercentage,
        //       availableQty: ele?.wholeQty - ele?.qty,
        //       // availableQty: ele?.wholeQty - ele?.qty * ele?.price,
        //       qty: ele?.qty,
        //       price: ele?.price,
        //       primaryUnit: ele?.primaryUnit,
        //       secondaryUnit: ele?.secondaryUnit,
        //       secondarySize: ele?.secondarySize,
        //       // Size: ele?.Size,
        //       // unitQty: ele?.Size,
        //       // unitType: ele?.unitType,
        //       totalPrice: ele?.totalprice,
        //       sgstRate: ele?.sgstRate,
        //       cgstRate: ele?.cgstRate,
        //       gstPercentage: ele?.gstPercentage,
        //       igstRate: ele?.igstRate,
        //       grandTotal: ele?.grandTotal,
        //       taxableAmount: ele?.taxableAmount,
        //       totalPriceWithDiscount: Number(
        //         (
        //           (ele?.totalprice * (100 - ele?.disCountPercentage)) /
        //           100
        //         ).toFixed(2)
        //       ),
        //     };
        //   } else {
        //     return {
        //       productId: ele?.productId,
        //       productData: ele?.productData,
        //       discountPercentage: ele?.disCountPercentage,
        //       availableQty: ele?.wholeQty - ele?.qty,
        //       // availableQty: ele?.wholeQty - ele?.qty * ele?.price,

        //       qty: ele?.qty,
        //       price: ele?.price,
        //       // Size: ele?.Size,
        //       primaryUnit: ele?.primaryUnit,
        //       secondaryUnit: ele?.secondaryUnit,
        //       secondarySize: ele?.secondarySize,
        //       totalPrice: ele?.totalprice,
        //       sgstRate: ele?.sgstRate,
        //       cgstRate: ele?.cgstRate,
        //       gstPercentage: ele?.gstPercentage,
        //       igstRate: ele?.igstRate,
        //       grandTotal: ele?.grandTotal,
        //       taxableAmount: ele?.taxableAmount,
        //       // unitQty: ele?.Size,
        //       // unitType: ele?.unitType,
        //       totalPriceWithDiscount: ele?.totalprice,
        //     };
        //   }
        // });
        // let arnStatus = false;
        // let arnNumber = Number((gstdetails?.Tax?.GrandTotal).toFixed(2));
        // if (arnNumber > 49999) {
        //   arnStatus = true;
        // }
        // const fullname = Party?.firstName + " " + Party?.lastName;
        // const payload = {
        //   database: UserInfo?.database,
        //   ARN: Party?.rolename + 11544341546556,
        //   ARNStatus: arnStatus,
        //   partyId: PartyId,
        //   discountPercentage: Party?.category ? Party?.category?.discount : 0,
        //   SuperAdmin: Context?.CompanyDetails?.created_by,
        //   fullName: fullname,
        //   address: `${Party?.address1} ${Party?.address2}`,
        //   grandTotal: Number((gstdetails?.Tax?.GrandTotal).toFixed(2)),
        //   roundOff: Number(
        //     (gstdetails?.Tax?.GrandTotal - gstdetails?.Tax?.RoundOff).toFixed(2)
        //   ),
        //   amount: Number((gstdetails?.Tax?.Amount).toFixed(2)),
        //   sgstTotal: gstdetails?.Tax?.CgstTotal,
        //   igstTaxType: gstdetails?.Tax?.IgstTaxType,
        //   cgstTotal: gstdetails?.Tax?.CgstTotal,
        //   igstTotal: gstdetails?.Tax?.IgstTotal,
        //   gstDetails: gstdetails?.gstDetails,
        //   MobileNo: Party?.contactNumber,
        //   pincode: Party?.pincode,
        //   state: Party?.State,
        //   city: Party?.City,
        //   orderItems: Product,
        //   DateofDelivery: dateofDelivery,
        //   geotagging: geotagging,
        // };
        // console.log(payload);
        await SaveOrder(payload)
          .then((res) => {
            setLoading(false);
            // console.log(res);
            swal("Order Created Successfully");
            History.goBack();
          })
          .catch((err) => {
            swal("SomeThing Went Wrong");
            console.log(err.response);
          });
      } else {
        setLoading(false);

        swal("Error", `Your Max Limit is ${CustomerLimit}`);
      }
    }
  };

  const onRemove1 = (selectedList, removedItem, index) => {
    console.log(selectedList);
  };
  useEffect(() => {
    // Function to handle key down events
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "e") {
        console.log("Ctrl+e was pressed");
        alert("dfsdf");
        // Add your logic here
      }
    };

    // Add event listener to the document
    document.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return (
    <div>
      <div>
        <Card>
          <Row className="m-1">
            <Col className="">
              <div>
                <h1 className="">Create Challan</h1>
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
                          Balance Amount <span style={{ color: "red" }}>*</span>{" "}
                        </Label>
                        <Input
                          readOnly
                          type="text"
                          name="CustomerLimit"
                          placeholder="Balance Amount"
                          value={CustomerLimit.toFixed(2)}
                          // onChange={e => setDateofDelivery(e.target.value)}
                        />
                      </div>
                    </Col>
                    {CustomerLimit > 0 ? (
                      <Col className="mb-1" lg="2" md="2" sm="12">
                        <div className="">
                          <Label>
                            Net Balance <span style={{ color: "red" }}>*</span>{" "}
                          </Label>
                          <Input
                            readOnly
                            type="text"
                            name="NetBalance"
                            placeholder=" Net Balance"
                            value={
                              !!GSTData?.Tax?.GrandTotal
                                ? (
                                    CustomerLimit - GSTData?.Tax?.GrandTotal
                                  ).toFixed(2)
                                : CustomerLimit
                            }

                            // {!!GSTData?.Tax?.GrandTotal
                            //   ? (GSTData?.Tax?.GrandTotal).toFixed(2)
                            //   : 0}
                            // onChange={e => setDateofDelivery(e.target.value)}
                          />
                        </div>
                      </Col>
                    ) : (
                      <>
                        <Col className="mb-1" lg="2" md="2" sm="12">
                          <div className="">
                            <Label>
                              Net Balance{" "}
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
                    )}
                    {/* <Col className="mb-1" lg="4" md="4" sm="12">
                      <div className="">
                        <Label>Expected Delivery Date</Label>
                        <Input
                          required
                          type="date"
                          name="DateofDelivery"
                          value={dateofDelivery}
                          onChange={(e) => setDateofDelivery(e.target.value)}
                        />
                      </div>
                    </Col> */}
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
                            Product <span style={{ color: "red" }}>*</span>
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
                          style={{ width: "90px" }}>
                          <Label>HSN Code</Label>
                          <Input
                            readOnly
                            type="text"
                            name="HSN_Code"
                            placeholder="Req_Qty"
                            required
                            value={product?.HSN_Code}
                            // onChange={(e) =>
                            //   handleRequredQty(e, index, product?.availableQty)
                            // }
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
                            type="number"
                            readOnly
                            // name="qty"
                            // min={0}
                            placeholder="Gross Qty"
                            // required
                            // autocomplete="off"
                            value={(
                              product?.qty / product?.secondarySize
                            )?.toFixed(2)}
                            // value={(
                            //   product?.qty / product?.secondarySize
                            // )?.toFixed(2)}
                            // onChange={(e) => handleRequredQty(e, index)}
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
                            // onChange={e =>
                            //   handleRequredQty(e, index, product?.availableQty)
                            // }
                          />
                        </div>
                        <div
                          className="viewspacebetween2"
                          style={{ width: "90px" }}>
                          <Label>
                            Net Qty <span style={{ color: "red" }}>*</span>
                          </Label>
                          <Input
                            type="number"
                            name="qty"
                            min={0}
                            placeholder="Req_Qty"
                            required
                            // autocomplete="true"
                            value={product?.qty}
                            onChange={(e) =>
                              handleRequredQty(e, index, product?.availableQty)
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
                          {/* <Multiselect
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
                        /> */}
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
                            value={product.price}
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
                            readOnly
                            placeholder="Basic Price"
                            value={product.basicPrice}
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
                            value={product.taxableAmount}
                          />
                        </div>
                      </div>
                    </Col>

                    {/* <Col lg="2" md="2" className="mb-1">
                      <div className="">
                        <Label>Available Size</Label>
                        <Input
                          type="number"
                          disabled
                          name="availableQty"
                          placeholder="AvailableSize"
                          value={product?.availableQty}
                        />
                      </div>
                    </Col> */}

                    {/* <Col className="mb-1">
                      <div className="">
                        <Label>Taxable</Label>
                        <Input
                          type="number"
                          name="taxableAmount"
                          disabled
                          placeholder="Price"
                          value={product.taxableAmount}
                        />
                      </div>
                    </Col> */}

                    {/* {GSTData?.Tax?.IgstTaxType ? (
                      <>
                        <Col className="mb-1">
                          <div className="">
                            <Label>IGST</Label>
                            <Input
                              type="number"
                              name="igstRate"
                              readOnly
                              placeholder="igstRate"
                              value={product.igstRate}
                            />
                          </div>
                        </Col>
                      </>
                    ) : (
                      <>
                        <Col className="mb-1">
                          <div className="">
                            <Label>SGST</Label>
                            <Input
                              type="number"
                              name="sgstRate"
                              readOnly
                              placeholder="sgstRate"
                              value={product.sgstRate}
                            />
                          </div>
                        </Col>
                        <Col className="mb-1">
                          <div className="">
                            <Label>CGST</Label>
                            <Input
                              type="number"
                              name="cgstRate"
                              readOnly
                              placeholder="cgstRate"
                              value={product.cgstRate}
                            />
                          </div>
                        </Col>
                      </>
                    )} */}

                    {/* <Col className="mb-1">
                      <div className="">
                        <Label>Total </Label>
                        <Input
                          type="number"
                          name="grandTotal"
                          readOnly
                          placeholder="TtlPrice"
                          value={product.grandTotal}
                        />
                      </div>
                    </Col> */}

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
              {/* <Row>
                <Col className="mb-1" lg="12" md="12" sm="12">
                  <div className=" d-flex justify-content-end">
                    <ul className="subtotal">
                      <li>
                        <Label className="pr-5">
                          Total:
                          <span className="p-2">
                            {!!GSTData?.Tax?.Amount && GSTData?.Tax?.Amount
                              ? (GSTData?.Tax?.Amount).toFixed(2)
                              : 0}
                          </span>
                        </Label>
                      </li>
                      {GSTData?.Tax?.IgstTaxType &&
                      GSTData?.Tax?.IgstTaxType ? (
                        <li>
                          <Label className="">
                            IGST Tax:{" "}
                            <strong>
                              RS{" "}
                              {!!GSTData?.Tax?.IgstTotal &&
                              GSTData?.Tax?.IgstTotal
                                ? (GSTData?.Tax?.IgstTotal).toFixed(2)
                                : 0}
                            </strong>
                          </Label>
                        </li>
                      ) : (
                        <>
                          <li>
                            <Label className="">
                              SGST Tax:{" "}
                              <strong>
                                RS{" "}
                                {!!GSTData?.Tax?.SgstTotal &&
                                GSTData?.Tax?.SgstTotal
                                  ? (GSTData?.Tax?.SgstTotal).toFixed(2)
                                  : 0}
                              </strong>
                            </Label>
                          </li>
                          <li>
                            <Label className="">
                              CGST Tax:{" "}
                              <strong>
                                RS{" "}
                                {!!GSTData?.Tax?.CgstTotal &&
                                GSTData?.Tax?.CgstTotal
                                  ? (GSTData?.Tax?.CgstTotal).toFixed(2)
                                  : 0}
                              </strong>
                            </Label>
                          </li>
                        </>
                      )}

                      <li>
                        {" "}
                        <Label className="pr-5">
                          Grand Total :{" "}
                          <strong>
                            RS{" "}
                            {!!GSTData?.Tax?.GrandTotal
                              ? (GSTData?.Tax?.GrandTotal).toFixed(2)
                              : 0}
                          </strong>
                        </Label>
                      </li>
                    </ul>
                  </div>
                </Col>
              </Row> */}
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
                  {GSTData?.Tax?.GrandTotal > 0 && (
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
                  )}
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
export default CreateOrder;
