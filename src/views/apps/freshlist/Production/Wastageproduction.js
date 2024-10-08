import React, { useRef } from "react";
import { Route } from "react-router-dom";
import { ImDownload } from "react-icons/im";
import {
  Label,
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
  CustomInput,
} from "reactstrap";
import { ContextLayout } from "../../../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
// import ViewOrder from "../order/ViewAll";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Logo from "../../../../assets/img/profile/pages/logomain.png";
import Papa from "papaparse";
import { Eye, Trash2, ChevronDown, Edit, CornerDownLeft } from "react-feather";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import "../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../../../assets/scss/pages/users.scss";
// import StockTrxInvoice from "../../subcategory/StockTrxInvoice";
import StockTrxInvoice from "../subcategory/StockTrxInvoice";
import {
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaDownload,
  FaFilter,
  FaPlus,
} from "react-icons/fa";
import swal from "sweetalert";
import {
  _Get,
  CreateProductList,
  Deleteproductlist,
} from "../../../../ApiEndPoint/ApiCalling";
import {
  BsFillArrowDownSquareFill,
  BsFillArrowUpSquareFill,
} from "react-icons/bs";
import * as XLSX from "xlsx";
import UserContext from "../../../../context/Context";
import { CheckPermission } from "../house/CheckPermission";
import { Get_Producton_ProcessList } from "../../../../ApiEndPoint/Api";

const SelectedColums = [];

class Wastageproduction extends React.Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.gridRef = React.createRef();
    this.gridApi = null;
    this.state = {
      isOpen: false,
      Arrindex: "",
      rowData: [],
      ShowBill: false,
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
        {
          headerName: "UID",
          valueGetter: "node.rowIndex + 1",
          field: "node.rowIndex + 1",
          width: 80,
          filter: true,
        },

        {
          headerName: "Actions",
          field: "transactions",
          width: 150,
          cellRendererFramework: (params) => {
            return (
              <div className="actions cursor-pointer">
                {this.state.InsiderPermissions &&
                  this.state.InsiderPermissions?.Edit && (
                    <Eye
                      className="mr-50"
                      size="25px"
                      color="green"
                      onClick={() => {
                        this.togglemodal();
                        this.handleChangeView(params.data, "readonly");
                      }}
                    />
                  )}
                {this.state.InsiderPermissions &&
                  this.state.InsiderPermissions?.View && (
                    <Edit
                      className="mr-50"
                      size="25px"
                      color="blue"
                      onClick={() =>
                        this.props.history.push({
                          pathname: `/app/freshlist/order/EditProductionProcess/${params.data?._id}`,
                          state: params.data,
                        })
                      }
                    />
                  )}
                {/* {this.state.InsiderPermissions &&
                  this.state.InsiderPermissions?.Edit && (
                    <Trash2
                      className=""
                      size="20px"
                      color="red"
                      onClick={() => {
                        this.runthisfunction(params);
                      }}
                    />
                  )} */}
              </div>
            );
          },
        },
        // {
        //   headerName: "Status",
        //   field: "status",
        //   filter: true,
        //   width: 150,
        //   cellRendererFramework: (params) => {
        //     return params.value == "Completed" ? (
        //       <div className="badge badge-pill badge-success">
        //         {params.data.status}
        //       </div>
        //     ) : params.value == "InProcess" ? (
        //       <div className="badge badge-pill badge-warning">
        //         {params.data.status}
        //       </div>
        //     ) : params.value == "pending" ? (
        //       <div className="badge badge-pill badge-info">Pending</div>
        //     ) : params.value == "Cancelled" ? (
        //       <div className="badge badge-pill badge-danger">
        //         {params.data.status}
        //       </div>
        //     ) : null;
        //   },
        // },
        {
          headerName: "Product Name",
          field: "product_name.Product_Title",
          filter: true,
           
          cellRendererFramework: (params) => {
            return (
              <div>
                <span>
                  {params.data?.product_name?.Product_Title &&
                    params.data?.product_name?.Product_Title}
                </span>
              </div>
            );
          },
        },
        {
          headerName: "Product Req",
          field: "productItems.length",
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
          headerName: "Product Total",
          field: "grandTotal",
          filter: true,
          width: 140,
          cellRendererFramework: (params) => {
            return (
              <div>
                <span>{params.data?.grandTotal}</span>
              </div>
            );
          },
        },
        {
          headerName: "GST",
          field: "gstApplied",
          filter: true,
          width: 140,
          cellRendererFramework: (params) => {
            return (
              <div>
                <span>{params.data?.gstApplied}</span>
              </div>
            );
          },
        },
        {
          headerName: "Miscellaneous Expennses",
          field: "miscellaneousExpennses",
          filter: true,
           width: 250,
          cellRendererFramework: (params) => {
            return (
              <div>
                <span>{params.data?.miscellaneousExpennses}</span>
              </div>
            );
          },
        },
        {
          headerName: "Other Charges",
          field: "otherCharges",
          filter: true,
          width: 150,
          cellRendererFramework: (params) => {
            return (
              <div>
                <span>{params.data?.otherCharges}</span>
              </div>
            );
          },
        },
        {
          headerName: "Discount",
          field: "discount",
          filter: true,
          width: 140,
          cellRendererFramework: (params) => {
            return (
              <div>
                <span>{params.data?.discount}</span>
              </div>
            );
          },
        },
        {
          headerName: "grand Total",
          field: "grandTotal",
          filter: true,
          width: 140,
          cellRendererFramework: (params) => {
            return (
              <div>
                <span>{params.data?.grandTotal}</span>
              </div>
            );
          },
        },

        // {
        //   headerName: "Min Stock Alert",
        //   field: "MinStockAlert",
        //   filter: true,
        //   width: 180,
        //   valueGetter: (params) => {
        //     if (params.data.orderItems && params.data.orderItems.length > 0) {
        //       return params.data.fullName;
        //     }
        //     return null;
        //   },
        // },

        // {
        //   headerName: "Product Name",
        //   field: "orderItems",
        //   filter: true,
        //   width: 220,
        //   valueGetter: (params) => {
        //     if (params.data.orderItems && params.data.orderItems.length > 0) {
        //       return params?.data?.orderItems?.map((val) => {
        //         return val?.product?.Product_Title;
        //       });
        //     }
        //     return null;
        //   },
        // },
        // {
        //   headerName: "Price",
        //   field: "orderItems",
        //   filter: true,
        //   width: 150,
        //   valueGetter: (params) => {
        //     if (params.data.orderItems && params.data.orderItems.length > 0) {
        //       return params.data.orderItems[0].price;
        //     }
        //     return null;
        //   },
        // },
        // {
        //   headerName: "Size",
        //   field: "orderItems",
        //   filter: true,
        //   width: 150,
        //   valueGetter: (params) => {
        //     if (params.data.orderItems && params.data.orderItems.length > 0) {
        //       return params.data.orderItems[0].qty; // Return the price
        //     }
        //     return null;
        //   },
        // },
        // {
        //   headerName: "GST Rate",
        //   field: "orderItems",
        //   filter: true,
        //   width: 180,
        //   valueGetter: (params) => {
        //     if (params.data.orderItems && params.data.orderItems.length > 0) {
        //       return params.data.orderItems[0].product["GSTRate"]; // Return the price
        //     }
        //     return null; // Or handle cases where there's no price
        //   },
        // },
        // {
        //   headerName: "HSN Code",
        //   field: "orderItems",
        //   filter: true,
        //   width: 180,
        //   valueGetter: (params) => {
        //     if (params.data.orderItems && params.data.orderItems.length > 0) {
        //       return params.data.orderItems[0].product.HSN_Code; // Return the price
        //     }
        //     return null;
        //   },
        // },
      ],
    };
  }
  toggleModal = () => {
    this.setState((prevState) => ({
      modalone: !prevState.modalone,
    }));
  };
  LookupviewStart = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };

  handleChangeView = (data, types) => {
    let type = types;
    if (type == "readonly") {
      this.setState({ ViewOneUserView: true });
      this.setState({ ViewOneData: data });
      let amt = 0;
      if (data?.wastageItems?.length > 0) {
        const x = data?.wastageItems?.map((val) => {
          return val?.price * val?.qty;
        });
        amt = x.reduce((a, b) => a + b);
      }
      this.setState({ Gst: amt });
    } else {
      this.setState({ EditOneUserView: true });
      this.setState({ EditOneData: data });
    }
  };

  async componentDidMount() {
    const userId = JSON.parse(localStorage.getItem("userData"));
    const UserInformation = this.context?.UserInformatio;
    const InsidePermissions = CheckPermission("Wastage Material");

    this.setState({ InsiderPermissions: InsidePermissions });
    let url = `${Get_Producton_ProcessList}/${userId?._id}/`;

    await _Get(url, userId?.database)
      .then((res) => {
        if (res?.Production) {
          this.setState({ rowData: res?.Production });
          this.setState({ AllcolumnDefs: this.state.columnDefs });
          this.setState({ SelectedCols: this.state.columnDefs });

          let userHeading = JSON.parse(
            localStorage.getItem("ProductionProcessList")
          );
          if (userHeading?.length) {
            this.setState({ columnDefs: userHeading });
            // this.gridApi.setColumnDefs(userHeading);
            this.setState({ SelectedcolumnDefs: userHeading });
          } else {
            this.setState({ columnDefs: this.state.columnDefs });
            this.setState({ SelectedcolumnDefs: this.state.columnDefs });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
    // Get_Producton_ProcessList
    await CreateProductList()
      .then((res) => {
        console.log(res.Data);
        // this.setState({ rowData: res?.Data });
        // this.setState({ AllcolumnDefs: this.state.columnDefs });
        // this.setState({ SelectedCols: this.state.columnDefs });

        // let userHeading = JSON.parse(localStorage.getItem("ProductionProcessList"));
        // if (userHeading?.length) {
        //   this.setState({ columnDefs: userHeading });
        //   // this.gridApi.setColumnDefs(userHeading);
        //   this.setState({ SelectedcolumnDefs: userHeading });
        // } else {
        //   this.setState({ columnDefs: this.state.columnDefs });
        //   this.setState({ SelectedcolumnDefs: this.state.columnDefs });
        // }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  togglemodal = () => {
    this.setState((prevState) => ({
      modalone: !prevState.modalone,
    }));
    this.setState({ ShowBill: false });
  };
  handleStockTrxInvoiceShow = () => {
    this.setState({ ShowBill: true });
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
          Deleteproductlist(id)
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
      "ProductionProcessList",
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
  render() {
    const {
      rowData,
      columnDefs,
      defaultColDef,
      SelectedcolumnDefs,
      isOpen,
      InsiderPermissions,
      SelectedCols,
      AllcolumnDefs,
    } = this.state;
    return (
      <>
        
            <Card>
              <Row style={{marginLeft:'3px',marginRight:'3px'}}>
                <Col>
                  <h1 className="float-left" style={{ fontWeight: "600" ,textTransform:'uppercase', fontSize:'22px' ,marginTop:"25px"}}>
                    
                    Wastage Material with Product List
                  </h1>
                </Col>
                <Col lg="2" style={{marginTop:"25px"}}>
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
                    {/* <span>
                      <Route
                        render={({ history }) => (
                          <Button
                            style={{ cursor: "pointer" }}
                            className="float-right mr-1"
                            color="primary"
                            onClick={() =>
                              history.push(
                                "/views/apps/freshlist/Production/productionprocesspage"
                              )
                            }>
                            <FaPlus size={15} /> Production
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
                        <Label>Product Name:</Label>
                        <h5 className="">
                          {this.state.ViewOneData &&
                            this.state.ViewOneData?.product_name?.Product_Title}
                        </h5>
                      </Col>
                      {/* <Col>
                        <Label>Stock trx date :</Label>
                        <h5>
                          {this.state.ViewOneData &&
                            this.state.ViewOneData?.stockTransferDate}
                        </h5>
                      </Col> */}
                      <Col>
                        <Label>Grand Total :</Label>
                        <h5>
                          <strong>
                            {this.state.ViewOneData &&
                              this.state.Gst &&
                              this.state.Gst}
                          </strong>
                          Rs/-
                        </h5>
                      </Col>
                      {/* <Col>
                        <Label>
                          GST{" "}
                          {this.state.ViewOneData &&
                            this.state.ViewOneData?.gstApplied}
                          % :
                        </Label>
                        <div className="d-flex justify-content-center">
                          <h5>
                            <strong>
                              {this.state.Gst &&
                                (Number(this.state.Gst) *
                                  Number(this.state.ViewOneData?.gstApplied)) /
                                  100}
                            </strong>
                          </h5>
                        </div>
                      </Col> */}
                      {/* <Col>
                        <Label>Miscellaneous Expenses :</Label>
                        <h5>
                          <strong>
                            {this.state.ViewOneData &&
                              this.state.ViewOneData?.miscellaneousExpennses}
                          </strong>
                          Rs/-
                        </h5>
                      </Col> */}
                      {/* <Col>
                        <Label>Other Charges :</Label>
                        <h5>
                          <strong>
                            {this.state.ViewOneData &&
                              this.state.ViewOneData?.otherCharges}
                          </strong>
                          Rs/-
                        </h5>
                      </Col> */}
                      {/* <Col>
                        <Label>Discount :</Label>
                        <h5>
                          <strong>
                            {this.state.ViewOneData &&
                              this.state.ViewOneData?.discount}
                          </strong>
                          Rs/-
                        </h5>
                      </Col> */}

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
                          <h4>Wastage Material List</h4>
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
                              <th>Unit</th>
                              {/* <th>HSN CODE</th> */}
                              {/* <th>GST</th> */}
                              <th>Quantity</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.ViewOneData?.wastageItems?.length > 0 &&
                              this.state.ViewOneData?.wastageItems?.map(
                                (ele, i) => {
                                  return (
                                    <>
                                      <tr>
                                        <th scope="row">{i + 1}</th>
                                        <td>{ele?.productId?.Product_Title}</td>
                                        <td>{ele?.price}</td>
                                        <td>{ele?.unitType}</td>
                                        <td>{ele?.qty}</td>
                                        <td>{ele?.price * ele?.qty}</td>
                                      </tr>
                                    </>
                                  );
                                }
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
      </>
    );
  }
}
export default Wastageproduction;
