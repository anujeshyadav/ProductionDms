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
  Badge,
  Label,
  CustomInput,
  Form,
  Spinner,
} from "reactstrap";
import { ContextLayout } from "../../../../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import ViewUnit from "./ViewUnit";
import EditUnit from "./EditUnit";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Logo from "../../../../../assets/img/profile/pages/logomain.png";
import Papa from "papaparse";
import { FaPlus } from "react-icons/fa";
import { Eye, Trash2, ChevronDown, Edit, CloudLightning } from "react-feather";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import { history } from "../../../../../history";
import "../../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../../../../assets/scss/pages/users.scss";
import { Route } from "react-router-dom";

import {
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaFilter,
} from "react-icons/fa";
import swal from "sweetalert";
import {
  DeleteUnitList,
  UnitListView,
  SaveUnit,
  SaveAddPrimary_Unit,
  UnitUpdate,
  _PostSave,
  _GetList,
  _Get,
  _Delete,
  _Put,
} from "../../../../../ApiEndPoint/ApiCalling";
import {
  BsFillArrowDownSquareFill,
  BsFillArrowUpSquareFill,
} from "react-icons/bs";
import * as XLSX from "xlsx";
import UserContext from "../../../../../context/Context";
import {
  AddOther_Charges,
  DeleteOne_Other_Charges,
  UpdateOne_Other_Charges,
  ViewOther_Charges,
} from "../../../../../ApiEndPoint/Api";
import { CheckPermission } from "../../house/CheckPermission";
import SuperAdminUI from "../../../../SuperAdminUi/SuperAdminUI";
const SelectedColums = [];
class AddOtherChargesList extends React.Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.gridRef = React.createRef();
    this.gridApi = null;
    this.state = {
      isOpen: false,
      MasterShow: false,
      Arrindex: "",
      InsiderPermissions: {},
      chargestype: "",
      chargesPercentage: "",
      Amount: "",
      gstPercentage: "",
      rowData: [],
      baseubitListView: [],
      baseUnit: "",
      unitId: "",
      primaryUnit: "",
      secondaryNumber: null,
      secondaryUnit: "",
      unitQty: 0,
      isDisable: false,
      formData: {},
      isUpdate: false,
      IsprimaryUnit: false,
      setMySelectedarr: [],
      SelectedCols: [],
      paginationPageSize: 5,
      currenPageSize: "",
      getPageSize: "",
      columnDefs: [
        {
          headerName: "Actions",
          field: "sortorder",
          field: "transactions",
          width: 190,
          cellRendererFramework: (params) => {
            return (
              <div className="actions cursor-pointer">
                <Route
                  render={({ history }) => (
                    <Eye
                      className="mr-50"
                      size="25px"
                      color="green"
                      onClick={() => {
                        this.handleChangeEdit(params.data, "readonly");
                      }}
                    />
                  )}
                />
                <Route
                  render={({ history }) => (
                    <Edit
                      className="mr-50"
                      size="25px"
                      color="blue"
                      onClick={() => {
                        this.handleChangeEdit(params.data, "Editable");
                      }}
                    />
                  )}
                />

                <Route
                  render={() => (
                    <Trash2
                      className="mr-50"
                      size="25px"
                      color="red"
                      onClick={() => {
                        this.runthisfunction(params?.data?._id);
                      }}
                    />
                  )}
                />
              </div>
            );
          },
        },

        {
          headerName: "Title",
          field: "title",
          filter: true,
          sortable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer">
                  <span>{params?.data?.title}</span>
                </div>
              </>
            );
          },
        },
        // {
        //   headerName: "Type",
        //   field: "type",
        //   filter: true,
        //   sortable: true,
        //   cellRendererFramework: (params) => {
        //     return (
        //       <>
        //         <div className="actions cursor-pointer">
        //           <span>{`${params?.data?.type}`}</span>
        //         </div>
        //       </>
        //     );
        //   },
        // },

        {
          headerName: "Percentage",
          field: "percentage",
          filter: true,
          sortable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer d-flex justify-content-center">
                  <span>{params?.data?.percentage}</span>
                </div>
              </>
            );
          },
        },
        // {
        //   headerName: "createdAt",
        //   field: "createdAt",
        //   filter: true,
        //   sortable: true,
        //   cellRendererFramework: (params) => {
        //     return (
        //       <>
        //         <div className="actions cursor-pointer">
        //           <span>{params?.data?.createdAt}</span>
        //         </div>
        //       </>
        //     );
        //   },
        // },
        // {
        //   headerName: "updatedAt",
        //   field: "updatedAt",
        //   filter: true,
        //   sortable: true,
        //   width: 240,
        //   cellRendererFramework: (params) => {
        //     return (
        //       <>
        //         <div className="actions cursor-pointer">
        //           <span>{params?.data?.updatedAt}</span>
        //         </div>
        //       </>
        //     );
        //   },
        // },
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
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };
  LookCreateUnit = () => {
    this.setState((prevState) => ({
      unitModal: !prevState.unitModal,
    }));
    this.setState({ type: "Discount" });
  };

  handleChangeEdit = (data, types) => {
    this.setState((prevState) => ({
      unitModal: !prevState.unitModal,
    }));
    this.setState({ title: data?.title });
    this.setState({ type: data?.type });
    this.setState({ chargesPercentage: data?.percentage });

    let type = types;
    if (type == "readonly") {
      this.setState({ isDisable: true });
    } else {
      this.setState({ unitId: data?._id });
      this.setState({ isUpdate: true });
      this.setState({ isDisable: false });
    }
  };

  changeHandlerInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSave = async (e) => {
    e.preventDefault();
    let userInfo = JSON.parse(localStorage.getItem("userData"));
    // let amount = Number(this.state.Amount);
    // let Percentage = Number(this.state.gstPercentage);
    // let Value = (amount * Percentage) / 100;
    let payload = {
      type: this.state.type,
      title: this.state.title,
      // amount: amount,
      percentage: Number(this.state.chargesPercentage),
      // value: Value,
      database: userInfo?.database,
    };

    if (this.state.isUpdate) {
      await _Put(UpdateOne_Other_Charges, this.state.unitId, payload)
        .then((res) => {
          console.log(res);
          swal("Updated Successfully");
          this.setState((prevState) => ({
            unitModal: !prevState.unitModal,
          }));
          this.Apicalling(userInfo?._id, userInfo?.database);
        })
        .catch((err) => {
          swal("error", "Error occured Try again");
          console.log(err);
        });
    } else {
      debugger;
      await _PostSave(AddOther_Charges, payload)
        .then((res) => {
          console.log(res);
          swal("Added Successfully");
          this.setState((prevState) => ({
            unitModal: !prevState.unitModal,
          }));
          this.Apicalling(userInfo?._id, userInfo?.database);
        })
        .catch((err) => {
          console.log(err);
          swal("error", "Error occured Try again");
        });
    }
  };

  async Apicalling(id, db) {
    this.setState({ Loading: true });
    _Get(ViewOther_Charges, db)
      .then((res) => {
        this.setState({ Loading: false });
        console.log(res?.OtherCharges);
        let value = res?.OtherCharges;
        if (value?.length) {
          this.setState({ rowData: value });
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ Loading: false });
        this.setState({ rowData: [] });
      });
  }
  async componentDidMount() {
    const UserInformation = this.context?.UserInformatio;
    let pageparmission = JSON.parse(localStorage.getItem("userData"));

    if (pageparmission?.rolename?.roleName === "MASTER") {
      this.setState({ MasterShow: true });
    }
    const InsidePermissions = CheckPermission("Add Charges");
    this.setState({ InsiderPermissions: InsidePermissions });

    await this.Apicalling(pageparmission?._id, pageparmission?.database);

    this.setState({ AllcolumnDefs: this.state.columnDefs });
    let userHeading = JSON.parse(localStorage.getItem("ExtraChargesList"));
    if (userHeading?.length) {
      this.setState({ columnDefs: userHeading });
      // this.gridApi.setColumnDefs(userHeading);
      this.setState({ SelectedcolumnDefs: userHeading });
    } else {
      this.setState({ columnDefs: this.state.columnDefs });
      this.setState({ SelectedcolumnDefs: this.state.columnDefs });
    }
    this.setState({ SelectedCols: this.state.columnDefs });
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
          _Delete(DeleteOne_Other_Charges, id)
            .then((res) => {
              let selectedData = this.gridApi.getSelectedRows();
              this.gridApi.updateRowData({ remove: selectedData });
              swal("Deleted", "Record has been deleted", "success");
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
      "ExtraChargesList",
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
      InsiderPermissions,
      isOpen,
      SelectedCols,
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
              <EditUnit ViewOneData={this.state.ViewOneData} />
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

                    <ViewUnit ViewOneData={this.state.ViewOneData} />
                  </Row>
                </>
              ) : (
                <>
                  <Col sm="12">
                    <Card>
                      <Row className="mt-2 ml-2 mr-2 ">
                        <Col>
                          <h1
                            className="float-left "
                            style={{ fontWeight: "600" }}>
                            Discount List
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
                          {InsiderPermissions && InsiderPermissions.View && (
                            <>
                              <span className="mx-1">
                                <FaFilter
                                  style={{ cursor: "pointer" }}
                                  title="filter coloumn"
                                  size="35px"
                                  onClick={this.LookupviewStart}
                                  color="#39cccc"
                                  className="float-right mb-1"
                                />
                              </span>
                            </>
                          )}
                          {InsiderPermissions &&
                            InsiderPermissions?.Download && (
                              <>
                                <span
                                  onMouseEnter={this.toggleDropdown}
                                  onMouseLeave={this.toggleDropdown}
                                  className="mx-1">
                                  <div className="dropdown-container float-right">
                                    <ImDownload
                                      style={{ cursor: "pointer" }}
                                      title="download file"
                                      size="35px"
                                      className="dropdown-button mb-1"
                                      color="#39cccc"
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
                                </span>
                              </>
                            )}
                          <span>
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
                                  onClick={this.LookCreateUnit}>
                                  <FaPlus size={15} />
                                  Charges
                                </Button>
                              )}
                            />
                          </span>
                        </Col>
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
                    <h4>Avalable Columns</h4>
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

        {/* Create Charges */}
        <Modal
          isOpen={this.state.unitModal}
          toggle={this.LookCreateUnit}
          className={this.props.className}>
          <ModalHeader toggle={this.LookCreateUnit}>Add</ModalHeader>
          <ModalBody className="modalbodyheadunit">
            <div className="d-flex justify-content-center mb-2 mt-1">
              <h4>Add Discount</h4>
            </div>
            <Form className="m-1" onSubmit={this.handleSave}>
              <div
                className="form-label-group"
                onChange={(e) => {
                  this.setState({ type: e.target.value });
                }}>
                {/* <input
                  required
                  checked={this.state.type == "Charges"}
                  style={{ marginRight: "3px" }}
                  type="radio"
                  name="status"
                  value="Charges"
                />
                <span style={{ marginRight: "20px" }}>Add Charges</span> */}

                {/* <input
                  required
                  checked={this.state.type == "Discount"}
                  style={{ marginRight: "3px" }}
                  type="radio"
                  name="status"
                  value="Discount"
                />
                <span style={{ marginRight: "3px" }}>Add Discount</span> */}
              </div>
              <Row className="justifyContent-around mt-2">
                <Col lg="6" md="6" sm="12">
                  <Label> {this.state.type && this.state.type} Title</Label>
                  <Input
                    className="mb-1"
                    placeholder="Enter Type"
                    value={this.state.title}
                    required
                    onChange={this.changeHandlerInput}
                    type="text"
                    name="title"
                  />
                </Col>

                {/* <Col lg="6" md="6" sm="12">
                  <Label>Amount</Label>
                  <Input
                    className="mb-1"
                    value={this.state.Amount}
                    required
                    placeholder="Enter Amount"
                    onChange={this.changeHandlerInput}
                    type="number"
                    name="Amount"
                  />
                </Col> */}
                <Col lg="6" md="6" sm="12">
                  <Label>
                    {this.state.type && this.state.type} Percentage %
                  </Label>
                  <Input
                    className="mb-1"
                    placeholder={`Enter Percentage ${this.state.type}`}
                    value={this.state.chargesPercentage}
                    required
                    onChange={this.changeHandlerInput}
                    type="number"
                    name="chargesPercentage"
                  />
                </Col>
              </Row>

              <hr></hr>
              <Row className="justify-content-end modalbodyheadunit">
                <Col lg="12" md="12">
                  <div className="d-flex justify-content-center">
                    <Button
                      type="submit"
                      disabled={this.state.isDisable ? true : false}
                      color="primary">
                      Save
                    </Button>
                  </div>
                </Col>
              </Row>
              <hr></hr>
            </Form>
          </ModalBody>
        </Modal>
      </>
    );
  }
}
export default AddOtherChargesList;
