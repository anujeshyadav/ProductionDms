import React from "react";
import StatisticsCard from "../../../../components/@vuexy/statisticsCard/StatisticsCard";
// import { ShoppingCart } from "react-feather";
import { quaterlySales, quaterlySalesSeries } from "./StatisticsData";

class ProductDetails extends React.Component {
  render() {
    return (
      <StatisticsCard
        // icon={<ShoppingCart className="danger" size={22} />}
        iconBg="danger"
        // stat="36%"
        statTitle="Transaction"
        statTitle1="Bank Balance"
        statTitle2="Cash In Hand"
        statTitle3="Market Outstanding"
        statTitle4="Date Payment"
        statTitle5="Transaction"
        statTitle6="Transaction"
        options={quaterlySales}
        // series={quaterlySalesSeries}
        type="area"
      />
    );
  }
}
export default ProductDetails;
