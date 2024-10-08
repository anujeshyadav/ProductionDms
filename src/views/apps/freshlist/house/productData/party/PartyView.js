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
import { history } from "../../../../history";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import moment from "moment-timezone";
import { Route } from "react-router-dom";

import swal from "sweetalert";
import "../../../../../src/layouts/assets/scss/pages/users.scss";

import {
  CreateAccountSave,
  CreateAccountView,
  Get_RoleList,
} from "../../../../ApiEndPoint/ApiCalling";
import { BiEnvelope } from "react-icons/bi";
import { FcPhoneAndroid } from "react-icons/fc";
import { BsWhatsapp } from "react-icons/bs";
import "../../../../assets/scss/pages/users.scss";
import UserContext from "../../../../context/Context";
import { CloudLightning } from "react-feather";
import { FaPlus } from "react-icons/fa";

const PartyView = ({ ViewOneData }) => {
  const [formData, setFormData] = useState({});
  const [grandTotalAmt, setGrandTotalAmt] = useState(0);
  // const [permissions, setpermissions] = useState({});
  // const [Editdata, setEditdata] = useState({});
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
    setProduct(ViewOneData);
    // console.log(GrandTotal);
  }, [product]);

  useEffect(() => {
    setProduct(ViewOneData);
    setFormData(ViewOneData);
    console.log(ViewOneData);
  }, []);
  const handleProductChangeProduct = (e, index) => {
    setIndex(index);
    const { name, value } = e.target;
    const list = [...product];
    list[index][name] = value;
    let amt = 0;
    if (list.length > 0) {
      const x = list?.map((val) => {
        console.log(val.qty * val.price);
        // GrandTotal[index] = val.qty * val.price;

        list[index]["totalprice"] = val.qty * val.price;
        return val.qty * val.price;
      });
      amt = x.reduce((a, b) => a + b);
      console.log("GrandTotal", amt);
    }
    setProduct(list);
  };
  return (
    <div>
      <div>
        <Card>
          <Form className="mr-1 ml-1">
            <Row className="mb-2">
              <Col lg="4" md="4" sm="12">
                <FormGroup>
                  <Label>FullName</Label>
                  <Input
                    disabled
                    type="text"
                    placeholder="Full Name"
                    name="FullName"
                    value={formData.fullName}
                  />
                </FormGroup>
              </Col>
              {product &&
                product?.orderItems?.map((ele, index) => (
                  <Row className="" key={index}>
                    <Col lg="4" md="4" sm="12">
                      <FormGroup>
                        <Label>Product Name</Label>
                        <Input
                          disabled
                          type="text"
                          placeholder="ProductName"
                          name={ele.product.Product_Title}
                          value={ele.product.Product_Title}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="4" md="4" sm="12">
                      <FormGroup>
                        <Label>Price</Label>
                        <Input
                          disabled
                          type="number"
                          placeholder="Price"
                          name={ele.price}
                          value={ele.price}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="4" md="4" sm="12">
                      <FormGroup>
                        <Label>Size</Label>
                        <Input
                          disabled
                          type="number"
                          placeholder="Size"
                          name={ele.qty}
                          value={ele.qty}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="4" md="4" sm="12">
                      <FormGroup>
                        <Label>GST Rate</Label>
                        <Input
                          disabled
                          type="number"
                          placeholder="Price"
                          name={ele.product["GSTRate"]}
                          value={ele.product["GSTRate"]}
                        />
                      </FormGroup>
                    </Col>

                    <Col lg="4" md="4" sm="12">
                      <FormGroup>
                        <Label>HST Code</Label>
                        <Input
                          disabled
                          type="number"
                          placeholder="HSTCode"
                          name={ele.product.HSN_Code}
                          value={ele.product.HSN_Code}
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
export default PartyView;
