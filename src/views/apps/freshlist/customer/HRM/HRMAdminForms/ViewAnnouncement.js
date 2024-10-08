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
import { useHistory, useParams } from "react-router-dom";
import {
  CreateAccountList,
  _Get,
  _GetList,
  _PostSave,
  _Put,
} from "../../../../../../ApiEndPoint/ApiCalling";
import {
  Announcement_Update,
  Announcement_by_ID,
  HRM_BRANCH_VIEW,
  List_Department,
  Save_Announcement,
} from "../../../../../../ApiEndPoint/Api";
import Multiselect from "multiselect-react-dropdown";
import swal from "sweetalert";

const AnnouncementForm = () => {
  const history = useHistory();
  const Params = useParams();
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
    console.log(Params?.id);
    _Get(Announcement_by_ID, Params?.id)
      .then((res) => {
        console.log(res?.Annoucement);
        let value = res?.Annoucement;
        let Emp = value?.employeeName?.map((ele) => {
          return ele?.id;
        });
        let payload = {
          annoucementTitle: value?.annoucementTitle,
          branch: value?.branch?._id,
          //   department:value?.department,
          employeeName: Emp,
          annoucementStartDate: value?.annoucementStartDate,
          annoucementEndDate: value?.annoucementEndDate,
          description: value?.description,
          database: value?.database,
        };
        setData(payload);
      })
      .catch((err) => {
        console.log(err);
      });
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
    await _Put(Announcement_Update, Params?.id, Payload)
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
          <Col lg='8' xl='8' md='7'>
          <h2>View Announcement Form</h2>
          </Col>
          <Col lg='4' xl='4' md='5'>
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
                      readOnly
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
                    style={{borderRadius:'10px',height:'51px'}}
                      readOnly
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
                      readOnly
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
                      readOnly
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
                    required
                   
                    showCheckbox="true"
                    name=" employeeName"
                    id=" employeeName"
                    isObject="false"
                    options={employeeList} // Options to display in the dropdown
                    selectedValues={data?.employeeName} // Preselected value to persist in dropdown
                    //   onSelect={(selectedList, selectedItem) => {
                    //     // setSelectedWareHouse(selectedList);
                    //     // setData({ ...data, employeeName: selectedList });
                    //   }} // Function will trigger on select event
                    //   onRemove={(selectedList, removedItem) => {
                    //     setData({
                    //       ...data,
                    //       employeeName: selectedList,
                    //     });
                    //   }} // Function will trigger on remove event
                    displayValue="firstName" // Property name to display in the dropdown options
                  />
                  {/* <Input
                    type="select"
                    name=" employeeName"
                    id=" employeeName"
                    value={data.employeeName}
                    onChange={handleInputChange}>
                    <option value="">Select Employee Name</option>
                    {employeeList &&
                      employeeList?.map((ele) => (
                        <option value={ele?._id}>{ele?.firstName}</option>
                      ))}
                  </Input> */}
                </FormGroup>
              </Col>
             
                <Col md='6' lg='6' xl='6'>
                  <FormGroup>
                    <Label for="description">Announcement Description:</Label>
                    <Input
                    style={{borderRadius:'10px',height:'51px'}}
                      readOnly
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
              {/* <FormGroup>
                <Col sm={{ size: 9, offset: 5 }}>
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

export default AnnouncementForm;
