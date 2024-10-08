import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import { useHistory, useParams } from "react-router-dom";
import {
  _Put,
  _Get,
  _PostSave,
  CreateAccountList,
} from "../../../../../../ApiEndPoint/ApiCalling";
import {
  WARNING_SAVE_WARNING,
  UPDATE_WARNING,
  VIEW_WARNING_BY_ID,
} from "../../../../../../ApiEndPoint/Api";

const WarningEditForm = () => {
  const history = useHistory();
  const { id } = useParams();
  const [employeeList, setEmployeeList] = useState([]);

  const [data, setData] = useState({
    warningByEmployeeName: "",
    warningToEmployeeName: "",
    subject: "",
    warningDate: "",
    description: "",
    database: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  useEffect(() => {
    function fetchData() {
      let userinfor = JSON.parse(localStorage.getItem("userData"));
      setData({ ...data, database: userinfor.database });
      CreateAccountList(userinfor?._id, userinfor?.database)
        .then((res) => {
          let value = res?.adminDetails;
          setEmployeeList(value);
          console.log(value);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await _Get(VIEW_WARNING_BY_ID, id);
        console.log(response.warning);
        let mydata = response.warning;
        setData({
          warningByEmployeeName: mydata?.warningByEmployeeName?._id,
          warningToEmployeeName: mydata?.warningToEmployeeName?._id,
          subject: mydata?.subject,
          warningDate: mydata?.warningDate,
          description: mydata?.description,
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await _Put(UPDATE_WARNING, id, data);
      history.push("/app/ajgroup/HRM/warningList");
    } catch (error) {
      console.log(error);
    }
  };

  const handleBack = () => {
    history.goBack();
  };

  return (
    <Row>
      <Col sm="12" md="6" className="mx-auto">
        <Card>
          <CardHeader>
          <Row style={{width:'100%'}}>
          <Col lg="6" xl="6" md="6">
          <h2>Edit Warning Form</h2>
          </Col>
          <Col lg="6" xl="6" md="6">
          <div className="float-right">
          <Button color="danger" onClick={handleBack}>
          Back
        </Button>
          </div>
          </Col>
          </Row>
          </CardHeader>
          <CardBody>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md='6' xl='6' lg='6'>
                  <FormGroup>
                    <Label for="warningByEmployeeName">Warning By:</Label>
                    <Input
                    style={{height:'51px',borderRadius:'10px'}}
                      required
                      type="select"
                      placeholder="Warning By"
                      name="warningByEmployeeName"
                      id="warningByEmployeeName"
                      value={data.warningByEmployeeName}
                      onChange={handleInputChange}>
                      <option value="">Select Employee</option>
                      {employeeList &&
                        employeeList?.map((ele) => (
                          <option value={ele?._id}>{ele?.firstName}</option>
                        ))}
                    </Input>
                  </FormGroup>
                </Col>
                <Col md='6' xl='6' lg='6'>
                  <FormGroup>
                    <Label for="warningToEmployeeName">Warning To:</Label>
                    <Input  style={{height:'51px',borderRadius:'10px'}}
                      required
                      type="select"
                      placeholder="Warning To"
                      name="warningToEmployeeName"
                      id="warningToEmployeeName"
                      value={data.warningToEmployeeName}
                      onChange={handleInputChange}>
                      <option value="">Select Employee</option>
                      {employeeList &&
                        employeeList?.map((ele) => (
                          <option value={ele?._id}>{ele?.firstName}</option>
                        ))}
                    </Input>
                  </FormGroup>
                </Col>
             
                <Col md='6' xl='6' lg='6'>
                  <FormGroup>
                    <Label for="subject">Subject:</Label>
                    <Input
                      required
                      type="text"
                      placeholder="Subject"
                      name="subject"
                      id="subject"
                      value={data.subject}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col md='6' xl='6' lg='6'>
                  <FormGroup>
                    <Label for="warningDate">Warning Date:</Label>
                    <Input
                      required
                      type="date"
                      placeholder="Warning Date"
                      name="warningDate"
                      id="warningDate"
                      value={data.warningDate}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
             
                <Col md='6' xl='6' lg='6'>
                  <FormGroup>
                    <Label for="description">Description:</Label>
                    <Input  style={{height:'51px',borderRadius:'10px'}}
                      required
                      type="textarea"
                      placeholder="Description"
                      name="description"
                      id="description"
                      value={data.description}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
              </Row>
              
                <FormGroup className="text-center">
                 
                    <Button color="primary" type="submit" className="mt-2">
                      Update
                    </Button>
                 
                </FormGroup>
            
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default WarningEditForm;
