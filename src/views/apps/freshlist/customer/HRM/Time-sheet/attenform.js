import React, { useState } from "react";
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
  Alert,
} from "reactstrap";
import { HRM_SAVE_ATTENDANCE } from "../../../../../../ApiEndPoint/Api";
import { _PostSave } from "../../../../../../ApiEndPoint/ApiCalling";
import { useHistory, useLocation } from "react-router-dom";

const AttenForm = () => {
  const [data, setData] = useState({
    employee: "",
    date: "",
    hours: "",
    remark: "",
  });
  const history = useHistory();
  const location = useLocation();
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await _PostSave(HRM_SAVE_ATTENDANCE, data);
        setSuccessAlert(true);
        resetForm();
        history.push("/app/ajgroup/HRM/attenList");
      } catch (error) {
        console.log(error);
        setErrorAlert(true);
      }
    } else {
      setErrorAlert(true);
    }
  };

  const resetForm = () => {
    setData({
      employee: "",
      date: "",
      hours: "",
      remark: "",
    });
  };

  useEffect = () => {
    console.log(location);
    console.log(history);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };
  const validateForm = () => {
    return Object.values(data).every((value) => value.trim() !== "");
  };
  return (
    <Row>
      <Col sm="12" md="6" className="mx-auto">
        <Card>
          <CardBody>
            {successAlert && (
              <Alert color="success">Form submitted successfully!</Alert>
            )}
            {errorAlert && (
              <Alert color="danger">
                Please fill all fields before submitting the form.
              </Alert>
            )}
            <Form onSubmit={handleSubmit}>
              <h1>Attendance Form</h1>
              <FormGroup row>
                <Label for="employee" sm={2}>
                  Employee
                </Label>
                <Col sm={10}>
                  <Input
                    type="text"
                    name="employee"
                    id="employee"
                    value={data.employee}
                    onChange={handleInputChange}
                  >
                    <option>33</option>
                  </Input>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="date" sm={2}>
                  Date
                </Label>
                <Col sm={10}>
                  <Input
                    type="date"
                    name="date"
                    id="date"
                    value={data.date}
                    onChange={handleInputChange}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="hours" sm={2}>
                  Hours
                </Label>
                <Col sm={10}>
                  <Input
                    type="number"
                    placeholder="Hours"
                    name="hours"
                    id="hours"
                    value={data.hours}
                    onChange={handleInputChange}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="remark" sm={2}>
                  Remark
                </Label>
                <Col sm={10}>
                  <Input
                    type="textarea"
                    name="remark"
                    id="remark"
                    value={data.remark}
                    onChange={handleInputChange}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col sm={{ size: 10, offset: 2 }}>
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
export default AttenForm;
