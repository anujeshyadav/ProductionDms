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
  Button,
  ModalHeader,
  ModalBody,
  Badge,
  Spinner,
} from "reactstrap";
import { ImDownload } from "react-icons/im";
import ReceiptSample from "../UploadFormats/ReceiptSample.xlsx";
import { ToWords } from "to-words";
import { Eye, ChevronDown, Edit, Delete, Trash2 } from "react-feather";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../../../assets/scss/pages/users.scss";

import { Route } from "react-router-dom";
import swal from "sweetalert";
import { _Delete, _Get } from "../../../../ApiEndPoint/ApiCalling";

import { ContextLayout } from "../../../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import ViewOrder from "../../../../../src/views/apps/freshlist/order/ViewAll";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Logo from "../../../../assets/img/profile/pages/logomain.png";
import Papa from "papaparse";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import "../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../../../assets/scss/pages/users.scss";

import {
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaFilter,
  FaPlus,
} from "react-icons/fa";

import {
  BsFillArrowDownSquareFill,
  BsFillArrowUpSquareFill,
} from "react-icons/bs";
import UserContext from "../../../../context/Context";
import { CheckPermission } from "../house/CheckPermission";
import ClosingStock from "../customer/ProductWIKI/ClosingStock";
import SuperAdminUI from "../../../SuperAdminUi/SuperAdminUI";
import {
  Delete_Receipt_By_Id,
  View_Receipt,
} from "../../../../ApiEndPoint/Api";

const SelectedColums = [];
const toWords = new ToWords({
  localeCode: "en-IN",
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    currencyOptions: {
      // can be used to override defaults for the selected locale
      name: "Rupee",
      plural: "Rupees",
      symbol: "₹",
      fractionalUnit: {
        name: "Paisa",
        plural: "Paise",
        symbol: "",
      },
    },
  },
});
const AddedBill = [];
const AllProduct = [];
class Receipt extends React.Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.gridRef = React.createRef();
    this.gridApi = null;
    this.state = {
      isOpen: false,
      ShowMyBill: false,
      MasterShow: false,
      BillNumber: "",
      Arrindex: "",
      AllbillMerged: [],
      rowData: [],
      rowAllData: [],
      InsiderPermissions: {},
      ViewOneData: {},
      CompanyDetails: {},
      ShowBill: false,
      Applied_Charges: {},
      Billtoposition: "Left",
      shipto: "right",
      logoposition: "Left",
      ButtonText: "Submit",
      Mergebilllength: "",
      modal: false,
      modalOne: false,
      modalTwo: false,
      sgst: "",
      discount: "",
      ViewBill: true,
      wordsNumber: "",
      cgst: "",
      otherCharges: "",
      deliveryCharges: "",
      PrintData: {},
      filterText: "",
      Viewpermisson: null,
      Editpermisson: null,
      Createpermisson: null,
      Deletepermisson: null,
      getPageSize: "",
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
                              pathname: `/app/ajgroup/order/CreateReceipt/${params.data?._id}`,
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
          width: 85,
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
    };
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.filterText !== this.state.filterText) {
      this.props.filterChangedCallback();
    }
  }

  toggleModalOne = () => {
    this.setState((prevState) => ({
      modalOne: !prevState.modalOne,
    }));
  };

  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  toggleModalclose = () => {
    this.setState({ modalOne: false });
    this.setState({ ShowMyBill: false });
  };
  toggleModalcloseTwo = () => {
    this.setState({ modalTwo: false });
  };

  handleChangeView = (data, types) => {
    let type = types;
    if (type == "readonly") {
      this.setState({ ViewOneUserView: true });
      this.setState({ ViewOneData: data });
    } else {
      this.setState({ EditOneUserView: true });
      this.setState({ EditOneData: data });
    }
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
    await _Get(View_Receipt, db)
      .then((res) => {
        let Received = res?.Receipts?.filter((ele) =>
          ele?.type?.includes("receipt")
        );
        this.setState({ Loading: false });
        if (Received?.length) {
          this.setState({
            rowData: Received?.reverse(),
            rowAllData: Received?.reverse(),
          });
        }
        this.setState({ AllcolumnDefs: this.state.columnDefs });

        let userHeading = JSON.parse(localStorage.getItem("ReceiptList"));
        if (userHeading?.length) {
          this.setState({ columnDefs: userHeading });
          this.setState({ SelectedcolumnDefs: userHeading });
          // this.gridApi.setColumnDefs(userHeading);
        } else {
          this.setState({ columnDefs: this.state.columnDefs });
          this.setState({ SelectedcolumnDefs: this.state.columnDefs });
        }
        this.setState({ SelectedCols: this.state.columnDefs });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ rowData: [] });

        this.setState({ Loading: false });
      });
  }

  async componentDidMount() {
    const UserInformation = this.context;
    this.setState({ CompanyDetails: UserInformation?.CompanyDetails });
    let pageparmission = JSON.parse(localStorage.getItem("userData"));
    if (pageparmission?.rolename?.roleName === "MASTER") {
      this.setState({ MasterShow: true });
    }
    await this.Apicalling(pageparmission?._id, pageparmission?.database);

    let billnumner = localStorage.getItem("billnumber");
    if (billnumner) {
      this.setState({ ShowBill: false });
      this.setState({ BillNumber: billnumner });
    }
    const InsidePermissions = CheckPermission("Receipt");
    this.setState({ InsiderPermissions: InsidePermissions });

    let userchoice = JSON.parse(localStorage.getItem("billUI"));
    if (userchoice) {
      this.setState({ logoposition: userchoice?.imagePosition });
      this.setState({ Billtoposition: userchoice?.billTo });
      this.setState({ shipto: userchoice?.shipto });
    }
  }

  submitHandler = (e) => {
    e.preventDefault();
    let mychoice = {
      imagePosition: this.state.logoposition,
      billTo: this.state.Billtoposition,
      shipto: this.state.shipto,
    };

    if (mychoice.billTo == mychoice.shipto) {
      swal("Can not set Bill to and Ship to on one Same side");
    } else {
      localStorage.setItem("billUI", JSON.stringify(mychoice));
      this.setState({ ShowMyBill: true });
    }
  };
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
          _Delete(Delete_Receipt_By_Id, id)
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
  // handleBillSet = (i) => {
  //   this.setState({ BillNumber: i });
  //   localStorage.setItem("billnumber", i);
  //   this.toggleModalOne();
  // };
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
            result.data?.forEach((ele) => {
              delete ele?.Actions;
            });
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
    doc.text("Receipt List", 14, 51);
    doc.autoTable({
      head: [Object.keys(parsedData[0])],
      body: tableData,
      startY: 60,
    });

    doc.save("ReceiptList.pdf");
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
    // try {
    //   let data = this.state.rowAllData?.map((ele) => {
    //     return {
    //       Date: ele?.date?.split("T")[0],

    //       Particular: ele?.partyId?.firstName
    //         ? ele?.partyId?.firstName
    //         : ele?.userId?.firstName
    //         ? ele?.userId?.firstName
    //         : ele?.expenseId?.title,
    //       // User: ele?.userId?.firstName ? ele?.userId?.firstName : "-",
    //       // ExpenseType: ele?.expenseId?.title ? ele?.expenseId?.title : "-",
    //       PaymentMode: ele?.paymentMode,
    //       Amount: ele?.amount,
    //       Remark: ele?.remark,
    //     };
    //   });

    //   this.generatePDF(data);
    // } catch (error) {
    //   console.error("Error parsing data:", error);
    // }
  };
  // exportToPDF = async () => {
  //   const csvData = this.gridApi.getDataAsCsv({
  //     processCellCallback: this.processCell,
  //   });
  //   try {
  //     const parsedData = await this.parseCsv(csvData);
  //     this.generatePDF(parsedData);
  //   } catch (error) {
  //     console.error("Error parsing CSV:", error);
  //   }
  // };
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
          result.data?.forEach((ele) => {
            delete ele?.Actions;
          });
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
    a.download = "ReceiptList.xlsx";
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
  // exportToExcel = async (fileName, e) => {
  //   let data = this.state.rowAllData?.map((ele) => {
  //     return {
  //       date: ele?.date?.split("T")[0],
  //       paymentMode: ele?.paymentMode,
  //       partyId: ele?.partyId?.firstName ? ele?.partyId?.firstName : "",
  //       userId: ele?.userId?.firstName ? ele?.userId?.firstName : "",
  //       expenseId: ele?.expenseId?.title ? ele?.expenseId?.title : "",
  //       amount: ele?.amount,
  //       remark: ele?.remark,
  //     };
  //   });
  //   const worksheet = XLSX.utils.json_to_sheet(data);
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
        link.download = "OrderList.xml";
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
      "ReceiptList",
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
      SelectedCols,
      InsiderPermissions,
      AllcolumnDefs,
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

              {/* <EditAccount EditOneData={this.state.EditOneData} /> */}
            </Row>
          ) : (
            <>
              {this.state.ViewOneUserView && this.state.ViewOneUserView ? (
                <>
                  <Row>
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
                    <ViewOrder ViewOneData={this.state.ViewOneData} />
                  </Row>
                </>
              ) : (
                <>
                  <Col sm="12">
                    <Card>
                      <Row style={{marginLeft:'3px',marginRight:'3px'}}>
                        <Col  >
                          <h1
                            className="float-left"
                            style={{ fontWeight: "600" ,textTransform:'uppercase', fontSize:'18px' ,marginTop:"25px"}}>
                            Receipt List
                          </h1>
                        </Col>
                        <Col lg="3" md="6" sm="12" style={{marginTop:"25px"}}>
                          <div className="table-input cssforproductlist">
                            <Input
                              placeholder="search Item here..."
                              onChange={(e) =>
                                this.updateSearchQuery(e.target.value)
                              }
                              value={this.state.value}
                            />
                          </div>
                        </Col>
                        {this.state.MasterShow && (
                          <Col lg="3" md="6" sm="12" style={{marginTop:"25px"}}>
                            <SuperAdminUI
                              onDropdownChange={this.handleDropdownChange}
                              onSubmit={this.handleParentSubmit}
                            />
                          </Col>
                        )}
                       
                         

                       

                        <Col lg="3" xs="6" style={{marginTop:"25px"}}>
                        <div style={{display:"flex", justifyContent:"space-between"}}>
                          <div>
                         
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
                                        `/app/ajgroup/order/CreateReceipt/${0}`
                                      )
                                    }>
                                    <FaPlus size={15} /> Receipt
                                  </Button>
                                )}
                              />

                               
                              <Route
                                render={({ history }) => (
                                  <Button
                                    style={{
                                      cursor: "pointer",
                                      backgroundColor: "rgb(8, 91, 245)",
                                      color: "white",
                                      marginLeft:"10px",
                                      fontWeight: "600",
                                      height: "43px",
                                    }}
                                    color="#39cccc"
                                    className="float-right"
                                    onClick={() =>
                                      history.push(
                                        `/app/jupitech/ExpenseAccountsList`
                                      )
                                    }>
                                    <FaPlus size={15} /> Accounts
                                  </Button>
                                )}
                              />
                            </span>
                          )}
                            </div>
                           <div>
                          {InsiderPermissions && InsiderPermissions?.View && (
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
                                        className=" mx-1 myactive">
                                        .CSV
                                      </h5> */}
                                      {/* <h5
                                        onClick={(e) =>
                                          this.convertCSVtoExcel("ReceiptList")
                                        }
                                        style={{ cursor: "pointer" }}
                                        className=" mx-1 myactive">
                                        .XLS
                                      </h5> */}
                                      <h5
                                        onClick={(e) =>
                                          this.exportToExcel("ReceiptList")
                                        }
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
                                              href={ReceiptSample}
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
                               </div>
                          </div>
                        </Col>
                      </Row>
                      {InsiderPermissions && InsiderPermissions?.View && (
                        <>
                          {this.state.rowData === null ? null : (
                            <div className="ag-theme-material w-100   ag-grid-table card-body" style={{marginTop:"-1rem"}}>
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
                                      <ChevronDown
                                        className="ml-50"
                                        size={15}
                                      />
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
                            */}
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
      </>
    );
  }
}
export default Receipt;
