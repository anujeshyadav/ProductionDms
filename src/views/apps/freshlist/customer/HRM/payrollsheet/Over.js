import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Col, Row } from 'reactstrap';

const Over = () => {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Title:', title);
        console.log('Amount:', amount);
    };

    return (
        <Row>
            <Col md={{ size: 6, offset: 3 }}>
                <h1>Over form</h1>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Col>
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
                        </Col>
                    </FormGroup>

                    <FormGroup>
                        <Label for="amountInput" >Amount</Label>
                        <Input
                            type="number"
                            name="amount"
                            placeholder='Enter Ammount'
                            id="amountInput"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </FormGroup>

                    <Button color="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </Col>
        </Row>
    );
};

export default Over;
