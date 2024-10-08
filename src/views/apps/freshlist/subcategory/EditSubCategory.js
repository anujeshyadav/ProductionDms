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
// import { Route } from "react-router-dom";
// import swal from "sweetalert";

// export class EditSubCategory extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       list: [],
//       data: {},
//       subcategory_name: "",
//       category: "",
//       type: "",
//       feature: "",
//       status: "",
//       selectedFile1: null,
//       selectedName1: "",
//       selectedFile2: null,
//       selectedName2: "",
//       selectedFile3: null,
//       selectedName3: "",
//       selectedFile4: null,
//       selectedName4: "",
//     };
//   }

//   onChangeHandler1 = (event) => {
//     this.setState({ selectedFile1: event.target.files[0] });
//     this.setState({ selectedName1: event.target.files[0].name });
//     console.log(event.target.files[0]);
//   };
//   onChangeHandler2 = (event) => {
//     this.setState({ selectedFile2: event.target.files[0] });
//     this.setState({ selectedName2: event.target.files[0].name });
//     console.log(event.target.files[0]);
//   };
//   onChangeHandler3 = (event) => {
//     this.setState({ selectedFile3: event.target.files[0] });
//     this.setState({ selectedName3: event.target.files[0].name });
//     console.log(event.target.files[0]);
//   };
//   onChangeHandler4 = (event) => {
//     this.setState({ selectedFile4: event.target.files[0] });
//     this.setState({ selectedName4: event.target.files[0].name });
//     console.log(event.target.files[0]);
//   };

//   changeHandler1 = (e) => {
//     this.setState({ status: e.target.value });
//   };
//   changeHandler = (e) => {
//     this.setState({ [e.target.name]: e.target.value });
//   };

//   // All Category Api

//   componentDidMount() {
//     axiosConfig
//       .get(`/admin/getallcategory`)
//       .then((response) => {
//         console.log(response.data.data);
//         this.setState({ list: response.data.data });
//         console.log(this.state.data);
//       })
//       .catch((error) => {
//         console.log(error);
//       });

//     let { id } = this.props.match.params;
//     axiosConfig
//       .get(`/admin/sub_viewonedata/${id}`)
//       .then((response) => {
//         console.log(response.data.data);
//         this.setState({
//           data: response.data.data,
//           subcategory_name: response.data.data.subcategory_name,
//           feature: response.data.data.feature,
//           type: response.data.data.type,
//         });
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }

//   // Submit Sub-Category Api
//   submitHandler = (e) => {
//     e.preventDefault();
//     const data = new FormData();
//     data.append("subcategory_name", this.state.subcategory_name);
//     data.append("category", this.state.category);
//     data.append("type", this.state.type);
//     data.append("feature", this.state.feature);
//     data.append("status", this.state.status);
//     if (this.state.selectedFile1 !== null) {
//       data.append("image", this.state.selectedFile1, this.state.selectedName1);
//     }
//     if (this.state.selectedFile2 !== null) {
//       data.append(
//         "thumbnail_img",
//         this.state.selectedFile2,
//         this.state.selectedName2
//       );
//     }
//     if (this.state.selectedFile3 !== null) {
//       data.append(
//         "webbanner",
//         this.state.selectedFile3,
//         this.state.selectedName3
//       );
//     }
//     if (this.state.selectedFile4 !== null) {
//       data.append(
//         "app_banner",
//         this.state.selectedFile4,
//         this.state.selectedName4
//       );
//     }

//     for (var value of data.values()) {
//       console.log(value);
//     }
//     let { id } = this.props.match.params;

//     axiosConfig
//       .post(`/admin/edit_Subcategory/${id}`, data)
//       .then((response) => {
//         console.log(response);
//         if (response.data.message === "success") {
//           swal("Success!", "Submitted Succesfully", "success");
//           this.props.history.push("/app/freshlist/subcategory/subCategoryList");
//         }
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
//                 Edit
//               </h1>
//             </Col>
//             <Col>
//               <Route
//                 render={({ history }) => (
//                   <Button
//                     className=" btn btn-danger float-right"
//                     onClick={() =>
//                       history.push("/app/freshlist/subcategory/subCategoryList")
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
//               <Row className="mb-2">
//                 <Col lg="6" md="6">
//                   <FormGroup>
//                     <Label> Sub-Category Name</Label>
//                     <Input
//                       type="text"
//                       placeholder="Category Name"
//                       name="subcategory_name"
//                       value={this.state.subcategory_name}
//                       onChange={this.changeHandler}
//                     />
//                   </FormGroup>
//                 </Col>
//                 <Col lg="6" md="6" className="mb-2">
//                   <Label>Category</Label>
//                   <CustomInput
//                     type="select"
//                     placeholder="Select Category"
//                     name="category"
//                     value={this.state.category}
//                     onChange={this.changeHandler}
//                   >
//                     <option>Select Category</option>
//                     {this.state.list.map((cat) => (
//                       <option value={cat._id} key={cat._id}>
//                         {cat.category_name}
//                       </option>
//                     ))}
//                   </CustomInput>
//                 </Col>
//                 <Col lg="6" md="6" className="mb-2">
//                   <Label>Type</Label>
//                   <CustomInput
//                     type="select"
//                     placeholder="Select Type"
//                     name="type"
//                     value={this.state.type}
//                     onChange={this.changeHandler}
//                   >
//                     <option>---Select---</option>
//                     <option value="veg">Veg</option>
//                     <option value="nonveg">Non-Veg</option>
//                     <option value="egg">Egg only</option>
//                   </CustomInput>
//                 </Col>

//                 <Col lg="6" md="6">
//                   <FormGroup>
//                     <Label>Category Image </Label>
//                     <CustomInput type="file" onChange={this.onChangeHandler1} />
//                   </FormGroup>
//                 </Col>

//                 <Col lg="6" md="6">
//                   <FormGroup>
//                     <Label>Thumbnail</Label>
//                     <CustomInput type="file" onChange={this.onChangeHandler2} />
//                   </FormGroup>
//                 </Col>

//                 <Col lg="6" md="6">
//                   <FormGroup>
//                     <Label>Web Banner </Label>
//                     <CustomInput type="file" onChange={this.onChangeHandler3} />
//                   </FormGroup>
//                 </Col>
//                 <Col lg="6" md="6">
//                   <FormGroup>
//                     <Label>App Banner</Label>
//                     <CustomInput type="file" onChange={this.onChangeHandler4} />
//                   </FormGroup>
//                 </Col>

//                 <Col lg="6" md="6" className="mb-2">
//                   <Label>Feature</Label>
//                   <CustomInput
//                     type="select"
//                     placeholder="Select Type"
//                     name="feature"
//                     value={this.state.feature}
//                     onChange={this.changeHandler}
//                   >
//                     <option>Select Feature</option>
//                     <option value="yes">Yes</option>
//                     <option value="no">No</option>
//                   </CustomInput>
//                 </Col>

//                 <Col lg="6" md="6" sm="6" className="mb-2 mt-1">
//                   <Label className="mb-0">Status</Label>
//                   <div
//                     className="form-label-group"
//                     onChange={this.handleChange}
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
//                       value="Deactive"
//                     />
//                     <span style={{ marginRight: "3px" }}>Deactive</span>
//                   </div>
//                 </Col>
//               </Row>

//               <Row>
//                 <Button.Ripple
//                   color="primary"
//                   type="submit"
//                   className="mr-1 mb-1"
//                 >
//                   Add
//                 </Button.Ripple>
//               </Row>
//             </Form>
//           </CardBody>
//         </Card>
//       </div>
//     );
//   }
// }
// export default EditSubCategory;


import React, { Component } from "react";
import {
  Card,
  CardBody,
  Col,
  Form,
  Row,
  Input,
  Label,
  Button,
  FormGroup,
  CustomInput,
} from "reactstrap";
import { history } from "../../../../history";
import axiosConfig from "../../../../axiosConfig";
import { Route } from "react-router-dom";
import swal from "sweetalert";
import {
  AllCategoryList,
  CreateSubCategory,
  Update_SubCategory,
} from "../../../../ApiEndPoint/ApiCalling";
import { Image_URL } from "../../../../ApiEndPoint/Api";

export class EditSubCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CatList: [],
      subcategory_name: "",
      category: "",
      file: "",
      type: "",
      feature: "",
      status: "",
      Description: "",
      selectedFile1: null,
      selectedName1: "",
      selectedFile2: null,
      selectedName2: "",
      selectedFile3: null,
      selectedName3: "",
      selectedFile4: null,
      selectedName4: "",
    };
  }

  onChangeHandler1 = (event) => {
    this.setState({ selectedFile1: event.target.files[0] });
    this.setState({ selectedName1: event.target.files[0].name });
    console.log(event.target.files[0]);
  };
  onChangeHandler2 = (event) => {
    this.setState({ selectedFile2: event.target.files[0] });
    this.setState({ selectedName2: event.target.files[0].name });
    console.log(event.target.files[0]);
  };
  onChangeHandler3 = (event) => {
    this.setState({ selectedFile3: event.target.files[0] });
    this.setState({ selectedName3: event.target.files[0].name });
    console.log(event.target.files[0]);
  };
  onChangeHandler4 = (event) => {
    this.setState({ selectedFile4: event.target.files[0] });
    this.setState({ selectedName4: event.target.files[0].name });
    console.log(event.target.files[0]);
  };

  changeHandler1 = (e) => {
    this.setState({ status: e.target.value });
  };
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value?.toUpperCase() });
  };

  // All Category Api

  async componentDidMount() {
    let { cid, sid } = this.props.match.params;
    let pageparmission = JSON.parse(localStorage.getItem("userData"));

    let userData = JSON.parse(localStorage.getItem("userData"));
    await AllCategoryList(userData?._id, userData?.database)
      .then((res) => {
        console.log(res);
        if (res?.Category) {
          this.setState({ CatList: res?.Category });
          let Cat = res?.Category?.filter((ele, i) => ele?._id == cid);
          console.log(Cat);
          this.setState({ category: cid });
          let subcat = Cat[0]?.subcategories?.filter(
            (ele, i) => ele?._id == sid
          );
          console.log(subcat);
          let mysubcat = subcat[0];
          this.setState({
            subcategory_name: mysubcat?.name,
            Description: mysubcat?.description,
            status: mysubcat?.status,
            file: mysubcat?.image,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // Submit Sub-Category Api
  submitHandler = async (e) => {
    e.preventDefault();
    let { cid, sid } = this.props.match.params;
    const data = new FormData();
    data.append("name", this.state.subcategory_name);
    data.append("category", this.state.category);
    data.append("description", this.state.Description);
    data.append("status", this.state.status);
    if (this.state.selectedFile1) {
      data.append("file", this.state.selectedFile1);
    }

    Update_SubCategory(cid, sid, data)
      .then((res) => {
        swal("Success!", "Your Subcategory has been Updated", "success");
        this.props.history.push("/app/freshlist/subcategory/subCategoryList");
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    // await CreateSubCategory(data)
    //   .then((res) => {
    //     console.log(res);
    //     swal("Success!", "Your Subcategory has been Added", "success");
    //     this.props.history.push("/app/freshlist/subcategory/subCategoryList");
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    // for (var value of data.values()) {
    //   console.log(value);
    // }
  };
  render() {
    return (
      <div>
        <Card>
          <Row className="m-2">
            <Col>
              <h1 col-sm-6 className="float-left">
                Edit SubCategory
              </h1>
            </Col>
            <Col>
              <Route
                render={({ history }) => (
                  <Button
                    className=" btn btn-danger float-right"
                    onClick={() =>
                      history.push("/app/freshlist/subcategory/subCategoryList")
                    }>
                    Back
                  </Button>
                )}
              />
            </Col>
          </Row>
          <CardBody>
            <Form className="m-1" onSubmit={this.submitHandler}>
              <Row className="mb-2">
                <Col lg="4" md="4" className="mb-2">
                  <Label>Category *</Label>
                  <CustomInput
                    required
                    type="select"
                    placeholder="Select Category"
                    name="category"
                    value={this.state.category}
                    onChange={(e) => {
                      this.setState({ category: e.target.value });
                    }}
                    // onChange={this.changeHandler}
                  >
                    <option>--Select Category--</option>
                    {this.state.CatList?.map((cat) => (
                      <option value={cat?._id} key={cat?._id}>
                        {cat?.name}
                      </option>
                    ))}
                  </CustomInput>
                </Col>

                <Col lg="4" md="4">
                  <FormGroup>
                    <Label> Sub-Category Name</Label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="subcategory name "
                      name="subcategory_name"
                      value={this.state.subcategory_name}
                      onChange={this.changeHandler}
                    />
                  </FormGroup>
                </Col>
                <Col lg="4" md="4">
                  <FormGroup>
                    <Label> Sub-Category Description</Label>
                    <textarea
                      type="textarea"
                      className="form-control"
                      placeholder="Category Description"
                      name="Description"
                      value={this.state.Description}
                      onChange={this.changeHandler}
                    />
                  </FormGroup>
                </Col>
                {/* <Col lg="4" md="4" className="mb-2">
                  <Label>Type</Label>
                  <CustomInput
                    type="select"
                    placeholder="Select Type"
                    name="type"
                    value={this.state.type}
                    onChange={this.changeHandler}
                  >
                    <option>---Select---</option>
                    <option value="veg">Veg</option>
                    <option value="nonveg">Non-Veg</option>
                    <option value="egg">Egg only</option>
                  </CustomInput>
                </Col> */}

                <Col lg="4" md="4">
                  <FormGroup>
                    <Label>SubCategory Image </Label>
                    <CustomInput type="file" onChange={this.onChangeHandler1} />
                  </FormGroup>
                </Col>
                <Col lg="4" md="4">
                  {this.state.file && (
                    <img
                      style={{ borderRadius: "8px" }}
                      src={`${Image_URL}/Images/${this.state.file}`}
                      alt=""
                      height="100"
                      width="100"
                    />
                  )}
                </Col>

                {/* <Col lg="4" md="4">
                  <FormGroup>
                    <Label>Thumbnail</Label>
                    <CustomInput type="file" onChange={this.onChangeHandler2} />
                  </FormGroup>
                </Col> */}

                {/* <Col lg="4" md="4">
                  <FormGroup>
                    <Label>Web Banner </Label>
                    <CustomInput type="file" onChange={this.onChangeHandler3} />
                  </FormGroup>
                </Col> */}
                {/* <Col lg="4" md="4">
                  <FormGroup>
                    <Label>App Banner</Label>
                    <CustomInput type="file" onChange={this.onChangeHandler4} />
                  </FormGroup>
                </Col> */}

                {/* <Col lg="4" md="4" className="mb-2">
                  <Label>Feature</Label>
                  <CustomInput
                    type="select"
                    placeholder="Select Type"
                    name="feature"
                    value={this.state.feature}
                    onChange={this.changeHandler}
                  >
                    <option>Select Feature</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </CustomInput>
                </Col> */}

                <Col lg="4" md="4" sm="6" className="mb-2 mt-1">
                  <Label className="mb-0">Status</Label>
                  <div
                    className="form-label-group"
                    onChange={this.changeHandler1}>
                    <input
                      checked={this.state.status == "Active"}
                      style={{ marginRight: "3px" }}
                      type="radio"
                      name="status"
                      value="Active"
                    />
                    <span style={{ marginRight: "20px" }}>Active</span>

                    <input
                      checked={this.state.status == "Deactive"}
                      style={{ marginRight: "3px" }}
                      type="radio"
                      name="status"
                      value="Deactive"
                    />
                    <span style={{ marginRight: "3px" }}>Deactive</span>
                  </div>
                </Col>
              </Row>

              <Row>
                <Button.Ripple
                  color="primary"
                  type="submit"
                  className="mr-1 mb-1">
                  + Add
                </Button.Ripple>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </div>
    );
  }
}
export default EditSubCategory;
