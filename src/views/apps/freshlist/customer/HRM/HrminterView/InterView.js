import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
  CardHeader,
  Row
} from "reactstrap";
import {
  Hrm_Interviewone,
  Hrm_InterviewUpdate,
} from "../../../../../../ApiEndPoint/Api";
import { _Get, _Put } from "../../../../../../ApiEndPoint/ApiCalling";
import { useParams, useHistory } from "react-router-dom";
const InterView_viewList = () => {
  const [data, setData] = useState({
    candidateName: "",
    dateOfInterview: "",
    interviewTime: "",
    location: "",
    status: "",
  });

  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    _Get(Hrm_Interviewone, id)
      .then((response) => {
        let value = response.Interview;
        let data = {
          candidateName: value?.candidateName?.name,
          dateOfInterview: value?.dateOfInterview,
          interviewTime: value?.interviewTime,
          location: value?.location,
          status: value?.status,
        };
        setData(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await _Put(Hrm_InterviewUpdate, id, data);
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
    <>
    <Row>
    <Col sm="12" md="7" className="mx-auto">
    <Card>
      <CardHeader>
        <h2>Interview Form</h2>

        <Button color=" btn btn-danger" type="button" onClick={handleBack}>
          Back
        </Button>
      </CardHeader>
      <CardBody>
        <Form onSubmit={handleSubmit}>
<Row>
<Col xl="6" lg="6" md="6">
          <FormGroup >
            <Label for="candidateName" >
              Candidate Name:
            </Label>
        
              <Input
                type="text"
                name="candidateName"
                id="candidateName"
                value={data.candidateName}
                onChange={handleInputChange}
                placeholder="Enter Candidate Name"
                readOnly
              />
          
          </FormGroup>
          </Col>
          <Col xl="6" lg="6" md="6">

          <FormGroup >
            <Label for="dateOfInterview" >
              Date of Interview:
            </Label>
          
              <Input
                type="date"
                name="dateOfInterview"
                id="dateOfInterview"
                value={data.dateOfInterview}
                onChange={handleInputChange}
                placeholder="Date of Interview"
                readOnly
              />
        
          </FormGroup>
          </Col>
          <Col xl="6" lg="6" md="6">
          <FormGroup >
            <Label for="interviewTime" >
              Interview Time:
            </Label>
         
              <Input
                type="time"
                name="interviewTime"
                id="interviewTime"
                value={data.interviewTime}
                onChange={handleInputChange}
                placeholder="Interview Time"
                readOnly
              />
          
          </FormGroup>
          </Col>
          <Col xl="6" lg="6" md="6">
          <FormGroup >
            <Label for="Location" >
              Location :
            </Label>
         
              <Input
                type="text"
                name="location"
                id="location"
                value={data.location}
                onChange={handleInputChange}
                placeholder="Enter location"
                readOnly
              />
          
          </FormGroup>
          </Col>
          <Col xl="6" lg="6" md="6">
          <FormGroup >
            <Label for="status" >
              Status
            </Label>
           
              <Input
                disabled
                style={{height:'51px',borderRadius:'10px'}}
                type="select"
                name="status"
                id="status"
                value={data.status}
                onChange={handleInputChange}>
                <option value="">Select </option>
                <option value="Active">Active</option>
                <option value="Deative">Deactive</option>
              </Input>
           
          </FormGroup>
          </Col>
          </Row>
        </Form>
      </CardBody>
    </Card>
    </Col>
    </Row>
    </>
  );
};

export default InterView_viewList;
