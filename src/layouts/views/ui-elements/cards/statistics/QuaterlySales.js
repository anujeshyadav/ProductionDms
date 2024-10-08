import React from "react";
import StatisticsCard from "../../../../components/@vuexy/statisticsCard/StatisticsCard";
// import { ShoppingCart } from "react-feather";
import { quaterlySales, quaterlySalesSeries } from "./StatisticsData";
import { _Get } from "../../../../../ApiEndPoint/ApiCalling";
import { TransactionCalculation } from "../../../../../ApiEndPoint/Api";

class QuaterlySales extends React.Component {
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
          this.setState({ rowData: res?.transaction });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
  render() {
    return (
      <StatisticsCard
        // icon={<ShoppingCart className="danger" size={22} />}
        // iconBg="danger"
        // stat="36%"
        // statTitle="Transaction"
        // statTitle1="Bank Balance"
        // statTitle2="Cash In Hand"
        // statTitle3="Market Outstanding"
        // statTitle4="Date Payment"
        // statTitle5="Transaction"
        // statTitle6="Transaction"
        statTitle="Transaction"
        statTitle1={`Bank Balance : ${
          this.state.rowData?.BankAmount && this.state.rowData?.BankAmount
        }`}
        statTitle2={`Cash In Hand : ${
          this.state.rowData?.CashAmount && this.state.rowData?.CashAmount
        }`}
        statTitle3={`Market Outstanding : ${
          this.state.rowData?.marketOutstanding &&
          this.state.rowData?.marketOutstanding
        }`}
        statTitle4="Debt Payment : 0"
        statTitle5={`Transaction : ${
          this.state.rowData?.totalAmount && this.state.rowData?.totalAmount
        }`}
        options={quaterlySales}
        // series={quaterlySalesSeries}
        // type="area"
      />
    );
  }
}
export default QuaterlySales;
