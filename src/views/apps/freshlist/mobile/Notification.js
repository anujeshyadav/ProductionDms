import React from "react";
import { Card, CardBody, Media, Row, Col, Button } from "reactstrap";
import axiosConfig from "../../../../axiosConfig";
import { history } from "../../../../history";
import { Route } from "react-router-dom";
class Notification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
    };
  }
  componentDidMount() {
    // console.log(this.props.match.params);
    let { id } = this.props.match.params;
    axiosConfig
      .get(`/admin/viewone_order/${id}`)
      .then((response) => {
        console.log(response.data.data);
        this.setState({ data: response.data.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  render() {
    return (
      <React.Fragment>
        <Row>
          <Col sm="12">
            <Card>
              <Row className="m-2">
                <Col>
                  <h1 col-sm-6 className="float-left">
                    All Order Detail
                  </h1>
                </Col>
                <Col>
                  <Route
                    render={({ history }) => (
                      <Button
                        className=" btn btn-danger float-right"
                        onClick={() => history.push("/app/freshlist/order/All")}
                      >
                        Back
                      </Button>
                    )}
                  />
                </Col>
              </Row>
              <CardBody>
                <Row className="mx-0" col="12">
                  <Col className="pl-0" sm="12" lg="6">
                    <Media className="d-sm-flex d-block">
                      {/* <Media className="mt-md-1 mt-0" left>
                        {this.state.data?.banner_img?.map((i) => (
                          <img
                            className="border-black m-0"
                            src={i}
                            alt="user avatar"
                            height="400"
                          />
                        ))}
                      </Media> */}
                      <Media body>
                        <Row className="ml-4">
                          <Col sm="9" md="12" lg="12">
                            <div className="users-page-view-table">
                              <div className="d-flex user-info">
                                <div className="user-info-title font-weight-bold">
                                  Order ID
                                </div>
                                <div className="text-truncate">
                                  <span>{this.state.data.orderId}</span>
                                </div>
                              </div>
                              <div className="d-flex user-info">
                                <div className="user-info-title font-weight-bold">
                                  Delivery Address
                                </div>
                                <div className="text-truncate">
                                  <span>{this.state.data.delivery_add}</span>
                                </div>
                              </div>
                              <div className="d-flex user-info">
                                <div className="user-info-title font-weight-bold">
                                  Email
                                </div>
                                <div className="text-truncate">
                                  <span>{this.state.data.email}</span>
                                </div>
                              </div>
                              <div className="d-flex user-info">
                                <div className="user-info-title font-weight-bold">
                                  Previous Address
                                </div>
                                <div className="text-truncate">
                                  <span>{this.state.data.previous_add}</span>
                                </div>
                              </div>
                              <div className="d-flex user-info">
                                <div className="user-info-title font-weight-bold">
                                  New Address
                                </div>
                                <div className="text-truncate">
                                  <span>{this.state.data.new_address}</span>
                                </div>
                              </div>

                              <div className="d-flex user-info">
                                <div className="user-info-title font-weight-bold">
                                  Phone
                                </div>
                                <div className="text-truncate">
                                  <span>{this.state.data.phone_no}</span>
                                </div>
                              </div>
                              <div className="d-flex user-info">
                                <div className="user-info-title font-weight-bold">
                                  Zone
                                </div>
                                <div className="text-truncate">
                                  <span>{this.state.data.order_zone}</span>
                                </div>
                              </div>
                              <div className="d-flex user-info">
                                <div className="user-info-title font-weight-bold">
                                  Notify
                                </div>
                                <div className="text-truncate">
                                  <span>{this.state.data.notify}</span>
                                </div>
                              </div>
                              <div className="d-flex user-info">
                                <div className="user-info-title font-weight-bold">
                                  Time Slot
                                </div>
                                <div className="text-truncate">
                                  <span>{this.state.data.time_slot}</span>
                                </div>
                              </div>

                              <div className="users-page-view-table">
                                <div className="d-flex user-info">
                                  <div className="user-info-title font-weight-bold">
                                    Status
                                  </div>
                                  <div>{this.state.data.status}</div>
                                </div>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Media>
                    </Media>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
export default Notification;
