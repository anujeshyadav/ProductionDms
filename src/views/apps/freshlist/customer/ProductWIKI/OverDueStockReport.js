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
  Label,
  Table,
  FormGroup,
  CustomInput,
} from "reactstrap";

import { ContextLayout } from "../../../../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Logo from "../../../../../assets/img/profile/pages/logomain.png";
import Papa from "papaparse";
import { Eye, Trash2, ChevronDown, Edit } from "react-feather";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import "../../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../../../../assets/scss/pages/users.scss";

import {
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaDownload,
  FaFilter,
  FaPlus,
} from "react-icons/fa";
import moment from "moment-timezone";
import swal from "sweetalert";
import {
  CreateAccountList,
  DeleteAccount,
  Stockupdate,
  _Get,
} from "../../../../../ApiEndPoint/ApiCalling";
import {
  BsFillArrowDownSquareFill,
  BsFillArrowUpSquareFill,
} from "react-icons/bs";
import * as XLSX from "xlsx";
import UserContext from "../../../../../context/Context";
import UpdateStockTrx from "../../accounts/UpdateStockTrx";
import StockTrxInvoice from "../../subcategory/OutWardStockPO";
import { CheckPermission } from "../../house/CheckPermission";
import {
  WareHouse_Closing_Stock,
  WareHouse_OverDue_Stock,
} from "../../../../../ApiEndPoint/Api";

const SelectedColums = [];

class OverDueStockReport extends React.Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.gridRef = React.createRef();
    this.gridApi = null;
    this.state = {
      isOpen: false,
      ShowBill: false,
      InsiderPermissions: {},

      Arrindex: "",
      rowData: [],
      setMySelectedarr: [],
      ViewOneData: {},
      SelectedCols: [],
      paginationPageSize: 5,
      currenPageSize: "",
      getPageSize: "",

      columnDefs: [
        {
          headerName: "S.No",
          valueGetter: "node.rowIndex + 1",
          field: "node.rowIndex + 1",
          width: 150,
          filter: true,
        },
        // {
        //   headerName: "Actions",
        //   field: "sortorder",
        //   field: "transactions",
        //   width: 150,
        //   cellRendererFramework: (params) => {
        //     return (
        //       <div className="actions cursor-pointer">
        //         {this.state.InsiderPermissions &&
        //           this.state.InsiderPermissions?.View && (
        //             <Eye
        //               className="mr-50"
        //               size="25px"
        //               color="green"
        //               // onClick={() =>
        //               //   history.push(
        //               //     `/app/freshlist/customer/viewCustomer/${params.data?._id}`
        //               //   )
        //               // }
        //               onClick={(e) => {
        //                 this.togglemodal();
        //                 this.setState({ ViewOneData: params?.data });
        //                 this.setState({ ViewOneUserView: true });
        //                 this.setState({ EditOneUserView: false });

        //                 // console.log(params?.data);
        //               }}
        //             />
        //           )}

        //         {/* {this.state.InsiderPermissions &&
        //           this.state.InsiderPermissions?.Delete && (
        //             <Trash2
        //               className="mr-50"
        //               size="25px"
        //               color="red"
        //               onClick={() => {
        //                 let selectedData = this.gridApi.getSelectedRows();
        //                 this.runthisfunction(params.data._id);
        //                 this.gridApi.updateRowData({ remove: selectedData });
        //               }}
        //             />
        //           )} */}
        //       </div>
        //     );
        //   },
        // },
        {
          headerName: "Status",
          field: "status",
          filter: true,
          width: 150,
          cellRendererFramework: (params) => {
            return params.data?.status === "Active" ? (
              <div className="badge badge-pill badge-success">
                {params.data?.productId?.status}
              </div>
            ) : params.data?.status === "InProcess" ? (
              <div className="badge badge-pill badge-warning">
                {params.data?.productId?.status}
              </div>
            ) : params.data?.status === "Hold" ? (
              <div className="badge badge-pill badge-danger">
                {params.data?.productId?.status}
              </div>
            ) : params.data?.status === "opening" ? (
              <div className="badge badge-pill badge-warning">
                {params.data?.productId?.status}
              </div>
            ) : (
              <>{params?.data?.productId?.status}</>
            );
          },
        },
        {
          headerName: "Product_MRP",
          field: "Product_MRP",
          filter: true,
          width: 200,
          cellRendererFramework: (params) => {
            return (
              <div>
                <span>{params.data?.productId?.Product_MRP}</span>
              </div>
            );
          },
        },
        {
          headerName: "Product_Title",
          field: "Product_Title",
          filter: true,
          width: 200,
          cellRendererFramework: (params) => {
            return (
              <div>
                <span>{params.data?.productId?.Product_Title}</span>
              </div>
            );
          },
        },
        {
          headerName: "SubCategroy",
          field: "SubCategory",
          filter: true,
          width: 200,
          cellRendererFramework: (params) => {
            return (
              <div>
                <span>{params.data?.productId?.SubCategory}</span>
              </div>
            );
          },
        },
        {
          headerName: "HSN_Code",
          field: "HSN_Code",
          filter: true,
          width: 200,
          cellRendererFramework: (params) => {
            return (
              <div>
                <span>{params.data?.productId?.HSN_Code} </span>
              </div>
            );
          },
        },
        {
          headerName: "Size",
          field: "Size",
          filter: true,
          width: 200,
          cellRendererFramework: (params) => {
            return (
              <div>
                <span>{params.data?.productId?.Size} </span>
              </div>
            );
          },
        },
        {
          headerName: "GST Rate",
          field: "Size",
          filter: true,
          width: 200,
          cellRendererFramework: (params) => {
            return (
              <div>
                <span>{params.data?.productId["GSTRate"]} </span>
              </div>
            );
          },
        },
        {
          headerName: "CurrentStock",
          field: "currentStock",
          filter: true,
          width: 200,
          cellRendererFramework: (params) => {
            return (
              <div>
                <span>{params.data?.currentStock} </span>
              </div>
            );
          },
        },
        {
          headerName: "UnitType",
          field: "unitType",
          filter: true,
          width: 200,
          cellRendererFramework: (params) => {
            return (
              <div>
                <span>{params.data?.unitType} </span>
              </div>
            );
          },
        },
        {
          headerName: "TotalPrice",
          field: "totalPrice",
          filter: true,
          width: 200,
          cellRendererFramework: (params) => {
            return (
              <div>
                <span>{params.data?.totalPrice} </span>
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
  UpdateStock = (e) => {
    let payload = {
      status: e.target.value,
    };
    let id = this.state.ViewOneData?._id;

    // console.log(this.state.ViewOneData?._id);
    swal("Warning", "Sure You Want to Update Status", {
      buttons: {
        cancel: "No",
        catch: { text: "Yes", value: "Sure" },
      },
    }).then((value) => {
      switch (value) {
        case "Sure":
          Stockupdate(id, payload)
            .then((res) => {
              swal("success", "Status Updated Successfully");
              this.togglemodal();
              this.ViewStockList();
            })
            .catch((err) => {
              console.log(err);
            });

          break;
        default:
      }
    });
  };
  LookupviewStart = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };
  togglemodal = () => {
    this.setState((prevState) => ({
      modalone: !prevState.modalone,
    }));
    this.setState({ ShowBill: false });
  };
  handleStockTrxInvoiceShow = () => {
    this.setState({ ShowBill: true });
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
    let { id } = this.props.match.params;
    const InsidePermissions = CheckPermission("OverDue Stock");
    this.setState({ InsiderPermissions: InsidePermissions });
    let userData = JSON.parse(localStorage.getItem("userData"));
    const URl = `${WareHouse_OverDue_Stock}/${id}/`;
    this.setState({ AllcolumnDefs: this.state.columnDefs });

    let userHeading = JSON.parse(localStorage.getItem("OverDurStockList"));
    if (userHeading?.length) {
      this.setState({ columnDefs: userHeading });
      // this.gridApi.setColumnDefs(userHeading);
      this.setState({ SelectedcolumnDefs: userHeading });
    } else {
      this.setState({ columnDefs: this.state.columnDefs });
      this.setState({ SelectedcolumnDefs: this.state.columnDefs });
    }
    this.setState({ SelectedCols: this.state.columnDefs });

    await _Get(URl, userData?.database)
      .then((res) => {
        if (res?.Product) {
          this.setState({ rowData: res?.Product });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  toggleDropdown = () => {
    this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
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
          DeleteAccount(id)
            .then((res) => {
              let selectedData = this.gridApi.getSelectedRows();
              this.gridApi.updateRowData({ remove: selectedData });
            })
            .catch((err) => {
              console.log(err);
            });
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
    // console.log(params);
    // Customize cell content as needed
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
      "OverDurStockList",
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
  render() {
    const {
      rowData,
      columnDefs,
      defaultColDef,
      SelectedcolumnDefs,
      isOpen,
      SelectedCols,
      AllcolumnDefs,
      InsiderPermissions,
    } = this.state;
    return (
      <>
        <Row className="app-user-list">
          <Col sm="12">
            <Card>
              <Row className="mt-2 ml-2 mr-2">
                <Col>
                  <h1 className="float-left">Overdue Stock List</h1>
                </Col>
                <Col lg="2" md="2" sm="6">
                  <Route
                    render={({ history }) => (
                      <Button
                        style={{ cursor: "pointer" }}
                        className="float-right mr-1"
                        color="primary"
                        onClick={() => history.goBack()}>
                        Back
                      </Button>
                    )}
                  />
                </Col>

                {InsiderPermissions && InsiderPermissions?.View && (
                  <Col lg="2" md="2" sm="6">
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
                            className="dropdown-content dropdownmy">
                            <h5
                              onClick={() => this.exportToPDF()}
                              style={{ cursor: "pointer" }}
                              className=" mx-1 myactive mt-1">
                              .PDF
                            </h5>
                            <h5
                              onClick={() => this.gridApi.exportDataAsCsv()}
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
                    {/* <span>
                    <Route
                      render={({ history }) => (
                        <Badge
                          style={{ cursor: "pointer" }}
                          className="float-right mr-1"
                          color="primary"
                          onClick={() =>
                            history.push(
                              "/app/softNumen/warehouse/WareHouseStock/:id"
                            )
                          }>
                          View My WareHouse
                        </Badge>
                      )}
                    />
                  </span> */}
                  </Col>
                )}
              </Row>
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
                            <ChevronDown className="ml-50" size={15} />
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
                          paginationPageSize={this.state.paginationPageSize}
                          pivotPanelShow="always"
                          enableRtl={context.state.direction === "rtl"}
                          ref={this.gridRef} // Attach the ref to the grid
                          domLayout="autoHeight" // Adjust layout as needed
                        />
                      )}
                    </ContextLayout.Consumer>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
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
          isOpen={this.state.modalone}
          toggle={this.togglemodal}
          className={this.props.className}
          style={{ maxWidth: "1050px" }}>
          <ModalHeader toggle={this.togglemodal}>
            {this.state.ShowBill ? "Bill Download" : "All Products"}
          </ModalHeader>
          <ModalBody
            className={`${this.state.ShowBill ? "p-1" : "modalbodyhead"}`}>
            {this.state.ViewOneUserView ? (
              <>
                {this.state.ShowBill ? (
                  <>
                    <StockTrxInvoice ViewOneData={this.state.ViewOneData} />
                  </>
                ) : (
                  <>
                    <Row>
                      <Col>
                        <Label>WareHouse Name :</Label>
                        <div>
                          <Badge color="primary" className="">
                            <strong>
                              {this.state.ViewOneData &&
                                this.state.ViewOneData?.firstName}
                            </strong>
                          </Badge>
                        </div>
                      </Col>

                      {this.state.ViewOneData?.status == "closing" ? (
                        <>
                          <Col className="">
                            <Label>status:</Label>
                            <div>
                              <Badge color="primary">
                                {this.state.ViewOneData?.status}
                              </Badge>
                            </div>
                          </Col>
                        </>
                      ) : (
                        <>
                          <Col className="">
                            <Label>status:</Label>
                            <div>
                              <Badge color="primary">
                                {this.state.ViewOneData?.status}
                              </Badge>
                            </div>
                          </Col>
                        </>
                      )}

                      {/* <Col>
                        <Label>Download Invoice :</Label>
                        <div className="d-flex justify-content-center">
                          <FaDownload
                            onClick={this.handleStockTrxInvoiceShow}
                            color="#00c0e"
                            style={{ cursor: "pointer" }}
                            size={20}
                          />
                        </div>
                      </Col> */}
                    </Row>
                    <Row className="p-2">
                      <Col>
                        <div className="d-flex justify-content-center">
                          <h4>Product Details</h4>
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
                              <th>Price</th>
                              <th>Size</th>
                              <th>Unit</th>
                              <th>Quantity</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.ViewOneData?.productItems &&
                              this.state.ViewOneData?.productItems?.map(
                                (ele, i) => (
                                  <>
                                    <tr>
                                      <th scope="row">{i + 1}</th>
                                      <td>{ele?.productId?.Product_Title}</td>
                                      <td>{ele?.price}</td>
                                      <td>{ele?.Size}</td>
                                      <td>{ele?.unitType}</td>
                                      <td>{ele?.transferQty}</td>
                                      <td>
                                        {ele?.price *
                                          ele?.Size *
                                          ele?.transferQty}
                                      </td>
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
              </>
            ) : (
              <>
                <UpdateStockTrx ViewOne={this.state.ViewOneData} />
              </>
            )}
          </ModalBody>
        </Modal>
      </>
    );
  }
}
export default OverDueStockReport;
