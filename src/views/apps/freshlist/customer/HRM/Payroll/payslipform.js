import React, { useContext, useEffect, useState } from "react";
import {
  Table,
  Card,
  CardBody,
  Row,
  Col,
  CardHeader,
  Button,
} from "reactstrap";
import { useParams } from "react-router-dom";
import LedgerPdf from "../../../house/LedgerPdf";
import { _Get } from "../../../../../../ApiEndPoint/ApiCalling";
import { Hrm_Salary_slip, Image_URL } from "../../../../../../ApiEndPoint/Api";
import UserContext from "../../../../../../context/Context";

let BasicSalary;
let totalAdd;
let totalMinus;
let NetSalary;
let GrossSalary;
const Payslip = () => {
  const Alldata = useContext(UserContext);
  // console.log(Alldata?.CompanyDetails?.logo);
  const [SalaryData, setSalaryData] = useState({});
  const [setSalaryAddValues, setSalaryADD] = useState([]);
  const [SalaryDuductValues, setSalaryDuduct] = useState([]);

  let Params = useParams();
  useEffect(() => {
    let userId = JSON.parse(localStorage.getItem("userData"));
    console.log(Params.id);
    (async () => {
      await _Get(Hrm_Salary_slip, userId?.database, userId?._id)
        .then((res) => {
          // console.log(res);
          let selected = res?.Salary?.filter((ele) => ele?._id == Params.id);
          let MiunsValue = selected[0]?.employee?.filter(
            (ele) =>
              ele?.rule == "LOAN" ||
              ele?.rule == "PF" ||
              ele?.rule == "EMI" ||
              ele?.rule == "ADVANCE"
          );

          let AddValue = selected[0]?.employee?.filter(
            (ele) =>
              ele?.rule == "ALLOWANCE" ||
              ele?.rule == "INCENTIVE" ||
              ele?.rule == "BONUS" ||
              ele?.rule == "ACTUAL (BILL)"
          );
          let add = [];
          let Sub = [];
          AddValue?.map((ele) => {
            add.push(ele?.amount);
          });

          MiunsValue?.map((ele) => {
            Sub.push(ele?.amount);
          });
          BasicSalary = Number(selected[0]?.totalSalary.toFixed(2));
          totalAdd = add.reduce((a, b) => a + b, 0);
          totalMinus = Sub.reduce((a, b) => a + b, 0);
          totalMinus = Sub.reduce((a, b) => a + b, 0);
          GrossSalary = BasicSalary + totalAdd;
          NetSalary = Number((BasicSalary + totalAdd - totalMinus).toFixed(2));
          setSalaryADD(AddValue);
          setSalaryDuduct(MiunsValue);

          setSalaryData(selected[0]);

          console.log(selected[0]);
        })
        .catch((err) => {
          console.log(err);
        });
    })();
  }, []);

  return (
    <>
      <div className="d-flex justify-content-end">
        {/* <LedgerPdf downloadFileName="PaySlip" rootElementId="testId" /> */}
        <Button color="primary" onClick={() => window.print()}>
          Print
        </Button>
      </div>

      <Row>
        <Col id="testId" sm="12" md="9" className="mx-auto">
          <Card className="p-2">
            <Col lg="12" md="12" sm="12">
              <div className="d-flex justify-content-center ">
                <h2>PAY-SLIP</h2>
              </div>
            </Col>

            <CardBody>
              <div className="payslip">
                <Row style={{ fontWeight: 600 }}>
                  <Col>
                    <div className="d-flex justify-content-start">
                      {Alldata?.CompanyDetails?.logo && (
                        <img
                          width={120}
                          className="mx-1 mb-1"
                          height={60}
                          src={`${Image_URL}/Images/${Alldata?.CompanyDetails?.logo}`}
                          alt="logo"
                        />
                      )}
                    </div>
                  </Col>
                  <Col>
                    <div>
                      {Alldata?.CompanyDetails?.name &&
                        Alldata?.CompanyDetails?.name}
                    </div>

                    <div>
                      Address:{" "}
                      {Alldata?.CompanyDetails?.address &&
                        Alldata?.CompanyDetails?.address}
                    </div>
                    <div>
                      GST:{" "}
                      {Alldata?.CompanyDetails?.gstNo &&
                        Alldata?.CompanyDetails?.gstNo}
                    </div>
                  </Col>
                </Row>

                <Table bordered striped>
                  <thead>
                    <tr style={{ backgroundColor: "lightblue" }}>
                      {/* <th>Company Name</th>
                    <th>
                      {Alldata?.CompanyDetails?.name &&
                        Alldata?.CompanyDetails?.name}
                    </th> */}
                      <th>Employee Name</th>
                      <th>
                        {SalaryData?.employeeName && SalaryData?.employeeName}
                      </th>
                      <th>Month</th>
                      <th>
                        {SalaryData?.salaryMonth && SalaryData?.salaryMonth}
                      </th>
                    </tr>
                    {/* <tr style={{ backgroundColor: "lightblue" }}>
                    <th>Company Address</th>
                    <th>
                      {Alldata?.CompanyDetails?.address &&
                        Alldata?.CompanyDetails?.address}
                    </th>
                  </tr> */}
                  </thead>
                  <tbody>
                    <tr>
                      <td>Employee ID No.</td>
                      <td>
                        {SalaryData?.userId?._id && SalaryData?.userId?._id}
                      </td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>Position</td>
                      <td>
                        {SalaryData?.userId?.last_job_Designation &&
                          SalaryData?.userId?.last_job_Designation}
                      </td>
                      <td>PanCard</td>
                      <td>{SalaryData?.panCard && SalaryData?.panCard}</td>
                    </tr>
                    <tr>
                      <td>Contact</td>
                      <td>
                        {SalaryData?.userId?.mobileNumber &&
                          SalaryData?.userId?.mobileNumber}
                      </td>
                      <td>Recruitment date</td>
                      <td>
                        {SalaryData?.userId?.last_job_AppoitmentDate &&
                          SalaryData?.userId?.last_job_AppoitmentDate}
                      </td>
                    </tr>
                    <tr>
                      <td>Address</td>
                      <td>
                        {SalaryData?.userId?.address1 &&
                          SalaryData?.userId?.address1}
                      </td>
                      <td>Worked Days</td>
                      <td>
                        {SalaryData?.totalWorkingDays &&
                          SalaryData?.totalWorkingDays}
                      </td>
                    </tr>

                    <tr>
                      <td>Seniority (yrs)</td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                </Table>

                <Table bordered striped>
                  <thead>
                    <tr style={{ backgroundColor: "lightblue" }}>
                      <th>Description</th>
                      <th>Gross Amount</th>
                      <th>#VALUE</th>
                      <th>Deduction</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Basic Salary</td>
                      <td></td>
                      <td>
                        {SalaryData?.totalSalary &&
                          SalaryData?.totalSalary.toFixed(2)}
                        {/* {SalaryData?.basicSalary && SalaryData?.basicSalary} */}
                      </td>
                      <td></td>
                    </tr>
                    {setSalaryAddValues?.length > 0 && (
                      <>
                        {setSalaryAddValues?.map((ele, i) => {
                          return (
                            <tr key={i}>
                              <td>{ele?.title}</td>
                              <td></td>
                              <td>{ele?.amount}</td>
                              <td></td>
                            </tr>
                          );
                        })}
                      </>
                    )}

                    <tr>
                      <td style={{ fontSize: "20px", fontWeight: "bold" }}>
                        Gross Salary
                      </td>
                      <td></td>
                      <td style={{ fontSize: "20px", fontWeight: "bold" }}>
                        {GrossSalary && GrossSalary}
                      </td>
                      <td></td>
                    </tr>
                    {SalaryDuductValues?.length > 0 && (
                      <>
                        {SalaryDuductValues?.map((ele, i) => {
                          return (
                            <tr key={i}>
                              <td>{ele?.title}</td>
                              <td></td>
                              <td></td>
                              <td>-{ele?.amount}</td>
                            </tr>
                          );
                        })}
                      </>
                    )}

                    <tr>
                      <td style={{ fontSize: "20px", fontWeight: "bold" }}>
                        NET SALARY
                      </td>
                      <td></td>
                      <td></td>
                      <td
                        style={{
                          fontSize: "20px",
                          fontWeight: "bold",
                          backgroundColor: "#e1e1e1",
                        }}>
                        {NetSalary && NetSalary}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Payslip;
