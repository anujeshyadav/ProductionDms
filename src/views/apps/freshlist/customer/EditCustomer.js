import React from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Table,
  Input,
  Label,
  Form,
  FormGroup,
  Container,
  CustomInput,
} from "reactstrap";
import { Trash2, Edit } from "react-feather";
import axiosConfig from "../../../../axiosConfig";
import { FaBeer } from "react-icons/fa";
import { history } from "../../../../history";
import { Route } from "react-router-dom";
import imagecal from "../../../../assets/img/svg/imagecal.png";
import "../../../../layouts/assets/scss/pages/users.scss";
class EditCustomer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      customer_name: "",
      email: "",
      phone: "",
      status: "",
      selectedFile: null,
      selectedName: "",
    };
  }

  onChangeHandler = (event) => {
    this.setState({ selectedFile: event.target.files[0] });
    this.setState({ selectedName: event.target.files[0].name });
    console.log(event.target.files[0]);
  };
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleChange = (e) => {
    this.setState({ status: e.target.value });
  };

  componentDidMount() {
    // console.log(this.props.match.params);
    let { id } = this.props.match.params;
    axiosConfig
      .get(`/user/getviewone/${id}`)
      .then((response) => {
        console.log(response.data.data);
        this.setState({
          data: response.data.data,
          customer_name: response.data.data.username,
          email: response.data.data.email,
          phone: response.data.data.mobile,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  submitHandler = (e) => {
    e.preventDefault();
    console.log(this.props.match.params, this.state);
    const data = new FormData();
    data.append("username", this.state.customer_name);
    data.append("email", this.state.email);
    data.append("mobile", this.state.phone);
    data.append("image", this.state.selectedFile, this.state.selectedName);
    for (var value of data.values()) {
      console.log(value);
    }
    for (var key of data.keys()) {
      console.log(key);
    }
    let { id } = this.props.match.params;
    axiosConfig
      .post(`/user/edituser/${id}`, data)
      .then((response) => {
        console.log(response);
        this.props.history.push("/app/freshlist/customer/editCustomer");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <React.Fragment>
        <Container>
          <Row className="m-2">
            <Col>
              <h1 col-sm-6 className="float-left">
                Edit Customer
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
          <Row>
            {/* <Col sm="9">
              <Card>
                <Row className="m-2">
                  <Col sm="6">
                    <h4>
                      <b>Order ID</b>
                      <span> #45112</span>
                    </h4>
                    <p className="my-1">
                      <img src={imagecal} alt="cl" width={15} /> 05 Jan 2023
                      01:33:44
                    </p>
                    <p>Total KM: 20KM</p>
                    <p>Total Time :27MIN</p>
                  </Col>
                  <Col sm="6" style={{ textAlign: "right" }}>
                    <Input type="search" placeholder="Search Order" />
                  </Col>
                </Row>
                <Container>
                  <Row className="">
                    <Table className="table-responsive">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>OrderId</th>
                          <th>Total</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">1</th>
                          <td>Onion</td>
                          <td>29</td>

                          <td>
                            <Route
                              render={({ history }) => (
                                <Edit
                                  className="mr-50"
                                  size="25px"
                                  color="blue"
                                  onClick={() =>
                                    history.push(
                                      `/app/freshlist/order/editOrder/${params.data._id}`
                                    )
                                  }
                                />
                              )}
                            />
                            <Route
                              render={() => (
                                <Trash2
                                  className="mr-50"
                                  size="25px"
                                  color="red"
                                  onClick={() => {
                                    let selectedData =
                                      this.gridApi.getSelectedRows();
                                    this.runthisfunction(params.data._id);
                                    this.gridApi.updateRowData({
                                      remove: selectedData,
                                    });
                                  }}
                                />
                              )}
                            />
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">2</th>
                          <td>T-shirt</td>
                          <td>2</td>

                          <td>
                            <Route
                              render={({ history }) => (
                                <Edit
                                  className="mr-50"
                                  size="25px"
                                  color="blue"
                                  onClick={() =>
                                    history.push(
                                      `/app/freshlist/order/editOrder/${params.data._id}`
                                    )
                                  }
                                />
                              )}
                            />
                            <Route
                              render={() => (
                                <Trash2
                                  className="mr-50"
                                  size="25px"
                                  color="red"
                                  onClick={() => {
                                    let selectedData =
                                      this.gridApi.getSelectedRows();
                                    this.runthisfunction(params.data._id);
                                    this.gridApi.updateRowData({
                                      remove: selectedData,
                                    });
                                  }}
                                />
                              )}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Row>
                </Container>
              </Card>
            </Col> */}
            <Col sm="12">
              <Card>
                <Row className="m-2">
                  <Col sm="12" className="my-1">
                    <h3>Customer Information</h3>
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
                <Row className="m-2">
                  <Form className="m-1" onSubmit={this.submitHandler}>
                    <Row className="mb-2">
                      <Col lg="6" md="6">
                        <FormGroup>
                          <Label>Customer Name</Label>
                          <Input
                            type="text"
                            placeholder="Customer_Name"
                            name="customer_name"
                            value={this.state.customer_name}
                            onChange={this.changeHandler}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6" md="6">
                        <FormGroup>
                          <Label>Email</Label>
                          <Input
                            type="email"
                            placeholder="Enter Email"
                            name="email"
                            value={this.state.email}
                            onChange={this.changeHandler}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6" md="6">
                        <FormGroup>
                          <Label>Mobile No.</Label>
                          <Input
                            type="Number"
                            placeholder="Enter No."
                            name="phone"
                            value={this.state.phone}
                            onChange={this.changeHandler}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6" md="6">
                        <Label>Image</Label>
                        <FormGroup>
                          <CustomInput
                            type="file"
                            onChange={this.onChangeHandler}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6" md="6" sm="6" className="mb-2 mt-1">
                        <Label className="mb-1">Status</Label>
                        <div
                          className="form-label-group"
                          onChange={this.handleChange}
                        >
                          <input
                            style={{ marginRight: "3px" }}
                            type="radio"
                            name="status"
                            value="true"
                          />
                          <span style={{ marginRight: "20px" }}>True</span>

                          <input
                            style={{ marginRight: "3px" }}
                            type="radio"
                            name="status"
                            value="false"
                          />
                          <span style={{ marginRight: "3px" }}>False</span>
                        </div>
                      </Col>
                    </Row>

                    <Row className="m-2">
                      <Button
                        color="primary"
                        type="submit"
                        className="mr-1 mb-1"
                      >
                        Add Customer
                      </Button>
                    </Row>
                  </Form>
                </Row>
              </Card>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}
export default EditCustomer;

// import React, { Component } from "react";
// import {
//   Card,
//   CardBody,
//   Row,
//   Col,
//   Form,
//   Label,
//   Input,
//   Button,
//   Breadcrumb,
//   BreadcrumbItem,
//   FormGroup,
// } from "reactstrap";
// import axiosConfig from "../../../../axiosConfig";
// // import { history } from "../../../history";
// import { Route } from "react-router-dom";
// import swal from "sweetalert";

// export default class EditCustomer extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       username: "",
//       email: "",
//       mobile: "",
//       status: "",
//     };
//   }
//   componentDidMount() {
//     let { id } = this.props.match.params;
//     axiosConfig
//       .get(`/user/getviewone/${id}`)
//       .then((response) => {
//         console.log("getviewone", response.data.data);
//         this.setState({
//           username: response.data.data.username,
//           mobile: response.data.data.mobile,
//           email: response.data.data.email,
//           status: response.data.data.status,
//         });
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }
//   changeHandler1 = (e) => {
//     this.setState({ status: e.target.value });
//   };

//   changeHandler = (e) => {
//     this.setState({ [e.target.name]: e.target.value });
//   };

//   submitHandler = (e) => {
//     e.preventDefault();
//     let { id } = this.props.match.params;
//     console.log(id);
//     axiosConfig
//       .post(`/admin/edit_order/${id}`, this.state)
//       .then((response) => {
//         console.log(response);
//         this.props.history.push("/app/softNumen/order/placeorder");
//       })
//       .catch((error) => {
//         console.log(error.response.data);
//       });
//   };

//   render() {
//     return (
//       <div>
//         <Row>
//           <Col sm="12">
//             <div>
//               <Breadcrumb listTag="div">
//                 <BreadcrumbItem href="/analyticsDashboard" tag="a">
//                   Home
//                 </BreadcrumbItem>
//                 <BreadcrumbItem
//                   href="/app/freshlist/customer/customerList"
//                   tag="a"
//                 >
//                   Customer List
//                 </BreadcrumbItem>
//                 <BreadcrumbItem active>Edit Customer List</BreadcrumbItem>
//               </Breadcrumb>
//             </div>
//           </Col>
//         </Row>
//         <Card>
//           <Row className="m-2">
//             <Col>
//               <h1 className="float-left">Edit Resource List</h1>
//             </Col>
//             <Col>
//               <Route
//                 render={({ history }) => (
//                   <Button
//                     className=" btn btn-danger float-right"
//                     onClick={() =>
//                       history.push("/app/freshlist/customer/customerList")
//                     }
//                   >
//                     Back
//                   </Button>
//                 )}
//               />
//             </Col>
//           </Row>

//           <CardBody>
//             <Form className="m-1" onSubmit={this.submitHandler}>
//               <Row>
//                 <Col lg="5" md="5" className="ml-2">
//                   <FormGroup>
//                     <Label>Customer Name</Label>
//                     <Input
//                       type="text"
//                       placeholder="Customer Name"
//                       name="username"
//                       value={this.state.username}
//                       onChange={this.changeHandler}
//                     />
//                   </FormGroup>
//                 </Col>
//                 <Col lg="5" md="5">
//                   <FormGroup>
//                     <Label>Email</Label>
//                     <Input
//                       type="email"
//                       placeholder="Enter Email"
//                       name="email"
//                       value={this.state.email}
//                       onChange={this.changeHandler}
//                     />
//                   </FormGroup>
//                 </Col>

//                 <Col lg="5" md="5" className="ml-2">
//                   <FormGroup>
//                     <Label>Mobile</Label>
//                     <Input
//                       type="number"
//                       placeholder="Enter Mobile"
//                       name="mobile"
//                       value={this.state.mobile}
//                       onChange={this.changeHandler}
//                     />
//                   </FormGroup>
//                 </Col>
//                 <Col lg="6" md="6" sm="6" className="mb-2 mt-1">
//                   <Label className="mb-1">
//                     <h4>Status</h4>
//                   </Label>
//                   <div
//                     className="form-label-group"
//                     onChange={this.changeHandler1}
//                   >
//                     <input
//                       style={{ marginRight: "3px" }}
//                       type="radio"
//                       name="status"
//                       value="true"
//                     />
//                     <span style={{ marginRight: "20px" }}>Active</span>

//                     <input
//                       style={{ marginRight: "3px" }}
//                       type="radio"
//                       name="status"
//                       value="false"
//                     />
//                     <span style={{ marginRight: "3px" }}>Deactive</span>
//                   </div>
//                 </Col>
//               </Row>
//               <Row>
//                 <Col lg="6" md="6" sm="6" className="mb-2">
//                   <Button.Ripple
//                     color="primary"
//                     type="submit"
//                     className="mr-2 mb-1"
//                   >
//                     Update
//                   </Button.Ripple>
//                 </Col>
//               </Row>
//             </Form>
//           </CardBody>
//         </Card>
//       </div>
//     );
//   }
// }
