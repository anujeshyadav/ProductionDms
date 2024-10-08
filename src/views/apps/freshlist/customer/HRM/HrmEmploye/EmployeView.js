

import React, { useEffect, useState } from 'react';
import { Card, CardBody, Row, Col, Form, FormGroup, Label, Input, Button, CardHeader } from 'reactstrap';
import { Hrm_SalaryViewone, Hrm_SalaryUpdate } from '../../../../../../ApiEndPoint/Api';
import { _Get, _Put } from '../../../../../../ApiEndPoint/ApiCalling';
import { useParams, useHistory } from "react-router-dom"
const EmployeViewForm = () => {
  const [data, setData] = useState({
    employeeName: '',
    // rule: '',
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    phone: '',
    city: '',
    country: '',
  });
  // parameter's : employeeName,rule,firstName,lastName,email,address,phone,city,country
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await _Get(Hrm_SalaryViewone, id);
        setData(response.Salary);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await _Put(Hrm_SalaryUpdate, id, data);

      resetForm();
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
    <Card>
      <CardHeader>
        <h2>Employee Profile Form</h2>

        <Button color=" btn btn-danger" type="button" onClick={handleBack}>
          Back
        </Button>
      </CardHeader>
      <CardBody>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="employeeName">Employee Name:</Label>
                <Input
                  readOnly
                  type="text"
                  name="employeeName"
                  id="employeeName"
                  value={data.employeeName}
                  onChange={handleInputChange}
                  placeholder="Enter employee name"
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="email">Email:</Label>
                <Input
                  readOnly
                  type="email"
                  name="email"
                  id="email"
                  value={data.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="firstName">First Name:</Label>
                <Input
                  readOnly
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={data.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="lastName">Last Name:</Label>
                <Input
                  readOnly
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={data.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="address">Address:</Label>
                <Input
                  readOnly
                  type="text"
                  name="address"
                  id="address"
                  value={data.address}
                  onChange={handleInputChange}
                  placeholder="Enter address"
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="phone">Phone.No:</Label>
                <Input
                  readOnly
                  type="tel"
                  name="phone"
                  id="phone"
                  value={data.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="city">City:</Label>
                <Input
                  readOnly
                  type="text"
                  name="city"
                  id="city"
                  value={data.city}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="country">Country:</Label>
                <Input
                  readOnly
                  type="text"
                  name="country"
                  id="country"
                  value={data.country}
                  onChange={handleInputChange}
                  placeholder="Enter country"
                />
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </CardBody>
    </Card>
  );
};

export default EmployeViewForm;


