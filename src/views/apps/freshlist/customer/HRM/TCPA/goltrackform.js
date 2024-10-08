import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Card,
  CardBody,
  Table,
} from "reactstrap";

const GoalForm = () => {
  const [formData, setFormData] = useState({
    goalType: "",
    startDate: "",
    endDate: "",
    subject: "",
    targetAchievement: "",
    description: "",
  });

  const [submittedData, setSubmittedData] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
    setSubmittedData([...submittedData, formData]); // Add form data to submittedData array
    setFormData({
      goalType: "",
      startDate: "",
      endDate: "",
      subject: "",
      targetAchievement: "",
      description: "",
    });
  };

  return (
    <Card>
      <CardBody>
        <h1>Goal Track Form</h1>
        <Row>
          <Col md={6}>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="goalType">Goal Type</Label>
                <Input
                  type="text"
                  placeholder="Enter goal Type"
                  name="goalType"
                  id="goalType"
                  value={formData.goalType}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="startDate">Start Date</Label>
                <Input
                  type="date"
                  name="startDate"
                  id="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="endDate">End Date</Label>
                <Input
                  type="date"
                  name="endDate"
                  id="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </FormGroup>
              <Button type="submit" color="primary">
                Submit
              </Button>
            </Form>
          </Col>
          <Col md={6}>
            <Form>
              <FormGroup>
                <Label for="subject">Subject</Label>
                <Input
                  type="text"
                  placeholder="Enter subject"
                  name="subject"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="targetAchievement">Target Achievement</Label>
                <Input
                  type="text"
                  placeholder="Enter Target"
                  name="targetAchievement"
                  id="targetAchievement"
                  value={formData.targetAchievement}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="description">Description</Label>
                <Input
                  type="textarea"
                  name="description"
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </FormGroup>
            </Form>
          </Col>
        </Row>

        <Row>
          <Col>
            <Table striped>
              <thead>
                <tr>
                  <th>Goal Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Subject</th>
                  <th>Target Achievement</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {submittedData.map((data, index) => (
                  <tr key={index}>
                    <td>{data.goalType}</td>
                    <td>{data.startDate}</td>
                    <td>{data.endDate}</td>
                    <td>{data.subject}</td>
                    <td>{data.targetAchievement}</td>
                    <td>{data.description}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default GoalForm;
