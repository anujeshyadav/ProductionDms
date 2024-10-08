import React, { useRef } from "react";
import { ImDownload } from "react-icons/im";

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
import { Eye, Trash2, ChevronDown } from "react-feather";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import "../../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../../../../assets/scss/pages/users.scss";

import {
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaDownload,
  FaFilter,
  FaPlus,
} from "react-icons/fa";
import swal from "sweetalert";
import {
  DeleteAccount,
  Stockupdate,
  ViewFactoryStock,
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
import { Icon } from "leaflet";
import StockTrxInvoice from "../../subcategory/InwardTrxInvoice";
import {
  Stock_trx_FtoW_List,
  Warehouse_ListBy_id,
} from "../../../../../ApiEndPoint/Api";

const SelectedColums = [];
let WarehouseIncharge = false;
let SuperAdmin = false;
class StockTransfer extends React.Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.gridRef = React.createRef();
    this.gridApi = null;
    this.state = {
      isOpen: false,
      ShowBill: false,
      Arrindex: "",
      rowData: [],
      setMySelectedarr: [],
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
          width: 55,
          filter: true,
        },
        {
          headerName: "Actions",
          field: "sortorder",
          field: "transactions",
          width: 80,
          cellRendererFramework: (params) => {
            return (
              <div className="actions cursor-pointer">
                <Eye
                  size="20px"
                  color="green"
                  onClick={(e) => {
                    this.togglemodal();
                    this.setState({
                      ViewOneData: params?.data,
                      ViewOneUserView: true,
                      EditOneUserView: false,
                    });
                  }}
                />
                {/* <Edit
                  className="mr-50"
                  size="25px"
                  color="blue"
                  onClick={e => {
                    this.togglemodal();
                    this.setState({ ViewOneData: params?.data });
                    this.setState({ EditOneUserView: true });
                    this.setState({ ViewOneUserView: false });

                    console.log(params?.data);
                  }}
                /> */}
                {/* <Trash2
                  className="mr-50"
                  size="25px"
                  color="red"
                  onClick={() => {
                    let selectedData = this.gridApi.getSelectedRows();
                    this.runthisfunction(params.data._id);
                    this.gridApi.updateRowData({ remove: selectedData });
                  }}
                /> */}
              </div>
            );
          },
        },
        {
          headerName: "Status",
          field: "transferStatus",
          filter: true,
          width: 100,
          cellRendererFramework: (params) => {
            return params.data?.transferStatus === "Completed" ? (
              <div className=" ">{params.data?.transferStatus}</div>
            ) : params.data?.transferStatus === "InProcess" ? (
              <div className=" ">{params.data?.transferStatus}</div>
            ) : params.data?.transferStatus === "Hold" ? (
              <div className=" ">{params.data?.transferStatus}</div>
            ) : params.data?.transferStatus === "Pending" ? (
              <div className=" ">{params.data?.transferStatus}</div>
            ) : null;
          },
        },
        {
          headerName: "Trx Date",
          field: "stockTransferDate",
          filter: true,
          width: 90,
          cellRendererFramework: (params) => {
            return (
              <div>
                <span>{params.data?.stockTransferDate}</span>
              </div>
            );
          },
        },
        {
          headerName: "Request Id",
          field: "warehouseNo",
          filter: true,
          width: 170,
          cellRendererFramework: (params) => {
            return (
              <div>
                <span>{params.data?.warehouseNo}</span>
              </div>
            );
          },
        },
        {
          headerName: "Total Product",
          field: "productItems",
          filter: true,

          cellRendererFramework: (params) => {
            return (
              <div>
                <span>{params.data?.productItems?.length} Products</span>
              </div>
            );
          },
        },
        {
          headerName: "Transferred From",
          field: "warehouseFromId.warehouseName",
          filter: true,
         
          cellRendererFramework: (params) => {
            console.log(params.data);
            return (
              <div>
                {<span>{params.data?.warehouseFromId?.warehouseName}</span>}
              </div>
            );
          },
        },
        {
          headerName: "Transferred To",
          field: "warehouseToId.warehouseName",
          filter: true,
           
          cellRendererFramework: (params) => {
            console.log(params.data);
            return (
              <div>
                {<span>{params.data?.warehouseToId?.warehouseName}</span>}
              </div>
            );
          },
        },

        {
          headerName: "Mobile no Transfer To",
          field: "warehouseToId.mobileNo",
          filter: true,
          width:180,
          sortable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer">
                  <span>{params?.data?.warehouseToId?.mobileNo}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "Created date",
          field: "createdAt",
          filter: true,
          width: 110,
          sortable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer">
                  <span>{params?.data?.createdAt?.split("T")[0]}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "updated At",
          field: "updatedAt",
          filter: true,
          width: 95,
          sortable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer">
                  <span>{params?.data?.updatedAt.split("T")[0]}</span>
                </div>
              </>
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
  // UpdateStock = (e) => {
  //   console.log(e.target.value);
  //   let payload = {
  //     status: e.target.value,
  //   };
  //   let id = this.state.ViewOneData?._id;

  //   console.log(this.state.ViewOneData?._id);
  //   swal("Warning", "Sure You Want to Update Status", {
  //     buttons: {
  //       cancel: "No",
  //       catch: { text: "Yes", value: "Sure" },
  //     },
  //   }).then((value) => {
  //     switch (value) {
  //       case "Sure":
  //         Stockupdate(id, payload)
  //           .then((res) => {
  //             console.log(res);
  //             swal("success", "Status Updated Successfully");
  //             this.togglemodal();
  //             this.ViewStockList();
  //           })
  //           .catch((err) => {
  //             console.log(err);
  //           });

  //         break;
  //       default:
  //     }
  //   });
  // };
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

  async componentDidMount() {
    const UserInformation = this.context?.UserInformatio;
    let pageparmission = JSON.parse(localStorage.getItem("userData"));
    let userid = pageparmission?._id;
    if (pageparmission?.rolename?.roleName === "WareHouse Incharge") {
      WarehouseIncharge = true;
    } else if (pageparmission?.rolename?.roleName === "SuperAdmin") {
      SuperAdmin = true;
    } else {
      WarehouseIncharge = false;
    }
    await this.ViewStockList(
      pageparmission?._id,
      pageparmission?.database,
      WarehouseIncharge,
      SuperAdmin
    );

    // Stock_trxFactorytoWList(userid)
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }

  ViewStockList = async (id, db, WarehouseIncharge, SuperAdmin) => {
    this.setState({ Loading: false });
    // let pageparmission = JSON.parse(localStorage.getItem("userData"));
    // let userid = pageparmission?._id;
    // await ViewFactoryStock(userid, pageparmission?.database)
    await _Get(Stock_trx_FtoW_List, db)
      .then(async (res) => {
        let TotalTransfered = res?.Warehouse?.reverse();
 
        if (WarehouseIncharge) {
          let Url = `${Warehouse_ListBy_id + id}/${db}`;
          await _GetList(Url)
            .then((response) => {
              let assignedWarehouse = response?.Warehouse.map((ele) => {
                return ele?._id;
              });

              const filteredData = TotalTransfered?.filter((item) =>
                assignedWarehouse.some(
                  (filterItem) =>
                    filterItem == item?.warehouseToId?._id ||
                    filterItem == item?.warehouseFromId?._id
                )
              );
              filteredData?.forEach((ele) => {
                let check = assignedWarehouse.some(
                  (filterItem) => filterItem == ele?.warehouseToId?._id
                );
                if (check) {
                  ele["ShowDropDown"] = true;
                } else {
                  ele["ShowDropDown"] = false;
                }
              });

              this.setState({
                rowData: filteredData,
                Loading: false,
              });
            })
            .catch((err) => {
              this.setState({
                rowData: [],
                Loading: false,
              });
              console.log(err);
            });
        } else if (SuperAdmin) {
          TotalTransfered?.forEach((ele) => {
            ele["ShowDropDown"] = true;
          });
          console.log(TotalTransfered);

          this.setState({
            rowData: TotalTransfered,
            Loading: false,
          });
        } else {
          this.setState({
            rowData: TotalTransfered,
            Loading: false,
            AllcolumnDefs: this.state.columnDefs,
          });
        }
        let userHeading = JSON.parse(localStorage.getItem("stockTransfer"));
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
        this.setState({ SelectedCols: this.state.columnDefs });
      })
      .catch((err) => {
        this.setState({
          rowData: [],
          Loading: false,
        });
        console.log(err);
      });
  };
  handleStockTrxInvoiceShow = (data) => {
    this.setState({
      ShowBill: true,
      ViewOneUserView: true,
      BillViewData: data,
    });

    // this.setState({ BillViewData: data });
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
      "stockTransfer",
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
            color="primary"></Spinner>
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
      AllcolumnDefs,
    } = this.state;
    return (
      <>
        <Card>
          <Row style={{ marginLeft: "3px", marginRight: "3px" }}>
            <Col>
              <h1
                className="float-left"
                style={{
                  fontWeight: "600",
                  textTransform: "uppercase",
                  fontSize: "18px",
                  marginTop: "25px",
                }}>
                Stock Trx Request list
              </h1>
            </Col>
            <Col style={{ marginTop: "25px" }} lg="3" xl="3">
              <div className="table-input ">
                <Input
                  placeholder="search Item here..."
                  onChange={(e) => this.updateSearchQuery(e.target.value)}
                  value={this.state.value}
                />
              </div>
            </Col>
            <Col style={{ marginTop: "25px" }} lg="1" xl="1">
              <span>
                <Route
                  render={({ history }) => (
                    <Button
                      style={{
                        cursor: "pointer",
                        // backgroundColor: "rgb(8, 91, 245)",
                        float: "right",
                        height: "35px",
                        color: "white",
                        fontWeight: "600",
                      }}
                      className="float-right categorysbutton45  "
                      onClick={() =>
                        history.push("/app/ajgroup/account/CreateStockTrx")
                      }>
                      <FaPlus size={13} /> Create
                    </Button>
                  )}
                />
              </span>
            </Col>
            <Col lg="1" style={{ marginTop: "25px" }}>
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
              <span
                className=" "
                onMouseEnter={this.toggleDropdown}
                onMouseLeave={this.toggleDropdown}>
                <div className="dropdown-container float-right">
                  <ImDownload
                    yle={{ cursor: "pointer" }}
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
            </Col>
          </Row>
          <>
            {this.state.rowData === null ? null : (
              <div className="ag-theme-material w-100  ag-grid-table card-body" style={{marginTop:"-1rem"}}>
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
        </Card>

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
          className={this.props.className}
          style={{ maxWidth: "1050px" }}>
          <ModalHeader toggle={this.togglemodal}>
            {this.state.ShowBill ? "Challan Download" : "All Products"}
          </ModalHeader>
          <ModalBody
            className={`${this.state.ShowBill ? "p-1" : "modalbodyhead"}`}>
            {this.state.ViewOneUserView ? (
              <>
                {this.state.ShowBill ? (
                  <>
                    <div className="d-flex justify-content-end">
                      <Button
                        color="danger"
                        onClick={(e) => {
                          e.preventDefault();
                          this.setState({
                            ShowBill: false,
                            ViewOneUserView: true,
                          });
                        }}>
                        X
                      </Button>
                    </div>
                    <StockTrxInvoice ViewOneData={this.state.BillViewData} />
                  </>
                ) : (
                  <>
                    <Row>
                      <Col>
                        <Row>
                          <Col className="mt-1" lg="12" md="12" sm="12">
                            <Label>From :</Label>
                            <h5>
                              {this.state.ViewOneData?.warehouseFromId
                                ?.warehouseName &&
                                this.state.ViewOneData?.warehouseFromId?.warehouseName?.toUpperCase()}
                            </h5>
                          </Col>
                          <Col className="mt-1" lg="12" md="12" sm="12">
                            <Label>To :</Label>

                            <h5>
                              {this.state.ViewOneData?.warehouseToId
                                ?.warehouseName &&
                                this.state.ViewOneData?.warehouseToId?.warehouseName?.toUpperCase()}
                            </h5>
                          </Col>
                          <Col className="mt-1" lg="12" md="12" sm="12">
                            <Label>Current Status :</Label>
                            <div>
                              <Badge color="warning">
                                {this.state.ViewOneData?.transferStatus?.toUpperCase()}
                              </Badge>
                            </div>
                          </Col>
                        </Row>
                      </Col>

                      <Col>
                        <Row>
                          {this.state.ViewOneData?.ShowDropDown && (
                            <>
                              {this.state.ViewOneData?.transferStatus !==
                                "Completed" && (
                                <Col className="mt-1" lg="12" md="12" sm="12">
                                  <Label>Update Status :</Label>
                                  <CustomInput
                                    onChange={(e) =>
                                      this.UpdateStock(
                                        this.state.ViewOneData,
                                        e
                                      )
                                    }
                                    type="select">
                                    <option value="NA">--Select--</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Hold">Hold</option>
                                  </CustomInput>
                                </Col>
                              )}
                              <Col className="mt-1" lg="12" md="12" sm="12">
                                <Label>Download Challan :</Label>
                                <div className="d-flex justify-content-center">
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
                                </div>
                              </Col>
                            </>
                          )}

                          <Col className="mt-1" lg="12" md="12" sm="12">
                            <Label>Date :</Label>
                            <div>
                              {this.state.ViewOneData?.stockTransferDate}
                            </div>
                          </Col>
                        </Row>
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
                              {/* <th>Price</th> */}
                              <th>Primary Unit</th>
                              {/* <th>Secondry Unit</th> */}
                              <th>Quantity</th>
                              {/* <th>Total</th> */}
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.ViewOneData?.productItems &&
                              this.state.ViewOneData?.productItems?.map(
                                (ele, i) => (
                                  <>
                                    <tr>
                                      <th scope="row">{i + 1}</th>
                                      <td>{ele?.productId?.Product_Title}</td>
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
                    </Row>
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
