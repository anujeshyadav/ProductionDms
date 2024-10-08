import React from "react";
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
  Label,
  Table,
  CustomInput,
  Spinner,
} from "reactstrap";

import { ContextLayout } from "../../../../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Logo from "../../../../../assets/img/profile/pages/logomain.png";
import Papa from "papaparse";
import { Eye, ChevronDown, Edit } from "react-feather";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import "../../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../../../../assets/scss/pages/users.scss";

import {
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaDownload,
  FaFilter,
  FaInbox,
} from "react-icons/fa";
import swal from "sweetalert";
import {
  DeleteAccount,
  PurchaseOrderList,
  Stockupdate,
  _Get,
  _GetList,
} from "../../../../../ApiEndPoint/ApiCalling";
import {
  BsFillArrowDownSquareFill,
  BsFillArrowUpSquareFill,
} from "react-icons/bs";
import * as XLSX from "xlsx";
import UserContext from "../../../../../context/Context";
import UpdateStockTrx from "../../accounts/UpdateStockTrx";
import StockTrxInvoice from "../../subcategory/InwardTrxInvoice";
import { CheckPermission } from "../../house/CheckPermission";
import SuperAdminUI from "../../../../SuperAdminUi/SuperAdminUI";

import {
  Create_Warehouse_List,
  Stock_trx_FtoW_List,
  Warehouse_Inward_list,
  Warehouse_ListBy_id,
} from "../../../../../ApiEndPoint/Api";
let WarehouseIncharge = false;
const SelectedColums = [];

class StockTransfer extends React.Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.gridRef = React.createRef();
    this.gridApi = null;
    this.state = {
      isOpen: false,
      ShowBill: false,
      InventorysShow: false,
      MasterShow: false,
      wareHouseViewOne: [],
      Arrindex: "",
      InsiderPermissions: {},
      rowData: [],
      setMySelectedarr: [],
      ViewOneData: {},
      BillViewData: {},
      SelectedCols: [],
      paginationPageSize: 15,
      currenPageSize: "",
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
        //   headerName: "Actions",
        //   field: "sortorder",
        //   field: "transactions",
        //   width: 100,
        //   cellRendererFramework: (params) => {
        //     return (
        //       <div className="actions cursor-pointer">
        //         <Eye
        //           size="25px"
        //           color="green"
        //           onClick={(e) => {
        //             // this.togglemodal();
        //             this.togglemodal();
        //             this.setState({
        //               ViewOneData: params?.data,
        //               ViewOneUserView: true,
        //               EditOneUserView: false,
        //             });
        //           }}
        //         />
        //         {/* <Edit
        //           className="mr-50"
        //           size="25px"
        //           color="blue"
        //           onClick={e => {
        //             this.togglemodal();
        //             this.setState({ ViewOneData: params?.data });
        //             this.setState({ EditOneUserView: true });
        //             this.setState({ ViewOneUserView: false });

        //             console.log(params?.data);
        //           }}
        //         /> */}
        //         {/* <Trash2
        //           className="mr-50"
        //           size="25px"
        //           color="red"
        //           onClick={() => {
        //             let selectedData = this.gridApi.getSelectedRows();
        //             this.runthisfunction(params.data._id);
        //             this.gridApi.updateRowData({ remove: selectedData });
        //           }}
        //         /> */}
        //       </div>
        //     );
        //   },
        // },
        // {
        //   headerName: "Status",
        //   field: "transferStatus",
        //   filter: true,
        //   width: 140,
        //   cellRendererFramework: (params) => {
        //     return params.data?.transferStatus === "Completed" ? (
        //       <div className=" ">{params.data?.transferStatus}</div>
        //     ) : params.data?.transferStatus === "InProcess" ? (
        //       <div className=" ">{params.data?.transferStatus}</div>
        //     ) : params.data?.transferStatus === "Hold" ? (
        //       <div className=" ">{params.data?.transferStatus}</div>
        //     ) : params.data?.transferStatus === "Pending" ? (
        //       <div className=" ">{params.data?.transferStatus}</div>
        //     ) : null;
        //   },
        // },
        {
          headerName: "Party Name",
          field: "PartyName",
          filter: true,
          width: 190,
          cellRendererFramework: (params) => {
            return (
              <div>
                <span>{params.data?.PartyName}</span>
              </div>
            );
          },
        },
        {
          headerName: "Product Name",
          field: "productId.Product_Title",
          filter: true,
          width: 180,
          cellRendererFramework: (params) => {
            return (
              <div>
                <span>{params.data?.productId?.Product_Title}</span>
              </div>
            );
          },
        },
        {
          headerName: "HSN",
          field: "productId.HSN_Code",
          filter: true,
          width: 100,
          cellRendererFramework: (params) => {
            return (
              <div>
                <span>{params.data?.productId?.HSN_Code}</span>
              </div>
            );
          },
        },
        {
          headerName: "Quantity",
          field: "qty",
          filter: true,
          width: 100,
          cellRendererFramework: (params) => {
            return (
              <div>
                <span>{params.data?.qty}</span>
              </div>
            );
          },
        },
        {
          headerName: "Purchase Rate",
          field: "Purchase_Rate",
          filter: true,
          width: 125,
          cellRendererFramework: (params) => {
            return (
              <div>
                <span>
                  {params.data?.Purchase_Rate && params.data?.Purchase_Rate}
                </span>
              </div>
            );
          },
        },
        {
          headerName: "Tax Rate",
          field: "productId.GSTRate",
          filter: true,
          width: 90,
          cellRendererFramework: (params) => {
            return (
              <div>
                <span>
                  {params.data?.productId?.GSTRate &&
                    params.data?.productId?.GSTRate}
                </span>
              </div>
            );
          },
        },
        // {
        //   headerName: "Tax Amount",
        //   field: "TotalTax",
        //   filter: true,
        //   width: 140,
        //   cellRendererFramework: (params) => {
        //     return (
        //       <div>
        //         <span>{params?.data?.TotalTax && params?.data?.TotalTax}</span>
        //       </div>
        //     );
        //   },
        // },
        {
          headerName: "Total",
          field: "Total",
          filter: true,
          width: 100,
          cellRendererFramework: (params) => {
            return (
              <div>
                <span>
                  {params.data?.Total && params.data?.Total?.toFixed(2)}
                </span>
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
  UpdateStock = (data, e) => {
    let payload = {
      transferStatus: e.target.value,
    };
    let id = data?._id;

    swal("Warning", "Sure You Want to Update Status", {
      buttons: {
        cancel: "No",
        catch: { text: "Yes", value: "Sure" },
      },
    }).then((value) => {
      switch (value) {
        case "Sure":
          this.setState({ Loading: true });
          Stockupdate(id, payload)
            .then((res) => {
              this.setState({ Loading: false });
              console.log(res);
              swal("success", "Status Updated Successfully");
              this.togglemodal();
              this.componentDidMount();
            })
            .catch((err) => {
              this.setState({ Loading: false });
              console.log(err);
            });

          break;
        default:
      }
    });
  };
  LookupviewStart = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };
  togglemodal = () => {
    this.setState((prevState) => ({
      modalone: !prevState.modalone,
    }));
    this.setState({ ShowBill: false });
  };
  handleStockTrxInvoiceShow = (data) => {
    this.setState({
      ShowBill: true,
      ViewOneUserView: true,
      BillViewData: data,
    });

    // this.setState({ BillViewData: data });
  };

  async Apicalling(id, db, WarehouseIncharge) {
    this.setState({ Loading: true });
    let AllData = [];
    await PurchaseOrderList(id, db)
      .then((res) => {
        let Completed = res?.orderHistory?.filter(
          (ele) => ele?.status == "completed"
        );
        let Alldata = Completed?.flatMap((element, index) => {
          return element?.orderItems?.map((val, i) => {
            return {
              ...val,
              order: element,
              PartyName: element?.partyId?.CompanyName,
              qty: val?.qty,
              Purchase_Rate: val?.productId?.Purchase_Rate,
              Total: val?.qty * val?.productId?.Purchase_Rate,
              // TotalTax: val?.igstTaxType
              //   ? val?.igstRate.toFixed(2)
              //   : (val?.cgstRate + val?.sgstRate).toFixed(2),
            };
          });
        });
        AllData = [...Alldata];
      })
      .catch((err) => {
        // AllData = [];

        console.log(err);
      });
    let userHeading = JSON.parse(localStorage.getItem("InwardStock"));
    this.setState({
      AllcolumnDefs: this.state.columnDefs,
      SelectedCols: this.state.columnDefs,
    });

    if (userHeading?.length) {
      this.setState({
        columnDefs: userHeading,
        SelectedcolumnDefs: userHeading,
      });
    } else {
      this.setState({
        columnDefs: this.state.columnDefs,
        SelectedcolumnDefs: this.state.columnDefs,
      });
    }
    await _Get(Stock_trx_FtoW_List, db)
      .then(async (res) => {
        // let TotalTransfered = res?.Warehouse;
        let TotalTransfered = res?.Warehouse?.filter(
          (ele) => ele?.transferStatus == "Completed"
        );
        debugger
        if (WarehouseIncharge) {
          let Url = `${Warehouse_ListBy_id + id}/${db}`;
          await _GetList(Url)
            .then((response) => {
              let assignedWarehouse = response?.Warehouse.map((ele) => {
                return ele?._id;
              });

              const filteredData = TotalTransfered.filter((item) =>
                assignedWarehouse.some(
                  (filterItem) => filterItem == item?.warehouseToId?._id
                  // filterItem == item?.warehouseToId?._id ||
                  // filterItem == item?.warehouseFromId?._id
                )
              );
              let Alldata = filteredData?.flatMap((element, index) => {
                return element?.productItems?.map((val, i) => {
                  return {
                    ...val,
                    order: element,
                    qty: val?.transferQty,
                    PartyName: element?.warehouseFromId?.warehouseName,
                    Purchase_Rate: val?.productId?.Purchase_Rate,
                    Total: val?.transferQty * val?.productId?.Purchase_Rate,
                    // TotalTax:
                    //   (val?.price *
                    //   val?.transferQty *
                    //   val?.productId?.GSTRate*0.01).toFixed(2),
                  };
                });
              });
              AllData = [...AllData, ...Alldata];
              this.setState({
                rowData: AllData,
                Loading: false,
              });
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
               let Alldata = TotalTransfered?.flatMap((element, index) => {
                 return element?.productItems?.map((val, i) => {
                   return {
                     ...val,
                     order: element,
                     qty: val?.transferQty,
                     PartyName: element?.warehouseFromId?.warehouseName,
                     Purchase_Rate: val?.productId?.Purchase_Rate,
                     Total: val?.transferQty * val?.productId?.Purchase_Rate,
                     //  TotalTax: (
                     //    val?.price *
                     //    val?.transferQty *
                     //    val?.productId?.GSTRate *
                     //    0.01
                     //  ).toFixed(2),
                   };
                 });
               });
          AllData = [...AllData, ...Alldata];
          this.setState({
            rowData: AllData,
            Loading: false,
          });
        }
      })
      .catch((err) => {
        this.setState({ Loading: false });
        console.log(err);
      });
    // if (WarehouseIncharge) {
    //   let Url = `${Warehouse_ListBy_id + id}/${db}`;
    //   await _GetList(Url)
    //     .then((res) => {
    //       this.setState({ Loading: false });
    //       let value = res?.Warehouse;
    //       if (value?.length) {
    //         this.setState({ rowData: value });
    //       }
    //     })
    //     .catch((err) => {
    //       this.setState({ Loading: false });
    //       this.setState({ rowData: [] });
    //       console.log(err);
    //     });
    // } else {
    //   await _Get(Create_Warehouse_List, db)
    //     .then((res) => {
    //       this.setState({ Loading: false });
    //       let value = res?.Warehouse;
    //       if (value?.length) {
    //         this.setState({ rowData: value });
    //       }
    //     })
    //     .catch((err) => {
    //       this.setState({ Loading: false });
    //       this.setState({ rowData: [] });
    //       console.log(err);
    //     });
    // }
  }
  async componentDidMount() {
    const UserInformation = this.context?.UserInformatio;
    const InsidePermissions = CheckPermission("Inward Stock");
    this.setState({ InsiderPermissions: InsidePermissions });
    let pageparmission = JSON.parse(localStorage.getItem("userData"));
    if (pageparmission?.rolename?.roleName === "MASTER") {
      this.setState({ MasterShow: true });
    }

    if (pageparmission?.rolename?.roleName === "WareHouse Incharge") {
      WarehouseIncharge = true;
    } else {
      WarehouseIncharge = false;
    }

    await this.Apicalling(
      pageparmission?._id,
      pageparmission?.database,
      WarehouseIncharge
    );
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
    doc.text("InwardStockList", 14, 51);
    doc.autoTable({
      head: [Object.keys(parsedData[0])],
      body: tableData,
      startY: 60,
    });

    doc.save("inwardStockList.pdf");
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
    a.download = "inwardStockList.xlsx";
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
        XLSX.writeFile(wb, `inwardStockList.${excelType}`);
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
      "InwardStock",
      JSON.stringify(this.state.SelectedcolumnDefs)
    );
    this.LookupviewStart();
  };
  handleShowWarehouse = (e) => {
    e.preventDefault();
    if (this.state.warehouse != "NA") {
      console.log(this.state.wareHouseViewOne);
      let selecteddata = this.state.wareHouseViewOne?.filter(
        (ele, i) => ele?._id == this.state.warehouse
      );
      this.setState({ Show: true });
      this.setState({ rowData: selecteddata });
    } else {
      swal("You did not select Any Warehouse");
    }
  };
  changeHandler = (e) => {

    this.setState({ [e.target.name]: e.target.value });
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
    this.Apicalling(id, db, WarehouseIncharge);
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
    } = this.state;
    return (
      <>
        <Row className="app-user-list">
          <Col sm="12">
            <Card>
              <Row style={{marginLeft:'3px',marginRight:'3px'}}>
                <Col  >
                  <h2
                    className="float-left "
                    style={{ fontWeight: "600" ,textTransform:'uppercase', fontSize:'18px',marginTop:'25px' }}>
                    Inward Stock
                  </h2>
                </Col>

                {this.state.MasterShow ? (
                  <Col xl="3" lg="3" xs="12" style={{marginTop:'25px'}}>
                    <SuperAdminUI
                      onDropdownChange={this.handleDropdownChange}
                      onSubmit={this.handleParentSubmit}
                    />
                  </Col>
                ): <Col></Col>}
                <Col xl="3" lg="3" xs="8" style={{marginTop:'25px'}}>
                  <div className="table-input ">
                    <Input
                      placeholder="search Item here..."
                      onChange={(e) => this.updateSearchQuery(e.target.value)}
                      value={this.state.value}
                    />
                  </div>
                </Col>

                <Col xl="1" lg="1" xs="4" style={{marginTop:'25px'}}>
                  {this.state.InsiderPermissions &&
                    this.state.InsiderPermissions?.View && (
                      <>
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
                      </>
                    )}
                  {this.state.InsiderPermissions &&
                    this.state.InsiderPermissions?.Download && (
                      <span
                        className=" "
                        onMouseEnter={this.toggleDropdown}
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
                                onClick={() => this.gridApi.exportDataAsCsv()}
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
                  <CardBody style={{ marginTop: "-3rem" }}>
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
                  </CardBody>
                )}
            </Card>
          </Col>
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

        <Modal
          isOpen={this.state.modalone}
          toggle={this.togglemodal}
          backdrop={false}
          size="lg"
          fullscreen={true}
          className={this.props.className}
          style={{ maxWidth: "1200px" }}>
          <ModalHeader toggle={this.togglemodal}>
            {this.state.ShowBill ? "Challan Download" : "All Products"}
          </ModalHeader>
          <ModalBody>
            {this.state.ViewOneUserView ? (
              <>
                {this.state.ShowBill ? (
                  <>
                    <StockTrxInvoice ViewOneData={this.state.BillViewData} />
                  </>
                ) : (
                  <>
                    <div className="pt-2 pb-2 p-1">
                      <Row>
                        <Col className="mt-1" lg="2" md="2" sm="12">
                          <Label>Transferred From :</Label>

                          <h5>
                            {this.state.ViewOneData?.warehouseFromId
                              .warehouseName &&
                              this.state.ViewOneData?.warehouseFromId
                                .warehouseName}
                          </h5>
                        </Col>
                        <Col className="mt-1" lg="2" md="2" sm="12">
                          <Label>Transferred To :</Label>

                          <h5>
                            {this.state.ViewOneData?.warehouseToId
                              ?.warehouseName &&
                              this.state.ViewOneData?.warehouseToId
                                ?.warehouseName}
                          </h5>
                        </Col>
                        <Col className="mt-1" lg="2" md="2" sm="12">
                          <Label>Current Status :</Label>
                          <Badge color="warning">
                            {this.state.ViewOneData?.transferStatus}
                          </Badge>
                        </Col>
                        <Col className="mt-1" lg="2" md="2" sm="12">
                          <Label>Date :</Label>

                          {this.state.ViewOneData?.stockTransferDate}
                        </Col>
                        <Col className="mt-1" lg="2" md="2" sm="12">
                          <FaDownload
                            title="Download Challan"
                            onClick={() =>
                              this.handleStockTrxInvoiceShow(
                                this.state.ViewOneData
                              )
                            }
                            color="blue"
                            style={{ cursor: "pointer" }}
                            size={30}
                          />
                        </Col>
                        <Col className="mt-1" lg="2" md="2" sm="12">
                          <CustomInput
                            onChange={(e) =>
                              this.UpdateStock(this.state.ViewOneData, e)
                            }
                            type="select">
                            <option value="NA">--Select--</option>
                            <option value="Completed">Completed</option>
                            <option value="Pending">Pending</option>
                            <option value="Hold">Hold</option>
                          </CustomInput>
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
                        {this.state.ViewOneData?.productItems?.length > 0 && (
                          <Col>
                            <Table style={{ cursor: "pointer" }} responsive>
                              <thead>
                                <tr>
                                  <th>#</th>
                                  <th>Product Name</th>
                                  {/* <th>Price</th> */}
                                  <th>Primary Unit</th>
                                  {/* <th>Secondry Unit</th> */}
                                  <th>Quantity</th>
                                  {/* <th>Total</th> */}
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.ViewOneData?.productItems?.length >
                                  0 &&
                                  this.state.ViewOneData?.productItems?.map(
                                    (ele, i) => (
                                      <>
                                        <tr>
                                          <th scope="row">{i + 1}</th>
                                          <td>
                                            {ele?.productId?.Product_Title}
                                          </td>
                                          {/* <td>{ele?.price}</td> */}
                                          <td>{ele?.primaryUnit}</td>
                                          {/* <td>{ele?.secondarySize}</td> */}
                                          <td>{ele?.transferQty}</td>
                                          {/* <td>{ele?.totalPrice}</td> */}
                                        </tr>
                                      </>
                                    )
                                  )}
                              </tbody>
                            </Table>
                          </Col>
                        )}
                      </Row>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <UpdateStockTrx ViewOne={this.state.ViewOneData} />
              </>
            )}
          </ModalBody>
        </Modal>
      </>
    );
  }
}
export default StockTransfer;
