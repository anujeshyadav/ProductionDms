// import React from "react";
// import {
//   Card,
//   CardBody,
//   Media,
//   Row,
//   Col,
//   Button,
// } from "reactstrap";
// import axiosConfig from "../../../axiosConfig";
// import "../../../assets/scss/pages/users.scss";
// import { history } from "../../../history";
// class ViewCustomer extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       data: {},
//     };
//   }
//   componentDidMount() {
//     let { id } = this.props.match.params;
//     axiosConfig
//       .get(`/view_onecust/${id}`)
//       .then((response) => {
      
//         console.log(response.data.data);
//         this.setState({ data: response.data.data });
//       })
//       .catch((error) => {
//         console.log(error);
//     });
//   }
//   render() {
//     return (
//       <React.Fragment>
//         <Row>
//           <Col sm="12">
//             <Card>
//               <Row className="m-2">
//                 <Col>
//                   <h1 col-sm-6 className="float-left">
//                   Customer Detail
//                   </h1>
//                 </Col>
//                 <Col>
//                   <Button
//                     className=" btn btn-danger float-right"
//                     onClick={() => history.push("/app/customer/CustomerList")}
//                   >
//                     Back
//                   </Button>
//                 </Col>
//               </Row>
//               <CardBody>
//                 <Row className="mx-0" col="12">
//                   <Col className="pl-0" sm="12" lg="6">
//                     <Media className="d-sm-flex d-block">
//                       <Media body>
//                         <Row className="ml-4">
//                           <Col sm="9" md="12" lg="12">
//                             <div className="users-page-view-table">
//                             <div className="d-flex user-info">
//                                 <div className="user-info-title font-weight-bold">
//                                 First Name	
//                                 </div>
//                                 <div className="text-truncate">
//                                   <span>{this.state.data.firstname	}</span>
//                                 </div>
//                               </div>
//                               <div className="d-flex user-info">
//                                 <div className="user-info-title font-weight-bold">
//                                 Last Name
//                                 </div>
//                                 <div className="text-truncate">
//                                   <span>{this.state.data.lastname}</span>
//                                 </div>
//                               </div>
//                               <div className="d-flex user-info">
//                                 <div className="user-info-title font-weight-bold">
//                                 Email
//                                 </div>
//                                 <div className="text-truncate">
//                                   <span>{this.state.data.email}</span>
//                                 </div>
//                               </div>
//                               <div className="d-flex user-info">
//                                 <div className="user-info-title font-weight-bold">
//                                 Mobile
//                                 </div>
//                                 <div className="text-truncate">
//                                   <span>{this.state.data.mobile}</span>
//                                 </div>
//                               </div>
//                             </div>
//                             {/* <div className="users-page-view-table">
//                               <div className="d-flex user-info">
//                                 <div className="user-info-title font-weight-bold">
//                                   Status
//                                 </div>
//                                 <div>{this.state.data.status}</div>
//                               </div>
//                              </div> */}
//                           </Col>
//                         </Row>
//                       </Media>
//                     </Media>
//                   </Col>
//                 </Row>
//               </CardBody>
//             </Card>
//           </Col>
//         </Row>
//       </React.Fragment>
//     );
//   }
// }







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
import { history } from "../../../history";
import "../../../assets/scss/pages/app-ecommerce-shop.scss";
import "../../../assets/scss/pages/users.scss";
// import axiosConfig from "../../../axiosConfig";
import axios from "axios";
class ViewCustomer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
    };
  }
 

  componentDidMount() {
    let { id } = this.props.match.params;
    axios
      .get(`http://35.154.86.59/api/user/view_onecust/${id}`)
      
      .then(response => {
        
         //console.log(response.data);
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
              <div>
                <Breadcrumb listTag="div">
                  <BreadcrumbItem href="/analyticsDashboard" tag="a">
                    Home
                  </BreadcrumbItem>
                  <BreadcrumbItem href="/app/customer/CustomerList" tag="a">
                  Customer List
                  </BreadcrumbItem>
                  <BreadcrumbItem active>View Customer</BreadcrumbItem>
                </Breadcrumb>
              </div>
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
                <Button
                  className=" btn btn-danger float-right"
                  onClick={() => history.push("/app/customer/CustomerList")}>
                  Back
                </Button>
              </Col>
            </Row>
            <CardBody className="pb-0">
              <Row className="ml-4">
                <Col sm="9" md="12" lg="12">
                <div className="users-page-view-table"> 
                <div className="d-flex user-info">
                    <div className="user-info-title font-weight-bold">
                    Customer Id 
                    </div>
                    <div className="text-truncate">
                      <span>{this.state.data.customerId}</span>
                    </div>
                  </div>
                  <div className="d-flex user-info">
                    <div className="user-info-title font-weight-bold">
                      First Name
                    </div>
                    <div className="text-truncate">
                      <span>{this.state.data.firstname}</span>
                    </div>
                  </div>
                  <div className="d-flex user-info">
                    <div className="user-info-title font-weight-bold">
                      Last Name
                    </div>
                    <div className="text-truncate">
                      <span>{this.state.data.lastname}</span>
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
                      Mobile
                    </div>
                    <div className="text-truncate">
                      <span>{this.state.data.mobile}</span>
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

export default ViewCustomer;