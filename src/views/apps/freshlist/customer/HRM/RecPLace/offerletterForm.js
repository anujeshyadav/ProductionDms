import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
} from "reactstrap";
import {
  Hrm_offerGroup,
  Hrm_InterviewList,
} from "../../../../../../ApiEndPoint/Api";
import {
  _PostSave,
  _Get,
  _GetList,
} from "../../../../../../ApiEndPoint/ApiCalling";
import { useHistory } from "react-router-dom";

const OfferLetterForm = () => {
  const [offerList, setOfferList] = useState([]);

  const [data, setData] = useState({
    name: "",
    email: "",
    mobileNo: "",
    database: "",
  });
  // parameter's : name,email,mobileNo
  const history = useHistory();
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);

  useEffect(() => {
    let userinfor = JSON.parse(localStorage.getItem("userData"));
    setData({ ...data, database: userinfor.database });
    function fetchData() {
      _Get(Hrm_InterviewList, userinfor?.database, userinfor?._id)
        .then((res) => {
          setOfferList(res?.Interview);
          console.log(res?.Interview);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await _PostSave(Hrm_offerGroup, data);
        setSuccessAlert(true);
        resetForm();
        history.push("/app/ajgroup/HRM/offerList");
      } catch (error) {
        console.log(error);
        setErrorAlert(true);
      }
    } else {
      setErrorAlert(true);
    }
  };

  const resetForm = () => {
    setData({
      name: "",
      email: "",
      mobileNo: "",
    });
  };

  const validateForm = () => {
    return Object.values(data).every((value) => value.trim() !== "");
  };
  const handleBack = () => {
    history.goBack();
  };
  return (
    <Row>
      <Col sm="12" md="7" className="mx-auto">
        <Card>
          <CardBody>
          <Row style={{width:'100%'}}>
          <Col md="6" lg="6" xl="6">
          <h2>Offer Letter Form</h2>
          </Col>
          <Col md="6" lg="6" xl="6">
          <Button color="danger" className="float-right " onClick={handleBack}>
          Back
        </Button>
          </Col>
          </Row>
         
            {successAlert && (
              <Alert color="success">Form submitted successfully!</Alert>
            )}
            {errorAlert && (
              <Alert color="danger">
                Please fill all fields before submitting the form.
              </Alert>
            )}
            <Form onSubmit={handleSubmit}>
            <Row className="mt-3">
            <Col lg="6" xl="6" md="6">
            <FormGroup >
                <Label for="candidateName" >
                  Candidate Name:
                </Label>
               
                  <Input
                    type="select"
                    style={{height:'51px',borderRadius:'10px'}}
                    name="name"
                    id="name"
                    value={data.name}
                    onChange={handleInputChange}
                    placeholder="Enter Name">
                    <option value="">Select Name</option>
                    {offerList &&
                      offerList?.map((OfferLetter) => (
                        <option
                          key={OfferLetter?._id}
                          value={OfferLetter?.candidateName?._id}>
                          {OfferLetter?.candidateName?.name}
                        </option>
                      ))}
                  </Input>
               
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
            </Col>
            </Row>
              

             
              

              <FormGroup >
                <Col className="text-center">
                  <Button color="primary" type="submit">
                    Submit
                  </Button>
                </Col>
              </FormGroup>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};
export default OfferLetterForm;
