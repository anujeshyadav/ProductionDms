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
} from "../../../../ApiEndPoint/ApiCalling";

export class AddSubCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: [{ subcategory_name: "", Description: "" }],
      CatList: [],
      subcategory_name: "",
      category: "",
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

  handleChange(i, e) {
    let formValues = this.state.formValues;
    let { name, value } = e.target;
    formValues[i][name] = value;
    this.setState({ formValues });
  }

  addFormFields() {
    this.setState({
      formValues: [
        ...this.state.formValues,
        { subcategory_name: "", Description: "" },
      ],
    });
  }

  removeFormFields(i) {
    let formValues = this.state.formValues;
    formValues.splice(i, 1);
    this.setState({ formValues });
  }
  handleSubmit(event) {}

  async componentDidMount() {
    let pageparmission = JSON.parse(localStorage.getItem("userData"));
    let userData = JSON.parse(localStorage.getItem("userData"));
    await AllCategoryList(userData?._id, userData?.database)
      .then((res) => {
        console.log(res);
        if (res?.Category) {
          this.setState({ CatList: res?.Category });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // Submit Sub-Category Api
  submitHandler = async (e) => {
    e.preventDefault();
    let pageparmission = JSON.parse(localStorage.getItem("userData"));
    const data = new FormData();
    data.append("created_by", pageparmission?._id);
    data.append("name", this.state.subcategory_name);
    data.append("category", this.state.category);
    data.append("description", this.state.Description);
    data.append("status", this.state.status);
    if (this.state.selectedFile1) {
      data.append("file", this.state.selectedFile1);
    }

    await CreateSubCategory(data)
      .then((res) => {
        swal("Success!", "Your Subcategory has been Added", "success");
        this.props.history.push("/app/freshlist/subcategory/subCategoryList");
      })
      .catch((err) => {
        console.log(err);
      });
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
                Add Production Steps
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
              </Row>
              {/* <div>
                {this.state.formValues?.map((element, index) => (
                  <>
                    <Row>
                      <Col lg="4" md="4">
                        <FormGroup>
                          <Label> Production Process Name</Label>
                          <Input
                            required
                            type="text"
                            placeholder="subcategory name"
                            name="subcategory_name"
                            value={element.subcategory_name}
                            onChange={(e) => this.handleChange(index, e)}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="4" md="4">
                        <FormGroup>
                          <Label> Sub-Category Description</Label>
                          <Input
                            required
                            placeholder="Category Description"
                            name="Description"
                            value={element.Description}
                            onChange={(e) => this.handleChange(index, e)}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="4" md="4">
                        {index ? (
                          <>
                            <Button
                              color="danger"
                              className="mt-1"
                              onClick={() => this.removeFormFields(index)}>
                              -
                            </Button>
                          </>
                        ) : null}
                        <Button
                          color="primary"
                          className="mx-1 mt-1"
                          type="button"
                          onClick={() => this.addFormFields()}>
                          +
                        </Button>
                      </Col>
                    </Row>
                  </>
                ))}
              </div> */}

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

              {/* <Col lg="4" md="4">
                  <FormGroup>
                    <Label>SubCategory Image </Label>
                    <CustomInput type="file" onChange={this.onChangeHandler1} />
                  </FormGroup>
                </Col> */}

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
              <Row>
                <Col lg="4" md="4" sm="6" className="mb-2 mt-1">
                  <Label className="mb-0">Status</Label>
                  <div
                    className="form-label-group"
                    onChange={this.changeHandler1}>
                    <input
                      style={{ marginRight: "3px" }}
                      type="radio"
                      name="status"
                      value="Active"
                    />
                    <span style={{ marginRight: "20px" }}>Active</span>

                    <input
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
export default AddSubCategory;
