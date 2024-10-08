import React, { useEffect, useState } from "react";
import "./Tree.css";
import { Button, Card, Col, Row, Spinner } from "reactstrap";
import { Route } from "react-router-dom";
import { Deptartment_with_Role } from "../../../../ApiEndPoint/Api";
import { _Get } from "../../../../ApiEndPoint/ApiCalling";

const TreeNode = ({ node }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="container mt-1 mb-2 mainheader">
      <div className="d-flex" style={{ marginLeft: `${node.depth * 20}px` }}>
        <span style={{ fontSize: "20px" }} onClick={handleToggle}>
          {node.roles && (isExpanded ? "[-]" : "[+]")}
        </span>
        <h5 style={{ fontSize: "20px" }} className="mx-2">
          {(node?.departmentName?.departmentName &&
            node?.departmentName?.departmentName) ||
            (node?.roleName && (
              <>
                {node?.roleName}(Position-{node?.rolePosition})
              </>
            ))}
        </h5>
      </div>
      {isExpanded &&
        node.roles &&
        node.roles.map((child) => <TreeNode key={child.id} node={child} />)}
    </div>
  );
};

const Tree = ({ data }) => {
  return <TreeNode node={data} />;
};



function CreateHeriarchy() {
  const [DepartmentWithRole, setDepartmentWithRole] = useState([]);
  const [Loading, setLoading] = useState(false);

  useEffect(() => {
    let userData = JSON.parse(localStorage.getItem("userData"));
    setLoading(true);
    _Get(Deptartment_with_Role, userData?.database)
      .then((res) => {
        console.log(res?.Department);
        setLoading(false);

        setDepartmentWithRole(res?.Department);
      })
      .catch((err) => {
        setLoading(false);

        console.log(err);
      });
  }, []);

  return (
    <Card style={{ height: window.innerHeight }}>
      <div
        className="headingofheirarchy"
        style={{ overflowY: "auto", height: "window.innerHeight" }}>
        {Loading && Loading ? (
          <>
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
          </>
        ) : (
          <>
            <Row>
              <Col></Col>
              {/* <Col className="m-2" lg="3" sm="6" md="3">
            <Button
              style={{ cursor: "pointer" }}
              className="float-right mr-1"
              color="primary"
             
            >
              Connect with SuperAdmin
            </Button>
          </Col> */}
              <Col className="m-2" lg="2">
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
            <Row>
              <Col>
                <div className="d-flex justify-content-center">
                  <h1>Your Organization Structure</h1>
                </div>
              </Col>
            </Row>
            {DepartmentWithRole && DepartmentWithRole ? (
              DepartmentWithRole?.map((ele, i) => <Tree key={i} data={ele} />)
            ) : (
              <>
                <div style={{ color: "red" }}>
                  <h3>No Organization Structure found</h3>
                </div>
              </>
            )}
          </>
        )}

        {/* {Trees && Trees?.map((ele, i) => <Tree key={i} data={ele} />)} */}
      </div>
    </Card>
  );
}

export default CreateHeriarchy;
