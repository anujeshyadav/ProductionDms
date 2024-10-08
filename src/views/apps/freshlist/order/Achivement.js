import React, { useRef } from "react";
import { ImDownload } from "react-icons/im";
import { Route } from "react-router-dom";
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
  Badge,
  Spinner,
} from "reactstrap";
import ExcelReader from "../parts/ExcelReader";
import { ContextLayout } from "../../../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import EditAccount from "../accounts/EditAccount";
import ViewAccount from "../accounts/ViewAccount";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Logo from "../../../../assets/img/profile/pages/logomain.png";
import Papa from "papaparse";
import { Eye, Trash2, ChevronDown, Edit, CornerDownLeft } from "react-feather";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import "../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../../../assets/scss/pages/users.scss";

import {
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaFilter,
} from "react-icons/fa";
import moment from "moment-timezone";
import swal from "sweetalert";
import {
  CreateAccountList,
  CreateOrder_ViewData,
  OrderViewList,
  DeleteAccount,
  TargetAchievement,
} from "../../../../ApiEndPoint/ApiCalling";
import {
  BsCloudDownloadFill,
  BsFillArrowDownSquareFill,
  BsFillArrowUpSquareFill,
} from "react-icons/bs";
import * as XLSX from "xlsx";
import UserContext from "../../../../context/Context";
import { CheckPermission } from "../house/CheckPermission";
import SuperAdminUI from "../../../SuperAdminUi/SuperAdminUI";

const SelectedColums = [];

class Achivement extends React.Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.gridRef = React.createRef();
    this.gridApi = null;
    this.state = {
      isOpen: false,
      MasterShow: false,

      Arrindex: "",
      rowData: [],
      setMySelectedarr: [],
      SelectedCols: [],
      InsiderPermissions: {},
      paginationPageSize: 5,
      currenPageSize: "",
      getPageSize: "",
      columnDefs: [
        // {
        //   headerName: "UID",
        //   valueGetter: "node.rowIndex + 1",
        //   field: "node.rowIndex + 1",
        //   width: 80,
        //   filter: true,
        // },

        // {
        //   headerName: "Actions",
        //   field: "transactions",
        //   width: 180,
        //   cellRendererFramework: (params) => {
        //     return (
        //       <div className="actions cursor-pointer">
        //         {this.state.InsiderPermissions &&
        //           this.state.InsiderPermissions?.View && (
        //             <Eye
        //               className="mr-50"
        //               size="25px"
        //               color="green"
        //               onClick={() => {
        //                 this.togglemodal();
        //                 this.handleChangeView(params.data, "readonly");
        //               }}
        //             />
        //           )}
        //         {this.state.InsiderPermissions &&
        //           this.state.InsiderPermissions?.Edit && (
        //             <Edit
        //               className="mr-50"
        //               size="25px"
        //               color="blue"
        //               onClick={() =>
        //                 this.props.history.push({
        //                   pathname: `/app/freshlist/order/editOrder/${params.data?._id}`,
        //                   state: params.data,
        //                 })
        //               }
        //             />
        //           )}
        //       </div>
        //     );
        //   },
        // },
        // {
        //   headerName: "Status",
        //   field: "status",
        //   filter: true,
        //   width: 150,
        //   cellRendererFramework: (params) => {
        //     return params.value == "Completed" ? (
        //       <div className="badge badge-pill badge-success">
        //         {params.data.status}
        //       </div>
        //     ) : params.value == "InProcess" ? (
        //       <div className="badge badge-pill badge-warning">
        //         {params.data.status}
        //       </div>
        //     ) : params.value == "pending" ? (
        //       <div className="badge badge-pill badge-info">Pending</div>
        //     ) : params.value == "Cancelled" ? (
        //       <div className="badge badge-pill badge-danger">
        //         {params.data.status}
        //       </div>
        //     ) : null;
        //   },
        // },
        // {
        //   headerName: "order Creation date",
        //   field: "createdAt",
        //   filter: true,
        //   resizable: true,
        //   width: 230,
        //   cellRendererFramework: (params) => {
        //     return (
        //       <div className="d-flex align-items-center cursor-pointer">
        //         <div>
        //           <span>{params.data?.createdAt?.split("T")[0]}</span>
        //         </div>
        //       </div>
        //     );
        //   },
        // },
        {
          headerName: "Product Title",
          field: "product?.details?.Product_Title",
          filter: true,
          width: 180,
          cellRendererFramework: params => {
            return (
              <div className="d-flex align-items-center cursor-pointer">
                <div>
                  <span>{params.data?.product?.details?.Product_Title}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Target Qty",
          field: "targetQuantity",
          filter: true,
          width: 180,
          cellRendererFramework: params => {
            return (
              <div className="d-flex align-items-center cursor-pointer">
                <div>
                  <span>{params.data?.targetQuantity}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Target Amount",
          field: "targetTotalPrice",
          filter: true,
          width: 180,
          cellRendererFramework: params => {
            return (
              <div className="d-flex align-items-center cursor-pointer">
                <div>
                  <span>{params.data?.targetTotalPrice}</span>
                </div>
              </div>
            );
          },
        },

        {
          headerName: "Achieved Qty",
          field: "actualQuantity",
          filter: true,
          width: 220,
          cellRendererFramework: params => {
            return (
              <div className="d-flex align-items-center cursor-pointer">
                <div>
                  <span>{params.data?.actualQuantity}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Achieved Percentage",
          field: "achievementPercentage",
          filter: true,
          width: 220,
          cellRendererFramework: params => {
            return (
              <div className="d-flex align-items-center cursor-pointer">
                <div>
                  <Badge color="primary">
                    {params.data?.achievementPercentage} %{" "}
                  </Badge>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Achieved Price",
          field: "actualTotalPrice",
          filter: true,
          width: 220,
          cellRendererFramework: params => {
            return (
              <div className="d-flex align-items-center cursor-pointer">
                <div>
                  <Badge color="primary">
                    {params.data?.actualTotalPrice}{" "}
                  </Badge>
                </div>
              </div>
            );
          },
        },
      ],
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
    this.setState(prevState => ({
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
  async Apicalling(id, db) {
    this.setState({ Loading: true });
    await TargetAchievement(id, db)
      .then(res => {
        console.log(res?.achievements);
        this.setState({ Loading: false });

        this.setState({ rowData: res?.achievements });
        this.setState({ AllcolumnDefs: this.state.columnDefs });
        this.setState({ SelectedCols: this.state.columnDefs });

        let userHeading = JSON.parse(localStorage.getItem("AchievementList"));
        if (userHeading?.length) {
          this.setState({ columnDefs: userHeading });
          // this.gridApi.setColumnDefs(userHeading);
          this.setState({ SelectedcolumnDefs: userHeading });
        } else {
          this.setState({ columnDefs: this.state.columnDefs });
          this.setState({ SelectedcolumnDefs: this.state.columnDefs });
        }
      })
      .catch(err => {
        this.setState({ Loading: false });
        this.setState({ rowData: [] });

        console.log(err);
      });
  }
  async componentDidMount() {
    const UserInformation = this.context?.UserInformatio;
    const InsidePermissions = CheckPermission("Achievement");
    this.setState({ InsiderPermissions: InsidePermissions });

    let userId = JSON.parse(localStorage.getItem("userData"));

    if (userId?.rolename?.roleName === "MASTER") {
      this.setState({ MasterShow: true });
    }
    await this.Apicalling(userId?._id, userId?.database);
  }
  toggleDropdown = () => {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  };

  runthisfunction(id) {
    swal("Warning", "Sure You Want to Delete it", {
      buttons: {
        cancel: "cancel",
        catch: { text: "Delete ", value: "delete" },
      },
    }).then(value => {
      switch (value) {
        case "delete":
          DeleteAccount(id)
            .then(res => {
              let selectedData = this.gridApi.getSelectedRows();
              this.gridApi.updateRowData({ remove: selectedData });
            })
            .catch(err => {
              console.log(err);
            });
          break;
        default:
      }
    });
  }

  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridRef.current = params.api;

    this.setState({
      currenPageSize: this.gridApi.paginationGetCurrentPage() + 1,
      getPageSize: this.gridApi.paginationGetPageSize(),
      totalPages: this.gridApi.paginationGetTotalPages(),
    });
  };

  updateSearchQuery = val => {
    this.gridApi.setQuickFilter(val);
  };

  filterSize = val => {
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
        ele => ele?.headerName === value?.headerName
      );

      SelectedColums?.splice(delindex, 1);
    }
  };
  parseCsv(csvData) {
    return new Promise((resolve, reject) => {
      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: result => {
          if (result.data && result.data.length > 0) {
            resolve(result.data);
          } else {
            reject(new Error("No data found in the CSV"));
          }
        },
        error: error => {
          reject(error);
        },
      });
    });
  }
  generatePDF(parsedData) {
    let pdfsize = [Object.keys(parsedData[0])][0].length;
    let size = pdfsize > 15 ? "a1" : pdfsize < 14 > 10 ? "a3" : "a4";

    const doc = new jsPDF("landscape", "mm", size, false);
    doc.setTextColor(5, 87, 97);
    const tableData = parsedData.map(row => Object.values(row));
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
  processCell = params => {
    // console.log(params);
    // Customize cell content as needed
    return params.value;
  };

  convertCsvToExcel(csvData) {
    return new Promise(resolve => {
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

  exportToExcel = async e => {
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
      complete: result => {
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
      complete: result => {
        const rows = result.data;

        // Create XML
        let xmlString = "<root>\n";

        rows.forEach(row => {
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

  HandleSetVisibleField = e => {
    e.preventDefault();
    this.gridApi.setColumnDefs(this.state.SelectedcolumnDefs);
    this.setState({ columnDefs: this.state.SelectedcolumnDefs });
    this.setState({ SelectedcolumnDefs: this.state.SelectedcolumnDefs });
    this.setState({ rowData: this.state.rowData });
    localStorage.setItem(
      "AchievementList",
      JSON.stringify(this.state.SelectedcolumnDefs)
    );
    this.LookupviewStart();
  };

  HeadingRightShift = () => {
    const updatedSelectedColumnDefs = [
      ...new Set([
        ...this.state.SelectedcolumnDefs.map(item => JSON.stringify(item)),
        ...SelectedColums.map(item => JSON.stringify(item)),
      ]),
    ].map(item => JSON.parse(item));
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
  handleParentSubmit = e => {
    e.preventDefault();
    let SuperAdmin = JSON.parse(localStorage.getItem("SuperadminIdByMaster"));
    let id = SuperAdmin.split(" ")[0];
    let db = SuperAdmin.split(" ")[1];
    this.Apicalling(id, db);
  };
  handleDropdownChange = selectedValue => {
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
          }}
        >
          <Spinner
            style={{
              height: "4rem",
              width: "4rem",
            }}
            color="primary"
          >
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
        <Row className="app-user-list">
          {this.state.EditOneUserView && this.state.EditOneUserView ? (
            <Row className="card">
              <Col>
                <div className="d-flex justify-content-end p-1">
                  <Button
                    onClick={e => {
                      e.preventDefault();
                      this.setState({ EditOneUserView: false });
                    }}
                    color="danger"
                  >
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
                          onClick={e => {
                            e.preventDefault();
                            this.setState({ ViewOneUserView: false });
                          }}
                          color="danger"
                        >
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
                      <Row className="ml-2 mt-2 mr-2">
                        <Col>
                          <h1
                            className="float-left"
                            style={{ fontWeight: "600" }}
                          >
                            Achivement
                          </h1>
                        </Col>
                        {this.state.MasterShow && (
                          <Col>
                            <SuperAdminUI
                              onDropdownChange={this.handleDropdownChange}
                              onSubmit={this.handleParentSubmit}
                            />
                          </Col>
                        )}
                        <Col>
                          {InsiderPermissions && InsiderPermissions?.View && (
                            <>
                              <span className="mx-1">
                                <FaFilter
                                  style={{ cursor: "pointer" }}
                                  title="filter coloumn"
                                  size="35px"
                                  onClick={this.LookupviewStart}
                                  color="#39cccc"
                                  className="float-right"
                                />
                              </span>
                            </>
                          )}
                          {InsiderPermissions &&
                            InsiderPermissions?.Download && (
                              <span className="mx-1">
                                <div className="dropdown-container float-right">
                                  <ImDownload
                                    style={{ cursor: "pointer" }}
                                    title="download file"
                                    size="35px"
                                    className="dropdown-button "
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
                                      className="dropdown-content dropdownmy"
                                    >
                                      <h5
                                        onClick={() => this.exportToPDF()}
                                        style={{ cursor: "pointer" }}
                                        className=" mx-1 myactive mt-1"
                                      >
                                        .PDF
                                      </h5>
                                      <h5
                                        onClick={() =>
                                          this.gridApi.exportDataAsCsv()
                                        }
                                        style={{ cursor: "pointer" }}
                                        className=" mx-1 myactive"
                                      >
                                        .CSV
                                      </h5>
                                      <h5
                                        onClick={this.convertCSVtoExcel}
                                        style={{ cursor: "pointer" }}
                                        className=" mx-1 myactive"
                                      >
                                        .XLS
                                      </h5>
                                      <h5
                                        onClick={this.exportToExcel}
                                        style={{ cursor: "pointer" }}
                                        className=" mx-1 myactive"
                                      >
                                        .XLSX
                                      </h5>
                                      <h5
                                        onClick={() => this.convertCsvToXml()}
                                        style={{ cursor: "pointer" }}
                                        className=" mx-1 myactive"
                                      >
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
                        <CardBody style={{ marginTop: "0rem" }}>
                          {this.state.rowData === null ? null : (
                            <div className="ag-theme-material w-100 my-2 ag-grid-table">
                              <div className="d-flex flex-wrap justify-content-between align-items-center">
                                <div className="mb-1">
                                  <UncontrolledDropdown className="p-1 ag-dropdown">
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
                                      <ChevronDown
                                        className="ml-50"
                                        size={15}
                                      />
                                    </DropdownToggle>
                                    <DropdownMenu right>
                                      <DropdownItem
                                        tag="div"
                                        onClick={() => this.filterSize(5)}
                                      >
                                        5
                                      </DropdownItem>
                                      <DropdownItem
                                        tag="div"
                                        onClick={() => this.filterSize(20)}
                                      >
                                        20
                                      </DropdownItem>
                                      <DropdownItem
                                        tag="div"
                                        onClick={() => this.filterSize(50)}
                                      >
                                        50
                                      </DropdownItem>
                                      <DropdownItem
                                        tag="div"
                                        onClick={() => this.filterSize(100)}
                                      >
                                        100
                                      </DropdownItem>
                                      <DropdownItem
                                        tag="div"
                                        onClick={() => this.filterSize(134)}
                                      >
                                        134
                                      </DropdownItem>
                                    </DropdownMenu>
                                  </UncontrolledDropdown>
                                </div>
                                <div className="d-flex flex-wrap justify-content-end mb-1">
                                  <div className="table-input mr-1">
                                    <Input
                                      placeholder="search Item here..."
                                      onChange={e =>
                                        this.updateSearchQuery(e.target.value)
                                      }
                                      value={this.state.value}
                                    />
                                  </div>
                                </div>
                              </div>
                              <ContextLayout.Consumer className="ag-theme-alpine">
                                {context => (
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
                      )}
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
          style={{ maxWidth: "1050px" }}
        >
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
                              onClick={e => this.handleChangeHeader(e, ele, i)}
                              key={i}
                              className="mycustomtag mt-1"
                            >
                              <span className="mt-1">
                                <h5
                                  style={{ cursor: "pointer" }}
                                  className="allfields"
                                >
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
                                      className="allfields"
                                    >
                                      <IoMdRemoveCircleOutline
                                        onClick={() => {
                                          const SelectedCols =
                                            this.state.SelectedcolumnDefs.slice();
                                          const delindex =
                                            SelectedCols.findIndex(
                                              element =>
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
      </>
    );
  }
}
export default Achivement;
