import React, { useEffect, useState, useContext } from "react";
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
} from "reactstrap";
import "react-phone-input-2/lib/style.css";
import { Route } from "react-router-dom";
import "../../../../../../src/layouts/assets/scss/pages/users.scss";
import "../../../../../assets/scss/pages/users.scss";
import UserContext from "../../../../../context/Context";

const DebitView = ({ ViewOneData }) => {
  const [formData, setFormData] = useState({});
  const [grandTotalAmt, setGrandTotalAmt] = useState(0);
  const [product, setProduct] = useState([
    {
      product: "", //
      productId: "",
      qty: 1, //
      price: "", //
      totalprice: "", //
      //  grandTotal: "",
    },
  ]);
  const Context = useContext(UserContext);

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  useEffect(() => {
    console.log(product);
  }, [product]);

  useEffect(() => {
    setProduct(ViewOneData);
    setFormData(ViewOneData);
    console.log(ViewOneData);
  }, []);

  return (
    <div>
      <div>
        <Card>
          <Form className="mr-1 ml-1">
            <Row className="mb-2">
              {formData?.fullName && formData?.fullName ? (
                <>
                  <Col lg="4" md="4" sm="12">
                    <FormGroup>
                      <Label>FullName</Label>
                      <Input
                        disabled
                        type="text"
                        placeholder="Full Name"
                        name="FullName"
                        value={formData?.fullName}
                      />
                    </FormGroup>
                  </Col>
                </>
              ) : null}

              {product &&
                product?.productItems?.map((ele, index) => (
                  <Row className="" key={index}>
                    <Col>
                      <FormGroup>
                        <Label>Product Name</Label>
                        <Input
                          disabled
                          type="text"
                          placeholder="ProductName"
                          name={ele?.productId?.Product_Title}
                          value={ele?.productId?.Product_Title}
                        />
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Label>Price</Label>
                        <Input
                          disabled
                          type="number"
                          placeholder="Price"
                          name={ele?.price}
                          value={ele?.price}
                        />
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Label>Size</Label>
                        <Input
                          disabled
                          type="number"
                          placeholder="Size"
                          name={ele?.qty}
                          value={ele?.qty}
                        />
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Label>GST Rate</Label>
                        <Input
                          disabled
                          type="number"
                          placeholder="Price"
                          name={ele?.productId["GSTRate"]}
                          value={ele?.productId["GSTRate"]}
                        />
                      </FormGroup>
                    </Col>

                    <Col>
                      <FormGroup>
                        <Label>HST Code</Label>
                        <Input
                          disabled
                          type="number"
                          placeholder="HSTCode"
                          name={ele?.productId.HSN_Code}
                          value={ele?.productId.HSN_Code}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                ))}
            </Row>
          </Form>
        </Card>
      </div>
    </div>
  );
};
export default DebitView;
