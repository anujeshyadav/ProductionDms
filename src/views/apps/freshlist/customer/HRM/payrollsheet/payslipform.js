
import React, { useState } from 'react';
import { Button, Card, CardBody, Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';

const Payslip = () => {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('Title:', title);
        console.log('Amount:', amount);
    };

    return (
        <Card>
            <CardBody>
                <Row>
                    <Col sm='12' md={{ size: 6, offset: 3 }}>
                        <Form onSubmit={handleSubmit}>
                            <h1>Pay Slip Form</h1>
                            <FormGroup>
                                <Label for="titleDropdown">Title</Label>
                                <Input
                                    type="select"
                                    name="title"
                                    id="titleDropdown"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                >
                                    <option value="">Select</option>
                                    <option value="Option 1">Option 1</option>
                                    <option value="Option 2">Option 2</option>
                                    {/* Add more options as needed */}
                                </Input>
                            </FormGroup>

                            <FormGroup>
                                <Label for="amountInput">Amount</Label>
                                <Input
                                    type="number"
                                    name="amount"
                                    id="amountInput"
                                    value={amount}
                                    placeholder='Enter Amount'
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </FormGroup>

                            <Button color="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
};

export default Payslip;

