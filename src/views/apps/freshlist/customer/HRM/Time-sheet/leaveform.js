import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { _PostSave } from "../../../../../../ApiEndPoint/ApiCalling";
import {
  HRM_SAVE_LEAVE,
  HRM_SAVE_MANAGELEAVE,
} from "../../../../../../ApiEndPoint/Api";

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
  CustomInput,
} from "reactstrap";

const AddLeaveForm = () => {
  const [data, setData] = useState({
    leaveType: "",
    noOfYearly: null,
    noOfmonthly: null,
    period: "",
    database: "one",
    checkStatus: "",
  });

  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const history = useHistory();
  const handleSubmit = async (e) => {
    e.preventDefault();
    let user = JSON.parse(localStorage.getItem("userData"));
    let payload = {
      leaveType: data.leaveType,
      noOfYearly: Number(data.noOfYearly),
      noOfmonthly: Number(data.noOfmonthly),
      database: user?.database,
      checkStatus: data.checkStatus,
    };
    console.log(payload);
    try {
      await _PostSave(HRM_SAVE_LEAVE, payload);
      history.push("/app/ajgroup/HRM/leaveList");
    } catch (error) {
      console.log(error);
    }
    console.log("Form submitted:", data);
  };

  return (
    <Row>
      <Col sm="12" md="6" className="mx-auto">
        <Card>
          <CardHeader>
            <h3>Add Leave Type</h3>
            <Button
              color="danger"
              className="ml-2"
              onClick={() => history.goBack()}
            >
              Back
            </Button>
          </CardHeader>
          <CardBody>
            <Form onSubmit={handleSubmit}>
<Row>
<Col lg="6" xl="6" md="6">
              <FormGroup>
                <Label for="leaveType">Leave Type:</Label>
                <Input
                  type="text"
                  name="leaveType"
                  value={data.leaveType}
                  onChange={handleInputChange}
                  placeholder="Leave Type"
                  required
                />
              </FormGroup>
</Col>
<Col lg="6" xl="6" md="6">
              <FormGroup>
                <Label for="numberOfDays">Number of Year:</Label>
                <Input
                  type="number"
                  name="noOfYearly"
                  id="noOfYearly"
                  value={data.noOfYearly}
                  placeholder="Number of Year"
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              </Col>
              <Col lg="6" xl="6" md="6">
              <FormGroup>
                <Label for="numberOfDays">Number of Month:</Label>
                <Input
                  type="number"
                  name="noOfmonthly"
                  id="noOfmonthly"
                  value={data.noOfmonthly}
                  placeholder="Number of Month"
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              </Col>
              <Col lg="6" xl="6" md="6">
              <FormGroup>
                <Label className="pb-1">CheckStatus:</Label>
                <div>
                  <CustomInput
                    required
                    type="radio"
                    id="checkStatusPaid"
                    name="checkStatus"
                    label="Paid"
                    value="Paid"
                    checked={data.checkStatus === "Paid"}
                    onChange={handleInputChange}
                    inline
                  />
                  <CustomInput
                    required
                    type="radio"
                    id="checkStatusUnpaid"
                    name="checkStatus"
                    label="Unpaid"
                    value="Unpaid"
                    checked={data.checkStatus === "Unpaid"}
                    onChange={handleInputChange}
                    inline
                  />
                </div>
              </FormGroup>
</Col>
</Row>
              <FormGroup className="text-center">
                <Button  color="primary" type="submit">
                  Submit
                </Button>
              </FormGroup>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default AddLeaveForm;
