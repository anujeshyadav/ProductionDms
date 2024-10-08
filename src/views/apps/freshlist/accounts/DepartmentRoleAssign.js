import React, { useEffect, useState } from "react";
import { Button, Col, Input, Label, Row, Spinner } from "reactstrap";
import {
  Get_RoleList,
  _Get,
  _GetList,
  _PostSave,
} from "../../../../ApiEndPoint/ApiCalling";
import { Route } from "react-router-dom";

import {
  List_Department,
  Save_Assigned_Role,
} from "../../../../ApiEndPoint/Api";
import swal from "sweetalert";

const DepartmentRoleAssign = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [DepartMentList, setDepartMentList] = useState([]);
  const [RoleList, setRoleList] = useState([]);
  const [Loader, setLoader] = useState(false);
  const [Index, setIndex] = useState(null);

  //   const roleList = ["Manager", "Developer", "Accountant"]; // Replace with your actual role list

  const handleDepartmentChange = event => {
    const department = event.target.value;
    setSelectedDepartment(department);
  };

  useEffect(() => {
    let userData = JSON.parse(localStorage.getItem("userData"));
    let URL = `${List_Department}/${userData?.database}`;
    _GetList(URL)
      .then(res => {
        let Departments = res?.Department?.filter(
          ele => ele?.status == "Active"
        );

        setDepartMentList(Departments);
      })
      .catch(err => {
        console.log(err);
      });
    RoleLists();
  }, []);

  const RoleLists = () => {
    let userData = JSON.parse(localStorage.getItem("userData"));
    Get_RoleList(userData?._id, userData?.database)
      .then(res => {
        let WithoutAssign = res?.Role?.filter(
          ele => ele?.assign == 0 && ele?.roleName != "SuperAdmin"
          // &&  ele?.roleName != "Admin"
        );
        let Position = userData?.rolename?.position;
        let ShowList = res?.Role?.filter((ele, i) => ele?.position > Position);

        setRoleList(WithoutAssign);
        // setRoleList(res?.Role);
      })
      .catch(err => {
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
    let MainData = selectedRoles?.map((ele, i) => {
      return {
        roleName: ele?.roleName,
        database: ele?.database,
        roleId: ele?._id,
        rolePosition: ele?.createdPosition,
      };
    });
    let payload = {
      created_by: userinfo?._id,
      database: userinfo?.database,
      departmentName: selectedDepartment,
      roles: MainData,
    };

    await _PostSave(Save_Assigned_Role, payload)
      .then(res => {
        console.log(res);
        setSelectedRoles([]);
        setLoader(false);

        swal("Roles Assigned Successfully");
        RoleLists();
      })
      .catch(err => {
        setLoader(false);

        console.log(err);
        swal("Something went wrong");
      });
    // You can send this data to your server or manage it in your state
  };
  if (Loader) {
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
  const handleAddRanking = (e, data, i) => {
    let AllSelected = [...selectedRoles];

    let index = selectedRoles?.indexOf(data);
    AllSelected[index]["createdPosition"] = Number(e.target.value);
    setSelectedRoles(AllSelected);
  };
  return (
    <>
      <div className="card p-3">
        <Row>
          <Col></Col>
          <Col lg="2" sm="2" md="2" ms="12">
            <Route
              render={({ history }) => (
                <Button
                  style={{
                    cursor: "pointer",
                    backgroundColor: "#39cccc",
                    color: "white",
                    fontWeight: "600",
                  }}
                  className=" float-right"
                  color="#39cccc"
                  onClick={() =>
                    history.push("/app/freshlist/account/CreateHeirarchy")
                  }
                >
                  View Hierarchy
                </Button>
              )}
            />
          </Col>
          <Col lg="2" sm="2" md="2" ms="12">
            <Route
              render={({ history }) => (
                <Button
                  style={{
                    cursor: "pointer",
                    backgroundColor: "#39cccc",
                    color: "white",
                    fontWeight: "600",
                  }}
                  className=" float-right"
                  color="#39cccc"
                  onClick={() =>
                    history.push("/app/Ajgroup/account/EditTeamRolePosition")
                  }
                >
                  Edit Hierarchy
                </Button>
              )}
            />
          </Col>
          {/* )} */}

          <Col lg="2">
            <Route
              render={({ history }) => (
                <Button
                  style={{ cursor: "pointer" }}
                  className="float-right mr-1"
                  color="primary"
                  onClick={() => history.goBack()}
                >
                  {" "}
                  Back
                  {/* <FaPlus size={15} /> Create User */}
                </Button>
              )}
            />
          </Col>
        </Row>
        <div className="d-flex justify-content-center">
          <h3 className="mb-3 mt-2">
            <strong>Assign Roles to Department</strong>
          </h3>
        </div>
        <Row>
          <Col lg="4" sm="6" md="4">
            <Label>Select Department:</Label>
            <select
              id="departments"
              className="form-control"
              onChange={handleDepartmentChange}
              value={selectedDepartment}
            >
              <option value="">--Select Department--</option>
              {DepartMentList &&
                DepartMentList?.map((department, i) => (
                  <option key={department?._id} value={department?._id}>
                    {department?.departmentName}
                  </option>
                ))}
            </select>
          </Col>
        </Row>
        <br />

        <div className="d-flex justify-content-center">
          <h3 className="mb-3">
            {RoleList && RoleList ? (
              <>
                <strong>Choose Roles</strong>
              </>
            ) : (
              <>
                <strong>No Roles Found</strong>
              </>
            )}
          </h3>
        </div>
        <Row>
          {RoleList.map((role, i) => (
            <Col lg="6" sm="12" md="6">
              <div
                key={role?._id}
                className="form-label-group d-flex justify-content-space-between"
              >
                <input
                  className="mt-1"
                  required
                  type="checkbox"
                  style={{ marginRight: "3px", height: "22px", width: "22px" }}
                  id={role}
                  value={role}
                  //   checked={selectedRoles?.includes(role?._id)}
                  onChange={() => handleRoleChange(role, i)}
                />
                <span
                  className="mb-1 ml-1"
                  style={{ marginRight: "20px", fontSize: "25px" }}
                >
                  {role?.roleName?.length > 12 ? (
                    <>{role?.roleName?.slice(0, 18)}..</>
                  ) : (
                    <>{role?.roleName}</>
                  )}
                </span>

                <span
                  className="input"
                  style={{ position: "absolute", right: 20, width: "100px" }}
                >
                  <Input
                    onChange={e => handleAddRanking(e, role, i)}
                    placeholder="Ex. 1 or 2 or 3"
                    type="number"
                  />
                </span>
              </div>
            </Col>
          ))}
        </Row>
        <div className="d-flex justify-content-center mt-3">
          <Button
            color="primary"
            onClick={handleAssignRoles}
            disabled={!selectedDepartment || selectedRoles.length === 0}
          >
            Assign Roles
          </Button>
        </div>
      </div>
    </>
  );
};

export default DepartmentRoleAssign;
