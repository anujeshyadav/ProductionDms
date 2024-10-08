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
} from "reactstrap";
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
  _Get,
  _GetList,
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
  Super_Admin_List,
  // RegisterForAttendanceHRM,
} from "../../../../ApiEndPoint/Api";
import {
  convertDataCSVtoExcel,
  convertDataCsvToXml,
  exportDataToExcel,
  exportDataToPDF,
} from "./Downloader";
import Axios from "axios";

const SelectedColums = [];

class SuperAdminList extends React.Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.gridRef = React.createRef();
    this.gridApi = null;
    this.state = {
      isOpen: false,
      MasterShow: false,
      InsiderPermissions: {},
      Arrindex: "",
      rowData: [],
      setMySelectedarr: [],
      SelectedCols: [],
      paginationPageSize: 12,
      currenPageSize: "",
      getPageSize: "",
      columnDefs: [
        {
          headerName: "UID",
          valueGetter: "node.rowIndex + 1",
          field: "node.rowIndex + 1",
          width: 80,
          filter: true,
        },

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

        {
          headerName: "FirstName",
          field: "firstName",
          filter: true,
          width: 140,
          sortable: true,
          cellRendererFramework: params => {
            return (
              <>
                <div className="actions cursor-pointer">
                  <span>{params?.data?.firstName}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "last Name",
          field: "lastName",
          width: 140,
          filter: true,
          sortable: true,
          cellRendererFramework: params => {
            return (
              <>
                <div className="actions cursor-pointer">
                  <span>{params?.data?.lastName}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "Email",
          field: "email",
          filter: true,
          sortable: true,
          cellRendererFramework: params => {
            return (
              <>
                <div className="actions cursor-pointer">
                  <span>{params?.data?.email}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "Plan Status",
          field: "planStatus",
          filter: true,
          sortable: true,
          cellRendererFramework: params => {
            return (
              <>
                <div className="actions cursor-pointer">
                  <span>{params?.data?.planStatus}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "Plan Name",
          field: "subscriptionPlan.planName",
          filter: true,
          sortable: true,
          cellRendererFramework: params => {
            return (
              <>
                <div className="actions cursor-pointer">
                  <span>{params?.data?.subscriptionPlan?.planName}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "Plan Name",
          field: "subscriptionPlan.subscriptionType",
          filter: true,
          sortable: true,
          cellRendererFramework: params => {
            return (
              <>
                <div className="actions cursor-pointer">
                  <span>
                    {params?.data?.subscriptionPlan?.subscriptionType == 1
                      ? "Yearly"
                      : "One Time"}
                  </span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "Plan Price",
          field: "billAmount",
          filter: true,
          sortable: true,
          cellRendererFramework: params => {
            return (
              <>
                <div className="actions cursor-pointer">
                  <span>{params?.data?.billAmount}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "Plan Start Date",
          field: "planStart",
          filter: true,
          sortable: true,
          cellRendererFramework: params => {
            return (
              <>
                <div className="actions cursor-pointer">
                  <span>{params?.data?.planStart}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "Plan End Date",
          field: "planEnd",
          filter: true,
          sortable: true,
          cellRendererFramework: params => {
            return (
              <>
                <div className="actions cursor-pointer">
                  <span>{params?.data?.planEnd}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "Total User Allotted",
          field: "userAllotted",
          filter: true,
          sortable: true,
          cellRendererFramework: params => {
            return (
              <>
                <div className="actions cursor-pointer">
                  <span>{params?.data?.userAllotted}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "Registered User",
          field: "userAllotted",
          filter: true,
          sortable: true,
          cellRendererFramework: params => {
            return (
              <>
                <div className="actions cursor-pointer">
                  {/* <span>{params?.data?.userAllotted}</span> */}
                </div>
              </>
            );
          },
        },
        {
          headerName: "Total Days",
          field: "subscriptionPlan.days",
          filter: true,
          sortable: true,
          cellRendererFramework: params => {
            return (
              <>
                <div className="actions cursor-pointer">
                  <span>{params?.data?.subscriptionPlan?.days}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "Mobile Number",
          field: "mobileNumber",
          filter: true,
          sortable: true,
          cellRendererFramework: params => {
            return (
              <>
                <div className="actions cursor-pointer">
                  <span>{params?.data?.mobileNumber}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "Pin code",
          field: "pincode",
          filter: true,
          sortable: true,
          cellRendererFramework: params => {
            return (
              <>
                <div className="actions cursor-pointer">
                  <span>{params?.data?.pincode}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "Aadhar No",
          field: "Aadhar_No",
          filter: true,
          sortable: true,
          cellRendererFramework: params => {
            return (
              <>
                <div className="actions cursor-pointer">
                  <span>{params?.data?.Aadhar_No}</span>
                </div>
              </>
            );
          },
        },

        {
          headerName: "City",
          field: "City",
          filter: true,
          sortable: true,
          cellRendererFramework: params => {
            return (
              <>
                <div className="actions cursor-pointer">
                  <span>{params?.data?.City}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "State",
          field: "State",
          filter: true,
          sortable: true,
          cellRendererFramework: params => {
            return (
              <>
                <div className="actions cursor-pointer">
                  <span>{params?.data?.State}</span>
                </div>
              </>
            );
          },
        },

        {
          headerName: "Pan No",
          field: "Pan_No",
          filter: true,
          sortable: true,
          cellRendererFramework: params => {
            return (
              <>
                <div className="actions cursor-pointer">
                  <span>{params?.data?.Pan_No}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "Passport No",
          field: "PassportNo",
          filter: true,
          sortable: true,
          cellRendererFramework: params => {
            return (
              <>
                <div className="actions cursor-pointer">
                  <span>{params?.data?.PassportNo}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "Address",
          field: "address",
          filter: true,
          sortable: true,
          cellRendererFramework: params => {
            return (
              <>
                <div className="actions cursor-pointer">
                  <span>{params?.data?.address}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "Firm Name",
          field: "last_job_firm_name",
          filter: true,
          sortable: true,
          cellRendererFramework: params => {
            return (
              <>
                <div className="actions cursor-pointer">
                  <span>{params?.data?.last_job_firm_name}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "Address one",
          field: "address1",
          filter: true,
          sortable: true,
          cellRendererFramework: params => {
            return (
              <>
                <div className="actions cursor-pointer">
                  <span>{params?.data?.address1}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "Address two",
          field: "address2",
          filter: true,
          sortable: true,
          cellRendererFramework: params => {
            return (
              <>
                <div className="actions cursor-pointer">
                  <span>{params?.data?.address2}</span>
                </div>
              </>
            );
          },
        },

        // {
        //   headerName: "Created date",
        //   field: "createdAt",
        //   filter: true,
        //   sortable: true,
        //   cellRendererFramework: params => {
        //     return (
        //       <>
        //         <div className="actions cursor-pointer">
        //           <span>{params?.data?.createdAt?.split("T")[0]}</span>
        //         </div>
        //       </>
        //     );
        //   },
        // },
        {
          headerName: "Actions",
          field: "sortorder",
          field: "transactions",
          width: 190,
          cellRendererFramework: params => {
            return (
              <div className="actions cursor-pointer">
                {this.state.InsiderPermissions &&
                  this.state.InsiderPermissions?.View && (
                    <Route
                      render={({ history }) => (
                        <span
                          style={{
                            border: "1px solid white",
                            padding: "10px",
                            borderRadius: "30px",
                            backgroundColor: "#39cccc",
                          }}
                        >
                          <Eye
                            className=""
                            size="20px"
                            color="white"
                            onClick={() =>
                              history.push({
                                pathname: `/app/rupioo/ViewSuperAdmin/${params?.data?._id}`,
                                state: params,
                              })
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
                            padding: "10px",
                            borderRadius: "30px",
                            backgroundColor: "rgb(212, 111, 16)",
                            marginLeft: "3px",
                          }}
                        >
                          <FaPencilAlt
                            className=""
                            size="20px"
                            color="white"
                            onClick={() =>
                              history.push(
                                `/app/rupioo/EditSuperAdmin/${params?.data?._id}`
                              )
                            }
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
                            padding: "10px",
                            borderRadius: "30px",
                            backgroundColor: "rgb(236, 24, 9)",
                            marginLeft: "3px",
                          }}
                        >
                          <Trash2
                            className=""
                            size="20px"
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

  LookupviewStart = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };

  async Apicalling(id, db) {
    let userinfo = JSON.parse(localStorage.getItem("userData"));

    // console.log(userinfo?.rolename.roleName);
    this.setState({ Loading: true, AllcolumnDefs: this.state.columnDefs });

    let userHeading = JSON.parse(localStorage.getItem("AccountSearch"));
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
    // let RegisterUser = [];
    // let URl = `${RegisterForAttendanceHRM}/${db}`;
    // await Axios.get(URl)
    //   .then((res) => {
    //     let value = res?.data?.User;
    //     if (value?.length > 0) {
    //       RegisterUser = value;
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    await _GetList(Super_Admin_List)
      .then(res => {
        this.setState({ Loading: false });
        let value = res?.SuperAdmin;
        this.setState({ rowData: value });
        // debugger;
      })
      .catch(err => {
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
    const InsidePermissions = CheckPermission("SuperAdmin List");
    this.setState({ InsiderPermissions: InsidePermissions });
    await this.Apicalling(pageparmission?._id, pageparmission?.database);
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

  exportToPDF = async () => {
    const csvData = this.gridApi.getDataAsCsv({
      processCellCallback: this.processCell,
    });
    await exportDataToPDF(csvData, "UserList");
  };
  processCell = params => {
    return params.value;
  };

  exportToExcel = async e => {
    const CsvData = this.gridApi.getDataAsCsv({
      processCellCallback: this.processCell,
    });
    await exportDataToExcel(CsvData, "UserList");
  };

  convertCSVtoExcel = async () => {
    const CsvData = this.gridApi.getDataAsCsv({
      processCellCallback: this.processCell,
    });
    await convertDataCSVtoExcel(CsvData, "UserList");
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
    await convertDataCsvToXml(CsvData, "UserList");
  };

  HandleSetVisibleField = e => {
    e.preventDefault();
    this.gridApi.setColumnDefs(this.state.SelectedcolumnDefs);
    this.setState({ columnDefs: this.state.SelectedcolumnDefs });
    this.setState({ SelectedcolumnDefs: this.state.SelectedcolumnDefs });
    this.setState({ rowData: this.state.rowData });
    localStorage.setItem(
      "AccountSearch",
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
                          marginLeft: "5px",
                          marginRight: "5px",
                          marginTop: "10px",
                        }}>
                        <Col
                          lg="5"
                          md="5"
                          sm="12"
                          style={{ marginTop: "10px" }}>
                          <h2
                            className="float-left "
                            style={{ fontWeight: "600" }}>
                            Super Admin list
                          </h2>
                        </Col>
                        <Col></Col>
                        <Col
                          lg="3"
                          md="3"
                          xl="3"
                          sm="12"
                          style={{ marginTop: "10px" }}>
                          <div className="">
                            {/*  <div className="mb-1 mr-1">
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
                              </UncontrolledDropdown> 
                            </div>*/}
                            <div className="table-input ">
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
                        {/* {this.state.MasterShow ? (
                          <Col lg="3" md="4" sm="12">
                            <SuperAdminUI
                              onDropdownChange={this.handleDropdownChange}
                              onSubmit={this.handleParentSubmit}
                            />
                          </Col>
                        ) : (
                        )} */}

                        <Col
                          lg="2"
                          md="2"
                          sm="12"
                          style={{ marginTop: "10px" }}>
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
                            InsiderPermissions.Download && (
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

                                        {InsiderPermissions &&
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
                                          )}
                                      </div>
                                    )}
                                  </div>
                                </span>
                              </>
                            )}

                          {/* {InsiderPermissions && InsiderPermissions.Create && (
                            <>
                              <span className="">
                                <Route
                                  render={({ history }) => (
                                    <Button
                                      style={{
                                        cursor: "pointer",
                                        backgroundColor: "#39cccc",
                                        color: "white",
                                        fontWeight: "600",
                                      }}
                                      className="float-right mr-1 mb-2"
                                      color="#39cccc"
                                      onClick={() =>
                                        history.push(
                                          "/app/SoftNumen/account/CreateAccount/0"
                                        )
                                      }>
                                      <FaPlus size={15} /> User
                                    </Button>
                                  )}
                                />
                              </span>
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
                                      className="float-right  mr-1"
                                      color="#39cccc"
                                      onClick={() =>
                                        history.push(
                                          "/app/Ajgroup/account/AssignTeamMember"
                                        )
                                      }>
                                      Assign Team
                                    </Button>
                                  )}
                                />
                              </span>
                              <span>
                                <Route
                                  render={({ history }) => (
                                    <a
                                      title="Create User Format Download here"
                                      target="_blank"
                                      href={UserForm}
                                      download={UserForm}>
                                      <Button
                                        style={{
                                          cursor: "pointer",
                                          backgroundColor: "#39cccc",
                                          color: "white",
                                          fontWeight: "600",
                                        }}
                                        className="float-right  mr-1"
                                        color="#39cccc">
                                        Format Download
                                      </Button>
                                    </a>
                                  )}
                                />
                              </span>
                            </>
                          )} */}
                        </Col>
                      </Row>
                      {InsiderPermissions && InsiderPermissions?.View && (
                        <>
                          {this.state.rowData === null ? null : (
                            <div>
                              <div className="ag-theme-material w-100 my-1 ag-grid-table">
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
                                              SelectedCols.splice(delindex, 1);
                                            this.setState({
                                              SelectedcolumnDefs: SelectedCols,
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
export default SuperAdminList;
