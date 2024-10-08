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
  Table,
} from "reactstrap";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../../../../../assets/scss/plugins/extensions/editor.scss";
import { Route } from "react-router-dom";
import { history } from "../../../../../history";
import axiosConfig from "../../../../../axiosConfig";

export class Banner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      title: "",
      product: "",
      main: "",
      link: "",
      selectedFile: null,
      selectedName: "",
      sortorder: "",
      brand_img: "",
      inputlist: [{ selected: "", attribute: "", quantity: "" }],
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
  handleremove = (index) => {
    const list = [...this.state.inputlist];
    list.splice(index, 1);
    this.setState({ inputlist: list });
  };
  handleClick = () => {
    this.setState({
      inputlist: [
        ...this.state.inputlist,
        { selected: this.state.myvalue, attribute: "", quantity: "" },
      ],
    });
  };

  submitHandler = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", this.state.name);
    data.append("title", this.state.title);
    data.append("product", this.state.product);
    data.append("main", this.state.main);
    data.append("link", this.state.link);
    data.append("sortorder", this.state.sortorder);
    if (this.state.selectedFile !== null) {
      data.append(
        "brand_img",
        this.state.selectedFile,
        this.state.selectedName
      );
    }
  };
  render() {
    return (
      <div>
        <Card>
          <CardBody>
            <Form className="m-1" onSubmit={this.submitHandler}>
              <hr />
              <Row>
                <Col lg="12" md="12">
                  <Table responsive bordered>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Type:Product/Quantity</th>
                        <th>Type:Main/Inner</th>
                        <th>Link(Auto Complete)</th>
                        <th>Image</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.inputlist.map((e, i) => {
                        return (
                          <>
                            <tr key={i}>
                              <td className="p-0">
                                <Input
                                  type="text"
                                  placeholder="Quantity"
                                  name="name"
                                  value={this.state.name}
                                  onChange={this.changeHandler}
                                />
                              </td>
                              <td>
                                <CustomInput
                                  type="select"
                                  placeholder="option value"
                                  name="type"
                                  value={this.state.name}
                                  onChange={this.changeHandler}
                                >
                                  <option value="Product">Product</option>
                                  <option value="Product2">Product2</option>
                                  <option value="Product3">Product3</option>
                                </CustomInput>
                              </td>
                              <td>
                                <CustomInput
                                  type="select"
                                  placeholder="option value"
                                  name="type"
                                  value={this.state.name}
                                  onChange={this.changeHandler}
                                >
                                  <option value="Banner">Banner</option>
                                  <option value="Banner1">Banner1</option>
                                  <option value="Banner2">Banner2</option>
                                </CustomInput>
                              </td>
                              <td>
                                <Input
                                  type="text"
                                  placeholder="Price"
                                  name="name"
                                  value={this.state.name}
                                  onChange={this.changeHandler}
                                />
                              </td>
                              <td>
                                <img
                                  width="150px"
                                  alt="Card cap"
                                  src="https://picsum.photos/318/180"
                                />
                              </td>

                              <td>
                                {this.state.inputlist.length !== 1 && (
                                  <Button
                                    color="primary"
                                    className="mr-1"
                                    style={{ height: "40px" }}
                                    onClick={() => this.handleremove(i)}
                                  >
                                    -
                                  </Button>
                                )}
                              </td>
                            </tr>
                          </>
                        );
                      })}
                      {this.state.inputlist.map((e, i) => {
                        return (
                          <>
                            <tr>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td>
                                {this.state.inputlist.length - 1 === i && (
                                  <Button
                                    color="primary"
                                    style={{ padding: "5px 8px" }}
                                    onClick={this.handleClick}
                                  >
                                    +
                                  </Button>
                                )}
                              </td>
                              <td></td>
                            </tr>
                          </>
                        );
                      })}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </div>
    );
  }
}
export default Banner;
