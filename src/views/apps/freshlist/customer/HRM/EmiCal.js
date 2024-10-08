import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Button,
  Col,
  CustomInput,
  FormGroup,
  Input,
  Label,
  Row,
  Table,
} from "reactstrap";
let totalEMI = 0;
let totalPrincipalPaid = 0;
let totalInterestPaid = 0;
let totalRemainingPrincipal = 0;
const EMICalculator = () => {
  const [principal, setPrincipal] = useState(50000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(2);
  const [startDate, setStartDate] = useState(new Date());
  const [emi, setEMI] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [Mode, setMode] = useState("Month");

  const calculateEMI = () => {
    const monthlyRate = rate / 100 / 12;
    const totalMonths = Mode == "Month" ? years : years * 12;
    const numerator =
      principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths);
    const denominator = Math.pow(1 + monthlyRate, totalMonths) - 1;
    const emiValue = numerator / denominator;

    const emiArray = [];
    let remainingPrincipal = principal;
    let currentDate = new Date(startDate);
    for (let i = 1; i <= totalMonths; i++) {
      const interest = remainingPrincipal * monthlyRate;
      const principalPaid = emiValue - interest;
      remainingPrincipal -= principalPaid;
      const emiDate = new Date(currentDate);
      emiArray.push({
        month: i,
        EMI: emiValue.toFixed(2),
        PrincipalPaid: principalPaid.toFixed(2),
        InterestPaid: interest.toFixed(2),
        RemainingPrincipal: remainingPrincipal.toFixed(2),
        Date: emiDate,
      });
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    for (const emi of emiArray) {
      totalEMI += parseFloat(emi.EMI);
      totalPrincipalPaid += parseFloat(emi.PrincipalPaid);
      totalInterestPaid += parseFloat(emi.InterestPaid);
      totalRemainingPrincipal += parseFloat(emi.RemainingPrincipal);
    }
    setEMI(emiArray);
    setShowTable(true);
  };
  useEffect(() => {
    console.log(emi);
  }, [emi]);

  const downloadPDF = async () => {
    const input = document.getElementById("emi-table");

    await html2canvas(input, {
      scale: 6, // Increase the scale for better quality
      useCORS: true, // This helps with cross-origin images
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("Emi_table.pdf");
      setLoading(false);
    });
  };

  return (
    <div>
      <div className="d-flex mt-2 mb-1 justify-content-center">
        <h2>EMI Calculator</h2>
      </div>

      <div>
        <Row>
          <Col md={4}>
            <FormGroup>
              <Label>Principal amount:</Label>
              <Input
                required
                placeholder="Principal amount"
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(parseFloat(e.target.value))}
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label>Rate (%):</Label>
              <Input
                required
                placeholder="Rate"
                type="number"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label>Loan Type:</Label>
              <CustomInput
                required
                placeholder="Years"
                type="select"
                value={Mode}
                onChange={(e) => setMode(e.target.value)}>
                <option>--select--</option>
                <option value="Year">Year</option>
                <option value="Month">Month</option>
              </CustomInput>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label>{Mode && Mode ? Mode : <>Yearly</>}:</Label>
              <Input
                required
                placeholder="Years"
                type="number"
                value={years}
                onChange={(e) => setYears(parseFloat(e.target.value))}
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label>Start Date:</Label>
              <Input
                required
                type="datetime-local"
                value={startDate.toISOString().slice(0, -1)}
                onChange={(e) => setStartDate(new Date(e.target.value))}
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup className="mt-2">
              <Button color="primary" onClick={calculateEMI}>
                Calculate
              </Button>

              {showTable && (
                <Button
                  className="mx-1"
                  color={!Loading ? "primary" : "secondary"}
                  onClick={() => {
                    setLoading(true);

                    downloadPDF();
                  }}>
                  {!Loading ? <> Download</> : <>wait ...</>}
                </Button>
              )}
            </FormGroup>
          </Col>
        </Row>
      </div>

      {showTable && (
        <div className="p-3" id="emi-table">
          <h4>
            <div className="d-flex justify-content-center">EMI </div>
          </h4>
          <Table
            responsive
            style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th style={{ border: "1px solid #dddddd", padding: "8px" }}>
                  S.No.
                </th>

                <th style={{ border: "1px solid #dddddd", padding: "8px" }}>
                  Principal Paid
                </th>
                <th style={{ border: "1px solid #dddddd", padding: "8px" }}>
                  Interest Paid
                </th>
                <th style={{ border: "1px solid #dddddd", padding: "8px" }}>
                  Remaining Principal
                </th>
                <th style={{ border: "1px solid #dddddd", padding: "8px" }}>
                  Date
                </th>
                <th style={{ border: "1px solid #dddddd", padding: "8px" }}>
                  EMI
                </th>
              </tr>
            </thead>
            <tbody>
              {emi?.map((item, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid #dddddd", padding: "8px" }}>
                    {item.month}
                  </td>

                  <td style={{ border: "1px solid #dddddd", padding: "8px" }}>
                    {item.PrincipalPaid}
                  </td>
                  <td style={{ border: "1px solid #dddddd", padding: "8px" }}>
                    {item.InterestPaid}
                  </td>
                  <td style={{ border: "1px solid #dddddd", padding: "8px" }}>
                    {item.RemainingPrincipal}
                  </td>
                  <td style={{ border: "1px solid #dddddd", padding: "8px" }}>
                    {item.Date.toLocaleDateString()}{" "}
                    {/* {item.Date.toLocaleTimeString()} */}
                  </td>
                  <td style={{ border: "1px solid #dddddd", padding: "8px" }}>
                    {item.EMI}
                  </td>
                </tr>
              ))}
              <tr style={{ fontSize: "18px", fontWeight: 800 }}>
                <td>Total </td>
                <td> {totalPrincipalPaid & totalPrincipalPaid?.toFixed(2)}</td>
                <td>{totalInterestPaid && totalInterestPaid?.toFixed(2)}</td>
                <td>
                  {totalRemainingPrincipal &&
                    totalRemainingPrincipal?.toFixed(2)}
                </td>
                <td>NA</td>
                <td>{totalEMI && totalEMI?.toFixed(2)}</td>
              </tr>
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default EMICalculator;
