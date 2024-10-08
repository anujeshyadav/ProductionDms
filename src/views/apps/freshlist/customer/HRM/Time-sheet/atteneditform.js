import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Card,
  CardBody,
  CardHeader,
  Row,
} from "reactstrap";
import {
  VIEW_ATTENDANCE_BY_ID,
  UPDATE_ATTENDANCE,
} from "../../../../../../ApiEndPoint/Api";
import { _Put, _Get } from "../../../../../../ApiEndPoint/ApiCalling";

const AtteneditForm = () => {
  const [data, setData] = useState({
    inTimes: "",
    outTimes: "",
  });

  const { id } = useParams();
  const history = useHistory();
  // const [successAlert, setSuccessAlert] = useState(false);
  // const [errorAlert, setErrorAlert] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await _Get(VIEW_ATTENDANCE_BY_ID, id);
        setData(response?.details);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await _Put(UPDATE_ATTENDANCE, id, data);

      history.push("/app/ajgroup/HRM/Time-sheet/attenviewform");
    } catch (error) {
      console.log(error);
    }
  };

  // const validateForm = () => {
  //   return Object.values(data).every((value) => value.trim() !== '');
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleBack = () => {
    history.goBack();
  };

  return (
    <Row>
      <Col sm="12" md="6" className="mx-auto">
        <Card>
          <CardHeader>
            <h1>Attendance Edit Form</h1>
            <Button color="danger" onClick={handleBack}>
              Back
            </Button>
            {/* <Button color="primary" className="ml-2" onClick={() => console.log('Check In')}>
              Check In
            </Button>
            <Button color="success" className="ml-2" onClick={() => console.log('Check Out')}>
              Check Out
            </Button> */}
          </CardHeader>
          <CardBody>
            {/* {successAlert && <Alert color="success">Form submitted successfully!</Alert>}
            {errorAlert && <Alert color="danger">Please fill all fields before submitting the form.</Alert>} */}
            <Form onSubmit={handleSubmit}>
              <FormGroup row>
                <Label for="inTimes" sm={4}>
                  Check In Time
                </Label>
                <Col sm={6}>
                  <Input
                    type="time"
                    name="inTimes"
                    id="inTimes"
                    value={data?.details?.inTimes}
                    onChange={handleInputChange}
                    required
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="outTimes" sm={4}>
                  Check Out Time
                </Label>
                <Col sm={6}>
                  <Input
                    type="time"
                    name="outTimes"
                    id="outTimes"
                    value={data?.details?.outTimes}
                    onChange={handleInputChange}
                    required
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col sm={{ size: 10, offset: 5 }}>
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

export default AtteneditForm;
