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
  Badge,
  Label,
  Table,
  Spinner,
} from "reactstrap";
import { ImDownload } from "react-icons/im";
import { ContextLayout } from "../../../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import GoodDispatchEdit from "./GoodDispatchEdit";
import GoodDispatchView from "../accounts/GoodDispatchView";

import "jspdf-autotable";

import { Eye, ChevronDown } from "react-feather";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import "../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../../../assets/scss/pages/users.scss";
import {
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaFilter,
  FaTruck,
} from "react-icons/fa";
import swal from "sweetalert";
import {
  DeleteAccount,
  OrderDisPatchList,
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

class GoodDispatchList extends React.Component {
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
      InsiderPermissions: {},
      modal: false,
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
          width: 75,
          filter: true,
        },
        // {
        //   headerName: "Add Bills",
        //   width: 160,
        //   filter: true,
        //   cellRendererFramework: (params) => {
        //     return (
        //       <div className="d-flex align-items-center justify-content-center cursor-pointer">
        //         <div>
        //           <span>
        //             <input
        //               type="checkbox"
        //               className="customcheckbox"
        //               onClick={(e) => {
        //                 this.handleMultipleBillsAdd(
        //                   params?.data,
        //                   e.target.checked
        //                 );
        //                 // console.log(e.target.checked);
        //               }}
        //             />
        //             {/* <AiOutlineDownload
        //               onClick={() => this.handleBillDownload(params.data)}
        //               fill="green"
        //               size="30px"
        //             /> */}
        //           </span>
        //         </div>
        //       </div>
        //     );
        //   },
        // },
        {
          headerName: "Actions",
          field: "sortorder",
          field: "transactions",
          width: 95,
          cellRendererFramework: params => {
            return (
              <div className="actions text-center cursor-pointer">
                {this.state.InsiderPermissions &&
                  this.state.InsiderPermissions?.View && (
                    <Route
                      render={({ history }) => (
                        <Eye
                          className="mr-50"
                          size="25px"
                          color="green"
                          onClick={() => {
                            this.setState({ ViewOneData: params?.data });
                            this.toggleModal();
                          }}
                        />
                      )}
                    />
                  )}
                {/* {this.state.InsiderPermissions &&
                  this.state.InsiderPermissions?.Edit && (
                    <Route
                      render={({ history }) => (
                        <Edit
                          className="mr-50"
                          size="25px"
                          color="blue"
                          onClick={() => {
                            // this.handleChangeEdit(params.data, "Editable");
                          }}
                        />
                      )}
                    />
                  )} */}

                {/* {this.state.InsiderPermissions &&
                  this.state.InsiderPermissions?.Delete && (
                    <Route
                      render={() => (
                        <Trash2
                          className="mr-50"
                          size="25px"
                          color="red"
                          onClick={() => {
                            // this.runthisfunction(params?.data?._id);
                          }}
                        />
                      )}
                    />
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
          cellRendererFramework: params => {
            console.log(params.data?.status);
            return params.data?.status?.toLowerCase()?.includes("completed") ? (
              <div className="text-center cursor-pointer">Completed</div>
            ) : params.data?.status === "pending" ? (
              <div className="text-center cursor-pointer">
                {params.data?.status}
              </div>
            ) : params.data?.status === "return" ? (
              <div className="text-center cursor-pointer">Returned</div>
            ) : params.data?.status === "cancelled" ? (
              <div className="text-center cursor-pointer">
                {params.data.status}
              </div>
            ) : params.data?.status === "Inprocess" ? (
              <div className="text-center cursor-pointer">
                {params.data.status}
              </div>
            ) : (
              <>
                <div className="text-center cursor-pointer">
                  {params.data.status}
                </div>
              </>
            );
          },
        },
        {
          headerName: "Order Id",
          field: "_id",
          filter: true,
          editable: true,
          resizable: true,
          width: 237,
          cellRendererFramework: params => {
            console.log(params.data);

            return (
              <div className="text-center cursor-pointer">
                <div>
                  {/* <select
                  // className="form-control"
                  defaultValue={params.data?.order_status}
                  onChange={(e) => {
                    // console.log(e.target.value);
                    let data = new FormData();
                    data.append("order_id", params.data?.order_id);
                    data.append("order_status", e.target.value);
                    axiosConfig
                      .post(`/change_order_status`, data)
                      .then((res) => {
                        console.log(res?.data.message);
                        if (res?.data.message) {
                          this.componentDidMount();
                          swal("status Updated Succesfully");
                        }
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  }}
                  name="changestatus"
                  id="changeStatus"
                >
                  <option value={params.data?.order_status}>
                    {params.data?.order_status}
                  </option>
                  <option value="Pending">--UpdateStatus--</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Cancelled">Cancelled</option>
                </select> */}
                  <span>{params?.data?._id}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Dispatch",
          field: "status",
          filter: true,
          resizable: true,
          width: 108,
          cellRendererFramework: params => {
            // console.log(params?.data?.status);

            return (
              <div className="text-center cursor-pointer">
                <div>
                  {this.state.InsiderPermissions &&
                    this.state.InsiderPermissions?.Create && (
                      <>
                        {params.data?.status === "Inprocess" ||
                        params.data?.status
                          ?.toLowerCase()
                          ?.includes("cancelled") ||
                        params.data?.status
                          ?.toLowerCase()
                          ?.includes("completed") ? (
                          <>
                            {params.data?.status
                              ?.toLowerCase()
                              ?.includes("completed") ? (
                              <div className=" ">Completed</div>
                            ) : params.data?.status === "pending" ? (
                              <div className=" ">{params.data?.status}</div>
                            ) : params.data?.status === "return" ? (
                              <div className=" ">Returned</div>
                            ) : params.data?.status === "cancelled" ? (
                              <div className=" ">{params.data.status}</div>
                            ) : params.data?.status === "Inprocess" ? (
                              <div className=" ">{params.data.status}</div>
                            ) : (
                              <>
                                <div className=" ">{params.data.status}</div>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            <Route
                              render={({ history }) => (
                                <FaTruck
                                  style={{ cursor: "pointer" }}
                                  title="Dispatch Now"
                                  onClick={() =>
                                    history.push({
                                      pathname: `/app/AjGroup/dispatch/CreateDispach/${params?.data?._id}`,
                                      state: { data: params?.data },
                                    })
                                  }
                                  fill="green"
                                  size="30px"
                                />
                              )}
                            />
                          </>
                        )}
                      </>
                    )}
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Full Name",
          field: "partyId.ownerName",
          filter: true,
          resizable: true,
          width: 214,
          cellRendererFramework: params => {
            return (
              <div className="text-center cursor-pointer">
                <div>
                  <span>{params?.data?.partyId?.ownerName}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Last Name",
          field: "partyId.lastName",
          filter: true,
          resizable: true,
          width: 180,
          cellRendererFramework: params => {
            return (
              <div className="text-center cursor-pointer">
                <div>
                  <span>{params?.data?.partyId?.lastName}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Owner Name",
          field: "partyId.ownerName",
          filter: true,
          resizable: true,
          width: 205,
          cellRendererFramework: params => {
            return (
              <div className="text-center cursor-pointer">
                <div>
                  <span>{params?.data?.partyId?.ownerName}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Address",
          field: "partyId.address",
          filter: true,
          resizable: true,
          width: 210,
          cellRendererFramework: params => {
            return (
              <div className="text-center cursor-pointer">
                <div>
                  <span>{params?.data?.partyId?.address}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Company Pan Number",
          field: "partyId.comPanNo",
          filter: true,
          width: 216,
          cellRendererFramework: params => {
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
          headerName: "Company Name",
          field: "partyId.CompanyName",
          filter: true,
          resizable: true,
          width: 210,
          cellRendererFramework: params => {
            return (
              <div className="text-center cursor-pointer">
                <div>
                  <span>{params?.data?.partyId?.CompanyName}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "GST Number",
          field: "partyId.gstNumber",
          filter: true,
          resizable: true,
          width: 155,
          cellRendererFramework: params => {
            console.log(params?.data);
            return (
              <div className="text-center cursor-pointer">
                <div>
                  <span>{params?.data?.partyId?.gstNumber}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Party Type",
          field: "partyId.partyType",
          filter: true,
          resizable: true,
          width: 150,
          cellRendererFramework: params => {
            return (
              <div className="text-center cursor-pointer">
                <div>
                  <span>{params?.data?.partyId?.partyType}</span>
                </div>
              </div>
            );
          },
        },

        {
          headerName: "IGST ",
          field: "igstTotal",
          filter: true,
          width: 140,
          cellRendererFramework: params => {
            return (
              <div className="text-center cursor-pointer">
                <div>{params.data?.igstTotal && params.data?.igstTotal}</div>
              </div>
            );
          },
        },
        {
          headerName: "SGST  ",
          field: "sgstTotal",
          filter: true,
          width: 140,
          cellRendererFramework: params => {
            return (
              <div className="text-center cursor-pointer">
                <div>{params.data?.sgstTotal && params.data?.sgstTotal}</div>
              </div>
            );
          },
        },
        {
          headerName: "CGST  ",
          field: "cgstTotal",
          filter: true,
          width: 140,
          cellRendererFramework: params => {
            return (
              <div className="text-center cursor-pointer">
                <div>{params.data?.cgstTotal && params.data?.cgstTotal}</div>
              </div>
            );
          },
        },
        {
          headerName: "Amount",
          field: "amount",
          filter: true,
          width: 140,
          cellRendererFramework: params => {
            return (
              <div className="text-center cursor-pointer">
                <div>{params.data?.amount?.toFixed(2)}</div>
              </div>
            );
          },
        },
        {
          headerName: "Round Off",
          field: "roundOff",
          filter: true,
          width: 140,
          cellRendererFramework: params => {
            return (
              <div className="text-center cursor-pointer">
                <div>{params.data?.roundOff}</div>
              </div>
            );
          },
        },
        {
          headerName: "Grand Total",
          field: "grandTotal",
          filter: true,
          width: 140,
          cellRendererFramework: params => {
            return (
              <div className="text-center cursor-pointer">
                <div>{params.data?.grandTotal}</div>
              </div>
            );
          },
        },

        {
          headerName: "Total Product",
          field: "params?.data?.orderItems?.length",
          filter: true,
          resizable: true,
          width: 148,
          cellRendererFramework: params => {
            // console.log(params.data);
            return (
              <div className="text-center cursor-pointer">
                <div>{params?.data?.orderItems?.length} Products</div>
              </div>
            );
          },
        },
        {
          headerName: "Order Creation Date",
          field: "createdAt",
          filter: true,
          resizable: true,
          width: 220,
          cellRendererFramework: params => {
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
          headerName: "Party Limit",
          field: "partyId.limit",
          filter: true,
          width: 128,
          cellRendererFramework: params => {
            return (
              <div className="text-center cursor-pointer">
                <div>
                  <span>{params.data?.partyId?.limit}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Transposrter",
          field: "partyId.assignTransporter",
          filter: true,
          width: 140,
          cellRendererFramework: params => {
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

  toggleModal = () => {
    this.setState(prevState => ({
      modalOne: !prevState.modalOne,
    }));
  };
  LookupviewStart = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };

  // handleChangeEdit = (data, types) => {
  //   let type = types;
  //   if (type == "readonly") {
  //     this.setState({ ViewOneUserView: true });
  //     this.setState({ ViewOneData: data });
  //   } else {
  //     this.setState({ EditOneUserView: true });
  //     this.setState({ EditOneData: data });
  //   }
  // };
  async Apicalling(id, db) {
    this.setState({ Loading: true });
    await OrderDisPatchList(id, db)
      .then(res => {
        this.setState({ Loading: false });
        console.log(res?.Invoice);
        let newList = res?.Invoice.filter(item => item.status !== "Deactive");
        console.log(newList);

        this.setState({ rowData: newList?.reverse() });
        this.setState({ AllcolumnDefs: this.state.columnDefs });

        let userHeading = JSON.parse(
          localStorage.getItem("DispatchDetailList")
        );
        if (userHeading?.length) {
          this.setState({ columnDefs: userHeading });
          // this.gridApi.setColumnDefs(userHeading);
          this.setState({ SelectedcolumnDefs: userHeading });
        } else {
          this.setState({ columnDefs: this.state.columnDefs });
          this.setState({ SelectedcolumnDefs: this.state.columnDefs });
        }
        this.setState({ SelectedCols: this.state.columnDefs });
      })
      .catch(err => {
        this.setState({ Loading: false });

        console.log(err);
      });
  }
  async componentDidMount() {
    const UserInformation = this.context?.UserInformatio;
    const InsidePermissions = CheckPermission("Dispatch details");
    this.setState({ InsiderPermissions: InsidePermissions });
    const userId = JSON.parse(localStorage.getItem("userData"));

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

  exportToPDF = async () => {
    const csvData = this.gridApi.getDataAsCsv({
      processCellCallback: this.processCell,
    });
    await exportDataToPDF(csvData, "GoodDispatchList");
  };
  processCell = params => {
    return params.value;
  };

  exportToExcel = async e => {
    const CsvData = this.gridApi.getDataAsCsv({
      processCellCallback: this.processCell,
    });
    await exportDataToExcel(CsvData, "GoodDispatchList");
  };

  convertCSVtoExcel = async () => {
    const CsvData = this.gridApi.getDataAsCsv({
      processCellCallback: this.processCell,
    });
    await convertDataCSVtoExcel(CsvData, "GoodDispatchList");
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
    await convertDataCsvToXml(CsvData, "GoodDispatchList");
  };

  HandleSetVisibleField = e => {
    e.preventDefault();
    this.gridApi.setColumnDefs(this.state.SelectedcolumnDefs);
    this.setState({ columnDefs: this.state.SelectedcolumnDefs });
    this.setState({ SelectedcolumnDefs: this.state.SelectedcolumnDefs });
    this.setState({ rowData: this.state.rowData });
    localStorage.setItem(
      "DispatchDetailList",
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
        <div className="app-user-list">
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

              <GoodDispatchEdit EditOneData={this.state.EditOneData} />
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
                    <GoodDispatchView ViewOneData={this.state.ViewOneData} />
                  </Row>
                </>
              ) : (
                <>
                  <Card>
                    <Row
                      style={{
                        marginTop: "10px",
                        marginRight: "5px",
                        marginLeft: "5px",
                      }}
                    >
                      <Col className="mt-2">
                        <h2
                          className="float-left"
                          style={{ fontWeight: "600" }}
                        >
                          Good Dispatch List
                        </h2>
                      </Col>

                      {this.state.MasterShow ? (
                        <Col
                          lg="3"
                          md="4"
                          sm="12"
                          style={{ marginTop: "10px" }}
                        >
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
                              onChange={e =>
                                this.updateSearchQuery(e.target.value)
                              }
                              value={this.state.value}
                            />
                          </div>
                        </div>
                      </Col>
                      <Col lg="1" style={{ marginTop: "10px" }}>
                        {InsiderPermissions && InsiderPermissions?.Download && (
                          <>
                            <span
                              onMouseEnter={this.toggleDropdown}
                              onMouseLeave={this.toggleDropdown}
                              className=""
                            >
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
                          </>
                        )}
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
                      </Col>
                    </Row>
                    {InsiderPermissions && InsiderPermissions?.View && (
                      <>
                        {this.state.rowData === null ? null : (
                          <div className="ag-theme-material w-100 my-2 ag-grid-table">
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
          toggle={this.toggleModal}
          className={this.props.className}
          style={{ maxWidth: "1050px" }}
        >
          <ModalHeader toggle={this.toggleModal}>View Order</ModalHeader>
          <ModalBody>
            <div className="container">
              <Row>
                <Col lg="2" md="2" sm="2">
                  <Label>Party Name :</Label>
                  <h5 className="mx-1">
                    {this.state.ViewOneData &&
                      this.state.ViewOneData?.partyId?.CompanyName}
                  </h5>
                </Col>
                <Col lg="2" md="2" sm="2">
                  <Label>Address :</Label>
                  <h5>
                    <strong>
                      {this.state.ViewOneData &&
                        this.state.ViewOneData?.address}{" "}
                    </strong>
                  </h5>
                </Col>
                <Col lg="2" md="2" sm="2">
                  <Label>Date Created :</Label>
                  <h5>
                    {this.state.ViewOneData &&
                      this.state.ViewOneData?.createdAt?.split("T")[0]}
                  </h5>
                </Col>

                <Col lg="2" md="2" sm="2">
                  <Label>Amount:</Label>
                  <h5>
                    <strong>
                      {this.state.ViewOneData &&
                        this.state.ViewOneData?.amount?.toFixed(2)}
                    </strong>
                    Rs/-
                  </h5>
                </Col>

                {this.state.ViewOneData?.igstTaxType &&
                this.state.ViewOneData?.igstTaxType == 1 ? (
                  <>
                    <Col lg="2" md="2" sm="2">
                      <Label>IGST:</Label>
                      <h5>
                        <strong>
                          {this.state.ViewOneData &&
                            this.state.ViewOneData?.igstTotal}
                        </strong>
                        Rs/-
                      </h5>
                    </Col>
                  </>
                ) : (
                  <>
                    <Col lg="2" md="2" sm="2">
                      <Label>SGST:</Label>
                      <h5>
                        <strong>
                          {this.state.ViewOneData &&
                            this.state.ViewOneData?.sgstTotal}
                        </strong>
                        Rs/-
                      </h5>
                    </Col>
                    <Col lg="2" md="2" sm="2">
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

                {this.state.ViewOneData?.otherCharges && (
                  <Col lg="2" md="2" sm="2">
                    <Label>otherCharges:</Label>
                    <h5>
                      <strong>
                        {this.state.ViewOneData &&
                          this.state.ViewOneData?.otherCharges}{" "}
                      </strong>
                    </h5>
                  </Col>
                )}
                <Col lg="2" md="2" sm="2">
                  <Label>Grand Total :</Label>
                  <h5>
                    <strong>
                      {this.state.ViewOneData &&
                        this.state.ViewOneData?.grandTotal}{" "}
                    </strong>
                    Rs/-
                  </h5>
                </Col>
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
                        <th>HSN CODE</th>
                        <th>Price</th>
                        <th>Size</th>
                        <th>Quantity</th>
                        <th>Unit</th>
                        <th>TAXABLE</th>
                        <th>GST Rate</th>
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
                        this.state.ViewOneData?.orderItems?.map((ele, i) => (
                          <>
                            <tr>
                              <th scope="row">{i + 1}</th>
                              <td>{ele?.productId?.Product_Title}</td>
                              <td>{ele?.productId?.HSN_Code}</td>
                              <td>{ele?.productId?.Product_MRP}</td>
                              <td>{ele?.Size}</td>
                              <td>{ele?.qty}</td>
                              <td>{ele?.unitType}</td>
                              <td>{ele?.taxableAmount}</td>
                              <td>{ele?.gstPercentage}</td>
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
            </div>
          </ModalBody>
        </Modal>
      </>
    );
  }
}
export default GoodDispatchList;
