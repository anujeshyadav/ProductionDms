import React, { useEffect, useState, useContext } from "react";

import {
  Card,
  CardBody,
  Col,
  Form,
  Row,
  Input,
  Label,
  Button,
  FormGroup,
  CustomInput,
  Table,
  Spinner,
} from "reactstrap";
import Ledgers from "../../freshlist/accounts/Ledger";
import "react-phone-input-2/lib/style.css";
import LedgerPdf from "../house/LedgerPdf";
import swal from "sweetalert";
import "../../../../../src/layouts/assets/scss/pages/users.scss";

import { CreateCustomerList, _Get } from "../../../../ApiEndPoint/ApiCalling";

import "../../../../assets/scss/pages/users.scss";
import UserContext from "../../../../context/Context";

import { View_VendorLedger_by_id } from "../../../../ApiEndPoint/Api";
import SuperAdminUI from "../../../SuperAdminUi/SuperAdminUI";
let SecondLast = null;

const UserLedger = () => {
  const [Ledger, setLedger] = useState([]);
  const [AllLedger, setAllLedger] = useState([]);
  const [PartyId, setPartyId] = useState("");
  const [Partyname, setPartyname] = useState("");
  const [Filter, setFilter] = useState({});
  const [Master, setMaster] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [PartyList, setPartyList] = useState([]);

  const Context = useContext(UserContext);
  console.log(Context);
  const Apicalling = (id, db) => {
    setLoading(true);
    CreateCustomerList(id, db)
      .then((res) => {
        setLoading(false);

        let value = res?.Customer;
        if (value?.length) {
          setPartyList(value);
        }
      })
      .catch((err) => {
        setLoading(false);

        console.log(err);
        setPartyList([]);
      });
  };
  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("userData"));
    Apicalling(userId?._id, userId?.database);
    handleLedger();
    if (userId?.rolename?.roleName === "MASTER") {
      setMaster(true);
    }
  }, []);
  const handleParentSubmit = (e) => {
    e.preventDefault();
    let SuperAdmin = JSON.parse(localStorage.getItem("SuperadminIdByMaster"));
    let id = SuperAdmin.split(" ")[0];
    let db = SuperAdmin.split(" ")[1];
    Apicalling(id, db);
  };
  const handleDropdownChange = (selectedValue) => {
    localStorage.setItem("SuperadminIdByMaster", JSON.stringify(selectedValue));
  };
  const handleLedger = async () => {
    // e.preventDefault();
    setLoading(true);
    const userInfor = JSON.parse(localStorage.getItem("userData"));

    await _Get(View_VendorLedger_by_id, userInfor?._id)
      .then((res) => {
        setLoading(false);
        SecondLast = res?.Ledger?.length - 1;
        setLedger(res?.Ledger);
        setAllLedger(res?.Ledger);
      })
      .catch((err) => {
        setLoading(false);
        setLedger([]);
        setAllLedger([]);
      });
  };
  const handleChangeData = (e) => {
    let { name, value } = e.target;
    setFilter({ ...Filter, [name]: value });
  };

  const handleShowDateWiseLedger = (e) => {
    e.preventDefault();
    const filteredItems = AllLedger?.filter((item) => {
      const dateList = new Date(item?.updatedAt);
      const onlyDate = dateList.toISOString().split("T")[0];
      return onlyDate >= Filter?.startDate && onlyDate <= Filter?.EndDate;
    });
    setLedger(filteredItems ? filteredItems : []);
  };
  return (
    <div>
      <div>
        {Loading && Loading ? (
          <>
            <div className="d-flex justify-content-center align-item-center">
              {" "}
              <Spinner
                style={{
                  height: "4rem",
                  width: "4rem",
                }}
                color="primary">
                Loading...
              </Spinner>
            </div>
          </>
        ) : (
          <>
            <Card>
              <Row className="m-2">
                <Col lg="2" md="2">
                  <div className="table-input mr-1">
                    <h3>Vendor Ledger</h3>
                  </div>
                </Col>
                <Col lg="5" md="5">
                  <SuperAdminUI
                    onDropdownChange={handleDropdownChange}
                    onSubmit={handleParentSubmit}
                  />
                </Col>
                <Col></Col>
                {/* <Col lg="2" md="2">
                  <CustomInput
                    onChange={(e) => {
                      const selected =
                        e.target.options[e.target.selectedIndex].getAttribute(
                          "data-name"
                        );
                      setPartyId(e.target.value);
                      setPartyname(selected);
                    }}
                    value={PartyId}
                    type="select">
                    <option value={0}>--Select Party--</option>
                    {PartyList?.length > 0 &&
                      PartyList?.map((ele, i) => {
                        return (
                          <option
                            data-name={`${ele?.firstName} ${ele?.lastName} `}
                            value={
                              ele?._id
                            }>{`${ele?.firstName} ${ele?.lastName} `}</option>
                        );
                      })}
                  </CustomInput>
                </Col>
                <Col lg="1" md="1" sm="6">
                  <div className="table-input mr-1 ">
                    <Button
                      onClick={handleLedger}
                      type="submit"
                      className=""
                      color="primary">
                      Submit
                    </Button>
                  </div>
                </Col> */}
              </Row>
              <Row>
                <Col></Col>
                <Col lg="2" md="2">
                  <div className="table-input mr-1">
                    <Label>Start Date</Label>
                    <Input
                      value={Filter.startDate}
                      onChange={handleChangeData}
                      type="date"
                      name="startDate"
                    />
                  </div>
                </Col>

                <Col lg="2" md="2">
                  <div className="table-input mr-1">
                    <Label>End Date</Label>
                    <Input
                      value={Filter.EndDate}
                      onChange={handleChangeData}
                      type="date"
                      name="EndDate"
                    />
                  </div>
                </Col>
                <Col lg="1" md="1" sm="6">
                  <div
                    className="table-input mr-1 mt-2 "
                    style={{ marginTop: "6px" }}>
                    <Button
                      onClick={handleShowDateWiseLedger}
                      type="submit"
                      className=""
                      color="primary">
                      Submit
                    </Button>
                  </div>
                </Col>
                {Ledger?.length > 0 && Ledger && (
                  <Col lg="1" md="1" sm="1">
                    <div className="d-flex justify-content-center">
                      <LedgerPdf
                        downloadFileName="Ledger"
                        rootElementId="testId"
                      />
                    </div>
                  </Col>
                )}
              </Row>
              {/* <hr /> */}

              <CardBody>
                {Ledger?.length > 0 && Ledger && (
                  <>
                    <div id="testId">
                      <div className="d-flex justify-content-center mb-1 mt-1">
                        <h3>{Partyname && Partyname} Ledger</h3>
                      </div>
                      <div className="p-4">
                        <Table bordered hover responsive size="sm">
                          {Ledger?.length > 0 && Ledger && (
                            <thead>
                              <tr>
                                <th>
                                  <div className="d-flex justify-content-center">
                                    <h5 className="text-bold">Date</h5>
                                  </div>
                                </th>
                                <th>
                                  <div className="d-flex justify-content-center">
                                    <h5 className="text-bold">Name</h5>
                                  </div>
                                </th>
                                <th>
                                  <div className="d-flex justify-content-center">
                                    <h5 className="text-bold">Particular</h5>
                                  </div>
                                </th>
                                <th>
                                  <div className="d-flex justify-content-center">
                                    <h5 className="text-bold">Reason</h5>
                                  </div>
                                </th>
                                <th>
                                  <div className="d-flex justify-content-center">
                                    <h5 className="text-bold">Debit</h5>
                                  </div>
                                </th>
                                <th>
                                  <div className="d-flex justify-content-center">
                                    <h5 className="text-bold">Credit</h5>
                                  </div>
                                </th>
                                {/* <th>
                                <div className="d-flex justify-content-center">
                                  <h5 className="text-bold">Total</h5>
                                </div>
                              </th> */}
                              </tr>
                            </thead>
                          )}
                          <tbody>
                            {Ledger &&
                              Ledger?.map((ele, index) => {
                                return (
                                  <tr key={ele?._id}>
                                    <td>
                                      <div className="d-flex justify-content-center">
                                        <div>
                                          {ele?.createdAt?.split("T")[0]}
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <div
                                        style={{ fontWeight: "bold" }}
                                        className="d-flex justify-content-center">
                                        <div>{ele?.partyId?.firstName}</div>
                                      </div>
                                    </td>
                                    <td>
                                      <div
                                        style={{ fontWeight: "bold" }}
                                        className="d-flex justify-content-center">
                                        {ele?.particular}
                                      </div>
                                    </td>
                                    <td>
                                      <div
                                        style={{ fontWeight: "bold" }}
                                        className="d-flex justify-content-center">
                                        {ele?.reason}
                                      </div>
                                    </td>
                                    <td>
                                      <div
                                        style={{ fontWeight: "bold" }}
                                        className="d-flex justify-content-center">
                                        {ele?.debit?.toFixed(2)}
                                      </div>
                                    </td>
                                    <td>
                                      <div
                                        style={{ fontWeight: "bold" }}
                                        className="d-flex justify-content-center">
                                        {ele?.creditBalance?.toFixed(2)}
                                      </div>
                                    </td>
                                    {/* <td>
                                <div
                                  style={{ fontWeight: "bold" }}
                                  className="d-flex justify-content-center">
                                  {ele?.closingBalance}
                                </div>
                              </td> */}
                                  </tr>
                                );
                              })}
                            {Ledger?.length > 0 && Ledger && (
                              <>
                                <tr>
                                  <th scope="row">
                                    <div
                                      style={{
                                        fontWeight: "bold",
                                        fontSize: "20px",
                                      }}
                                      className="d-flex justify-content-center">
                                      Total
                                    </div>
                                  </th>
                                  <td>
                                    <div
                                      style={{ fontWeight: "bold" }}
                                      className="d-flex justify-content-center"></div>
                                  </td>
                                  <td>
                                    <div
                                      style={{ fontWeight: "bold" }}
                                      className="d-flex justify-content-center"></div>
                                  </td>
                                  <td>
                                    <div
                                      style={{ fontWeight: "bold" }}
                                      className="d-flex justify-content-center"></div>
                                  </td>
                                  <td>
                                    <div
                                      style={{ fontWeight: "bold" }}
                                      className="d-flex justify-content-center">
                                      <div style={{ fontSize: "20px" }}>
                                        <strong>
                                          {" "}
                                          {Ledger[SecondLast]?.debitBalance &&
                                            Ledger[
                                              SecondLast
                                            ]?.debitBalance?.toFixed(2)}
                                        </strong>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div
                                      style={{ fontWeight: "bold" }}
                                      className="d-flex justify-content-center">
                                      <div style={{ fontSize: "20px" }}>
                                        <strong>
                                          {" "}
                                          {Ledger[SecondLast]?.creditBalance &&
                                            Ledger[
                                              SecondLast
                                            ]?.creditBalance?.toFixed(2)}
                                        </strong>
                                      </div>
                                    </div>
                                  </td>
                                  {/* <td>
                              <div
                                style={{ fontWeight: "bold" }}
                                className="d-flex justify-content-center">
                                <div style={{ fontSize: "20px" }}>
                                  <strong>
                                    {Ledger[SecondLast]?.closingBalance &&
                                      Ledger[SecondLast]?.closingBalance}
                                  </strong>
                                </div>
                              </div>
                            </td> */}
                                </tr>
                                <tr>
                                  <th scope="row">
                                    <div
                                      style={{
                                        fontWeight: "bold",
                                        fontSize: "20px",
                                      }}
                                      className="d-flex justify-content-center">
                                      Closing Balance
                                    </div>
                                  </th>
                                  <td>
                                    <div
                                      style={{ fontWeight: "bold" }}
                                      className="d-flex justify-content-center"></div>
                                  </td>
                                  <td>
                                    <div
                                      style={{ fontWeight: "bold" }}
                                      className="d-flex justify-content-center"></div>
                                  </td>
                                  <td>
                                    <div
                                      style={{ fontWeight: "bold" }}
                                      className="d-flex justify-content-center"></div>
                                  </td>
                                  <td>
                                    <div
                                      style={{ fontWeight: "bold" }}
                                      className="d-flex justify-content-center">
                                      <div style={{ fontSize: "20px" }}></div>
                                    </div>
                                  </td>

                                  <td>
                                    <div
                                      style={{ fontWeight: "bold" }}
                                      className="d-flex justify-content-center">
                                      <div style={{ fontSize: "20px" }}>
                                        <strong>
                                          {Ledger[SecondLast]?.closingBalance &&
                                            Ledger[
                                              SecondLast
                                            ]?.closingBalance?.toFixed(2)}
                                        </strong>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </>
                            )}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </>
                )}
                {/* <Row>
                  {Ledger && Ledger?.length > 0 && (
                    <Col>
                      <Ledgers Ledger={Ledger} />
                    </Col>
                  )}
                </Row> */}
              </CardBody>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};
export default UserLedger;
