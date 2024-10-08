import React from "react";
import {
    Card,
    CardBody,
    Input, Label,
    Row, CustomInput,
    Col, Form,
    UncontrolledDropdown,
    DropdownMenu,
    DropdownItem,
    DropdownToggle,
    Button,
} from "reactstrap";
import axiosConfig from "../../../../axiosConfig";
import { ContextLayout } from "../../../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import { Eye, Trash2, ChevronDown } from "react-feather";
import { history } from "../../../../history";
import "../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../../../assets/scss/pages/users.scss";
import Moment from "react-moment";
import swal from 'sweetalert';
class StockReport extends React.Component {
    state = {
        rowData: [],
        paginationPageSize: 20,
        currenPageSize: "",
        getPageSize: "",
        defaultColDef: {
            sortable: true,
            editable: true,
            resizable: true,
            suppressMenu: true,
        },
        columnDefs: [
            {
                headerName: "S.No",
                valueGetter: "node.rowIndex + 1",
                field: "node.rowIndex + 1",
                width: 150,
                filter: true,
            },
            {
                headerName: "Product Name",
                field: "you_are",
                filter: true,
                resizable: true,
                width: 180,
                cellRendererFramework: (params) => {
                    return (
                        <div className="d-flex align-items-center cursor-pointer">
                            <div className="ml-2">
                                <span>{params.data.you_are}</span>
                            </div>
                        </div>
                    );
                },
            },
            {
                headerName: "Date",
                field: "createdAt",
                filter: "agSetColumnFilter",
                width: 180,
                cellRendererFramework: (params) => {
                    return (
                        <div className="d-flex align-items-center cursor-pointer">
                            <div className="">
                                <span>
                                    <Moment format="lll">{params.data.createdAt}</Moment>
                                </span>
                            </div>
                        </div>
                    );
                },
            },
            {
                headerName: "Total Stock",
                field: "pending_amount",
                filter: true,
                resizable: true,
                width: 180,
                cellRendererFramework: (params) => {
                    return (
                        <div className="d-flex align-items-center cursor-pointer">
                            <div className="ml-2">
                                <span>{params.data.comments}</span>
                            </div>
                        </div>
                    );
                },
            },


            // {
            //     headerName: "Actions",
            //     field: "sortorder",
            //     field: "transactions",
            //     width: 100,
            //     cellRendererFramework: (params) => {
            //         return (
            //             <div className="actions cursor-pointer">
            //                 <Eye
            //                     className="mr-50"
            //                     size="25px"
            //                     color="green"
            //                     onClick={() =>
            //                         history.push(`/app/freshlist/refundrequest/viewApprovedRequest/${params.data._id}`)}
            //                 />

            //             </div>
            //         );
            //     },
            // },
        ],
    }
    async componentDidMount() {
        await axiosConfig.get("/allcontactus").then((response) => {
            let rowData = response.data.data;
            this.setState({ rowData });
        });
    }

    async runthisfunction(id) {
        console.log(id);
        await axiosConfig.get(`/delcontactus/${id}`).then((response) => {
            console.log(response);
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
    onChangeHandler = (event) => {
        this.setState({ selectedFile: event.target.files[0] });
        this.setState({ selectedName: event.target.files[0].name });
        console.log(event.target.files[0]);
    };
    onChangeHandler = (event) => {
        this.setState({ selectedFile: event.target.files });
        this.setState({ selectedName: event.target.files.name });
        console.log(event.target.files);
    };
    changeHandler1 = (e) => {
        this.setState({ status: e.target.value });
    };
    changeHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };
    submitHandler = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("banner_title", this.state.banner_title);
        data.append("bannertype", this.state.bannertype);
        data.append("status", this.state.status);
        for (const file of this.state.selectedFile) {
            if (this.state.selectedFile !== null) {
                data.append("banner_img", file, file.name);
            }
        }
        for (var value of data.values()) {
            console.log(value);
        }
        for (var key of data.keys()) {
            console.log(key);
        }
        axiosConfig.post("/addbanner", data)
            .then((response) => {
                console.log(response);
                swal("Successful!", "You clicked the button!", "success");
                this.props.history.push("/app/freshlist/banner/bannerList");
            })
            .catch((error) => {
                console.log(error);
            });
    };

    render() {
        const { rowData, columnDefs, defaultColDef } = this.state;
        return (
          <Row className="app-user-list">
            <Col sm="12">
              <Card>
                <Row className="m-2">
                  <Col>
                    <h1 col-sm-6 className="float-left">
                      Product Stock
                    </h1>
                  </Col>
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
                          {/* <div className="table-input mr-1">
                                                <Input
                                                    placeholder="search..."
                                                    onChange={(e) =>
                                                        this.updateSearchQuery(e.target.value)
                                                    }
                                                    value={this.state.value}
                                                />
                                            </div> */}
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
export default StockReport;