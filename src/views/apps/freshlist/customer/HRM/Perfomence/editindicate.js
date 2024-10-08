import React, { useState, useEffect } from 'react';
import { Row, Col, Form, FormGroup, Label, Input, Button, Card, CardBody ,CardHeader } from 'reactstrap';
import { useParams, useHistory } from 'react-router-dom';
import {
  _Put,
  _Get,
  CreateAccountList,
} from "../../../../../../ApiEndPoint/ApiCalling";
import {
  HRM_UPDATE_INDICATOR,
  HRM_INDICATOR_BY_ID,
} from "../../../../../../ApiEndPoint/Api";

const EditIndicatform = () => {
  const [SelectedRules, setSelectedRules] = useState({});
  const [employeeList, setEmployeeList] = useState([]);
  const [data, setData] = useState({
    employeeName: "",
    rule: "",
    attendance: "",
    collectionRating: "",
    targetRating: "",
  });

  const { id } = useParams();
  const history = useHistory();
  // console.log(id);

  useEffect(() => {
    let userId = JSON.parse(localStorage.getItem("userData"));

    _Get(HRM_INDICATOR_BY_ID, id)
      .then((response) => {
        let data = response?.Indicator;
        let Mydata = {
          employeeName: data?.employeeName?._id,
          rule: data?.rule?._id,
          attendance: data?.attendance,
          collectionRating: data?.collectionRating,
          targetRating: data?.targetRating,
          database: data?.database,
        };
        setData(Mydata);
        CreateAccountList(userId?._id, userId?.database)
          .then((res) => {
            let value = res?.adminDetails;
            setEmployeeList(value);
            let selected = res?.adminDetails?.filter(
              (ele) => ele?._id == Mydata?.employeeName
            );

            setSelectedRules(selected[0]);
            console.log(value);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  // useEffect(() => {
  //   function fetchData() {}

  //   fetchData();
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await _Put(HRM_UPDATE_INDICATOR, id, data);
      swal("success", "Updated Successfully");
      history.push("/app/ajgroup/HRM/indicatList");
    } catch (error) {
      console.log(error);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // setData({ ...data, [name]: value });
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBack = () => {
    history.goBack();
  };

  return (
    <Row>
      <Col sm="12" md="7" className="mx-auto">
        <Card>
          <CardHeader>
            <h1>Indicator Edit Form</h1>
            <Button color="danger" onClick={handleBack}>
              Back
            </Button>
          </CardHeader>
          <CardBody>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="employeename">Employee Name:</Label>
                    <Input
                      type="select"
                      placeholder=" Enter Employee"
                      name="employeeName"
                      id="employeeName"
                      value={data.employeeName}
                      onChange={(e) => {
                        console.log(employeeList);
                        let selected = employeeList?.filter(
                          (ele) => ele?._id == e.target.value
                        );

                        setSelectedRules(selected[0]);

                        setData({ ...data, ["employeeName"]: e.target.value });
                      }}>
                      <option value="">Select Employee</option>
                      {employeeList &&
                        employeeList?.map((ele) => (
                          <option value={ele?._id} key={ele?._id}>
                            {ele?.firstName}
                          </option>
                        ))}
                    </Input>
                  </FormGroup>
                </Col>

                <Col md={6}>
                  <FormGroup>
                    <Label for="role">Rule:</Label>
                    <Input
                      required
                      type="select"
                      placeholder="Name"
                      name="rule"
                      id="rule"
                      value={data.rule}
                      onChange={handleInputChange}>
                      <option value="">Select Rule</option>
                      {SelectedRules?.setRule?.length > 0 &&
                        SelectedRules?.setRule?.map((ele) => (
                          <option value={ele?._id} key={ele?._id}>
                            {ele?.rule}
                          </option>
                        ))}
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="attendance">Attendance Rating:</Label>
                    <Input
                      required
                      type="number"
                      placeholder="Attendance"
                      name="attendance"
                      id="attendance"
                      value={data.attendance}
                      onChange={(e) => {
                        setData({
                          ...data,
                          ["attendance"]: e.target.value,
                        });
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="collections">
                      Collection Rating(1 to 5) *:
                    </Label>
                    <Input
                      required
                      type="text"
                      placeholder=" between 1 to 5"
                      name="collectionRating"
                      // pattern="[1-5]*" // Only allows input matching the pattern 1-5
                      // maxLength={3}
                      id="collectionRating"
                      value={data?.collectionRating}
                      onChange={(e) => {
                        const inputValue = e.target.value;

                        if (
                          /^\d*\.?\d*$/.test(inputValue) &&
                          inputValue >= 1 &&
                          inputValue <= 5
                        ) {
                          setData({
                            ...data,
                            ["collectionRating"]: inputValue,
                          });
                        }
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="target">Target Rating:</Label>
                    <Input
                      required
                      type="text"
                      // pattern="[1-5]*" // Only allows input matching the pattern 1-5
                      // maxLength={3}
                      placeholder=" between 1 to 5"
                      name="targetRating"
                      id="targetRating"
                      value={data.targetRating}
                      onChange={(e) => {
                        const inputValue = e.target.value;

                        if (
                          /^\d*\.?\d*$/.test(inputValue) &&
                          inputValue >= 1 &&
                          inputValue <= 5
                        ) {
                          setData({
                            ...data,
                            ["targetRating"]: inputValue,
                          });
                        }
                      }}
                    />
                  </FormGroup>
                </Col>
              </Row>
              {/* <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="attendance">Attendance:</Label>
                    <Input
                      type="text"
                      placeholder="Attendance"
                      name="attendance"
                      id="attendance"
                      value={data.attendance}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="target">Target:</Label>
                    <Input
                      type="text"
                      placeholder="Target"
                      name="target"
                      id="target"
                      value={data.target}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="collections">Collections:</Label>
                    <Input
                      type="text"
                      placeholder="Collections"
                      name="collections"
                      id="collections"
                      value={data.collections}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
              </Row> */}
              <FormGroup row>
                <Col sm={{ size: 10, offset: 10 }}>
                  <Button.Ripple color="primary" type="submit" className="mt-2">
                    Update
                  </Button.Ripple>
                </Col>
              </FormGroup>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default EditIndicatform;




