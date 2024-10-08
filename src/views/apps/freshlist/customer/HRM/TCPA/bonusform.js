import React, { useState, useEffect } from "react";
import Select from "react-select";
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

const BonusForm = () => {
  const history = useHistory();
  const [TrainerList, setTrainerList] = useState([]);
  const [BulkUpload, setBulkUpload] = useState(false);
  const [BulkImport, setBulkImport] = useState(null);
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
        console.log(res.Rule);
        if (res.Rule) {
          setTypeList(res.Rule);
        }
        console.log(res);
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

  const handleEmployeeSelect = (selectedOptions) => {
    if (selectedOptions && Array.isArray(selectedOptions)) {
      const employees = selectedOptions.map((option) => ({
        id: option.value,
        selected: true,
      }));
      setData({ ...data, employees, selectAllemployees: false });
    } else {
      console.error("Selected options are null or undefined.");
    }
  };

  const toggleSelectAllEmployees = (e) => {
    console.log(e.target.checked);
    const { employees } = data;
    if (e.target.checked) {
      setData({
        ...data,
        employees: TrainerList,
        selectAllemployees: e.target.checked,
      });
    } else {
      setData({
        ...data,
        employees: [],
        selectAllemployees: e.target.checked,
      });
    }
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <Row>
      <Col sm="12" md="6" className="mx-auto">
        <Card>
          <CardBody>
            <Row className="">
              <Col lg="6" xs="12">
                <h3>Bonus Form</h3>
              </Col>
              {!BulkUpload && !BulkUpload ? (
                <>
                  <Col lg="4" xs="7" className="d-flex justify-content-end">
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
            <Form onSubmit={handleSubmit}>
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
                <Row className="mt-2">
                <Col lg="6" xl="6" md="6">
                
              

                  <FormGroup >
                    <Label for="type" >
                      Bonus Type:
                    </Label>
                  
                      <Input
                        type="select"
                        style={{height:'51px', borderRadius:'10px'}}
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
                  </Col>
                  <Col lg="6" xl="6" md="6">

                  <FormGroup >
                    <Label for="months" >
                      Bonus Month:
                    </Label>
                    
                      <Input
                        type="select"
                        style={{height:'51px', borderRadius:'10px'}}
                        name="months"
                        id="months"
                        value={data.months}
                        onChange={handleInputChange}
                        required>
                        <option value="00">Select bonus month</option>
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
                      </Input>
                    
                  </FormGroup>
                  </Col>
                  <Col lg="6" xl="6" md="6">
                  <FormGroup >
                    <Label for="months" >
                      Bonus Year:
                    </Label>

                      <DatePicker
                        name="year"
                        selected={data.year}
                        onChange={(date) => {
                          let selected = date.getFullYear();
                          setData({
                            ...data,
                            ["years"]: selected,
                            ["year"]: date,
                          });
                        }}
                        dateFormat="yyyy"
                        showYearPicker
                        className="form-control"
                      />
                   
                  </FormGroup>
                  </Col>
                  <Col lg="6" xl="6" md="6">
                  <FormGroup  className="align-items-center">
                    <Label for="employeeDropdown"     >
                      Choose Employee:
                    </Label>
                 
                      <Multiselect
                        required
                        showCheckbox="true"
                        isObject="false"
                        options={TrainerList} // Options to display in the dropdown
                        selectedValues={data?.employees} // Preselected value to persist in dropdown
                        onSelect={(selectedList, selectedItem) => {
                          setData({ ...data, employees: selectedList });
                        }} // Function will trigger on select event
                        onRemove={(selectedList, removedItem) => {
                          setData({ ...data, employees: selectedList });
                        }} // Function will trigger on remove event
                        displayValue="firstName" // Property name to display in the dropdown options
                      />
                  
                  </FormGroup>
                  </Col>
                  <Col lg="6" xl="6" md="6">
                  <FormGroup  className="align-items-center">
                    <Label for="employeeDropdown">
                      Choose All Employee:
                    </Label>
                  
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
                </>
              )}
              {!Loading && !Loading ? (
                <FormGroup row>
                  <Col>
                    <div className="d-flex justify-content-center">
                      <Button color="primary" type="submit">
                        Submit
                      </Button>{" "}
                    </div>
                  </Col>
                </FormGroup>
              ) : (
                <Col>
                  <div className="d-flex justify-content-center">
                    <Button color="primary">Loading....</Button>{" "}
                  </div>
                </Col>
              )}
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default BonusForm;
