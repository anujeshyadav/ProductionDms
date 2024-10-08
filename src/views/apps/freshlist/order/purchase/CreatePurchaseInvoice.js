import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Route, Link } from "react-router-dom";
import { history } from "../../../../../history";

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
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import "react-phone-input-2/lib/style.css";
import Multiselect from "multiselect-react-dropdown";
import "../../../../../assets/scss/pages/users.scss";

import {
  CreateCustomerList,
  _Get,
  SavePurchaseOrder,
  _PostSave,
} from "../../../../../ApiEndPoint/ApiCalling";
import "../../../../../assets/scss/pages/users.scss";
import UserContext from "../../../../../context/Context";
import { PurchaseGstCalculation } from "./../PurchaseGstCalculation";
import {
  Purchase_Direct_Complete,
  PurchaseProductList_Product,
} from "../../../../../ApiEndPoint/Api";
import { Edit } from "react-feather";
let GrandTotal = [];
let SelectedITems = [];
let SelectedSize = [];
let selectedLandedPrice = [];
let OtherGSTCharges = 0;

const CreatePurchaseInvoice = (args) => {
  const [Index, setIndex] = useState("");
  const [PartyLogin, setPartyLogin] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [ProductList, setProductList] = useState([]);
  const [GSTData, setGSTData] = useState({});
  const [PartyList, setPartyList] = useState([]);
  const [extraCharges, setExtraCharges] = useState({});
  const [PartyId, setPartyId] = useState("");
  const [LandedPrice, setLandedPrice] = useState([]);

  const [Party, setParty] = useState({});
  const [maxGst, setmaxGst] = useState({});
  const [Charges, setCharges] = useState(0);
  const [UserInfo, setUserInfo] = useState({});
  const [orderDate, setOrderDate] = useState("");
  const [modal, setModal] = useState(false);
  const [product, setProduct] = useState([
    {
      productId: "",
      productData: "",
      disCountPercentage: "",
      availableQty: "",
      qty: 1,
      weight: "",
      price: "",
      Size: "",
      unitType: "",
      totalprice: "",
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

  const handleRequredQty = (e, index) => {
    const { name, value } = e.target;
    setIndex(index);
    if (Number(value != 0)) {
      const list = [...product];
      if (name == "GrossQty") {
        list[index]["GrossQty"] = Number(value);
        list[index]["qty"] = Number(list[index]?.secondarySize * Number(value));
      } else {
        list[index][name] = Number(value);
        list[index]["GrossQty"] = Number(
          (list[index]["qty"] / list[index]?.secondarySize).toFixed(3)
        );
      }

      const gstdetails = PurchaseGstCalculation(Party, list, Context, Charges);
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

  const handleSelectionParty = (selectedList, selectedItem) => {
    setPartyId(selectedItem._id);
    setParty(selectedItem);

    const gstdetails = PurchaseGstCalculation(
      selectedItem,
      product,
      Context,
      Charges
    );
    setGSTData(gstdetails);
  };

  // const handleSelection = async (selectedItem, selectedList, index) => {
  const handleSelection = async (selectedList, selectedItem, index) => {
    // let existing = [];
    // if (product) {
    //   existing = product?.filter((ele) => ele?.productId == selectedItem?._id);
    // }
    SelectedITems.push(selectedItem);
    let costPrice = Number(
      (
        selectedItem?.Product_MRP /
        (((100 + Number(Party?.category?.discount ? 0 : 0)) / 100) *
          ((100 + Number(selectedItem?.GSTRate)) / 100))
      ).toFixed(2)
    );
    setProduct((prevProductList) => {
      const updatedProductList = [...prevProductList];
      const updatedProduct = { ...updatedProductList[index] }; // Create a copy of the product at the specified index
      updatedProduct.price = selectedItem?.Product_MRP; // Update the price of the copied product
      updatedProduct.productId = selectedItem?._id;
      updatedProduct.warehouseName = selectedItem?.warehouse?.warehouseName;
      updatedProduct.discount = Party?.category?.discount;
      updatedProduct.HSN_Code = selectedItem?.HSN_Code;
      updatedProduct.productData = selectedItem;
      updatedProduct.basicPrice = costPrice;
      updatedProduct.weight = selectedItem?.weight;
      updatedProduct.primaryUnit = selectedItem?.primaryUnit;
      updatedProduct.secondaryUnit = selectedItem?.secondaryUnit;
      updatedProduct.GrossQty = Number(
        (1 / selectedItem?.secondarySize).toFixed(3)
      );
      updatedProduct.secondarySize = selectedItem?.secondarySize;
      updatedProduct.gstPercentage = selectedItem?.GSTRate;

      updatedProduct.disCountPercentage =
        Party?.Category?.discount && Party?.Category?.discount
          ? Party?.Category?.discount
          : 0;

      updatedProductList[index] = updatedProduct;
      const gstdetails = PurchaseGstCalculation(
        Party,
        updatedProductList,
        Context,
        Charges
      );
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
  };

  useEffect(() => {
    let userdata = JSON.parse(localStorage.getItem("userData"));
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(today.getDate()).padStart(2, "0"); // Day of the month
    const formattedDate = `${year}-${month}-${day}`; // YYYY-MM-DD format
    setOrderDate(formattedDate);
    let findParty = userdata?.rolename?.roleName == "Customer";
    if (findParty) {
      setPartyLogin(true);
      setPartyId(userdata?._id);
    }
    _Get(PurchaseProductList_Product, userdata?.database)
      .then((res) => {
        res?.Product?.forEach((ele) => {
          ele["value"] = ele?._id;
          ele["label"] = ele?.Product_Title;
        });
        setProductList(res?.Product);
      })
      .catch((err) => {
        console.log(err);
      });
    CreateCustomerList(userdata?._id, userdata?.database)
      .then((res) => {
        let value = res?.Customer;
        if (value?.length) {
          setPartyList(value);
        }
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
        availableQty: "",
        qty: 1,
        weight: "",
        Size: "",
        price: "",
        totalprice: "",
        unitQty: "",
        unitType: "",
        unitPriceAfterDiscount: "",
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

    setProduct(newFormValues);
    const gstdetails = PurchaseGstCalculation(
      Party,
      newFormValues,
      Context,
      Charges
    );
    setGSTData(gstdetails);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const gstdetails = PurchaseGstCalculation(Party, product, Context, Charges);

    const fullname = Party?.CompanyName;
    let Product = product?.map((ele) => {
      if (ele?.disCountPercentage > 1) {
        return {
          igstTaxType: gstdetails?.Tax?.IgstTaxType,
          productId: ele?.productId,
          productData: ele?.productData,
          discountPercentage: ele?.disCountPercentage,
          availableQty: ele?.availableQty,
          qty: ele?.qty,
          price: ele?.price,
          totalPrice: ele?.qty * ele?.price,
          primaryUnit: ele?.primaryUnit,
          basicPrice: ele?.basicPrice,
          landedCost: ele?.landedCost,
          secondaryUnit: ele?.secondaryUnit,
          secondarySize: ele?.secondarySize,
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
          productData: ele?.productData,
          discountPercentage: ele?.disCountPercentage,
          availableQty: ele?.availableQty,
          qty: ele?.qty,
          price: ele?.price,
          basicPrice: ele?.basicPrice,
          landedCost: ele?.landedCost,
          totalPrice: ele?.qty * ele?.price,
          primaryUnit: ele?.primaryUnit,
          secondaryUnit: ele?.secondaryUnit,
          secondarySize: ele?.secondarySize,
          sgstRate: ele?.sgstRate,
          cgstRate: ele?.cgstRate,
          gstPercentage: ele?.gstPercentage,
          igstRate: ele?.igstRate,
          grandTotal: ele?.grandTotal,
          taxableAmount: ele?.taxableAmount,
          totalPriceWithDiscount: ele?.grandTotal,
          igstTaxType: gstdetails?.Tax?.IgstTaxType,
        };
      }
    });

    const payload = {
      userId: UserInfo?._id,
      database: UserInfo?.database,
      partyId: PartyId,
      SuperAdmin: Context?.CompanyDetails?.created_by,
      fullName: fullname,
      address: Party?.address,
      grandTotal: Number((gstdetails?.Tax?.GrandTotal).toFixed(2)),
      roundOff: Number((gstdetails?.Tax?.RoundOff).toFixed(2)),

      amount: Number((gstdetails?.Tax?.Amount).toFixed(2)),
      sgstTotal: gstdetails?.Tax?.CgstTotal,
      igstTaxType: gstdetails?.Tax?.IgstTaxType,
      cgstTotal: gstdetails?.Tax?.CgstTotal,
      igstTotal: gstdetails?.Tax?.IgstTotal,
      gstDetails: gstdetails?.gstDetails,
      MobileNo: Party?.contactNumber,
      state: Party?.State,
      city: Party?.City,
      orderItems: Product,
      DateofDelivery: "",
      date: orderDate,
      coolieAndCartage: Charges,
      transportationCost: LandedPrice?.transportationCost,
      labourCost: LandedPrice?.LabourCost,
      localFreight: LandedPrice?.LocalFreight,
      miscellaneousCost: LandedPrice?.MiscellanousCost,
      tax: LandedPrice?.landedTax,
      status: "completed",
      maxGstPercentage: Number(gstdetails?.Tax?.maxGst),
      ...extraCharges,
    };
    if (PartyId) {
      await _PostSave(Purchase_Direct_Complete, payload)
        .then((res) => {
          setLoading(false);
          swal("Purchase Order Completed");
          history.goBack();
        })
        .catch((err) => {
          swal("SomeThing Went Wrong");

          setLoading(false);
          console.log(err);
        });
    } else {
      setLoading(false);
      swal("Error", "Enter Requied Fields", "error");
    }
  };

  const onRemove1 = (selectedList, removedItem, index) => {
    setPartyId("");
  };
  const HandleUpdatePurchase = (e) => {
    let { name, value } = e.target;
    let selectedTransporter = {};
    if (name == "transporterId") {
      selectedTransporter = Party?.assignTransporter?.filter(
        (item) => item?._id?._id == value
      );
      setExtraCharges({
        ...extraCharges,
        transporter: selectedTransporter[0],
        transporterId: value,
      });
    } else {
      setExtraCharges({
        ...extraCharges,
        [name]: value,
      });
    }
  };
  const handleChangePrice = (e, index) => {
    const { name, value } = e.target;
    if (Number(value != 0)) {
      setIndex(index);
      const list = [...product];
      list[index][name] = Number(value);
      if (typeof list[index].gstPercentage == "number") {
        list[index]["price"] = Number(
          (
            Number(value) *
            ((100 + Number(list[index].gstPercentage)) / 100)
          ).toFixed(2)
        );
      } else {
        list[index]["price"] = Number(
          (
            Number(value) *
            ((100 + Number(list[index]?.gstPercentage?.split("+")[0] * 2)) /
              100)
          ).toFixed(2)
        );
      }

      const gstdetails = PurchaseGstCalculation(Party, list, Context, Charges);
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

  const handleAddLandedPrice = (e, index) => {
    let { name, value } = e.target;
    debugger;
    selectedLandedPrice[index] = Number(value);
    let sum = selectedLandedPrice?.reduce((a, b) => a + b, 0);
    let landedTax = Number(((sum * maxGst?.gstPercentage) / 100).toFixed(2));
    setLandedPrice({
      ...LandedPrice,
      ["landedTax"]: landedTax,
      [name]: Number(value),
    });
    let TotalExpenses = Number(
      (sum * (100 + maxGst?.gstPercentage) * 100).toFixed(2)
    );
    let LandedPercentage = Number(
      (TotalExpenses / (GSTData?.Tax?.Amount * 100)).toFixed(2)
    );
    product.forEach((ele) => {
      ele["landedCost"] = Number(
        ((ele?.basicPrice * (100 + Number(LandedPercentage))) / 100).toFixed(2)
      );
    });
  };
  const UpdateClick = async (e) => {
    toggle(e);
  };
  const toggle = (e) => {
    e.preventDefault();
    setModal(!modal);
    product?.forEach((ele) => {
      if (typeof ele?.gstPercentage == "number") {
        return ele;
      } else {
        if (ele?.gstPercentage?.includes("+")) {
          ele["gstPercentage"] = ele?.gstPercentage?.split("+")[0] * 2;
          return ele;
        } else {
          return ele;
        }
      }
    });

    const maxGst = product.reduce(function (prev, current) {
      return prev && prev?.gstPercentage > current?.gstPercentage
        ? prev
        : current;
    });
    setmaxGst(maxGst);
    product.forEach((ele) => {
      ele["landedCost"] = ele?.basicPrice;
    });
  };
  return (
    <div>
      <div>
        <Card>
          <Row className="m-1">
            <Col className="">
              <div>
                <h1 className="">Create Purchase Order</h1>
              </div>
            </Col>
            <Col>
              <Route
                render={({ history }) => (
                  <Button
                    className="btn float-right"
                    color="danger"
                    onClick={() => history.goBack()}>
                    Back
                  </Button>
                )}
              />
            </Col>
          </Row>

          <CardBody>
            {/* <Form className="" onSubmit={submitHandler}> */}
            <Form className="" onSubmit={UpdateClick}>
              <Row>
                {PartyLogin && PartyLogin ? null : (
                  <>
                    <Col className="mb-1" lg="3" md="3" sm="12">
                      <div className="">
                        <Label>
                          Choose Party <span style={{ color: "red" }}> *</span>
                          <span title="Edit Selected Party">
                            {PartyId ? (
                              <>
                                <Link
                                  target="_blank"
                                  to={`/app/SoftNumen/account/CreateCustomer/${PartyId}`}>
                                  <Edit
                                    color="green"
                                    style={{ cursor: "pointer" }}
                                    size={18}
                                    xlinkTitle="Edit Party"
                                  />
                                </Link>
                              </>
                            ) : null}
                          </span>
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
                          displayValue="CompanyName"
                        />
                      </div>
                    </Col>

                    <Col className="mb-1" lg="3" md="3" sm="12">
                      <div className="">
                        <Label>
                          Invoice Date <span style={{ color: "red" }}>*</span>
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
                    <Col className="mb-1" lg="3" md="3" sm="12">
                      <div className="">
                        <Label>Coolie and Cartage</Label>
                        <Input
                          type="text"
                          name="cooliecharges"
                          placeholder="Coolie and Cartage charges"
                          value={Charges}
                          onChange={(e) => {
                            setCharges(Number(e.target.value));
                            const list = [...product];
                            const gstdetails = PurchaseGstCalculation(
                              Party,
                              list,
                              Context,
                              Number(e.target.value)
                            );
                            setGSTData(gstdetails);
                          }}
                        />
                      </div>
                    </Col>
                  </>
                )}
                <Col className="mb-1" lg="4" md="4" sm="12"></Col>
              </Row>
              {product &&
                product?.map((product, index) => (
                  <Row className="" key={index}>
                    <Col className="mb-1">
                      <div className="viewspacebetween">
                        <div className="" style={{ width: "300px" }}>
                          <Label>
                            Choose Product{" "}
                            <span style={{ color: "red" }}> *</span>
                            <span title="Edit Selected Product">
                              {!!product?.productId && product?.productId ? (
                                <>
                                  <Link
                                    target="_blank"
                                    to={`/app/freshlist/house/EditAddProduct/${product?.productId}`}>
                                    <Edit
                                      color="green"
                                      style={{ cursor: "pointer" }}
                                      size={18}
                                    />
                                  </Link>
                                </>
                              ) : null}
                            </span>
                          </Label>

                          <Multiselect
                            className="choseeproduct"
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
                          className="viewspacebetween1"
                          style={{ width: "140px" }}>
                          <Label>Warehouse</Label>
                          <Input
                            readOnly
                            type="text"
                            name="warehouseName"
                            placeholder="warehouseName"
                            value={product?.warehouseName}
                            // onChange={(e) => handleRequredQty(e, index)}
                          />
                        </div>
                        <div
                          className="viewspacebetween1"
                          style={{ width: "120px" }}>
                          <Label>HSN</Label>
                          <Input
                            readOnly
                            type="text"
                            name="HSN_Code"
                            placeholder="HSN_Code"
                            required
                            value={product?.HSN_Code}
                            // onChange={(e) => handleRequredQty(e, index)}
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
                          className="viewspacebetween1"
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
                          className="viewspacebetween1"
                          style={{ width: "90px" }}>
                          <Label>Gross Qty</Label>
                          <Input
                            xtype="number"
                            name="GrossQty"
                            placeholder="Gross Qty"
                            value={product?.GrossQty}
                            onChange={(e) => handleRequredQty(e, index)}
                          />
                        </div>

                        <div
                          className="viewspacebetween1"
                          style={{ width: "90px" }}>
                          <Label>Net Qty</Label>
                          <Input
                            type="number"
                            name="qty"
                            min={1}
                            placeholder="qty"
                            required
                            value={product?.qty}
                            onChange={(e) => handleRequredQty(e, index)}
                          />
                        </div>
                        <div
                          className="viewspacebetween1"
                          style={{ width: "90px" }}>
                          <Label>Net Unit</Label>
                          <Input
                            readOnly
                            type="text"
                            name="primaryUnit"
                            // min={0}
                            placeholder="Net Unit"
                            required
                            value={product?.primaryUnit}
                            // onChange={(e) => handleRequredQty(e, index)}
                          />
                        </div>
                        {/* <div
                          className="viewspacebetween1"
                          style={{ width: "90px" }}>
                          <Label>Sales Price</Label>
                          <Input
                            type="number"
                            readOnly
                            name="price"
                            disabled
                            placeholder="Price"
                            value={product.price}
                          />
                        </div> */}
                        {/* <div className="viewspacebetween1" style={{width:'90px'}}>
                        <Label>Dis. %</Label>
                        <Input
                          type="number"
                          name="price"
                          readOnly
                          placeholder="Discount %"
                          value={product.disCountPercentage}
                        />
                      </div> */}
                        <div
                          className="viewspacebetween1"
                          style={{ width: "60px" }}>
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
                          className="viewspacebetween1"
                          style={{ width: "120px" }}>
                          <Label>Basic Price</Label>
                          <Input
                            type="number"
                            name="basicPrice"
                            min={1}
                            step="0.01"
                            placeholder="Basic Price"
                            onChange={(e) => handleChangePrice(e, index)}
                            value={product?.basicPrice}
                          />
                        </div>
                        <div
                          className="viewspacebetween1"
                          style={{ width: "120px" }}>
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
                    {/* <Col className="mb-1">
                      <div className="">
                        <Label>Basic Total</Label>
                        <Input
                          type="number"
                          name="taxableAmount"
                         readOnly
                          placeholder="taxle Amount"
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
                        <Label>Total Price</Label>
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
                            style={{ padding: "16px 16px" }}
                            color="danger"
                            className="button remove cancel"
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
                <Col>
                  <div className="btnStyle d-flex justify-content-end">
                    <Button
                      className="ml-1 mb-1"
                      color="primary"
                      type="button"
                      size="sm"
                      onClick={() => addMoreProduct()}>
                      +
                    </Button>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg="6" md="6" sm="6">
                  <Row>
                    <Col className="mb-1" lg="6" md="6" sm="12">
                      <div className="">
                        <Label>Invoice Number</Label>
                        <Input
                          required
                          type="text"
                          value={extraCharges?.invoiceId}
                          name="invoiceId"
                          placeholder="Invoice Id No."
                          onChange={HandleUpdatePurchase}
                        />
                      </div>
                    </Col>
                    <Col className="mb-1" lg="6" md="6" sm="12">
                      <div className="">
                        <Label>Builty Number</Label>
                        <Input
                          required
                          type="text"
                          value={extraCharges?.BuiltyNumber}
                          name="BuiltyNumber"
                          onChange={HandleUpdatePurchase}
                          placeholder="Builty Number"
                        />
                      </div>
                    </Col>
                    <Col className="mb-1" lg="6" md="6" sm="12">
                      <div className="">
                        <Label>Dispatch Date</Label>
                        <Input
                          required
                          type="date"
                          onChange={HandleUpdatePurchase}
                          value={extraCharges?.DispatchDate}
                          name="DispatchDate"
                        />
                      </div>
                    </Col>
                    <Col className="mb-1" lg="6" md="6" sm="12">
                      <div className="">
                        <Label>No of Packages</Label>
                        <Input
                          required
                          type="number"
                          value={extraCharges?.NoOfPackage}
                          placeholder="Number of Packages"
                          onChange={HandleUpdatePurchase}
                          name="NoOfPackage"
                        />
                      </div>
                    </Col>
                    <Col className="mb-1" lg="6" md="6" sm="12">
                      <div className="">
                        <Label>Transporter</Label>
                        <CustomInput
                          // required
                          type="select"
                          value={extraCharges?.transporterId}
                          onChange={HandleUpdatePurchase}
                          name="transporterId">
                          <option value="">----Select----</option>
                          {Party?.assignTransporter?.length && (
                            <>
                              {Party?.assignTransporter?.map((ele, i) => (
                                <option key={i} value={ele?._id?._id}>
                                  {ele?.companyName}
                                </option>
                              ))}
                            </>
                          )}
                        </CustomInput>
                      </div>
                    </Col>
                    <Col className="mb-1" lg="6" md="6" sm="12">
                      <div className="">
                        <Label>Vehicle Number</Label>
                        <Input
                          required
                          type="text"
                          value={extraCharges?.vehicleNo}
                          placeholder="Vehicle Number"
                          onChange={HandleUpdatePurchase}
                          name="vehicleNo"
                        />
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col className="mb-1 mt-1" lg="6" md="6" sm="6">
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
                      <li>
                        <div className="totalclas">
                          <span className="">Charges:</span>
                          <span className="">
                            {!!Charges && Charges ? Charges.toFixed(2) : 0}
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
                          <Button
                            color="primary"
                            type="submit"
                            className="mt-2">
                            Submit
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  )}
                </>
              ) : (
                <Row>
                  <Col>
                    <div className="d-flex justify-content-center">
                      <Button color="secondary" className="mt-2">
                        Loading...
                      </Button>
                    </div>
                  </Col>
                </Row>
              )}
            </Form>
          </CardBody>
        </Card>
      </div>
      <Modal size="lg" isOpen={modal} toggle={toggle} {...args}>
        <ModalHeader toggle={toggle}>Update</ModalHeader>
        <ModalBody>
          <div className="p-2">
            <Form onSubmit={submitHandler}>
              <div>
                <div className="d-flex justify-content-center p-2">
                  <h4>Update Landed Price</h4>
                </div>
                <Row className="mt-2">
                  <Col lg="4" md="6" sm="6" className="mb-1">
                    <Label>Transportation Cost</Label>
                    <Input
                      required
                      min={0}
                      type="number"
                      name="transportationCost"
                      value={
                        LandedPrice?.transportationCost
                          ? LandedPrice?.transportationCost
                          : 0
                      }
                      onChange={(e) => handleAddLandedPrice(e, 0)}
                      placeholder="Transportation cost"
                    />
                  </Col>
                  <Col lg="4" md="6" sm="6" className="mb-1">
                    <Label>Labour Cost</Label>
                    <Input
                      required
                      min={0}
                      type="number"
                      name="LabourCost"
                      onChange={(e) => handleAddLandedPrice(e, 1)}
                      value={
                        LandedPrice?.LabourCost ? LandedPrice?.LabourCost : 0
                      }
                      placeholder="Labour Cost"
                    />
                  </Col>
                  <Col lg="4" md="6" sm="6" className="mb-1">
                    <Label>Local Freight</Label>
                    <Input
                      required
                      min={0}
                      type="number"
                      value={
                        LandedPrice?.LocalFreight
                          ? LandedPrice?.LocalFreight
                          : 0
                      }
                      name="LocalFreight"
                      onChange={(e) => handleAddLandedPrice(e, 2)}
                      placeholder="LocalFreight cost"
                    />
                  </Col>
                  <Col lg="4" md="6" sm="6" className="mb-1">
                    <Label>Miscellaneous Cost</Label>
                    <Input
                      required
                      min={0}
                      type="number"
                      name="MiscellanousCost"
                      value={
                        LandedPrice?.MiscellanousCost
                          ? LandedPrice?.MiscellanousCost
                          : 0
                      }
                      onChange={(e) => handleAddLandedPrice(e, 3)}
                      placeholder="MiscellanousCost cost"
                    />
                  </Col>
                  <Col lg="4" md="6" sm="6" className="mb-1">
                    <Label>Tax</Label>
                    <Input
                      readOnly
                      type="number"
                      name="landedTax"
                      value={LandedPrice?.landedTax}
                      onChange={(e) => handleAddLandedPrice(e, 4)}
                      placeholder="Tax"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col lg="12" md="12" sm="12" className="">
                    <div className="d-flex justify-content-end">
                      <h6>Sub-Total</h6> :
                      <h6>
                        {(
                          (LandedPrice?.transportationCost ?? 0) +
                          (LandedPrice?.MiscellanousCost ?? 0) +
                          (LandedPrice?.LocalFreight ?? 0) +
                          (LandedPrice?.LabourCost ?? 0)
                        ).toFixed(2)}
                      </h6>
                    </div>
                  </Col>
                  <Col lg="12" md="12" sm="12" className="">
                    <div className="d-flex justify-content-end">
                      <h6>Tax</h6> :
                      <h6>
                        {LandedPrice?.landedTax > 0
                          ? LandedPrice?.landedTax?.toFixed(2)
                          : 0.0}
                      </h6>
                    </div>
                  </Col>
                  <Col lg="12" md="12" sm="12" className="mb-1">
                    <hr />
                    <div className="d-flex justify-content-end">
                      <h6>Total</h6> :
                      <h6>
                        {" "}
                        {(
                          (LandedPrice?.transportationCost ?? 0) +
                          (LandedPrice?.landedTax ?? 0) +
                          (LandedPrice?.MiscellanousCost ?? 0) +
                          (LandedPrice?.LocalFreight ?? 0) +
                          (LandedPrice?.LabourCost ?? 0)
                        ).toFixed(2)}
                        {/* {(
                          LandedPrice?.transportationCost +
                          LandedPrice?.landedTax +
                          LandedPrice?.MiscellanousCost +
                          LandedPrice?.LocalFreight +
                          LandedPrice?.LabourCost
                        ).toFixed(2)} */}
                      </h6>
                    </div>
                  </Col>
                </Row>
                <Row>
                  {!Loading ? (
                    <>
                      <Col>
                        <div className="d-flex justify-content-center">
                          <Button
                            color="primary"
                            type="submit"
                            className="mt-2">
                            Submit
                          </Button>
                        </div>
                      </Col>
                    </>
                  ) : (
                    <>
                      <Col>
                        <div className="d-flex justify-content-center">
                          <Button color="secondary" className="mt-2">
                            Loading...
                          </Button>
                        </div>
                      </Col>
                    </>
                  )}
                </Row>
              </div>
            </Form>
          </div>
        </ModalBody>
        {/* <ModalFooter>
          <Button color="primary" onClick={toggle}>
            Do Something
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter> */}
      </Modal>
    </div>
  );
};
export default CreatePurchaseInvoice;
