import React from "react";
import { Route, Link } from "react-router-dom";
import { FaPencilAlt } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
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
} from "reactstrap";
import UserForm from "../UploadFormats/Transporter.pdf";
import { ImDownload } from "react-icons/im";
import TransporterSample from "../UploadFormats/TransporterSample.xlsx";
import { ContextLayout } from "../../../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import EditAccount from "../accounts/EditTransport";
import ViewAccount from "../accounts/ViewTransport";

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
import { _Delete, _Get, _GetList } from "../../../../ApiEndPoint/ApiCalling";
import {
  BsFillArrowDownSquareFill,
  BsFillArrowUpSquareFill,
} from "react-icons/bs";

import UserContext from "../../../../context/Context";
import { CheckPermission } from "./CheckPermission";
import SuperAdminUI from "../../../SuperAdminUi/SuperAdminUI";
import {
  Create_Transporter_List,
  Delete_Transporter_List,
  Image_URL,
} from "../../../../ApiEndPoint/Api";
import {
  convertDataCSVtoExcel,
  convertDataCsvToXml,
  exportDataToExcel,
  exportDataToPDF,
} from "./Downloader";

const SelectedColums = [];

class CreateTransportList extends React.Component {
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
      InsiderPermissions: {},
      setMySelectedarr: [],
      SelectedCols: [],
      paginationPageSize: 10,
      currenPageSize: "",
      getPageSize: "",
      columnDefs: [
        {
          headerName: "ID",
          field: "id",
          filter: true,
          sortable: true,

          editable: true,
          width: 155,

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
          headerName: "Company Name",
          field: "companyName",
          filter: true,
          width: 200,
          sortable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <div
                  title="Click to Edit Transporter"
                  className="actions cursor-pointer text-center">
                  <Link
                    style={{ color: "black" }}
                    to={`/app/ajgroup/transporter/CreateTransporter/${params?.data?._id}`}>
                    <span>{params?.data?.companyName}</span>
                  </Link>
                </div>
              </>
            );
          },
        },
        {
          headerName: "Contact Number",
          field: "contactNumber",
          width: 135,
          filter: true,
          sortable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer text-center">
                  <span>{params?.data?.contactNumber}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "Name",
          field: "name",
          filter: true,
          width: 220,
          sortable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer text-center">
                  <span>{params?.data?.name}</span>
                </div>
              </>
            );
          },
        },

        {
          headerName: "Email",
          field: "email",
          width: 220,
          filter: true,
          sortable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer text-center">
                  <span>{params?.data?.email}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "Pin Code",
          field: "pincode",
          filter: true,
          width: 80,
          sortable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer text-center">
                  <span>{params?.data?.pincode}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "City",
          field: "city",
          width: 130,
          filter: true,
          sortable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer text-center">
                  <span>{params?.data?.city}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "State",
          field: "state",
          filter: true,
          width: 160,
          sortable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer text-center">
                  <span>{params?.data?.state}</span>
                </div>
              </>
            );
          },
        },

        {
          headerName: "Created Date",
          field: "createdAt",
          width: 115,
          filter: true,
          sortable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer text-center">
                  <span>{params?.data?.createdAt?.split("T")[0]}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "Updated Date",
          field: "updatedAt",
          filter: true,
          width: 115,
          sortable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer text-center">
                  <div className="actions cursor-pointer">
                    <span>{params?.data?.updatedAt?.split("T")[0]}</span>
                  </div>
                </div>
              </>
            );
          },
        },
        {
          headerName: "Status",
          field: "status",
          filter: true,
          width: 80,
          cellRendererFramework: (params) => {
            return params.data?.status === "Active" ? (
              <div className="text-center">{params.data?.status}</div>
            ) : params.data?.status === "Deactive" ? (
              <div className="text-center">{params.data?.status}</div>
            ) : null;
          },
        },
        // {
        //   headerName: "Image",
        //   field: "image",
        //   filter: true,
        //   width: 90,
        //   sortable: true,
        //   cellRendererFramework: (params) => {
        //     return (
        //       <>
        //         <div className="actions cursor-pointer text-center">
        //           {params?.data?.image && (
        //             <img
        //               width={40}
        //               height={40}
        //               src={`${Image_URL}/Images/${params?.data?.image}`}
        //               alt="Img"
        //             />
        //           )}
        //         </div>
        //       </>
        //     );
        //   },
        // },
        // {
        //   headerName: "Id",
        //   field: "id",
        //   filter: true,
        //   sortable: true,

        //   editable: true,
        //   width: 228,

        //   cellRendererFramework: (params) => {
        //     return (
        //       <>
        //         <div
        //           onClick={() => this.copyToClipboard(params?.data?.id)}
        //           className="actions cursor-pointer text-center">
        //           <span>
        //             {params?.data?.id ? params?.data?.id : params?.data?.id}
        //           </span>
        //         </div>
        //       </>
        //     );
        //   },
        // },
        {
          headerName: "Role Id",
          field: "rolename?.id",
          filter: true,
          sortable: true,

          editable: true,
          width: 150,

          cellRendererFramework: (params) => {
            // debugger;
            return (
              <>
                <div
                  // onClick={() =>
                  // this.copyToClipboard(params?.data?.rolename?.id)
                  // }
                  className="actions cursor-pointer text-center">
                  <span>
                    {params?.data?.rolename?.id
                      ? params?.data?.rolename?.id
                      : params?.data?.rolename?.id}
                  </span>
                </div>
              </>
            );
          },
        },

        {
          headerName: "Actions",
          field: "sortorder",
          field: "transactions",
          width: 105,
          cellRendererFramework: (params) => {
            return (
              <div className="actions cursor-pointer text-center">
                {this.state.InsiderPermissions &&
                  this.state.InsiderPermissions?.View && (
                    <Route
                      render={({ history }) => (
                        <span
                          style={{
                            border: "1px solid white",
                            padding: "5px",
                            borderRadius: "15px",
                            backgroundColor: "#39cccc",
                          }}>
                          <Eye
                            className=""
                            size="15px"
                            color="white"
                            onClick={() =>
                              history.push(
                                `/app/ajgroup/transporter/EditTransporter/${params?.data?._id}`
                              )
                            }
                          />
                        </span>
                      )}
                    />
                  )}
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
                              history.push(
                                `/app/ajgroup/transporter/CreateTransporter/${params?.data?._id}`
                              );
                            }}
                            // onClick={() => {
                            //   this.handleChangeEdit(params?.data, "Editable");
                            // }}
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
  copyToClipboard = (values) => {
    navigator.clipboard.writeText(values).then(() => {
      alert(`Copied: ${values}`);
    });
  };
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
  async Apicalling(id, db) {
    this.setState({ Loading: true });
    this.setState({ AllcolumnDefs: this.state.columnDefs });
    let userHeading = JSON.parse(localStorage.getItem("TransporterList"));
    if (userHeading?.length) {
      this.setState({ columnDefs: userHeading });
      // this.gridApi.setColumnDefs(userHeading);
      this.setState({ SelectedcolumnDefs: userHeading });
    } else {
      this.setState({ columnDefs: this.state.columnDefs });
      this.setState({ SelectedcolumnDefs: this.state.columnDefs });
    }
    this.setState({ SelectedCols: this.state.columnDefs });

    await _Get(Create_Transporter_List, db)
      .then((res) => {
        this.setState({ Loading: false });

        let value = res?.Transporter;
        console.log(value);
        if (value?.length) {
          this.setState({ rowData: value.reverse() });
          this.setState({ rowAllData: value.reverse() });
        }
      })
      .catch((err) => {
        this.setState({ Loading: false });

        console.log(err);
      });
  }
  async componentDidMount() {
    const UserInformation = this.context?.UserInformatio;
    const InsidePermissions = CheckPermission("Create Transporter");
    this.setState({ InsiderPermissions: InsidePermissions });
    let userData = JSON.parse(localStorage.getItem("userData"));
    if (userData?.rolename?.roleName === "MASTER") {
      this.setState({ MasterShow: true });
    }
    await this.Apicalling(userData?._id, userData?.database);
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
          _Delete(Delete_Transporter_List, id)
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
    await exportDataToPDF(csvData, "TransporterList");
  };
  processCell = (params) => {
    return params.value;
  };

  exportToExcel = async (fileName, e) => {
    let data = this.state.rowAllData?.map((ele) => {
      return {
        id: ele?.id,
        rolename: ele?.rolename?.id,
        name: ele?.name,
        email: ele?.email,
        contactNumber: ele?.contactNumber,
        email: ele?.email,
        pincode: ele?.pincode,
        address1: ele?.address1,
        address2: ele?.address2,
        companyName: ele?.companyName,
        gstNumber: ele?.gstNumber,
        state: ele?.state,
        city: ele?.city,
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
  };

  convertCSVtoExcel = async (fileName) => {
    this.state.rowData?.forEach((ele) => {
      delete ele?.createdAt;
      delete ele?.createdAt;
      delete ele?.updatedAt;
      delete ele?.status;
      // delete ele?.serviceArea;
      delete ele?.__v;
      delete ele?._id;
      delete ele?.database;
      delete ele?.rolename;
      delete ele?.password;
      // delete ele?.gstNumber;
    });
    const worksheet = XLSX.utils.json_to_sheet(this.state.rowData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xls",
      type: "array",
    });

    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(dataBlob, `${fileName}.xls`);
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
    await convertDataCsvToXml(CsvData, "TransporterList");
  };

  HandleSetVisibleField = (e) => {
    e.preventDefault();
    this.gridApi.setColumnDefs(this.state.SelectedcolumnDefs);
    this.setState({ columnDefs: this.state.SelectedcolumnDefs });
    this.setState({ SelectedcolumnDefs: this.state.SelectedcolumnDefs });
    this.setState({ rowData: this.state.rowData });
    localStorage.setItem(
      "TransporterList",
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

      AllcolumnDefs,
      InsiderPermissions,
    } = this.state;
    return (
      <>
        {/* <ExcelReader /> */}
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
                      <Row
                        style={{
                          marginRight: "5px",
                          marginTop: "10px",
                          marginLeft: "5px",
                        }}>
                        <Col lg="5" xl="5" md="5">
                          <Row>
                            <Col
                              style={{ marginTop: "10px" }}
                              xl="5"
                              lg="5"
                              xs="12">
                              <h2
                                className="float-left"
                                style={{
                                  fontWeight: "600",
                                  textTransform: "uppercase",
                                  fontSize: "24px",
                                }}>
                                Transporter List
                              </h2>
                            </Col>
                            {this.state.MasterShow ? (
                              <Col
                                lg="7"
                                md="7"
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
                          </Row>
                        </Col>
                        <Col
                          lg="3"
                          md="3"
                          xs="12"
                          style={{ marginTop: "10px" }}>
                          <div className="">
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
                            </div>
                            <div className="table-input cssforproductlist">
                              <Input
                                style={{ width: "100%" }}
                                placeholder="search Item here..."
                                onChange={(e) =>
                                  this.updateSearchQuery(e.target.value)
                                }
                                value={this.state.value}
                              />
                            </div>
                          </div>
                        </Col>

                        <Col lg="4" xl="4">
                          <Row>
                            <Col
                              lg="4"
                              xl="4"
                              xs="5"
                              style={{ marginTop: "10px" }}>
                              {InsiderPermissions &&
                                InsiderPermissions?.Download && (
                                  <span>
                                    <a
                                      title="Create User Format Download here"
                                      target="_blank"
                                      href={UserForm}
                                      download={UserForm}>
                                      <Button
                                        style={{
                                          cursor: "pointer",
                                          backgroundColor: "rgb(8, 91, 245)",
                                          color: "white",
                                          fontWeight: "500",
                                          width: "100%",
                                          height: "43px",
                                          textTransform: "uppercase",
                                          paddingTop: "11px  ",
                                        }}
                                        className="float-left"
                                        color="#39cccc">
                                        Format
                                      </Button>
                                    </a>
                                  </span>
                                )}
                            </Col>
                            <Col
                              lg="5"
                              xl="5"
                              xs="7"
                              style={{ marginTop: "10px" }}>
                              {InsiderPermissions &&
                                InsiderPermissions?.Create && (
                                  <span>
                                    <Route
                                      render={({ history }) => (
                                        <Button
                                          style={{
                                            cursor: "pointer",
                                            backgroundColor: "rgb(8, 91, 245)",
                                            color: "white",
                                            fontWeight: "500",
                                            textTransform: "uppercase",
                                            paddingLeft: "20px",
                                            height: "43px",
                                          }}
                                          className="float-left  "
                                          color="#39cccc"
                                          onClick={() =>
                                            history.push(
                                              `/app/ajgroup/transporter/CreateTransporter/${0}`
                                            )
                                          }>
                                          <FaPlus
                                            size={13}
                                            style={{ marginRight: "2px" }}
                                          />
                                          Transporter
                                        </Button>
                                      )}
                                    />
                                  </span>
                                )}
                            </Col>
                            <Col lg="3" xl="3" style={{ marginTop: "10px" }}>
                              {InsiderPermissions &&
                                InsiderPermissions?.View && (
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

                              {InsiderPermissions &&
                                InsiderPermissions?.Download && (
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
                                            fontWeight: "500",
                                          }}
                                          className="dropdown-content dropdownmy">
                                          <h5
                                            onClick={() => this.exportToPDF()}
                                            style={{ cursor: "pointer" }}
                                            className=" mx-1 myactive mt-1">
                                            . PDF
                                          </h5>
                                          {/* <h5
                                            onClick={() =>
                                              this.gridApi.exportDataAsCsv()
                                            }
                                            style={{ cursor: "pointer" }}
                                            className=" mx-1 myactive"
                                          >
                                            . CSV
                                          </h5> */}
                                          {/* <h5
                                            onClick={() =>
                                              this.convertCSVtoExcel(
                                                "TransportList"
                                              )
                                            }
                                            style={{ cursor: "pointer" }}
                                            className=" mx-1 myactive"
                                          >
                                            . XLS
                                          </h5> */}
                                          <h5
                                            onClick={(e) =>
                                              this.exportToExcel(
                                                "TransportList"
                                              )
                                            }
                                            style={{ cursor: "pointer" }}
                                            className=" mx-1 myactive">
                                            . XLSX
                                          </h5>
                                          {/* <h5
                                            onClick={() =>
                                              this.convertCsvToXml(
                                                "TransportList"
                                              )
                                            }
                                            style={{ cursor: "pointer" }}
                                            className=" mx-1 myactive"
                                          >
                                            . XML
                                          </h5> */}
                                          {InsiderPermissions &&
                                            InsiderPermissions?.BulkUpload && (
                                              <h5>
                                                <a
                                                  style={{
                                                    cursor: "pointer",
                                                    color: "black",
                                                  }}
                                                  className=" mx-1 myactive"
                                                  href={TransporterSample}
                                                  download>
                                                  . Format
                                                </a>
                                              </h5>
                                            )}
                                        </div>
                                      )}
                                    </div>
                                  </span>
                                )}
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      {InsiderPermissions && InsiderPermissions?.View && (
                        <>
                          {this.state.rowData === null ? null : (
                            <div>
                              <div
                                className="ag-theme-material w-100   ag-grid-table card-body"
                                style={{ marginTop: "-1rem" }}>
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
                                      enableRtl={
                                        context.state.direction === "rtl"
                                      }
                                      ref={this.gridRef} // Attach the ref to the grid
                                      domLayout="autoHeight" // Adjust layout as needed
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
export default CreateTransportList;
