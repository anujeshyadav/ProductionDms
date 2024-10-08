import React, { useState, useEffect } from 'react';
import { Row, Col, Form, FormGroup, Label, Input, Button, Card, CardBody ,CardHeader } from 'reactstrap';
import { useParams, useHistory } from 'react-router-dom';
import { _Put,_Get} from '../../../../../../ApiEndPoint/ApiCalling';
import {HRM_UPDATE_INDICATOR,HRM_INDICATOR_BY_ID  } from '../../../../../../ApiEndPoint/Api';

const ViewIndicatform = () => {
  const [data, setData] = useState({
    employeeName: "",
    rule: "",
    attendance: "",
    collectionRating: "",
    targetRating: "",
    database: "",
  });

  const { id } = useParams();
  const history = useHistory();
  console.log(id);

  useEffect(() => {
    _Get(HRM_INDICATOR_BY_ID, id)
      .then((response) => {
        console.log(response);
        let data = response?.Indicator;
        let Mydata = {
          employeeName: data?.employeeName?.firstName,
          rule: data?.rule,
          attendance: data?.attendance,
          collectionRating: data?.collectionRating,
          targetRating: data?.targetRating,
        };
        setData(Mydata);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
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
            <Form>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="employee">Employee:</Label>
                    <Input
                      readOnly
                      type="text"
                      placeholder="Employee"
                      name="employeeName"
                      id="employeeName"
                      value={data.employeeName}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="name">Rule:</Label>
                    <Input
                      readOnly
                      type="text"
                      placeholder="Name"
                      name="rule"
                      id="rule"
                      value={data.rule}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="designation">Attendance Rating:</Label>
                    <Input
                      readOnly
                      type="text"
                      placeholder="Designation"
                      name="attendance"
                      id="attendance"
                      value={data.attendance}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="department">collection Rating:</Label>
                    <Input
                      readOnly
                      type="text"
                      placeholder="Department"
                      name="collectionRating"
                      id="collectionRating"
                      value={data.collectionRating}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="attendance">Target Rating:</Label>
                    <Input
                      readOnly
                      type="text"
                      placeholder="Attendance"
                      name="targetRating"
                      id="targetRating"
                      value={data.targetRating}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
                {/* <Col md={6}>
                  <FormGroup>
                    <Label for="target">Target:</Label>
                    <Input
                      readOnly
                      type="text"
                      placeholder="Target"
                      name="target"
                      id="target"
                      value={data.target}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col> */}
              </Row>
              {/* <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="collections">Collections:</Label>
                    <Input
                      readOnly
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
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default ViewIndicatform;




