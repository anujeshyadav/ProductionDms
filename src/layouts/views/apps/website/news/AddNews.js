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
      news_title: "",
      description: "",
      news_img: "",
      selectedFile: null,
      selectedName: "",
    };
  }

  onChangeHandler = (event) => {
    this.setState({ selectedFile: event.target.files[0] });
    this.setState({ selectedName: event.target.files[0].name });
    console.log(event.target.files[0]);
  };

  // changeHandler1 = (e) => {
  //   this.setState({ status: e.target.value });
  // };
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  submitHandler = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("news_title", this.state.news_title);
    data.append("description", this.state.description);
    data.append("news_img", this.state.selectedFile, this.state.selectedName);
    //   for (var value of data.values()) {
    //     console.log(value);
    //  }
    axiosConfig
      .post("/addblognews", data)
      .then((response) => {
        console.log(response);
        // this.props.history.push("/app/category/category");
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
                Add New News
              </h1>
            </Col>
            <Col>
              <Button
                className=" btn btn-danger float-right"
                onClick={() => history.push("/app/website/news/newsList")}
              >
                Back
              </Button>
            </Col>
          </Row>
          <CardBody>
            <Form className="m-1" onSubmit={this.submitHandler}>
              <Row className="mb-2">
                <Col lg="6" md="6">
                  <Label>News Title</Label>
                  <Input
                    type="text"
                    placeholder="Enter Title or Headline"
                    name="news_title"
                    value={this.state.news_title}
                    onChange={this.changeHandler}
                  />
                </Col>
                <Col lg="6" md="6">
                  <Label>News Description</Label>
                  <Input
                    type="textarea"
                    placeholder="Enter Text"
                    name="description"
                    value={this.state.description}
                    onChange={this.changeHandler}
                  />
                </Col>

                <Col lg="6" md="6" className="mt-1">
                  <Label>News Image</Label>
                  <Input type="file" onChange={this.onChangeHandler} />
                </Col>
              </Row>
              <Row>
                <Button.Ripple
                  color="primary"
                  type="submit"
                  className="mr-1 mb-1"
                >
                  Add News
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
