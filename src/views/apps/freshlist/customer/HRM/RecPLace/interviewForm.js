import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
  CardHeader,
} from "reactstrap";
import {
  Hrm_InterviewGroup,
  Hrm_AppyList,
} from "../../../../../../ApiEndPoint/Api";
import {
  _PostSave,
  _Get,
  _GetList,
} from "../../../../../../ApiEndPoint/ApiCalling";
import { useHistory } from "react-router-dom";

const InterviewForm = () => {
  const [interList, setInterList] = useState([]);
  const [data, setData] = useState({
    candidateName: "",
    dateOfInterview: "",
    interviewTime: "",
    database: "",
    location: "",
    status: "",
  });

  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const history = useHistory();

  useEffect(() => {
    let userinfor = JSON.parse(localStorage.getItem("userData"));
    setData({ ...data, database: userinfor.database });
    function fetchData() {
      _Get(Hrm_AppyList, userinfor?.database, userinfor?._id)
        .then((res) => {
          setInterList(res?.Job);
          console.log(res?.Job);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await _PostSave(Hrm_InterviewGroup, data);
        setSuccessAlert(true);
        resetForm();
        history.push("/app/ajgroup/HRM/interviewList");
      } catch (error) {
        console.log(error);
        setErrorAlert(true);
      }
    } else {
      setErrorAlert(true);
    }
  };

  const validateForm = () => {
    return Object.values(data).every((value) => value.trim() !== "");
  };

  const resetForm = () => {
    setData({
      candidateName: "",
      dateOfInterview: "",
      interviewTime: "",
      // position: '',
      location: "",
      status: "",
    });
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
          <Row style={{width:'100%'}}>
          <Col md="6" lg="6" xl="6">
          <h2>Interview Form</h2>
          </Col>
          <Col md="6" lg="6" xl="6">
          <Button color="danger" className="float-right " onClick={handleBack}>
            Back
          </Button>
          </Col>
          </Row>
          
            {successAlert && (
              <Alert color="success">Form submitted successfully!</Alert>
            )}
            {errorAlert && (
              <Alert color="danger">
                Please fill all fields before submitting the form.
              </Alert>
            )}
          </CardHeader>
          <CardBody>
            <Form onSubmit={handleSubmit}>
            <Row>
            <Col lg="6" xl="6" md="6">
            <FormGroup >
                <Label for="candidateName" >
                  Candidate Name:
                </Label>
               
                  <Input
                  style={{height:'51px',borderRadius:'10px'}}
                    type="select"
                    name="candidateName"
                    id="candidateName"
                    value={data?.candidateName}
                    onChange={handleInputChange}
                    placeholder="Enter Candidate Name">
                    <option value="">Select Candidate</option>
                    {interList &&
                      interList.map((Interview) => (
                        <option key={Interview._id} value={Interview._id}>
                          {Interview.name}
                        </option>
                      ))}
                  </Input>
               
              </FormGroup>
            </Col>
            <Col lg="6" xl="6" md="6">
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
              />
            
          </FormGroup>
            </Col>
            <Col lg="6" xl="6" md="6">
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
              />
          
          </FormGroup>
            </Col>
            <Col lg="6" xl="6" md="6">
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
              />
          
          </FormGroup>
            </Col>
            <Col lg="6" xl="6" md="6">
            <FormGroup >
                <Label for="status" >
                  Status
                </Label>
                
                  <Input
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
              

             

              

            

              

              <FormGroup >
                <Col className="text-center">
                  <Button color="primary" type="submit">
                    Submit
                  </Button>
                </Col>
              </FormGroup>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default InterviewForm;
