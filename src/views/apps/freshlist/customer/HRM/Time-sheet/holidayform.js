import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { _Get, _PostSave } from "../../../../../../ApiEndPoint/ApiCalling";
import { Link } from "react-router-dom/cjs/react-router-dom";
import {
  HRM_SAVE_HOLIDAY,
  Working_Hours,
  Working_Hours_get,
} from "../../../../../../ApiEndPoint/Api";
import { useHistory } from "react-router-dom";

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
import swal from "sweetalert";

const Holidayform = () => {
  let history = useHistory();
  const [workingHours, setWorkingHours] = useState({
    fromTime: "",
    toTime: "",
    lateByTime: "",
    shortByTime: "",
  });

  const [holiday, setHoliday] = useState({
    month: "",
    Years: "",
    Day: "",
    year: new Date(),
    day: "",
    holidayName: "",
  });
  function handleClick() {
    history.goBack();
  }
  useEffect(() => {
    let userId = JSON.parse(localStorage.getItem("userData"));
    _Get(Working_Hours_get, userId.database)
      .then((res) => {
        let value = res?.WorkingHours;
        debugger;
        setWorkingHours(value);
      })
      .catch((err) => {
        console.log(err);
      });
    setHoliday({ ...holiday, database: userId.database });
    setWorkingHours({ ...workingHours, database: userId.database });
  }, []);

  const handleWorkingHoursChange = (e) => {
    const { name, value } = e.target;
    setWorkingHours({ ...workingHours, [name]: value });
  };

  const handleHolidayChange = (name, value) => {
    let date;
    if (name == "Day") {
      date = value.getDate();
      setHoliday({ ...holiday, [name]: value, ["day"]: date });
    } else if (name == "Years") {
      date = value.getFullYear();
      setHoliday({ ...holiday, [name]: value, ["year"]: date });
    } else {
      setHoliday({ ...holiday, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await _PostSave(HRM_SAVE_HOLIDAY, holiday)
        .then((res) => {
          swal("Added Successfully");
        })
        .catch((err) => {
          swal("Something Went Wrong");
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };
  const calculateTimeDifference = (fromTime, toTime) => {
    // Split the startTime and endTime by ":" to get hours and minutes
    const [startHours, startMinutes] = fromTime.split(":");
    const [endHours, endMinutes] = toTime.split(":");

    // If endTime is before startTime, add 24 hours to endTime
    let adjustedEndHours = Number(endHours);
    if (endHours < startHours) {
      adjustedEndHours += 24;
    }

    // Convert both times to minutes
    const startTotalMinutes = Number(startHours) * 60 + Number(startMinutes);
    const endTotalMinutes = adjustedEndHours * 60 + Number(endMinutes);

    // Calculate the difference in minutes
    const difference = endTotalMinutes - startTotalMinutes;

    // Convert the difference back to hours and minutes
    const hours = Math.floor(difference / 60);
    const minutes = difference % 60;

    // return hours;
    return { hour: hours, minutes: minutes };
    // return `${hours}:${minutes}`;
  };

  const handleWorkingHours = async (e) => {
    e.preventDefault();
    // console.log(workingHours);
    const timeDifference = calculateTimeDifference(
      workingHours?.fromTime,
      workingHours?.toTime
    );
    let payload = {
      totalHours: timeDifference?.hour,
      min: timeDifference?.minutes,
      fromTime: workingHours?.fromTime,
      toTime: workingHours?.toTime,
      lateByTime: workingHours?.lateByTime,
      shortByTime: workingHours?.shortByTime,
      database: workingHours?.database,
    };

    await _PostSave(Working_Hours, payload)
      .then((res) => {
        console.log(res);
        swal("Updated Succesfully");
      })
      .catch((err) => {
        swal("Something Went Wrong");

        console.log(err);
      });
  };
  const handleBack = () => {
    history.goBack();
  };
  return (
    <Row>
      <Col sm="12" md="6" className="mx-auto">
        <Card>
          <CardHeader>
            <Row style={{ width: "100%" }}>
              <Col md="6" lg="6" xl="6">
                <h2>Holiday Form</h2>
              </Col>
              <Col md="6" lg="6" xl="6">
                <Button
                  color="danger"
                  onClick={handleClick}
                  className="float-right ">
                  Back
                </Button>
              </Col>
            </Row>
          </CardHeader>
          <CardBody>
            {/* <Card>
              <CardHeader className="bg-primary text-white">
                <h4>General Working Hours</h4>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleWorkingHours}>
                  <Row>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="fromTime">In Time:</Label>
                        <Input
                          required
                          type="time"
                          name="fromTime"
                          id="fromTime"
                          value={workingHours.fromTime}
                          onChange={handleWorkingHoursChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="toTime">Out Time:</Label>
                        <Input
                          required
                          type="time"
                          name="toTime"
                          id="toTime"
                          value={workingHours.toTime}
                          onChange={handleWorkingHoursChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="fromTime">From Time Late by:</Label>
                        <Input
                          required
                          type="time"
                          name="lateByTime"
                          id="lateByTime"
                          value={workingHours.lateByTime}
                          onChange={handleWorkingHoursChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="toTime">To Time shortBy:</Label>
                        <Input
                          required
                          type="time"
                          name="shortByTime"
                          id="shortByTime"
                          value={workingHours.shortByTime}
                          onChange={handleWorkingHoursChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col
                      md={4}
                      className="d-flex align-items-end justify-content-center">
                      <FormGroup className="mt-auto">
                        <Button color="primary" type="submit">
                          Add
                        </Button>
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card> */}

            <Form onSubmit={handleSubmit}>
              <Card style={{ marginTop: "0px" }}>
                <CardHeader className="bg-primary text-white">
                  <h4>Add Holiday</h4>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="month">Month:</Label>
                        <Input
                          style={{ borderRadius: "10px", height: "51px" }}
                          type="select"
                          name="month"
                          id="month"
                          value={holiday.month}
                          onChange={(e) =>
                            handleHolidayChange("month", e.target.value)
                          }
                          required>
                          <option value="00">Select month</option>
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
                      <FormGroup>
                        <Label for="day">Day:</Label>
                        <DatePicker
                          selected={holiday.Day}
                          onChange={(date) => handleHolidayChange("Day", date)}
                          className="form-control"
                          dateFormat="dd/MM/yyyy"
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="year">Year:</Label>
                        <DatePicker
                          selected={holiday.Years}
                          onChange={(date) =>
                            handleHolidayChange("Years", date)
                          }
                          dateFormat="yyyy"
                          showYearPicker
                          className="form-control"
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label for="holidayName">Holiday Name:</Label>
                        <Input
                          type="text"
                          name="holidayName"
                          id="holidayName"
                          value={holiday.holidayName}
                          onChange={(e) =>
                            handleHolidayChange("holidayName", e.target.value)
                          }
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <FormGroup className="text-right">
                    <Button type="submit" color="primary">
                      Add Holiday
                    </Button>
                  </FormGroup>
                </CardBody>
              </Card>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default Holidayform;
