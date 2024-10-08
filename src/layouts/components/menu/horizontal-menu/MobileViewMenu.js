import React from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ModalHeader,
  Modal,
  ModalBody,
  Button,
  Col,
  Row,
  Badge,
} from "reactstrap";
import classnames from "classnames";
import { ChevronDown, ChevronRight, Edit, Trash2 } from "react-feather";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { history } from "../../../../history";
import navigationConfig from "../../../../configs/horizontalMenuConfig";
import {
  FaArrowAltCircleDown,
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaArrowAltCircleUp,
} from "react-icons/fa";
import {
  BsFillArrowDownSquareFill,
  BsFillArrowUpSquareFill,
} from "react-icons/bs";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import swal from "sweetalert";
import { Save_Tabs, View_Tabs } from "../../../../ApiEndPoint/Api";
import { _Get, _Post, _PostSave } from "../../../../ApiEndPoint/ApiCalling";
let allList = [];
const SelectedColums = [];
class HorizontalSidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeParents: [],
      rowData: [],
      setMySelectedarr: [],
      isOpen: false,
      Arrindex: "",
      openDropdown: [],
      showpage: [],
      AllAvailableCol: [],
      columnDefs: [],
      AllcolumnDefs: [],
      SelectedcolumnDefs: [],
      SelectedCols: [],
      dropdownHeight: "auto",
      itemHover: null,
      parentHover: null,
      activeChildUrl: null,
    };
    this.activeFlag = false;
    this.parentItems = [];
    this.activeParentItems = [];

    this.redirectUnauthorized = () => {
      history.push("misc/not-authorized");
    };
  }
  HeadingRightShift = () => {
    const updatedSelectedColumnDefs = [
      ...new Set([
        ...this.state.SelectedcolumnDefs?.map((item) => item),
        ...SelectedColums.map((item) => item),
      ]),
    ].map((item) => item);
    let myArr = [...new Set(updatedSelectedColumnDefs)];
    if (myArr.length < 12) {
      this.setState({
        SelectedcolumnDefs: [...new Set(updatedSelectedColumnDefs)], // Update the state with the combined array
      });
    } else {
      swal("Select only 11 headings");
    }
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
  LookupviewStart = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };
  handleTogglemodal = () => {
    this.LookupviewStart();
  };
  openDropdown = (id) => {
    let arr = this.state.openDropdown;
    if (!arr.includes(id)) arr.push(id);
    return this.setState({
      openDropdown: arr,
    });
  };

  closeDropdown = (id) => {
    let arr = this.state.openDropdown;
    arr.splice(arr.indexOf(id), 1);
    return this.setState({
      openDropdown: arr,
    });
  };

  handleItemHover = (id) => {
    this.setState({
      itemHover: id,
    });
  };
  handleChangeHeader = (e, value, index) => {
    // console.log(value);
    let check = e.target.checked;
    if (check) {
      if (SelectedColums?.length < 12) {
        SelectedColums?.push(value);
      } else {
        swal("You can Select only six element");
      }
    } else {
      const delindex = SelectedColums?.findIndex(
        (ele) => ele?.title === value?.title
      );

      SelectedColums?.splice(delindex, 1);
    }
  };
  handleParentHover = (id) => {
    this.setState({
      parentHover: id,
    });
  };
  // Active for guwahati
  componentDidMount() {
    console.log(this.props);
    this.handleActiveParent(this.activeParentItems);
  }

  componentDidUpdate(prevProps) {
    if (this.props.activePath !== prevProps.activePath) {
      this.setState({ openDropdown: [], parentHover: null });
      this.handleActiveParent(this.activeParentItems);
    }
  }

  updateParentItems = (id, mainParent = false) => {
    if (mainParent === true) {
      this.parentItems = [];
    }
    if (!this.parentItems.includes(id)) {
      this.parentItems.push(id);
    }
    if (this.activeFlag === true) {
      this.activeParentItems = this.parentItems;
      this.parentItems = [];
      this.activeFlag = false;
    }
  };

  handleActiveParent = (arr) => {
    this.setState({
      activeParents: arr,
    });
    this.activeFlag = false;
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
  renderSubMenu = (submenu, id) => {
    return (
      <DropdownMenu
        tag="ul"
        className="mt-50"
        onMouseEnter={(e) => e.preventDefault()}
        // onMouseEnter={(e) => e.preventDefault()}
        modifiers={{
          setMaxHeight: {
            enabled: true,
            fn: (data) => {
              let pageHeight = window.innerHeight,
                ddTop = data.instance.reference.getBoundingClientRect().top,
                ddHeight = data.popper.height,
                maxHeight,
                stylesObj;

              if (pageHeight - ddTop - ddHeight - 28 < 1) {
                maxHeight = pageHeight - ddTop - 25;
                stylesObj = {
                  maxHeight: maxHeight,
                  overflowY: "auto",
                };
              }

              return {
                ...data,

                styles: {
                  ...stylesObj,
                },
              };
            },
          },
        }}>
        {submenu.map((child) => {
          const CustomAnchorTag = child.type === "external-link" ? `a` : Link;
          if (child.navLink && child.navLink === this.props.activePath) {
            this.activeFlag = true;
            this.updateParentItems(id);
          }

          let renderChildItems = (
            <React.Fragment key={child.id}>
              <li
                className={classnames({
                  active: this.state.activeParents.includes(child.id),
                })}>
                <DropdownItem
                  className={classnames("w-100", {
                    hover: this.state.itemHover === child.id,
                    "has-sub": child.children,
                    active:
                      (child.parentOf &&
                        child.parentOf.includes(this.props.activePath)) ||
                      (child.navLink &&
                        child.navLink === this.props.activePath),
                    "has-active-child": this.state.openDropdown.includes(
                      child.id
                    ),
                    disabled: child.disabled,
                  })}
                  tag={child.navLink ? CustomAnchorTag : "div"}
                  to={
                    child.filterBase
                      ? child.filterBase
                      : child.navLink && child.type === "item"
                      ? child.navLink
                      : "#"
                  }
                  href={
                    child.type === "external-link" ? child.navLink : undefined
                  }
                  target={child.newTab ? "_blank" : undefined}
                  onClick={() => this.handleItemHover(child.id)}
                  // onMouseEnter={() => this.handleItemHover(child.id)}
                  onMouseLeave={() => this.handleItemHover(null)}>
                  {child.children ? (
                    <Dropdown
                      className={classnames("sub-menu w-100", {})}
                      isOpen={this.state.openDropdown.includes(child.id)}
                      direction={this.state.openLeft ? "left" : "right"}
                      toggle={() => true}
                      onClick={() => this.openDropdown(child.id)}
                      // onMouseEnter={() => this.openDropdown(child.id)}
                      onMouseLeave={() => this.closeDropdown(child.id)}>
                      <DropdownToggle
                        className="d-flex justify-content-between align-items-center item-content"
                        tag={"div"}
                        onClick={() => this.closeDropdown(child.id)}>
                        <div className="dropdown-toggle-sub text-truncate">
                          <span className="menu-icon align-bottom mr-1">
                            {child.icon}
                          </span>
                          <FormattedMessage
                            className="menu-title align-middle"
                            id={child.title}
                          />
                        </div>
                        <ChevronRight
                          className="has-sub-arrow align-middle ml-50"
                          size={15}
                        />
                      </DropdownToggle>
                      {child.children
                        ? this.renderSubMenu(child.children, child.id)
                        : null}
                    </Dropdown>
                  ) : (
                    <div className="item-content">
                      <span className="menu-icon align-top mr-1">
                        {child.icon}
                      </span>
                      <span className="menu-title align-middle">
                        <FormattedMessage id={child.title} />
                      </span>
                    </div>
                  )}
                </DropdownItem>
              </li>
            </React.Fragment>
          );

          if (
            child.type === "external-link" ||
            (child.type === "item" &&
              child.permissions &&
              child.permissions.includes(this.props.currentUser)) ||
            child.type === "dropdown" ||
            child.permissions === undefined
          ) {
            return renderChildItems;
          } else if (
            child.navLink === this.props.activePath &&
            !child.permissions.includes(this.props.currentUser)
          ) {
            return this.redirectUnauthorized();
          } else {
            return null;
          }
        })}
      </DropdownMenu>
    );
  };

  async componentDidMount() {
    let userCredentials = JSON.parse(localStorage.getItem("userData"));
    let TabparMission = userCredentials?.rolename?.rolePermission?.map(
      (value) => value?.pagename
    );
    // console.log(TabparMission);
    this.setState({ showpage: TabparMission });
    let myheadings = JSON.parse(localStorage.getItem("myHeadings"));
    if (myheadings?.length) {
      this.setState({ SelectedcolumnDefs: myheadings });
    }
    let MyTotalList = navigationConfig?.map((ele, i) => {
      if (!!ele?.children) {
        allList.push(ele?.children);
      } else if (!!ele?.children?.children) {
      } else {
      }
    });

    let myallList = allList?.flat();
    this.setState({ AllAvailableCol: myallList });
    let userData = JSON.parse(localStorage.getItem("userData"));

    await _Get(View_Tabs, userData?._id)
      .then((res) => {
        console.log(res?.Tab);
        let AllTab = [];
        let SelectedTab = res?.Tab?.tab;
        let mytab = myallList?.map((ele, index) => {
          SelectedTab?.forEach((val, i) => {
            if (ele?.title == val?.title) {
              AllTab.push(ele);
            }
          });
        });
        this.setState({ SelectedcolumnDefs: AllTab, AllAvailableCol: AllTab });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //
  renderDropdown = (arr) => {
    let myownlink = this.state.SelectedcolumnDefs;

    return myownlink?.slice(0, 3)?.map((ele, i) => {
      return (
        <>
          <div>1</div>
          <div>hello</div>
          <Route
            render={({ history }) => (
              <>
                <span
                  className="mr-1 d-flex justify-content-center"
                  style={{
                    cursor: "pointer",
                    // backgroundColor: "#39cccc",
                    height: "100%",
                    borderRadius: "8px",
                  }}
                  size="25px"
                  // color="primary"
                  onClick={() => {
                    history.push(ele?.navLink);
                  }}>
                  <span
                    title={ele?.title}
                    className="menu-icon align-bottom mr-1">
                    {ele?.icon}
                    {/* </span>
                  <span style={{ color: "white" }} className="p-1"> */}
                    {ele?.title}
                  </span>
                </span>
              </>
            )}
          />
        </>
      );
    });
  };

  handleSubmitBottomData = async (e) => {
    e.preventDefault();

    let userData = JSON.parse(localStorage.getItem("userData"));

    let tabs = this.state.SelectedcolumnDefs?.map((ele) => {
      return {
        id: ele?.id,
        title: ele?.title,
        type: ele?.type,
        // icon: ele?.icon,
        navLink: ele?.navLink,
      };
    });
    let payload = {
      userId: userData?._id,
      tab: tabs,
    };

    await _PostSave(Save_Tabs, payload)
      .then((res) => {
        console.log(res);
        this.LookupviewStart();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
    // console.log(this.state.SelectedcolumnDefs);
    const {
      rowData,
      columnDefs,
      defaultColDef,
      SelectedcolumnDefs,
      AllAvailableCol,
      isOpen,
      SelectedCols,
      AllcolumnDefs,
    } = this.state;
    return (
      <div className="d-flex">
        {/* <div className="horizontal-menu-wrapper"> */}
        <div className="d-flex">
          <div className="d-flex float-left">
            {/* <ul className="nav navbar-nav" id="main-menu-navigation"> */}
            {/* {this.renderDropdown(this.state.SelectedcolumnDefs)} */}
            {this.state.SelectedcolumnDefs &&
              this.state.SelectedcolumnDefs?.slice(0, 3)?.map((ele, i) => {
                return (
                  <>
                    <Route
                      render={({ history }) => (
                        <>
                          <span
                            className="mr-1 d-flex justify-content-center"
                            style={{
                              cursor: "pointer",
                              // backgroundColor: "#39cccc",
                              height: "100%",
                              borderRadius: "8px",
                            }}
                            size="25px"
                            // color="primary"
                            onClick={() => {
                              history.push(ele?.navLink);
                            }}>
                            <span
                              title={ele?.title}
                              className="menu-icon align-bottom mr-1">
                              <span className="mr-1 bottomicone">
                                {ele?.icon}
                              </span>
                              {/* </span>
                  <span style={{ color: "white" }} className="p-1"> */}
                              <span style={{ fontWeight: "bolder" }}>
                                {ele?.title && ele?.title?.length > 8 ? (
                                  <>{ele.title?.substring(0, 8)}</>
                                ) : (
                                  <>{ele.title}</>
                                )}
                              </span>
                            </span>
                          </span>
                        </>
                      )}
                    />
                  </>
                );
              })}
            {/* </ul> */}
          </div>
          <span className="float-right">
            <Edit
              onClick={this.handleTogglemodal}
              style={{ cursor: "pointer" }}
              color="red"
              size={18}
              className="mr-1"
            />
          </span>
          <Modal
            isOpen={this.state.modal}
            toggle={this.LookupviewStart}
            className={this.props.className}
            style={{ maxWidth: "1050px" }}>
            <ModalHeader toggle={this.LookupviewStart}>
              Change Fileds
            </ModalHeader>
            <ModalBody className="modalbodyhead">
              <div className="d-flex justify-content-center mb-1">
                <h4>Select Only Seven Heading which is most visited</h4>
              </div>
              <Row>
                <Col lg="4" md="4" sm="12" xl="4" xs="12">
                  <h4>Available Columns</h4>
                  <div className="mainshffling">
                    <div class="ex1">
                      {AllAvailableCol &&
                        AllAvailableCol?.map((ele, i) => {
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
                                    {this.state.showpage.includes(
                                      ele?.title
                                    ) ? (
                                      <>
                                        <input
                                          type="checkbox"
                                          className="mx-1"
                                        />
                                        {this.state.showpage.includes(
                                          ele?.title
                                        )
                                          ? ele?.title
                                          : null}
                                      </>
                                    ) : null}
                                  </h5>
                                </span>
                              </div>
                            </>
                          );
                        })}
                    </div>
                  </div>
                </Col>
                <Col
                  lg="2"
                  md="2"
                  sm="12"
                  xl="2"
                  xs="12"
                  className=" d-flex justify-content-center p-2">
                  <div className="mainarrowbtn">
                    <div style={{ cursor: "pointer" }}>
                      <FaArrowAltCircleDown
                        onClick={this.HeadingRightShift}
                        className="arrowassign"
                        size="30px"
                      />

                      <FaArrowAltCircleUp
                        onClick={this.handleLeftShift}
                        className="arrowassign mx-1"
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
                                                  element?.title == ele?.title
                                              );

                                            if (SelectedCols && delindex >= 0) {
                                              const splicedElement =
                                                SelectedCols.splice(
                                                  delindex,
                                                  1
                                                ); // Remove the element
                                              // splicedElement contains the removed element, if needed

                                              this.setState({
                                                SelectedcolumnDefs:
                                                  SelectedCols, // Update the state with the modified array
                                              });
                                            }
                                            // const delindex =
                                            //   SelectedCols.findIndex(
                                            //     (element) =>
                                            //       element?.headerName ==
                                            //       ele?.headerName
                                            //   );

                                            // SelectedCols?.splice(delindex, 1);
                                            // this.setState({
                                            //   SelectedcolumnDefs: SelectedCols,
                                            // });
                                          }}
                                          style={{ cursor: "pointer" }}
                                          size="25px"
                                          color="red"
                                          className="mr-1"
                                        />

                                        {ele?.title}
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
                      <div className=" d-flex p-2 justify-content-center">
                        <div>
                          <BsFillArrowUpSquareFill
                            className="arrowassign mb-1"
                            size="30px"
                            onClick={this.shiftElementUp}
                          />

                          <BsFillArrowDownSquareFill
                            onClick={this.shiftElementDown}
                            className="arrowassign mx-1 mb-1"
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
                    <Button
                      color="primary"
                      onClick={this.handleSubmitBottomData}>
                      Submit
                    </Button>
                  </div>
                </Col>
              </Row>
            </ModalBody>
          </Modal>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    currentUser: state.auth.login.userRole,
  };
};
export default connect(mapStateToProps)(HorizontalSidebar);
