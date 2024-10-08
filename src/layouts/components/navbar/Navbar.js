import React, { useEffect, useState, useContext } from "react";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  NavLink,
  Navbar,
  NavbarBrand,
  UncontrolledDropdown,
} from "reactstrap";
import { connect } from "react-redux";
import classnames from "classnames";
import { useAuth0 } from "../../../authServices/auth0/auth0Service";
import {
  logoutWithJWT,
  logoutWithFirebase,
} from "../../../redux/actions/auth/loginActions";
import NavbarBookmarks from "./NavbarBookmarks";
import NavbarUser from "./NavbarUser";
import userImg from "../../../assets/img/portrait/small/avatar-s-11.jpg";
import CustomNavbar from "../reactstrap/navbar/BasicNavbar";
import logoimg from "../../../assets/img/logo/logomain.png";
import { Box, Circle, DollarSign, ShoppingCart, Users } from "react-feather";
import { FaAngleDown } from "react-icons/fa";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import logo from "../../../assets/img/logo/mainLogo1.png";
import { Route } from "react-router-dom";
import HorizontalMenu from "./Myhorizontalmenu";
import UserContext from "../../../context/Context";
import { Image_URL } from "../../../ApiEndPoint/Api";
// import HorizontalMenu from "../../../../src/layouts/layouts/components/menu/horizontal-menu/HorizontalMenu";
const PhoneNo = (props) => {
  let phone_no = "";
  if (props.userdata !== undefined) {
    phone_no = props.userdata.number;
  } else if (props.user.login.values !== undefined) {
    phone_no = props.user.login.values.number;
    if (
      props.user.login.values.loggedInWith !== undefined &&
      props.user.login.values.loggedInWith === "jwt"
    ) {
      phone_no = props.user.login.values.loggedInUser.number;
    }
  } else {
    phone_no = "9893245678";
  }

  return phone_no;
};
const ThemeNavbar = (props) => {
  const [screenSize, setScreenSize] = useState();
  const [screenheight, setScreenheight] = useState(false);
  const [myCustomColor, SetmyCustomColor] = useState("");
  const [ComDetails, setComDetails] = useState({});
  const { user } = useAuth0();
  const colorsArr = ["primary", "danger", "success", "info", "warning", "dark"];
  const navbarTypes = ["floating", "static", "sticky", "hidden"];
  const contextValue = useContext(UserContext);

  useEffect(() => {
    setScreenSize(window.innerWidth);
    setScreenheight(window.innerHeight);
    // setScreenSize({
    //   width: window.innerWidth,
    //   height: window.innerHeight,
    // });
  }, []);

  useEffect(() => {}, [screenSize, screenheight]);

  return (
    <React.Fragment>
      <div className="content-overlay" />
      <div className="header-navbar-shadow" />
      <Navbar
        style={{
          backgroundColor: `${
            contextValue?.myCustomColor ? contextValue?.myCustomColor : "White"
          }`,
        }}
        className={classnames(
          "header-navbar navbar-expand-lg navbar navbar-with-menu navbar-shadow",
          {
            "navbar-light":
              props.navbarColor === "default" ||
              !colorsArr.includes(props.navbarColor),
            "navbar-dark": colorsArr.includes(props.navbarColor),
            "bg-primary":
              props.navbarColor === "primary" && props.navbarType !== "static",
            "bg-danger":
              props.navbarColor === "danger" && props.navbarType !== "static",
            "bg-success":
              props.navbarColor === "success" && props.navbarType !== "static",
            "bg-info":
              props.navbarColor === "info" && props.navbarType !== "static",
            "bg-warning":
              props.navbarColor === "warning" && props.navbarType !== "static",
            "bg-dark":
              props.navbarColor === "dark" && props.navbarType !== "static",
            "d-none": props.navbarType === "hidden" && !props.horizontal,
            "floating-nav":
              (props.navbarType === "floating" && !props.horizontal) ||
              (!navbarTypes.includes(props.navbarType) && !props.horizontal),
            "navbar-static-top":
              props.navbarType === "static" && !props.horizontal,
            "fixed-top": props.navbarType === "sticky" || props.horizontal,
            scrolling: props.horizontal && props.scrolling,
          }
        )}>
        <div className="navbar-wrapper">
          {/* <HorizontalMenu /> */}

          <div className="navbar-container content">
            <div
              className="navbar-collapse d-flex justify-content-between align-items-center"
              id="navbar-mobile">
              {" "}
              <Route
                render={({ history }) => (
                  <div
                    title="Click to Go Dashboard"
                    style={{
                      cursor: "pointer",
                      width: `${window.innerWidth <= 768 ? "25%" : "8%"}`,
                    }}
                    // style={{ cursor: "pointer", width: "8%" }}
                    onClick={() => history.push("/dashboard")}>
                    {contextValue?.CompanyDetails?.logo &&
                    contextValue?.CompanyDetails?.logo ? (
                      <>
                        <img
                          src={` ${Image_URL}/Images/${contextValue?.CompanyDetails?.logo}`}
                          width="100%"
                          height={54}
                          alt="logo"
                        />
                      </>
                    ) : (
                      <>
                        <img src={logo} width="100%" height={54} alt="logo" />
                      </>
                    )}
                  </div>
                )}
              />
              <div className="bookmark-wrapper">
                <NavbarBookmarks
                  sidebarVisibility={props.sidebarVisibility}
                  handleAppOverlay={props.handleAppOverlay}
                />
              </div>
              {props.horizontal ? (
                <span className="horizontalmenu">
                  <HorizontalMenu contextValue={contextValue?.myCustomColor} />
                </span>
              ) : null}
              <>
                <NavbarUser
                  handleAppOverlay={props.handleAppOverlay}
                  changeCurrentLang={props.changeCurrentLang}
                  phoneNo={<PhoneNo userdata={user} {...props} />}
                  userImg={
                    props.user.login.values !== undefined &&
                    props.user.login.values.loggedInWith !== "jwt" &&
                    props.user.login.values.photoUrl
                      ? props.user.login.values.photoUrl
                      : user !== undefined && user.picture
                      ? user.picture
                      : userImg
                  }
                  loggedInWith={
                    props.user !== undefined &&
                    props.user.login.values !== undefined
                      ? props.user.login.values.loggedInWith
                      : null
                  }
                  logoutWithJWT={props.logoutWithJWT}
                  logoutWithFirebase={props.logoutWithFirebase}
                />
              </>
            </div>
          </div>
        </div>
      </Navbar>

      <Navbar
        style={{
          backgroundColor: `${
            contextValue?.myCustomColor ? contextValue?.myCustomColor : "White"
          }`,
          position: "fixed",
          // bottom: 25,
          // bottom: `${screenheight && screenheight > 768 ? 0 : 25}`,
          // bottom: `${window.innerHeight - window.innerHeight * 0.9}`,
        }}
        className={classnames(
          "header-navbar navbar-expand-lg navbar navbar-with-menu navbar-shadow",
          {
            "navbar-light":
              props.navbarColor === "default" ||
              !colorsArr.includes(props.navbarColor),
            "navbar-dark": colorsArr.includes(props.navbarColor),
            "bg-primary":
              props.navbarColor === "primary" && props.navbarType !== "static",
            "bg-danger":
              props.navbarColor === "danger" && props.navbarType !== "static",
            "bg-success":
              props.navbarColor === "success" && props.navbarType !== "static",
            "bg-info":
              props.navbarColor === "info" && props.navbarType !== "static",
            "bg-warning":
              props.navbarColor === "warning" && props.navbarType !== "static",
            "bg-dark":
              props.navbarColor === "dark" && props.navbarType !== "static",
            "d-none": props.navbarType === "hidden" && !props.horizontal,
            "floating-nav":
              (props.navbarType === "floating" && !props.horizontal) ||
              (!navbarTypes.includes(props.navbarType) && !props.horizontal),
            "navbar-static-top":
              props.navbarType === "static" && !props.horizontal,
            "fixed-top": props.navbarType === "sticky" || props.horizontal,
            scrolling: props.horizontal && props.scrolling,
          }
        )}>
        <div className="navbar-wrapper">
          {/* <HorizontalMenu /> */}

          <div className="navbar-container content">
            <div
              className="navbar-collapse d-flex justify-content-between align-items-center"
              id="navbar-mobile">
              {" "}
              <Route
                render={({ history }) => (
                  <div
                    title="Click to Go Dashboard"
                    style={{
                      cursor: "pointer",
                      width: `${window.innerWidth <= 768 ? "25%" : "8%"}`,
                    }}
                    // style={{ cursor: "pointer", width: "8%" }}
                    onClick={() => history.push("/dashboard")}>
                    {contextValue?.CompanyDetails?.logo &&
                    contextValue?.CompanyDetails?.logo ? (
                      <>
                        <img
                          src={`${Image_URL}/Images/${contextValue?.CompanyDetails?.logo}`}
                          width="100%"
                          height={55}
                          alt="logo"
                        />
                      </>
                    ) : (
                      <>
                        <img src={logo} width="100%" height={55} alt="logo" />
                      </>
                    )}
                  </div>
                )}
              />
              <div className="bookmark-wrapper">
                <NavbarBookmarks
                  sidebarVisibility={props.sidebarVisibility}
                  handleAppOverlay={props.handleAppOverlay}
                />
              </div>
              {props.horizontal ? (
                <span className="horizontalmenu">
                  <HorizontalMenu contextValue={contextValue?.myCustomColor} />
                </span>
              ) : null}
              <>
                <NavbarUser
                  handleAppOverlay={props.handleAppOverlay}
                  changeCurrentLang={props.changeCurrentLang}
                  phoneNo={<PhoneNo userdata={user} {...props} />}
                  userImg={
                    props.user.login.values !== undefined &&
                    props.user.login.values.loggedInWith !== "jwt" &&
                    props.user.login.values.photoUrl
                      ? props.user.login.values.photoUrl
                      : user !== undefined && user.picture
                      ? user.picture
                      : userImg
                  }
                  loggedInWith={
                    props.user !== undefined &&
                    props.user.login.values !== undefined
                      ? props.user.login.values.loggedInWith
                      : null
                  }
                  logoutWithJWT={props.logoutWithJWT}
                  logoutWithFirebase={props.logoutWithFirebase}
                />
              </>
            </div>
          </div>
        </div>
      </Navbar>
    </React.Fragment>
  );
};

const mapStateToProps = state => {
  return {
    user: state.auth,
  };
};

export default connect(mapStateToProps, {
  logoutWithJWT,
  logoutWithFirebase,
  useAuth0,
})(ThemeNavbar);

// import React from "react";
// import { Navbar } from "reactstrap";
// import { connect } from "react-redux";
// import classnames from "classnames";
// import { useAuth0 } from "../../../authServices/auth0/auth0Service";
// import {
//   logoutWithJWT,
//   logoutWithFirebase,
// } from "../../../redux/actions/auth/loginActions";
// import NavbarBookmarks from "./NavbarBookmarks";
// import NavbarUser from "./NavbarUser";
// import userImg from "../../../assets/img/portrait/small/avatar-s-11.jpg";

// const PhoneNo = (props) => {
//   console.log(props);
//   let phone_no = "";
//   if (props.userdata !== undefined) {
//     phone_no = props.userdata.number;
//   } else if (props.user.login.values !== undefined) {
//     phone_no = props.user.login.values.number;
//     if (
//       props.user.login.values.loggedInWith !== undefined &&
//       props.user.login.values.loggedInWith === "jwt"
//     ) {
//       phone_no = props.user.login.values.loggedInUser.number;
//     }
//   } else {
//     phone_no = "9893245678";
//   }

//   return phone_no;
// };
// const ThemeNavbar = (props) => {
//   const { user } = useAuth0();
//   const colorsArr = ["primary", "danger", "success", "info", "warning", "dark"];
//   const navbarTypes = ["floating", "static", "sticky", "hidden"];
//   return (
//     <React.Fragment>
//       <div className="content-overlay" />
//       <div className="header-navbar-shadow" />
//       <Navbar
//         className={classnames(
//           "header-navbar navbar-expand-lg navbar navbar-with-menu navbar-shadow",
//           {
//             "navbar-light":
//               props.navbarColor === "default" ||
//               !colorsArr.includes(props.navbarColor),
//             "navbar-dark": colorsArr.includes(props.navbarColor),
//             "bg-primary":
//               props.navbarColor === "primary" && props.navbarType !== "static",
//             "bg-danger":
//               props.navbarColor === "danger" && props.navbarType !== "static",
//             "bg-success":
//               props.navbarColor === "success" && props.navbarType !== "static",
//             "bg-info":
//               props.navbarColor === "info" && props.navbarType !== "static",
//             "bg-warning":
//               props.navbarColor === "warning" && props.navbarType !== "static",
//             "bg-dark":
//               props.navbarColor === "dark" && props.navbarType !== "static",
//             "d-none": props.navbarType === "hidden" && !props.horizontal,
//             "floating-nav":
//               (props.navbarType === "floating" && !props.horizontal) ||
//               (!navbarTypes.includes(props.navbarType) && !props.horizontal),
//             "navbar-static-top":
//               props.navbarType === "static" && !props.horizontal,
//             "fixed-top": props.navbarType === "sticky" || props.horizontal,
//             scrolling: props.horizontal && props.scrolling,
//           }
//         )}
//       >
//         <div className="navbar-wrapper">
//           <div className="navbar-container content">
//             <div
//               className="navbar-collapse d-flex justify-content-between align-items-center"
//               id="navbar-mobile"
//             >
//               <div className="bookmark-wrapper">
//                 <NavbarBookmarks
//                   sidebarVisibility={props.sidebarVisibility}
//                   handleAppOverlay={props.handleAppOverlay}
//                 />
//               </div>
//               {props.horizontal ? (
//                 <div className="logo d-flex align-items-center">
//                   <div className="brand-logo mr-50"></div>
//                   <h2 className="text-primary brand-text mb-0">Vuexy</h2>
//                 </div>
//               ) : null}
//               <NavbarUser
//                 handleAppOverlay={props.handleAppOverlay}
//                 changeCurrentLang={props.changeCurrentLang}
//                 phoneNo={<PhoneNo userdata={user} {...props} />}
//                 userImg={
//                   props.user.login.values !== undefined &&
//                   props.user.login.values.loggedInWith !== "jwt" &&
//                   props.user.login.values.photoUrl
//                     ? props.user.login.values.photoUrl
//                     : user !== undefined && user.picture
//                     ? user.picture
//                     : userImg
//                 }
//                 loggedInWith={
//                   props.user !== undefined &&
//                   props.user.login.values !== undefined
//                     ? props.user.login.values.loggedInWith
//                     : null
//                 }
//                 logoutWithJWT={props.logoutWithJWT}
//                 logoutWithFirebase={props.logoutWithFirebase}
//               />
//             </div>
//           </div>
//         </div>
//       </Navbar>
//     </React.Fragment>
//   );
// };

// const mapStateToProps = (state) => {
//   return {
//     user: state.auth,
//   };
// };

// export default connect(mapStateToProps, {
//   logoutWithJWT,
//   logoutWithFirebase,
//   useAuth0,
// })(ThemeNavbar);
