// import React, { useState, useEffect } from "react";
// import {
//   _Delete,
//   _GetList,
//   _Get,
//   _Put,
// } from "../../../../../ApiEndPoint/ApiCalling";
// import {
//   RegisteredAttendanceUser,
//   RegisteredUser,
// } from "../../../../../ApiEndPoint/Api";
// import {
//   Button,
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Label,
// } from "reactstrap";
// import axios from "axios";
// import "../../../../../assets/scss/pages/users.scss";
// import { Col, Input, Row, Spinner, Table } from "reactstrap";
// import swal from "sweetalert";
// import { Edit, Edit2 } from "react-feather";
// import { useHistory } from "react-router-dom";
// import SuperAdminUI from "../../../../SuperAdminUi/SuperAdminUI";
// function InnerTable({ insideData }, args) {
//   const [InTime, setInTime] = useState("");
//   const [OutTime, setOutTime] = useState("");
//   const [EditData, setEditData] = useState(null);
//   const [modal, setModal] = useState(false);

//   const toggle = () => setModal(!modal);
//   useEffect(() => {
//     console.log(insideData);
//   }, []);
//   const handleViewOne = (data, intimeIndex, OutTimeIndex) => {
//     let value = {
//       ...data,
//       intimeIndex: intimeIndex,
//       OutTimeIndex: OutTimeIndex,
//     };
//     setEditData(value);
//     setInTime(value?.details?.inTimes[intimeIndex]);
//     setOutTime(value?.details?.outTimes[OutTimeIndex]);
//     toggle();
//   };
//   const handleEditAttendanceSubmit = async e => {
//     e.preventDefault();

//     let Payload = {
//       inTimeIndex: EditData?.intimeIndex,
//       inTime: InTime,
//       outTimeIndex: EditData?.OutTimeIndex,
//       outTime: OutTime,
//     };
//     await axios
//       .put(
//         `https://node-second.rupioo.com/editTimes/${EditData?.details?._id}`,
//         Payload
//       )
//       .then(res => {
//         // console.log(res?.data?.status);
//         if (res?.data?.status) {
//           toggle();
//           window.location.reload();
//         }
//       })
//       .catch(err => {
//         if (!!err?.response?.data?.message) {
//           swal("error", `${err?.response?.data?.message}`, "error");
//         }
//       });
//   };
//   return (
//     <>
//       <div className="d-flex justify-content-center p-2">
//         <strong>
//           <h2>
//             {insideData[0]?.details?.name &&
//               insideData[0]?.details?.name?.toUpperCase()}
//           </h2>
//         </strong>
//       </div>
//       <Table responsive className="innerTable">
//         <thead>
//           <tr style={{ height: "47px" }}>
//             <th>Date</th>
//             <th>InTime</th>
//             <th>OutTime</th>
//             <th>lateBy</th>
//             <th>ShortBy</th>
//             <th>Working</th>
//             <th>Amount</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {insideData?.length > 0 &&
//             insideData
//               ?.map((custom, index) => (
//                 <>
//                   {console.log("custom", custom)}
//                   {custom?.intime?.length > 0 ? (
//                     <>
//                       {custom?.intime?.map((ele, i) => {
//                         return (
//                           <>
//                             <tr style={{ height: "47px" }} key={index}>
//                               <td>{custom?.currentDate}</td>
//                               <td>{ele}</td>
//                               <td>
//                                 {custom?.outtime[i] && custom?.outtime[i]}
//                               </td>
//                               <td>{custom?.lateTime}</td>
//                               <td>{custom?.shift?.shortByTime}</td>
//                               <td>{custom?.shift?.totalHours}</td>
//                               <td>{custom?.Amount}</td>
//                               <td>
//                                 <span
//                                   onClick={() =>
//                                     handleViewOne(
//                                       custom,
//                                       i,
//                                       custom?.attendence?.details?.outTimes
//                                         ?.length > 0
//                                         ? i
//                                         : 0
//                                     )
//                                   }
//                                   style={{ cursor: "pointer" }}
//                                   className="mr-1"
//                                 >
//                                   <Edit color="green" />
//                                 </span>
//                               </td>
//                             </tr>
//                           </>
//                         );
//                       })}
//                     </>
//                   ) : (
//                     <>
//                       <td>1</td>
//                       <td>2</td>
//                     </>
//                   )}
//                 </>
//               ))
//               .reverse()}
//         </tbody>
//       </Table>
//       <Modal isOpen={modal} toggle={toggle} {...args}>
//         <ModalHeader toggle={toggle}>Update Attendance</ModalHeader>
//         <ModalBody>
//           <div className="d-flex justify-content-center">
//             <h4>
//               Edit Attendance for{" "}
//               {EditData?.firstName && (
//                 <>
//                   {EditData?.firstName} {EditData?.lastName}
//                 </>
//               )}{" "}
//             </h4>
//           </div>
//           <div className="d-flex justify-content-center">
//             <h4>
//               {EditData?.attendence?.attendance?.date ? (
//                 <> Date : {EditData?.attendence?.attendance?.date}</>
//               ) : null}
//             </h4>
//           </div>
//           <div className="p-1 pt-1 pb-1">
//             <Row>
//               <Col>
//                 <Label>In Time</Label>
//                 <Input
//                   value={InTime}
//                   onChange={e => setInTime(e.target.value)}
//                   placeholder="In time.."
//                 />
//               </Col>
//               <Col>
//                 <Label>Out Time</Label>
//                 <Input
//                   value={OutTime}
//                   onChange={e => setOutTime(e.target.value)}
//                   placeholder="Out time.."
//                 />
//               </Col>
//             </Row>
//           </div>
//         </ModalBody>
//         <ModalFooter>
//           <Button
//             color="primary"
//             // onClick={toggle}
//             onClick={handleEditAttendanceSubmit}
//           >
//             Submit
//           </Button>
//         </ModalFooter>
//       </Modal>
//     </>
//   );
// }

// function OuterTable(args) {
//   const [Search, setSearch] = useState("");

//   const [dataSource, setDataSource] = useState([]);
//   const [AllDataSource, setAllDataSource] = useState([]);
//   const [insideData, setInsideData] = useState([]);
//   const [AllInsideData, setAllInsideData] = useState([]);
//   const [TotalAttendance, setTotalAttendance] = useState([]);
//   const [TodayImages, setTodayImages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [EditData, setEditData] = useState(null);
//   const [isTrue, setIstrue] = useState(false);
//   const [currentIndex, setCurrentIndex] = useState("");
//   const [InTime, setInTime] = useState("");
//   const [OutTime, setOutTime] = useState("");
//   const [modal, setModal] = useState(false);
//   const [MasterShow, setMasterShow] = useState(false);

//   const toggle = () => setModal(!modal);
//   const history = useHistory();
//   useEffect(() => {
//     let pageparmission = JSON.parse(localStorage.getItem("userData"));

//     if (pageparmission?.rolename?.roleName === "MASTER") {
//       setMasterShow(true);
//     }
//   }, []);
//   useEffect(() => {
//     // let selectedforAttendance = AllDataSource?.filter(
//     //   (ele) => !!ele?.attendence?.details
//     // );

//     let searchingItem = AllDataSource?.filter(
//       (element, index) =>
//         element?.attendence?.details?.name?.toLowerCase()?.includes(Search) ||
//         element?.firstName?.toLowerCase()?.includes(Search)
//     );
//     if (Search?.length) {
//       setDataSource(searchingItem);
//     } else {
//       setDataSource(AllDataSource);
//     }
//   }, [Search]);

//   useEffect(() => {
//     let userId = JSON.parse(localStorage.getItem("userData"));
//     listData(userId?._id, userId?.database);
//     // (async () => {
//     //   let todayDate = new Date()?.toISOString()?.split("T")[0];
//     //   let user = JSON.parse(localStorage.getItem("userData"));

//     //   setLoading(true);
//     //   await _GetList("https://node-second.rupioo.com/checkImage", 1, 1)
//     //     .then((res) => {
//     //       // console.log(res?.data);
//     //       let today = res?.data?.filter(
//     //         (ele) =>
//     //           ele?.createdAt?.split("T")[0] == todayDate &&
//     //           ele?.database == user?.database
//     //       );
//     //       // debugger;
//     //       setTodayImages(today);
//     //     })
//     //     .catch((err) => {
//     //       console.log(err);
//     //     });
//     //   let userId = JSON.parse(localStorage.getItem("userData"));
//     //   let RegisterUser = [];
//     //   await _Get(All_Users_HRM, userId?.database)
//     //     .then((res) => {
//     //       let value = res?.User;
//     //       if (value?.length > 0) {
//     //         // RegisterUser = value;
//     //         RegisterUser = value?.filter(
//     //           (ele) => ele?.rolename?.roleName !== "SuperAdmin"
//     //         );
//     //       }
//     //     })
//     //     .catch((err) => {
//     //       console.log(err);
//     //     });
//     //   await _Get(HRM_ATTENDANCE_LIST, userId?.database)
//     //     .then((res) => {
//     //       let latest = res?.attendanceTotal?.filter(
//     //         (atten) => atten?.attendance?.date == todayDate
//     //       );
//     //       // debugger;
//     //       setTotalAttendance(res?.attendanceTotal);
//     //       let value = RegisterUser?.flatMap((ele, i) => {
//     //         latest?.flatMap((data, index) => {
//     //           if (
//     //             ele?.Pan_No == data?.details?.panNo ||
//     //             ele?.Aadhar_No == data?.details?.panNo
//     //           ) {
//     //             ele.attendence = data;
//     //           } else {
//     //             ele;
//     //           }
//     //         });
//     //       });
//     //       setLoading(false);
//     //       setDataSource(RegisterUser);
//     //       setAllDataSource(RegisterUser);
//     //       // console.log(RegisterUser);
//     //       // console.log("selected", RegisterUser);
//     //       // }
//     //     })
//     //     .catch((error) => {
//     //       setDataSource([]);
//     //       setLoading(false);
//     //       console.error("Error fetching data:", error);
//     //     });
//     // })();
//   }, []);
//   const listData = (id, db) => {
//     (async () => {
//       let todayDate = new Date()?.toISOString()?.split("T")[0];
//       console.log(todayDate);
//       let user = JSON.parse(localStorage.getItem("userData"));

//       setLoading(true);
//       let RegisterUser = [];
//       let URl = `${RegisteredUser}/${db}`;
//       await _GetList(URl)
//         .then(res => {
//           let value = res?.User;
//           if (value?.length > 0) {
//             value.forEach(ele => {
//               ele["CurrentDate"] = todayDate;
//             });
//             console.log(value);
//             // show tableData
//             RegisterUser = value;
//           }
//         })
//         .catch(err => {
//           console.log(err);
//         });

//       // let URL = `http://13.201.119.216:8050/api/attendanceAws/${db}`;
//       // await axios
//       //   .get(URL)
//       await _Get(RegisteredAttendanceUser, db)
//         .then(res => {
//           console.log(res?.Attendance);
//           // console.log(todayDate);
//           let latest = res?.Attendance?.filter(
//             atten => atten?.createdAt?.split("T")[0] == todayDate
//           );
//           // let latest = res?.Attendance?.filter(atten =>
//           //   console.log("List", atten)
//           // );
//           console.log(latest);
//           // setTotalAttendance(res?.attendanceTotal);
//           setTotalAttendance(res?.Attendance);
//           let value = RegisterUser?.flatMap((ele, i) => {
//             latest?.flatMap((data, index) => {
//               if (
//                 ele?.Pan_No == data?.details?.panNo ||
//                 ele?.Aadhar_No == data?.details?.panNo
//               ) {
//                 ele.attendence = data;
//               } else {
//                 ele;
//               }
//             });
//           });
//           // console.log(value);
//           setLoading(false);
//           // setDataSource(RegisterUser);
//           console.log(latest);
//           setDataSource(latest);
//           setAllDataSource(RegisterUser);
//         })
//         .catch(error => {
//           setDataSource([]);
//           setLoading(false);
//           console.error("Error fetching data:", error);
//         });
//     })();
//   };

//   const handleName = (ind, data, ele) => {
//     let userOne;
//     // if (data?.panNo || data?.Pan_No || data?.Aadhar_No) {
//     //   userOne = TotalAttendance?.filter(
//     //     ele =>
//     //       ele?.details?.panNo == data?.panNo ||
//     //       ele?.details?.panNo == data?.Pan_No ||
//     //       ele?.details?.panNo == data?.Aadhar_No
//     //   );
//     //   setInsideData(userOne);
//     //   setAllInsideData(userOne);
//     //   setCurrentIndex(ind);
//     //   setIstrue(!isTrue);
//     // } else {
//     //   swal("error", "No Data Found for Today", "error");
//     // }
//     if (data?.userId) {
//       userOne = TotalAttendance?.filter(ele => ele?.userId == data?.userId);
//       console.log(userOne);
//       setInsideData(userOne);
//       setAllInsideData(userOne);
//       setCurrentIndex(ind);
//       setIstrue(!isTrue);
//     } else {
//       swal("error", "No Data Found for Today", "error");
//     }
//   };
//   const handleViewOne = (data, intimeIndex, OutTimeIndex) => {
//     let value = {
//       ...data,
//       intimeIndex: intimeIndex,
//       OutTimeIndex: OutTimeIndex,
//     };
//     setEditData(value);
//     setInTime(data?.attendence?.details?.inTimes[intimeIndex]);
//     setOutTime(data?.attendence?.details?.outTimes[OutTimeIndex]);
//     toggle();
//   };
//   const handleEditAttendanceSubmit = async e => {
//     e.preventDefault();

//     let Payload = {
//       inTimeIndex: EditData?.intimeIndex,
//       inTime: InTime,
//       outTimeIndex: EditData?.OutTimeIndex,
//       outTime: OutTime,
//     };
//     // debugger;
//     await axios
//       .put(
//         `https://node-second.rupioo.com/editTimes/${EditData?.attendence?.details._id}`,
//         Payload
//       )
//       .then(res => {
//         if (res?.data?.status) {
//           let userId = JSON.parse(localStorage.getItem("userData"));
//           listData(userId?._id, userId?.database);
//           toggle();
//         }
//       })
//       .catch(err => {
//         if (!!err?.response?.data?.message) {
//           swal("error", `${err?.response?.data?.message}`, "error");
//         }
//       });
//   };
//   const handleParentSubmit = e => {
//     e.preventDefault();
//     let SuperAdmin = JSON.parse(localStorage.getItem("SuperadminIdByMaster"));
//     let id = SuperAdmin?.split(" ")[0];
//     let db = SuperAdmin?.split(" ")[1];
//     listData(id, db);
//   };
//   const handleDropdownChange = selectedValue => {
//     localStorage.setItem("SuperadminIdByMaster", JSON.stringify(selectedValue));
//     // let SuperAdmin = JSON.parse(localStorage.getItem("SuperadminIdByMaster"));
//   };
//   const handleLogs = () => {
//     history.push("/app/ajgroup/HRM/LogsList");
//   };
//   return (
//     <>
//       {loading ? (
//         <>
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               // marginTop: "10rem",
//             }}
//           >
//             <Spinner
//               style={{
//                 height: "4rem",
//                 width: "4rem",
//               }}
//               color="primary"
//             >
//               Loading...
//             </Spinner>
//           </div>
//         </>
//       ) : (
//         <>
//           <Row>
//             <Col>
//               <h1 className="mb-3">Attendance List</h1>
//             </Col>
//             {MasterShow && MasterShow ? (
//               <Col>
//                 <SuperAdminUI
//                   onDropdownChange={handleDropdownChange}
//                   onSubmit={handleParentSubmit}
//                 />
//               </Col>
//             ) : (
//               <Col></Col>
//             )}
//             <Col>
//               <div className="d-flex justify-content-end">
//                 <Button
//                   style={{
//                     cursor: "pointer",
//                     backgroundColor: "rgb(8, 91, 245)",
//                     color: "white",
//                     fontWeight: "600",
//                     height: "43px",
//                   }}
//                   color="#39cccc"
//                   onClick={handleLogs}
//                 >
//                   Logs
//                 </Button>
//               </div>
//             </Col>
//             <Col lg="2" md="2" sm="12">
//               <div className="cssforproductlist">
//                 <Input
//                   width={30}
//                   type="text"
//                   placeholder="Search Name here ..."
//                   onChange={e => setSearch(e.target.value?.toLowerCase())}
//                 />
//               </div>
//             </Col>
//           </Row>
//           <Table responsive className="outerTable">
//             <thead>
//               <tr style={{ height: "47px" }}>
//                 <th>Name</th>
//                 <th>Date</th>
//                 <th>In Time</th>
//                 <th>Out Time</th>
//                 <th>Salary</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {dataSource &&
//                 dataSource?.map((ele, ind) => (
//                   <>
//                     <tr style={{ height: "47px" }} key={ind}>
//                       <td
//                         onClick={() =>
//                           handleName(
//                             ind,
//                             ele?.attendence?.details
//                               ? ele?.attendence?.details
//                               : ele,
//                             ele
//                           )
//                         }
//                         style={{ cursor: "pointer" }}
//                       >
//                         <span>
//                           {!!ele?.fullName && <>{`${ele?.fullName}`}</>}
//                         </span>
//                       </td>
//                       <td>{!!ele?.currentDate && ele?.currentDate}</td>
//                       <td>{!!ele?.intime[0] && ele?.intime[0]}</td>

//                       <td>
//                         {!!ele?.outtime?.length > 0 &&
//                           ele?.outtime[ele?.outtime?.length - 1]}
//                       </td>
//                       <td>{ele?.salary}</td>
//                       <td>
//                         {" "}
//                         <span
//                           onClick={() =>
//                             handleViewOne(
//                               ele,
//                               0,
//                               ele?.attendence?.details?.outTimes?.length > 0
//                                 ? ele?.attendence?.details?.outTimes?.length - 1
//                                 : 0
//                             )
//                           }
//                           style={{ cursor: "pointer" }}
//                           className="mr-1"
//                         >
//                           <Edit color="green" />
//                         </span>
//                       </td>
//                     </tr>

//                     {currentIndex == ind && isTrue && (
//                       <tr>
//                         <td colSpan="4" className="innerTable">
//                           {/* <div className="d-flex justify-content-end">
//                             <Col lg="2" md="2" sm="12">
//                               <Input
//                                 width={30}
//                                 className="mt-1 mb-1"
//                                 type="text"
//                                 placeholder="Search Date here ..."
//                                 onChange={(e) =>
//                                   setSearch(e.target.value?.toLowerCase())
//                                 }
//                               />
//                             </Col>
//                           </div> */}
//                           <InnerTable insideData={insideData} />
//                         </td>
//                       </tr>
//                     )}
//                   </>
//                 ))}
//             </tbody>
//           </Table>
//           <>
//             <Row>
//               {/* {TodayImages?.length > 0 &&
//                 TodayImages?.map((ele, index) => (
//                   <>
//                     <Col key={index} lg="2" md="2">
//                       <img src={ele?.image} height={150} width={100} />
//                     </Col>
//                   </>
//                 ))} */}
//             </Row>
//           </>
//         </>
//       )}
//       <Modal isOpen={modal} toggle={toggle} {...args}>
//         <ModalHeader toggle={toggle}>Update Attendance</ModalHeader>
//         <ModalBody>
//           <div className="d-flex justify-content-center">
//             <h4>
//               Edit Attendance for{" "}
//               {EditData?.firstName && (
//                 <>
//                   {EditData?.firstName} {EditData?.lastName}
//                 </>
//               )}{" "}
//             </h4>
//           </div>
//           <div className="d-flex justify-content-center">
//             <h4>
//               {EditData?.attendence?.attendance?.date ? (
//                 <> Date : {EditData?.attendence?.attendance?.date}</>
//               ) : null}
//             </h4>
//           </div>
//           <div className="p-1 pt-1 pb-1">
//             <Row>
//               <Col>
//                 <Label>In Time</Label>
//                 <Input
//                   value={InTime}
//                   onChange={e => setInTime(e.target.value)}
//                   placeholder="In time.."
//                 />
//               </Col>
//               <Col>
//                 <Label>Out Time</Label>
//                 <Input
//                   value={OutTime}
//                   onChange={e => setOutTime(e.target.value)}
//                   placeholder="Out time.."
//                 />
//               </Col>
//             </Row>
//           </div>
//         </ModalBody>
//         <ModalFooter>
//           <Button
//             color="primary"
//             // onClick={toggle}
//             onClick={handleEditAttendanceSubmit}
//           >
//             Submit
//           </Button>
//         </ModalFooter>
//       </Modal>
//     </>
//   );
// }

// function List() {
//   const [Search, setSearch] = useState("");
//   // const [MasterShow, setMasterShow] = useState(false);
//   const history = useHistory();

//   const handleParentSubmit = e => {
//     e.preventDefault();
//     let SuperAdmin = JSON.parse(localStorage.getItem("SuperadminIdByMaster"));
//     let id = SuperAdmin?.split(" ")[0];
//     let db = SuperAdmin?.split(" ")[1];
//     Apicalling(id, db);
//   };
//   const handleDropdownChange = selectedValue => {
//     debugger;
//     localStorage.setItem("SuperadminIdByMaster", JSON.stringify(selectedValue));
//   };
//   return (
//     <div>
//       <Row>
//         {/* <Col>
//           <h1 className="mb-3">Attendance List</h1>
//         </Col> */}
//         {/* {MasterShow && MasterShow ? (
//           <Col>
//             <SuperAdminUI
//               onDropdownChange={handleDropdownChange}
//               onSubmit={() => handleParentSubmit}
//             />
//           </Col>
//         ) : (
//           <Col></Col>
//         )} */}
//         {/* <Col>
//           <div className="d-flex justify-content-end">
//             <Button color="primary" onClick={handleLogs}>
//               Logs
//             </Button>
//           </div>
//         </Col> */}
//         {/* <Col lg="2" md="2" sm="12">
//           <Input
//             width={30}
//             type="text"
//             placeholder="Search Name here ..."
//             onChange={(e) => setSearch(e.target.value?.toLowerCase())}
//           />
//         </Col> */}
//       </Row>
//       <div className="d-flex justify-content-space-between">
//         {/* <div>
//         </div> */}
//       </div>
//       <OuterTable
//         Search={Search}
//         setSearch={setSearch}
//         // Apicalling={Apicalling}
//       />
//     </div>
//   );
// }

// export default List;
import React, { useState, useEffect } from "react";
// import { _GetList, _Get, _Put } from "../components/ApiCalling";
import {
  _Delete,
  _GetList,
  _Get,
  _Put,
} from "../../../../../ApiEndPoint/ApiCalling";

import axiosConfigThirdParty from "../../../../../axiosConfigThird";

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  CustomInput,
} from "reactstrap";
import axios from "axios";
import { Col, Input, Row, Spinner, Table } from "reactstrap";
import swal from "sweetalert";
import { useHistory } from "react-router-dom";
import { Edit, Edit2 } from "react-feather";
import {
  RegisteredAttendanceUser,
  RegisteredAttendanceUsers,
  RegisteredUser,
  UpdateAttendanceByMonth,
  ViewOneById,
} from "../../../../../ApiEndPoint/Api";
import { FiEdit3 } from "react-icons/fi";

function InnerTable(
  { insideData, PersonInfo, TotalAttendance, listData },
  args
) {
  const [formValues, setFormValues] = useState([]);
  // const [formValues, setFormValues] = useState([
  //   { intime: "", outtime: "", currentDate: "", userId: "", id: "" },
  // ]);
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  const handleViewOne = (data) => {
    let value = [...data];
    let payload = value.map((ele) => {
      return {
        intime: ele?.intime[0] ? ele?.intime[0] : null,
        outtime: ele?.outtime[0] ? ele?.outtime[0] : null,
        currentDate: ele?.currentDate ? ele?.currentDate : null,
        userId: ele?.userId ? ele?.userId : null,
        _id: ele?._id ? ele?._id : null,
        shift: ele?.shift ? ele?.shift : null,
        intimeFormat: validateTime(ele?.intime[0]),
        outtimeFormat: validateTime(ele?.outtime[0]),
      };
    });
    setFormValues(payload.reverse());
    toggle();
  };

  let handleChange = (i, e) => {
    let newFormValues = [...formValues];

    newFormValues[i][e.target.name] = e.target.value.toUpperCase();
    if (validateTime(e.target.value.toUpperCase())) {
      if (e.target.name == "intime") {
        newFormValues[i]["intimeFormat"] = true;
      }
      if (e.target.name == "outtime") {
        newFormValues[i]["outtimeFormat"] = true;
      }

      setFormValues(newFormValues);
    } else {
      if (e.target.name == "intime") {
        newFormValues[i]["intimeFormat"] = false;
      }
      if (e.target.name == "outtime") {
        newFormValues[i]["outtimeFormat"] = false;
      }
      setFormValues(newFormValues);
    }
  };
  const validateTime = (timeString) => {
    const regex = /^(0?[1-9]|1[0-2]):([0-5][0-9]):([0-5][0-9])\s[AP]M$/;
    // const regex = /^(1[0-2]|[1-9]):([0-5][0-9]):([0-5][0-9])\s[AP]M$/;

    return regex.test(timeString);
  };

  const handleEditAttendanceSubmit = async (e) => {
    e.preventDefault();
    // let inTimeFormat = formValues?.every((ele) => ele?.intimeFormat);
    // let OutTimeFormat = formValues?.every((ele) => ele?.outtimeFormat);
    // if (inTimeFormat && OutTimeFormat) {
    let payload = formValues?.map((ele) => {
      let intime = null;
      if (ele.intime) {
        intime = convertTo12Hour(ele.intime);
      }
      let outtime = null;
      if (ele.outtime) {
        outtime = convertTo12Hour(ele.outtime);
      }
      return {
        intime: intime ? [intime] : [],
        outtime: outtime ? [outtime] : [],
        currentDate: ele?.currentDate,
        userId: ele?.userId,
        _id: ele?.userId,
        shift: ele?.shift,
      };
    });
    await axiosConfigThirdParty
      .put(UpdateAttendanceByMonth, { updates: payload })
      .then((res) => {
        console.log(res);
        let userId = JSON.parse(localStorage.getItem("userData"));
        listData(userId?._id, userId?.database);
        swal("Success", "Updated Successfully", "success");
      })
      .catch((err) => {
        console.log(err);
      });
    // } else {
    //   swal("Error", "Invalid Format", "error");
    // }
  };
  const convertTo12Hour = (time) => {
    let second = "00";
    const [hours, minutes] = time.split(":");
    let hour = parseInt(hours, 10);
    const period = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minutes}:${second} ${period}`;
  };
  const convertTo24Hour = (time12) => {
    const [time, period] = time12.split(" ");
    const [hours, minutes, seconds] = time.split(":");
    let hour = parseInt(hours, 10);
    if (period === "PM" && hour < 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, "0")}:${minutes}`;
    // return `${hour.toString().padStart(2, "0")}:${minutes}:${seconds}`;
  };
  return (
    <>
      <div className="" style={{ backgroundColor: "#80808014" }}>
        <Row>
          {PersonInfo?.imageUrl && (
            <Col lg="2" md="2" sm="6">
              <div className="d-flex justify-content-start p-2">
                {" "}
                <img
                  style={{
                    borderRadius: "50%",
                    border: "1px solid black",
                    padding: "1px",
                  }}
                  height={190}
                  width={180}
                  src={PersonInfo?.imageUrl}
                  alt="User Image"
                />
              </div>
            </Col>
          )}
          <Col style={{ fontSize: "19px" }} lg="4" md="4" sm="6">
            <div className="mt-2 d-flex justify-content-start">
              {" "}
              Name:{" "}
              {`${PersonInfo?.firstName?.toUpperCase()} ${PersonInfo?.lastName?.toUpperCase()}`}
            </div>
            <div className="mt-1 d-flex justify-content-start">
              Email: {`${PersonInfo?.email}`}
            </div>
            <div className="mt-1 d-flex justify-content-start">
              Branch: {`${PersonInfo?.branch?.branchName}`}
            </div>
            <div className="mt-1 d-flex justify-content-start">
              State/City:
              {`${PersonInfo?.branch?.state}/${PersonInfo?.branch?.city}`}
            </div>
          </Col>
          <Col></Col>
          <Col lg="1" md="1" sm="6">
            <div
              title="Edit Monthly Attendance"
              style={{ cursor: "pointer" }}
              className="d-flex justify-content-end p-3">
              <FiEdit3
                onClick={() => handleViewOne(insideData)}
                style={{ cursor: "pointer" }}
                color="red"
                size={35}
              />
            </div>
          </Col>
        </Row>
        <Table hover responsive className="innerTable">
          <thead>
            <tr style={{ height: "47px" }}>
              <th>Date</th>
              <th>InTime</th>
              <th>OutTime</th>
              <th>Duration</th>
              <th>lateBy</th>
              <th>ShortBy</th>
              {/* <th>Working</th> */}
              <th>Amount</th>
              {/* <th>Action</th> */}
            </tr>
          </thead>
          <tbody>
            {insideData?.length > 0 ? (
              insideData
                ?.map((custom, index) => (
                  <>
                    <tr style={{ height: "47px" }} key={index}>
                      <td>{custom?.currentDate}</td>
                      <td>{custom?.intime[0]}</td>
                      <td>{custom?.outtime[0]}</td>
                      <td>{custom?.workingHours}</td>
                      <td>{custom?.lateTime}</td>
                      <td>{custom?.overtime}</td>
                      {/* <td>{custom?.working_hour}</td> */}
                      <td>{custom?.amount}</td>
                    </tr>
                  </>
                ))
                .reverse()
            ) : (
              <>
                <tr style={{ height: "47px" }}>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr style={{ height: "47px" }}>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </>
            )}
          </tbody>
        </Table>
      </div>
      <Modal
        backdrop="false"
        size="xl"
        isOpen={modal}
        toggle={toggle}
        {...args}>
        <ModalHeader toggle={toggle}>Update Attendance</ModalHeader>
        <ModalBody>
          <div className="d-flex justify-content-center">
            <h4>
              Edit Attendance for{" "}
              {`${PersonInfo?.firstName?.toUpperCase()} ${PersonInfo?.lastName?.toUpperCase()}`}{" "}
            </h4>
          </div>
          {formValues?.length > 0 &&
            formValues?.map((element, index) => {
              let intime = null;
              if (element.intime) {
                intime = convertTo24Hour(element.intime);
              }
              let outtime = null;
              if (element.outtime) {
                outtime = convertTo24Hour(element.outtime);
              }
              return (
                <Row className="p-1 " key={index}>
                  <Col>
                    <Label>Date</Label>
                    <Input
                      readOnly
                      type="text"
                      name="currentDate"
                      value={element.currentDate || ""}
                      // onChange={(e) => handleChange(index, e)}
                    />
                  </Col>
                  <Col>
                    <Label>
                      InTime :{" "}
                      {/* {element?.intimeFormat ? null : (
                        <>
                          <span style={{ color: "red" }}>Wrong Format</span>
                        </>
                      )} */}
                    </Label>
                    <Input
                      type="time"
                      name="intime"
                      value={intime || ""}
                      onChange={(e) => handleChange(index, e)}
                    />
                    {/* <Input
                      type="text"
                      name="intime"
                      value={element.intime || ""}
                      onChange={(e) => handleChange(index, e)}
                    /> */}
                  </Col>
                  <Col>
                    <Label>
                      OutTime :{" "}
                      {/* {element?.outtimeFormat ? null : (
                        <>
                          <span style={{ color: "red" }}>Wrong Format</span>
                        </>
                      )} */}
                    </Label>
                    <Input
                      type="time"
                      name="outtime"
                      value={outtime || ""}
                      onChange={(e) => handleChange(index, e)}
                    />
                    {/* <Input
                      type="text"
                      name="outtime"
                      value={element.outtime || ""}
                      onChange={(e) => handleChange(index, e)}
                    /> */}
                  </Col>
                </Row>
              );
            })}
          <div className="d-flex justify-content-center">
            <Button color="primary" onClick={handleEditAttendanceSubmit}>
              Submit
            </Button>
          </div>
        </ModalBody>
        {/* <ModalFooter> */}
        {/* </ModalFooter> */}
      </Modal>
    </>
  );
}

function OuterTable({ Search, setSearch }, args) {
  const [DataSource, setDataSource] = useState([]);
  const [AllAttendance, setAllAttendance] = useState([]);
  const [AllDataSource, setAllDataSource] = useState([]);
  const [insideData, setInsideData] = useState([]);
  const [TotalAttendance, setTotalAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [EditData, setEditData] = useState(null);
  const [isTrue, setIstrue] = useState(false);
  const [currentIndex, setCurrentIndex] = useState("");
  const [PersonInfo, setPersonInfo] = useState(null);
  const [InTime, setInTime] = useState("");
  const [OutTime, setOutTime] = useState("");
  const [modal, setModal] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedEmployees = DataSource?.map((employee) => {
        let timeInOffice = null;
        if (employee.attendence?.intime[0]) {
          timeInOffice = calculateTimeInOffice(
            employee.attendence?.intime[0],
            employee.attendence?.outtime[0]
          );
        }
        return { ...employee, timeInOffice };
      });
      setDataSource(updatedEmployees);
    }, 1000); // Update every minute

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [DataSource]);
  const calculateTimeInOffice = (intime, outtime) => {
    let todayDate = new Date()?.toISOString()?.split("T")[0];
    const intDate = new Date(`${todayDate} ${intime}`);
    const endTime = outtime ? new Date(`${todayDate} ${outtime}`) : new Date();
    // const currentTime = new Date();
    // const intDate = new Date(`${todayDate} ${intime}`);

    const diff = endTime - intDate;
    const diffInHours = Math.floor(diff / (1000 * 60 * 60));
    const diffInMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const diffInSeconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${diffInHours} hr : ${diffInMinutes} min ${diffInSeconds} sec`;
  };

  const toggle = () => setModal(!modal);
  useEffect(() => {
    let searchingItem = AllDataSource?.filter(
      (element, index) =>
        element?.firstName?.toLowerCase()?.includes(Search) ||
        element?.lastName?.toLowerCase()?.includes(Search)
    );
    if (Search?.length) {
      setDataSource(searchingItem);
    } else {
      setDataSource(AllDataSource);
    }
  }, [Search]);

  useEffect(() => {
    let userId = JSON.parse(localStorage.getItem("userData"));
    listData(userId?._id, userId?.database);
  }, []);
  const listData = (id, db) => {
    (async () => {
      setLoading(true);
      let RegisterUser = [];
      let todayDate = new Date()?.toISOString()?.split("T")[0];
      let user = JSON.parse(localStorage.getItem("userData"));
      let URl = `${RegisteredUser}/${db}`;
      await _GetList(URl)
        .then((res) => {
          let value = res?.User?.filter(
            (ele) => ele?.rolename?.roleName !== "SuperAdmin"
          );

          if (value?.length > 0) {
            value.forEach((ele) => {
              ele["CurrentDate"] = todayDate;
            });
            RegisterUser = value;
          }
        })
        .catch((err) => {
          console.log(err);
        });
      let URL = `${RegisteredAttendanceUsers}/${db}`;
      await axiosConfigThirdParty
        .get(URL)
        .then((res) => {
          setLoading(false);
          let latest = res?.data?.Attendance?.filter(
            (atten) => atten?.createdAt?.split("T")[0] == todayDate
          );

          let todayData = res?.Attendance?.filter(
            (ele) => ele?.createdAt?.split("T")[0] == todayDate
          );
          RegisterUser.forEach((ele) => {
            latest?.forEach((data) => {
              if (ele._id === data?.userId) {
                ele.attendence = data;
              }
            });
            return ele;
          });

          setLoading(false);
          setAllAttendance(res?.data?.Attendance);
          setDataSource(RegisterUser);
          setAllDataSource(RegisterUser);
        })
        .catch((err) => {
          setLoading(false);
          setDataSource([]);
        });
    })();
  };

  const handleName = async (ind, value) => {
    setCurrentIndex(ind);
    setPersonInfo(value);
    let filter = AllAttendance?.filter((ele) => ele?.userId == value?._id);
    let CurrentMonthData;
    if (filter?.length > 0) {
      CurrentMonthData = filter?.filter(
        (ele) =>
          ele?.createdAt?.split("T")[0]?.split("-")[1] ==
          value?.CurrentDate?.split("-")[1]
      );
      // setInsideData(CurrentMonthData);
    }
    let user = JSON.parse(localStorage.getItem("userData"));
    // setInsideData(CurrentMonthData ? CurrentMonthData : filter);
    // setInsideData(filter);
    setIstrue(!isTrue);
    if (!isTrue) {
      (async () => {
        await axiosConfigThirdParty
          .get(`${ViewOneById}/${value?._id}`)
          .then((res) => {
            let currentMonthData = filterCurrentMonthData(
              res?.data?.Attendance
            );
            setInsideData(currentMonthData);
            setTotalAttendance(res?.data?.Attendance);
            // setInsideData(res?.data?.Attendance);
            setIstrue(!isTrue);
          })
          .catch((err) => {
            // console.log(err);
            setInsideData([]);
            setIstrue(!isTrue);
          });
      })();
    }
    // if (data?.panNo || data?.Pan_No || data?.Aadhar_No) {
  };
  const filterCurrentMonthData = (dataArray) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    return dataArray?.filter((item) => {
      const itemDate = new Date(item.currentDate);
      return (
        itemDate.getMonth() === currentMonth &&
        itemDate.getFullYear() === currentYear
      );
    });
  };
  const handleViewOne = (data, intimeIndex, OutTimeIndex) => {
    let value = {
      ...data,
      intimeIndex: intimeIndex,
      OutTimeIndex: OutTimeIndex,
    };

    setEditData(value);
    setInTime(data?.attendence?.details?.inTimes[intimeIndex]);
    setOutTime(data?.attendence?.details?.outTimes[OutTimeIndex]);
    toggle();
  };
  const handleEditAttendanceSubmit = async (e) => {
    e.preventDefault();

    let Payload = {
      inTimeIndex: EditData?.intimeIndex,
      inTime: InTime,
      outTimeIndex: EditData?.OutTimeIndex,
      outTime: OutTime,
    };
    await axios
      .put(
        `https://node-second.rupioo.com/editTimes/${EditData?.attendence?.details._id}`,
        Payload
      )
      .then((res) => {
        if (res?.data?.status) {
          listData();
          toggle();
        }
      })
      .catch((err) => {
        if (!!err?.response?.data?.message) {
          swal("error", `${err?.response?.data?.message}`, "error");
        }
      });
  };
  return (
    <>
      {loading ? (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
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
        </>
      ) : (
        <>
          <Table hover responsive className="">
            <thead>
              <tr style={{ height: "47px" }}>
                <th>#</th>
                <th>Name</th>
                <th>Date</th>
                <th>In Time</th>
                <th>Out Time</th>
                <th>Duration</th>
                <th>Salary</th>
                {/* <th>Action</th> */}
              </tr>
            </thead>
            <tbody>
              {DataSource &&
                DataSource?.map((ele, ind) => (
                  <>
                    <tr style={{ height: "40px" }} key={ind}>
                      <td>{ind + 1}</td>
                      <td
                        onClick={() => handleName(ind, ele ? ele : ele)}
                        style={{ cursor: "pointer" }}>
                        <span>
                          {!!ele?.firstName && (
                            <>{`${ele?.firstName} ${ele?.lastName}`}</>
                          )}
                        </span>
                      </td>
                      <td>{ele?.CurrentDate}</td>
                      <td>
                        {!!ele?.attendence?.intime[0] &&
                          ele?.attendence?.intime[0]}
                      </td>
                      <td>
                        {!!ele?.attendence?.outtime[0] &&
                          ele?.attendence?.outtime[0]}
                      </td>
                      <td>{ele?.timeInOffice && ele?.timeInOffice}</td>
                      {/* <td>{workingHours}</td> */}
                      {/* <td>{ele?.duration && ele?.duration}</td> */}
                      <td>{ele?.salary}</td>
                      {/* <td>
                        {" "}
                        <span
                          onClick={() =>
                            handleViewOne(
                              ele,
                              0,
                              ele?.attendence?.details?.outTimes?.length > 0
                                ? ele?.attendence?.details?.outTimes?.length - 1
                                : 0
                            )
                          }
                          style={{ cursor: "pointer" }}
                          className="mr-1"
                        >
                          <Edit color="green" />
                        </span>
                      </td> */}
                    </tr>

                    {currentIndex == ind && isTrue && (
                      <tr>
                        <td colSpan="12" className="innerTable">
                          <div className="d-flex justify-content-end">
                            {/* <Col lg="2" md="2" sm="12">
                              <Input
                                width={30}
                                className="mt-1 mb-1"
                                type="text"
                                placeholder="Search Date here ..."
                                onChange={(e) =>
                                  setSearch(e.target.value?.toLowerCase())
                                }
                              />
                            </Col> */}
                          </div>
                          <InnerTable
                            insideData={insideData}
                            PersonInfo={PersonInfo}
                            TotalAttendance={TotalAttendance}
                            listData={listData}
                          />
                        </td>
                      </tr>
                    )}
                  </>
                ))}
            </tbody>
          </Table>
          <>
            <Row>
              {/* {TodayImages?.length > 0 &&
                TodayImages?.map((ele, index) => (
                  <>
                    <Col key={index} lg="2" md="2">
                      <img src={ele?.image} height={150} width={100} />
                    </Col>
                  </>
                ))} */}
            </Row>
          </>
        </>
      )}
      <Modal isOpen={modal} toggle={toggle} {...args}>
        <ModalHeader toggle={toggle}>Update Attendance</ModalHeader>
        <ModalBody>
          <div className="d-flex justify-content-center">
            <h4>
              Edit Attendance for{" "}
              {EditData?.firstName && (
                <>
                  {EditData?.firstName} {EditData?.lastName}
                </>
              )}{" "}
            </h4>
          </div>
          <div className="d-flex justify-content-center">
            <h4>
              {EditData?.attendence?.attendance?.date ? (
                <> Date : {EditData?.attendence?.attendance?.date}</>
              ) : null}
            </h4>
          </div>
          <div className="p-1 pt-1 pb-1">
            <Row>
              <Col>
                <Label>In Time</Label>
                <Input
                  value={InTime}
                  onChange={(e) => setInTime(e.target.value)}
                  placeholder="In time.."
                />
              </Col>
              <Col>
                <Label>Out Time</Label>
                <Input
                  value={OutTime}
                  onChange={(e) => setOutTime(e.target.value)}
                  placeholder="Out time.."
                />
              </Col>
            </Row>
          </div>
        </ModalBody>
        {/* <ModalFooter>
          <Button
            color="primary"
            // onClick={toggle}
            onClick={handleEditAttendanceSubmit}>
            Submit
          </Button>
        </ModalFooter> */}
      </Modal>
    </>
  );
}

function List() {
  const [Search, setSearch] = useState("");
  const history = useHistory();
  const handleLogs = () => {
    history.push("/app/ajgroup/HRM/LogsList");
    //   }
  };

  return (
    <div>
      <div className="card p-1">
        <Row style={{marginLeft:'3px',marginRight:'3px'}}>
          <Col  className="mb-2" >
            <h1 className=" " style={{ fontWeight: "600" ,textTransform:'uppercase', fontSize:'18px' ,marginTop:"25px"}}>Attendance List</h1>
          </Col>
          {/* <Col lg="3" md="3" sm="12">
            <div className="d-flex justify-content-end">
              <CustomInput type="select">
                <option>----Select Branch----</option>
                <option>----select Branch----</option>
                <option>----select Branch----</option>
              </CustomInput>
            </div>
          </Col> */}
          <Col lg="2" className="mb-2" style={{marginTop:"25px"}} sm="12">
            <Input
              
              type="text"
             className="cssforsearchattentlist table-input cssforproductlist"
           
              placeholder="Search Name here ..."
              onChange={(e) => setSearch(e.target.value?.toLowerCase())}
            />
          </Col>
          <Col lg="1"  className="mb-2" style={{marginTop:"25px"}}>
            <div className="d-flex justify-content-end">
              <Button style={{
                            cursor: "pointer",
                            backgroundColor: "rgb(8, 91, 245)",
                            color: "white",
                            fontWeight: "600",
                            height: "43px",
                          }}
                          className="float-left "
                          color="#39cccc"  onClick={handleLogs}>
                Logs
              </Button>
            </div>
          </Col>
          
        </Row>
        <div className="d-flex justify-content-space-between"></div>

        <OuterTable Search={Search} setSearch={setSearch} />
      </div>
    </div>
  );
}

export default List;
