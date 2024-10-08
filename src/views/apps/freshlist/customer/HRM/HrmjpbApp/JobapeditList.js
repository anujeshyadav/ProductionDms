import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
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
  Row,
} from "reactstrap";
import {
  Hrm_AppUpdate,
  Hrm_AppviewOne,
  HRM_JOBLIST,
} from "../../../../../../ApiEndPoint/Api";
import {
  _Get,
  _Put,
  _GetList,
  _PostSave,
} from "../../../../../../ApiEndPoint/ApiCalling";

const JobapEdList = () => {
  const [jobList, setJobList] = useState([]);

  const { id } = useParams();
  const [data, setData] = useState({
    job: "",
    name: "",
    database: "",
    email: "",
    mobileNo: "",
    checkStatus: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await _Get(Hrm_AppviewOne, id);
        let mydata = response.Job;
        setData({
          job: mydata?.job?._id,
          name: mydata?.name,
          email: mydata?.email,
          mobileNo: mydata?.mobileNo,
          checkStatus: mydata.checkStatus,
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

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

  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let payload = {
      email: data?.email,
      job: data?.job,
      mobileNo: data?.mobileNo,
      name: data?.name,
      checkStatus: data?.checkStatus,
    };
    try {
      await _Put(Hrm_AppUpdate, id, payload);
      history.push("/app/ajgroup/HRM/JobappList");
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
            <h2>Applied/Result Form</h2>
            <Button color="danger" type="button" onClick={handleBack}>
              Back
            </Button>
          </CardHeader>
          <CardBody>
            <Form onSubmit={handleSubmit}>
            <Row>
          <Col lg="6" xl="6" md="6">


              <FormGroup >
                <Label for="job" >
                  Job
                </Label>
                
                  <Input
                    type="select"
                    style={{borderRadius:'10px',height:'51px'}}
                    name="job"
                    id="job"
                    value={data?.job}
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
<Col lg="6" xl="6" md="6">
              <FormGroup >
                <Label for="name" >
                  Name
                </Label>
              
                  <Input
                    type="text"

                    name="name"
                    id="name"
                    value={data?.name}
                    onChange={handleInputChange}
                    placeholder="Enter your Name"
                  />
               
              </FormGroup>
              </Col>
              <Col lg="6" xl="6" md="6">
              <FormGroup >
                <Label for="email" >
                  Email
                </Label>
             
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    value={data?.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                  />
               
              </FormGroup>
              </Col>
              <Col lg="6" xl="6" md="6">
              <FormGroup >
                <Label for="phoneNumber" >
                  Phone Number
                </Label>
              
                  <Input
                    type="number"
                    name="mobileNo"
                    id="mobileNo"
                    value={data?.mobileNo}
                    onChange={handleInputChange}
                    placeholder="Enter Phone Number"
                  />
            
              </FormGroup>
              </Col>
              <Col lg="6" xl="6" md="6">
              <FormGroup >
                <Label for="status" >
                  Status
                </Label>
              
                  <Input
                    type="select"
                    style={{borderRadius:'10px',height:'51px'}}
                    name="checkStatus"
                    id="checkStatus"
                    value={data?.checkStatus}
                    onChange={handleInputChange}>
                    <option value="">Select </option>
                    <option value="Hired">Hired</option>
                    <option value="Rejected">Rejected</option>
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
  );
};

export default JobapEdList;
