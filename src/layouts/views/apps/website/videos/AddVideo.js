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

export class AddVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      video_title: "",
      video_url: "",
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
    console.log(this.state);
    const data = new FormData();
    data.append("video_title", this.state.video_title);
    if (this.state.selectedFile !== null) {
      data.append(
        "video_url",
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
      .post("/addvideo", data)
      .then((response) => {
        console.log(response);
        this.props.history.push("/app/website/videos/videosList");
        alert("Video Added");
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
                Add New Video
              </h1>
            </Col>
            <Col>
              <Button
                className=" btn btn-danger float-right"
                onClick={() => history.push("/app/website/videos/videosList")}
              >
                Back
              </Button>
            </Col>
          </Row>
          <CardBody>
            <Form className="m-1" onSubmit={this.submitHandler}>
              <Row className="mb-2">
                <Col lg="6" md="6">
                  <Label>Video Title</Label>
                  <Input
                    type="text"
                    name="video_title"
                    value={this.state.video_title}
                    onChange={this.changeHandler}
                  />
                </Col>
                {/* <Col lg="6" md="6">
                  <Label>Video URL</Label>
                  <Input
                    type="text"
                    name="video_url"
                    value={this.state.video_url}
                    onChange={this.changeHandler}
                  />
                </Col> */}

                <Col lg="6" md="6" className="mb-2">
                  <Label>Video</Label>
                  <CustomInput type="file" onChange={this.onChangeHandler} />
                </Col>
              </Row>
              <Row>
                <Button.Ripple
                  color="primary"
                  type="submit"
                  className="mr-1 mb-1"
                >
                  Add Video
                </Button.Ripple>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default AddVideo;
