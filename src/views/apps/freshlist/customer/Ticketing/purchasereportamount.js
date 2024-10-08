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
  ModalHeader,
  ModalBody,
  Badge,
  Label,
  Button,
  Spinner,
} from "reactstrap";
import { ContextLayout } from "../../../../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Logo from "../../../../../assets/img/profile/pages/logomain.png";
import Papa from "papaparse";
import { ChevronDown } from "react-feather";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import "../../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../../../../assets/scss/pages/users.scss";
import {
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaFilter,
} from "react-icons/fa";
import { _Get, PurchaseOrderList } from "../../../../../ApiEndPoint/ApiCalling";
import {
  BsFillArrowDownSquareFill,
  BsFillArrowUpSquareFill,
} from "react-icons/bs";
import * as XLSX from "xlsx";
import UserContext from "../../../../../context/Context";
import { CheckPermission } from "../../house/CheckPermission";
import SuperAdminUI from "../../../../SuperAdminUi/SuperAdminUI";
import { ImDownload } from "react-icons/im";

const SelectedColums = [];

class purchasereportamount extends React.Component {
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
      rowAllData: [],
      startDate: "",
      EndDate: "",
      ShowBill: false,
      modal: false,
      modalone: false,
      ViewData: {},
      InsiderPermissions: {},
      setMySelectedarr: [],
      SelectedCols: [],
      paginationPageSize: 12,
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
          headerName: "GSTIN",
          field: "order.partyId.gstNumber",
          filter: true,
          width: 135,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>
                  {params?.data?.order?.partyId?.gstNumber &&
                    params?.data?.order?.partyId?.gstNumber}
                </span>
              </div>
            );
          },
        },
        {
          headerName: "Party Name",
          field: "order.partyId.CompanyName",
          filter: true,
          width: 210,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.data?.order?.partyId?.CompanyName}</span>
              </div>
            );
          },
        },
        {
          headerName: "Party Type",
          field: "order.partyId.partyType",
          filter: true,
          width: 115,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.data?.order?.partyId?.partyType}</span>
              </div>
            );
          },
        },

        {
          headerName: "INVOICE Number",
          field: "order.invoiceId",
          filter: true,
          width: 150,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.data?.order?.invoiceId}</span>
              </div>
            );
          },
        },
        {
          headerName: "Purchase Date",
          field: "order.createdAt",
          filter: true,
          width: 125,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.data?.order?.createdAt?.split("T")[0]}</span>
              </div>
            );
          },
        },
        {
          headerName: "E-way Bill",
          field: "ARN",
          filter: true,
          editable: true,
          width: 160,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.data?.order?.ARN}</span>
              </div>
            );
          },
        },
        {
          headerName: "Recieved Date",
          field: "updatedAt",
          filter: true,
          width: 120,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.data?.order?.updatedAt?.split("T")[0]}</span>
              </div>
            );
          },
        },
        {
          headerName: " Particulard",
          field: "order.partyId.ownerName",
          filter: true,
          
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.data?.order?.partyId?.ownerName} </span>
              </div>
            );
          },
        },
        {
          headerName: "HSN",
          field: "productId.HSN_Code",
          filter: true,
          width: 130,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.data?.productId?.HSN_Code}</span>
              </div>
            );
          },
        },
        {
          headerName: "QNTY",
          field: "qty",
          filter: true,
          width: 100,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.data?.qty}</span>
              </div>
            );
          },
        },
        {
          headerName: "DISCOUNT(%)",
          field: "discountPercentage",
          filter: true,
          width: 100,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <span>{params?.data?.discountPercentage}</span>
              </div>
            );
          },
        },
        // {
        //   headerName: "Customer Id",
        //   field: "partyId._id",
        //   filter: true,
        //   width: 240,
        //   cellRendererFramework: (params) => {
        //     return (
        //       <div>
        //         <span>{params?.data?.partyId?._id}</span>
        //       </div>
        //     );
        //   },
        // },

        {
          headerName: "Taxable",
          field: "taxableAmount",
          filter: true,
          width: 100,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                {params?.data?.taxableAmount}
              </div>
            );
          },
        },
        {
          headerName: "CGST",
          field: "cgstRate",
          filter: true,
          width: 100,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                {params?.data?.cgstRate}
              </div>
            );
          },
        },
        {
          headerName: "SGST",
          field: "sgstRate",
          filter: true,
          width: 100,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                {params?.data?.sgstRate}
              </div>
            );
          },
        },
        {
          headerName: "IGST",
          field: "igstRate",
          filter: true,
          width: 100,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                {params?.data?.igstRate}
              </div>
            );
          },
        },
        {
          headerName: "Total",
          field: "grandTotal",
          filter: true,
          width: 100,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                {params?.data?.grandTotal}
              </div>
            );
          },
        },
      ],
    };
  }

  LookupviewStart = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };

  async Apicalling(id, db) {
    this.setState({ Loading: true });
    await PurchaseOrderList(id, db)
      .then((res) => {
        const allCompltedList = res?.orderHistory?.filter(
          (ele) => ele?.status == "completed"
        );
        let Alldata = allCompltedList?.flatMap((element, index) => {
          return element?.orderItems?.map((val, i) => {
            return { ...val, order: element };
          });
        });

        this.setState({ rowData: Alldata });

        if (Alldata) {
          this.setState({ Loading: false });
          this.setState({ rowData: Alldata });
          this.setState({ rowAllData: Alldata });
        }
        this.setState({ AllcolumnDefs: this.state.columnDefs });
        this.setState({ SelectedCols: this.state.columnDefs });

        let userHeading = JSON.parse(
          localStorage.getItem("PurchaseReportamountList")
        );
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
    const userInfo = JSON.parse(localStorage.getItem("userData"));
    const UserInformation = this.context?.UserInformatio;
    if (userInfo?.rolename?.roleName === "MASTER") {
      this.setState({ MasterShow: true });
    }
    const InsidePermissions = CheckPermission(
      "PARTY WISE AND PRODUCT WISE PURCHASE REPORT"
    );
    this.setState({ InsiderPermissions: InsidePermissions });
    await this.Apicalling(userInfo?._id, userInfo?.database);
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
  handleDate = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmitDate = () => {
    const filteredItems = this.state.rowAllData.filter((item) => {
      const dateList = new Date(item?.order?.updatedAt);
      const onlyDate = dateList.toISOString().split("T")[0];
      return onlyDate >= this.state.startDate && onlyDate <= this.state.EndDate;
    });
    this.setState({ rowData: filteredItems });
  };
  convertCsvToXml = () => {
    const CsvData = this.gridApi.getDataAsCsv({
      processCellCallback: this.processCell,
    });
    Papa.parse(CsvData, {
      complete: (result) => {
        const rows = result.data;

        let xmlString = "<root>\n";

        rows.forEach((row) => {
          xmlString += "  <row>\n";
          row.forEach((cell, index) => {
            xmlString += `    <field${index + 1}>${cell}</field${index + 1}>\n`;
          });
          xmlString += "  </row>\n";
        });

        xmlString += "</root>";
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
      "PurchaseReportamountList",
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
      AllcolumnDefs,
    } = this.state;
    return (
      <>
        <Card>
          <Row style={{marginLeft:'3px',marginRight:'3px'}}>
            <Col  >
              <h3 style={{ fontWeight: "600" ,textTransform:'uppercase', fontSize:'18px',marginTop:'30px' }}>
                PARTY WISE AND PRODUCT WISE PURCHASE REPORT
              </h3>
            </Col>
            {this.state.MasterShow && this.state.MasterShow ? (
              <Col lg="2" md="2" xl="2" style={{ marginTop: "25px" }}>
                <SuperAdminUI
                  onDropdownChange={this.handleDropdownChange}
                  onSubmit={this.handleParentSubmit}
                />
              </Col>
            ) : (
              <Col></Col>
            )}
            <Col xl="3" lg="3" md="3" style={{ marginTop: "25px" }}>
              {" "}
              <div className="table-input cssforproductlist">
                <Input
                  placeholder="search Item here..."
                  onChange={(e) => this.updateSearchQuery(e.target.value)}
                  value={this.state.value}
                />
              </div>
            </Col>
            <Col xl="4" lg="4" md="4">
              <Row>
                <Col xl="5" lg="5" md="5" style={{ marginTop: "5px" }}>
                  {" "}
                  <div className="table-input cssforproductlist">
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      name="startDate"
                      value={this.state.startDate}
                      onChange={this.handleDate}
                    />
                  </div>
                </Col>
                <Col xl="5" lg="5" md="5" style={{ marginTop: "5px" }}>
                  {" "}
                  <div className="table-input cssforproductlist">
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      name="EndDate"
                      value={this.state.EndDate}
                      onChange={this.handleDate}
                    />
                  </div>
                </Col>
                <Col xl="2" lg="2" md="2" style={{ marginTop: "25px" }}>
                  {" "}
                  <div className="table-input ">
                    <Button
                      type="submit"
                      style={{
                        cursor: "pointer",
                        backgroundColor: "rgb(8, 91, 245)",
                        color: "white",
                        fontWeight: "600",
                        height: "43px",
                      }}
                      color="#39cccc"
                      onClick={this.handleSubmitDate}>
                      Submit
                    </Button>
                  </div>
                </Col>
              </Row>
            </Col>

            <Col style={{ marginTop: "25px" }} lg="1">
              {InsiderPermissions && InsiderPermissions?.View && (
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
              )}
              {InsiderPermissions && InsiderPermissions?.Download && (
                <span
                  onMouseEnter={this.toggleDropdown}
                  onMouseLeave={this.toggleDropdown}
                  className="">
                  <div className="dropdown-container float-right">
                    <ImDownload
                      style={{ cursor: "pointer" }}
                      title="Download file"
                      size="35px"
                      className="dropdown-button"
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
              )}
            </Col>
          </Row>
          <CardBody style={{ marginTop: "-3rem" }}>
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
                      pagination={true}
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
                  {/* <Button onClick={this.HandleSetVisibleField} color="primary">
                    Submit
                  </Button> */}

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
      </>
    );
  }
}
export default purchasereportamount;
