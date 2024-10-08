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
  Spinner,
  Badge,
  Label,
  Form,
} from "reactstrap";
import { ContextLayout } from "../../../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import UploadProductSample from "../UploadFormats/UploadProductSample.xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Logo from "../../../../assets/img/profile/pages/logomain.png";
import Papa from "papaparse";
import axiosConfig from "../../../../axiosConfig";
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
import {
  _Delete,
  _Get,
  _Post,
  _PostSave,
  _Put,
} from "../../../../ApiEndPoint/ApiCalling";
import {
  BsFillArrowDownSquareFill,
  BsFillArrowUpSquareFill,
} from "react-icons/bs";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import UserContext from "../../../../context/Context";
import EditAddProduct from "./EditAddProduct";
import {
  Delete_Product,
  Image_URL,
  Product_Price_Bulk_Update,
  PurchaseProductList_Product,
  Update_Product_salesRate,
  View_CustomerGroup,
} from "../../../../ApiEndPoint/Api";
import { CheckPermission } from "./CheckPermission";
import SuperAdminUI from "../../../SuperAdminUi/SuperAdminUI";

const SelectedColums = [];

class HouseProductList extends React.Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.gridRef = React.createRef();
    this.gridApi = null;
    this.state = {
      isOpen: false,
      Arrindex: "",
      rowData: [],
      maxDiscount: "",
      ProfitPercentage: null,

      setMySelectedarr: [],
      formValues: [{}],
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

        {
          headerName: "Product Name",
          field: "Product_Title",
          filter: true,
          width: 300,
          cellRendererFramework: (params) => {
            return (
              <div className="d-flex align-items-center cursor-pointer">
                <div>
                  <span>{params?.data?.Product_Title}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "HSN_Code",
          field: "HSN_Code",
          filter: true,
          width: 150,
          cellRendererFramework: (params) => {
            return (
              <div className="d-flex align-items-center cursor-pointer">
                <div>
                  <span>{params.data?.HSN_Code}</span>
                </div>
              </div>
            );
          },
        },

        {
          headerName: "Purchase Rate",
          field: "Purchase_Rate",
          filter: true,
          width: 160,
          cellRendererFramework: (params) => {
            return (
              <div className="d-flex align-items-center cursor-pointer">
                <span>
                  {params?.data?.landedCost > params?.data?.Purchase_Rate
                    ? params?.data?.landedCost
                    : params?.data?.Purchase_Rate}
                </span>
              </div>
            );
          },
        },
        {
          headerName: "Profit %",
          field: "ProfitPercentage",
          filter: true,
          width: 160,
          cellRendererFramework: (params) => {
            return (
              <div className="d-flex align-items-center cursor-pointer">
                <span>
                  {params?.data?.ProfitPercentage > 3
                    ? params?.data?.ProfitPercentage
                    : "3"}
                </span>
              </div>
            );
          },
        },
        {
          headerName: "Sales Rate",
          field: "SalesRate",
          filter: true,
          width: 130,
          cellRendererFramework: (params) => {
            // console.log(params?.data?.lossStatus);
            return (
              <div className="d-flex cursor-pointer">
                <span
                  style={{ color: params?.data?.lossStatus ? "red" : "green" }}>
                  {/* <span> */}
                  {params?.data?.SalesRate &&
                    params?.data?.SalesRate?.toFixed(2)}
                </span>
              </div>
            );
          },
        },

        {
          headerName: "Grade Discount",
          field: "maxDiscount",
          filter: true,
          width: 180,
          cellRendererFramework: (params) => {
            return (
              <div className="d-flex align-items-center cursor-pointer">
                <div>
                  <span>{this.state.maxDiscount}</span>
                </div>
              </div>
            );
          },
        },

        {
          headerName: "Tax",
          field: "GSTRate",
          filter: true,
          width: 150,
          cellRendererFramework: (params) => {
            return (
              <div className="d-flex align-items-center cursor-pointer">
                <div>
                  <span>{params.data?.GSTRate}</span>
                  {/* <span>
                    {this.state.salesRate +
                      (((this.state.salesRate * this.state.maxDiscount) / 100) *
                        18) /
                        100}
                  </span> */}
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Product MRP",
          field: "Product_MRP",
          filter: true,
          width: 155,
          cellRendererFramework: (params) => {
            return (
              <div className="">
                <div>
                  {/* <span>
                    {this.state.salesRate +
                      (this.state.salesRate * this.state.maxDiscount) / 100 +
                      (this.state.salesRate +
                        (((this.state.salesRate * this.state.maxDiscount) /
                          100) *
                          18) /
                          100)}
                  </span> */}
                  <span>{params.data?.Product_MRP?.toFixed(2)}</span>
                </div>
              </div>
            );
          },
        },

        // {
        //   headerName: "Action",
        //   field: "Sales Rate",
        //   filter: true,
        //   width: 130,
        //   cellRendererFramework: (params) => {
        //     return (
        //       <div className="d-flex cursor-pointer">
        //         <Badge
        //           className=" mt-1"
        //           onClick={() => {
        //             swal(`Add ${params?.data?.Product_Title} Sales Rate`, {
        //               content: "input",
        //             }).then((value) => {
        //               let maxDiscount = this.state.maxDiscount;
        //               let gd = Number(((value * maxDiscount) / 100).toFixed(2));
        //               let tax = Number(
        //                 (
        //                   ((Number(value) + gd) * params.data?.GSTRate) /
        //                   100
        //                 ).toFixed(2)
        //               );
        //               let Mrp = Number(value) + gd + tax;
        //               let payload = {
        //                 SalesRate: Number(value),
        //                 Product_MRP: Mrp,
        //               };
        //               (async () => {
        //                 if (value > 0) {
        //                   await _Put(
        //                     Update_Product_salesRate,
        //                     params?.data?._id,
        //                     payload
        //                   )
        //                     .then((res) => {
        //                       console.log(res);
        //                       this.componentDidMount();
        //                       swal(
        //                         "Success",
        //                         "Updated Successfully",
        //                         "success"
        //                       );
        //                     })
        //                     .catch((err) => {
        //                       swal("Error", "Error Occured Try Again", "error");

        //                       console.log(err);
        //                     });
        //                 }
        //               })();
        //             });
        //           }}
        //           size="sm"
        //           color="primary">
        //           Add
        //         </Badge>
        //       </div>
        //     );
        //   },
        // },
        // {
        //   headerName: "Status",
        //   field: "status",
        //   filter: true,
        //   width: 90,
        //   cellRendererFramework: (params) => {
        //     return params.value == "completed" ? (
        //       <div
        //       // className="badge badge-pill badge-success"
        //       >
        //         {params.data.status}
        //       </div>
        //     ) : params.value == "pending" ? (
        //       <div
        //       // className="badge badge-pill badge-warning"
        //       >
        //         {params.data.status}
        //       </div>
        //     ) : (
        //       <div className="">{params.data.status}</div>
        //     );
        //   },
        // },
        // {
        //   headerName: "Actions",
        //   field: "sortorder",
        //   width: 90,
        //   cellRendererFramework: (params) => {
        //     return (
        //       <div className="cursor-pointer">
        //         {this.state.InsiderPermissions &&
        //           this.state.InsiderPermissions?.Edit && (
        //             <Route
        //               render={({ history }) => (
        //                 <Edit
        //                   // className="mr-10"
        //                   size="25px"
        //                   color="blue"
        //                   onClick={() => {
        //                     history.push(
        //                       `/app/freshlist/house/EditAddProduct/${params?.data?._id}`
        //                     );
        //                   }}
        //                 />
        //               )}
        //             />
        //           )}

        //         {this.state.InsiderPermissions &&
        //           this.state.InsiderPermissions?.Delete && (
        //             <Route
        //               render={() => (
        //                 <Trash2
        //                   // className="mr-10"
        //                   size="25px"
        //                   color="red"
        //                   onClick={() => {
        //                     this.runthisfunction(params?.data?._id);
        //                   }}
        //                 />
        //               )}
        //             />
        //           )}
        //       </div>
        //     );
        //   },
        // },
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
  handleChange(i, e) {
    let formValues = this.state.formValues;
    let { name, value } = e.target;
    formValues[i][name] = value;
    if (name == "SalesRate") {
      let data = formValues[i];
      let Discount = data?.maxDiscount;
      let gd = Number(((Number(data?.SalesRate) * Discount) / 100).toFixed(2));
      let tax = Number(
        (((Number(data?.SalesRate) + gd) * data?.GSTRate) / 100).toFixed(2)
      );
      let Mrp = Number((Number(data?.SalesRate) + gd + tax).toFixed(2));
      formValues[i]["Product_MRP"] = Number(Mrp?.toFixed(2));
      if (data?.landedCost > data?.SalesRate) {
        formValues[i]["lossStatus"] = true;
      } else {
        formValues[i]["lossStatus"] = false;
      }
    } else {
      debugger;

      let data = formValues[i];
      let LandedCost = data?.landedCost || data?.Purchase_Rate;

      let Mrp = data?.Product_MRP;
      let gst = (100 + data?.GSTRate) / 100;
      let Dis = (100 + data?.maxDiscount) / 100;
      let SalesRate = Number((Mrp / (gst * Dis)).toFixed(2));
      formValues[i]["SalesRate"] = SalesRate;
      formValues[i]["ProfitPercentage"] = Number(
        (((SalesRate * 100) / LandedCost).toFixed(2) - 100).toFixed(2)
      );
      if (LandedCost > SalesRate) {
        formValues[i]["lossStatus"] = true;
      } else {
        formValues[i]["lossStatus"] = false;
      }
    }
    this.setState({ formValues });
  }

  addFormFields() {
    this.setState({
      formValues: [...this.state.formValues, {}],
    });
  }

  removeFormFields(i) {
    let formValues = this.state.formValues;
    formValues.splice(i, 1);
    this.setState({ formValues });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    let value = this.state.formValues?.map((ele) => {
      return {
        id: ele?._id,
        Product_MRP: ele?.Product_MRP,
        SalesRate: ele?.SalesRate,
        ProfitPercentage: ele?.ProfitPercentage,
      };
    });
    await axiosConfig
      .put(Product_Price_Bulk_Update, { Products: value })
      .then((res) => {
        this.setState({ loading: false });
        swal("success", "Updated Successfully", "success");
        console.log(res);
        this.LookupviewStart();
        this.componentDidMount();
      })
      .catch((err) => {
        this.setState({ loading: false });
        swal("error", "Error Occured try Again After Some Time", "error");

        console.log(err);
      });
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
    this.setState({
      Loading: true,
      AllcolumnDefs: this.state.columnDefs,
      SelectedCols: this.state.columnDefs,
    });

    let userHeading = JSON.parse(localStorage.getItem("PriceList"));
    if (userHeading?.length) {
      this.setState({ columnDefs: userHeading });
      this.gridApi.setColumnDefs(userHeading);
      this.setState({ SelectedcolumnDefs: userHeading });
    } else {
      this.setState({
        columnDefs: this.state.columnDefs,
        SelectedcolumnDefs: this.state.columnDefs,
      });
    }
    let maxDiscount = 0;
    await _Get(View_CustomerGroup, db)
      .then((res) => {
        this.setState({ Loading: false });
        if (res?.CustomerGroup) {
          let myActive = res?.CustomerGroup?.filter(
            (ele) => ele?.status == "Active"
          );

          let max = myActive.reduce(
            (prevMax, obj) => (obj.discount > prevMax ? obj.discount : prevMax),
            -Infinity
          );
          this.setState({ maxDiscount: max > 0 ? max : 0 });
          maxDiscount = max > 0 ? max : 0;
        }
      })
      .catch((err) => {
        this.setState({ maxDiscount: 0 });
        console.log(err);
      });
    await _Get(PurchaseProductList_Product, db)
      .then((res) => {
        this.setState({ Loading: false });
        res?.Product?.forEach((ele) => {
          if (!!ele?.ProfitPercentage){
            ele["ProfitPercentage"] = ele?.ProfitPercentage;
          }else{
            ele["ProfitPercentage"] = 3;
          }
          
          console.log(ele?.ProfitPercentage);
          let Mrp = ele?.Product_MRP;
          let gst = (100 + ele?.GSTRate) / 100;
          let Dis = (100 + maxDiscount) / 100;
          if (!!ele?.SalesRate) {
            ele["SalesRate"] = ele?.SalesRate;
          } else {
            ele["SalesRate"] = Number((Mrp / (gst * Dis)).toFixed(2));
          }
          ele["maxDiscount"] = maxDiscount;
          let cost =
            ele?.landedCost > ele?.Purchase_Rate
              ? ele?.landedCost
              : ele?.Purchase_Rate;
          if (cost > ele?.SalesRate) {
            ele["lossStatus"] = true;
          } else {
            ele["lossStatus"] = false;
          }
        });
        console.log(res?.Product);
        this.setState({ rowData: res?.Product?.reverse() });
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
    const InsidePermissions = CheckPermission("Price List");
    this.setState({ InsiderPermissions: InsidePermissions });

    await this.Apicalling(pageparmission?._id, pageparmission?.database);
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
          _Delete(Delete_Product, id)
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
    doc.text("PriceList", 14, 51);
    doc.autoTable({
      head: [Object.keys(parsedData[0])],
      body: tableData,
      startY: 60,
    });

    doc.save("PriceList.pdf");
  }

  exportToPDF = async () => {
    const csvData = this.gridApi.getDataAsCsv({
      processCellCallback: this.processCell,
    });
    try {
      const parsedData = await this.parseCsv(csvData);
      let data = this.state.rowData?.map((ele) => {
        return {
          Product_Title: ele?.Product_Title,
          HSN_Code: ele?.HSN_Code,
          landedCost: ele?.landedCost ? ele?.landedCost : null,
          Purchase_Rate: ele?.Purchase_Rate ? ele?.Purchase_Rate : null,
          ProfitPercentage: ele?.ProfitPercentage,
          SalesRate: ele?.SalesRate,
          maxDiscount: this.state.maxDiscount,
          GSTRate: ele.GSTRate,
          Product_MRP: ele.Product_MRP,
        };
      });
      this.generatePDF(data);
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
          XLSX.utils.book_append_sheet(workbook, worksheet, "ProductList");
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
    a.download = "Pricelist.xlsx";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }

  exportToExcel = async (fileName, e) => {
    let data = this.state.rowData?.map((ele) => {
      return {
        Product_Title: ele?.Product_Title,
        HSN_Code: ele?.HSN_Code,
        landedCost: ele?.landedCost ? ele?.landedCost : null,
        Purchase_Rate: ele?.Purchase_Rate ? ele?.Purchase_Rate : null,
        ProfitPercentage: ele?.ProfitPercentage,
        SalesRate: ele?.SalesRate,
        maxDiscount: this.state.maxDiscount,
        GSTRate: ele.GSTRate,
        Product_MRP: ele.Product_MRP,
      };
    });
    const worksheet = XLSX.utils.json_to_sheet(data);

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
    this.state.rowData?.forEach((ele) => {
      delete ele?.Product_image;
      delete ele?.createdAt;
      delete ele?.created_by;
      delete ele?.updatedAt;
      delete ele?.status;
      delete ele?.__v;
      delete ele?._id;
      delete ele?.database;
      delete ele?.purchaseStatus;
      delete ele?.purchaseDate;
      delete ele?.salesDate;
      delete ele?.landedCost;
      delete ele?.unitType;
      delete ele?.Unit;
      delete ele?.discount;
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
    saveAs(dataBlob, `${fileName}.xls`);
    // const CsvData = this.gridApi.getDataAsCsv({
    //   processCellCallback: this.processCell,
    // });
    // Papa.parse(CsvData, {
    //   complete: (result) => {
    //     const ws = XLSX.utils.json_to_sheet(this.state.rowData);
    //     const wb = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wb, ws, "ProductList");
    //     const excelType = "xls";
    //     XLSX.writeFile(wb, `ProductList.${excelType}`);
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
      "PriceList",
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
  handleSubmitProfitPercentage = async (e) => {
    e.preventDefault();
    let lessProfit = this.state.formValues?.filter(
      (ele) => ele?.ProfitPercentage <= this.state.ProfitPercentage
    );
    lessProfit?.forEach((element, index) => {
      let LandedCost =
        element?.Purchase_Rate > element?.landedCost
          ? element?.Purchase_Rate
          : element?.landedCost;

      element["SalesRate"] = Number(
        (
          LandedCost *
          ((100 + Number(this.state.ProfitPercentage)) / 100)
        ).toFixed(2)
      );
      let Discount = element?.maxDiscount;
      let gd = Number(
        ((Number(element["SalesRate"]) * Discount) / 100).toFixed(2)
      );
      let tax = Number(
        (
          ((Number(element["SalesRate"]) + gd) * element?.GSTRate) /
          100
        ).toFixed(2)
      );
      let Mrp = Number((Number(element["SalesRate"]) + gd + tax).toFixed(2));
      element["Product_MRP"] = Mrp;
      element["ProfitPercentage"] = Number(this.state.ProfitPercentage);
    });
    this.setState({ loading: true });
    let value = lessProfit?.map((ele) => {
      return {
        id: ele?._id,
        Product_MRP: ele?.Product_MRP,
        SalesRate: ele?.SalesRate,
        ProfitPercentage: ele?.ProfitPercentage,
      };
    });
    await axiosConfig
      .put(Product_Price_Bulk_Update, { Products: value })
      .then((res) => {
        this.setState({ loading: false, ProfitPercentage :""});
        swal("success", "Updated Successfully", "success");
        this.LookupviewStart();
        this.componentDidMount();
      })
      .catch((err) => {
        this.setState({ loading: false });
        swal("error", "Error Occured try Again After Some Time", "error");

        console.log(err);
      });
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
                  fontSize: "22px",
                  marginTop: "25px",
                }}>
                Product Price List
              </h1>
            </Col>

            {this.state.MasterShow ? (
              <Col lg="2" md="2" sm="12" style={{ marginTop: "25px" }}>
                <SuperAdminUI
                  onDropdownChange={this.handleDropdownChange}
                  onSubmit={this.handleParentSubmit}
                />
              </Col>
            ) : (
              <Col></Col>
            )}
            <Col lg="2" md="2" sm="12" style={{ marginTop: "25px" }}>
              <div className="table-input ">
                <Input
                  placeholder="search Item here..."
                  onChange={(e) => this.updateSearchQuery(e.target.value)}
                  value={this.state.value}
                />
              </div>
            </Col>

            <Col lg="3" style={{ marginTop: "25px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {InsiderPermissions && InsiderPermissions.Edit && (
                  <span className=" ">
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
                          className="float-right categorysbutton45 ml-3"
                          onClick={() => {
                            this.setState({ BulkEdit: true, EditCol: false });
                            this.LookupviewStart();
                            this.setState({
                              formValues: this.state.rowData,
                              FormAllValue: this.state.rowData,
                            });
                          }}
                          // onClick={() =>
                          //   history.push("/app/freshlist/house/AddProduct")
                          // }
                        >
                          Bulk Edit
                        </Button>
                      )}
                    />
                  </span>
                )}
                {InsiderPermissions && InsiderPermissions.Create && (
                  <span className=" ">
                    <Route
                      render={({ history }) => (
                        <Button
                          style={{
                            cursor: "pointer",
                            // backgroundColor: "rgb(8, 91, 245)",
                            color: "white",
                            height: "35px",
                            fontWeight: "600",
                          }}
                          className="float-right categorysbutton45"
                          onClick={() =>
                            history.push("/app/freshlist/house/AddProduct")
                          }>
                          Add Product
                        </Button>
                      )}
                    />
                  </span>
                )}
              </div>
            </Col>
            <Col lg="1" style={{ marginTop: "25px" }}>
              {InsiderPermissions && InsiderPermissions.View && (
                <span className=" ">
                  <FaFilter
                    style={{ cursor: "pointer" }}
                    title="filter coloumn"
                    size="35px"
                    onClick={() => {
                      this.setState({ BulkEdit: false, EditCol: true });
                      this.LookupviewStart();
                    }}
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
                        onClick={() => this.exportToExcel("productList")}
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
                      {InsiderPermissions && InsiderPermissions?.BulkUpload && (
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
            </Col>
          </Row>

          <>
            {this.state.rowData === null ? null : (
              <div className="ag-theme-material w-100 my-1 ag-grid-table">
                <div className="" style={{ color: "red" }}>
                  <strong className="mx-1">
                    Note: If Profit % is not set then By Default Sale Rate is 3%
                    more then Purchase Rate else you want To Set-{" "}
                    <span
                      style={{ cursor: "pointer", color: "blue" }}
                      onClick={() => {
                        this.setState({ BulkEdit: true, EditCol: false });
                        this.LookupviewStart();
                        this.setState({
                          formValues: this.state.rowData,
                          FormAllValue: this.state.rowData,
                        });
                      }}>
                      Click Here
                    </span>
                  </strong>
                </div>
                {/* <div className="d-flex flex-wrap justify-content-between align-items-center">
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
                            <ChevronDown className="ml-50" size={15} />
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
                    </div> */}
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
          style={{ maxWidth: this.state.BulkEdit ? "93%" : "1050px" }}>
          <ModalHeader toggle={this.LookupviewStart}>
            {this.state.BulkEdit ? "Edit Product Price List" : "Change Fileds"}
          </ModalHeader>
          <ModalBody className={this.state.BulkEdit ? "" : "modalbodyhead"}>
            {this.state.BulkEdit ? (
              <>
                <div className="">
                  <div className="d-flex justify-content-center">
                    <h3 className="mb-1">Edit Product MRP or Sales Rate</h3>
                  </div>
                  <Row>
                    <Col lg="4" md="4" sm="12">
                      <Input
                        type="text"
                        onChange={(e) => {
                          let value = e.target.value?.toUpperCase();
                          let AllData = [];
                          if (value?.length > 0) {
                            AllData = this.state.FormAllValue?.filter(
                              (element) =>
                                element.Product_Title.toUpperCase()?.includes(
                                  value
                                )
                            );
                          }
                          if (AllData?.length > 0) {
                            this.setState({ formValues: AllData });
                          } else {
                            this.setState({
                              formValues: this.state.FormAllValue,
                            });
                          }
                        }}
                        placeholder="Search Proudct here"
                      />
                    </Col>
                    <Col></Col>

                    <Col lg="3" md="3" sm="12">
                      <Input
                        type="number"
                        name="ProfitPercentage"
                        value={this.state.ProfitPercentage}
                        onChange={(e) =>
                          this.setState({ ProfitPercentage: e.target.value })
                        }
                        placeholder="Profit Percentage for all Product"
                      />
                    </Col>
                    <Col lg="2" md="2" sm="12">
                      {this.state.ProfitPercentage >= 1 &&
                      <Button
                        onClick={this.handleSubmitProfitPercentage}
                        color="primary">
                        Submit
                      </Button>
                      }
                    </Col>
                  </Row>
                </div>

                <div className="mb-1 mt-1" style={{ color: "red" }}>
                  <strong>
                    Note: If Profit % is Zero then By Default Sale Rate is 3%
                    more then Purchase Rate else you want To Set *
                  </strong>
                </div>
              </>
            ) : null}
            {this.state.BulkEdit ? (
              <Form onSubmit={this.handleSubmit}>
                <>
                  {this.state.formValues?.length > 0 &&
                    this.state.formValues?.map((element, index) => (
                      <Row key={index}>
                        <Col lg="4" md="4" sm="6">
                          {" "}
                          <Label>Product Name</Label>
                          <Input
                            type="text"
                            readOnly
                            name="Product_Title"
                            placeholder="Product Title"
                            value={element.Product_Title || ""}
                            onChange={(e) => this.handleChange(index, e)}
                          />
                        </Col>
                        <Col lg="1" md="1" sm="6">
                          {" "}
                          <Label>Landed Cost</Label>
                          <Input
                            readOnly
                            type="text"
                            placeholder="Landed Cost"
                            name="landedCost"
                            value={element.Purchase_Rate || element.landedCost}
                            // value={element.landedCost || element.Purchase_Rate}
                            onChange={(e) => this.handleChange(index, e)}
                          />
                        </Col>
                        <Col lg="1" md="1" sm="6">
                          {" "}
                          <Label>Profit %</Label>
                          <Input
                            type="number"
                            min={1}
                            placeholder="3 %"
                            name="ProfitPercentage"
                            value={
                              element?.ProfitPercentage
                                ? element?.ProfitPercentage
                                : 3
                            }
                            onChange={(e) => {
                              let { name, value } = e.target;
                              let formValues = this.state.formValues;
                              let LandedCost =
                                element?.Purchase_Rate || element?.landedCost;
                              // let LandedCost =
                              //   element?.landedCost || element?.Purchase_Rate;

                              formValues[index][name] = Number(value);
                              formValues[index]["SalesRate"] = Number(
                                (
                                  LandedCost *
                                  ((100 + Number(value)) / 100)
                                ).toFixed(2)
                              );
                              let data = formValues[index];
                              let Discount = data?.maxDiscount;
                              let gd = Number(
                                (
                                  (Number(data?.SalesRate) * Discount) /
                                  100
                                ).toFixed(2)
                              );
                              let tax = Number(
                                (
                                  ((Number(data?.SalesRate) + gd) *
                                    data?.GSTRate) /
                                  100
                                ).toFixed(2)
                              );
                              let Mrp = Number(
                                (Number(data?.SalesRate) + gd + tax).toFixed(2)
                              );
                              formValues[index]["Product_MRP"] = Mrp;
                              if (LandedCost > data?.SalesRate) {
                                formValues[index]["lossStatus"] = true;
                              } else {
                                formValues[index]["lossStatus"] = false;
                              }
                              this.setState({ formValues });
                            }}
                            // onChange={(e) => this.handleChange(index, e)}
                          />
                        </Col>
                        <Col lg="2" md="2" sm="6">
                          {" "}
                          <Label>
                            {element?.lossStatus ? (
                              <span style={{ color: "red" }}> Sale Rate</span>
                            ) : (
                              <span style={{ color: "green" }}>
                                Sale Rate *
                              </span>
                            )}{" "}
                          </Label>
                          <Input
                            readOnly
                            type="text"
                            placeholder="Sales Rate"
                            name="SalesRate"
                            value={element.SalesRate?.toFixed(2) || ""}
                            onChange={(e) => this.handleChange(index, e)}
                          />
                        </Col>
                        <Col lg="1" md="1" sm="6">
                          {" "}
                          <Label>Grade Dis.</Label>
                          <Input
                            type="text"
                            readOnly
                            placeholder="Grade Discount"
                            name="maxDiscount"
                            value={element.maxDiscount || 0}
                            onChange={(e) => this.handleChange(index, e)}
                          />
                        </Col>
                        <Col lg="1" md="1" sm="6">
                          {" "}
                          <Label>Tax</Label>
                          <Input
                            type="text"
                            readOnly
                            name="GSTRate"
                            placeholder="GST Rate"
                            value={element.GSTRate || ""}
                            onChange={(e) => this.handleChange(index, e)}
                          />
                        </Col>
                        <Col lg="1" md="1" sm="6">
                          <Label>MRP *</Label>
                          <Input
                            required
                            type="text"
                            name="Product_MRP"
                            value={
                              (element.Product_MRP && element.Product_MRP) || ""
                            }
                            onChange={(e) => this.handleChange(index, e)}
                          />
                        </Col>

                        {/* <Col></Col> */}
                        {/* <div className="form-inline" key={index}>
                      {index ? (
                        <button
                          type="button"
                          className="button remove"
                          onClick={() => this.removeFormFields(index)}>
                          Remove
                        </button>
                      ) : null}
                    </div> */}
                      </Row>
                    ))}
                  <Row>
                    {this.state.loading ? (
                      <>
                        <Col>
                          <div className="mt-1 d-flex justify-content-center">
                            <Button
                              disabled={`${this.state.loading ? true : false}`}
                              color="secondary">
                              Submitting ...
                            </Button>
                          </div>
                        </Col>
                      </>
                    ) : (
                      <>
                        <Col>
                          <div className="mt-1 d-flex justify-content-center">
                            <Button type="Submit" color="primary">
                              Submit
                            </Button>
                          </div>
                        </Col>
                      </>
                    )}
                  </Row>
                  {/* <Row>
                  
                  <div className="button-section">
                    <button
                      className="button add"
                      type="button"
                      onClick={() => this.addFormFields()}>
                      Add
                    </button>
                    <button className="button submit" type="submit">
                      Submit
                    </button>
                  </div>
                </Row> */}
                </>
              </Form>
            ) : (
              <>
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
                  <Col
                    lg="2"
                    md="2"
                    sm="12"
                    xl="2"
                    xs="12"
                    className="colarrowbtn">
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

                                              if (
                                                SelectedCols &&
                                                delindex >= 0
                                              ) {
                                                const splicedElement =
                                                  SelectedCols.splice(
                                                    delindex,
                                                    1
                                                  ); // Remove the element
                                                // splicedElement contains the removed element, if needed

                                                this.setState({
                                                  SelectedcolumnDefs:
                                                    SelectedCols, // Update the state with the modified array
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
                      <Button
                        onClick={this.HandleSetVisibleField}
                        color="primary">
                        Submit
                      </Button>
                    </div>
                  </Col>
                </Row>
              </>
            )}
          </ModalBody>
        </Modal>
      </>
    );
  }
}
export default HouseProductList;
