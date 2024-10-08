import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Card,
  CardBody,
} from "reactstrap";
import { Route, useHistory } from "react-router-dom";

import {
  CreateAccountList,
  _PostSave,
} from "../../../../../../ApiEndPoint/ApiCalling";
import { HRM_SAVE_INDICATOR } from "../../../../../../ApiEndPoint/Api";
import swal from "sweetalert";
import { FaUpload } from "react-icons/fa";
// parameter's : database

const Indicatform = () => {
  const [data, setData] = useState({
    employeeName: "",
    rule: "",
    attendance: "",
    collectionRating: "",
    targetRating: "",
    database: "",
  });

  const [SelectedRules, setSelectedRules] = useState({});
  const [employeeList, setEmployeeList] = useState([]);
  const [BulkUpload, setBulkUpload] = useState(false);
  const [BulkImport, setBulkImport] = useState(null);

  const history = useHistory();

  const handleSubmit = async (e) => {
    // debugger;
    e.preventDefault();

    let payload = {
      employeeName: data?.employeeName,
      rule: data.rule,
      attendance: parseFloat(data.attendance),
      collectionRating: parseFloat(data.collectionRating),
      targetRating: parseFloat(data.targetRating),
      database: data.database,
    };
    try {
      await _PostSave(HRM_SAVE_INDICATOR, payload);
      resetForm();
      swal("success", "Added Successfully");
      history.push("/app/ajgroup/HRM/indicatList");
    } catch (error) {
      console.log(error);
    }
    // console.log("Form submitted:", data);
  };
  const resetForm = () => {
    setData({
      employeeName: "",
      rule: "",
      attendance: "",
      collectionRating: "",
      targetRating: "",
      database: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  useEffect(() => {
    let userId = JSON.parse(localStorage.getItem("userData"));
    setData({ ...data, ["database"]: userId?.database });
    CreateAccountList(userId?._id, userId?.database)
      .then((res) => {
        let value = res?.adminDetails;
        setEmployeeList(value);
        console.log(value);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Row>
      <Col sm="12" md="7" className="mx-auto">
        <Card>
          <CardBody>
            <Form onSubmit={handleSubmit}>
              <Row className="">
                <Col lg="7" xs="12">
                  <h1>Indicator Form</h1>
                </Col>
                {!BulkUpload && !BulkUpload ? (
                  <>
                    <Col lg="3" xs="7" className="d-flex justify-content-end">
                      <Button
                        className="mx-2 mt-1 mb-1"
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
                    <Col xs="5" className="d-flex justify-content-end">
                      <Button
                        className="mx-1 mt-1 mb-1"
                        color="primary"
                        onClick={(e) => {
                          e.preventDefault();
                          setBulkUpload(false);
                        }}>
                        Back
                      </Button>
                    </Col>
                  </>
                )}

                {!BulkUpload && !BulkUpload && (
                  <Col>
                    <div className="float-right">
                      <Route
                        render={({ history }) => (
                          <Button
                            style={{ cursor: "pointer" }}
                            className="float-right mr-1 mt-1 mb-1"
                            color="primary"
                            onClick={() => history.goBack()}>
                            {" "}
                            Back
                          </Button>
                        )}
                      />
                    </div>
                  </Col>
                )}
              </Row>

              <Row className="mt-2">
                {BulkUpload && BulkUpload ? (
                  <>
                    <Col>
                      <div className="d-flex justify-content-center">
                        <div className="file-upload mb-3 mt-5">
                          <FaUpload color="green" size={40} />

                          <p>Click box to upload</p>
                          <input
                            required
                            type="file"
                            name="images"
                            onChange={(e) => {
                              setBulkImport(e.target.files[0]);
                            }}
                          />
                        </div>
                      </div>
                    </Col>
                  </>
                ) : (
                  <>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="employeename">Employee Name:</Label>
                        <Input
                        style={{borderRadius:'10px',height:'51px'}}
                          type="select"
                          placeholder=" Enter Employee"
                          name="employeeName"
                          id="employeeName"
                          value={data.employeeName}
                          onChange={(e) => {
                            console.log(employeeList);
                            let selected = employeeList?.filter(
                              (ele) => ele?._id == e.target.value
                            );

                            setSelectedRules(selected[0]);

                            setData({
                              ...data,
                              ["employeeName"]: e.target.value,
                            });
                          }}>
                          <option value="">Select Employee</option>
                          {employeeList &&
                            employeeList?.map((ele) => (
                              <option value={ele?._id} key={ele?._id}>
                                {ele?.firstName}
                              </option>
                            ))}
                        </Input>
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <Label for="role">Rule:</Label>
                        <Input
                        style={{borderRadius:'10px',height:'51px'}}
                          required
                          type="select"
                          placeholder="Name"
                          name="rule"
                          id="rule"
                          value={data.rule}
                          onChange={handleInputChange}>
                          <option value="">Select Rule</option>
                          {SelectedRules?.setRule?.length > 0 &&
                            SelectedRules?.setRule?.map((ele) => (
                              <option value={ele?._id} key={ele?._id}>
                                {ele?.rule}
                              </option>
                            ))}
                        </Input>
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <Label for="attendance">Attendance Rating:</Label>
                        <Input
                          required
                          type="number"
                          placeholder="Attendance"
                          name="attendance"
                          id="attendance"
                          value={data.attendance}
                          onChange={(e) => {
                            setData({
                              ...data,
                              ["attendance"]: e.target.value,
                            });
                          }}
                        />
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <Label for="collections">
                          Collection Rating(1 to 5) *:
                        </Label>
                        <Input
                          required
                          type="text"
                          placeholder=" between 1 to 5"
                          name="collectionRating"
                          // pattern="[1-5]*" // Only allows input matching the pattern 1-5
                          // maxLength={3}
                          id="collectionRating"
                          value={data?.collectionRating}
                          onChange={(e) => {
                            const inputValue = e.target.value;

                            if (
                              /^\d*\.?\d*$/.test(inputValue) &&
                              inputValue >= 1 &&
                              inputValue <= 5
                            ) {
                              setData({
                                ...data,
                                ["collectionRating"]: inputValue,
                              });
                            }
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="target">Target Rating:</Label>
                        <Input
                          required
                          type="text"
                          // pattern="[1-5]*" // Only allows input matching the pattern 1-5
                          // maxLength={3}
                          placeholder=" between 1 to 5"
                          name="targetRating"
                          id="targetRating"
                          value={data.targetRating}
                          onChange={(e) => {
                            const inputValue = e.target.value;

                            if (
                              /^\d*\.?\d*$/.test(inputValue) &&
                              inputValue >= 1 &&
                              inputValue <= 5
                            ) {
                              setData({
                                ...data,
                                ["targetRating"]: inputValue,
                              });
                            }
                          }}
                        />
                      </FormGroup>
                    </Col>
                  </>
                )}
              </Row>

              <FormGroup row>
                <Col className="text-center">
                  <Button.Ripple color="primary" type="submit" className="mt-2">
                    Submit
                  </Button.Ripple>
                </Col>
              </FormGroup>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default Indicatform;
