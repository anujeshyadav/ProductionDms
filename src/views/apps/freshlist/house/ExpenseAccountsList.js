import React from "react";
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
  Spinner,
  Form,
  Label,
} from "reactstrap";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaPencilAlt } from "react-icons/fa";
import CreateUserSample from "../UploadFormats/CreateUserSample.xlsx";
import UserForm from "../UploadFormats/UserForm.pdf";
import { ImDownload } from "react-icons/im";
import { ContextLayout } from "../../../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import EditAccount from "../accounts/EditAccount";
import ViewAccount from "../accounts/ViewAccount";
import "jspdf-autotable";

import { Eye, Trash2, ChevronDown } from "react-feather";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import "../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../../../assets/scss/pages/users.scss";

import {
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaFilter,
  FaPlus,
} from "react-icons/fa";
import swal from "sweetalert";
import {
  DeleteAccount,
  _Delete,
  _Get,
  _Post,
  _PostSave,
  _Put,
} from "../../../../ApiEndPoint/ApiCalling";
import {
  BsFillArrowDownSquareFill,
  BsFillArrowUpSquareFill,
} from "react-icons/bs";
import UserContext from "../../../../context/Context";
import { CheckPermission } from "./CheckPermission";
import SuperAdminUI from "../../../SuperAdminUi/SuperAdminUI";
import {
  Create_Account_List,
  Create_Expense_Account,
  Delete_Expense_Account,
  Update_Expense_Account,
  View_Expense_Account,
} from "../../../../ApiEndPoint/Api";
import {
  convertDataCSVtoExcel,
  convertDataCsvToXml,
  exportDataToExcel,
  exportDataToPDF,
} from "./Downloader";

const SelectedColums = [];

class ExpenseAccountsList extends React.Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.gridRef = React.createRef();
    this.gridApi = null;
    this.state = {
      isOpen: false,
      MasterShow: false,
      AddAccounts: false,
      Edit: false,
      InsiderPermissions: {},
      formValues: [{ title: "" }],
      Arrindex: "",
      type: "Income",
      rowData: [],
      rowAllData: [],
      setMySelectedarr: [],
      SelectedCols: [],
      paginationPageSize: 12,
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
        //   headerName: "Status",
        //   field: "status",
        //   filter: true,
        //   width: 150,
        //   cellRendererFramework: (params) => {
        //     return params.data?.status === "Active" ? (
        //       <div className="badge badge-pill badge-success">
        //         {params.data?.status}
        //       </div>
        //     ) : params.data?.status === "Deactive" ? (
        //       <div className="badge badge-pill badge-warning">
        //         {params.data?.status}
        //       </div>
        //     ) : null;
        //   },
        // },

        // {
        //   headerName: "Image",
        //   field: "image",
        //   filter: true,
        //   sortable: true,
        //   editable: true,

        //   cellRendererFramework: (params) => {
        //     return (
        //       <>
        //         <div className="actions cursor-pointer d-flex justify-content-center">
        //           {params?.data?.image && (
        //             <img
        //               style={{ borderRadius: "10px" }}
        //               src={params?.data?.image ? params?.data?.image : null}
        //               height={45}
        //               width={45}
        //             />
        //           )}
        //         </div>
        //       </>
        //     );
        //   },
        // },

        {
          headerName: "Title",
          field: "title",
          filter: true,
          sortable: true,
          width: "180",
          cellRendererFramework: (params) => {
            return (
              <>
                <Route
                  render={({ history }) => (
                    <div className="actions cursor-pointer text-center">
                      <span>{params?.data?.title}</span>
                    </div>
                  )}
                />
              </>
            );
          },
        },
        {
          headerName: "id",
          field: "id",
          filter: true,
          width:170,
          sortable: true,
          editable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer text-center">
                  <span>{params?.data?.id}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "Type",
          field: "type",
          filter: true,
          sortable: true,
          width:175,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer text-center">
                  <span>{params?.data?.type}</span>
                </div>
              </>
            );
          },
        },

        {
          headerName: "Actions",
          field: "sortorder",
          field: "transactions",
          width: 75,
          cellRendererFramework: (params) => {
            return (
              <div className="actions cursor-pointer text-center">
                {this.state.InsiderPermissions &&
                  this.state.InsiderPermissions?.Edit && (
                    <Route
                      render={({ history }) => (
                        <span
                          style={{
                            border: "1px solid white",
                            padding: "5px",
                            borderRadius: "15px",
                            backgroundColor: "rgb(212, 111, 16)",
                            marginLeft: "3px",
                          }}>
                          <FaPencilAlt
                            className=""
                            size="15px"
                            color="white"
                            onClick={() => {
                              this.setState({
                                formValues: [params.data],
                                Edit: true,
                                AddAccounts: true,
                                type: params?.data?.type,
                              });

                              this.LookupviewStart();
                            }}
                          />
                        </span>
                      )}
                    />
                  )}
                {this.state.InsiderPermissions &&
                  this.state.InsiderPermissions?.Delete && (
                    <Route
                      render={() => (
                        <span
                          style={{
                            border: "1px solid white",
                            padding: "5px",
                            borderRadius: "15px",
                            backgroundColor: "rgb(236, 24, 9)",
                            marginLeft: "3px",
                          }}>
                          <Trash2
                            className=""
                            size="15px"
                            color="white"
                            onClick={() => {
                              this.runthisfunction(params?.data?._id);
                            }}
                          />
                        </span>
                      )}
                    />
                  )}
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

  handleSubmitAccount = async (e) => {
    this.setState({ loading: true });
    e.preventDefault();
    debugger;
    let user = JSON.parse(localStorage.getItem("userData"));
    if (this.state.Edit) {
      let payload = {
        // id: this.state.formValues[0].id,
        type: this.state.type,
        title: this.state.formValues[0].title,
        database: user?.database,
      };
      await _Put(Update_Expense_Account, this.state.formValues[0]._id, payload)
        .then((res) => {
          this.setState({ loading: false });
          this.componentDidMount();
          this.LookupviewStart();
          swal("success", "Updated Successfully", "success");
        })
        .catch((err) => {
          this.setState({ loading: false });

          console.log(err);
          swal("error", "Error Occured", "error");
        });
    } else {
      this.state.formValues?.forEach((ele) => {
        // ele["id"] = this.state.type;
        ele["type"] = this.state.type;
        ele["database"] = user?.database;
      });

      let payload = {
        CreateAccount: this.state.formValues,
      };

      await _PostSave(Create_Expense_Account, payload)
        .then((res) => {
          this.setState({ loading: false });

          this.componentDidMount();
          this.LookupviewStart();
          swal("success", "Added Successfully", "success");
        })
        .catch((err) => {
          this.setState({ loading: false });

          swal("error", "Error Occured", "error");
        });
    }
  };

  LookupviewStart = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };
  handleChange(i, e) {
    let formValues = this.state.formValues;
    const filteredValue = e.target.value.replace(/\s/g, "");
    formValues[i][e.target.name] = e.target.value;
    formValues[i]["id"] = filteredValue;
    this.setState({ formValues });
  }

  addFormFields() {
    this.setState({
      formValues: [...this.state.formValues, { title: "" }],
    });
  }

  removeFormFields(i) {
    let formValues = this.state.formValues;
    formValues.splice(i, 1);
    this.setState({ formValues });
  }

  async Apicalling(id, db) {
    let userinfo = JSON.parse(localStorage.getItem("userData"));

    this.setState({ Loading: true, AllcolumnDefs: this.state.columnDefs });

    let userHeading = JSON.parse(localStorage.getItem("ExpenseAccount"));
    if (userHeading?.length) {
      this.setState({
        columnDefs: userHeading,
        SelectedcolumnDefs: userHeading,
      });
      // this.gridApi.setColumnDefs(userHeading);
    } else {
      this.setState({
        columnDefs: this.state.columnDefs,
        SelectedcolumnDefs: this.state.columnDefs,
      });
    }
    this.setState({ SelectedCols: this.state.columnDefs });

    await _Get(View_Expense_Account, db)
      .then((res) => {
        this.setState({ Loading: false });
        let value = res?.Expenses;
        this.setState({ rowData: value });
        this.setState({ rowAllData: value });
      })
      .catch((err) => {
        this.setState({ Loading: false, rowData: [] });
        console.log(err);
      });
  }

  async componentDidMount() {
    const UserInformation = this.context?.UserInformatio;
    let pageparmission = JSON.parse(localStorage.getItem("userData"));

    if (pageparmission?.rolename?.roleName === "MASTER") {
      this.setState({ MasterShow: true });
    }
    const InsidePermissions = CheckPermission("Expense Accounts");
    this.setState({ InsiderPermissions: InsidePermissions });
    await this.Apicalling(pageparmission?._id, pageparmission?.database);
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
          _Delete(Delete_Expense_Account, id)
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

  exportToPDF = async () => {
    const csvData = this.gridApi.getDataAsCsv({
      processCellCallback: this.processCell,
    });
    await exportDataToPDF(csvData, "ExpensesList");
  };
  processCell = (params) => {
    return params.value;
  };

  exportToExcel = async (fileName, e) => {
    let data = this.state.rowAllData?.map((ele) => {
      return {
        id: ele?.id,
        title: ele?.title,
        type: ele?.type,
      };
    });
    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(dataBlob, `${fileName}.xlsx`);
    this.setState({ rowAllData: this.state.rowData });
    // const CsvData = this.gridApi.getDataAsCsv({
    //   processCellCallback: this.processCell,
    // });
    // const csvLines = CsvData.split("\r\n");
    // csvLines.shift();
    // let data = this.state.columnDefs?.map((ele) => {
    //   if (ele?.field?.includes(".")) {
    //     return ele?.field?.split(".")[1];
    //   } else {
    //     return ele?.field;
    //   }
    // });
    // data[0] = "UID";
    // csvLines.unshift(data);
    // const newCsvData = csvLines.join("\r\n");

    // await exportDataToExcel(newCsvData, "UserList", this.state.rowData);
  };

  convertCSVtoExcel = async (fileName) => {
    this.state.rowData?.forEach((ele) => {
      delete ele?.status;
      delete ele?.createdAt;
      delete ele?.created_by;
      delete ele?.__v;
      delete ele?._id;
      delete ele?.warehouse;
      delete ele?.code;
      delete ele?.database;
      delete ele?.rolename;
      delete ele?.password;
      delete ele?.deviceStatus;
      delete ele?.updatedAt;
      delete ele?.planStatus;
      delete ele?.setRule;
      delete ele?.branch;
      delete ele?.shift;
    });
    const worksheet = XLSX.utils.json_to_sheet(this.state.rowData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(dataBlob, `${fileName}.xls`);
    SVtoExcel(CsvData, "ExpensesList", this.state.rowData);
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
    await convertDataCsvToXml(CsvData, "ExpensesList");
  };

  HandleSetVisibleField = (e) => {
    e.preventDefault();
    this.gridApi.setColumnDefs(this.state.SelectedcolumnDefs);
    this.setState({ columnDefs: this.state.SelectedcolumnDefs });
    this.setState({ SelectedcolumnDefs: this.state.SelectedcolumnDefs });

    this.setState({ rowData: this.state.rowData });
    localStorage.setItem(
      "ExpenseAccount",
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
      isOpen,
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
                    onClick={(e) => {
                      e.preventDefault();
                      this.setState({ EditOneUserView: false });
                      this.componentDidMount();
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
                      <h1 className="float-left">View User</h1>
                    </Col>
                    <Col>
                      <div className="d-flex justify-content-end p-1">
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            this.setState({ ViewOneUserView: false });
                          }}
                          color="danger"
                          style={{ textTransform: "uppercase" }}>
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
                      <Row style={{ marginLeft: "3px", marginRight: "3px" }}>
                        <Col>
                          <Row>
                            <Col lg="5" md="5" xl="5" xs="12">
                              <h2
                                className="float-left "
                                style={{
                                  fontWeight: "600",
                                  textTransform: "uppercase",
                                  fontSize: "18px",
                                  marginTop: "25px",
                                }}>
                                Expense Accounts
                              </h2>
                            </Col>
                            <Col
                              lg="7"
                              md="7"
                              xl="7"
                              xs="12"
                              style={{ marginTop: "25px" }}>
                              {this.state.MasterShow ? (
                                <SuperAdminUI
                                  onDropdownChange={this.handleDropdownChange}
                                  onSubmit={this.handleParentSubmit}
                                />
                              ) : (
                                <Col></Col>
                              )}
                            </Col>
                          </Row>
                        </Col>

                        <Col
                          lg="3"
                          md="6"
                          sm="12"
                          style={{ marginTop: "25px" }}>
                          <div className="">
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

                        {InsiderPermissions && InsiderPermissions.Create && (
                          <>
                            <Col
                              lg="2"
                              xl="2"
                              md="5"
                              style={{ marginTop: "25px" }}>
                              <Route
                                render={({ history }) => (
                                  <Button
                                    style={{
                                      cursor: "pointer",
                                      backgroundColor: "rgb(8, 91, 245)",
                                      color: "white",
                                      height: "43px",
                                      fontWeight: "600",
                                      width: "100%",
                                      textTransform: "uppercase",
                                    }}
                                    className="float-right "
                                    color="#39cccc"
                                    onClick={() => {
                                      this.setState({
                                        AddAccounts: true,
                                        Edit: false,
                                        formValues: [{ title: "" }],
                                        type: "Income",
                                      });
                                      this.LookupviewStart();
                                    }}>
                                    Accounts
                                  </Button>
                                )}
                              />
                            </Col>
                          </>
                        )}

                        <Col lg="1" md="1" xl="1" style={{ marginTop: "25px" }}>
                          {InsiderPermissions && InsiderPermissions.View && (
                            <>
                              <span className="">
                                <FaFilter
                                  style={{ cursor: "pointer" }}
                                  title="filter coloumn"
                                  size="35px"
                                  onClick={() => {
                                    this.setState({
                                      AddAccounts: false,
                                    });
                                    this.LookupviewStart();
                                  }}
                                  color="rgb(8, 91, 245)"
                                  className="float-right "
                                />
                              </span>
                            </>
                          )}
                          {InsiderPermissions &&
                            InsiderPermissions.Download && (
                              <>
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
                                        {/* <h5
                                          onClick={() =>
                                            this.gridApi.exportDataAsCsv()
                                          }
                                          style={{ cursor: "pointer" }}
                                          className=" mx-1 myactive"
                                        >
                                          .CSV
                                        </h5> */}
                                        {/* <h5
                                          onClick={() =>
                                            this.convertCSVtoExcel("UserList")
                                          }
                                          style={{ cursor: "pointer" }}
                                          className=" mx-1 myactive"
                                        >
                                          .XLS
                                        </h5> */}
                                        <h5
                                          onClick={() =>
                                            this.exportToExcel("ExpensesList")
                                          }
                                          style={{ cursor: "pointer" }}
                                          className=" mx-1 myactive">
                                          .XLSX
                                        </h5>
                                        {/* <h5
                                          onClick={() => this.convertCsvToXml()}
                                          style={{ cursor: "pointer" }}
                                          className=" mx-1 myactive"
                                        >
                                          .XML
                                        </h5> */}

                                        {/* {InsiderPermissions &&
                                          InsiderPermissions?.BulkUpload && (
                                            <h5>
                                              <a
                                                style={{
                                                  cursor: "pointer",
                                                  color: "black",
                                                }}
                                                className=" mx-1 myactive"
                                                href={CreateUserSample}
                                                download>
                                                . Format
                                              </a>
                                            </h5>
                                          )} */}
                                      </div>
                                    )}
                                  </div>
                                </span>
                              </>
                            )}
                        </Col>
                      </Row>
                      {InsiderPermissions && InsiderPermissions?.View && (
                        <>
                          {this.state.rowData === null ? null : (
                            <div>
                              <div
                                className="ag-theme-material w-100  ag-grid-table card-body"
                                style={{ marginTop: "-1rem" }}>
                                <ContextLayout.Consumer className="ag-theme-alpine">
                                  {(context) => (
                                    <AgGridReact
                                      id="myAgGrid"
                                      gridOptions={{
                                        enableRangeSelection: true,
                                        enableClipboard: true,
                                      }}
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
                                      enableRtl={
                                        context.state.direction === "rtl"
                                      }
                                      ref={this.gridRef}
                                      domLayout="autoHeight"
                                    />
                                  )}
                                </ContextLayout.Consumer>
                              </div>
                            </div>
                          )}
                        </>
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
          style={{ maxWidth: "1050px" }}>
          <ModalHeader toggle={this.LookupviewStart}>
            {this.state.AddAccounts ? "Account" : "Fields"}
          </ModalHeader>
          <ModalBody className="modalbodyhead">
            {this.state.AddAccounts ? (
              <>
                {" "}
                <Form onSubmit={this.handleSubmitAccount}>
                  <Row>
                    <Col lg="12" md="12" sm="12" className="mb-2 mt-1">
                      <h4 className="mb-1">Account Type</h4>
                      <div
                        className="form-label-group"
                        onChange={(e) => {
                          this.setState({ type: e.target.value });
                        }}>
                        <input
                          required
                          checked={this.state.type == "Income"}
                          style={{ marginRight: "3px" }}
                          type="radio"
                          name="type"
                          value="Income"
                        />
                        <span style={{ marginRight: "20px" }}>Income</span>

                        <input
                          required
                          checked={this.state.type == "Expense"}
                          style={{ marginRight: "3px" }}
                          type="radio"
                          name="type"
                          value="Expense"
                        />
                        <span style={{ marginRight: "20px" }}>Expense</span>
                        <input
                          required
                          checked={this.state.type == "Revenue"}
                          style={{ marginRight: "3px" }}
                          type="radio"
                          name="type"
                          value="Revenue"
                        />
                        <span style={{ marginRight: "3px" }}>Revenue</span>
                      </div>
                    </Col>
                  </Row>
                  {this.state.formValues?.map((element, index) => (
                    <Row key={index}>
                      <Col className="mt-1" lg="4" md="4" sm="6">
                        <Label>Title *</Label>
                        <Input
                          required
                          type="text"
                          placeholder={`Enter ${this.state.type} Title`}
                          name="title"
                          value={element.title || ""}
                          onChange={(e) => this.handleChange(index, e)}
                        />
                      </Col>
                      {this.state.AddAccounts && this.state.Edit ? (
                        <></>
                      ) : (
                        <>
                          <Col lg="4" md="4" sm="6">
                            {index ? (
                              <Button
                                type="button"
                                className="mt-3"
                                color="danger"
                                onClick={() => this.removeFormFields(index)}>
                                Remove
                              </Button>
                            ) : null}
                          </Col>
                        </>
                      )}
                    </Row>
                  ))}
                  {this.state.AddAccounts && this.state.Edit ? null : (
                    <>
                      <Row>
                        <Col className="d-flex justify-content-end">
                          <Button
                            className="button add"
                            color="primary"
                            type="button"
                            onClick={() => this.addFormFields()}>
                            Add
                          </Button>
                        </Col>
                      </Row>
                    </>
                  )}

                  <div className="button-section d-flex justify-content-center">
                    <Button
                      color={!this.state.loading ? "primary" : "secondary"}
                      type="submit">
                      {!this.state.loading ? "Submit" : "Loading..."}
                    </Button>
                  </div>
                </Form>
                {/* <Form>
                  <Row>
                    <Col>
                      <Label>Account Name:</Label>
                      <Input
                        type="text"
                        name="accountName"
                        onChange={this.handleChange}
                        value={this.state.accountName}
                      />
                    </Col>
                    <Col>
                      <Button color="primary">Add</Button>
                    </Col>
                  </Row>
                </Form> */}
              </>
            ) : (
              <>
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
                                      <input type="checkbox" className="mx-1" />

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
                  <Col
                    lg="2"
                    md="2"
                    sm="12"
                    xl="2"
                    xs="12"
                    className="colarrowbtn">
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

                                              if (
                                                SelectedCols &&
                                                delindex >= 0
                                              ) {
                                                const splicedElement =
                                                  SelectedCols.splice(
                                                    delindex,
                                                    1
                                                  );
                                                this.setState({
                                                  SelectedcolumnDefs:
                                                    SelectedCols,
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
                      <Button
                        onClick={this.HandleSetVisibleField}
                        color="primary">
                        Submit
                      </Button>
                    </div>
                  </Col>
                </Row>
              </>
            )}
          </ModalBody>
        </Modal>
      </>
    );
  }
}
export default ExpenseAccountsList;
