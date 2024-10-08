import React from "react";
import { Card, CardBody, Col, Row, Form, Button, Label, Input } from "reactstrap";
import { EditorState, convertToRaw } from "draft-js";
// import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../../../../assets/scss/plugins/extensions/editor.scss";
//import axiosConfig from "../../../../axiosConfig";
import { history } from "../../../../history";

class AddPurchasesByItem extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     description: "",
  //   };
  // }
  state = {
    editorState: EditorState.createEmpty(),
  };

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  submitHandler = (e) => {
    e.preventDefault();
    console.log(this.editorState);
    //axiosConfig
    //   .post("/addprivacy_policy", data)
    //   .then((response) => {
    //     console.log(response);
    //     this.props.history.push("/app/privacyPolicy/privacyPolicy");
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  };

  render() {
    const { editorState } = this.state;
    const editData = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    console.log(editData);
    return (
      <Card>
        <Row className="m-2">
          <Col>
            <h1 col-sm-6 className="float-left">
              Add Receive History
            </h1>
          </Col>
          <Col>
            <Button
              className=" btn btn-danger float-right"
              onClick={() => history.push("/app/purchasesAndExpenses/receiveHistory/receiveHistory")}
            >
              Back
            </Button>
          </Col>
        </Row>
        <CardBody>
        <Form onSubmit={this.submitHandler}>
            <Row>
              <Col lg="6" md="6" sm="6" className="mb-2">
                <Label>Product ID</Label>
                  <Input
                    required
                    type="text"
                    placeholder="PRODUCT ID" 
                    name="item_name"
                    value={this.state.item_name}
                    onChange={this.changeHandler}
                  />
              </Col>
              <Col lg="6" md="6" sm="6" className="mb-2">
                <Label>Product Name</Label>
                  <Input
                    required
                    type="text"
                    placeholder="PRODUCT NAME"
                    name="short_name"
                    value={this.state.short_name}
                    onChange={this.changeHandler}
                  />
              </Col>
              <Col lg="6" md="6" sm="6" className="mb-2">
                <Label>Product Description</Label>
                  <Input
                    required
                    type="textarea"
                    name="desc"
                    value={this.state.desc}
                    onChange={this.changeHandler}
                    rows="1"
                    placeholder="PRODUCT DESCRIPTION"
                  />
              </Col>
              <Col lg="6" md="6" sm="6" className="mb-2">
                <Label>Product Code</Label>
                  <Input
                    required
                    type="text"
                    placeholder="Product Code"
                    name="code"
                    value={this.state.code}
                    onChange={this.changeHandler}
                  />
              </Col>
              <Col lg="6" md="6" sm="6" className="mb-2">
                <Label>HSN Code</Label>
                  <Input
                    required
                    type="text"
                    placeholder="HSN Code"
                    name="hsn_code"
                    value={this.state.hsn_code}
                    onChange={this.changeHandler}
                  />
              </Col>
              <Col lg="6" md="6" sm="6" className="mb-2"> 
                <Label>Varient</Label>
                  <Input
                    required
                    type="text"
                    placeholder="Varient"
                    name="varient"
                    value={this.state.varient}
                    onChange={this.changeHandler}
                  />
              </Col>
              <Col lg="6" md="6" sm="6" className="mb-2">
                <Label>Material</Label>
                  <Input
                    required
                    type="text"
                    placeholder="Material"
                    name="material"
                    value={this.state.material}
                    onChange={this.changeHandler}
                  />
              </Col>
              <Col lg="6" md="6" sm="6" className="mb-2">
                <Label>Stock Quantity</Label>
                  <Input
                    required
                    type="number"
                    placeholder="Stock Quantity"
                    name="stock_qty"
                    value={this.state.stock_qty}
                    onChange={this.changeHandler}
                  />
              </Col>
              <Col lg="6" md="6" sm="6" className="mb-2">
                <Label>Stock Clearance Limit</Label>
                  <Input
                    required
                    type="number"
                    placeholder="Stock Clearance"
                    name="stock_clearance_limit"
                    value={this.state.stock_clearance_limit}
                    onChange={this.changeHandler}
                  />
              </Col>
              <Col lg="6" md="6" sm="6" className="mb-2">
                <Label>Colour</Label>
                  <Input
                    required
                    type="text"
                    placeholder="Colour"
                    name="colour"
                    value={this.state.colour}
                    onChange={this.changeHandler}
                  />
              </Col>
              <Col lg="6" md="6" sm="6" className="mb-2">
                <Label>Size</Label>
                  <Input
                    required
                    type="text"
                    placeholder="Size"
                    name="size"
                    value={this.state.size}
                    onChange={this.changeHandler}
                  />
              </Col>
              <Col lg="6" md="6" sm="6" className="mb-2">
                <Label>Inclusive of Duties and Taxes</Label>
                  <Input
                    required
                    type="text"
                    placeholder="Duties and Taxes"
                    name="inc_duty_tax"
                    value={this.state.inc_duty_tax}
                    onChange={this.changeHandler}
                  />
              </Col>
              <Col lg="6" md="6" sm="6" className="mb-2">
                <Label>Standard Packing</Label>
                  <Input
                    required
                    type="text"
                    placeholder="Standard Packing"
                    name="std_package"
                    value={this.state.std_package}
                    onChange={this.changeHandler}
                  />
              </Col>
              <Col lg="6" md="6" sm="6" className="mb-2">
                <Label>Product Image</Label>
                  <Input 
                    required 
                    type="file" 
                    onChange={this.onChangeHandler} 
                  />
              </Col>
              <Col lg="6" md="6" sm="6" className="mb-2">
                <Label>Barcode</Label>
                  <Input
                    required
                    type="number"
                    placeholder="BarCode"
                    name="barcode"
                    value={this.state.barcode}
                    onChange={this.changeHandler}
                  />
              </Col>
              <Col lg="6" md="6" sm="6" className="mb-2">
                <Label className="mb-1">Status</Label>
                  <div
                    className="form-label-group"
                    onChange={(e) => this.changeHandler1(e)}
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
              <Col lg="6" md="6" sm="6" className="mb-2">
                <Button.Ripple
                    color="primary"
                    type="submit"
                    className="mr-1 mb-1"
                >
                  Receive History
                </Button.Ripple>
              </Col>
            </Row>
          </Form>
          
        </CardBody>
      </Card>
    );
  }
}
export default AddPurchasesByItem;