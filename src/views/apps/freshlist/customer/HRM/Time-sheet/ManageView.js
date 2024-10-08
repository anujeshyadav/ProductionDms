import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  _Get,
  _GetList,
  _PostSave,
  CreateAccountList,
} from "../../../../../../ApiEndPoint/ApiCalling";
import {
  HRM_SAVE_MANAGELEAVE,
  HRM_VIEW_LEAVE,
  HRM_VIEWOne_MANAGELEAVE,
} from "../../../../../../ApiEndPoint/Api";

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
  CustomInput,
} from "reactstrap";

const ManageView = () => {
  const [LeaveTypeList, setLeaveTypeList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  // const [totalDays, setTotalDays] = useState(0);
  const [data, setData] = useState({
    employee: "",
    leaveType: "",
    checkStatus: "",
    startDate: "",
    endDate: "",
    leaveReason: "",
    totalDays: "",
    database: "one",
  });
  const { id } = useParams();
  const calculateTotalDays = (endDates) => {
    const startDateObj = new Date(data.startDate);
    const endDateObj = new Date(endDates);
    const differenceInTime = endDateObj.getTime() - startDateObj.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    // console.log(differenceInDays);
    setData({ ...data, totalDays: differenceInDays, endDate: endDates });
  };

  useEffect(() => {
    _Get(HRM_VIEWOne_MANAGELEAVE, id)
      .then((response) => {
        setData(response.Manage);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    if (name == "endDate") {
      calculateTotalDays(e.target.value);
    }
  };
  // useEffect(() => {
  //   console.log(data);
  // }, [data]);

  useEffect(() => {
    let userId = JSON.parse(localStorage.getItem("userData"));
    CreateAccountList(userId?._id, userId?.database)
      .then((res) => {
        let value = res?.adminDetails;
        setEmployeeList(value);
        console.log(value);
      })
      .catch((err) => {
        console.log(err);
      });
    _Get(HRM_VIEW_LEAVE, userId?.database)
      .then((res) => {
        setLeaveTypeList(res?.Leave);
        console.log(res?.Leave);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await _PostSave(HRM_SAVE_MANAGELEAVE, data);
      history.push("/app/ajgroup/HRM/Time-sheet/ManageLeaveList");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Row>
      <Col sm="12" md="6" className="mx-auto">
        <Card>
          <CardHeader>
            <h3>Manage Leave Type View</h3>
            <Button
              color="danger"
              className="ml-2"
              onClick={() => history.goBack()}>
              Back
            </Button>
          </CardHeader>
          <CardBody>
            <Form onSubmit={handleSubmit}>
            <Row>
            <Col lg="6" xl="6" md="6">
            
              <FormGroup>
                <Label for="employee">Employee:</Label>

                <Input
                style={{height:'51px',borderRadius:'10px'}}
                  type="select"
                  name="employee"
                  readOnly
                  id="employee"
                  value={data.employee}
                  onChange={handleInputChange}
                  // required
                >
                  {employeeList &&
                    employeeList?.map((ele) => (
                      <option value={ele?._id}>{ele?.firstName}</option>
                    ))}
                </Input>
              </FormGroup>
</Col>
<Col lg="6" xl="6" md="6">
              <FormGroup>
                <Label for="leaveType">Leave Type:</Label>

                <Input
                style={{height:'51px',borderRadius:'10px'}}
                  type="select"
                  name="leaveType"
                  readOnly
                  id="leaveType"
                  value={data.leaveType}
                  onChange={handleInputChange}
                  // required
                >
                  {LeaveTypeList &&
                    LeaveTypeList?.map((ele) => (
                      <option value={ele._id}>{ele.leaveType}</option>
                    ))}
                </Input>
              </FormGroup>
              </Col>
              <Col lg="6" xl="6" md="6">
              <FormGroup>
                <Label for="startDate">Start Date</Label>
                <Input
                  type="date"
                  readOnly
                  name="startDate"
                  value={data.startDate}
                  onChange={handleInputChange}
                  // required
                />
              </FormGroup>
              </Col>
              <Col lg="6" xl="6" md="6">
              <FormGroup>
                <Label>EndDate</Label>
                <Input
                  readOnly
                  type="date"
                  name="endDate"
                  value={data.endDate}
                  onChange={handleInputChange}
                  // required
                />
              </FormGroup>
              </Col>
              <Col lg="6" xl="6" md="6">
              <FormGroup>
                <Label for="totalDays">TotalDays</Label>
                <Input
                  type="number"
                  readOnly
                  name="totalDays"
                  value={data.totalDays}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup> 
              </Col>
              <Col lg="6" xl="6" md="6">
              <FormGroup>
                <Label className="">CheckStatus:</Label>
                <Input
                style={{height:'51px',borderRadius:'10px'}}
                  type="select"
                  name="checkStatus"
                  readOnly
                  value={data.checkStatus}
                  onChange={handleInputChange}
                  required>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </Input>
              </FormGroup>
              </Col>
              <Col lg="6" xl="6" md="6">
              <FormGroup>
                <Label for="numberOfDays">Leave Reason</Label>
                <Input
                  type="textarea"
                  readOnly
                  name="leaveReason"
                  value={data.leaveReason}
                  placeholder="Enter Leave Reason"
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              </Col>
           
              </Row>
              {/* <FormGroup>
                <Button color="primary" type="submit">
                  Submit
                </Button>
              </FormGroup> */}
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default ManageView;
