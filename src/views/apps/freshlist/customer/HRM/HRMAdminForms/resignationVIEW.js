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
  _Get,
  _PostSave,
  CreateAccountList,
} from "../../../../../../ApiEndPoint/ApiCalling";
import {
  SAVE_RESIGNATION,
  VIEW_RESGNATION_BY_ID,
} from "../../../../../../ApiEndPoint/Api";

const ResignationViewForm = () => {
  const history = useHistory();
  const { id } = useParams();
  // const [employeeList, setEmployeeList] = useState([]);
  const [data, setData] = useState({
    //   employeeName: '',
    //   resignationDate: '',
    //   lastWorkingDay: '',
    //   reason: '',
    //   database:'',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await _Get(VIEW_RESGNATION_BY_ID, id);
        console.log(response.Resignation);
        setData(response.Resignation);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  // useEffect(() => {
  //   function fetchData() {
  //     let userinfor = JSON.parse(localStorage.getItem("userData"));
  //     setData({ ...data, database: userinfor.database })
  //     CreateAccountList( userinfor?._id,userinfor?.database)
  //       .then(res => {
  //         let value = res?.adminDetails;
  //         setEmployeeList(value);
  //         console.log(value);
  //       })
  //       .catch(err => {
  //         console.log(err);
  //       });
  //   }
  //   fetchData();
  // }, []);

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
          <Col lg="6" xl="6" md="6" xs="12">
          <h2>View Resignation Form</h2>
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
                <Col md="6" lg="6" xl="6" >
                  <FormGroup>
                    <Label for="employeeName">Employee Name:</Label>
                    <Input
                      readOnly
                      type="text"
                      name="employeeName"
                      id="employeeName"
                      value={data?.employeeName?.firstName}
                      placeholder="Employee name"
                      //     onChange={handleInputChange}
                      //     required>
                      //     <option value="">Select Employee</option>
                      //   {employeeList &&
                      // employeeList?.map((ele) => (
                      //   <option value={ele?._id}>{ele?.firstName}</option>
                      // ))}
                      //   </Input>
                    />
                  </FormGroup>
                </Col>
             
                <Col md="6" lg="6" xl="6">
                  <FormGroup>
                    <Label for="resignationDate">Resignation Date:</Label>
                    <Input
                      readOnly
                      type="date"
                      placeholder="Resignation Date"
                      name="resignationDate"
                      id="resignationDate"
                      value={data.resignationDate}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>

                <Col md="6" lg="6" xl="6">
                  <FormGroup>
                    <Label for="lastWorkingDay">Last Working Day:</Label>
                    <Input
                      readOnly
                      type="date"
                      placeholder="Last Working Day"
                      name="lastWorkingDay"
                      id="lastWorkingDay"
                      value={data.lastWorkingDay}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
              
                <Col md="6" lg="6" xl="6">
                  <FormGroup>
                    <Label for="reason">Reason:</Label>
                    <Input
                    style={{height:'51px'}}
                      readOnly
                      type="textarea"
                      placeholder="Enter reason"
                      name="reason"
                      id="reason"
                      value={data.reason}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
             
                {/* <FormGroup>
                    <Col sm={{ size: 9, offset: 5 }}>
                      <Button color="primary" type="submit" className="mt-2">
                        Submit
                      </Button>
                    </Col>
                  </FormGroup> */}
              </Row>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default ResignationViewForm;
