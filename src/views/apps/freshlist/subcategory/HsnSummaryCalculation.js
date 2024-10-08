// import React from "react";

// function HsnSummaryCalculation({ data }) {
//   let result;
//   console.log(data);
//   result = Object.values(
//     data?.gstDetails?.reduce((acc, curr) => {
//       let item = acc[curr.hsn];

//       if (item) {
//         item.taxable = curr.taxable + item.taxable;
//       } else {
//         acc[curr.hsn] = curr;
//       }

//       return acc;
//     }, {})
//   );
//   return result;
// }

// export default HsnSummaryCalculation;
export const HsnSummaryCalculation = (data) => {
  let result;
  result = Object.values(
    data?.gstDetails?.reduce((acc, curr) => {
      let item = acc[curr.hsn];
      if (item) {
        item.taxable = curr?.taxable + item?.taxable;
        item.withDiscountAmount =
          curr.withDiscountAmount + item.withDiscountAmount;
        item.withoutDiscountAmount =
          curr.withoutDiscountAmount + item.withoutDiscountAmount;
        item.withoutTaxablePrice =
          curr.withoutTaxablePrice + item.withoutTaxablePrice;
        if (curr?.centralTax?.length) {
          item["centralTax"][0]["amount"] =
            curr["centralTax"][0]["amount"] + item["centralTax"][0]["amount"];
          item["stateTax"][0]["amount"] =
            curr["stateTax"][0]["amount"] + item["stateTax"][0]["amount"];
        } else {
          item["igstTax"][0]["amount"] =
            curr["igstTax"][0]["amount"] + item["igstTax"][0]["amount"];
        }
      } else {
        acc[curr.hsn] = curr;
      }

      return acc;
    }, {})
  );
  return result;
};
