import React from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ModalHeader,
  Modal,
  ModalBody,
  Button,
  Col,
  Row,
  Badge,
  Input,
  Card,
  CardBody,
} from "reactstrap";
import SubscribersGained from "../../ui-elements/cards/statistics/SubscriberGained";
import RevenueGenerated from "../../ui-elements/cards/statistics/RevenueGenerated";
import QuaterlySales from "../../ui-elements/cards/statistics/QuaterlySales";
import OrdersReceived from "../../ui-elements/cards/statistics/OrdersReceived";
import { ChevronDown, ChevronRight, Edit, Trash2 } from "react-feather";
import "../../../assets/scss/plugins/charts/apex-charts.scss";
import { _Get, _PostSave } from "../../../../ApiEndPoint/ApiCalling";
import {
  LowStock_Calculation,
  Save_dashboard_Tabs,
  stock_calculate,
  View_dashboard_Tabs,
} from "../../../../ApiEndPoint/Api";
import swal from "sweetalert";

class EcommerceDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      List: [],
      basicList: [
        {
          key: 1,
          NavLink: "/app/SoftNumen/ticket/Partywiseledger",
          value: <SubscribersGained />,
          Name: "Ledger",
          Show: true,
        },
        {
          key: 2,
          NavLink: "/app/SoftNumen/ticket/Partywiseledger",
          value: <RevenueGenerated />,
          Name: "Sales",
          Show: true,
        },
        {
          key: 3,
          NavLink: "/app/SoftNumen/ticket/Partywiseledger",
          value: <QuaterlySales />,
          Name: "Purchase",
          Show: true,
        },
        {
          key: 4,
          NavLink: "/app/SoftNumen/ticket/Partywiseledger",
          value: (
            <OrdersReceived
              // iconBg="warning"
              // stat="57.5k"
              statTitle="Stock"
              statTitle1="Opening Stock"
              statTitle2="Closing Stock"
              statTitle3="Dead Stock"
              statTitle4="Damage Stock"
              statTitle5="Warehouse Stock"
              statTitle6=" Stock"
              // type="area"
            />
          ),
          Name: "Transaction ",
          Show: true,
        },
        {
          key: 5,
          NavLink: "/app/SoftNumen/ticket/Partywiseledger",
          value: (
            <OrdersReceived
              // iconBg="success"
              // stat="47.5k"
              heading="Low Stock"
              productName="Cake box Printed ITC"
              alert="Stock "
              grade="A "
            />
          ),
          Name: "Total Employees",
          Show: true,
        },
        {
          key: 6,
          NavLink: "/app/SoftNumen/ticket/Partywiseledger",
          value: (
            <OrdersReceived
              heading="Dead Party"
              partyName="Ganga bishan Lal "
              SalesPersonName="abc"
              Inactive="A"
            />
          ),
          Name: "Party Name",
          Show: true,
        },
        {
          key: 7,
          NavLink: "/app/SoftNumen/ticket/Partywiseledger",
          value: (
            <OrdersReceived
              // iconBg="success"
              // stat="37.5k"
              statTitle="Creditor"
              statTitle1="Total Purchase"
              statTitle2="Total Paid"
              statTitle3="Currrent Purchase"
              statTitle4="Currrent Paid"
              statTitle5="Outstanding"
              statTitle6="Creditor"
              // type="area"
            />
          ),
          Name: "Total Customer",
          Show: true,
        },
        {
          key: 8,
          NavLink: "/app/SoftNumen/ticket/Partywiseledger",
          value: (
            <OrdersReceived
              statTitle="Debitor"
              statTitle1="Total Outstanding"
              statTitle2="Total Receipt"
              statTitle3="Total Due"
              statTitle4="Currrent Outstanding"
              statTitle5="Currrent Receipt"
              statTitle6="Currrent Due"
            />
          ),
          Name: "Todays Attendance",
          Show: true,
        },
      ],
    };
  }
  async componentDidMount() {
    let userData = JSON.parse(localStorage.getItem("userData"));
    const userInfo = JSON.parse(localStorage.getItem("userData"));

    await _Get(LowStock_Calculation, userInfo?.database)
      .then((res) => {
        this.setState({ Lowstock: res?.WarehouseStock });
        console.log(res?.alertProducts);
      })
      .catch((err) => {
        console.log(err);
      });
    await _Get(stock_calculate, userInfo?.database)
      .then((res) => {
        this.setState({ stock: res?.WarehouseStock });
        console.log(res?.WarehouseStock);
      })
      .catch((err) => {
        console.log(err);
      });
    await _Get(View_dashboard_Tabs, userData?._id)
      .then((res) => {
        let AllTab = [];
        let SelectedTab = res?.Tab?.tab;

        let mytab = this.state.basicList?.map((ele, index) => {
          // ele.OpeningStock = this.state.stock?.OpeningStock;
          // ele.WarehouseStock = this.state.stock?.WarehouseStock;
          // ele.ClosingStock = this.state.stock?.ClosingStock;
          SelectedTab?.map((val, i) => {
            if (ele?.Name == val?.Name) {
              ele["Show"] = val?.show;
              AllTab.push(ele);
            }
          });
        });

        this.setState({ List: AllTab });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  LookupviewStart = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };
  hanldeSetBox = (e, ele, i) => {
    let allList = this.state.basicList;
    if (e.target.checked) {
      allList[i]["Show"] = e.target.checked;
    } else {
      allList[i]["Show"] = e.target.checked;
    }
    this.setState({ List: allList });
  };

  handleTogglemodal = () => {
    this.LookupviewStart();
  };

  handleSubmitBottomData = async (e) => {
    e.preventDefault();

    let userData = JSON.parse(localStorage.getItem("userData"));
    let tabs = this.state.List?.map((ele) => {
      return {
        key: ele?.key,
        Name: ele?.Name,
        show: ele?.Show,
      };
    });
    let payload = {
      userId: userData?._id,
      tab: tabs,
    };

    await _PostSave(Save_dashboard_Tabs, payload)
      .then((res) => {
        console.log(res);
        this.LookupviewStart();
      })
      .catch((err) => {
        console.log(err);
        swal("Somthing Went Wrong");
      });
  };

  render() {
    return (
      <React.Fragment>
        <Row className="match-height">
          {this.state.basicList &&
            this.state.basicList.map(
              (ele, index) =>
                ele?.Show && (
                  <Col
                    key={ele?.NavLink || index} // Use NavLink as unique key if available, otherwise fallback to index
                    onClick={() => this.props.history.push(ele?.NavLink)}
                    lg="3"
                    md="6"
                    sm="6">
                    {ele.value}
                  </Col>
                )
            )}

          <span className="editbtn">
            <Edit
              onClick={this.handleTogglemodal}
              color="red"
              style={{ cursor: "pointer" }}
              size={18}
            />
          </span>
          {/* <Col lg="3" md="6" sm="6">
            <SubscribersGained />
          </Col>
          <Col lg="3" md="6" sm="6">
            <RevenueGenerated />
          </Col>
          <Col lg="3" md="6" sm="6">
            <QuaterlySales />
          </Col>
          <Col lg="3" md="6" sm="6">
            <OrdersReceived />
          </Col> */}
        </Row>

        {/* <Row className="match-height">
          <Col lg="8" md="6" sm="12">
            <RevenueChart
              primary={$primary}
              dangerLight={$danger_light}
              strokeColor={$stroke_color}
              labelColor={$label_color}
            />
          </Col>
          <Col lg="4" md="6" sm="12">
            <GoalOverview strokeColor={$stroke_color} success={$success} />
          </Col>
        </Row> */}
        {/* <Row className="match-height">
          <Col lg="4" md="6" sm="12">
            <BrowserStats />
          </Col>
          <Col lg="8" md="6" sm="12">
            <ClientRetention
              strokeColor={$stroke_color}
              primary={$primary}
              danger={$danger}
              labelColor={$label_color}
            />
          </Col>
        </Row> */}
        <Row>
          {/* <Col lg="4" md="12">
            <SessionByDevice
              primary={$primary}
              warning={$warning}
              danger={$danger}
              primaryLight={$primary_light}
              warningLight={$warning_light}
              dangerLight={$danger_light}
            />
          </Col> */}
          {/* <Col lg="4" md="12">
            <SessionByDevice
              primary={$primary}
              warning={$warning}
              danger={$danger}
              primaryLight={$primary_light}
              warningLight={$warning_light} 
              dangerLight={$danger_light}
            />
          </Col> */}
        </Row>
        <Card>
          <div style={{ textAlign: "end" }}>
            <Edit
              // onClick={this.handleTogglemodal}
              color="red"
              style={{ cursor: "pointer" }}
              size={18}
              className=""
            />
          </div>
          <CardBody
            className="LowStockcssheight"
            style={{
              borderRadius: "30px",
            }}>
            <Row>
              <Col lg="4" md="4">
                <div className="">
                  <div>
                    <h3
                      className="mb-1 text-center  text-bold-600"
                      style={{
                        textDecoration: "underline",
                        textDecorationColor: "red",
                      }}>
                      HRM
                    </h3>
                  </div>

                  <h5 className="mb-0 pb-1">Total Absend</h5>
                  <h5 className="mb-0 pb-1">Total Present</h5>
                  <h5 className="mb-0 pb-1">Total Salary Paid</h5>
                  <h5 className="mb-0 pb-1">Currrent Salary</h5>
                  <h5 className="mb-0 pb-1">Vacancy</h5>
                  <h5 className="mb-0 pb-1">Designation</h5>
                </div>
              </Col>
              <Col lg="4" md="4"></Col>
              <Col lg="4" md="4"></Col>
            </Row>
          </CardBody>
        </Card>
        <Modal
          isOpen={this.state.modal}
          toggle={this.LookupviewStart}
          className={this.props.className}
          style={{ maxWidth: "1050px" }}>
          <ModalHeader toggle={this.LookupviewStart}>
            Dahboard Card Fileds
          </ModalHeader>
          <ModalBody className="modalbodyhead">
            <div className="d-flex justify-content-center mb-1">
              <h4>Edit Dashboard Data</h4>
            </div>

            <Row>
              <Col>
                {this.state.basicList &&
                  this.state.basicList?.map((ele, i) => (
                    <div key={i}>
                      <div>
                        <Input
                          checked={ele?.Show}
                          type="checkbox"
                          className="mx-1 p-2"
                          onChange={(e) => this.hanldeSetBox(e, ele, i)}
                        />
                      </div>
                      <div>
                        <h4 className="item mx-3">{ele?.Name}</h4>
                      </div>
                    </div>
                  ))}

                <div className="d-flex justify-content-center">
                  <Button color="primary" onClick={this.handleSubmitBottomData}>
                    Submit
                  </Button>
                </div>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
      </React.Fragment>
    );
  }
}

export default EcommerceDashboard;
