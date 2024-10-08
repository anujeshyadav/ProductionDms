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
  CardHeader,
  CustomInput,
} from "reactstrap";
import {
  HRM_LEAVE_BY_ID,
  HRM_UPDATE_LEAVE,
} from "../../../../../../ApiEndPoint/Api";
import { _Put, _Get } from "../../../../../../ApiEndPoint/ApiCalling";
import { useParams, useHistory } from "react-router-dom";

const LeaveEditForm = () => {
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
              setData(response?.Leave);
            })
            .catch((err) => {
              console.log(err);
            });
     
    
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await _Put(HRM_UPDATE_LEAVE, id, data);
      history.push("/app/ajgroup/HRM/leaveList");
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e) => {
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
            <h1>Leave Edit Form</h1>
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
                      type="number"
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
                    <Label for="noOfYearly">NoOfYearly</Label>
                    <Input
                      type="number"
                      placeholder="noOfYearly"
                      name="noOfYearly"
                      id="noOfYearly"
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
                        checked={data.checkStatus === "Unpaid"}
                        onChange={handleInputChange}
                        inline
                      />
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup row>
                <Col sm={{ size: 10, offset: 10 }}>
                  <Button.Ripple color="primary" type="submit" className="mt-2">
                    Update
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

export default LeaveEditForm;
