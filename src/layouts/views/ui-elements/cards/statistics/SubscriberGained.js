import React from "react";
import StatisticsCard from "../../../../components/@vuexy/statisticsCard/StatisticsCard";
import { Users } from "react-feather";
import { Edit } from "react-feather";
import {
  Card,
  CardBody,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import { subscribersGained, subscribersGainedSeries } from "./StatisticsData";
import { _Get } from "../../../../../ApiEndPoint/ApiCalling";
import { SalesCalculation } from "../../../../../ApiEndPoint/Api";

class SubscriberGained extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rowData: {},
      values: {},
      modal: false,
    };
  }
  async componentDidMount() {
    let userData = JSON.parse(localStorage.getItem("userData"));
    if (userData?.database) {
      await _Get(SalesCalculation, userData?.database)
        .then((res) => {
          this.setState({ rowData: res?.SalesCalculation });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  render() {
    return (
      <>
        <StatisticsCard
          // icon={<Users className="primary" size={22} />}
          // stat="92.6k"
          statTitle="Today's Sales"
          statTitle1={`Last Month Sales : ${this.state.rowData?.lastMonthAmount}`}
          statTitle2={`Average Sales : ${this.state.rowData?.averageAmount}`}
          statTitle3={`Pending Order : ${this.state.rowData?.totalPending}`}
          statTitle4=" Pending
        Delivery : 0"
          statTitle5={`Total Sales : ${this.state.rowData?.totalAmount}`}
          rowData={this.state.rowData}
          options={subscribersGained}
          // series={subscribersGainedSeries}
          // type="area"
        />
      </>
    );
  }
}
export default SubscriberGained;
