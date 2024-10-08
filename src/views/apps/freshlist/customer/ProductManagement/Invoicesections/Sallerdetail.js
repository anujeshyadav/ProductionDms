import React, { useState } from "react";

const Sallerdetail = ({ companyDetails }) => {
  console.log("companyDetails", companyDetails);
  return (
    <>
      <div className="container-fluid">
        <h4>{companyDetails?.name}</h4>

        <span className="fontsizeinvoice">
          GSTIN :{companyDetails?.gstNo}
          <br></br>
          {companyDetails?.address} <br></br>
          MobileNo :{companyDetails?.mobileNo} <br></br>
          Email :{companyDetails?.email}
        </span>
      </div>
    </>
  );
};

export default Sallerdetail;
