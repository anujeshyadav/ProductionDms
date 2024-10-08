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
        description: "",
        duration: "",
        sub_plan: "",
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
  
    axiosConfig.post("/addSubscription", this.state)
      .then((response) => {
        console.log(response);  
      
        swal("Successful!", "You clicked the button!", "success");
        this.props.history.push("/app/sellerSubs/sellerSubscription");
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
            <CardTitle>Create A Subscription Plan</CardTitle>
          </CardHeader>
          <CardBody>
            <Form className="m-1" onSubmit={this.submitHandler}>
              <Row>
              
                <Col lg="6" md="6" sm="6" className="mb-2">
                  <Label>Duration</Label>
                  <Input  
                    required 
                    type="text" 
                    name="duration"
                    placeholder="Duration"  
                    value={this.state.duration}
                    onChange={this.changeHandler} 
                  />    
                </Col>
                <Col lg="6" md="6" sm="6" className="mb-2">
                  <Label>Subscription Plan:</Label>
                  <Input
                    required
                    type="text"
                    name="sub_plan"
                    id="show_hide_password"
                    value={this.state.sub_plan}
                    onChange={this.changeHandler}
                    placeholder="Subscription Plan"
                  />
                </Col>
                <Col lg="6" md="6" sm="6" className="mb-2">
                  <Label>Description</Label>
                  <Input   
                    required 
                    type="textarea" 
                    name="description"
                    placeholder="Description" 
                    value={this.state.description}
                    onChange={this.changeHandler}
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
                </Row> 
                <Row>
                <Col lg="6" md="6" sm="6" className="mb-2">
                  <Button.Ripple
                    color="primary"
                    type="submit"
                    className="mr-1 mb-1">
                    Add Subscription plan
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