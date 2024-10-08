import React from "react";
import { Card, CardBody, Col, Row, Form, Button } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../../../assets/scss/plugins/extensions/editor.scss";
import axiosConfig from "../../../axiosConfig";
import { history } from "../../../history";
import swal from 'sweetalert';

class AddPolicy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      description: "",
      editorState: EditorState.createEmpty(),
    };
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
      description: draftToHtml(convertToRaw(editorState.getCurrentContent())),
    });
  };

  submitHandler = (e) => {
    e.preventDefault();

    // const data = new FormData();
    // data.append("description", this.state.description);

    axiosConfig
      .post("/addprivacy_policy", this.state)
      .then((response) => {
        console.log(response);
        this.props.history.push("/app/privacyPolicy/privacyPolicy");
        // alert("Privacy Policy Added Successfully !");
        swal("Good job!", "You clicked the button!", "success");

      })
      .catch((error) => {
        console.log(error);
      });

    // this.state.editorState.getCurrentContent().getPlainText();
  };

  render() {
    return (
      <Card>
        <Row className="m-2">
          <Col>
            <h1 col-sm-6 className="float-left">
              Add New Privacy Policy
            </h1>
          </Col>
          <Col>
            <Button
              className=" btn btn-danger float-right"
              onClick={() =>history.push("/app/privacyPolicy/privacyPolicy")
              }
            >
              Back
            </Button>
          </Col>
        </Row>
        <CardBody>
          <Form onSubmit={this.submitHandler}>
            <Editor
              toolbarClassName="demo-toolbar-absolute"
              wrapperClassName="demo-wrapper"
              editorClassName="demo-editor"
              editorState={this.state.editorState}
              onEditorStateChange={this.onEditorStateChange}
              toolbar={{
                options: ["inline", "blockType", "fontSize", "fontFamily"],
                inline: {
                  options: [
                    "bold",
                    "italic",
                    "underline",
                    "strikethrough",
                    "monospace",
                  ],
                  bold: { className: "bordered-option-classname" },
                  italic: { className: "bordered-option-classname" },
                  underline: { className: "bordered-option-classname" },
                  strikethrough: { className: "bordered-option-classname" },
                  code: { className: "bordered-option-classname" },
                },
                blockType: {
                  className: "bordered-option-classname",
                },
                fontSize: {
                  className: "bordered-option-classname",
                },
                fontFamily: {
                  className: "bordered-option-classname",
                },
              }}
            />
            <br/>
            <Button color="primary">Add New Policy</Button>
          </Form>
        </CardBody>
      </Card>
    );
  }
}
export default AddPolicy;
