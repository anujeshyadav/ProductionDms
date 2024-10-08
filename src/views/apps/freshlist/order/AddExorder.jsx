import React, { Component } from "react";
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
import { history } from "../../../../history";
import axiosConfig from "../../../../axiosConfig";
import Multiselect from "multiselect-react-dropdown";
import swal from "sweetalert";
import "../../../../../src/layouts/assets/scss/pages/users.scss";
import { Route } from "react-router-dom";
export class AddExorder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: "",
      phone_no: "",
      order_zone: "",
      delivery_add: "",
      attribute: "",
      email: "",
      delivery_date: "",
      time_slot: "",
      status: "",
      productName: [],
      attribuName: [],
      new_address: "",
      notify: [],
      myvalue: "",
      inputlist: [{ selected: "", attribute: "", quantity: "" }],
      // selectedOptions: [],
    };
  }

  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleremove = (index) => {
    const list = [...this.state.inputlist];
    list.splice(index, 1);
    this.setState({ inputlist: list });
  };

  handleinputchange = (e, index) => {
    const { name, value } = e.target;
    const list = [...this.state.inputlist];
    list[index][name] = value;
    this.setState({ inputlist: list });

    console.log(this.state.inputlist);
  };
  handleClick = () => {
    this.setState({
      inputlist: [
        ...this.state.inputlist,
        { selected: this.state.myvalue, attribute: "", quantity: "" },
      ],
    });
  };
  async componentDidMount() {
    axiosConfig
      .get("/admin/product_list")
      .then((response) => {
        // console.log(response);
        this.setState({
          productName: response.data.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });

    axiosConfig
      .get("/admin/getall_units")
      .then((response) => {
        this.setState({
          attribuName: response.data.data,
        });
      })
      .catch((err) => {
        swal("Oops", "Something went wrong!", "error");
        console.log(err);
      });
  }

  submitHandler = (e) => {
    e.preventDefault();

    axiosConfig
      .post("/admin/addorder", this.state)

      .then((response) => {
        console.log(response.data.data);
        swal("Success!", "Submitted SuccessFull!", "success");
        this.props.history.push("/app/softNumen/order/placeorder");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <div>
        <Card>
          <Row className="m-2">
            {/* <Col>
              <h1 col-sm-6 className="float-left">
                Add Order
              </h1>
            </Col> */}
            {/* <Col>
              <Route
                render={({ history }) => (
                  <Button
                    className=" btn btn-danger float-right"
                    onClick={() =>
                      history.push(
                        "/app/freshlist/order/viewAll/63ae84014915409458789aed"
                      )
                    }
                  >
                    Back
                  </Button>
                )}
              />
            </Col> */}
          </Row>
          <CardBody style={{ padding: "0px" }}>
            <Form className="m-1" onSubmit={this.submitHandler}>
              <Row className="mb-2">
                <Col lg="6" md="6">
                  <FormGroup>
                    <Label>OrderId</Label>
                    <Input
                      required
                      type="tel"
                      //   maxlength="10"
                      placeholder="OrderId"
                      name="phone_no"
                      value={this.state.phone_no}
                      onChange={this.changeHandler.bind(this)}
                    />
                  </FormGroup>
                </Col>
                {/* <Col lg="6" md="6">
                  <FormGroup>
                    <Label>Delivery Slot</Label>
                    <Input
                      type="text"
                      placeholder="Delivery Slot"
                      name="delivery_slot"
                      value={this.state.delivery_slot}
                      onChange={this.changeHandler}
                    />
                  </FormGroup>
                </Col> */}
                {/* <Col lg="6" md="6">
                  <FormGroup>
                    <Label>Items</Label>
                    <Input
                      type="text"
                      placeholder="Items"
                      name="items"
                      value={this.state.items}
                      onChange={this.changeHandler}
                    />
                  </FormGroup>
                </Col> */}

                <Col lg="6" md="6">
                  <FormGroup>
                    <Label>Select Delivery Date</Label>
                    <Input
                      type="date"
                      placeholder="Delivery Date"
                      name="d_date"
                      value={this.state.d_date}
                      onChange={this.changeHandler}
                    />
                  </FormGroup>
                </Col>

                <Col lg="6" md="6">
                  <Label>Notify by </Label>
                  <Multiselect
                    name="notify"
                    value={this.state.notify}
                    isObject={false}
                    onRemove={(e) => {
                      console.log(e);
                    }}
                    onSelect={(e) => {
                      this.setState({ notify: e });
                      // this.setState({ [e.target.name]: e.target.value });
                      console.log(e);
                    }}
                    onChange={this.changeHandler}
                    options={["SMS", "EMAIL", "WHATSAPP", "APP NOTIFICATION"]}
                    showCheckbox
                    className="mmm"
                  />
                </Col>
                {/* <Col lg="6" md="6">
                  <Label>Order Status</Label>
                  <CustomInput
                    readOnly
                    type="select"
                    placeholder=""
                    name="status"
                    value={this.state.status}
                    onChange={this.changeHandler}
                  >
                    <option>--Select--</option>
                    <option value="Approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="complete">Completed</option>
                    <option value="delivery">Delivery</option>
                    <option value="canceled">Canceled</option>
                </CustomInput>
                </Col> */}
                <Col lg="6" md="6" className="">
                  <FormGroup>
                    <Label>Time Slot of Delivery</Label>
                    <Input
                      type="time"
                      placeholder="Time Slot"
                      name="time_slot"
                      value={this.state.time_slot}
                      onChange={this.changeHandler}
                    />
                  </FormGroup>
                </Col>

                {this.state.phone_no.length >= 10 ? (
                  <>
                    <Col lg="6" md="6" className="mt-2">
                      <FormGroup>
                        <Label>Email</Label>
                        <Input
                          readOnly
                          type="email"
                          placeholder="sanujeshyadav@gmail.com"
                          name="email"
                          value={this.state.email}
                          onChange={this.changeHandler}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6" md="6" className="mt-2">
                      <FormGroup>
                        <Label> CustomerName</Label>
                        <Input
                          readOnly
                          type="email"
                          placeholder="Anujesh yadav"
                          name="email"
                          value={this.state.email}
                          onChange={this.changeHandler}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6" md="6" className="mt-2">
                      <FormGroup>
                        <Label>Order Zone </Label>
                        <Input
                          readOnly
                          type="text"
                          placeholder=" 5"
                          name="order_zone"
                          value={this.state.order_zone}
                          onChange={this.changeHandler}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6" md="6" className="mt-2">
                      <FormGroup>
                        <Label>Delivery Address</Label>
                        <Input
                          readOnly
                          type="textarea"
                          placeholder="23 Roshan bag colony indore"
                          name="delivery_add"
                          value={this.state.delivery_add}
                          onChange={this.changeHandler}
                        />
                      </FormGroup>
                    </Col>
                    {/* <Col lg="6" md="6">
                  <FormGroup>
                    <Label>Previous Address</Label>
                    <Input
                      type="text"
                      placeholder="Previous Address"
                      name="previous_add"
                      value={this.state.previous_add}
                      onChange={this.changeHandler}
                    />
                  </FormGroup>
                </Col> */}
                    <Col lg="6" md="6" className="mt-2">
                      <FormGroup>
                        <Label>New Address</Label>
                        <Input
                          // readOnly
                          type="textarea"
                          placeholder="151/2 akhand nagar indore"
                          name="new_address"
                          value={this.state.new_address}
                          onChange={this.changeHandler}
                        />
                      </FormGroup>
                    </Col>
                  </>
                ) : null}
              </Row>
              <hr />
              <Row className="">
                <h1 col-sm-6 className="float-left mt-2 mb-2 mx-2">
                  Add Product
                </h1>
              </Row>
              {this.state.inputlist.map((e, i) => {
                return (
                  <>
                    <hr className="mt-2 mb-2" style={{ color: "blue" }} />
                    <Row key={i}>
                      {/* <hr />
                      <hr /> */}
                      {/* <Col lg="3" md="3" className="mb-1">
                        <Label>Category name</Label>
                        <Input
                          type="select"
                          placeholder="Enter Attribute"
                          name="attribute"
                          value={this.state.attribute}
                          onChange={this.changeHandler}
                        >
                          <option>Select Category</option>
                          {this.state.attribuName?.map((attlist) => (
                            <option value={attlist?._id} key={attlist?._id}>
                              {attlist?.units_name}
                            </option>
                          ))}
                        </Input>
                      </Col> */}
                      {/* <Col lg="3" md="3" className="mb-1">
                        <Label> Select Sub Category</Label>
                        <Input
                          type="select"
                          placeholder="Enter Attribute"
                          name="attribute"
                          value={this.state.attribute}
                          onChange={this.changeHandler}
                        >
                          <option>Select Sub-Category</option>
                          {this.state.attribuName?.map((attlist) => (
                            <option value={attlist?._id} key={attlist?._id}>
                              {attlist?.units_name}
                            </option>
                          ))}
                        </Input>
                      </Col> */}
                      <Col lg="3" md="3" className="mb-1">
                        <Label>Product Name</Label>

                        <Input
                          type="select"
                          placeholder="Enter Attribute"
                          name="selected"
                          value={this.state.inputlist.selected}
                          onChange={(e) => this.handleinputchange(e, i)}
                        >
                          <option>Select Product</option>
                          {this.state.attribuName?.map((attlist) => (
                            <option value={attlist?._id} key={attlist?._id}>
                              {attlist?.units_name}
                            </option>
                          ))}
                        </Input>
                      </Col>
                      <Col lg="3" md="3" className="mb-1">
                        <Label>Attribute Value</Label>
                        <Multiselect
                          name="selected"
                          value={this.state.inputlist.selected}
                          isObject={false}
                          placeholder="Search and Select"
                          onRemove={(e) => {
                            console.log(e);
                          }}
                          onSelect={(e) => {
                            this.setState({ myvalue: e });

                            console.log(e);
                          }}
                          selectionLimit="1"
                          onChange={(e) => this.handleinputchange(e, i)}
                          options={["1 kg", "2 kg", "3 kg", "4 kg", "5kg"]}
                          showCheckbox
                          className="mmm"
                        />
                      </Col>

                      <Col lg="3" md="3">
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          placeholder="Quantity"
                          name="quantity"
                          value={this.state.inputlist.quantity}
                          onChange={(e) => this.handleinputchange(e, i)}
                        />
                      </Col>
                      {/* <Col>
                      <Button.Ripple
                        onClick={this.handleClick}
                        color="primary"
                        className="mr-1 mt-2"
                      >
                        Add new Field
                      </Button.Ripple>
                    </Col> */}
                      <Col className="d-flex">
                        {this.state.inputlist.length !== 1 && (
                          <Button.Ripple
                            color="primary"
                            className="mr-1 mt-2"
                            style={{ height: "40px" }}
                            onClick={() => this.handleremove(i)}
                          >
                            Remove
                          </Button.Ripple>
                        )}
                        {this.state.inputlist.length - 1 === i && (
                          <Button.Ripple
                            color="primary"
                            className=" mt-2"
                            style={{ height: "40px" }}
                            onClick={this.handleClick}
                          >
                            Add More
                          </Button.Ripple>
                        )}
                      </Col>
                    </Row>
                  </>
                );
              })}

              <Row className="d-flex justify-content-center">
                <hr />
                <Button.Ripple
                  color="primary"
                  type="submit"
                  className="  justify-content-center mt-2"
                >
                  Add Product
                </Button.Ripple>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </div>
    );
  }
}
export default AddExorder;
