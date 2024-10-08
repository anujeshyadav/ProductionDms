import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Input,
  Label,
  Row,
  Table,
} from "reactstrap";
import { _Get, _Post } from "../../../../../ApiEndPoint/ApiCalling";
import { Profit_Loss_Report } from "../../../../../ApiEndPoint/Api";
import LedgerPdf from "../../house/LedgerPdf";

function ProfitandLossReport() {
  const [ProfitLoss, setProfitLoss] = useState([]);
  const [GrossProfit, setGrossProfit] = useState("");
  const [DateFilter, setDateFilter] = useState({});
  const [NetProfit, setNetProfit] = useState("");
  const userInfo = JSON.parse(localStorage.getItem("userData"));
  useEffect(() => {
    profitLoss();
  }, []);

  const profitLoss = () => {
    _Post(Profit_Loss_Report, userInfo?.database)
      .then((res) => {
        setProfitLoss(res?.ProfitLoss);
        let value = res?.ProfitLoss;
        let Gross = Number(
          (
            value[0]?.salesOrders -
            value[1]?.salesReturns +
            value[2]?.purchasesOrder -
            value[3]?.purchasesReturn
          ).toFixed(2)
        );
        setGrossProfit(Gross);
        let NetProfit = Number(
          (value[4]?.incomes - value[5]?.expenses).toFixed(2)
        );

        setNetProfit(NetProfit);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleSubmitDate = (e) => {
    e.preventDefault();
    console.log(DateFilter);
    let payload = {
      startDate: DateFilter?.startDate,
      endDate: DateFilter?.EndDate,
    };
    debugger;
    _Post(Profit_Loss_Report, userInfo?.database, payload)
      .then((res) => {
        debugger;
        setProfitLoss(res?.ProfitLoss);
        let value = res?.ProfitLoss;
        let Gross = Number(
          (
            value[0]?.salesOrders -
            value[1]?.salesReturns +
            value[2]?.purchasesOrder -
            value[3]?.purchasesReturn
          ).toFixed(2)
        );
        setGrossProfit(Gross);
        let NetProfit = Number(
          (value[4]?.incomes - value[5]?.expenses).toFixed(2)
        );

        setNetProfit(NetProfit);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleDate = (e) => {
    const { name, value } = e.target;
    setDateFilter({ ...DateFilter, [name]: value });
  };
  return (
    <div>
      <Card>
        <div className="d-flex justify-content-end mr-1">
          <LedgerPdf
            downloadFileName="ProfitLossStatement"
            rootElementId="testId"
          />
        </div>
        <div className="d-flex flex-wrap justify-content-end mb-1">
          <div className="table-input mr-1">
            <Label>Start Date</Label>
            <Input
              type="date"
              name="startDate"
              value={DateFilter?.startDate}
              onChange={handleDate}
            />
          </div>
          <div className="table-input mr-1">
            <Label>End Date</Label>
            <Input
              type="date"
              name="EndDate"
              value={DateFilter?.EndDate}
              onChange={handleDate}
            />
          </div>
          <div className="table-input mr-1">
            <Button
              type="submit"
              className="mt-2"
              color="primary"
              onClick={handleSubmitDate}>
              Submit
            </Button>
          </div>
        </div>
        <div id="testId">
          <div className="d-flex justify-content-center">
            <div className=" ">
              <hr />
              <h3>Profit and Loss Account</h3>
              <hr />
            </div>
          </div>

          <div>
            <div className="p-1">
              <div style={{ backgroundColor: "#8080809c" }}>
                <Row>
                  <Col>
                    <div
                      className=""
                      style={{
                        fontWeight: "bold",
                        color: "white",
                        padding: "15px",
                      }}>
                      Transaction Type(without Tax)
                    </div>
                  </Col>
                  <Col>
                    <div
                      style={{
                        fontWeight: "bold",
                        color: "white",
                        padding: "15px",
                      }}>
                      Total Amount
                    </div>
                  </Col>
                </Row>
              </div>
              <Row>
                <Col>
                  <div
                    className=""
                    style={{
                      fontWeight: "bold",

                      padding: "15px",
                    }}>
                    Sales without Tax(+)
                  </div>
                </Col>
                <Col>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "15px",

                      padding: "15px",
                    }}>
                    RS{" "}
                    {ProfitLoss[0]?.salesOrders
                      ? ProfitLoss[0]?.salesOrders?.toFixed(2)
                      : 0.0}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div
                    className=""
                    style={{
                      fontWeight: "bold",

                      padding: "15px",
                    }}>
                    Sales Return without Tax (-)
                  </div>
                </Col>
                <Col>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "15px",

                      padding: "15px",
                    }}>
                    RS{" "}
                    {ProfitLoss[1]?.salesReturns
                      ? ProfitLoss[1]?.salesReturns?.toFixed(2)
                      : 0.0}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div
                    className=""
                    style={{
                      fontWeight: "bold",

                      padding: "15px",
                    }}>
                    Purchase without Tax (+)
                  </div>
                </Col>
                <Col>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "15px",

                      padding: "15px",
                    }}>
                    RS{" "}
                    {ProfitLoss[2]?.purchasesOrder
                      ? ProfitLoss[2]?.purchasesOrder?.toFixed(2)
                      : 0.0}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div
                    className=""
                    style={{
                      fontWeight: "bold",

                      padding: "15px",
                    }}>
                    Purchase Return without Tax (-)
                  </div>
                </Col>
                <Col>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "15px",

                      padding: "15px",
                    }}>
                    RS{" "}
                    {ProfitLoss[3]?.purchasesReturn
                      ? ProfitLoss[3]?.purchasesReturn?.toFixed(2)
                      : 0.0}
                  </div>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col>
                  <div
                    className=""
                    style={{
                      fontWeight: "bold",

                      padding: "8px",
                    }}>
                    <strong style={{ fontSize: "16px" }}>Gross Profit</strong>
                  </div>
                </Col>
                <Col>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "15px",

                      padding: "8px",
                    }}>
                    <strong style={{ fontSize: "16px" }}>
                      RS {GrossProfit ? GrossProfit : 0.0}
                    </strong>
                  </div>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col>
                  <div
                    className=""
                    style={{
                      fontWeight: "bold",

                      padding: "15px",
                    }}>
                    Indirect Income without Tax (+)
                  </div>
                </Col>
                <Col>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "15px",

                      padding: "15px",
                    }}>
                    RS{" "}
                    {ProfitLoss[4]?.incomes
                      ? ProfitLoss[4]?.incomes?.toFixed(2)
                      : 0.0}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div
                    className=""
                    style={{
                      fontWeight: "bold",

                      padding: "15px",
                    }}>
                    Indirect Expenses without Tax (-)
                  </div>
                </Col>
                <Col>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "15px",
                      padding: "15px",
                    }}>
                    RS{" "}
                    {ProfitLoss[5]?.expenses
                      ? ProfitLoss[5]?.expenses?.toFixed(2)
                      : 0.0}
                  </div>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col>
                  <div
                    className=""
                    style={{
                      fontWeight: "bold",

                      padding: "8px",
                    }}>
                    <strong style={{ fontSize: "16px" }}>Net Profit</strong>
                  </div>
                </Col>
                <Col>
                  <div
                    style={{
                      fontWeight: "bold",

                      padding: "8px",
                    }}>
                    <strong style={{ fontSize: "16px" }}>
                      RS {NetProfit ? NetProfit : 0.0}
                    </strong>
                  </div>
                </Col>
              </Row>
              <hr />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ProfitandLossReport;
