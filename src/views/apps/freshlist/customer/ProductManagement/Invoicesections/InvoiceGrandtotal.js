import React from "react";

const InvoiceGrandtotal = () => {
  return (
    <>
      <div>
        <div className="cssforgrandtotal">
          <div>
            <h4>Other Charges</h4>
          </div>
          <div>
            <h4>1450</h4>
          </div>
        </div>
        <div className="cssforgrandtotal">
          <div>
            <h4>Sub Total</h4>
          </div>
          <div>
            <h4>6464.80</h4>
          </div>
        </div>
        <div className="cssforgrandtotal">
          <div>
            <h4>Cash Discount</h4>
          </div>
          <div>
            <h4>4654</h4>
          </div>
        </div>
        <div className="cssforgrandtotal">
          <div>
            <h4>Terover Discountl</h4>
          </div>
          <div>
            <h4>454</h4>
          </div>
        </div>
        <div className="cssforgrandtotal">
          <div>
            <h4>Target Discount</h4>
          </div>
          <div>
            <h4>35454</h4>
          </div>
        </div>
        <div className="cssforgrandtotal">
          <div>
            <h4>CGST</h4>
          </div>
          <div>
            <h4>431.39</h4>
          </div>
        </div>
        <div className="cssforgrandtotal">
          <div>
            <h4>SGST</h4>
          </div>
          <div>
            <h4>431.39</h4>
          </div>
        </div>
        <div className="cssforgrandtotal">
          <div>
            <h4>Round Off</h4>
          </div>
          <div>
            <h4>-0.58</h4>
          </div>
        </div>
        <hr style={{ borderTop: "1px solid black" }}></hr>
        <div className="cssforgrandtotal">
          <div>
            <h4>Grand Total :</h4>
          </div>
          <div>
            <h4>7327</h4>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceGrandtotal;
