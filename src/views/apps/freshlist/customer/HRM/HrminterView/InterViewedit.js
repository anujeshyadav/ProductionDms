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
  Row,
  Alert,
  CardHeader,
} from "reactstrap";
import {
  Hrm_AppyList,
  Hrm_Interviewone,
  Hrm_InterviewUpdate,
} from "../../../../../../ApiEndPoint/Api";
import { _Get, _Put } from "../../../../../../ApiEndPoint/ApiCalling";
import { useParams, useHistory } from "react-router-dom";
const IntereditList = () => {
  const [interList, setInterList] = useState([]);

  const [data, setData] = useState({
    candidateName: "",
    dateOfInterview: "",
    interviewTime: "",
    database: "",
    location: "",
    status: "",
  });

  const { id } = useParams();
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

  useEffect(() => {
    _Get(Hrm_Interviewone, id)
      .then((res) => {
        let value = res.Interview;
        let data = {
          candidateName: value?.candidateName?._id,
          dateOfInterview: value?.dateOfInterview,
          interviewTime: value?.interviewTime,
          database: value?.database,
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
      history.push("/app/ajgroup/HRM/interviewList");
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
<Col lg="5" xl="6" md="6">

          <FormGroup >
            <Label for="candidateName">
              Candidate Name:
            </Label>
            
              <Input
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
          <Col lg="5" xl="6" md="6">
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
          <Col lg="5" xl="6" md="6">
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
          <Col lg="5" xl="6" md="6">
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
          <Col lg="5" xl="6" md="6">
          <FormGroup >
            <Label for="status" >
              Status
            </Label>
           
              <Input
                type="select"
                style={{height:'51px',borderRadius:'10px'}}
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
                Update
              </Button>
            </Col>
          </FormGroup>
        </Form>
      </CardBody>
    </Card>
    </Col>
    </Row>
    </>
  );
};

export default IntereditList;
