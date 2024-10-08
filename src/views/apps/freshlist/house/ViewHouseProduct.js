import React from "react";
import {
    Card,
    CardBody,
    Row,
    Col, Media,
    Button,
    Breadcrumb,
    BreadcrumbItem,
} from "reactstrap";
import { history } from "../../../../history";
import "../../../../assets/scss/pages/app-ecommerce-shop.scss";
import "../../../../assets/scss/pages/users.scss";
import axiosConfig from "../../../../axiosConfig";
import { Route } from "react-router-dom";
class ViewHouseProduct extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            data: {},
        };
    }

    componentDidMount() {
        let { id } = this.props.match.params;
        axiosConfig
            .get(`/admin/viewone_product/${id}`)

            .then((response) => {
                console.log(response.data.data);
                this.setState({ data: response.data.data });
            })
            .catch((error) => {
                console.log(error.response);
            });
    }

    render() {
        return (
            <React.Fragment>
                <div>
                    <Row>
                        <Col sm="12">
                            <div>
                                <Breadcrumb listTag="div">
                                    <BreadcrumbItem href="/analyticsDashboard" tag="a">
                                        Home
                                    </BreadcrumbItem>
                                    <BreadcrumbItem
                                        href="/app/freshlist/house/houseProductList"
                                        tag="a"
                                    >
                                        Customer List
                                    </BreadcrumbItem>
                                    <BreadcrumbItem active> View Customer List</BreadcrumbItem>
                                </Breadcrumb>
                            </div>
                        </Col>
                    </Row>
                    <Card className="overflow-hidden app-ecommerce-details">
                        <Row className="m-2">
                            <Col>
                                <h1 col-sm-6 className="float-left">
                                    View Customer List
                                </h1>
                            </Col>
                            <Col>
                                <Route
                                    render={({ history }) => (
                                        <Button
                                            className=" btn btn-danger float-right"
                                            onClick={() =>
                                                history.push("/app/freshlist/house/houseProductList")
                                            }
                                        >
                                            Back
                                        </Button>
                                    )}
                                />
                            </Col>
                        </Row>
                        <CardBody className="pb-0">
                            <Row className="ml-4">
                                <Col sm="9" md="12" lg="12">
                                    <div className="users-page-view-table">
                                        <div className="d-flex user-info">
                                            <div className="user-info-title font-weight-bold">
                                                Product Name :
                                            </div>
                                            <div className="text-truncate">
                                                <span>{this.state.data.product_name}</span>
                                            </div>
                                        </div>
                                        <div className="d-flex user-info">
                                            <div className="user-info-title font-weight-bold">
                                                Product Image :
                                            </div>
                                            <div className="text-truncate">
                                                {/* <span>{this.state.data.product_image}</span> */}
                                                <Col className="pl-0" sm="12" lg="6">

                                                    <Media className="d-sm-flex d-block">
                                                        <Media className="mt-md-1 mt-0" left>
                                                            {this.state.data?.product_image?.map((i) => (
                                                                <img
                                                                    className="border-black m-0"
                                                                    src={i}
                                                                    alt="user avatar"
                                                                    height="100"
                                                                />
                                                            ))}
                                                        </Media>
                                                        <Media body></Media>
                                                    </Media>
                                                </Col>
                                            </div>
                                        </div>
                                        <div className="d-flex user-info">
                                            <div className="user-info-title font-weight-bold">
                                                Category :
                                            </div>
                                            <div className="text-truncate">
                                                <span>{this.state.data.category}</span>
                                            </div>
                                        </div>
                                        <div className="d-flex user-info">
                                            <div className="user-info-title font-weight-bold">
                                                Type :
                                            </div>
                                            <div className="text-truncate">
                                                <span>{this.state.data.type}</span>
                                            </div>
                                        </div>
                                        <div className="d-flex user-info">
                                            <div className="user-info-title font-weight-bold">
                                                Color :
                                            </div>
                                            <div className="text-truncate">
                                                <span>{this.state.data.color}</span>
                                            </div>
                                        </div>
                                        <div className="d-flex user-info">
                                            <div className="user-info-title font-weight-bold">
                                                Brand:
                                            </div>
                                            <div className="text-truncate">
                                                <span>{this.state.data.brand}</span>
                                            </div>
                                        </div>
                                        <div className="d-flex user-info">
                                            <div className="user-info-title font-weight-bold">
                                                Model:
                                            </div>
                                            <div className="text-truncate">
                                                <span>{this.state.data.model}</span>
                                            </div>
                                        </div>


                                        <div className="d-flex user-info">
                                            <div className="user-info-title font-weight-bold">
                                                MRP:
                                            </div>
                                            <div className="text-truncate">
                                                <span>{this.state.data.mrp}</span>
                                            </div>
                                        </div>
                                        <div className="d-flex user-info">
                                            <div className="user-info-title font-weight-bold">
                                                Selling Price:
                                            </div>
                                            <div className="text-truncate">
                                                <span>{this.state.data.selling_price}</span>
                                            </div>
                                        </div>
                                        <div className="d-flex user-info">
                                            <div className="user-info-title font-weight-bold">
                                                Buying Price:
                                            </div>
                                            <div className="text-truncate">
                                                <span>{this.state.data.buying_price}</span>
                                            </div>
                                        </div>
                                        <div className="d-flex user-info">
                                            <div className="user-info-title font-weight-bold">
                                                Minimum Selling Quatity:
                                            </div>
                                            <div className="text-truncate">
                                                <span>{this.state.data.min_selling_Q}</span>
                                            </div>
                                        </div>
                                        <div className="d-flex user-info">
                                            <div className="user-info-title font-weight-bold">
                                                Minimum Selling Quatity:
                                            </div>
                                            <div className="text-truncate">
                                                <span>{this.state.data.max_selling_Q}</span>
                                            </div>
                                        </div>
                                        <div className="d-flex user-info">
                                            <div className="user-info-title font-weight-bold">
                                                Reward Points:
                                            </div>
                                            <div className="text-truncate">
                                                <span>{this.state.data.reward_points}</span>
                                            </div>
                                        </div>

                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </div>
            </React.Fragment>
        );
    }
}

export default ViewHouseProduct;