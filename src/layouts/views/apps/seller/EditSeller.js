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
} from "reactstrap";
import { history } from "../../../history";
import axiosConfig from "../../../axiosConfig";
import "react-toastify/dist/ReactToastify.css";
export class EditSeller extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seller_name: "",
      seller_email: "",
      password: "",
      confirm_password: "",
      sortorder:"",
      status: ""
    };
  }
  componentDidMount() {
    // console.log(this.props.match.params);
    let { id } = this.props.match.params;
      axiosConfig
        .get(`/viewoneseller/${id}`)
        .then((response) => {
          console.log(response);
          this.setState({
            name: response.data.data.name,
            email: response.data.data.email,
            mobile: response.data.data.mobile,
            rolename: response.data.data.rolename,
            status: response.data.data.status,
          });
        })
      .catch((error) => {
        console.log(error);
      });
    }
    changeHandler1 = (e) => {
      this.setState({ status: e.target.value });
    };
    changeHandler = (e) => {
      this.setState({ [e.target.name]: e.target.value });
    };
    submitHandler = (e) => {
      e.preventDefault();
  
    let { id } = this.props.match.params;
    axiosConfig
      .post(`/editseller/${id}`,this.state)
      .then((response) => {
        console.log(response);
        this.props.history.push("/app/seller/sellerList");
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
                Edit Seller
              </h1>
            </Col>
            <Col>
              <Button
                className=" btn btn-danger float-right"
                onClick={() => history.push("/app/seller/sellerList")}
              >
                Back
              </Button>
            </Col>
          </Row>
          <CardBody>
            <Form className="m-1" onSubmit={this.submitHandler}>
              <Row className="mb-2">
                <Col lg="6" md="6">
                  <FormGroup>
                    <Label>Seller Name</Label>
                    <Input
                      type="text"
                      placeholder="Seller Name"
                      name="seller_name"
                      value={this.state.seller_name}
                      onChange={this.changeHandler}
                    />
                  </FormGroup>
                </Col>
                <Col lg="6" md="6">
                  <FormGroup>
                    <Label>Seller Email</Label>
                    <Input
                      type="email"
                      placeholder="Seller Name"
                      name="seller_email"
                      value={this.state.seller_email}
                      onChange={this.changeHandler}
                    />
                  </FormGroup>
                </Col>
                <Col lg="6" md="6">
                  <FormGroup>
                    <Label>Sort Order</Label>
                    <Input
                      type="number"
                      placeholder="Sort Order"
                      name="sortorder"
                      value={this.state.sortorder}
                      onChange={this.changeHandler}
                    />
                  </FormGroup>
                </Col>
                <Col lg="6" md="6" sm="6" className="mb-2 mt-1">
                  <FormGroup>
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
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Button.Ripple
                  color="danger"
                  type="submit"
                  className="mr-1 mb-1"
                >
                  Update Seller
                </Button.Ripple>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </div>
    );
  }
}
export default EditSeller;