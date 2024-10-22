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

const ProductionProcess = (args) => {
  const [modalOne, setModalOne] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [EditMode, setEditMode] = useState(false);
  const [Loader, setLoader] = useState(false);
  const [ListStep, setListStep] = useState([]);
  const [ListOfStep, setListOfStep] = useState([]);
  const [RawProducts, setRawProduct] = useState([]);

  const [ProcessList, setProcessList] = useState([]);
  const [ProductList, setProductList] = useState([]);
  const [RawMaterial, setRawMaterial] = useState([]);
  const [UserList, setUsers] = useState([]);
  const [Data, setData] = useState({});
  const [Worker, setWorker] = useState({});
  const toggleOne = () => setModalOne(!modalOne);

  const [Product, setProduct] = useState([
    {
      rProduct_name: "",
      rProduct_name_Units: [],
      fProduct_name: "",
      fProduct_name_Units: [],
      wProduct_name: "",
      wProduct_name_Units: [],
    },
  ]);
  let Params = useParams();

  useEffect(() => {
    let listOfStep;
    let userData = JSON.parse(localStorage.getItem("userData"));

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
            return item.processName;
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
    _Get(List_Raw_Material, userData?.database)
      .then((res) => {
        setRawMaterial(res?.Product);
      })
      .catch((err) => {
        console.log(err);
      });
    // _Get(PurchaseProductList_Product, userData?.database)
    //   .then((res) => {
    //     setProductList(res?.Product);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    if (Params?.id == 0) {
      setEditMode(false);
      _Get(PurchaseProductList_Product, userData?.database)
        .then((res) => {
          setProductList(res?.Product);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setEditMode(true);
      setLoading(true);
      (async () => {
        await _Get(VieW_Product_assignFor_Production_List, Params.id)
          .then((res) => {
            if (res?.product?.step_No == 1) {
              _Get(PurchaseProductList_Product, userData?.database)
                .then((res) => {
                  setProductList(res?.Product);
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              let currentProduct = res?.product.product_details?.map(
                (item) => item?.fProduct_name
              );
              setProductList(currentProduct);
            }
            setLoading(false);
            let selectedStep = listOfStep?.filter(
              (item) => item.processName._id == res?.product?.processName?._id
            );
            setListOfStep(selectedStep[0]?.steps);
            let data = res?.product;
            data.processName = data?.processName?._id;
            var PreviousStep = selectedStep[0]?.steps?.filter(
              (item) => item?._id == data?.currentStep
            );
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
        await _Get(Product_assignFor_Production_ViewOne, Params.id)
          .then((res) => {
            setLoading(false);
            let selectedStep;
            if (listOfStep?.length) {
              selectedStep = listOfStep?.filter(
                (item) => item?.processName?._id == res?.product?.processName
              );
              if (selectedStep[0]?.steps?.length) {
                setListOfStep(selectedStep[0]?.steps);
              }
            }
            setProduct(res?.product.product_details);
            setWorker(res?.product?.user_name);
            setData(res?.product);
          })
          .catch((err) => {
            setLoading(false);

            console.log(err.response);
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
        rProduct_name_Units: [],
        fProduct_name: "",
        fProduct_name_Units: [],
        wProduct_name: "",
        wProduct_name_Units: [],
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
    let userdata = JSON.parse(localStorage.getItem("userData"));
    let payload = {
      database: userdata?.database,
      ...Data,
      product_details: Product,
      totalStep: ListOfStep?.length,
    };
    if (EditMode) {
      await _Put(Product_assignFor_Production_Update, Params.id, payload)
        .then((res) => {
          setLoader(false);

          swal("success", "Updated Successfully", "success");
          window.history.back();
        })
        .catch((err) => {
          setLoader(false);

          swal("error", "error Occured", "error");
        });
    } else {
      await _PostSave(Product_assignFor_Production, payload)
        .then((res) => {
          setLoader(false);

          swal("success", "Added Successfully", "success");
          window.history.back();
        })
        .catch((err) => {
          setLoader(false);

          swal("error", "error Occured", "error");
        });
    }
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
      updatedProducts[index][`${name}_Units`] = newArr;

      return updatedProducts;
    });
  };

  const handleSelection = (selectedList, selectedItem, index, name) => {
    setProduct((prevProducts) => {
      const updatedProducts = [...prevProducts];

      updatedProducts[index][name] = selectedItem._id;
      updatedProducts[index][
        "stock"
      ] = `${selectedItem.qty}(${selectedItem?.stockUnit})`;
      return updatedProducts;
    });
  };
  const handleChange = (e) => {
    let { name, value } = e.target;
    setData({ ...Data, [name]: value });
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
              <h1 className=""> Start Production</h1>
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
          <Form className="" onSubmit={submitHandler}>
            <Row>
              <Col lg="3" md="3" sm="12">
                <Label>
                  Select Process <span style={{ color: "red" }}>*</span>
                </Label>
                <CustomInput
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
                      <option value={ele?._id}>{ele?.name}</option>
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
                        data-id={`${ele?._id}_${ele.step_No}`}
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
            {/* <div className="tableheadingcutom">
              <Table className="mt-1" responsive bordered>
                <thead>
                  <tr>
                    <th
                      rowSpan={2}
                      style={{ textAlign: "center", verticalAlign: "middle" }}>
                      Raw Material Name
                    </th>
                    <th colspan="3">Quantity</th>
                    <th
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                      rowSpan={2}>
                      Product Name
                    </th>
                    <th colspan="3">Quantity</th>
                    <th
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                      rowSpan={3}>
                      Wastage
                    </th>
                    <th colspan="3">Quantity</th>
                    <th
                      colSpan={1}
                      rowSpan={2}
                      style={{ textAlign: "center", verticalAlign: "middle" }}>
                      Act
                    </th>
                  </tr>

                  <tr>
                    <th>
                      <CustomInput
                        id="unitType"
                        className="form-control"
                        name="rUnit1"
                        type="select"
                        placeholder="selecetedUnit"
                        value={Data?.rUnit1}
                        onChange={handleChange}>
                        <option value="">--Select--</option>
                        {Unit_List?.map((ele) => (
                          <option value={ele?.value}>{ele?.title}</option>
                        ))}
                      </CustomInput>
                    </th>
                    <th>
                      <CustomInput
                        id="unitType"
                        className="form-control"
                        name="rUnit2"
                        type="select"
                        placeholder="selecetedUnit"
                        value={Data?.rUnit2}
                        onChange={handleChange}>
                        <option value="">--Select--</option>
                        {Unit_List?.map((ele) => (
                          <option value={ele?.value}>{ele?.title}</option>
                        ))}
                      </CustomInput>
                    </th>
                    <th>
                      <CustomInput
                        id="unitType"
                        className="form-control"
                        name="rUnit3"
                        type="select"
                        placeholder="selecetedUnit"
                        value={Data?.rUnit3}
                        onChange={handleChange}>
                        <option value="">--Select--</option>
                        {Unit_List?.map((ele) => (
                          <option value={ele?.value}>{ele?.title}</option>
                        ))}
                      </CustomInput>
                    </th>

                    <th>
                      <CustomInput
                        id="unitType"
                        className="form-control"
                        name="fUnit1"
                        type="select"
                        placeholder="selecetedUnit"
                        value={Data?.fUnit1}
                        onChange={handleChange}>
                        <option value="">--Select--</option>
                        {Unit_List?.map((ele) => (
                          <option value={ele?.value}>{ele?.title}</option>
                        ))}
                      </CustomInput>
                    </th>
                    <th>
                      <CustomInput
                        id="unitType"
                        className="form-control"
                        name="fUnit2"
                        type="select"
                        placeholder="selecetedUnit"
                        value={Data?.fUnit2}
                        onChange={handleChange}>
                        <option value="">--Select--</option>
                        {Unit_List?.map((ele) => (
                          <option value={ele?.value}>{ele?.title}</option>
                        ))}
                      </CustomInput>
                    </th>
                    <th>
                      <CustomInput
                        id="unitType"
                        className="form-control"
                        name="fUnit3"
                        type="select"
                        placeholder="selecetedUnit"
                        value={Data?.fUnit3}
                        onChange={handleChange}>
                        <option value="">--Select--</option>
                        {Unit_List?.map((ele) => (
                          <option value={ele?.value}>{ele?.title}</option>
                        ))}
                      </CustomInput>
                    </th>

                    <th>
                      <CustomInput
                        id="unitType"
                        className="form-control"
                        name="wUnit1"
                        type="select"
                        placeholder="selecetedUnit"
                        value={Data?.wUnit1}
                        onChange={handleChange}>
                        <option value="">--Select--</option>
                        {Unit_List?.map((ele) => (
                          <option value={ele?.value}>{ele?.title}</option>
                        ))}
                      </CustomInput>
                    </th>
                    <th>
                      <CustomInput
                        id="unitType"
                        className="form-control"
                        name="wUnit2"
                        type="select"
                        placeholder="selecetedUnit"
                        value={Data?.wUnit2}
                        onChange={handleChange}>
                        <option value="">--Select--</option>
                        {Unit_List?.map((ele) => (
                          <option value={ele?.value}>{ele?.title}</option>
                        ))}
                      </CustomInput>
                    </th>
                    <th>
                      <CustomInput
                        id="unitType"
                        className="form-control"
                        name="wUnit3"
                        type="select"
                        placeholder="selecetedUnit"
                        value={Data?.wUnit3}
                        onChange={handleChange}>
                        <option value="">--Select--</option>
                        {Unit_List?.map((ele) => (
                          <option value={ele?.value}>{ele?.title}</option>
                        ))}
                      </CustomInput>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Product?.length &&
                    Product?.map((product, index) => {
                      if (EditMode) {
                        var RawProduct = ProductList?.filter(
                          (ele) => ele?._id == product?.rProduct_name
                        );
                        var finalProduct = ProductList?.filter(
                          (ele) => ele?._id == product?.fProduct_name
                        );
                      }
                      return (
                        <>
                          <tr key={index}>
                            <td>
                              {" "}
                              <Multiselect
                                className="choseeproduct"
                                selectionLimit={1}
                                name="raw Material Name"
                                isObject="false"
                                selectedValues={
                                  RawProduct?.length > 0 ? RawProduct : []
                                }
                                options={ProductList}
                                onSelect={(selectedList, selectedItem) =>
                                  handleSelection(
                                    selectedList,
                                    selectedItem,
                                    index,
                                    "rProduct_name"
                                  )
                                }
                                onRemove={(selectedList, selectedItem) => {
                                  onRemove(selectedList, selectedItem, index);
                                }}
                                displayValue="Product_Title" // Property name to display in the dropdown options
                              />
                            </td>
                            <td>
                              <Input
                                type="number"
                                name="rHeading1Value"
                                placeholder="rHeading1Value"
                                value={product?.rHeading1Value}
                                onChange={(e) => handleInputChange(e, index)}
                              />
                            </td>
                            <td>
                              {" "}
                              <Input
                                type="number"
                                name="rHeading2Value"
                                placeholder="rHeading2Value"
                                value={product?.rHeading2Value}
                                onChange={(e) => handleInputChange(e, index)}
                              />
                            </td>

                            <td>
                              <Input
                                type="number"
                                name="rHeading3Value"
                                placeholder="rHeading3Value"
                                value={product?.rHeading3Value}
                                onChange={(e) => handleInputChange(e, index)}
                              />
                            </td>

                            <td>
                              <Multiselect
                                className="choseeproduct"
                                selectionLimit={1}
                                isObject="false"
                                name="fProduct_name"
                                selectedValues={
                                  finalProduct?.length > 0 ? finalProduct : []
                                }
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
                                  onRemove(selectedList, selectedItem, index);
                                }}
                                displayValue="Product_Title" // Property name to display in the dropdown options
                              />
                            </td>
                            <td>
                              {" "}
                              <Input
                                type="number"
                                id="hideborder"
                                name="fHeading1Value"
                                placeholder="fHeading1Value"
                                value={product?.fHeading1Value}
                                onChange={(e) => handleInputChange(e, index)}
                              />
                            </td>
                            <td>
                              {" "}
                              <Input
                                type="number"
                                name="fHeading2Value"
                                placeholder="fHeading2Value"
                                value={product?.fHeading2Value}
                                onChange={(e) => handleInputChange(e, index)}
                              />
                            </td>
                            <td>
                              {" "}
                              <Input
                                type="number"
                                name="fHeading3Value"
                                placeholder="fHeading3Value"
                                value={product?.fHeading3Value}
                                onChange={(e) => handleInputChange(e, index)}
                              />
                            </td>

                            <td>
                              {" "}
                              <Multiselect
                                className="choseeproduct"
                                selectionLimit={1}
                                isObject="false"
                                name="fProduct_name"
                                selectedValues={
                                  finalProduct?.length > 0 ? finalProduct : []
                                }
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
                                  onRemove(selectedList, selectedItem, index);
                                }}
                                displayValue="Product_Title" // Property name to display in the dropdown options
                              />
                            </td>
                            <td>
                              {" "}
                              <Input
                                type="number"
                                name="wHeading1Value"
                                placeholder="wHeading1Value"
                                value={product?.wHeading1Value}
                                onChange={(e) => handleInputChange(e, index)}
                              />
                            </td>
                            <td>
                              {" "}
                              <Input
                                type="number"
                                name="wHeading2Value"
                                placeholder="wHeading2Value"
                                value={product?.wHeading2Value}
                                onChange={(e) => handleInputChange(e, index)}
                              />
                            </td>
                            <td>
                              {" "}
                              <Input
                                type="number"
                                name="wHeading3Value"
                                placeholder="wHeading3Value"
                                value={product?.wHeading3Value}
                                onChange={(e) => handleInputChange(e, index)}
                              />
                            </td>

                            <td>
                              <div className="btnStyle float-right">
                                {index ? (
                                  <Button
                                    type="button"
                                    color="danger"
                                    className=""
                                    onClick={() => removeMoreProduct(index)}>
                                    X
                                  </Button>
                                ) : null}
                              </div>
                            </td>
                          </tr>
                        </>
                      );
                    })}
                </tbody>
              </Table>
            </div> */}
            {Product?.length > 0 &&
              Product?.map((product, index) => {
                if (EditMode) {
                  var RawProduct;
                  if (Data?.step_No == 1) {
                    RawProduct = ProductList?.filter(
                      (ele) => ele?._id == product?.rProduct_name
                    );
                  } else {
                    RawProduct = RawMaterial?.filter(
                      (ele) => ele?._id == product?.rProduct_name
                    );
                  }
                  var finalProduct = RawMaterial?.filter(
                    (ele) => ele?._id == product?.fProduct_name
                  );
                  var WastageProduct = RawMaterial?.filter(
                    (ele) => ele?._id == product?.wProduct_name
                  );
                }
                return (
                  <Row className="mt-1" key={index}>
                    <Col>
                      <div className="viewspacebetween">
                        <div style={{ width: "260px" }}>
                          <Label>
                            Raw Material Name{" "}
                            <span style={{ color: "red" }}>*</span>
                            <span style={{ color: "red", fontSize: "12px" }}>
                              {product?.stock && <>Stock:{product?.stock}</>}
                            </span>
                          </Label>
                          <Multiselect
                            className="choseeproduct"
                            selectionLimit={1}
                            name="raw Material Name"
                            isObject="false"
                            selectedValues={
                              RawProduct?.length > 0 ? RawProduct : []
                            }
                            options={ProductList}
                            onSelect={(selectedList, selectedItem) =>
                              handleSelection(
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
                        {Data?.step_No > 1 ? (
                          <>
                            {product["rProduct_name_Units"]?.length > 0 ? (
                              <>
                                {product["rProduct_name_Units"]?.map(
                                  (item, i) => {
                                    return (
                                      <div
                                        key={item}
                                        className="viewspacebetween2"
                                        style={{ width: "100px" }}>
                                        <Label>
                                          {item?.unit && item?.unit}
                                          <span style={{ color: "red" }}>
                                            *
                                          </span>
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
                                            list[index]["rProduct_name_Units"][
                                              i
                                            ][name] = +value;

                                            setProduct(list);
                                          }}
                                        />
                                      </div>
                                    );
                                  }
                                )}
                              </>
                            ) : null}
                          </>
                        ) : (
                          <>
                            <div
                              className="viewspacebetween2"
                              style={{ width: "90px" }}>
                              <Label>Unit1</Label>
                              <Input
                                type="number"
                                name="rHeading1Value"
                                placeholder="rHeading1Value"
                                value={product?.rHeading1Value}
                                onChange={(e) => handleInputChange(e, index)}
                              />
                            </div>
                            <div
                              className="viewspacebetween1"
                              style={{ width: "90px" }}>
                              <Label>Unit2</Label>
                              <Input
                                type="number"
                                name="rHeading2Value"
                                placeholder="rHeading2Value"
                                value={product?.rHeading2Value}
                                onChange={(e) => handleInputChange(e, index)}
                              />
                            </div>
                            <div
                              className="viewspacebetween2"
                              style={{ width: "90px" }}>
                              <Label>Unit3</Label>
                              <Input
                                type="number"
                                name="rHeading3Value"
                                placeholder="rHeading3Value"
                                value={product?.rHeading3Value}
                                onChange={(e) => handleInputChange(e, index)}
                              />
                            </div>
                          </>
                        )}
                        <div
                          className="viewspacebetween2"
                          style={{ width: "200px" }}>
                          <Label>Product Name *</Label>
                          <Multiselect
                            className="choseeproduct"
                            selectionLimit={1}
                            isObject="false"
                            name="fProduct_name"
                            selectedValues={
                              finalProduct?.length > 0 ? finalProduct : []
                            }
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
                            selectedValues={
                              WastageProduct?.length > 0 ? WastageProduct : []
                            }
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
              {/* {!EditMode && ( */}
              <Button
                className="ml-1 mb-1 mt-1"
                color="primary"
                type="button"
                onClick={() => addMoreProduct()}>
                + Row
              </Button>
              {/* )} */}
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
export default ProductionProcess;
