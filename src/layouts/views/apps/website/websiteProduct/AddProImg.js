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
  CustomInput,
} from "reactstrap";
import { history } from "../../../../history";
import axiosConfig from "../../../../axiosConfig";

export class AddProImg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product_title: "",
      product_img: "",
      selectedFile: null,
      selectedName: "",
    };
  }
  onChangeHandler = (event) => {
    this.setState({ selectedFile: event.target.files[0] });
    this.setState({ selectedName: event.target.files[0].name });
    console.log(event.target.files[0]);
  };
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  submitHandler = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("product_title", this.state.product_title);
    if (this.state.selectedFile !== null) {
      data.append(
        "product_img",
        this.state.selectedFile,
        this.state.selectedName
      );
    }

    for (var value of data.values()) {
      console.log(value);
    }
    for (var key of data.keys()) {
      console.log(key);
    }
    axiosConfig
      .post("/add_Img", data)
      .then((response) => {
        console.log(response);
        this.props.history.push("/app/website/websiteProduct/websiteProImg");
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
                Add Product Image
              </h1>
            </Col>
            <Col>
              <Button
                className=" btn btn-danger float-right"
                onClick={() =>
                  history.push("/app/website/websiteProduct/websiteProImg")
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
                  <Label>Image Title</Label>
                  <Input
                    type="text"
                    name="product_title"
                    value={this.state.product_title}
                    onChange={this.changeHandler}
                  />
                </Col>
                <Col lg="6" md="6">
                  <Label>Product Image </Label>
                  <CustomInput type="file" onChange={this.onChangeHandler} />
                  <span className="">
                    (Enter image with 240px X 220px with PNG format)
                  </span>
                </Col>
              </Row>
              <Row>
                <Button.Ripple
                  color="primary"
                  type="submit"
                  className="mr-1 mb-1"
                >
                  Add Product Image
                </Button.Ripple>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default AddProImg;
