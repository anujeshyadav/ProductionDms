// import React, { Component } from "react";
// import {
//   Card,
//   CardBody,
//   Col,
//   Form,
//   Row,
//   Input,
//   Label,
//   Button,
//   FormGroup,
//   CustomInput,
// } from "reactstrap";
// import { history } from "../../../../history";
// import axiosConfig from "../../../../axiosConfig";
// // import { useParams } from "react-router-dom";
// //import { ToastContainer, toast } from 'react-toastify';
// import "react-toastify/dist/ReactToastify.css";
// import { data } from "jquery";
// export class EditStore extends Component {

//     constructor(props) {
//             super(props);
//             this.state = {
//               store_name:"",
//               storeImg:"",
//               store_desc:"",
//               websiteUrl:"",
//               store_email:"",
//               phone_no:"",
//               altphone_no:"",
            
//               day:"",
//               startTym:"",
//               endTym:"",
//               address_line1:"",
//               address_line2:"",
//               landmark:"",
//               state:"",
//               city:"",
//               pincode:"",
//               gst_no:"",
//               business_type:"", 
//               pan_no:"",
//               company_panno:"",
//               address_proof:"",
//               shoplogo_img:"",
//               gstImg:"",
//               storepan_img:"",
//               tradelicence_img:"",
//               companypan_img:"",
//               address_proof_img:"",
//               sortorder:"",
//               selectedFile: undefined,
//               selectedName: "",
            
//               status: ""
//             };
//           }
//           componentDidMount() {
//             console.log(this.props.match.params);
//             let { id } = this.props.match.params;
//             axiosConfig
//               .get(`/getonestore/${id}`)
//               .then((response) => {
//                 console.log(response);
//                 this.setState({
//                 store_name: response.data.data.store_name,
//                 store_desc: response.data.data.store_desc,
//                 websiteUrl: response.data.data.websiteUrl,
//                 store_email: response.data.data.store_email,
//                 phone_no: response.data.data.phone_no,
//                 altphone_no: response.data.data.altphone_no,
             
//                 day: response.data.data.day,
//                 startTym: response.data.data.startTym,
//                 endTym: response.data.data.endTym,
//                 address_line1: response.data.data.address_line1,
//                 address_line2: response.data.data.address_line2,
//                 landmark: response.data.data.landmark,
//                 state: response.data.data.state,
//                 city: response.data.data.city,
//                 pincode: response.data.data.pincode,
//                 gst_no: response.data.data.gst_no,
//                 business_type: response.data.data.business_type,
//                 pan_no: response.data.data.pan_no,      
//                 company_panno: response.data.data.company_panno,
//                 address_proof: response.data.data.address_proof,      
//                 sortorder: response.data.data.sortorder,
//                 storeImg: response.data.data.storeImg,
//                 shoplogo_img: response.data.data.shoplogo_img,
//                 gstImg: response.data.data.gstImg,
//                 storepan_img: response.data.data.storepan_img,
//                 tradelicence_img: response.data.data.tradelicence_img,
//                 companypan_img: response.data.data.companypan_img,
//                 address_proof_img: response.data.data.address_proof_img,
//                 status: response.data.data.status,
              
//                 });
//               })
//               .catch((error) => {
//                 console.log(error);
//               });
//           }

//   onChangeHandler = (event) => {
//     this.setState({ selectedFile: event.target.files[0] });
//     this.setState({ selectedName: event.target.files[0].name });
//     console.log(event.target.files[0]);
//   };
//   onChangeHandler = (event) => {
//         this.setState({ selectedFile: event.target.files });
//         this.setState({ selectedName: event.target.files.name });
//         console.log(event.target.files);
//       };
//       onChangeHandler1 = (event) => {
//         this.setState({ selectedFile1: event.target.files });
//         this.setState({ selectedName1: event.target.files.name });
//         console.log(event.target.files);
//       };
//       onChangeHandler2 = (event) => {
//         this.setState({ selectedFile2: event.target.files });
//         this.setState({ selectedName2: event.target.files.name });
//         console.log(event.target.files);
//       };
//       onChangeHandler3 = (event) => {
//         this.setState({ selectedFile3: event.target.files });
//         this.setState({ selectedName3: event.target.files.name });
//         console.log(event.target.files);
//       };
//       onChangeHandler4 = (event) => {
//         this.setState({ selectedFile4: event.target.files });
//         this.setState({ selectedName4: event.target.files.name });
//         console.log(event.target.files);
//       };
//       onChangeHandler5 = (event) => {
//         this.setState({ selectedFile5: event.target.files });
//         this.setState({ selectedName5: event.target.files.name });
//         console.log(event.target.files);
//       };
//       onChangeHandler6 = (event) => {
//         this.setState({ selectedFile6: event.target.files });
//         this.setState({ selectedName6: event.target.files.name });
//         console.log(event.target.files);
//       };
//          changeHandler1 = (e) => {
//             this.setState({ status: e.target.value });
//           };
//           changeHandler = (e) => {
//             this.setState({ [e.target.name]: e.target.value });
//           };
//           submitHandler = (e) => {
//       e.preventDefault();
      
//     const data = new FormData();
//     data.append("store_name", this.state.store_name);
//     data.append("store_desc", this.state.store_desc);
//     data.append("websiteUrl", this.state.websiteUrl);
//     data.append("store_email", this.state.store_email);
//     data.append("phone_no", this.state.phone_no);
//     data.append("altphone_no", this.state.altphone_no);
    
//     data.append("day", this.state.day);
//     data.append("startTym", this.state.startTym);
//     data.append("endTym", this.state.endTym);
//     data.append("address_line1", this.state.address_line1);
//     data.append("address_line2", this.state.address_line2);
//     data.append("landmark", this.state.landmark);
//     data.append("state", this.state.state);
//     data.append("city", this.state.city);
//     data.append("pincode", this.state.pincode);
//     data.append("gst_no", this.state.gst_no);
//     data.append("business_type", this.state.business_type);
//     data.append("pan_no", this.state.pan_no);
//     data.append("company_panno", this.state.company_panno);
//     data.append("address_proof", this.state.address_proof);
//     data.append("sortorder", this.state.sortorder);
//     data.append("status", this.state.status);
 
//     for (const file of this.state.selectedFile) {
//       if (this.state.selectedFile !== null) {
//         data.append("storeImg", file, file.name);
//       }
//     }
//     for (const file of this.state.selectedFile) {
//       if (this.state.selectedFile1 !== null) {
//         data.append("shoplogo_img", file, file.name);
//       }
//     }
//     for (const file of this.state.selectedFile) {
//       if (this.state.selectedFile2 !== null) {
//         data.append("gstImg", file, file.name);
//       }
//     }
//     for (const file of this.state.selectedFile) {
//       if (this.state.selectedFile3 !== null) {
//         data.append("storepan_img", file, file.name);
//       }
//     }
//     for (const file of this.state.selectedFile) {
//       if (this.state.selectedFile4 !== null) {
//         data.append("tradelicence_img", file, file.name);
//       }
//     }
//     for (const file of this.state.selectedFile) {
//       if (this.state.selectedFile5 !== null) {
//         data.append("companypan_img", file, file.name);
//       }
//     }
//     for (const file of this.state.selectedFile) {
//       if (this.state.selectedFile6 !== null) {
//         data.append("address_proof_img", file, file.name);
//       }
//     }
//     for (var value of data.values()) {
//       console.log(value);
//     }

//     for (var key of data.keys()) {
//       console.log(key);
//     }



  

//   changeHandler1 = (e) => {
//     this.setState({ status: e.target.value });
   

//   };
//   changeHandler = (e) => {
//     this.setState({ [e.target.name]: e.target.value });
//   };

//   submitHandler = (e) => {
//   let { id } = this.props.match.params;
//     axiosConfig
//       .post(`/editstore/${id}`, data)
//       .then((response) => {
//         console.log(response);
//         this.props.history.push("/app/store/stores/storesList");
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };
   
    
   
//     axiosConfig.post("/addstore", data)
//       .then((response) => {
//         console.log(response);  
//         alert("Store Added Successful")
//         this.props.history.push("/app/store/stores/storesList");
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };

//   render() {
//     return (
//       <div>
//         <Card>
//           <Row className="m-2">
//             <Col>
//               <h1 col-sm-6 className="float-left">
//                 Edit Store
//               </h1>
//             </Col>
//             <Col>
//               <Button
//                 className=" btn btn-danger float-right"
//                 onClick={() => history.push("/app/store/stores/storesList")}
//               >
//                 Back
//               </Button>
//             </Col>
//           </Row>
//           <CardBody>
//             <Form className="m-1" onSubmit={this.submitHandler}>
//               <Row className="mb-2">
//                 <Col lg="6" md="6">
//                   <FormGroup>
//                     <Label>Store Name</Label>
//                     <Input
//                       type="text"
//                       placeholder="Store Name"
//                       name="store_name"
//                       value={this.state.store_name}
//                       onChange={this.changeHandler}
//                     />
//                   </FormGroup>
//                 </Col>
                
//                 <Col lg="6" md="6">
//                   <FormGroup>
//                     <Label>Store Description</Label>
//                     <Input
//                       type="text"
//                       placeholder="Store Description"
//                       name="store_desc"
//                       value={this.state.store_desc}
//                       onChange={this.changeHandler}
//                     />
//                   </FormGroup>
//                 </Col>
//                 <Col lg="6" md="6">
//                   <FormGroup>
//                     <Label>Website Url</Label>
//                     <Input
//                       type="text"
//                       placeholder="Website Url"
//                       name="websiteUrl"
//                       value={this.state.websiteUrl}
//                       onChange={this.changeHandler}
//                     /> 
//                   </FormGroup>
//                 </Col>
//                 <Col lg="6" md="6">
//                   <FormGroup>
//                   <Label>Store Email</Label>
//                     <Input
//                       type="email"
//                       placeholder="Store Email"
//                       name=" store_email"
//                       value={this.state.store_email}
//                       onChange={this.changeHandler}
//                     /> 
//                   </FormGroup>
//                 </Col>
//                 <Col lg="6" md="6">
//                   <FormGroup>
//                     <Label>Phone No.</Label>
//                     <Input
//                       type="number"
//                       placeholder="Phone No."
//                       name=" phone_no"
//                       value={this.state.phone_no}
//                       onChange={this.changeHandler}
//                     /> 
//                   </FormGroup>
//                 </Col>
//                 <Col lg="6" md="6">
//                   <FormGroup>
//                     <Label>Alt Phone No1.</Label>
//                     <Input
//                       type="number"
//                       placeholder="Phone No.1"
//                       name=" altphone_no"
//                       value={this.state.altphone_no}
//                       onChange={this.changeHandler}
//                     /> 
//                   </FormGroup>
//                 </Col>
             
//                 <Col lg="6" md="6">
//                   <FormGroup>
//                     <Label>Day</Label>
//                     <Input
//                       type="day"
//                       placeholder="Day"
//                       name=" day"
//                       value={this.state.day}
//                       onChange={this.changeHandler}
//                     /> 
//                   </FormGroup>
//                 </Col>
             
//                 <Col lg="6" md="6">
//                   <FormGroup>
//                   <Label>Start Time</Label>
//                     <Input
//                       type="time"
//                       placeholder="Start Time"
//                       name="startTym"
//                       value={this.state.startTym}
//                       onChange={this.changeHandler}
//                     /> 
//                   </FormGroup>
//                 </Col>
//                 <Col lg="6" md="6">
//                   <FormGroup>
//                     <Label>End Time</Label>
//                     <Input
//                       type="time"
//                       placeholder="End Time"
//                       name="endTym"
//                       value={this.state.endTym}
//                       onChange={this.changeHandler}
//                     /> 
//                   </FormGroup>
//                 </Col>
//                 <Col lg="6" md="6">
//                   <FormGroup>
//                     <Label>Address Line1</Label>
//                     <Input
//                       type="textarea"
//                       placeholder="Address Line1"
//                       name=" address_line1"
//                       value={this.state.address_line1}
//                       onChange={this.changeHandler}
//                     /> 
//                   </FormGroup>
//                 </Col>
//                 <Col lg="6" md="6">
//                   <FormGroup>
//                     <Label>Address Line2</Label>
//                     <Input
//                       type="textarea"
//                       placeholder="Address Line2"
//                       name=" address_line2"
//                       value={this.state.address_line2}
//                       onChange={this.changeHandler}
//                     /> 
//                   </FormGroup>
//                 </Col>
//                 <Col lg="6" md="6">
//                   <FormGroup>
//                     <Label>Landmark</Label>
//                     <Input
//                       type="text"
//                       placeholder="Landmark"
//                       name="landmark"
//                       value={this.state.landmark}
//                       onChange={this.changeHandler}
//                     /> 
//                   </FormGroup>               
//                 </Col>
//                 <Col lg="6" md="6">
//                   <FormGroup>
//                     <Label>State</Label>
//                     <Input
//                       type="text"
//                       placeholder="State"
//                       name="state"
//                       value={this.state.state}
//                       onChange={this.changeHandler}
//                     /> 
//                   </FormGroup>
//                 </Col>
//                 <Col lg="6" md="6">
//                   <FormGroup>
//                     <Label>City</Label>
//                     <Input
//                       type="text"
//                       placeholder="City"
//                       name="city"
//                       value={this.state.city}
//                       onChange={this.changeHandler}
//                     /> 
//                   </FormGroup>
//                 </Col>
//                 <Col lg="6" md="6">
//                   <FormGroup>
//                     <Label>Pin Code</Label>
//                     <Input
//                       type="text"
//                       placeholder="Pin Code"
//                       name="pincode"
//                       value={this.state.pincode}
//                       onChange={this.changeHandler}
//                     /> 
//                   </FormGroup>
//                 </Col>
//                 <Col lg="6" md="6">
//                   <FormGroup>
//                     <Label>GST No.</Label>
//                     <Input
//                       type="test"
//                       placeholder="GST No."
//                       name=" gst_no"
//                       value={this.state.gst_no}
//                       onChange={this.changeHandler}
//                     /> 
//                   </FormGroup>               
//                 </Col>
//                 <Col lg="6" md="6">
//                   <FormGroup>
//                     <Label>Business Type</Label>
//                     <Input
//                       type="text"
//                       placeholder="Business Type"
//                       name=" business_type"
//                       value={this.state.business_type}
//                       onChange={this.changeHandler}
//                     /> 
//                   </FormGroup>               
//                 </Col>
//                 <Col lg="6" md="6">
//                   <FormGroup>
//                     <Label>Pan Number</Label>
//                     <Input
//                       type="text"
//                       placeholder="Pan No."
//                       name=" pan_no"
//                       value={this.state.pan_no}
//                       onChange={this.changeHandler}
//                     /> 
//                   </FormGroup>               
//                 </Col>    
//                 <Col lg="6" md="6">
//                   <FormGroup>
//                     <Label>Company Pan No.</Label>
//                     <Input
//                       type="text"
//                       placeholder="Company Pan No"
//                       name=" company_panno"
//                       value={this.state.company_panno}
//                       onChange={this.changeHandler}
//                     /> 
//                   </FormGroup>               
//                 </Col> 
//                 <Col lg="6" md="6">
//                   <FormGroup>
//                     <Label>Address Proof</Label>
//                     <Input
//                       type="text"
//                       placeholder="Address Proof"
//                       name="address_proof"
//                       value={this.state.address_proof}
//                       onChange={this.changeHandler}
//                     /> 
//                   </FormGroup>               
//                 </Col>
//                 <Col lg="6" md="6">
//                   <FormGroup>
//                     <Label>Sort Order</Label>
//                     <Input
//                       type="number"
//                       placeholder="Sort Order"
//                       name="sortorder"
//                       value={this.state.sortorder}
//                       onChange={this.changeHandler}
//                     />
//                   </FormGroup>
//                 </Col>
//                 <Col lg="6" md="6">
//                   <FormGroup>
//                     <Label>Store Image</Label>
//                     <CustomInput  
//                       type="file"
//                       multiple
//                       onChange={this.onChangeHandler}/>    
//                   </FormGroup>
//                 </Col>
//                 <Col lg="6" md="6">
//                   <FormGroup>
//                     <Label>Shop Logo Image</Label>
//                     <CustomInput  
//                       type="file"
//                       multiple
//                       onChange={this.onChangeHandler1}/>    
//                   </FormGroup>
//                 </Col>
//                 <Col lg="6" md="6">
//                   <FormGroup>
//                     <Label>GST Image</Label>
//                     <CustomInput  
//                       type="file"
//                       multiple
//                       onChange={this.onChangeHandler2}/>    
//                   </FormGroup>
//                 </Col>
//                 <Col lg="6" md="6">
//                   <FormGroup>
//                     <Label>Store Pan Image</Label>
//                     <CustomInput  
//                       type="file"
//                       multiple
//                       onChange={this.onChangeHandler3}/>    
//                   </FormGroup>
//                 </Col>
//                 <Col lg="6" md="6">
//                   <FormGroup>
//                     <Label>Tradelicence Image</Label>
//                     <CustomInput  
//                       type="file"
//                       multiple
//                       onChange={this.onChangeHandler4}/>    
//                   </FormGroup>
//                 </Col>
//                 <Col lg="6" md="6">
//                   <FormGroup>
//                     <Label>Company Pan Image</Label>
//                     <CustomInput  
//                       type="file"
//                       multiple
//                       onChange={this.onChangeHandler5}/>    
//                   </FormGroup>
//                 </Col>
//                 <Col lg="6" md="6">
//                   <FormGroup>
//                     <Label>Address Proof Image</Label>
//                     <CustomInput  
//                       type="file"
//                       multiple
//                       onChange={this.onChangeHandler6}/>    
//                   </FormGroup>
//                 </Col>
//                 <Col lg="6" md="6" sm="6" className="mb-2 mt-1">
//                   <FormGroup>
//                     <Label className="mb-1">Status</Label>
//                     <div
//                       className="form-label-group"
//                       onChange={(e) => this.changeHandler1(e)}
//                     >
//                       <input
//                         style={{ marginRight: "3px" }}
//                         type="radio"
//                         name="status"
//                         value="Active"
//                       />
//                       <span style={{ marginRight: "20px" }}>Active</span>

//                       <input
//                         style={{ marginRight: "3px" }}
//                         type="radio"
//                         name="status"
//                         value="Inactive"
//                       />
//                       <span style={{ marginRight: "3px" }}>Inactive</span>
//                     </div>
//                   </FormGroup>
         
//                 </Col>
//               </Row>
//               <Row>
//                 <Button.Ripple
//                   color="danger"
//                   type="submit"
//                   className="mr-1 mb-1"
//                 >
//                   Update Store
//                 </Button.Ripple>
//               </Row>
//             </Form>
//           </CardBody>
//         </Card>
//       </div>
//     );
//   }
// }
// export default EditStore;