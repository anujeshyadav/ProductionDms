import React, { Component } from "react";

import {
    Card,
    CardBody,
    Col,
    Form,
    Row,
    Input,
    CustomInput,
    Label,
    Button,
} from "reactstrap";
import { history } from "../../../../history";
import axiosConfig from "../../../../axiosConfig";

export class FilterOption extends Component {
    constructor (props) {
        super(props);

        this.state = {
            name: "",
            selectedFile: null,
            selectedName: "",
            sortorder: "",
            desc: "",
            product_img: "",
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
    submitHandler = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("name", this.state.name);
        data.append("sortorder", this.state.sortorder);
        data.append("desc", this.state.desc);
        data.append("status", this.state.status);
        data.append(
            "product_img",
            this.state.selectedFile,
            this.state.selectedName
        );
        //   for (var value of data.values()) {
        //     console.log(value);
        //  }
        axiosConfig
            .post(" /addproductcategory", data)
            .then((response) => {
                console.log(response);
                this.props.history.push("/app/category/category");
            })
            .catch((error) => {
                console.log(error);
            });
    }; changeHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    render() {
        return (
            <div>
                <Row>
                    <Col className="float-left">
                        Wallet
                    </Col>
                    <Col className="12" style={{ marginBottom: '15px', marginLeft: '75rem' }}>
                        <Button.Ripple
                            color="primary"
                            onClick={() => history.push("/app/freshlist/customer/addFund")}
                        >
                            Add Fund
                        </Button.Ripple>
                    </Col>

                </Row>
                <div>
                    <Card>
                        <Row className="m-1">
                            <Col >
                                <h3 col-sm-6 className="float-left">
                                    Filter Option
                                </h3>
                            </Col>
                        </Row>
                        <CardBody>
                            <Form className="m-1" onSubmit={this.submitHandler}>
                                <Row className="mb-2">
                                    <Col>
                                        <h5>From</h5>
                                        <Input
                                            required
                                            type="date"
                                            name="date"
                                            placeholder="Enter Date"
                                            value={this.state.date}
                                            onChange={this.changeHandler}
                                        ></Input>
                                    </Col>
                                    <Col>
                                        <h5>To</h5>
                                        <Input
                                            required
                                            type="date"
                                            name="date"
                                            placeholder="Enter Date"
                                            value={this.state.date}
                                            onChange={this.changeHandler}
                                        ></Input>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg="6" md="6" className="mb-2">

                                        <Label>All</Label>
                                        <CustomInput
                                            type="select"
                                            name="type"
                                            value={this.state.type}
                                            onChange={this.changeHandler}
                                        >
                                            <option>--All--</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                        </CustomInput>
                                    </Col>
                                    <Col lg="6" md="6" className="mb-1">
                                        <Label>Select Customer</Label>
                                        <CustomInput
                                            type="select"
                                            name="desc"
                                            value={this.state.desc}
                                            onChange={this.changeHandler}
                                        >
                                            <option>---Select Customer---</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                        </CustomInput>
                                    </Col>
                                </Row>
                                <div style={{ marginBottom: '15px', float: 'right' }}>
                                    <Button.Ripple
                                        color="primary"
                                        onClick={() => this.gridApi.exportDataAsCsv()}>
                                        Filter
                                    </Button.Ripple>
                                </div>
                            </Form>
                        </CardBody>
                    </Card>
                </div >

            </div >
        );
    }
}
export default FilterOption;