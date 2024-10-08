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

export class Variant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      productlist: "",
      quantity: "",
      selectedFile: null,
      selectedName: "",
      sortorder: "",
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
  submitHandler = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", this.state.name);
    data.append("productName", this.state.productName);
    data.append("quantity", this.state.quantity);
    data.append("sortorder", this.state.sortorder);
  };
  render() {
    return (
      <div>
        <Card>
          <div style={{ color: "#000000" }}>Add Variant(s)</div>
          <CardBody>
            <Form className="m-1" onSubmit={this.submitHandler}>
              <Row className="mb-2">
                <Col lg="12" md="12" className="mb-2">
                  <Label>Choose Variant</Label>
                  <CustomInput
                    type="select"
                    placeholder="Select Type"
                    name="type"
                    value={this.state.productlist}
                    onChange={this.changeHandler}
                  >
                    <option value="1">1</option>
                    <option value="onion">2</option>
                    <option value="apple">3</option>
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
                <div style={{ textAlign: "right", width: "100%" }}>
                  <Button
                    color="primary"
                    className="mr-1 mb-1"
                    // onClick={this.handleClick}
                  >
                    Add Variant
                  </Button>
                </div>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </div>
    );
  }
}
export default Variant;
