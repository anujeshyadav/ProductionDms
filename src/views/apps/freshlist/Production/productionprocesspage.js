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
  CustomInput,
} from "reactstrap";

import "../../../../assets/scss/pages/users.scss";
import {
  _GetList,
  _Post,
  _PostSave,
  AllCategoryList,
} from "../../../../ApiEndPoint/ApiCalling";
import "../../../../assets/scss/pages/users.scss";
import { Route } from "react-router-dom";
import { Steps_Of_Production } from "../../../../ApiEndPoint/ProductionApi";
import swal from "sweetalert";
import LedgerPdf from "../house/LedgerPdf";
import { Category_List } from "../../../../ApiEndPoint/Api";

const ProductionProcess = (args) => {
  const [modalOne, setModalOne] = useState(false);
  const [Category, setCategoryList] = useState([]);
  const [CategoryValue, setCategory] = useState({});
  const toggleOne = () => setModalOne(!modalOne);

  const [product, setProduct] = useState([
    {
      step_Name: "",
      note: "",
    },
  ]);

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("userData"));
    let Url = `${Category_List + user?._id}/${user?.database}`;
    _GetList(Url)
      .then((res) => {
        setCategoryList(res?.Category);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...product];
    list[index][name] = value;

    setProduct(list);
  };

  let addMoreProduct = () => {
    setProduct([
      ...product,
      {
        step_Name: "",
        note: "",
      },
    ]);
  };
  let removeMoreProduct = (i) => {
    let newFormValues = [...product];
    newFormValues.splice(i, 1);

    setProduct(newFormValues);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    let userdata = JSON.parse(localStorage.getItem("userData"));
    debugger;
    product?.forEach((item, index) => {
      item["step_No"] = +index + 1;
    });
    let payload = {
      steps: product,
      createdBy: userdata?._id,
      processName: CategoryValue?.processName,
    };
    _PostSave(Steps_Of_Production, payload)
      .then((res) => {
        swal("success", "Production Steps are Added", "success");
        window.history.back();
      })
      .catch((err) => {
        swal("error", "error Occured", "error");
      });
  };
  const handleChange = (e) => {
    let { name, value } = e.target;
    setCategory({ ...CategoryValue, [name]: value });
  };

  return (
    <div>
      <Card>
        {/* <LedgerPdf downloadFileName="CustomPdf" rootElementId="testId" />
        <div id="testId">This is A Downloadable Component</div> */}

        <Row className="m-1">
          <Col lg="8" md="8" sm="8" className="mb-2 mt-1">
            <div>
              <h1 className=""> Production Steps</h1>
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
        <Row></Row>
        <CardBody>
          <Form className="m-1" onSubmit={submitHandler}>
            <Row className="mb-1">
              <Col lg="4" md="4" sm="12">
                <Label>Select Process Name * </Label>
                <CustomInput
                  name="processName"
                  placeholder="Enter Process Name"
                  required
                  onChange={handleChange}
                  type="select">
                  <option value="">----select----</option>
                  {Category?.length &&
                    Category?.map((item) => (
                      <option value={item?._id}>{item?.name}</option>
                    ))}
                </CustomInput>
              </Col>
            </Row>

            {product &&
              product?.map((product, index) => (
                <Row className="" key={index}>
                  <Col className="mb-1" lg="4" md="4" sm="12">
                    <div className="">
                      <Label>Step Name ({index + 1})</Label>
                      <Input
                        required
                        type="text"
                        name="step_Name"
                        onChange={(e) => handleInputChange(e, index)}
                        placeholder="Production Step Name"
                        value={product.step_Name}
                      />
                    </div>
                  </Col>
                  <Col className="mb-1" lg="4" md="4" sm="12">
                    <div className="">
                      <Label>Note</Label>
                      <Input
                        type="text"
                        name="note"
                        placeholder="note"
                        value={product?.note}
                        onChange={(e) => handleInputChange(e, index)}
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
                  </Col>
                </Row>
              ))}
            <div className="float-right">
              <div className="btnStyle">
                <Button
                  className="ml-1 mb-1"
                  color="primary"
                  type="button"
                  onClick={() => addMoreProduct()}>
                  + Add
                </Button>
              </div>
            </div>

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
    </div>
  );
};
export default ProductionProcess;

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
//   CustomInput,
// } from "reactstrap";
// import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

// import Multiselect from "multiselect-react-dropdown";
// import "../../../../assets/scss/pages/users.scss";
// import {
//   ProductListView,
//   UnitListView,
//   WarehousetoWareHouseTrx,
//   _Post,
//   _PostSave,
// } from "../../../../ApiEndPoint/ApiCalling";
// import "../../../../assets/scss/pages/users.scss";
// import { Route } from "react-router-dom";
// import { Save_Producton_Process } from "../../../../ApiEndPoint/Api";
// import swal from "sweetalert";
// import LedgerPdf from "../house/LedgerPdf";

// let GrandTotal = [];
// let SelectedITems = [];
// let SelectedSize = [];
// const ProductionProcess = (args) => {
//   const [formData, setFormData] = useState({});
//   const [ExtraCharges, setExtraCharges] = useState({
//     Other_Expenses: 100,
//     GSTApplied: 18,
//     Other_charges: 50,
//     discount: 10,
//   });

//   const [Index, setIndex] = useState("");
//   const [StockTrxdate, setStockTrxDate] = useState("");
//   const [index, setindex] = useState("");
//   const [error, setError] = useState("");
//   const [ProductList, setProductList] = useState([]);
//   const [itemList, setitemList] = useState([]);
//   const [ProductWTWList, setProductWTWList] = useState([]);
//   const [ProductinProduct, setProductionProduct] = useState({});
//   const [WareHousetwo, setWareHousetwo] = useState([]);
//   const [grandTotalAmt, setGrandTotalAmt] = useState(0);
//   const [UnitList, setUnitList] = useState([]);
//   const [UserInfo, setUserInfo] = useState({});
//   const [modal, setModal] = useState(false);

//   const [modalOne, setModalOne] = useState(false);
//   const toggleOne = () => setModalOne(!modalOne);

//   const handleExtraCharge = (e) => {
//     let { name, value } = e.target;
//     setExtraCharges({
//       ...ExtraCharges,
//       [name]: value,
//     });
//   };

//   const [product, setProduct] = useState([
//     {
//       product: "",
//       productId: "",
//       selecetedUnit: "",
//       WasteUnit: "",
//       AvailaleQty: null,
//       Waste_Qty: null,
//       WastePrice: "",
//       availableQty: "",
//       transferQty: 1,
//       RequiredQty: "",
//       price: "",
//       totalprice: "",
//       Size: "",
//       unitType: "",
//       stockTrxDate: "",
//       targetEndDate: "",
//       discount: "",
//       Shipping: "",
//       tax: "",
//       grandTotal: "",
//     },
//   ]);

//   const handleProductChangeProduct = (e, index, avalaibleSize) => {
//     if (avalaibleSize >= Number(e.target.value)) {
//       setIndex(index);
//       console.log(product);

//       const { name, value } = e.target;
//       const list = [...product];
//       if (name.includes("transferQty")) {
//         // list[index]["Size"] = Number(value);
//         let available = Number(list[index]["AvailaleQty"]);
//         let Askingfor = Number(value);
//         if (available >= Askingfor) {
//           list[index][name] = Askingfor;
//         } else {
//           swal("Can not Transfer More then Stock");
//           list[index][name] = available - 1;
//         }
//       } else {
//         list[index][name] = value;
//       }
//       console.log(GrandTotal);

//       let amt = 0;
//       if (list.length > 0) {
//         const x = list?.map((val) => {
//           GrandTotal[index] = val.Size * val.price * val.transferQty;
//           list[index]["totalprice"] = val.Size * val.price * val.transferQty;
//           return val.Size * val.price * val.transferQty;
//         });
//         amt = x.reduce((a, b) => a + b);
//         console.log("GrandTotal", amt);
//       }

//       setProduct(list);
//       setGrandTotalAmt(amt);
//     } else {
//       return null;
//     }
//   };
//   const handleProductChangeProductTwo = (e, index) => {
//     setIndex(index);

//     const { name, value } = e.target;
//     const list = [...product];
//     list[index][name] = value;
//     setProduct(list);
//   };
//   const handleSubmitCharges = (e) => {
//     e.preventDefault();
//     debugger;
//     const list = [...product];
//     let amt = 0;
//     if (list.length > 0) {
//       const x = list?.map((val) => {
//         return val?.price * val?.RequiredQty;
//       });
//       amt = x.reduce((a, b) => a + b);
//     }

//     let Totalamount =
//       amt +
//       ExtraCharges?.Other_Expenses +
//       (amt * ExtraCharges?.GSTApplied) / 100 +
//       ExtraCharges?.Other_charges;
//     // -
//     // ExtraCharges?.discount;

//     setGrandTotalAmt(Totalamount.toFixed(2));
//   };
//   const handleProductChangeProductone = (e, index) => {
//     setIndex(index);
//     const { name, value } = e.target;
//     const list = [...product];

//     list[index][name] = Number(value);

//     let amt = 0;
//     if (list.length > 0) {
//       const x = list?.map((val) => {
//         GrandTotal[index] = val.price * val.RequiredQty;
//         list[index]["totalprice"] = val.price * val.RequiredQty;
//         return val?.price * val?.RequiredQty;
//       });
//       amt = x.reduce((a, b) => a + b);
//       console.log("GrandTotal", amt);
//     }
//     setProduct(list);
//     setGrandTotalAmt(amt.toFixed(2));
//   };
//   console.log(ExtraCharges);
//   const handleRemoveSelected = (selectedList, selectedItem, index) => {
//     SelectedITems.splice(index, 1);
//     let myarr = product?.map((ele, i) => {
//       console.log(ele?.qty * selectedItem[i]?.Product_MRP);
//       let indextotal = ele?.qty * SelectedITems[i]?.Product_MRP;
//       GrandTotal[index] = indextotal;
//       return indextotal;
//     });

//     let amt = myarr.reduce((a, b) => a + b);

//     setGrandTotalAmt(amt);
//   };
//   const handleRemoveSelectedone = (selectedList, selectedItem, index) => {
//     SelectedSize.splice(index, 1);
//     let myarr = product?.map((ele, i) => {
//       console.log(ele?.Size * ele?.price * SelectedSize[i]?.unitQty);
//       let indextotal = ele?.Size * SelectedSize[i]?.unitQty;
//       GrandTotal[index] = indextotal;
//       return indextotal;
//     });

//     let amt = myarr.reduce((a, b) => a + b);
//     setGrandTotalAmt(amt);
//   };
//   const handleSelection = (selectedList, selectedItem, index) => {
//     // product[index]["AvailaleQty"] = myproduct?.Size;
//     SelectedITems.push(selectedItem);
//     setProduct((prevProductList) => {
//       const updatedProductList = [...prevProductList]; // Create a copy of the productList array
//       const updatedProduct = { ...updatedProductList[index] }; // Create a copy of the product at the specified index
//       updatedProduct.price = selectedItem?.Product_MRP; // Update the price of the copied product
//       updatedProduct.productId = selectedItem?.productId?._id;
//       updatedProduct.AvailaleQty = selectedItem?.Size;
//       updatedProductList[index] = updatedProduct; // Replace the product at the specified index with the updated one

//       return updatedProductList; // Return the updated product list to set the state
//     });
//   };
//   const handleSelectionProduct = (selectedList, selectedItem, index) => {
//     SelectedITems.push(selectedItem);
//     setProduct((prevProductList) => {
//       const updatedProductList = [...prevProductList]; // Create a copy of the productList array
//       const updatedProduct = { ...updatedProductList[index] }; // Create a copy of the product at the specified index
//       updatedProduct.price = selectedItem?.Product_MRP; // Update the price of the copied product
//       updatedProduct.productId = selectedItem?._id;
//       // updatedProduct.discount = selectedItem?.discount;
//       if (selectedItem?.unitType) {
//         updatedProduct.unitType = selectedItem?.unitType.split(" ")[1];
//       }
//       // updatedProduct.AvailaleQty = selectedItem?.Size;
//       updatedProductList[index] = updatedProduct; // Replace the product at the specified index with the updated one

//       return updatedProductList; // Return the updated product list to set the state
//     });
//   };
//   const handleSelectionone = (selectedList, selectedItem, index) => {
//     SelectedSize.push(selectedItem);

//     setProduct((prevProductList) => {
//       const updatedProductList = [...prevProductList]; // Create a copy of the productList array
//       const updatedProduct = { ...updatedProductList[index] }; // Create a copy of the product at the specified index
//       updatedProduct.Size = selectedItem?.unitQty; // Update the price of the copied product
//       updatedProduct.unitType = selectedItem?.primaryUnit;
//       updatedProductList[index] = updatedProduct; // Replace the product at the specified index with the updated one
//       let myarr = prevProductList?.map((ele, i) => {
//         console.log(ele?.transferQty * ele?.price * SelectedSize[i]?.unitQty);
//         let indextotal =
//           ele?.transferQty * ele?.price * SelectedSize[i]?.unitQty;
//         GrandTotal[index] = indextotal;
//         return indextotal;
//       });
//       let amt = myarr?.reduce((a, b) => a + b);
//       setGrandTotalAmt(amt);
//       return updatedProductList; // Return the updated product list to set the state
//     });
//     // onSelect1(selectedList, selectedItem, index);
//   };
//   const handleInputChange = (e, type, i) => {
//     const { name, value, checked } = e.target;
//     setindex(i);
//     if (type == "checkbox") {
//       if (checked) {
//         setFormData({
//           ...formData,
//           [name]: checked,
//         });
//       } else {
//         setFormData({
//           ...formData,
//           [name]: checked,
//         });
//       }
//     } else {
//       if (type == "number") {
//         if (/^\d{0,10}$/.test(value)) {
//           setFormData({
//             ...formData,
//             [name]: value,
//           });
//           setError("");
//         } else {
//           setError(
//             "Please enter a valid number with a maximum length of 10 digits"
//           );
//         }
//       } else {
//         if (value.length <= 10) {
//           setFormData({
//             ...formData,
//             [name]: value,
//           });
//           setError("");
//         } else {
//           setFormData({
//             ...formData,
//             [name]: value,
//           });
//         }
//       }
//     }
//   };

//   useEffect(() => {
//     let userData = JSON.parse(localStorage.getItem("userData"));

//     UnitListView(userData?._id, userData?.database)
//       .then((res) => {
//         // console.log(res?.Unit);
//         setUnitList(res?.Unit);
//       })
//       .catch((err) => {
//         console.log(err);
//       });

//     ProductListView(userData?._id, userData?.database)
//       .then((res) => {
//         console.log(res.Product);
//         if (res.Product?.length) {
//           setitemList(res.Product);
//         }
//         let Items = res?.Product?.filter(
//           (ele) => ele?.addProductType == "Item"
//         );
//         let Products = res?.Product?.filter(
//           (ele) => ele?.addProductType == "Product"
//         );
//         if (res.Product?.length) {
//           setProductList(res.Product);
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, []);
//   useEffect(() => {
//     const userInfo = JSON.parse(localStorage.getItem("userData"));
//     console.log(userInfo);
//     setUserInfo(userInfo);
//   }, []);

//   let addMoreProduct = () => {
//     setProduct([
//       ...product,
//       {
//         product: "", //
//         productId: "",
//         selecetedUnit: "",
//         AvailaleQty: null,
//         AvailaleQty: null,
//         Waste_Qty: null,
//         WastePrice: "",
//         availableQty: "",
//         transferQty: 1, //
//         RequiredQty: "",
//         price: "", //
//         totalprice: "", //
//         Size: "",
//         unitType: "",
//         stockTrxDate: "",
//         targetEndDate: "",
//         discount: "",
//         Shipping: "",
//         tax: "",
//         grandTotal: "",
//       },
//     ]);
//   };
//   let removeMoreProduct = (i) => {
//     let newFormValues = [...product];
//     newFormValues.splice(i, 1);
//     GrandTotal.splice(i, 1);
//     let amt = GrandTotal.reduce((a, b) => a + b);
//     setGrandTotalAmt(amt);

//     setProduct(newFormValues);
//   };
//   // let handlePartChange = (i, e) => {
//   //   let newFormValues = [...part];
//   //   newFormValues[i][e.target.name] = e.target.value;
//   //   setPart(newFormValues);
//   // };

//   const WareHousetoWareHouse = (e) => {
//     e.preventDefault();
//     // body: warehouse, productId, Size, unitType, transferQty, price, totalPrice;
//     let userdata = JSON.parse(localStorage.getItem("userData"));
//     let Allproduct = product?.map((ele, i) => {
//       console.log(ele);
//       return {
//         productId: ele?.productId,
//         unitType: ele?.unitType,
//         price: ele?.price,
//         Size: ele?.Size,
//         transferQty: ele?.transferQty,
//         totalPrice: ele?.totalprice,
//         currentStock: ele?.transferQty * ele?.Size,
//       };
//     });
//     let payload = {
//       productItems: Allproduct,
//       warehouseToId: WareHousetwo[0]?._id,
//       warehouseFromId: ProductinProduct[0]?._id,
//       stockTransferDate: StockTrxdate,
//       grandTotal: grandTotalAmt,
//       transferStatus: "InProcess",
//       created_by: userdata?._id,
//     };
//     console.log(payload);
//     WarehousetoWareHouseTrx(payload)
//       .then((res) => {
//         //   window.location.reload();
//         // history.goBack();
//         swal("Stock transerffered is Initiated");

//         console.log(res);
//       })
//       .catch((err) => {
//         console.log(err);
//         swal("Something Went Wrong");
//       });
//   };
//   const handleAddCharges = (e) => {
//     toggleOne();
//     e.preventDefault();
//   };
//   const submitHandler = (e) => {
//     e.preventDefault();

//     let userdata = JSON.parse(localStorage.getItem("userData"));

//     let Allproduct = product?.map((ele, i) => {
//       return {
//         productId: ele?.productId,
//         unit: ele?.unitType,
//         price: ele?.price,
//         qty: ele?.RequiredQty,
//         unitType: ele?.selecetedUnit,
//         totalPrice: ele?.price * ele?.RequiredQty,
//       };
//     });
//     let AllWastagematerial = product?.map((ele, i) => {
//       return {
//         productId: ele?.productId,
//         unit: ele?.WasteUnit,
//         price: ele?.price,
//         qty: ele?.Waste_Qty,
//         unitType: ele?.WasteUnit,
//         totalPrice: ele?.price * ele?.Waste_Qty,
//       };
//     });
//     let ALL =
//       Number(grandTotalAmt) +
//       Number(ExtraCharges?.Other_Expenses) +
//       Number(ExtraCharges?.Other_charges) +
//       (Number(grandTotalAmt) * ExtraCharges?.GSTApplied) / 100;
//     // -
//     // Number(ExtraCharges?.discount);
//     let payload = {
//       created_by: userdata?._id,
//       product_name: ProductinProduct?._id,
//       productItems: Allproduct,
//       wastageItems: AllWastagematerial,
//       miscellaneousExpennses: ExtraCharges?.Other_Expenses,
//       gstApplied: ExtraCharges?.GSTApplied,
//       otherCharges: ExtraCharges?.Other_charges,
//       // discount: ExtraCharges?.discount,
//       grandTotal: ALL,
//     };

//     _PostSave(Save_Producton_Process, payload)
//       .then((res) => {
//         toggleOne();
//         swal("Production Process is Started");
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };
//   const onSelect1 = (selectedList, selectedItem, index) => {
//     // console.log(selectedList[0]);
//     setProductionProduct(selectedList[0]);
//     // setProductList(selectedList[0].productItems);
//   };
//   const onSelectone = (selectedList, selectedItem, index) => {
//     console.log(selectedList);

//     setProductionProduct(selectedList);
//     // const list = [...product];
//     let MySelectedwarehouseProduct = selectedList[0].productItems?.map(
//       (ele, i) => {
//         let myproduct = ele?.productId;
//         ele["Product_Title"] = myproduct?.Product_Title;
//         ele["Product_id"] = myproduct?._id;
//         ele["Product_MRP"] = myproduct?.Product_MRP;
//         // ele["discount"] = myproduct?.discount;
//         ele["transferQty"] = myproduct?.transferQty;
//         ele["MIN_stockalert"] = myproduct?.MIN_stockalert;
//       }
//     );

//     // console.log(selectedList[0]?.productItems);

//     setProductWTWList(selectedList[0]?.productItems);
//   };
//   const onRemove1 = (selectedList, removedItem, index) => {
//     // console.log(selectedList);
//     // console.log(index);
//   };
//   const onRemoveone = (selectedList, removedItem, index) => {
//     // console.log(selectedList);
//     // console.log(index);
//   };
//   const onSelect2 = (selectedList, selectedItem, index) => {
//     // console.log(selectedList);
//     setWareHousetwo(selectedList);
//   };
//   const onRemove2 = (selectedList, removedItem, index) => {
//     // console.log(selectedList);
//     // console.log(index);
//   };
//   return (
//     <div>
//       <Card>
//         {/* <LedgerPdf downloadFileName="CustomPdf" rootElementId="testId" />
//         <div id="testId">This is A Downloadable Component</div> */}

//         <Row className="m-2">
//           <Col lg="8" md="8" sm="8" className="mb-2 mt-1">
//             <div>
//               <h1 className="">Start Production Process</h1>
//             </div>
//           </Col>
//           <Col>
//             <div className="float-right">
//               <Route
//                 render={({ history }) => (
//                   <Button
//                     style={{ cursor: "pointer" }}
//                     className="float-right mr-1"
//                     color="primary"
//                     onClick={() => history.goBack()}>
//                     {" "}
//                     Back
//                     {/* <FaPlus size={15} /> Create User */}
//                   </Button>
//                 )}
//               />
//             </div>
//           </Col>
//         </Row>
//         <Row></Row>
//         <CardBody>
//           <Form className="m-1" onSubmit={handleAddCharges}>
//             <Row>
//               <Col className="mb-1" lg="2" md="2" sm="12">
//                 <div className="">
//                   <Label>Choose Production Product </Label>

//                   <Multiselect
//                     required
//                     selectionLimit={1}
//                     // showCheckbox="true"
//                     isObject="false"
//                     options={ProductList} // Options to display in the dropdown
//                     // selectedValues={selectedValue}   // Preselected value to persist in dropdown
//                     onSelect={onSelect1} // Function will trigger on select event
//                     onRemove={onRemove1} // Function will trigger on remove event
//                     displayValue="Product_Title" // Property name to display in the dropdown options
//                   />
//                 </div>
//               </Col>
//             </Row>
//             {/* <div className="px-2">
//               <Table bordered hover responsive>
//                 <thead>
//                   <tr>
//                     <th>#</th>
//                     <th>Choose Items</th>
//                     <th>Select Unit</th>
//                     <th>Price</th>
//                     <th>Required Quantity</th>
//                     <th>Total Price</th>
//                     <th>Waste Unit</th>
//                     <th>Waste Quantity</th>
//                     <th>Waste Total</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {product &&
//                     product?.map((product, index) => {
//                       return (
//                         <tr key={index}>
//                           <th>#</th>
//                           <th>Choose Items</th>
//                           <th>Select Unit</th>
//                           <th>Price</th>
//                           <th>Required Quantity</th>
//                           <th>Total Price</th>
//                           <th>Waste Unit</th>
//                           <th>Waste Quantity</th>
//                           <th>Waste Total</th>
//                         </tr>
//                       );
//                     })}
//                 </tbody>
//               </Table>
//             </div> */}
//             {product &&
//               product?.map((product, index) => (
//                 <Row className="" key={index}>
//                   <Col className="mb-1" lg="2" md="2" sm="12">
//                     <div className="">
//                       <Label>Choose item *</Label>
//                       <Multiselect
//                         required
//                         selectionLimit={1}
//                         // showCheckbox="true"
//                         isObject="false"
//                         options={itemList}
//                         // selectedValues={selectedValue}   // Preselected value to persist in dropdown
//                         onSelect={(selectedList, selectedItem) =>
//                           handleSelectionProduct(
//                             selectedList,
//                             selectedItem,
//                             index
//                           )
//                         }
//                         onRemove={(selectedList, selectedItem) => {
//                           handleRemoveSelected(
//                             selectedList,
//                             selectedItem,
//                             index
//                           );
//                         }}
//                         displayValue="Product_Title" // Property name to display in the dropdown options
//                       />
//                     </div>
//                   </Col>
//                   <Col className="mb-1" lg="1" md="1" sm="12">
//                     <div className="">
//                       <label for="unit">Select Unit</label>
//                       <select
//                         required
//                         className="form-control"
//                         name="selecetedUnit"
//                         placeholder="selecetedUnit"
//                         value={product?.selecetedUnit}
//                         onChange={(e) =>
//                           handleProductChangeProductTwo(e, index)
//                         }
//                         id="unit">
//                         <option value="">--select Unit--</option>
//                         <option value="kg">Kilogram (kg)</option>
//                         <option value="Pcs">Pieces (Pcs)</option>
//                         <option value="g">Gram (g)</option>
//                         <option value="tonne">Metric Ton (tonne)</option>
//                         <option value="m">Meter (m)</option>
//                         <option value="cm">Centimeter (cm)</option>
//                         <option value="mm">Millimeter (mm)</option>
//                         <option value="in">Inch (in)</option>
//                         <option value="ft">Foot (ft)</option>
//                         <option value="m3">Cubic Meter (m³)</option>
//                         <option value="L">Liter (L)</option>
//                         <option value="ml">Milliliter (ml)</option>
//                         <option value="s">Second (s)</option>
//                         <option value="min">Minute (min)</option>
//                         <option value="hr">Hour (hr)</option>
//                         <option value="°C">Celsius (°C)</option>
//                         <option value="°F">Fahrenheit (°F)</option>
//                         <option value="Pa">Pascal (Pa)</option>
//                         <option value="bar">Bar (bar)</option>
//                         <option value="m/s">Meters per Second (m/s)</option>
//                         <option value="km/h">Kilometers per Hour (km/h)</option>
//                         <option value="A">Ampere (A)</option>
//                         <option value="V">Volt (V)</option>
//                         <option value="W">Watt (W)</option>
//                         <option value="kW">Kilowatt (kW)</option>
//                       </select>
//                     </div>
//                   </Col>
//                   <Col className="mb-1" lg="1" md="1" sm="12">
//                     <div className="">
//                       <Label>
//                         Price{product?.unitType && product?.unitType}
//                       </Label>
//                       <Input
//                         type="number"
//                         name="price"
//                         readOnly
//                         aria-readonly
//                         onChange={(e) =>
//                           handleProductChangeProductone(e, index)
//                         }
//                         placeholder="Price"
//                         value={product.price}
//                       />
//                     </div>
//                   </Col>
//                   <Col className="mb-1" lg="1" md="1" sm="12">
//                     <div className="">
//                       <Label>Req_Qty</Label>
//                       <Input
//                         type="number"
//                         min={0}
//                         step="any"
//                         name="RequiredQty"
//                         placeholder="Req_Qty"
//                         value={product?.RequiredQty}
//                         onChange={(e) =>
//                           handleProductChangeProductone(e, index)
//                         }
//                       />
//                     </div>
//                   </Col>

//                   {/* <Col className="mb-1" lg="1" md="1" sm="12">
//                     <div className="">
//                       <Label>Discount</Label>
//                       <Input
//                         type="number"
//                         name="discount"
//                         readOnly
//                         placeholder="Discount"
//                         value={product.discount}
//                       />
//                     </div>
//                   </Col> */}
//                   <Col className="mb-1" lg="1" md="1" sm="12">
//                     <div className="">
//                       <Label>Total Price</Label>
//                       <Input
//                         type="number"
//                         name="totalprice"
//                         readOnly
//                         placeholder="TtlPrice"
//                         value={product?.price * product?.RequiredQty}
//                       />
//                     </div>
//                   </Col>
//                   <Col className="mb-1" lg="1" md="1" sm="12">
//                     <div className="">
//                       <label for="unit">Waste Unit</label>
//                       <select
//                         required
//                         className="form-control"
//                         name="WasteUnit"
//                         placeholder="WasteUnit"
//                         value={product?.WasteUnit}
//                         onChange={(e) =>
//                           handleProductChangeProductTwo(e, index)
//                         }
//                         id="unit">
//                         <option value="">--select Unit--</option>
//                         <option value="kg">Kilogram (kg)</option>
//                         <option value="Pcs">Pieces (Pcs)</option>
//                         <option value="g">Gram (g)</option>
//                         <option value="tonne">Metric Ton (tonne)</option>
//                         <option value="m">Meter (m)</option>
//                         <option value="cm">Centimeter (cm)</option>
//                         <option value="mm">Millimeter (mm)</option>
//                         <option value="in">Inch (in)</option>
//                         <option value="ft">Foot (ft)</option>
//                         <option value="m3">Cubic Meter (m³)</option>
//                         <option value="L">Liter (L)</option>
//                         <option value="ml">Milliliter (ml)</option>
//                         <option value="s">Second (s)</option>
//                         <option value="min">Minute (min)</option>
//                         <option value="hr">Hour (hr)</option>
//                         <option value="°C">Celsius (°C)</option>
//                         <option value="°F">Fahrenheit (°F)</option>
//                         <option value="Pa">Pascal (Pa)</option>
//                         <option value="bar">Bar (bar)</option>
//                         <option value="m/s">Meters per Second (m/s)</option>
//                         <option value="km/h">Kilometers per Hour (km/h)</option>
//                         <option value="A">Ampere (A)</option>
//                         <option value="V">Volt (V)</option>
//                         <option value="W">Watt (W)</option>
//                         <option value="kW">Kilowatt (kW)</option>
//                       </select>
//                     </div>
//                   </Col>
//                   <Col className="mb-1" lg="1" md="1" sm="12">
//                     <div className="">
//                       <Label>Waste_Qty</Label>
//                       <Input
//                         type="number"
//                         min={0}
//                         step="any"
//                         name="Waste_Qty"
//                         placeholder="Waste_Qty"
//                         value={product?.Waste_Qty}
//                         onChange={(e) =>
//                           handleProductChangeProductone(e, index)
//                         }
//                       />
//                     </div>
//                   </Col>
//                   <Col className="mb-1" lg="1" md="1" sm="12">
//                     <div className="">
//                       <Label>Total</Label>
//                       <Input
//                         type="number"
//                         name="WastePrice"
//                         readOnly
//                         placeholder="WasteTotal"
//                         value={product?.price * product?.Waste_Qty}
//                       />
//                     </div>
//                   </Col>

//                   <Col className="d-flex mt-1 abb" lg="3" md="3" sm="12">
//                     <div className="btnStyle">
//                       {index ? (
//                         <Button
//                           type="button"
//                           color="danger"
//                           className="button remove "
//                           onClick={() => removeMoreProduct(index)}>
//                           - Remove
//                         </Button>
//                       ) : null}
//                     </div>

//                     <div className="btnStyle">
//                       <Button
//                         className="ml-1 mb-1"
//                         color="primary"
//                         type="button"
//                         onClick={() => addMoreProduct()}>
//                         + Add
//                       </Button>
//                     </div>
//                   </Col>
//                 </Row>
//               ))}
//             <Row>
//               {/* <Col className="mb-1" lg="2" md="2" sm="12">
//                       <div className="">
//                         <Label>Discount</Label>
//                         <Input
//                           type="number"
//                           name="discount"
//                           readOnly
//                           placeholder="Dissct"
//                           value={product.discount}
//                         />
//                       </div>
//                     </Col> */}
//               {/* <Col className="mb-1" lg="2" md="2" sm="12">
//                       <div className="">
//                         <Label>Shipping Cost</Label>
//                         <Input
//                           type="number"
//                           name="Shipcst"
//                           readOnly
//                           placeholder="Shipcst"
//                           value={product.Shipping}
//                         />
//                       </div>
//                     </Col> */}
//               {/* <Col className="mb-1" lg="2" md="2" sm="12">
//                       <div className="">
//                         <Label>Tax</Label>
//                         <Input
//                           type="number"
//                           name="tax"
//                           readOnly
//                           placeholder="Tax"
//                           value={product.tax}
//                         />
//                       </div>
//                     </Col> */}
//             </Row>
//             <Row>
//               <Col className="mb-1" lg="12" md="12" sm="12">
//                 <div className=" d-flex justify-content-end">
//                   <Label className="pr-5">
//                     Grand Total :{" "}
//                     <stron>
//                       {grandTotalAmt && grandTotalAmt == "NaN"
//                         ? 0
//                         : grandTotalAmt}{" "}
//                     </stron>
//                   </Label>
//                 </div>
//               </Col>
//             </Row>
//             <Row>
//               <Col>
//                 <div className="d-flex justify-content-center">
//                   <Button.Ripple color="primary" type="submit" className="mt-2">
//                     Submit
//                   </Button.Ripple>
//                 </div>
//               </Col>
//             </Row>
//           </Form>
//         </CardBody>
//       </Card>
//       <Modal
//         style={{ maxWidth: "1050px" }}
//         isOpen={modalOne}
//         toggle={toggleOne}
//         {...args}>
//         <ModalHeader toggle={toggleOne}>Add Charges</ModalHeader>
//         <ModalBody>
//           <Form className="m-1" onSubmit={submitHandler}>
//             <Row>
//               <Col className="mb-1" lg="3" md="3" sm="12">
//                 <div className="">
//                   <Label>Miscellaneous Expenses </Label>

//                   <input
//                     className="form-control"
//                     name="Other_Expenses"
//                     value={ExtraCharges?.Other_Expenses}
//                     onChange={handleExtraCharge}
//                     type="number"
//                   />
//                 </div>
//               </Col>
//               <Col className="mb-1" lg="3" md="3" sm="12">
//                 <div className="">
//                   <Label>GST Applied </Label>

//                   <CustomInput
//                     className="form-control"
//                     name="GSTApplied"
//                     value={ExtraCharges?.GSTApplied}
//                     onChange={handleExtraCharge}
//                     type="select">
//                     <option>--select--</option>
//                     <option value={18}>18</option>
//                     <option value={9}>9</option>
//                   </CustomInput>
//                 </div>
//               </Col>
//               <Col className="mb-1" lg="3" md="3" sm="12">
//                 <div className="">
//                   <Label>Other Charges </Label>

//                   <input
//                     className="form-control"
//                     name="Other_charges"
//                     value={ExtraCharges?.Other_charges}
//                     onChange={handleExtraCharge}
//                     type="number"
//                   />
//                 </div>
//               </Col>
//               {/* <Col className="mb-1" lg="3" md="3" sm="12">
//                 <div className="">
//                   <Label>Discount </Label>
//                   <input
//                     className="form-control"
//                     value={ExtraCharges?.discount}
//                     name="discount"
//                     onChange={handleExtraCharge}
//                     type="number"
//                   />
//                 </div>
//               </Col> */}
//               {/* <Col className="mb-1" lg="3" md="3" sm="12">
//                 <div className=" mt-2">
//                   <Button color="primary" onClick={handleSubmitCharges}>
//                     Add Charges
//                   </Button>
//                 </div>
//               </Col> */}
//             </Row>
//             <Row>
//               <Col>
//                 <div className="d-flex justify-content-end">
//                   <strong> SubTotal:</strong>{" "}
//                   {grandTotalAmt && grandTotalAmt == "NaN" ? 0 : grandTotalAmt}{" "}
//                 </div>
//                 <div className="d-flex justify-content-end">
//                   <strong> Miscellaneous:</strong>
//                   {ExtraCharges?.Other_Expenses}
//                 </div>
//                 <div className="d-flex justify-content-end">
//                   <strong> GST:</strong>{" "}
//                   {(ExtraCharges?.GSTApplied * grandTotalAmt) / 100}
//                 </div>
//                 <div className="d-flex justify-content-end">
//                   <strong> other:</strong>
//                   {ExtraCharges?.Other_charges}
//                 </div>
//                 <div className="d-flex justify-content-end">
//                   <strong> Discount: </strong>
//                   {ExtraCharges?.discount}
//                 </div>
//                 <div className="d-flex justify-content-end">
//                   <strong> GrandTotal:</strong>

//                   {(
//                     Number(grandTotalAmt) +
//                     Number(ExtraCharges?.Other_Expenses) +
//                     Number(ExtraCharges?.Other_charges) +
//                     (Number(grandTotalAmt) * ExtraCharges?.GSTApplied) / 100
//                   )?.toFixed(2)}
//                 </div>
//               </Col>
//             </Row>
//             <Row>
//               <Col>
//                 <div className="d-flex justify-content-center">
//                   <Button color="primary" type="submit">
//                     Submit
//                   </Button>{" "}
//                 </div>
//               </Col>
//             </Row>
//           </Form>
//         </ModalBody>
//         <ModalFooter></ModalFooter>
//       </Modal>
//     </div>
//   );
// };
// export default ProductionProcess;
