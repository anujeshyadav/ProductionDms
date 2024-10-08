import React from "react";
import { ImDownload } from "react-icons/im";
import html2canvas from "html2canvas";
import {
  Card,
  CardBody,
  Input,
  Row,
  Modal,
  Col,
  Button,
  ModalHeader,
  ModalBody,
  Badge,
  Spinner,
} from "reactstrap";

import { AiOutlineDownload } from "react-icons/ai";
import { ToWords } from "to-words";
import { CornerDownLeft, Trash2 } from "react-feather";
import InvoicGenerator from "../../subcategory/PurchaseInvoice";
import { Route, Link } from "react-router-dom";
import swal from "sweetalert";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";

import jsPDF from "jspdf";
import "jspdf-autotable";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import Papa from "papaparse";
import { ContextLayout } from "../../../../../utility/context/Layout";
import Logo from "../../../../../assets/img/profile/pages/logomain.png";
import {
  PurchaseOrderList,
  ViewCompanyDetails,
  _Delete,
  _Get,
  _Post,
} from "../../../../../ApiEndPoint/ApiCalling";
import "../../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../../../../assets/scss/pages/users.scss";
import { history } from "../../../../../history";
import ViewOrder from "../../../../../../src/views/apps/freshlist/order/ViewAll";
import "./cutomTable.css";
import "../../../../../assets/scss/pages/users.scss";
import {
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaFilter,
} from "react-icons/fa";
import { DeleteAccount } from "../../../../../ApiEndPoint/ApiCalling";
import {
  Completed_Order_Delete,
  Image_URL,
  Place_Order_Delete,
} from "../../../../../ApiEndPoint/Api";
import UserContext from "../../../../../context/Context";
import { CheckPermission } from "../../house/CheckPermission";
import { HsnSummaryCalculation } from "../../subcategory/HsnSummaryCalculation";
import {
  BsFillArrowDownSquareFill,
  BsFillArrowUpSquareFill,
} from "react-icons/bs";
import * as XLSX from "xlsx";
import SuperAdminUI from "../../../../SuperAdminUi/SuperAdminUI";
import { Purchase_Invoice } from "../../../../../ApiEndPoint/Api";

// new invoiceData
import Invoicenew from "./Invoicenew";
import Invoicebankdetail from "./Invoicesections/Invoicebankdetail";
import Invoicesignature from "./Invoicesections/Invoicesignature";
import Sallerdetail from "./Invoicesections/Sallerdetail";
import Invoicelogo from "./Invoicesections/Invoicelogo";
import Invoiceiddetail from "./Invoicesections/Invoiceiddetail";
import Invoicebillto from "./Invoicesections/Invoicebillto";
import Invoiceshipto from "./Invoicesections/Invoiceshipto";
import Dispatchdetails from "./Invoicesections/Dispatchdetails";
import Invoicetable from "./Invoicesections/Invoicetable";
import InvoiceConditions from "./Invoicesections/InvoiceConditions";
import InvoiceGrandtotal from "./Invoicesections/InvoiceGrandtotal";
import Incoicehsntable from "./Invoicesections/Incoicehsntable";

const SelectedColums = [];
const toWords = new ToWords({
  localeCode: "en-IN",
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    currencyOptions: {
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
class PurchaseInvoice extends React.Component {
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
      InsiderPermissions: {},
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
      discount: "",
      ViewBill: true,
      wordsNumber: "",
      otherCharges: "",
      PrintData: {},

      getPageSize: "",
      columnDefs: [
        {
          headerName: "S.No",
          valueGetter: "node.rowIndex + 1",
          field: "node.rowIndex + 1",
          width: 55,
          filter: true,
        },
        {
          headerName: "Actions",
          field: "sortorder",
          field: "transactions",
          width: 70,
          cellRendererFramework: (params) => {
            return (
              <div className="actions cursor-pointer cursor-pointer text-center">
                {this.state.InsiderPermissions &&
                  this.state.InsiderPermissions?.Edit && (
                    <CornerDownLeft
                      className="mr-50"
                      size="20px"
                      color="green"
                      onClick={() => {
                        localStorage.setItem(
                          "PurchaseInvoice",
                          JSON.stringify(params.data)
                        );
                        this.props.history.push({
                          pathname: `/app/AJGroup/order/purchaseReturn/${params.data?._id}`,
                          state: params.data,
                        });
                      }}
                    />
                  )}

                {this.state.InsiderPermissions &&
                  this.state.InsiderPermissions?.Delete && (
                    <Route
                      render={() => (
                        <Trash2
                          className="mr-50"
                          size="20px"
                          color="red"
                          onClick={() => {
                            // let selectedData = this.gridApi.getSelectedRows();
                            this.runthisfunction(
                              params.data?._id,
                              params.data.status
                            );
                            // this.gridApi.updateRowData({
                            //   remove: selectedData,
                            // });
                          }}
                        />
                      )}
                    />
                  )}
              </div>
            );
          },
        },
        {
          headerName: "Status",
          field: "order_status",
          filter: true,
          width: 95,
          cellRendererFramework: (params) => {
            // console.log(params.data);
            return params.data?.status === "completed" ? (
              <div className="cursor-pointer text-center">Completed</div>
            ) : params.data?.status === "pending" ? (
              <div className="cursor-pointer text-center">
                {params.data?.status}
              </div>
            ) : params.data?.status === "return" ? (
              <div className="cursor-pointer text-center">Returned</div>
            ) : params.data?.status === "cancelled" ? (
              <div className="cursor-pointer text-center">
                {params.data.status}
              </div>
            ) : params.data?.status === "completed" ? (
              <div className="cursor-pointer text-center">Completed</div>
            ) : (
              <>
                <div className="cursor-pointer text-center">Cancelled</div>
              </>
            );
          },
        },
        {
          headerName: "invoiceId",
          field: "invoiceId",
          filter: true,
          editable: true,
          resizable: true,
          width: 195,
          cellRendererFramework: (params) => {
            // console.log(params.data);

            return (
              <div className="cursor-pointer text-center">
                <div>
                  <span>{params?.data?.invoiceId}</span>
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
        //   width: 100,
        //   cellRendererFramework: params => {
        //     return (
        //       <div className="cursor-pointer text-center">
        //         <div>
        //           {params?.data?.status == "completed" ? (
        //             <>
        //               {this.state.InsiderPermissions &&
        //                 this.state.InsiderPermissions?.Download && (
        //                   <AiOutlineDownload
        //                     onClick={() => this.MergeBillNow(params.data)}
        //                     fill="green"
        //                     size="30px"
        //                   />
        //                 )}
        //             </>
        //           ) : (
        //             "NA"
        //           )}
        //           <span></span>
        //         </div>
        //       </div>
        //     );
        //   },
        // },
        {
          headerName: "Invoice",
          field: "invoice",
          filter: true,
          resizable: true,
          width: 70,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <div>
                  {params?.data?.status == "completed" ? (
                    <>
                      {this.state.InsiderPermissions &&
                        this.state.InsiderPermissions?.Download && (
                          <AiOutlineDownload
                            onClick={() => this.MergeBillNow(params.data)}
                            fill="green"
                            size="20px"
                          />
                        )}
                    </>
                  ) : (
                    "NA"
                  )}
                  <span></span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Contact Number",
          field: "partyId.contactNumber",
          filter: true,
          width: 135,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <div>
                  <span>{params.data?.partyId?.contactNumber}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Company Name",
          field: "partyId.CompanyName",
          filter: true,
          width: 200,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <div>
                  <span>{params.data?.partyId?.CompanyName}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Owner Name",
          field: "partyId.ownerName",
          filter: true,
          width: 200,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <div>
                  <span>{params.data?.partyId?.ownerName}</span>
                </div>
              </div>
            );
          },
        },

        {
          headerName: "Builty Number",
          field: "BuiltyNumber",
          filter: true,
          editable: true,
          width: 125,
          cellRendererFramework: (params) => {
            return (
              <div className=" text-center">
                <div>
                  <span>{params.data?.BuiltyNumber}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "No Of Package",
          field: "NoOfPackage",
          filter: true,
          editable: true,
          width: 110,
          cellRendererFramework: (params) => {
            return (
              <div className=" text-center">
                <div>
                  <span>{params.data?.NoOfPackage}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Vehicle No",
          field: "vehicleNo",
          filter: true,
          editable: true,
          width: 110,
          cellRendererFramework: (params) => {
            return (
              <div className=" text-center">
                <div>
                  <span>{params.data?.vehicleNo}</span>
                </div>
              </div>
            );
          },
        },

        {
          headerName: "Tax",
          field: "Tax",
          filter: true,
          width: 100,
          cellRendererFramework: (params) => {
            return (
              <div className=" text-center">
                <div>{params.data?.Tax}</div>
              </div>
            );
          },
        },
        // {
        //   headerName: "User Name",
        //   field: "partyId.userName",
        //   filter: true,
        //   width: 210,
        //   cellRendererFramework: (params) => {
        //     return (
        //       <div className="cursor-pointer text-center">
        //         <div>
        //           <span>{params.data?.partyId?.userName}</span>
        //         </div>
        //       </div>
        //     );
        //   },
        // },
        // {
        //   headerName: "IGST ",
        //   field: "igstTotal",
        //   filter: true,
        //   width: 100,
        //   cellRendererFramework: (params) => {
        //     return (
        //       <div className="cursor-pointer text-center">
        //         <div>{params.data?.igstTotal && params.data?.igstTotal}</div>
        //       </div>
        //     );
        //   },
        // },
        // {
        //   headerName: "SGST  ",
        //   field: "sgstTotal",
        //   filter: true,
        //   width: 100,
        //   cellRendererFramework: (params) => {
        //     return (
        //       <div className="cursor-pointer text-center">
        //         <div>{params.data?.sgstTotal && params.data?.sgstTotal}</div>
        //       </div>
        //     );
        //   },
        // },
        // {
        //   headerName: "CGST  ",
        //   field: "cgstTotal",
        //   filter: true,
        //   width: 100,
        //   cellRendererFramework: (params) => {
        //     return (
        //       <div className="cursor-pointer text-center">
        //         <div>{params.data?.cgstTotal && params.data?.cgstTotal}</div>
        //       </div>
        //     );
        //   },
        // },
        {
          headerName: "Amount",
          field: "amount",
          filter: true,
          width: 100,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <div>{params.data?.amount}</div>
              </div>
            );
          },
        },
        {
          headerName: "Charges",
          field: "coolieAndCartage",
          filter: true,
          width: 100,
          cellRendererFramework: (params) => {
            return (
              <div className=" text-center">
                <div>{params.data?.coolieAndCartage}</div>
              </div>
            );
          },
        },
        {
          headerName: "Round Off",
          field: "roundOff",
          filter: true,
          width: 100,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <div>{params.data?.roundOff}</div>
              </div>
            );
          },
        },
        {
          headerName: "Grand Total",
          field: "grandTotal",
          filter: true,
          width: 105,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <div>{params.data?.grandTotal}</div>
              </div>
            );
          },
        },

        // {
        //   headerName: "Total Product",
        //   field: "params?.data?.orderItems?.length",
        //   filter: true,
        //   resizable: true,
        //   width: 125,
        //   cellRendererFramework: (params) => {
        //     // console.log(params.data);
        //     return (
        //       <div className="cursor-pointer text-center">
        //         <div>{params?.data?.orderItems?.length} Products</div>
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
        //   cellRendererFramework: params => {
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
      setMySelectedarr: [],
      SelectedCols: [],
      paginationPageSize: 15,
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
  handleMultipleBillsAdd = (data, check) => {
    this.setState({ PrintData: data });
    let pageparmission = JSON.parse(localStorage.getItem("userData"));
    if (check) {
      AddedBill.push({
        order_id: data?.order_id,
        user_id: pageparmission?.Userinfo?.id,
        role: pageparmission?.Userinfo?.role,
      });
    } else {
      let index = AddedBill.findIndex(
        (ele) => ele?.order_id === data?.order_id
      );
      AddedBill.splice(index, 1);
    }
    this.setState({ Mergebilllength: AddedBill?.length });
  };

  MergeBillNow = async (data) => {
    let decimalValue;
    let value = data;
    value["purchaseStatus"] = true;
    const containsDecimal = /\./.test(Number(value?.grandTotal?.toFixed(2)));
    if (containsDecimal) {
      decimalValue = Number(
        value?.grandTotal?.toFixed(2)?.toString()?.split(".")[1]
      );
      if (decimalValue > 49) {
        let roundoff = 100 - decimalValue;
        value["grandTotal"] = parseFloat(value.grandTotal) + roundoff / 100;
        value["roundOff"] = `+ ${roundoff / 100}`;
      } else {
        let roundoff = -decimalValue;
        value["grandTotal"] =
          parseFloat(value?.grandTotal) - decimalValue / 100;
        value["roundOff"] = `${roundoff / 100}`;
      }
    } else {
      value["grandTotal"] = Number((value?.grandTotal).toFixed(2));
    }

    const UserInformation = this.context;
    let gstDetails = HsnSummaryCalculation(data);

    if (UserInformation?.CompanyDetails?.BillNumber) {
      data["gstDetails"] = gstDetails;
      this.setState({ ShowBill: false });
      this.setState({ PrintData: value });

      const sumWithInitial = gstDetails.reduce((accumulator, ele) => {
        return accumulator + ele?.taxable;
      }, 0);

      const toWords = new ToWords();
      let words = toWords.convert(Number(data?.grandTotal), {
        currency: true,
      });
      this.setState({ wordsNumber: words });
      this.toggleModalOne();
    } else {
      swal("Select Bill Template from Setting Tab");
      this.setState({ ShowBill: true });
      this.toggleModalOne();
    }
  };
  handleBillDownload = (data) => {
    this.setState({ PrintData: data });
    const toWords = new ToWords();
    let words = toWords.convert(Number(data.sub_total), { currency: true });
    this.setState({ wordsNumber: words });
    this.toggleModal();
  };
  toggleModal = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };
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
    // window.location.reload();
    // AddedBill = [];
    // console.log(AddedBill);
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

    await PurchaseOrderList(id, db)
      .then((res) => {
        this.setState({ Loading: false });

        const newList = res?.orderHistory?.filter((ele) =>
          ele.status?.toLowerCase()?.includes("completed")
        );
           newList?.forEach((element) => {
             element["Tax"] =
               element.igstTotal > 0
                 ? element?.igstTotal
                 : element?.cgstTotal + element?.sgstTotal;
           });
        this.setState({ rowData: newList?.reverse() });
        this.setState({ AllcolumnDefs: this.state.columnDefs });

        let userHeading = JSON.parse(
          localStorage.getItem("PurchaseInvoiceList")
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
        this.setState({ Loading: false });
        this.setState({ rowData: [] });

        console.log(err);
      });
  }

  async componentDidMount() {
    let pageparmission = JSON.parse(localStorage.getItem("userData"));
    if (pageparmission?.rolename?.roleName === "MASTER") {
      this.setState({ MasterShow: true });
    }

    await this.Apicalling(pageparmission?._id, pageparmission?.database);

    await ViewCompanyDetails(pageparmission?._id, pageparmission?.database)
      .then((res) => {
        // console.log(res?.CompanyDetail);
        this.setState({ CompanyDetails: res?.CompanyDetail });
      })
      .catch((err) => {
        console.log(err);
      });

    const UserInformation = this.context;

    if (UserInformation?.CompanyDetails?.BillNumber) {
      this.setState({ ShowBill: false });
      this.setState({ BillNumber: UserInformation?.CompanyDetails?.billNo });
    }

    const InsidePermissions = CheckPermission("Purchase Invoice");
    // console.log(InsidePermissions);
    this.setState({ InsiderPermissions: InsidePermissions });
    // console.log(pageparmission.role);
    // let userchoice = JSON.parse(localStorage.getItem("billUI"));
    // // console.log(userchoice);
    // if (userchoice) {
    //   this.setState({ logoposition: userchoice?.imagePosition });
    //   this.setState({ Billtoposition: userchoice?.billTo });
    //   this.setState({ shipto: userchoice?.shipto });
    // }
  }

  toggleDropdown = () => {
    this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
  };

  runthisfunction(id, status) {
    debugger;
    let URL = "";
    if (status?.toLowerCase()?.includes("completed")) {
      URL = Completed_Order_Delete;
    } else {
      URL = Place_Order_Delete;
    }
    swal("Warning", "Sure You Want to Delete it", {
      buttons: {
        cancel: "Cancel",
        catch: { text: "Delete ", value: "delete" },
      },
    }).then((value) => {
      switch (value) {
        case "delete":
          _Delete(URL, id)
            .then((res) => {
              this.componentDidMount();
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
  handleBillSet = (i) => {
    this.setState({ BillNumber: i });
    localStorage.setItem("billnumber", i);
    this.toggleModalOne();
    // this.setState({ ShowBill: false });
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
    doc.text("PurchaseInvoice", 14, 51);
    doc.autoTable({
      head: [Object.keys(parsedData[0])],
      body: tableData,
      startY: 60,
    });

    doc.save("PurchaseInvoice.pdf");
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
    a.download = "PurchaseInvoice.xlsx";
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
        XLSX.writeFile(wb, `PurchaseInvoice.${excelType}`);
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
        link.download = "PurchaseInvoice.xml";
        link.click();
      },
    });
  };

  generatePdf = () => {
    const input = document.getElementById("pdf-content");
    const desiredWidth = 600; // Desired width of the PDF
    const desiredHeight = 800; // Desired height of the PDF

    // Ensure all images are fully loaded
    const images = input.getElementsByTagName("img");
    const promises = [];
    for (let img of images) {
      if (!img.complete) {
        promises.push(
          new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          })
        );
      }
    }

    Promise.all(promises)
      .then(() => {
        // After all images are loaded, proceed with generating the PDF
        html2canvas(input, {
          scale: 2, // Adjust the scale factor as needed
          useCORS: true, // Ensure CORS images are loaded
        })
          .then((canvas) => {
            // Debugging: Append canvas to the document to inspect it
            document.body.appendChild(canvas);

            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF({
              orientation: "portrait", // Set orientation to portrait or landscape based on your requirement
              unit: "px", // Use pixels for units
              format: [desiredWidth, desiredHeight], // Set the width and height of the PDF
            });

            pdf.addImage(imgData, "PNG", 0, 0, desiredWidth, desiredHeight);
            pdf.save("invoiceBill.pdf");
          })
          .catch((error) => {
            console.error("html2canvas error:", error);
          });
      })
      .catch((error) => {
        console.error("Image loading error:", error);
      });
  };

  HandleSetVisibleField = (e) => {
    e.preventDefault();
    this.gridApi.setColumnDefs(this.state.SelectedcolumnDefs);
    this.setState({ columnDefs: this.state.SelectedcolumnDefs });
    this.setState({ SelectedcolumnDefs: this.state.SelectedcolumnDefs });
    this.setState({ rowData: this.state.rowData });
    localStorage.setItem(
      "PurchaseInvoiceList",
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
      // const splicedElement = SelectedCols.splice(delindex, 1); // Remove the element

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
                    <ViewOrder ViewOneData={this.state.ViewOneData} />
                  </Row>
                </>
              ) : (
                <>
                  <Col sm="12">
                    <Card>
                      <Row style={{ marginLeft: "3px", marginRight: "3px" }}>
                        <Col>
                          <h1
                            className="float-left "
                            style={{
                              fontWeight: "600",
                              textTransform: "uppercase",
                              fontSize: "18px",
                              marginTop: "25px",
                            }}>
                            Purchased Invoice
                          </h1>
                        </Col>
                        <Col
                          lg="3"
                          md="6"
                          sm="12"
                          style={{ marginTop: "25px" }}>
                          <div className="table-input mr-1 cssforproductlist">
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
                          <Col
                            lg="3"
                            md="4"
                            sm="12"
                            style={{ marginTop: "25px" }}>
                            <SuperAdminUI
                              onDropdownChange={this.handleDropdownChange}
                              onSubmit={this.handleParentSubmit}
                            />
                          </Col>
                        )}
                        <Col lg="2" style={{ marginTop: "25px" }}>
                          {this.state.InsiderPermissions &&
                            this.state.InsiderPermissions?.Create && (
                              <Link to="/app/AJgroup/order/CreatePurchaseInvoice">
                                <Button color="primary">Create Invoice</Button>
                              </Link>
                            )}
                          {this.state.InsiderPermissions &&
                            this.state.InsiderPermissions.View && (
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
                          {this.state.InsiderPermissions &&
                            this.state.InsiderPermissions?.Download && (
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
                            )}
                        </Col>
                      </Row>
                      {this.state.InsiderPermissions &&
                        this.state.InsiderPermissions?.View && (
                          <>
                            {this.state.rowData === null ? null : (
                              <div className="ag-theme-material w-100   ag-grid-table">
                                <div className="d-flex flex-wrap justify-content-between align-items-center">
                                  {/* <div className="mb-1">
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
                                  </div> */}
                                  {/* <div className="d-flex flex-wrap justify-content-end mb-1">
                                    <div className="table-input mr-1">
                                      <Input
                                        placeholder="search Item here..."
                                        onChange={(e) =>
                                          this.updateSearchQuery(e.target.value)
                                        }
                                        value={this.state.value}
                                      />
                                    </div>
                                  </div> */}
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
        {/* <Modal
          isOpen={this.state.modalOne}
          toggle={this.toggleModalOne}
          className={this.props.className}
          size="xl">
          <ModalHeader toggle={this.toggleModalclose}>Invoice Bill</ModalHeader>
          <ModalBody>
            <div>
              <div className="borderinvoice">
                <div className="row ">
                  <div className="col-lg-3 col-xl-3 col-md-3 col-xs-3 sallerdetailborder1 ">
                    <div>
                      <Sallerdetail
                        companyDetails={this.state?.CompanyDetails}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-xl-3 col-md-3 col-xs-3 sallerdetailborder">
                    <div className="text-center">
                      <div className="container-fluid">
                        <img
                          src={`${Image_URL}/Images/${this.state?.CompanyDetails?.logo}`}
                          className="logoinvoicecss"
                          alt="54"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-xl-6 col-md-6 col-xs-6 sallerdetailborder1">
                    <div>
                      <Invoiceiddetail printData={this.state.PrintData} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="borderinvoice1 ">
                <div className="row ">
                  <div className="col-lg-3 col-xl-3 col-md-3 col-xs-3 sallerdetailborder01  ">
                    <div>
                      <Invoicebillto />
                    </div>
                  </div>
                  <div className="col-lg-3 col-xl-3 col-md-3 col-xs-3 sallerdetailborder0 ">
                    <div className="">
                      <Invoiceshipto />
                    </div>
                  </div>
                  <div className="col-lg-6 col-xl-6 col-md-6 col-xs-6 sallerdetailborder01 ">
                    <div>
                      <Dispatchdetails />
                    </div>
                    <div></div>
                  </div>
                </div>
              </div>
              <div>
                <Invoicetable printData={this.state.PrintData} />
              </div>

              <div className="borderinvoice " style={{ marginTop: "-14px" }}>
                <div className="row ">
                  <div className="col-lg-6 col-xl-6 col-md-6 col-xs-6 sallerdetailborder">
                    <div>
                      <InvoiceConditions />
                    </div>
                  </div>
                  <div className="col-lg-6 col-xl-6 col-md-6 col-xs-6 sallerdetailborder1">
                    <div className="p-1">
                      <InvoiceGrandtotal />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <Incoicehsntable />
              </div>
              <div className="borderinvoice " style={{ marginTop: "-14px" }}>
                <div className="row ">
                  <div className="col-lg-6 col-xl-6 col-md-6 col-xs-6 sallerdetailborder">
                    <div>
                      <Invoicebankdetail />
                    </div>
                  </div>
                  <div className="col-lg-6 col-xl-6 col-md-6 col-xs-6 sallerdetailborder1">
                    <div className="p-1">
                      <Invoicesignature />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
        </Modal> */}
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
                              key={i}
                              onClick={(e) =>
                                this.handleChangeHeader(e, ele, i)
                              }
                              className="mycustomtag mt-1">
                              <span className="mt-1">
                                <h5
                                  key={i}
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

        {/* before modal  */}
        <Modal
          isOpen={this.state.modalOne}
          toggle={this.toggleModalOne}
          className={this.props.className}
          style={{ maxWidth: "1050px" }}>
          <ModalHeader toggle={this.toggleModalclose}>
            {this.state.ShowBill ? "Download BIll" : "Download BIll"}
          </ModalHeader>
          <ModalBody>
            <div style={{ width: "100%" }} className="">
              <InvoicGenerator
                CompanyDetails={this.state.CompanyDetails}
                BillNumber={this.state.BillNumber}
                PrintData={this.state.PrintData}
                Applied_Charges={this.state.Applied_Charges}
                AllbillMerged={this.state.AllbillMerged}
                wordsNumber={this.state.wordsNumber}
                otherCharges={this.state.otherCharges}
                discount={this.state.discount}
              />
            </div>
          </ModalBody>
        </Modal>
        {/* <Modal
          isOpen={this.state.modalOne}
          toggle={this.toggleModalOne}
          className={this.props.className}
          size="xl"
        >
          <ModalHeader toggle={this.toggleModalclose}>
            <div className=" ">
              <div>
                {this.state.ShowBill ? "Download BIll" : "Download BIll"}
              </div>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="">
              <button onClick={this.generatePdf}>Download as PDF</button>
              <div
                id="pdf-content"
                style={{ padding: 10, background: "#f5f5f5" }}
              >
                <div id="dataContainer" className="m-0">
                  <div className="borderinvoice">
                    <div className="row firstRow">
                      <div className="col-lg-3 col-xl-3 col-md-3 col-xs-3 sallerdetailborder1">
                        <div>
                          <div className="container-fluid">
                            <h4>{this.state?.CompanyDetails?.name}</h4>

                            <span className="fontsizeinvoice">
                              GSTIN :{this.state.CompanyDetails?.gstNo}
                              <br></br>
                              {this.state.CompanyDetails?.address}
                              <br></br>
                              MobileNo :{this.state.CompanyDetails?.mobileNo}
                              <br></br>
                              Email :mailto:{this.state.CompanyDetails?.email}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 col-xl-3 col-md-3 col-xs-3 sallerdetailborder">
                        <div className="text-center">
                          <div className="container-fluid">
                            <img
                              src={`${Image_URL}/Images/${this.state?.CompanyDetails?.logo}`}
                              className="logoinvoicecss"
                              alt="54"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 col-xl-6 col-md-6 col-xs-6 sallerdetailborder1">
                        <div>
                          <div className="">
                            <div className="row firstRow">
                              <div className="col-xl-3 col-lg-3 col-md-3 col-xs-3 col-sm-3">
                                <span className="fontsizeinvoice">
                                  Invoice No.
                                </span>
                              </div>
                              <div className="col-xl-3 col-lg-3 col-md-3 col-xs-3 col-sm-3">
                                <span className="fontsizeinvoice">
                                  :{this.state.PrintData?.invoiceId}
                                </span>
                              </div>
                              <div className="col-xl-3 col-lg-3 col-md-3 col-xs-3 col-sm-3">
                                <span className="fontsizeinvoice">Date</span>
                              </div>
                              <div className="col-xl-3 col-lg-3 col-md-3 col-xs-3 col-sm-3">
                                <span className="fontsizeinvoice">
                                  :
                                  {this.state.PrintData?.date &&
                                    this.state.PrintData?.date?.split("T")[0]}
                                </span>
                              </div>
                            </div>
                            <div className="row firstRow">
                              <div className="col-xl-3 col-lg-3 col-md-3 col-xs-3 col-sm-3">
                                <span className="fontsizeinvoice">
                                  Sales Person Name
                                </span>
                              </div>
                              <div className="col-xl-3 col-lg-3 col-md-3 col-xs-3 col-sm-3">
                                <span className="fontsizeinvoice">
                                  :
                                  {this.state.PrintData?.userId?.firstName +
                                    this.state.PrintData?.userId?.lastName}
                                </span>
                              </div>
                              <div className="col-xl-3 col-lg-3 col-md-3 col-xs-3 col-sm-3">
                                <span className="fontsizeinvoice">
                                  Mobile No.
                                </span>
                              </div>
                              <div className="col-xl-3 col-lg-3 col-md-3 col-xs-3 col-sm-3">
                                <span className="fontsizeinvoice">
                                  :
                                  {this.state.PrintData?.MobileNo &&
                                    this.state.PrintData?.MobileNo}
                                </span>
                              </div>
                            </div>
                            <div className="row firstRow">
                              <div className="col-xl-3 col-lg-3 col-md-3 col-xs-3 col-sm-3">
                                <span className="fontsizeinvoice">
                                  Ladger Balance
                                </span>
                              </div>
                              <div className="col-xl-3 col-lg-3 col-md-3 col-xs-3 col-sm-3">
                                <span className="fontsizeinvoice">
                                  :
                                  {this.state?.CompanyDetails?.mobileNo &&
                                    this.state?.CompanyDetails?.mobileNo}
                                </span>
                              </div>
                              <div className="col-xl-3 col-lg-3 col-md-3 col-xs-3 col-sm-3 cssforcolsmall">
                                <span className="fontsizeinvoice">
                                  Last Payment Amount
                                </span>
                              </div>
                              <div className="col-xl-3 col-lg-3 col-md-3 col-xs-3 col-sm-3">
                                <span className="fontsizeinvoice">
                                  :
                                  {this.state?.CompanyDetails?.mobileNo &&
                                    this.state?.CompanyDetails?.mobileNo}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="borderinvoice1">
                    <div className="row firstRow">
                      <div className="col-lg-3 col-xl-3 col-md-3 col-xs-3 sallerdetailborder01 ">
                        <div>
                          <div>
                            <div style={{ marginLeft: "14px" }}>
                              <div className="cssbginvoice">
                                <h3>Bill To</h3>
                              </div>
                              <div className="sectionpadding">
                                <h4
                                  className="my-1"
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {this.state?.CompanyDetails?.name &&
                                    this.state?.CompanyDetails?.name}
                                </h4>
                                <span className="fontsizeinvoice">
                                  Address:
                                  {this.state.CompanyDetails?.address &&
                                    this.state.CompanyDetails?.address}
                                  <br></br>
                                  GST No. :{" "}
                                  {this.state.CompanyDetails?.gstNo &&
                                    this.state.CompanyDetails?.gstNo}
                                  <br></br>
                                  MobileNo :
                                  {this.state.CompanyDetails?.mobileNo &&
                                    this.state.CompanyDetails?.mobileNo}{" "}
                                  <br></br>
                                  Email :mailto:
                                  {this.state.CompanyDetails?.email &&
                                    this.state.CompanyDetails?.email}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 col-xl-3 col-md-3 col-xs-3 sallerdetailborder0 ">
                        <div className="">
                          <div>
                            <div>
                              <div className="cssbginvoice">
                                <h3>Ship To</h3>
                              </div>
                              <div className="sectionpadding">
                                <h4>
                                  {`Name: ${this.state.PrintData?.partyId?.ownerName}`}
                                </h4>
                                <span className="fontsizeinvoice">
                                  Address :
                                  {this.state.PrintData?.partyId?.address1}
                                  <br></br>
                                  MobileNo :
                                  {this.state.PrintData?.partyId?.contactNumber}
                                  <br></br>
                                  State.: {this.state.PrintData?.partyId?.State}
                                  <br></br>
                                  City.: {this.state.PrintData?.partyId?.City}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 col-xl-6 col-md-6 col-xs-6 sallerdetailborder01 ">
                        <div>
                          <div>
                            <div
                              className="cssfotbilltobg"
                              style={{ marginRight: "14px" }}
                            >
                              <div className="cssbginvoice">
                                <h3>Dispatch Detail</h3>
                              </div>
                              <div className="sectionpadding">
                                <span className="fontsizeinvoice">
                                  Transporter Name : abcd <br></br>
                                  {!!this.state.PrintData?.transporter &&
                                    invoiceData?.transporter?.companyName}
                                  Address :
                                  {!!this.state.PrintData?.transporter &&
                                    this.state.PrintData?.transporter?.address1}
                                  Mobile No. :
                                  {!!this.state.PrintData?.transporter &&
                                    this.state.PrintData?.transporter
                                      ?.contactNumber}
                                  <br></br>
                                  Vehicle No. :
                                  {this.state.PrintData?.vehicleNo &&
                                    this.state.PrintData?.vehicleNo}
                                  <br></br>
                                  E-way Bill No. : 654654654654654654
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div></div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div>
                      <table className="table">
                        <thead>
                          <tr className="cssforthtr">
                            <th scope="col">#</th>
                            <th scope="col">Product Name</th>
                            <th scope="col">HSN / SAC</th>
                            <th scope="col">Qty</th>
                            <th scope="col">Dis%</th>
                            <th scope="col">GST</th>
                            <th scope="col">Unit</th>
                            <th scope="col">Price</th>
                            <th scope="col">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.PrintData?.orderItems?.map(
                            (item, ind) => (
                              <tr className="cssfortdtr">
                                <th scope="row ">{ind}</th>
                                <td>{item?.productId?.Product_Title}</td>
                                <td>{item?.productId?.HSN_Code}</td>
                                <td>{item?.qty}</td>
                                <td>{item?.discountPercentage}</td>
                                <td>{item?.productId?.GSTRate}</td>
                                <td>{item?.productId?.secondaryUnit}</td>

                                <td>{item?.price}</td>
                                <td>{item?.taxableAmount}</td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="borderinvoice borderinvoiceMargn">
                    <div className="row ">
                      <div className="col-lg-6 col-xl-6 col-md-6 col-xs-6 sallerdetailborder">
                        <div>
                          <div className="container-fluid">
                            <h3>Total In Words</h3>

                            <h4>{this.state.wordsNumber}</h4>
                            <br></br>
                            <div>
                              <h6>Terms and Conditions</h6>
                              <h6>
                                1. Paid Amount/Payment are not refundable in any
                                case.
                              </h6>
                              <h6>2. Pay Payment under 30 days.</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 col-xl-6 col-md-6 col-xs-6 sallerdetailborder1">
                        <div className="p-1">
                          <div>
                            <div className="cssforgrandtotal">
                              <div>
                                <h4>Other Charges</h4>
                              </div>
                              <div>
                                <h4>
                                  {this.state.PrintData?.otherCharges &&
                                  this.state.PrintData?.otherCharges
                                    ? this.state.PrintData?.otherCharges
                                    : 0.0}
                                </h4>
                              </div>
                            </div>
                            <div className="cssforgrandtotal">
                              <div>
                                <h4>Sub Total</h4>
                              </div>
                              <div>
                                <h4>
                                  {this.state.PrintData?.amount && (
                                    <>
                                      {(this.state.PrintData?.amount).toFixed(
                                        2
                                      )}
                                    </>
                                  )}
                                </h4>
                              </div>
                            </div>
                            <div className="cssforgrandtotal">
                              <div>
                                <h4>Cash Discount</h4>
                              </div>
                              <div>
                                <h4>00.0</h4>
                              </div>
                            </div>
                            <div className="cssforgrandtotal">
                              <div>
                                <h4>TurnOver Discount</h4>
                              </div>
                              <div>
                                <h4>00.0</h4>
                              </div>
                            </div>
                            <div className="cssforgrandtotal">
                              <div>
                                <h4>Target Discount</h4>
                              </div>
                              <div>
                                <h4>0</h4>
                              </div>
                            </div>
                            {this.state.PrintData.igstTaxType == 1 ? (
                              <div className="cssforgrandtotal">
                                <div>
                                  <h4>IGST</h4>
                                </div>
                                <div>
                                  <h4>
                                    {this.state.PrintData?.igstTotal.toFixed(2)}
                                  </h4>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="cssforgrandtotal">
                                  <div>
                                    <h4>CGST</h4>
                                  </div>
                                  <div>
                                    <h4>
                                      {this.state.PrintData?.cgstTotal?.toFixed(
                                        2
                                      )}
                                    </h4>
                                  </div>
                                </div>
                                <div className="cssforgrandtotal">
                                  <div>
                                    <h4>SGST</h4>
                                  </div>
                                  <div>
                                    <h4>
                                      {this.state.PrintData?.sgstTotal?.toFixed(
                                        2
                                      )}
                                    </h4>
                                  </div>
                                </div>
                              </>
                            )}

                            <div className="cssforgrandtotal">
                              <div>
                                <h4>Round Off</h4>
                              </div>
                              <div>
                                <h4>
                                  {this.state.PrintData?.roundOff &&
                                    this.state.PrintData?.roundOff}
                                </h4>
                              </div>
                            </div>
                            <hr style={{ borderTop: "1px solid black" }}></hr>
                            <div className="cssforgrandtotal">
                              <div>
                                <h4>Grand Total :</h4>
                              </div>
                              <div>
                                <h4>{this.state.PrintData?.grandTotal}</h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div>
                      <table className="table">
                        <thead>
                          <tr className="cssforthtr1">
                            <th scope="row" rowspan="2">
                              HSN/SAC
                            </th>
                            <th scope="row" rowspan="2">
                              Taxable value
                            </th>
                            {this.state.PrintData.igstTaxType == 1 ? (
                              <th scope="col" colspan="3">
                                Integrated Tax
                              </th>
                            ) : (
                              <>
                                <th scope="col" colspan="2">
                                  Central Tax
                                </th>
                                <th scope="col" colspan="2">
                                  State Tax
                                </th>
                              </>
                            )}

                            <th scope="col" rowspan="2">
                              Total Tax Amount
                            </th>
                          </tr>
                          <tr className="cssforthtr1">
                            {this.state.PrintData.igstTaxType == 1 ? (
                              <>
                                <th scope="col" colspan="1">
                                  Rate
                                </th>
                                <th scope="col" colspan="2">
                                  Amount
                                </th>
                              </>
                            ) : (
                              <>
                                <th scope="col">Rate</th>
                                <th scope="col">Amount</th>
                                <th scope="col">Rate</th>
                                <th scope="col">Amount</th>
                              </>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.PrintData?.gstDetails?.map(ele => {
                            return (
                              <tr className="cssfortdtr">
                                <td>{ele?.hsn} </td>
                                <td> {ele?.taxable.toFixed(2)}</td>
                                {this.state.PrintData.igstTaxType == 1 ? (
                                  ele?.igstTax &&
                                  ele?.igstTax?.map(ele => {
                                    return (
                                      <>
                                        <td>{ele?.rate} %</td>
                                        <td colspan="2">
                                          {ele?.amount?.toFixed(2)}
                                        </td>
                                      </>
                                    );
                                  })
                                ) : (
                                  <>
                                    {ele?.centralTax &&
                                      ele?.centralTax?.map((val, index) => {
                                        return (
                                          <>
                                            <td>
                                              {val?.rate ? val?.rate : 0} %
                                            </td>
                                            <td>
                                              {val?.amount
                                                ? val?.amount?.toFixed(2)
                                                : 0}
                                            </td>
                                          </>
                                        );
                                      })}
                                    {ele?.stateTax &&
                                      ele?.stateTax?.map((item, index) => {
                                        return (
                                          <>
                                            <td>{item?.rate} %</td>
                                            <td>{item?.amount?.toFixed(2)}</td>
                                          </>
                                        );
                                      })}
                                  </>
                                )}

                                <td>{(ele?.withoutTaxablePrice).toFixed(2)}</td>
                              </tr>
                            );
                          })}
                          <tr className="cssfortdtr">
                            <td>Total</td>
                            <td>{this.state.PrintData?.amount}</td>

                            {this.state.PrintData.igstTaxType == 1 ? (
                              <>
                                <td></td>
                                <td colspan="2">
                                  {this.state.PrintData?.cgstTotal}
                                </td>
                              </>
                            ) : (
                              <>
                                <td colspan="1"></td>
                                <td>{this.state.PrintData?.cgstTotal}</td>

                                <td colspan="1">
                                  {this.state.PrintData?.cgstTotal}
                                </td>
                                <td> {this.state.PrintData?.sgstTotal}</td>
                              </>
                            )}

                            <td> {this.state.PrintData?.amount}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div
                    className="borderinvoice "
                    style={{ marginTop: "-14px" }}
                  >
                    <div className="row ">
                      <div className="col-lg-6 col-xl-6 col-md-6 col-xs-6 sallerdetailborder">
                        <div>
                          <div className="container-fluid p-1">
                            <h4>Bank Detail</h4>
                            <div>
                              <h5>
                                Bank Name :
                                {this.state?.CompanyDetails?.bankName}
                              </h5>
                              <h5>
                                Bank A/C No. :
                                {this.state?.CompanyDetails?.accountNumber}
                              </h5>
                              <h5>
                                IFSC Code :{" "}
                                {this.state?.CompanyDetails?.bankIFSC}
                              </h5>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 col-xl-6 col-md-6 col-xs-6 sallerdetailborder1">
                        <div className="p-1">
                          <div>
                            <h4>For</h4>
                            <h5>{this.state?.CompanyDetails.name}</h5>
                            <div className="text-center">
                              <img
                                src={`${Image_URL}/Images/${this.state?.CompanyDetails?.signature}`}
                                alt="4"
                                width="300"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
        </Modal> */}
      </>
    );
  }
}
export default PurchaseInvoice;
