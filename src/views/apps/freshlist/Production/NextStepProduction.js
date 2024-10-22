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
  Table,
} from "reactstrap";
import Multiselect from "multiselect-react-dropdown";

import "../../../../assets/scss/pages/users.scss";
import {
  _Get,
  _Post,
  _PostSave,
  _Put,
} from "../../../../ApiEndPoint/ApiCalling";
import "../../../../assets/scss/pages/users.scss";
import { Route, useParams } from "react-router-dom";
import {
  List_Raw_Material,
  List_Steps_Of_Production,
  Product_assignFor_Production,
  Product_assignFor_Production_Update,
  Product_assignFor_Production_ViewOne,
  VieW_Product_assignFor_Production_List,
} from "../../../../ApiEndPoint/ProductionApi";
import swal from "sweetalert";
import {
  Create_Account_List,
  PurchaseProductList_Product,
} from "../../../../ApiEndPoint/Api";
import { Unit_List } from "../../../../ApiEndPoint/Unitlist";

let GrandTotal = [];

const NextStepProduction = (args) => {
  const [modalOne, setModalOne] = useState(false);
  const [EditMode, setEditMode] = useState(false);
  const [Loader, setLoader] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [RawMaterial, setRawMaterial] = useState([]);
  const [ListStep, setListStep] = useState([]);
  const [ProductList, setProductList] = useState([]);
  const [ListOfStep, setListOfStep] = useState([]);
  const [ProcessList, setProcessList] = useState([]);
  const [UserList, setUsers] = useState([]);
  const [Data, setData] = useState({});
  const [Worker, setWorker] = useState({});
  const toggleOne = () => setModalOne(!modalOne);

  const [Product, setProduct] = useState([{}]);
  const [RawProducts, setRawProduct] = useState([]);
  let Params = useParams();

  useEffect(() => {
    let listOfStep;
    let userData = JSON.parse(localStorage.getItem("userData"));
    _Get(List_Raw_Material, userData?.database)
      .then((res) => {
        setRawMaterial(res?.Product);
      })
      .catch((err) => {
        console.log(err);
      });
    _Get(PurchaseProductList_Product, userData?.database)
      .then((res) => {
        setProductList(res?.Product);
      })
      .catch((err) => {
        console.log(err);
      });
    let url = `${Create_Account_List + userData?._id}/`;
    _Get(url, userData?.database)
      .then((res) => {
        let value = res?.adminDetails;

        if (value?.length > 0) {
          let selected = value?.filter(
            (ele) => ele?.rolename?.roleName !== userData?.rolename?.roleName
          );
          setUsers(selected);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    (async () => {
      await _Get(List_Steps_Of_Production, userData?._id)
        .then((res) => {
          let proccessList = res?.steps?.map((item) => {
            return item?.processName;
          });
          setProcessList(proccessList);
          if (res?.steps) {
            listOfStep = res?.steps;
            setListStep(res?.steps);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })();
    if (Params?.id == 0) {
      setEditMode(false);
    } else {
      setEditMode(true);
      setLoading(true);
      (async () => {
        await _Get(VieW_Product_assignFor_Production_List, Params.id)
          .then((res) => {
            setLoading(false);
            let selectedStep = listOfStep?.filter(
              (item) => item.processName._id == res?.product?.processName?._id
            );
            setListOfStep(selectedStep[0]?.steps);
            let data = res?.product;
            data.processName = data?.processName?._id;
            debugger;
            var PreviousStep = selectedStep[0]?.steps?.filter(
              (item) => item?._id == data?.currentStep
            );
            var NextStep = selectedStep[0]?.steps?.filter(
              (item) => item?.step_No == data?.step_No + 1
            );
            data.step_No = NextStep[0]?.step_No;
            data.currentStep = NextStep[0]?._id;
            data.step_name = NextStep[0]?.step_Name;
            data.currentStepName = PreviousStep[0]?.step_Name;

            setData(data);
            let currentProduct = res?.product.product_details?.map(
              (item) => item?.fProduct_name
            );
            setRawProduct(currentProduct);
          })
          .catch((err) => {
            setLoading(false);
            console.log(err);
          });
      })();
    }
  }, []);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...Product];
    list[index][name] = name == "wProduct_name" ? value : +value;

    setProduct(list);
  };

  let addMoreProduct = () => {
    setProduct([
      ...Product,
      {
        rProduct_name: "",
        rHeading1Value: "",
        rHeading2Value: "",
        rHeading3Value: "",
        fProduct_name: "",
        fHeading1Value: "",
        fHeading2Value: "",
        fHeading3Value: "",
        wProduct_name: "",
        wHeading1Value: "",
        wHeading2Value: "",
        wHeading3Value: "",
      },
    ]);
  };
  let removeMoreProduct = (i) => {
    let newFormValues = [...Product];
    newFormValues.splice(i, 1);

    setProduct(newFormValues);
  };

  const submitHandler = async (e) => {
    setLoader(true);
    e.preventDefault();
    let CurrentData = { ...Data };

    let userdata = JSON.parse(localStorage.getItem("userData"));
    delete CurrentData?._id;
    delete CurrentData?.product_details;
    CurrentData["currentStepName"] = Data?.step_name;
    let payload = {
      database: userdata?.database,
      ...CurrentData,
      product_details: Product,
      totalStep: ListOfStep?.length,
    };
    await _PostSave(Product_assignFor_Production, payload)
      .then((res) => {
        window.history.back();
        setLoader(false);

        swal("success", "Added Successfully", "success");
      })
      .catch((err) => {
        setLoader(false);

        swal("error", "error Occured", "error");
      });
    // }
  };
  const handleSelectionParty = async (selectedList, selectedItem) => {
    setWorker(selectedItem);
    setData({ ...Data, ["user_name"]: selectedItem?._id });
  };
  const onRemove1 = (selectedList, removedItem, index) => {
    setWorker({});
  };
  const onRemove = (selectedList, removedItem, index, name) => {
    setProduct((prevProducts) => {
      const updatedProducts = [...prevProducts];
      updatedProducts[index][name] = "";
      updatedProducts[index][`${name}_Units`] = [];
      return updatedProducts;
    });
  };
  const handleSelection = async (selectedList, selectedItem, index, name) => {
    let product = Product;
    product[index][name] = selectedItem._id;
    setProduct(product);
  };
  const handleChange = (e) => {
    let { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };
  const handleSelectionfinishedGoods = (
    selectedList,
    selectedItem,
    index,
    name
  ) => {
    setProduct((prevProducts) => {
      let newArr = selectedItem?.Units?.map((ele) => {
        let key = ele?.unit;
        return {
          unit: ele?.unit,
          value: null,
          qty: ele?.qty,
        };
      });
      const updatedProducts = [...prevProducts];
      updatedProducts[index][name] = selectedItem._id;
      updatedProducts[index][
        "stock"
      ] = `${selectedItem.qty}(${selectedItem?.stockUnit})`;
      // updatedProducts[index]["stockUnit"] = selectedItem.stockUnit;
      updatedProducts[index][`${name}_Units`] = newArr;

      return updatedProducts;
    });
  };
  if (Loading) {
    return <div className="d-flex justify-content-center">Loading...</div>;
  }
  return (
    <div>
      <Card>
        {/* <LedgerPdf downloadFileName="CustomPdf" rootElementId="testId" />
        <div id="testId">This is A Downloadable Component</div> */}

        <Row className="m-1">
          <Col lg="8" md="8" sm="8" className="mb-1 mt-1">
            <div>
              <h1 className="">
                {" "}
                Add Next Step
                {Data?.currentStep && (
                  <span style={{ fontSize: "12px", color: "red" }}>
                    {" "}
                    (Previous Step -- {Data?.currentStepName})
                  </span>
                )}
              </h1>
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
          <Form className="" onSubmit={submitHandler}>
            <Row>
              <Col lg="3" md="3" sm="12">
                <Label>
                  Selected Process
                  <span style={{ color: "red" }}>*</span>
                </Label>
                <CustomInput
                  disabled
                  name="processName"
                  onChange={(e) => {
                    let selectedStep = ListStep?.filter(
                      (item) => item.processName._id == e.target.value
                    );
                    setListOfStep(selectedStep[0]?.steps);
                    setData({ ...Data, ["processName"]: e.target.value });
                  }}
                  value={Data.processName}
                  type="select"
                  required>
                  <option>----select Process----</option>
                  {ProcessList?.length &&
                    ProcessList?.map((ele) => (
                      <option value={ele._id}>{ele?.name}</option>
                    ))}
                </CustomInput>
              </Col>
              <Col lg="3" md="3" sm="12">
                <Label>
                  Step Name <span style={{ color: "red" }}>*</span>
                </Label>
                <CustomInput
                  name="step_name"
                  onChange={(e) => {
                    const selected =
                      e.target.options[e.target.selectedIndex].getAttribute(
                        "data-id"
                      );
                    setData({
                      ...Data,
                      ["step_No"]: +selected?.split("_")[1],
                      ["step_name"]: e.target.value,
                      ["currentStep"]: selected?.split("_")[0],
                    });
                  }}
                  value={Data.step_name}
                  type="select"
                  required>
                  <option>----select Step----</option>
                  {ListOfStep?.length &&
                    ListOfStep?.map((ele, i) => (
                      <option
                        key={i}
                        data-id={`${ele?._id}_${ele?.step_No}`}
                        value={ele.step_Name}>
                        {ele?.step_Name}
                      </option>
                    ))}
                </CustomInput>
              </Col>
              <Col lg="3" md="3" sm="12">
                <Label>
                  Worker Name <span style={{ color: "red" }}>*</span>
                </Label>
                <Multiselect
                  selectionLimit={1}
                  isObject="false"
                  selectedValues={Worker?._id ? [Worker] : []}
                  name="worker Name"
                  options={UserList}
                  onSelect={(selectedList, selectedItem) =>
                    handleSelectionParty(selectedList, selectedItem)
                  }
                  onRemove={onRemove1}
                  displayValue="firstName"
                />
              </Col>
            </Row>

            {Product?.length > 0 &&
              Product?.map((product, index) => {
                {
                  /* if (EditMode) {
                  var RawProduct = ProductList?.filter(
                    (ele) => ele?._id == product?.rProduct_name
                  );
                  var finalProduct = RawMaterial?.filter(
                    (ele) => ele?._id == product?.fProduct_name
                  );
                  var WastageProduct = RawMaterial?.filter(
                    (ele) => ele?._id == product?.wProduct_name
                  );
                } */
                }
                return (
                  <Row className="mt-1" key={index}>
                    <Col>
                      <div className="viewspacebetween">
                        <div style={{ width: "260px" }}>
                          Raw Material <span style={{ color: "red" }}>*</span>
                          <Label>
                            <span style={{ color: "red", fontSize: "12px" }}>
                              {product?.stock && <>Stock:{product?.stock}</>}
                            </span>
                          </Label>
                          <Multiselect
                            className="choseeproduct"
                            selectionLimit={1}
                            name="rProduct_name"
                            isObject="false"
                            options={RawProducts}
                            onSelect={(selectedList, selectedItem) =>
                              handleSelectionfinishedGoods(
                                selectedList,
                                selectedItem,
                                index,
                                "rProduct_name"
                              )
                            }
                            onRemove={(selectedList, selectedItem) => {
                              onRemove(
                                selectedList,
                                selectedItem,
                                index,
                                "rProduct_name"
                              );
                            }}
                            displayValue="Product_Title" // Property name to display in the dropdown options
                          />
                        </div>
                        {product["rProduct_name_Units"]?.length > 0 ? (
                          <>
                            {product["rProduct_name_Units"]?.map((item, i) => {
                              return (
                                <div
                                  key={item}
                                  className="viewspacebetween2"
                                  style={{ width: "100px" }}>
                                  <Label>
                                    {item?.unit && item?.unit}
                                    <span style={{ color: "red" }}>*</span>
                                  </Label>
                                  <Input
                                    type="number"
                                    id="hideborder"
                                    name="value"
                                    value={item?.value}
                                    placeholder="Enter Value"
                                    onChange={(e) => {
                                      const { name, value } = e.target;
                                      const list = [...Product];
                                      list[index]["rProduct_name_Units"][i][
                                        name
                                      ] = +value;

                                      setProduct(list);
                                    }}
                                  />
                                </div>
                              );
                            })}
                          </>
                        ) : null}

                        <div
                          className="viewspacebetween2"
                          style={{ width: "200px" }}>
                          <Label>Product Name *</Label>
                          <Multiselect
                            className="choseeproduct"
                            selectionLimit={1}
                            isObject="false"
                            name="fProduct_name"
                            // selectedValues={
                            //   finalProduct?.length > 0 ? finalProduct : []
                            // }
                            options={RawMaterial}
                            onSelect={(selectedList, selectedItem) =>
                              handleSelectionfinishedGoods(
                                selectedList,
                                selectedItem,
                                index,
                                "fProduct_name"
                              )
                            }
                            onRemove={(selectedList, selectedItem) => {
                              onRemove(
                                selectedList,
                                selectedItem,
                                index,
                                "fProduct_name"
                              );
                            }}
                            displayValue="Product_Title" // Property name to display in the dropdown options
                          />
                        </div>

                        {product["fProduct_name_Units"]?.length > 0 ? (
                          <>
                            {product["fProduct_name_Units"]?.map((item, i) => {
                              return (
                                <div
                                  key={item}
                                  className="viewspacebetween2"
                                  style={{ width: "100px" }}>
                                  <Label>
                                    {item?.unit && item?.unit}
                                    <span style={{ color: "red" }}>*</span>
                                  </Label>
                                  <Input
                                    type="number"
                                    id="hideborder"
                                    name="value"
                                    value={item?.value}
                                    placeholder="Enter Value"
                                    onChange={(e) => {
                                      const { name, value } = e.target;
                                      const list = [...Product];
                                      list[index]["fProduct_name_Units"][i][
                                        name
                                      ] = +value;

                                      setProduct(list);
                                    }}
                                  />
                                </div>
                              );
                            })}
                          </>
                        ) : null}

                        <div
                          className="viewspacebetween2"
                          style={{ width: "200px" }}>
                          <Label>Wastage</Label>
                          <Multiselect
                            className="choseeproduct"
                            selectionLimit={1}
                            isObject="false"
                            name="wProduct_name"
                            options={RawMaterial}
                            // options={ProductList}
                            onSelect={(selectedList, selectedItem) =>
                              handleSelectionfinishedGoods(
                                selectedList,
                                selectedItem,
                                index,
                                "wProduct_name"
                              )
                            }
                            onRemove={(selectedList, selectedItem) => {
                              onRemove(
                                selectedList,
                                selectedItem,
                                index,
                                "wProduct_name"
                              );
                            }}
                            displayValue="Product_Title" // Property name to display in the dropdown options
                          />
                        </div>
                        {product["wProduct_name_Units"]?.length > 0 ? (
                          <>
                            {product["wProduct_name_Units"]?.map((item, i) => {
                              return (
                                <div
                                  key={item}
                                  className="viewspacebetween2"
                                  style={{ width: "100px" }}>
                                  <Label>
                                    {item?.unit && item?.unit}
                                    <span style={{ color: "red" }}>*</span>
                                  </Label>
                                  <Input
                                    type="number"
                                    name="value"
                                    id="hideborder"
                                    value={item?.value}
                                    placeholder="Enter Value"
                                    onChange={(e) => {
                                      const { name, value } = e.target;
                                      const list = [...Product];
                                      list[index]["wProduct_name_Units"][i][
                                        name
                                      ] = +value;

                                      setProduct(list);
                                    }}
                                  />
                                </div>
                              );
                            })}
                          </>
                        ) : null}
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
                );
              })}
            <div className="float-right">
              <Button
                className="ml-1 mb-1 mt-1"
                color="primary"
                type="button"
                onClick={() => addMoreProduct()}>
                + Row
              </Button>
            </div>
            <Row>
              <Col>
                <div className="d-flex justify-content-center">
                  <Button
                    disabled={Loader ? true : false}
                    color="primary"
                    type="submit"
                    className="mt-2">
                    {!Loader ? "Submit" : "Submitting"}
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};
export default NextStepProduction;
