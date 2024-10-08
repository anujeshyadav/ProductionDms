// eslint-disable-next-line
import React from "react";
import { Route } from "react-router-dom";
import { ImDownload } from "react-icons/im";
import { HsnSummaryCalculation } from "../subcategory/HsnSummaryCalculation";
import _ from "lodash";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Label,
  Card,
  
  Input,
  Row,
  Modal,
  Col,
  Button,
  ModalHeader,
  ModalBody,
  Badge,
  Table,
  Spinner,
  Form,
  CustomInput,
} from "reactstrap";
import { ContextLayout } from "../../../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import { ToWords } from "to-words";
import "jspdf-autotable";

import { Eye, Trash2 } from "react-feather";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import "../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../../../assets/scss/pages/users.scss";
import StockTrxInvoice from "../subcategory/StockTrxInvoice";
import {
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaFilter,
} from "react-icons/fa";
import swal from "sweetalert";
import { _Delete, _Get, _Post } from "../../../../ApiEndPoint/ApiCalling";
import {
  BsFillArrowDownSquareFill,
  BsFillArrowUpSquareFill,
} from "react-icons/bs";
import UserContext from "../../../../context/Context";
import { CheckPermission } from "../house/CheckPermission";
import SuperAdminUI from "../../../SuperAdminUi/SuperAdminUI";
import {
  Delete_Sales,
  Delete_Sales_order,
  Last_Ledger_Balance,
  Sales_OrderTo_Dispatch,
  Sales_OrderTo_DispatchList,
  View_Customer_ById,
  view_create_order_history,
} from "../../../../ApiEndPoint/Api";
import {
  convertDataCSVtoExcel,
  convertDataCsvToXml,
  exportDataToExcel,
  exportDataToPDF,
} from "../house/Downloader";
import { AiOutlineDownload } from "react-icons/ai";

import { MdCancel } from "react-icons/md";
import InvoiceGenerator from "../subcategory/InvoiceGeneratorone";

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
class OrderList extends React.Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.gridRef = React.createRef();
    this.gridApi = null;
    this.state = {
      isOpen: false,
      Arrindex: "",
      rowData: [],
      MasterShow: false,
      EWayBill: false,
      OtherCharges: [],
      OtherDiscount: [],
      PrintData: {},
      PrintMainData: {},
      AssignTransporter: [],
      ViewBill: false,
      Applied_Charges: {},
      AllbillMerged: [],
      wordsNumber: "",
      discount: "",
      otherCharges: "",
      deliveryCharges: "",
      ShowBill: false,
      ButtonText: "Submit",
      modal: false,
      modalone: false,
      ViewData: {},
      InsiderPermissions: {},
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
      columnDefs: [
        // {
        //   headerName: "UID",
        //   valueGetter: "node.rowIndex + 1",
        //   field: "node.rowIndex + 1",
        //   width: 68,
        //   filter: true,
        // },
        {
          headerName: "Actions",
          field: "transactions",
          width: 70,
          cellRendererFramework: (params) => {
            return (
              <div className="actions cursor-pointer text-center">
                {this.state.InsiderPermissions &&
                  this.state.InsiderPermissions?.View && (
                    <Eye
                      className="mr-50"
                      size="20px"
                      color="green"
                      onClick={() => {
                        this.handleChangeView(params.data, "readonly");
                        this.togglemodal();
                      }}
                    />
                  )}
                {/* {this.state.InsiderPermissions &&
                  this.state.InsiderPermissions?.Edit && (
                    <>
                      {params.data?.status
                        ?.toLowerCase()
                        ?.includes("completed") ? null : (
                        <>
                          {params.data?.status == "pending" && (
                            <>
                              <Edit
                                className="mr-50"
                                size="25px"
                                color="blue"
                                onClick={() =>
                                  this.props.history.push({
                                    pathname: `/app/freshlist/order/editOrder/${params.data?._id}`,
                                    state: params.data,
                                  })
                                }
                              />
                            </>
                          )}
                        </>
                      )}
                    </>
                  )} */}
                {/* {this.state.InsiderPermissions &&
                  this.state.InsiderPermissions?.Edit && (
                    <>
                      {params?.data?.status
                        ?.toLowerCase()
                        .includes("completed") && (
                        <CornerDownLeft
                          title="Return It"
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
                      )}

                      {params?.data?.status
                        ?.toLowerCase()
                        .includes("cancelled") && (
                        <MdCancel
                          title="Click to Cancel Invoice"
                          color="red"
                          size={25}
                        />
                      )}
                    </>
                  )} */}
                {this.state.InsiderPermissions &&
                  this.state.InsiderPermissions.Delete && (
                    <Trash2
                      className="mr-50"
                      size="25px"
                      color="red"
                      onClick={() => {
                        this.runthisfunctionOtherStatus(params?.data?._id);
                      }}
                    />
                  )}
              </div>
            );
          },
        },
        {
          headerName: "Status",
          field: "status",
          filter: true,
          width: 160,
          cellRendererFramework: (params) => {
            return params.data?.status?.toLowerCase()?.includes("completed") ? (
              <div className="text-center">{params.data?.status}</div>
            ) : params.data.status == "InProcess" ? (
              <div className=" text-center ">{params.data?.status}</div>
            ) : params.data?.status == "pending" ? (
              <div className="text-center">Pending</div>
            ) : params.data?.status == "Cancel in process" ? (
              <div className="text-center">
                <Badge
                  onClick={() => this.handleCancelShow(params.data)}
                  style={{ cursor: "pointer" }}
                  color="danger">
                  {params.data?.status}
                </Badge>
              </div>
            ) : null;
          },
        },
        {
          headerName: "Invoice",
          field: "invoice",
          filter: true,
          resizable: true,
          width: 93,
          cellRendererFramework: (params) => {
            return (
              <div className="text-center cursor-pointer">
                <div>
                  <>
                    <AiOutlineDownload
                      onClick={() => this.handleShowInvoice(params.data)}
                      fill="green"
                      size="30px"
                    />
                    {/* {params.data?.status == "completed" ? (
                      <>
                        {this.state.InsiderPermissions &&
                          this.state.InsiderPermissions?.View && (
                            <AiOutlineDownload
                              onClick={() =>
                                this.showCompletedInvoice(params.data)
                              }
                              fill="green"
                              size="30px"
                            />
                          )}
                      </>
                    ) : (
                      <>
                        {this.state.InsiderPermissions &&
                          this.state.InsiderPermissions?.View && (
                            <AiOutlineDownload
                              onClick={() => this.MergeBillNow(params.data)}
                              fill="green"
                              size="30px"
                            />
                          )}
                      </>
                    )} */}
                  </>
                  <span></span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Create Dispatch",
          field: "Create Dispatch",
          filter: true,
          resizable: true,
          width: 170,
          cellRendererFramework: (params) => {
            return (
              <div className="text-center cursor-pointer">
                <div>
                  {this.state.InsiderPermissions &&
                    this.state.InsiderPermissions?.Create && (
                      <>
                        {params.data?.status == "Inprocess" ||
                        params.data?.status == "Cancel in process" ||
                        params.data?.status == "completed" ? (
                          <>
                            {params.data?.status
                              ?.toLowerCase()
                              ?.includes("completed") ? (
                              <div className="text-center cursor-pointer">
                                Completed
                              </div>
                            ) : params.data?.status === "pending" ? (
                              <div className="text-center cursor-pointer">
                                {params.data?.status}
                              </div>
                            ) : params.data?.status === "return" ? (
                              <div className="text-center cursor-pointer">
                                Returned
                              </div>
                            ) : params.data?.status === "Cancelled" ? (
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
                            )}
                          </>
                        ) : (
                          <>
                            <Badge
                              style={{ cursor: "pointer" }}
                              color={
                                this.state.Dispatching ? "secondary" : "primary"
                              }
                              title=" Ready for Dispatch"
                              onClick={async () => {
                                this.setState({ Dispatching: true });
                                await _Get(
                                  Sales_OrderTo_Dispatch,
                                  params?.data?._id
                                )
                                  .then((res) => {
                                    this.setState({ Dispatching: false });

                                    // console.log(res);
                                    let userData = JSON.parse(
                                      localStorage.getItem("userData")
                                    );

                                    this.Apicalling(
                                      userData?._id,
                                      userData?.database
                                    );
                                  })
                                  .catch((err) => {
                                    this.setState({ Dispatching: false });

                                    swal(
                                      "error",
                                      "Error Occured Try Again",
                                      "error"
                                    );
                                    console.log(err);
                                  });
                                // history.push({
                                //   pathname: `/app/AjGroup/dispatch/CreateDispach/${params?.data?._id}`,
                                //   state: { data: params?.data },
                                // })
                              }}
                              fill="green"
                              size="30px">
                              {this.state.Dispatching
                                ? "Dispatching..."
                                : "Ready To Dispatch"}
                            </Badge>
                            {/* <Route
                              render={({ history }) => (
                              )}
                            /> */}
                          </>
                        )}
                      </>
                    )}
                </div>
              </div>
            );
          },
        },

        // {
        //   headerName: "extra",
        //   field: "invoice",
        //   filter: true,
        //   resizable: true,
        //   width: 93,
        //   cellRendererFramework: (params) => {
        //     return (
        //       <div className="text-center cursor-pointer">
        //         <div>
        //           <AiOutlineDownload
        //             title="show bill"
        //             onClick={() => this.showCompletedInvoice(params.data)}
        //             fill="green"
        //             size="30px"
        //           />
        //         </div>
        //       </div>
        //     );
        //   },
        // },
        {
          headerName: "Order No",
          field: "orderNo",
          filter: true,
          resizable: true,
          width: 110,
          cellRendererFramework: (params) => {
            return (
              <div className="text-center cursor-pointer">
                <div>
                  <span>{params.data?.orderNo}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Order  Date",
          field: "createdAt",
          filter: true,
          resizable: true,
          width: 100,
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
        {
          headerName: "Party Name",
          field: "partyId.CompanyName",
          filter: true,
          width: 220,
          cellRendererFramework: (params) => {
            return (
              <div className="text-center cursor-pointer">
                <div>
                  <span>{params.data?.partyId?.CompanyName}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Company Pan No",
          field: "partyId.comPanNo",
          filter: true,
          width: 130,
          cellRendererFramework: (params) => {
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
          headerName: "Full Name",
          field: "partyId.ownerName",
          filter: true,
          resizable: true,
          width: 240,
          cellRendererFramework: (params) => {
            return (
              <div className="text-center cursor-pointer">
                <div>
                  <span>{`${params?.data?.partyId?.ownerName}`}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Party Limit",
          field: "partyId.limit",
          filter: true,
          width: 120,
          cellRendererFramework: (params) => {
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
          width: 135,
          cellRendererFramework: (params) => {
            // console.log(params.data);

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
        {
          headerName: "IGST ",
          field: "igstTotal",
          filter: true,
          width: 100,
          cellRendererFramework: (params) => {
            return (
              <div className="text-center cursor-pointer">
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
          headerName: "Amount",
          field: "amount",
          filter: true,
          width: 100,
          cellRendererFramework: (params) => {
            return (
              <div className="text-center cursor-pointer">
                <div>{params.data?.amount}</div>
              </div>
            );
          },
        },
        {
          headerName: "Round Off",
          field: "roundOff",
          filter: true,
          width: 105,
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
          width: 100,
          cellRendererFramework: (params) => {
            return (
              <div className="text-center cursor-pointer">
                <div>{params.data?.grandTotal}</div>
              </div>
            );
          },
        },
      ],
    };
  }
  // CancellInvoice(id) {
  //   swal("Warning", "Sure You Want to Cancel it", {
  //     buttons: {
  //       cancel: "Cancel",
  //       catch: { text: "Confirm ", value: "Confirm" },
  //     },
  //   }).then((value) => {
  //     switch (value) {
  //       case "Confirm":
  //         // _Delete(Delete_Sales_order, id)
  //         //   .then((res) => {
  //         //     let selectedData = this.gridApi.getSelectedRows();
  //         //     this.gridApi.updateRowData({ remove: selectedData });
  //         //   })
  //         //   .catch((err) => {
  //         //     console.log(err);
  //         //   });
  //         break;
  //       default:
  //     }
  //   });
  // }
  runthisfunction(id) {
    swal("Warning", "Sure You Want to Delete it", {
      buttons: {
        cancel: "cancel",
        catch: { text: "Delete ", value: "delete" },
      },
    }).then((value) => {
      switch (value) {
        case "delete":
          _Delete(Delete_Sales_order, id)
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
  runthisfunctionOtherStatus(id) {
    swal("Warning", "Sure You Want to Delete it", {
      buttons: {
        cancel: "cancel",
        catch: { text: "Delete ", value: "delete" },
      },
    }).then((value) => {
      switch (value) {
        case "delete":
          _Delete(Delete_Sales, id)
            .then((res) => {
              let selectedData = this.gridApi.getSelectedRows();
              this.gridApi.updateRowData({ remove: selectedData });
              this.componentDidMount();
            })
            .catch((err) => {
              console.log(err);
            });
          break;
        default:
      }
    });
  }
  MergeBillNow = async (data) => {
    this.setState({ ViewBill: false });
    await _Get(View_Customer_ById, data?.partyId?._id)
      .then((res) => {
        this.setState({
          AssignTransporter: res?.Customer[0].assignTransporter,
        });
      })
      .catch((err) => {
        console.log(err);
      });
    if (data?.grandTotal > 49999) {
      let gstDetails = HsnSummaryCalculation(data);

      data["gstDetails"] = gstDetails;
      this.setState({ EWayBill: true });
    }
    this.setState({ ViewOneData: data });

    this.setState({ PrintData: data });
    this.setState({ PrintMainData: data });
    this.toggleModalOne();
  };

  handleShowInvoice = async (data) => {
    let value = { ...data };
    if (data?.grandTotal > 49999) {
      this.setState({ EWayBill: true });
      value["ChallanStatus"] = true;
    }
    value["salesInvoiceStatus"] = true;
    let gstDetails = HsnSummaryCalculation(value);

    value["gstDetails"] = gstDetails;
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
    value["canceledInvoice"] = true;

    this.setState({ PrintData: value });

    this.setState({ ShowMyBill: true, ViewBill: true });
    const toWords = new ToWords();
    let words = toWords.convert(Number(data?.grandTotal), {
      currency: true,
    });
    this.setState({ wordsNumber: words });
    this.toggleModalOne();
  };

  handleSubmitOtherCharges = async (e) => {
    e.preventDefault();

    const UserInformation = this.context;
    this.setState({ ButtonText: "Loading.." });

    // ................................
    //  this.setState({ ButtonText: "Submit" });
    //  this.setState({ ShowBill: false, ViewBill: true });
    //  const toWords = new ToWords();
    //  let words = toWords.convert(Number(this.state.PrintData?.grandTotal), {
    //    currency: true,
    //  });
    //  this.setState({ wordsNumber: words });
    //  .....................................
    if (UserInformation?.CompanyDetails?.BillNumber) {
      await _Post(
        Sales_OrderTo_DispatchList,
        this.state.PrintData?._id,
        this.state.PrintData
      )
        .then((res) => {
          this.setState({ ButtonText: "Submit" });
          this.setState({ ShowBill: false, ViewBill: true });
          const toWords = new ToWords();
          let words = toWords.convert(
            Number(this.state.PrintData?.grandTotal),
            {
              currency: true,
            }
          );
          this.setState({ wordsNumber: words });
          this.componentDidMount();

          console.log(res);
        })
        .catch((err) => {
          this.setState({ ButtonText: "Submit" });
          swal("Error", `${err?.response?.data?.message}`);
          console.log(err);
        });
    } else {
      swal("information", "Select Bill Template from setting Tab", "error");
      // this.setState({ ShowBill: true });
      // this.toggleModalOne();
    }
  };
  handleCancelShow = (data) => {
    console.log(data);
  };
  toggleModalclose = () => {
    this.setState({ modalOne: false });
    this.setState({ ShowMyBill: false });
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
  // handleAddDiscount = (e) => {
  //   let value = _.cloneDeep(this.state?.PrintMainData);
  //   let Allvalue = _.cloneDeep(this.state?.PrintData);

  //   let AddCharges = e?.filter((ele) => ele?.type == "Charges");
  //   let Discount = e?.filter((ele) => ele?.type == "Discount");

  //   if (Discount?.length) {
  //     let subtotal = value?.amount;
  //     let latestSubTotal = subtotal;
  //     Discount?.forEach((ele) => {
  //       let discountAmount = Number(
  //         (subtotal / ((100 + ele?.percentage) / 100)).toFixed(2)
  //       );
  //       latestSubTotal = discountAmount;
  //       subtotal = discountAmount; // If you need to adjust the original subtotal too.
  //       ele["discountedAmount"] = Number(discountAmount.toFixed(2));
  //       ele["disType"] = ele?.type;
  //     });

  //     let discountPercentage = Number(
  //       (
  //         ((value?.amount - Number(latestSubTotal?.toFixed(2))) /
  //           value?.amount) *
  //         100
  //       ).toFixed(2)
  //     );

  //     let discount = Number(
  //       (100 + Number(discountPercentage?.toFixed(2))) / 100
  //     );
  //     // Discount?.forEach((ele, index) => {
  //     //   if (value?.igstTaxType == 1) {
  //     //     ele["centralTax"] = [];
  //     //     ele["stateTax"] = [];
  //     //     ele["igstTax"] = [
  //     //       {
  //     //         amount: Number(
  //     //           ((ele?.discountedAmount * ele?.percentage) / 100).toFixed(2)
  //     //         ),
  //     //         rate: ele?.percentage,
  //     //       },
  //     //     ];
  //     //   } else {
  //     //     ele["igstTax"] = [];
  //     //     ele["centralTax"] = [
  //     //       {
  //     //         amount: Number(
  //     //           ((ele?.discountedAmount * ele?.percentage) / 200).toFixed(2)
  //     //         ),
  //     //         rate: ele?.percentage / 2,
  //     //       },
  //     //     ];
  //     //     ele["stateTax"] = [
  //     //       {
  //     //         amount: Number(
  //     //           ((ele?.discountedAmount * ele?.percentage) / 200).toFixed(2)
  //     //         ),
  //     //         rate: ele?.percentage / 2,
  //     //       },
  //     //     ];
  //     //   }

  //     //   ele["hsn"] = ele?.title;
  //     // });
  //     value["overAllDiscountPer"] = Number(discountPercentage?.toFixed(2));
  //     value["discountDetails"] = Discount;

  //     value?.gstDetails?.forEach((ele) => {
  //       ele["taxable"] = Number((ele?.taxable / discount).toFixed(2));
  //       ele["withDiscountAmount"] = Number(
  //         (ele?.withDiscountAmount / discount).toFixed(2)
  //       );
  //       ele["withoutTaxablePrice"] = Number(
  //         (ele?.withoutTaxablePrice / discount).toFixed(2)
  //       );
  //       if (ele?.igstTax?.length > 0) {
  //         ele["igstTax"] = [
  //           {
  //             rate: ele?.igstTax[0].rate,
  //             amount: Number((ele?.igstTax[0].amount / discount).toFixed(2)),
  //           },
  //         ];
  //       } else {
  //         ele["centralTax"] = [
  //           {
  //             rate: ele?.centralTax[0].rate,
  //             amount: Number((ele?.centralTax[0].amount / discount).toFixed(2)),
  //           },
  //         ];
  //         ele["stateTax"] = [
  //           {
  //             rate: ele?.stateTax[0].rate,
  //             amount: Number((ele?.stateTax[0].amount / discount).toFixed(2)),
  //           },
  //         ];
  //       }
  //     });
  //     // value["amount"] = Number((value?.amount * discount).toFixed(2));

  //     // subtotal-discounts+charges+gst= grandtotal
  //     // 100-2-1.96-1.92+0+
  //     // gst= subtotal-discount+charges*gstrate
  //     value["cgstTotal"] = Number((value?.cgstTotal / discount).toFixed(2));
  //     value["sgstTotal"] = Number((value?.sgstTotal / discount).toFixed(2));
  //     value["igstTotal"] = Number((value?.igstTotal / discount).toFixed(2));
  //     value["grandTotal"] = Number((value?.grandTotal / discount).toFixed(2));
  //   }
  //   // if (AddCharges?.length) {
  //   //   let subtotal = value?.amount;
  //   //   let latestSubTotal = subtotal;
  //   //   AddCharges?.map((ele) => {
  //   //     let OtherCharge = (subtotal * ele?.percentage) / 100;
  //   //     latestSubTotal += OtherCharge;
  //   //     subtotal += OtherCharge; // If you need to adjust the original subtotal too.
  //   //     ele["chargedAmount"] = Number(OtherCharge.toFixed(2));
  //   //     ele["chargedType"] = ele?.type;
  //   //   });

  //   //   let addedCharges = Number(
  //   //     (
  //   //       ((Number(latestSubTotal?.toFixed(2)) - value?.amount) /
  //   //         value?.amount) *
  //   //       100
  //   //     ).toFixed(2)
  //   //   );

  //   //   let discount = Number((100 + Number(addedCharges?.toFixed(2))) / 100);

  //   //   value["overAllCharges"] = Number(addedCharges?.toFixed(2));
  //   //   value["chargesDetails"] = AddCharges;

  //   //   value?.gstDetails?.forEach((ele) => {
  //   //     ele["taxable"] = Number((ele?.taxable * discount).toFixed(2));
  //   //     ele["withDiscountAmount"] = Number(
  //   //       (ele?.withDiscountAmount * discount).toFixed(2)
  //   //     );
  //   //     ele["withoutTaxablePrice"] = Number(
  //   //       (ele?.withoutTaxablePrice * discount).toFixed(2)
  //   //     );
  //   //     if (ele?.igstTax?.length > 0) {
  //   //       ele["igstTax"] = [
  //   //         {
  //   //           rate: ele?.igstTax[0].rate,
  //   //           amount: Number((ele?.igstTax[0].amount * discount).toFixed(2)),
  //   //         },
  //   //       ];
  //   //     } else {
  //   //       ele["centralTax"] = [
  //   //         {
  //   //           rate: ele?.centralTax[0].rate,
  //   //           amount: Number((ele?.centralTax[0].amount * discount).toFixed(2)),
  //   //         },
  //   //       ];
  //   //       ele["stateTax"] = [
  //   //         {
  //   //           rate: ele?.stateTax[0].rate,
  //   //           amount: Number((ele?.stateTax[0].amount * discount).toFixed(2)),
  //   //         },
  //   //       ];
  //   //     }
  //   //   });

  //   //   // value["amount"] = Number((value?.amount * discount).toFixed(2));
  //   //   value["cgstTotal"] = Number((value?.cgstTotal * discount).toFixed(2));
  //   //   value["sgstTotal"] = Number((value?.sgstTotal * discount).toFixed(2));
  //   //   value["igstTotal"] = Number((value?.igstTotal * discount).toFixed(2));
  //   //   value["grandTotal"] = Number((value?.grandTotal * discount).toFixed(2));
  //   // }

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
  //       value["roundOff"] = +roundoff / 100;
  //     } else {
  //       let roundoff = -decimalValue;
  //       value["grandTotal"] =
  //         parseFloat(value?.grandTotal) - decimalValue / 100;
  //       value.roundOff = -roundoff / 100;
  //     }
  //   } else {
  //     value["grandTotal"] = value?.grandTotal;
  //   }
  //   value["transporter"] = Allvalue?.transporter;
  //   value["vehicleNo"] = Allvalue?.vehicleNo;
  //   this.setState({ PrintData: value });
  //   this.setState({ PrintMainData: value });
  // };

  handleAddCharges = (e) => {
    let value = _.cloneDeep(this.state?.PrintMainData);
    let Allvalue = _.cloneDeep(this.state?.PrintData);

    let AddCharges = e?.filter((ele) => ele?.type == "Charges");
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
        let discountedValue = (subtotal * ele?.percentage) / 100;
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
      // Discount?.forEach((ele, index) => {
      //   if (value?.igstTaxType == 1) {
      //     ele["centralTax"] = [];
      //     ele["stateTax"] = [];
      //     ele["igstTax"] = [
      //       {
      //         amount: Number(
      //           ((ele?.discountedAmount * ele?.percentage) / 100).toFixed(2)
      //         ),
      //         rate: ele?.percentage,
      //       },
      //     ];
      //   } else {
      //     ele["igstTax"] = [];
      //     ele["centralTax"] = [
      //       {
      //         amount: Number(
      //           ((ele?.discountedAmount * ele?.percentage) / 200).toFixed(2)
      //         ),
      //         rate: ele?.percentage / 2,
      //       },
      //     ];
      //     ele["stateTax"] = [
      //       {
      //         amount: Number(
      //           ((ele?.discountedAmount * ele?.percentage) / 200).toFixed(2)
      //         ),
      //         rate: ele?.percentage / 2,
      //       },
      //     ];
      //   }

      //   ele["hsn"] = ele?.title;
      // });
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
    }
    if (AddCharges?.length) {
      let subtotal = value?.amount;
      let latestSubTotal = subtotal;
      AddCharges?.map((ele) => {
        let OtherCharge = (subtotal * ele?.percentage) / 100;
        latestSubTotal += OtherCharge;
        subtotal += OtherCharge; // If you need to adjust the original subtotal too.
        ele["chargedAmount"] = Number(OtherCharge.toFixed(2));
        ele["chargedType"] = ele?.type;
      });

      let addedCharges = Number(
        (
          ((Number(latestSubTotal?.toFixed(2)) - value?.amount) /
            value?.amount) *
          100
        ).toFixed(2)
      );

      let discount = Number((100 + Number(addedCharges?.toFixed(2))) / 100);

      value["overAllCharges"] = Number(addedCharges?.toFixed(2));
      // value["chargesDetails"] = AddCharges;

      value?.gstDetails?.forEach((ele) => {
        ele["taxable"] = Number((ele?.taxable * discount).toFixed(2));
        ele["withDiscountAmount"] = Number(
          (ele?.withDiscountAmount * discount).toFixed(2)
        );
        ele["withoutTaxablePrice"] = Number(
          (ele?.withoutTaxablePrice * discount).toFixed(2)
        );
        if (ele?.igstTax?.length > 0) {
          ele["igstTax"] = [
            {
              rate: ele?.igstTax[0].rate,
              amount: Number((ele?.igstTax[0].amount * discount).toFixed(2)),
            },
          ];
        } else {
          ele["centralTax"] = [
            {
              rate: ele?.centralTax[0].rate,
              amount: Number((ele?.centralTax[0].amount * discount).toFixed(2)),
            },
          ];
          ele["stateTax"] = [
            {
              rate: ele?.stateTax[0].rate,
              amount: Number((ele?.stateTax[0].amount * discount).toFixed(2)),
            },
          ];
        }
      });

      // value["amount"] = Number((value?.amount * discount).toFixed(2));
      // value["cgstTotal"] = Number((value?.cgstTotal * discount).toFixed(2));
      // value["sgstTotal"] = Number((value?.sgstTotal * discount).toFixed(2));
      // value["igstTotal"] = Number((value?.igstTotal * discount).toFixed(2));
      // value["grandTotal"] = Number((value?.grandTotal * discount).toFixed(2));
    }
    value["chargesDetails"] = AddCharges;

    let lastdiscount =
      value?.discountDetails[value?.discountDetails?.length - 1];
    let charge = value?.chargesDetails[value?.chargesDetails?.length - 1];
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

    if (charge?.chargedAmount > 0 && lastdiscount?.discountedAmount > 0) {
      Sum = lastdiscount?.discountedAmount + charge?.chargedAmount;
      gstCalculation = Number(
        (
          (lastdiscount?.discountedAmount + charge?.chargedAmount) *
          (maxGst?.gstPercentage / 100)
        ).toFixed(2)
      );
    } else {
      if (lastdiscount?.discountedAmount > 0) {
        // Sum = lastdiscount?.discountedAmount + value?.amount;
        Sum = lastdiscount?.discountedAmount;
        gstCalculation = Number(
          // (lastdiscount?.discountedAmount + value?.amount) *
          (
            lastdiscount?.discountedAmount *
            (maxGst?.gstPercentage / 100)
          ).toFixed(2)
        );
      } else {
        Sum = charge?.chargedAmount + value?.amount;
        gstCalculation = Number(
          (
            (charge?.chargedAmount + value?.amount) *
            (maxGst?.gstPercentage / 100)
          ).toFixed(2)
        );
      }
    }

    if (value?.cgstTotal > 0) {
      value["cgstTotal"] = gstCalculation / 2;
      value["sgstTotal"] = gstCalculation / 2;
    } else {
      value["igstTotal"] = gstCalculation;
    }
    value["grandTotal"] = Number((Sum + gstCalculation).toFixed(2));
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
    this.setState({ PrintData: value });
    this.setState({ PrintMainData: value });
  };
  toggleModalOne = () => {
    this.setState((prevState) => ({
      modalOne: !prevState.modalOne,
    }));
  };
  LookupviewStart = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };
  handleChangeView = (data, types) => {
    console.log(data);
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
    await _Get(view_create_order_history, id, db)
      .then((res) => {
        this.setState({ Loading: false });

        if (res?.orderHistory) {
          let newList = res?.orderHistory?.filter(
            (lst) => lst.status == "Cancel in process"
            // (lst) => lst.status == "completed"
          );

          const newLists = newList?.reverse();
          this.setState({ rowData: newLists });
        }
        this.setState({ AllcolumnDefs: this.state.columnDefs });
        this.setState({ SelectedCols: this.state.columnDefs });
        let userHeading = JSON.parse(
          localStorage.getItem("cancelledOrderList")
        );
        if (userHeading?.length) {
          this.setState({ columnDefs: userHeading });
          // this.gridApi.setColumnDefs(userHeading);
          this.setState({ SelectedcolumnDefs: userHeading });
        } else {
          this.setState({ columnDefs: this.state.columnDefs });
          this.setState({ SelectedcolumnDefs: this.state.columnDefs });
        }
      })
      .catch((err) => {
        this.setState({ rowData: [] });
        this.setState({ Loading: false });
      });
  }
  async componentDidMount() {
    const UserInformation = this.context;
    this.setState({ CompanyDetails: UserInformation?.CompanyDetails });
    const InsidePermissions = CheckPermission("Cancelled Order");
    this.setState({ InsiderPermissions: InsidePermissions });
    // let billnumner = localStorage.getItem("billnumber");
    // let userchoice = JSON.parse(localStorage.getItem("billUI"));
    if (UserInformation?.CompanyDetails?.BillNumber) {
      this.setState({ ShowBill: false });
      this.setState({
        BillNumber: UserInformation?.CompanyDetails?.billNo
          ? UserInformation?.CompanyDetails?.billNo
          : 2,
      });
    }
    // if (userchoice) {
    //   this.setState({ Billtoposition: userchoice?.billTo });
    // }
    let pageparmission = JSON.parse(localStorage.getItem("userData"));
    if (pageparmission?.rolename?.roleName === "MASTER") {
      this.setState({ MasterShow: true });
    }
    await this.Apicalling(pageparmission?._id, pageparmission?.database);
  }
  togglemodal = () => {
    this.setState((prevState) => ({
      modalone: !prevState.modalone,
    }));
    this.setState({ ShowBill: false });
  };
  toggleDropdown = () => {
    this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
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
    await exportDataToPDF(csvData, "AllOrderList");
  };
  processCell = (params) => {
    return params.value;
  };
  // exportToExcel = async (e) => {
  //   const CsvData = this.gridApi.getDataAsCsv({
  //     processCellCallback: this.processCell,
  //   });
  //   await exportDataToExcel(CsvData, "AllOrderList");
  // };
  exportToExcel = async (fileName, e) => {
    this.state.rowData?.forEach((ele) => {
      delete ele?.status;
      delete ele?.UID;
      delete ele?.warehouseId;
      delete ele?.Transporter;
      delete ele?.partyId;
      delete ele?.userId;
      delete ele?.createdAt;
      delete ele?.updatedAt;
      delete ele?.userName;
      delete ele?.created_by;
      delete ele?.__v;
      delete ele?._id;
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
      delete ele?.UID;
      delete ele?.warehouseId;
      delete ele?.status;
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
  // convertCSVtoExcel = async () => {
  //   const CsvData = this.gridApi.getDataAsCsv({
  //     processCellCallback: this.processCell,
  //   });
  //   await convertDataCSVtoExcel(CsvData, "AllOrderList");
  // };
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
    await convertDataCsvToXml(CsvData, "AllOrderList");
  };
  HandleSetVisibleField = (e) => {
    e.preventDefault();
    this.gridApi.setColumnDefs(this.state.SelectedcolumnDefs);
    this.setState({ columnDefs: this.state.SelectedcolumnDefs });
    this.setState({ SelectedcolumnDefs: this.state.SelectedcolumnDefs });
    this.setState({ rowData: this.state.rowData });
    localStorage.setItem(
      "cancelledOrderList",
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
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
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
  HandleSelect = (selectedList, selectedItem) => {
    this.setState({ Charges: selectedList });
    this.handleAddCharges(selectedList);
  };
  HandleRemove = (selectedList, selectedItem) => {
    this.setState({ ChargesOrDiscount: selectedList });
    this.handleAddCharges(selectedList);
  };
  HandleSelectDiscount = (selectedList, selectedItem) => {
    this.setState({ Discount: selectedList });
    this.handleAddCharges(selectedList);
  };
  HandleRemoveDiscount = (selectedList, selectedItem) => {
    this.setState({ ChargesOrDiscount: selectedList });
    this.handleAddCharges(selectedList);
  };
  handleReset = () => {
    this.setState({ Charges: [] });
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
      InsiderPermissions,
      AllcolumnDefs,
    } = this.state;
    return (
      <>
        <div className="app-user-list">
          <Card>
            <Row style={{ marginLeft: "3px", marginRight: "3px" }}>
              <Col>
                <h2
                  className="float-left "
                  style={{
                    fontWeight: "600",
                    textTransform: "uppercase",
                    fontSize: "18px",
                    marginTop: "25px",
                  }}>
                  Cancel Orders ({this.state.rowData.length})
                </h2>
              </Col>
              {this.state.MasterShow ? (
                <Col lg="3" md="4" sm="12" style={{ marginTop: "25px" }}>
                  <SuperAdminUI
                    onDropdownChange={this.handleDropdownChange}
                    onSubmit={this.handleParentSubmit}
                  />
                </Col>
              ) : (
                <Col></Col>
              )}
              <Col lg="3" md="6" sm="12" style={{ marginTop: "25px" }}>
                <div>
                  <div className="table-input  cssforproductlist">
                    <Input
                      placeholder="search Item here..."
                      onChange={(e) => this.updateSearchQuery(e.target.value)}
                      value={this.state.value}
                    />
                  </div>
                </div>
              </Col>
              {/* <Col lg="2" xs="8">
                {InsiderPermissions && InsiderPermissions?.Create && (
                  <span>
                    <Route
                      render={({ history }) => (
                        <Button
                          style={{
                            cursor: "pointer",
                            backgroundColor: "rgb(8, 91, 245)",
                            color: "white",
                            fontWeight: "500",
                            height: "43px",
                            textTransform: "uppercase",
                          }}
                          className="float-left"
                          color="#39cccc"
                          onClick={() =>
                            history.push("/app/softnumen/order/createorder")
                          }>
                          <FaPlus size={15} /> Create Order
                        </Button>
                      )}
                    />
                  </span>
                )}
              </Col> */}
              <Col lg="1" xs="4" style={{ marginTop: "25px" }}>
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
                {InsiderPermissions && InsiderPermissions?.Download && (
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
                            onClick={() => this.gridApi.exportDataAsCsv()}
                            style={{ cursor: "pointer" }}
                            className=" mx-1 myactive">
                            .CSV
                          </h5>
                          <h5
                            onClick={() => this.convertCSVtoExcel("OrderList")}
                            style={{ cursor: "pointer" }}
                            className=" mx-1 myactive">
                            .XLS
                          </h5>
                          <h5
                            onClick={() => this.exportToExcel("OrderList")}
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
                  <div className="ag-theme-material w-100  ag-grid-table">
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
                  {/* <Button onClick={this.HandleSetVisibleField} color="primary">
                    Submit
                  </Button> */}
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
        <Modal
          isOpen={this.state.modalone}
          toggle={this.togglemodal}
          className={this.props.className}
          style={{ maxWidth: "1050px" }}>
          <ModalHeader toggle={this.togglemodal}>
            {this.state.ShowBill ? "Bill Download" : "All Products"}
          </ModalHeader>
          <ModalBody
            className={`${this.state.ShowBill ? "p-1" : "modalbodyhead"}`}>
            {this.state.ShowBill ? (
              <>
                <StockTrxInvoice ViewOneData={this.state.ViewOneData} />
              </>
            ) : (
              <>
                {this.state.ViewOneUserView ? (
                  <>
                    <Row>
                      <Col>
                        <Label>UserName:</Label>
                        <h5 className="">
                          {this.state.ViewOneData &&
                            this.state.ViewOneData?.partyId?.CompanyName}
                        </h5>
                      </Col>
                      <Col>
                        <Label>Amount:</Label>
                        <h5 className="">
                          {this.state.ViewOneData &&
                            this.state.ViewOneData?.amount}
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
                              this.state.ViewOneData?.grandTotal}
                          </strong>
                          Rs/-
                        </h5>
                      </Col>
                      <Col>
                        {this.state.ViewOneData?.status == "completed" ? (
                          <>
                            <div className="d-flex justify-content-center">
                              <h5>
                                Status:
                                <Badge className="mx-2" color="primary">
                                  {this.state.ViewOneData?.status}
                                </Badge>
                              </h5>
                            </div>
                          </>
                        ) : (
                          <>
                            <h5>Status:</h5>

                            <Badge className="" color="primary">
                              {this.state.ViewOneData?.status}
                            </Badge>
                          </>
                        )}
                      </Col>
                    </Row>
                    <Row className="p-2">
                      <Col>
                        <div className="d-flex justify-content-center">
                          <h4>Order List</h4>
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
                              this.state.ViewOneData?.orderItems?.map(
                                (ele, i) => (
                                  <>
                                    <tr>
                                      <th scope="row">{i + 1}</th>
                                      <td>{ele?.productId?.Product_Title}</td>
                                      <td>{ele?.productId?.HSN_Code}</td>
                                      <td>{ele?.price?.toFixed(2)}</td>
                                      {/* <td>{ele?.Size}</td> */}
                                      <td>{ele?.qty}</td>
                                      <td>{ele?.primaryUnit}</td>
                                      <td>{ele?.taxableAmount}</td>
                                      {this.state.ViewOneData?.igstTaxType &&
                                      this.state.ViewOneData?.igstTaxType ==
                                        1 ? (
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
                                )
                              )}
                          </tbody>
                        </Table>
                      </Col>
                    </Row>
                  </>
                ) : null}
              </>
            )}
          </ModalBody>
        </Modal>
        <Modal
          isOpen={this.state.modalOne}
          toggle={this.toggleModalOne}
          className={this.props.className}
          backdrop="false"
          style={{ maxWidth: "1050px" }}>
          <ModalHeader toggle={this.toggleModalOne}>
            {this.state.ShowBill ? "Download BIll" : "Download BIll"}
          </ModalHeader>
          <ModalBody>
            <div style={{ width: "100%" }} className="">
              <InvoiceGenerator
                EWayBill={this.state.EWayBill}
                CompanyDetails={this.state.CompanyDetails}
                BillNumber={this.state.BillNumber}
                PrintData={this.state.PrintData}
                Applied_Charges={this.state.Applied_Charges}
                AllbillMerged={this.state.AllbillMerged}
                wordsNumber={this.state.wordsNumber}
                deliveryCharges={this.state.deliveryCharges}
                otherCharges={this.state.otherCharges}
                discount={this.state.discount}
              />
            </div>
          </ModalBody>
        </Modal>
      </>
    );
  }
}
export default OrderList;
