import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Alert,
  Input,
  Button,
  CardBody,
  CardHeader,
} from "reactstrap";
import { _Get, _PostSave } from "../../../../../../ApiEndPoint/ApiCalling";
import {
  Create_Account_List,
  HRM_BRANCH_VIEW,
  Hrm_AppyList,
  Hrm_TrainGroup,
} from "../../../../../../ApiEndPoint/Api";
import { useHistory } from "react-router-dom";
import Multiselect from "multiselect-react-dropdown";
const TrainingForm = () => {
  const [data, setData] = useState({
    branch: "",
    trainer: "",
    trainingType: "",
    trainingCost: "",
    employee: [],
    startDate: "",
    endDate: "",
    description: "",
    database: "",
  });
  const [successAlert, setSuccessAlert] = useState(false);
  const [branches, setBranches] = useState([]);
  const [TrainerList, setTrainerList] = useState([]);
  const [HiredList, setHiredList] = useState([]);

  const [errorAlert, setErrorAlert] = useState(false);
  //  parameter's : branch,trainer,employee,trainingType,trainingCost,startDate,endDate,description
  const history = useHistory();

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("userData"));
    _Get(HRM_BRANCH_VIEW, user?.database)
      .then((res) => {
        setBranches(res?.JobBatch);
      })
      .catch((err) => {
        console.log(err);
      });
    let URL = `${Create_Account_List}/${user?._id}/`;
    _Get(URL, user?.database)
      .then((res) => {
        setTrainerList(res?.adminDetails);
      })
      .catch((err) => {
        console.log(err);
      });
    _Get(Hrm_AppyList, user?.database, user?._id)
      .then((res) => {
        let Hired = res?.Job?.filter((ele) => ele?.checkStatus == "Hired");
        setHiredList(Hired);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let userId = JSON.parse(localStorage.getItem("userData"));
    let payload = {
      branch: data?.branch,
      trainer: data?.trainer,
      trainingType: data?.trainingType,
      trainingCost: data?.trainingCost,
      employee: data?.employee,
      startDate: data?.startDate,
      endDate: data?.endDate,
      description: data?.description,
      database: userId?.database,
    };

    try {
      await _PostSave(Hrm_TrainGroup, payload);
      console.log(data);
      setSuccessAlert(true);
      history.push("/app/ajgroup/HRM/trainList");
      resetForm();
    } catch (error) {
      console.error(error);
      setErrorAlert(true);
    }
  };
  const validateForm = () => {
    return Object.values(data).every((value) => value.trim() !== "");
  };

  const resetForm = () => {
    setData({
      branch: "",
      trainer: "",
      trainingType: "",
      trainingCost: "",
      employee: [],
      startDate: "",
      endDate: "",
      description: "",
    });
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
      <Col sm="12" md="7" className="mx-auto">
    <Card >
      <CardHeader>
      
        <Row style={{width:'100%'}}>
          <Col md="6" lg="6" xl="6">
          <h2>Create Training</h2>
          </Col>
          <Col md="6" lg="6" xl="6">
          <Button color="danger" className="float-right " onClick={handleBack}>
          Back
        </Button>
          </Col>
          </Row>
        {successAlert && (
          <Alert color="success">Form submitted successfully!</Alert>
        )}
        {errorAlert && (
          <Alert color="danger">
            Please fill all fields before submitting the form.
          </Alert>
        )}
      </CardHeader>
      <CardBody >

      
        
            <Form onSubmit={handleSubmit}>
            <Row>
            <Col xl="6" lg="6" md="6">
            <FormGroup>
            <Label for="branch">Branch</Label>
            <Input
            style={{height:'51px',borderRadius:'10px'}}
              type="select"
              name="branch"
              id="branch"
              value={data?.branch}
              onChange={handleInputChange}>
              <option>Select Branch</option>
              {branches &&
                branches
                  .filter((branch) => branch?.name.trim() !== "")
                  .map((branch) => (
                    <option key={branch?._id} value={branch?._id}>
                      {branch?.name}
                    </option>
                  ))}
              {/* Add more branches */}
            </Input>
          </FormGroup>
            </Col>
            <Col xl="6" lg="6" md="6">
            <FormGroup>
            <Label for="trainer">Trainer</Label>
            <Input
            style={{height:'51px',borderRadius:'10px'}}
              type="select"
              name="trainer"
              id="trainer"
              value={data?.trainer}
              onChange={handleInputChange}>
              <option>Select Trainer</option>
              {TrainerList?.length > 0 &&
                TrainerList?.map((branch) => (
                  <option key={branch?._id} value={branch?._id}>
                    {branch?.firstName} {branch?.lastName}
                  </option>
                ))}
            </Input>
          </FormGroup>
            </Col>
            <Col xl="6" lg="6" md="6">
            <FormGroup>
                    <Label for="trainingType">Training Type</Label>
                    <Input
                      type="text"
                      name="trainingType"
                      id="trainingType"
                      value={data?.trainingType}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
            </Col>
            <Col xl="6" lg="6" md="6">
            <FormGroup>
            <Label for="trainingCost">Training Cost</Label>
            <Input
              type="text"
              name="trainingCost"
              id="trainingCost"
              value={data?.trainingCost}
              onChange={handleInputChange}
            />
          </FormGroup>
            </Col>
           
            <Col xl="6" lg="6" md="6">
            <FormGroup>
            <Label for="startDate">Start Date</Label>
            <Input
              type="date"
              name="startDate"
              id="startDate"
              value={data?.startDate}
              onChange={handleInputChange}
            />
          </FormGroup>
            </Col>
            <Col xl="6" lg="6" md="6">
            <FormGroup>
                    <Label for="endDate">End Date</Label>
                    <Input
                      type="date"
                      name="endDate"
                      id="endDate"
                      value={data?.endDate}
                      onChange={handleInputChange}
                    />
                  </FormGroup>

            </Col>
            <Col xl="6" lg="6" md="6">
            <FormGroup>
                <Label for="employee">Employee</Label>
                <Multiselect
                style={{height:'51px',borderRadius:'10px'}}
                  required
                  showCheckbox="true"
                  isObject="false"
                  options={HiredList} // Options to display in the dropdown
                  selectedValues={data?.employee} // Preselected value to persist in dropdown
                  onSelect={(selectedList, selectedItem) => {
                    setData({ ...data, employee: selectedList });
                  }} // Function will trigger on select event
                  onRemove={(selectedList, removedItem) => {
                    setData({ ...data, employee: selectedList });
                  }} // Function will trigger on remove event
                  displayValue="name" // Property name to display in the dropdown options
                />
              </FormGroup>
            </Col>
            <Col xl="6" lg="6" md="6">
            <FormGroup>
            <Label for="description">Description</Label>
            <Input
              type="textarea"
              name="description"
              id="description"
              value={data?.description}
              onChange={handleInputChange}
            />
          </FormGroup>
            </Col>
            </Row>           
             

              <FormGroup row>
                <Col className="text-center">
                  <Button color="primary" type="submit">
                    Submit
                  </Button>
                </Col>
              </FormGroup>
            </Form>
          
      </CardBody>
    </Card>
    </Col>
    </Row>

  );
};

export default TrainingForm;
