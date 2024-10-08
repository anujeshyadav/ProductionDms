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
import axios from "axios";
export default class AddFund extends Component {
    constructor (props) {
        super(props);
        this.state = {
            first_name: "",
            last_name: "",
            customer_email: "",
            mobile_no: "",
            sortorder: "",
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


        axios.post("http://35.154.86.59/api/user/customersignup", this.state)
            .then((response) => {
                console.log(response);
                alert("Customer Added Successful")
                this.props.history.push("/app/customer/customerList");
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
                        <CardTitle>Add Fund</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Form className="m-1" onSubmit={this.submitHandler}>
                            <Row>
                                <Col lg="6" md="6" sm="6" className="mb-2">
                                    <Label>Customer</Label>
                                    <CustomInput
                                        type="select"
                                        name="type"
                                        value={this.state.type}
                                        onChange={this.changeHandler}
                                    >
                                        <option>--Select Customer--</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                    </CustomInput>
                                </Col>
                                <Col lg="6" md="6" sm="6" className="mb-2">
                                    <Label>Fund</Label>
                                    <Input
                                        required
                                        type="text"
                                        name="last_name"
                                        placeholder="Enter Last Name"
                                        value={this.state.last_name}
                                        onChange={this.changeHandler}>
                                    </Input>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg="6" md="6" sm="6" className="mb-2">
                                    <Button.Ripple
                                        color="primary"
                                        type="submit"
                                        className="mr-1 mb-1">
                                        Submit
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