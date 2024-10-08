
import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import {
  Card,
  Col,
  Form,
  Row,
  Input,
  Label,
  Button,
  ModalBody,
  ModalHeader,
  Modal,
  Badge,
} from "reactstrap";

import "react-phone-input-2/lib/style.css";

import Multiselect from "multiselect-react-dropdown";

import "../../../../assets/scss/pages/users.scss";
import {
  ProductListView,
  SavePromotionsActivity,
} from "../../../../ApiEndPoint/ApiCalling";
import "../../../../assets/scss/pages/users.scss";

import { Route } from "react-router-dom";
import swal from "sweetalert";

let GrandTotal = [];
let SelectedITems = [];
const CreatePromotionalActivity = (args) => {
  let History = useHistory();
  const [formData, setFormData] = useState({});
  const [Index, setIndex] = useState("");
  // const [targetEndDate, settargetEndDate] = useState("");
  const [index, setindex] = useState("");
  const [DiscountType, setDiscountType] = useState("");
  const [startdate, setStartDate] = useState("");
  const [FreeNumberofProduct, setFreeNumberofProduct] = useState("");
  const [Enddate, setEnddate] = useState("");
  const [FreeSelectedProduct, setFreeSelectedProduct] = useState(false);
  const [AddAnotherProduct, setAddAnotherProduct] = useState(false);
  const [NumberofProduct, setNumberofProduct] = useState("");
  const [error, setError] = useState("");
  const [Status, setStatus] = useState("");
  const [Promocode, setPromocode] = useState("");
  const [ProductList, setProductList] = useState([]);
  const [Salesperson, setSalesperson] = useState("");
  const [grandTotalAmt, setGrandTotalAmt] = useState(0);
  const [TotalAmount, setTotalAmount] = useState("");
  const [Discountpercent, setDiscountpercentage] = useState("");
  const [Discount, setDiscount] = useState("");
  const [UserInfo, setUserInfo] = useState({});
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [audit, setAudit] = useState(false);

  const audittoggle = () => {
    setAudit(!audit);
    // setModal(!modal);
  };

  const handleHistory = () => {
    audittoggle();
  };
  const [product, setProduct] = useState([
    {
      product: "", //
      productId: "",
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
    setIndex(index);
    const { name, value } = e.target;
    const list = [...product];
    list[index][name] = value;
    let amt = 0;

    setProduct(list);
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
  const handleSelection = (selectedList, selectedItem, index) => {
    SelectedITems.push(selectedItem);
    setProduct((prevProductList) => {
      const updatedProductList = [...prevProductList]; // Create a copy of the productList array
      const updatedProduct = { ...updatedProductList[index] }; // Create a copy of the product at the specified index
      // updatedProduct.price = selectedItem?.Product_MRP; // Update the price of the copied product
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
    console.log(product);
    console.log(GrandTotal);
  }, [product]);

  useEffect(() => {
    let userdata = JSON.parse(localStorage.getItem("userData"));

    ProductListView(userdata?._id, userdata?.database)
      .then((res) => {
        console.log(res?.Product);
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

    setProduct(newFormValues);
  };

  const handleSubmitPromocode = async (e) => {
    e.preventDefault();
    // SavePromotionsActivity()
    let pageparmission = JSON.parse(localStorage.getItem("userData"));

    let promo = [
      {
        promoCode: Promocode,
        promoAmount: Discount,
        startDate: startdate,
        endDate: Enddate,
        status: Status,
      },
    ];
    let mypromot = {
      promoCodeWise: promo,
      created_by: pageparmission?._id,
      status: Status,
    };
    await SavePromotionsActivity(mypromot)
      .then((res) => {
        // console.log(res);
        History.goBack();
        swal("success", "Promotion Code Submitted Successfully");
      })
      .catch((err) => {
        console.log(err);
        swal("Error", "Something went wrong");
      });
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    // SavePromotionsActivity();
    let pageparmission = JSON.parse(localStorage.getItem("userData"));

    if (DiscountType == "Percentage Wise") {
      let percentage = [
        {
          totalAmount: TotalAmount,
          percentageDiscount: Discountpercent,
          startDate: startdate,
          endDate: Enddate,
          status: Status,
        },
      ];
      let payload = {
        percentageWise: percentage,
        created_by: pageparmission?._id,

        status: Status,
      };
      await SavePromotionsActivity(payload)
        .then((res) => {
          console.log(res);
          History.goBack();

          swal("success", "Promotion Code Submitted Successfully");
        })
        .catch((err) => {
          console.log(err);
          swal("Error", "Something went wrong");
        });
    } else if (DiscountType == "Amount Wise") {
      let amount = [
        {
          totalAmount: TotalAmount,
          percentageAmount: Discount,
          startDate: startdate,
          endDate: Enddate,
          status: Status,
        },
      ];
      let payload = {
        amountWise: amount,
        status: Status,
        created_by: pageparmission?._id,
      };
      await SavePromotionsActivity(payload)
        .then((res) => {
          console.log(res);
        History.goBack();
          
          swal("success", "Submitted Successfully");
        })
        .catch((err) => {
          console.log(err);
          swal("Error", "Something went wrong");
        });
    } else {
      if (FreeSelectedProduct) {
        let productWise = [
          {
            productId: Salesperson[0]?._id,
            productQty: NumberofProduct,
            discountAmount: Discount,
            discountPercentage: Discountpercent,
            startDate: startdate,
            endDate: Enddate,
            freeSameProductQty: FreeNumberofProduct,
          },
        ];
        let payload = {
          productWise: productWise,
          created_by: pageparmission?._id,

          status: Status,
        };
        await SavePromotionsActivity(payload)
          .then((res) => {
        History.goBack();

            console.log(res);
            swal("success", "Submitted Successfully");
          })
          .catch((err) => {
            console.log(err);
            swal("Error", "Something went wrong");
          });
      } else {
        let myproduct = product?.map((ele, i) => {
          return { productId: ele?.productId, freeProductQty: ele?.qty };
        });
        let productWise = [
          {
            productId: Salesperson[0]?._id,
            productQty: NumberofProduct,
            discountAmount: Discount,
            discountPercentage: Discountpercent,
            startDate: startdate,
            endDate: Enddate,
            freeOtherProducts: myproduct,
          },
        ];
        let payload = {
          productWise: productWise,
          created_by: pageparmission?._id,
          status: Status,
        };

        await SavePromotionsActivity(payload)
          .then((res) => {
            console.log(res);
        History.goBack();

            swal("success", "Submitted Successfully");
          })
          .catch((err) => {
            console.log(err);
            swal("Error", "Something went wrong");
          });
      }
    }

    let Allproduct = product?.map((ele, i) => {
      console.log(ele);
      return {
        productId: ele?.productId,
        qtyAssign: ele?.qty,
        price: ele?.price,
        totalPrice: ele?.totalprice,
      };
    });
    let payload = {
      grandTotal: grandTotalAmt,
      salesPersonId: Salesperson[0]?._id,
      products: Allproduct,
    };

    if (error) {
      swal("Error occured while Entering Details");
    } else {
    }
  };
  const onSelect1 = (selectedList, selectedItem, index) => {
    setSalesperson(selectedList);
  };
  const onRemove1 = (selectedList, removedItem, index) => {
    console.log(selectedList);
    console.log(index);
  };
  return (
    <div>
      <div>
        <Card>
          <Row className="ml-2 mr-2">
            <Col className="mt-2" xs="12" lg="9">
              <div>
                <h1
                  className=""
                  style={{ fontWeight: "500", fontSize: "27px" }}>
                  Create Promotional Activity
                </h1>
              </div>
            </Col>

            <Col lg="2" md="2" xs="7" sm="12" className="mt-2">
              <div className="float-right">
                <Route
                  render={({ history }) => (
                    <Button
                      style={{ cursor: "pointer" }}
                      className="float-right"
                      color="info"
                      onClick={toggle}>
                      {" "}
                      +Promocode
                    </Button>
                  )}
                />
              </div>
            </Col>
            <Col lg="1" xs="5" className="mt-2">
              <div className="float-right">
                <Route
                  render={({ history }) => (
                    <Button
                      style={{ cursor: "pointer" }}
                      className="float-right mr-1"
                      color="danger"
                      onClick={() => history.goBack()}>
                      {" "}
                      Back
                    </Button>
                  )}
                />
              </div>
            </Col>
          </Row>

          <Form className="p-1" onSubmit={submitHandler}>
            <Col lg="7" md="8" sm="10" xs="12" className="mb-2 mt-1">
              <div className="form-label-group">
                <input
                  style={{ marginRight: "10px" }}
                  type="radio"
                  name="Product Quantity"
                  value={DiscountType}
                  onChange={(e) => {
                    setDiscountType("Percentage Wise");
                    setFreeSelectedProduct(false);
                    setAddAnotherProduct(false);
                  }}
                />
                <span style={{ marginRight: "99px" }}>Percentage Wise</span>

                <input
                  style={{ marginRight: "10px" }}
                  type="radio"
                  name="Product Quantity"
                  value={DiscountType}
                  onChange={(e) => {
                    setDiscountType("Amount Wise");
                    setFreeSelectedProduct(false);
                    setAddAnotherProduct(false);
                  }}
                />
                <span style={{ marginRight: "124px" }}>Amount Wise</span>
                <input
                  style={{ marginRight: "10px" }}
                  type="radio"
                  name="Product Quantity"
                  placeholder="Product Quantity"
                  value={DiscountType}
                  onChange={(e) => setDiscountType("Product Wise")}
                />
                <span style={{ marginRight: "60px" }}>Product Wise</span>
              </div>
            </Col>

            <Row className="p-1">
              {DiscountType && DiscountType == "Percentage Wise" ? (
                <>
                  <Col className="mb-1" lg="3" md="3" sm="12">
                    <div className="">
                      <Label>Total Amount</Label>
                      <Input
                        required
                        type="number"
                        name="Totalamount"
                        placeholder="Total amount"
                        value={TotalAmount}
                        onChange={(e) => setTotalAmount(e.target.value)}
                        onWheel={(e) => e.preventDefault()}
                      />
                    </div>
                  </Col>
                  <Col className="mb-1" lg="3" md="3" sm="12">
                    <div className="">
                      <Label>Discount in Percentage</Label>
                      <Input
                        required
                        type="number"
                        name="DiscountinPercentage"
                        placeholder="Discount in Percentage %"
                        value={Discountpercent}
                        onChange={(e) => {
                          if (e.target.value.length < 3) {
                            setDiscountpercentage(e.target.value);
                          } else {
                          }
                        }}
                        onWheel={(e) => e.preventDefault()}
                      />
                    </div>
                  </Col>
                  <Col className="mb-1" lg="3" md="3" sm="12">
                    <div className="">
                      <Label>Start Date</Label>
                      <Input
                        required
                        type="date"
                        name="DiscountinPercentage"
                        value={startdate}
                        onChange={(e) => setStartDate(e.target.value)}
                        onWheel={(e) => e.preventDefault()}
                      />
                    </div>
                  </Col>
                  <Col className="mb-1" lg="3" md="3" sm="12">
                    <div className="">
                      <Label>End Date</Label>
                      <Input
                        required
                        type="date"
                        name="DiscountinPercentage"
                        value={Enddate}
                        onChange={(e) => setEnddate(e.target.value)}
                        onWheel={(e) => e.preventDefault()}
                      />
                    </div>
                  </Col>
                </>
              ) : null}
              {DiscountType && DiscountType == "Amount Wise" ? (
                <>
                  <Col className="mb-1" lg="3" md="3" sm="12">
                    <div className="">
                      <Label>Total Amount</Label>
                      <Input
                        required
                        type="number"
                        name="Totalamount"
                        placeholder="Total amount"
                        value={TotalAmount}
                        onChange={(e) => setTotalAmount(e.target.value)}
                        onWheel={(e) => e.preventDefault()}
                      />
                    </div>
                  </Col>
                  <Col className="mb-1" lg="3" md="3" sm="12">
                    <div className="">
                      <Label>Discount Amount</Label>
                      <Input
                        required
                        type="number"
                        name="DiscountinPercentage"
                        placeholder="Discount Amount"
                        value={Discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        onWheel={(e) => e.preventDefault()}
                      />
                    </div>
                  </Col>
                  <Col className="mb-1" lg="3" md="3" sm="12">
                    <div className="">
                      <Label>Start Date</Label>
                      <Input
                        required
                        type="date"
                        name="DiscountinPercentage"
                        value={startdate}
                        onChange={(e) => setStartDate(e.target.value)}
                        onWheel={(e) => e.preventDefault()}
                      />
                    </div>
                  </Col>
                  <Col className="mb-1" lg="3" md="3" sm="12">
                    <div className="">
                      <Label>End Date</Label>
                      <Input
                        required
                        type="date"
                        name="DiscountinPercentage"
                        value={Enddate}
                        onChange={(e) => setEnddate(e.target.value)}
                        onWheel={(e) => e.preventDefault()}
                      />
                    </div>
                  </Col>
                </>
              ) : null}
              {DiscountType && DiscountType == "Product Wise" ? (
                <>
                  <Col className="mb-1" lg="3" md="3" sm="12">
                    <div className="">
                      <Label>Choose Product *</Label>
                      <Multiselect
                        required
                        selectionLimit={1}
                        // showCheckbox="true"
                        isObject="false"
                        options={ProductList} // Options to display in the dropdown
                        // selectedValues={selectedValue}   // Preselected value to persist in dropdown
                        onSelect={onSelect1} // Function will trigger on select event
                        onRemove={onRemove1} // Function will trigger on remove event
                        displayValue="Product_Title" // Property name to display in the dropdown options
                      />
                    </div>
                  </Col>
                  <Col className="mb-1" lg="3" md="3" sm="12">
                    <div className="">
                      <Label>Product Quantity</Label>
                      <Input
                        required
                        type="number"
                        name="TotalAmount"
                        placeholder="Product Total Amount"
                        value={NumberofProduct}
                        onChange={(e) => setNumberofProduct(e.target.value)}
                        onWheel={(e) => e.preventDefault()}
                      />
                    </div>
                  </Col>
                  <Col className="mb-1" lg="3" md="3" sm="12">
                    <div className="">
                      <Label>Discount Amount</Label>
                      <Input
                        type="number"
                        name="DiscountAmount"
                        placeholder="Discount Amount"
                        value={Discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        onWheel={(e) => e.preventDefault()}
                      />
                    </div>
                  </Col>
                  <Col className="mb-1" lg="3" md="3" sm="12">
                    <div className="">
                      <Label> or Discount %</Label>
                      <Input
                        type="number"
                        name="DiscountAmount"
                        placeholder="Discount Percentage %"
                        value={Discountpercent}
                        onChange={(e) => setDiscountpercentage(e.target.value)}
                        onWheel={(e) => e.preventDefault()}
                      />
                    </div>
                  </Col>
                  <Col className="mb-1" lg="3" md="3" sm="12">
                    <div className="">
                      <Label>Start Date</Label>
                      <Input
                        required
                        type="date"
                        value={startdate}
                        onChange={(e) => setStartDate(e.target.value)}
                        onWheel={(e) => e.preventDefault()}
                      />
                    </div>
                  </Col>
                  <Col className="mb-1" lg="3" md="3" sm="12">
                    <div className="">
                      <Label>End Date</Label>
                      <Input
                        required
                        type="date"
                        value={Enddate}
                        onChange={(e) => setEnddate(e.target.value)}
                        onWheel={(e) => e.preventDefault()}
                      />
                    </div>
                  </Col>

                  <div className="p-1">
                    <Row>
                      <Col lg="12" md="12" sm="12" className="">
                        <div className="form-label-group">
                          <input
                            style={{ marginRight: "3px" }}
                            type="radio"
                            name="ProductQuantity1"
                            placeholder="Product Quantity"
                            onChange={(e) => {
                              setFreeSelectedProduct(true);
                              setAddAnotherProduct(false);
                            }}
                          />
                          <span style={{ marginRight: "60px" }}>
                            or Free selected Product Quantity
                          </span>

                          <input
                            style={{ marginRight: "3px" }}
                            type="radio"
                            name="ProductQuantity1"
                            placeholder="Product Quantity"
                            // value={targetStartDate}
                            onChange={(e) => {
                              setFreeSelectedProduct(false);

                              setAddAnotherProduct(true);
                            }}
                          />
                          <span style={{ marginRight: "60px" }}>
                            Want to Add Another Product
                          </span>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </>
              ) : null}
              <Col lg="12" md="12" sm="12">
                <Row>
                  {AddAnotherProduct && (
                    <>
                      {product &&
                        product?.map((product, index) => (
                          <Row className="" key={index}>
                            <Col className="mb-1" lg="4" md="4" sm="12">
                              <div className="">
                                <Label>Product Name</Label>
                                <Multiselect
                                  required
                                  selectionLimit={1}
                                  isObject="false"
                                  options={ProductList}
                                  onSelect={(selectedList, selectedItem) =>
                                    handleSelection(
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
                            <Col className="mb-1" lg="4" md="4" sm="12">
                              <div className="">
                                <Label>Quantity</Label>
                                <Input
                                  type="number"
                                  name="qty"
                                  placeholder="Req_Qty"
                                  value={product?.qty}
                                  onChange={(e) =>
                                    handleProductChangeProduct(e, index)
                                  }
                                />
                              </div>
                            </Col>

                            <Col
                              className="d-flex mt-1 abb"
                              lg="3"
                              md="3"
                              sm="12">
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
                    </>
                  )}
                  {FreeSelectedProduct && (
                    <>
                      <Col className="mb-1" lg="4" md="4" sm="12">
                        <div className="">
                          <Label>Free Selected Product Quantity</Label>
                          <Input
                            required
                            type="number"
                            placeholder="Number of Quantity"
                            value={FreeNumberofProduct}
                            onChange={(e) =>
                              setFreeNumberofProduct(e.target.value)
                            }
                          />
                        </div>
                      </Col>
                    </>
                  )}
                </Row>
              </Col>
            </Row>

            <Col lg="6" md="6" sm="6" className="mb-2 mt-1">
              <Label className="mb-0">Status</Label>
              <div
                className="form-label-group mt-1"
                onChange={(e) => {
                  setStatus(e.target.value);
                }}>
                <input
                  checked={Status == "Active"}
                  style={{ marginRight: "3px" }}
                  type="radio"
                  name="status"
                  value="Active"
                />
                <span style={{ marginRight: "20px" }}>Active</span>

                <input
                  checked={Status == "Deactive"}
                  style={{ marginRight: "3px" }}
                  type="radio"
                  name="status"
                  value="Deactive"
                />
                <span style={{ marginRight: "3px" }}>Deactive</span>
              </div>
            </Col>
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
          <Modal isOpen={modal} toggle={toggle} {...args}>
            <ModalHeader toggle={toggle}>Add Promotion Code here</ModalHeader>
            <ModalBody>
              <Form onSubmit={handleSubmitPromocode}>
                <Row>
                  <Col className="mb-1" lg="6" md="6" sm="12">
                    <Label>Promo code</Label>
                    <Input
                      required
                      type="text"
                      name="targetEndDate"
                      placeholder="Enter Promotion Code"
                      value={Promocode}
                      onChange={(e) => {
                        console.log(e.target.value.toUpperCase());
                        setPromocode(e.target.value.toUpperCase());
                      }}
                    />
                  </Col>
                  <Col className="mb-1" lg="6" md="6" sm="12">
                    <Label>Amount</Label>
                    <Input
                      required
                      type="number"
                      placeholder="Enter Amount"
                      value={Discount}
                      onChange={(e) => setDiscount(e.target.value)}
                    />
                  </Col>
                  <Col className="mb-1" lg="6" md="6" sm="12">
                    <div className="">
                      <Label>Start Date</Label>
                      <Input
                        required
                        type="date"
                        name="DiscountinPercentage"
                        value={startdate}
                        onChange={(e) => setStartDate(e.target.value)}
                        onWheel={(e) => e.preventDefault()}
                      />
                    </div>
                  </Col>
                  <Col className="mb-1" lg="6" md="6" sm="12">
                    <div className="">
                      <Label>End Date</Label>
                      <Input
                        required
                        type="date"
                        name="DiscountinPercentage"
                        value={Enddate}
                        onChange={(e) => setEnddate(e.target.value)}
                        onWheel={(e) => e.preventDefault()}
                      />
                    </div>
                  </Col>
                  <Col lg="6" md="6" sm="6" className="mb-2 mt-1">
                    <Label className="mb-0">Status</Label>
                    <div
                      className="form-label-group mt-1"
                      onChange={(e) => {
                        setStatus(e.target.value);
                      }}>
                      <input
                        checked={Status == "Active"}
                        style={{ marginRight: "3px" }}
                        type="radio"
                        name="status"
                        value="Active"
                      />
                      <span style={{ marginRight: "20px" }}>Active</span>

                      <input
                        // checked={status == "Inactive"}
                        checked={Status == "Deactive"}
                        style={{ marginRight: "3px" }}
                        type="radio"
                        name="status"
                        value="Deactive"
                      />
                      <span style={{ marginRight: "3px" }}>Deactive</span>
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
            </ModalBody>
          </Modal>
        </Card>
      </div>
    </div>
  );
};
export default CreatePromotionalActivity;
