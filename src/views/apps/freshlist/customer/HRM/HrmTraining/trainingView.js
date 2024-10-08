import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, FormGroup, Label, Input, Button, CardBody, CardHeader } from 'reactstrap';
import { useParams, useHistory } from "react-router-dom"
import { Hrm_TrainViewOne, Hrm_TrainUpdate } from '../../../../../../ApiEndPoint/Api';
import { _Get, _Put } from '../../../../../../ApiEndPoint/ApiCalling';
import Multiselect from "multiselect-react-dropdown";

const TrainingViewForm = () => {
  const [data, setData] = useState({
    branch: "",
    trainer: "",
    trainingType: "",
    trainingCost: [],
    employee: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const { id } = useParams();
  const history = useHistory();
  useEffect(() => {
    _Get(Hrm_TrainViewOne, id)
      .then((response) => {
        let value = response.Training;
        let data = {
          branch: value?.branch?.name,
          trainer: value?.trainer?.firstName,
          trainingType: value?.trainingType,
          trainingCost: value?.trainingCost,
          employee: value?.employee,
          startDate: value?.startDate,
          endDate: value?.endDate,
          description: value?.description,
        };

        setData(data);
      })
      .then((err) => {
        console.log(err);
      });
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await _Put(Hrm_TrainUpdate, id, data);
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
    <Card>
      <CardHeader>
        <h2>Create Training</h2>
        <Button color=" btn btn-danger" type="button" onClick={handleBack}>
          Back
        </Button>
      </CardHeader>
      <CardBody>
       
            <Form onSubmit={handleSubmit}>
            <Row>
            <Col xl="6" lg="6" md="6">
            <FormGroup>
            <Label for="branch">Branch</Label>
            <Input
              readOnly
              type="text"
              name="branch"
              id="branch"
              value={data.branch}
            />
          </FormGroup>
            </Col>
            <Col xl="6" lg="6" md="6">
            <FormGroup>
            <Label for="trainer">Trainer</Label>
            <Input
              readOnly
              type="text"
              name="trainer"
              id="trainer"
              value={data.trainer}></Input>
          </FormGroup>
            </Col>
            <Col xl="6" lg="6" md="6">
            <FormGroup>
            <Label for="trainingType">Training Type</Label>
            <Input
              readOnly
              type="text"
              name="trainingType"
              id="trainingType"
              value={data.trainingType}
              // onChange={handleInputChange}
            />
          </FormGroup>
            </Col>
            <Col xl="6" lg="6" md="6">
            <FormGroup>
            <Label for="trainingCost">Training Cost</Label>
            <Input
              readOnly
              type="text"
              name="trainingCost"
              id="trainingCost"
              value={data.trainingCost}
              // onChange={handleInputChange}
            />
          </FormGroup>
            </Col>
            <Col xl="6" lg="6" md="6">
            <FormGroup>
                    <Label for="startDate">Start Date</Label>
                    <Input
                      readOnly
                      type="date"
                      name="startDate"
                      id="startDate"
                      value={data.startDate}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
            </Col>
            <Col xl="6" lg="6" md="6">
            <FormGroup>
            <Label for="endDate">End Date</Label>
            <Input
              readOnly
              type="date"
              name="endDate"
              id="endDate"
              value={data.endDate}
              onChange={handleInputChange}
            />
          </FormGroup>
            </Col>
            <Col xl="6" lg="6" md="6">
            <FormGroup>
                <Label for="employee">Employee</Label>
                <Multiselect
                  required
                  showCheckbox="true"
                  isObject="false"
                  // Options to display in the dropdown
                  selectedValues={data?.employee} // Preselected value to persist in dropdown
                  // onSelect={(selectedList, selectedItem) => {
                  //   setData({ ...data, employee: selectedList });
                  // }} // Function will trigger on select event
                  // onRemove={(selectedList, removedItem) => {
                  //   setData({ ...data, employee: selectedList });
                  // }} // Function will trigger on remove event
                  displayValue="name" // Property name to display in the dropdown options
                />
              </FormGroup>
            </Col>
            <Col xl="6" lg="6" md="6">
            <FormGroup>
                <Label for="description">Description</Label>
                <Input
                  readOnly
                  type="textarea"
                  name="description"
                  id="description"
                  value={data.description}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            </Row>
             
              
              
              {/* <Button type="submit" color="primary">Submit</Button> */}
            </Form>
         
      </CardBody>
    </Card>
    </Col>
    </Row>
    </>
  );
};

export default TrainingViewForm;







