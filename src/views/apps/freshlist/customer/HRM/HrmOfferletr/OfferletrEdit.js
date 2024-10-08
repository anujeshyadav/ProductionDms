import React, { useState, useEffect } from 'react';
import { Card, CardBody, Row, Col, Form, FormGroup, Label, Input, Button, CardHeader } from 'reactstrap';
import { useParams, useHistory } from 'react-router-dom';
import { Hrm_OfferUpdate, Hrm_OfferViewone } from '../../../../../../ApiEndPoint/Api';
import { _Get, _Put } from '../../../../../../ApiEndPoint/ApiCalling';
const OfferEditlist = () => {
    const [data, setData] = useState({
      name: "",
      email: "",
      mobileNo: "",
      database: "",
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
      let userinfo = JSON.parse(localStorage.getItem("userData"));
      let payload = {
        // name: data?.name?.name,
        email: data?.email,
        mobileNo: data?.mobileNo,
        database: userinfo?.database,
      };
      try {
        await _Put(Hrm_OfferUpdate, id, payload);
        history.push("/app/ajgroup/HRM/offerList");
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
                  readOnly
                  type="text"
                  name="name"
                  id="name"
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
                  type="number"
                  name="mobileNo"
                  id="mobileNo"
                  value={data.mobileNo}
                  onChange={handleInputChange}
                  placeholder="Enter Phone Number"
                />
             
            </FormGroup>
</Col></Row>
            <FormGroup >
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
export default OfferEditlist;
