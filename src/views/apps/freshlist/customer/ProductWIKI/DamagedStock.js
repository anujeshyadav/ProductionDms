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
  Form,
} from "reactstrap";

import { ContextLayout } from "../../../../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";

import jsPDF from "jspdf";
import "jspdf-autotable";
import Logo from "../../../../../assets/img/profile/pages/logomain.png";
import Papa from "papaparse";
import { ChevronDown } from "react-feather";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import "../../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../../../../assets/scss/pages/users.scss";

import {
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaFilter,
} from "react-icons/fa";
import swal from "sweetalert";
import {
  Delete_Damagedstock,
  Get_Damagedstock,
  Stockupdate,
  Update_Damagedstock,
  _Get,
} from "../../../../../ApiEndPoint/ApiCalling";
import {
  BsFillArrowDownSquareFill,
  BsFillArrowUpSquareFill,
} from "react-icons/bs";
import * as XLSX from "xlsx";
import UserContext from "../../../../../context/Context";

import { CheckPermission } from "../../house/CheckPermission";
import {
  Create_Warehouse_List,
  Warehouse_ListBy_id,
} from "../../../../../ApiEndPoint/Api";

const SelectedColums = [];

class DamagedStock extends React.Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.gridRef = React.createRef();
    this.gridApi = null;
    this.state = {
      isOpen: false,
      ShowBill: false,
      Arrindex: "",
      Wastage_status: "",
      Dam_Percentage: "",
      Reason: "",
      InsiderPermissions: {},

      rowData: [],
      setMySelectedarr: [],
      ViewOneData: {},
      SelectedCols: [],
      InsiderPermissions: {},
      paginationPageSize: 15,
      currenPageSize: "",
      getPageSize: "",

      columnDefs: [
        {
          headerName: "UID",
          valueGetter: "node.rowIndex + 1",
          field: "node.rowIndex + 1",
          // checkboxSelection: true,
          width: 80,
          filter: true,
        },
        {
          headerName: "Warehouse Name",
          field: "warehouseName",
          filter: true,
          sortable: true,
          editable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer">
                  <span>{params?.data?.warehouseName}</span>
                </div>
              </>
            );
          },
        },

        {
          headerName: "Address",
          field: "address",
          filter: true,
           width:350,
          sortable: true,
          editable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer">
                  <span>{params?.data?.address}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "Number",
          field: "mobileNo",
          filter: true,
           width:90,
          sortable: true,
          editable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer">
                  <span>{params?.data?.mobileNo}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "Land Line No.",
          field: "landlineNumber",
          filter: true,
           width:108,
          sortable: true,
          editable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer">
                  <span>{params?.data?.landlineNumber}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "Product HSN Code",
          field: "damage.productId.HSN_Code",
          filter: true,
          width:155,
          sortable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer">
                  <span>{params?.data?.damage?.productId?.HSN_Code}</span>
                </div>
              </>
            );
          },
        },
        // {
        //   headerName: "Status",
        //   field: "typeStatus",
        //   filter: true,
        //   sortable: true,
        //   cellRendererFramework: (params) => {
        //     return (
        //       <>
        //         <div className="actions cursor-pointer">
        //           <span>{params?.data?.typeStatus}</span>
        //         </div>
        //       </>
        //     );
        //   },
        // },
        {
          headerName: "Products",
          field: "damage.productId.Product_Title",
          filter: true,
          
          sortable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer">
                  <span>{params?.data?.damage?.productId?.Product_Title}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "Price",
          field: "damage.price",
          filter: true,
           width:100,
          sortable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer">
                  {params?.data?.damage?.price} 
                </div>
              </>
            );
          },
        },
        {
          headerName: "Reason",
          field: "damage.damageItem.reason",
          filter: true,

          sortable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer">
                  
                    {params?.data?.damage?.damageItem?.reason}
                  
                </div>
              </>
            );
          },
        },
        {
          headerName: "Qty",
          field: "damage?.damageItem?.transferQty",
          filter: true,
        width:100,
          sortable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer">
                  
                    {params?.data?.damage?.damageItem?.transferQty}
                 
                </div>
              </>
            );
          },
        },
        {
          headerName: "type Status",
          field: "damage?.damageItem?.typeStatus",
          filter: true,
           width:120,
          sortable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer">
               
                    {params?.data?.damage?.damageItem?.typeStatus}
                  
                </div>
              </>
            );
          },
        },
        {
          headerName: "Damage %",
          field: "damage.damageItem.damagePercentage",
          filter: true,
         width:100,
          sortable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer">
                 
                    {params?.data?.damage?.damageItem?.damagePercentage}
                  
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
  HandleMarkWastage = (e) => {
    e.preventDefault();
    let userId = JSON.parse(localStorage.getItem("userData"))?._id;
    let id = this.state.ViewOneData?.damageItem?._id;

    let payload = {
      typeStatus: this.state.Wastage_status,
      demagePercentage: this.state.Dam_Percentage,
      reason: this.state.Reason,
    };
    Update_Damagedstock(userId, id, payload)
      .then((res) => {
        console.log(res);
        this.togglemodal();
        this.componentDidMount();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  UpdateStock = (e) => {
    let payload = {
      status: e.target.value,
    };
    let id = this.state.ViewOneData?._id;

    // console.log(this.state.ViewOneData?._id);
    swal("Warning", "Sure You Want to Update Status", {
      buttons: {
        cancel: "No",
        catch: { text: "Yes", value: "Sure" },
      },
    }).then((value) => {
      switch (value) {
        case "Sure":
          Stockupdate(id, payload)
            .then((res) => {
              // console.log(res);
              swal("success", "Status Updated Successfully");
              this.togglemodal();
            })
            .catch((err) => {
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
  handleStockTrxInvoiceShow = () => {
    this.setState({ ShowBill: true });
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

    const InsidePermissions = CheckPermission("Damaged Stock");
    this.setState({ InsiderPermissions: InsidePermissions });
    let url = `${Warehouse_ListBy_id + pageparmission?._id}/`;
    await _Get(Create_Warehouse_List, pageparmission?.database)
      .then((res) => {
        this.setState({ Loading: false });
        let value = res?.Warehouse;
        let alldata = value?.flatMap((ele) => {
          return ele?.productItems?.map((val) => {
            return { ...ele, damage: val };
          });
        });
        let damage = alldata?.filter((ele) => !!ele?.damage?.damageItem);
        if (damage?.length) {
          this.setState({ rowData: damage });
        }
        let userHeading = JSON.parse(localStorage.getItem("DamagedStock"));
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
        this.setState({ Loading: false });
        this.setState({ rowData: [] });
      });
    await Get_Damagedstock(userid)
      .then((res) => {
        let Data = res?.damageItems?.filter(
          (ele) => ele?.damageItem?.typeStatus == "Damaged"
        );
        let rowData = res?.damageItems;

        if (Data?.length) {
          // this.setState({ rowData: Data });
          this.setState({ AllcolumnDefs: this.state.columnDefs });

          let userHeading = JSON.parse(localStorage.getItem("DamagedStock"));
          if (userHeading?.length) {
            this.setState({ columnDefs: userHeading });
            // this.gridApi.setColumnDefs(userHeading);
            this.setState({ SelectedcolumnDefs: userHeading });
          } else {
            this.setState({ columnDefs: this.state.columnDefs });
            this.setState({ SelectedcolumnDefs: this.state.columnDefs });
          }
          this.setState({ SelectedCols: this.state.columnDefs });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  toggleDropdown = () => {
    this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
  };

  runthisfunction(data) {
    let pageparmission = JSON.parse(localStorage.getItem("userData"));
    let userid = pageparmission?._id;
    swal("Warning", "Sure You Want to Delete it", {
      buttons: {
        cancel: "cancel",
        catch: { text: "Delete ", value: "delete" },
      },
    }).then((value) => {
      switch (value) {
        case "delete":
          Delete_Damagedstock(
            data?.warehouse?._id,
            data?.damageItem?.productId._id
          )
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
      "DamagedStock",
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
      InsiderPermissions,
      SelectedCols,
      AllcolumnDefs,
    } = this.state;
    return (
      <>
        {/* <ExcelReader /> */}
        
            <Card>
              <Row style={{marginLeft:'3px',marginRight:'3px'}}>
                <Col  style={{marginTop:'30px'}}> 
                 
                  <h2
                                className="float-left "
                                style={{ fontWeight: "600" ,textTransform:'uppercase', fontSize:'18px' }}>
                                Damaged Stock
                              </h2>
                </Col>
                <Col xl="3" lg="3" style={{marginTop:'30px'}}>
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
                  <Col xl="2" lg="2" style={{marginTop:'30px'}}>
                   
                   <div style={{display:'flex', justifyContent:"space-between"}}>
                   <div>
                   <span>
                   <Route
                     render={({ history }) => (
                       <Button
                         style={{ cursor: "pointer" , fontWeight:"600"}}
                         className="float-right "
                         color="primary"
                         onClick={() =>
                           history.push("/app/Jupitech/warehouse/AddDamage")
                         }>
                         + Damage
                       </Button>
                     )}
                   />
                 </span>
                   </div>
                   <div>
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
                 <span  onMouseEnter={this.toggleDropdown}
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
                   </div>

                   </div>
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
          isOpen={this.state.modalone}
          toggle={this.togglemodal}
          className={this.props.className}
          style={{ maxWidth: "1050px" }}>
          <ModalHeader toggle={this.togglemodal}>Mark Wastage</ModalHeader>
          <ModalBody className="modalbodyhead">
            <Form onSubmit={this.HandleMarkWastage}>
              <Row>
                <Col lg="4" md="4" sm="4">
                  <Label>Change Status -{this.state.Wastage_status}</Label>
                  <CustomInput
                    required
                    value={this.state.Wastage_status}
                    onChange={(e) =>
                      this.setState({ Wastage_status: e.target.value })
                    }
                    type="select">
                    <option>--select--</option>
                    <option value="Wastage">Wastage</option>
                  </CustomInput>
                </Col>
                <Col lg="4" md="4" sm="4">
                  <Label>Damadge Percetage</Label>

                  <Input
                    required
                    type="number"
                    value={this.state.Dam_Percentage}
                    onChange={(e) =>
                      this.setState({ Dam_Percentage: e.target.value })
                    }
                  />
                </Col>
                <Col lg="4" md="4" sm="4">
                  <Label>Reason</Label>

                  <Input
                    required
                    type="text"
                    value={this.state.Reason}
                    onChange={(e) => this.setState({ Reason: e.target.value })}
                  />
                </Col>
              </Row>
              <Row>
                <Col className="container mt-2">
                  <div className="d-flex justify-content-center">
                    <Button color="primary" type="submit">
                      Sumbit
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          </ModalBody>
        </Modal>
      </>
    );
  }
}
export default DamagedStock;
