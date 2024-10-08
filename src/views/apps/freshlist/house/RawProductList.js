import React, { useRef } from "react";
import { ImDownload } from "react-icons/im";

import { Route, Link } from "react-router-dom";
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
  Spinner,
} from "reactstrap";
import { ContextLayout } from "../../../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import UploadProductSample from "../UploadFormats/UploadProductSample.xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Logo from "../../../../assets/img/profile/pages/logomain.png";
import Papa from "papaparse";
import { Eye, Trash2, ChevronDown, Edit } from "react-feather";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import "../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../../../assets/scss/pages/users.scss";

// import DummyDownload from "./dummy";
import {
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaFilter,
} from "react-icons/fa";
import swal from "sweetalert";
import { _Delete, _Get } from "../../../../ApiEndPoint/ApiCalling";
import {
  BsFillArrowDownSquareFill,
  BsFillArrowUpSquareFill,
} from "react-icons/bs";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import UserContext from "../../../../context/Context";
import EditAddProduct from "./EditAddProduct";
import { Delete_Product } from "../../../../ApiEndPoint/Api";
import { CheckPermission } from "./CheckPermission";
import SuperAdminUI from "../../../SuperAdminUi/SuperAdminUI";
import {
  Delete_Raw_Material,
  List_Raw_Material,
} from "../../../../ApiEndPoint/ProductionApi";

const SelectedColums = [];

class RawProductList extends React.Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.gridRef = React.createRef();
    this.gridApi = null;
    this.state = {
      isOpen: false,
      Arrindex: "",
      rowData: [],
      rowAllData: [],
      setMySelectedarr: [],
      SelectedCols: [],
      paginationPageSize: 15,
      MasterShow: false,
      currenPageSize: "",
      getPageSize: "",
      columnDefs: [
        // {
        //   headerName: "UID",
        //   valueGetter: "node.rowIndex + 1",
        //   field: "node.rowIndex + 1",
        //   width: 80,
        //   filter: true,
        // },

        // {
        //     headerName: "Purchase Date",
        //     field: "DateofDelivery",
        //     filter: true,
        //     width: 200,
        //     cellRendererFramework: (params) => {
        //         return (
        //             <div className="d-flex align-items-center cursor-pointer">
        //                 <div>
        //                     <span>{params.data?.DateofDelivery}</span>
        //                 </div>
        //             </div>
        //         );
        //     },
        // },
        {
          headerName: "Warehouse ID",
          field: "warehouse.id",
          filter: true,
          width: 200,
          editable: true,
          cellRendererFramework: (params) => {
            return (
              <div className="d-flex align-items-center cursor-pointer">
                <div>
                  <span>
                    {params.data?.warehouse?.id && params.data?.warehouse?.id}
                  </span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Product Name",
          field: "Product_Title",
          filter: true,
          width: 300,
          cellRendererFramework: (params) => {
            return (
              <div className="d-flex align-items-center cursor-pointer">
                <div>
                  <Link
                    style={{ color: "black" }}
                    to={`/app/freshlist/house/EditRawMateirals/${params?.data?._id}`}>
                    <span>{params?.data?.Product_Title}</span>
                  </Link>
                </div>
              </div>
            );
          },
        },

        {
          headerName: "MIN Stockalert",
          field: "MIN_stockalert",
          filter: true,
          width: 125,
          cellRendererFramework: (params) => {
            return (
              <div className="d-flex align-items-center cursor-pointer">
                <div>
                  <span>{params.data?.MIN_stockalert}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Opening Stock",
          field: "Opening_Stock",
          filter: true,
          width: 125,
          cellRendererFramework: (params) => {
            return (
              <div className="d-flex align-items-center cursor-pointer">
                <div>
                  <span>{params.data?.Opening_Stock}</span>
                </div>
              </div>
            );
          },
        },

        {
          headerName: "Category",
          field: "category",
          filter: true,
          width: 150,
          cellRendererFramework: (params) => {
            return (
              <div className="d-flex align-items-center cursor-pointer">
                <div>
                  <span>{params.data?.category}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Sub Category",
          field: "SubCategory",
          filter: true,
          width: 160,
          cellRendererFramework: (params) => {
            return (
              <div className="d-flex align-items-center cursor-pointer">
                <div>
                  <span>{params.data?.SubCategory}</span>
                </div>
              </div>
            );
          },
        },

        {
          headerName: "Status",
          field: "status",
          filter: true,
          width: 90,
          cellRendererFramework: (params) => {
            return params.value == "completed" ? (
              <div
              // className=" "
              >
                {params.data.status}
              </div>
            ) : params.value == "pending" ? (
              <div
              // className=" "
              >
                {params.data.status}
              </div>
            ) : (
              <div className="">{params.data.status}</div>
            );
          },
        },
        {
          headerName: "Actions",
          field: "sortorder",
          width: 80,
          cellRendererFramework: (params) => {
            return (
              <div className="cursor-pointer">
                {this.state.InsiderPermissions &&
                  this.state.InsiderPermissions?.Edit && (
                    <Route
                      render={({ history }) => (
                        <Edit
                          // className="mr-10"
                          size="20px"
                          color="blue"
                          onClick={() => {
                            history.push(
                              `/app/freshlist/house/EditRawMateirals/${params?.data?._id}`
                            );
                          }}
                        />
                      )}
                    />
                  )}

                {this.state.InsiderPermissions &&
                  this.state.InsiderPermissions?.Delete && (
                    <Route
                      render={() => (
                        <Trash2
                          // className="mr-10"
                          size="20px"
                          color="red"
                          onClick={() => {
                            this.runthisfunction(params?.data?._id);
                          }}
                        />
                      )}
                    />
                  )}
              </div>
            );
          },
        },
      ],
      InsiderPermissions: {},
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
    this.setState({ AllcolumnDefs: this.state.columnDefs });
    this.setState({ SelectedCols: this.state.columnDefs });

    let userHeading = JSON.parse(localStorage.getItem("RawProductList"));
    if (userHeading?.length) {
      this.setState({ columnDefs: userHeading });
      this.gridApi.setColumnDefs(userHeading);
      this.setState({ SelectedcolumnDefs: userHeading });
    } else {
      this.setState({ columnDefs: this.state.columnDefs });
      this.setState({ SelectedcolumnDefs: this.state.columnDefs });
    }
    await _Get(List_Raw_Material, db)
      .then((res) => {
        this.setState({ Loading: false });
        this.setState({
          rowData: res?.Product?.reverse(),
          rowAllData: res?.Product?.reverse(),
        });
      })
      .catch((err) => {
        this.setState({ Loading: false });
        this.setState({ rowData: [] });
      });
  }

  async componentDidMount() {
    const UserInformation = this.context?.UserInformatio;
    let pageparmission = JSON.parse(localStorage.getItem("userData"));

    if (pageparmission?.rolename?.roleName === "MASTER") {
      this.setState({ MasterShow: true });
    }
    const InsidePermissions = CheckPermission("Raw Product Creation");
    this.setState({ InsiderPermissions: InsidePermissions });

    await this.Apicalling(pageparmission?._id, pageparmission?.database);
  }
  toggleDropdown = () => {
    this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
  };

  runthisfunction(id) {
    let selectedData = this.gridApi.getSelectedRows();
    swal("Warning", "Sure You Want to Delete it", {
      buttons: {
        cancel: "cancel",
        catch: { text: "Delete ", value: "delete" },
      },
    }).then((value) => {
      switch (value) {
        case "delete":
          _Delete(Delete_Raw_Material, id)
            .then((res) => {
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
            result?.data?.forEach((ele) => {
              delete ele?.Status;
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
    doc.text("RawProductList", 14, 51);
    doc.autoTable({
      head: [Object.keys(parsedData[0])],
      body: tableData,
      startY: 60,
    });

    doc.save("RawProductList.pdf");
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
          XLSX.utils.book_append_sheet(workbook, worksheet, "RawProductList");
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
    a.download = "Productlist.xlsx";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }

  exportToExcel = async (fileName, e) => {
    let Data = this.state.rowAllData?.map((item, i) => {
      return {
        id: item?.id,
        category: item?.category,
        SubCategory: item?.SubCategory,
        warehouse: item?.warehouse?.id,
        Product_Title: item?.Product_Title,
        MIN_stockalert: item?.MIN_stockalert,
        Opening_Stock: item?.Opening_Stock,
      };
    });
    const worksheet = XLSX.utils.json_to_sheet(Data);

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
    // const CsvData = this.gridApi.getDataAsCsv({
    //   processCellCallback: this.processCell,
    //   // skipHeader: true,
    // });

    // const csvLines = CsvData.split("\r\n");

    // csvLines.shift();
    // let data = this.state.columnDefs?.map(ele => {
    //   return ele?.field;
    // });
    // data[0] = "UID";
    // csvLines.unshift(data);
    // const newCsvData = csvLines.join("\r\n");

    // const blob = await this.convertCsvToExcel(newCsvData);
    // this.downloadExcelFile(blob);
  };

  convertCSVtoExcel = (fileName) => {
    this.state.rowAllData?.forEach((ele) => {
      delete ele?.Product_image;
      delete ele?.createdAt;
      delete ele?.created_by;
      delete ele?.updatedAt;
      delete ele?.status;
      delete ele?.__v;
      delete ele?._id;
      delete ele?.partyId;
      delete ele?.database;
      delete ele?.purchaseStatus;
      delete ele?.purchaseDate;
      delete ele?.salesDate;
      delete ele?.landedCost;
      delete ele?.unitType;
      delete ele?.Unit;
      delete ele?.discount;
      ele["warehouse"] = ele?.warehouse?.id
        ? ele?.warehouse?.id
        : ele?.warehouse;
    });
    this.setState({ rowAllData: this.state.rowData });
    const worksheet = XLSX.utils.json_to_sheet(this.state.rowAllData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(dataBlob, `${fileName}.xls`);
    // const CsvData = this.gridApi.getDataAsCsv({
    //   processCellCallback: this.processCell,
    // });
    // Papa.parse(CsvData, {
    //   complete: (result) => {
    //     const ws = XLSX.utils.json_to_sheet(this.state.rowData);
    //     const wb = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wb, ws, "RawProductList");
    //     const excelType = "xls";
    //     XLSX.writeFile(wb, `RawProductList.${excelType}`);
    //   },
    // });
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
        const excelType = "xlsx";
        XLSX.writeFile(wb, `UploadProductSample.${excelType}`);
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
  convertCsvToXml = (fileName) => {
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
      "RawProductList",
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
                Raw Product List
              </h1>
            </Col>

            {this.state.MasterShow && (
              <Col xl="3" lg="3" style={{ marginTop: "25px" }}>
                <SuperAdminUI
                  onDropdownChange={this.handleDropdownChange}
                  onSubmit={this.handleParentSubmit}
                />
              </Col>
            )}
            <Col xl="3" lg="3" style={{ marginTop: "25px" }}>
              <div className="table-input ">
                <Input
                  placeholder="search Item here..."
                  onChange={(e) => this.updateSearchQuery(e.target.value)}
                  value={this.state.value}
                />
              </div>
            </Col>

            <Col xl="2" lg="2" style={{ marginTop: "25px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  {InsiderPermissions && InsiderPermissions.Create && (
                    <span className=" ">
                      <Route
                        render={({ history }) => (
                          <Button
                            color="rgb(8, 91, 245)"
                            style={{
                              cursor: "pointer",
                              backgroundColor: "rgb(8, 91, 245) !important",
                              color: "white",
                              fontWeight: "600",
                              height: "35px",
                            }}
                            className="float-right categorysbutton45"
                            onClick={() =>
                              history.push(
                                "/app/freshlist/house/AddRawProduct/0"
                              )
                            }>
                            + Product
                          </Button>
                        )}
                      />
                    </span>
                  )}
                </div>
                <div>
                  {InsiderPermissions && InsiderPermissions.View && (
                    <span className=" ">
                      <FaFilter
                        style={{ cursor: "pointer" }}
                        title="filter coloumn"
                        size="35px"
                        onClick={this.LookupviewStart}
                        color="rgb(8, 91, 245)"
                        className="float-right  "
                      />
                    </span>
                  )}
                  {InsiderPermissions && InsiderPermissions.Download && (
                    <div
                      onMouseEnter={this.toggleDropdown}
                      onMouseLeave={this.toggleDropdown}
                      className="dropdown-container float-right">
                      <ImDownload
                        style={{ cursor: "pointer" }}
                        title="download file"
                        size="35px"
                        className="dropdown-button"
                        color="rgb(8, 91, 245)"
                      />
                      {isOpen && (
                        <div
                          style={{
                            position: "absolute",
                            zIndex: "1",
                            // border: "1px solid #39cccc",
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
                            onClick={() =>
                              this.convertCSVtoExcel("productList")
                            }
                            style={{ cursor: "pointer" }}
                            className=" mx-1 myactive">
                            .XLS
                          </h5> */}
                          <h5
                            onClick={() => this.exportToExcel("RawProductList")}
                            style={{ cursor: "pointer" }}
                            className=" mx-1 myactive">
                            .XLSX
                          </h5>
                          {/* <h5
                            onClick={() => this.convertCsvToXml("productList")}
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
                                  href={UploadProductSample}
                                  download>
                                  . Format
                                </a>
                              </h5>
                            )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Col>
          </Row>

          <>
            {this.state.rowData === null ? null : (
              <div
                className="ag-theme-material w-100   ag-grid-table card-body"
                style={{ marginTop: "-1rem" }}>
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
export default RawProductList;
