import React, { useState, useEffect } from "react";
import "./LedgerEntryList.css";
import { Col, Row } from "reactstrap";
import LedgerPdf from "../house/LedgerPdf";
let SecondLast = null;

const LedgerEntryList = (props) => {
  const [Ledger, setLedger] = useState([]);

  useEffect(() => {
    setLedger(props?.Ledger);
    SecondLast = props?.Ledger?.length - 1;
    console.log(props?.Ledger);
  }, []);

  return (
    <div className="mx-1">
      <Row>
        <Col className="d-flex justify-content-end">
          <LedgerPdf downloadFileName="Cashbook" rootElementId="testId" />
        </Col>
      </Row>
      <div id="testId" className="ledger-entry-list  ">
        <div className="d-flex justify-content-center">
          <h2 className="company_heaeding">Jupitech Techno</h2>
        </div>
        <div className="d-flex justify-content-center">
          <h4 className="location">Indore</h4>
        </div>
        <div className="d-flex justify-content-center">
          <h2 className="ledgertype">Cash Book</h2>
        </div>
        <div className="d-flex justify-content-center">
          <h2 className="ledgerDate">01-Apr-2023 to 07-Jan-2024</h2>
        </div>
        <ul className="Heading_of_ledger ">
          <li className="entry-items">
            <div className="headingsledger">
              <p> Date</p>
              <p>Particulars</p>
              <p>Other</p>
              <p>Vch Type</p>
              <p>Vch No.</p>
              <p>Debit</p>
              <p>Credit</p>
            </div>
          </li>
        </ul>
        <ul>
          {Ledger &&
            Ledger?.map((entry, index) => (
              <li key={index} className="entry-item">
                <div className="ledger_data">
                  <p> {entry.date?.split("T")[0]}</p>
                  <p>
                    <div>To:{entry?.partyId?.OwnerName}</div>
                    <div>By</div>
                  </p>
                  <p> 1200 Dr.</p>
                  <p> Receipt</p>
                  <p> {entry?.voucherNo}</p>
                  <p>{entry?.debit && <>- {entry?.debit}</>}</p>
                  <p>{entry?.credit && entry?.credit}</p>
                </div>
              </li>
            ))}
        </ul>
        <Row className="">
          <Col>
            {" "}
            <div className="d-flex justify-content-center">
              <p className="lastfooter "> </p>
            </div>
          </Col>
          <Col
            style={{
              borderTop: "1px solid black",
            }}
            lg="2"
            md="2"
            sm="2">
            <div className="d-flex justify-content-center">
              <p className="lastfooter">
                {Ledger[SecondLast]?.debitBalance &&
                  Ledger[SecondLast]?.debitBalance}
              </p>
            </div>
          </Col>
          <Col
            style={{
              borderTop: "1px solid black",
            }}
            lg="1"
            md="1"
            sm="1">
            <div className="d-flex justify-content-end">
              <p className="lastfooter">
                {" "}
                {Ledger[SecondLast]?.creditBalance &&
                  Ledger[SecondLast]?.creditBalance}
              </p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            {" "}
            <div className="d-flex justify-content-center">
              <p className="lastfooter"> By Closing Balance</p>
            </div>
          </Col>
          <Col
            style={{
              borderBottom: "1px solid black",
            }}
            lg="1"
            md="1"
            sm="1">
            <div className="d-flex justify-content-end">
              <p className="lastfooter"></p>
            </div>
          </Col>
          <Col
            style={{
              borderBottom: "1px solid black",
            }}
            lg="2"
            md="2"
            sm="2">
            <div className="d-flex justify-content-end">
              <p className="lastfooter">
                {" "}
                {Ledger[SecondLast]?.closingBalance &&
                  Ledger[SecondLast]?.closingBalance}
              </p>
            </div>
          </Col>
        </Row>
        <Row className="">
          <Col>
            {" "}
            <div className="d-flex justify-content-center">
              <p className="lastfooter "> </p>
            </div>
          </Col>
          <Col
            style={{
              borderBottom: "2px solid black",
            }}
            lg="2"
            md="2"
            sm="2">
            <div className="d-flex justify-content-center">
              <p className="lastfooter">
                {Ledger[SecondLast]?.debitBalance &&
                  Ledger[SecondLast]?.debitBalance}
              </p>
            </div>
          </Col>
          <Col
            style={{
              borderBottom: "2px solid black",
            }}
            lg="1"
            md="1"
            sm="1">
            <div className="d-flex justify-content-end">
              <p className="lastfooter">
                {" "}
                {Ledger[SecondLast]?.creditBalance && (
                  <>
                    {Ledger[SecondLast]?.creditBalance +
                      Ledger[SecondLast]?.closingBalance}
                  </>
                )}
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default LedgerEntryList;
