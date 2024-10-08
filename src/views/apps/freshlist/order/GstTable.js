import React from "react";
import "./Table.css"; // Import your CSS file

const ResponsiveTable = ({ StateGST, GSTData }) => {
  console.log(GSTData);
  console.log(StateGST);
  return (
    <>
      {StateGST && StateGST ? (
        <>
          <div className="table-container">
            <table>
              <thead className="">
                <tr>
                  <th rowSpan="2">
                    {" "}
                    <div className="d-flex justify-content-center">HSN/SAC</div>
                  </th>
                  <th colSpan="1" rowSpan="2">
                    <div className="d-flex justify-content-center">Taxable</div>
                    <div className="d-flex justify-content-center">
                      <div>Value</div>
                    </div>
                  </th>
                  <th colSpan="2">
                    <div className="d-flex justify-content-center">
                      Central Tax
                    </div>
                  </th>
                  <th colSpan="2">
                    <div className="d-flex justify-content-center">
                      State Tax
                    </div>
                  </th>
                  <th colSpan="1" rowSpan="2">
                    <div className="d-flex justify-content-center">Total</div>
                  </th>
                </tr>
                <tr>
                  <th>
                    <div className="d-flex justify-content-center">Rate</div>
                  </th>
                  <th>
                    <div className="d-flex justify-content-center">Amount</div>
                  </th>
                  <th>
                    <div className="d-flex justify-content-center">Rate</div>
                  </th>
                  <th>
                    <div className="d-flex justify-content-center">Amount</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="d-flex justify-content-center">Data 1</div>
                  </td>
                  <td>
                    <div className="d-flex justify-content-center">Data 1</div>
                  </td>
                  <td>
                    <div className="d-flex justify-content-center">Data 1</div>
                  </td>
                  <td>
                    <div className="d-flex justify-content-center">Data 1</div>
                  </td>
                  <td>
                    <div className="d-flex justify-content-center">Data 1</div>
                  </td>
                  <td>
                    <div className="d-flex justify-content-center">Data 1</div>
                  </td>
                  <td>
                    <div className="d-flex justify-content-center">Data 1</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <div className="table-container">
            <table>
              <thead className="">
                <tr>
                  <th rowSpan="2">
                    {" "}
                    <div className="d-flex justify-content-center">HSN/SAC</div>
                  </th>
                  <th colSpan="1" rowSpan="2">
                    <div className="d-flex justify-content-center">Taxable</div>
                    <div className="d-flex justify-content-center">
                      <div>Value</div>
                    </div>
                  </th>
                  <th colSpan="2">
                    <div className="d-flex justify-content-center">
                      Integrated Tax
                    </div>
                  </th>

                  <th colSpan="1" rowSpan="2">
                    <div className="d-flex justify-content-center">Total</div>
                  </th>
                </tr>
                <tr>
                  <th>
                    <div className="d-flex justify-content-center">Rate</div>
                  </th>
                  <th>
                    <div className="d-flex justify-content-center">Amount</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {GSTData?.length > 0 &&
                  GSTData?.map((ele, index) => {
                    return (
                      <>
                        <tr key={index}>
                          <td>
                            <div className="d-flex justify-content-center">
                              {ele?.hsn}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex justify-content-center">
                              {ele?.taxable}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex justify-content-center">
                              {ele?.igstTax[0]?.rate}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex justify-content-center">
                              {ele?.igstTax[0]?.amount}
                            </div>
                          </td>

                          <td>
                            <div className="d-flex justify-content-center">
                              {ele?.totalTaxAmount}
                            </div>
                          </td>
                        </tr>
                      </>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
};

export default ResponsiveTable;
