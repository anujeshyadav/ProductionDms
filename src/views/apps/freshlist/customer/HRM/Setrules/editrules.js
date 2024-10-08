import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  CardHeader,
} from "reactstrap";
import { _Put, _Get } from "../../../../../../ApiEndPoint/ApiCalling";
import { useHistory, useParams } from "react-router-dom";
import {
  VIEW_RULE_CREATION_BYID,
  UPDATE_RULE_CREATION,
} from "../../../../../../ApiEndPoint/Api";

const EditRules = () => {
  const [rule, setRule] = useState("");
  const [type, setType] = useState("");
  const [ruleType, setRuleType] = useState("");
  const [typeValue, setTypeValue] = useState("");
  const [ruleTypeValue, setRuleTypeValue] = useState("");
  const [period, setPeriod] = useState("");
  const [title, setTitle] = useState("");

  const [payload, setPayload] = useState({
    rule,
    type,
    ruleType,
    typeValue,
    ruleTypeValue,
    period,
    title,
  });

  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await _Get(VIEW_RULE_CREATION_BYID, id);
        console.log(response);
        setPayload(response?.Rule);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  // const handleSubmit = async (e) => {
  //     e.preventDefault();

  //     try {
  //         await _Put(UPDATE_RULE_CREATION, id, payload);

  //         history.push('/app/ajgroup/HRM/ruleList');

  //       } catch (error) {
  //         console.log(error);
  //       }
  //     console.log('Rules:', payload);

  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await _Put(UPDATE_RULE_CREATION, id, {
        rule,
        type,
        ruleType,
        typeValue,
        ruleTypeValue,
        period,
        title,
      });
      history.push("/app/ajgroup/HRM/ruleList");
    } catch (error) {
      console.log(error);
    }
    console.log("Rules:", payload);
  };

  const handleTitleChange = (e) => {
    if (title !== e.target.value) {
      setTitle("");
    }
    setTitle(e.target.value);
  };

  const handleRuleChange = (newRule) => {
    setRule(newRule);
    setTitle("");
    setType("");
    setRuleType("");
    setTypeValue("");
    setPeriod("");
    setRuleTypeValue;
  };

  const renderRuleSpecificFields = () => {
    if (rule === "ALLOWANCE") {
      return (
        <>
          <FormGroup>
            <Label for="ruleType">Distance</Label>
            <Input
              type="text"
              name="ruleType"
              id="ruleType"
              value={ruleType}
              placeholder="Enter Distance"
              onChange={(e) => setRuleType(e.target.value)}
            />
          </FormGroup>
        </>
      );
    }

    if (rule === "INCENTIVE") {
      return (
        <>
          <FormGroup>
            <Label for="targetType">Target Percentage</Label>
            <Input
              type="number"
              name="ruleType"
              id="ruleType"
              value={ruleType}
              placeholder="Enter Target Percentage"
              onChange={(e) => setRuleType(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="ValueInput"> Target Value</Label>
            <Input
              type="number"
              name="ruleTypeValue"
              id="ruleTypeValue"
              value={ruleTypeValue}
              placeholder="Enter Value"
              onChange={(e) => setRuleTypeValue(e.target.value)}
            />
          </FormGroup>
        </>
      );
    }

    if (rule === "LOAN") {
      return (
        <>
          <FormGroup>
            <Label for="loanType">Loan Amount</Label>
            <Input
              type="number"
              name="ruleType"
              id="ruleType"
              value={ruleType}
              placeholder="Enter Loan Amount"
              onChange={(e) => setRuleType(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="durationTimedrop">Time Period</Label>
            <Input
              type="select"
              name="ruleTypeValue"
              id="ruleTypeValue"
              value={ruleTypeValue}
              onChange={(e) => setRuleTypeValue(e.target.value)}
            >
              <option value="">Select</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </Input>
          </FormGroup>
        </>
      );
    }

    if (rule === "BONUS") {
      return (
        <>
          <FormGroup>
            <Label for="bonusType">Bonus Amount</Label>
            <Input
              type="number"
              name="ruleType"
              id="ruleType"
              value={ruleType}
              placeholder="Enter Bonus Amount"
              onChange={(e) => setRuleType(e.target.value)}
            />
          </FormGroup>
        </>
      );
    }

    if (["ACTUAL (BILL)", "PF", "OVERTIME", "ADVANCE", "EMI"].includes(rule)) {
      return <></>;
    }

    return null;
  };

  const handleBack = () => {
    history.goBack();
  };

  return (
    <Row>
      <Col sm="12" md="6" className="mx-auto">
        <Card>
          <CardHeader>
            <h1>Edit Set Rules</h1>
            <Button color="danger" onClick={handleBack}>
              Back
            </Button>
          </CardHeader>
          <CardBody>
            <Form onSubmit={handleSubmit}>
               <Row>
               <Col lg="6" xl="6" md="6">
               
               
              <FormGroup>
                <Label for="ruleDropdown">Rule</Label>
                <Input
                style={{height:'51px',borderRadius:'10px'}}
                  type="select"
                  name="Rule"
                  id="ruleDropdown"
                  value={payload?.rule}
                  // onChange={(e) => handleRuleChange(e.target.value)}
                  onChange={({ target: { value } }) =>
                    setPayload("rule", "newRule", value)
                  }
                >
                  <option value="">--Select--</option>
                  <option value="ALLOWANCE">ALLOWANCE</option>
                  <option value="INCENTIVE">INCENTIVE</option>
                  <option value="LOAN">LOAN</option>
                  <option value="BONUS">BONUS</option>
                  <option value="ACTUAL (BILL)">ACTUAL (BILL)</option>
                  <option value="PF">PF</option>
                  <option value="OVERTIME">OVERTIME</option>
                  <option value="ADVANCE">ADVANCE</option>
                  <option value="EMI">EMI</option>
                </Input>
              </FormGroup>
</Col> <Col lg="6" xl="6" md="6">
              <FormGroup>
                <Label for="title">Title</Label>
                <Input
                  type="text"
                  name="title"
                  id="title"
                  value={payload?.title}
                  placeholder="Enter title..."
                  onChange={handleTitleChange}
                />
              </FormGroup>
              </Col> <Col lg="6" xl="6" md="6">
              <FormGroup>
                <Label for="typeDropdown">Calculation Type</Label>
                <Input
                style={{height:'51px',borderRadius:'10px'}}
                  type="select"
                  name="type"
                  id="type"
                  value={payload?.type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed</option>
                </Input>
              </FormGroup>
              </Col> <Col lg="6" xl="6" md="6">
              <FormGroup>
                <Label for="typeValue">Calculation Value</Label>
                <Input
                  type="number"
                  name="typeValue"
                  id="typeValue"
                  value={payload?.typeValue}
                  placeholder="Enter Calculation Value"
                  onChange={(e) => setTypeValue(e.target.value)}
                />
              </FormGroup>
              </Col> <Col lg="6" xl="6" md="6">
              <FormGroup>
                <Label for="periodDropdown">Duration Type</Label>
                <Input
                style={{height:'51px',borderRadius:'10px'}}
                  type="select"
                  name="period"
                  id="period"
                  value={payload?.period}
                  onChange={(e) => setPeriod(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="daily">Daily</option>
                  <option value="one-time">One Time</option>
                </Input>
              </FormGroup>
              </Col> <Col lg="6" xl="6" md="6">
              {payload.rule && payload.rule === "ALLOWANCE" ? (
                <FormGroup>
                  <Label for="inputType">Distance</Label>
                  <Input
                    type="text"
                    name="ruleType"
                    id="ruleType"
                    value={payload.ruleType}
                    placeholder="Enter Distance"
                    onChange={(e) => setRuleType(e.target.value)}
                  />
                </FormGroup>
              ) : null}
              </Col>
              </Row>
              {renderRuleSpecificFields()}
<div className="text-center">
              <Button color="primary" type="submit">
                Update
              </Button>
              </div>
             
              
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default EditRules;
