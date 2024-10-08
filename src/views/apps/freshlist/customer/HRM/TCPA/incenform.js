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
import { useHistory, useParams, Route } from "react-router-dom";
import {
  CreateAccountList,
  _Get,
  _PostSave,
  _Put,
} from "../../../../../../ApiEndPoint/ApiCalling";
import {
  Incentive_Edit_incentive_BYID,
  Incentive_Save_incentive,
  Incentive_View_incentive_BYID,
} from "../../../../../../ApiEndPoint/Api";
import { FaUpload } from "react-icons/fa";

const Incentiveform = () => {
  const [data, setData] = useState({
    pancardNo: "",
    title: "",
    employeeName: "",
    rule: "",
    targetAssign: "",
    targetAchievement: "",
    incentiveFund: "",
  });

  const { id } = useParams();
  const [View, setView] = useState("Create");
  const [SelectedRules, setSelectedRules] = useState({});
  const [employeeList, setEmployeeList] = useState([]);
  const [SelectedTitle, setSelectedTitle] = useState([]);
  const [BulkImport, setBulkImport] = useState(null);
  const [BulkUpload, setBulkUpload] = useState(false);

  const history = useHistory();

  const resetForm = () => {
    setData({
      employeeName: "",
      rule: "",
      pancardNo: "",
      title: "",
      targetAssign: "",
      targetAchievment: "",
      incementFund: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  useEffect(() => {
    let userId = JSON.parse(localStorage.getItem("userData"));

    if (id == 0) {
      setView("Create");
      (async () => {
        await CreateAccountList(userId?._id, userId?.database)
          .then((res) => {
            let value = res?.adminDetails;
            setEmployeeList(value);

            console.log(value);
          })
          .catch((err) => {
            console.log(err);
          });
      })();
    } else {
      setView("Edit");
      (async () => {
        const Account = await CreateAccountList(userId?._id, userId?.database);
        setEmployeeList(Account?.adminDetails);
        const response = await _Get(Incentive_View_incentive_BYID, id);

        let data = response?.Incentive;
        let selectedUser = Account?.adminDetails?.filter(
          (ele) => ele?._id == data?.employeeName?._id
        );
        setSelectedRules(selectedUser[0]);
        let SelectedTitle = selectedUser[0]?.setRule?.filter(
          (ele) => ele?._id == data?.title
        );
        setSelectedTitle(SelectedTitle);
        let payload = {
          pancardNo: data?.pancardNo,
          title: data?.title,
          employeeName: data?.employeeName?._id,
          rule: data?.rule?._id,
          targetAssign: data?.targetAssign,
          targetAchievement: data?.targetAchievement,
          incentiveFund: data?.incentiveFund,
        };
        setData(payload);
      })();
    }
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    let userId = JSON.parse(localStorage.getItem("userData"));
    let payload = {
      pancardNo: data?.pancardNo,
      title: data?.title,
      targetAssign: data?.targetAssign,
      targetAchievement: data?.targetAchievement,
      incentiveFund: data?.incentiveFund,
      employeeName: data?.employeeName,
      rule: data.rule,
      database: userId.database,
    };
    if (id == 0) {
      try {
        await _PostSave(Incentive_Save_incentive, payload);
        resetForm();

        history.goBack();
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await _Put(Incentive_Edit_incentive_BYID, id, payload);
        history.goBack();
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Row>
      <Col sm="12" md="7" className="mx-auto">
        <Card>
          <CardBody>
            <Form onSubmit={handleSubmit}>
              <Row className="">
                <Col lg="7" xs="12">
                  <h1> {View && View} Incentive </h1>
                </Col>
                {!BulkUpload && !BulkUpload ? (
                  <>
                    <Col lg="3" xs="12" className="d-flex justify-content-end">
                      <Button
                        className="mx-2 mt-1 mb-1"
                        color="primary"
                        onClick={(e) => {
                          e.preventDefault();
                          setBulkUpload(true);
                        }}>
                        Bulk Upload
                      </Button>
                    </Col>
                  </>
                ) : (
                  <>
                    <Col xs="5" className="d-flex justify-content-end">
                      <Button
                        className="mx-1 mt-1 mb-1"
                        color="primary"
                        onClick={(e) => {
                          e.preventDefault();
                          setBulkUpload(false);
                        }}>
                        Back
                      </Button>
                    </Col>
                  </>
                )}

                {!BulkUpload && !BulkUpload && (
                  <Col>
                    <div className="float-right">
                      <Route
                        render={({ history }) => (
                          <Button
                            style={{ cursor: "pointer" }}
                            className="float-right mr-1 mt-1 mb-1"
                            color="primary"
                            onClick={() => history.goBack()}>
                            {" "}
                            Back
                          </Button>
                        )}
                      />
                    </div>
                  </Col>
                )}
              </Row>

              <Row>
              {BulkUpload && BulkUpload ? (
                  <>
                    <Col>
                      <div className="d-flex justify-content-center">
                        <div className="file-upload mb-3 mt-5">
                          <FaUpload color="green" size={40} />

                          <p>Click box to upload</p>
                          <input
                            required
                            type="file"
                            name="images"
                            onChange={(e) => {
                              setBulkImport(e.target.files[0]);
                            }}
                          />
                        </div>
                      </div>
                    </Col>
                  </>
                ) : (
<>

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
                      onChange={(e) => {
                        setData({ ...data, ["rule"]: e.target.value });
                        const selected =
                          e.target.options[e.target.selectedIndex].getAttribute(
                            "data"
                          );

                        let selectededData = SelectedRules?.setRule?.filter(
                          (ele) => ele?.rule == selected
                        );
                        setSelectedTitle(selectededData);
                      }}>
                      <option value="">Select Rule</option>
                      {SelectedRules?.setRule?.length > 0 &&
                        SelectedRules?.setRule?.map((ele) => (
                          <option
                            value={ele?._id}
                            data={ele?.rule}
                            key={ele?._id}>
                            {ele?.rule}
                          </option>
                        ))}
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="role">Title:</Label>
                    <Input
                      required
                      type="select"
                      placeholder="Name"
                      name="title"
                      id="title"
                      value={data.title}
                      onChange={handleInputChange}>
                      <option value="">Select Title</option>
                      {SelectedTitle?.length > 0 &&
                        SelectedTitle?.map((ele) => (
                          <option
                            value={ele?._id}
                            data={ele?.rule}
                            key={ele?._id}>
                            {ele?.rule}
                          </option>
                        ))}
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="role">Pan Card:</Label>
                    <Input
                      required
                      type="text"
                      placeholder="Pan Card"
                      name="pancardNo"
                      id="pancardNo"
                      value={data.pancardNo}
                      onChange={handleInputChange}></Input>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="attendance">Target Assign</Label>
                    <Input
                      required
                      type="number"
                      min={0}
                      placeholder="targetAssign"
                      name="targetAssign"
                      id="targetAssign"
                      value={data.targetAssign}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="department">Target Achievment:</Label>
                    <Input
                      required
                      type="text"
                      placeholder="targetAchievement"
                      name="targetAchievement"
                      id="targetAchievement"
                      value={data.targetAchievement}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>

                <Col md={6}>
                  <FormGroup>
                    <Label for="department">Increment Fund:</Label>
                    <Input
                      required
                      type="text"
                      placeholder="IncrementFund"
                      name="incentiveFund"
                      id="incentiveFund"
                      value={data.incentiveFund}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
</>

                )}
              </Row>
              
               
          

              <FormGroup row>
                <Col sm={{ size: 10, offset: 10 }}>
                  <Button.Ripple color="primary" type="submit" className="mt-2">
                    {View && View}
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

export default Incentiveform;
