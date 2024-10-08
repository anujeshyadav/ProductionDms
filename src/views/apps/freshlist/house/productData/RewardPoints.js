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
import { history } from "../../../../../history";
import axiosConfig from "../../../../../axiosConfig";

export class RewardPoints extends Component {
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
                        <th>Customer Group</th>
                        <th>Reward Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.inputlist.map((e, i) => {
                        return (
                          <>
                            <tr key={i}>
                              <td className="p-0">Default</td>

                              <td>
                                <Input
                                  type="text"
                                  //   placeholder="Date End"
                                  name="name"
                                  value={this.state.name}
                                  onChange={this.changeHandler}
                                />
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
export default RewardPoints;
