import React, { Component } from "react";

import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Form,
  Row,
  Input,
  CustomInput,
  Label,
  Button,
} from "reactstrap";

export class AddChildCategory extends Component {
  render() {
    return (
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Add Child Caregory</CardTitle>
          </CardHeader>
          <CardBody>
            <Form className="m-1">
              <Row className="mb-2">
              <Col lg="6" md="6" className="mb-2">
                  <Label>Select Parent Category </Label>
                  <CustomInput type="select" placeholder="" name="" >
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  </CustomInput>
                </Col>
                <Col lg="6" md="6" className="mb-2">
                  <Label>Select Sub-Category </Label>
                  <CustomInput type="select" placeholder="" name="" >
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  </CustomInput>
                </Col>
                <Col lg="6" md="6" className="mb-2">
                  <Label>Child Category Name</Label>
                  <Input type="text" placeholder="Enter Category" name="" />
                </Col>
                <Col lg="6" md="6" className="mb-2">
                  <Label>Description</Label>
                <Input type="textarea" name="text"/>
                </Col>
                <Col lg="6" md="6" className="mb-2">
                  <Label>Description</Label>
                <Input type="textarea" name="text"/>
                </Col>
                <Col lg="6" md="6" className="mb-2">
                  <Label>Image</Label>
                <Input type="file" name="file"/>
                </Col>
                <Col lg="6" md="6" sm="6" className="mb-2 mt-1">
                  <Label className="mb-1">Status</Label>
                  <div
                    className="form-label-group"
                   // onChange={(e) => this.changeHandler1(e)}
                  >
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
                      value="Inactive"
                    />
                    <span style={{ marginRight: "3px" }}>Inactive</span>
                  </div>
                </Col>
              </Row>
              <Row>
                <Button.Ripple
                  color="primary"
                  type="submit"
                  className="mr-1 mb-1"
                >
                  Add Child Category
                </Button.Ripple>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </div>
    );
  }
}
export default AddChildCategory;