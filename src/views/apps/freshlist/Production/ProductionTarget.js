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
import Multiselect from "multiselect-react-dropdown";

import "../../../../assets/scss/pages/users.scss";
import { _Get, _Post, _PostSave } from "../../../../ApiEndPoint/ApiCalling";
import "../../../../assets/scss/pages/users.scss";
import { Route } from "react-router-dom";
import {
  List_Steps_Of_Production,
  Steps_Of_Production,
} from "../../../../ApiEndPoint/ProductionApi";
import swal from "sweetalert";
import LedgerPdf from "../house/LedgerPdf";
import {
  Create_Account_List,
  PurchaseProductList_Product,
} from "../../../../ApiEndPoint/Api";

let GrandTotal = [];

const ProductionTarget = (args) => {
  const [modalOne, setModalOne] = useState(false);
  const [ListStep, setListStep] = useState([]);
  const [ProductList, setProductList] = useState([]);
  const [UserList, setUsers] = useState([]);
  const [Data, setData] = useState({});
  const toggleOne = () => setModalOne(!modalOne);

  const [product, setProduct] = useState([
    {
      user_name: "",
      product_name: "",
      piece: "",
      weight: "",
      unit: "",
    },
  ]);

  useEffect(() => {
    let userData = JSON.parse(localStorage.getItem("userData"));
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
          console.log(selected);
          setUsers(selected);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    _Get(List_Steps_Of_Production, userData?._id)
      .then((res) => {
        if (res?.steps[0].steps) {
          setListStep(res?.steps[0].steps);
        }
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
        user_name: "",
        product_name: "",
        piece: "",
        weight: "",
        unit: "",
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
    let payload = {
      steps: product,
      createdBy: userdata?._id,
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
  const handleSelectionParty = async (selectedList, selectedItem, index) => {
    let Product = [...product];
    Product[index]["user_name"] = selectedItem._id;
    setData(Product);
  };
  const onRemove1 = (selectedList, removedItem, index) => {
    // let Product = [...product];
    // Product[index]["user_name"] = null;
    // setData(Product);
  };
  const onRemove = (selectedList, removedItem, index) => {
    // let Product = [...product];
    // Product[index]["product_name"] = null;
    // setData(Product);
  };
  const handleSelection = async (selectedList, selectedItem, index) => {
    let Product = [...product];
    Product[index]["product_name"] = selectedItem._id;
    setData(Product);
  };
  const handleChange = (e) => {
    let { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };
  console.log(product);
  return (
    <div>
      <Card>
        {/* <LedgerPdf downloadFileName="CustomPdf" rootElementId="testId" />
        <div id="testId">This is A Downloadable Component</div> */}

        <Row className="m-1">
          <Col lg="8" md="8" sm="8" className="mb-1 mt-1">
            <div>
              <h1 className=""> Assign Production Target</h1>
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
          <Form className="m-1" onSubmit={submitHandler}>
            <Row>
              <Col lg="2" md="2" sm="12">
                <Label>
                  Production Step Name <span style={{ color: "red" }}>*</span>
                </Label>
                <CustomInput
                  name="step_name"
                  onChange={handleChange}
                  value={Data.step_name}
                  type="select"
                  required>
                  <option>----select----</option>
                  {ListStep?.length &&
                    ListStep?.map((ele) => (
                      <option value={ele._id}>{ele?.step_Name}</option>
                    ))}
                </CustomInput>
              </Col>

              <Col lg="2" md="2" sm="12">
                <Label>
                  Final Product Name <span style={{ color: "red" }}>*</span>
                </Label>
                <Multiselect
                  className="choseeproduct"
                  required
                  selectionLimit={1}
                  isObject="false"
                  options={ProductList}
                  onSelect={(selectedList, selectedItem) => {
                    setData({
                      ...Data,
                      final_product_name: selectedItem?._id,
                      Product_Title: selectedItem?.Product_Title,
                    });
                  }}
                  onRemove={(selectedList, selectedItem) => {
                    setData({ ...Data, final_product_name: "" });
                  }}
                  displayValue="Product_Title" // Property name to display in the dropdown options
                />
              </Col>
              <Col lg="2" md="2" sm="12">
                <Label>
                  Final Product Qty <span style={{ color: "red" }}>*</span>
                </Label>
                <Input
                  required
                  name="final_product_qty"
                  onChange={handleChange}
                  value={Data.final_product_qty}
                  placeholder="Enter Final Product Qty"
                  type="number"
                />
              </Col>
              <Col lg="2" md="2" sm="12">
                <Label>
                  Target Days <span style={{ color: "red" }}>*</span>
                </Label>
                <Input
                  required
                  name="targetDays"
                  onChange={handleChange}
                  value={Data.targetDays}
                  placeholder="Enter Target Days"
                  type="number"
                />
              </Col>
            </Row>

            {product?.length &&
              product?.map((product, index) => (
                <>
                  <Row className="" key={index}>
                    <Col className="mb-1 mt-1" lg="2" md="2" sm="12">
                      <div className="">
                        <Label>
                          select User <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Multiselect
                          selectionLimit={1}
                          isObject="false"
                          options={UserList}
                          onSelect={(selectedList, selectedItem) =>
                            handleSelectionParty(
                              selectedList,
                              selectedItem,
                              index
                            )
                          }
                          onRemove={onRemove1}
                          displayValue="firstName"
                        />
                      </div>
                    </Col>
                    <Col className="mb-1 mt-1" lg="2" md="2" sm="12">
                      <div className="">
                        <Label>
                          Product Name <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Multiselect
                          className="choseeproduct"
                          selectionLimit={1}
                          isObject="false"
                          options={ProductList}
                          onSelect={(selectedList, selectedItem) =>
                            handleSelection(selectedList, selectedItem, index)
                          }
                          onRemove={(selectedList, selectedItem) => {
                            onRemove(selectedList, selectedItem, index);
                          }}
                          displayValue="Product_Title" // Property name to display in the dropdown options
                        />
                      </div>
                    </Col>
                    <Col className="mb-1 mt-1" lg="2" md="2" sm="12">
                      <div className="">
                        <Label>
                          Piece <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Input
                          type="number"
                          name="piece"
                          placeholder="piece"
                          value={product?.piece}
                          onChange={(e) => handleInputChange(e, index)}
                        />
                      </div>
                    </Col>
                    <Col className="mb-1 mt-1" lg="1" md="1" sm="12">
                      <div className="">
                        <Label>
                          Weight <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Input
                          type="number"
                          name="weight"
                          placeholder="weight"
                          value={product?.weight}
                          onChange={(e) => handleInputChange(e, index)}
                        />
                      </div>
                    </Col>
                    <Col className="mb-1 mt-1" lg="2" md="2" sm="12">
                      <div className="">
                        <label for="unit">
                          Unit <span style={{ color: "red" }}>*</span>
                        </label>
                        <CustomInput
                          required
                          id="unitType"
                          className="form-control"
                          name="unit"
                          type="select"
                          placeholder="select Unit"
                          value={Data?.unit}
                          onChange={(e) => handleInputChange(e, index)}>
                          <option value="">--Select Unit--</option>
                          <option value="Bag">BAGS(Bag)</option>
                          <option value="Btl">BOTTLES(Btl)</option>
                          <option value="Box">BOX(Box)</option>
                          <option value="Bdl">BUNDLES(Bdl)</option>
                          <option value="Can">CANS(Can)</option>
                          <option value="Ctn">CARTONS(Ctn)</option>
                          <option value="Dzn">DOZENS(Dzn)</option>
                          <option value="Gm">GRAMMES(Gm)</option>
                          <option value="Kg">KILOGRAMS(Kg)</option>
                          <option value="Ltr">LITRE(Ltr)</option>
                          <option value="Mtr">METERS(Mtr)</option>
                          <option value="Ml">MILILITRE(Ml)</option>
                          <option value="Nos">NUMBERS(Nos)</option>
                          <option value="Pac">PACKS(Pac)</option>
                          <option value="Prs">PAIRS(Prs)</option>
                          <option value="Pcs">PIECES(Pcs)</option>
                          <option value="Qtl">QUINTAL(Qtl)</option>
                          <option value="Rol">ROLLS(Rol)</option>
                          <option value="Sqf">SQUARE FEET(Sqf)</option>

                          <option data-order="kg" value="kg">
                            Kilogram(kg)
                          </option>
                          <option data-order="Pcs" value="Pcs">
                            Pieces(Pcs)
                          </option>
                          <option data-order="g" value="g">
                            Gram(g)
                          </option>
                          <option data-order="tonne" value="tonne">
                            Metric Ton(tonne)
                          </option>
                          <option data-order="m" value="m">
                            Meter(m)
                          </option>
                          <option data-order="cm" value="cm">
                            Centimeter(cm)
                          </option>
                          <option data-order="mm" value="mm">
                            Millimeter(mm)
                          </option>
                          <option data-order="in" value="in">
                            Inch(in)
                          </option>
                          <option data-order="ft" value="ft">
                            Foot(ft)
                          </option>
                          <option data-order="m3" value="m3">
                            Cubic Meter(m³)
                          </option>
                          <option data-order="L" value="L">
                            Liter(L)
                          </option>
                          <option data-order="ml" value="ml">
                            Milliliter(ml)
                          </option>
                          <option data-order="s" value="s">
                            Second(s)
                          </option>
                          <option data-order="min" value="min">
                            Minute(min)
                          </option>
                          <option data-order="hr" value="hr">
                            Hour(hr)
                          </option>
                          <option data-order="°C" value="°C">
                            Celsius(°C)
                          </option>
                          <option data-order="°F" value="°F">
                            Fahrenheit(°F)
                          </option>
                          <option data-order="Pa" value="Pa">
                            Pascal(Pa)
                          </option>
                          <option data-order="bar" value="bar">
                            Bar(bar)
                          </option>
                          <option data-order="m/s" value="m/s">
                            Meters per Second(m/s)
                          </option>
                          <option data-order="km/h" value="km/h">
                            Kilometers per Hour(km/h)
                          </option>
                          <option data-order="A" value="A">
                            Ampere(A)
                          </option>
                          <option data-order="V" value="V">
                            Volt(V)
                          </option>
                          <option data-order="W" value="W">
                            Watt(W)
                          </option>
                          <option data-order="kW" value="kW">
                            Kilowatt(kW)
                          </option>
                        </CustomInput>
                      </div>
                    </Col>

                    <Col className="d-flex mt-1 abb" lg="3" md="3" sm="12">
                      <div className="btnStyle">
                        {index ? (
                          <Button
                            type="button"
                            color="danger"
                            className="ml-1 mb-1 mt-1"
                            onClick={() => removeMoreProduct(index)}>
                            X
                          </Button>
                        ) : null}
                      </div>

                      {/* <div className="btnStyle">
                        <Button
                          className="ml-1 mb-1 mt-1"
                          color="primary"
                          type="button"
                          onClick={() => addMoreProduct()}>
                          + Add
                        </Button>
                      </div> */}
                    </Col>
                  </Row>
                </>
              ))}

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
export default ProductionTarget;
