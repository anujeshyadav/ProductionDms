import React, { useEffect, useState } from "react";
import { Button, Col, Input, Label, Row, Spinner } from "reactstrap";
import {
  Get_RoleList,
  _Get,
  _GetList,
  _PostSave,
  _Put,
} from "../../../../ApiEndPoint/ApiCalling";
import { Route } from "react-router-dom";

import {
  List_Department,
  Save_Assigned_Role,
  Update_AssignRole_InDepartment,
  ViewDepartmentWise_Assign_Role,
} from "../../../../ApiEndPoint/Api";
import swal from "sweetalert";
import { Delete, Trash2 } from "react-feather";
import { FcCancel } from "react-icons/fc";
import { MdCancel, MdOutlineCancel } from "react-icons/md";

const DepartmentRoleAssign = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [SelectedRolesList, setSelectedRolesList] = useState([]);
  const [DeletedRole, setDeletedRole] = useState([]);
  const [DepartMentList, setDepartMentList] = useState([]);
  const [RoleList, setRoleList] = useState([]);
  const [ChangedDepartment, setChangedDepartment] = useState({});
  const [Loader, setLoader] = useState(false);
  const [Index, setIndex] = useState(null);

  const handleDepartmentChange = (event) => {
    const department = event.target.value;
    let selectedDepartment = DepartMentList?.filter(
      (ele) => ele?._id == department
    );
    setSelectedRolesList(selectedDepartment[0]);
    setSelectedDepartment(department);
  };

  useEffect(() => {
    let userData = JSON.parse(localStorage.getItem("userData"));

    _Get(ViewDepartmentWise_Assign_Role, userData?.database)
      .then((res) => {
        if (res?.Department?.length) {
          setDepartMentList(res?.Department);
        }

        // setDepartmentWithRole(res?.Department);
      })
      .catch((err) => {
        console.log(err);
      });
    // let URL = `${List_Department}/${userData?.database}`;
    // _GetList(URL)
    //   .then((res) => {
    //     let Departments = res?.Department?.filter(
    //       (ele) => ele?.status == "Active"
    //     );

    //     // setDepartMentList(Departments);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    RoleLists();
  }, []);

  const RoleLists = () => {
    let userData = JSON.parse(localStorage.getItem("userData"));
    Get_RoleList(userData?._id, userData?.database)
      .then((res) => {
        let WithoutAssign = res?.Role?.filter(
          (ele) =>
            ele?.assign == 0 &&
            ele?.roleName != "SuperAdmin" &&
            ele?.roleName != "Admin"
        );
        let Position = userData?.rolename?.position;
        let ShowList = res?.Role?.filter((ele, i) => ele?.position > Position);

        setRoleList(WithoutAssign);
        // setRoleList(res?.Role);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRoleChange = (role, i) => {
    setIndex(i);
    const roles = [...selectedRoles];

    if (roles?.includes(role)) {
      // Remove role if it's already selected
      roles?.splice(roles.indexOf(role), 1);
    } else {
      // Add role if it's not selected
      roles.push(role);
    }

    setSelectedRoles(roles);
  };

  const handleAssignRoles = async () => {
    // Implement your logic to assign roles to the selected department
    let userinfo = JSON.parse(localStorage.getItem("userData"));
    setLoader(true);
    let currentDepartmentWithRole = ChangedDepartment?.roles?.map((val) => {
      return {
        database: val?.database,
        roleName: val?.roleName,
        roleId: val?.roleId?._id,
        rolePosition: val?.rolePosition,
      };
    });
    let currentDeletedRole = DeletedRole?.map((val) => {
      return {
        database: val?.database,
        roleName: val?.roleName,
        roleId: val?.roleId?._id,
        rolePosition: val?.rolePosition,
      };
    });
    // let allRoles = [];
    // DepartMentList?.forEach((ele, i) => {
    //   let a = ele?.roles?.map((val) => {
    //     return {
    //       database: val?.database,
    //       roleName: val?.roleName,
    //       roleId: val?.roleId?._id,
    //       rolePosition: val?.rolePosition,
    //     };
    //   });
    //   allRoles.push(a);
    // });
    // let allroleswithPosition = allRoles?.flat();
    // console.log(allroleswithPosition);
    let payload = {
      roles: currentDepartmentWithRole,
      deleteRole: currentDeletedRole,
    };

    await _Put(Update_AssignRole_InDepartment, ChangedDepartment?._id, payload)
      .then((res) => {
        console.log(res);
        setSelectedRoles([]);
        setLoader(false);

        swal("Roles Changed Successfully");
        RoleLists();
      })
      .catch((err) => {
        setLoader(false);

        console.log(err);
        swal("Something went wrong");
      });
  };
  if (Loader) {
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
  const handleAddRanking = (e, data, i, id) => {
    let AllSelected = [...SelectedRolesList?.roles];
    let AllDeptList = [...DepartMentList];
    let index = DepartMentList?.indexOf(SelectedRolesList);
    AllSelected[i]["rolePosition"] = Number(e.target.value);
    AllDeptList[index]["roles"] = AllSelected;
    setDepartMentList(AllDeptList);
    setChangedDepartment(AllDeptList[index]);
  };

  const handleDeleteRole = (data, index) => {
    swal("Warning", "Sure You Want to Delete Role", {
      buttons: {
        catch: { text: "Delete ", value: "delete" },
        cancel: "Cancel",
      },
    }).then((value) => {
      switch (value) {
        case "delete":
          const selectedRole = [...SelectedRolesList?.roles];
          let AllDeptList = [...DepartMentList];
          let MainlistIndex = DepartMentList?.indexOf(SelectedRolesList);
          let wholedata = { ...SelectedRolesList };
          selectedRole?.splice(selectedRole?.indexOf(data), 1);
          let deleted = [...DeletedRole];
          deleted.push(data);
          setDeletedRole(deleted);
          wholedata.roles = selectedRole;
          setSelectedRolesList(wholedata);
          setChangedDepartment(wholedata);
          AllDeptList[MainlistIndex] = wholedata;
          setDepartMentList(AllDeptList);

          break;
        default:
      }
    });

    //
    // let AllDeptList = [...DepartMentList];
    // // let selectedrole = AllSelected?.filter((ele) => ele?._id == wholedata?._id);
    // let index = DepartMentList?.indexOf(SelectedRolesList);
    // AllSelected[i]["rolePosition"] = Number(e.target.value);
    // AllDeptList[index]["roles"] = AllSelected;
    // setDepartMentList(AllDeptList);
    //
  };
  return (
    <>
      <div className="card p-3">
        <Row>
          <Col></Col>

          {/* )} */}

          <Col lg="2">
            <Route
              render={({ history }) => (
                <Button
                  style={{ cursor: "pointer" }}
                  className="float-right mr-1"
                  color="primary"
                  onClick={() => history.goBack()}>
                  {" "}
                  Back
                  {/* <FaPlus size={15} /> Create User */}
                </Button>
              )}
            />
          </Col>
        </Row>
        <div className="d-flex justify-content-center">
          <h3 className="mb-1 mt-1">
            <strong>
              {" "}
              {SelectedRolesList?.departmentName?.departmentName ? (
                <>{SelectedRolesList?.departmentName?.departmentName}</>
              ) : (
                <>Assigned</>
              )}{" "}
              Department and Roles
            </strong>
          </h3>
        </div>
        <div className="d-flex justify-content-center">
          <h3 className="mb-1">
            {SelectedRolesList && SelectedRolesList?.roles ? (
              <>
                <strong>
                  Selected Roles and Position(Position should no be the Same)
                </strong>
              </>
            ) : (
              <>
                <strong>No Roles Assigned</strong>
              </>
            )}
          </h3>
        </div>
        <Row className="mb-1">
          <Col lg="4" sm="6" md="4">
            <Label>Select Department:</Label>
            <select
              id="departments"
              className="form-control"
              onChange={(e) => handleDepartmentChange(e)}
              value={selectedDepartment}>
              <option value="">--Select Department--</option>
              {DepartMentList &&
                DepartMentList?.map((department, i) => (
                  <option key={department?._id} value={department?._id}>
                    {department?.departmentName?.departmentName}
                  </option>
                ))}
            </select>
          </Col>
        </Row>
        <br />

        <Row>
          {SelectedRolesList &&
            SelectedRolesList?.roles?.map((role, i) => (
              <Col lg="6" sm="12" md="6">
                <div
                  key={role?._id}
                  className="form-label-group d-flex justify-content-space-between">
                  <span style={{ cursor: "pointer" }} className="">
                    <MdOutlineCancel
                      onClick={() => handleDeleteRole(role, i)}
                      title="Delete Roles form here"
                      color="red"
                      height={30}
                      width={30}
                    />{" "}
                  </span>
                  <span
                    className="mb-1 ml-1"
                    style={{ marginRight: "20px", fontSize: "25px" }}>
                    {role?.roleName?.length > 12 ? (
                      <>{role?.roleName}</>
                    ) : (
                      <>{role?.roleName}</>
                    )}
                  </span>
                  {role?.rolePosition == "1" ? (
                    <>
                      <span
                        className="input"
                        style={{
                          position: "absolute",
                          right: 20,
                          width: "100px",
                        }}>
                        <Input
                          value={role?.rolePosition}
                          // readOnly
                          onChange={(e) =>
                            handleAddRanking(e, role, i, role?._id)
                          }
                          placeholder="Ex. 1 or 2 or 3"
                          type="text"
                        />
                      </span>
                    </>
                  ) : (
                    <>
                      <span
                        className="input"
                        style={{
                          position: "absolute",
                          right: 20,
                          width: "100px",
                        }}>
                        <Input
                          value={role?.rolePosition}
                          onChange={(e) =>
                            handleAddRanking(e, role, i, role?._id)
                          }
                          placeholder="Ex. 1 or 2 or 3"
                          type="text"
                        />
                      </span>
                    </>
                  )}
                </div>
              </Col>
            ))}
        </Row>
        <div className="d-flex justify-content-center mt-3">
          <Button
            color="primary"
            onClick={handleAssignRoles}
            // disabled={!selectedDepartment || selectedRoles.length === 0}
          >
            Change Roles
          </Button>
        </div>
      </div>
    </>
  );
};

export default DepartmentRoleAssign;
