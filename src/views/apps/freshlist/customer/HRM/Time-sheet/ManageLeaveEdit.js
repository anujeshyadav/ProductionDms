import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  _Get,
  _GetList,
  _PostSave,
  _Put,
  CreateAccountList,
} from "../../../../../../ApiEndPoint/ApiCalling";
import {
  HRM_VIEW_LEAVE,
  HRM_VIEWOne_MANAGELEAVE,
  HRM_VIEWOne_MANAGELEAVE_Edit,
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
import swal from "sweetalert";

const ManageLeaveEdit = () => {
  let { id } = useParams();
  const [LeaveTypeList, setLeaveTypeList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await _Get(HRM_VIEWOne_MANAGELEAVE, id);
        console.log(response.Manage);
        setData(response.Manage);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  const calculateTotalDays = (endDates) => {
    const startDateObj = new Date(data.startDate);
    const endDateObj = new Date(endDates);
    const differenceInTime = endDateObj.getTime() - startDateObj.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    console.log(differenceInDays);
    setData({ ...data, totalDays: differenceInDays, endDate: endDates });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    if (name == "endDate") {
      calculateTotalDays(e.target.value);
    }
  };

  useEffect(() => {
    function fetchData() {
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
    }
    fetchData();
  }, []);

  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await _Put(HRM_VIEWOne_MANAGELEAVE_Edit, id, data);
      swal("Edited Successfully");
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
            <h3>Edit Manage Leave Type</h3>
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
                  type="select"
                  style={{height:'51px',borderRadius:'10px'}}
                  name="leaveType"
                  id="leaveType"
                  value={data.leaveType}
                  onChange={handleInputChange}
                  // required
                >
                  {/* <option value="Casual Leave">Casual Leave</option> */}
                  {LeaveTypeList &&
                    LeaveTypeList?.map((ele) => (
                      <option value={ele._id}>{ele.leaveType}</option>
                    ))}
                  {/* <option value="Medical Leave">Medical Leave</option>
                  <option value="Paternity Leave">Paternity Leave</option>
                  <option value="Maternity Leave">Maternity Leave</option>
                  <option value="Annual Leave">Annual Leave</option> */}
                </Input>
              </FormGroup>
              </Col>
              <Col lg="6" xl="6" md="6">
              <FormGroup>
                <Label for="startDate">StartDate</Label>
                <Input
                  type="date"
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
                  value={data.checkStatus}
                  onChange={handleInputChange}
                  required>
                  <option value="">Select Status</option>
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
                  name="leaveReason"
                  value={data.leaveReason}
                  placeholder="Enter Leave Reason"
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              </Col>
             
              </Row>
              <FormGroup className="text-center">
                <Button color="primary" type="submit">
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

export default ManageLeaveEdit;
