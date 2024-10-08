import React, { useEffect, useState } from "react";
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
  CreateAccountList,
  _Get,
  _GetList,
  _PostSave,
} from "../../../../../../ApiEndPoint/ApiCalling";
import {
  HRM_BRANCH_VIEW,
  List_Department,
  Save_Announcement,
} from "../../../../../../ApiEndPoint/Api";
import Multiselect from "multiselect-react-dropdown";
import swal from "sweetalert";

const AnnouncementForm = () => {
  const history = useHistory();
  const [branches, setBranches] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [AllemployeeList, setAllEmployeeList] = useState([]);
  const [Department, setDepartment] = useState([]);

  const [data, setData] = useState({
    annoucementTitle: "",
    branch: "",
    department: "",
    employeeName: "",
    annoucementStartDate: "",
    annoucementEndDate: "",
    description: "",
    database: "",
  });
  const getBranches = async (db) => {
    _Get(HRM_BRANCH_VIEW, db)
      .then((res) => {
        setBranches(res?.JobBatch);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  useEffect(() => {
    let userinfo = JSON.parse(localStorage.getItem("userData"));
    getBranches(userinfo?.database);
    CreateAccountList(userinfo?._id, userinfo?.database)
      .then((res) => {
        let value = res?.adminDetails;
        setEmployeeList(value);
        setAllEmployeeList(value);
      })
      .catch((err) => {
        console.log(err);
      });
    let URL = `${List_Department}/${userinfo?.database}`;
    _GetList(URL)
      .then((res) => {
        let AllDeparts = res?.Department?.filter(
          (ele) => ele?.status == "Active"
        );
        setDepartment(AllDeparts);
      })
      .catch((err) => {
        console.log(err);
      });

    setData({ ...data, database: userinfo?.database });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(data);
    let employeeName = data?.employeeName?.map((ele) => {
      return { id: ele?._id };
    });
    let Payload = {
      annoucementTitle: data?.annoucementTitle,
      branch: data?.branch,
      department: data?.department,
      employeeName: employeeName,
      annoucementStartDate: data?.annoucementStartDate,
      annoucementEndDate: data?.annoucementEndDate,
      description: data?.description,
      database: data?.database,
    };
    await _PostSave(Save_Announcement, Payload)
      .then((res) => {
        swal("Data Saved Successfully", "success");
        history.goBack();
      })
      .catch((err) => {
        swal("Something Went Wrong", "error");
        console.log(err);
      });
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
          <Col lg='6' xl='6' md='6'>
          <h2>Announcement Form</h2>
          </Col>
          <Col lg='6' xl='6' md='6'>
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
                <Col md='6' lg='6' xl='6' >
                  <FormGroup>
                    <Label for="title">Announcement Title:</Label>
                    <Input
                      required
                      type="text"
                      placeholder="Announcement Title"
                      name="annoucementTitle"
                      id="annoucementTitle"
                      value={data.annoucementTitle}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col md='6' lg='6' xl='6'>
                  <FormGroup>
                    <Label for="branch">Branch:</Label>
                    <Input
                 style={{height:'51px',borderRadius:'10px'}}
                      required="required"
                      type="select"
                      name="branch"
                      id="branch"
                      value={data.branch}
                      onChange={handleInputChange}
                      placeholder="Select Branch">
                      <option value="">Select Branch</option>

                      {branches &&
                        branches
                          .filter((branch) => branch?.name.trim() !== "")
                          .map((branch) => (
                            <option key={branch?._id} value={branch?._id}>
                              {branch?.name}
                            </option>
                          ))}
                    </Input>
                  </FormGroup>
                </Col>
             
          
              
                <Col md='6' lg='6' xl='6'>
                  <FormGroup>
                    <Label for="startDate">Announcement Start Date:</Label>
                    <Input
                      required
                      type="date"
                      name="annoucementStartDate"
                      id="annoucementStartDate"
                      value={data.annoucementStartDate}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col md='6' lg='6' xl='6'>
                  <FormGroup>
                    <Label for="endDate">Announcement End Date:</Label>
                    <Input
                      required
                      type="date"
                      name="annoucementEndDate"
                      id="annoucementEndDate"
                      value={data.annoucementEndDate}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col md='6' lg='6' xl='6'>
                <FormGroup>
                  <Label for="employee">Employee:</Label>
                  <Multiselect
                  className="cssforAnnouncementForm"
                    required
                    
                    showCheckbox="true"
                    name=" employeeName"
                    id=" employeeName"
                    isObject="false"
                    options={employeeList} // Options to display in the dropdown
                    selectedValues={[]} // Preselected value to persist in dropdown
                    onSelect={(selectedList, selectedItem) => {
                      // setSelectedWareHouse(selectedList);
                      setData({ ...data, employeeName: selectedList });
                    }} // Function will trigger on select event
                    onRemove={(selectedList, removedItem) => {
                      setData({
                        ...data,
                        employeeName: selectedList,
                      });
                    }} // Function will trigger on remove event
                    displayValue="firstName" // Property name to display in the dropdown options
                  />
                </FormGroup>
              </Col>
                <Col md='6' lg='6' xl='6'>
                  <FormGroup>
                    <Label for="description">Announcement Description:</Label>
                    <Input
                      required
                      style={{height:'51px',borderRadius:'10px'}}
                      type="textarea"
                      placeholder="Announcement Description"
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

export default AnnouncementForm;
