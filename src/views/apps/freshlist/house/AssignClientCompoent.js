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
import { CloudLightning } from "react-feather";

export class AssignClientCompoent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category_name: "",
      Brand: "",
      quantity: "",
      Type: "",
      Price: "",
      stock: "",
      Regularprice: "",
      formValues: [{ PName: "", price: "" }],
      DiscountPrice: "",
      Addmore: false,
      rowData: [],
      description: "",
      variety: "",
      shipmentfee: "",
      Tags: "",
      taxrate: "",
      status: "",
      // selectedFile1: null,
      // selectedName1: "",
      // selectedFile2: null,
      // selectedName2: "",
      selectedFile3: [],
      selectedName3: "",
      // selectedFile4: null,
      // selectedName4: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  async componentDidMount() {
    await axiosConfig.get("/getcategory").then((response) => {
      let rowData = response.data.data?.category;
      console.log(rowData);
      this.setState({ rowData });
    });
    await axiosConfig.get("/getbrand").then((response) => {
      let Brandlist = response.data.data?.brands;
      //   console.log(Brandlist);
      this.setState({ Brandlist });
    });
  }

  handleChange(i, e) {
    let formValues = this.state.formValues;
    formValues[i][e.target.name] = e.target.value;
    this.setState({ formValues });
  }

  addFormFields() {
    this.setState({
      formValues: [...this.state.formValues, { PName: "", price: "" }],
    });
    this.handleSubmit();
  }

  removeFormFields(i) {
    let formValues = this.state.formValues;
    formValues.splice(i, 1);
    this.setState({ formValues });
  }

  handleSubmit() {
    console.log(this.state.formValues);
  }

  // onChangeHandler1 = (event) => {
  //   this.setState({ selectedFile1: event.target.files[0] });
  //   this.setState({ selectedName1: event.target.files[0].name });
  //   console.log(event.target.files[0]);
  // };
  // onChangeHandler2 = (event) => {
  //   this.setState({ selectedFile2: event.target.files[0] });
  //   this.setState({ selectedName2: event.target.files[0].name });
  //   console.log(event.target.files[0]);
  // };
  onChangeHandler3 = (event) => {
    let selectedName = Array.from(event.target.files);
    console.log(selectedName);
    this.setState({ selectedFile3: selectedName });

    // this.setState({ selectedFile3: event.target.files });
    // this.setState({ selectedName3: event.target.files[0].name });
    // console.log(event.target.files);
  };
  // onChangeHandler4 = (event) => {
  //   this.setState({ selectedFile4: event.target.files[0] });
  //   this.setState({ selectedName4: event.target.files[0].name });
  //   console.log(event.target.files[0]);
  // };

  changeHandler1 = (e) => {
    this.setState({ status: e.target.value });
  };
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  submitHandler = (e) => {
    e.preventDefault();
    const data = new FormData();
    console.log(this.state.formValues);
    data.append("brand_id", this.state.Brand);
    data.append("title", this.state.P_Title);
    data.append("veriety", JSON.stringify(this.state.formValues));
    data.append("category_id", this.state.category_name);
    data.append("stock", this.state.stock);
    data.append("price", this.state.Price);
    data.append("discountprice", this.state.DiscountPrice);
    data.append("description", this.state.description);
    data.append("shipping_fee", this.state.shipmentfee);
    data.append("tax_rate", this.state.taxrate);
    data.append("tags", this.state.Tags);
    data.append("status", "Active");
    // this.state.selectedFile3.forEach((image, index) => {
    //   data.append(`image`, image);
    // });
    // debugger;
    for (let i = 0; i < this.state.selectedFile3?.length; i++) {
      data.append("images[]", this.state.selectedFile3[i]);
    }
    // for (const file of this.state.selectedFile3) {
    //   if (this.state.selectedFile3 !== null) {
    //     data.append("image_name", file);
    //   }
    // }

    axiosConfig
      .post(`/addproduct`, data, {
        headers: {
          "Content-Type": "multipart/form-data; ",
        },
      })
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          swal("Success!", "You Data iS been Submitted", "success");
          // this.props.history.push("/app/freshlist/category/categoryList");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  render() {
    return (
      <div>
        <Card className="mb-0">
          <CardBody>
            <Form className="m-1" onSubmit={this.submitHandler}>
              <Row className="mb-2">
                <Col lg="3" md="3">
                  <FormGroup>
                    <Label> Choose Category *</Label>

                    <select
                      onChange={(e) =>
                        this.setState({ category_name: e.target.value })
                      }
                      className="form-control"
                      name="Select"
                      id="Select"
                    >
                      <option value="volvo">--Select Category--</option>
                      {this.state.rowData &&
                        this.state.rowData?.map((val, i) => (
                          <option key={i} value={val?.id}>
                            {val?.category_name}
                          </option>
                        ))}
                    </select>
                  </FormGroup>
                </Col>
                <Col lg="3" md="3">
                  <FormGroup>
                    <Label> Choose Type *</Label>

                    <select
                      onChange={(e) => this.setState({ Type: e.target.value })}
                      className="form-control"
                      name="Select"
                      id="Select"
                    >
                      <option value="volvo">--Select Type--</option>
                      {this.state.rowData &&
                        this.state.rowData?.map((val, i) => (
                          <option key={i} value={val?.id}>
                            {val?.category_name}
                          </option>
                        ))}
                    </select>
                    {/* <Input
                      type="text"
                      placeholder="Title"
                      name="category_name"
                      bsSize="lg"
                      value={this.state.category_name}
                      onChange={this.changeHandler}
                    /> */}
                  </FormGroup>
                </Col>
                <Col lg="3" md="3">
                  <FormGroup>
                    <Label> Choose Brand *</Label>

                    <select
                      required
                      onChange={(e) => this.setState({ Brand: e.target.value })}
                      className="form-control"
                      name="Select"
                      id="Select"
                    >
                      <option value="volvo">--Select Brand--</option>
                      {this.state.Brandlist &&
                        this.state.Brandlist?.map((val, i) => (
                          <option key={i} value={val?.id}>
                            {val?.brand_name}
                          </option>
                        ))}
                    </select>
                  </FormGroup>
                </Col>
                <Col lg="3" md="3">
                  <Button.Ripple color="primary" type="submit" className="mt-2">
                    Search
                  </Button.Ripple>
                </Col>
                {/* <Col lg="3" md="3">
                  <FormGroup>
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      placeholder="Quantity..."
                      name="quantity"
                      bsSize="lg"
                      value={this.state.quantity}
                      onChange={this.changeHandler}
                    />
                  </FormGroup>
                </Col> */}
                {/* <Col lg="12" md="12">
                  <FormGroup>
                    <Label>Description</Label>
                    <textarea
                      type="text"
                      rows={5}
                      className="form-control"
                      placeholder="Description ..."
                      name="description"
                      bsSize="lg"
                      value={this.state.description}
                      onChange={this.changeHandler}
                    />
                  </FormGroup>
                </Col> */}
                {/* <Col lg="6" md="6">
                  <FormGroup>
                    <Label> PRICE (₹)</Label>
                    <Input
                      type="number"
                      placeholder="Amount In Number"
                      name="Price"
                      bsSize="lg"
                      value={this.state.Price}
                      onChange={this.changeHandler}
                    />
                  </FormGroup>
                </Col> */}
                {/* <Col lg="6" md="6">
                  <Row>
                    <Col lg="2" sm="2" md="2">
                      <div>
                        <h5 className="mt-2"> OR</h5>
                      </div>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Button
                          style={{ width: "100%" }}
                          color="primary"
                          className="button add mt-2"
                          type="button"
                          onClick={() => this.setState({ Addmore: true })}
                        >
                          Add
                        </Button>

                        
                      </FormGroup>
                    </Col>
                  </Row>
                </Col> */}
              </Row>
              {/* {this.state.Addmore ? (
                <>
                  <Row>
                    <Col lg="12">
                      {this.state.formValues.map((element, index) => (
                        <div className="" key={index}>
                          <Row className="py-1">
                            <Col lg="4" sm="4">
                              <label>Product Name</label>
                              <input
                                className="form-control"
                                type="text"
                                name="PName"
                                value={element.PName || ""}
                                onChange={(e) => this.handleChange(index, e)}
                              />
                            </Col>
                            <Col lg="4" sm="4">
                              <label>Price</label>
                              <input
                                className="form-control"
                                type="number"
                                name="price"
                                value={element.price || ""}
                                onChange={(e) => this.handleChange(index, e)}
                              />
                            </Col>
                            <Col>
                              {index ? (
                                <Button
                                  color="primary"
                                  type="button"
                                  className="button remove mt-2"
                                  onClick={() => this.removeFormFields(index)}
                                >
                                  Remove
                                </Button>
                              ) : null}
                              <Button
                                color="primary"
                                className="button add mt-2  mx-3"
                                type="button"
                                onClick={() => this.addFormFields()}
                              >
                                Add
                              </Button>
                            </Col>
                          </Row>
                        </div>
                      ))}
                    </Col>
                  </Row>
                </>
              ) : null} */}

              {/* <Row>
                <Col lg="6" md="6">
                  <FormGroup>
                    <Label> Quantity </Label>
                    <Input
                      type="number"
                      placeholder="in Number"
                      name="stock"
                      bsSize="lg"
                      value={this.state.stock}
                      onChange={this.changeHandler}
                    />
                  </FormGroup>
                </Col>
                <Col lg="6" md="6">
                  <FormGroup>
                    <Label>Discount Price</Label>
                    <Input
                      type="number"
                      placeholder="Discount Price"
                      name="DiscountPrice"
                      bsSize="lg"
                      value={this.state.DiscountPrice}
                      onChange={this.changeHandler}
                    />
                  </FormGroup>
                </Col>
                <Col lg="6" md="6">
                  <FormGroup>
                    <Label>SHIPING FEE(₹)</Label>
                    <Input
                      type="number"
                      placeholder="Number..."
                      name="shipmentfee"
                      bsSize="lg"
                      value={this.state.shipmentfee}
                      onChange={this.changeHandler}
                    />
                  </FormGroup>
                </Col>
                <Col lg="6" md="6">
                  <FormGroup>
                    <Label>TAX RATE (%)</Label>
                    <Input
                      type="number"
                      placeholder="Tax in Percentage"
                      name="taxrate"
                      bsSize="lg"
                      value={this.state.taxrate}
                      onChange={this.changeHandler}
                    />
                  </FormGroup>
                </Col>
                <Col lg="6" md="6">
                  <FormGroup>
                    <Label>TAGS</Label>
                    <Input
                      type="text"
                      placeholder="Type here..."
                      name="Tags"
                      bsSize="lg"
                      value={this.state.Tags}
                      onChange={this.changeHandler}
                    />
                  </FormGroup>
                </Col>
              </Row> */}
              {/* <Row>
                <Col lg="6" sm="6">
                  <FormGroup>
                    <Label>Media & Published (Select multiple files)</Label>
                    <CustomInput
                      multiple
                      style={{ cursor: "pointer" }}
                      accept="image/png,image/jpeg,image/jpg"
                      name="image[]"
                      type="file"
                      onChange={this.onChangeHandler3}
                    />
                  </FormGroup>
                </Col>
              </Row> */}
              <Row></Row>
            </Form>
          </CardBody>
        </Card>
      </div>
    );
  }
}
export default AssignClientCompoent;
