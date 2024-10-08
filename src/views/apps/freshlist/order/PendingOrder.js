import React from "react";

import {
  Card,
  CardBody,
  Input,
  Row,
  Modal,
  Col,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Button,
  ModalHeader,
  ModalBody,
  Table,
  Label,
  CustomInput,
  Badge,
  Spinner,
} from "reactstrap";
import OtpInput from "react-otp-input";
import { ImDownload } from "react-icons/im";
import { ContextLayout } from "../../../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import PendingView from "../order/Pending";
import "jspdf-autotable";

import { Eye, ChevronDown } from "react-feather";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import "../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../../../assets/scss/pages/users.scss";

import {
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaFilter,
} from "react-icons/fa";
import swal from "sweetalert";
import {
  DeliveryBoyAssignedList,
  Goods_DeliveryOTP,
  Goods_DeliveryOTP_Auth,
} from "../../../../ApiEndPoint/ApiCalling";
import {
  BsFillArrowDownSquareFill,
  BsFillArrowUpSquareFill,
} from "react-icons/bs";
import UserContext from "../../../../context/Context";
import { CheckPermission } from "../house/CheckPermission";
import SuperAdminUI from "../../../SuperAdminUi/SuperAdminUI";
import {
  convertDataCSVtoExcel,
  convertDataCsvToXml,
  exportDataToExcel,
  exportDataToPDF,
} from "../house/Downloader";

const SelectedColums = [];

class PendingOrder extends React.Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.gridRef = React.createRef();
    this.gridApi = null;
    this.state = {
      isOpen: false,
      OtpScreen: false,
      MasterShow: false,
      Arrindex: "",
      emailotp: "",
      CancelReason: "",
      Delivery_Status: "",
      rowData: [],
      modal: false,
      modalone: false,
      InsiderPermissions: {},
      ViewOneData: {},
      ViewData: {},
      setMySelectedarr: [],
      SelectedCols: [],
      paginationPageSize: 5,
      currenPageSize: "",
      getPageSize: "",
      // columnDefs: [],
      AllcolumnDefs: [],
      SelectedcolumnDefs: [],
      defaultColDef: {
        sortable: true,
        enablePivot: true,
        enableValue: true,
        resizable: true,
        suppressMenu: true,
      },
      columnDefs: [
        {
          headerName: "UID",
          valueGetter: "node.rowIndex + 1",
          field: "node.rowIndex + 1",
          // checkboxSelection: true,
          width: 80,
          filter: true,
        },
        {
          headerName: "Actions",
          field: "transactions",
          width: 95,
          cellRendererFramework: (params) => {
            return (
              <div className="text-center cursor-pointer">
                {this.state.InsiderPermissions &&
                  this.state.InsiderPermissions?.View && (
                    <span
                      style={{
                        border: "1px solid white",
                        padding: "10px",
                        borderRadius: "30px",
                        backgroundColor: "#39cccc",
                        cursor: "pointer",
                      }}>
                      <Eye
                        className=""
                        size="20px"
                        color="white"
                        onClick={() => {
                          this.setState({ ViewOneData: params?.data });
                          this.toggleModal();
                        }}
                      />
                    </span>
                  )}
                {/* {this.state.InsiderPermissions &&
                  this.state.InsiderPermissions?.Edit && (
                    <span
                      style={{
                        border: "1px solid white",
                        padding: "10px",
                        borderRadius: "30px",
                        backgroundColor: "rgb(212, 111, 16)",
                        marginLeft: "3px",
                         cursor:"pointer"
                      }}
                    >
                      <FaPencilAlt
                        className=""
                        size="20px"
                        color="white"
                        onClick={() => {
                          this.handleChangeEdit(params?.data, "Editable");
                        }}
                      />
                    </span>
                  )} */}
              </div>
            );
          },
        },
        {
          headerName: "Status",
          field: "status",
          filter: true,
          width: 95,
          cellRendererFramework: (params) => {
            return params.data?.status === "Completed" ? (
              <div className="text-center cursor-pointer ">
                {params.data.status}
              </div>
            ) : params.data?.status === "InProcess" ? (
              <div className="text-center cursor-pointer">
                {params.data.status}
              </div>
            ) : params.data?.status === "Cancelled" ? (
              <div className="text-center cursor-pointer">
                {params.data.status}
              </div>
            ) : null;
          },
        },
        {
          headerName: "Order Creation Date",
          field: "createdAt",
          filter: true,
          resizable: true,
          width: 198,
          cellRendererFramework: (params) => {
            console.log(params?.data);
            return (
              <div className="text-center cursor-pointer">
                <div>
                  <span>{params.data?.createdAt?.split("T")[0]}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Owner Name",
          field: "partyId.ownerName",
          filter: true,
          width: 220,
          cellRendererFramework: (params) => {
            return (
              <div className="text-center cursor-pointer">
                <div>
                  <span>{params.data?.partyId?.ownerName}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Full Name",
          field: "orderId.fullName",
          filter: true,
          resizable: true,
          width: 165,
          cellRendererFramework: (params) => {
            return (
              <div className="text-center cursor-pointer">
                <div>
                  <span>{`${params?.data?.orderId?.fullName}`}</span>
                </div>
              </div>
            );
          },
        },

        {
          headerName: "Company Pan Number",
          field: "partyId.comPanNo",
          filter: true,
          width: 218,
          cellRendererFramework: (params) => {
            return (
              <div className="text-center cursor-pointer">
                <div>
                  <span>{params.data?.partyId?.comPanNo}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Transposrter",
          field: "partyId.assignTransporter",
          filter: true,
          width: 138,
          cellRendererFramework: (params) => {
            return (
              <div className="text-center cursor-pointer">
                <div>
                  {params.data?.partyId?.transporterDetail == 1
                    ? "Available"
                    : "Not Available"}
                </div>
              </div>
            );
          },
        },

        {
          headerName: "Party Name",
          field: "partyId?.CompanyName",
          filter: true,
          width: 180,
          cellRendererFramework: (params) => {
            return (
              <div className="d-flex align-items-center cursor-pointer">
                <div>
                  <span>{params.data?.partyId?.CompanyName}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Party Limit",
          field: "partyId.limit",
          filter: true,
          width: 180,
          cellRendererFramework: (params) => {
            return (
              <div className="text-center cursor-pointer">
                <div>
                  <span>{params.data?.partyId?.limit}</span>
                </div>
              </div>
            );
          },
        },

        ,
        // {
        //   headerName: "Transposrter",
        //   field: "partyId.assignTransporter",
        //   filter: true,
        //   width: 200,
        //   cellRendererFramework: (params) => {
        //     return (
        //       <div className="d-flex align-items-center cursor-pointer">
        //         <div>
        //           <Badge
        //             onClick={(e)=>{}}
        //             color="primary">
        //             {params.data?.partyId?.transporterDetail == 1
        //               ? "Available"
        //               : "Not Available"}
        //           </Badge>
        //         </div>
        //       </div>
        //     );
        //   },
        // }

        {
          headerName: "IGST ",
          field: "orderId.igstTotal",
          filter: true,
          width: 140,
          cellRendererFramework: (params) => {
            return (
              <div className="text-center cursor-pointer">
                <div>
                  {params.data?.orderId?.igstTotal &&
                    params.data?.orderId?.igstTotal}
                </div>
              </div>
            );
          },
        },
        {
          headerName: "SGST ",
          field: "orderId.sgstTotal",
          filter: true,
          width: 140,
          cellRendererFramework: (params) => {
            return (
              <div className="text-center cursor-pointer">
                <div>
                  {params.data?.orderId?.sgstTotal &&
                    params.data?.orderId?.sgstTotal}
                </div>
              </div>
            );
          },
        },
        {
          headerName: "CGST ",
          field: "orderId.cgstTotal",
          filter: true,
          width: 140,
          cellRendererFramework: (params) => {
            return (
              <div className="text-center cursor-pointer">
                <div>
                  {params.data?.orderId?.cgstTotal &&
                    params.data?.orderId?.cgstTotal}
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Amount",
          field: "orderId.amount",
          filter: true,
          width: 140,
          cellRendererFramework: (params) => {
            return (
              <div className="text-center cursor-pointer">
                <div>{params.data?.orderId?.amount}</div>
              </div>
            );
          },
        },
        {
          headerName: "Round Off",
          field: "orderId.roundOff",
          filter: true,
          width: 120,
          cellRendererFramework: (params) => {
            return (
              <div className="text-center cursor-pointer">
                <div>{params.data?.orderId?.roundOff}</div>
              </div>
            );
          },
        },
        {
          headerName: "Grand Total",
          field: "orderId.grandTotal",
          filter: true,
          width: 140,
          cellRendererFramework: (params) => {
            return (
              <div className="text-center cursor-pointer">
                <div>{params.data?.orderId?.grandTotal}</div>
              </div>
            );
          },
        },
      ],
    };
  }
  toggleModal = () => {
    this.setState((prevState) => ({
      modalone: !prevState.modalone,
    }));
    this.setState({ OtpScreen: false });
    this.componentDidMount();
  };
  LookupviewStart = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };
  HandleStatusChange = async (e) => {
    e.preventDefault();
    console.log(this.state.Delivery_Status);
    await Goods_DeliveryOTP(this.state.ViewOneData?.partyId?._id)
      .then((res) => {
        console.log(res);
        swal("success", "OTP Sent Successfully To Your Registered email id");
        this.setState({ OtpScreen: true });
      })
      .catch((err) => {
        console.log(err);
      });
    // if (this.state.Delivery_Status == "Completed") {
    //   console.log(this.state.ViewOneData);
    //   await Goods_DeliveryOTP(this.state.ViewOneData?.userId?._id)
    //     .then((res) => {
    //       console.log(res);
    //       swal("success", "OTP Send Successfully To your Registered Mail");
    //       this.setState({ OtpScreen: true });
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // } else {
    //   if (this.state.CancelReason) {
    //     // console.log(this.state.CancelReason);
    //     // let payload = {
    //     //   userId: this.state.ViewOneData?.userId?._id,
    //     //   orderId: "",
    //     //   status: this.state.Delivery_Status,
    //     //   otp: Number(this.state.emailotp),
    //     //   reason: this.state.CancelReason,
    //     // };
    //     // await Goods_DeliveryOTP_Auth(this.state.ViewOneData?._id, payload)
    //       // .then((res) => {
    //       //   console.log(res);
    //       // })
    //       // .catch((err) => {
    //       //   console.log(err);
    //       // });

    //     }
    // }
  };
  handleSubmitOTP = async (e) => {
    e.preventDefault();
    let payload = {
      userId: this.state.ViewOneData?.userId?._id,
      orderId: this.state.ViewOneData?.orderId,
      partyId: this.state.ViewOneData?.partyId,
      status: this.state.Delivery_Status,
      otp: Number(this.state.emailotp),
      paymentMode: `${this.state.PayMode ? this.state.PayMode : "Cancelled"}`,
      reason: `${
        this.state.CancelReason ? this.state.CancelReason : "Delivered"
      }`,
    };
    await Goods_DeliveryOTP_Auth(this.state.ViewOneData?._id, payload)
      .then((res) => {
        console.log(res);
        this.toggleModal();
        swal("Submittted Successfully");
      })
      .catch((err) => {
        console.log(err);
        swal("Please Enter Correct OTP");
      });
  };

  async Apicalling(id, db) {
    this.setState({ Loading: true });
    await DeliveryBoyAssignedList(id, db)
      .then((res) => {
        this.setState({ Loading: false });

        console.log(res?.OrderList);
        let showdata = res?.OrderList?.filter(
          (ele) =>
            
            ele?.status?.toLowerCase() !== "cancelled"
        );
        //  console.log(showdata);
        this.setState({ rowData: showdata?.reverse() });
        this.setState({ AllcolumnDefs: this.state.columnDefs });
        this.setState({ SelectedCols: this.state.columnDefs });

        let userHeading = JSON.parse(localStorage.getItem("PendingOrderList"));
        if (userHeading?.length) {
          this.setState({ columnDefs: userHeading });
          // this.gridApi.setColumnDefs(userHeading);
          this.setState({ SelectedcolumnDefs: userHeading });
        } else {
          this.setState({ columnDefs: this.state.columnDefs });
          this.setState({ SelectedcolumnDefs: this.state.columnDefs });
        }
      })
      .catch((err) => {
        this.setState({ Loading: false });
        this.setState({ rowData: [] });

        console.log(err);
      });
  }
  async componentDidMount() {
    const InsidePermissions = CheckPermission("Pending Order");
    // console.log(InsidePermissions);
    this.setState({ InsiderPermissions: InsidePermissions });
    const userId = JSON.parse(localStorage.getItem("userData"));
    if (userId?.rolename?.roleName === "MASTER") {
      this.setState({ MasterShow: true });
    }

    await this.Apicalling(userId?._id, userId?.database);

    // await DeliveryBoyAssignedList(userId?._id,userId?.database)
    //   .then((res) => {
    //     console.log(res?.OrderList);
    //     let showdata = res?.OrderList?.filter(
    //       (ele) =>
    //         ele?.status?.toLowerCase() !== "completed" &&
    //         ele?.status?.toLowerCase() !== "cancelled"
    //     );
    //     console.log(showdata);
    //     this.setState({ rowData: showdata });
    //     this.setState({ AllcolumnDefs: this.state.columnDefs });
    //     this.setState({ SelectedCols: this.state.columnDefs });

    //     let userHeading = JSON.parse(localStorage.getItem("PendingOrderList"));
    //     if (userHeading?.length) {
    //       this.setState({ columnDefs: userHeading });
    //       // this.gridApi.setColumnDefs(userHeading);
    //       this.setState({ SelectedcolumnDefs: userHeading });
    //     } else {
    //       this.setState({ columnDefs: this.state.columnDefs });
    //       this.setState({ SelectedcolumnDefs: this.state.columnDefs });
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }
  toggleDropdown = () => {
    this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
  };

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridRef.current = params.api;

    this.setState({
      currenPageSize: this.gridApi.paginationGetCurrentPage() + 1,
      getPageSize: this.gridApi.paginationGetPageSize(),
      totalPages: this.gridApi.paginationGetTotalPages(),
    });
  };

  updateSearchQuery = (val) => {
    this.gridApi.setQuickFilter(val);
  };

  filterSize = (val) => {
    if (this.gridApi) {
      this.gridApi.paginationSetPageSize(Number(val));
      this.setState({
        currenPageSize: val,
        getPageSize: val,
      });
    }
  };
  handleChangeHeader = (e, value, index) => {
    let check = e.target.checked;
    if (check) {
      SelectedColums?.push(value);
    } else {
      const delindex = SelectedColums?.findIndex(
        (ele) => ele?.headerName === value?.headerName
      );

      SelectedColums?.splice(delindex, 1);
    }
  };

  exportToPDF = async () => {
    const csvData = this.gridApi.getDataAsCsv({
      processCellCallback: this.processCell,
    });
    await exportDataToPDF(csvData, "PendingOrder");
  };
  processCell = (params) => {
    return params.value;
  };

  exportToExcel = async (e) => {
    const CsvData = this.gridApi.getDataAsCsv({
      processCellCallback: this.processCell,
    });
    await exportDataToExcel(CsvData, "PendingOrder");
  };

  convertCSVtoExcel = async () => {
    const CsvData = this.gridApi.getDataAsCsv({
      processCellCallback: this.processCell,
    });
    await convertDataCSVtoExcel(CsvData, "PendingOrder");
  };

  shiftElementUp = () => {
    let currentIndex = this.state.Arrindex;
    if (currentIndex > 0) {
      const myArrayCopy = [...this.state.SelectedcolumnDefs];
      const elementToMove = myArrayCopy.splice(currentIndex, 1)[0];
      this.setState({ Arrindex: currentIndex - 1 });
      myArrayCopy.splice(currentIndex - 1, 0, elementToMove);
      this.setState({ SelectedcolumnDefs: myArrayCopy });
    }
  };

  shiftElementDown = () => {
    let currentIndex = this.state.Arrindex;
    if (currentIndex < this.state.SelectedcolumnDefs.length - 1) {
      const myArrayCopy = [...this.state.SelectedcolumnDefs];
      const elementToMove = myArrayCopy.splice(currentIndex, 1)[0];
      this.setState({ Arrindex: currentIndex + 1 });
      myArrayCopy.splice(currentIndex + 1, 0, elementToMove);
      this.setState({ SelectedcolumnDefs: myArrayCopy });
    }
  };
  convertCsvToXml = async () => {
    const CsvData = this.gridApi.getDataAsCsv({
      processCellCallback: this.processCell,
    });
    await convertDataCsvToXml(CsvData, "PendingOrder");
  };

  HandleSetVisibleField = (e) => {
    e.preventDefault();

    this.gridApi.setColumnDefs(this.state.SelectedcolumnDefs);
    this.setState({ columnDefs: this.state.SelectedcolumnDefs });
    this.setState({ SelectedcolumnDefs: this.state.SelectedcolumnDefs });
    this.setState({ rowData: this.state.rowData });
    localStorage.setItem(
      "PendingOrderList",
      JSON.stringify(this.state.SelectedcolumnDefs)
    );
    this.LookupviewStart();
  };

  HeadingRightShift = () => {
    const updatedSelectedColumnDefs = [
      ...new Set([
        ...this.state.SelectedcolumnDefs.map((item) => JSON.stringify(item)),
        ...SelectedColums.map((item) => JSON.stringify(item)),
      ]),
    ].map((item) => JSON.parse(item));
    this.setState({
      SelectedcolumnDefs: [...new Set(updatedSelectedColumnDefs)], // Update the state with the combined array
    });
  };
  handleLeftShift = () => {
    let SelectedCols = this.state.SelectedcolumnDefs?.slice();
    let delindex = this.state.Arrindex; /* Your delete index here */

    if (SelectedCols && delindex >= 0) {
      const splicedElement = SelectedCols?.splice(delindex, 1); // Remove the element

      this.setState({
        SelectedcolumnDefs: SelectedCols, // Update the state with the modified array
      });
    }
  };
  handleParentSubmit = (e) => {
    e.preventDefault();
    let SuperAdmin = JSON.parse(localStorage.getItem("SuperadminIdByMaster"));
    let id = SuperAdmin.split(" ")[0];
    let db = SuperAdmin.split(" ")[1];
    this.Apicalling(id, db);
  };
  handleDropdownChange = (selectedValue) => {
    localStorage.setItem("SuperadminIdByMaster", JSON.stringify(selectedValue));
  };
  render() {
    if (this.state.Loading) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20rem",
          }}>
          <Spinner
            style={{
              height: "4rem",
              width: "4rem",
            }}
            color="primary">
            Loading...
          </Spinner>
        </div>
      );
    }
    const {
      rowData,
      columnDefs,
      defaultColDef,
      SelectedcolumnDefs,
      isOpen,
      InsiderPermissions,
      SelectedCols,
      AllcolumnDefs,
    } = this.state;
    return (
      <>
        <div className="app-user-list">
          {this.state.EditOneUserView && this.state.EditOneUserView ? (
            <></>
          ) : (
            <>
              {this.state.ViewOneUserView && this.state.ViewOneUserView ? (
                <></>
              ) : (
                <>
                  <Card>
                    <Row
                      style={{
                        marginLeft: "5px",
                        marginRight: "5px",
                        marginTop: "10px",
                      }}>
                      <Col style={{ marginTop: "10px" }}>
                        <h2
                          className="float-left"
                          style={{ fontWeight: "600" }}>
                          Sales Pending List
                        </h2>
                      </Col>
                      {this.state.MasterShow ? (
                        <Col
                          lg="3"
                          md="4"
                          sm="12"
                          style={{ marginTop: "10px" }}>
                          <SuperAdminUI
                            onDropdownChange={this.handleDropdownChange}
                            onSubmit={this.handleParentSubmit}
                          />
                        </Col>
                      ) : (
                        <Col></Col>
                      )}

                      <Col lg="3" md="6" sm="12" style={{ marginTop: "10px" }}>
                        <div className="">
                          {/* <UncontrolledDropdown className="p-1 ag-dropdown">
                              <DropdownToggle tag="div">
                                {this.gridApi
                                  ? this.state.currenPageSize
                                  : "" * this.state.getPageSize -
                                    (this.state.getPageSize - 1)}{" "}
                                -{" "}
                                {this.state.rowData.length -
                                  this.state.currenPageSize *
                                    this.state.getPageSize >
                                0
                                  ? this.state.currenPageSize *
                                    this.state.getPageSize
                                  : this.state.rowData.length}{" "}
                                of {this.state.rowData.length}
                                <ChevronDown className="ml-50" size={15} />
                              </DropdownToggle>
                              <DropdownMenu right>
                                <DropdownItem
                                  tag="div"
                                  onClick={() => this.filterSize(10)}>
                                  10
                                </DropdownItem>
                                <DropdownItem
                                  tag="div"
                                  onClick={() => this.filterSize(20)}>
                                  20
                                </DropdownItem>
                                <DropdownItem
                                  tag="div"
                                  onClick={() => this.filterSize(50)}>
                                  50
                                </DropdownItem>
                                <DropdownItem
                                  tag="div"
                                  onClick={() => this.filterSize(100)}>
                                  100
                                </DropdownItem>
                                <DropdownItem
                                  tag="div"
                                  onClick={() => this.filterSize(134)}>
                                  134
                                </DropdownItem>
                              </DropdownMenu>
                            </UncontrolledDropdown> */}

                          <div className="table-input cssforproductlist">
                            <Input
                              placeholder="search Item here..."
                              onChange={(e) =>
                                this.updateSearchQuery(e.target.value)
                              }
                              value={this.state.value}
                            />
                          </div>
                        </div>
                      </Col>

                      <Col lg="1" style={{ marginTop: "10px" }}>
                        {InsiderPermissions && InsiderPermissions?.View && (
                          <>
                            <span className="">
                              <FaFilter
                                style={{ cursor: "pointer" }}
                                title="filter coloumn"
                                size="35px"
                                onClick={this.LookupviewStart}
                                color="rgb(8, 91, 245)"
                                className="float-right"
                              />
                            </span>
                          </>
                        )}
                        {InsiderPermissions && InsiderPermissions?.Download && (
                          <span
                            onMouseEnter={this.toggleDropdown}
                            onMouseLeave={this.toggleDropdown}
                            className="">
                            <div className="dropdown-container float-right">
                              <ImDownload
                                style={{ cursor: "pointer" }}
                                title="download file"
                                size="35px"
                                className="dropdown-button "
                                color="rgb(8, 91, 245)"
                              />
                              {isOpen && (
                                <div
                                  style={{
                                    position: "absolute",
                                    zIndex: "1",
                                    border: "1px solid rgb(8, 91, 245)",
                                    backgroundColor: "white",
                                  }}
                                  className="dropdown-content dropdownmy">
                                  <h5
                                    onClick={() => this.exportToPDF()}
                                    style={{ cursor: "pointer" }}
                                    className=" mx-1 myactive mt-1">
                                    .PDF
                                  </h5>
                                  <h5
                                    onClick={() =>
                                      this.gridApi.exportDataAsCsv()
                                    }
                                    style={{ cursor: "pointer" }}
                                    className=" mx-1 myactive">
                                    .CSV
                                  </h5>
                                  <h5
                                    onClick={this.convertCSVtoExcel}
                                    style={{ cursor: "pointer" }}
                                    className=" mx-1 myactive">
                                    .XLS
                                  </h5>
                                  <h5
                                    onClick={this.exportToExcel}
                                    style={{ cursor: "pointer" }}
                                    className=" mx-1 myactive">
                                    .XLSX
                                  </h5>
                                  <h5
                                    onClick={() => this.convertCsvToXml()}
                                    style={{ cursor: "pointer" }}
                                    className=" mx-1 myactive">
                                    .XML
                                  </h5>
                                </div>
                              )}
                            </div>
                          </span>
                        )}
                      </Col>
                    </Row>
                    {InsiderPermissions && InsiderPermissions?.View && (
                      <>
                        {this.state.rowData === null ? null : (
                          <div className="ag-theme-material w-100 my-2 ag-grid-table">
                            <ContextLayout.Consumer className="ag-theme-alpine">
                              {(context) => (
                                <AgGridReact
                                  id="myAgGrid"
                                  gridOptions={this.gridOptions}
                                  rowSelection="multiple"
                                  defaultColDef={defaultColDef}
                                  columnDefs={columnDefs}
                                  rowData={rowData}
                                  onGridReady={this.onGridReady}
                                  colResizeDefault={"shift"}
                                  animateRows={true}
                                  floatingFilter={false}
                                  // // pagination={true}
                                  paginationPageSize={
                                    this.state.paginationPageSize
                                  }
                                  pivotPanelShow="always"
                                  enableRtl={context.state.direction === "rtl"}
                                  ref={this.gridRef} // Attach the ref to the grid
                                  domLayout="autoHeight" // Adjust layout as needed
                                />
                              )}
                            </ContextLayout.Consumer>
                          </div>
                        )}
                      </>
                    )}
                  </Card>
                </>
              )}
            </>
          )}
        </div>

        <Modal
          isOpen={this.state.modal}
          toggle={this.LookupviewStart}
          className={this.props.className}
          style={{ maxWidth: "1050px" }}>
          <ModalHeader toggle={this.LookupviewStart}>Change Fileds</ModalHeader>
          <ModalBody className="modalbodyhead">
            <Row>
              <Col lg="4" md="4" sm="12" xl="4" xs="12">
                <h4>Available Columns</h4>
                <div className="mainshffling">
                  <div class="ex1">
                    {AllcolumnDefs &&
                      AllcolumnDefs?.map((ele, i) => {
                        return (
                          <>
                            <div
                              onClick={(e) =>
                                this.handleChangeHeader(e, ele, i)
                              }
                              key={i}
                              className="mycustomtag mt-1">
                              <span className="mt-1">
                                <h5
                                  style={{ cursor: "pointer" }}
                                  className="allfields">
                                  <input
                                    type="checkbox"
                                    // checked={check && check}
                                    className="mx-1"
                                  />

                                  {ele?.headerName}
                                </h5>
                              </span>
                            </div>
                          </>
                        );
                      })}
                  </div>
                </div>
              </Col>
              <Col lg="2" md="2" sm="12" xl="2" xs="12" className="colarrowbtn">
                <div className="mainarrowbtn">
                  <div style={{ cursor: "pointer" }}>
                    <FaArrowAltCircleRight
                      onClick={this.HeadingRightShift}
                      className="arrowassign"
                      size="30px"
                    />
                  </div>
                  <div style={{ cursor: "pointer" }} className="my-2">
                    <FaArrowAltCircleLeft
                      onClick={this.handleLeftShift}
                      className="arrowassign"
                      size="30px"
                    />
                  </div>
                </div>
              </Col>
              <Col lg="6" md="6" sm="12" xl="6" xs="12">
                <Row>
                  <Col lg="8" md="8" sm="12" xs="12">
                    <h4>Visible Columns</h4>
                    <div className="mainshffling">
                      <div class="ex1">
                        {SelectedcolumnDefs &&
                          SelectedcolumnDefs?.map((ele, i) => {
                            return (
                              <>
                                <div key={i} className="mycustomtag mt-1">
                                  <span className="mt-1">
                                    <h5
                                      onClick={() =>
                                        this.setState({ Arrindex: i })
                                      }
                                      style={{
                                        cursor: "pointer",
                                        backgroundColor: `${
                                          this.state.Arrindex === i
                                            ? "#1877f2"
                                            : ""
                                        }`,
                                      }}
                                      className="allfields">
                                      <IoMdRemoveCircleOutline
                                        onClick={() => {
                                          const SelectedCols =
                                            this.state.SelectedcolumnDefs?.slice();
                                          const delindex =
                                            SelectedCols?.findIndex(
                                              (element) =>
                                                element?.headerName ==
                                                ele?.headerName
                                            );

                                          if (SelectedCols && delindex >= 0) {
                                            const splicedElement =
                                              SelectedCols?.splice(delindex, 1); // Remove the element
                                            // splicedElement contains the removed element, if needed

                                            this.setState({
                                              SelectedcolumnDefs: SelectedCols, // Update the state with the modified array
                                            });
                                          }
                                          // const delindex =
                                          //   SelectedCols.findIndex(
                                          //     (element) =>
                                          //       element?.headerName ==
                                          //       ele?.headerName
                                          //   );

                                          // SelectedCols?.splice(delindex, 1);
                                          // this.setState({
                                          //   SelectedcolumnDefs: SelectedCols,
                                          // });
                                        }}
                                        style={{ cursor: "pointer" }}
                                        size="25px"
                                        color="red"
                                        className="mr-1"
                                      />

                                      {ele?.headerName}
                                    </h5>
                                  </span>
                                </div>
                              </>
                            );
                          })}
                      </div>
                    </div>
                  </Col>
                  <Col lg="4" md="4" sm="12" xs="12">
                    <div className="updownbtn justify-content-center">
                      <div>
                        <BsFillArrowUpSquareFill
                          className="arrowassign mb-1"
                          size="30px"
                          onClick={this.shiftElementUp}
                        />
                      </div>
                      <div>
                        <BsFillArrowDownSquareFill
                          onClick={this.shiftElementDown}
                          className="arrowassign"
                          size="30px"
                        />
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="d-flex justify-content-center">
                  <Button onClick={this.HandleSetVisibleField} color="primary">
                    Submit
                  </Button>
                </div>
              </Col>
            </Row>
          </ModalBody>
        </Modal>

        <Modal
          isOpen={this.state.modalone}
          toggle={this.toggleModal}
          className={`${
            this.state.OtpScreen
              ? "modal-dialog modal-sm"
              : "modal-dialog modal-xl"
          }`}
          size="lg"
          backdrop={true}
          fullscreen={true}>
          <ModalHeader toggle={this.toggleModal}>View Details</ModalHeader>
          <ModalBody>
            <div className="p-3">
              {this.state.OtpScreen && this.state.OtpScreen ? (
                <>
                  <div className="d-flex justify-content-center">
                    <h5>
                      <strong>
                        Enter Otp To Mark {this.state.Delivery_Status} Delivery
                      </strong>
                    </h5>
                  </div>
                  <span
                    id="alerts"
                    className="alerts"
                    style={{ color: "red" }}></span>
                  <Row>
                    <Col lg="12" md="12" sm="12">
                      <div className="d-flex justify-content-center">
                        <OtpInput
                          containerStyle="true inputdata"
                          inputStyle="true inputdataone"
                          className="otpinputtype"
                          value={this.state.emailotp}
                          name="emailotp"
                          onChange={(otp) => this.setState({ emailotp: otp })}
                          numInputs={6}
                          renderSeparator={<span>-</span>}
                          renderInput={(props) => (
                            <input className="inputs" {...props} />
                          )}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    {/* <Col lg="6" md="6" sm="6">
                      <div className="d-flex justify-content-center">
                        <Button
                          style={{ cursor: "pointer" }}
                          onClick={(e) => {
                            e.preventDefault();
                            this.setState({ OtpScreen: false });
                          }}
                          color="primary">
                          Back
                        </Button>
                      </div>
                    </Col> */}
                    {this.state.emailotp &&
                      this.state.emailotp?.length == 6 && (
                        <>
                          {this.state.Delivery_Status &&
                            this.state.Delivery_Status == "Completed" && (
                              <Row>
                                <Col
                                  lg="12"
                                  md="12"
                                  sm="12"
                                  className="mb-1 mt-1">
                                  <div className="d-flex justify-content-center">
                                    <Label className="mb-0">
                                      Payment Mode *
                                    </Label>
                                    <div
                                      onChange={(e) =>
                                        this.setState({
                                          PayMode: e.target.value,
                                        })
                                      }
                                      className="form-label-group mt-1">
                                      <input
                                        required
                                        style={{ marginRight: "3px" }}
                                        type="radio"
                                        name="status"
                                        value="Online"
                                      />
                                      <span style={{ marginRight: "20px" }}>
                                        Online
                                      </span>

                                      <input
                                        required
                                        style={{ marginRight: "3px" }}
                                        type="radio"
                                        name="status"
                                        value="Cash"
                                      />
                                      <span style={{ marginRight: "3px" }}>
                                        Cash
                                      </span>
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                            )}
                          <Col lg="12" md="12" sm="12">
                            <div className="d-flex justify-content-center">
                              <Button
                                onClick={this.handleSubmitOTP}
                                color="primary">
                                Submit
                              </Button>
                            </div>
                          </Col>
                        </>
                      )}
                  </Row>
                </>
              ) : (
                <>
                  <Row>
                    <Col>
                      <Label>Customer Name :</Label>
                      <div className="">
                        Name-{" "}
                        <strong>
                          {this.state.ViewOneData &&
                            `${this.state.ViewOneData?.orderId?.fullName}`}
                        </strong>
                      </div>
                      <div className="">
                        Mobile-{" "}
                        {this.state.ViewOneData &&
                          ` ${this.state.ViewOneData?.partyId?.contactNumber}`}
                      </div>
                      <div className="">
                        Email -{" "}
                        {this.state.ViewOneData &&
                          `  ${this.state.ViewOneData?.partyId?.email} `}
                      </div>
                    </Col>
                    <Col>
                      <Label>Date Created :</Label>
                      <h5>
                        {this.state.ViewOneData &&
                          this.state.ViewOneData?.createdAt?.split("T")[0]}
                      </h5>
                    </Col>
                    <Col>
                      <Label>Address :</Label>
                      <h5>
                        <strong>
                          {this.state.ViewOneData &&
                            this.state.ViewOneData?.partyId?.address}{" "}
                        </strong>
                      </h5>
                    </Col>
                    <Col>
                      <Label>Grand Total :</Label>
                      <h5>
                        <strong>
                          {this.state.ViewOneData &&
                            this.state.ViewOneData?.orderId?.grandTotal}{" "}
                        </strong>
                        Rs/-
                      </h5>
                    </Col>
                    {this.state.ViewOneData?.orderId?.igstTaxType &&
                    this.state.ViewOneData?.orderId?.igstTaxType == 1 ? (
                      <>
                        <Col>
                          <Label>IGST:</Label>
                          <h5>
                            <strong>
                              {this.state.ViewOneData?.orderId?.igstTotal &&
                                this.state.ViewOneData?.orderId?.igstTotal}
                            </strong>
                            Rs/-
                          </h5>
                        </Col>
                      </>
                    ) : (
                      <>
                        <Col>
                          <Label>SGST:</Label>
                          <h5>
                            <strong>
                              {this.state.ViewOneData &&
                                this.state.ViewOneData?.orderId?.sgstTotal}
                            </strong>
                            Rs/-
                          </h5>
                        </Col>
                        <Col>
                          <Label>CGST:</Label>
                          <h5>
                            <strong>
                              {this.state.ViewOneData &&
                                this.state.ViewOneData?.orderId?.cgstTotal}
                            </strong>
                            Rs/-
                          </h5>
                        </Col>
                      </>
                    )}
                    {this.state.ViewOneData?.otherCharges && (
                      <Col>
                        <Label>otherCharges :</Label>
                        <h5>
                          <strong>
                            {this.state.ViewOneData &&
                              this.state.ViewOneData?.otherCharges}{" "}
                          </strong>
                        </h5>
                      </Col>
                    )}
                    {InsiderPermissions && InsiderPermissions?.Edit && (
                      <>
                        {}
                        {this.state.ViewOneData &&
                          this.state.ViewOneData?.status == "InProcess" && (
                            <Col>
                              <Label>Change Delivery Status :</Label>
                              <CustomInput
                                onChange={(e) => {
                                  this.setState({
                                    Delivery_Status: e.target.value,
                                  });
                                }}
                                className="form-control"
                                type="select">
                                <option>--select--</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                              </CustomInput>
                              {this.state.Delivery_Status ==
                              "Completed" ? null : (
                                <>
                                  {this.state.Delivery_Status ==
                                    "Cancelled" && (
                                    <Row>
                                      <Col className="mt-1">
                                        <label> Reason for Cancellation</label>
                                        <Input
                                          required
                                          onChange={(e) => {
                                            this.setState({
                                              CancelReason: e.target.value,
                                            });
                                          }}
                                          className="form-control"
                                          type="text"
                                        />
                                      </Col>
                                    </Row>
                                  )}
                                </>
                              )}
                              {this.state.Delivery_Status == "Cancelled" ||
                              this.state.Delivery_Status == "Completed" ? (
                                <Badge
                                  style={{ cursor: "pointer" }}
                                  onClick={this.HandleStatusChange}
                                  className="mt-1"
                                  color="primary">
                                  Submit
                                </Badge>
                              ) : null}
                            </Col>
                          )}
                      </>
                    )}

                    {/* <Col>
                <Label>Download Invoice :</Label>
                <div className="d-flex justify-content-center">
                  <FaDownload
                    onClick={this.handleStockTrxInvoiceShow}
                    color="#00c0e"
                    fill="#00c0e"
                    style={{ cursor: "pointer" }}
                    size={20}
                  />
                </div>
              </Col> */}
                  </Row>
                  <Row className="p-2">
                    <Col>
                      <div className="d-flex justify-content-center">
                        <h4>
                          {" "}
                          <strong>Product Details</strong>
                        </h4>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Table style={{ cursor: "pointer" }} responsive>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Product Name</th>
                            <th>HSN CODE</th>
                            <th>Price</th>
                            {/* <th>Size</th> */}
                            <th>Quantity</th>
                            <th>Unit</th>
                            <th>TAXABLE</th>
                            {this.state.ViewOneData?.igstTaxType &&
                            this.state.ViewOneData?.igstTaxType == 1 ? (
                              <>
                                <th>IGST</th>
                              </>
                            ) : (
                              <>
                                <th>SGST</th>
                                <th>CGST</th>
                              </>
                            )}
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.ViewOneData?.orderItems &&
                            this.state.ViewOneData?.orderItems?.map(
                              (ele, i) => (
                                <>
                                  <tr>
                                    <th scope="row">{i + 1}</th>
                                    <td>{ele?.productId?.Product_Title}</td>
                                    <td>{ele?.productId?.HSN_Code}</td>
                                    <td>{ele?.productId?.Product_MRP}</td>
                                    {/* <td>{ele?.Size}</td> */}
                                    <td>{ele?.qty}</td>
                                    <td>{ele?.primaryUnit}</td>
                                    <td>{ele?.taxableAmount}</td>
                                    {this.state.ViewOneData?.igstTaxType &&
                                    this.state.ViewOneData?.igstTaxType == 1 ? (
                                      <>
                                        <td>{ele?.igstRate}</td>
                                      </>
                                    ) : (
                                      <>
                                        <td>{ele?.sgstRate}</td>
                                        <td>{ele?.cgstRate}</td>
                                      </>
                                    )}
                                    <td>{ele?.grandTotal}</td>
                                  </tr>
                                </>
                              )
                            )}
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                </>
              )}
            </div>
          </ModalBody>
        </Modal>
      </>
    );
  }
}
export default PendingOrder;
