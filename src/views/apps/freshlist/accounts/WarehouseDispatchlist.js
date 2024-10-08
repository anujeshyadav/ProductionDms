import React, { useRef } from "react";
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
} from "reactstrap";
import { ImDownload } from "react-icons/im";
import { ContextLayout } from "../../../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import GoodDispatchEdit from "./GoodDispatchEdit";
import GoodDispatchView from "../accounts/GoodDispatchView";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Logo from "../../../../assets/img/profile/pages/logomain.png";
import Papa from "papaparse";
import { Eye, Trash2, ChevronDown, Edit } from "react-feather";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import "../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../../../assets/scss/pages/users.scss";
import {
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaFilter,
  FaPlus,
  FaTruck,
  FaTruckLoading,
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
import * as XLSX from "xlsx";
import UserContext from "../../../../context/Context";
import { CheckPermission } from "../house/CheckPermission";
import { AiOutlineDownload } from "react-icons/ai";
const SelectedColums = [];

class GoodDispatchList extends React.Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.gridRef = React.createRef();
    this.gridApi = null;
    this.state = {
      isOpen: false,
      Arrindex: "",
      rowData: [],
      setMySelectedarr: [],
      InsiderPermissions: {},
      modal: false,
      ViewOneData: {},
      SelectedCols: [],
      paginationPageSize: 15,
      currenPageSize: "",
      getPageSize: "",
      columnDefs: [
        {
          headerName: "S.No",
          valueGetter: "node.rowIndex + 1",
          field: "node.rowIndex + 1",
          width: 80,
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
          width: 150,
          cellRendererFramework: (params) => {
            return (
              <div className="actions cursor-pointer">
                {this.state.InsiderPermissions &&
                  this.state.InsiderPermissions?.View && (
                    <Route
                      render={({ history }) => (
                        <Eye
                        
                          size="25px"
                          color="green"
                          onClick={() => {
                            this.setState({ ViewOneData: params?.data });
                            this.toggleModal();
                            console.log(params?.data);
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
          field: "order_status",
          filter: true,
          width: 140,
          cellRendererFramework: (params) => {
            return params.data?.status?.toLowerCase()?.includes("completed") ? (
              <div className=" ">Completed</div>
            ) : params.data?.status === "pending" ? (
              <div className=" ">
                {params.data?.status}
              </div>
            ) : params.data?.status === "return" ? (
              <div className=" ">Returned</div>
            ) : params.data?.status === "cancelled" ? (
              <div className=" ">
                {params.data.status}
              </div>
            ) : params.data?.status === "Inprocess" ? (
              <div className=" ">
                {params.data.status}
              </div>
            ) : (
              <>
                <div className=" ">
                  {params.data.status}
                </div>
              </>
            );
          },
        },
        {
          headerName: "Order id",
          field: "_id",
          filter: true,
          resizable: true,
          width: 210,
          cellRendererFramework: (params) => {
            // console.log(params.data?.order_id);

            return (
              <div className="d-flex align-items-center cursor-pointer">
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
          field: "Dispatch",
          filter: true,
          resizable: true,
          width: 140,
          cellRendererFramework: (params) => {
            // console.log(params?.data?.status);

            return (
              <div className="d-flex align-items-center justify-content-center cursor-pointer">
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
                              <div className=" ">
                                Completed
                              </div>
                            ) : params.data?.status === "pending" ? (
                              <div className=" ">
                                {params.data?.status}
                              </div>
                            ) : params.data?.status === "return" ? (
                              <div className=" ">
                                Returned
                              </div>
                            ) : params.data?.status === "cancelled" ? (
                              <div className=" ">
                                {params.data.status}
                              </div>
                            ) : params.data?.status === "Inprocess" ? (
                              <div className=" ">
                                {params.data.status}
                              </div>
                            ) : (
                              <>
                                <div className=" ">
                                  {params.data.status}
                                </div>
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
                                  // onClick={() => this.MergeBillNow(params.data)}
                                  fill="green"
                                  size="30px"
                                />
                              )}
                            />
                          </>
                        )}
                      </>
                    )}
                  {/* {params?.data?.status == "completed" ? (
                    <>
                    </>
                  ) : (
                    "NA"
                  )} */}
                  <span></span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Full Name",
          field: "fullName",
          filter: true,
          resizable: true,
          width: 180,
          cellRendererFramework: (params) => {
            return (
              <div className="d-flex align-items-center justify-content-center cursor-pointer">
                <div>
                  <span>{params?.data?.fullName}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Mobile No",
          field: "MobileNo",
          filter: true,
          resizable: true,
          width: 130,
          cellRendererFramework: (params) => {
            return (
              <div className="d-flex align-items-center justify-content-center cursor-pointer">
                <div>
                  <span>{params?.data?.MobileNo}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Address",
          field: "address",
          filter: true,
          resizable: true,
          width: 300,
          cellRendererFramework: (params) => {
            return (
              <div className="d-flex align-items-center justify-content-center cursor-pointer">
                <div>
                  <span>{params?.data?.address}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Grand Total",
          field: "grandTotal",
          filter: true,
          resizable: true,
          width: 140,
          cellRendererFramework: (params) => {
            return (
              <div className="d-flex align-items-center justify-content-center cursor-pointer">
                <div>
                  <span>{params?.data?.grandTotal}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Tax Amount",
          field: "taxAmount",
          filter: true,
          resizable: true,
          width: 140,
          cellRendererFramework: (params) => {
            return (
              <div className="d-flex align-items-center justify-content-center cursor-pointer">
                <div>
                  <span>{params?.data?.taxAmount}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Party Name",
          field: "partyId.CompanyName",
          filter: true,
          resizable: true,
          width: 210,
          cellRendererFramework: (params) => {
            return (
              <div className="d-flex align-items-center cursor-pointer">
                <div>
                  <span>{params.data?.partyId?.CompanyName}</span>
                </div>
              </div>
            );
          },
        },

        {
          headerName: "Total Product",
          field: "params?.data?.orderItems?.length",
          filter: true,
          resizable: true,
          width: 170,
          cellRendererFramework: (params) => {
            // console.log(params.data);
            return (
              <div className="d-flex cursor-pointer">
                <div>{params?.data?.orderItems?.length} Products</div>
              </div>
            );
          },
        },

        // {
        //   headerName: "total",
        //   field: "total",
        //   filter: true,
        //   resizable: true,
        //   width: 160,
        //   cellRendererFramework: (params) => {
        //     return (
        //       <div className="d-flex align-items-center cursor-pointer">
        //         <div>
        //           <Badge color="success">{params.data?.total}</Badge>
        //         </div>
        //       </div>
        //     );
        //   },
        // },
        // {
        //   headerName: "brandname ",
        //   field: "brand_name",
        //   filter: true,
        //   resizable: true,
        //   width: 180,
        //   cellRendererFramework: (params) => {
        //     return (
        //       <div className="d-flex align-items-center cursor-pointer">
        //         <div>
        //           <span>{params.data?.brand_name}</span>
        //         </div>
        //       </div>
        //     );
        //   },
        // },
        // {
        //   headerName: "city",
        //   field: "city",
        //   filter: true,
        //   resizable: true,
        //   width: 160,
        //   cellRendererFramework: (params) => {
        //     return (
        //       <div className="d-flex align-items-center cursor-pointer">
        //         <div>
        //           <span>{params.data?.city}</span>
        //         </div>
        //       </div>
        //     );
        //   },
        // },
        // {
        //   headerName: "order Creation date",
        //   field: "order_date",
        //   filter: true,
        //   resizable: true,
        //   width: 230,
        //   cellRendererFramework: (params) => {
        //     return (
        //       <div className="d-flex align-items-center cursor-pointer">
        //         <div>
        //           <span>{params.data?.order_date}</span>
        //         </div>
        //       </div>
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

  toggleModal = () => {
    this.setState((prevState) => ({
      modalOne: !prevState.modalOne,
    }));
  };
  LookupviewStart = () => {
    this.setState((prevState) => ({
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

  async componentDidMount() {
    const UserInformation = this.context?.UserInformatio;
    const InsidePermissions = CheckPermission("Dispatch details");
    this.setState({ InsiderPermissions: InsidePermissions });
    const userId = JSON.parse(localStorage.getItem("userData"));
    await OrderDisPatchList(userId?._id, userId?.database)
      .then((res) => {
        console.log(res?.Invoice);
        this.setState({ rowData: res?.Invoice });
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
      "DispatchDetailList",
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
      InsiderPermissions,
      AllcolumnDefs,
    } = this.state;
    return (
      <>
        <Col className="app-user-list">
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
                          onClick={(e) => {
                            e.preventDefault();
                            this.setState({ ViewOneUserView: false });
                          }}
                          color="danger">
                          Back
                        </Button>
                      </div>
                    </Col>
                    <GoodDispatchView ViewOneData={this.state.ViewOneData} />
                  </Row>
                </>
              ) : (
                <>
                  <Col sm="12">
                    <Card>
                      <Row style={{marginLeft:'3px',marginRight:'3px'}}>
                        <Col>
                          <h1
                           className="float-left" style={{ fontWeight: "600" ,textTransform:'uppercase', fontSize:'22px' ,marginTop:"25px"}}>
                            Good Dispatch List
                          </h1>
                        </Col>
                        <Col style={{marginTop:"25px"}} lg="2" xl="2">
                        <div className="table-input ">
                                  <Input
                                    placeholder="search Item here..."
                                    onChange={(e) =>
                                      this.updateSearchQuery(e.target.value)
                                    }
                                    value={this.state.value}
                                  />
                                </div>
                        </Col>
                        {InsiderPermissions && InsiderPermissions?.View && (
                          <Col lg="1" style={{marginTop:"25px"}}>
                            <span className=" ">
                              <FaFilter
                                style={{ cursor: "pointer" }}
                                title="filter coloumn"
                                size="35px"
                                onClick={this.LookupviewStart}
                                color="#39cccc"
                                className="float-right"
                              />
                            </span>
                            <span className=" " onMouseEnter={this.toggleDropdown}
                  onMouseLeave={this.toggleDropdown}>
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
                                    className="float-right mr-1"
                                    color="#39cccc"
                                    onClick={() =>
                                      history.push(
                                        "/app/AjGroup/dispatch/CreateDispach/:id"
                                      )
                                    }>
                                    <FaPlus size={15} /> Create Dispatch
                                  </Button>
                                )}
                              />
                            </span> */}
                          </Col>
                        )}
                      </Row>
                      <CardBody style={{ marginTop: "-3rem" }}>
                        {this.state.rowData === null ? null : (
                          <div className="ag-theme-material w-100 my-2 ag-grid-table">
                            
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
                      </CardBody>
                    </Card>
                  </Col>
                </>
              )}
            </>
          )}
        </Col>

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
          toggle={this.toggleModal}
          className={this.props.className}
          style={{ maxWidth: "1050px" }}>
          <ModalHeader toggle={this.toggleModal}>View Order</ModalHeader>
          <ModalBody>
            <div className="container">
              <Row>
                <Col>
                  <Label>Party Name :</Label>
                  <h5 className="mx-1">
                    {this.state.ViewOneData &&
                      this.state.ViewOneData?.partyId?.CompanyName}
                  </h5>
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
                        this.state.ViewOneData?.address}{" "}
                    </strong>
                  </h5>
                </Col>
                <Col>
                  <Label>Grand Total :</Label>
                  <h5>
                    <strong>
                      {this.state.ViewOneData &&
                        this.state.ViewOneData?.grandTotal}{" "}
                    </strong>
                    Rs/-
                  </h5>
                </Col>

                {/* <Col>
                <Label>Download Invoice :</Label>
                <div className="d-flex justify-content-center">
                  <FaDownload
                    onClick={this.handleStockTrxInvoiceShow}
                    color="#00c0e"
                    fill="#00c0e"
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
                      {this.state.ViewOneData?.orderItems &&
                        this.state.ViewOneData?.orderItems?.map((ele, i) => (
                          <>
                            <tr>
                              <th scope="row">{i + 1}</th>
                              <td>{ele?.productId?.Product_Title}</td>
                              <td>{ele?.productId?.Product_MRP}</td>
                              <td>{ele?.Size}</td>
                              <td>{ele?.unitType}</td>
                              <td>{ele?.qty}</td>
                              <td>
                                {ele?.productId?.Product_MRP *
                                  ele?.Size *
                                  ele?.qty}
                              </td>
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
