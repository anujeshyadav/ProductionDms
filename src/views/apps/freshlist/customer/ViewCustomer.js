import React from "react";
import {
  Card,
  CardBody,
  Row,
  Col,
  Button,
  Breadcrumb,
  BreadcrumbItem,
} from "reactstrap";
import { history } from "../../../../history";
import "../../../../assets/scss/pages/app-ecommerce-shop.scss";
import "../../../../assets/scss/pages/users.scss";
import axiosConfig from "../../../../axiosConfig";
import { Route } from "react-router-dom";
class ViewCustomer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
    };
  }

  componentDidMount() {
    let { id } = this.props.match.params;
    axiosConfig
      .get(`/user/getviewone/${id}`)

      .then(response => {
        console.log(response.data.data);
        this.setState({ data: response.data.data });
      })
      .catch(error => {
        console.log(error.response);
      });
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <Row>
            <Col sm="12">
              {/* <div>
                <Breadcrumb listTag="div">
                  <BreadcrumbItem href="/analyticsDashboard" tag="a">
                    Home
                  </BreadcrumbItem>
                  <BreadcrumbItem
                    href="/app/freshlist/customer/customerList"
                    tag="a"
                  >
                    Customer List
                  </BreadcrumbItem>
                  <BreadcrumbItem active> View Customer</BreadcrumbItem>
                </Breadcrumb>
              </div> */}
            </Col>
          </Row>
          <Card className="overflow-hidden app-ecommerce-details">
            <Row className="m-2">
              <Col>
                <h1 col-sm-6 className="float-left">
                  View Customer
                </h1>
              </Col>
              <Col>
                <Route
                  render={({ history }) => (
                    <Button
                      className=" btn btn-danger float-right"
                      onClick={() =>
                        history.push("/app/freshlist/customer/customerList")
                      }
                    >
                      Back
                    </Button>
                  )}
                />
              </Col>
            </Row>
            <CardBody className="pb-0">
              <Row className="m-2">
                <Col sm="12" className="my-1">
                  <Row className="m-3">
                    <Col sm="4">
                      <img
                        src={this.state.data?.image}
                        alt="aaa"
                        width="200"
                        height="150"
                      />
                    </Col>
                    <Col sm="8">
                      <Row className="m-2">
                        <Col>
                          <h6>UserName</h6>
                        </Col>
                        <Col>
                          <h6>
                            <b>{this.state.data?.username}</b>
                          </h6>
                        </Col>
                      </Row>
                      <Row className="m-2">
                        <Col>
                          <h6>Email</h6>
                        </Col>
                        <Col>
                          <h6>
                            <b>{this.state.data?.email}</b>
                          </h6>
                        </Col>
                      </Row>
                      <Row className="m-2">
                        <Col>
                          <h6>Phone</h6>
                        </Col>
                        <Col>
                          <h6>
                            <b>{this.state.data?.mobile}</b>
                          </h6>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </div>
      </React.Fragment>
    );
  }
}

export default ViewCustomer;
