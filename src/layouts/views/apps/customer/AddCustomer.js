// import React, { Component } from "react";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardBody,
//   Row,
//   Col,
//   Form,
//   Label,
//   Input,
//   CustomInput,
//   Button,
// } from "reactstrap";
// import  axios from "axios";
// export default class AddCustomer extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//         first_name: "",
//         last_name: "",
//         customer_email: "",
//         mobile_no: "",
//         sortorder: "",
//         selectedFile: null,
//         status: ""
//     };
//   }
  
//   onChangeHandler = (event) => {
//     this.setState({ selectedFile: event.target.files[0] });
//     this.setState({ selectedName: event.target.files[0].name });
//     console.log(event.target.files[0]);
//   };
//   changeHandler1 = (e) => {
//     this.setState({ status: e.target.value });
//   };
//   changeHandler = (e) => {
//     this.setState({ [e.target.name]: e.target.value });
//   };
//   submitHandler = (e) => {
//     e.preventDefault();


//     axios.post("http://35.154.86.59/api/user/customersignup", this.state)
//       .then((response) => {
//         console.log(response);  
//         alert("Customer Added Successful")
//         this.props.history.push("/app/customer/customerList");
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };
  
//   render() {
//     return (
//       <div>
//         <Card>
//           <CardHeader>
//             <CardTitle>Create A Customer</CardTitle>
//           </CardHeader>
//           <CardBody>
//             <Form className="m-1" onSubmit={this.submitHandler}>
//               <Row>
//                 <Col lg="6" md="6" sm="6" className="mb-2">
//                   <Label>first Name</Label>
//                   <Input   
//                     required 
//                     type="text" 
//                     name="first_name"
//                     placeholder="Enter First Name" 
//                     value={this.state.first_name}
//                     onChange={this.changeHandler}>
//                   </Input>
//                 </Col>
//                 <Col lg="6" md="6" sm="6" className="mb-2">
//                   <Label>Last Name</Label>
//                   <Input   
//                     required 
//                     type="text" 
//                     name="last_name"
//                     placeholder="Enter Last Name"  
//                     value={this.state.last_name}
//                     onChange={this.changeHandler}>
//                   </Input> 
//                 </Col>
//                 <Col lg="6" md="6" sm="6" className="mb-2">
//                   <Label>Customer Email</Label>
//                   <Input  
//                     required 
//                     type="email" 
//                     name="customer_email"
//                     placeholder="Email"  
//                     value={this.state.customer_email}
//                     onChange={this.changeHandler} >
//                   </Input>    
//                 </Col>
             
//                 <Col lg="6" md="6" sm="6" className="mb-2">
//                   <Label>Mobile No.</Label>
//                   <Input  
//                     required 
//                     type="number" 
//                     name="mobile_no"
//                     placeholder="Mobile No." 
//                     value={this.state.mobile_no}
//                     onChange={this.changeHandler}>
//                   </Input>    
//                 </Col>
//               </Row>
//               <Row>
//               <Col lg="6" md="6" sm="6" className="mb-2">
//                   <Label>Short Order</Label>
//                     <Input   
//                       required 
//                       type="text" 
//                       name="sortorder"
//                       placeholder="Enter Sort Order"  
//                       value={this.state.sortorder}
//                       onChange={this.changeHandler}>
//                     </Input> 
//                 </Col>
//             </Row> 
//                 <Col lg="6" md="6" sm="6" className="mb-2">
//                   <Label className="mb-1">Status</Label>
//                   <div
//                     className="form-label-group"
//                     onChange={(e) => this.changeHandler1(e)}
//                   >
//                     <input
//                       style={{ marginRight: "3px" }}
//                       type="radio"
//                       name="status"
//                       value="Active"
//                     />
//                     <span style={{ marginRight: "20px" }}>Active</span>

//                     <input
//                       style={{ marginRight: "3px" }}
//                       type="radio"
//                       name="status"
//                       value="Inactive"
//                     />
//                     <span style={{ marginRight: "3px" }}>Inactive</span>
//                   </div>
//                 </Col> 
//               <Row>
//                 <Col lg="6" md="6" sm="6" className="mb-2">
//                   <Button.Ripple
//                     color="primary"
//                     type="submit"
//                     className="mr-1 mb-1">
//                     Add Customer
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