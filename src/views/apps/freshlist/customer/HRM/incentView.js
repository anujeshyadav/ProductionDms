import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Card,
  CardBody,
} from "reactstrap";
import { useParams, useHistory } from "react-router-dom";
import {
  CreateAccountList,
  _PostSave,
} from "../../../../../ApiEndPoint/ApiCalling";
import { Incentive_View_incentive_BYID } from "../../../../../ApiEndPoint/Api";
import { _Put, _Get } from "../../../../../ApiEndPoint/ApiCalling";

const Indicatform = () => {
  const [data, setData] = useState({
    employee: "",
    name: "",
    designation: "",
    attendance: "",
    target: "",
    collections: "",
    panCard: "",
  });
  const [ruleTitle, setRuleTitle] = useState("");
  const [title, setTitle] = useState("");
  const [ruleList, setRuleList] = useState([]);
  const [amountValue, setAmountValue] = useState("");
  const [targetassign, setTargetAssign] = useState("");
  const [targetAchievement, setTargetAchievement] = useState("");
  // const [employeeList, setEmployeeList] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [panCardNo, setPanCardNo] = useState("");
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await _Get(Incentive_View_incentive_BYID, id);
        //   {rule,employeeName,targetAchievement,title } = response?.Incentive.pancardNo;
        console.log(response.Incentive);
        setData(response?.Incentive);
        setEmployeeName(response?.Incentive?.employeeName.firstName);
        setTargetAchievement(response?.Incentive?.targetAchievement);
        setPanCardNo(response?.Incentive?.pancardNo);
        setRuleTitle(response?.Incentive?.rule?.rule);
        setTitle(response?.Incentive?.rule?.title);
        setTargetAssign(response?.Incentive?.targetAssign);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [id]);
  const resetForm = () => {
    setData({
      employee: "",
      name: "",
      designation: "",
      attendance: "",
      target: "",
      collections: "",
    });
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setData(prevData => ({
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
        
          <CardBody>
          <Row style={{width:'100%'}}>
        <Col lg="6" xl="6" md="6" xs="12">
        <h1>Indicator View Form</h1>
        </Col>
        <Col lg="6" xl="6" md="6" xs="12">
        <div className='float-right'>
        <Button className='float-right' color="danger" onClick={handleBack}>
            Back
          </Button>
        </div>
        </Col>
        </Row>
            <Form className="mt-2">
          
             
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="employeename">Employee Name:</Label>
                    <Input
                      type="text"
                      placeholder=" Enter Employee"
                      name="employeeName"
                      id="employeeName"
                      value={employeeName}
                      // onChange={e => setEmployeeName(e.target.value)}
                    >
                      {/* {employeeList &&
                        employeeList?.map(ele => (
                          <option value={ele?._id} key={ele?._id}>
                            {ele?.firstName}
                          </option>
                        ))} */}
                    </Input>
                  </FormGroup>
                </Col>

                <Col md={6}>
                  <FormGroup>
                    <Label for="ruleTitle">Role:</Label>
                    <Input
                      type="text"
                      placeholder="ruleTitle"
                      name="ruleTitle"
                      id="ruleTitle"
                      value={ruleTitle}
                      onChange={handleInputChange}
                    ></Input>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="title">Title:</Label>
                    <Input
                      type="text"
                      placeholder="title"
                      name="title"
                      id="title"
                      value={title}
                      onChange={handleInputChange}
                    ></Input>
                  </FormGroup>
                </Col>

                <Col md={6}>
                  <FormGroup>
                    <Label>PanCard No:</Label>
                    <Input
                      readOnly
                      type="text"
                      placeholder="pancard"
                      name="panCardNo"
                      id="panCardNo"
                      value={panCardNo}
                      // onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>

                {/* <Col md={6}>
                  <FormGroup>
                    <Label for="collections">Incentive Amount:</Label>
                    <Input
                      required
                      type="text"
                      placeholder="Collections"
                      name="collections"
                      id="collections"
                      value={data.collections}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col> */}
                <Col md={6}>
                  <FormGroup>
                    <Label for="target">Target Achievment:</Label>
                    <Input
                      required
                      type="number"
                      placeholder="targetAchievement"
                      name="targetAchievement"
                      id="targetAchievement"
                      value={targetAchievement}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="targetassign">Target Assingment:</Label>
                    <Input
                      readOnly
                      type="text"
                      placeholder="targetassign"
                      name="targetassign"
                      id="targetassign"
                      value={targetassign}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default Indicatform;
