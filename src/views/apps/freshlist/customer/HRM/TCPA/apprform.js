import React, { useEffect, useState } from "react";
import { Route, useHistory } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import {
  CreateAccountList,
  _PostSave,
} from "../../../../../../ApiEndPoint/ApiCalling";
import { Create_Appraisal } from "../../../../../../ApiEndPoint/Api";
import { FaUpload } from "react-icons/fa";

const AppraisalForm = () => {
  const history = useHistory();
  const [SelectedRules, setSelectedRules] = useState({});
  const [employeeList, setEmployeeList] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [BulkUpload, setBulkUpload] = useState(false);
  const [BulkImport, setBulkImport] = useState(null);
  const [data, setData] = useState({
    database: "",
    rule: "",
    panCard: "",
    empName: "",
    applyMonth: "",
    applyMonths: "",
    incrementValue: "",
    department: "",
    designation: "",
    targetRating: "",
    overallRating: "",
  });

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log("Form submitted:", data);
    let payload = {
      database: data?.database,
      rule: data?.rule,
      panCard: data?.panCard,
      empName: data?.empName,
      applyMonth: data?.applyMonth,
      applyMonths: data?.applyMonths,
      incrementValue: data?.incrementValue,
    };

    await _PostSave(Create_Appraisal, payload)
      .then((res) => {
        setLoading(false);

        console.log(res);
        history.goBack();
      })
      .catch((err) => {
        setLoading(false);

        console.log(err);
      });
  };
  useEffect(() => {
    let userId = JSON.parse(localStorage.getItem("userData"));
    setData({ ...data, ["database"]: userId?.database });
    CreateAccountList(userId?._id, userId?.database)
      .then((res) => {
        let value = res?.adminDetails;
        setEmployeeList(value);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  return (
    <Row>
      <Col sm="12" md="6" className="mx-auto">
        <Card>
          <CardBody>
            <Form onSubmit={handleSubmit}>
              <Row className="">
                <Col lg="6" xs="12">
                  <h3>Appraisal Form</h3>
                </Col>
                {!BulkUpload && !BulkUpload ? (
                  <>
                    <Col lg="4" xs="7" className="d-flex justify-content-end">
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
              <Row>
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
                        <Label for="employee">Employee Name:</Label>
                        <Input
                          required
                          style={{height:'51px',borderRadius:'10px'}}
                          type="select"
                          placeholder="Employee"
                          name="empName"
                          id="empName"
                          value={data.empName}
                          onChange={(e) => {
                            let selected = employeeList?.filter(
                              (ele) => ele?._id == e.target.value
                            );

                            setSelectedRules(selected[0]);

                            setData({
                              ...data,
                              ["empName"]: e.target.value,
                              panCard: selected[0]?.Pan_No,
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
                        style={{height:'51px',borderRadius:'10px'}}
                          required
                          type="select"
                          placeholder="Name"
                          name="rule"
                          id="rule"
                          value={data.rule}
                          onChange={handleInputChange}>
                          <option value="">Select Role</option>
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
                        <Label for="pancard">Pan Card No:</Label>
                        <Input
                          type="text"
                          readOnly
                          placeholder=" Enter Target"
                          name="panCard"
                          id="panCard"
                          value={data.panCard}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="applyMonth">Appraisal Month:</Label>
                        <DatePicker
                          selected={data.applyMonths}
                          onChange={(date) => {
                            let Month = date.getMonth();
                            let Year = date.getFullYear();
                            setData({
                              ...data,
                              ["applyMonth"]: `${Year}/${Month}`,
                              ["applyMonths"]: date,
                            });
                          }}
                          dateFormat="yyyy/MM"
                          placeholderText="Select appraisal month (YYYY/MM)"
                          showMonthYearPicker
                          className="form-control"
                          required
                        />
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <Label for="incrementvalue">Increment Value:</Label>
                        <Input
                          type="number"
                          placeholder=" Enter Value"
                          name="incrementValue"
                          id="incrementValue"
                          value={data.incrementValue}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </>
                )}
              </Row>

              {!Loading && !Loading ? (
                <>
                  <FormGroup row>
                    <Col className="text-center">
                      <Button color="primary" type="submit">
                        Submit
                      </Button>
                    </Col>
                  </FormGroup>
                </>
              ) : (
                "Loading..."
              )}
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default AppraisalForm;
