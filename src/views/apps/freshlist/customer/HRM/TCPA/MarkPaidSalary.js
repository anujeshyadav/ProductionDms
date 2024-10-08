import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import {
  Create_Account_List,
  HRMRULE_SAVE_BONUS,
  VIEW_RULE_CREATION,
} from "../../../../../../ApiEndPoint/Api";
import {
  _PostSave,
  _GetList,
  _Get,
} from "../../../../../../ApiEndPoint/ApiCalling";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
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
  CustomInput,
} from "reactstrap";
import Multiselect from "multiselect-react-dropdown";
import { Route, useHistory } from "react-router-dom";
import { FaUpload } from "react-icons/fa";

const MarkPaidSalary = (args) => {
  const history = useHistory();
  const [modal, setModal] = useState(false);
  const [totalSalary, setTotalSalary] = useState(0);

  const toggle = () => setModal(!modal);
  const [TrainerList, setTrainerList] = useState([]);
  const [data, setData] = useState({
    type: "",
    months: "",
    database: "",
    years: "",
    year: "",
    employees: [],
    selectAllemployees: false,
  });
  const [typeList, setTypeList] = useState([]);
  const [Loading, setLoading] = useState(false);

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("userData"));
    _Get(VIEW_RULE_CREATION, user.database)
      .then((res) => {
        if (res.Rule) {
          setTypeList(res.Rule);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    let URL = `${Create_Account_List}/${user?._id}/`;
    _Get(URL, user?.database)
      .then((res) => {
        setTrainerList(res?.adminDetails);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const currentYear = new Date().getFullYear();
  const minDate = new Date(currentYear, 0, 1);

  const handleSubmit = async (e) => {
    setLoading(true);
    let user = JSON.parse(localStorage.getItem("userData"));
    let selectedUser = data.employees?.map((ele) => {
      return { id: ele?._id };
    });
    e.preventDefault();
    const payload = {
      type: data.type,
      months: data.months,
      employees: selectedUser,
      years: data.years,
      year: data.year,
      database: user.database,
    };
    await _PostSave(HRMRULE_SAVE_BONUS, payload)
      .then((res) => {
        setLoading(false);
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

  const calculateTotalSalary = (selectedEmployees) => {
    const total = selectedEmployees.reduce(
      (acc, employee) =>
        acc + (employee?.last_job_Salary ? employee?.last_job_Salary : 0),

      0
    );
    setTotalSalary(total);
  };

  const handleEmployeeSelect = (selectedList, selectedItem) => {
    setData({ ...data, employees: selectedList });
    calculateTotalSalary(selectedList);
  };

  const handleEmployeeRemove = (selectedList, removedItem) => {
    setData({ ...data, employees: selectedList });
    calculateTotalSalary(selectedList);
  };

  const toggleSelectAllEmployees = (e) => {
    if (e.target.checked) {
      setData({
        ...data,
        employees: TrainerList,
        selectAllemployees: e.target.checked,
      });
      calculateTotalSalary(TrainerList);
    } else {
      setData({
        ...data,
        employees: [],
        selectAllemployees: e.target.checked,
      });
      setTotalSalary(0);
    }
  };

  useEffect(() => {
    console.log(data.employees);
  }, [data]);

  return (
    <>
      <Button
        type="submit"
        style={{
          cursor: "pointer",
          backgroundColor: "rgb(8, 91, 245)",
          color: "white",
          fontWeight: "600",
          height: "43px",
          fontSize: "13px",
        }}
        onClick={toggle}
        className="float-left"
        color="#39cccc">
        Mark Paid Salary
      </Button>

      <Modal isOpen={modal} toggle={toggle} {...args} size="lg">
        <ModalHeader toggle={toggle}>Mark Paid </ModalHeader>
        <ModalBody>
          <Card>
            <CardBody>
              <Row className="">
                <Col lg="12" xs="12">
                  <h3>Mark Salary As Paid</h3>
                </Col>
              </Row>
              <Form onSubmit={handleSubmit}>
                <Row className="mt-1">
                  <Col className="mb-1" lg="4" md="4" sm="12">
                    <Label>Choose Payment Mode</Label>
                    <CustomInput
                      required
                      name="paymentMode"
                      value={data.paymentMode}
                      onChange={handleInputChange}
                      type="select">
                      <option>--Select--</option>
                      <option value="Cash">Cash</option>
                      <option value="Bank">Bank</option>
                    </CustomInput>
                  </Col>
                  <Col lg="4" md="4" xl="4">
                    <FormGroup>
                      <Label for="months">Salary Month:</Label>
                      <CustomInput
                        type="select"
                        style={{ height: "51px", borderRadius: "8px" }}
                        name="months"
                        id="months"
                        value={data.months}
                        onChange={handleInputChange}
                        required>
                        <option value="00">Select Month</option>
                        <option value="01">January</option>
                        <option value="02">February</option>
                        <option value="03">March</option>
                        <option value="04">April</option>
                        <option value="05">May</option>
                        <option value="06">June</option>
                        <option value="07">July</option>
                        <option value="08">August</option>
                        <option value="09">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                      </CustomInput>
                    </FormGroup>
                  </Col>
                  <Col lg="4" md="4" xl="4" className="">
                    <Label>Total Salary</Label>
                    <Input
                      type="text"
                      name="totalsalary"
                      placeholder="Total Salary"
                      value={totalSalary}
                      readOnly
                    />
                  </Col>
                  <Col lg="4" md="4" xl="4">
                    <FormGroup>
                      <Label for="months">Salary Year:</Label>
                      <DatePicker
                        minDate={minDate}
                        locale="es"
                        name="year"
                        selected={data.year}
                        onChange={(date) => {
                          let selected = date.getFullYear();
                          setData({
                            ...data,
                            years: selected,
                            year: date,
                          });
                        }}
                        dateFormat="yyyy"
                        showYearPicker
                        className="form-control"
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="12" xl="12" md="12">
                    <FormGroup className="align-items-center">
                      <Label for="employeeDropdown">Select Employee:</Label>
                      <Multiselect
                        required
                        showCheckbox={true}
                        isObject={true}
                        options={TrainerList}
                        selectedValues={data?.employees}
                        onSelect={handleEmployeeSelect}
                        onRemove={handleEmployeeRemove}
                        displayValue="firstName"
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="12" xl="12" md="12">
                    <FormGroup className="align-items-center">
                      <Label for="employeeDropdown">Choose All Employee:</Label>
                      <div className="ml-2">
                        <Label check>
                          <CustomInput
                            type="checkbox"
                            id="selectAllCheckbox"
                            checked={data.selectAllemployees}
                            onChange={toggleSelectAllEmployees}
                          />
                          All
                        </Label>
                      </div>
                    </FormGroup>
                  </Col>
                </Row>

                {!Loading && !Loading ? (
                  <FormGroup row>
                    <Col>
                      <div className="d-flex justify-content-center">
                        <Button color="primary" type="submit">
                          Submit
                        </Button>
                      </div>
                    </Col>
                  </FormGroup>
                ) : (
                  <Col>
                    <div className="d-flex justify-content-center">
                      <Button color="primary">Loading....</Button>
                    </div>
                  </Col>
                )}
              </Form>
            </CardBody>
          </Card>
        </ModalBody>
      </Modal>
    </>
  );
};

export default MarkPaidSalary;
