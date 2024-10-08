import React, { useRef } from "react";
import { ImDownload } from "react-icons/im";

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
  Form,
  Label,
  CustomInput,
} from "reactstrap";
import Templatethree from "../../../../../assets/Billtemp/Templatethree.png";
import Templatetwo from "../../../../../assets/Billtemp/Templatetwo.png";
import templatefour from "../../../../../assets/Billtemp/templatefour.png";
import templateone from "../../../../../assets/Billtemp/templateone.png";
import { ContextLayout } from "../../../../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import EditAccount from "../../../freshlist/accounts/EditAccount";
import ViewAccount from "../../../freshlist/accounts/ViewAccount";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Logo from "../../../../../assets/img/profile/pages/logomain.png";
import Papa from "papaparse";
import { Eye, Trash2, ChevronDown, Edit } from "react-feather";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import "../../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../../../../assets/scss/pages/users.scss";
import { Route } from "react-router-dom";

import {
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaFilter,
  FaPencilAlt,
} from "react-icons/fa";
import swal from "sweetalert";

import {
  BsFillArrowDownSquareFill,
  BsFillArrowUpSquareFill,
} from "react-icons/bs";
import * as XLSX from "xlsx";
import UserContext from "../../../../../context/Context";
import { CheckPermission } from "../../house/CheckPermission";
import { Create_CompanyDetails } from "../../../../../ApiEndPoint/ApiCalling";

const SelectedColums = [];

class SettingTab extends React.Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.gridRef = React.createRef();
    this.gridApi = null;
    this.state = {
      isOpen: false,
      modalOne: false,
      Loading: false,
      Arrindex: "",
      rowData: [],
      wareHouseViewOne: [],
      Show: false,
      setMySelectedarr: [],
      SelectedCols: [],
      paginationPageSize: 5,
      InsiderPermissions: {},

      currenPageSize: "",
      getPageSize: "",
      columnDefs: [],
      AllcolumnDefs: [],
      SelectedcolumnDefs: [],
      defaultColDef: {
        sortable: true,
        enablePivot: true,
        enableValue: true,
        resizable: true,
        suppressMenu: true,
      },
    };
  }

  LookupviewStart = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };

  handleChangeEdit = (data, types) => {
    let type = types;
    if (type == "readonly") {
      this.setState({ ViewOneUserView: true });
      this.setState({ ViewOneData: data });
    } else {
      this.setState({ EditOneUserView: true });
      this.setState({ EditOneData: data });
    }
  };

  async componentDidMount() {
    const UserInformation = this.context;
    // console.log(UserInformation?.CompanyDetails);
    if (UserInformation?.CompanyDetails?.BillNumber) {
      let value = UserInformation?.CompanyDetails;
      this.setState({
        logoposition: value?.imagePosition,
        Billtoposition: value?.billTo,
        shipto: value?.shipto,
        BillNumber: value?.BillNumber,
        TermaAndCondition: value?.termsAndCondition,
      });
    }
    const InsidePermissions = CheckPermission("Setting");
    this.setState({ InsiderPermissions: InsidePermissions });
    let userData = JSON.parse(localStorage.getItem("userData"));
  }
  toggleDropdown = () => {
    this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
  };
  toggleModalOne = () => {
    this.setState((prevState) => ({
      modalOne: !prevState.modalOne,
    }));
  };
  toggleModalclose = () => {
    this.setState({ modalOne: false });
    this.setState({ ShowMyBill: false });
  };
  handleBillSet = (i) => {
    this.setState({ BillNumber: i });
    // localStorage.setItem("billnumber", i);
    // this.toggleModalOne();
    // this.setState({ ShowBill: false });
  };
  runthisfunction(id) {
    swal("Warning", "Sure You Want to Delete it", {
      buttons: {
        cancel: "cancel",
        catch: { text: "Delete ", value: "delete" },
      },
    }).then((value) => {
      switch (value) {
        case "delete":
          // DeleteProductWiki(id)
          //   .then((res) => {
          //     let selectedData = this.gridApi.getSelectedRows();
          //     this.gridApi.updateRowData({ remove: selectedData });
          //   })
          //   .catch((err) => {
          //     console.log(err);
          //   });
          break;
        default:
      }
    });
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
  parseCsv(csvData) {
    return new Promise((resolve, reject) => {
      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          if (result.data && result.data.length > 0) {
            resolve(result.data);
          } else {
            reject(new Error("No data found in the CSV"));
          }
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  submitHandler = async (e) => {
    this.setState({ Loading: true });
    e.preventDefault();
    let mychoice = {
      imagePosition: this.state.logoposition,
      billTo: this.state.Billtoposition,
      shipto: this.state.shipto,
      BillNumber: this.state.BillNumber,
    };

    if (mychoice.billTo == mychoice.shipto) {
      swal("Can not set Billto and Shipto on one Same side");
    } else {
      // localStorage.setItem("billUI", JSON.stringify(mychoice));
      this.setState({ ShowMyBill: true });

      //
      let userData = JSON.parse(localStorage.getItem("userData"));
      let formData = new FormData();
      formData.append("created_by", userData?._id);
      formData.append("imagePosition", this.state.logoposition);
      formData.append("billTo", this.state.Billtoposition);
      formData.append("shipto", this.state.shipto);
      formData.append("BillNumber", this.state.BillNumber);
      formData.append("termsAndCondition", this.state.TermaAndCondition);
      debugger;
      await Create_CompanyDetails(formData)
        .then((res) => {
          this.setState({ Loading: false });
          const UserInformation = this.context;
          let value = UserInformation?.CompanyDetails;

          let data = {
            ...value,
            imagePosition: this.state.logoposition,
            billTo: this.state.Billtoposition,
            shipto: this.state.shipto,
            BillNumber: this.state.BillNumber,
          };
          UserInformation?.setCompanyDetails(data);
          this.toggleModalclose();
          swal("success", "Details are Added Successfully", "success");
        })
        .catch((err) => {
          this.setState({ Loading: false });

          console.log(err);
          swal("Error", "Something Went Wrong", "error");
        });

      //
    }
  };
  generatePDF(parsedData) {
    let pdfsize = [Object.keys(parsedData[0])][0].length;
    let size = pdfsize > 15 ? "a1" : pdfsize < 14 > 10 ? "a3" : "a4";

    const doc = new jsPDF("landscape", "mm", size, false);
    doc.setTextColor(5, 87, 97);
    const tableData = parsedData.map((row) => Object.values(row));
    doc.addImage(Logo, "JPEG", 10, 10, 50, 30);
    let date = new Date();
    doc.setCreationDate(date);
    doc.text("UserAccount", 14, 51);
    doc.autoTable({
      head: [Object.keys(parsedData[0])],
      body: tableData,
      startY: 60,
    });

    doc.save("UserList.pdf");
  }

  exportToPDF = async () => {
    const csvData = this.gridApi.getDataAsCsv({
      processCellCallback: this.processCell,
    });
    try {
      const parsedData = await this.parseCsv(csvData);
      this.generatePDF(parsedData);
    } catch (error) {
      console.error("Error parsing CSV:", error);
    }
  };
  processCell = (params) => {
    return params.value;
  };

  convertCsvToExcel(csvData) {
    return new Promise((resolve) => {
      Papa.parse(csvData, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: function (result) {
          const worksheet = XLSX.utils.json_to_sheet(result.data);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
          const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
          });
          const blob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          resolve(blob);
        },
      });
    });
  }
  downloadExcelFile(blob) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Userlist.xlsx";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }

  exportToExcel = async (e) => {
    const CsvData = this.gridApi.getDataAsCsv({
      processCellCallback: this.processCell,
    });
    const blob = await this.convertCsvToExcel(CsvData);
    this.downloadExcelFile(blob);
  };

  convertCSVtoExcel = () => {
    const CsvData = this.gridApi.getDataAsCsv({
      processCellCallback: this.processCell,
    });
    Papa.parse(CsvData, {
      complete: (result) => {
        const ws = XLSX.utils.json_to_sheet(result.data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        const excelType = "xls";
        XLSX.writeFile(wb, `UserList.${excelType}`);
      },
    });
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
  convertCsvToXml = () => {
    const CsvData = this.gridApi.getDataAsCsv({
      processCellCallback: this.processCell,
    });
    Papa.parse(CsvData, {
      complete: (result) => {
        const rows = result.data;

        // Create XML
        let xmlString = "<root>\n";

        rows.forEach((row) => {
          xmlString += "  <row>\n";
          row.forEach((cell, index) => {
            xmlString += `    <field${index + 1}>${cell}</field${index + 1}>\n`;
          });
          xmlString += "  </row>\n";
        });

        xmlString += "</root>";

        // setXmlData(xmlString);

        // Create a download link
        const blob = new Blob([xmlString], { type: "text/xml" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "output.xml";
        link.click();
      },
    });
  };

  HandleSetVisibleField = (e) => {
    e.preventDefault();
    this.gridApi.setColumnDefs(this.state.SelectedcolumnDefs);
    this.setState({ columnDefs: this.state.SelectedcolumnDefs });
    this.setState({ SelectedcolumnDefs: this.state.SelectedcolumnDefs });
    this.setState({ rowData: this.state.rowData });
    localStorage.setItem(
      "WarehouseList",
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
    let SelectedCols = this.state.SelectedcolumnDefs.slice();
    let delindex = this.state.Arrindex; /* Your delete index here */

    if (SelectedCols && delindex >= 0) {
      const splicedElement = SelectedCols.splice(delindex, 1); // Remove the element

      this.setState({
        SelectedcolumnDefs: SelectedCols, // Update the state with the modified array
      });
    }
  };

  handleShowWarehouse = (e) => {
    e.preventDefault();
    if (this.state.warehouse != "NA") {
      console.log(this.state.wareHouseViewOne[0]);
      let selecteddata = this.state.wareHouseViewOne?.filter(
        (ele, i) => ele?._id == this.state.warehouse
      );
      this.setState({ Show: true });
      this.setState({ rowData: selecteddata });
    } else {
      swal("You did not select Any Warehouse");
    }
  };
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    const {
      rowData,
      columnDefs,
      defaultColDef,
      SelectedcolumnDefs,
      isOpen,
      SelectedCols,
      AllcolumnDefs,
      Show,
    } = this.state;
    return (
      <>
        <Row className="app-user-list">
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

              <EditAccount EditOneData={this.state.EditOneData} />
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
                    <ViewAccount ViewOneData={this.state.ViewOneData} />
                  </Row>
                </>
              ) : (
                <>
                  <Col sm="12">
                    <Card>
                      <Row className="mt-2 ml-2 mr-2 mb-1">
                        <Col>
                          <h1
                            className="float-left"
                            style={{ fontWeight: "600" }}>
                            Setting
                          </h1>
                        </Col>

                        <Col lg="3" md="3" sm="3">
                          <div className="d-flex justify-content-space-end">
                            {/* <span className="mx-1">
                              <FaFilter
                                style={{ cursor: "pointer" }}
                                title="filter coloumn"
                                size="30px"
                                onClick={this.LookupviewStart}
                                color="#39cccc"
                                className="float-right mt-1"
                              />
                            </span> */}
                            {/* <span className="mx-1 mr-1">
                              <div className="dropdown-container float-right">
                                <ImDownload
                                  style={{ cursor: "pointer" }}
                                  title="download file"
                                  size="35px"
                                  className="dropdown-button mt-1"
                                  color="#39cccc"
                                  onClick={this.toggleDropdown}
                                />
                                {isOpen && (
                                  <div
                                    style={{
                                      position: "absolute",
                                      zIndex: "1",
                                      border: "1px solid #39cccc",
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
                            </span> */}
                            <span className="mx-1 mr-1">
                              <Button
                                className="float-right"
                                color="#39cccc"
                                style={{
                                  cursor: "pointer",
                                  backgroundColor: "#39cccc",
                                  color: "white",
                                  fontWeight: "600",
                                }}
                                onClick={(e) => {
                                  this.toggleModalOne();
                                }}>
                                Invoice Template
                              </Button>
                            </span>
                          </div>
                          {/* <span>
                            <Route
                              render={({ history }) => (
                                <Button
                                  style={{
                                    cursor: "pointer",
                                    backgroundColor: "#39cccc",
                                    color: "white",
                                    fontWeight: "600",
                                  }}
                                  className="float-right mr-1 "
                                  color="#39cccc"
                                  onClick={() =>
                                    history.push(
                                      "/app/softNumen/warehouse/CreateWareHouse"
                                    )
                                  }>
                                  Create Warehouse
                                </Button>
                              )}
                            />
                          </span> */}
                        </Col>
                      </Row>
                      {Show ? (
                        <>
                          <CardBody>
                            {this.state.rowData === null ? null : (
                              <div className="ag-theme-material w-100 my-2 ag-grid-table">
                                <div className="d-flex flex-wrap justify-content-between align-items-center">
                                  <div className="mb-1">
                                    <UncontrolledDropdown className="p-1 ag-dropdown">
                                      <DropdownToggle tag="div">
                                        {this.gridApi
                                          ? this.state.currenPageSize
                                          : "" * this.state.getPageSize -
                                            (this.state.getPageSize - 1)}
                                        -
                                        {this.state.rowData.length -
                                          this.state.currenPageSize *
                                            this.state.getPageSize >
                                        0
                                          ? this.state.currenPageSize *
                                            this.state.getPageSize
                                          : this.state.rowData.length}{" "}
                                        of {this.state.rowData.length}
                                        <ChevronDown
                                          className="ml-50"
                                          size={15}
                                        />
                                      </DropdownToggle>
                                      <DropdownMenu right>
                                        <DropdownItem
                                          tag="div"
                                          onClick={() => this.filterSize(5)}>
                                          5
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
                                    </UncontrolledDropdown>
                                  </div>
                                  <div className="d-flex flex-wrap justify-content-end mb-1">
                                    <div className="table-input mr-1">
                                      <Input
                                        placeholder="search Item here..."
                                        onChange={(e) =>
                                          this.updateSearchQuery(e.target.value)
                                        }
                                        value={this.state.value}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <ContextLayout.Consumer className="ag-theme-alpine">
                                  {(context) => (
                                    <AgGridReact
                                      id="myAgGrid"
                                      // gridOptions={{
                                      //   domLayout: "autoHeight",
                                      //   // or other layout options
                                      // }}
                                      gridOptions={this.gridOptions}
                                      rowSelection="multiple"
                                      defaultColDef={defaultColDef}
                                      columnDefs={columnDefs}
                                      rowData={rowData}
                                      // onGridReady={(params) => {
                                      //   this.gridApi = params.api;
                                      //   this.gridColumnApi = params.columnApi;
                                      //   this.gridRef.current = params.api;

                                      //   this.setState({
                                      //     currenPageSize:
                                      //       this.gridApi.paginationGetCurrentPage() +
                                      //       1,
                                      //     getPageSize:
                                      //       this.gridApi.paginationGetPageSize(),
                                      //     totalPages:
                                      //       this.gridApi.paginationGetTotalPages(),
                                      //   });
                                      // }}
                                      onGridReady={this.onGridReady}
                                      colResizeDefault={"shift"}
                                      animateRows={true}
                                      floatingFilter={false}
                                      // pagination={true}
                                      paginationPageSize={
                                        this.state.paginationPageSize
                                      }
                                      pivotPanelShow="always"
                                      enableRtl={
                                        context.state.direction === "rtl"
                                      }
                                      ref={this.gridRef} // Attach the ref to the grid
                                      domLayout="autoHeight" // Adjust layout as needed
                                    />
                                  )}
                                </ContextLayout.Consumer>
                              </div>
                            )}
                          </CardBody>
                        </>
                      ) : null}
                    </Card>
                  </Col>
                </>
              )}
            </>
          )}
        </Row>

        <Modal
          isOpen={this.state.modal}
          toggle={this.LookupviewStart}
          className={this.props.className}
          style={{ maxWidth: "1050px" }}>
          <ModalHeader toggle={this.LookupviewStart}>Change Fileds</ModalHeader>
          <ModalBody className="modalbodyhead">
            <Row>
              <Col lg="4" md="4" sm="12" xl="4" xs="12">
                <h4>Avilable Columns</h4>
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
                                            this.state.SelectedcolumnDefs.slice();
                                          const delindex =
                                            SelectedCols.findIndex(
                                              (element) =>
                                                element?.headerName ==
                                                ele?.headerName
                                            );

                                          if (SelectedCols && delindex >= 0) {
                                            const splicedElement =
                                              SelectedCols.splice(delindex, 1); // Remove the element
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
          isOpen={this.state.modalOne}
          toggle={this.toggleModalOne}
          className={this.props.className}
          style={{ maxWidth: "1050px" }}>
          <ModalHeader toggle={this.toggleModalclose}>
            Choose Bill Template
          </ModalHeader>
          <ModalBody>
            <Row className="container p-5">
              <Form className="m-1" onSubmit={this.submitHandler}>
                <Row className="mb-2">
                  <Col lg="4" md="4" className="mb-2">
                    <Label id="1">Logo Position</Label>
                    <CustomInput
                      required
                      type="select"
                      placeholder="Select Type"
                      name="logoposition"
                      value={this.state.logoposition}
                      onChange={this.changeHandler}>
                      <option>---Select---</option>
                      <option value="Left">Left</option>
                      <option value="right">Right</option>
                    </CustomInput>
                  </Col>
                  <Col lg="4" md="4" className="mb-2">
                    <Label>ship to position</Label>
                    <CustomInput
                      required
                      type="select"
                      placeholder="Select Type"
                      name="shipto"
                      value={this.state.shipto}
                      onChange={this.changeHandler}>
                      <option>---Select---</option>
                      <option value="Left">Left</option>
                      <option value="right">Right</option>
                    </CustomInput>
                    <span>
                      {this.state.shipto == this.state.Billtoposition ? (
                        <span style={{ color: "red" }}>
                          Bill to and ship to cannot be same
                        </span>
                      ) : null}
                    </span>
                  </Col>

                  <Col lg="4" md="4" className="mb-2">
                    <Label>Bill to position</Label>
                    <CustomInput
                      required
                      type="select"
                      placeholder="Select Type"
                      name="Billtoposition"
                      value={this.state.Billtoposition}
                      onChange={this.changeHandler}>
                      <option>---Select---</option>
                      <option value="Left">Left</option>
                      <option value="right">Right</option>
                    </CustomInput>
                    <span>
                      {this.state.shipto == this.state.Billtoposition ? (
                        <span style={{ color: "red" }}>
                          Bill to and ship to cannot be same
                        </span>
                      ) : null}
                    </span>
                  </Col>
                  <Col sm="12" lg="12" md="12" className="p-1">
                    <Label>Terms And Conditions</Label>
                    <textarea
                      required
                      rows={5}
                      name="TermaAndCondition"
                      className="form-control"
                      placeholder="1. Paid Amount/Payment are not refundable in any case.
                                   2. Pay Payment under 30 days."
                      value={this.state.TermaAndCondition}
                      onChange={this.changeHandler}
                    />
                  </Col>
                </Row>
                <Row className="container p-1">
                  <Col lg="3" md="3" sm="3">
                    <div
                      style={{
                        backgroundColor:
                          this.state.BillNumber == 1 ? "#00c0efa6" : null,
                        borderRadius: this.state.BillNumber == 1 ? "8%" : null,
                      }}
                      className="imagebackground p-1">
                      <img
                        className="mx-1"
                        onClick={(e) => this.handleBillSet(1)}
                        style={{ cursor: "pointer" }}
                        width={130}
                        height={150}
                        src={Templatethree}
                        alt="template"
                      />
                    </div>
                  </Col>
                  <Col lg="3" md="3" s="3">
                    <div
                      style={{
                        backgroundColor:
                          this.state.BillNumber == 2 ? "#00c0efa6" : null,
                        borderRadius: this.state.BillNumber == 2 ? "8%" : null,
                      }}
                      className="imagebackground p-1">
                      <img
                        className="mx-1 imagebackground"
                        onClick={(e) => this.handleBillSet(2)}
                        style={{ cursor: "pointer" }}
                        width={130}
                        height={150}
                        src={Templatetwo}
                        alt="template"
                      />
                    </div>
                  </Col>
                  <Col lg="3" md="3" s="3">
                    <div
                      style={{
                        backgroundColor:
                          this.state.BillNumber == 3 ? "#00c0efa6" : null,
                        borderRadius: this.state.BillNumber == 3 ? "8%" : null,
                      }}
                      className="imagebackground p-1">
                      <img
                        onClick={(e) => this.handleBillSet(3)}
                        className="mx-1 imagebackground"
                        style={{ cursor: "pointer" }}
                        width={130}
                        height={150}
                        src={templateone}
                        alt="template"
                      />
                    </div>
                  </Col>
                  <Col lg="3" md="3" s="3">
                    <div
                      style={{
                        backgroundColor:
                          this.state.BillNumber == 4 ? "#00c0efa6" : null,
                        borderRadius: this.state.BillNumber == 4 ? "8%" : null,
                      }}
                      className="imagebackground p-1">
                      <img
                        onClick={(e) => this.handleBillSet(4)}
                        className="mx-1 imagebackground"
                        style={{ cursor: "pointer" }}
                        width={130}
                        height={150}
                        src={templatefour}
                        alt="template"
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="d-flex justify-content-center">
                      <Button
                        disabled={this.state.Loading ? true : false}
                        color={this.state.Loading ? "secondary" : "primary"}
                        type="submit"
                        className="mr-1 mb-1">
                        {this.state.Loading ? "Updating" : "Submit"}
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Row>
          </ModalBody>
        </Modal>
      </>
    );
  }
}
export default SettingTab;
