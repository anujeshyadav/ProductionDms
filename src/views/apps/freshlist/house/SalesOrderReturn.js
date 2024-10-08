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
  Spinner,
  Label,
  Table,
  Badge,
} from "reactstrap";

import { ContextLayout } from "../../../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";

import "jspdf-autotable";

import { Eye, ChevronDown } from "react-feather";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import "../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../../../assets/scss/pages/users.scss";
import { ImDownload } from "react-icons/im";
import {
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaFilter,
} from "react-icons/fa";

import { SalesReturnProductList } from "../../../../ApiEndPoint/ApiCalling";
import {
  BsFillArrowDownSquareFill,
  BsFillArrowUpSquareFill,
} from "react-icons/bs";

import UserContext from "../../../../context/Context";
import SalesReturnView from "./SalesReturnView";
import { CheckPermission } from "./CheckPermission";
import SuperAdminUI from "../../../SuperAdminUi/SuperAdminUI";
import {
  convertDataCSVtoExcel,
  convertDataCsvToXml,
  exportDataToExcel,
  exportDataToPDF,
} from "./Downloader";

const SelectedColums = [];

class SalesOrderReturn extends React.Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.gridRef = React.createRef();
    this.gridApi = null;
    this.state = {
      isOpen: false,
      Arrindex: "",
      MasterShow: false,
      rowData: [],
      userName: "",
      modal: false,
      InsiderPermissions: {},
      modalone: false,
      ViewData: {},
      setMySelectedarr: [],
      SelectedCols: [],
      paginationPageSize: 15,
      currenPageSize: "",
      getPageSize: "",
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
          width: 55,
          filter: true,
        },

        {
          headerName: "Actions",
          field: "transactions",
          width: 70,
          cellRendererFramework: (params) => {
            return (
              <div className="actions cursor-pointer text-center">
                {this.state.InsiderPermissions &&
                  this.state.InsiderPermissions?.View && (
                    <Eye
                      className="mr-50"
                      size="20px"
                      color="green"
                      onClick={() => {
                        this.toggleModal();
                        this.setState({ ViewOneData: params?.data });
                      }}
                    />
                  )}
              </div>
            );
          },
        },

        {
          headerName: "Return SGST",
          field: "sgstTotal",
          filter: true,
          width: 105,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params.data?.sgstTotal}</span>
              </div>
            );
          },
        },
        {
          headerName: "Return CGST",
          field: "cgstTotal",
          filter: true,
          width: 105,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params.data?.cgstTotal}</span>
              </div>
            );
          },
        },
        {
          headerName: "Return IGST",
          field: "igstTotal",
          filter: true,
          width: 105,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params.data?.igstTotal}</span>
              </div>
            );
          },
        },
        {
          headerName: "Return Amount",
          field: "Return_amount",
          filter: true,
          width: 130,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params.data?.Return_amount}</span>
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
              <div className="cursor-pointer text-center">
                <div>
                
                    {params.data?.partyId?.ownerName}
                 
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
          width: 210,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <div>
                  <span>{`${params?.data?.orderId?.fullName}`}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Company Pan No",
          field: "partyId.comPanNo",
          filter: true,
          width: 140,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <div>
                  <span>{params.data?.partyId?.comPanNo}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Party Limit",
          field: "partyId.limit",
          filter: true,
          width: 100,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <div>
                  <span>{params.data?.partyId?.limit}</span>
                </div>
              </div>
            );
          },
        },

        {
          headerName: "IGST ",
          field: "orderId.igstTotal",
          filter: true,
          width: 100,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <div>
                  
                    {params.data?.orderId?.igstTotal &&
                      params.data?.orderId?.igstTotal}
                
                </div>
              </div>
            );
          },
        },
        {
          headerName: "SGST Total",
          field: "orderId.sgstTotal",
          filter: true,
          width: 100,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <div>
                 
                    {params.data?.orderId?.sgstTotal &&
                      params.data?.orderId?.sgstTotal}
               
                </div>
              </div>
            );
          },
        },

        {
          headerName: "CGST  ",
          field: "orderId.cgstTotal",
          filter: true,
          width: 100,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
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
          width: 100,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <div>
                  {params.data?.orderId?.amount} 
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Round Off",
          field: "orderId.roundOff",
          filter: true,
          width: 100,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <div>
                
                    {params.data?.orderId?.roundOff}
                
                </div>
              </div>
            );
          },
        },

        {
          headerName: "Grand Total",
          field: "orderId.grandTotal",
          filter: true,
          width: 105,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <div>
              
                    {params.data?.orderId?.grandTotal}
               
                </div>
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
  };
  LookupviewStart = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };

  async Apicalling(id, db) {
    this.setState({ Loading: true });
    await SalesReturnProductList(id, db)
      .then((res) => {
        console.log(res);
        this.setState({ Loading: false });
        this.setState({ rowData: res?.SalesReturn.reverse() });
        this.setState({ AllcolumnDefs: this.state.columnDefs });
        this.setState({ SelectedCols: this.state.columnDefs });

        let userHeading = JSON.parse(localStorage.getItem("SalesOrderReturn"));
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
    const UserInformation = this.context?.UserInformatio;
    const InsidePermissions = CheckPermission("Sales Return");

    let pageparmission = JSON.parse(localStorage.getItem("userData"));

    if (pageparmission?.rolename?.roleName === "MASTER") {
      this.setState({ MasterShow: true });
    }
    await this.Apicalling(pageparmission?._id, pageparmission?.database);

    this.setState({ InsiderPermissions: InsidePermissions });
  }

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
    await exportDataToPDF(csvData, "SalesOrderReturnList");
  };
  processCell = (params) => {
    return params.value;
  };

  exportToExcel = async (e) => {
    const CsvData = this.gridApi.getDataAsCsv({
      processCellCallback: this.processCell,
    });
    await exportDataToExcel(CsvData, "SalesOrderReturnList");
  };

  convertCSVtoExcel = async () => {
    const CsvData = this.gridApi.getDataAsCsv({
      processCellCallback: this.processCell,
    });
    await convertDataCSVtoExcel(CsvData, "SalesOrderReturnList");
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
    await convertDataCsvToXml(CsvData, "SalesOrderReturnList");
  };

  HandleSetVisibleField = (e) => {
    e.preventDefault();

    this.gridApi.setColumnDefs(this.state.SelectedcolumnDefs);
    this.setState({ columnDefs: this.state.SelectedcolumnDefs });
    this.setState({ SelectedcolumnDefs: this.state.SelectedcolumnDefs });
    this.setState({ rowData: this.state.rowData });
    localStorage.setItem(
      "SalesOrderReturn",
      JSON.stringify(this.state.SelectedcolumnDefs)
    );
    this.LookupviewStart();
  };
  toggleDropdown = () => {
    this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
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
      SelectedCols,
      InsiderPermissions,
      AllcolumnDefs,
    } = this.state;
    return (
      <>
        <div className="app-user-list">
          {this.state.EditOneUserView && this.state.EditOneUserView ? (
            <Row className="card">
              <Col>
                <div className="d-flex justify-content-end p-1">
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      this.setState({ EditOneUserView: false });
                    }}
                    color="danger">
                    Back
                  </Button>
                </div>
              </Col>

              {/* <EditAccount EditOneData={this.state.EditOneData} /> */}
            </Row>
          ) : (
            <>
              {this.state.ViewOneUserView && this.state.ViewOneUserView ? (
                <>
                  <Row className="card">
                    <Col>
                      <div className="d-flex justify-content-end p-1">
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            this.setState({ ViewOneUserView: false });
                          }}
                          color="danger">
                          Back
                        </Button>
                      </div>
                    </Col>
                    <SalesReturnView ViewOneData={this.state.ViewOneData} />
                  </Row>
                </>
              ) : (
                <>
                  <Card>
                    <Row
                      style={{
                        marginLeft: "3px",
                        marginRight: "3px",
                         
                      }}>
                      <Col style={{ marginTop:"25px" }}>
                        <h2
                          className="float-left"
                          style={{ fontWeight: "600" ,textTransform:'uppercase', fontSize:'22px' }}>
                          Sales Return List
                        </h2>
                      </Col>

                      {this.state.MasterShow ? (
                        <Col
                          lg="3"
                          md="4"
                          sm="12"
                          style={{ marginTop:"25px" }}>
                          <SuperAdminUI
                            onDropdownChange={this.handleDropdownChange}
                            onSubmit={this.handleParentSubmit}
                          />
                        </Col>
                      ) : (
                        <Col></Col>
                      )}
                      <Col lg="3" md="6" sm="12" style={{ marginTop:"25px" }}>
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

                      <Col style={{ marginTop:"25px" }} lg="1">
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
                                onClick={this.toggleDropdown}
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
                          <div className="ag-theme-material w-100 ag-grid-table">
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
                                 pagination={true}
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
                  <Badge
                    style={{ cursor: "pointer" }}
                    className=""
                    color="primary"
                    onClick={this.HandleSetVisibleField}>
                    Submit
                  </Badge>
                </div>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
        <Modal
          isOpen={this.state.modalone}
          toggle={this.toggleModal}
          className="modal-dialog modal-xl"
          // className="modal-dialog modal-lg"
          size="lg"
          backdrop={true}
          fullscreen={true}>
          <ModalHeader toggle={this.toggleModal}>View Details</ModalHeader>
          <ModalBody className="myproducttable">
            <Row className="p-2">
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
                    this.state.ViewOneData?.partyId?.email}
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
              {/* {this.state.ViewOneData?.orderId?.otherCharges && (
                <Col>
                  <Label>otherCharges :</Label>
                  <h5>
                    <strong>
                      {this.state.ViewOneData &&
                        this.state.ViewOneData?.orderId?.otherCharges}{" "}
                    </strong>
                  </h5>
                </Col>
              )} */}
              <Col>
                <Label>Amount:</Label>
                <h5>
                  <strong>
                    {this.state.ViewOneData?.amount &&
                      this.state.ViewOneData?.amount}
                  </strong>
                  Rs/-
                </h5>
              </Col>

              {this.state.ViewOneData?.igstTaxType &&
              this.state.ViewOneData?.igstTaxType == 1 ? (
                <>
                  <Col>
                    <Label>IGST:</Label>
                    <h5>
                      <strong>
                        {this.state.ViewOneData?.igstTotal &&
                          this.state.ViewOneData?.igstTotal}
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
                          this.state.ViewOneData?.sgstTotal}
                      </strong>
                      Rs/-
                    </h5>
                  </Col>
                  <Col>
                    <Label>CGST:</Label>
                    <h5>
                      <strong>
                        {this.state.ViewOneData &&
                          this.state.ViewOneData?.cgstTotal}
                      </strong>
                      Rs/-
                    </h5>
                  </Col>
                </>
              )}
              <Col>
                <Label>Return Total :</Label>
                <h5>
                  <strong>
                    {this.state.ViewOneData &&
                      this.state.ViewOneData?.Return_amount}{" "}
                  </strong>
                  Rs/-
                </h5>
              </Col>
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
                      {/* <th>Unit</th> */}
                      <th>TAXABLE</th>
                      {this.state.ViewOneData?.orderId?.igstTaxType &&
                      this.state.ViewOneData?.orderId?.igstTaxType == 1 ? (
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
                    {this.state.ViewOneData?.returnItems?.length > 0 &&
                      this.state.ViewOneData?.returnItems.map((ele, i) => (
                        <>
                          <tr>
                            <th scope="row">{i + 1}</th>
                            <td>{ele?.productId?.Product_Title}</td>
                            <td>{ele?.productId?.HSN_Code}</td>
                            <td>{ele?.productId?.Product_MRP}</td>
                            {/* <td>{ele?.Size}</td> */}
                            <td>{ele?.qtyReturn}</td>
                            {/* <td>{ele?.unitType}</td> */}
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
                      ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
      </>
    );
  }
}
export default SalesOrderReturn;
