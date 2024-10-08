import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Media,
  Row,
  Col,
  Button,
} from "reactstrap";
//import { Edit,Trash } from "react-feather";
//import { Link } from "react-router-dom";
import axiosConfig from "../../../axiosConfig";

//import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy";
//import userImg from "../../../assets/img/portrait/small/avatar-s-18.jpg";
import "../../../assets/scss/pages/users.scss";
import { history } from "../../../history";

class ViewProfile extends React.Component {
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
      .get(`/getonecustomer/${id}`)
      .then((response) => {
        //console.log(response.data);
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
                    Customer Detail
                  </h1>
                </Col>
                <Col>
                  <Button
                    className=" btn btn-danger float-right"
                    onClick={() => history.push("/app/customer/customerList")}
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
                        {/* <Media
                          className="rounded mr-2"
                          object
                          src={this.state.data.seller_img}
                          alt="Generic placeholder image"
                          height="150"
                          width="180"
                        /> */}

                      </Media>
                      <Media body>
                        <Row className="ml-4">
                          <Col sm="9" md="12" lg="12">
                            <div className="users-page-view-table">
                              <div className="d-flex user-info">
                                <div className="user-info-title font-weight-bold">
                                Customer Name
                                </div>
                                <div className="text-truncate">
                                  <span>{this.state.data.customername}</span>
                                </div>
                              </div>
                            
                               
                              
                              <div className="d-flex user-info">
                                <div className="user-info-title font-weight-bold">
                                 Customer Email
                                </div> 
                                <div className="text-truncate">
                                  <span>{this.state.data.customer_email}</span>
                                </div>
                              </div>   
                               <div className="d-flex user-info">
                                <div className="user-info-title font-weight-bold">
                                 Mobile no
                                </div>
                                <div className="text-truncate">
                                  <span>{this.state.data.mobile_no}</span>
                                </div>
                              </div> 
                              <div className="d-flex user-info">
                                <div className="user-info-title font-weight-bold">
                                 Srot Order
                                </div>
                                <div className="text-truncate">
                                  <span>{this.state.data.sortorder}</span>
                                </div>
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
                          </Col>
                        </Row>
                      </Media>
                    </Media>
                  </Col>
                  {/* <Col className="mt-1 pl-0" sm="12">
                    <Button.Ripple className="mr-1" color="primary" outline>
                      <Link to="/app/customer/editCustomer">
                        <Edit size={15} />
                        <span className="align-middle ml-50">Edit</span>
                      </Link>
                    </Button.Ripple>
                    <Button.Ripple color="danger" outline>
                      <Trash size={15} />
                      <span className="align-middle ml-50">Delete</span>
                    </Button.Ripple>
                  </Col>*/}
                </Row>
              </CardBody>
            </Card>
          </Col> 
        
         
        </Row>
      </React.Fragment>
    );
  }
}
export default ViewProfile;
