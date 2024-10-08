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
  UPDATE_COMPLAINT,
  COMPLAINT_VIEWCOMPLAINT_BY_ID,
} from "../../../../../../ApiEndPoint/Api";

const ComplainteditForm = () => {
  const history = useHistory();
  const { id } = useParams();
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await _Get(COMPLAINT_VIEWCOMPLAINT_BY_ID, id);
        console.log(response.Complaint);
        let mydata = response.Complaint;
        setData({
          complaintFromEmployeeName: mydata?.complaintFromEmployeeName?._id,
          complaintToEmployeeName: mydata?.complaintToEmployeeName?._id,
          title: mydata?.title,
          complaintDate: mydata?.complaintDate,
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
      await _Put(UPDATE_COMPLAINT, id, data);
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
          <h2>Edit Complaint Form</h2>
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
                <Col md={6}>
                  <FormGroup>
                    <Label for="complaintFromEmployeeName">
                      Complaint From:
                    </Label>
                    <Input
                    style={{borderRadius:'10px',height:'51px'}}
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
                <Col md={6}>
                  <FormGroup>
                    <Label for="complaintToEmployeeName">
                      Complaint Against:
                    </Label>
                    <Input
                    style={{borderRadius:'10px',height:'51px'}}
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
              </Row>
              <Row>
                <Col md={6}>
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
                <Col md={6}>
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
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="description">Description:</Label>
                    <Input
                    style={{borderRadius:'10px',height:'51px'}}
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

export default ComplainteditForm;
