import React from "react";
import StatisticsCard from "../../../../components/@vuexy/statisticsCard/StatisticsCard";
import { CreditCard } from "react-feather";
import { revenueGeneratedSeries, revenueGenerated } from "./StatisticsData";
import { _Get } from "../../../../../ApiEndPoint/ApiCalling";
import {
  SalesCalculation,
  TransactionCalculation,
} from "../../../../../ApiEndPoint/Api";

class RevenueGenerated extends React.Component {
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
      await _Get(TransactionCalculation, userData?.database)
        .then((res) => {
          // this.setState({ rowData: res?.SalesCalculation });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
  render() {
    return (
      <StatisticsCard
        // icon={<CreditCard className="success" size={22} />}
        // iconBg="success"
        // stat="97.5k"
        statTitle="Target"
        statTitle1="Current Month Target"
        statTitle2="Current Month Achive"
        statTitle3="Target Pending"
        statTitle4="Average Target"
        statTitle5="Average Achivement"
        statTitle6="Average Pending"
        options={revenueGenerated}
        // series={revenueGeneratedSeries}
        // type="area"
      />
    );
  }
}
export default RevenueGenerated;
