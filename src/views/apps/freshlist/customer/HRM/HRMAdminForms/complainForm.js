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
import { useHistory } from "react-router-dom";
import {
  _PostSave,
  CreateAccountList,
} from "../../../../../../ApiEndPoint/ApiCalling";
import { COMPLAINT_HRM_SAVE_COMPLAINT } from "../../../../../../ApiEndPoint/Api";

const ComplaintForm = () => {
  const history = useHistory();
  const [employeeList, setEmployeeList] = useState([]);
  const [data, setData] = useState({
    complaintFromEmployeeName: "",
    database: "",
    complaintToEmployeeName: "",
    title: "",
    complaintDate: "",
    description: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await _PostSave(COMPLAINT_HRM_SAVE_COMPLAINT, data);
      history.push("/app/ajgroup/HRM/complainList");
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
          <Col lg="6" xl="6" md="6" xs="12">
          <h2>Complaint Form</h2>
          </Col>
          <Col lg="6" xl="6" md="6" xs="12">
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
                <Col md="6" xl="6" lg="6">
                  <FormGroup>
                    <Label for="complaintFromEmployeeName">
                      Complaint From:
                    </Label>
                    <Input
                    style={{height:'51px',borderRadius:'10px'}}
                      required
                      type="select"
                      placeholder="Complaint From"
                      name="complaintFromEmployeeName"
                      id="complaintFromEmployeeName"
                      value={data.complaintFromEmployeeName}
                      onChange={handleInputChange}>
                      <option value="">Select Employee</option>
                      {employeeList &&
                        employeeList?.map((ele) => (
                          <option value={ele?._id}>{ele?.firstName}</option>
                        ))}
                    </Input>
                  </FormGroup>
                </Col>
                <Col md="6" xl="6" lg="6">
                  <FormGroup>
                    <Label for="complaintToEmployeeName">
                      Complaint Against:
                    </Label>
                    <Input
                    style={{height:'51px',borderRadius:'10px'}}
                      required
                      type="select"
                      placeholder="Complaint Against"
                      name="complaintToEmployeeName"
                      id="complaintToEmployeeName"
                      value={data.complaintToEmployeeName}
                      onChange={handleInputChange}>
                      <option value="">Select Employee</option>
                      {employeeList &&
                        employeeList?.map((ele) => (
                          <option value={ele?._id}>{ele?.firstName}</option>
                        ))}
                    </Input>
                  </FormGroup>
                </Col>
             
                <Col md="6" xl="6" lg="6">
                  <FormGroup>
                    <Label for="title">Title:</Label>
                    <Input
                      required
                      type="text"
                      placeholder="Title"
                      name="title"
                      id="title"
                      value={data.title}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col md="6" xl="6" lg="6">
                  <FormGroup>
                    <Label for="complaintDate">Complaint Date:</Label>
                    <Input
                      required
                      type="date"
                      placeholder="Complaint Date"
                      name="complaintDate"
                      id="complaintDate"
                      value={data.complaintDate}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
             
                <Col md="6" xl="6" lg="6">
                  <FormGroup>
                    <Label for="description">Description:</Label>
                    <Input
                    style={{height:'51px',borderRadius:'10px'}}
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
                      Submit
                    </Button>
                 
                </FormGroup>
             
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default ComplaintForm;
