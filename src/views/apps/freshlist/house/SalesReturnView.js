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
  CustomInput,
  Badge,
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

const SalesReturnView = ({ ViewOneData }) => {
  const [Countries, setCountry] = useState({});
  const [States, setState] = useState({});
  const [Cities, setCities] = useState({});
  const [formData, setFormData] = useState({});
  // const [dropdownValue, setdropdownValue] = useState({});
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
   
    setProduct(ViewOneData);
    // console.log(GrandTotal);
  }, [product]);

  useEffect(() => {
    setProduct(ViewOneData);
    setFormData(ViewOneData);
  }, []);
  const handleProductChangeProduct = (e, index) => {
    // product.price * product?.qty
    setIndex(index);
    const { name, value } = e.target;
    const list = [...product];
    list[index][name] = value;
    // console.log(GrandTotal);
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
    // setGrandTotalAmt(amt);
  };
  return (
    <div>
      <div>
        <Card>
          <Form className="m-2">
            <Row className="mb-2">
              {/* <Col lg="4" md="4" sm="12">
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
              </Col> */}
              {product &&
                product?.returnItems?.map((ele, index) => (
                  <Row className="" key={index}>
                    <Col lg="4" md="4" sm="12">
                      <FormGroup>
                        <Label>Product Name</Label>
                        <Input
                          disabled
                          type="text"
                          placeholder="ProductName"
                          name={ele.productId.Product_Title}
                          value={ele.productId.Product_Title}
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
                          name={ele.productId.Product_MRP}
                          value={ele.productId.Product_MRP}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="4" md="4" sm="12">
                      <FormGroup>
                        <Label>Return Quantity</Label>
                        <Input
                          disabled
                          type="number"
                          placeholder="ReturnQuantity"
                          name={ele.Qty_Return}
                          value={ele.Qty_Return}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="4" md="4" sm="12">
                      <FormGroup>
                        <Label>Sales Quantity</Label>
                        <Input
                          disabled
                          type="number"
                          placeholder="SalesQuantity"
                          name={ele.productId.Qty_Sales}
                          value={ele.productId.Qty_Sales}
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
                          name={ele.productId.HSN_Code}
                          value={ele.productId.HSN_Code}
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
export default SalesReturnView;
