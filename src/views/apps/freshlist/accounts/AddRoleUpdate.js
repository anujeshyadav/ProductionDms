import React, { useContext, useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Label,
  Input,
  Form,
  Modal,
  ModalHeader,
  ModalBody,
  Table,
} from "reactstrap";
import { Roles, NormalRoles } from "./AddRole";
import swal from "sweetalert";
import { Route, useHistory } from "react-router-dom";

import "../../../../assets/scss/pages/users.scss";
import {
  CreateAccountView,
  CreateRole,
  CreateRoleByMaster,
} from "../../../../ApiEndPoint/ApiCalling";

export default function AddRoleNew(args) {
  const [Desc, setDesc] = useState("");
  const [Role, setRole] = useState("");
  const [Selected, setSelected] = useState([]);
  const [RolesPermission, setRolesPermission] = useState([]);
  const [SelectedIndex, setIndex] = useState("");
  const [Database, setDatabase] = useState("");
  const [show, setShow] = useState(false);
  const [ShowDataBase, setShowDataBase] = useState(false);
  const [modal, setModal] = useState(false);
  const [CreatAccountView, setCreatAccountView] = useState({});
  const [Userinfo, setUserinfo] = useState({});

  const toggle = () => setModal(!modal);
  let history = useHistory();

  const handleSelectPage = (value, checked, permit, title, ele) => {
    if (checked) {
      const newarrry = Selected.map((val, i) => {
        let x = val?.pagename;
        if (x === title) {
          const newperset = Selected[i].permission.includes(permit);

          if (newperset) {
          } else {
            let arr = Selected[i].permission.push(permit);
          }
        } else {
          const found = Selected.find(
            (element, i) => element.pagename === title
          );
          let newfound = found?.pagename === title;
          if (newfound === false) {
            const newarr = Selected.concat({
              pagename: title,
              permission: [permit],
            });
            setSelected(newarr);
          }
        }
      });
      if (Selected.length < 1) {
        const newarr = Selected.concat({
          pagename: title,
          permission: [permit],
        });
        setSelected(newarr);
      }
    } else {
      let remove = Selected?.map((ele, i) => {
        let y = ele?.pagename;
        if (title === y) {
          ele?.permission.splice(ele?.permission.indexOf(permit), 1);
        }
        if (ele?.permission.length === 0) {
          Selected.splice(i, 1);
        }
      });
    }
  };

  useEffect(() => {
    let userdata = JSON.parse(localStorage.getItem("userData"));

    setUserinfo(userdata);

    if (userdata?.rolename?.roleName === "MASTER") {
      setRolesPermission(Roles);
    } else {
      setRolesPermission(NormalRoles);
    }
  }, []);
  const handleSumit = async (e) => {
    e.preventDefault();
    let userdata = JSON.parse(localStorage.getItem("userData"));
    const inputPan = Role;
    const filteredValue = inputPan.split(" ")[0];
    let payload = {
      createdBy: userdata?._id,
      roleName: Role,
      id: filteredValue,
      desc: Desc,
      rolePermission: Selected,
    };
    if (userdata?.rolename?.roleName === "MASTER") {
      let load = {
        createdBy: userdata?._id,
        roleName: Role,
        id: filteredValue,
        position: 1,
        database: Database,
        desc: Desc,
        rank: 1,
        rolePermission: Selected,
      };

      await CreateRoleByMaster(load)
        .then((res) => {
          history.goBack();
          swal("Created Successfully");
          var checkboxes = document.getElementsByName("check");
          for (var checkbox of checkboxes) {
            checkbox.checked = false;
          }
          setSelected("");
          setDesc("");
          setRole("");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      await CreateRole(payload)
        .then((res) => {
          console.log(res);
          swal("Created Successfully");
          history.goBack();

          var checkboxes = document.getElementsByName("check");
          for (var checkbox of checkboxes) {
            checkbox.checked = false;
          }
          setSelected("");
          setDesc("");
          setRole("");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const handleopentoggle = () => {
    toggle();
  };
  const handlesetparent = (value, index) => {
    setShow(value);
    setIndex(index);
  };
  const HandleSelectRole = (val) => {
    setRole(val?._attributes?.value);
    toggle();
  };
  const handleSelectAll = (groupIndex, checked, value) => {
    const newSelected = Selected?.map((group, index) => {
      if (index === groupIndex) {
        return {
          ...group,
          permission: group.permission.map(() => checked),
        };
      }
      return group;
    });
    setSelected(newSelected);
  };
  return (
    <>
      <Row className="">
        <Col xl={12}>
          <Card>
            <Row
              className="mt-2 mb-2"
              style={{ marginLeft: "5px", marginRight: "5px" }}>
              <Col>
                <h2 className="float-left">Create Role</h2>
              </Col>
              <Col>
                <div className="float-right">
                  <Route
                    render={({ history }) => (
                      <Button
                        style={{ cursor: "pointer" }}
                        className="float-right mr-1"
                        color="primary"
                        onClick={() =>
                          history.push("/app/Trupee/account/RoleList")
                        }>
                        Back
                      </Button>
                    )}
                  />
                </div>
              </Col>
            </Row>
            <div className="container" />
            <Form onSubmit={handleSumit}>
              <div className="container">
                <Row className=" container">
                  <Col>
                    <Label>Enter Role Name*</Label>
                    <Input
                      value={Role}
                      onChange={(e) => setRole(e.target.value)}
                      type="text"
                      placeholder="Enter Role Name"
                      className="form-control inputs"
                    />
                  </Col>
                  <Col>
                    <Label>Enter Role Description * </Label>
                    <Input
                      required
                      value={Desc}
                      onChange={(e) => setDesc(e.target.value)}
                      type="text"
                      placeholder="Enter Role Desc.."
                    />
                  </Col>
                  {ShowDataBase &&
                    ShowDataBase &&
                    {
                      /* <Col>
                       <Label>Enter Database Name * </Label>
                       <Input
                         required
                         value={Database}
                         onChange={(e) => setDatabase(e.target.value)}
                         type="text"
                         placeholder="Enter database Name.."
                         // className="form-control"
                       />
                     </Col> */
                    }}
                </Row>
              </div>
              {/* {RolesPermission &&
                RolesPermission?.map((value, index) => (
                  <>
                    <section>
                      <Table key={index} bordered hover responsive size="sm">
                        <thead
                          style={{
                            borderRadius: "12px",
                            // background: "#e5dfdf26",
                            height: `${
                              show && SelectedIndex === index ? "auto" : "40px"
                            }`,
                          }}>
                          <tr>
                            <th>#</th>
                            <th>
                              <input
                                className="mt-1 permissioncheckbox"
                                name="check"
                                id={`head_${value?.title}`}
                                onClick={(e) => {
                                  handleSelectAll(index, e.target.checked);
                                  handlesetparent(e.target.checked, index);
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
                            </th>
                            <th>
                              <span className="mx-1 gy-0">
                                {value?.title?.length > 12 ? (
                                  <>{value?.title?.substring(0, 12) + "..."}</>
                                ) : (
                                  <>{value?.title}</>
                                )}
                              </span>
                            </th>
                            <th>
                              <div className="d-flex justify-content-center">
                                <span className="mx-3"> View</span>
                              </div>
                            </th>
                            <th>
                              <div className="d-flex justify-content-center">
                                <span className="mx-3"> Create</span>
                              </div>
                            </th>
                            <th>
                              <div className="d-flex justify-content-center">
                                <span className="mx-3"> Edit</span>
                              </div>
                            </th>
                            <th>
                              <div className="d-flex justify-content-center">
                                <span className="mx-3"> Delete</span>
                              </div>
                            </th>
                            {Userinfo?.rolename?.roleName === "MASTER" && (
                              <th>
                                <div className="d-flex justify-content-center">
                                  <span className="mx-3"> Download</span>
                                </div>
                              </th>
                            )}
                            {Userinfo?.rolename?.roleName === "MASTER" && (
                              <th>
                                <div className="d-flex justify-content-center">
                                  <span className="mx-3"> BulkUpload</span>
                                </div>
                              </th>
                            )}
                          </tr>
                        </thead>
                        {show && SelectedIndex === index ? (
                          <>
                            {value?.TabName?.map((ele, i) => {
                              return (
                                <tbody key={i}>
                                  <tr>
                                    <td scope="row">{i + 1}</td>
                                    <td scope="row"></td>
                                    <td>{ele?.title}</td>
                                    {ele?.permission?.map((permit, ind) => {
                                      console.log(permit);
                                      if (permit == "NA") {
                                        return (
                                          <td key={ind}>
                                            <div className="d-flex justify-content-center">
                                              <input
                                                readOnly
                                                name="check"
                                                className="permissioncheckbox"
                                                id={`item_${permit}`}
                                                style={{
                                                  display: "none",

                                                  width: "26px",
                                                }}
                                                type="checkbox"
                                              />
                                            </div>
                                          </td>
                                        );
                                      } else {
                                        return (
                                          <td key={ind}>
                                            <div className="d-flex justify-content-center">
                                              <input
                                                name="check"
                                                className="permissioncheckbox"
                                                id={`item_${permit}`}
                                                onClick={(e) => {
                                                  handleSelectPage(
                                                    e.target.value,
                                                    e.target.checked,
                                                    permit,
                                                    ele.title,
                                                    ind
                                                  );
                                                }}
                                                style={{
                                                  // height: "26px !important ",
                                                  width: "26px",
                                                }}
                                                type="checkbox"
                                              />
                                            </div>
                                          </td>
                                        );
                                      }
                                    })}
                                  </tr>
                                </tbody>
                              );
                            })}
                          </>
                        ) : null}
                      </Table>
                    </section>
                  </>
                ))} */}
              <section
                className=" "
                style={{ marginLeft: "5px", marginRight: "5px" }}>
                <Row className="gy-0 p-3" style={{ overflow: "auto" }}>
                  {RolesPermission &&
                    RolesPermission?.map((value, index) => {
                      return (
                        <Col
                          key={index}
                          style={{
                            borderRadius: "12px",
                            // background: "#e5dfdf26",
                            height: `${
                              show && SelectedIndex === index ? "auto" : "40px"
                            }`,
                          }}
                          className="customcol gy-0 mb-2 "
                          lg="12"
                          md="12"
                          sm="12">
                          <Row
                            style={{
                              lineHeight: "44px",
                              borderRadius: "6px",
                              background: "#f7f7f8",
                            }}
                            className="roleheading">
                            <Col className="gy-2" lg="2" sm="2" md="2">
                              <div className="align-item-center">
                                <span>
                                  <input
                                    className="mt-1 permissioncheckbox"
                                    name="check"
                                    id={`head_${value?.title}`}
                                    onClick={(e) => {
                                      handleSelectAll(
                                        index,
                                        e.target.checked,
                                        value
                                      );
                                      handlesetparent(e.target.checked, index);
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
                                </span>

                                <span className="mx-1 gy-0">
                                  {value?.title?.length > 12 ? (
                                    <>
                                      {value?.title?.substring(0, 12) + "..."}
                                    </>
                                  ) : (
                                    <>{value?.title}</>
                                  )}
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
                            {Userinfo?.rolename?.roleName === "MASTER" && (
                              <Col className="gy-2">
                                <div className="d-flex justify-content-center">
                                  <span className="mx-3"> Download</span>
                                </div>
                              </Col>
                            )}
                            {Userinfo?.rolename?.roleName === "MASTER" && (
                              <Col className="gy-2">
                                <div className="d-flex justify-content-center">
                                  <span className="mx-3"> BulkUpload</span>
                                </div>
                              </Col>
                            )}
                          </Row>

                          {show && SelectedIndex === index ? (
                            <>
                              <div className="p-3">
                                <div className="gy-2 mt-2">
                                  {value?.TabName?.map((ele, i) => {
                                    return (
                                      <>
                                        <Row key={i} className="">
                                          <Col lg="2" sm="2" md="2">
                                            <h6 className="mt-1">
                                              {" "}
                                              {ele?.title}
                                            </h6>
                                          </Col>
                                          {ele?.permission?.map(
                                            (permit, ind) => {
                                              console.log(permit);
                                              if (permit == "NA") {
                                                return (
                                                  <Col key={ind}>
                                                    <div className="d-flex justify-content-center">
                                                      <input
                                                        readOnly
                                                        name="check"
                                                        className="permissioncheckbox"
                                                        id={`item_${permit}`}
                                                        style={{
                                                          display: "none",

                                                          width: "26px",
                                                        }}
                                                        type="checkbox"
                                                      />
                                                    </div>
                                                  </Col>
                                                );
                                              } else {
                                                return (
                                                  <Col key={ind}>
                                                    <div className="d-flex justify-content-center">
                                                      <input
                                                        name="check"
                                                        className="permissioncheckbox"
                                                        id={`item_${permit}`}
                                                        onClick={(e) => {
                                                          handleSelectPage(
                                                            e.target.value,
                                                            e.target.checked,
                                                            permit,
                                                            ele.title,
                                                            ind
                                                          );
                                                        }}
                                                        style={{
                                                          // height: "26px !important ",
                                                          width: "26px",
                                                        }}
                                                        type="checkbox"
                                                      />
                                                    </div>
                                                  </Col>
                                                );
                                              }
                                            }
                                          )}
                                        </Row>
                                      </>
                                    );
                                  })}
                                </div>
                              </div>
                            </>
                          ) : null}
                        </Col>
                      );
                    })}
                </Row>
                <Row>
                  <Col>
                    <div className="d-flex justify-content-center mb-2 mt-2">
                      <Button
                        type="submit"
                        style={{ cursor: "pointer" }}
                        color="primary">
                        Submit
                      </Button>
                    </div>
                  </Col>
                </Row>
              </section>
            </Form>
          </Card>
        </Col>
      </Row>
      <Modal
        fullscreen="xl"
        size="lg"
        backdrop={false}
        isOpen={modal}
        toggle={toggle}
        {...args}>
        <ModalHeader toggle={toggle}>Role List</ModalHeader>
        <ModalBody>
          <div className="modalheaderaddrol p-1">
            <h3>Role List</h3>
            <Table
              className="tableofrole"
              bordered
              borderless
              hover
              responsive
              size="sm"
              striped>
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Role Name</th>
                </tr>
              </thead>
              <tbody>
                {CreatAccountView &&
                  CreatAccountView?.option?.map((ele, i) => {
                    return (
                      <tr
                        className="tabletr"
                        onClick={(e) => HandleSelectRole(ele)}
                        style={{ cursor: "pointer" }}
                        key={i}>
                        <th scope="row">{i + 1}</th>
                        <td>{ele?._text}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}
