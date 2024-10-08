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
// import  axiosConfig from "../../../../axiosConfig";
// import { history } from "../../../../history";
// export default class AddStore extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       store_name:"",
//       storeImg:"",
//       store_desc:"",
//       websiteUrl:"",
//       store_email:"",
//       phone_no:"",
//       altphone_no:"",
//     
//       day:"",
//       startTym:"",
//       endTym:"",
//       address_line1:"",
//       address_line2:"",
//       landmark:"",
//       state:"",
//       city:"",
//       pincode:"",
//       gst_no:"",
//       business_type:"", 
//       pan_no:"",
//       company_panno:"",
//       address_proof:"",
//       shoplogo_img:"",
//       gstImg:"",
//       storepan_img:"",
//       tradelicence_img:"",
//       companypan_img:"",
//       address_proof_img:"",
//       sortorder:"",
//       selectedFile: undefined,
//       selectedName: "",
//       status: ""
//     };
//   }
  
//   // onChangeHandler = (event) => {
//   //   this.setState({ selectedFile: event.target.files[0] });
//   //   this.setState({ selectedName: event.target.files[0].name });
//   //   console.log(event.target.files[0]);
//   // };
//   onChangeHandler = (event) => {
//     this.setState({ selectedFile: event.target.files });
//     this.setState({ selectedName: event.target.files.name });
//     console.log(event.target.files);
//   };
//   onChangeHandler1 = (event) => {
//     this.setState({ selectedFile1: event.target.files });
//     this.setState({ selectedName1: event.target.files.name });
//     console.log(event.target.files);
//   };
//   onChangeHandler2 = (event) => {
//     this.setState({ selectedFile2: event.target.files });
//     this.setState({ selectedName2: event.target.files.name });
//     console.log(event.target.files);
//   };
//   onChangeHandler3 = (event) => {
//     this.setState({ selectedFile3: event.target.files });
//     this.setState({ selectedName3: event.target.files.name });
//     console.log(event.target.files);
//   };
//   onChangeHandler4 = (event) => {
//     this.setState({ selectedFile4: event.target.files });
//     this.setState({ selectedName4: event.target.files.name });
//     console.log(event.target.files);
//   };
//   onChangeHandler5 = (event) => {
//     this.setState({ selectedFile5: event.target.files });
//     this.setState({ selectedName5: event.target.files.name });
//     console.log(event.target.files);
//   };
//   onChangeHandler6 = (event) => {
//     this.setState({ selectedFile6: event.target.files });
//     this.setState({ selectedName6: event.target.files.name });
//     console.log(event.target.files);
//   };
//   changeHandler1 = (e) => {
//     this.setState({ status: e.target.value });
//   };
//   changeHandler = (e) => {
//     this.setState({ [e.target.name]: e.target.value });
//   };
//   submitHandler = (e) => {
//     e.preventDefault();
//     const data = new FormData();
//     data.append("store_name", this.state.store_name);
//     data.append("store_desc", this.state.store_desc);
//     data.append("websiteUrl", this.state.websiteUrl);
//     data.append("store_email", this.state.store_email);
//     data.append("phone_no", this.state.phone_no);
//     data.append("altphone_no", this.state.altphone_no);
//
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
//           <Col>
//             <h1 col-sm-6 className="float-left">
//             Create A Store
//             </h1>
//           </Col>
//           <Col>
//             <Button
//               className=" btn btn-danger float-right"
//               onClick={() =>history.push("/app/store/stores/storesList")
//               }
//             >
//               Back
//             </Button>
//           </Col>
//         </Row>
//           <CardBody>
//             <Form className="m-1" onSubmit={this.submitHandler}>
//               <Row>
//                 <Col lg="6" md="6" sm="6" className="mb-2">
//                   <Label>Store Name</Label>
//                   <Input   
//                     type="text" 
//                     name="store_name"
//                     placeholder="Enter Store Name" 
//                     value={this.state.store_name}
//                     onChange={this.changeHandler}/>
//                 </Col>
//                 <Col lg="6" md="6" sm="6" className="mb-2">
//                   <Label>Store Description </Label>
//                     <Input  
//                       type="text"             
//                       name="store_desc"
//                       placeholder="Store description"  
//                       value={this.state.store_desc}
//                       onChange={this.changeHandler}/>
//                 </Col>
//                 <Col lg="6" md="6" sm="6" className="mb-2">
//                   <Label>Website Url</Label>
//                   <Input      
//                     type="text" 
//                     name="websiteUrl"
//                     placeholder="Enter Website Url"  
//                     value={this.state.websiteUrl}
//                     onChange={this.changeHandler}/>
//                 </Col>
//                 <Col lg="6" md="6" sm="6" className="mb-2">
//                   <Label>Store Email</Label>
//                   <Input     
//                     type="email" 
//                     name="store_email"
//                     placeholder="Email"  
//                     value={this.state.store_email}
//                     onChange={this.changeHandler} />   
//                 </Col>
//                 <Col lg="6" md="6" sm="6" className="mb-2">
//                   <Label>Phone No.</Label>
//                   <Input     
//                     type="number" 
//                     name="phone_no"
//                     placeholder="Phone No." 
//                     value={this.state.phone_no}
//                     onChange={this.changeHandler}/>    
//                 </Col>
//                 <Col lg="6" md="6" sm="6" className="mb-2">
//                   <Label>Alt Phone No.</Label>
//                   <Input     
//                     type="number" 
//                     name="altphone_no"
//                     placeholder="Alt Phone No." 
//                     value={this.state.altphone_no}
//                     onChange={this.changeHandler}/>  
//                 </Col>
//             
//                 <Col lg="6" md="6" sm="6" className="mb-2">
//                   <Label>Day</Label>
//                   <CustomInput    
//                     type="select" 
//                     name="day"
//                     placeholder="Day"  
//                     value={this.state.day}
//                     onChange={this.changeHandler} >
//                       <option value="Monday - Friday">Monday - Friday</option>
//                       <option value="Monday - Saturday">Monday - Saturday</option>
//                       <option value="Monday - Sunday">Monday - Sunday</option>
//                       <option value="Monday - Thrusday">Monday - Thrusday</option>
//                   </CustomInput>    
//                 </Col>
//                 <Col lg="6" md="6" sm="6" className="mb-2">
//                   <Label>Start Time</Label>
//                   <Input   
//                     type="time" 
//                     name="startTym"
//                     placeholder="Start Time"  
//                     value={this.state.startTym}
//                     onChange={this.changeHandler} />
//                 </Col>
//                 <Col lg="6" md="6" sm="6" className="mb-2">
//                   <Label>End Time</Label>
//                   <Input     
//                     type="time" 
//                     name="endTym"
//                     placeholder="End Time"  
//                     value={this.state.endTym}
//                     onChange={this.changeHandler} />  
//                 </Col>
//                 <Col lg="6" md="6" sm="6" className="mb-2">
//                   <Label>Address Line1 </Label>
//                     <Input  
//                       type="textarea"  
//                       name="address_line1"
//                       placeholder="Adderss Line1"  
//                       value={this.state.address_line1}
//                       onChange={this.changeHandler}/>
//                 </Col>
//                 <Col lg="6" md="6" sm="6" className="mb-2">
//                   <Label>Address Line2 </Label>
//                     <Input  
//                       type="textarea"  
//                       name="address_line2"
//                       placeholder="Adderss Line2"  
//                       value={this.state.address_line2}
//                       onChange={this.changeHandler}/>
//                 </Col>
//                 <Col lg="6" md="6" sm="6" className="mb-2">
//                   <Label>Landmark </Label>
//                     <Input  
//                       type="text"    
//                       name="landmark"
//                       placeholder="Landmark"  
//                       value={this.state.landmark}
//                       onChange={this.changeHandler}/>
//                 </Col>
//                 <Col lg="6" md="6" sm="6" className="mb-2">
//                   <Label>State</Label>
//                     <Input    
//                       type="text"
//                       name="state" 
//                       placeholder="State" 
//                       value={this.state.state}
//                       onChange={this.changeHandler}/>   
//                 </Col>             
//               </Row>
//               <Row>
//                 <Col lg="6" md="6" sm="6" className="mb-2">
//                   <Label>City</Label>
//                     <Input   
//                       type="text" 
//                       name="city"
//                       placeholder="City" 
//                       value={this.state.city}
//                       onChange={this.changeHandler}/>
//               </Col> 
//               <Col lg="6" md="6" sm="6" className="mb-2">
//                 <Label>GSTIN No.</Label>
//                   <Input
//                     type="text"
//                     name="gst_no"
//                     value={this.state.gst_no}
//                     onChange={this.changeHandler}/>
//               </Col> 
//               <Col lg="6" md="6" sm="6" className="mb-2">
//                 <Label>Pin Code</Label>
//                   <Input
//                     type="number"
//                     name="pincode"
//                     value={this.state.pincode}
//                     onChange={this.changeHandler}/>
//               </Col> 
//               <Col lg="6" md="6" sm="6" className="mb-2">
//                 <Label>Business Type</Label>
//                    <Input     
//                       type="text" 
//                       name="business_type"
//                       placeholder="Business Type"  
//                       value={this.state.business_type}
//                       onChange={this.changeHandler}/>      
//                </Col>
//                <Col lg="6" md="6" sm="6" className="mb-2">
//                 <Label>Pan No.</Label>
//                   <Input
//                     type="text"
//                     name="pan_no"
//                     value={this.state.pan_no}
//                     onChange={this.changeHandler}/>
//                 </Col> 
//                 <Col lg="6" md="6" sm="6" className="mb-2">
//                 <Label>Company Pan No.</Label>
//                   <Input
//                     type="text"
//                     name="company_panno"
//                     value={this.state.company_panno}
//                     onChange={this.changeHandler}/>
//                 </Col> 
//                 <Col lg="6" md="6" sm="6" className="mb-2">
//                   <Label>Address Proof ID </Label>
//                     <CustomInput  
//                       type="select"  
//                       name="address_proof"
//                       placeholder="Adderss Proof"  
//                       value={this.state.address_proof}
//                       onChange={this.changeHandler}>
//                         <option value="Address Proof ID">Address Proof ID</option>
//                         <option value="Electricity Bill">Electricity Bill</option>
//                         <option value="Telephone Bill">Telephone Bill</option>
//                         <option value="Rental Agreementy">Rental Agreement</option>
                      
//                   </CustomInput> 
//                 </Col>
                
//                 <Col lg="6" md="6" sm="6" className="mb-2">
//                   <Label>Sort Oder</Label>
//                     <Input  
//                       type="number"  
//                       name="sortorder"
//                       placeholder="Sort Order"  
//                       value={this.state.sortorder}
//                       onChange={this.changeHandler}/>
//                 </Col>
//                 <Col lg="6" md="6" sm="6" className="mb-2">
//                     <Label>Store image</Label>
//                       <CustomInput  
//                         type="file"
//                         multiple
//                         onChange={this.onChangeHandler}/>    
//                   </Col>
//                   <Col lg="6" md="6" sm="6" className="mb-2">
//                     <Label>Shop Logo Image</Label>
//                       <CustomInput  
//                         type="file"
//                         multiple
//                         onChange={this.onChangeHandler1} />    
//                   </Col>
//                   <Col lg="6" md="6" sm="6" className="mb-2">
//                     <Label>GST Image</Label>
//                       <CustomInput  
//                         type="file"
//                         multiple
//                         onChange={this.onChangeHandler2}/>    
//                   </Col>
//                   <Col lg="6" md="6" sm="6" className="mb-2">
//                     <Label>Store Pan Image</Label>
//                       <CustomInput  
//                         type="file"
//                         multiple
//                         onChange={this.onChangeHandler3}/>    
//                   </Col>
//                   <Col lg="6" md="6" sm="6" className="mb-2">
//                     <Label>Tradelicence Image</Label>
//                       <CustomInput  
//                         type="file"
//                         multiple
//                         onChange={this.onChangeHandler4}/>    
//                   </Col>
//                   <Col lg="6" md="6" sm="6" className="mb-2">
//                     <Label>Company Pan Image</Label>
//                       <CustomInput  
//                         type="file"
//                         multiple
//                         onChange={this.onChangeHandler5}/>    
//                   </Col>
//                   <Col lg="6" md="6" sm="6" className="mb-2">
//                     <Label>Address Proof Image</Label>
//                       <CustomInput  
//                         type="file"
//                         multiple
//                         onChange={this.onChangeHandler6}/>    
//                   </Col>
               
//                   <Col lg="6" md="6" sm="6" className="mb-2">
//                   <Label className="mb-1">Status</Label>
//                   <div
//                     className="form-label-group"
//                     onChange={(e) => this.changeHandler1(e)}>
//                     <input
//                       style={{ marginRight: "3px" }}
//                       type="radio"
//                       name="status"
//                       value="Active"/>
//                     <span style={{ marginRight: "20px" }}>Active</span>       
//                     <input
//                       style={{ marginRight: "3px" }}
//                       type="radio"
//                       name="status"
//                       value="Inactive"/>
//                     <span style={{ marginRight: "3px" }}>Inactive</span>
//                   </div>
//                 </Col> 
//                 </Row>
//               <Row>
//                 <Col lg="6" md="6" sm="6" className="mb-2">
//                   <Button.Ripple
//                     color="primary"
//                     type="submit"
//                     className="mr-1 mb-1">
//                     Add Store
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
