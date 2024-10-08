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
  SAVE_TERMINATION,
  TERMINATION_VIEWBYID,
} from "../../../../../../ApiEndPoint/Api";
import {
  _Get,
  _PostSave,
  CreateAccountList,
} from "../../../../../../ApiEndPoint/ApiCalling";

const TerminationViewForm = () => {
  const history = useHistory();
  const { id } = useParams();
  //   const [employeeList, setEmployeeList] = useState([]);
  const [data, setData] = useState({
    // employeeName: '',
    // terminationType: '',
    // noticeDate: '',
    // terminationDate: '',
    // description: '',
    // database:'',
  });

  //   useEffect(() => {
  //     function fetchData() {
  //       let userinfor = JSON.parse(localStorage.getItem("userData"));
  //       setData({ ...data, database: userinfor.database })
  //       CreateAccountList( userinfor?._id,userinfor?.database)
  //         .then(res => {
  //           let value = res?.adminDetails;
  //           setEmployeeList(value);
  //           console.log(value);
  //         })
  //         .catch(err => {
  //           console.log(err);
  //         });
  //     }
  //     fetchData();
  //   }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await _Get(TERMINATION_VIEWBYID, id);
        console.log(response.Termination);
        setData(response.Termination);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await _PostSave(SAVE_TERMINATION, data);
      history.push("/app/ajgroup/HRM/termList");
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
          <h2>View Termination Form</h2>
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
                    <Label for="employeeName">Employee:</Label>
                    <Input
                      readOnly
                      type="text"
                      name="employeeName"
                      id="employeeName"
                      value={data.employeeName?.firstName}
                      //   onChange={handleInputChange}>
                      //   <option value="">Select Employee</option>
                      //   {employeeList &&
                      // employeeList?.map((ele) => (
                      //   <option value={ele?._id}>{ele?.firstName}</option>
                      // ))}
                      // </Input>
                    />
                  </FormGroup>
                </Col>
                <Col md='6' xl='6' lg='6'>
                  <FormGroup>
                    <Label for="terminationType">Termination Type:</Label>
                    <Input
                      readOnly
                      type="text"
                      name="terminationType"
                      id="terminationType"
                      value={data.terminationType}
                      onChange={handleInputChange}>
                      {/* <option value="">Select Termination Type</option> */}
                    </Input>
                  </FormGroup>
                </Col>
              
                <Col md='6' xl='6' lg='6'>
                  <FormGroup>
                    <Label for="noticeDate">Notice Date:</Label>
                    <Input
                      readOnly
                      type="date"
                      name="noticeDate"
                      id="noticeDate"
                      value={data.noticeDate}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col md='6' xl='6' lg='6'>
                  <FormGroup>
                    <Label for="terminationDate">Termination Date:</Label>
                    <Input
                      readOnly
                      type="date"
                      name="terminationDate"
                      id="terminationDate"
                      value={data.terminationDate}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
             
                <Col md='6' xl='6' lg='6'>
                  <FormGroup>
                    <Label for="description">Description:</Label>
                    <Input
                      readOnly
                      style={{height:'51px',borderRadius:'10px'}}
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
              {/* <FormGroup>
                <Col>
                  <Button color="primary" type="submit" className="mt-2">
                    Submit
                  </Button>
                </Col>
              </FormGroup> */}
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default TerminationViewForm;
