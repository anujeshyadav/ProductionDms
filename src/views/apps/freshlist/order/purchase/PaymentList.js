import React, { useRef } from "react";
import { Route } from "react-router-dom";
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
  Table,
  Label,
  Spinner,
} from "reactstrap";
import Payment from "../../UploadFormats/Payment.xlsx";
import { ContextLayout } from "../../../../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Logo from "../../../../../assets/img/profile/pages/logomain.png";
import Papa from "papaparse";
import { Eye, ChevronDown, Edit, CornerDownLeft, Trash2 } from "react-feather";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import "../../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../../../../assets/scss/pages/users.scss";

import {
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaFilter,
  FaPlus,
} from "react-icons/fa";
import swal from "sweetalert";
import { _Get, _Delete } from "../../../../../ApiEndPoint/ApiCalling";
import {
  BsFillArrowDownSquareFill,
  BsFillArrowUpSquareFill,
} from "react-icons/bs";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import UserContext from "../../../../../context/Context";
import { CheckPermission } from "../../house/CheckPermission";
import SuperAdminUI from "../../../../SuperAdminUi/SuperAdminUI";
import {
  Delete_payment_By_Id,
  Delete_Receipt_By_Id,
  View_Receipt,
} from "../../../../../ApiEndPoint/Api";

const SelectedColums = [];

class PurchaseCompleted extends React.Component {
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
      modal: false,
      modalone: false,
      ViewData: {},
      InsiderPermissions: {},

      setMySelectedarr: [],
      SelectedCols: [],
      paginationPageSize: 15,
      currenPageSize: "",
      getPageSize: "",
      // columnDefs: [],
      AllcolumnDefs: [],
      SelectedcolumnDefs: [],
      defaultColDef: {
        sortable: true,
        enablePivot: true,
        enableValue: true,
        resizable: true,
        suppressMenu: true,
      },
      // columnDefs: [
      //   {
      //     headerName: "S.No",
      //     valueGetter: "node.rowIndex + 1",
      //     field: "node.rowIndex + 1",
      //     width: 100,
      //     filter: true,
      //   },

      //   // {
      //   //   headerName: "Status",
      //   //   field: "order_status",
      //   //   filter: true,
      //   //   width: 140,
      //   //   cellRendererFramework: (params) => {
      //   //     return params.data?.status === "Active" ? (
      //   //       <div className="badge badge-pill badge-success">
      //   //         {params.data?.status}
      //   //       </div>
      //   //     ) : params.data?.status === "pending" ? (
      //   //       <div className="badge badge-pill badge-warning">
      //   //         {params.data?.status}
      //   //       </div>
      //   //     ) : params.data?.status === "return" ? (
      //   //       <div className="badge badge-pill bg-danger">Returned</div>
      //   //     ) : params.data?.status === "cancelled" ? (
      //   //       <div className="badge badge-pill bg-danger">
      //   //         {params.data.status}
      //   //       </div>
      //   //     ) : params.data?.status === "completed" ? (
      //   //       <div className="badge badge-pill bg-success">Completed</div>
      //   //     ) : (
      //   //       <>
      //   //         <div className="badge badge-pill bg-warning">Cancelled</div>
      //   //       </>
      //   //     );
      //   //   },
      //   // },
      //   // {
      //   //   headerName: "Actions",
      //   //   field: "sortorder",
      //   //   field: "transactions",
      //   //   width: 120,
      //   //   cellRendererFramework: (params) => {
      //   //     return (
      //   //       <div className="actions cursor-pointer">
      //   //         {/* {this.state.InsiderPermissions &&
      //   //           this.state.InsiderPermissions?.Edit && (
      //   //             <Trash2
      //   //               style={{ cursor: "pointer" }}
      //   //               className="mr-50"
      //   //               size="25px"
      //   //               color="red"
      //   //               onClick={() => this.runthisfunction(params?.data?._id)}
      //   //             />
      //   //           )} */}

      //   // {/* {this.state.InsiderPermissions &&
      //   //   this.state.InsiderPermissions?.View && (
      //   //     <Route
      //   //       render={() => (
      //   //         <Eye
      //   //           className="mr-50"
      //   //           size="25px"
      //   //           color="green"
      //   //           onClick={() => {
      //   //             this.setState({ ViewOneData: params?.data });
      //   //             this.toggleModalTwo();
      //   //             console.log(params?.data);
      //   //           }}
      //   //         />
      //   //       )}
      //   //     />
      //   //   )} */}
      //   //         {this.state.InsiderPermissions &&
      //   //           this.state.InsiderPermissions?.Edit && (
      //   //             <Route
      //   //               render={() => (
      //   //                 <Edit
      //   //                   style={{ cursor: "pointer" }}
      //   //                   className="mr-50"
      //   //                   size="25px"
      //   //                   color="green"
      //   //                   onClick={() =>
      //   //                     this.props.history.push(
      //   //                       `/app/ajgroup/order/CreatePayment/${params?.data?._id}`
      //   //                     )
      //   //                   }
      //   //                 />
      //   //               )}
      //   //             />
      //   //           )}
      //   //       </div>
      //   //     );
      //   //   },
      //   // },
      //   {
      //     headerName: "Owner Name",
      //     field: "partyId.ownerName",
      //     filter: true,
      //     resizable: true,
      //     width: 210,
      //     cellRendererFramework: params => {
      //       return (
      //         <div className="text-center cursor-pointer">
      //           <div>
      //             <span>{params?.data?.partyId?.ownerName}</span>
      //           </div>
      //         </div>
      //       );
      //     },
      //   },
      //   {
      //     headerName: "Payment Mode",
      //     field: "paymentMode",
      //     filter: true,
      //     resizable: true,
      //     width: 150,
      //     cellRendererFramework: params => {
      //       return (
      //         <div className="text-center cursor-pointer">
      //           <div>
      //             <span>{params?.data?.paymentMode}</span>
      //           </div>
      //         </div>
      //       );
      //     },
      //   },
      //   {
      //     headerName: "Party Code",
      //     field: "partyId.code",
      //     filter: true,
      //     editable: true,
      //     resizable: true,
      //     width: 135,
      //     cellRendererFramework: params => {
      //       console.log(params.data);
      //       return (
      //         <div className="text-center cursor-pointer">
      //           <div>
      //             <span>{params?.data?.partyId?.code}</span>
      //           </div>
      //         </div>
      //       );
      //     },
      //   },
      //   {
      //     headerName: "Amount",
      //     field: "amount",
      //     filter: true,
      //     resizable: true,
      //     width: 140,
      //     cellRendererFramework: params => {
      //       return (
      //         <div className="text-center cursor-pointer">
      //           <div>{params?.data?.amount}</div>
      //         </div>
      //       );
      //     },
      //   },
      //   {
      //     headerName: "Instrument No",
      //     field: "instrumentNo",
      //     filter: true,
      //     resizable: true,
      //     width: 155,
      //     cellRendererFramework: params => {
      //       return (
      //         <div className="text-center cursor-pointer">
      //           <div>
      //             <span>{params?.data?.instrumentNo}</span>
      //           </div>
      //         </div>
      //       );
      //     },
      //   },
      //   {
      //     headerName: "Payment Type",
      //     field: "paymentType",
      //     filter: true,
      //     resizable: true,
      //     width: 150,
      //     cellRendererFramework: params => {
      //       return (
      //         <div className="text-center cursor-pointer">
      //           <div>
      //             <span>{params?.data?.paymentType}</span>
      //           </div>
      //         </div>
      //       );
      //     },
      //   },
      //   {
      //     headerName: "Title",
      //     field: "title",
      //     filter: true,
      //     resizable: true,
      //     width: 180,
      //     cellRendererFramework: params => {
      //       return (
      //         <div className="text-center cursor-pointer">
      //           <div>
      //             <span>{params?.data?.title}</span>
      //           </div>
      //         </div>
      //       );
      //     },
      //   },

      //   {
      //     headerName: "Note",
      //     field: "note",
      //     filter: true,
      //     resizable: true,
      //     width: 180,
      //     cellRendererFramework: params => {
      //       return (
      //         <div className="text-center cursor-pointer">
      //           <div>
      //             <span>{params?.data?.note}</span>
      //           </div>
      //         </div>
      //       );
      //     },
      //   },
      //   // {
      //   //   headerName: "Invoice",
      //   //   field: "invoice",
      //   //   filter: true,
      //   //   resizable: true,
      //   //   width: 140,
      //   //   cellRendererFramework: (params) => {
      //   //     // console.log(params?.data?.status);

      //   //     return (
      //   //       <div className="d-flex align-items-center justify-content-center cursor-pointer">
      //   //         <div>
      //   //           {/* {params?.data?.status == "completed" ? ( */}
      //   //           <>
      //   //             {this.state.InsiderPermissions &&
      //   //               this.state.InsiderPermissions?.View && (
      //   //                 <AiOutlineDownload
      //   //                   // onClick={() => this.handleBillDownload(params.data)}
      //   //                   onClick={() => this.MergeBillNow(params.data)}
      //   //                   fill="green"
      //   //                   size="30px"
      //   //                 />
      //   //               )}
      //   //           </>
      //   //           <span></span>
      //   //         </div>
      //   //       </div>
      //   //     );
      //   //   },
      //   // },
      //   // {
      //   //   headerName: "FullName",
      //   //   field: "fullName",
      //   //   filter: true,
      //   //   resizable: true,
      //   //   width: 150,
      //   //   cellRendererFramework: (params) => {
      //   //     return (
      //   //       <div className="d-flex align-items-center justify-content-center cursor-pointer">
      //   //         <div>
      //   //           <span>{params?.data?.fullName}</span>
      //   //         </div>
      //   //       </div>
      //   //     );
      //   //   },
      //   // },
      //   {
      //     headerName: "Email",
      //     field: "partyId.email",
      //     filter: true,
      //     resizable: true,
      //     width: 350,
      //     cellRendererFramework: params => {
      //       return (
      //         <div className="text-center cursor-pointer">
      //           <div>
      //             <span>{params?.data?.partyId?.email}</span>
      //           </div>
      //         </div>
      //       );
      //     },
      //   },
      //   {
      //     headerName: "Mobile No",
      //     field: "Owner_Mobile_numer",
      //     filter: true,
      //     resizable: true,
      //     width: 140,
      //     cellRendererFramework: params => {
      //       return (
      //         <div className="text-center cursor-pointer">
      //           <div>
      //             <span>{params?.data?.partyId?.Owner_Mobile_numer}</span>
      //           </div>
      //         </div>
      //       );
      //     },
      //   },

      //   {
      //     headerName: "Creation Date",
      //     field: "createdAt",
      //     filter: true,
      //     resizable: true,
      //     width: 150,
      //     cellRendererFramework: params => {
      //       return (
      //         <div className="text-center cursor-pointer">
      //           <div>
      //             <span>{params.data?.createdAt?.split("T")[0]}</span>
      //           </div>
      //         </div>
      //       );
      //     },
      //   },
      // ],
      columnDefs: [
        {
          headerName: "S.No",
          valueGetter: "node.rowIndex + 1",
          field: "node.rowIndex + 1",
          width: 55,
          filter: true,
        },

        // {
        //   headerName: "Status",
        //   field: "order_status",
        //   filter: true,
        //   width: 140,
        //   cellRendererFramework: (params) => {
        //     console.log(params.data);
        //     return params.data?.status === "Active" ? (
        //       <div className="badge badge-pill badge-success">
        //         {params.data?.status}
        //       </div>
        //     ) : params.data?.status === "pending" ? (
        //       <div className="badge badge-pill badge-warning">
        //         {params.data?.status}
        //       </div>
        //     ) : params.data?.status === "return" ? (
        //       <div className="badge badge-pill bg-danger">Returned</div>
        //     ) : params.data?.status === "cancelled" ? (
        //       <div className="badge badge-pill bg-danger">
        //         {params.data.status}
        //       </div>
        //     ) : params.data?.status === "completed" ? (
        //       <div className="badge badge-pill bg-success">Completed</div>
        //     ) : (
        //       <>
        //         <div className="badge badge-pill bg-warning">Cancelled</div>
        //       </>
        //     );
        //   },
        // },
        {
          headerName: "Actions",
          field: "sortorder",
          field: "transactions",
          width: 80,
          cellRendererFramework: (params) => {
            return (
              <div className="actions cursor-pointer">
                {this.state.InsiderPermissions &&
                  this.state.InsiderPermissions?.Delete && (
                    <Trash2
                      className="mr-50"
                      size="20px"
                      color="red"
                      onClick={() => this.runthisfunction(params?.data?._id)}
                      // onClick={() =>  this.props.history.push({
                      //     pathname: `/app/ajgroup/order/CreateReceipt/${params.data?._id}`,
                      //     state: params.data,
                      //   })
                      // }
                    />
                  )}

                {this.state.InsiderPermissions &&
                  this.state.InsiderPermissions?.Edit && (
                    <Route
                      render={() => (
                        <Edit
                          className="mr-50"
                          size="20px"
                          color="green"
                          onClick={() =>
                            this.props.history.push({
                              pathname: `/app/ajgroup/order/CreatePayment/${params?.data?._id}`,
                              state: params.data,
                            })
                          }
                        />
                      )}
                    />
                  )}
              </div>
            );
          },
        },
        {
          headerName: "Date",
          field: "date",
          filter: true,
          resizable: true,
          width: 100,
          cellRendererFramework: (params) => {
            return (
              <div className="text-center cursor-pointer">
                <div>
                  <span>
                    {params?.data?.date
                      ? params?.data?.date.split("T")[0]
                      : "NA"}
                  </span>
                </div>
              </div>
            );
          },
        },
        // {
        //   headerName: "Particular",
        //   field: "expenseId?.title || partyId?.firstName || userId?.firstName",

        //   filter: true,
        //   resizable: true,
        //   width: 280,
        //   cellRendererFramework: (params) => {
        //     return (
        //       <div className="text-center cursor-pointer">
        //         <div>
        //           <span>
        //             {!!params?.data?.expenseId
        //               ? params?.data?.expenseId?.title
        //               : !!params?.data?.partyId
        //               ? params?.data?.partyId?.firstName
        //               : params?.data?.userId?.firstName}
        //           </span>
        //         </div>
        //       </div>
        //     );
        //   },
        // },
        {
          headerName: "Particular",
          // field: "particular",
          valueGetter: (params) => {
            if (params?.data?.expenseId) return params?.data?.expenseId?.title;
            if (params?.data?.partyId)
              return params?.data?.partyId?.CompanyName;
            if (params?.data?.userId) return params?.data?.userId?.firstName;
            if (params?.data?.transporterId?.companyName)
              return params?.data?.transporterId?.companyName;
            return null;
          },
          filter: true,
          resizable: true,
          width: 250,
          cellRendererFramework: (params) => {
            return (
              <div className="text-center cursor-pointer">
                <div>
                  <span>{params.value}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Payment Mode",
          field: "paymentMode",
          filter: true,
          editable: true,
          resizable: true,
          width: 125,
          cellRendererFramework: (params) => {
            return (
              <div className="text-center cursor-pointer">
                <div>
                  <span>
                    {params?.data?.paymentMode
                      ? params?.data?.paymentMode
                      : "NA"}
                  </span>
                </div>
              </div>
            );
          },
        },
        // {
        //   headerName: "Payment Mode",
        //   field: "paymentMode",
        //   filter: true,
        //   resizable: true,
        //   width: 155,
        //   cellRendererFramework: (params) => {
        //     return (
        //       <div className="text-center cursor-pointer">
        //         <div>
        //           <span>{params?.data?.paymentMode}</span>
        //         </div>
        //       </div>
        //     );
        //   },
        // },
        {
          headerName: "Amount",
          field: "amount",
          filter: true,
          resizable: true,
          width: 100,
          cellRendererFramework: (params) => {
            return (
              <div className="text-center cursor-pointer">
                <div>{params?.data?.amount}</div>
              </div>
            );
          },
        },
        {
          headerName: "Remark",
          field: "remark",
          filter: true,
          resizable: true,
          width: 200,
          cellRendererFramework: (params) => {
            return (
              <div className="text-center cursor-pointer">
                <div>
                  <span>{params?.data?.remark}</span>
                </div>
              </div>
            );
          },
        },

        // {
        //   headerName: "Invoice",
        //   field: "invoice",
        //   filter: true,
        //   resizable: true,
        //   width: 140,
        //   cellRendererFramework: (params) => {
        //     // console.log(params?.data?.status);

        //     return (
        //       <div className="d-flex align-items-center justify-content-center cursor-pointer">
        //         <div>
        //           {/* {params?.data?.status == "completed" ? ( */}
        //           <>
        //             {this.state.InsiderPermissions &&
        //               this.state.InsiderPermissions?.View && (
        //                 <AiOutlineDownload
        //                   // onClick={() => this.handleBillDownload(params.data)}
        //                   onClick={() => this.MergeBillNow(params.data)}
        //                   fill="green"
        //                   size="30px"
        //                 />
        //               )}
        //           </>
        //           <span></span>
        //         </div>
        //       </div>
        //     );
        //   },
        // },
        // {
        //   headerName: "FullName",
        //   field: "fullName",
        //   filter: true,
        //   resizable: true,
        //   width: 150,
        //   cellRendererFramework: (params) => {
        //     return (
        //       <div className="d-flex align-items-center justify-content-center cursor-pointer">
        //         <div>
        //           <span>{params?.data?.fullName}</span>
        //         </div>
        //       </div>
        //     );
        //   },
        // },
        // {
        //   headerName: "Email",
        //   field: "partyId.email",
        //   filter: true,
        //   resizable: true,
        //   width: 220,
        //   cellRendererFramework: (params) => {
        //     return (
        //       <div className="text-center cursor-pointer">
        //         <div>
        //           <span>
        //             {params?.data?.partyId?.email
        //               ? params?.data?.partyId?.email
        //               : "NA"}
        //           </span>
        //         </div>
        //       </div>
        //     );
        //   },
        // },
        // {
        //   headerName: "Mobile No",
        //   field: "mobileNumber",
        //   filter: true,
        //   resizable: true,
        //   width: 140,
        //   cellRendererFramework: (params) => {
        //     return (
        //       <div className="text-center cursor-pointer">
        //         <div>
        //           <span>
        //             {params?.data?.partyId?.mobileNumber
        //               ? params?.data?.partyId?.mobileNumber
        //               : "NA"}
        //           </span>
        //         </div>
        //       </div>
        //     );
        //   },
        // },

        {
          headerName: "Creation Date",
          field: "createdAt",
          filter: true,
          resizable: true,
          width: 120,
          cellRendererFramework: (params) => {
            return (
              <div className="text-center cursor-pointer">
                <div>
                  <span>{params.data?.createdAt?.split("T")[0]}</span>
                </div>
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
    await _Get(View_Receipt, db)
      .then((res) => {
        let Payment = res?.Receipts?.filter((ele) =>
          ele?.type?.includes("payment")
        );

        this.setState({ Loading: false });
        if (Payment?.length) {
          this.setState({
            rowData: Payment?.reverse(),
            rowAllData: Payment?.reverse(),
          });
        }
        this.setState({ AllcolumnDefs: this.state.columnDefs });

        let userHeading = JSON.parse(localStorage.getItem("PaymentList"));
        if (userHeading?.length) {
          this.setState({ columnDefs: userHeading });
          this.setState({ SelectedcolumnDefs: userHeading });
          // this.gridApi.setColumnDefs(userHeading);
        } else {
          this.setState({ columnDefs: this.state.columnDefs });
          this.setState({ SelectedcolumnDefs: this.state.columnDefs });
        }
        this.setState({ SelectedCols: this.state.columnDefs });
        console.log(res);
      })
      .catch((err) => {
        this.setState({ rowData: [] });

        this.setState({ Loading: false });
      });
  }
  async componentDidMount() {
    const InsidePermissions = CheckPermission("Payment");
    this.setState({ InsiderPermissions: InsidePermissions });

    let userId = JSON.parse(localStorage.getItem("userData"));
    if (userId?.rolename?.roleName === "MASTER") {
      this.setState({ MasterShow: true });
    }
    await this.Apicalling(userId?._id, userId?.database);
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
          _Delete(Delete_payment_By_Id, id)
            .then((res) => {
              let selectedData = this.gridApi.getSelectedRows();
              this.gridApi.updateRowData({ remove: selectedData });
            })
            .catch((err) => {
              swal("error", "Something Went Wrong", "error");
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
    doc.text("Payment List", 14, 51);
    doc.autoTable({
      head: [Object.keys(parsedData[0])],
      body: tableData,
      startY: 60,
    });

    doc.save("PaymentList.pdf");
  }

  exportToPDF = async () => {
    const csvData = this.gridApi.getDataAsCsv({
      processCellCallback: this.processCell,
    });
    try {
      let data = this.state.rowAllData?.map((ele) => {
        return {
          Date: ele?.date?.split("T")[0],

          Particular: ele?.partyId?.CompanyName
            ? ele?.partyId?.CompanyName
            : ele?.userId?.firstName
            ? ele?.userId?.firstName
            : ele?.transporterId?.companyName
            ? ele?.transporterId?.companyName : ele?.expenseId?.title,
          // User: ele?.userId?.firstName ? ele?.userId?.firstName : "-",
          // ExpenseType: ele?.expenseId?.title ? ele?.expenseId?.title : "-",
          PaymentMode: ele?.paymentMode,
          Amount: ele?.amount,
          Remark: ele?.remark,
        };
      });

      this.generatePDF(data);
    } catch (error) {
      console.error("Error parsing data:", error);
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
    a.download = "PaymentList.xlsx";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }

  exportToExcel = async (fileName, e) => {
    let data = this.state.rowAllData?.map((ele) => {
      return {
        date: ele?.date?.split("T")[0],
        paymentMode: ele?.paymentMode,
        transporterId: ele?.transporterId?.companyName
          ? ele?.transporterId?.companyName
          : "",
        partyId: ele?.partyId?.firstName ? ele?.partyId?.firstName : "",
        userId: ele?.userId?.firstName ? ele?.userId?.firstName : "",
        expenseId: ele?.expenseId?.title ? ele?.expenseId?.title : "",
        amount: ele?.amount,
        remark: ele?.remark,
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
  // exportToExcel = async (fileName, e) => {
  //   this.state.rowAllData?.forEach((ele) => {
  //     if (!!ele?.partyId) {
  //       ele["partyId"] = ele?.partyId?.id;
  //       ele["userId"] = null;
  //       ele["expenseId"] = null;
  //     } else if (!!ele?.userId) {
  //       ele["partyId"] = null;
  //       ele["userId"] = ele?.userId?.id;
  //       ele["expenseId"] = null;
  //     } else {
  //       ele["partyId"] = null;
  //       ele["userId"] = null;
  //       ele["expenseId"] = ele?.expenseId?.id;
  //     }
  //     ele["date"] = ele?.date?.split("T")[0];
  //     delete ele?.cashRunningAmount;
  //     delete ele?.runningAmount;
  //     delete ele?.createdAt;
  //     delete ele?.database;
  //     delete ele?.status;
  //     delete ele?.type;
  //     delete ele?.voucherNo;
  //     delete ele?.updatedAt;
  //     delete ele?.voucherType;
  //     delete ele?.__v;
  //     delete ele?._id;
  //   });
  //   const worksheet = XLSX.utils.json_to_sheet(this.state.rowAllData);
  //   this.setState({ rowAllData: this.state.rowData });
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  //   const excelBuffer = XLSX.write(workbook, {
  //     bookType: "xlsx",
  //     type: "array",
  //   });

  //   const dataBlob = new Blob([excelBuffer], {
  //     type: "application/octet-stream",
  //   });
  //   saveAs(dataBlob, `${fileName}.xlsx`);
  // };
  convertCSVtoExcel = async (fileName) => {
    this.state.rowData?.forEach((ele) => {
      delete ele?.status;
      delete ele?.UID;
      delete ele?.leadStatusCheck;
      delete ele?.Transporter;
      delete ele?.createdAt;
      delete ele?.updatedAt;
      delete ele?.userName;
      delete ele?.created_by;
      delete ele?.__v;
      delete ele?._id;
      // delete ele?.warehouse;
      delete ele?.code;
      delete ele?.database;
      delete ele?.rolename;
      delete ele?.otpVerify;
      delete ele?.password;
      delete ele?.deviceStatus;
      delete ele?.updatedAt;
      delete ele?.planStatus;
      delete ele?.setRule;
      delete ele?.autoBillingStatus;
      delete ele?.Photo;
      delete ele?.shopPhoto;
      delete ele?.leadStatus;
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
    // const CsvData = this.gridApi.getDataAsCsv({
    //   processCellCallback: this.processCell,
    // });
    // await convertDataCSVtoExcel(CsvData, "CustomerList");
  };
  HandleSampleDownload = () => {
    let headings;
    let maxKeys = 0;

    let elementWithMaxKeys = null;

    for (const element of this.state.rowData) {
      const numKeys = Object.keys(element).length; // Get the number of keys in the current element
      if (numKeys > maxKeys) {
        maxKeys = numKeys; // Update the maximum number of keys
        elementWithMaxKeys = element; // Update the element with maximum keys
      }
    }
    let findheading = Object.keys(elementWithMaxKeys);
    let index = findheading.indexOf("_id");
    if (index > -1) {
      findheading.splice(index, 1);
    }
    let index1 = findheading.indexOf("__v");
    if (index1 > -1) {
      findheading.splice(index1, 1);
    }
    headings = findheading?.map((ele) => {
      return {
        headerName: ele,
        field: ele,
        filter: true,
        sortable: true,
      };
    });

    let CCvData = headings?.map((ele, i) => {
      return ele?.field;
    });
    const formattedHeaders = CCvData.join(",");

    Papa.parse(formattedHeaders, {
      complete: (result) => {
        const ws = XLSX.utils.json_to_sheet(result.data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        const excelType = "xls";
        XLSX.writeFile(wb, `PaymentSample.${excelType}`);
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
      "PaymentList",
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
      SelectedCols,
      InsiderPermissions,

      AllcolumnDefs,
    } = this.state;
    return (
      <>
        <>
          <div>
            <Card>
              <Row style={{marginLeft:'3px',marginRight:'3px'}}>
                <Col  >
                  <h1 className="float-left" style={{ fontWeight: "600" ,textTransform:'uppercase', fontSize:'18px' ,marginTop:"25px"}}>
                    Payment List
                  </h1>
                </Col>
                {this.state.MasterShow && (
                  <Col lg="3" md="6" sm="12" style={{marginTop:"25px"}}>
                    <SuperAdminUI
                      onDropdownChange={this.handleDropdownChange}
                      onSubmit={this.handleParentSubmit}
                    />
                  </Col>
                )}
                <Col lg="3" md="6" sm="12" style={{marginTop:"25px"}}>
                  <div className="table-input cssforproductlist">
                    <Input
                      placeholder="search Item here..."
                      onChange={(e) => this.updateSearchQuery(e.target.value)}
                      value={this.state.value}
                    />
                  </div>
                </Col>
                
                <Col lg="2" md="2" sm="6" xs="6" style={{marginTop:"25px"}}>
                  {InsiderPermissions && InsiderPermissions?.Create && (
                    <span>
                      <Route
                        render={({ history }) => (
                          <Button
                            style={{
                              cursor: "pointer",
                              backgroundColor: "rgb(8, 91, 245)",
                              color: "white",
                              fontWeight: "600",
                              height: "43px",
                            }}
                            color="#39cccc"
                            className="float-left"
                            onClick={() =>
                              history.push(
                                `/app/ajgroup/order/CreatePayment/${0}`
                              )
                            }>
                            <FaPlus size={15} /> Payment
                          </Button>
                        )}
                      />
                    </span>
                  )}
                </Col>
                <Col lg="1" md="1" style={{marginTop:"25px"}} xs="6">
                  {InsiderPermissions && InsiderPermissions.View && (
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
                  {InsiderPermissions && InsiderPermissions.Download && (
                    <span className="">
                      <div className="dropdown-container float-right">
                        <ImDownload
                          onMouseEnter={this.toggleDropdown}
                          onMouseLeave={this.toggleDropdown}
                          style={{ cursor: "pointer" }}
                          title="download file"
                          size="35px"
                          className="dropdown-button "
                          color="rgb(8, 91, 245)"
                          // onClick={this.toggleDropdown}
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
                              onClick={() => this.gridApi.exportDataAsCsv()}
                              style={{ cursor: "pointer" }}
                              className=" mx-1 myactive">
                              .CSV
                            </h5> */}
                            {/* <h5
                              onClick={(e) =>
                                this.convertCSVtoExcel("PaymentList")
                              }
                              style={{ cursor: "pointer" }}
                              className=" mx-1 myactive">
                              .XLS
                            </h5> */}
                            <h5
                              onClick={(e) => this.exportToExcel("PaymentList")}
                              style={{ cursor: "pointer" }}
                              className=" mx-1 myactive">
                              .XLSX
                            </h5>
                            {/* <h5
                              onClick={() => this.convertCsvToXml()}
                              style={{ cursor: "pointer" }}
                              className=" mx-1 myactive">
                              .XML
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
                                    href={Payment}
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
              {InsiderPermissions && InsiderPermissions.View && (
                <>
                  {this.state.rowData === null ? null : (
                    <div className="ag-theme-material w-100  ag-grid-table card-body" style={{marginTop:"-1rem"}}>
                      {/*
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
                          <div className="table-input">
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
                            */}
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
                </>
              )}
            </Card>
          </div>
        </>

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
export default PurchaseCompleted;
