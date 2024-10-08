import React from "react";
import {
  Card,
  CardBody,
  Input,
  Row,
  Col,
  Button,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Badge,
} from "reactstrap";
import { Route, Link } from "react-router-dom";
import swal from "sweetalert";
import { AgGridReact } from "ag-grid-react";
import { Edit, Trash2, ChevronDown, Eye } from "react-feather";

import axiosConfig from "../../../../../axiosConfig";
import { ContextLayout } from "../../../../../utility/context/Layout";
import { history } from "../../../../../history";
import "../../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../../../../assets/scss/pages/users.scss";


class RawmaterialOutward extends React.Component {
  state = {
    rowData: [],
    Viewpermisson: null,
    Editpermisson: null,
    Createpermisson: null,
    Deletepermisson: null,
    paginationPageSize: 20,
    currenPageSize: "",
    getPageSize: "",
    defaultColDef: {
      sortable: true,
      resizable: true,
      suppressMenu: true,
    },
    columnDefs: [
      {
        headerName: "S.No",
        valueGetter: "node.rowIndex + 1",
        field: "node.rowIndex + 1",
        width: 100,
        filter: true,
      },
      {
        headerName: "WareHouseName",
        field: "WareHouseName",
        filter: true,
        width: 200,
        cellRendererFramework: (params) => {
          return (
            <div className="d-flex align-items-center cursor-pointer">
              <span>{params?.data?.category_name}</span>
            </div>
          );
        },
      },
      {
        headerName: "Mobile",
        field: "mobile",
        filter: true,
        width: 200,
        cellRendererFramework: (params) => {
          return (
            <div className="d-flex align-items-center cursor-pointer">
              <span>{params?.data?.category_name}</span>
            </div>
          );
        },
      },
      {
        headerName: "Email",
        field: "Email",
        filter: true,
        width: 200,
        cellRendererFramework: (params) => {
          return (
            <div className="d-flex align-items-center cursor-pointer">
              <span>{params?.data?.category_name}</span>
            </div>
          );
        },
      },
     {
        headerName: "Status",
        field: "status",
        filter: true,
        width: 100,
        cellRendererFramework: (params) => {
          return params.data.status === "Active" ? (
            <div className="badge badge-pill badge-success">
              {params.data.status}
            </div>
          ) : params.data.status === "Deactive" ? (
            <div className="badge badge-pill badge-warning">
              {params.data.status}
            </div>
          ) : null;
        },
      },
      {
        headerName: "Actions",
        field: "sortorder",
        field: "transactions",
        width: 150,
        cellRendererFramework: (params) => {
          return (
            <div className="actions cursor-pointer">
              {/* {this.state.Viewpermisson && (
                <Route
                  render={({ history }) => (
                    <>
                      <Route
                        render={({ history }) => (
                          <Eye
                            className="mr-50"
                            size="25px"
                            color="green"
                            onClick={() =>
                              history.push(
                                `/app/freshlist/category/editCategory/${params?.data?.id}`
                              )
                            }
                          />
                        )}
                      />
                    </>
                  )}
                />
              )} */}
              {this.state.Editpermisson && (
                <Route
                  render={({ history }) => (
                    <Edit
                      className="mr-50"
                      size="25px"
                      color="blue"
                      onClick={() =>
                        history.push(
                          `/app/freshlist/category/editCategory/${params?.data?.id}`
                        )
                      }
                    />
                  )}
                />
              )}
              {this.state.Deletepermisson && (
                <Route
                  render={({ history }) => (
                    <Trash2
                      className="mr-50"
                      size="25px"
                      color="red"
                      onClick={() => {
                        this.runthisfunction(params?.data?.id);
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
  };

  async componentDidMount() {
    let pageparmission = JSON.parse(localStorage.getItem("userData"));

    let newparmisson = pageparmission?.role?.find(
      (value) => value?.pageName === "Category List"
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

    const data = new FormData();

    data.append("user_id", pageparmission?.Userinfo?.id);
    data.append("role", pageparmission?.Userinfo?.role);

    await axiosConfig.post("/getcategory", data).then((response) => {
      let rowData = response.data.data?.category;
      console.log(rowData);
      if (rowData) {
        this.setState({ rowData });
      }
    });
  }

  async runthisfunction(id) {
    console.log(id);
    let selectedData = this.gridApi.getSelectedRows();

    swal("Warning", "Sure You Want to Delete it", {
      buttons: {
        cancel: "Cancel",
        catch: { text: "Delete ", value: "delete" },
      },
    }).then((value) => {
      switch (value) {
        case "delete":
          let data = new FormData();
          let pageparmission = JSON.parse(localStorage.getItem("userData"));
          data.append("user_id", pageparmission?.Userinfo?.id);
          data.append("role", pageparmission?.Userinfo?.role);
          data.append("tablename", "category");
          data.append("delete_id", id);
          axiosConfig
            .post("/deleterecord", data)
            .then((resp) => {
              console.log(resp?.data.message);
              if (resp?.data.success) {
                swal("Success", "Category Deleted Successfully");
                this.gridApi.updateRowData({ remove: selectedData });
              }
              if (!resp?.data?.success) {
                console.log("object");
                swal("Error", `${resp?.data.message}`);
              }
            })
            .catch((err) => {
              console.log(err);
              // swal("Somethig Went Wrong");
            });

          break;
        default:
      }
    });
  }
  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
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
  render() {
    const { rowData, columnDefs, defaultColDef } = this.state;
    return (
      // console.log(rowData),
      <Row className="app-user-list">
        <Col sm="12"></Col>
        <Col sm="12">
          <Card>
            <Row className="m-2">
              <Col>
                <h1 sm="6" className="float-left">
                  Raw Material Outward List
                </h1>
              </Col>
              <Col>
                <Button
                  style={{ cursor: "pointer" }}
                  className="btn btn-primary float-right"
                  onClick={() =>
                    this.props.history.push(
                      "/app/softNumen/warehouse/CreateWareHouse"
                    )
                  }>
                  + RawMaterialOutward
                </Button>
              </Col>
              {/* <Col>
                {this.state.Createpermisson && (
                  <Route
                    render={({ history }) => (
                      <Button
                        className="btn float-right"
                        color="primary"
                        onClick={() =>
                          history.push("/app/freshlist/category/addCategory")
                        }
                      >
                        Add Category
                      </Button>
                    )}
                  />
                )}
              </Col> */}
            </Row>
            <CardBody>
              {this.state.rowData === null ? null : (
                <div className="ag-theme-material w-100 my-2 ag-grid-table">
                  <div className="d-flex flex-wrap justify-content-between align-items-center">
                    <div className="mb-1">
                      <UncontrolledDropdown className="p-1 ag-dropdown">
                        <DropdownToggle tag="div">
                          {this.gridApi
                            ? this.state.currenPageSize
                            : "" * this.state.getPageSize -
                              (this.state.getPageSize - 1)}{" "}
                          -{" "}
                          {this.state.rowData.length -
                            this.state.currenPageSize * this.state.getPageSize >
                          0
                            ? this.state.currenPageSize * this.state.getPageSize
                            : this.state.rowData.length}{" "}
                          of {this.state.rowData.length}
                          <ChevronDown className="ml-50" size={15} />
                        </DropdownToggle>
                        <DropdownMenu right>
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
                    <div className="d-flex flex-wrap justify-content-between mb-1">
                      <div className="table-input mr-1">
                        <Input
                          placeholder="search..."
                          onChange={(e) =>
                            this.updateSearchQuery(e.target.value)
                          }
                          value={this.state.value}
                        />
                      </div>
                      <div className="export-btn">
                        <Button.Ripple
                          color="primary"
                          onClick={() => this.gridApi.exportDataAsCsv()}>
                          Export as CSV
                        </Button.Ripple>
                      </div>
                    </div>
                  </div>
                  <ContextLayout.Consumer>
                    {(context) => (
                      <AgGridReact
                        gridOptions={{}}
                        rowSelection="multiple"
                        defaultColDef={defaultColDef}
                        columnDefs={columnDefs}
                        rowData={rowData}
                        onGridReady={this.onGridReady}
                        colResizeDefault={"shift"}
                        animateRows={true}
                        floatingFilter={false}
                        // pagination={true}
                        paginationPageSize={this.state.paginationPageSize}
                        pivotPanelShow="always"
                        enableRtl={context.state.direction === "rtl"}
                      />
                    )}
                  </ContextLayout.Consumer>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}
export default RawmaterialOutward;