import React, { useState } from 'react';
import { Card, CardBody, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';

const TerminationForm = () => {
  const [formData, setFormData] = useState({
    employeeName: '',
    date: '',
    reason: '',
    description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Termination Form submitted:', formData);
    // Add logic to handle form submission (e.g., send data to backend, update employee status, etc.)
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Card>
      <CardBody>
        <h2>Termination Form</h2>
        <Form onSubmit={handleSubmit}>
          <FormGroup row>
            <Label for="employeeName" sm={4}>
              Employee Name:
            </Label>
            <Col sm={8}>
              <Input
                type="text"
                name="employeeName"
                id="employeeName"
                value={formData.employeeName}
                onChange={handleInputChange}
                placeholder="Enter Employee Name"
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="date" sm={4}>
              Date:
            </Label>
            <Col sm={8}>
              <Input
                type="date"
                name="date"
                id="date"
                value={formData.date}
                onChange={handleInputChange}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="reason" sm={4}>
              Reason:
            </Label>
            <Col sm={8}>
              <Input
                type="text"
                name="reason"
                id="reason"
                value={formData.reason}
                onChange={handleInputChange}
                placeholder="Enter Reason"
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="description" sm={4}>
              Description:
            </Label>
            <Col sm={8}>
              <Input
                type="textarea"
                name="description"
                id="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter Description "
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm={{ size: 8, offset: 4 }}>
              <Button color="primary" type="submit">
                Submit
              </Button>
            </Col>
          </FormGroup>
        </Form>
      </CardBody>
    </Card>
  );
};

export default TerminationForm;
