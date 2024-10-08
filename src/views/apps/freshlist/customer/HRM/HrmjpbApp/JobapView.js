//
import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  Form,
  Row,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
  CardHeader,
} from "reactstrap";
import {
  Hrm_AppviewOne,
  Hrm_AppyGroup,
  HRM_JOBLIST,
} from "../../../../../../ApiEndPoint/Api";
import {
  _Get,
  _GetList,
  _PostSave,
  _Put,
} from "../../../../../../ApiEndPoint/ApiCalling";

const JobApView = () => {
  const [data, setData] = useState({});

  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await _Get(Hrm_AppviewOne, id);
        console.log(response.Job);
        setData(response.Job);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await _PostSave(Hrm_AppyGroup, data);
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
    <Card >
    <CardHeader>
      <h2>Applied/Result Form</h2>

      <Button color="danger" type="button" onClick={handleBack}>
        Back
      </Button>
    </CardHeader>
    <CardBody>
      <Form onSubmit={handleSubmit}>
           <Row>
           <Col md="6" xl="6" lg="6">
        <FormGroup >
          <Label for="job" >
            Job
          </Label>
        
            <Input
           
              type="text"
              name="job"
              id="job"
              value={data?.job?.jobTitle}
              readOnly
            />
         
        </FormGroup>
        </Col>
        <Col md="6" xl="6" lg="6">
        <FormGroup >
          <Label for="name" >
            Name
          </Label>
        
            <Input
              name="name"
              id="name"
              value={data?.name}
              onChange={handleInputChange}
              readOnly
            />
        
        </FormGroup>
        </Col> 
        <Col md="6" xl="6" lg="6">
        <FormGroup >
          <Label for="email" >
            Email
          </Label>
          
            <Input
              name="email"
              id="email"
              value={data?.email}
              onChange={handleInputChange}
              readOnly
            />
         
        </FormGroup>
        </Col>
        <Col md="6" xl="6" lg="6">
        <FormGroup >
          <Label for="phoneNumber" >
            Phone Number
          </Label>
        
            <Input
              name="mobileNo"
              id="mobileNo"
              value={data?.mobileNo}
              onChange={handleInputChange}
              readOnly
            />
       
        </FormGroup>
        </Col>
        <Col md="6" xl="6" lg="6">
        <FormGroup >
          <Label for="status" >
            Status
          </Label>
        
            <Input
              name="checkStatus"
              id="checkStatus"
              value={data?.checkStatus}
              onChange={handleInputChange}
              readOnly>
              <option value="">Select </option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
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

export default JobApView;
