import React from "react";
import { Row, Col, Card, CardTitle, CardText } from "reactstrap";
import axiosConfig from "../../../axiosConfig";
import DispatchedOrders from "./DispatchedOrders";
import "../../../assets/scss/pages/dashboard-analytics.scss";
import {
  FcNews,
  FcSalesPerformance,
  FcRules,
  FcCancel,
  FcShop,
  FcOk,
  FcShipped,
  FcBusinessman,
} from "react-icons/fc";
import { FaWallet, Facart, FaCartArrowDown, FaBoxOpen } from "react-icons/fa";
import { BsBoxSeam } from "react-icons/bs";
import { TbTruckDelivery } from "react-icons/tb";
import { AiOutlineCloseCircle } from "react-icons/ai";
import MainDash from "./MainDash";
import EcommerceDashboard from "../../../layouts/views/dashboard/ecommerce/EcommerceDashboard";

class AnalyticsDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: [],
      Viewpermisson: null,
      Editpermisson: null,
      Createpermisson: null,
      Deletepermisson: null,
      customer: {},
      store: {},
      seller: {},
      order: {},
      banner: {},
      brand: {},
      total_sub: {},
      Coupon: {},
    };
  }

  componentDidMount() {
    let pageparmission = JSON.parse(localStorage.getItem("userData"));
    // console.log(pageparmission.role);
    let newparmisson = pageparmission?.role?.find(
      value => value?.pageName === "Dashboard"
    );
    // console.log(newparmisson);
    this.setState({ Viewpermisson: newparmisson?.permission.includes("View") });
    // this.setState({
    //   Createpermisson: newparmisson?.permission.includes("Create"),
    // });
    // this.setState({
    //   Editpermisson: newparmisson?.permission.includes("Edit"),
    // });
    // this.setState({
    //   Deletepermisson: newparmisson?.permission.includes("Delete"),
    // });
    // console.log(newparmisson?.permission.includes("View"));
    // console.log(newparmisson?.permission.includes("Create"));
    // console.log(newparmisson?.pproductdebermission.includes("Edit"));
    // console.log(newparmisson?.permission.includes("Delete"));
  }
  render() {
    // console.log(this.state.product);
    return (
      <React.Fragment>
        {this.state.Viewpermisson ? (
          <>
            <Row className="">
              {this.state.product &&
                this.state.product?.map((ele, i) => {
                  let bgcolor = "";
                  if ((i + 1) % 3 === 0) {
                    bgcolor = "#62b5cfab";
                  } else if ((i + 1) % 2 === 0) {
                    bgcolor = "#4c4c9b4a";
                  } else {
                    bgcolor = "#0000ff8a";
                  }

                  return (
                    <>
                      <Col key={i} lg="4" md="12">
                        <Card
                          style={{ backgroundColor: `${bgcolor}` }}
                          // className={bgcolor}
                        >
                          <CardTitle
                            className="mb-1 d-flex"
                            // tag="h6"
                            style={{ color: "black", padding: "30px 30px" }}
                          >
                            <FcOk />
                            <CardText
                              className="mx-2"
                              style={{ color: "black" }}
                            >
                              <b>{ele} </b>
                            </CardText>
                          </CardTitle>
                        </Card>
                      </Col>
                    </>
                  );
                })}

              {/* <Col lg="3" md="12">
            <Card
              className="bg-secondary"
              body
              inverse
              style={{ borderColor: "white" }}
            >
              <CardTitle
                className=""
                tag="h3"
                style={{ color: "black", fontSize: "16px" }}
              >
                <FaBoxOpen style={{ color: "orange" }} />
                &nbsp;&nbsp; Total Products
                <CardText
                  tag="span"
                  style={{ color: "black", marginLeft: "4px" }}
                >
                  ({this.state.product})
                </CardText>
              </CardTitle>
            </Card>
          </Col> */}
              {/* <Col lg="3" md="12">
            <Card className="bg-secondary" body inverse>
              <CardTitle className="mb-1" tag="h4" style={{ color: "black" }}>
                <FcBusinessman />&nbsp;&nbsp;
                Total Customer
              </CardTitle>

              {/* <CardText tag="h3" style={{ color: "white" }}>
                {this.state.customer.data}
              </CardText> */}
              {/* </Card>
          </Col> */}
              {/* <Col lg="3" md="12">
            <Card className="bg-secondary" body inverse>
              <CardTitle className="mb-1" tag="h4" style={{ color: "black" }}>
                <FcShop />&nbsp;&nbsp;
                Total Store
              </CardTitle> */}

              {/* <CardText tag="h3" style={{ color: "white" }}>
                {this.state.store.data}
              </CardText> */}
              {/* </Card>
          </Col> */}
              {/* <Col lg="3" md="12">
            <Card className="bg-secondary" body inverse>
              <CardTitle className="mb-1" tag="h4" style={{ color: "black" }}>
                <FcSalesPerformance />&nbsp;&nbsp;
                Total Sale
              </CardTitle>

              {/* <CardText tag="h3" style={{ color: "white" }}>
                {this.state.sale.data}
              </CardText> */}
              {/* </Card>
          </Col> */}

              {/* <Col lg="3" md="12">
                <Card
                  className="bg-secondary  py-3"
                  body
                  inverse
                  style={{ borderColor: "white" }}
                >
                  <CardTitle
                    className="fntweight"
                    tag="h3"
                    style={{ color: "black", fontSize: "16px" }}
                  >
                    <FaBoxOpen style={{ color: "orange" }} />
                    &nbsp;&nbsp; Total Hub
                  </CardTitle>
                  <CardText
                    className="wt-text"
                    tag="span"
                    style={{ color: "black", marginLeft: "4px" }}
                  >
                    {this.state.product}
                  </CardText>
                </Card>
              </Col> */}

              {/* <Col lg="3" md="12">
                <Card className="bg-secondary" body inverse>
                  <CardTitle
                    className="mb-1"
                    tag="h4"
                    style={{ color: "black" }}
                  >
                    <BsBoxSeam style={{ color: "cornflowerblue" }} />
                    &nbsp;&nbsp;Packaging(35)
                  </CardTitle>
                  
                </Card>
              </Col> */}
            </Row>
          </>
        ) : (
          <>
            <Row>
              <Col>
                <div className="d-flex justify-content-center align itme center">
                  {/* <h2 style={{ color: "red" }}>
                    {" "}
                    You are Not Authorized To View this Page
                  </h2> */}
                </div>
              </Col>
            </Row>
          </>
        )}

        {/* <div style={{ backgroundColor: 'white' }}>
          <h4 className="mb-1"> <FaWallet
            style={{ color: 'brown' }} />&nbsp;&nbsp;Admin Wallet</h4>
          <Row> */}
        {/* <Col lg="3" md="12">
              <Card className="bg-secondary" body inverse>
                <CardTitle className="mb-1" tag="h4" style={{ color: "black" }}>
                  In-House Earning
                </CardTitle>
                {/* <CardText tag="h3" style={{ color: "white" }}>
                {this.state.Coupon.data}
              </CardText> */}
        {/* </Card> */}
        {/* </Col>  */}
        {/* <Col lg="3" md="12">
              <Card className="bg-secondary" body inverse>
                <CardTitle className="mb-1" tag="h4" style={{ color: "black" }}>
                  Commission Earned
                </CardTitle>
                {/* <CardText tag="h3" style={{ color: "white" }}>
                {this.state.Coupon.data}
              </CardText> */}
        {/* </Card>
            </Col> */}
        {/* <Col lg="3" md="12">
              <Card className="bg-secondary" body inverse>
                <CardTitle className="mb-1" tag="h4" style={{ color: "black" }}>
                  Delivery Charge Earned
                </CardTitle>
                {/* <CardText tag="h3" style={{ color: "white" }}>
                {this.state.Coupon.data}
              </CardText> */}
        {/* </Card>
            </Col> */}
        {/* <Col lg="3" md="12">
              <Card className="bg-secondary" body inverse>
                <CardTitle className="mb-1" tag="h4" style={{ color: "black" }}>
                  Pending Amount
                </CardTitle>
                {/* <CardText tag="h3" style={{ color: "white" }}>
                {this.state.Coupon.data}
              </CardText> */}
        {/* </Card>
            </Col> */}
        {/* <Col lg="3" md="12">
              <Card className="bg-secondary" body inverse>
                <CardTitle className="mb-1" tag="h4" style={{ color: "black" }}>
                  Total Tax Collected
                </CardTitle>
                {/* <CardText tag="h3" style={{ color: "white" }}>
                {this.state.Coupon.data}
              </CardText> */}
        {/* </Card>
            </Col> */}
        {/* </Row>
        </div> */}
        {/* <div style={{ backgroundColor: "white" }}> */}
        {/* <Row>
          <Col lg="6" md="12">
            <Row><h3 className="mb-2"><b>Top Selling Category</b></h3></Row>
          </Col>

          <Col lg="6" md="12">
            <Row><h3><b>Top Popular Zone</b></h3></Row>
          </Col>
          <Col lg="6" md="12"><h4>Mart &nbsp;&nbsp;&nbsp;</h4>
            <h4>Digital Seller&nbsp;&nbsp;&nbsp;</h4>
            <h4>Deluxe Online&nbsp;&nbsp;&nbsp;</h4>
            <h4>Wellness Fair&nbsp;&nbsp;&nbsp;</h4>

          </Col>
          <Col lg="6" md="12">
            <h4>Wellness Fair &nbsp;&nbsp;&nbsp;<FaCartArrowDown /></h4>
            <h4>Mart Morning &nbsp;&nbsp;&nbsp;<FaCartArrowDown /></h4>
            <h4>Digital Seller &nbsp;&nbsp;&nbsp;<FaCartArrowDown /></h4>
            <h4>Deluxe Online &nbsp;&nbsp;&nbsp;<FaCartArrowDown /></h4>
          </Col>

        </Row> */}
        <section>
          <EcommerceDashboard />
        </section>
      </React.Fragment>
    );
  }
}
export default AnalyticsDashboard;
