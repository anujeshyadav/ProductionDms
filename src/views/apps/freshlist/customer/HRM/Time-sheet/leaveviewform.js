import { useParams, useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Card,
  CardBody,
  Row,
  CardHeader,
  CustomInput,
} from "reactstrap";
import {
  HRM_LEAVE_BY_ID,
  HRM_UPDATE_LEAVE,
} from "../../../../../../ApiEndPoint/Api";
import { _Put, _Get } from "../../../../../../ApiEndPoint/ApiCalling";

const LeaveViewForm = () => {
  const [data, setData] = useState({
    leaveType: "",
    noOfYearly: null,
    noOfmonthly: null,
    checkStatus: "",
  });

  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    
      _Get(HRM_LEAVE_BY_ID, id)
        .then((response) => {
          console.log(response);
          console.log(response.Leave);
          setData(response?.Leave);
        })
        .catch((err) => {
          console.log(err);
        });
   
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await _Put(HRM_UPDATE_LEAVE, id, data);
      history.push("/app/ajgroup/HRM/leaveList");
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleBack = () => {
    history.goBack();
  };

  return (
    <Row>
      <Col sm="12" md="7" className="mx-auto">
        <Card>
          <CardHeader>
            <h1>Leave View Form</h1>
            <Button color="danger" onClick={handleBack}>
              Back
            </Button>
          </CardHeader>
          <CardBody>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="leaveType">Leave Type:</Label>
                    <Input
                      readOnly
                      type="text"
                      name="leaveType"
                      placeholder="Leave Type"
                      id="leaveType"
                      value={data.leaveType}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="noOfmonthly">NoOfMonthly</Label>
                    <Input
                      readOnly
                      type="text"
                      name="noOfmonthly"
                      placeholder="noOfmonthly"
                      id="noOfmonthly"
                      value={data.noOfmonthly}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="hours">NoOfYearly</Label>
                    <Input
                      readOnly
                      type="number"
                      placeholder="noOfmonthly"
                      name="NoOfYearly"
                      id="NoOfYearly"
                      value={data.noOfYearly}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col>
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
                        // checked={data.checkStatus === "Unpaid"}
                        // onChange={handleInputChange}
                        inline
                      />
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              {/* <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="startDate">Start Date:</Label>
                    <Input
                      readOnly
                      type="date"
                      placeholder="StartDate"
                      name="startDate"
                      id="startDate"
                      value={data.startDate}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="endDate">End Date:</Label>
                    <Input
                      readOnly
                      type="date"
                      placeholder="EndDate"
                      name="endDate"
                      id="endDate"
                      value={data.endDate}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
              </Row> */}
              {/* <FormGroup>
                <Label for="remark">Remark:</Label>
                <Input
                  readOnly
                  type="textarea"
                  name="remark"
                  id="remark"
                  value={data.remark}
                  onChange={handleInputChange}
                />
              </FormGroup> */}
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default LeaveViewForm;
