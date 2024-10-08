import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Card, Button, Label, Input, Form } from "reactstrap";
import { Roles } from "./AddRole";
import axios from "axios";
import axiosConfig from "../../../../axiosConfig";
import { Route, Link } from "react-router-dom";
import swal from "sweetalert";
import { BsFillArrowDownCircleFill } from "react-icons/bs";
import { permission } from "./DummyPermissiom";
import { useParams } from "react-router-dom";
import { history } from "../../../../history";

export default function AddRoleNew() {
  const [Desc, setDesc] = useState("");
  const [Role, setRole] = useState("");
  const [Selected, setSelected] = useState([]);
  const [SelectedIndex, setIndex] = useState("");
  const [show, setShow] = useState(false);
  const [Existingpermission, setExistingpermission] = useState({});
  const [updatedPermissions, setUpdatedPermissions] = useState([...permission]);

  const param = useParams();

  useEffect(() => {
    const formdata = new FormData();
    formdata.append("role_name", param.id);
    axiosConfig
      .post(`/editroleview`, formdata)
      .then((res) => {
        // setSelected(permission);
        setSelected(res?.data?.data?.permissioninfo);
        // console.log("origional permission", res?.data?.data);
        console.log("origional permission", res?.data?.data?.permissioninfo);
        setRole(res?.data?.data?.roleinfo?.role_name);
        setDesc(res?.data?.data?.roleinfo?.description);
        setExistingpermission(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // const handleSelectPage = (value, checked, permit, title, ele) => {
  //   const newSelected = [...Selected];
  //   const pageIndex = newSelected.findIndex((item) => item.pagename === title);

  //   if (checked) {
  //     if (pageIndex !== -1) {
  //       if (!newSelected[pageIndex].permission.includes(permit)) {
  //         newSelected[pageIndex].permission.push(permit);
  //       }
  //     } else {
  //       newSelected.push({ pagename: title, permission: [permit] });
  //     }
  //   } else {
  //     if (pageIndex !== -1) {
  //       newSelected[pageIndex].permission = newSelected[
  //         pageIndex
  //       ].permission.filter((p) => p !== permit);

  //       if (newSelected[pageIndex].permission.length === 0) {
  //         newSelected.splice(pageIndex, 1);
  //       }
  //     }
  //   }

  //   setSelected(newSelected);

  //   // Update child checkboxes when parent checkbox is checked/unchecked
  //   const updatedPermissionsCopy = updatedPermissions.map((item) => {
  //     if (item.pagename === title) {
  //       return {
  //         ...item,
  //         permission: newSelected
  //           .filter((selectedItem) => selectedItem.pagename === title)
  //           .flatMap((selectedItem) => selectedItem.permission),
  //       };
  //     }
  //     return item;
  //   });

  //   setUpdatedPermissions(updatedPermissionsCopy);
  // };

  // const updateChildCheckboxes = (title, checked, permit) => {
  //   const page = Roles.find((role) => role.title === title);

  //   if (!page) return;

  //   page.TabName.forEach((tab) => {
  //     if (!tab.permission.includes("parentPermit")) {
  //       const permissionIndex = updatedPermissions.findIndex(
  //         (p) => p.pagename === tab.title
  //       );

  //       if (checked) {
  //         if (permissionIndex !== -1) {
  //           if (
  //             !updatedPermissions[permissionIndex].permission.includes(permit)
  //           ) {
  //             updatedPermissions[permissionIndex].permission.push(permit);
  //           }
  //         } else {
  //           updatedPermissions.push({
  //             pagename: tab.title,
  //             permission: [permit],
  //           });
  //         }
  //       } else {
  //         if (permissionIndex !== -1) {
  //           updatedPermissions[permissionIndex].permission = updatedPermissions[
  //             permissionIndex
  //           ].permission.filter((p) => p !== permit);

  //           if (updatedPermissions[permissionIndex].permission.length === 0) {
  //             updatedPermissions.splice(permissionIndex, 1);
  //           }
  //         }
  //       }

  //       updateChildCheckboxes(tab.title, checked, permit);
  //     }
  //   });

  //   setUpdatedPermissions([...updatedPermissions]);
  // };

  console.log(Selected);
  // console.log(updatedPermissions);

  const handleSumit = (e) => {
    e.preventDefault();
    let userdata = JSON.parse(localStorage.getItem("userData"));
    console.log(userdata?.Userinfo?.id);
    const formdata = new FormData();
    formdata.set("user_id", userdata?.Userinfo?.id);
    formdata.set("role_name", Role);
    formdata.set("description", Desc);
    formdata.set("selectedarray", JSON.stringify(Selected));

    axiosConfig
      .post(`/editrolesubmit_post`, formdata)
      .then((res) => {
        console.log(res);
        swal("Success", "Role Created");
        setSelected("");
        setDesc("");
        setRole("");
        var checkboxes = document.getElementsByName("check");
        for (var checkbox of checkboxes) {
          checkbox.checked = false;
        }
      })
      .catch((er) => {
        console.log(er);
      });
  };
  const handlesetparent = (value, index) => {
    // console.log(value);
    // console.log(index);
    setShow(value);
    setIndex(index);
  };

  return (
    <>
      {Selected && Selected.length ? (
        <>
          <Row className="">
            <Row className="m-2">
              <Route
                render={({ history }) => (
                  <Button
                    className=" btn btn-danger float-right"
                    onClick={() => history.push("/app/SoftNumen/userlist")}
                  >
                    {" "}
                    Back{" "}
                  </Button>
                )}
              />
            </Row>

            <Col xl={12}>
              <Card>
                <div className="container" />
                <Row>
                  <Col>
                    <div className="d-flex justify-content-center">
                      <h3 className="py-3">Existing Given Permissions</h3>
                    </div>
                  </Col>
                </Row>
                <Form onSubmit={handleSumit}>
                  <div className="container mt-5">
                    <Row className="mb-3 container">
                      <Col>
                        <Label>Existing Role *</Label>
                        <Input
                          disabled
                          // required
                          value={Role}
                          onChange={(e) => setRole(e.target.value)}
                          type="text"
                          placeholder="Enter Role"
                          className="form-control"
                        />
                      </Col>
                      <Col>
                        <Label>Existing Role Description * </Label>
                        <Input
                          disabled
                          // required
                          value={Desc}
                          onChange={(e) => setDesc(e.target.value)}
                          type="text"
                          placeholder="Enter Role Desc.."
                          // className="form-control"
                        />
                      </Col>
                    </Row>
                  </div>
                  <section className="mt-5 container">
                    <Row className="gy-0 container">
                      {Roles &&
                        Roles?.map((value, index) => {
                      
                          return (
                            <Col
                              key={index}
                              style={{
                                borderRadius: "12px",

                                height: `${
                                  Selected?.some(
                                    (item) =>
                                      item.pagename === value?.title &&
                                      item.permission.includes("parentPermit")
                                  )
                                    ? "340px"
                                    : "40px"
                                }`,
                              }}
                              className="customcol gy-0 mb-2 "
                              lg="12"
                              md="12"
                              sm="12"
                            >
                              <Row
                                style={{
                                  lineHeight: "44px",
                                  borderRadius: "6px",
                                  background: "#f7f7f8",
                                }}
                                className="roleheading"
                              >
                                <Col className="gy-2" lg="4" sm="4" md="4">
                                  <div className="align-item-center">
                                    <input
                                      // checked={hasParentPermission}
                                      // disabled
                                      checked={Selected?.some(
                                        (item) =>
                                          item.pagename === value?.title &&
                                          item.permission.includes(
                                            "parentPermit"
                                          )
                                      )}
                                      className="mt-1"
                                      name="check"
                                      id={`head_${value?.title}`}
                                      onClick={(e) => {
                                        handlesetparent(
                                          e.target.checked,
                                          index
                                        );
                                        handleSelectPage(
                                          e.target.value,
                                          e.target.checked,
                                          "parentPermit",
                                          value?.title,
                                          index
                                        );
                                      }}
                                      style={{
                                        height: "19px",
                                        width: "26px",
                                      }}
                                      type="checkbox"
                                    />

                                    <span className="mx-3 gy-0">
                                      {value?.title}
                                      {/* {!show ? (
                                  <>
                                    <BsFillArrowDownCircleFill
                                      title="show Subpages"
                                      onClick={() =>
                                        handlesetparent("true", index)
                                      }
                                      style={{ cursor: "pointer" }}
                                      fill="blue"
                                      size="25px"
                                    />
                                  </>
                                ) : null} */}
                                    </span>
                                  </div>
                                </Col>
                                <Col className="gy-2">
                                  <div className="d-flex justify-content-center">
                                    <span className="mx-3"> View</span>
                                  </div>
                                </Col>
                                <Col className="gy-2">
                                  <div className="d-flex justify-content-center">
                                    <span className="mx-3"> Create</span>
                                  </div>
                                </Col>
                                <Col className="gy-2">
                                  <div className="d-flex justify-content-center">
                                    <span className="mx-3"> Edit</span>
                                  </div>
                                </Col>
                                <Col className="gy-2">
                                  <div className="d-flex justify-content-center">
                                    <span className="mx-3"> Delete</span>
                                  </div>
                                </Col>
                              </Row>

                              {Selected?.some(
                                (item) =>
                                  item.pagename === value?.title &&
                                  item.permission.includes("parentPermit")
                              ) ? (
                                <>
                                  <>
                                    <div className="container">
                                      <div className="gy-2 mt-2">
                                        {value?.TabName?.map((ele, i) => {
                                          return (
                                            <>
                                              <Row key={i} className="">
                                                <Col lg="4" sm="4" md="4">
                                                  <h6 className="mt-1">
                                                    {" "}
                                                    {ele?.title}
                                                  </h6>
                                                </Col>
                                                {ele?.permission?.map(
                                                  (permit, ind) => {
                                                    const hasPermissio =
                                                      Selected?.some(
                                                        (p) =>
                                                          p.pagename ===
                                                            ele.title &&
                                                          p.permission.includes(
                                                            permit
                                                          )
                                                      );
                                                    return (
                                                      <Col
                                                        key={ind}
                                                        lg="2"
                                                        md="2"
                                                        sm="2"
                                                      >
                                                        <div className="d-flex justify-content-center">
                                                          <input
                                                            // disabled
                                                            checked={
                                                              hasPermissio
                                                            }
                                                            name="check"
                                                            id={`item_${permit}`}
                                                            onClick={(e) => {
                                                              handleSelectPage(
                                                                e.target.value,
                                                                e.target
                                                                  .checked,
                                                                permit,
                                                                ele.title,
                                                                ind
                                                              );
                                                            }}
                                                            style={{
                                                              height: "19px",
                                                              width: "26px",
                                                            }}
                                                            type="checkbox"
                                                          />
                                                        </div>
                                                      </Col>
                                                    );
                                                  }
                                                )}
                                              </Row>
                                            </>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </>
                                </>
                              ) : null}
                            </Col>
                          );
                        })}
                    </Row>
                    {/* <Row>
                      <Col>
                        <div className="d-flex justify-content-center mb-2">
                          <Button
                            type="submit"
                            style={{ cursor: "pointer" }}
                            // onClick={(e) => handleSumit(e)}
                            color="primary"
                          >
                            Update Permission
                          </Button>
                        </div>
                      </Col>
                    </Row> */}
                  </section>
                </Form>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <>
          <Row>
            <Col>
              <div className="d-flex justify-content-center align-item-center mt-5">
                <h2>Loading...</h2>
              </div>
            </Col>
          </Row>
        </>
      )}
    </>
  );
}
