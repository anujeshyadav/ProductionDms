import React, { useEffect, useState } from "react";
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
import { _PostSave } from "../../../../../../ApiEndPoint/ApiCalling";
import { SAVE_RULE_CREATION } from "../../../../../../ApiEndPoint/Api";
import { useHistory } from "react-router-dom";

const SetRules = () => {
  const [rule, setRule] = useState("");
  const [type, setType] = useState("");
  const [ruleType, setRuleType] = useState("");
  const [typeValue, setTypeValue] = useState("");
  const [ruleTypeValue, setRuleTypeValue] = useState("");
  const [period, setPeriod] = useState("");
  const [title, setTitle] = useState("");
  const [database, setDatabase] = useState("");

  // const [value, setValue] = useState('');
  // const [target, setTargetType] = useState('');
  // const [bonusType, setInputBonusType] = useState('');
  // const [loanType, setLoanType] = useState('');

  useEffect(() => {
    let userinfor = JSON.parse(localStorage.getItem("userData"));
    setDatabase(userinfor.database);
  }, []);

  const history = useHistory();

  // const handleSubmit = async (e) => {
  //     e.preventDefault();

  //     const Payload = {
  //         rule,
  //         type,
  //         ruleType,
  //         typeValue,
  //         value,
  //         period,
  //         title,
  //         target,
  //         bonusType,
  //         loanType,
  //     };

  //     try {
  //         await _PostSave(SAVE_RULE_CREATION, Payload);
  //         resetForm();
  //         history.push('/app/ajgroup/HRM/ruleList');

  //     } catch (error) {
  //         console.error(error);
  //     }
  //     console.log('Rules:', Payload);

  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(ruleType);
    const payload = {
      rule,
      type,
      ruleType,
      typeValue,
      ruleTypeValue,
      period,
      title,
      database,
      // value,
      // target,
      // bonusType,
      // loanType,
    };

    try {
      await _PostSave(SAVE_RULE_CREATION, payload);
      resetForm();
      history.push("/app/ajgroup/HRM/ruleList");
    } catch (error) {
      console.error(error);
    }
    console.log("Rules:", payload);
  };

  const resetForm = () => {
    setRule("");
    setType("");
    setRuleType("");
    setTypeValue("");
    setPeriod("");
    setTitle("");
    setRuleTypeValue("");
    // setValue('');
    // setTargetType('');
    // setInputBonusType('');
    // setLoanType('');
    // setDurationTime('');
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

    // setLoanType('');
    // setInputBonusType('');
    // setDurationTime('');
    // setTargetType('');
    // setValue('');
  };

  const renderRuleSpecificFields = () => {
    if (rule === "ALLOWANCE") {
      return (
        <>
          <FormGroup>
            <Label for="ruleType">Distance</Label>
            <Input
              required
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
              required
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
              required
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
              required
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
              required
              type="select"
              name="ruleTypeValue"
              id="ruleTypeValue"
              value={ruleTypeValue}
              onChange={(e) => setRuleTypeValue(e.target.value)}>
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
              required
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

    // if (['ACTUAL (BILL)', 'PF', 'OVERTIME', 'ADVANCE', 'EMI'].includes(rule)) {
    //     return (
    //         <>
    //         </>
    //     );
    // }

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
            <h1>Set Rules</h1>
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
                  required
                  style={{borderRadius:'10px',height:'51px'}}
                  type="select"
                  name="Rule"
                  id="ruleDropdown"
                  value={rule}
                  onChange={(e) => handleRuleChange(e.target.value)}>
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
</Col><Col lg="6" xl="6" md="6">
              <FormGroup>
                <Label for="title">Title</Label>
                <Input
                  required
                  type="text"
                  name="title"
                  id="title"
                  value={title}
                  placeholder="Enter title..."
                  onChange={handleTitleChange}
                />
              </FormGroup>
              </Col><Col lg="6" xl="6" md="6">
              <FormGroup>
                <Label for="typeDropdown">Calculation Type</Label>
                <Input
                  required
                  style={{borderRadius:'10px',height:'51px'}}
                  type="select"
                  name="type"
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}>
                  <option value="">Select</option>
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed</option>
                </Input>
              </FormGroup>
              </Col><Col lg="6" xl="6" md="6">
              <FormGroup>
                <Label for="typeValue">Calculation Value</Label>
                <Input
                  required
                  type="number"
                  name="typeValue"
                  id="typeValue"
                  value={typeValue}
                  placeholder="Enter Calculation Value"
                  onChange={(e) => setTypeValue(e.target.value)}
                />
              </FormGroup>
              </Col><Col lg="6" xl="6" md="6">
              <FormGroup>
                <Label for="periodDropdown">Duration Type</Label>
                <Input
                  required
                  style={{borderRadius:'10px',height:'51px'}}
                  type="select"
                  name="period"
                  id="period"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}>
                  <option value="">Select</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="daily">Daily</option>
                  <option value="one-time">One Time</option>
                </Input>
              </FormGroup>
              </Col>
              </Row>
              {renderRuleSpecificFields()}
<div className="text-center">
              <Button color="primary" type="submit">
                Submit
              </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default SetRules;
