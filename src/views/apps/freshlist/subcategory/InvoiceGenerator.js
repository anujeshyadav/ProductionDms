import React from "react";
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
  Label,
  Form,
  CustomInput,
  Table,
  Spinner,
  Badge,
  FormGroup,
} from "reactstrap";
import _ from "lodash";
import { ImDownload } from "react-icons/im";
import { AiOutlineDownload } from "react-icons/ai";
import { ToWords } from "to-words";
import { Eye, ChevronDown, Trash2, CornerDownLeft } from "react-feather";

import "../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../../../assets/scss/pages/users.scss";
import InvoicGenerator from "../subcategory/InvoiceGeneratorone";
import { Route, Link } from "react-router-dom";
import swal from "sweetalert";
import {
  _Delete,
  _Get,
  _Post,
  CreateAccountList,
  view_Sales_orderList,
} from "../../../../ApiEndPoint/ApiCalling";

import { ContextLayout } from "../../../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import ViewOrder from "../../../../../src/views/apps/freshlist/order/ViewAll";
import "jspdf-autotable";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import "../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../../../assets/scss/pages/users.scss";

import {
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaFilter,
  FaTruck,
} from "react-icons/fa";
import {
  BsFillArrowDownSquareFill,
  BsFillArrowUpSquareFill,
} from "react-icons/bs";
import UserContext from "../../../../context/Context";
import { CheckPermission } from "../house/CheckPermission";
import SuperAdminUI from "../../../SuperAdminUi/SuperAdminUI";
import Multiselect from "multiselect-react-dropdown";
import {
  Delete_Sales,
  Last_Ledger_Balance,
  Sales_OrderTo_DispatchList,
  ViewOther_Charges,
  View_Customer_ById,
  view_create_order_history,
} from "../../../../ApiEndPoint/Api";
import {
  convertDataCSVtoExcel,
  convertDataCsvToXml,
  exportDataToExcel,
  exportDataToPDF,
} from "../house/Downloader";
import { HsnSummaryCalculation } from "./HsnSummaryCalculation";

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

class InvoiceGenerator extends React.Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.gridRef = React.createRef();
    this.gridApi = null;
    this.state = {
      AssignDeliveryBoy: "",
      DeliveryBoyErr: false,
      isOpen: false,
      ShowMyBill: true,
      MasterShow: false,
      BillNumber: "",
      Arrindex: "",
      Charges: 0,
      Discount: [],
      AllbillMerged: [],
      OtherCharges: [],
      OtherCharges: [],
      AssignTransporter: [],
      rowData: [],
      InsiderPermissions: {},
      ViewOneData: {},
      CompanyDetails: {},
      ShowBill: false,
      Applied_Charges: {},
      Billtoposition: "Left",
      shipto: "right",
      logoposition: "Left",
      ButtonText: "Submit",
      EWayBill: false,
      Mergebilllength: "",
      modal: false,
      modalOne: false,
      modalTwo: false,
      sgst: "",
      cgst: "",
      discount: "",
      ViewBill: true,
      wordsNumber: "",
      otherCharges: "",
      deliveryCharges: "",
      PrintData: {},
      PrintMainData: {},
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
        {
          headerName: "Status",
          field: "status",
          filter: true,
          width: 180,
          cellRendererFramework: (params) => {
            return params.data?.status === "InProcess" ? (
              <div className="text-center">Pending For Delivery</div>
            ) : params.data?.status === "Dispatch" ? (
              <div className="tetx-center">Ready to Dispatch</div>
            ) : params.data?.status === "Pending for Delivery" ? (
              <div className="text-center">Pending for Delivery</div>
            ) : params.data?.status === "Out For Delivery" ? (
              <div className="text-center">Out For Delivery</div>
            ) : params.data?.status === "Completed" ? (
              <div className="text-center">Delivered</div>
            ) : (
              <>
                <div className="text-center">Cancelled</div>
              </>
            );
          },
        },
        {
          headerName: "Actions",
          field: "sortorder",
          field: "transactions",
          width: 80,
          cellRendererFramework: (params) => {
            console.log(params.data);
            return (
              <div className="actions cursor-pointer text-center">
                {/* <Trash2
                  className=""
                  size="20px"
                  color="white"
                  onClick={() => {
                    this.runthisfunction(params?.data?._id);
                  }}
                /> */}

                {this.state.InsiderPermissions &&
                  this.state.InsiderPermissions?.View && (
                    <Route
                      render={() => (
                        <Eye
                          className="mr-50"
                          size="20px"
                          color="green"
                          onClick={() => {
                            this.setState({ ViewOneData: params?.data });
                            this.toggleModalTwo();
                          }}
                        />
                      )}
                    />
                  )}
                {this.state.InsiderPermissions &&
                  this.state.InsiderPermissions?.Delete && (
                    <Trash2
                      className=""
                      size="20px"
                      color="red"
                      onClick={() => {
                        this.runthisfunction(params?.data?._id);
                      }}
                    />
                  )}
                {this.state.InsiderPermissions &&
                  this.state.InsiderPermissions?.Edit && (
                    <>
                      {params.data?.status
                        .toLowerCase()
                        .includes("completed") && (
                        <CornerDownLeft
                          className="mr-50"
                          size="20px"
                          color="green"
                          onClick={() => {
                            localStorage.setItem(
                              "OrderList",
                              JSON.stringify(params.data)
                            );
                            this.props.history.push({
                              pathname: `/app/AJGroup/order/placeOrderReturn/${params.data?._id}`,
                              state: params.data,
                            });
                          }}
                        />
                      )}
                    </>
                  )}
                {/* {this.state.InsiderPermissions &&
                  this.state.InsiderPermissions?.Edit && (
                    <CornerDownLeft
                      className="mr-50"
                      size="25px"
                      color="green"
                      onClick={() => {
                        localStorage.setItem(
                          "OrderList",
                          JSON.stringify(params.data)
                        );
                        this.props.history.push({
                          pathname: `/app/AJGroup/order/placeOrderReturn/${params.data?._id}`,
                          state: params.data,
                        });
                      }}
                    />
                  )} */}
              </div>
            );
          },
        },
        {
          headerName: "Order Id",
          field: "orderNo",
          filter: true,
          editable: true,
          resizable: true,
          width: 100,
          cellRendererFramework: (params) => {
            return (
              <div className="d-flex align-items-center cursor-pointer text-center">
                <div>
                  <span>{params?.data?.orderNo}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Order Date",
          field: "createdAt",
          filter: true,
          resizable: true,
          width: 95,

          cellRendererFramework: (params) => {
            return (
              <div className=" cursor-pointer text-center">
                <div>
                  <span>{params.data?.createdAt?.split("T")[0]}</span>
                </div>
              </div>
            );
          },
        },
        // {
        //   headerName: "Create Dispatch",
        //   field: "status",
        //   filter: true,
        //   resizable: true,
        //   width: 165,
        //   cellRendererFramework: (params) => {
        //     console.log(params?.data);

        //     return (
        //       <div className="text-center cursor-pointer">
        //         <div>
        //           {this.state.InsiderPermissions &&
        //             this.state.InsiderPermissions?.Create && (
        //               <>
        //                 {params.data?.status === "Inprocess" ||
        //                 params.data?.status
        //                   ?.toLowerCase()
        //                   ?.includes("cancelled") ||
        //                 params.data?.status
        //                   ?.toLowerCase()
        //                   ?.includes("completed") ? (
        //                   <>
        //                     {params.data?.status
        //                       ?.toLowerCase()
        //                       ?.includes("completed") ? (
        //                       <div className="text-center cursor-pointer">
        //                         Completed
        //                       </div>
        //                     ) : params.data?.status === "pending" ? (
        //                       <div className="text-center cursor-pointer">
        //                         {params.data?.status}
        //                       </div>
        //                     ) : params.data?.status === "return" ? (
        //                       <div className="text-center cursor-pointer">
        //                         Returned
        //                       </div>
        //                     ) : params.data?.status === "cancelled" ? (
        //                       <div className="text-center cursor-pointer">
        //                         {params.data.status}
        //                       </div>
        //                     ) : params.data?.status === "Inprocess" ? (
        //                       <div className="text-center cursor-pointer">
        //                         {params.data.status}
        //                       </div>
        //                     ) : (
        //                       <>
        //                         <div className="text-center cursor-pointer">
        //                           {params.data.status}
        //                         </div>
        //                       </>
        //                     )}
        //                   </>
        //                 ) : (
        //                   <>
        //                     {params?.data?.invoiceStatus ? (
        //                       <Route
        //                         render={({ history }) => (
        //                           <FaTruck
        //                             style={{ cursor: "pointer" }}
        //                             title="Dispatch Now"
        //                             onClick={() => {
        //                               history.push({
        //                                 pathname: `/app/AjGroup/dispatch/CreateDispach/${params?.data?._id}`,
        //                                 state: { data: params?.data },
        //                               });
        //                             }}
        //                             fill="green"
        //                             size="30px"
        //                           />
        //                         )}
        //                       />
        //                     ) : (
        //                       <>
        //                         <FaTruck
        //                           style={{ cursor: "pointer" }}
        //                           title="Invoice Not Created"
        //                           onClick={() =>
        //                             swal(
        //                               "Error",
        //                               "Invoice Not Created",
        //                               "error"
        //                             )
        //                           }
        //                           fill="green"
        //                           size="30px"
        //                         />
        //                       </>
        //                     )}
        //                   </>
        //                 )}
        //               </>
        //             )}
        //         </div>
        //       </div>
        //     );
        //   },
        // },
        {
          headerName: " Invoice",
          field: "invoice",
          filter: true,
          resizable: true,
          width: 80,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <div>
                  <>
                    {this.state.InsiderPermissions &&
                      this.state.InsiderPermissions?.View && (
                        <>
                          {params?.data?.invoiceStatus ? (
                            <>
                              <AiOutlineDownload
                                title="Invoice Already Created"
                                onClick={() =>
                                  this.handleShowInvoice(params.data)
                                }
                                fill="Blue"
                                size="30px"
                              />
                            </>
                          ) : (
                            <>
                              <AiOutlineDownload
                                title="Create Invoice here"
                                onClick={() => this.MergeBillNow(params.data)}
                                fill="green"
                                size="30px"
                              />
                            </>
                          )}
                        </>
                      )}
                  </>
                  <span></span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Full Name",
          field: "partyId.CompanyName",
          filter: true,
          resizable: true,
          width: 200,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <div>
                  <span>{params?.data?.partyId?.CompanyName} </span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Email",
          field: "partyId.email",
          filter: true,
          resizable: true,
          width: 230,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <div>
                  <span>{params?.data?.partyId?.email}</span>
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
          width: 250,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
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
          width: 175,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <div>
                  <span>{params.data?.partyId?.comPanNo}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Party Full Name",
          field: "partyId.ownerName",
          filter: true,
          width: 180,
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
          headerName: "Party Limit",
          field: "partyId.limit",
          filter: true,
          width: 100,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
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
          width: 125,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer text-center">
                <div>
                  {params.data?.partyId?.assignTransporter &&
                  params.data?.partyId?.assignTransporter?.length > 0 ? (
                    <>Available</>
                  ) : (
                    <>Not-Available</>
                  )}
                </div>
              </div>
            );
          },
        },

        {
          headerName: "IGST ",
          field: "igstTotal",
          filter: true,
          width: 100,
          cellRendererFramework: (params) => {
            return (
              <div className=" cursor-pointer text-center">
                <div>{params.data?.igstTotal && params.data?.igstTotal}</div>
              </div>
            );
          },
        },
        {
          headerName: "SGST ",
          field: "sgstTotal",
          filter: true,
          width: 100,
          cellRendererFramework: (params) => {
            return (
              <div className="text-center cursor-pointer">
                <div>{params.data?.sgstTotal && params.data?.sgstTotal}</div>
              </div>
            );
          },
        },
        {
          headerName: "CGST ",
          field: "cgstTotal",
          filter: true,
          width: 100,
          cellRendererFramework: (params) => {
            return (
              <div className="text-center cursor-pointer">
                <div>{params.data?.cgstTotal && params.data?.cgstTotal}</div>
              </div>
            );
          },
        },
        {
          headerName: "Taxable Amount",
          field: "amount",
          filter: true,
          width: 135,
          cellRendererFramework: (params) => {
            return (
              <div className="text-center cursor-pointer">
                <div>{(params.data?.amount).toFixed(2)}</div>
              </div>
            );
          },
        },
        {
          headerName: "Round Off",
          field: "roundOff",
          filter: true,
          width: 90,
          cellRendererFramework: (params) => {
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
          width: 110,
          cellRendererFramework: (params) => {
            return (
              <div className="text-center cursor-pointer">
                <div>{params.data?.grandTotal}</div>
              </div>
            );
          },
        },

        {
          headerName: "Total Product",
          field: "params.data.orderItems.length",
          filter: true,
          resizable: true,
          width: 125,
          cellRendererFramework: (params) => {
            // console.log(params.data);
            return (
              <div className=" cursor-pointer text-center">
                <div>{params?.data?.orderItems?.length} Products</div>
              </div>
            );
          },
        },
      ],
      setMySelectedarr: [],
      SelectedCols: [],
      paginationPageSize: 10,
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

  runthisfunction(id) {
    swal("Warning", "Sure You Want to Delete it", {
      buttons: {
        cancel: "cancel",
        catch: { text: "Delete ", value: "delete" },
      },
    }).then((value) => {
      switch (value) {
        case "delete":
          let selectedData = this.gridApi.getSelectedRows();
          this.gridApi.updateRowData({ remove: selectedData });
          _Delete(Delete_Sales, id)
            .then((res) => {
              // this.componentDidMount();
            })
            .catch((err) => {
              console.log(err);
            });
          break;
        default:
      }
    });
  }
  handleSubmitOtherCharges = async (e) => {
    const UserInformation = this.context;
    e.preventDefault();
    this.state.AssignDeliveryBoy
      ? this.setState({ DeliveryBoyErr: false })
      : this.setState({ DeliveryBoyErr: true });
    let value = { ...this.state.PrintData };
    await _Get(Last_Ledger_Balance, value?.partyId?._id)
      .then((res) => {
        if (!!res?.Ledger.debit) {
          value["lastLedgerBalance"] = res?.Ledger.debit;
        } else {
          value["lastLedgerBalance"] = res?.Ledger.credit;
        }
      })
      .catch((err) => {
        value["lastLedgerBalance"] = "Not Found";
        console.log(err);
      });
    this.state.PrintData?.partyId?.assignTransporter?.length > 0
      ? (value["DeliveryType"] = "OutStation")
      : (value["DeliveryType"] = "Local");

    value["status"] = "Pending for Delivery";
    value["salesInvoiceStatus"] = true;
    value["chargesDetails"] = Number(this.state.Charges);
    value["AssignDeliveryBoy"] = this.state.AssignDeliveryBoy;
    this.setState({
      ButtonText: this.state.AssignDeliveryBoy ? "Submitting.." : "Submit",
    });
    let gstDetails = HsnSummaryCalculation(value);
    value["gstDetails"] = gstDetails;
    this.setState({ PrintData: value });

    // testing

    // this.setState({ ButtonText: "Submit" });
    // this.setState({ ShowMyBill: true, ViewBill: true });
    // const toWords = new ToWords();
    // let words = toWords.convert(Number(this.state.PrintData?.grandTotal), {
    //   currency: true,
    // });
    // this.setState({ wordsNumber: words });
    //testing

    if (this.state.AssignDeliveryBoy?.length > 0) {
      if (UserInformation?.CompanyDetails?.BillNumber) {
        let words = toWords.convert(Number(this.state.PrintData?.grandTotal), {
          currency: true,
        });
        this.setState({ wordsNumber: words });
        await _Post(
          Sales_OrderTo_DispatchList,
          this.state.PrintData?._id,
          value
        )
          .then((res) => {
            this.setState({ ButtonText: "Submit" });
            this.setState({ ShowMyBill: true, ViewBill: true });
            const toWords = new ToWords();
            let words = toWords.convert(
              Number(this.state.PrintData?.grandTotal),
              {
                currency: true,
              }
            );
            this.setState({ wordsNumber: words });

            this.componentDidMount();
          })
          .catch((err) => {
            this.setState({ ButtonText: "Submit" });
            swal("Error", `${err?.response?.data?.error}`);
            console.log(err);
          });
      } else {
        swal("Select Bill Template from setting Tab");
      }
    }
  };
  handleShowInvoice = async (data) => {
    const UserInformation = this.context;
    let value = { ...data };
    await _Get(Last_Ledger_Balance, value?.partyId?._id)
      .then((res) => {
        if (!!res?.Ledger.debit) {
          value["lastLedgerBalance"] = res?.Ledger.debit;
        } else {
          value["lastLedgerBalance"] = res?.Ledger.credit;
        }
      })
      .catch((err) => {
        value["lastLedgerBalance"] = "Not Found";
        console.log(err);
      });
    value["salesInvoiceStatus"] = true;
    let gstDetails = HsnSummaryCalculation(value);
    value["gstDetails"] = gstDetails;

    this.setState({ PrintData: value });

    this.setState({ ShowMyBill: true, ViewBill: true });
    const toWords = new ToWords();
    let words = toWords.convert(Number(data?.grandTotal), {
      currency: true,
    });

    this.setState({ wordsNumber: words });
    this.toggleModalOne();
    // let payload=[]
  };

  MergeBillNow = async (data) => {
    this.setState({ ShowMyBill: true });
    this.setState({ ViewBill: false });

    await _Get(View_Customer_ById, data?.partyId?._id)
      .then((res) => {
        this.setState({
          AssignTransporter: res?.Customer?.assignTransporter,
        });
      })
      .catch((err) => {
        console.log(err);
      });
    if (data?.grandTotal > 49999) {
      this.setState({ EWayBill: true });
      data["ChallanStatus"] = true;
    }
    data["salesInvoiceStatus"] = true;
    let gstDetails = HsnSummaryCalculation(data);

    data["gstDetails"] = gstDetails;
    this.setState({ ViewOneData: data });
    this.setState({ PrintData: data });
    this.setState({ PrintMainData: data });

    this.toggleModalOne();
  };

  // handleBillDownload = (data) => {
  //   this.setState({ PrintData: data });
  //   this.setState({ PrintMainData: data });
  //   const toWords = new ToWords();
  //   let words = toWords.convert(Number(data.sub_total), { currency: true });
  //   this.setState({ wordsNumber: words });
  //   this.toggleModal();
  // };
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
  toggleModalTwo = () => {
    this.setState((prevState) => ({
      modalTwo: !prevState.modalTwo,
    }));
  };
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  // handleAddCharges = (e) => {
  //   const selected =
  //     e.target.options[e.target.selectedIndex].getAttribute("data_id");
  //   let getValue = Number(selected?.split("*")[0]);
  //   let GST = Number(selected?.split("*")[1]) / 100;
  //   let value = { ...this.state?.PrintMainData };
  //   let Allvalue = { ...this.state?.PrintData };
  //   value["otherCharges"] = Number(e.target.value);

  //   value["amount"] = Number(value?.amount + getValue);
  //   if (value?.igstTaxType == 1) {
  //     let otherigst = Number((getValue * GST).toFixed(2));
  //     value["igstTotal"] = Number((value?.igstTotal + otherigst).toFixed(2));
  //     value["grandTotal"] = Number(
  //       (value?.amount + value?.igstTotal).toFixed(2)
  //     );
  //     value["gstOtherCharges"] = [
  //       {
  //         igstTax: [
  //           { rate: Number(selected?.split("*")[1]), amount: otherigst },
  //         ],
  //         centralTax: [],
  //         stateTax: [],
  //         taxable: getValue,
  //         withoutTaxablePrice: getValue + otherigst,
  //       },
  //     ];
  //   } else {
  //     let othergst = Number(((getValue * GST) / 2).toFixed(2));

  //     value["cgstTotal"] = Number((value?.cgstTotal + othergst).toFixed(2));
  //     value["sgstTotal"] = Number((value?.sgstTotal + othergst).toFixed(2));
  //     value["grandTotal"] = Number(
  //       (value?.amount + value?.cgstTotal + value?.sgstTotal).toFixed(2)
  //     );
  //     value["gstOtherCharges"] = [
  //       {
  //         igstTax: [],
  //         centralTax: [{ rate: (GST * 100) / 2, amount: othergst }],
  //         stateTax: [{ rate: (GST * 100) / 2, amount: othergst }],
  //         taxable: getValue,
  //         withoutTaxablePrice: getValue + othergst,
  //       },
  //     ];
  //   }

  //   let decimalValue;
  //   const containsDecimal = /\./.test(Number(value?.grandTotal?.toFixed(2)));
  //   // let DecimalStatus = value?.grandTotal.includes(".");
  //   if (containsDecimal) {
  //     decimalValue = Number(
  //       value?.grandTotal?.toFixed(2)?.toString()?.split(".")[1]
  //     );
  //     if (decimalValue > 65) {
  //       let roundoff = 100 - decimalValue;
  //       value["grandTotal"] = parseFloat(value.grandTotal) + roundoff / 100;

  //       value["roundOff"] = +roundoff;
  //     } else {
  //       let roundoff = -decimalValue;
  //       value["grandTotal"] =
  //         parseFloat(value?.grandTotal) - decimalValue / 100;
  //       value.roundOff = roundoff / 100;
  //     }
  //   } else {
  //     value["grandTotal"] = value?.grandTotal;
  //   }

  //   value["transporter"] = Allvalue?.transporter;
  //   value["vehicleNo"] = Allvalue?.vehicleNo;
  //   this.setState({ PrintData: value });
  // };
  toggleModalclose = () => {
    this.setState({ modalOne: false });
    this.setState({ ShowMyBill: false });
    this.setState({ Discount: [] });
  };
  toggleModalcloseTwo = () => {
    this.setState({ modalTwo: false });
  };

  LookupviewStart = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };

  async Apicalling(id, db) {
    this.setState({ Loading: true });

    await _Get(view_create_order_history, id, db)
      // await view_Sales_orderList(id, db)
      .then((res) => {
        this.setState({ Loading: false });
        let pending = res?.orderHistory?.filter(
          (ele) =>
            ele?.status?.toLowerCase()?.includes("dispatch") ||
            ele?.status?.toLowerCase()?.includes("delivery")
        );
        // let newList = pending?.filter((lst) => {
        //   return lst.status !== "Deactive";
        // });
        // console.log(res?.orderHistory);

        this.setState({ rowData: pending?.reverse() });
        this.setState({ AllcolumnDefs: this.state.columnDefs });

        let userHeading = JSON.parse(localStorage.getItem("SalesOrderList"));
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

        console.log(err);
      });

    await _Get(ViewOther_Charges, db)
      .then((res) => {
        let val = res?.OtherCharges;
        if (val?.length) {
          // let chargesList = val?.filter((ele) => ele?.type == "Charges");
          let DiscountList = val?.filter((ele) => ele?.type == "Discount");
          // this.setState({ OtherCharges: chargesList });
          const Discount = DiscountList?.map((item) => ({
            ...item,
            displayLabel: `${item.title} (Percentage: ${
              item?.percentage ? item?.percentage : "NA"
            }%)`,
          }));

          this.setState({ OtherDiscount: Discount });
        }
      })
      .catch((err) => {
        console.log(err);
      });
    (async () => {
      let userData = JSON.parse(localStorage.getItem("userData"));
      await CreateAccountList(userData?._id, userData?.database)
        .then((res) => {
          let value = res?.adminDetails;
          let Delevery = value?.filter(
            (ele) => ele?.rolename?.roleName == "Delivery Boy"
          );
          if (Delevery?.length > 0) {
            this.setState({ DeliveryBoyList: Delevery });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })();
  }
  async componentDidMount() {
    const UserInformation = this.context;

    this.setState({ CompanyDetails: UserInformation?.CompanyDetails });
    let pageparmission = JSON.parse(localStorage.getItem("userData"));
    if (pageparmission?.rolename?.roleName === "MASTER") {
      this.setState({ MasterShow: true });
    }
    // let billnumner = localStorage.getItem("billnumber");
    if (UserInformation?.CompanyDetails?.billNo) {
      this.setState({ ShowBill: false });
      this.setState({
        BillNumber: UserInformation?.CompanyDetails?.billNo
          ? UserInformation?.CompanyDetails?.billNo
          : 2,
      });
    }
    const InsidePermissions = CheckPermission("Sales Invoice");
    // console.log(InsidePermissions);
    this.setState({ InsiderPermissions: InsidePermissions });

    // createOrderhistoryview(userid)
    await this.Apicalling(pageparmission?._id, pageparmission?.database);

    // let userchoice = JSON.parse(localStorage.getItem("billUI"));
    // console.log(userchoice);
    // if (userchoice) {
    //   this.setState({ logoposition: userchoice?.imagePosition });
    //   this.setState({ Billtoposition: userchoice?.billTo });
    //   this.setState({ shipto: userchoice?.shipto });
    // }
    let newparmisson = pageparmission?.role?.find(
      (value) => value?.pageName === "invoice Generator"
    );
    this.setState({ Viewpermisson: newparmisson?.permission.includes("View") });
    this.setState({
      Createpermisson: newparmisson?.permission.includes("Create"),
    });
    this.setState({
      Editpermisson: newparmisson?.permission.includes("Edit"),
    });
    this.setState({
      Deletepermisson: newparmisson?.permission.includes("Delete"),
    });
  }

  toggleDropdown = () => {
    this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
  };

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

  exportToPDF = async () => {
    const csvData = this.gridApi.getDataAsCsv({
      processCellCallback: this.processCell,
    });
    await exportDataToPDF(csvData, "SalesOrderList");
  };
  processCell = (params) => {
    return params.value;
  };

  exportToExcel = async (e) => {
    const CsvData = this.gridApi.getDataAsCsv({
      processCellCallback: this.processCell,
    });
    await exportDataToExcel(CsvData, "SalesOrderList");
  };

  convertCSVtoExcel = async () => {
    const CsvData = this.gridApi.getDataAsCsv({
      processCellCallback: this.processCell,
    });
    await convertDataCSVtoExcel(CsvData, "SalesOrderList");
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
    await convertDataCsvToXml(CsvData, "SalesOrderList");
  };

  HandleSetVisibleField = (e) => {
    e.preventDefault();
    this.gridApi.setColumnDefs(this.state.SelectedcolumnDefs);
    this.setState({ columnDefs: this.state.SelectedcolumnDefs });
    this.setState({ SelectedcolumnDefs: this.state.SelectedcolumnDefs });
    this.setState({ rowData: this.state.rowData });
    localStorage.setItem(
      "SalesOrderList",
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
  handleAddCharges = (e, charges) => {
    let value = _.cloneDeep(this.state?.PrintMainData);
    let Allvalue = _.cloneDeep(this.state?.PrintData);

    let Discount = e?.filter((ele) => ele?.type == "Discount");

    if (Discount?.length) {
      let subtotal = value?.amount;
      let latestSubTotal = subtotal;
      let subtotal1 = value?.amount;
      let latestSubTotal1 = subtotal;
      Discount?.forEach((ele) => {
        let discountAmount = Number(
          (subtotal / ((100 + ele?.percentage) / 100)).toFixed(2)
        );
        let discountedValue = subtotal - discountAmount;
        // let discountedValue = (subtotal * ele?.percentage) / 100;
        latestSubTotal -= discountedValue;
        subtotal -= discountedValue;

        // If you need to adjust the original subtotal too.
        // for otherpurpose
        latestSubTotal1 = discountAmount;
        subtotal1 = discountAmount; // If you need to adjust the original subtotal too.
        ele["discountedAmount"] = Number(discountAmount.toFixed(2));
        ele["discountedValue"] = Number(discountedValue.toFixed(2));
        ele["disType"] = ele?.type;
      });

      let discountPercentage = Number(
        (
          ((value?.amount - Number(latestSubTotal?.toFixed(2))) /
            value?.amount) *
          100
        ).toFixed(2)
      );

      let discount = Number(
        (100 + Number(discountPercentage?.toFixed(2))) / 100
      );

      value["overAllDiscountPer"] = Number(discountPercentage?.toFixed(2));
      value["discountDetails"] = Discount;

      value?.gstDetails?.forEach((ele) => {
        ele["taxable"] = Number((ele?.taxable / discount).toFixed(2));
        ele["withDiscountAmount"] = Number(
          (ele?.withDiscountAmount / discount).toFixed(2)
        );
        ele["withoutTaxablePrice"] = Number(
          (ele?.withoutTaxablePrice / discount).toFixed(2)
        );
        if (ele?.igstTax?.length > 0) {
          ele["igstTax"] = [
            {
              rate: ele?.igstTax[0].rate,
              amount: Number((ele?.igstTax[0].amount / discount).toFixed(2)),
            },
          ];
        } else {
          ele["centralTax"] = [
            {
              rate: ele?.centralTax[0].rate,
              amount: Number((ele?.centralTax[0].amount / discount).toFixed(2)),
            },
          ];
          ele["stateTax"] = [
            {
              rate: ele?.stateTax[0].rate,
              amount: Number((ele?.stateTax[0].amount / discount).toFixed(2)),
            },
          ];
        }
      });
      // value["amount"] = Number((value?.amount * discount).toFixed(2));
    } else {
      let Discounts = [];
      Discounts[0] = {};
      Discounts[0]["discountedAmount"] = Number(value?.amount?.toFixed(2));
      value["discountDetails"] = Discounts;
    }
    let lastdiscount =
      value?.discountDetails[value?.discountDetails?.length - 1];
    // let charge = value?.chargesDetails[value?.chargesDetails?.length - 1];
    value?.orderItems?.forEach((ele) => {
      if (typeof ele?.gstPercentage == "number") {
        return ele;
      } else {
        if (ele?.gstPercentage?.includes("+")) {
          ele["gstPercentage"] = ele?.gstPercentage?.split("+")[0] * 2;
          return ele;
        } else {
          return ele;
        }
      }
    });

    const maxGst = value?.orderItems?.reduce(function (prev, current) {
      return prev && prev?.gstPercentage > current?.gstPercentage
        ? prev
        : current;
    });
    let gstCalculation;
    let Sum;

    // if (charge?.chargedAmount > 0 && lastdiscount?.discountedAmount > 0) {
    //   Sum = Number(lastdiscount?.discountedValue + charge?.chargedAmount);
    //   // Sum = lastdiscount?.discountedAmount + charge?.chargedAmount;
    //   gstCalculation = Number(
    //     (
    //       (lastdiscount?.discountedAmount + charge?.chargedAmount) *
    //       (maxGst?.gstPercentage / 100)
    //     ).toFixed(2)
    //   );
    // } else {
    if (lastdiscount?.discountedAmount > 0) {
      Sum = Number(
        lastdiscount?.discountedAmount + Number(charges ? charges : 0)
      );
      // Sum = lastdiscount?.discountedValue + value?.amount;
      gstCalculation = Number((Sum * (maxGst?.gstPercentage / 100)).toFixed(2));
    }
    // }

    if (value?.cgstTotal > 0) {
      value["cgstTotal"] = gstCalculation / 2;
      value["sgstTotal"] = gstCalculation / 2;
    } else {
      value["igstTotal"] = gstCalculation;
    }
    value["grandTotal"] = Number((Sum + gstCalculation)?.toFixed(2));
    value["maxGst"] = maxGst?.gstPercentage;
    let decimalValue;
    const containsDecimal = /\./.test(Number(value?.grandTotal?.toFixed(2)));
    // let DecimalStatus = value?.grandTotal.includes(".");
    if (containsDecimal) {
      decimalValue = Number(
        value?.grandTotal?.toFixed(2)?.toString()?.split(".")[1]
      );

      if (decimalValue > 49) {
        let roundoff = 100 - decimalValue;
        value["grandTotal"] = parseFloat(value.grandTotal) + roundoff / 100;
        value["roundOff"] = +roundoff / 100;
      } else {
        let roundoff = -decimalValue;
        value["grandTotal"] =
          parseFloat(value?.grandTotal) - decimalValue / 100;
        value.roundOff = -roundoff / 100;
      }
    } else {
      value["grandTotal"] = Number((value?.grandTotal).toFixed(2));
    }
    value["transporter"] = Allvalue?.transporter;
    value["vehicleNo"] = Allvalue?.vehicleNo;

    let OtherCharges = {};
    if (charges > 0) {
      OtherCharges.taxable = charges;
      OtherCharges.withDiscountAmount = Number(
        (charges * ((100 + Number(maxGst?.gstPercentage)) / 100)).toFixed(2)
      );
      OtherCharges.withoutTaxablePrice = charges;
      if (value?.igstTaxType == 1) {
        OtherCharges.igstTax = [
          {
            rate: maxGst?.gstPercentage,
            amount: Number(
              (charges * (maxGst?.gstPercentage / 100)).toFixed(2)
            ),
          },
        ];
        OtherCharges.centralTax = [];
        OtherCharges.stateTax = [];
      } else {
        OtherCharges.igstTax = [];
        OtherCharges.centralTax = [
          {
            rate: maxGst?.gstPercentage,
            amount:
              Number((charges * (maxGst?.gstPercentage / 100)).toFixed(2)) / 2,
          },
        ];
        OtherCharges.stateTax = [
          {
            rate: maxGst?.gstPercentage,
            amount:
              Number((charges * (maxGst?.gstPercentage / 100)).toFixed(2)) / 2,
          },
        ];
      }
      value["gstOtherCharges"] = [OtherCharges];
    }
   
    this.setState({ PrintData: value });
    this.setState({ PrintMainData: value });
  };
  handleDropdownChange = (selectedValue) => {
    localStorage.setItem("SuperadminIdByMaster", JSON.stringify(selectedValue));
  };

  HandleSelect = (selectedList, selectedItem) => {
    this.setState({ Charges: selectedList });
    this.handleAddCharges(selectedList);
  };
  HandleRemove = (selectedList, selectedItem) => {
    this.setState({ Charges: selectedList });
    this.handleAddCharges(selectedList);
  };
  HandleSelectDiscount = (selectedList, selectedItem) => {
    this.setState({ Discount: selectedList });
    this.handleAddCharges(selectedList, this.state.Charges);
  };
  HandleRemoveDiscount = (selectedList, selectedItem) => {
    this.setState({ Discount: selectedList });
    this.handleAddCharges(selectedList);
  };
  handleReset = () => {
    this.setState({ Charges: "" });
    this.setState({ Discount: [] });

    this.setState({ PrintData: this.state.ViewOneData });
    this.setState({ PrintMainData: this.state.ViewOneData });
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
    const newLocal = "Add ARN Number Here...";
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
                      <Row style={{ marginLeft: "3px", marginRight: "3px" }}>
                        <Col lg="3" md="4" sm="12">
                          <h2
                            className="float-left"
                            style={{
                              fontWeight: "600",
                              textTransform: "uppercase",
                              fontSize: "18px",
                              marginTop: "25px",
                            }}>
                            Sales Invoice List
                          </h2>
                        </Col>
                        <Col></Col>
                        {this.state.MasterShow ? (
                          <Col lg="3" md="4" sm="12" className="mt-2">
                            <SuperAdminUI
                              onDropdownChange={this.handleDropdownChange}
                              onSubmit={this.handleParentSubmit}
                            />
                          </Col>
                        ) : (
                          <Col></Col>
                        )}
                        <Col lg="3" md="6" sm="12" className="mt-2">
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

                          <div
                            className="table-input float-right cssforproductlist"
                            style={{ width: "100%" }}>
                            <Input
                              style={{ width: "100%" }}
                              placeholder="search Item here..."
                              onChange={(e) =>
                                this.updateSearchQuery(e.target.value)
                              }
                              value={this.state.value}
                            />
                          </div>
                        </Col>

                        <Col lg="1" md="1" className="mt-2">
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
                      {InsiderPermissions && InsiderPermissions?.View && (
                        <>
                          {this.state.rowData === null ? null : (
                            <div className="ag-theme-material w-100   ag-grid-table">
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
        <Modal
          isOpen={this.state.modalOne}
          toggle={this.toggleModalOne}
          className={this.props.className}
          backdrop="false"
          style={{ maxWidth: "1050px" }}>
          <ModalHeader toggle={this.toggleModalclose}>
            {this.state.ShowBill ? "Download BIll" : "Download BIll"}
          </ModalHeader>
          <ModalBody>
            <>
              {this.state.ViewBill && this.state.ViewBill ? (
                <>
                  <div style={{ width: "100%" }} className="">
                    <InvoicGenerator
                      EWayBill={this.state.EWayBill}
                      CompanyDetails={this.state.CompanyDetails}
                      BillNumber={this.state.BillNumber}
                      PrintData={this.state.PrintData}
                      Applied_Charges={this.state.Applied_Charges}
                      AllbillMerged={this.state.AllbillMerged}
                      wordsNumber={this.state.wordsNumber}
                      sgst={this.state.sgst}
                      cgst={this.state.cgst}
                      deliveryCharges={this.state.deliveryCharges}
                      otherCharges={this.state.otherCharges}
                      discount={this.state.discount}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="d-flex justify-content-end">
                    <Button onClick={this.handleReset} color="primary">
                      Reset
                    </Button>
                  </div>
                  <div style={{ width: "100%" }} className="">
                    <Form onSubmit={this.handleSubmitOtherCharges}>
                      <div className="d-flex justify-content-center mt-2 mb-2">
                        <h3>Charges</h3>
                      </div>
                      <div className="d-flex justify-content-end container ">
                        <h3>
                          No of Packages:{" "}
                          {this.state.PrintData?.NoOfPackage
                            ? this.state.PrintData?.NoOfPackage
                            : "Not Found"}
                        </h3>
                      </div>
                      <Row className="main div heading px-3 py-3">
                        <Col lg="6">
                          <Label className="">Amount</Label>
                          <Input
                            type="number"
                            readOnly
                            className="mb-1"
                            name="amount"
                            placeholder="Enter discount value"
                            value={this.state.PrintData?.amount?.toFixed(2)}
                            // onChange={this.changeHandler}
                          ></Input>
                        </Col>
                        {this.state.PrintData?.igstTaxType == 1 ? (
                          <>
                            <Col lg="6">
                              <Label className="">IGST</Label>
                              <Input
                                readOnly
                                type="number"
                                className="mb-1"
                                name="igstTotal"
                                placeholder="Enter Other Charges"
                                value={this.state.PrintData?.igstTotal}
                                // onChange={this.changeHandler}
                              ></Input>
                            </Col>
                          </>
                        ) : (
                          <>
                            <Col lg="6">
                              <Label className="">SGST</Label>
                              <Input
                                readOnly
                                type="number"
                                name="otherCharges"
                                placeholder="Enter Other Charges"
                                value={this.state.PrintData?.sgstTotal}
                                // onChange={this.changeHandler}
                              ></Input>
                            </Col>
                            <Col lg="6">
                              <Label className="">CGST</Label>
                              <Input
                                readOnly
                                type="number"
                                className="mb-1"
                                name="otherCharges"
                                placeholder="Enter Other Charges"
                                value={this.state.PrintData?.cgstTotal}
                                // onChange={this.changeHandler}
                              ></Input>
                            </Col>
                          </>
                        )}
                        <Col lg="6">
                          <Label className="mt-1">Grand Total</Label>
                          <Input
                            readOnly
                            type="number"
                            name="grandTotal"
                            placeholder="Grand Total value"
                            value={this.state.PrintData?.grandTotal}
                            // onChange={this.changeHandler}
                          ></Input>
                        </Col>
                        <Col lg="6">
                          <Label className="mt-1"> Add Discounts</Label>
                          <Multiselect
                            options={this.state.OtherDiscount} // Options to display in the dropdown
                            isObject="false"
                            selectedValues={this.state.Discount}
                            // options={this.state.AssignTransporter}
                            // selectedValues={selectedValue}   // Preselected value to persist in dropdown
                            onSelect={(selectedList, selectedItem) => {
                              this.HandleSelectDiscount(
                                selectedList,
                                selectedItem
                              );
                            }} // Function will trigger on select event
                            onRemove={(selectedList, selectedItem) => {
                              this.HandleRemoveDiscount(
                                selectedList,
                                selectedItem
                              );
                            }} // Function will trigger on remove event
                            displayValue="displayLabel"
                            showCheckbox // Property name to display in the dropdown options
                          />
                        </Col>

                        {this.state.PrintData?.partyId?.assignTransporter
                          ?.length > 0 ? (
                          <>
                            <Col lg="6">
                              <Label className="mt-1">
                                Select Transporter *
                              </Label>
                              <Multiselect
                                required
                                selectionLimit={1}
                                isObject="false"
                                options={this.state.AssignTransporter} // Options to display in the dropdown
                                // selectedValues={selectedValue}   // Preselected value to persist in dropdown
                                onSelect={(selectedList, selectedItem) => {
                                  let value = { ...this.state.PrintData };
                                  value["transporter"] = selectedList[0];
                                  value["transporterName"] =
                                    selectedList[0]?.name;
                                  this.setState({ PrintData: value });
                                }}
                                onRemove={(selectedList, selectedItem) => {
                                  let value = { ...this.state.PrintData };
                                  value["transporter"] = {};
                                  value["transporterName"] = "";
                                  this.setState({ PrintData: value });
                                }} // Function will trigger on remove event
                                displayValue="companyName" // Property name to display in the dropdown options
                              />
                            </Col>
                          </>
                        ) : null}
                        <Col lg="6" md="6" sm="12">
                          <Label
                            style={{
                              color: this.state.DeliveryBoyErr
                                ? "red"
                                : "black",
                            }}
                            className="mt-1">
                            Assign Delivery Boy *
                          </Label>
                          <CustomInput
                            // required
                            type="select"
                            style={{
                              border: this.state.DeliveryBoyErr
                                ? "2px solid red"
                                : "",
                            }}
                            name="AssignDeliveryBoy"
                            value={this.state?.AssignDeliveryBoy}
                            onChange={(e) => {
                              this.setState({
                                AssignDeliveryBoy: e.target.value,
                                DeliveryBoyErr:
                                  e.target.value?.length > 1 ? false : true,
                              });
                            }}>
                            <option value="">--Delivery Boy--</option>
                            {this.state.DeliveryBoyList?.length > 0 &&
                              this.state.DeliveryBoyList?.map(
                                (option, index) => {
                                  return (
                                    <option
                                      key={option?._id}
                                      // value={`${option?._id}_${option?.firstName}${option?.lastName}`}
                                      value={option?._id}>
                                      {`${option?.firstName} ${option?.lastName}`}
                                    </option>
                                  );
                                }
                              )}
                          </CustomInput>
                        </Col>
                        {this.state.PrintData?.grandTotal > 49999 && (
                          <Col lg="6">
                            <Label className="mt-1">
                              Add ARN Number *
                            </Label>
                            <Input
                              required
                              type="text"
                              name="ARN"
                              placeholder={newLocal}
                              value={this.state?.PrintData?.ARN}
                              onChange={(e) => {
                                let value = { ...this.state.PrintData };
                                value["ARN"] = e.target.value;
                                value["ARNStatus"] = true;
                                this.setState({ PrintData: value });
                              }}
                            />
                          </Col>
                        )}
                        <Col lg="6">
                          <Label className="mt-1">Charges</Label>
                          <Input
                            type="number"
                            name="Charges"
                            placeholder="Charges ..."
                            value={this.state.Charges}
                            onChange={(e) => {
                              this.setState({
                                Charges: Number(e.target.value),
                              });
                              this.handleAddCharges(
                                this.state.Discount,
                                Number(e.target.value)
                              );
                            }}
                          />
                        </Col>

                        {this.state.PrintData?.transporter?.name && (
                          <Col lg="6">
                            <Label className="mt-1">Vehicle Number *</Label>
                            <Input
                              required
                              type="text"
                              name="vehicle Number"
                              placeholder="Enter Vehicle Number"
                              value={this.state.PrintData?.vehicleNo}
                              onChange={(e) => {
                                let value = { ...this.state.PrintData };
                                value["vehicleNo"] =
                                  e.target.value.toUpperCase();
                                this.setState({ PrintData: value });
                              }}></Input>
                          </Col>
                        )}
                      </Row>
                      <Row>
                        <Col lg="12" className="mt-2 mb-2">
                          <div className="d-flex justify-content-center">
                            <Button color="primary" type="submit">
                              {this.state.ButtonText && this.state.ButtonText}
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </>
              )}
            </>
          </ModalBody>
        </Modal>

        <Modal
          isOpen={this.state.modalTwo}
          toggle={this.toggleModalTwo}
          className={this.props.className}
          style={{ maxWidth: "1050px" }}>
          <ModalHeader toggle={this.toggleModalcloseTwo}>
            View Order
          </ModalHeader>
          <ModalBody>
            <div className="container">
              <Row>
                <Col>
                  <Label>Party Name :</Label>
                  <h5 className="mx-1">
                    {this.state.ViewOneData && this.state.ViewOneData?.fullName}
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
                  <Label>Amount:</Label>
                  <h5 className="">
                    {this.state.ViewOneData && this.state.ViewOneData?.amount}
                  </h5>
                </Col>

                {this.state.ViewOneData?.igstTaxType &&
                this.state.ViewOneData?.igstTaxType == 1 ? (
                  <>
                    <Col>
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
                    <Col>
                      <Label>SGST:</Label>
                      <h5>
                        <strong>
                          {this.state.ViewOneData &&
                            this.state.ViewOneData?.sgstTotal}
                        </strong>
                        Rs/-
                      </h5>
                    </Col>
                    <Col>
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
                  <Col>
                    <Label>otherCharges :</Label>
                    <h5>
                      <strong>
                        {this.state.ViewOneData &&
                          this.state.ViewOneData?.otherCharges}{" "}
                      </strong>
                    </h5>
                  </Col>
                )}
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
                        <th>HSN CODE</th>
                        <th>Price</th>
                        {/* <th>Size</th> */}
                        <th>Quantity</th>
                        <th>Unit</th>
                        <th>TAXABLE</th>
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
                              {console.log(ele)}
                              <th scope="row">{i + 1}</th>
                              <td>{ele?.productId?.Product_Title}</td>
                              <td>{ele?.productId?.HSN_Code}</td>
                              <td>{ele?.price.toFixed(2)}</td>
                              {/* <td>{ele?.Size}</td> */}
                              <td>{ele?.qty}</td>
                              <td>{ele?.primaryUnit}</td>
                              <td>{ele?.taxableAmount}</td>
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
export default InvoiceGenerator;
