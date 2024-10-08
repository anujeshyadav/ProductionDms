import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
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
} from "reactstrap";
import {
  Hrm_AppyGroup,
  Hrm_AppyList,
  HRM_JOBLIST,
} from "../../../../../../ApiEndPoint/Api";
import {
  _PostSave,
  _GetList,
  _Get,
} from "../../../../../../ApiEndPoint/ApiCalling";

const AppResultForm = () => {
  const [jobList, setJobList] = useState([]);
  const [data, setData] = useState({
    job: "",
    name: "",
    database: "",
    email: "",
    mobileNo: "",
    checkStatus: "",
  });

  const history = useHistory();
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);

  // useEffect(() => {
  //   let userinfor = JSON.parse(localStorage.getItem("userData"))
  //   setData({ ...data, database: userinfor.database })
  // }, [])

  useEffect(() => {
    function fetchData() {
      let userinfor = JSON.parse(localStorage.getItem("userData"));
      setData({ ...data, database: userinfor.database });
      _Get(HRM_JOBLIST, userinfor?.database, userinfor?._id)
        .then((res) => {
          setJobList(res?.Job);
          console.log(res?.Job);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    console.log(data);
    e.preventDefault();
    if (validateForm()) {
      try {
        await _PostSave(Hrm_AppyGroup, data);
        setSuccessAlert(true);
        setData({
          job: "",
          name: "",
          email: "",
          mobileNo: "",
          checkStatus: "",
        });
        history.push("/app/ajgroup/HRM/JobappList");
      } catch (error) {
        console.log(error);
        setErrorAlert(true);
      }
    } else {
      setErrorAlert(true);
    }
  };

  const validateForm = () => {
    return Object.values(data).every((value) => value !== "");
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
          <CardBody>
          <Row>
          <Col lg="6" md="6" xl="6">
          <h2>Applied/Result Form</h2>
          </Col>
          <Col lg="6" md="6" xl="6">
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
          
            <Form onSubmit={handleSubmit} className="m-1">
            <Row>
            <Col lg="6" md="6" xl="6" xs="12">
            <FormGroup >
            <Label for="job" >
              Job
            </Label>
           
              <Input
              style={{height:'51px',borderRadius:'10px'}}
                type="select"
                name="job"
                id="job"
                value={data.job}
                onChange={handleInputChange}>
                <option value="">Select Job</option>
                {jobList &&
                  jobList.map((Job) => (
                    <option key={Job._id} value={Job._id}>
                      {Job.jobTitle}
                    </option>
                  ))}
              </Input>
           
          </FormGroup>
            </Col>
            <Col lg="6" md="6" xl="6" xs="12">
            <FormGroup>
                <Label for="name" >
                  Name
                </Label>
                
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    value={data.name}
                    onChange={handleInputChange}
                    placeholder="Enter your Name"
                  />
               
              </FormGroup>
            </Col>
            <Col lg="6" md="6" xl="6" xs="12">
            <FormGroup >
            <Label for="email" >
              Email
            </Label>
          
              <Input
                type="email"
                name="email"
                id="email"
                value={data.email}
                onChange={handleInputChange}
                placeholder="Email"
              />
          
          </FormGroup>
            </Col>
            <Col lg="6" md="6" xl="6" xs="12">
            <FormGroup >
            <Label for="phoneNumber" >
              Phone Number
            </Label>
            
              <Input
                type="number"
                name="mobileNo"
                id="mobileNo"
                value={data.mobileNo}
                onChange={handleInputChange}
                placeholder="Enter Phone Number"
              />
          
          </FormGroup>
            </Col>
            <Col lg="6" md="6" xl="6" xs="12">
            <FormGroup >
            <Label for="status" >
              Status
            </Label>
          
              <Input
                type="select"
                style={{height:'51px',borderRadius:'10px'}}
                name="checkStatus"
                id="checkStatus"
                value={data.checkStatus}
                onChange={handleInputChange}>
                <option value="">Select </option>
                <option value="Hired">Hired</option>
                <option value="Rejected">Rejected</option>
              </Input>
          
          </FormGroup>
            </Col>
            </Row>
             

              

             

             

            
              <FormGroup row>
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

export default AppResultForm;
