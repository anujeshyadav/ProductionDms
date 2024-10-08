import React, { Component } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardText,
  Col,
  Form,
  Row,
  Input,
  Label,
  Button,
  FormGroup,
  CustomInput,
  Table,
  CardHeader,
} from "reactstrap";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../../../../../assets/scss/plugins/extensions/editor.scss";
import draftToHtml from "draftjs-to-html";
import { Route } from "react-router-dom";

import { history } from "../../../../../history";
import axiosConfig from "../../../../../axiosConfig";

export class ImageGallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      selectedFile: null,
      selectedName: "",
      sortorder: "",
      //   desc: "",
      //   brand_img: "",
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
            {/* <Card
              className="my-2"
              color="primary"
              outline
              style={{
                width: "100%",
              }}
            >
              <CardHeader>Header</CardHeader>
              <CardBody style={{ backgroundColor: "#f0f0f0" }}>
                <img
                  alt="Card cap"
                  src="https://picsum.photos/318/180"
                  // width="100%"
                />
              </CardBody>
            </Card> */}
            <Row style={{ border: "1px solid gray" }}>Banner</Row>
            <Row style={{ border: "1px solid gray" }}>
              <img
                width="200px"
                alt="Card cap"
                src="https://picsum.photos/318/180"
              />
            </Row>
            <Row style={{ border: "1px solid gray" }}>Image</Row>
            <Row style={{ border: "1px solid gray" }}>
              <img
                alt="Card cap"
                src="https://picsum.photos/318/180"
                width="200px"
              />
            </Row>
            <Row style={{ border: "1px solid gray" }}>Additional Images</Row>
            <Row style={{ border: "1px solid gray" }}>
              <img
                alt="Card cap"
                src="https://picsum.photos/318/180"
                width="200px"
              />
            </Row>
          </CardBody>
        </Card>
      </div>
    );
  }
}
export default ImageGallery;
