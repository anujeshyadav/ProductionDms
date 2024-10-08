import React, { useState, useEffect } from 'react';
import { Card, CardBody, Row, Col, Form, FormGroup, Label, Input, Button, CardHeader } from 'reactstrap';
import { useParams, useHistory } from 'react-router-dom';
import { Hrm_OfferUpdate, Hrm_OfferViewone } from '../../../../../../ApiEndPoint/Api';
import { _Get, _Put } from '../../../../../../ApiEndPoint/ApiCalling';
const OfferViewlist = () => {
    const [data, setData] = useState({
        name: '',
        email: '',
        mobileNo: '',
    });
    // parameter's : name,email,mobileNo

    const { id } = useParams();
    const history = useHistory();

    useEffect(() => {
      _Get(Hrm_OfferViewone, id)
        .then((res) => {
          let data = res.OfferLetter;
          let value = {
            name: data?.name?.name,
            email: data?.email,
            mobileNo: data?.mobileNo,
          };

          setData(value);
        })
        .catch((err) => {
          console.log(err);
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await _Put(Hrm_OfferUpdate, id, data);

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
                <h2>Offer Letter Form</h2>
                <Button color=" btn btn-danger" type="button" onClick={handleBack}>
                    Back
                </Button>
            </CardHeader>
            <CardBody>
                <Form onSubmit={handleSubmit}>
                     <Row>
                     <Col lg="6" xl="6" md="6">
                    <FormGroup >
                        <Label for="candidateName" >
                            Candidate Name:
                        </Label>
                       
                            <Input
                                type="text"
                                name="name"
                                id="name"
                                readOnly
                                value={data.name}
                                onChange={handleInputChange}
                                placeholder="Enter Name"
                            />
                     
                    </FormGroup>
                    </Col>
                    <Col lg="6" xl="6" md="6">
                    <FormGroup >
                        <Label for="candidateEmail" >
                            Candidate Email:
                        </Label>
                     
                            <Input
                                readOnly
                                type="email"
                                name="email"
                                id="email"
                                value={data.email}
                                onChange={handleInputChange}
                                placeholder="Enter email"
                            />
                       
                    </FormGroup>
                    </Col>
                    <Col lg="6" xl="6" md="6">
                    <FormGroup >
                        <Label for="candidateNumber" >
                            Candidate Phone Number:
                        </Label>
                       
                            <Input
                                readOnly
                                type="number"
                                name="mobileNo"
                                id="mobileNo"
                                value={data.mobileNo}
                                onChange={handleInputChange}
                                placeholder="Enter Phone Number"
                            />
                     
                    </FormGroup>
                    </Col>
                    </Row>
                </Form>
            </CardBody>
        </Card>
        </Col>
        </Row>
        </>
    );
};
export default OfferViewlist;
