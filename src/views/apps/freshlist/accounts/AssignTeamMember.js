import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  Col,
  CustomInput,
  Input,
  Label,
  Row,
  Spinner,
  Table,
} from "reactstrap";
import { Route } from "react-router-dom";
import { _Get, _PostSave } from "../../../../ApiEndPoint/ApiCalling";
import {
  All_Users_List,
  Deptartment_with_Role,
  User_Assign_User,
  User_UnLink_User,
} from "../../../../ApiEndPoint/Api";
import swal from "sweetalert";
let SelectedChild = [];
let SelectedChildForUnlink = [];
let SetAllHeadOfdepartment = [];
const AssignTeamMember = () => {
  const [DepartmentWithRole, setDepartmentWithRole] = useState([]);
  const [SelectedDepartment, setSelectedDepartment] = useState([]);
  const [SelectedDepartments, setSelectedDepartments] = useState([]);
  const [ShowParentList, setShowParentList] = useState([]);
  const [tableDataList, setTableDataList] = useState([]);
  const [GetParentList, setGetParentList] = useState([]);
  const [ShowChildUnlink, setShowChildUnlink] = useState([]);
  const [ALLheadsofDept, setALLheadsofDept] = useState([]);
  const [ShowChildList, setShowChildList] = useState([]);
  const [GetChildList, setGetChildList] = useState([]);
  const [Show, setShow] = useState(false);
  const [Child, setChild] = useState(false);
  const [names, setNames] = useState("");
  const [SelectedParentForHeirarchy, setSelectedParentForHeirarchy] = useState(
    {}
  );
  const [SelectedChildForHeirarchy, setSelectedChildForHeirarchy] = useState(
    []
  );
  const [NoChild, setNoChild] = useState(false);
  const [Loader, setLoader] = useState(false);
  const [Party, setParty] = useState(false);
  const [HeadOfDepartment, setHeadOfDepartment] = useState(false);
  const [Parent, setParent] = useState("");
  const [ParentName, setParentName] = useState("");
  const [SelectedRoleId, setSelectedRoleId] = useState("");
  const [ChildList, setChildList] = useState([]);
  const [AllUsersList, setAllUsersList] = useState([]);

  const UserList = () => {
    let userData = JSON.parse(localStorage.getItem("userData"));
    _Get(All_Users_List, userData?.database)
      .then((res) => {
        console.log(res?.User);
        setAllUsersList(res?.User);
        // let WithoutCreatedBy = res?.User?.filter((ele, i) => !ele?.created_by);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    let userData = JSON.parse(localStorage.getItem("userData"));

    UserList();
    _Get(Deptartment_with_Role, userData?.database)
      .then((res) => {
        setDepartmentWithRole(res?.Department);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSaveParent = (parent) => {
    setSelectedParentForHeirarchy(parent);
  };
  const handleUnLinkChild = (ele, e) => {
    if (e.target.checked) {
      SelectedChildForUnlink.push(ele);
      setShowChildUnlink(SelectedChildForUnlink);
    } else {
      let index = SelectedChildForUnlink?.indexOf(ele);
      SelectedChildForUnlink.splice(index, 1);
      if (SelectedChildForUnlink?.length > 0) {
        setShowChildUnlink(SelectedChildForUnlink);
      } else {
        setShowChildUnlink([]);
      }
    }
  };
  const handleSaveChild = (child, e) => {
    if (e.target.checked) {
      SelectedChild.push(child);

      setSelectedChildForHeirarchy(child);
    } else {
      let index = SelectedChild?.indexOf(child);
      setSelectedChildForHeirarchy(SelectedChild.splice(index, 1));
    }
  };

  const handleSubmitUnLinkChild = async (e) => {
    setLoader(true);
    e.preventDefault();

    let child = SelectedChildForUnlink?.map((ele, i) => {
      return {
        id: ele?._id,
      };
    });
    let payload = {
      childs: child,
    };

    await _PostSave(User_UnLink_User, payload)
      .then((res) => {
        UserList();
        setLoader(false);

        setSelectedDepartment([]);
        setShowParentList([]);
        setParent("");
        setShowChildList([]);
        setChild(false);
        setChildList([]);
        SelectedChildForUnlink = [];
        swal("UnLink Successfully");
        window.location.reload();
      })
      .catch((err) => {
        setLoader(false);

        swal("Something Went Wrong");
        console.log(err);
      });
  };
  const handleDropList = (event) => {
    const selectedPosition =
      event.target.options[event.target.selectedIndex].getAttribute("data-id");
    const newList = tableDataList.filter((ele) => ele._id == selectedPosition);

    setShowParentList(newList);
    setNames(event.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    let ParentID = SelectedParentForHeirarchy?._id;
    let child = SelectedChild?.map((ele, i) => {
      return {
        id: ele?._id,
      };
    });
    let payload = {
      parentId: ParentID,
      childs: child,
    };

    await _PostSave(User_Assign_User, payload)
      .then((res) => {
        setLoader(false);
        // console.log(res);

        UserList();
        setSelectedDepartment([]);
        setShowParentList([]);
        setParent("");
        setShowChildList([]);
        setChild(false);
        setChildList([]);
        SelectedChild = [];
        swal("Assigned Successfully");
        window.location.reload();
      })
      .catch((err) => {
        setLoader(false);
        swal("Something Went Wrong");
        console.log(err);
      });
  };

  return (
    <div>
      <Card>
        <CardBody>
          <Row>
            <Col>
              <h1>Assign Team To Parent Node</h1>
            </Col>
            <Col lg="2" md="2">
              <div className="float-right">
                <Route
                  render={({ history }) => (
                    <Button
                      style={{ cursor: "pointer" }}
                      className="float-right mr-1"
                      color="primary"
                      onClick={() => history.goBack()}>
                      {" "}
                      Back
                    </Button>
                  )}
                />
              </div>
            </Col>
          </Row>
          <div className="m-2"></div>
          <div className=" m-2">
            <Row className="">
              <Col lg="2" md="2">
                <Label>Select Department</Label>
                <CustomInput
                  id="12"
                  value={SelectedDepartments}
                  onChange={(e) => {
                    setChild(false);

                    setSelectedDepartments(e.target.value);
                    if (e.target.value == 0) {
                      setShow(false);
                    }
                    e.target.value ? setShow(true) : setShow(false);
                    if (e.target.value == 0) {
                      setShow(false);
                    }
                    if (e.target.value == "All_Dept_Heads") {
                      SetAllHeadOfdepartment = [];
                      setShow(false);
                      // setChild(false);

                      DepartmentWithRole?.map((ele, i) => {
                        ele?.roles?.forEach((val, index) => {
                          if (val?.rolePosition == 1) {
                            SetAllHeadOfdepartment?.push(val);
                          }
                        });
                      });
                      setALLheadsofDept(SetAllHeadOfdepartment);
                      let allHeadUsers = [];
                      SetAllHeadOfdepartment?.map((ele, i) => {
                        AllUsersList?.forEach((val, i) => {
                          if (val?.rolename?._id == ele?.roleId?._id) {
                            allHeadUsers.push(val);
                          }
                        });
                      });

                      setShowChildList(allHeadUsers?.reverse());
                      setGetChildList(allHeadUsers);
                      if (allHeadUsers?.length) {
                        setChild(true);
                      } else {
                        setChild(false);
                      }
                      let userData = JSON.parse(
                        localStorage.getItem("userData")
                      );

                      let arr = [userData];
                      // setTableDataList(arr);
                      console.log("List", arr);
                      setShowParentList(arr);
                      setTableDataList(arr);
                      // setChildList(SelectedChild);
                    } else {
                      let selectedDepartment = DepartmentWithRole?.filter(
                        (ele, i) => ele?._id == e.target.value
                      );
                      setSelectedDepartment(selectedDepartment[0]?.roles);
                    }
                  }}
                  type="select">
                  <option value="0">--Select Department--</option>
                  <option value="All_Dept_Heads">All Department Head</option>
                  {DepartmentWithRole &&
                    DepartmentWithRole?.map((ele, i) => (
                      <option
                        data-name={`${ele?._id} ${ele?.database}`}
                        value={ele?._id}>
                        {ele?.departmentName?.departmentName}
                      </option>
                    ))}
                </CustomInput>
              </Col>
              {Show && Show && (
                <Col lg="2" md="2">
                  <Label>Select Parent Role</Label>
                  <CustomInput
                    value={Parent}
                    id="89"
                    onChange={(e) => {
                      if (e.target.value == "NA") {
                        setChild(false);
                        setParent(e.target.value);
                      } else {
                        const selected = e.target.options[
                          e.target.selectedIndex
                        ]
                          .getAttribute("data-name")
                          ?.split(" ");

                        if (selected[0] === 1) {
                          // pass created by
                          setHeadOfDepartment(true);
                        }

                        const name = selected.slice(2).join(" ");
                        let child = [];
                        if (name == "Sales Person") {
                          child = AllUsersList?.filter(
                            (ele) => ele?.rolename?.roleName == "Customer"
                          );
                        } else {
                          child = SelectedDepartment?.filter(
                            (ele) =>
                              ele?.rolePosition == Number(selected[0]) + 1
                          );
                        }

                        let ParentList = AllUsersList?.filter(
                          (ele) => ele?.rolename?._id == selected[1]
                        );
                        setShowParentList(ParentList);
                        setTableDataList(ParentList);
                        setGetParentList(ParentList);
                        setParent(e.target.value);
                        setParentName(name);
                        setSelectedRoleId(selected[1]);

                        if (child?.length) {
                          let ChildList = [];
                          if (name == "Sales Person") {
                            setShowChildList(child?.reverse());
                            setGetChildList(child);
                            setParty(true);
                            // setShowChildList(ChildList);
                            setChild(true);
                            setChildList(child);
                          } else {
                            ChildList = AllUsersList?.filter(
                              (ele) =>
                                ele?.rolename?._id == child[0]?.roleId?._id
                            )?.reverse();
                            setShowChildList(ChildList);
                            setGetChildList(ChildList);
                            setChild(true);
                            setParty(false);

                            setChildList(child);
                          }
                        } else {
                          setChildList([]);
                          setShowChildList([]);
                          setNoChild(true);
                          setChild(false);
                        }
                      }
                    }}
                    type="select">
                    <option value="NA">--Select Role--</option>
                    {SelectedDepartment &&
                      SelectedDepartment?.map((ele, i) => (
                        <option
                          data-name={`${ele?.rolePosition} ${ele?.roleId?._id} ${ele?.roleName}`}
                          value={ele?._id}>
                          {ele?.roleName} (Position-
                          {ele?.rolePosition})
                        </option>
                      ))}
                  </CustomInput>
                </Col>
              )}
              {ShowParentList && ShowParentList?.length > 0 ? (
                <Col lg="8" md="8" sm="12">
                  <Row>
                    <Col lg="4" mg="4" sm="6">
                      <Label>
                        {ParentName && ParentName ? (
                          <> {ParentName} (Parent)</>
                        ) : (
                          "Head"
                        )}
                        List
                      </Label>
                    </Col>
                    <Col></Col>
                    <Col lg="3" mg="3" sm="6">
                      <div className="mr-2 pr-1">
                        <Input
                          type="text"
                          className="searchBoxStyle"
                          name="search"
                          placeholder="Search Here..."
                          onChange={(e) => {
                            let list = [...ShowParentList];
                            let fiterData = list?.filter(
                              (ele) =>
                                ele?.firstName
                                  ?.toLowerCase()
                                  ?.includes(e.target.value) ||
                                ele?.lastName
                                  ?.toLowerCase()
                                  ?.includes(e.target.value)
                            );

                            if (e.target.value) {
                              if (fiterData?.length) {
                                setShowParentList(fiterData);
                              }
                            } else {
                              let list = [...GetParentList];
                              setShowParentList(list);
                            }
                          }}
                        />
                      </div>
                    </Col>
                  </Row>
                  <div
                    className="p-1"
                    style={{
                      borderRight: "1px solid black",
                    }}>
                    <Table
                      className="table_heading"
                      style={{ cursor: "pointer" }}
                      responsive>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Assigned To</th>
                          <th>
                            Name
                            {/* with Role */}
                          </th>
                          {ShowParentList?.length > 0 &&
                          ShowParentList[0]?.rolename?.roleName ==
                            "Sales Person" ? (
                            <>
                              <th>Area</th>
                              <th>Designation</th>
                            </>
                          ) : (
                            <>
                              <th>Designation</th>
                            </>
                          )}

                          {/* <th>Mobile Number</th>
                          <th>email</th>
                          <th>State</th>
                          <th>City</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {ShowParentList && ShowParentList?.length ? (
                          <>
                            {ShowParentList?.length > 0 &&
                              ShowParentList?.slice(0, 1)?.map((ele, i) => {
                                console.log("@@ShowParentList", ShowParentList);
                                console.log("@@tableDataList", tableDataList);
                                return (
                                  <tr key={ele?._id}>
                                    <th scope="row">
                                      <input
                                        name="Parent"
                                        value="checkbox1"
                                        type="radio"
                                        onClick={(e) => handleSaveParent(ele)}
                                      />
                                    </th>
                                    <td>
                                      {ele?.created_by?.firstName &&
                                        ele?.created_by?.firstName && (
                                          <strong style={{ fontSize: "16px" }}>
                                            {ele?.created_by?.firstName && (
                                              <>{ele?.created_by?.firstName} </>
                                            )}
                                          </strong>
                                        )}
                                    </td>
                                    <td>
                                      <CustomInput
                                        type="select"
                                        name="Names"
                                        id="5"
                                        value={
                                          names !== ""
                                            ? names
                                            : `${ele?.firstName}`
                                        }
                                        onChange={handleDropList}>
                                        <option value="">Select Name</option>
                                        {tableDataList?.map((item, i) => (
                                          <option
                                            key={i}
                                            data-id={item._id}
                                            data-name={`${item?.firstName}`}>
                                            {item?.firstName}
                                          </option>
                                        ))}
                                        {/* <option>
                                          {`${ele?.firstName} ${ele?.lastName}`}
                                          ({ele?.rolename?.roleName})
                                        </option> */}
                                      </CustomInput>
                                    </td>

                                    {ele?.rolename?.roleName ==
                                    "Sales Person" ? (
                                      <>
                                        <td>{ele?.area && ele?.area}</td>
                                        <td>{ele?.rolename?.roleName}</td>
                                      </>
                                    ) : (
                                      <>
                                        <td>{ele?.rolename?.roleName}</td>
                                      </>
                                    )}

                                    {/* <td>{ele?.mobileNumber}</td>
                                    <td>{ele?.email}</td>
                                    <td>{ele?.State}</td>
                                    <td>{ele?.City}</td> */}
                                  </tr>
                                );
                              })}
                          </>
                        ) : null}
                      </tbody>
                    </Table>
                  </div>
                </Col>
              ) : null}
            </Row>
          </div>
          <hr />
          <div className="p-2">
            <Row>
              {ShowChildList && ShowChildList?.length > 0 ? (
                <Col lg="12" md="12" sm="12">
                  <Row>
                    <Col lg="4" mg="4" sm="12">
                      <h5>
                        <strong>
                          {ChildList[0]?.roleName && ChildList[0]?.roleName ? (
                            <>
                              {" "}
                              {ChildList[0]?.roleName && ChildList[0]?.roleName}
                              (child)
                            </>
                          ) : (
                            <>{Party && Party ? "Party" : "All Dept Head"}</>
                          )}{" "}
                          Users List
                        </strong>
                      </h5>
                    </Col>
                    <Col lg="5" mg="5" sm="12">
                      {" "}
                      {Child && Child ? (
                        <>
                          {/* <Col lg="3" md="3">
                    <Label>Next Child</Label>
                    <Input
                      readOnly
                      type="text"
                      value={ChildList[0]?.roleName && ChildList[0]?.roleName}
                    />
                  </Col> */}
                          <>
                            {SelectedChild && SelectedChild?.length > 0 && (
                              <>
                                {!Loader ? (
                                  <>
                                    <Button
                                      color="primary"
                                      onClick={(e) => handleSubmit(e)}>
                                      Submit
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Button color="secondary">Updating</Button>
                                  </>
                                )}
                              </>
                            )}
                            {ShowChildUnlink && ShowChildUnlink?.length > 0 && (
                              <>
                                {!Loader ? (
                                  <>
                                    <Button
                                      color="primary"
                                      onClick={(e) =>
                                        handleSubmitUnLinkChild(e)
                                      }>
                                      UnLink
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Button color="secondary">
                                      Updating..
                                    </Button>
                                  </>
                                )}
                              </>
                            )}
                          </>
                        </>
                      ) : (
                        <>
                          {NoChild && NoChild && (
                            <Col lg="3" md="3">
                              <Label style={{ color: "red" }}>
                                No Next Child Found
                              </Label>
                              <Input
                                readOnly
                                type="text"
                                value="No Child Found"
                              />
                            </Col>
                          )}
                        </>
                      )}
                    </Col>
                    <Col lg="3" mg="3" sm="12">
                      <div className="mr-2 pr-1">
                        <Input
                          type="text"
                          className="searchBoxStyle"
                          name="search"
                          placeholder="Search Here..."
                          onChange={(e) => {
                            let Mylist = [...ShowChildList];
                            let fiterData = Mylist?.filter(
                              (ele) =>
                                ele?.firstName
                                  ?.toLowerCase()
                                  ?.includes(e.target.value) ||
                                ele?.lastName
                                  ?.toLowerCase()
                                  ?.includes(e.target.value) ||
                                ele?.pincode
                                  ?.toString()
                                  ?.includes(e.target.value)
                            );

                            if (e.target.value) {
                              if (fiterData?.length) {
                                setShowChildList(fiterData);
                              }
                            } else {
                              let list = [...GetChildList];
                              setShowChildList(list);
                            }
                          }}
                        />
                      </div>
                    </Col>
                  </Row>

                  <div className="p-1">
                    <Table
                      className="table_heading"
                      style={{
                        cursor: "pointer",
                      }}
                      responsive>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th className="fontSize">Assigned To</th>
                          <th>
                            Name
                            {/* with Roles */}
                          </th>
                          {ShowChildList?.length > 0 &&
                          ShowChildList[0]?.rolename?.roleName == "Customer" ? (
                            <>
                              <th>Address</th>
                            </>
                          ) : (
                            <>
                              <th>Designation</th>
                            </>
                          )}
                          <th>PinCode</th>
                          <th>UnLink Child</th>
                          {/* <th>Mobile Number</th>
                          <th>email</th>
                          <th>State</th>
                          <th>City</th> */}
                        </tr>
                      </thead>

                      <tbody>
                        {ShowChildList &&
                          ShowChildList?.map((ele, i) => {
                            return (
                              <tr key={ele?._id}>
                                <th scope="row">
                                  {" "}
                                  {ele?.created_by?.firstName &&
                                  ele?.created_by?.firstName ? null : (
                                    <>
                                      <Input
                                        title="Link to Parent"
                                        style={{
                                          position: "unset",
                                          margin: 0,
                                        }}
                                        value="checkbox1"
                                        type="checkbox"
                                        onClick={(e) => handleSaveChild(ele, e)}
                                      />
                                    </>
                                  )}
                                </th>
                                <td>
                                  {!!ele?.created_by?.firstName &&
                                  ele?.created_by?.firstName ? (
                                    <strong style={{ fontSize: "16px" }}>
                                      {ele?.created_by?.firstName &&
                                        ele?.created_by?.firstName}
                                    </strong>
                                  ) : (
                                    <>
                                      <Badge color="primary">
                                        <strong>Not Assigned</strong>
                                      </Badge>
                                    </>
                                  )}
                                </td>
                                {ele?.rolename?.roleName == "Customer" ? (
                                  <>
                                    <td>
                                      {`${ele?.CompanyName}`}
                                      {/* (
                                      {ele?.rolename?.roleName}) */}
                                    </td>
                                  </>
                                ) : (
                                  <>
                                    <td>
                                      {`${ele?.firstName}`}
                                      {/* (
                                      {ele?.rolename?.roleName}) */}
                                    </td>
                                  </>
                                )}
                                {ele?.rolename?.roleName == "Customer" ? (
                                  <>
                                    <td>
                                      {ele?.address && ele?.address ? (
                                        <>
                                          {`${ele?.address && ele?.address},
                                          State:-${ele?.State && ele?.State},
                                          City:-${ele?.City && ele?.City}`}
                                        </>
                                      ) : null}
                                    </td>
                                  </>
                                ) : (
                                  <>
                                    <td>{ele?.rolename?.roleName}</td>
                                  </>
                                )}
                                <td>
                                  <strong>
                                    <div> {ele?.pincode}</div>
                                  </strong>
                                </td>
                                <td>
                                  {" "}
                                  {ele?.created_by?.firstName &&
                                  ele?.created_by?.firstName ? (
                                    <Input
                                      title="UnLink to Parent"
                                      style={{ position: "unset", margin: 0 }}
                                      value="checkbox1"
                                      type="checkbox"
                                      onClick={(e) => handleUnLinkChild(ele, e)}
                                    />
                                  ) : null}
                                </td>
                                {/* <td>{ele?.mobileNumber}</td>
                                <td>{ele?.email}</td>
                                <td>{ele?.State}</td>
                                <td>{ele?.City}</td> */}
                              </tr>
                            );
                          })}
                      </tbody>
                    </Table>
                  </div>
                </Col>
              ) : null}
            </Row>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default AssignTeamMember;
