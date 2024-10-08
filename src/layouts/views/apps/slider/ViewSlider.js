import React from "react";
import { Card, CardBody, Media, Row, Col, Button } from "reactstrap";
import axiosConfig from "../../../axiosConfig";

class ViewSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
    };
  }
  componentDidMount() {
    //console.log(this.props.match.params);
    let { id } = this.props.match.params;
    axiosConfig
      .get(`/viewonebanner/${id}`)
      .then((response) => {
        console.log(response.data);
        console.log(response.data.data);
        this.setState({ data:response.data.data});
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
                    Slider Detail
                  </h1>
                </Col>
                <Col>
                  <Button
                    className=" btn btn-danger float-right"
                    onClick={() => history.push("/app/slider/sliderList")}
                  >
                    Back
                  </Button>
                </Col>
              </Row>
              <CardBody>
                <Row className="mx-0" col="12">
                  <Col className="pl-0" sm="12" lg="6">
                    <Media className="d-sm-flex d-block">
                      <Media className="mt-md-1 mt-0" left>
                 
                         {this.state.data?.banner_img?.map((i) => (
                         <img
                            className="border-black m-0"
                            src={i}
                            alt="user avatar"
                            height="400"
                          />
                        ))}
                  
                      </Media>
                      <Media body>
                        <Row className="ml-4">
                          <Col sm="9" md="12" lg="12">
                            <div className="users-page-view-table">
                              <div className="d-flex user-info">
                                <div className="user-info-title font-weight-bold">
                                  Banner Title
                                </div>
                                <div className="text-truncate">
                                  <span>{this.state.data.banner_title}</span>
                                </div>
                              </div>
                              <div className="d-flex user-info">
                                <div className="user-info-title font-weight-bold">
                                  Banner Type
                                </div>
                                <div className="text-truncate">
                                  <span>{this.state.data.bannertype}</span>
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
export default ViewSlider;