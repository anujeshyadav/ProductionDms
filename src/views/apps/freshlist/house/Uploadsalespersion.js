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
} from "reactstrap";
import { ImDownload } from "react-icons/im";
import { AiOutlineDownload } from "react-icons/ai";
import { ToWords } from "to-words";
import { Eye, ChevronDown, CornerDownLeft } from "react-feather";

import "../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../../../assets/scss/pages/users.scss";
import InvoicGenerator from "../subcategory/InvoiceGeneratorone";
import { Route, Link } from "react-router-dom";
import swal from "sweetalert";
import {
  _Get,
  _Post,
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
  Sales_OrderTo_DispatchList,
  ViewOther_Charges,
  View_Customer_ById,
} from "../../../../ApiEndPoint/Api";
import {
  convertDataCSVtoExcel,
  convertDataCsvToXml,
  exportDataToExcel,
  exportDataToPDF,
} from "../house/Downloader";

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

class Uploadsalespersion extends React.Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.gridRef = React.createRef();
    this.gridApi = null;
    this.state = {
      isOpen: false,
      ShowMyBill: true,
      MasterShow: false,
      BillNumber: "",
      Arrindex: "",
      AllbillMerged: [],
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
          width: 100,
          filter: true,
        },
        {
          headerName: "Status",
          field: "order_status",
          filter: true,
          width: 140,
          cellRendererFramework: (params) => {
            return params.data?.status === "completed" ? (
              <div className="badge badge-pill badge-success">Completed</div>
            ) : params.data?.status === "pending" ? (
              <div className="badge badge-pill badge-warning">
                {params.data?.status}
              </div>
            ) : params.data?.status === "return" ? (
              <div className="badge badge-pill bg-danger">Returned</div>
            ) : params.data?.status === "cancelled" ? (
              <div className="badge badge-pill bg-danger">
                {params.data.status}
              </div>
            ) : params.data?.status === "Completed" ? (
              <div className="badge badge-pill bg-success">Completed</div>
            ) : (
              <>
                <div className="badge badge-pill bg-danger">Cancelled</div>
              </>
            );
          },
        },
        {
          headerName: "Actions",
          field: "sortorder",
          field: "transactions",
          width: 120,
          cellRendererFramework: (params) => {
            return (
              <div className="actions cursor-pointer">
                {this.state.InsiderPermissions &&
                  this.state.InsiderPermissions?.View && (
                    <Route
                      render={() => (
                        <Eye
                          className="mr-50"
                          size="25px"
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
                  this.state.InsiderPermissions?.Edit && (
                    <>
                      {params.data?.status
                        .toLowerCase()
                        .includes("completed") && (
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
          headerName: "Party Type",
          field: "_id",
          filter: true,
          editable: true,
          resizable: true,
          width: 200,
          cellRendererFramework: (params) => {
            return (
              <div className="d-flex align-items-center cursor-pointer">
                <div>
                  <span>{params?.data?._id}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Sales Person Name",
          field: "createdAt",
          filter: true,
          resizable: true,
          width: 230,
          cellRendererFramework: (params) => {
            console.log(params.data);
            return (
              <div className="d-flex align-items-center cursor-pointer">
                <div>
                  <span>{params.data?.createdAt?.split("T")[0]}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Status",
          field: "status",
          filter: true,
          resizable: true,
          width: 180,
          cellRendererFramework: (params) => {
            console.log(params?.data);

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
                              <div className="badge badge-pill bg-success">
                                Completed
                              </div>
                            ) : params.data?.status === "pending" ? (
                              <div className="badge badge-pill badge-warning">
                                {params.data?.status}
                              </div>
                            ) : params.data?.status === "return" ? (
                              <div className="badge badge-pill bg-danger">
                                Returned
                              </div>
                            ) : params.data?.status === "cancelled" ? (
                              <div className="badge badge-pill bg-danger">
                                {params.data.status}
                              </div>
                            ) : params.data?.status === "Inprocess" ? (
                              <div className="badge badge-pill bg-warning">
                                {params.data.status}
                              </div>
                            ) : (
                              <>
                                <div className="badge badge-pill bg-warning">
                                  {params.data.status}
                                </div>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            {params?.data?.invoiceStatus ? (
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
                            ) : (
                              <>
                                <FaTruck
                                  style={{ cursor: "pointer" }}
                                  title="Invoice Not Created"
                                  onClick={() =>
                                    swal(
                                      "Error",
                                      "Invoice Not Created",
                                      "error"
                                    )
                                  }
                                  fill="green"
                                  size="30px"
                                />
                              </>
                            )}
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
          headerName: "GST Number",
          field: "invoice",
          filter: true,
          resizable: true,
          width: 180,
          cellRendererFramework: (params) => {
            return (
              <div className="d-flex align-items-center justify-content-center cursor-pointer">
                <div>
                  <>
                    {this.state.InsiderPermissions &&
                      this.state.InsiderPermissions?.View && (
                        <AiOutlineDownload
                          title="create Invoice here"
                          onClick={() => this.MergeBillNow(params.data)}
                          fill="green"
                          size="30px"
                        />
                      )}
                  </>
                  <span></span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Owner Number",
          field: "partyId.ownerName",
          filter: true,
          resizable: true,
          width: 150,
          cellRendererFramework: (params) => {
            return (
              <div className="d-flex align-items-center justify-content-center cursor-pointer">
                <div>
                  <span>{params?.data?.partyId?.ownerName}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Whatsapp Number",
          field: "partyId.email",
          filter: true,
          resizable: true,
          width: 160,
          cellRendererFramework: (params) => {
            return (
              <div className="d-flex align-items-center justify-content-center cursor-pointer">
                <div>
                  <span>{params?.data?.partyId?.email}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Manager Name",
          field: "partyId.address",
          filter: true,
          resizable: true,
          width: 200,
          cellRendererFramework: (params) => {
            return (
              <div className="d-flex align-items-center justify-content-center cursor-pointer">
                <div>
                  <span>{params?.data?.partyId?.address}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Manager Number",
          field: "partyId.comPanNo",
          filter: true,
          width: 250,
          cellRendererFramework: (params) => {
            return (
              <div className="d-flex align-items-center cursor-pointer">
                <div>
                  <span>{params.data?.partyId?.comPanNo}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "PinCode",
          field: "partyId.ownerName",
          filter: true,
          width: 180,
          cellRendererFramework: (params) => {
            return (
              <div className="d-flex align-items-center cursor-pointer">
                <div>
                  <span>{params.data?.partyId?.ownerName}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Area",
          field: "partyId.ownerName",
          filter: true,
          width: 180,
          cellRendererFramework: (params) => {
            return (
              <div className="d-flex align-items-center cursor-pointer">
                <div>
                  <span>{params.data?.partyId?.ownerName}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "State",
          field: "partyId.limit",
          filter: true,
          width: 180,
          cellRendererFramework: (params) => {
            return (
              <div className="d-flex align-items-center cursor-pointer">
                <div>
                  <span>{params.data?.partyId?.limit}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "City",
          field: "partyId.assignTransporter",
          filter: true,
          width: 200,
          cellRendererFramework: (params) => {
            return (
              <div className="d-flex align-items-center cursor-pointer">
                <div>
                  {params.data?.partyId?.assignTransporter &&
                  params.data?.partyId?.assignTransporter?.length > 0 ? (
                    <>
                      <Badge color="primary">Available</Badge>
                    </>
                  ) : (
                    <>
                      <Badge color="secondary">Not-Available</Badge>
                    </>
                  )}
                </div>
              </div>
            );
          },
        },

        {
          headerName: "Address",
          field: "igstTotal",
          filter: true,
          width: 150,
          cellRendererFramework: (params) => {
            return (
              <div className="d-flex align-items-center cursor-pointer">
                <div>
                  <Badge color="primary">
                    {params.data?.igstTotal && params.data?.igstTotal}
                  </Badge>
                </div>
              </div>
            );
          },
        },
      ],
      setMySelectedarr: [],
      SelectedCols: [],
      paginationPageSize: 5,
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

  handleSubmitOtherCharges = async (e) => {
    const UserInformation = this.context;
    e.preventDefault();
    this.setState({ ButtonText: "Loading.." });
    if (UserInformation?.CompanyDetails?.BillNumber) {
      let words = toWords.convert(Number(this.state.PrintData?.grandTotal), {
        currency: true,
      });
      this.setState({ wordsNumber: words });

      await _Post(
        Sales_OrderTo_DispatchList,
        this.state.PrintData?._id,
        this.state.PrintData
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

          console.log(res);
        })
        .catch((err) => {
          this.setState({ ButtonText: "Submit" });
          swal("Error", `${err?.response?.data?.message}`);
          console.log(err);
        });
    } else {
      swal("Select Bill Template from setting Tab");
      // this.setState({ ShowBill: true });
      // this.toggleModalOne();
    }
  };

  MergeBillNow = async (data) => {
    this.setState({ ShowMyBill: true });
    this.setState({ ViewBill: false });
    await _Get(View_Customer_ById, data?.partyId?._id)
      .then((res) => {
        console.log(res);

        this.setState({
          AssignTransporter: res?.Customer[0].assignTransporter,
        });
      })
      .catch((err) => {
        console.log(err);
      });
    if (data?.grandTotal > 49999) {
      this.setState({ EWayBill: true });
    }
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
  handleAddCharges = (e) => {
    const selected =
      e.target.options[e.target.selectedIndex].getAttribute("data_id");
    let getValue = Number(selected?.split("*")[0]);
    let GST = Number(selected?.split("*")[1]) / 100;
    let value = { ...this.state?.PrintMainData };
    let Allvalue = { ...this.state?.PrintData };
    value["otherCharges"] = Number(e.target.value);

    value["amount"] = Number(value?.amount + getValue);
    if (value?.igstTaxType == 1) {
      let otherigst = Number((getValue * GST).toFixed(2));
      value["igstTotal"] = Number((value?.igstTotal + otherigst).toFixed(2));
      value["grandTotal"] = Number(
        (value?.amount + value?.igstTotal).toFixed(2)
      );
      value["gstOtherCharges"] = [
        {
          igstTax: [
            { rate: Number(selected?.split("*")[1]), amount: otherigst },
          ],
          centralTax: [],
          stateTax: [],
          taxable: getValue,
          withoutTaxablePrice: getValue + otherigst,
        },
      ];
    } else {
      let othergst = Number(((getValue * GST) / 2).toFixed(2));

      value["cgstTotal"] = Number((value?.cgstTotal + othergst).toFixed(2));
      value["sgstTotal"] = Number((value?.sgstTotal + othergst).toFixed(2));
      value["grandTotal"] = Number(
        (value?.amount + value?.cgstTotal + value?.sgstTotal).toFixed(2)
      );
      value["gstOtherCharges"] = [
        {
          igstTax: [],
          centralTax: [{ rate: (GST * 100) / 2, amount: othergst }],
          stateTax: [{ rate: (GST * 100) / 2, amount: othergst }],
          taxable: getValue,
          withoutTaxablePrice: getValue + othergst,
        },
      ];
    }

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

        value["roundOff"] = +roundoff;
      } else {
        let roundoff = -decimalValue;
        value["grandTotal"] =
          parseFloat(value?.grandTotal) - decimalValue / 100;
        value.roundOff = roundoff / 100;
      }
    } else {
      value["grandTotal"] = value?.grandTotal;
    }

    value["transporter"] = Allvalue?.transporter;
    value["vehicleNo"] = Allvalue?.vehicleNo;
    this.setState({ PrintData: value });
  };
  toggleModalclose = () => {
    this.setState({ modalOne: false });
    this.setState({ ShowMyBill: false });
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

    await view_Sales_orderList(id, db)
      .then((res) => {
        this.setState({ Loading: false });
        let pending = res?.orderHistory?.filter(
          (ele) => ele?.status == "pending"
        );
        // console.log(res?.orderHistory);

        this.setState({ rowData: pending.reverse() });
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
        console.log(res?.OtherCharges);
        let val = res?.OtherCharges;
        if (val?.length) {
          this.setState({ OtherCharges: val });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  async componentDidMount() {
    const UserInformation = this.context;

    this.setState({ CompanyDetails: UserInformation?.CompanyDetails });
    let pageparmission = JSON.parse(localStorage.getItem("userData"));
    let userid = pageparmission?._id;
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
                      <Row className="ml-2 mr-2 ">
                        <Col lg="3" md="4" sm="12" className="mt-2">
                          <h1
                            className="float-left"
                            style={{ fontWeight: "600" }}>
                            Upload Sales Person
                          </h1>
                        </Col>

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
                            className="table-input float-right"
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
                        <Col className="mt-2">
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              this.toggleModalOne();
                            }}
                            style={{
                              height: "51px",
                              backgroundColor: "#39cccc",
                              color: "white",
                            }}
                            color="#39cccc">
                            Bulk Upload
                          </Button>
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
                                  color="#39cccc"
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
                            <div className="ag-theme-material w-100 my-2 ag-grid-table">
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
          // style={{ maxWidth: "1050px" }}
        >
          <ModalHeader toggle={this.toggleModalclose}>
            {this.state.ShowBill ? "Bulk upload" : "Bulk upload"}
          </ModalHeader>
          <ModalBody>
            <div className="p-5">
              <div className="d-flex justify-content-center mb-3">
                <h3>Bulk upload Team</h3>
              </div>
              <Row>
                <Col lg="12" md="12" sm="12">
                  <div className="d-flex justify-content-center">
                    <Input className="form-control" type="file" />
                  </div>
                </Col>

                <Col className="mt-2">
                  <div className="d-flex justify-content-center">
                    <Button color="primary">Upload</Button>
                  </div>
                </Col>
              </Row>
            </div>
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
                              <th scope="row">{i + 1}</th>
                              <td>{ele?.productId?.Product_Title}</td>
                              <td>{ele?.productId?.HSN_Code}</td>
                              <td>{ele?.productId?.Product_MRP}</td>
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
export default Uploadsalespersion;
