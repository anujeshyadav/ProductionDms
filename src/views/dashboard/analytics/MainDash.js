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
import AnalyticsDashboard from "./AnalyticsDashboard";

class MainDash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: "",
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
    const isLoggedInBefore = localStorage.getItem("userData");
    const lastLoginTime = localStorage.getItem("loginTime");
    if (isLoggedInBefore) {
      // const TWO_HOURS_MS = 3 * 60; // 2 hours in milliseconds
      const TWO_HOURS_MS = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
      const elapsedTime = Date.now() - parseInt(lastLoginTime, 10);

      if (elapsedTime < TWO_HOURS_MS) {
        //  setIsLoggedIn(true);
      } else {
        // Session expired, clear localStorage
        localStorage.clear();
        // this.props.history.push("/");
        window.location.replace("/");
      }
    }
    // axiosConfig
    //   .get("/admin/product_list")
    //   .then((response) => {
    //     // console.log(response);
    //     this.setState({ product: response.data.data.length });
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }
  render() {
    return (
      <React.Fragment>
        <AnalyticsDashboard />
      </React.Fragment>
    );
  }
}
export default MainDash;
