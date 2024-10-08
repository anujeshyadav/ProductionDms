import React from "react";

const Incoicehsntable = () => {
  return (
    <>
      <div>
        <table className="table">
          <thead>
            <tr className="cssforthtr1">
              <th scope="row" rowspan="2">
                HSN/SAC
              </th>
              <th scope="row" rowspan="2">
                Taxable value
              </th>
              <th scope="col" colspan="2">
                Central Tax
              </th>
              <th scope="col" colspan="2">
                State Tax
              </th>
              <th scope="col" rowspan="2">
                Total Tax Amount
              </th>
            </tr>
            <tr className="cssforthtr1">
              <th scope="col">Rate </th>
              <th scope="col">Amount</th>
              <th scope="col">Rate</th>
              <th scope="col">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="cssfortdtr">
              <td>7896541 </td>
              <td> 5014.80</td>
              <td>6 % </td>
              <td>300.89 </td>
              <td>6 % </td>
              <td>300.89 </td>
              <td> 5616.58</td>
            </tr>
            <tr className="cssfortdtr">
              <td>Other Charges </td>
              <td> 1450.00</td>
              <td>9 % </td>
              <td>130.5 </td>
              <td>9 % </td>
              <td>130.5</td>
              <td> 1580.50</td>
            </tr>
            <tr className="cssfortdtr">
              <td>Total </td>
              <td> 6464.80</td>
              <td> </td>
              <td>431.39 </td>
              <td> </td>
              <td>431.39</td>
              <td> 7327</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Incoicehsntable;
