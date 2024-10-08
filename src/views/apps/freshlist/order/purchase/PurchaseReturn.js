// import React, { useEffect, useState, useContext } from "react";
// import {
//   Card,
//   CardBody,
//   Col,
//   Form,
//   Row,
//   Input,
//   Label,
//   Button,
// } from "reactstrap";
// import "react-phone-input-2/lib/style.css";
// import { useParams, useLocation, useHistory } from "react-router-dom";

// import "../../../../../assets/scss/pages/users.scss";
// import {
//   ProductListView,
//   PurchaseReturn,
//   Create_Sales_personList,
// } from "../../../../../ApiEndPoint/ApiCalling";
// import "../../../../../assets/scss/pages/users.scss";
// import { Route } from "react-router-dom";

// const PurchaseReturns = args => {
//   const [Index, setIndex] = useState("");
//   const [error, setError] = useState("");
//   const [ProductList, setProductList] = useState([]);
//   const [grandTotalAmt, setGrandTotalAmt] = useState(0);
//   const [Editdata, setEditdata] = useState({});
//   const [UserInfo, setUserInfo] = useState({});
//   const [SalesPersonList, setSalesPersonList] = useState([]);
//   const Params = useParams();
//   const location = useLocation();
//   const history = useHistory();

//   const [OrderedListData, setOrderedListData] = useState([
//     {
//       productId: "",
//       Product_Title: "",
//       Qty_Sales: "",
//       Qty_Return: 0,
//       Product_Price: "",
//     },
//   ]);

//   const handleProductChangeProduct = (e, index) => {
//     setIndex(index);
//     const { name, value } = e.target;
//     const list = [...OrderedListData];
//     list[index][name] = value;
//     setOrderedListData(list);
//     let x = list?.map((ele) => {
//       return Number(ele?.price * ele?.returnQty);
//     });
//     let grandTotal = x?.reduce((a, b) => a + b, 0);

//     setGrandTotalAmt(grandTotal);
//   };
//   useEffect(() => {
//     let getFromLocalData = JSON.parse(
//       localStorage.getItem("OrderList")
//     ).orderItems;
//     if (location?.state) {
//       setOrderedListData(location?.state.orderItems);
//       console.log("test", location?.state.orderItems);
//       let grandTotal = location?.state.orderItems?.reduce(
//         (a, b) => a + b.productId?.Product_MRP,
//         0
//       );
//       setGrandTotalAmt(grandTotal);
//       localStorage.setItem("EditoneProduct", location?.state);
//       setEditdata(location?.state);
//     } else {
//       // let mydata = localStorage.getItem("EditoneProduct");
//       setOrderedListData(getFromLocalData);
//       let grandTotal = location?.state.orderItems?.reduce(
//         (a, b) => a + b.productId?.Product_MRP,
//         0
//       );
//       setGrandTotalAmt(grandTotal);
//     }
//   }, []);

//   useEffect(() => {
//     Create_Sales_personList()
//       .then((res) => {
//         setSalesPersonList(res?.SalesPerson);
//       })
//       .catch((err) => console.log(err));
//     let userdata = JSON.parse(localStorage.getItem("userData"));

//     ProductListView(userdata?._id, userdata?.database)
//       .then((res) => {
//         setProductList(res?.Product);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, []);
//   useEffect(() => {
//     const userInfo = JSON.parse(localStorage.getItem("userData"));
//     setUserInfo(userInfo);
//   }, []);

//   const submitHandler = (e) => {
//     e.preventDefault();
//     console.log(OrderedListData);
//     let userData = JSON.parse(localStorage.getItem("userData"));
//     console.log(userData);

//     let myarr = OrderedListData?.map((ele, i) => {
//       return {
//         productId: ele?.productId?._id,
//         Qty_Sales: ele?.qty,
//         Qty_Return: Number(ele?.returnQty),
//         Product_Price: ele?.price,
//       };
//     });

//     let payload = {
//       partyId: location?.state?.partyId?._id,
//       userId: userData?._id,
//       returnItems: myarr,
//       mobileNumber: userData?.mobileNumber,
//       email: userData.email,
//       Return_amount: grandTotalAmt,
//       orderId: location?.state?._id,
//       created_by: userData?._id,
//     };

//     if (error) {
//       swal("Error occured while Entering Details");
//     } else {
//
//     }
//   };

//   return (
//     <div>
//       <div>
//         <Card>
//           <Row className="m-2">
//             <Col className="">
//               <div>
//                 <h1 className="">Purchase Return</h1>
//               </div>
//             </Col>
//             <Col>
//               <div className="float-right">
//                 <Route
//                   render={({ history }) => (
//                     <Button
//                       style={{ cursor: "pointer" }}
//                       className="float-right mr-1"
//                       color="danger"
//                       size="sm"
//                       onClick={() => history.goBack()}
//                     >
//                       Back
//                     </Button>
//                   )}
//                 />
//               </div>
//             </Col>
//           </Row>

//           <CardBody>
//             <Form className="m-1" onSubmit={submitHandler}>
//               {OrderedListData &&
//                 OrderedListData?.map((item, index) => {
//                   console.log(item);
//                   return (
//                     <Row className="" key={index}>
//                       <Col className="mb-1" lg="2" md="2" sm="12">
//                         <div className="">
//                           <Label>Product Name</Label>
//                           <Input
//                             type="text"
//                             name="Product_Title"
//                             readOnly
//                             placeholder="Product Name"
//                             value={item?.productId?.Product_Title}
//                           />
//                         </div>
//                       </Col>
//                       <Col className="mb-1" lg="2" md="2" sm="12">
//                         <div className="">
//                           <Label>Price</Label>
//                           <Input
//                             type="text"
//                             name="price"
//                             readOnly
//                             placeholder="Price"
//                             value={item?.productId?.Product_MRP}
//                           />
//                         </div>
//                       </Col>
//                       <Col className="mb-1" lg="2" md="2" sm="12">
//                         <div className="">
//                           <Label>Purchased Quantity</Label>
//                           <Input
//                             type="number"
//                             readOnly
//                             name="qty"
//                             placeholder="Req_Qty"
//                             value={item?.qty}
//                             onChange={e => handleProductChangeProduct(e, index)}
//                           />
//                         </div>
//                       </Col>
//                       <Col className="mb-1" lg="2" md="2" sm="12">
//                         <div className="">
//                           <Label>Return Quantity</Label>
//                           <Input
//                             type="number"
//                             name="returnQty"
//                             placeholder="Return Quantity"
//                             value={OrderedListData.returnQty}
//                             onChange={e => handleProductChangeProduct(e, index)}
//                           />
//                         </div>
//                       </Col>
//                     </Row>
//                   );
//                 })}
//               <Row>
//                 <Col className="mb-1" lg="12" md="12" sm="12">
//                   <div className=" d-flex justify-content-end">
//                     <Label className="pr-5">
//                       Grand Total :{" "}
//                       <stron>{grandTotalAmt && grandTotalAmt}</stron>
//                     </Label>
//                   </div>
//                 </Col>
//               </Row>
//               <Row>
//                 <Col>
//                   <div className="d-flex justify-content-center">
//                     <Button.Ripple
//                       color="primary"
//                       type="submit"
//                       className="mt-2"
//                     >
//                       Submit
//                     </Button.Ripple>
//                   </div>
//                 </Col>
//               </Row>
//             </Form>
//           </CardBody>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default PurchaseReturns;

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
} from "reactstrap";
import "react-phone-input-2/lib/style.css";
import { useParams, useLocation } from "react-router-dom";
import "../../../../../assets/scss/pages/users.scss";
import {
  CreateCustomerList,
  _Get,
  _PostSave,
} from "../../../../../ApiEndPoint/ApiCalling";
import "../../../../../assets/scss/pages/users.scss";
import { Route } from "react-router-dom";
import swal from "sweetalert";
import UserContext from "../../../../../context/Context";
import { PurchaseReturnGstCalculation } from "./../PurchaseReturnGstCalculation";
import { useHistory } from "react-router-dom";
import {
  Place_ORder_Return_Product,
  Purchase_OrderViewOne,
} from "../../../../../ApiEndPoint/Api";

const PurchaseReturn = (args) => {
  const Context = useContext(UserContext);
  const [Loading, setLoading] = useState(false);
  const [Index, setIndex] = useState(-1);
  const [Party, setParty] = useState({});
  const [PartyList, setPartyList] = useState([]);

  const [error, setError] = useState("");
  const [grandTotalAmt, setGrandTotalAmt] = useState(0);
  const [Editdata, setEditdata] = useState({});
  const [UserInfo, setUserInfo] = useState({});
  const [GSTData, setGSTData] = useState({});
  const [userName, setUserName] = useState("");
  const Params = useParams();
  const location = useLocation();
  let History = useHistory();

  const [product, setProduct] = useState([
    {
      productId: "",
      productData: "",
      discountPercentage: "",
      availableQty: "",
      qty: 1,
      Size: "",
      price: "",
      unitType: "",
      product: "",
      Purchase_qty: "",
      grandTotal: "",
      totalprice: "",
      unitPriceAfterDiscount: "",
      totalprice: "",
      taxableAmount: "",
      gstPercentage: "",
      sgstRate: "",
      cgstRate: "",
      igstRate: "",
    },
  ]);
  const handleChange = (e) => {
    console.log(e.target.value);
    setUserName(e.target.value);
  };
  const handleProductChangeProduct = (e, index) => {
    setIndex(index);
    let list = product;

    const { name, value } = e.target;
    let orderitem = product?.orderItems;
    list.orderItems[index][name] = Number(value);
    let amt = 0;
    if (list?.orderItems?.length > 0) {
      const x = list?.orderItems?.map((val, i) => {
        list.orderItems[i]["productData"] = val?.productId;
        return val.qty * val.price;
      });
      amt = x.reduce((a, b) => a + b);
    }

    const gstdetails = PurchaseReturnGstCalculation(
      Party,
      list.orderItems,
      Context
    );
    setGSTData(gstdetails);

    list.orderItems[index]["taxableAmount"] =
      gstdetails?.gstDetails[index]?.taxable;
    list.orderItems[index]["sgstRate"] =
      gstdetails?.gstDetails[index]?.sgstRate;
    list.orderItems[index]["cgstRate"] =
      gstdetails?.gstDetails[index]?.cgstRate;
    list.orderItems[index]["igstRate"] =
      gstdetails?.gstDetails[index]?.igstRate;
    list.orderItems[index]["grandTotal"] =
      gstdetails?.gstDetails[index]?.grandTotal;
    list.orderItems[index]["gstPercentage"] =
      gstdetails?.gstDetails[index]?.gstPercentage;
    list.orderItems[index]["discountPercentage"] =
      gstdetails?.gstDetails[index]?.discountPercentage;
    // console.log(list);
    setProduct(list);
    setGrandTotalAmt(amt);
  };

  useEffect(() => {
    let userdata = JSON.parse(localStorage.getItem("userData"));

    (async () => {
      // console.log(Params?.id);
      await _Get(Purchase_OrderViewOne, Params?.id)
        .then((res) => {
          // let All = { ...res?.orderHistory };

          let data = { ...res?.orderHistory };

          let orderItems = res?.orderHistory?.orderItems?.map((ele, i) => {
            return { ...ele, Purchase_qty: ele?.qty, qty: 0 };
          });
          if (data?.orderItems) {
            delete data?.orderItems;
          }
          let wholeData = { ...data, orderItems };
          let URL = "order/check-party-limit/";
          // _Get(URL, res?.orderHistory?.partyId?._id)
          //   .then((res) => {
          //     setCustomerLimit(Number(res?.CustomerLimit));
          //     // swal(`${res?.message}`);
          //     console.log(res?.CustomerLimit);
          //   })
          //   .catch((err) => {
          //     console.log(err);
          //   });
          setProduct(wholeData);
          setEditdata(wholeData);
          // setProduct(wholeData);
          let value = data;
          (async () => {
            let userdata = JSON.parse(localStorage.getItem("userData"));

            await CreateCustomerList(userdata?._id, userdata?.database)
              .then((res) => {
                let data = res?.Customer;
                if (data?.length) {
                  setPartyList(data);
                  let selectedParty = data?.filter(
                    (ele) => ele?._id == value?.partyId?._id
                  );
                  setParty(selectedParty[0]);
                }
              })
              .catch((err) => {
                console.log(err);
              });
          })();

          let Tax = {
            Amount: value?.amount,
            CgstTotal: value?.cgstTotal,
            GrandTotal: value?.grandTotal,
            IgstTaxType: value?.igstTaxType == 1 ? true : false,
            IgstTotal: value?.igstTotal,
            RoundOff: value?.roundOff,
            SgstTotal: value?.sgstTotal,
          };
          let payload = {
            Tax: Tax,
          };
          setGSTData(payload);
          setUserName(data.fullName);
          // setEditdata(data);
          setGrandTotalAmt(data?.grandTotal);
        })
        .catch((err) => {
          console.log(err);
        });
    })();
  }, []);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userData"));
    setUserInfo(userInfo);
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    // if (GSTData?.Tax?.GrandTotal < CustomerLimit) {
    const gstdetails = PurchaseReturnGstCalculation(
      Party,
      product?.orderItems,
      Context
    );
    let Product = product?.orderItems?.map((ele) => {
      if (ele?.discountPercentage > 1) {
        return {
          productId: ele?.productId?._id,
          discountPercentage: ele?.discountPercentage,
          qty: ele?.Purchase_qty,
          price: ele?.price,
          // Size: ele?.Size,
          qtyPurchase: ele?.Purchase_qty,
          qtyReturn: Number(ele?.qty),
          totalPrice: Number(ele?.qty) * ele?.price,
          unitQty: ele?.Size,
          sgstRate: ele?.sgstRate,
          cgstRate: ele?.cgstRate,
          gstPercentage: ele?.gstPercentage,
          igstRate: ele?.igstRate,
          grandTotal: ele?.grandTotal,
          taxableAmount: ele?.taxableAmount,
          unitType: ele?.unitType,
          totalPriceWithDiscount: Number(
            (Number(ele?.qty) * ele?.price).toFixed(2)
          ),
        };
      } else {
        return {
          productId: ele?.productId?._id,
          discountPercentage: ele?.discountPercentage,
          qty: ele?.Purchase_qty,
          price: ele?.price,
          // Size: ele?.Size,
          qtyPurchase: ele?.Purchase_qty,
          qtyReturn: Number(ele?.qty),
          totalPrice: Number(ele?.qty) * ele?.price,
          sgstRate: ele?.sgstRate,
          cgstRate: ele?.cgstRate,
          gstPercentage: ele?.gstPercentage,
          igstRate: ele?.igstRate,
          grandTotal: ele?.grandTotal,
          taxableAmount: ele?.taxableAmount,
          unitQty: ele?.Size,
          unitType: ele?.unitType,
          totalPriceWithDiscount: Number(
            (Number(ele?.qty) * ele?.price).toFixed(2)
          ),
        };
      }
    });
    // const fullname = Party?.firstName + " " + Party?.lastName;
    const payload = {
      userId: UserInfo?._id,
      database: UserInfo?.database,
      partyId: Party,
      SuperAdmin: Context?.CompanyDetails?.created_by,
      grandTotal: Number((gstdetails?.Tax?.GrandTotal).toFixed(2)),
      Return_amount: Number((gstdetails?.Tax?.GrandTotal).toFixed(2)),
      roundOff: Number(
        (gstdetails?.Tax?.GrandTotal - gstdetails?.Tax?.RoundOff).toFixed(2)
      ),
      amount: Number((gstdetails?.Tax?.Amount).toFixed(2)),
      sgstTotal: gstdetails?.Tax?.CgstTotal,
      igstTaxType: gstdetails?.Tax?.IgstTaxType,
      cgstTotal: gstdetails?.Tax?.CgstTotal,
      igstTotal: gstdetails?.Tax?.IgstTotal,
      gstDetails: gstdetails?.gstDetails,

      returnItems: Product,
      orderId: Params?.id,
    };

    _PostSave(Place_ORder_Return_Product, payload)
      .then((res) => {
        setLoading(false);
        History.goBack();
        swal("Purchase Order Returned Successfully");
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
    // }
  };

  return (
    <div>
      <div>
        <Card>
          <Row className="m-1">
            <Col className="">
              <div>
                <h1 className="">Purchase Order Return</h1>
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
                      size="sm"
                      onClick={() => history.goBack()}>
                      Back
                    </Button>
                  )}
                />
              </div>
            </Col>
          </Row>

          <CardBody>
            <Form className="" onSubmit={submitHandler}>
            <Row>
              <Col className="mb-1" lg="4" md="4" sm="12">
                <Label>FullName</Label>
                <Input
                  required
                  readOnly
                  type="text"
                  name="FullName"
                  placeholder="FullName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </Col>
              </Row>
              {product &&
                product?.orderItems?.map((product, index) => {
                  return (
                    <Row className="" key={index}>
                      <Col className="mb-1">
                      <div className="viewspacebetweenReturn">
                        <div className=""  style={{width:'300px'}}>
                          <Label>Product Name</Label>
                          <Input
                            type="text"
                            placeholder="ProductName"
                            name="Product_Title"
                            readOnly
                            value={product?.productId?.Product_Title}
                            onChange={(e) =>
                              handleProductChangeProduct(e, index)
                            }
                          />
                        </div>                     
                        <div className="viewspacebetween1" style={{width:'90px'}}>
                        <FormGroup>
                          <Label>HSN Code</Label>
                          <Input
                            readOnly
                            type="text"
                            placeholder="HSTCode"
                            name="HSN_Code"
                            value={product?.productId?.HSN_Code}
                          />
                        </FormGroup>
                        </div>
                        <div className="viewspacebetween1" style={{width:'90px'}}>
                          <Label>Gross Unit</Label>
                          <Input
                            type="text"
                            name="secondaryUnit"
                            readOnly
                            placeholder="Gross Unit"
                            value={product?.productId?.secondaryUnit}
                          />
                        </div>
                        <div className="viewspacebetween1" style={{width:'90px'}}>
                        <FormGroup>
                          <Label>Price</Label>
                          <Input
                            type="number"
                            readOnly
                            placeholder="Price"
                            name="Price"
                            value={product?.price}
                          />
                        </FormGroup>
                        </div>
                        <div className="viewspacebetween1" style={{width:'105px'}}>
                        <FormGroup>
                          <Label>Purchase Qty</Label>
                          <Input
                            readOnly
                            min={0}
                            type="number"
                            placeholder="Size"
                            name="Purchase_qty"
                            value={product?.Purchase_qty}
                            onChange={(e) =>
                              handleProductChangeProduct(e, index)
                            }
                          />
                        </FormGroup>
                        </div>
                        <div className="viewspacebetween1" style={{width:'90px'}}>
                        <FormGroup>
                          <Label>Return Qty</Label>
                          <Input
                            min={1}
                            max={product.Purchase_qty}
                            type="number"
                            placeholder="Size"
                            name="qty"
                            value={product?.qty}
                            onChange={(e) =>
                              handleProductChangeProduct(e, index)
                            }
                          />
                        </FormGroup>
                        </div>
                        <div className="viewspacebetween1" style={{width:'90px'}}>
                        <FormGroup>
                          <Label>Net Unit</Label>
                          <Input
                            readOnly
                            type="text"
                            placeholder={product?.productId?.primaryUnit}
                            name="qty"
                            value={product?.productId?.primaryUnit}
                          />
                        </FormGroup>
                        </div>                     
                        <div className="viewspacebetween1" style={{width:'90px'}}>
                          <Label>GST %</Label>
                          <Input
                            type="text"
                            name="gstPercentage"
                            disabled
                            placeholder="GST Percentage %"
                            value={product.gstPercentage}
                          />
                        </div> 
                        <div className="viewspacebetween1" style={{width:'90px'}}>
                          <Label>Basic Total</Label>
                          <Input
                            type="number"
                            name="taxableAmount"
                            readOnly
                            placeholder="Price"
                            value={product.taxableAmount}
                          />
                        </div>
                        </div>
                      </Col>
                      {/* <Col className="mb-1">
                        <div className="">
                          <Label>Dis(%)</Label>
                          <Input
                            type="text"
                            name="discountPercentage"
                            disabled
                            placeholder="Discount Percentage"
                            value={product?.discountPercentage}
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
                      )}
                      <Col className="mb-1">
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
                    </Row>
                  );
                })}
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
              {Loading && Loading ? (
                <Row>
                  <Col>
                    <div className="d-flex justify-content-center">
                      <Button.Ripple color="secondary" className="mt-2">
                        Loading...
                      </Button.Ripple>
                    </div>
                  </Col>
                </Row>
              ) : (
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
            </Form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
export default PurchaseReturn;
