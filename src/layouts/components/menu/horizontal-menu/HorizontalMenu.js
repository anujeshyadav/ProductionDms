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
import { renderToString } from "react-dom/server";
import { Route } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { history } from "../../../../history";
import "../../../assets/scss/core/menu/horizontal-menu.scss";
import { FaPencilAlt } from "react-icons/fa";

import navigationConfig from "../../../../configs/horizontalMenuConfig";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import {
  BsFillArrowDownSquareFill,
  BsFillArrowUpSquareFill,
} from "react-icons/bs";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import swal from "sweetalert";
import { _Get, _PostSave } from "../../../../ApiEndPoint/ApiCalling";
import { Save_Tabs, View_Tabs } from "../../../../ApiEndPoint/Api";
let allList = [];
const SelectedColums = [];

class HorizontalSidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCheckboxes: [],
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
    if (myArr.length < 8) {
      this.setState({
        SelectedcolumnDefs: [...new Set(updatedSelectedColumnDefs)], // Update the state with the combined array
      });
    } else {
      swal("Select only 7 headings");
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
    const { selectedCheckboxes } = this.state;
    const isSelected = selectedCheckboxes.includes(value.title);
    let check = e.target.checked;
    if (isSelected) {
      // If it's selected, remove it from the list
      this.setState({
        selectedCheckboxes: selectedCheckboxes.filter((item) => item !== value),
      });
    } else {
      // If it's not selected, check if we've reached the limit
      if (SelectedColums.length < 8) {
        // If not reached, add it to the list
        SelectedColums?.push(value);
        // this.setState({
        //   selectedCheckboxes: [...selectedCheckboxes, value],
        // });
      } else {
        if (check) {
          swal("You can Select only Seven element");
        }
        // If reached, don't allow any more selections
      }
    }

    if (check) {
      // if (SelectedColums?.length < 7) {
      //   SelectedColums?.push(value);
      // } else {
      //   swal("You can Select only six element");
      // }
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
        key={id}
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
                            id={child?.title}
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
    // console.log(allList.flat());
    let myallList = allList?.flat();
    this.setState({ AllAvailableCol: myallList });
    await _Get(View_Tabs, userCredentials?._id)
      .then((res) => {
        let AllTab = [];
        let SelectedTab = res?.Tab?.tab;
        let mytab = myallList?.map((ele, index) => {
          SelectedTab?.forEach((val, i) => {
            if (ele?.title == val?.title) {
              AllTab.push(ele);
            }
          });
        });
        this.setState({ SelectedcolumnDefs: AllTab });
      })
      .catch((err) => {
        console.log(err);
      });
  }
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

  renderDropdown = (arr) => {
    let myownlink = this.state.SelectedcolumnDefs;

    // const serializedElements = myownlink.map((element) =>
    //   renderToString(element)
    // );

    if (this.state.SelectedcolumnDefs?.length) {
      // localStorage.setItem("myHeadings", JSON.stringify(serializedElements));
      // localStorage.setItem(
      //   "myHeadings",
      //   JSON.stringify(this.state.SelectedcolumnDefs)
      // );
    }
    return myownlink?.slice(0, 7)?.map((ele, i) => {
      // console.log(ele.icon);
      return (
        <>
          {/* <FormattedMessage
            className="menu-title align-middle"
            id={ele?.title}
          /> */}
          <Route
            render={({ history }) => (
              <>
                {/* <span className="menu-icon align-bottom mr-1">{ele?.icon}</span> */}
                <span
                  title={ele?.title}
                  className="menu-icon align-bottom mr-1">
                  {ele?.icon}
                </span>
                <Badge
                  className=""
                  title={ele?.title}
                  style={{
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "black",
                    backgroundColor: "white",
                    marginRight: "5px",
                  }}
                  size="25px"
                  // color="primary"
                  onClick={() => {
                    history.push(ele?.navLink);
                  }}>
                  {/* <span className="menu-icon align-bottom mr-1">
                    {ele?.icon}
                  </span> */}
                  {ele?.title}
                </Badge>
              </>
            )}
          />
        </>
      );
    });
  };

  render() {
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
      <div className="horizontal-menu-wrapper" style={{ paddingTop: "auto" }}>
        {/* <div className="horizontal-menu-wrapper"> */}
        <div
          className={classnames(
            "header-navbar navbar-expand-sm navbar navbar-horizontal navbar-shadow",
            {
              "navbar-static": this.props.navbarType === "static",
              "fixed-top": this.props.navbarType === "sticky",
              "floating-nav":
                this.props.navbarType === "floating" ||
                !["static", "sticky", "floating"].includes(
                  this.props.navbarType
                ),
            }
          )}>
          <div
            className="navbar-container main-menu-content"
            style={{ justifyContent: "center", display: "flex" }}>
            {/* <ul className="nav navbar-nav" id="main-menu-navigation"> */}
            {this.renderDropdown(this.state.SelectedcolumnDefs)}
            {/* </ul> */}
          </div>
          <span>
            <FaPencilAlt
              onClick={this.handleTogglemodal}
              style={{ cursor: "pointer" }}
              color="red"
              size={18}
              className="mr-2 "
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
                <h4>Select Only Eleven Heading which is most visited</h4>
              </div>
              <Row>
                <Col lg="4" md="4" sm="12" xl="4" xs="12">
                  <h4>Available Columns</h4>
                  <div className="mainshffling">
                    <div class="ex1">
                      {AllAvailableCol?.length > 0 &&
                        AllAvailableCol?.map((ele, i) => {
                          return (
                            <>
                              <div
                                key={i}
                                // onClick={(e) =>
                                //   this.handleChangeHeader(e, ele, i,1)
                                // }
                                className="mycustomtag mt-1">
                                <span className="mt-1">
                                  <h5
                                    style={{ cursor: "pointer" }}
                                    className="allfields">
                                    {this.state.showpage?.includes(
                                      ele?.title
                                    ) ? (
                                      <>
                                        <input
                                          type="checkbox"
                                          className="mx-1"
                                          value={ele.title}
                                          onClick={(e) =>
                                            this.handleChangeHeader(e, ele, i)
                                          }
                                        />
                                        {this.state.showpage?.includes(
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
                  className="colarrowbtn">
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
                                            if (
                                              SelectedcolumnDefs?.length == 0
                                            ) {
                                              this.setState({
                                                AllAvailableCol:
                                                  AllAvailableCol,
                                              });
                                            }
                                            const SelectedCols =
                                              this.state.SelectedcolumnDefs.slice();
                                            const delindex =
                                              SelectedCols.findIndex(
                                                (element) =>
                                                  element?.title == ele?.title
                                              );
                                            this.state.SelectedcolumnDefs.slice();
                                            const index =
                                              SelectedColums.findIndex(
                                                (element) =>
                                                  element?.title == ele?.title
                                              );

                                            if (SelectedCols && delindex >= 0) {
                                              const splicedElement =
                                                SelectedCols.splice(
                                                  delindex,
                                                  1
                                                ); // Remove the element
                                              SelectedColums.splice(index, 1); // Remove the element

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
const mapStateToProps = state => {
  return {
    currentUser: state.auth.login.userRole,
  };
};
export default connect(mapStateToProps)(HorizontalSidebar);
