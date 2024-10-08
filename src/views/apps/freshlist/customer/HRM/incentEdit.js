import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
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
import {
  CreateAccountList,
  _GetListData,
  _PostSave,
} from "../../../../../ApiEndPoint/ApiCalling";

import {
  Incentive_Edit_incentive_BYID,
  Incentive_View_incentive_BYID,
} from "../../../../../ApiEndPoint/Api";
import { _Put, _Get } from "../../../../../ApiEndPoint/ApiCalling";
import {
  VIEW_RULE_CREATION,
  Incentive_Save_incentive,
} from "../../../../../ApiEndPoint/Api";

const IncenFormEdit = () => {
  const [ruleTitle, setRuleTitle] = useState("");
  const [Loading, setLoading] = useState(false);
  const [ruleList, setRuleList] = useState([]);
  const [amountValue, setAmountValue] = useState("");
  const [targetAchievement, setTargetAchievement] = useState("");
  const [targetAssign, setTargetAssign] = useState("");
  const [employeeList, setEmployeeList] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [title, setTitle] = useState([]);
  const [titleName, setTitleName] = useState("");
  const [panCardNo, setPanCardNo] = useState("");
  const [rules, setRules] = useState("");
  const { id } = useParams();

  useEffect(() => {
    let userId = JSON.parse(localStorage.getItem("userData"));
    (async () => {
      setLoading(true);
      await CreateAccountList(userId?._id, userId?.database)
        .then((res) => {
          let value = res?.adminDetails;
          setEmployeeList(value);
        })
        .catch((err) => {
          console.log(err);
        });

      const response = await _Get(Incentive_View_incentive_BYID, id);
      console.log(response.Incentive.rule?.title);
      setEmployeeName(response?.Incentive?.employeeName.firstName);
      setTitleName(response?.Incentive?.rule?.title);
      setTargetAchievement(response?.Incentive?.targetAchievement);
      setPanCardNo(response?.Incentive?.pancardNo);
      setRuleTitle(response?.Incentive?.rule?._id);

      await _GetListData(VIEW_RULE_CREATION, userId?.database)
        .then((res) => {
          let selected = res?.Rule?.filter(
            (ele) => ele?._id == response?.Incentive?.rule?._id
          );

          setTitle(selected);
          setRuleList(res?.Rule);
        })
        .catch((err) => {
          console.log(err);
        });
      // setTitle(response?.Incentive?.rule?.title);
      setTargetAssign(response?.Incentive?.targetAssign);
      setLoading(false);
    })();
  }, []);

  const handleRules = (e) => {
    let selected = ruleList?.filter((ele) => ele?._id == e.target.value);

    setTitle(selected);
    setRules(e.target.value);
  };

  const handleSubmit = async (e) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    e.preventDefault();
    const payload = {
      employeeName: employeeName,
      rule: rules,
      title: titleName,
      pancardNo: panCardNo,
      targetAchievement: Number(targetAchievement),
      targetAssign: Number(targetAssign),
    };
    console.log(payload);

    try {
      await _Put(Incentive_Edit_incentive_BYID, id, payload);
      history.goBack();
    } catch (error) {
      console.log(error);
    }
    // setRuleTitle("");
    // setAmountValue("");
  };

  return (
    <Row>
      <Col sm="12" md={{ size: 6, offset: 3 }}>
        {Loading && Loading ? (
          <div className="d-flex justify-content-center mt-2">Loading...</div>
        ) : (
          <>
            <Card>
              <CardBody>
                <h1 className="text-center mb-4">Incentive Edit Form</h1>
                <Form onSubmit={handleSubmit}>
                  <Row form>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="employeename">Employee Name:</Label>
                        <Input
                          type="select"
                          placeholder=" Enter Employee"
                          name="employeeName"
                          id="employeeName"
                          value={employeeName}
                          onChange={(e) => {
                            setEmployeeName(e.target.value);
                          }}>
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
                        <Label for="pancard">Pan Card No:</Label>
                        <Input
                          type="text"
                          placeholder="Enter Pan Card No"
                          name="panCard"
                          id="panCardNo"
                          value={panCardNo}
                          onChange={(e) => setPanCardNo(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="rules">Rule :</Label>
                        <Input
                          type="select"
                          name="rules"
                          id="rules"
                          value={rules}
                          onChange={handleRules}>
                          {ruleList &&
                            ruleList?.map((ele) => (
                              <option value={ele?._id} key={ele?._id}>
                                {ele?.rule}
                              </option>
                            ))}
                        </Input>
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <Label for="titleName">Title :</Label>
                        <Input
                          type="select"
                          name="titleName"
                          id="titleName"
                          value={titleName}
                          onChange={(e) => setTitleName(e.target.value)}>
                          {title &&
                            title?.map((ele) => (
                              <option value={ele?.title} key={ele?._id}>
                                {ele?.title}
                              </option>
                            ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="targetAchievement">
                          Target Achievement:
                        </Label>
                        <Input
                          type="text"
                          placeholder=" Enter Target"
                          name="targetAchievement"
                          id="targetAchievement"
                          value={targetAchievement}
                          onChange={(e) => setTargetAchievement(e.target.value)}
                        />
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <Label for="targetAssign">Target Assign:</Label>
                        <Input
                          type="text"
                          placeholder=" Enter Target"
                          name="targetAssign"
                          id="targetAssign"
                          value={targetAssign}
                          onChange={(e) => setTargetAssign(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                    {/* <Col md={6}>
                  <FormGroup>
                    <Label for="incentivefund">Incentive Fund:</Label>
                    <Input
                      type="number"
                      placeholder="amount value"
                      name="amountValue"
                      id="amountValue"
                      value={amountValue}
                      onChange={(e) => setAmountValue(e.target.value)}
                    />
                  </FormGroup>
                </Col> */}
                  </Row>
                  <div className="text-center">
                    <Button color="primary" type="submit">
                      Update
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Col>
    </Row>
  );
};

export default IncenFormEdit;
