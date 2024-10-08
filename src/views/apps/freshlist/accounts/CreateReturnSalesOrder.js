import React, { useEffect, useState, useContext } from "react";
import { Route } from "react-router-dom";
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
  FormGroup,
  CustomInput,
  ModalBody,
  ModalHeader,
  Modal,
  InputGroup,
} from "reactstrap";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { BiEnvelope } from "react-icons/bi";
import { BsFillChatDotsFill, BsWhatsapp } from "react-icons/bs";
import { FaHistory } from "react-icons/fa";
import { FcPhoneAndroid } from "react-icons/fc";
import { AiOutlineSearch } from "react-icons/ai";
import Multiselect from "multiselect-react-dropdown";

import { FiSend } from "react-icons/fi";

import "../../../../assets/scss/pages/users.scss";
import {
  SaveOrder,
  ProductListView,
  // CreatePartyList,
} from "../../../../ApiEndPoint/ApiCalling";
import "../../../../assets/scss/pages/users.scss";
let GrandTotal = [];
let SelectedITems = [];
const SalesReturn = (args) => {
  const [formData, setFormData] = useState({});
  const [Index, setIndex] = useState("");
  const [index, setindex] = useState("");
  const [error, setError] = useState("");
  const [ProductList, setProductList] = useState([]);
  const [grandTotalAmt, setGrandTotalAmt] = useState(0);
  const [UserInfo, setUserInfo] = useState({});
  //   "mobileNumber": "9131102238",
  // "email": "john.doe@example.com",
  // "Return_amount": 50.5,
  // "orderId": "6564698fe38e5ca62eaed3e5"
  const [product, setProduct] = useState([
    // [
    //   {
    //     productId: "655de34174b6eedcb0a82a33",
    //     Qty_Purchased: 2,
    //     Qty_Return: 1,
    //     Product_Price: 50.5,
    //   },
    // ],

    {
      productId: "",
      Qty_Purchased: "",
      Qty_Return: "",
      Product_Price: "",
    },
  ]);

  const handleProductChangeProduct = (e, index) => {
    setIndex(index);
    const { name, value } = e.target;
    const list = [...product];
    list[index][name] = value;

    let amt = 0;
    if (list.length > 0) {
      const x = list?.map((val) => {
        console.log(val.qty * val.price);
        list[index]["totalprice"] = val.qty * val.price;
        return val.qty * val.price;
      });
      amt = x.reduce((a, b) => a + b, 0);
      console.log("GrandTotal", amt);
    }
    console.log(list);
    setProduct(list);
    setGrandTotalAmt(amt);
    console.log(GrandTotal);
  };

  // const handleSelectionParty = (selectedList, selectedItem, index) => {
  //   setProduct(prevProductList => {
  //     const updatedProductList = [...prevProductList];
  //     const updatedProduct = { ...updatedProductList[index] };
  //     updatedProduct.partyId = selectedItem?._id;
  //     updatedProductList[index] = updatedProduct;
  //     return updatedProductList;
  //   });
  // };
  const handleSelection = (selectedList, selectedItem, index) => {
    SelectedITems.push(selectedItem);
    setProduct((prevProductList) => {
      const updatedProductList = [...prevProductList];
      const updatedProduct = { ...updatedProductList[index] }; // Create a copy of the product at the specified index
      updatedProduct.price = selectedItem.Product_MRP; // Update the price of the copied product
      updatedProduct.productId = selectedItem._id;
      updatedProductList[index] = updatedProduct; // Replace the product at the specified index with the updated one
      let myarr = prevProductList?.map((ele, i) => {
        let indextotal = ele?.qty * SelectedITems[i]?.Product_MRP;
        GrandTotal[index] = indextotal;
        return indextotal;
      });
      console.log(myarr);
      let amt = myarr.reduce((a, b) => a + b, 0);
      setGrandTotalAmt(amt);
      return updatedProductList; // Return the updated product list to set the state
    });
  };

  useEffect(() => {
    console.log(product);
    console.log(GrandTotal);
  }, [product, GrandTotal]);

  useEffect(() => {
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
        productId: "",
        Qty_Purchased: "",
        Qty_Return: "",
        Product_Price: "",
        // product: "",
        // productId: "",
        // availableQty: "",
        // qty: 1,
        // price: "",
        // totalprice: "",
        // DateofDelivery: "",
        // partyId: "",
        // discount: "",
        // Shipping: "",
        // tax: "",
      },
    ]);
  };
  let removeMoreProduct = (i) => {
    let newFormValues = [...product];
    newFormValues.splice(i, 1);
    GrandTotal.splice(i, 1);
    let amt = GrandTotal.reduce((a, b) => a + b, 0);
    setGrandTotalAmt(amt);
    setProduct(newFormValues);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    console.log("Final ", product);
    const ObjOrder = {
      userId: UserInfo?._id,
      fullName: UserInfo?.UserName,
      address: UserInfo?.Address,
      grandTotal: grandTotalAmt,
      MobileNo: UserInfo?.mobileNumber,
      country: UserInfo?.Country,
      state: UserInfo?.State,
      city: UserInfo?.City,
      // landMark: "Nearby Park",
      // pincode: 90001,
      // discount: 10.00,
      // shippingCost: 5.00,
      // taxAmount: 7.50,

      orderItems: product,
    };
    if (error) {
      swal("Error occured while Entering Details");
    } else {
      SaveOrder(ObjOrder)
        .then((res) => {
          console.log(res);
          // if (res.status) {
          //   setFormData({});
          //   window.location.reload();
          swal("Order Created Successfully");
          // }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const onRemove1 = (selectedList, removedItem, index) => {
    console.log(selectedList);
    console.log(index);
    // setmultiSelect(selectedList);

    // let arr = selectedList.map((ele) => ele.id);
    // console.log(arr);
    // setmultiSelect(arr);
    // console.log(multiSelect);
    // if (selectedList.length) {
    //   for (var i = 0; i < selectedList.length; i++) {
    //     selectedOptions.push(selectedList[i].id);
    //   }
    // }
    // let uniqueChars = [...new Set(selectedOptions)];
    // console.log(uniqueChars);
  };
  return (
    <div>
      <div>
        <Card>
          <Row className="m-2">
            <Col className="">
              <div>
                <h1 className="">Sales Return</h1>
              </div>
            </Col>

            {/* <Col>
              <Route
                render={({ history }) => (
                  <Button
                    className="btn float-right"
                    color="danger"
                    size="sm"
                    onClick={() =>
                      history.push("/app/softnumen/order/orderList")
                    }
                  >
                    Back
                  </Button>
                )}
              />
            </Col> */}
          </Row>

          <CardBody>
            <Form className="m-1" onSubmit={submitHandler}>
              {product &&
                product?.map((product, index) => (
                  <Row className="" key={index}>
                    <Col className="mb-1" lg="2" md="2" sm="12">
                      <div className="">
                        <Label>ProductName</Label>
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
                            onRemove1(selectedList, selectedItem, index);
                          }}
                          displayValue="Product_Title" // Property name to display in the dropdown options
                        />
                      </div>
                    </Col>
                    <Col className="mb-1" lg="2" md="2" sm="12">
                      <div className="">
                        <Label>Sales Quantity</Label>
                        <Input
                          type="number"
                          name="Qty_Purchased"
                          placeholder="Req_Qty"
                          value={product?.Qty_Purchased}
                          onChange={(e) => handleProductChangeProduct(e, index)}
                        />
                      </div>
                    </Col>
                    <Col className="mb-1" lg="2" md="2" sm="12">
                      <div className="">
                        <Label>Return Quantity</Label>
                        <Input
                          type="number"
                          name="qty"
                          placeholder="Req_Qty"
                          value={product?.qty}
                          onChange={(e) => handleProductChangeProduct(e, index)}
                        />
                      </div>
                    </Col>
                    <Col className="mb-1" lg="2" md="2" sm="12">
                      <div className="">
                        <Label>Product Price</Label>
                        <Input
                          type="number"
                          name="price"
                          readOnly
                          placeholder="Price"
                          value={product.price}
                        />
                      </div>
                    </Col>
                    {/* <Col className="mb-1" lg="2" md="2" sm="12">
                      <div className="">
                        <Label>Total Price</Label>
                        <Input
                          type="number"
                          name="totalprice"
                          readOnly
                          placeholder="TtlPrice"
                          value={product.price * product?.qty}
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
                            size="sm"
                            onClick={() => removeMoreProduct(index)}>
                            -
                          </Button>
                        ) : null}
                      </div>

                      <div className="btnStyle">
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
                ))}
              <Row>
                <Col className="mb-1" lg="12" md="12" sm="12">
                  <div className=" d-flex justify-content-end">
                    <ul className="subtotal">
                      <li>
                        <Label className="">
                          SubTotal : <strong>{grandTotalAmt}</strong>
                        </Label>
                      </li>
                      <li>
                        <Label className="">
                          Shipping Cost : <strong>RS 50</strong>
                        </Label>
                      </li>
                      <li>
                        <Label className="">
                          Tax: <strong>RS 25</strong>
                        </Label>
                      </li>
                      <li>
                        <Label className="">
                          Discount : <strong>RS 5</strong>
                        </Label>
                      </li>
                      <li>
                        {" "}
                        <Label className="pr-5">
                          Grand Total :{" "}
                          <strong>{grandTotalAmt + 50 + 25 + 5}</strong>
                        </Label>
                      </li>
                    </ul>
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
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
export default SalesReturn;
