import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  Card,
  CardBody,
  CardHeader,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from 'reactstrap';


const ExpenseForm = () => {
  const [data, setData] = useState({
    expenseDate: '',
    category: '',
    expenseFor: '',
    paymentType: '',
    account: '',
    amount: '',
    referenceNo: '',
    note: '',
  });

  

  const history = useHistory();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    resetForm();
        history.push('/app/ajgroup/HRM/expensesList');
    console.log('Form Data:', data);
  };

  const resetForm = () => {
    setData({
        expenseDate: '',
        category: '',
        expenseFor: '',
        paymentType: '',
        account: '',
        amount: '',
        referenceNo: '',
        note: '',
    });
  };

  const handleCancel = () => {
   
    history.goBack();
  };


  return (
    <Row>
      <Col sm="12" md="6" className="mx-auto">
        <Card>
          <CardHeader>
            <h2>Expense Form</h2>
          </CardHeader>
          <CardBody>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="expenseDate">Expense Date *</Label>
                    <Input
                      type="date"
                      name="expenseDate"
                      id="expenseDate"
                      value={data.expenseDate}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="category">Category *</Label>

                    <select
                      className="form-control"
                      name="category"
                      id="category"
                      value={data.category}
                      onChange={handleInputChange}
                      required>
                      <option value="">--Select--</option>
                      <option value="Office Expense">Office Expenses</option>
                      <option value="Other Expense">Other Expenses</option>
                    </select>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="expenseFor">Expense for *</Label>
                    <Input
                      type="text"
                      name="expenseFor"
                      id="expenseFor"
                      value={data.expenseFor}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="paymentType">Payment Type *</Label>
                    <select
                      className="form-control"
                      name="paymentType"
                      id="paymentType"
                      value={data.paymentType}
                      onChange={handleInputChange}
                      placeholder="--Select--"
                      required>
                      <option value="">--Select--</option>
                      <option value="Cash">Cash</option>
                      <option value="Cheque">Cheque</option>
                    </select>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="account">Account *</Label>
                    <select
                      className="form-control"
                      name="account"
                      id="account"
                      value={data.account}
                      onChange={handleInputChange}
                      required>
                      <option value="">None--</option>
                      <option value="Office Account"> --Office Account </option>
                      <option value="Expense Account">
                        {" "}
                        --Expense Account
                      </option>
                      <option value="Revenue Account">
                        {" "}
                        --Revenue Account
                      </option>
                      <option value="Asset Account"> --Asset Account</option>
                      <option value="Bank Account"> --Bank Account</option>
                      <option value="Cash"> --Cash</option>
                    </select>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="amount">Amount *</Label>
                    <Input
                      type="number"
                      name="amount"
                      id="amount"
                      value={data.amount}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="referenceNo">Reference No.</Label>
                    <Input
                      type="text"
                      name="referenceNo"
                      id="referenceNo"
                      value={data.referenceNo}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="note">Note</Label>
                    <Input
                      type="textarea"
                      name="note"
                      id="note"
                      value={data.note}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <Button color="primary" type="submit">
                    Save
                  </Button>
                  <Button
                    color="secondary"
                    className="ml-2"
                    onClick={handleCancel}>
                    Close
                  </Button>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default ExpenseForm;
