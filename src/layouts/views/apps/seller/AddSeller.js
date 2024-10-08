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
export default class AddSeller extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seller_name: "",
      email: "",
      password: "",
      confirm_password: "",
      sortorder:"",
      selectedFile: null,
      status: ""
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
  
    axiosConfig.post("/seller_signup", this.state)
      .then((response) => {
        console.log(response);  
        // alert("Seller Added Successful")
        swal("Successful!", "You clicked the button!", "success");
        this.props.history.push("/app/seller/sellerList");
      })
      .catch((error) => {
        //  swal("Error!", "You clicked the button!", "error");
        console.log(error);
      });
  };
  render() {
    return (
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Create A Seller</CardTitle>
          </CardHeader>
          <CardBody>
            <Form className="m-1" onSubmit={this.submitHandler}>
              <Row>
                <Col lg="6" md="6" sm="6" className="mb-2">
                  <Label>Seller Name</Label>
                  <Input   
                    required 
                    type="text" 
                    name="seller_name"
                    placeholder="Enter Seller Name" 
                    value={this.state.seller_name}
                    onChange={this.changeHandler}
                  />
                </Col>
                <Col lg="6" md="6" sm="6" className="mb-2">
                  <Label>Seller Email</Label>
                  <Input  
                    required 
                    type="email" 
                    name="email"
                    placeholder="Email"  
                    value={this.state.email}
                    onChange={this.changeHandler} 
                  />    
                </Col>
                <Col lg="6" md="6" sm="6" className="mb-2">
                  <Label>Password:</Label>
                  <Input
                    required
                    type="password"
                    name="password"
                    id="show_hide_password"
                    value={this.state.password}
                    onChange={this.changeHandler}
                    placeholder="Set Password For User"
                  />
                </Col>
                <Col lg="6" md="6" sm="6" className="mb-2">
                  <Label>Confirm Password:</Label>
                  <Input
                    required
                    type="password"
                    name="confirm_password"
                    id="show_hide_password"
                    value={this.state.confirm_password}
                    onChange={this.changeHandler}
                    placeholder="Set Confirm Password For User"
                  />
                  </Col>
                  <Col lg="6" md="6" sm="6" className="mb-2">
                    <Label>Short Order</Label>
                    <Input   
                      required 
                      type="text" 
                      name="sortorder"
                      placeholder="Enter Sort Order"  
                      value={this.state.sortorder}
                      onChange={this.changeHandler}
                    /> 
                </Col>
                <Col lg="6" md="6" sm="6" className="mb-2">
                  <Label className="mb-1">Status</Label>
                  <div
                    className="form-label-group"
                    onChange={(e) => this.changeHandler1(e)}>
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
              </Row> 
              <Row>
                <Col lg="6" md="6" sm="6" className="mb-2">
                  <Button.Ripple
                    color="primary"
                    type="submit"
                    className="mr-1 mb-1">
                    Add Seller
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