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
  Table,
} from "reactstrap";
// import "../../../../../assets/scss/plugins/extensions/editor.scss";
import { Route } from "react-router-dom";
import { history } from "../../../../../history";
import axiosConfig from "../../../../../axiosConfig";
import "../../../../../../src/layouts/assets/scss/pages/users.scss";
import { Tabs, Tab } from "react-bootstrap-tabs";
import { Container } from "reactstrap";
import CustomerDetails from "./CustomerDetails";
import Product from "./Products/Product";
import Variant from "./Products/Variant";
export class Totals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      selectedFile: null,
      selectedName: "",
      sortorder: "",
      desc: "",
      brand_img: "",
      quantity: "",
      size: "",
      required: "",
      quant: "",
      optValue: "",
      opValue: "",
      status: "",
      inputlist: [{ selected: "", attribute: "", quantity: "" }],
    };
  }

  onChangeHandler = (event) => {
    this.setState({ selectedFile: event.target.files[0] });
    this.setState({ selectedName: event.target.files[0].name });
    console.log(event.target.files[0]);
  };

  changeHandler1 = (e) => {
    this.setState({ status: e.target.value });
  };
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

  submitHandler = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", this.state.name);
    data.append("sortorder", this.state.sortorder);
    data.append("quantity", this.state.quantity);
    data.append("size", this.state.size);
    data.append("required", this.state.required);
    data.append("desc", this.state.desc);
    data.append("quant", this.state.quant);
    data.append("optValue", this.state.optValue);
    data.append("opValue", this.state.opValue);
    data.append("status", this.state.status);
    // data.append("name", this.state.name);
    data.append("productName", this.state.productName);
    data.append("quant", this.state.quant);
    // if (this.state.selectedFile !== null) {
    //   data.append(
    //     "brand_img",
    //     this.state.selectedFile,
    //     this.state.selectedName
    //   );
    // }

    // axiosConfig
    //   .post("/addbrand", data)
    //   .then((response) => {
    //     console.log(response);
    //     this.props.history.push("/app/freshlist/house/HouseProductList");
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  };
  render() {
    return (
      <div>
        <Card>
          <CardBody>
            <Form className="m-1" onSubmit={this.submitHandler}>
              <Row>
                <Col lg="12" md="12">
                  <Table bordered className="table">
                    <thead>
                      <tr scope="row">
                        <th>Product</th>
                        <th>Model</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                        {/* <th>Action</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      <>
                        <tr scope="row">
                          <td className="p-0">
                            Vim Liquid Yellow Bottle -ML:750ml
                          </td>
                          <td>Detergent</td>
                          <td>
                            <Input
                              type="text"
                              placeholder="Quantity"
                              name="name"
                              value="1"
                              onChange={this.changeHandler}
                            />
                          </td>
                          <td>Rs 115.00</td>
                          <td>Rs 115.00</td>
                        </tr>
                        <tr scope="row">
                          <td className="p-0">
                            Vim Bar Tum Scruber-weght 250g
                          </td>
                          <td>Detergent</td>
                          <td>
                            <Input
                              type="text"
                              placeholder="Quantity"
                              name="name"
                              value="1"
                              onChange={this.changeHandler}
                            />
                          </td>
                          <td>Rs 26.00</td>
                          <td>Rs 26.00</td>
                        </tr>
                      </>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Form>
            <div>
              <Form className="m-1" onSubmit={this.submitHandler}>
                <Row className="mb-2">
                  <Col lg="12" md="12" className="mb-2">
                    <Label>
                      <span style={{ color: "red" }}>*</span>Shipping Method
                    </Label>
                    <CustomInput
                      type="select"
                      placeholder="Select Type"
                      name="customergroup"
                      // value={this.state.customergroup}
                      // onChange={this.changeHandler}
                    >
                      <option value="default">Free Shipping - 0.00</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </CustomInput>
                  </Col>
                  <Col lg="12" md="12" className="mb-2">
                    <Label>
                      <span style={{ color: "red" }}>*</span>Payment Method
                    </Label>
                    <CustomInput
                      type="select"
                      placeholder="Select Type"
                      name="customergroup"
                      // value={this.state.customergroup}
                      // onChange={this.changeHandler}
                    >
                      <option value="default">Cash On Delivery</option>
                      <option value="2">Phone Pay</option>
                      <option value="3">Google Pay</option>
                    </CustomInput>
                  </Col>
                  <Col lg="12" md="12" className="mb-2">
                    <Label>Coupon</Label>
                    <Input
                      type="text"
                      placeholder="Coupon"
                      name="Coupon"
                      // value={this.state.customer}
                      // onChange={this.changeHandler}
                    />
                  </Col>
                  <hr />
                  <Col lg="12" md="12" className="mb-2">
                    <Label>Variant</Label>
                    <Input
                      type="text"
                      placeholder="Variant"
                      name="Variant"
                      // value={this.state.customer}
                      // onChange={this.changeHandler}
                    />
                  </Col>
                  <hr />
                  <Col lg="12" md="12" className="mb-2">
                    <Label>Reward</Label>
                    <Input
                      type="text"
                      placeholder="Reward"
                      name="Reward"
                      // value={this.state.customer}
                      // onChange={this.changeHandler}
                    />
                  </Col>
                  <hr />
                  <Col lg="12" md="12" className="mb-2">
                    <Label>Order Status</Label>
                    <CustomInput
                      type="select"
                      placeholder="Select Type"
                      name="customergroup"
                      // value={this.state.customergroup}
                      // onChange={this.changeHandler}
                    >
                      <option value="default">Delivery</option>
                      <option value="2">Pending</option>
                      <option value="3">Appoved</option>
                    </CustomInput>
                  </Col>
                  <Col lg="12" md="12" className="mb-2">
                    <FormGroup>
                      <Label for="exampleText">Comment</Label>
                      <Input
                        id="exampleText"
                        name="text"
                        type="textarea"
                        placeholder="comment here"
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="12" md="12" className="mb-2">
                    <Label>Affiliate</Label>
                    <Input
                      type="text"
                      placeholder="Affiliate"
                      name="Reward"
                      // value={this.state.customer}
                      // onChange={this.changeHandler}
                    />
                  </Col>
                </Row>
                <Row>
                  <div className="text-right w-100">
                    <Button color="primary" type="submit" className="mr-1 mb-1">
                      Save
                    </Button>
                  </div>
                </Row>
              </Form>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }
}
export default Totals;
