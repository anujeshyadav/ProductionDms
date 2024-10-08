import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
// import DatePicker from "react-datepicker";
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
  _Get,
  _PostSave,
  _Put,
} from "../../../../../../ApiEndPoint/ApiCalling";
import {
  APpraisal_ViewBy_Id,
  Appraisal_UpdateBy_Id,
} from "../../../../../../ApiEndPoint/Api";

const AppraisalForm = () => {
  const history = useHistory();
  const Params = useParams();
  const [SelectedRules, setSelectedRules] = useState({});
  const [employeeList, setEmployeeList] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [data, setData] = useState({
    database: "",
    rule: "",
    panCard: "",
    empName: "",
    applyMonth: "",
    applyYear: "",
    applyMonths: "",
    incrementValue: "",
    department: "",
    designation: "",
    targetRating: "",
    overallRating: "",
  });

  console.log(Params?.id);
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(data);
    let payload = {
      database: data?.database,
      rule: data?.rule,
      panCard: data?.panCard,
      empName: data?.empName,
      applyMonth: `${data?.applyYear}/${data.applyMonth}`,
      incrementValue: data?.incrementValue,
    };

    await _Put(Appraisal_UpdateBy_Id, Params?.id, payload)
      .then((res) => {
        setLoading(false);

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
    _Get(APpraisal_ViewBy_Id, Params.id)
      .then((res) => {
        let value = res?.Appraisal;

        setSelectedRules(value?.empName);

        let payload = {
          database: value?.database,
          rule: value?.rule?._id,
          panCard: value?.panCard,
          empName: value?.empName?._id,
          applyMonth: value?.applyMonth.split("/")[1],
          applyYear: value?.applyMonth.split("/")[0],
          applyMonths: value?.applyMonths,
          incrementValue: value?.incrementValue,
        };
        setData(payload);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  return (
    <Row>
      <Col sm="12" md="6" className="mx-auto">
        <Card>
          <CardHeader>
           
           
            <Row style={{width:'100%'}}>
            <Col lg="6" xl="6" md="6" xs="12">
            <h3>Edit Appraisal Form</h3>
            </Col>
            <Col lg="6" xl="6" md="6" xs="12">
            <Button
            color="danger"
            className="float-right"
            onClick={() => history.goBack()}>
            Back
          </Button>
            </Col>
            </Row>
          </CardHeader>
          <CardBody>
            <Form onSubmit={handleSubmit}>
              <Row>
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
                      required
                      style={{height:'51px',borderRadius:'10px'}}
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
              </Row>
              <Row>
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
                    {/* <DatePicker
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
                    /> */}
                    <Input
                      type="select"
                      style={{height:'51px',borderRadius:'10px'}}
                      name="applyMonth"
                      id="applyMonth"
                      value={data.applyMonth}
                      onChange={handleInputChange}
                      required>
                      <option value="0">Select bonus month</option>
                      <option value="1">January</option>
                      <option value="2">February</option>
                      <option value="3">March</option>
                      <option value="4">April</option>
                      <option value="5">May</option>
                      <option value="6">June</option>
                      <option value="7">July</option>
                      <option value="8">August</option>
                      <option value="9">September</option>
                      <option value="10">October</option>
                      <option value="11">November</option>
                      <option value="12">December</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="applyMonth">Appraisal Year:</Label>
                    {/* <DatePicker
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
                    /> */}
                    <Input
                      type="number"
                      name="applyYear"
                      minLength={4}
                      maxLength={4}
                      id="applyYear"
                      value={data.applyYear}
                      onChange={handleInputChange}></Input>
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

              </Row>
              {/* <FormGroup row>
                                <Label for="targetRating" sm={3}>
                                    Target Rating:
                                </Label>
                                <Col sm={6}>

                                    <StarRatings
                                        rating={data.targetRating || 0}
                                        starDimension="30px"
                                        starSpacing="5px"
                                        starRatedColor="yellow"
                                        starHoverColor="green"
                                        // changeRating={(newRating) => setData({ ...data, targetRating: newRating })}
                                        numberOfStars={5}
                                        name='targetRating'
                                        changeRating={(newRating) => {
                                            const updatedRating = newRating === data.targetRating ? 0 : newRating;
                                            setData({ ...data, targetRating: updatedRating });
                                        }}
                                    />
                                    <span style={{ marginLeft: '5px' }}>{`(${data.targetRating || 0})`}</span>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="overallRating" sm={3}>
                                    Overall Rating:
                                </Label>
                                <Col sm={6}>
                                    <StarRatings
                                        rating={data.overallRating || 0}
                                        starDimension="30px"
                                        starSpacing="5px"
                                        starRatedColor="rgb(255 162 29)"
                                        starHoverColor="green"
                                        // changeRating={(newRating) => setData({ ...data, overallRating: newRating })}
                                        changeRating={(newRating) => {
                                            const updatedRating = newRating === data.overallRating ? 0 : newRating;
                                            setData({ ...data, overallRating: updatedRating });
                                        }}
                                        numberOfStars={5}
                                        name='overallRating'
                                    />
                                    <span style={{ marginLeft: '5px' }}>{`(${data.overallRating || 0})`}</span>
                                </Col>
                            </FormGroup> */}
              <Row>
                
              </Row>
              {!Loading && !Loading ? (
                <>
                  <FormGroup row>
                    <Col className="text-center">
                      <Button color="primary" type="submit">
                        Update
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
