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

export class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      productlist: "",
      quantity: "",
      selectedFile: null,
      selectedName: "",
      sortorder: "",
      inputlist: [{ selected: "", attribute: "", quantity: "" }],
    };
  }
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  changeHandler1 = (e) => {
    this.setState({ status: e.target.value });
  };
  submitHandler = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", this.state.name);
    data.append("productName", this.state.productName);
    data.append("quantity", this.state.quantity);
    data.append("sortorder", this.state.sortorder);
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
          <div style={{ color: "#000000" }}>Add Products(s)</div>
          <CardBody>
            <Form className="m-1" onSubmit={this.submitHandler}>
              <Row className="mb-2">
                <Col lg="12" md="12" className="mb-2">
                  <Label>Choose Product</Label>
                  <CustomInput
                    type="select"
                    placeholder="Select Type"
                    name="type"
                    value={this.state.productlist}
                    onChange={this.changeHandler}
                  >
                    <option value="tomato">tomato</option>
                    <option value="onion">onion</option>
                    <option value="apple">apple</option>
                  </CustomInput>
                </Col>
                <Col lg="12" md="12" className="mb-2">
                  <Label>Quantity</Label>
                  <Input
                    type="text"
                    placeholder="Quantity"
                    name="quantity"
                    value={this.state.quantity}
                    onChange={this.changeHandler}
                  />
                </Col>
                <hr />
              </Row>
              <Row>
                <div className="text-right w-100">
                  <Button color="primary" type="submit" className="mr-1 mb-1">
                    Add Product
                  </Button>
                </div>
              </Row>

              <Row>
                <Col className="rrr">
                  <Button color="secondary" type="submit" className="mr-1 mb-1">
                    Back
                  </Button>
                  <Button color="primary" type="submit" className="mr-1 mb-1 ">
                    Continue
                  </Button>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </div>
    );
  }
}
export default Product;
