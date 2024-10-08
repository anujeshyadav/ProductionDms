import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import {
  Bonus_UpdateBy_Id,
  Bonus_ViewBy_Id,
  HRMRULE_SAVE_BONUS,
  VIEW_RULE_CREATION,
} from "../../../../../../ApiEndPoint/Api";
import { _Get, _Put } from "../../../../../../ApiEndPoint/ApiCalling";
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";

const BonusForm = () => {
  const history = useHistory();
  const [data, setData] = useState({
    type: "",
    months: "",
    database: "",
    years: "",
    userName: "",
    year: "",
    employees: [],
    selectAllemployees: false,
  });
  let Params = useParams();
  const [typeList, setTypeList] = useState([]);
  const [Loading, setLoading] = useState(false);

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("userData"));

    _Get(Bonus_ViewBy_Id, Params.id)
      .then((res) => {
        let Bonus = res?.Bonus;
        let payload = {
          type: Bonus?.type,
          months: Bonus?.months,
          userName: Bonus?.userName,
          years: Bonus?.years,
          database: user?.database,
          userId: Params.id,
        };
        setData(payload);
      })
      .catch((err) => {
        console.log(err);
      });

    _Get(VIEW_RULE_CREATION, user.database)
      .then((res) => {
        console.log(res.Rule);
        if (res.Rule) {
          setTypeList(res.Rule);
        }
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSubmit = async (e) => {
    setLoading(true);
    let user = JSON.parse(localStorage.getItem("userData"));

    e.preventDefault();
    const payload = {
      type: data.type,
      months: data.months,
      userName: data?.userName,
      years: Number(data.years),
      year: Number(data.years),
      database: user.database,
    };
    await _Put(Bonus_UpdateBy_Id, data?.userId, payload)
      .then((res) => {
        setLoading(false);

        console.log(res);
        history.goBack();
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <Row>
      <Col sm="12" md="6" className="mx-auto">
        <Card>
          <CardHeader>
            <h3>Edit Bonus Form</h3>
            <Button
              color="danger"
              className="ml-2"
              onClick={() => history.goBack()}>
              Back
            </Button>
          </CardHeader>
          <CardBody>
            <Form onSubmit={handleSubmit}>
            <Row>
            <Col lg="6" xl="6" md="6">
            
           

              <FormGroup >
                <Label for="type">
                  Bonus Type:
                </Label>
               
                  <Input
                    type="select"
                    style={{height:'51px',borderRadius:'10px'}}
                    name="type"
                    id="leaveType"
                    value={data.type}
                    onChange={handleInputChange}
                    required>
                    <option value="">Select Bonus type</option>
                    {typeList?.map((ele) => (
                      <option value={ele?.title}>{ele?.title}</option>
                    ))}
                  </Input>
               
              </FormGroup>
</Col>  <Col lg="6" xl="6" md="6">
              <FormGroup >
                <Label for="type" >
                  Employee Name:
                </Label>
               
                  <Input
                    readOnly
                    type="text"
                    name="userName"
                    id="userName"
                    value={data.userName}
                    // onChange={handleInputChange}
                  ></Input>
               
              </FormGroup>
              </Col>  <Col lg="6" xl="6" md="6">
              <FormGroup >
                <Label for="months" >
                  Bonus Month:
                </Label>
                
                  <Input
                    type="select"
                    style={{height:'51px',borderRadius:'10px'}}
                    name="months"
                    id="months"
                    value={data.months}
                    onChange={handleInputChange}
                    required>
                    <option value="0">Select bonus month</option>
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </Input>
              
              </FormGroup>
              </Col>  <Col lg="6" xl="6" md="6">
              <FormGroup >
                <Label for="months" >
                  Bonus Year:
                </Label>

              
                  <Input
                  
                    required
                    maxLength={4}
                    minLength={4}
                    type="number"
                    name="years"
                    id="years"
                    value={data.years}
                    onChange={handleInputChange}></Input>
            
              </FormGroup>
              </Col>
              </Row>
              {!Loading && !Loading ? (
                <FormGroup row>
                  <Col className="text-center">
                    <Button color="primary" type="submit">
                    Update
                    </Button>{" "}
                  </Col>
                </FormGroup>
              ) : (
                "Loading..."
              )}
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default BonusForm;
