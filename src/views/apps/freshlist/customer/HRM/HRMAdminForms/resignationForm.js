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
import { SAVE_RESIGNATION } from "../../../../../../ApiEndPoint/Api";

const ResignationForm = () => {
  const history = useHistory();
  const [employeeList, setEmployeeList] = useState([]);
  const [data, setData] = useState({
    employeeName: "",
    resignationDate: "",
    lastWorkingDay: "",
    reason: "",
    database: "",
  });

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
      await _PostSave(SAVE_RESIGNATION, data);
      history.push("/app/ajgroup/HRM/resignation");
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
      <Col sm="12" md="6" className="mx-auto">
        <Card>
          <CardHeader>
          <Row style={{width:'100%'}}>
          <Col lg="6" xl="6" md="6">
          <h2>Resignation Form</h2>
          </Col>
          <Col lg="6" xl="6" md="6">
          <Button color="danger" className="float-right" onClick={handleBack}>
          Back
        </Button>
          </Col>
          </Row>
           
           
          </CardHeader>
          <CardBody>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md="6" xl="6" lg="6">
                  <FormGroup>
                    <Label for="employeeName">Employee Name:</Label>
                    <Input
                      type="select"
                      style={{height:'51px',borderRadius:'10px'}}
                      name="employeeName"
                      id="employeeName"
                      value={data.employeeName}
                      placeholder="Employee name"
                      onChange={handleInputChange}
                      required>
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
                    <Label for="resignationDate">Resignation Date:</Label>
                    <Input
                      required
                      type="date"
                      placeholder="Resignation Date"
                      name="resignationDate"
                      id="resignationDate"
                      value={data.resignationDate}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>

                <Col mmd="6" xl="6" lg="6">
                  <FormGroup>
                    <Label for="lastWorkingDay">Last Working Day:</Label>
                    <Input
                      required
                      type="date"
                      placeholder="Last Working Day"
                      name="lastWorkingDay"
                      id="lastWorkingDay"
                      value={data.lastWorkingDay}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
            
                <Col md="6" xl="6" lg="6">
                  <FormGroup>
                    <Label for="reason">Reason:</Label>
                    <Input
                      required
                      type="textarea"
                      style={{height:'51px'}}
                      placeholder="Enter reason"
                      name="reason"
                      id="reason"
                      value={data.reason}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
                </Row>
                <FormGroup className="text-center" >
                 
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

export default ResignationForm;
