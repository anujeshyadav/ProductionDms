import React, { Component } from "react";
import { Card, CardBody, Col, Form, Row, Input, Label, Button, } from "reactstrap";
import { history } from "../../../../history";
import axiosConfig from "../../../../axiosConfig";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";

export class AddNotification extends Component {
    constructor (props) {
        super(props);
        this.state = {
            desc: "",
            editorState: EditorState.createEmpty(),
        };
    }
    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
            desc: draftToHtml(convertToRaw(editorState.getCurrentContent())),
        });
    };

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
                this.props.history.push("/app/freshlist/notif/Notification");
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
                                Add Notification
                            </h1>
                        </Col>
                        <Col>
                            <Button
                                className=" btn btn-danger float-right"
                                onClick={() => history.push("/app/freshlist/notif/Notification")}
                            >
                                Back
                            </Button>
                        </Col>
                    </Row>
                    <CardBody>
                        <Form className="m-1" onSubmit={this.submitHandler}>
                            <Row className="mb-2">
                                <Col lg="6" md="6" sm="6" className="mb-2">
                                    <Label>Descripition</Label>
                                    <Editor
                                        toolbarClassName="demo-toolbar-absolute"
                                        wrapperClassName="demo-wrapper"
                                        editorClassName="demo-editor"
                                        editorState={this.state.editorState}
                                        onEditorStateChange={this.onEditorStateChange}
                                    // toolbar={{
                                    //   options: ["inline", "blockType", "fontSize", "fontFamily", "image"],
                                    //   inline: {
                                    //     options: [
                                    //       "bold",
                                    //       "italic",
                                    //       "underline",
                                    //       "strikethrough",
                                    //       "monospace",
                                    //     ],
                                    //     bold: { className: "bordered-option-classname" },
                                    //     italic: { className: "bordered-option-classname" },
                                    //     underline: { className: "bordered-option-classname" },
                                    //     strikethrough: { className: "bordered-option-classname" },
                                    //     code: { className: "bordered-option-classname" },
                                    //   },
                                    //   blockType: {
                                    //     className: "bordered-option-classname",
                                    //   },
                                    //   fontSize: {
                                    //     className: "bordered-option-classname",
                                    //   },
                                    //   fontFamily: {
                                    //     className: "bordered-option-classname",
                                    //   },
                                    //   image: {
                                    //     className: "bordered-option-classname",
                                    //   },

                                    // }}
                                    />
                                    <br />
                                    <Button color="primary">Add New T&C</Button>
                                </Col>
                            </Row>

                        </Form>
                    </CardBody>
                </Card>
            </div>
        );
    }
}
export default AddNotification;