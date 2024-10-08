import React from "react";
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
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaPencilAlt } from "react-icons/fa";
import CreateUserSample from "../UploadFormats/CreateUserSample.xlsx";
import UserForm from "../UploadFormats/UserForm.pdf";
import { ImDownload } from "react-icons/im";
import { ContextLayout } from "../../../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import EditAccount from "../accounts/EditAccount";
import ViewAccount from "../accounts/ViewAccount";
import "jspdf-autotable";

import { Eye, Trash2, ChevronDown } from "react-feather";
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
import { DeleteAccount, _Get } from "../../../../ApiEndPoint/ApiCalling";
import {
  BsFillArrowDownSquareFill,
  BsFillArrowUpSquareFill,
} from "react-icons/bs";
import UserContext from "../../../../context/Context";
import { CheckPermission } from "./CheckPermission";
import SuperAdminUI from "../../../SuperAdminUi/SuperAdminUI";
import { Create_Account_List } from "../../../../ApiEndPoint/Api";
import {
  convertDataCSVtoExcel,
  convertDataCsvToXml,
  exportDataToExcel,
  exportDataToPDF,
} from "./Downloader";

const SelectedColums = [];

class AccounSearch extends React.Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.gridRef = React.createRef();
    this.gridApi = null;
    this.state = {
      isOpen: false,
      MasterShow: false,
      InsiderPermissions: {},
      Arrindex: "",
      rowData: [],
      rowAllData: [],
      setMySelectedarr: [],
      SelectedCols: [],
      paginationPageSize: 15,
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
        //   headerName: "Status",
        //   field: "status",
        //   filter: true,
        //   width: 150,
        //   cellRendererFramework: (params) => {
        //     return params.data?.status === "Active" ? (
        //       <div className="badge badge-pill badge-success">
        //         {params.data?.status}
        //       </div>
        //     ) : params.data?.status === "Deactive" ? (
        //       <div className="badge badge-pill badge-warning">
        //         {params.data?.status}
        //       </div>
        //     ) : null;
        //   },
        // },

        // {
        //   headerName: "Image",
        //   field: "image",
        //   filter: true,
        //   sortable: true,
        //   editable: true,

        //   cellRendererFramework: (params) => {
        //     return (
        //       <>
        //         <div className="actions cursor-pointer d-flex justify-content-center">
        //           {params?.data?.image && (
        //             <img
        //               style={{ borderRadius: "10px" }}
        //               src={params?.data?.image ? params?.data?.image : null}
        //               height={45}
        //               width={45}
        //             />
        //           )}
        //         </div>
        //       </>
        //     );
        //   },
        // },

        {
          headerName: "id",
          field: "id",
          filter: true,
          sortable: true,
          editable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <Route
                  render={({ history }) => (
                    <div className="actions cursor-pointer text-center">
                      <span>{params?.data?.id}</span>
                    </div>
                  )}
                />
              </>
            );
          },
        },
        {
          headerName: "Full Name",
          field: "firstName",
          filter: true,
          width: 300,
          sortable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <div style={{ color: "black" }}>
                  <Link
                    style={{ color: "black" }}
                    title="Click to Edit User"
                    to={`/app/SoftNumen/account/CreateAccount/${params?.data?._id}`}>
                    {params?.data?.firstName}
                  </Link>
                </div>
                {/* <Route
                  render={({ history }) => (
                    <div
                      onClick={() =>
                        history.push(
                          `/app/SoftNumen/account/ViewAccount/${params?.data?._id}`
                        )
                      }
                      className="actions cursor-pointer text-center">
                      <span>
                        {params?.data?.firstName} {params?.data?.lastName}
                      </span>
                    </div>
                  )}
                /> */}
              </>
            );
          },
        },
        // {
        //   headerName: "Last Name",
        //   field: "lastName",
        //   filter: true,
        //   sortable: true,

        //   cellRendererFramework: (params) => {
        //     return (
        //       <>
        //         <div className="actions cursor-pointer text-center">
        //           <span>{params?.data?.lastName}</span>
        //         </div>
        //       </>
        //     );
        //   },
        // },
        {
          headerName: "Email",
          field: "email",
          filter: true,
          width: 300,
          sortable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer text-center">
                  <span>{params?.data?.email}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "Mobile Number",
          field: "mobileNumber",
          filter: true,
          width: 125,
          sortable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer text-center">
                  <span>{params?.data?.mobileNumber}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "Pin Code",
          field: "pincode",
          filter: true,
          width: 80,
          sortable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer text-center">
                  <span>{params?.data?.pincode}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "Aadhar No",
          field: "Aadhar_No",
          filter: true,
          width: 95,
          sortable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer text-center">
                  <span>{params?.data?.Aadhar_No}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "Bank Name",
          field: "Account_Name",
          filter: true,
          sortable: true,
          width: 140,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer text-center">
                  <span>{params?.data?.Account_Name}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "Account No",
          field: "Account_No",
          filter: true,
          sortable: true,
          width: 140,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer text-center">
                  <span>{params?.data?.Account_No}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "IFSC Code",
          field: "Ifsc_code",
          filter: true,
          sortable: true,
          width: 90,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer text-center">
                  <span>{params?.data?.Ifsc_code}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "City",
          field: "City",
          filter: true,
          width: 140,
          sortable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer text-center">
                  <span>{params?.data?.City}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "State",
          field: "State",
          filter: true,
          width: 140,
          sortable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer text-center">
                  <span>{params?.data?.State}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "DL No.",
          field: "DL_Num",
          filter: true,
          width: 80,
          sortable: true,

          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer text-center">
                  <span>{params?.data?.DL_Num}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "Date of Birth",
          field: "DOB",
          filter: true,
          sortable: true,
          width: 115,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer text-center">
                  <span>{params?.data?.DOB?.split("T")[0]}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "Father Name",
          field: "Father_name",
          width: 120,
          filter: true,
          sortable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer text-center">
                  <span>{params?.data?.Father_name}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "Pan No",
          field: "Pan_No",
          width: 95,
          filter: true,
          sortable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer text-center">
                  <span>{params?.data?.Pan_No}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "Passport No",
          field: "PassportNo",
          width: 105,
          filter: true,
          sortable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer text-center">
                  <span>{params?.data?.PassportNo}</span>
                </div>
              </>
            );
          },
        },
        // {
        //   headerName: "Address",
        //   field: "address",
        //   filter: true,
        //   width: 300,
        //   sortable: true,
        //   cellRendererFramework: (params) => {
        //     return (
        //       <>
        //         <div className="actions cursor-pointer text-center">
        //           <span>{params?.data?.address}</span>
        //         </div>
        //       </>
        //     );
        //   },
        // },
        {
          headerName: "Salary",
          field: "last_job_Salary",
          filter: true,
          width: 100,
          sortable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer text-center">
                  <span>{params?.data?.last_job_Salary}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "Last Job Profile",
          field: "last_job_Profile",
          filter: true,
          width: 190,
          sortable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer text-center">
                  <span>{params?.data?.last_job_Profile}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "Last Job Address",
          field: "last_job_address",
          filter: true,
          sortable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer text-center">
                  <span>{params?.data?.last_job_address}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "Firm Name",
          field: "last_job_firm_name",
          filter: true,
          sortable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer text-center">
                  <span>{params?.data?.last_job_firm_name}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "Address",
          field: "address1",
          filter: true,
          sortable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer text-center">
                  <span>{params?.data?.address1}</span>
                </div>
              </>
            );
          },
        },
        {
          headerName: "Address One",
          field: "address2",
          filter: true,
          sortable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer text-center">
                  <span>{params?.data?.address2}</span>
                </div>
              </>
            );
          },
        },

        // {
        //   headerName: "Created Date",
        //   field: "createdAt",
        //   filter: true,
        //   sortable: true,
        //   cellRendererFramework: (params) => {
        //     return (
        //       <>
        //         <div className="actions cursor-pointer text-center">
        //           <span>{params?.data?.createdAt?.split("T")[0]}</span>
        //         </div>
        //       </>
        //     );
        //   },
        // },
        // {
        //   headerName: "Updated Date",
        //   field: "updatedAt",
        //   filter: true,
        //   sortable: true,
        //   cellRendererFramework: (params) => {
        //     return (
        //       <>
        //         <div className="actions cursor-pointer text-center">
        //           <div className="actions cursor-pointer">
        //             <span>{params?.data?.updatedAt?.split("T")[0]}</span>
        //           </div>
        //         </div>
        //       </>
        //     );
        //   },
        // },
        {
          headerName: "Role Name",
          field: "rolename.roleName",
          filter: true,
          width: 170,
          sortable: true,
          cellRendererFramework: (params) => {
            return (
              <>
                <div className="actions cursor-pointer text-center">
                  <span>{params?.data?.rolename?.roleName}</span>
                </div>
              </>
            );
          },
        },
        // {
        //   headerName: "Role Id",
        //   field: "rolename.id",
        //   filter: true,
        //   sortable: true,
        //   editable: true,

        //   cellRendererFramework: (params) => {
        //     return (
        //       <>
        //         <div className="actions cursor-pointer text-center">
        //           <span>{params?.data?.rolename?.id}</span>
        //         </div>
        //       </>
        //     );
        //   },
        // },
        // {
        //   headerName: "Created by",
        //   field: "created_by.firstName",
        //   filter: true,
        //   sortable: true,
        //   cellRendererFramework: (params) => {
        //     return (
        //       <>
        //         <div className="actions cursor-pointer text-center">
        //           <span>{params?.data?.created_by?.firstName}</span>
        //         </div>
        //       </>
        //     );
        //   },
        // },
        {
          headerName: "Actions",
          field: "sortorder",
          field: "transactions",
          width: 110,
          cellRendererFramework: (params) => {
            return (
              <div className="actions cursor-pointer text-center">
                {this.state.InsiderPermissions &&
                  this.state.InsiderPermissions?.View && (
                    <Route
                      render={({ history }) => (
                        <span
                          style={{
                            border: "1px solid white",
                            padding: "5px",
                            borderRadius: "15px",
                            backgroundColor: "#39cccc",
                          }}>
                          <Eye
                            className=""
                            size="20px"
                            color="white"
                            onClick={() =>
                              history.push(
                                `/app/SoftNumen/account/ViewAccount/${params?.data?._id}`
                              )
                            }
                          />
                        </span>
                      )}
                    />
                  )}
                {this.state.InsiderPermissions &&
                  this.state.InsiderPermissions?.Edit && (
                    <Route
                      render={({ history }) => (
                        <span
                          style={{
                            border: "1px solid white",
                            padding: "5px",
                            borderRadius: "15px",
                            backgroundColor: "rgb(212, 111, 16)",
                            marginLeft: "3px",
                          }}>
                          <FaPencilAlt
                            className=""
                            size="15px"
                            color="white"
                            onClick={() =>
                              history.push(
                                `/app/SoftNumen/account/CreateAccount/${params?.data?._id}`
                              )
                            }
                          />
                        </span>
                      )}
                    />
                  )}
                {this.state.InsiderPermissions &&
                  this.state.InsiderPermissions?.Delete && (
                    <Route
                      render={() => (
                        <span
                          style={{
                            border: "1px solid white",
                            padding: "5px",
                            borderRadius: "15px",
                            backgroundColor: "rgb(236, 24, 9)",
                            marginLeft: "3px",
                          }}>
                          <Trash2
                            className=""
                            size="15px"
                            color="white"
                            onClick={() => {
                              this.runthisfunction(params?.data?._id);
                            }}
                          />
                        </span>
                      )}
                    />
                  )}
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

  LookupviewStart = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };

  async Apicalling(id, db) {
    let userinfo = JSON.parse(localStorage.getItem("userData"));

    this.setState({ Loading: true, AllcolumnDefs: this.state.columnDefs });

    let userHeading = JSON.parse(localStorage.getItem("AccountSearch"));
    if (userHeading?.length) {
      this.setState({
        columnDefs: userHeading,
        SelectedcolumnDefs: userHeading,
      });
      // this.gridApi.setColumnDefs(userHeading);
    } else {
      this.setState({
        columnDefs: this.state.columnDefs,
        SelectedcolumnDefs: this.state.columnDefs,
      });
    }
    this.setState({ SelectedCols: this.state.columnDefs });
    // let RegisterUser = [];
    // let URl = `${RegisterForAttendanceHRM}/${db}`;
    // await Axios.get(URl)
    //   .then((res) => {
    //     let value = res?.data?.User;
    //     if (value?.length > 0) {
    //       RegisterUser = value;
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    let url = `${Create_Account_List + id}/`;
    await _Get(url, db)
      .then((res) => {
        this.setState({ Loading: false });
        let value = res?.adminDetails;

        if (value?.length > 0) {
          let selected = value?.filter(
            (ele) => ele?.rolename?.roleName !== userinfo?.rolename.roleName
          );

          this.setState({ rowData: selected });
          this.setState({ rowAllData: selected });
        }
      })
      .catch((err) => {
        this.setState({ Loading: false, rowData: [] });
        console.log(err);
      });
  }

  async componentDidMount() {
    const UserInformation = this.context?.UserInformatio;
    let pageparmission = JSON.parse(localStorage.getItem("userData"));

    if (pageparmission?.rolename?.roleName === "MASTER") {
      this.setState({ MasterShow: true });
    }
    const InsidePermissions = CheckPermission("Create User");
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
    await exportDataToPDF(csvData, "UserList");
  };
  processCell = (params) => {
    return params.value;
  };

  exportToExcel = async (fileName, e) => {
    this.state.rowAllData?.forEach((ele) => {
      ele["rolename"] = ele?.rolename?.id ? ele?.rolename?.id : ele?.rolename;
      if (ele?.branch?.id) {
        ele["branch"] =
          ele?.branch?.id && ele?.branch?.id ? ele?.branch?.id : ele?.branch;
      }
      if (ele?.shift?.id) {
        ele["shift"] =
          ele?.shift?.id && ele?.shift?.id ? ele?.shift?.id : ele?.shift;
      }
      delete ele?.status;
      delete ele?.lastName;
      delete ele?.createdAt;
      delete ele?.created_by;
      delete ele?.__v;
      delete ele?._id;
      delete ele?.warehouse;
      delete ele?.code;
      delete ele?.database;
      delete ele?.password;
      delete ele?.deviceStatus;
      delete ele?.updatedAt;
      delete ele?.planStatus;
      delete ele?.setRule;
      delete ele?.profileImage;
      delete ele?.otpVerify;
    });

    //origional start
    const worksheet = XLSX.utils.json_to_sheet(this.state.rowAllData);

    // extra code start here
    // Define the range of the worksheet
    const range = XLSX.utils.decode_range(worksheet["!ref"]);

    // First, unlock all cells by default
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = { c: C, r: R };
        const cellRef = XLSX.utils.encode_cell(cellAddress);
        if (!worksheet[cellRef]) worksheet[cellRef] = {}; // Create the cell if it doesn't exist
        worksheet[cellRef].s = { locked: false }; // Unlock all cells
      }
    }

    // Lock the first row (R = 0)
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = { c: C, r: 0 }; // Address for the first row (row 0)
      const cellRef = XLSX.utils.encode_cell(cellAddress);
      if (!worksheet[cellRef]) worksheet[cellRef] = {}; // Create the cell if it doesn't exist
      worksheet[cellRef].s = { locked: true }; // Lock the first row cells
    }

    // Lock the first column (C = 0)
    for (let R = range.s.r; R <= range.e.r; ++R) {
      const cellAddress = { c: 0, r: R }; // Address for the first column (column 0)
      const cellRef = XLSX.utils.encode_cell(cellAddress);
      if (!worksheet[cellRef]) worksheet[cellRef] = {}; // Create the cell if it doesn't exist
      worksheet[cellRef].s = { locked: true }; // Lock the first column cells
    }

    // Enable sheet protection (locks only the first row and first column)
    // worksheet["!protect"] = {
    //   selectLockedCells: true, // Can select locked cells
    //   selectUnlockedCells: true, // Can select unlocked cells
    //   sheet: true, // Enable sheet protection
    //   objects: false, // Prevent editing objects (e.g., charts)
    //   scenarios: false, // Prevent editing scenarios
    // };

    // extra code end here

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
    this.setState({ rowAllData: this.state.rowData });

    // origional ending here

    // const CsvData = this.gridApi.getDataAsCsv({
    //   processCellCallback: this.processCell,
    // });
    // const csvLines = CsvData.split("\r\n");
    // csvLines.shift();
    // let data = this.state.columnDefs?.map((ele) => {
    //   if (ele?.field?.includes(".")) {
    //     return ele?.field?.split(".")[1];
    //   } else {
    //     return ele?.field;
    //   }
    // });
    // data[0] = "UID";
    // csvLines.unshift(data);
    // const newCsvData = csvLines.join("\r\n");

    // await exportDataToExcel(newCsvData, "UserList", this.state.rowData);
  };

  convertCSVtoExcel = async (fileName) => {
    this.state.rowData?.forEach((ele) => {
      delete ele?.status;
      delete ele?.createdAt;
      delete ele?.created_by;
      delete ele?.__v;
      delete ele?._id;
      delete ele?.warehouse;
      delete ele?.code;
      delete ele?.database;
      delete ele?.rolename;
      delete ele?.password;
      delete ele?.deviceStatus;
      delete ele?.updatedAt;
      delete ele?.planStatus;
      delete ele?.setRule;
      delete ele?.branch;
      delete ele?.shift;
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
    SVtoExcel(CsvData, "UserList", this.state.rowData);
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
    await convertDataCsvToXml(CsvData, "UserList");
  };

  HandleSetVisibleField = (e) => {
    e.preventDefault();
    this.gridApi.setColumnDefs(this.state.SelectedcolumnDefs);
    this.setState({ columnDefs: this.state.SelectedcolumnDefs });
    this.setState({ SelectedcolumnDefs: this.state.SelectedcolumnDefs });

    this.setState({ rowData: this.state.rowData });
    localStorage.setItem(
      "AccountSearch",
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
      InsiderPermissions,
      AllcolumnDefs,
    } = this.state;
    return (
      <>
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
                      <h1 className="float-left">View User</h1>
                    </Col>
                    <Col>
                      <div className="d-flex justify-content-end p-1">
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            this.setState({ ViewOneUserView: false });
                          }}
                          color="danger"
                          style={{ textTransform: "uppercase" }}>
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
                      <Row style={{ marginLeft: "3px", marginRight: "3px" }}>
                        <Col lg="4" xl="4" md="4">
                          <Row>
                            <Col lg="4" md="4" xl="4" xs="12">
                              <h2
                                className="float-left "
                                style={{
                                  fontWeight: "600",
                                  textTransform: "uppercase",
                                  fontSize: "22px",
                                  marginTop: "25px",
                                }}>
                                User list
                              </h2>
                            </Col>
                            <Col
                              lg="8"
                              md="8"
                              xl="8"
                              xs="12"
                              style={{ marginTop: "25px" }}>
                              {this.state.MasterShow ? (
                                <SuperAdminUI
                                  onDropdownChange={this.handleDropdownChange}
                                  onSubmit={this.handleParentSubmit}
                                />
                              ) : (
                                <Col></Col>
                              )}
                            </Col>
                          </Row>
                        </Col>

                        <Col
                          lg="2"
                          md="6"
                          sm="12"
                          style={{ marginTop: "25px" }}>
                          <div className="">
                            {/* 
                            <div className="mb-1 mr-1">
                             
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
                              </UncontrolledDropdown> 
                            </div>*/}
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

                        {InsiderPermissions && InsiderPermissions.Create && (
                          <>
                            <Col lg="5" xl="5" md="5">
                              <Row>
                                <Col
                                  lg="3"
                                  xl="3"
                                  md="3"
                                  xs="12"
                                  style={{ marginTop: "25px" }}>
                                  <span className="">
                                    <Route
                                      render={({ history }) => (
                                        <Button
                                          style={{
                                            cursor: "pointer",
                                            backgroundColor: "rgb(8, 91, 245)",
                                            color: "white",
                                            fontWeight: "600",
                                            height: "43px",
                                            width: "100%",
                                            textTransform: "uppercase",
                                          }}
                                          className="float-right"
                                          color="#39cccc"
                                          onClick={() =>
                                            history.push(
                                              "/app/SoftNumen/account/CreateAccount/0"
                                            )
                                          }>
                                          <FaPlus size={15} /> User
                                        </Button>
                                      )}
                                    />
                                  </span>
                                </Col>
                                <Col
                                  lg="4"
                                  xl="4"
                                  md="4"
                                  xs="12"
                                  style={{ marginTop: "25px" }}>
                                  <span>
                                    <Route
                                      render={({ history }) => (
                                        <Button
                                          style={{
                                            cursor: "pointer",
                                            backgroundColor: "rgb(8, 91, 245)",
                                            color: "white",
                                            fontWeight: "600",
                                            height: "43px",
                                            width: "100%",
                                            textTransform: "uppercase",
                                          }}
                                          className="float-right"
                                          color="#39cccc"
                                          onClick={() =>
                                            history.push(
                                              "/app/Ajgroup/account/AssignTeamMember"
                                            )
                                          }>
                                          Assign Team
                                        </Button>
                                      )}
                                    />
                                  </span>
                                </Col>
                                <Col
                                  lg="5"
                                  xl="5"
                                  md="5"
                                  xs="12"
                                  style={{ marginTop: "25px" }}>
                                  <span>
                                    <Route
                                      render={({ history }) => (
                                        <a
                                          title="Create User Format Download here"
                                          target="_blank"
                                          href={UserForm}
                                          download={UserForm}>
                                          <Button
                                            style={{
                                              cursor: "pointer",
                                              backgroundColor:
                                                "rgb(8, 91, 245)",
                                              color: "white",
                                              fontWeight: "600",
                                              height: "43px",
                                              width: "100%",
                                              textTransform: "uppercase",
                                            }}
                                            className="float-right"
                                            color="#39cccc">
                                            Format Download
                                          </Button>
                                        </a>
                                      )}
                                    />
                                  </span>
                                </Col>
                              </Row>
                            </Col>
                          </>
                        )}

                        <Col lg="1" md="1" xl="1" style={{ marginTop: "25px" }}>
                          {InsiderPermissions && InsiderPermissions.View && (
                            <>
                              <span className="">
                                <FaFilter
                                  style={{ cursor: "pointer" }}
                                  title="filter coloumn"
                                  size="35px"
                                  onClick={this.LookupviewStart}
                                  color="rgb(8, 91, 245)"
                                  className="float-right "
                                />
                              </span>
                            </>
                          )}
                          {InsiderPermissions &&
                            InsiderPermissions.Download && (
                              <>
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
                                        {/* <h5
                                          onClick={() =>
                                            this.gridApi.exportDataAsCsv()
                                          }
                                          style={{ cursor: "pointer" }}
                                          className=" mx-1 myactive"
                                        >
                                          .CSV
                                        </h5> */}
                                        {/* <h5
                                          onClick={() =>
                                            this.convertCSVtoExcel("UserList")
                                          }
                                          style={{ cursor: "pointer" }}
                                          className=" mx-1 myactive"
                                        >
                                          .XLS
                                        </h5> */}
                                        <h5
                                          onClick={() =>
                                            this.exportToExcel("UserList")
                                          }
                                          style={{ cursor: "pointer" }}
                                          className=" mx-1 myactive">
                                          .XLSX
                                        </h5>
                                        {/* <h5
                                          onClick={() => this.convertCsvToXml()}
                                          style={{ cursor: "pointer" }}
                                          className=" mx-1 myactive"
                                        >
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
                                                href={CreateUserSample}
                                                download>
                                                . Format
                                              </a>
                                            </h5>
                                          )}
                                      </div>
                                    )}
                                  </div>
                                </span>
                              </>
                            )}
                        </Col>
                      </Row>
                      {InsiderPermissions && InsiderPermissions?.View && (
                        <>
                          {this.state.rowData === null ? null : (
                            <div>
                              <div
                                className="ag-theme-material w-100   ag-grid-table card-body"
                                style={{ marginTop: "-1rem" }}>
                                <ContextLayout.Consumer className="ag-theme-alpine">
                                  {(context) => (
                                    <AgGridReact
                                      id="myAgGrid"
                                      gridOptions={{
                                        enableRangeSelection: true,
                                        enableClipboard: true,
                                      }}
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
                                      ref={this.gridRef}
                                      domLayout="autoHeight"
                                    />
                                  )}
                                </ContextLayout.Consumer>
                              </div>
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
                                  <input type="checkbox" className="mx-1" />

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
                                              SelectedCols.splice(delindex, 1);
                                            this.setState({
                                              SelectedcolumnDefs: SelectedCols,
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
export default AccounSearch;
