// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   CardHeader,
//   CardBody,
//   Form,
//   FormGroup,
//   Label,
//   Row,
//   Col,
//   Input,
//   Button,
//   Modal,
//   ModalHeader,
//   ModalBody,
//   Dropdown,
//   DropdownToggle,
//   DropdownMenu,
//   DropdownItem,
//   Table,
// } from "reactstrap";
// import { useLocation, useParams } from "react-router-dom";
// import { FaPlus, FaMinus, FaEdit, FaTrash } from "react-icons/fa";
// import { Hrm_Salary_List } from "../../../../../../ApiEndPoint/Api";
// import { _Get } from "../../../../../../ApiEndPoint/ApiCalling";

// // const EmployeeSalaryForm = (ViewOneSalary) => {
// //   const [data, setData] = useState({
// //     payslipType: "",
// //     salary: "",
// //     fromAccount: "",
// //   });

// //   const [modalOpen, setModalOpen] = useState(false);

// //   const [dropdownOpen, setDropdownOpen] = useState(false);
// //   const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

// //   const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
// //   const toggleAccountDropdown = () =>
// //     setAccountDropdownOpen(!accountDropdownOpen);

// //   const toggleModal = () => {
// //     setModalOpen(!modalOpen);
// //   };

// //   const handleEmployeeSalarySubmit = (e) => {
// //     e.preventDefault();
// //     if (!data.payslipType || !data.salary || !data.fromAccount) {
// //       alert("Please fill in all fields before saving.");
// //       return;
// //     }
// //     setData({
// //       payslipType: data.payslipType,
// //       salary: data.salary,
// //       fromAccount: data.fromAccount,
// //     });
// //     console.log("Employee Salary Form submitted:", data);
// //     toggleModal();
// //   };

// //   const handleDropdownSelect = (selectedOption) => {
// //     setData({ ...data, payslipType: selectedOption });
// //     toggleDropdown();
// //   };

// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setData({ ...data, [name]: value });
// //   };

// //   const handleAccountDropdownSelect = (selectedOption) => {
// //     setData({ ...data, fromAccount: selectedOption });
// //     toggleAccountDropdown();
// //   };
// //   const handleRemoveAllFields = () => {
// //     setData({
// //       payslipType: "",
// //       salary: "",
// //       fromAccount: "",
// //     });
// //     // toggleModal();
// //   };

// //   return (

// //   );
// // };

// // const TaForm = () => {
// //   const [modalOpen, setModalOpen] = useState(false);
// //   const [tableData, setTableData] = useState([]);
// //   const [selectedData, setSelectedData] = useState(null);

// //   const toggleModal = () => setModalOpen(!modalOpen);
// //   console.log(ViewOneSalary);

// //   const handleAddData = () => {
// //     setSelectedData(null);
// //     toggleModal();
// //   };

// //   const handleEditData = (index) => {
// //     setSelectedData({ ...tableData[index], index });
// //     toggleModal();
// //   };

// //   const handleDeleteData = (index) => {
// //     const updatedData = [...tableData];
// //     updatedData.splice(index, 1);
// //     setTableData(updatedData);
// //   };

// //   const handleSaveData = (data) => {
// //     const updatedData = [...tableData];
// //     if (selectedData !== null) {
// //       updatedData[selectedData.index] = data;
// //     } else {
// //       updatedData.push(data);
// //     }
// //     setTableData(updatedData);
// //     toggleModal();
// //   };

// //   // const TableHeadings = () => (

// //   // );

// //   // const TableBody = () => (

// //   // );

// //   return (

// //   );
// // };

// const ViewOneSalary = () => {
//   const [ViewOneSalary, setViewOneSalary] = useState({});
//   let Params = useParams();
//   useEffect(() => {
//     Apicalling();
//   }, []);
//   console.log(ViewOneSalary);
//   const Apicalling = () => {
//     let userId = JSON.parse(localStorage.getItem("userData"));
//     let URl = `${Hrm_Salary_List}/1/`;
//     _Get(URl, userId?.database, userId?._id)
//       .then((res) => {
//         let selected = res?.ApplyRule?.filter((ele) => ele?._id == Params.id);
//         if (selected?.length > 0) {
//           setViewOneSalary(selected[0]);
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };
//   return (
//     <div>
//       <Row>
//         <Col sm="12" md="6">
//           <Card>
//             <CardHeader>
//               <h2>Employee Salary</h2>
//             </CardHeader>
//             <CardBody>
//               <Form>
//                 <FormGroup row>
//                   <Label for="payslipType" sm={4}>
//                     Employee Name:
//                   </Label>
//                   <div
//                     style={{
//                       marginLeft: "10px",
//                       marginTop: " 10px",
//                       fontWeight: "bold",
//                     }}>
//                     {ViewOneSalary.employeeName && ViewOneSalary?.employeeName}
//                   </div>
//                 </FormGroup>
//                 <FormGroup row>
//                   <Label for="salary" sm={4}>
//                     Base Salary:
//                   </Label>
//                   <div
//                     style={{
//                       marginLeft: "10px",
//                       marginTop: " 10px",
//                       fontWeight: "bold",
//                     }}>
//                     {ViewOneSalary.salary && ViewOneSalary?.salary}
//                   </div>
//                 </FormGroup>
//               </Form>

//               {/* <Modal isOpen={modalOpen} toggle={toggleModal} backdrop="static">
//                 <ModalHeader toggle={toggleModal}>
//                   Add Employee Salary
//                 </ModalHeader>
//                 <ModalBody>
//                   <Form onSubmit={handleEmployeeSalarySubmit}>
//                     <FormGroup>
//                       <Label for="payslipType">Payslip Type:</Label>
//                       <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
//                         <DropdownToggle caret>
//                           {data.payslipType
//                             ? data.payslipType
//                             : "Select Payslip Type"}
//                         </DropdownToggle>
//                         <DropdownMenu>
//                           <DropdownItem
//                             onClick={() =>
//                               handleDropdownSelect("Monthly Payslip")
//                             }>
//                             Monthly Payslip
//                           </DropdownItem>
//                           <DropdownItem
//                             onClick={() =>
//                               handleDropdownSelect("Hourly Payslip")
//                             }>
//                             Hourly Payslip
//                           </DropdownItem>
//                         </DropdownMenu>
//                       </Dropdown>
//                     </FormGroup>
//                     <FormGroup>
//                       <Label for="salary">Salary:</Label>
//                       <Input
//                         type="number"
//                         name="salary"
//                         value={data.salary}
//                         onChange={handleInputChange}
//                         style={{ width: "80%" }}
//                       />
//                     </FormGroup>
//                     <FormGroup>
//                       <Label for="fromAccount">From Account:</Label>
//                       <Dropdown
//                         isOpen={accountDropdownOpen}
//                         toggle={toggleAccountDropdown}>
//                         <DropdownToggle caret>
//                           {data.fromAccount
//                             ? data.fromAccount
//                             : "Select From Account"}
//                         </DropdownToggle>
//                         <DropdownMenu right>
//                           <DropdownItem
//                             onClick={() =>
//                               handleAccountDropdownSelect("Account 1")
//                             }>
//                             Account 1
//                           </DropdownItem>
//                           <DropdownItem
//                             onClick={() =>
//                               handleAccountDropdownSelect("Account 2")
//                             }>
//                             Account 2
//                           </DropdownItem>
//                         </DropdownMenu>
//                       </Dropdown>
//                     </FormGroup>
//                     <Button color="primary" type="submit">
//                       Save
//                     </Button>{" "}
//                     <Button color="secondary" onClick={toggleModal}>
//                       Cancel
//                     </Button>
//                   </Form>
//                 </ModalBody>
//               </Modal> */}
//             </CardBody>
//           </Card>
//         </Col>
//         {ViewOneSalary?.employee?.length > 0 &&
//           ViewOneSalary?.employee?.map((ele, i) => {
//             return (
//               <Col key={i} sm="12" md="6">
//                 <Card>
//                   <CardHeader>
//                     <h1>Allow</h1>
//                   </CardHeader>
//                   <CardBody>
//                     <div
//                       class="table-responsive myclass"
//                       style={{ height: "175px" }}>
//                       <Table bordered responsive>
//                         <thead>
//                           <tr>
//                             <th>EMPLOYEE NAME</th>
//                             <th>Amount</th>
//                             <th>START DATE</th>
//                             <th>TYPE</th>
//                             <th>Rule</th>
//                             {/* <th>ACTION</th> */}
//                           </tr>
//                         </thead>
//                         <tbody>
//                           <tr>
//                             <td>{ele?.employeeName}</td>
//                             <td>{ele?.amount}</td>
//                             <td>{ele?.startDate?.split("T")[0]}</td>
//                             <td>{ele?.type}</td>
//                             <td>{ele?.rule}</td>
//                           </tr>
//                         </tbody>
//                       </Table>
//                     </div>
//                   </CardBody>
//                 </Card>
//               </Col>
//             );
//           })}
//       </Row>
//     </div>
//   );
// };

// export default ViewOneSalary;
// import { useParams, useHistory, useLocation } from 'react-router-dom';
// import React, { useState, useEffect } from 'react';
// import { Col, Form, FormGroup, Label, Input, Button, Card, CardBody, Row, CardHeader } from 'reactstrap';
// import { VIEW_ATTENDANCE_BY_ID, UPDATE_ATTENDANCE } from '../../../../../../ApiEndPoint/Api';
// import { _Put, _Get } from '../../../../../../ApiEndPoint/ApiCalling';

// const AttenviewForm = () => {

//   const [data, setData] = useState({
//     employee: '',
//     date: '',
//     hours: '',
//     remark: '',
//   });

//   const { id } = useParams();
//   const history = useHistory();
//   const location = useLocation();
//   useEffect(() => {
//     console.log(location?.state)
//     const fetchData = async () => {
//       try {
//         const response = await _Get(VIEW_ATTENDANCE_BY_ID, id);
//         console.log(response)
//         setData(response?.Attendance);
//       } catch (error) {
//         console.log(error)
//       }
//     };
//     fetchData();
//   }, [id]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await _Put(UPDATE_ATTENDANCE, id, data);
//       history.push('/app/ajgroup/HRM/attenList');

//     } catch (error) {
//       console.log(error);
//     }
//   };
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setData({ ...data, [name]: value });
//   };

//   const handleBack = () => {
//     history.goBack();
//   };

//   return (
//     <Row>
//       <Col sm="12" md="6" className="mx-auto">
//         <Card>
//           <CardHeader>
//             <h1>Attendance View Form</h1>
//             <Button color="danger" onClick={handleBack}>
//               Back
//             </Button>
//           </CardHeader>
//           <CardBody>
//             <Form onSubmit={handleSubmit}>

//               <FormGroup row>
//                 <Label for="employee" sm={2}>
//                   Employee
//                 </Label>
//                 <Col sm={10}>
//                   <Input
//                     readOnly
//                     type="text"
//                     name="employee"
//                     id="employee"
//                     value={data?.employee}
//                     onChange={handleInputChange}
//                   >

//                     {/* <option value="">Select Employee</option>
//                 <option value="employee1">Employee 1</option>
//                 <option value="employee2">Employee 2</option>
//                 <option value="employee3">Employee 3</option>
//                 <option value="employee4">Employee 4</option> */}

//                   </Input>
//                 </Col>
//               </FormGroup>
//               <FormGroup row>
//                 <Label for="date" sm={2}>
//                   Date
//                 </Label>
//                 <Col sm={10}>
//                   <Input
//                     readOnly
//                     type="date"
//                     name="date"
//                     id="date"
//                     value={data?.date}
//                     onChange={handleInputChange}
//                   />
//                 </Col>
//               </FormGroup>
//               <FormGroup row>
//                 <Label for="hours" sm={2}>
//                   Hours
//                 </Label>
//                 <Col sm={10}>
//                   <Input
//                     readOnly
//                     type="number"
//                     placeholder='Hours'
//                     name="hours"
//                     id="hours"
//                     value={data?.hours}
//                     onChange={handleInputChange}
//                   />
//                 </Col>
//               </FormGroup>
//               <FormGroup row>
//                 <Label for="remark" sm={2}>
//                   Remark
//                 </Label>
//                 <Col sm={10}>
//                   <Input
//                     readOnly
//                     type="textarea"
//                     name="remark"
//                     id="remark"
//                     value={data?.remark}
//                     onChange={handleInputChange}
//                   />
//                 </Col>
//               </FormGroup>
//             </Form>

//           </CardBody>
//         </Card>
//       </Col>

//     </Row>
//   );
// };
// export default AttenviewForm;

import React, { useRef } from "react";
import { Route } from "react-router-dom";
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
  Table,
  Label,
  Spinner,
  button,
} from "reactstrap";
import { ContextLayout } from "../../../../../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import ViewOrder from "../../../order/ViewAll";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import Papa from "papaparse";
import { Eye, ChevronDown, Edit, CornerDownLeft, Trash2 } from "react-feather";
import { IoMdRemoveCircleOutline } from "react-icons/io";

import "../../../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../../../../../assets/scss/pages/users.scss";
import {
  _Delete,
  _GetList,
  _Get,
} from "../../../../../../ApiEndPoint/ApiCalling";
import { Hrm_Salary_List } from "../../../../../../ApiEndPoint/Api";
import { HRM_DELETE_ATTENDANCE } from "../../../../../../ApiEndPoint/Api";

import {
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaFilter,
  FaPlus,
} from "react-icons/fa";
import swal from "sweetalert";
import {
  PurchaseOrderList,
  Delete_targetINlist,
} from "../../../../../../ApiEndPoint/ApiCalling";
import {
  BsFillArrowDownSquareFill,
  BsFillArrowUpSquareFill,
} from "react-icons/bs";
import * as XLSX from "xlsx";
import UserContext from "../../../../../../context/Context";
import { CheckPermission } from "../../../house/CheckPermission";
import SuperAdminUI from "../../../../../SuperAdminUi/SuperAdminUI";

const SelectedColums = [];

class attenviewform extends React.Component {
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
      MasterShow: false,
      startDate: "",
      employeename: "",
      EndDate: "",
      modal: false,
      modalone: false,
      ViewData: {},
      InsiderPermissions: {},
      setMySelectedarr: [],
      SelectedCols: [],
      paginationPageSize: 5,
      currenPageSize: "",
      getPageSize: "",
      // columnDefs: [],
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
        // {
        //   headerName: "UID",
        //   valueGetter: "node.rowIndex + 1",
        //   field: "node.rowIndex + 1",
        //   width: 80,
        //   filter: true,
        // },

        {
          headerName: "Name",
          field: "employeeName",
          filter: true,
          width: 160,
          cellRendererFramework: params => {
            return (
              <div className="d-flex align-items-center cursor-pointer">
                <div>
                  <span>{params?.data?.employeeName}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Pan No",
          field: "panNo",
          filter: true,
          width: 160,
          cellRendererFramework: params => {
            return (
              <div className="d-flex align-items-center cursor-pointer">
                <div>
                  <span>{params?.data?.panNo}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Salary",
          field: "salary",
          filter: true,
          width: 160,
          cellRendererFramework: params => {
            return (
              <div className="d-flex align-items-center cursor-pointer">
                <div>
                  <span>{params?.data?.salary}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Option",
          field: "option",
          filter: true,
          width: 160,
          cellRendererFramework: params => {
            return (
              <div className="d-flex align-items-center cursor-pointer">
                <div>
                  <span>{params?.data?.option}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Rule",
          field: "rule",
          filter: true,
          width: 160,
          cellRendererFramework: params => {
            return (
              <div className="d-flex align-items-center cursor-pointer">
                <div>
                  <span>{params?.data?.rule}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Amount",
          field: "amount",
          filter: true,
          width: 160,
          cellRendererFramework: params => {
            return (
              <div className="d-flex align-items-center cursor-pointer">
                <div>
                  <span>{params?.data?.amount}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "Title",
          field: "title",
          filter: true,
          width: 160,
          cellRendererFramework: params => {
            return (
              <div className="d-flex align-items-center cursor-pointer">
                <div>
                  <span>{params?.data?.title}</span>
                </div>
              </div>
            );
          },
        },
        {
          headerName: "StartDate",
          field: "startDate",
          filter: true,
          width: 160,
          cellRendererFramework: params => {
            return (
              <div className="d-flex align-items-center cursor-pointer">
                <div>
                  <span>{params?.data?.startDate?.split("T")[0]}</span>
                </div>
              </div>
            );
          },
        },
        // {
        //   headerName: "Working Hours",
        //   field: "workinghours",
        //   filter: true,
        //   width: 260,
        //   cellRendererFramework: (params) => {
        //     return (
        //       <div className="d-flex align-items-center cursor-pointer">
        //         <div>
        //           <span>{params?.data?.hours}</span>
        //         </div>
        //       </div>
        //     );
        //   },
        // },

        // {
        //     headerName: "Status",
        //     field: "status",
        //     filter: true,
        //     width: 160,
        //     cellRendererFramework: (params) => {
        //         console.log(params.data);
        //         return params.value == "comleted" ? (
        //             <div className="badge badge-pill badge-success">
        //                 {params.data.status}
        //             </div>
        //         ) : params.value == "pending" ? (
        //             <div className="badge badge-pill badge-warning">
        //                 {params.data.status}
        //             </div>
        //         ) : (
        //             <div className="badge badge-pill badge-success">
        //                 {params.data.status}
        //             </div>
        //         );
        //     },
        // },
        // {
        //     headerName: "GrandTotal",
        //     field: "grandTotal",
        //     filter: true,
        //     width: 200,
        //     cellRendererFramework: (params) => {
        //         return (
        //             <div className="d-flex align-items-center cursor-pointer">
        //                 <div>
        //                     <Badge color="primary">{params.data?.grandTotal}</Badge>
        //                 </div>
        //             </div>
        //         );
        //     },
        // },
        // {
        //     headerName: "Status",
        //     field: "status",
        //     filter: true,
        //     width: 240,
        //     cellRendererFramework: (params) => {
        //         return (
        //             <div className="d-flex align-items-center cursor-pointer">
        //                 <div>
        //                     <span>{params.data?.remark}</span>
        //                 </div>
        //             </div>
        //         );
        //     },
        // },
        // {
        //   headerName: "Actions",
        //   field: "transactions",
        //   width: 180,
        //   cellRendererFramework: (params) => {
        //     return (
        //       <div className="actions cursor-pointer">
        //         {/* {this.state.InsiderPermissions &&
        //                             this.state.InsiderPermissions.View && (
        //                                 <Eye
        //                                     className="mr-50"
        //                                    size="25px"
        //                                     color="green"
        //                                     onClick={() =>
        //                                         this.props.history.push({
        //                                             pathname: `/app/ajgroup/HRM/Time-sheet/attenviewform/${params.data?._id}`,
        //                                             state: params.data,
        //                                         })
        //                                     }
        //                                 />
        //                             )} */}

        //         {this.state.InsiderPermissions &&
        //           this.state.InsiderPermissions.View && (
        //             // <>

        //             //   <button
        //             //     className="mr-50"
        //             //     style={{
        //             //       display: 'inline-block',
        //             //       padding: '5px 18px',
        //             //       marginBottom: '0',
        //             //       color: '#fff',
        //             //       fontSize: '17px',
        //             //       fontWeight: '400',
        //             //       lineHeight: '1.42857143',
        //             //       textAlign: 'center',
        //             //       cursor: 'pointer',
        //             //       backgroundColor: '#62d0f1',
        //             //       borderColor: '#51b3d1',

        //             //     }}
        //             //     onClick={() =>
        //             //       this.props.history.push({
        //             //         pathname: `/app/ajgroup/HRM/Time-sheet/attenviewform/${params?.data?.details
        //             //           ?._id}`,
        //             //         state: params?.data,
        //             //       })
        //             //     }
        //             //   >
        //             //     <Eye
        //             //       className="mr-50"
        //             //       size="20px"
        //             //       color="white"
        //             //     // onClick={() =>
        //             //     //     this.props.history.push({
        //             //     //         pathname: `/app/ajgroup/HRM/Time-sheet/attenviewform/${params.data?._id}`,
        //             //     //         state: params.data,
        //             //     //     })
        //             //     // }
        //             //     />
        //             //     Detail
        //             //   </button>
        //             // </>
        //             <Edit
        //               className="mr-50"
        //               size="25px"
        //               color="green"
        //               onClick={() =>
        //                 this.props.history.push({
        //                   pathname: `/app/ajgroup/HRM/Time-sheet/atteneditform/${params.data?._id}`,
        //                   state: params.data,
        //                 })
        //               }
        //             />
        //           )}
        //         <Trash2
        //           className="mr-50"
        //           size="25px"
        //           color="green"
        //           onClick={() => {
        //             this.runthisfunction(params.data._id);
        //           }}
        //         />
        //       </div>
        //     );
        //   },
        // },
      ],
    };
  }
  togglemodal = () => {
    this.setState(prevState => ({
      modalone: !prevState.modalone,
    }));
    this.setState({ ShowBill: false });
  };
  LookupviewStart = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };

  handleChangeView = (data, types) => {
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
    let pid = this.props.match?.params?.id;

    let URl = `${Hrm_Salary_List}/1/`;
    await _Get(URl, db, id)
      .then(res => {
        this.setState({ Loading: false });
        let selected = res?.ApplyRule?.filter(ele => ele?._id == pid);
        if (selected?.length > 0) {
          this.setState({ rowData: selected });
        }
        this.setState({ AllcolumnDefs: this.state.columnDefs });
        this.setState({ SelectedCols: this.state.columnDefs });
        let userHeading = JSON.parse(localStorage.getItem("ViewoneAttandance"));
        if (userHeading?.length) {
          this.setState({ columnDefs: userHeading });
          // this.gridApi.setColumnDefs(userHeading);
          this.setState({ SelectedcolumnDefs: userHeading });
        } else {
          this.setState({ columnDefs: this.state.columnDefs });
          this.setState({ SelectedcolumnDefs: this.state.columnDefs });
        }
      })
      .catch(err => {
        this.setState({ Loading: false });
        console.log(err);
      });
  }

  async componentDidMount() {
    const InsidePermissions = CheckPermission("Purchase Order");
    this.setState({ InsiderPermissions: InsidePermissions });

    let userId = JSON.parse(localStorage.getItem("userData"));
    if (userId?.rolename?.roleName === "MASTER") {
      this.setState({ MasterShow: true });
    }
    await this.Apicalling(userId?._id, userId?.database);
  }

  toggleDropdown = () => {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  };

  runthisfunction(id) {
    swal("Warning", "Sure You Want to Delete it", {
      buttons: {
        cancel: "cancel",
        catch: { text: "Delete ", value: "delete" },
      },
    }).then(value => {
      switch (value) {
        case "delete":
          _Delete(HRM_DELETE_ATTENDANCE)
            .then(res => {
              let selectedData = this.gridApi.getSelectedRows();
              this.gridApi.updateRowData({ remove: selectedData });
            })
            .catch(err => {
              console.log(err);
            });
          break;
        default:
      }
    });
  }

  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridRef.current = params.api;

    this.setState({
      currenPageSize: this.gridApi.paginationGetCurrentPage() + 1,
      getPageSize: this.gridApi.paginationGetPageSize(),
      totalPages: this.gridApi.paginationGetTotalPages(),
    });
  };

  updateSearchQuery = val => {
    this.gridApi.setQuickFilter(val);
  };

  filterSize = val => {
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
        ele => ele?.headerName === value?.headerName
      );

      SelectedColums?.splice(delindex, 1);
    }
  };
  parseCsv(csvData) {
    return new Promise((resolve, reject) => {
      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: result => {
          if (result.data && result.data.length > 0) {
            resolve(result.data);
          } else {
            reject(new Error("No data found in the CSV"));
          }
        },
        error: error => {
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
    const tableData = parsedData.map(row => Object.values(row));
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
  processCell = params => {
    return params.value;
  };

  convertCsvToExcel(csvData) {
    return new Promise(resolve => {
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

  exportToExcel = async e => {
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
      complete: result => {
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
      complete: result => {
        const rows = result.data;

        // Create XML
        let xmlString = "<root>\n";

        rows.forEach(row => {
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

  handleDate = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmitDate = () => {
    // console.log(this.state.rowAllData);
    const filteredItems = this.state.rowAllData?.filter(item => {
      const dateList = new Date(item.updatedAt);
      const onlyDate = dateList.toISOString().split("T")[0];
      return onlyDate >= this.state.startDate && onlyDate <= this.state.EndDate;
    });
    this.setState({ rowData: filteredItems });
  };

  HandleSetVisibleField = e => {
    e.preventDefault();
    this.gridApi.setColumnDefs(this.state.SelectedcolumnDefs);
    this.setState({ columnDefs: this.state.SelectedcolumnDefs });
    this.setState({ SelectedcolumnDefs: this.state.SelectedcolumnDefs });
    this.setState({ rowData: this.state.rowData });
    localStorage.setItem(
      "ViewoneAttandance",
      JSON.stringify(this.state.SelectedcolumnDefs)
    );
    this.LookupviewStart();
  };

  HeadingRightShift = () => {
    const updatedSelectedColumnDefs = [
      ...new Set([
        ...this.state.SelectedcolumnDefs.map(item => JSON.stringify(item)),
        ...SelectedColums.map(item => JSON.stringify(item)),
      ]),
    ].map(item => JSON.parse(item));
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
  handleParentSubmit = e => {
    e.preventDefault();
    let SuperAdmin = JSON.parse(localStorage.getItem("SuperadminIdByMaster"));
    let id = SuperAdmin.split(" ")[0];
    let db = SuperAdmin.split(" ")[1];
    this.Apicalling(id, db);
  };
  handleDropdownChange = selectedValue => {
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
          }}
        >
          <Spinner
            style={{
              height: "4rem",
              width: "4rem",
            }}
            color="primary"
          >
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
      SelectedCols,
      AllcolumnDefs,
    } = this.state;
    return (
      <>
        <>
          <Col sm="12">
            <Card>
              <Row className="ml-2 mr-2 mt-2">
                <Col>
                  <h1 className="float-left" style={{ fontWeight: "600" }}>
                    Salary List
                  </h1>
                </Col>
                {this.state.MasterShow && (
                  <Col>
                    <SuperAdminUI
                      onDropdownChange={this.handleDropdownChange}
                      onSubmit={this.handleParentSubmit}
                    />
                  </Col>
                )}
                <Col>
                  {InsiderPermissions && InsiderPermissions.View && (
                    <>
                      <span className="mx-1">
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
                  {InsiderPermissions && InsiderPermissions.Download && (
                    <span className="mx-1">
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
                            className="dropdown-content dropdownmy"
                          >
                            <h5
                              onClick={() => this.exportToPDF()}
                              style={{ cursor: "pointer" }}
                              className=" mx-1 myactive mt-1"
                            >
                              .PDF
                            </h5>
                            <h5
                              onClick={() => this.gridApi.exportDataAsCsv()}
                              style={{ cursor: "pointer" }}
                              className=" mx-1 myactive"
                            >
                              .CSV
                            </h5>
                            <h5
                              onClick={this.convertCSVtoExcel}
                              style={{ cursor: "pointer" }}
                              className=" mx-1 myactive"
                            >
                              .XLS
                            </h5>
                            <h5
                              onClick={this.exportToExcel}
                              style={{ cursor: "pointer" }}
                              className=" mx-1 myactive"
                            >
                              .XLSX
                            </h5>
                            <h5
                              onClick={() => this.convertCsvToXml()}
                              style={{ cursor: "pointer" }}
                              className=" mx-1 myactive"
                            >
                              .XML
                            </h5>
                          </div>
                        )}
                      </div>
                    </span>
                  )}
                  {/* {InsiderPermissions && InsiderPermissions.Create && (
                                        <span>
                                            <Route
                                                render={({ history }) => (
                                                    <Button
                                                        style={{
                                                            cursor: "pointer",
                                                            backgroundColor: "#39cccc",
                                                            color: "white",
                                                            fontWeight: "600",
                                                        }}
                                                        className="float-right mr-1"
                                                        color="#39cccc"
                                                        onClick={() =>
                                                            history.push(
                                                                "/app/ajgroup/HRM/Time-sheet/attenform"
                                                            )
                                                        }>
                                                        <FaPlus size={15} /> Check Attendance
                                                    </Button>
                                                )}
                                            />
                                        </span>
                                    )} */}
                </Col>
              </Row>
              {InsiderPermissions && InsiderPermissions.View && (
                <CardBody style={{ marginTop: "0rem" }}>
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
                                onClick={() => this.filterSize(5)}
                              >
                                5
                              </DropdownItem>
                              <DropdownItem
                                tag="div"
                                onClick={() => this.filterSize(20)}
                              >
                                20
                              </DropdownItem>
                              <DropdownItem
                                tag="div"
                                onClick={() => this.filterSize(50)}
                              >
                                50
                              </DropdownItem>
                              <DropdownItem
                                tag="div"
                                onClick={() => this.filterSize(100)}
                              >
                                100
                              </DropdownItem>
                              <DropdownItem
                                tag="div"
                                onClick={() => this.filterSize(134)}
                              >
                                134
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </div>
                        <div className="d-flex flex-wrap justify-content-end mb-1">
                          {/* <div className="table-input mr-1">
                                                        <Label>Employee Name:</Label>
                                                        <Input
                                                            type="select"
                                                            name="employeename"
                                                            value={this.state.employeename}
                                                            onChange={this.handleEmployee}
                                                        />
                                                    </div> */}
                          {/* <div className="table-input mr-1">
                            <Label>Employee Name:</Label>
                            <Input
                              placeholder="Search Employee Name..."
                              onChange={(e) =>
                                this.updateSearchQuery(e.target.value)
                              }
                              value={this.state.value}
                            />
                          </div>
                          <div className="table-input mr-1">
                            <Label>From:</Label>
                            <Input
                              type="date"
                              name="startDate"
                              value={this.state.startDate}
                              onChange={this.handleDate}
                            />
                          </div>
                          <div className="table-input mr-1">
                            <Label>To:</Label>
                            <Input
                              type="date"
                              name="EndDate"
                              value={this.state.EndDate}
                              onChange={this.handleDate}
                            />
                          </div>
                          <div className="table-input mr-1">
                            <Button
                              type="submit"
                              className="mt-1"
                              color="primary"
                              onClick={this.handleSubmitDate}>
                              Submit
                            </Button>
                          </div> */}
                          <div className="table-input mr-1">
                            <Input
                              className="mt-1"
                              placeholder="search Item here..."
                              onChange={e =>
                                this.updateSearchQuery(e.target.value)
                              }
                              value={this.state.value}
                            />
                          </div>
                        </div>
                      </div>
                      <ContextLayout.Consumer className="ag-theme-alpine">
                        {context => (
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
                            // pagination={true}
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
        </>

        <Modal
          isOpen={this.state.modal}
          toggle={this.LookupviewStart}
          className={this.props.className}
          style={{ maxWidth: "1050px" }}
        >
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
                              onClick={e => this.handleChangeHeader(e, ele, i)}
                              key={i}
                              className="mycustomtag mt-1"
                            >
                              <span className="mt-1">
                                <h5
                                  style={{ cursor: "pointer" }}
                                  className="allfields"
                                >
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
                                      className="allfields"
                                    >
                                      <IoMdRemoveCircleOutline
                                        onClick={() => {
                                          const SelectedCols =
                                            this.state.SelectedcolumnDefs?.slice();
                                          const delindex =
                                            SelectedCols?.findIndex(
                                              element =>
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
                    onClick={this.HandleSetVisibleField}
                  >
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
          style={{ maxWidth: "1050px" }}
        >
          <ModalHeader toggle={this.togglemodal}>
            {this.state.ShowBill ? "Bill Download" : "Purchase View"}
          </ModalHeader>
          <ModalBody
            className={`${this.state.ShowBill ? "p-1" : "modalbodyhead"}`}
          >
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
                        <Label>UserName:</Label>
                        <h5 className="">
                          {this.state.ViewOneData &&
                            this.state.ViewOneData?.fullName}
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
                              this.state.ViewOneData?.grandTotal}
                          </strong>
                          Rs/-
                        </h5>
                      </Col>
                      <Col>
                        {this.state.ViewOneData?.status == "completed" ? (
                          <>
                            <div className="d-flex justify-content-center">
                              <h5>
                                Status:
                                <Badge className="mx-2" color="primary">
                                  {this.state.ViewOneData?.status}
                                </Badge>
                              </h5>
                            </div>
                          </>
                        ) : (
                          <>
                            <h5>
                              status:
                              <Badge className="mx-2 btn btn-warning">
                                {this.state.ViewOneData?.status}
                              </Badge>
                            </h5>
                          </>
                        )}
                      </Col>
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
                          <h4>Sales Order List</h4>
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
                              <th>Size</th>
                              <th>Unit</th>
                              <th>HSN CODE</th>
                              <th>GST</th>
                              <th>Quantity</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.ViewOneData?.orderItems &&
                              this.state.ViewOneData?.orderItems?.map(
                                (ele, i) => (
                                  <>
                                    <tr>
                                      <th scope="row">{i + 1}</th>
                                      <td>{ele?.productId?.Product_Title}</td>
                                      <td>{ele?.price}</td>
                                      <td>{ele?.Size}</td>
                                      <td>{ele?.unitType}</td>
                                      <td>{ele?.productId?.HSN_Code}</td>
                                      <td>{ele?.productId["GST Rate"]}</td>
                                      <td>{ele?.qty}</td>
                                      <td>
                                        {ele?.price * ele?.Size * ele?.qty}
                                      </td>
                                    </tr>
                                  </>
                                )
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
export default attenviewform;
