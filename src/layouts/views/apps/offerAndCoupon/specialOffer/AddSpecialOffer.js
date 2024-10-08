import React, { Component } from "react";
import {
  Card,
  CardBody,
  Col,
  Form,
  Row,
  Input,
  CustomInput,
  Label,
  Button,
} from "reactstrap";
import { history } from "../../../../history";
import axiosConfig from "../../../../axiosConfig";
export default class AddSpecialOffer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      specialoffer_title: "",
      product: "",
      rate: "",
      product_qty: "",
      sortorder: "",
      selectedFile: null,
      selectedName: "",
      status: "",
    };
  this.state = {
   allProduct1: [],
  };
}
componentDidMount() {
 //All Product 
    axiosConfig
    .get("/getproduct")
    .then((response) => {
      console.log(response);
      this.setState({ allProduct1: response.data.data });
    })
  .catch((error) => {
    console.log(error);
  });
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
  submitHandler = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("specialoffer_title", this.state.specialoffer_title);
    data.append("product", this.state.product);
    data.append("rate", this.state.rate);
    data.append("product_qty", this.state.product_qty);
    data.append("sortorder", this.state.sortorder);
    data.append("status", this.state.status);
    data.append(
      "offer_img",
      this.state.selectedFile,
      this.state.selectedName
    );
      for (var value of data.values()) {
        console.log(value);
      }
      for (var key of data.keys()) {
        console.log(key);
      }
    axiosConfig
    .post("http://35.154.86.59/api/admin/add_specialoffer", data)
    .then((response) => {
      console.log(response.data);
      this.props.history.push("/app/offerAndCoupon/specialOffer/specialOfferList");
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
            <Col>
              <h1 col-sm-6 className="float-left">
                Add special Offer
              </h1>
            </Col>
            <Col>
              <Button
                className=" btn btn-danger float-right"
                onClick={() =>
                  history.push("/app/offerAndCoupon/specialOffer/specialOfferList")
                }
              >
                Back
              </Button>
            </Col>
          </Row>
          <CardBody>
            <Form className="m-1" onSubmit={this.submitHandler}>
              <Row className="mb-2">
                <Col lg="6" md="6">
                  <Label>Offer Title</Label>
                  <Input
                    type="text"
                    name="specialoffer_title"
                    value={this.state.specialoffer_title}
                    onChange={this.changeHandler}
                  />
                </Col>
              
                <Col lg="6" md="6" sm="6" className="mb-2">
                  <Label>Product</Label>
                  <CustomInput
                    type="select"
                    name="product"
                    value={this.state.product}
                    onChange={this.changeHandler}
                  >
                    {this.state.allProduct1.map((alproduct) => (
                      <option
                        value={alproduct._id}
                        key={alproduct._id}
                      >
                        {alproduct.product_name}
                      </option>
                    ))}
                  </CustomInput>
                </Col>
                <Col lg="6" md="6" className="mb-1">
                  <Label>Rate</Label>
                  <Input
                    type="text"
                    name="rate"
                    value={this.state.rate}
                    onChange={this.changeHandler}
                  />
                </Col>
                <Col lg="6" md="6" className="mb-1">
                  <Label>Product Qty</Label>
                  <Input
                    type="number"
                    name="product_qty"
                    value={this.state.product_qty}
                    onChange={this.changeHandler}
                  />
                </Col>
                <Col lg="6" md="6">
                  <Label>Image</Label>
                  <CustomInput type="file" onChange={this.onChangeHandler} />
                </Col>
                <Col lg="6" md="6" className="mb-1">
                  <Label>Short Order</Label>
                  <Input
                    type="text"
                    name="sortorder"
                    value={this.state.sortorder}
                    onChange={this.changeHandler}
                  />
                </Col>
                <Col lg="6" md="6" sm="6" className="mb-2 mt-1">
                  <Label className="mb-1">Status</Label>
                  <div
                    className="form-label-group"
                    onChange={(e) => this.changeHandler1(e)}
                  >
                    <input
                      style={{ marginRight: "3px" }}
                      type="radio"
                      name="status"
                      value="Active"
                    />
                    <span style={{ marginRight: "20px" }}>Active</span>
                    <input
                      style={{ marginRight: "3px" }}
                      type="radio"
                      name="status"
                      value="Inactive"
                    />
                    <span style={{ marginRight: "3px" }}>Inactive</span>
                  </div>
                </Col>
              </Row>
              <Row>
                <Button.Ripple
                  color="primary"
                  type="submit"
                  className="mr-1 mb-1"
                >
                  Add Special Offer
                </Button.Ripple>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </div>
    );
  }
}