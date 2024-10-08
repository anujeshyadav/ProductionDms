import React, { useEffect, useState, useContext } from "react";
import { Route, useHistory, useParams } from "react-router-dom";
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
  FormGroup,
  Spinner,
} from "reactstrap";
import "react-phone-input-2/lib/style.css";
import Multiselect from "multiselect-react-dropdown";
import "../../../../assets/scss/pages/users.scss";

import {
  CreateCustomerList,
  _Get,
  _Post,
  _PostSave,
  _Put,
  _BulkUpload,
} from "../../../../ApiEndPoint/ApiCalling";
import "../../../../assets/scss/pages/users.scss";
import {
  Bulk_Upload_Receipt,
  Bulk_Upload_User,
  Create_Account_List,
  Create_Receipt,
  Update_Receipt_By_Id,
  View_Expense_Account,
  View_Receipt_By_Id,
} from "../../../../ApiEndPoint/Api";
import swal from "sweetalert";
import UserContext from "../../../../context/Context";

const CreateReceipt = (args) => {
  let context = useContext(UserContext);

  const [formValues, setFormValues] = useState([
    {
      date: "",
      paymentMode: "",
      type: "receipt",
      database: JSON.parse(localStorage.getItem("userData"))?.database,
    },
  ]);
  const [error, setError] = useState("");
  const [Mode, setMode] = useState("Create");
  const [Loader, setLoader] = useState(true);
  const [Loading, setLoading] = useState(false);

  const [BulkImport, setBulkImport] = useState(null);
  const [BulkUpload, setBulkUpload] = useState(false);
  const [PartyList, setPartyList] = useState([]);
  const [PartyId, setPartyId] = useState("");
  const [UserInfo, setUserInfo] = useState({});
  const [AllData, setAllData] = useState({});

  let History = useHistory();
  let Params = useParams();
  const handleSelectionParty = (selectedList, selectedItem, index) => {
    let newFormValues = [...formValues];
    if (selectedItem?.party) {
      newFormValues[index]["partyId"] = selectedItem?._id;
    } else if (selectedItem?.User) {
      newFormValues[index]["userId"] = selectedItem?._id;
    } else {
      newFormValues[index]["expenseId"] = selectedItem?._id;
    }
    setFormValues(newFormValues);
    setPartyId(selectedItem?._id);
  };

  const onRemove1 = (selectedList, selectedItem, index) => {
    let newFormValues = [...formValues];
    if (selectedItem?.party) {
      delete newFormValues[index]["partyId"];
    } else if (selectedItem?.User) {
      delete newFormValues[index]["userId"];
    } else {
      delete newFormValues[index]["expenseId"];
    }
    setFormValues(newFormValues);
  };

  useEffect(() => {
    let id = Params?.id;
    if (id == 0) {
      setMode("Create");
    } else {
      setMode("Edit");
      _Get(View_Receipt_By_Id, id)
        .then((res) => {
          let data = res?.Receipts;
          let value = {};
          value["paymentMode"] = data?.paymentMode;
          value["database"] = data?.database;
          if (!!data?.partyId) {
            value["party"] = data?.partyId;
            value["partyId"] = data?.partyId?._id;
          } else if (!!data?.userId) {
            value["party"] = data?.userId;
            value["userId"] = data?.userId?._id;
          } else {
            value["party"] = data?.expenseId;
            value["expenseId"] = data?.expenseId?._id;
          }
          value["type"] = data?.type;

          value["amount"] = data?.amount;
          value["preAmount"] = data?.amount;
          value["date"] = data?.date?.split("T")[0];
          value["remark"] = data?.remark;

          //  setLoader(false);
          let Mydata = [value];
          setFormValues(Mydata);
          // setSelectedParty(data?.partyId);
          // setPartyId(data?.partyId?._id);

          setAllData(payload);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    let userdata = JSON.parse(localStorage.getItem("userData"));
    let url = `${Create_Account_List + userdata?._id}/`;

    const fetchData = async () => {
      try {
        const [CustomeData, UserData, ExpensesData] = await Promise.allSettled([
          CreateCustomerList(userdata?._id, userdata?.database),
          _Get(url, userdata?.database),
          _Get(View_Expense_Account, userdata?.database),
        ]);

        if (CustomeData?.value?.Customer?.length > 0) {
          CustomeData?.value?.Customer?.forEach((element) => {
            element["party"] = true;
            element["fullName"] = element?.CompanyName;
          });
        }
        if (UserData?.value?.adminDetails?.length > 0) {
          UserData?.value?.adminDetails?.forEach((element) => {
            element["User"] = true;
            element["fullName"] = element?.firstName;
          });
        }
        if (ExpensesData?.value?.Expenses?.length > 0) {
          ExpensesData?.value?.Expenses?.forEach((element) => {
            element["miscellaneous"] = true;
            element["fullName"] = `${element?.title} ${element?.type}`;
          });
        }
        let customer = CustomeData?.value?.Customer
          ? CustomeData?.value?.Customer
          : [];
        let User = UserData?.value?.adminDetails
          ? UserData?.value?.adminDetails
          : [];
        let Expenses = ExpensesData?.value?.Expenses
          ? ExpensesData?.value?.Expenses
          : [];
        let wholeData = [...customer, ...User, ...Expenses];

        setPartyList(wholeData);
      } catch (error) {
        setError(error);
      } finally {
        setLoader(false);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userData"));
    setUserInfo(userInfo);
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (BulkImport !== null || BulkImport != undefined) {
      let formdata = new FormData();
      formdata.append("file", BulkImport);
      formdata.append("type", "receipt");
      let url = `${Bulk_Upload_Receipt}/${UserInfo?.database}`;
      await _BulkUpload(url, formdata)
        .then((res) => {
          setLoading(false);
          setBulkImport(null);

          swal(`${res?.message}`);
        })
        .catch((err) => {
          setLoading(false);

          console.log(err);
          swal("Something Went Wrong");
        });
    } else {
      let id = Params?.id;
      let Pay = {
        Receipt: formValues,
      };

      if (id == 0) {
        if (error) {
          swal("Error occured while Entering Details");
        } else {
          _PostSave(Create_Receipt, Pay)
            .then((res) => {
              setLoading(false);

              History.goBack();
              swal("Added Successfully");
            })
            .catch((err) => {
              setLoading(false);

              swal("Somthing went Wrong");
              console.log(err);
            });
        }
      } else {
        _Put(Update_Receipt_By_Id, id, Pay?.Receipt[0])
          .then((res) => {
            setLoading(false);
            swal("Updated Successfully");
            History.goBack();
          })
          .catch((err) => {
            setLoading(false);
            swal("Something Went Wrong");
          });
      }
    }
  };

  let handleChanges = (i, e) => {
    let newFormValues = [...formValues];
    if (e.target.name == "amount") {
      newFormValues[i][e.target.name] = Number(e.target.value);
    } else {
      newFormValues[i][e.target.name] = e.target.value;
    }
    setFormValues(newFormValues);
  };

  let addFormFields = () => {
    setFormValues([
      ...formValues,
      {
        date: "",
        paymentMode: "",
        type: "receipt",
        database: JSON.parse(localStorage.getItem("userData"))?.database,
      },
    ]);
  };

  let removeFormFields = (i) => {
    let newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    setAllData({ ...AllData, [name]: value });
  };
  return (
    <div>
      {Loader ? (
        <div className="d-flex justify-content-center align-item-center mt-3">
          <Spinner />
        </div>
      ) : (
        <>
          <div>
            <Card>
              <Row className="m-2">
                <Col className="" xs="12" lg="9" md="9" xl="9">
                  <div>
                    <h1 className="">{Mode && Mode} Receipt</h1>
                  </div>
                </Col>
                {!BulkUpload && !BulkUpload ? (
                  <>
                    <Col lg="2" md="2" xs="6">
                      <Button
                        color="primary"
                        onClick={(e) => {
                          e.preventDefault();
                          setBulkUpload(true);
                        }}>
                        Bulk Upload
                      </Button>
                    </Col>
                  </>
                ) : (
                  <>
                    <Col lg="1" md="1">
                      <Button
                        color="primary"
                        onClick={(e) => {
                          e.preventDefault();
                          setBulkUpload(false);
                          setBulkImport(null);
                        }}>
                        Back
                      </Button>
                    </Col>
                  </>
                )}

                {!BulkUpload && !BulkUpload && (
                  <Col lg="1" md="1" xs="6">
                    <div className="float-right">
                      <Route
                        render={({ history }) => (
                          <Button
                            style={{ cursor: "pointer" }}
                            className="float-right"
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
                )}
              </Row>

              <CardBody>
                {BulkUpload && BulkUpload ? (
                  <>
                    <Form className="m-1" onSubmit={submitHandler}>
                      <Row>
                        <Col lg="4" md="4" sm="12">
                          <FormGroup>
                            <Label>Bulk Import(.xlxs only)</Label>

                            <Input
                              required
                              className="form-control"
                              type="file"
                              placeholder=""
                              name="BulkImport"
                              onChange={(e) => {
                                setBulkImport(e.target.files[0]);
                              }}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        {!Loading && !Loading ? (
                          <>
                            <Col>
                              <div className="d-flex justify-content-center">
                                <Button.Ripple
                                  color="primary"
                                  type="submit"
                                  className="mt-2">
                                  Import
                                </Button.Ripple>
                              </div>
                            </Col>
                          </>
                        ) : (
                          <>
                            <Col>
                              <div className="d-flex justify-content-center">
                                <Button.Ripple color="primary" className="mt-2">
                                  Loading...
                                </Button.Ripple>
                              </div>
                            </Col>
                          </>
                        )}
                      </Row>
                    </Form>
                  </>
                ) : (
                  <>
                    {/* <Form className="m-1" onSubmit={submitHandler}> */}
                    {/* <Row>
                   
                    <Col className="mb-1" lg="4" md="4" sm="12">
                      <Label>Choose Payment Type</Label>
                      <CustomInput
                        required
                        value={AllData?.PaymentType}
                        name="PaymentType"
                        onChange={(e) => {
                          setPaymentType(e.target.value);
                          handleChange(e);
                        }}
                        type="select">
                        <option>--Select--</option>
                        <option value="partyPaymentReceived">
                          Party Payment Received
                        </option>
                        <option value="otherReceived">Other</option>
                      </CustomInput>
                    </Col>
                  </Row> */}
                    {/* {PaymentType && PaymentType == "partyPaymentReceived" && (
                    <Row>
                      {Mode == "Edit" ? (
                        <>
                          <Col className="mb-1" lg="4" md="4" sm="12">
                            <div className="">
                              <Label>Selected Party</Label>
                              <CustomInput
                                readOnly="true"
                                value={PartyId}
                                type="select">
                                <option>--select--</option>
                                {PartyList?.length > 0 &&
                                  PartyList?.map((ele, i) => {
                                    console.log(ele);
                                    return (
                                      <option
                                        value={
                                          ele?._id
                                        }>{`${ele?.firstName} ${ele?.lastName} `}</option>
                                    );
                                  })}
                              </CustomInput>
                            </div>
                          </Col>
                        </>
                      ) : (
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
                                  handleSelectionParty(
                                    selectedList,
                                    selectedItem
                                  )
                                }
                                onRemove={onRemove1}
                                displayValue="firstName"
                              />
                            </div>
                          </Col>
                        </>
                      )}
                      {AllData?.Paymentmode &&
                        AllData?.Paymentmode == "Bank" && (
                          <Col className="mb-1" lg="4" md="4" sm="12">
                            <Label>
                              Instrument/Trx Number{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Label>
                            <Input
                              required
                              placeholder="Enter Instrument Number"
                              type="text"
                              value={AllData?.InstrumentNumber}
                              name="InstrumentNumber"
                              onChange={handleChange}
                            />
                          </Col>
                        )}
                      <Col className="mb-1" lg="4" md="4" sm="12">
                        <Label>Amount</Label>
                        <Input
                          required
                          placeholder="Enter Amount"
                          type="number"
                          value={AllData?.Amount}
                          name="Amount"
                          onChange={handleChange}
                        />
                      </Col>
                      <Col className="mb-1" lg="4" md="4" sm="12">
                        <Label>Date</Label>
                        <Input
                          required
                          type="date"
                          value={AllData?.Date}
                          name="Date"
                          onChange={handleChange}
                        />
                      </Col>
                      <Col className="mb-1" lg="4" md="4" sm="12">
                        <Label>Note :</Label>
                        <textarea
                          required
                          type="text"
                          placeholder="Enter Notes ..."
                          className="form-control"
                          value={AllData?.Note}
                          name="Note"
                          onChange={handleChange}
                        />
                      </Col>
                    </Row>
                  )} */}
                    {/* {PaymentType && PaymentType == "otherReceived" && (
                    <>
                      <Row>
                        <Col className="mb-1" lg="4" md="4" sm="12">
                          <Label>Title</Label>
                          <Input
                            required
                            type="text"
                            placeholder="Enter Title "
                            name="Title"
                            value={AllData?.Title}
                            onChange={handleChange}
                          />
                        </Col>
                        {AllData?.Paymentmode &&
                          AllData?.Paymentmode == "Bank" && (
                            <Col className="mb-1" lg="4" md="4" sm="12">
                              <Label>Instrument/Trx Number *</Label>
                              <Input
                                required
                                placeholder="Enter Instrument Number"
                                type="text"
                                value={AllData?.InstrumentNumber}
                                name="InstrumentNumber"
                                onChange={handleChange}
                              />
                            </Col>
                          )}
                        <Col className="mb-1" lg="4" md="4" sm="12">
                          <Label>Amount</Label>
                          <Input
                            required
                            type="number"
                            placeholder="Enter Amount"
                            value={AllData?.Amount}
                            name="Amount"
                            onChange={handleChange}
                          />
                        </Col>
                        <Col className="mb-1" lg="4" md="4" sm="12">
                          <Label>Date</Label>
                          <Input
                            required
                            type="date"
                            value={AllData?.Date}
                            name="Date"
                            onChange={handleChange}
                          />
                        </Col>
                        <Col className="mb-1" lg="4" md="4" sm="12">
                          <Label>Note :</Label>
                          <textarea
                            required
                            type="text"
                            placeholder="Enter Note..."
                            className="form-control"
                            value={AllData?.Note}
                            name="Note"
                            onChange={handleChange}
                          />
                        </Col>
                      </Row>
                    </>
                  )} */}

                    {/* <hr /> */}

                    {/* <Row>
                    {!Loading && !Loading ? (
                      <>
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
                      </>
                    ) : (
                      <>
                        <Col>
                          <div className="d-flex justify-content-center">
                            <Button.Ripple
                              color="primary"
                              // type="submit"
                              className="mt-2">
                              Loading...
                            </Button.Ripple>
                          </div>
                        </Col>
                      </>
                    )}
                  </Row> */}
                    {/* </Form> */}

                    <Form onSubmit={submitHandler}>
                      {formValues?.map((element, index) => {
                        let SeletedMainProduct = PartyList?.filter(
                          (ele) =>
                            ele?._id ==
                            `${
                              !!element?.partyId
                                ? element?.partyId
                                : `${
                                    !!element?.userId
                                      ? element?.userId
                                      : element?.expenseId
                                  }`
                            }`
                        );
                        return (
                          <>
                            <Row key={index} className="mb-1">
                              <Col lg="2" md="2" sm="4">
                                <Label>Date *</Label>

                                <Input
                                  required
                                  type="date"
                                  name="date"
                                  value={element.date || ""}
                                  onChange={(e) => handleChanges(index, e)}
                                />
                              </Col>
                              {Params?.id == 0 ? (
                                <>
                                  <Col lg="2" md="2" sm="4">
                                    <Label>Particular *</Label>
                                    <Multiselect
                                      required
                                      selectionLimit={1}
                                      selectedValues={SeletedMainProduct}
                                      isObject="false"
                                      options={PartyList}
                                      onSelect={(selectedList, selectedItem) =>
                                        handleSelectionParty(
                                          selectedList,
                                          selectedItem,
                                          index
                                        )
                                      }
                                      onRemove={(selectedList, selectedItem) =>
                                        onRemove1(
                                          selectedList,
                                          selectedItem,
                                          index
                                        )
                                      }
                                      displayValue="fullName"
                                    />
                                  </Col>
                                </>
                              ) : (
                                <>
                                  <Col lg="2" md="2" sm="4">
                                    <Label>Particular *</Label>
                                    <Multiselect
                                      required
                                      disablePreSelectedValues
                                      selectionLimit={1}
                                      selectedValues={SeletedMainProduct}
                                      isObject="false"
                                      options={PartyList}
                                      // onSelect={(selectedList, selectedItem) =>
                                      //   handleSelectionParty(
                                      //     selectedList,
                                      //     selectedItem,
                                      //     index
                                      //   )
                                      // }
                                      // onRemove={(selectedList, selectedItem) =>
                                      //   onRemove1(
                                      //     selectedList,
                                      //     selectedItem,
                                      //     index
                                      //   )
                                      // }
                                      displayValue="fullName"
                                    />
                                  </Col>
                                </>
                              )}
                              <Col lg="2" md="2" sm="4">
                                <Label>Payment Mode *</Label>
                                <CustomInput
                                  type="select"
                                  className="form-control"
                                  placeholder="Payment Mode"
                                  name="paymentMode"
                                  value={element.paymentMode || ""}
                                  onChange={(e) => handleChanges(index, e)}>
                                  <option>--Select--</option>
                                  <option value="Cash">Cash</option>
                                  <option value="Bank">Bank</option>
                                </CustomInput>
                              </Col>
                              <Col lg="2" md="2" sm="4">
                                {" "}
                                <Label>Amount *</Label>
                                <Input
                                  type="text"
                                  required
                                  placeholder="Enter Amount"
                                  name="amount"
                                  value={element.amount || ""}
                                  onChange={(e) => handleChanges(index, e)}
                                />
                              </Col>
                              <Col lg="3" md="3" sm="4">
                                <Label>Remark</Label>
                                <textarea
                                  required
                                  type="text"
                                  placeholder="Remark Here"
                                  name="remark"
                                  rows={3}
                                  className="form-control"
                                  value={element.remark || ""}
                                  onChange={(e) => handleChanges(index, e)}
                                />
                              </Col>
                              <Col lg="1" md="1" sm="4">
                                {index ? (
                                  <Button
                                    className="mt-2"
                                    color="danger"
                                    onClick={() => removeFormFields(index)}>
                                    X
                                  </Button>
                                ) : null}
                              </Col>
                            </Row>
                          </>
                        );
                      })}
                      {Params?.id == 0 && (
                        <Row>
                          <Col className="d-flex justify-content-end">
                            <Button
                              color="primary"
                              onClick={() => addFormFields()}>
                              +
                            </Button>
                          </Col>
                        </Row>
                      )}
                      <div className="d-flex justify-content-center">
                        <Button
                          className="button submit mt-2"
                          type="submit"
                          disabled={Loading ? true : false}
                          color="primary">
                          {!Loading ? "Submit" : "Submitting.."}
                        </Button>
                      </div>
                    </Form>
                  </>
                )}
              </CardBody>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};
export default CreateReceipt;
