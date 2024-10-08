import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, FormGroup, Label, Input, Button, CardBody, CardHeader } from 'reactstrap';
import { useParams, useHistory } from "react-router-dom"
import {
  Hrm_TrainViewOne,
  Hrm_TrainUpdate,
  HRM_BRANCH_VIEW,
  Hrm_AppyList,
  Create_Account_List,
} from "../../../../../../ApiEndPoint/Api";
import { _Get, _Put } from "../../../../../../ApiEndPoint/ApiCalling";
import Multiselect from "multiselect-react-dropdown";

const TrainingEditForm = () => {
  const [branches, setBranches] = useState([]);
  const [TrainerList, setTrainerList] = useState([]);
  const [HiredList, setHiredList] = useState([]);
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
  const { id } = useParams();
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

    _Get(Hrm_TrainViewOne, id)
      .then((response) => {
        let Value = response.Training;
        let payload = {
          branch: Value?.branch?._id,
          trainer: Value?.trainer?._id,
          trainingType: Value?.trainingType,
          trainingCost: Value?.trainingCost,
          employee: Value?.employee,
          startDate: Value?.startDate,
          endDate: Value?.endDate,
          description: Value?.description,
        };
        setData(payload);
        console.log(response);
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
      await _Put(Hrm_TrainUpdate, id, payload);
      history.push("/app/ajgroup/HRM/trainList");
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
    <>
    <Row>
    <Col sm="12" md="7" className="mx-auto">
    <Card >
      <CardHeader>
        <h2>Create Training</h2>
        <Button color=" btn btn-danger" type="button" onClick={handleBack}>
          Back
        </Button>
      </CardHeader>
      <CardBody >

      
            <Form onSubmit={handleSubmit}>
            <Row>
            <Col lg="6" xl="6" md="6">
            <FormGroup>
                <Label for="branch">Branch</Label>
                <Input
                  type="select"
                  style={{height:'51px',borderRadius:'10px'}}
                  name="branch"
                  id="branch"
                  value={data.branch}
                  onChange={(e) => setBranch(e.target.value)}>
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
            <Col lg="6" xl="6" md="6">
            <FormGroup>
                    <Label for="trainer">Trainer</Label>
                    <Input
                      type="select"
                      style={{height:'51px',borderRadius:'10px'}}
                      name="trainer"
                      id="trainer"
                      value={data.trainer}
                      onChange={(e) => setTrainer(e.target.value)}>
                      <option>Select Trainer</option>
                      {TrainerList?.length > 0 &&
                        TrainerList?.map((branch) => (
                          <option key={branch?._id} value={branch?._id}>
                            {branch?.firstName} {branch?.lastName}
                          </option>
                        ))}
                      {/* Add more trainers */}
                    </Input>
                  </FormGroup>
               
            </Col>
            <Col lg="6" xl="6" md="6">
            <FormGroup>
                    <Label for="trainingType">Training Type</Label>
                    <Input
                      type="text"
                      name="trainingType"
                      id="trainingType"
                      value={data.trainingType}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
            </Col>
            <Col lg="6" xl="6" md="6">
            <FormGroup>
                <Label for="trainingCost">Training Cost</Label>
                <Input
                  type="text"
                  name="trainingCost"
                  id="trainingCost"
                  value={data.trainingCost}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            
            <Col lg="6" xl="6" md="6">
            <FormGroup>
            <Label for="startDate">Start Date</Label>
            <Input
              type="date"
              name="startDate"
              id="startDate"
              value={data.startDate}
              onChange={handleInputChange}
            />
          </FormGroup>
            </Col>
            <Col lg="6" xl="6" md="6">
            <FormGroup>
                    <Label for="endDate">End Date</Label>
                    <Input
                      type="date"
                      name="endDate"
                      id="endDate"
                      value={data.endDate}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
            </Col>
            <Col lg="6" xl="6" md="6">
            <FormGroup>
            <Label for="employee">Employee</Label>
            <Multiselect
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
            <Col lg="6" xl="6" md="6">
            <FormGroup>
                <Label for="description">Description</Label>
                <Input
                  type="textarea"
                  name="description"
                  id="description"
                  value={data.description}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            </Row>
             
              
              <FormGroup row>
                <Col className='text-center'>
                  <Button color="primary" type="submit">
                    Update
                  </Button>
                </Col>
              </FormGroup>
            </Form>
        
      </CardBody>
    </Card>
    </Col>
    </Row>
    </>

  );
};

export default TrainingEditForm;







