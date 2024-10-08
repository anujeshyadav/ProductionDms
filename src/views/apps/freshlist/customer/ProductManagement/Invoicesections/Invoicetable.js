import React from "react";

const Invoicetable = printData => {
  console.log("printData", printData.printData.orderItems);
  return (
    <>
      <div>
        <table className="table">
          <thead>
            <tr className="cssforthtr">
              <th scope="col" style={{ width: "5%" }}>
                #
              </th>
              <th scope="col">Product Name</th>
              <th scope="col">HSN / SAC</th>
              <th scope="col">Qty</th>
              <th scope="col">Dis%</th>
              <th scope="col">GST</th>
              <th scope="col">Unit</th>
              <th scope="col">Price</th>
              <th scope="col">Amount</th>
            </tr>
          </thead>
          <tbody>
            {printData?.printData?.orderItems?.map((item, index) => {
              return (
                <tr className="cssfortdtr">
                  <th scope="row">{index + 1}</th>
                  <td>{item?.productId?.Product_Title}</td>
                  <td>{item?.productId?.HSN_Code}</td>
                  <td>{item?.qty}</td>
                  <td>{item?.discountPercentage}</td>
                  <td>{item?.productId.GSTRate}</td>
                  <td>CARTONS(Ctn)</td>
                  <td>{item?.price}</td>
                  <td>{item?.grandTotal}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Invoicetable;
