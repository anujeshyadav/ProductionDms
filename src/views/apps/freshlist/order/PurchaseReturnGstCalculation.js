import React, { useState } from "react";

import UserContext from "../../../../context/Context";

let gstDetails = [];
export const PurchaseReturnGstCalculation = (Party, product, Context) => {
  let IgstTotal = 0;
  let CgstTotal = 0;
  let SgstTotal = 0;
  let Amount = 0;
  let GrandTotal = 0;
  let RoundOff = 0;
  let Discount = 0;
  let DiscountPercentage = 0;
  if (!!Party?.category?.discount) {
    // DiscountPercentage = (100 + Party?.category?.discount) / 100;
    DiscountPercentage = 1;
  } else {
    DiscountPercentage = 1;
  }
  function customRound(num) {
    let decimalPart = num - Math.floor(num);
    if (decimalPart > 0.49) {
      return Math.ceil(num);
    } else {
      return Math.floor(num);
    }
  }
  let IgstTaxType = false;

  let SuperGst = Context?.CompanyDetails?.gstNo?.slice(0, 2);
  let userdata = JSON.parse(localStorage.getItem("userData"));
  let findParty = userdata?.rolename?.roleName == "Customer";

  let partyGst;
  if (findParty) {
    partyGst = userdata?.gstNumber?.slice(0, 2);
  } else {
    if (Party?.registrationType == "UnRegister") {
      partyGst = SuperGst;
    } else {
      partyGst = Party?.gstNumber?.slice(0, 2);
    }
  }
  if (SuperGst == partyGst) {
    IgstTaxType = false;
    gstDetails = product?.map((ele, i) => {
      let GstRate = ele?.productData?.GSTRate / 2;
      let wholeGst = Number(ele?.productData?.GSTRate);
      let costPrice = Number(
        (
          ele?.price /
          (DiscountPercentage *
            ((100 + Number(ele?.productData?.GSTRate)) / 100))
        ).toFixed(2)
      );
      let Cp_without_Discount = Number(
        (
          ele?.price /
          ((100 + Number(ele?.productData?.GSTRate)) / 100)
        ).toFixed(2)
      );
      let sellingPrice = costPrice * ele?.qty;
      let total = Number(((sellingPrice * (100 + wholeGst)) / 100).toFixed(2));

      return {
        gstPercentage: `${GstRate}+${GstRate}`,

        sgstRate: Number(((costPrice * Number(GstRate)) / 100).toFixed(2)),
        cgstRate: Number(((costPrice * Number(GstRate)) / 100).toFixed(2)),
        igstRate: 0,
        totalRate: Number(((costPrice * wholeGst) / 100).toFixed(2)),

        hsn: ele?.productData?.HSN_Code,
        withoutTaxablePrice: `${
          costPrice * ele?.qty !== undefined ? Number(costPrice * ele?.qty) : 0
        }`,
        taxable: Number((costPrice * ele?.qty).toFixed(2)),
        discountPercentage:
          Party?.category?.discount && Party?.category?.discount
            ? Party?.category?.discount
            : 0,
        withDiscountAmount: Number(
          ((costPrice * ele?.qty * (100 + wholeGst)) / 100).toFixed(2)
        ),
        taxableValue: Number(
          ((costPrice * ele?.qty * (100 + wholeGst)) / 100).toFixed(2)
        ),
        taxableAmount: Number(
          ((costPrice * ele?.qty * (100 + wholeGst)) / 100).toFixed(2)
        ),
        unitPriceAfterDiscount: Number(costPrice.toFixed(2)),
        withoutDiscountAmount: Number(
          ((Cp_without_Discount * ele?.qty * (100 + wholeGst)) / 100).toFixed(2)
        ),
        centralTax: [
          {
            rate: GstRate,
            amount: Number(((costPrice * ele?.qty * GstRate) / 100).toFixed(2)),
          },
        ],
        stateTax: [
          {
            rate: GstRate,
            amount: Number(((costPrice * ele?.qty * GstRate) / 100).toFixed(2)),
          },
        ],
        igstTax: [],
        grandTotal: Number(total),
      };
    });
  } else {
    gstDetails = product?.map((ele, i) => {
      IgstTaxType = true;
      let GstRate = Number(ele?.productData?.GSTRate) / 2;
      let wholeGst = Number(ele?.productData?.GSTRate);
      let costPrice = Number(
        (
          ele?.price /
          (DiscountPercentage *
            ((100 + Number(ele?.productData?.GSTRate)) / 100))
        ).toFixed(2)
      );
      let Cp_without_Discount = Number(
        (
          ele?.price /
          ((100 + Number(ele?.productData?.GSTRate)) / 100)
        ).toFixed(2)
      );
      let sellingPrice = costPrice * ele?.qty;

      IgstTaxType = true;

      let total = Number(
        (costPrice * ele?.qty * (100 + wholeGst)) / 100
      ).toFixed(2);

      return {
        unitPriceAfterDiscount: Number(costPrice?.toFixed(2)),
        gstPercentage: Number(ele?.productData?.GSTRate),
        sgstRate: 0,
        cgstRate: 0,
        igstRate: Number(((costPrice * ele?.qty * wholeGst) / 100).toFixed(2)),

        grandTotal: Number(total),
        taxableAmount: Number(
          ((costPrice * ele?.qty * (100 + wholeGst)) / 100).toFixed(2)
        ),
        hsn: ele?.productData?.HSN_Code,

        taxable: Number((costPrice * ele?.qty).toFixed(2)),
        withoutTaxablePrice: `${
          costPrice * ele?.qty !== undefined ? Number(costPrice * ele?.qty) : 0
        }`,

        discountPercentage: Party?.category?.discount,
        withDiscountAmount: Number(
          ((costPrice * ele?.qty * (100 + wholeGst)) / 100).toFixed(2)
        ),
        withoutDiscountAmount: Number(
          ((Cp_without_Discount * ele?.qty * (100 + wholeGst)) / 100).toFixed(2)
        ),

        totalTaxAmount: Number(
          ((costPrice * ele?.qty * (100 + wholeGst)) / 100).toFixed(2)
        ),
        centralTax: [],
        stateTax: [],
        igstTax: [
          {
            rate: wholeGst,
            amount: Number(
              ((costPrice * ele?.qty * wholeGst) / 100).toFixed(2)
            ),
          },
        ],
      };
    });
  }

  let T = gstDetails?.map((ele, i) => {
    return ele?.taxable;
  });
  Amount = T.reduce((a, b) => a + b, 0);

  if (IgstTaxType) {
    let x = gstDetails?.map((ele, i) => {
      return ele?.igstTax[0]?.amount;
    });
    IgstTotal = x.reduce((a, b) => a + b, 0);
  } else {
    let C = gstDetails?.map((ele, i) => {
      return ele?.centralTax[0]?.amount;
    });
    CgstTotal = C.reduce((a, b) => a + b, 0);
    let S = gstDetails?.map((ele, i) => {
      return ele?.stateTax[0]?.amount;
    });
    SgstTotal = S.reduce((a, b) => a + b, 0);
  }

  GrandTotal = Number((Amount + SgstTotal + CgstTotal + IgstTotal)?.toFixed(2));

  RoundOff = customRound(GrandTotal);
  let Tax = {
    IgstTaxType: IgstTaxType,
    RoundOff: Number(RoundOff.toFixed(2)),
    GrandTotal: Number(GrandTotal.toFixed(2)),
    Amount: Number(Amount.toFixed(2)),
    IgstTotal: Number(IgstTotal.toFixed(2)),
    CgstTotal: Number(CgstTotal.toFixed(2)),
    SgstTotal: Number(SgstTotal.toFixed(2)),
  };

  return { gstDetails, Tax };
};
