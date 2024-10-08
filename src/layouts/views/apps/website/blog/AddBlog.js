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
} from "reactstrap";
import { history } from "../../../../history";
import axiosConfig from "../../../../axiosConfig";

export class AddNews extends Component {
  constructor(props) {
    super(props);

    this.state = {
      blog_title: "",
      category: "",
      short_desc: "",
      full_desc: "",
      blog_img: "",
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
    data.append("blog_title", this.state.blog_title);
    data.append("category", this.state.category);
    data.append("short_desc", this.state.short_desc);
    data.append("full_desc", this.state.full_desc);
    data.append("blog_img", this.state.selectedFile, this.state.selectedName);
    for (var value of data.values()) {
      console.log(value);
    }
    axiosConfig
      .post("/addblog", data)
      .then((response) => {
        console.log(response);
        this.props.history.push("/app/website/blog/blogList");
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
                Add New Blog
              </h1>
            </Col>
            <Col>
              <Button
                className=" btn btn-danger float-right"
                onClick={() => history.push("/app/website/blog/blogList")}
              >
                Back
              </Button>
            </Col>
          </Row>
          <CardBody>
            <Form className="m-1" onSubmit={this.submitHandler}>
              <Row className="mb-2">
                <Col lg="6" md="6" className="mb-3">
                  <Label>Blog Title</Label>
                  <Input
                    type="text"
                    placeholder="Enter Blog Title"
                    name="blog_title"
                    value={this.state.blog_title}
                    onChange={this.changeHandler}
                  />
                </Col>
                <Col lg="6" md="6" className="mb-3">
                  <Label>Category</Label>
                  <Input
                    type="text"
                    placeholder="Enter Blog Category"
                    name="category"
                    value={this.state.category}
                    onChange={this.changeHandler}
                  />
                </Col>
                <Col lg="6" md="6" className="mb-3">
                  <Label>Short Description</Label>
                  <Input
                    type="text"
                    placeholder="Enter Shot Description"
                    name="short_desc"
                    value={this.state.short_desc}
                    onChange={this.changeHandler}
                  />
                </Col>
                <Col lg="6" md="6" className="mb-3">
                  <Label>Full Description</Label>
                  <Input
                    type="textarea"
                    placeholder="Enter Full Description"
                    name="full_desc"
                    value={this.state.full_desc}
                    onChange={this.changeHandler}
                  />
                </Col>

                <Col lg="6" md="6" className="mb-3 ">
                  <Label className="mb-1">Blog Image</Label>
                  <Input type="file" onChange={this.onChangeHandler} />
                </Col>
              </Row>
              <Row>
                <Button.Ripple
                  color="primary"
                  type="submit"
                  className="mr-1 mb-1"
                >
                  Add Blog
                </Button.Ripple>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default AddNews;
