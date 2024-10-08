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
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// import "../../../../assets/scss/plugins/extensions/editor.scss";
import "../../../../../assets/scss/plugins/extensions/editor.scss";
import draftToHtml from "draftjs-to-html";
import { Route } from "react-router-dom";
// -------------------------

import { history } from "../../../../../history";
import axiosConfig from "../../../../../axiosConfig";

export class General extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      selectedFile: null,
      selectedName: "",
      sortorder: "",
      desc: "",
      brand_img: "",
      status: "",
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
    data.append("sortorder", this.state.sortorder);
    data.append("desc", this.state.desc);
    data.append("status", this.state.status);
    if (this.state.selectedFile !== null) {
      data.append(
        "brand_img",
        this.state.selectedFile,
        this.state.selectedName
      );
    }
    //   for (var value of data.values()) {
    //     console.log(value);
    //  }
    axiosConfig
      .post("/addbrand", data)
      .then((response) => {
        console.log(response);
        this.props.history.push("/app/freshlist/house/HouseProductList");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  render() {
    return (
      <div>
        <Card>
          {/* <Row className="m-2">
            <Col>
              <h1 col-sm-6 className="float-left">
                General
              </h1>
            </Col>
            <Col>
              <Button
                className=" btn btn-danger float-right"
                onClick={() =>
                  history.push("/app/freshlist/house/houseProductList")
                }
              >
                Back
              </Button>
            </Col>
          </Row> */}
          <CardBody>
            <Form className="m-1" onSubmit={this.submitHandler}>
              <Row className="mb-2">
                <Col lg="12" md="12" className="mb-2">
                  <Label> Product Name</Label>
                  <Input
                    type="text"
                    placeholder="Product Name"
                    name="name"
                    value={this.state.name}
                    onChange={this.changeHandler}
                  />
                </Col>
                <Col lg="12" md="12">
                  <FormGroup>
                    <Label>Description</Label>
                    <Editor
                      toolbarClassName="demo-toolbar-absolute"
                      wrapperClassName="demo-wrapper"
                      editorClassName="demo-editor"
                      editorState={this.state.editorState}
                      onEditorStateChange={this.onEditorStateChange}
                      toolbar={{
                        image: {
                          uploadCallback: this.uploadImageCallBack,
                          previewImage: true,
                          alt: { present: false, mandatory: false },
                          uploadEnabled: true,
                          inputAccept:
                            "image/gif,image/jpeg,image/jpg,image/png,image/svg",
                        },
                      }}
                    />
                  </FormGroup>
                </Col>
                <hr />
                <Col lg="12" md="12" className="mb-2">
                  <Label> Meta Tag Title</Label>
                  <Input
                    type="text"
                    placeholder="Meta Tag"
                    name="name"
                    value={this.state.name}
                    onChange={this.changeHandler}
                  />
                </Col>
                <hr />
                {/* <Col lg="12" md="12" className="mb-2">
                  <Label> Meta Tag Description</Label>
                  <Input
                    type="text"
                    placeholder="Meta Tag Description"
                    name="name"
                    value={this.state.name}
                    onChange={this.changeHandler}
                  />
                </Col> */}
                <Col lg="12" md="12" className="mb-1">
                  <Label>MetaData</Label>
                  <textarea
                    type="text"
                    rows={4}
                    className="form-control"
                    placeholder="MetaData"
                    name="type"
                    value={this.state.sortorder}
                    onChange={this.changeHandler}
                  />
                </Col>
                {/* <Col lg="12" md="12" className="mb-2">
                  <Label> Meta Tag Keywords</Label>
                  <Input
                    type="text"
                    placeholder="Meta Tag Keywords"
                    name="name"
                    value={this.state.name}
                    onChange={this.changeHandler}
                  />
                </Col> */}
                <Col lg="12" md="12" className="mb-1">
                  <Label>Meta Tag Keywords</Label>
                  <textarea
                    type="text"
                    rows={4}
                    className="form-control"
                    placeholder="Meta Tag Keywords"
                    name="type"
                    value={this.state.sortorder}
                    onChange={this.changeHandler}
                  />
                </Col>
                <Col lg="12" md="12" className="mb-2">
                  <Label> Product Tag</Label>
                  <Input
                    type="text"
                    placeholder="Product Tag"
                    name="name"
                    value={this.state.name}
                    onChange={this.changeHandler}
                  />
                </Col>
              </Row>
              {/* <Row>
                <Button.Ripple
                  color="primary"
                  type="submit"
                  className="mr-1 mb-1"
                >
                  Update
                </Button.Ripple>
              </Row> */}
            </Form>
          </CardBody>
        </Card>
      </div>
    );
  }
}
export default General;
