import React, { useState } from "react";

const Invoiceiddetail = ({ printData }) => {
  return (
    <>
      <div className="">
        <div className="row">
          <div className="col-xl-3 col-lg-3 col-md-3 col-xs-3 col-sm-3">
            <span className="fontsizeinvoice">Invoice No.</span>
          </div>
          <div className="col-xl-3 col-lg-3 col-md-3 col-xs-3 col-sm-3">
            <span className="fontsizeinvoice">:{printData?.invoiceId}</span>
          </div>
          <div className="col-xl-3 col-lg-3 col-md-3 col-xs-3 col-sm-3">
            <span className="fontsizeinvoice">Date</span>
          </div>
          <div className="col-xl-3 col-lg-3 col-md-3 col-xs-3 col-sm-3">
            <span className="fontsizeinvoice">
              : {printData?.date && printData?.date?.split("T")[0]}
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-3 col-lg-3 col-md-3 col-xs-3 col-sm-3">
            <span className="fontsizeinvoice">Sales Person Name</span>
          </div>
          <div className="col-xl-3 col-lg-3 col-md-3 col-xs-3 col-sm-3">
            <span className="fontsizeinvoice">
              : {printData?.userId?.firstName + printData?.userId?.lastName}
            </span>
          </div>
          <div className="col-xl-3 col-lg-3 col-md-3 col-xs-3 col-sm-3">
            <span className="fontsizeinvoice">Mobile No.</span>
          </div>
          <div className="col-xl-3 col-lg-3 col-md-3 col-xs-3 col-sm-3">
            <span className="fontsizeinvoice">
              : {printData?.MobileNo && printData?.MobileNo}
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-3 col-lg-3 col-md-3 col-xs-3 col-sm-3">
            <span className="fontsizeinvoice">Ladger Balance</span>
          </div>
          <div className="col-xl-3 col-lg-3 col-md-3 col-xs-3 col-sm-3">
            <span className="fontsizeinvoice">: 41045</span>
          </div>
          <div className="col-xl-3 col-lg-3 col-md-3 col-xs-3 col-sm-3 cssforcolsmall">
            <span className="fontsizeinvoice">Last Payment Amount</span>
          </div>
          <div className="col-xl-3 col-lg-3 col-md-3 col-xs-3 col-sm-3">
            <span className="fontsizeinvoice">: 1234567890</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Invoiceiddetail;
