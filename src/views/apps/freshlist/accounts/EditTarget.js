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
import Flatpickr from "react-flatpickr";
import { useParams, useLocation } from "react-router-dom";

import Multiselect from "multiselect-react-dropdown";

import { FiSend } from "react-icons/fi";

import "../../../../assets/scss/pages/users.scss";
import {
  CreateOrder_ViewData,
  CommentOrder,
  CreateOrder_ID,
  CommentProductWiki,
  SaveOrder,
  ProductListView,
  CreatePartyList,
  Create_Sales_personList,
  Create_Targetsave,
  CreateCustomerList,
  _Put,
} from "../../../../ApiEndPoint/ApiCalling";
import "../../../../assets/scss/pages/users.scss";
import Timepickers from "../../../forms/form-elements/datepicker/Timepicker";
import Pickers from "../../../forms/form-elements/datepicker/Pickers";
import { Route } from "react-router-dom";
import { Update_target_INlist } from "../../../../ApiEndPoint/Api";

let GrandTotal = [];
let SelectedITems = [];
let IndividualIndex = [];

const EditTarget = (args) => {
  const [formData, setFormData] = useState({});
  const [Index, setIndex] = useState("");
  const [targetStartDate, settargetStartDate] = useState("");
  const [targetEndDate, settargetEndDate] = useState("");
  const [index, setindex] = useState("");
  const [error, setError] = useState("");
  const [ProductList, setProductList] = useState([]);
  const [PartyList, setPartyList] = useState([]);
  const [SelectedPartyList, setSelectedPartyList] = useState([]);
  const [Salesperson, setSalesperson] = useState({});
  const [grandTotalAmt, setGrandTotalAmt] = useState(0);
  const [Editdata, setEditdata] = useState({});
  const [UserInfo, setUserInfo] = useState({});
  const [UserList, setUserList] = useState([]);
  const [AllProductList, setAllProductList] = useState([]);
  const [modal, setModal] = useState(false);
  const [items, setItems] = useState("");
  const [audit, setAudit] = useState(false);
  const [SalesPersonList, setSalesPersonList] = useState([]);
  const Params = useParams();
  const location = useLocation();
  const toggle = (item) => {
    setItems(item);
    setModal(!modal);
  };
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
      product: "", //
      productId: "",
      IncrementPercent: "",
      IncrementMonth: "",
      availableQty: "",
      qty: 1, //
      price: "", //
      totalprice: "", //
      Salespersonname: "",
      targetstartDate: "",
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
    const { name, value } = e.target;
    const list = [...AllProductList];
    list[index][name] = value;
    // console.log(GrandTotal);
    let amt = 0;
    if (list.length > 0) {
      const x = list?.map((val) => {
        console.log(val.qty * val.price);
        GrandTotal[index] = val.qty * val.price;

        list[index]["totalprice"] = val.qty * val.price;
        return val.qty * val.price;
      });
      amt = x.reduce((a, b) => a + b);
      console.log("GrandTotal", amt);
    }
    // console.log(list)
    setProduct(list);
    setAllProductList(list);
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
  const handleSelection = (selectedList, selectedItem, index) => {
    SelectedITems.push(selectedItem);
    setProduct((prevProductList) => {
      const updatedProductList = [...prevProductList]; // Create a copy of the productList array
      const updatedProduct = { ...updatedProductList[index] }; // Create a copy of the product at the specified index
      updatedProduct.price = selectedItem?.Product_MRP; // Update the price of the copied product
      updatedProduct.productId = selectedItem?._id;
      updatedProductList[index] = updatedProduct; // Replace the product at the specified index with the updated one
      let myarr = prevProductList?.map((ele, i) => {
        console.log(ele?.qty * selectedItem[i]?.Product_MRP);
        let indextotal = ele?.qty * SelectedITems[i]?.Product_MRP;
        GrandTotal[index] = indextotal;
        return indextotal;
      });

      let amt = myarr.reduce((a, b) => a + b);
      setGrandTotalAmt(amt);
      // updatedProduct.grandTotal = Quantity[index]*selectedItem.Product_MRP;
      // setGrandTotalAmt
      return updatedProductList; // Return the updated product list to set the state
    });
    product.map((value) => console.log(value.totalprice));
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

  useEffect(() => {
    if (location?.state) {
      localStorage.setItem("EditoneProduct", location?.state);
      setEditdata(location?.state);
      settargetStartDate(location?.state?.startDate?.split("T")[0]);
      settargetEndDate(location?.state?.endDate?.split("T")[0]);
      let Selectedproduct = location?.state?.products;
      let products = [];
      if (Selectedproduct?.length) {
        products = Selectedproduct?.map((ele) => {
          return {
            ...ele?.productId,
            qty: ele?.qtyAssign,
            totalPrice: ele?.totalPrice,
            price: ele?.totalPrice,
            IncrementPercent: ele?.assignPercentage[0]?.percentage,
            IncrementMonth: ele?.assignPercentage[0]?.month,
          };
        });
      }
      setAllProductList(products);
      // setProduct(products);
      setGrandTotalAmt(location?.state?.grandTotal);
    } else {
      let mydata = localStorage.getItem("EditoneProduct");
      setEditdata(mydata);
      settargetStartDate(mydata?.startDate?.split("T")[0]);
      settargetEndDate(mydata?.endDate?.split("T")[0]);
      let Selectedproduct = mydata?.products;
      let products = [];

      if (Selectedproduct?.length) {
        products = Selectedproduct?.map((ele) => {
          return {
            ...ele?.productId,
            qty: ele?.qtyAssign,
            totalPrice: ele?.totalPrice,
            price: ele?.price,
          };
        });
      }
      setAllProductList(products);
      setGrandTotalAmt(mydata?.grandTotal);
    }
  }, []);

  useEffect(() => {
    let userdata = JSON.parse(localStorage.getItem("userData"));
    CreateCustomerList(userdata?._id, userdata?.database)
      .then((res) => {
        let data = location?.state?.partyId?._id;
        let selectedParty = res?.Customer?.filter((ele) => ele?._id == data);
        setUserList(res?.Customer);
        setSelectedPartyList(selectedParty);
        setSalesperson(selectedParty[0]);
      })
      .catch((err) => console.log(err));
    Create_Sales_personList()
      .then((res) => {
        console.log(res?.SalesPerson);
        setSalesPersonList(res?.SalesPerson);
      })
      .catch((err) => console.log(err));

    ProductListView(userdata?._id, userdata?.database)
      .then((res) => {
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
        IncrementPercent: "",
        IncrementMonth: "",
        availableQty: "",
        qty: 1, //
        price: "", //
        totalprice: "", //
        Salespersonname: "",
        targetstartDate: "",
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
  const submitHandler = async (e) => {
    e.preventDefault();
    let Allproduct = AllProductList?.map((ele, i) => {
      console.log(ele);
      return {
        productId: ele?._id,
        qtyAssign: ele?.qty,
        price: ele?.price,
        totalPrice: ele?.totalprice,
        assignPercentage: [
          {
            month: ele?.IncrementMonth,
            percentage: Number(ele?.IncrementPercent),
          },
        ],
      };
    });
    let payload = {
      startDate: targetStartDate,
      endDate: targetEndDate,
      grandTotal: grandTotalAmt,
      partyId: Salesperson?._id,
      products: Allproduct,
    };

    if (error) {
      swal("Error occured while Entering Details");
    } else {
      await _Put(Update_target_INlist, Salesperson?._id, payload)
        .then((res) => {
          console.log(res.data);
          swal("Target Updated Successfully");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const onSelect1 = (selectedList, selectedItem, index) => {
    // console.log(selectedList);
    setSalesperson(selectedItem);
    // console.log(index);
    // if (selectedList.length) {
    //   for (var i = 0; i < selectedList.length; i++) {
    //     selectedOptions.push(selectedList[i].id);
    //   }
    // }
    // let arr = selectedList.map((ele) => ele.id);
    // setmultiSelect(arr);
    // console.log(multiSelect);
    // let uniqueChars = [...new Set(selectedOptions)];
    // if (uniqueChars.length === 1) {
    //   let value = uniqueChars[0];
    //   const formdata = new FormData();
    //   formdata.append("state_id", value);
    //   axiosConfig
    //     .post(`/getcity`, formdata)
    //     .then((res) => {
    //       setCityList(res?.data?.cities);
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // } else {
    //   setCityList([]);
    // }
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
                <h1 className="">Edit Target</h1>
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
                      {/* <FaPlus size={15} /> Create User */}
                    </Button>
                  )}
                />
              </div>
            </Col>
          </Row>

          <CardBody>
            {/* <Pickers /> */}
            {/* <Col className="mb-3" md="6" sm="12">
              <h5 className="text-bold-500">Range</h5>
              <Flatpickr
                // value={rangePicker}
                className="form-control"
                options={{ mode: "range" }}
                onChange={(date) => {
                  console.log(date);
                }}
              />
            </Col> */}
            <Form className="m-1" onSubmit={submitHandler}>
              <Row>
                <Col className="mb-1" lg="2" md="2" sm="12">
                  <div className="">
                    <Label>Selected Party</Label>
                    <Multiselect
                      required
                      selectionLimit={1}
                      isObject="false"
                      options={UserList} // Options to display in the dropdown
                      selectedValues={SelectedPartyList} // Preselected value to persist in dropdown
                      onSelect={onSelect1} // Function will trigger on select event
                      onRemove={onRemove1} // Function will trigger on remove event
                      displayValue="OwnerName" // Property name to display in the dropdown options
                    />
                  </div>
                </Col>
                <Col className="mb-1" lg="2" md="2" sm="12">
                  <div className="">
                    <Label>Start date</Label>
                    <Input
                      required
                      type="date"
                      name="targetEndDate"
                      placeholder="Date of Delivery"
                      value={targetStartDate}
                      onChange={(e) => settargetStartDate(e.target.value)}
                    />
                  </div>
                </Col>
                <Col className="mb-1" lg="2" md="2" sm="12">
                  <div className="">
                    <Label>End Date</Label>
                    <Input
                      required
                      type="date"
                      name="targetstartDate"
                      placeholder="Date of Delivery"
                      value={targetEndDate}
                      onChange={(e) => settargetEndDate(e.target.value)}
                    />
                  </div>
                </Col>
              </Row>

              {AllProductList &&
                AllProductList?.map((product, index) => {
                  let SelectedProduct = ProductList?.filter(
                    (ele) => ele?._id == product?._id
                  );

                  return (
                    <Row className="" key={index}>
                      <Col className="mb-1" lg="2" md="2" sm="12">
                        <div className="">
                          <Label>Product Name</Label>
                          <Multiselect
                            required
                            selectionLimit={1}
                            selectedValues={SelectedProduct}
                            isObject="false"
                            options={ProductList}
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
                          <Label>Qty Assign</Label>
                          <Input
                            type="number"
                            name="qty"
                            min={0}
                            placeholder="Req_Qty"
                            value={product?.qty}
                            onChange={(e) =>
                              handleProductChangeProduct(e, index)
                            }
                          />
                        </div>
                      </Col>
                      <Col className="mb-1" lg="1" md="1" sm="12">
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
                      <Col className="mb-1" lg="1" md="1" sm="12">
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
                      </Col>
                      <Col className="mb-1" lg="2" md="2" sm="12">
                        <div className="">
                          <Label>Percentage Increment</Label>
                          <Input
                            type="number"
                            name="IncrementPercent"
                            placeholder="Percentage Inrement"
                            value={product?.IncrementPercent}
                            onChange={(e) =>
                              handleProductChangeProduct(e, index)
                            }
                          />
                        </div>
                      </Col>
                      <Col className="mb-1" lg="2" md="2" sm="12">
                        <div className="">
                          <Label>Increment Month</Label>
                          <CustomInput
                            onChange={(e) =>
                              handleProductChangeProduct(e, index)
                            }
                            type="select"
                            name="IncrementMonth"
                            placeholder="Increment Month"
                            value={product?.IncrementMonth}>
                            <option value="00">--Select--</option>
                            <option value="01">January</option>
                            <option value="02">February</option>
                            <option value="03">March</option>
                            <option value="04">April</option>
                            <option value="05">May</option>
                            <option value="06">June</option>
                            <option value="07">July</option>
                            <option value="08">August</option>
                            <option value="09">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                          </CustomInput>
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
                      Grand Total : <stron>{grandTotalAmt}</stron>
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
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
export default EditTarget;
