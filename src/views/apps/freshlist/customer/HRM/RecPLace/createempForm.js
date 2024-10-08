import React, { useState,useEffect } from 'react';
import { Card, CardBody, Row, Col, Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import { Hrm_SalaryGroup } from '../../../../../../ApiEndPoint/Api';
import { _PostSave , _GetList,_BulkUpload} from '../../../../../../ApiEndPoint/ApiCalling';
import { useHistory } from 'react-router-dom';
import { country_state_City_List } from '../../../../../../ApiEndPoint/Api';
import { Bulk_Upload_User } from '../../../../../../ApiEndPoint/Api';

const EmployeeProfileForm = () => {
  const [data, setData] = useState({
    employeeName: '',
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    phone: '',
    city: '',
    country: '',
    Pincode: '', 
    District: '', 
    StateName: '',
    rule:'',
    salary:'',
  });
  

  const history = useHistory();
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);

  const [BulkImport, setBulkImport] = useState(null);

  const [Country_State_city, setCountry_State_city] = useState([]);


  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (BulkImport !== null || BulkImport != undefined) {
      let data = new FormData();
      data.append("file", BulkImport);

      await _BulkUpload(Bulk_Upload_User,data)
        .then((res) => {
         (`${res?.message}`);
         console.log(BulkImport);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (validateForm()) {
      try {
        await _PostSave(Hrm_SalaryGroup, data);
        setSuccessAlert(true);
        resetForm();
        history.push('/app/ajgroup/HRM/empList');
      }
      catch (error) {
        console.log(error);
        setErrorAlert(true);
      }
    } else {
      setErrorAlert(true);
    }
  };

  const validateForm = () => {
    return Object.values(data).every((value) => value.trim() !== '');
  };

  const resetForm = () => {
    setData({
      employeeName: '',
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      phone: '',
      city: '',
      country: '',
      Pincode: '',  
      District: '', 
      StateName: '',
      rule:'',
    salary:'',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  // const handleInputChange = (e, type, i) => {
  //   const { name, value, checked } = e.target;
  //   setindex(i);
  //   if (type == "checkbox") {
  //     if (checked) {
  //       setData({
  //         ...data,
  //         [name]: checked,
  //       });
  //     } else {
  //       setData({
  //         ...data,
  //         [name]: checked,
  //       });
  //     }
  //   } else {
  //     if (type == "number") {
  //       if (/^\d{0,10}$/.test(value)) {
  //         setData({
  //           ...data,
  //           [name]: value,
  //         });
  //         setError("");
  //       } else {
  //         setError(
  //           "Please enter a valid number with a maximum length of 10 digits"
  //         );
  //       }
  //     } else {
  //       if (value.length <= 10) {
  //         setData({
  //           ...data,
  //           [name]: value,
  //         });
  //         // console.log(value);
  //         setError("");
  //       } else {
  //         setData({
  //           ...data,
  //           [name]: value,
  //         });
  //         // setError("Input length exceeds the maximum of 10 characters");
  //       }
  //     }
  //   }
  // };

  useEffect(() => {
    
    _GetList(country_state_City_List)
      .then((res) => {
        setCountry_State_city(res);
      })
      .catch((err) => {
        console.log(err);
      });
  
    if (data.Pincode.trim() !== '') {
    }
  }, [data.Pincode]);


  // const fetchLocationDetails = async () => {
  //   try {
  //     // const response = await fetch(`API_ENDPOINT_TO_GET_LOCATION_DETAILS?Pincode=${data.Pincode}`);
  //     const res = await _GetList(country_state_City_List, data.Pincode);
  //       setCountry_State_city(res);
  //       console.log(res);
      
  //     if (res && res.success) {
  //       setData({
  //         ...data,
  //         District: result.District,
  //         StateName: result.StateName,
  //       });
  //     }
  //   } catch (error) {
  //     console.error('Error fetching location details:', error);
  //   }
  // };
  // useEffect(() => {
  //   if (data.Pincode.trim() !== '') {
  //     fetchLocationDetails();
  //   }
  // }, [data.Pincode]);


  return (
    <Row>
      <Col sm="12" md="6" className="mx-auto">
        <Card>
          <CardBody>
            {successAlert && (
              <Alert color="success">Form submitted successfully!</Alert>
            )}
            {errorAlert && (
              <Alert color="danger">
                Please fill all fields before submitting the .
              </Alert>
            )}
            <h2>Employee Profile Form</h2>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="employeeName">Employee Name:</Label>
                    <Input
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
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="setsalary">Set Salary: </Label>
                    <Input
                      type="select"
                      name="setsalary"
                      id="setsalary"
                      value={data.salary}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="setrules">Set Rules:</Label>
                    <Input
                      type="select"
                      name="setrules"
                      id="setrules"
                      value={data.rule}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="Pincode">Pin Code:</Label>
                    <Input
                      type="number"
                      name="Pincode"
                      id="Pincode"
                      value={data.Pincode}
                      placeholder="Enter pin code"
                      onChange={(e) => {
                        const enteredPincode = e.target.value;
                        setData((prevData) => ({
                          ...prevData,
                          Pincode: enteredPincode,
                        }));

                        let selectedCity = Country_State_city?.filter(
                          (city) => city?.Pincode === enteredPincode
                        );

                        if (selectedCity?.length) {
                          setData((prevData) => ({
                            ...prevData,

                            District: selectedCity[0]?.District,
                            StateName: selectedCity[0]?.StateName,
                          }));
                        }
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="District">District:</Label>
                    <Input
                      type="text"
                      name="District"
                      id="District"
                      value={data.District}
                      readOnly
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="StateName">State:</Label>
                    <Input
                      type="text"
                      name="StateName"
                      id="StateName"
                      value={data.StateName}
                      readOnly
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col lg="12" md="12" sm="12">
                  <Label>OR</Label>
                </Col>
                <Col lg="6" md="6" sm="12">
                  <FormGroup>
                    <Label>Bulk Import</Label>

                    <Input
                      className="-control"
                      type="file"
                      placeholder=""
                      name="BulkImport"
                      onChange={(e) => {
                        setBulkImport(e.target.files[0]);
                      }}
                    />
                  </FormGroup>
                </Col>
              </Row>

              <FormGroup row>
                <Col sm={{ size: 8, offset: 4 }}>
                  <Button color="primary" type="submit">
                    Create Employee Profile
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

export default EmployeeProfileForm;

