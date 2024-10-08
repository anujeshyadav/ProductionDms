import React from "react";
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
  CustomInput,
  Spinner,
} from "reactstrap";
import { ContextLayout } from "../../../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import EditAccount from "../accounts/EditAccount";
import ViewAccount from "../accounts/ViewAccount";

import "jspdf-autotable";

import { ChevronDown } from "react-feather";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import "../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../../../assets/scss/pages/users.scss";

import {
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaFilter,
  FaPlus,
} from "react-icons/fa";

import swal from "sweetalert";
import {
  DeleteAccount,
  View_PromotionList,
} from "../../../../ApiEndPoint/ApiCalling";
import {
  BsFillArrowDownSquareFill,
  BsFillArrowUpSquareFill,
} from "react-icons/bs";

import UserContext from "../../../../context/Context";
import { CheckPermission } from "./CheckPermission";
import SuperAdminUI from "../../../SuperAdminUi/SuperAdminUI";
import { ImDownload } from "react-icons/im";
import {
  convertDataCSVtoExcel,
  convertDataCsvToXml,
  exportDataToExcel,
  exportDataToPDF,
} from "./Downloader";

const SelectedColums = [];

class PromotionalActivityList extends React.Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.gridRef = React.createRef();
    this.gridApi = null;
    this.state = {
      isOpen: false,
      Table: false,
      InsiderPermissions: {},
      TableFilterValue: "",
      PromotionName: "",
      SelectedFilter: "",
      MasterShow: false,
      Arrindex: "",
      rowData: [],
      setMySelectedarr: [],
      Dropdown: [],
      AllData: [],
      SelectedCols: [],
      paginationPageSize: 15,
      currenPageSize: "",
      getPageSize: "",
      columnDefs: [],
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

  // handleChangeEdit = (data, types) => {
  //   let type = types;
  //   if (type == "readonly") {
  //     this.setState({ ViewOneUserView: true });
  //     this.setState({ ViewOneData: data });
  //   } else {
  //     this.setState({ EditOneUserView: true });
  //     this.setState({ EditOneData: data });
  //   }
  // };

  async Apicalling(id, db) {
    this.setState({ Loading: true });
    await View_PromotionList(id, db)
      .then((res) => {
        this.setState({ Loading: false });

        let keys = Object.keys(res?.Promotion[0]);
        let myarr = keys.filter(
          (item) =>
            item !== "_id" &&
            item !== "__v" &&
            item !== "created_by" &&
            item !== "createdAt" &&
            item !== "updatedAt" &&
            item !== "status" &&
            item !== "database"
        );
        // debugger
        console.log(keys);
        let unique = [...new Set(myarr)];
        this.setState({ Dropdown: unique });
        this.setState({ AllData: res?.Promotion?.reverse() });
      })
      .catch((err) => {
        this.setState({ Dropdown: [] });
        this.setState({ AllData: [] });
        this.setState({ Loading: false });

        console.log(err);
      });
  }

  async componentDidMount() {
    const UserInformation = this.context?.UserInformatio;
    const InsidePermissions = CheckPermission("Promotional Activity");
    this.setState({ InsiderPermissions: InsidePermissions });
    let pageparmission = JSON.parse(localStorage.getItem("userData"));
    if (pageparmission?.rolename?.roleName === "MASTER") {
      this.setState({ MasterShow: true });
    }
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

  exportToPDF = async () => {
    const csvData = this.gridApi.getDataAsCsv({
      processCellCallback: this.processCell,
    });
    await exportDataToPDF(csvData, "PromotionalActivity");
  };
  processCell = (params) => {
    // console.log(params);
    // Customize cell content as needed
    return params.value;
  };

  exportToExcel = async (e) => {
    const CsvData = this.gridApi.getDataAsCsv({
      processCellCallback: this.processCell,
    });
    await exportDataToExcel(CsvData, "PromotionalActivity");
  };

  convertCSVtoExcel = async () => {
    const CsvData = this.gridApi.getDataAsCsv({
      processCellCallback: this.processCell,
    });
    await convertDataCSVtoExcel(CsvData, "PromotionalActivity");
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
    await convertDataCsvToXml(CsvData, "PromotionalActivity");
  };

  HandleSetVisibleField = (e) => {
    e.preventDefault();

    this.gridApi.setColumnDefs(this.state.SelectedcolumnDefs);
    this.setState({ columnDefs: this.state.SelectedcolumnDefs });
    this.setState({ SelectedcolumnDefs: this.state.SelectedcolumnDefs });
    this.setState({ rowData: this.state.rowData });
    localStorage.setItem(
      "PromotionalActivity",
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
  handleFilter = (e) => {
    this.setState({ PromotionName: e.target.value });
    let headings;
    let maxKeys = 0;
    let elementWithMaxKeys = null;
    let AllMainData = [];
    let myHeadings = [];
    // console.log(this.state.AllData);
    if (e.target.value !== "NA") {
      let myarr = this.state.AllData?.filter(
        (ele, i) => ele[e.target.value]?.length
      );
      // console.log(myarr);
      let mydata = myarr?.map((ele, i) => {
        AllMainData?.push(ele[e.target.value]);
      });
      console.log(AllMainData.flat());
      let flatarr = AllMainData?.flat();

      for (const element of flatarr) {
        const numKeys = Object.keys(element).length; // Get the number of keys in the current element
        if (numKeys > maxKeys) {
          maxKeys = numKeys; // Update the maximum number of keys
          elementWithMaxKeys = element; // Update the element with maximum keys
        }
      }
      if (elementWithMaxKeys) {
        let findheading = Object.keys(elementWithMaxKeys);
        let index = findheading.indexOf("_id");
        if (index > -1) {
          findheading.splice(index, 1);
        }
        let index1 = findheading.indexOf("status");
        if (index1 > -1) {
          findheading.splice(index1, 1);
        }
        // if(findheading.indexOf("productId")){

        let index2 = findheading.indexOf("productId");
        if (index2 > -1) {
          findheading.splice(index2, 1);
        }
        // }
        headings = findheading?.map((ele) => {
          if (ele == "freeOtherProducts") {
            return {
              headerName: "freeOtherProducts",
              field: "freeOtherProducts",
              filter: true,
              width: 180,
              cellRendererFramework: (params) => {
                return (
                  <>
                    <div className="d-flex justify-content-center">
                      <span>
                        {params.data?.freeOtherProducts?.length} Product
                      </span>
                    </div>
                  </>
                );
              },
            };
          }
          return {
            headerName: ele,
            field: ele,
            filter: true,
            sortable: true,
          };
        });
        myHeadings = [...headings];
      } else {
        myHeadings = [];
      }

      let Product = [
        // {
        //   headerName: "Actions",
        //   field: "sortorder",
        //   field: "transactions",
        //   width: 190,
        //   cellRendererFramework: (params) => {
        //     console.log(params?.data);
        //     return (
        //       <div className="actions cursor-pointer">
        //         {this.state.InsiderPermissions &&
        //           this.state.InsiderPermissions?.View && (
        //             <Route
        //               render={({ history }) => (
        //                 <Eye
        //                   className="mr-50"
        //                   size="25px"
        //                   color="green"
        //                   onClick={() => {
        //                     history.push({
        //                       pathname: `/app/ajgroup/account/EditPromotionalActivity/${params?.data?._id}`,
        //                       state: {
        //                         data: params?.data,
        //                         key: this.state.PromotionName,
        //                         type: "View",
        //                       },
        //                     });
        //                   }}
        //                 />
        //               )}
        //             />
        //           )}

        //         {this.state.InsiderPermissions &&
        //           this.state.InsiderPermissions?.Edit && (
        //             <Route
        //               render={({ history }) => (
        //                 <Edit
        //                   className="mr-50"
        //                   size="25px"
        //                   color="green"
        //                   onClick={() => {
        //                     history.push({
        //                       pathname: `/app/ajgroup/account/EditPromotionalActivity/${params?.data?._id}`,
        //                       state: {
        //                         data: params?.data,
        //                         key: this.state.PromotionName,
        //                         type: "Edit",
        //                       },
        //                     });
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
        //                   className="mr-50"
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

        ...myHeadings,
        {
          headerName: "Status",
          field: "status",
          filter: true,
          width: 95,
          cellRendererFramework: (params) => {
            return params.data?.status === "Active" ? (
              <div className="cursor-pointer text-center">
                {params.data?.status}
              </div>
            ) : params.data?.status === "Deactive" ? (
              <div className="cursor-pointer text-center">
                {params.data?.status}
              </div>
            ) : null;
          },
        },
        // {
        //   headerName: "Created date",
        //   field: "createdAt",
        //   filter: true,
        //   sortable: true,
        //   cellRendererFramework: (params) => {
        //     return (
        //       <>
        //         <div className="actions cursor-pointer"></div>
        //       </>
        //     );
        //   },
        // },
        // {
        //   headerName: "Updated date",
        //   field: "updatedAt",
        //   filter: true,
        //   sortable: true,
        //   cellRendererFramework: (params) => {
        //     return (
        //       <>
        //         <div className="actions cursor-pointer"></div>
        //       </>
        //     );
        //   },
        // },
      ];
      if (flatarr) {
        this.setState({ rowData: flatarr });
      } else {
        swal("No Data Found");
      }
      this.setState({ AllcolumnDefs: Product });

      let userHeading = JSON.parse(localStorage.getItem("PromotionalActivity"));
      if (userHeading?.length) {
        this.setState({ columnDefs: userHeading });
        // this.gridApi.setColumnDefs(userHeading);
        this.setState({ SelectedcolumnDefs: userHeading });
      } else {
        this.setState({ columnDefs: Product });
        this.setState({ SelectedcolumnDefs: Product });
      }
      this.setState({ SelectedCols: Product });
      if (myarr.length) {
        this.setState({ Table: true });
      } else {
        this.setState({ Table: false });
      }
    } else {
      this.setState({ Table: false });
    }
    this.setState({ SelectedFilter: e.target.value });
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

              <EditAccount EditOneData={this.state.EditOneData} />
            </Row>
          ) : (
            <>
              {this.state.ViewOneUserView && this.state.ViewOneUserView ? (
                <>
                  <Row className="card">
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
                    <ViewAccount ViewOneData={this.state.ViewOneData} />
                  </Row>
                </>
              ) : (
                <>
                  <Col sm="12">
                    <Card>
                      <Row
                        style={{
                          marginRight: "3px",
                         
                          marginLeft: "3px",
                           
                        }}>
                        <Col  >
                          <h2
                            className="float-left"
                           style={{ fontWeight: "600" ,textTransform:'uppercase', fontSize:'18px' ,marginTop:"25px"}}>
                            Promotional list
                          </h2>
                        </Col>

                        {this.state.MasterShow ? (
                          <Col
                            lg="3"
                            md="3"
                            sm="12"
                            style={{ marginTop: "25px" }}>
                            <div className="">
                              <SuperAdminUI
                                onDropdownChange={this.handleDropdownChange}
                                onSubmit={this.handleParentSubmit}
                              />
                            </div>
                          </Col>
                        ) : (
                          <Col></Col>
                        )}

                        {this.state.InsiderPermissions &&
                          this.state.InsiderPermissions?.View && (
                            <Col
                              lg="3"
                              md="3"
                              xs="12"
                              style={{ marginTop: "25px" }}>
                              <CustomInput
                                type="select"
                                name="typeofpromotion"
                                style={{height:"35px"}}
                                className="float-right promotiondropdowncss"
                                onChange={(e) => this.handleFilter(e)}>
                                <option value="NA">
                                  --Select Promotion Type--
                                </option>
                                {this.state.Dropdown &&
                                  this.state.Dropdown?.map((ele, i) => {
                                    return (
                                      <>
                                        <option
                                          value={ele}
                                          style={{
                                            textTransform: "capitalize",
                                          }}>
                                          {" "}
                                          {ele}
                                        </option>
                                      </>
                                    );
                                  })}
                              </CustomInput>
                            </Col>
                          )}
                        <Col
                          lg="2"
                          md="2"
                          sm="12"
                          style={{ marginTop: "25px" }}>
                          <div className="">
                             
                            <div className="table-input cssforproductlist">
                              <Input
                                placeholder="search Item here..."
                                onChange={(e) =>
                                  this.updateSearchQuery(e.target.value)
                                }
                                value={this.state.value}
                              />
                            </div>
                          </div>
                        </Col>
                        <Col lg="1" xs="8" style={{ marginTop: "25px" }}>
                          {this.state.InsiderPermissions &&
                            this.state.InsiderPermissions?.Create && (
                              <span>
                                <Route
                                  render={({ history }) => (
                                    <Button
                                      style={{
                                        cursor: "pointer",
                                        backgroundColor: "rgb(8, 91, 245)",
                                        color: "white",
                                        fontWeight: "600",
                                        height: "35px",
                                        paddingLeft: "-8px",
                                        paddingRight: "-8px",
                                      }}
                                      className="float-left csss645sd"
                                      color="#39cccc"
                                      onClick={() =>
                                        history.push(
                                          "/app/ajgroup/account/CreatePromotionalActivity"
                                        )
                                      }>
                                      <FaPlus size={14} /> Activiity
                                    </Button>
                                  )}
                                />
                              </span>
                            )}
                        </Col>

                        <Col lg="1" md="1" xs="4" style={{ marginTop: "25px" }}>
                          {this.state.InsiderPermissions &&
                            this.state.InsiderPermissions?.View && (
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
                            {this.state.Table && this.state.Table ? (
                              <>
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
                              </>
                            ) : null}
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
      </>
    );
  }
}
export default PromotionalActivityList;
