import React, { useEffect, useState, useContext } from "react";
import {
  Card,
  CardBody,
  Col,
  Form,
  Row,
  Input,
  Label,
  Button,
  FormGroup,
  CustomInput,
} from "reactstrap";
import "react-phone-input-2/lib/style.css";

import { useParams, useLocation } from "react-router-dom";
import "../../../../../assets/scss/pages/users.scss";
import {
  ProductListView,
  Create_Sales_personList,
  SalesPendingStatusChange,
} from "../../../../../ApiEndPoint/ApiCalling";
import "../../../../../assets/scss/pages/users.scss";
import { Route } from "react-router-dom";

const EditPending = (args) => {
  const [Index, setIndex] = useState(-1);
  const [error, setError] = useState("");
  const [status, setstatus] = useState("");
  const [orderData, setOrderData] = useState("");
  const Params = useParams();
  const location = useLocation();

  useEffect(() => {
    console.log(location.state);
    setstatus(location.state.status);
    setOrderData(location.state);
    // setEditdata(location?.state);
    // setGrandTotalAmt(location?.state?.grandTotal);
  }, []);

  const handleChange = (e) => {
    console.log(e.target.value);
    setstatus(e.target.value);
  };
  const submitHandler = (e) => {
    e.preventDefault();

    let payload = {
      status: status,
    };
    if (error) {
      swal("Error occured while Entering Details");
    } else {
      SalesPendingStatusChange(payload, orderData._id)
        .then((res) => {
          console.log(res);
          swal("Status changed Successfully");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div>
      <div>
        <Card>
          <Row className="m-2">
            <Col className="">
              <div>
                <h2 className="">Change Pending Order Status</h2>
              </div>
            </Col>
            <Col>
              <div className="float-right">
                <Route
                  render={({ history }) => (
                    <Button
                      style={{ cursor: "pointer" }}
                      className="float-right mr-1"
                      color="primary"
                      size="sm"
                      onClick={() => history.goBack()}>
                      Back
                    </Button>
                  )}
                />
              </div>
            </Col>
          </Row>

          <CardBody>
            <Form className="m-1" onSubmit={submitHandler}>
              <Row>
                <Col lg="6" md="6" sm="6" className="mb-2">
                  <Label>Status</Label>
                  <CustomInput
                    required
                    type="select"
                    placeholder="City"
                    name="city"
                    value={status}
                    onChange={handleChange}>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </CustomInput>
                </Col>
                <Col lg="6" md="6" sm="6" className="mb-2">
                  <div className="d-flex justify-content-center">
                    <Button.Ripple
                      color="primary"
                      type="submit"
                      className="mt-2">
                      Submit
                    </Button.Ripple>
                  </div>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
export default EditPending;
