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
  Alert,
} from "reactstrap";
import "react-phone-input-2/lib/style.css";

import Multiselect from "multiselect-react-dropdown";
import axiosConfig from "../../../../axiosConfig";

import "../../../../assets/scss/pages/users.scss";
import { _PostSave, _Get, _Put } from "../../../../ApiEndPoint/ApiCalling";
import "../../../../assets/scss/pages/users.scss";
import { Route, useParams, useHistory } from "react-router-dom";
import swal from "sweetalert";
import {
  Create_CustomerGroup,
  Product_Price_Bulk_Update,
  PurchaseProductList_Product,
  Update_CustomerGroup_by_id,
  View_CustomerGroup,
  View_CustomerGroup_by_id,
} from "../../../../ApiEndPoint/Api";

let GrandTotal = [];
let SelectedITems = [];
let maxDiscount = 0;
let findMaxGstStatus = false;
const CreateCustomerGroup = (args) => {
  const [UserInfo, setUserInfo] = useState({});
  const [Loading, setLoading] = useState(false);
  const [UpdatingProduct, setUpdatingProduct] = useState(false);
  const [selectedData, setData] = useState({});
  const [ProductData, setProductData] = useState([]);
  const [Type, setType] = useState("");
  const [CurrentMaxGradeDiscount, setCurrentmaxGradeDiscount] = useState("");
  const [MaxGst, setMaxGst] = useState(localStorage.getItem("MaxGst"));
  let Param = useParams();
  let History = useHistory();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userData"));
    setUserInfo(userInfo);
  }, []);
  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("userData"));

    _Get(View_CustomerGroup, user?.database)
      .then((res) => {
        if (res?.CustomerGroup) {
          let myActive = res?.CustomerGroup?.filter(
            (ele) => ele?.status == "Active"
          );

          let max = myActive.reduce(
            (prevMax, obj) => (obj.discount > prevMax ? obj.discount : prevMax),
            -Infinity
          );
          maxDiscount = max > 0 ? max : 0;
          setMaxGst(maxDiscount);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    _Get(PurchaseProductList_Product, user?.database)
      .then((res) => {
        // res?.Product?.forEach((ele) => {
        //   let Mrp = ele?.Product_MRP;
        //   let gst = (100 + ele?.GSTRate) / 100;
        //   let Dis = (100 + maxDiscount) / 100;
        //   if (!!ele?.SalesRate) {
        //     ele["SalesRate"] = ele?.SalesRate;
        //   } else {
        //     ele["SalesRate"] = Number((Mrp / (gst * Dis)).toFixed(2));
        //   }
        //   ele["maxDiscount"] = maxDiscount;
        //   let cost = ele?.landedCost ? ele?.landedCost : ele?.Purchase_Rate;
        //   if (cost > ele?.SalesRate) {
        //     ele["lossStatus"] = true;
        //   } else {
        //     ele["lossStatus"] = false;
        //   }
        // });
        setProductData(res?.Product?.reverse());
        //  this.setState({ rowData: res?.Product?.reverse() });
      })
      .catch((err) => {});

    if (Param?.id == 0) {
      setType("Create");
    } else {
      setType("Edit");

      _Get(View_CustomerGroup_by_id, Param?.id)
        .then((res) => {
          //   console.log(res?.CustomerGroup);

          let val = res?.CustomerGroup;
          setData({
            discountPercentage: val?.discount,
            Grade: val?.grade,
            GroupName: val?.groupName,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    const userInfo = JSON.parse(localStorage.getItem("userData"));
    setUserInfo(userInfo);
  }, []);

  const HandleUpdateProduct = async () => {
    setUpdatingProduct(true);
    ProductData?.forEach((ele) => {
      let gst = (100 + ele?.GSTRate) / 100;
      let Dis = (100 + CurrentMaxGradeDiscount) / 100;
      let profitPer = ele?.ProfitPercentage > 3 ? ele?.ProfitPercentage : 3;
      let profitPercentage = Number((100 + profitPer) / 100);

      ele["SalesRate"] = Number(
        (ele?.Purchase_Rate * profitPercentage).toFixed(2)
      );
      ele["Product_MRP"] = Number((ele?.SalesRate * gst * Dis).toFixed(2));
    });
    let value = ProductData?.map((ele) => {
      return {
        id: ele?._id,
        Product_MRP: ele?.Product_MRP,
        SalesRate: ele?.SalesRate,
        ProfitPercentage: ele?.ProfitPercentage,
        maxDiscount: ele?.maxDiscount,
      };
    });
    await axiosConfig
      .put(Product_Price_Bulk_Update, { Products: value })
      .then((res) => {
        setUpdatingProduct(false);
        History.goBack();
        swal("Success", "Product Updated Successfully", "success");
      })
      .catch((err) => {
        setUpdatingProduct(false);
      });
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    let payload = {
      id: selectedData?.GroupName,
      groupName: selectedData?.GroupName,
      grade: selectedData?.Grade,
      discount: Number(selectedData?.discountPercentage),
      created_by: UserInfo?._id,
      database: UserInfo?.database,
    };
    if (Param?.id == 0) {
      await _PostSave(Create_CustomerGroup, payload)
        .then((res) => {
          if (findMaxGstStatus) {
            HandleUpdateProduct();
          } else {
            const timer = setTimeout(() => {
              setLoading(false);
              History.goBack();
              swal("Success", "Group Created Successfully", "success");
            }, 3000);
          }
        })
        .catch((err) => {
          setLoading(false);
          swal("Something Went Wrong");

          console.log(err);
        });
    } else {
      await _Put(Update_CustomerGroup_by_id, Param?.id, payload)
        .then((res) => {
          if (findMaxGstStatus) {
            HandleUpdateProduct();
          } else {
            const timer = setTimeout(() => {
              setLoading(false);
              History.goBack();
              swal("Success", "Group Updated Successfully", "success");
            }, 3000);
          }
        })
        .catch((err) => {
          setLoading(false);

          console.log(err);
          swal("Something Went Wrong");
        });
    }
  };
  const onChange = (e) => {
    let { name, value } = e.target;

    if (name == "discountPercentage") {
      findMaxGstStatus = value > MaxGst ? true : false;
      if (findMaxGstStatus) {
        setCurrentmaxGradeDiscount(Number(value));
      } else {
        setCurrentmaxGradeDiscount(Number(MaxGst));
      }
      setData({
        ...selectedData,
        [name]: value,
      });
      // if (value.length < 3) {
      //   setData({
      //     ...selectedData,
      //     [name]: value,
      //   });
      // } else {
      //   setData({
      //     ...selectedData,
      //     [name]: value,
      //   });
      //   swal("Error", "Cannot Enter Discount More than two digit");
      // }
    } else {
      setData({
        ...selectedData,
        [name]: value,
      });
    }
  };

  return (
    <div>
      {UpdatingProduct && (
        <Alert color="danger">
          Updating Product Data , Please Wait ..., You would Redirect
          Automatically
          <div>
            <h5 style={{ color: "red" }}>
              Do Not Refresh Your Page or Go Back
            </h5>
          </div>
        </Alert>
      )}
      <div>
        <Card>
          <Row className="m-2">
            <Col className="">
              <div>
                <h1 className="">{Type && Type} Customer Group</h1>
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
                      Back
                    </Button>
                  )}
                />
              </div>
            </Col>
          </Row>

          <CardBody>
            <Form className="m-1" onSubmit={submitHandler}>
              <Row>
                <Col className="mb-1" lg="3" md="3" sm="12">
                  <div className="">
                    <Label>Group Name</Label>
                    <Input
                      required
                      type="text"
                      name="GroupName"
                      placeholder="Enter Group Name"
                      value={selectedData?.GroupName}
                      // onChange={onChange}
                      onChange={(e) => {
                        const input = e.target.value;
                        const filteredValue = input.replace(/\s/g, "");
                        setData({
                          ...selectedData,
                          ["id"]: filteredValue,
                          ["GroupName"]: filteredValue,
                        });
                      }}
                    />
                  </div>
                </Col>
                <Col className="mb-1" lg="3" md="3" sm="12">
                  <div className="">
                    <Label>Grade</Label>
                    <Input
                      required
                      type="text"
                      name="Grade"
                      placeholder="Enter Grade"
                      value={selectedData?.Grade}
                      onChange={onChange}
                    />
                  </div>
                </Col>
                <Col className="mb-1" lg="3" md="3" sm="12">
                  <div className="">
                    <Label>Discount(%)</Label>
                    <Input
                      required
                      placeholder="Enter Discount Percentage"
                      type="number"
                      min={0}
                      max={50}
                      step="0.01"
                      name="discountPercentage"
                      value={selectedData?.discountPercentage}
                      onChange={onChange}
                    />
                  </div>
                </Col>
                <Col>
                  <div className="d-flex justify-content-center">
                    <Button
                      color="primary"
                      type="submit"
                      disabled={!Loading ? false : true}
                      className="mt-2">
                      {!Loading ? "Submit" : "Submitting..."}
                    </Button>
                  </div>
                </Col>
              </Row>
              {/* <Row className="mt-2">
                <Col lg="6" md="6" sm="6" className="mb-2 mt-1">
                  <Label className="mb-0">Status</Label>
                  <div className="form-label-group" onChange={onChange}>
                    <input
                      style={{ marginRight: "3px" }}
                      type="radio"
                      name="status"
                      value="Active"
                    />
                    <span style={{ marginRight: "20px" }}>Active</span>

                    <input
                      style={{ marginRight: "3px" }}
                      type="radio"
                      name="status"
                      value="Deactive"
                    />
                    <span style={{ marginRight: "3px" }}>Deactive</span>
                  </div>
                </Col>
              </Row> */}

              {/* <Row>
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
              </Row> */}
            </Form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
export default CreateCustomerGroup;
