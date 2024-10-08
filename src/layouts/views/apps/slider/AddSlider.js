import React, { Component } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Row,
  Col,
  Form,
  Label,
  Input,
  CustomInput,
  Button,
} from "reactstrap";
import  axiosConfig from "../../../axiosConfig";
import swal from 'sweetalert';
export default class AddSilder extends Component {
  constructor(props) {
    super(props);
    this.state = {
        banner_title:"",
        banner_img: "",
        bannertype: "",
        selectedFile: undefined,
        selectedName: "",
        status: ""
    };
  }
  onChangeHandler = (event) => {
    this.setState({ selectedFile: event.target.files[0] });
    this.setState({ selectedName: event.target.files[0].name });
    console.log(event.target.files[0]);
  };
  onChangeHandler = (event) => {
    this.setState({ selectedFile: event.target.files });
    this.setState({ selectedName: event.target.files.name });
    console.log(event.target.files);
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
    data.append("banner_title", this.state.banner_title);
    data.append("bannertype", this.state.bannertype);
    data.append("status", this.state.status);
    for (const file of this.state.selectedFile) {
      if (this.state.selectedFile !== null) {
        data.append("banner_img", file, file.name);
      }
   }
   for (var value of data.values()) {
    console.log(value);
  }
  for (var key of data.keys()) {
    console.log(key);
  }
  axiosConfig.post("/addbanner", data)
    .then((response) => {
    console.log(response);
    swal("Successful!", "You clicked the button!", "success");
    this.props.history.push("/app/slider/sliderList");
  })
    .catch((error) => {
      console.log(error);
    });
  };
  render() {
    return (
      <div>
        <Card>
          <CardHeader>
            <CardTitle>New Slider</CardTitle>
          </CardHeader>
          <CardBody>
            <Form className="m-1" onSubmit={this.submitHandler}>
              <Row>
                <Col lg="6" md="6" sm="6" className="mb-2">
                  <Label>Banner Title</Label>
                  <Input   
                    required 
                    type="text" 
                    name="banner_title"
                    placeholder="Enter Banner Title" 
                    value={this.state.banner_title}
                    onChange={this.changeHandler}/>
                </Col>
                <Col lg="6" md="6" sm="6" className="mb-2">
                    <Label>Banner image</Label>
                    <CustomInput  
                      type="file"
                      multiple
                      onChange={this.onChangeHandler}/>    
                  </Col>
                  <Col lg="6" md="6" sm="6" className="mb-2">
                  <Label>Banner Title</Label>
                  <CustomInput   
                    required 
                    type="select" 
                    name="bannertype"
                    placeholder="Enter Banner Type" 
                    value={this.state.bannertype}
                    onChange={this.changeHandler}>
                      <option value="select">--Select--</option>
                      <option value="AB">AB</option>
                      <option value="PV">PV</option>
                  </CustomInput>        
                </Col>
              </Row> 
              <Col lg="6" md="6" sm="6" className="mb-2">
                  <Label className="mb-1">Status</Label>
                  <div
                    className="form-label-group"
                    onChange={(e) => this.changeHandler1(e)}
                  >
                    <input
                      style={{ marginRight: "3px" }}
                      type="radio"
                      name="status"
                      value="Active"
                    />
                    <span style={{ marginRight: "20px" }}>Active</span>
                    <input
                      style={{ marginRight: "3px" }}
                      type="radio"
                      name="status"
                      value="Inactive"
                    />
                    <span style={{ marginRight: "3px" }}>Inactive</span>
                  </div>
                </Col> 
              <Row>
                <Col lg="6" md="6" sm="6" className="mb-2">
                  <Button.Ripple
                    color="primary"
                    type="submit"
                    className="mr-1 mb-1">
                    Add Slider
                  </Button.Ripple>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </div>
    );
  }
}