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
  Ordercashbook,
} from "../../../../ApiEndPoint/ApiCalling";
import "../../../../assets/scss/pages/users.scss";
import { WareHouse_Current_Stock } from "../../../../ApiEndPoint/Api";
import UserContext from "../../../../context/Context";
import swal from "sweetalert";
import { GstCalculation } from "../order/GstCalculation";
let GrandTotal = [];
let SelectedITems = [];
let SelectedSize = [];
const CreateOrder = (args) => {
  const [Index, setIndex] = useState("");
  const [CustomerLimit, setCustomerLimit] = useState(0);
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

        if (amt < CustomerLimit) {
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
          // console.log(list);

          setProduct(list);
        } else {
          swal("Error", `Your Max Limit is ${CustomerLimit}`);
        }
      }
    }
  };

  const handleSelectionParty = async (selectedList, selectedItem) => {
    setPartyId(selectedItem._id);
    setParty(selectedItem);

    let URL = "order/check-party-limit/";
    await _Get(URL, selectedItem._id)
      .then((res) => {
        setCustomerLimit(Number(res?.CustomerLimit));
        swal(`${res?.message}`);
        console.log(res?.CustomerLimit);
      })
      .catch((err) => {
        console.log(err);
      });

    const gstdetails = GstCalculation(selectedItem, product, Context);
    setGSTData(gstdetails);
  };

  const handleSelection = async (selectedList, selectedItem, index) => {
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

    let URl = `${WareHouse_Current_Stock}${selectedItem?.warehouse?._id}/`;
    var Stock;
    await _Get(URl, selectedItem?._id)
      .then((res) => {
        console.log(res?.currentStock);
        Stock = res?.currentStock;
      })
      .catch((err) => {
        console.log(err);
        swal("something went Wrong");
      });

    setProduct((prevProductList) => {
      const updatedProductList = [...prevProductList];
      const updatedProduct = { ...updatedProductList[index] }; // Create a copy of the product at the specified index
      updatedProduct.price = selectedItem?.Product_MRP; // Update the price of the copied product
      updatedProduct.productId = selectedItem?._id;
      updatedProduct.productData = selectedItem;
      updatedProduct.primaryUnit = selectedItem?.primaryUnit;
      updatedProduct.secondaryUnit = selectedItem?.secondaryUnit;
      updatedProduct.secondarySize = selectedItem?.secondarySize;
      updatedProduct.HSN_Code = selectedItem?.HSN_Code;
      updatedProduct.basicPrice = costPrice;
      updatedProduct.disCountPercentage =
        Party?.Category?.discount && Party?.Category?.discount
          ? Party?.Category?.discount
          : 0;
      updatedProduct.availableQty = Stock?.currentStock;
     
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

      // Replace the product at the specified index with the updated one
      return updatedProductList; // Return the updated product list to set the state
    });
  };

  const handleSelectionUnit = (selectedList, selectedItem, index) => {
    SelectedSize.push(selectedItem);
    setProduct((prevProductList) => {
      const updatedUnitList = [...prevProductList];
      const updatedProduct = { ...updatedUnitList[index] }; // Create a copy of the product at the specified index
      updatedProduct.Size = selectedItem.unitQty;
      updatedProduct.unitType = selectedItem.primaryUnit;
      updatedUnitList[index] = updatedProduct;
      let myarr = prevProductList?.map((ele, i) => {
        updatedUnitList[index]["totalprice"] =
          ele?.qty * ele.price * SelectedSize[i]?.unitQty;
        let indextotal = ele?.price * ele.qty * SelectedSize[i]?.unitQty;
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
    ProductListView(userdata?._id, userdata?.database)
      .then((res) => {
        let product = res?.Product?.filter(
          (ele) => ele?.addProductType == "Product"
        );
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
    // UnitListView(userdata?._id, userdata?.database)
    //   .then((res) => {
    //     setUnitList(res.Unit);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
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

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    if (GSTData?.Tax?.GrandTotal < CustomerLimit) {
      const gstdetails = GstCalculation(Party, product, Context);
      let Product = product?.map((ele) => {
        if (ele?.disCountPercentage > 1) {
          return {
            productId: ele?.productId,
            productData: ele?.productData,
            discountPercentage: ele?.disCountPercentage,
            availableQty: ele?.availableQty,
            qty: ele?.qty,
            price: ele?.price,
            Size: ele?.Size,
            unitQty: ele?.Size,
            unitType: ele?.unitType,
            totalPrice: ele?.totalprice,
            sgstRate: ele?.sgstRate,
            cgstRate: ele?.cgstRate,
            gstPercentage: ele?.gstPercentage,
            igstRate: ele?.igstRate,
            grandTotal: ele?.grandTotal,
            taxableAmount: ele?.taxableAmount,
            totalPriceWithDiscount: Number(
              (
                (ele?.totalprice * (100 - ele?.disCountPercentage)) /
                100
              ).toFixed(2)
            ),
          };
        } else {
          return {
            productId: ele?.productId,
            productData: ele?.productData,
            discountPercentage: ele?.disCountPercentage,
            availableQty: ele?.availableQty,
            qty: ele?.qty,
            price: ele?.price,
            Size: ele?.Size,
            totalPrice: ele?.totalprice,
            sgstRate: ele?.sgstRate,
            cgstRate: ele?.cgstRate,
            gstPercentage: ele?.gstPercentage,
            igstRate: ele?.igstRate,
            grandTotal: ele?.grandTotal,
            taxableAmount: ele?.taxableAmount,
            unitQty: ele?.Size,
            unitType: ele?.unitType,
            totalPriceWithDiscount: ele?.totalprice,
          };
        }
      });
      const fullname = Party?.firstName + " " + Party?.lastName;
      const payload = {
        userId: UserInfo?._id,
        database: UserInfo?.database,
        partyId: PartyId,
        discountPercentage: Party?.Category ? Party?.Category?.discount : 0,
        SuperAdmin: Context?.CompanyDetails?.created_by,
        fullName: fullname,
        address: Party?.address,
        grandTotal: Number((gstdetails?.Tax?.GrandTotal).toFixed(2)),
        roundOff: Number(
          (gstdetails?.Tax?.GrandTotal - gstdetails?.Tax?.RoundOff).toFixed(2)
        ),
        amount: Number((gstdetails?.Tax?.Amount).toFixed(2)),
        sgstTotal: gstdetails?.Tax?.CgstTotal,
        igstTaxType: gstdetails?.Tax?.IgstTaxType,
        cgstTotal: gstdetails?.Tax?.CgstTotal,
        igstTotal: gstdetails?.Tax?.IgstTotal,
        gstDetails: gstdetails?.gstDetails,
        MobileNo: Party?.contactNumber,
        pincode: Party?.pincode,
        state: Party?.State,
        city: Party?.City,
        orderItems: Product,
        DateofDelivery: dateofDelivery,
      };

      Ordercashbook(payload)
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
      setLoading(false);

      swal("Error", `Your Max Limit is ${CustomerLimit}`);
    }
  };

  const onRemove1 = (selectedList, removedItem, index) => {
    console.log(selectedList);
  };
  return (
    <div>
      <div>
        <Card>
          <Row className="m-2">
            <Col className="">
              <div>
                <h1 className="">Add Order By Cash</h1>
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
            <Form className="m-1" onSubmit={submitHandler}>
              <Row>
                {PartyLogin && PartyLogin ? null : (
                  <>
                    <Col className="mb-1" lg="4" md="4" sm="12">
                      <div className="">
                        <Label>Choose Party</Label>

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
                    <th> SGST Amount </th>
                    <th> CGST Amount</th>
                    <th> Total Price</th>
                    <th> Action</th>
                  </tr>
                </thead>
                <tbody>
                  {product &&
                    product?.map((product, index) => (
                      <tr key={index}>
                        <th scope="row">1</th>
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
                        <td>Table cell</td>
                        <td>Table cell</td>
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
              {product &&
                product?.map((product, index) => (
                  <Row className="" key={index}>
                    <Col className="mb-1" lg="3" sm="12" md="3">
                      <div className="">
                        <Label>Choose Product </Label>
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
                    </Col>
                    <Col lg="1" sm="3" xs="3" className="mb-1">
                      <div className="">
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
                    </Col>
                    <Col lg="1" sm="3" xs="3" className="mb-1">
                      <div className="">
                        <Label>Gross Unit</Label>
                        <Input
                          type="text"
                          name="secondaryUnit"
                          readOnly
                          placeholder="Gross Unit"
                          value={product.secondaryUnit}
                        />
                      </div>
                    </Col>
                    <Col lg="1" sm="3" xs="3" className="mb-1">
                      <div className="">
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
                          // onChange={(e) => handleRequredQty(e, index)}
                        />
                      </div>
                    </Col>
                    <Col lg="1" sm="3" xs="3" className="mb-1">
                      <div className="">
                        <Label>Net Qty</Label>
                        <Input
                          type="number"
                          name="qty"
                          min={0}
                          placeholder="qty"
                          required
                          value={product?.qty}
                          onChange={(e) =>
                            handleRequredQty(e, index, product?.availableQty)
                          }
                        />
                      </div>
                    </Col>
                    <Col lg="1" sm="3" xs="3" className="mb-1">
                      <div className="">
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
                        <Label>Unit</Label> */}
                    {/* <Input type="text" value={product?.Size} readOnly /> */}
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
                    {/* </div>
                    </Col> */}
                    <Col lg="1" sm="3" xs="3" className="mb-1">
                      <div className="">
                        <Label>Sales Price</Label>
                        <Input
                          type="number"
                          readOnly
                          name="price"
                          disabled
                          placeholder="Price"
                          value={product.price}
                        />
                      </div>
                    </Col>
                    {/* <Col className="mb-1">
                      <div className="">
                        <Label>HSN Code</Label>
                        <Input type="text" value={product?.HSN_Code} readOnly />
                      </div>
                    </Col> */}
                    <Col lg="1" sm="3" xs="3" className="mb-1">
                      <div className="">
                        <Label>Dis. %</Label>
                        <Input
                          type="number"
                          name="price"
                          readOnly
                          placeholder="Discount %"
                          value={product.disCountPercentage}
                        />
                      </div>
                    </Col>

                    <Col lg="1" sm="3" xs="3" className="mb-1">
                      <div className="">
                        <Label>Tax %</Label>
                        <Input
                          type="text"
                          name="gstPercentage"
                          disabled
                          placeholder="GST Percentage %"
                          value={product.gstPercentage}
                        />
                      </div>
                    </Col>
                    <Col lg="1" sm="3" xs="3" className="mb-1">
                      <div className="">
                        <Label>Basic Price</Label>
                        <Input
                          type="number"
                          name="basicPrice"
                          readOnly
                          placeholder="Basic Price"
                          value={product.basicPrice}
                        />
                      </div>
                    </Col>
                    <Col lg="1" sm="3" xs="3" className="mb-1">
                      <div className="">
                        <Label>Basic Total</Label>
                        <Input
                          type="number"
                          name="taxableAmount"
                          disabled
                          placeholder="taxle Amount"
                          value={product.taxableAmount}
                        />
                      </div>
                    </Col>
                    {/* <Col className="mb-1">
                      <div className="">
                        <Label>Qty</Label>
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
                      </div>
                    </Col>

                    <Col className="mb-1">
                      <div className="">
                        <Label>Dis(%)</Label>
                        <Input
                          type="text"
                          name="disCountPercentage"
                          disabled
                          placeholder="Discount Percentage"
                          value={product?.disCountPercentage}
                        />
                      </div>
                    </Col> */}
                    {/* <Col className="mb-1">
                      <div className="">
                        <Label>Price</Label>
                        <Input
                          type="number"
                          name="price"
                          disabled
                          placeholder="Price"
                          value={product.price}
                        />
                      </div>
                    </Col> */}

                    {/* <Col className="mb-1">
                      <div className="">
                        <Label>GST %</Label>
                        <Input
                          type="text"
                          name="gstPercentage"
                          disabled
                          placeholder="GST Percentage %"
                          value={product.gstPercentage}
                        />
                      </div>
                    </Col>
                    <Col className="mb-1">
                      <div className="">
                        <Label>Amount</Label>
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
                            color="danger"
                            className="button remove pt-1"
                            size="sm"
                            onClick={() => removeMoreProduct(index)}>
                            Remove
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
              </Row>
              {!Loading && !Loading ? (
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
              ) : (
                <Row>
                  <Col>
                    <div className="d-flex justify-content-center">
                      <Button.Ripple color="secondary" className="mt-2">
                        Loading...
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
