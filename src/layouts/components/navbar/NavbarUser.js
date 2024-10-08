import React, { useContext } from "react";
import {
  UncontrolledDropdown,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Media,
  Badge,
} from "reactstrap";
import "react-phone-input-2/lib/style.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import axiosConfig from "../../../axiosConfig";
import * as Icon from "react-feather";

import "../../assets/scss/pages/users.scss";
import { history } from "../../../history";
import image from "../../assets/img/logo/logo-primary.png";
import { IntlContext } from "../../../utility/context/Internationalization";
import { Route, useHistory } from "react-router-dom";
import logoinfo from "../../assets/img/logo/logo-info.png";
import { BsCartCheckFill, BsMoon, BsMoonFill } from "react-icons/bs";
import UserContext from "../../../context/Context";
import themeConfig from "../../../../src/configs/themeConfig";

// import { GetDeliveryAddress } from "../../../ApiEndPoint/ApiCalling";
import { Image_URL } from "../../../ApiEndPoint/Api";

const total = [];

const UserDropdown = (props) => {
  // const { logout, isAuthenticated } = useAuth0()
  return (
    <DropdownMenu right>
      <DropdownItem divider />
      <Route
        render={({ history }) => (
          <DropdownItem
            tag="a"
            onClick={(e) => {
              e.preventDefault();
              history.push("/pages/profile/userProfile");
            }}>
            <Icon.User size={14} className="mr-50" />
            <span className="align-middle">Edit Profile</span>
          </DropdownItem>
        )}
      />
      {/* <Route
        render={({ history }) => (
          <DropdownItem
            tag="a"
            onClick={(e) => {
              e.preventDefault();
              history.push("/pages/profile/userProfile");
            }}
          >
            <Icon.Plus size={14} className="mr-50" />
            <span className="align-middle">Upload Logo</span>
          </DropdownItem>
        )}
      /> */}
      <Route
        render={({ history }) => (
          <DropdownItem
            tag="a"
            href="#"
            onClick={(e) => {
              // localStorage.clear();
              localStorage.removeItem("userData");
              history.push("/#/pages/login");
              const data = new FormData();
              let pageparmission = JSON.parse(localStorage.getItem("userData"));
              data.append("user_id", pageparmission?.Userinfo?.id);
              data.append("role", pageparmission?.Userinfo?.role);
              axiosConfig
                .post("/apiLogout", data)
                .then((resp) => {
                  console.log(resp);
                  // localStorage.clear();
                  localStorage.removeItem("userData");
                  history.push("/#/");
                  // history.push("/#/pages/login");
                })
                .catch((err) => {
                  console.log(err);
                  // swal("Somethig Went Wrong");
                });
              // if (isAuthenticated) {
              //    // return logout({
              //    //   returnTo: window.location.origin + process.env.REACT_APP_PUBLIC_PATH
              //    // })
              // }
              const provider = props.loggedInWith;
              if (provider !== null) {
                if (provider === "jwt") {
                  return props.logoutWithJWT();
                }
                if (provider === "firebase") {
                  return props.logoutWithFirebase();
                }
              } else {
                localStorage.removeItem("userData");
                // localStorage.clear();
                history.push("/#/");
                // history.push("/#/pages/login");
              }
            }}>
            <Icon.Power size={14} className="mr-50" />
            <span className="align-middle">Log Out</span>
          </DropdownItem>
        )}
      />
    </DropdownMenu>
  );
};

class NavbarUser extends React.PureComponent {
  static contextType = UserContext;
  state = {
    // navbarSearch: false,
    langDropdown: false,
    userData: "",
    AddressIndex: "0",
    modal: false,
    switchScreen: false,
    setAddress: false,
    paymentmode: false,
    myCart: [],
    AddressList: [],
    SetTotal: [],
    TaxType: "All",
    fullname: "",
    Landmark: "",
    address: "",
    pincode: "",
    Alternateno: "",
    selectedCountry: null,

    theme: "semi-dark",

    Total: Number,
    Quantity: [],
    LoginData: {},
    shoppingCart: [
      {
        id: 1,
        name: "Apple - Apple Watch Series 1 42mm Space Gray Aluminum Case Black Sport Band - Space Gray Aluminum",
        desc: "Durable, lightweight aluminum cases in silver, space gray, gold, and rose gold. Sport Band in a variety of colors. All the features of the original Apple Watch, plus a new dual-core processor for faster performance. All models run watchOS 3. Requires an iPhone 5 or later.",
        price: "$299",
        img: require("../../../assets/img/pages/eCommerce/4.png"),
        width: 75,
      },
      {
        id: 2,
        name: "Apple - Macbook® (Latest Model) - 12' Display - Intel Core M5 - 8GB Memory - 512GB Flash Storage Space Gray",
        desc: "MacBook delivers a full-size experience in the lightest and most compact Mac notebook ever. With a full-size keyboard, force-sensing trackpad, 12-inch Retina display,1 sixth-generation Intel Core M processor, multifunctional USB-C port, and now up to 10 hours of battery life,2 MacBook features big thinking in an impossibly compact form.",
        price: "$1599.99",
        img: require("../../../assets/img/pages/eCommerce/dell-inspirion.jpg"),
        width: 100,
        imgClass: "mt-1 pl-50",
      },
      {
        id: 3,
        name: "Sony - PlayStation 4 Pro Console",
        desc: "PS4 Pro Dynamic 4K Gaming & 4K Entertainment* PS4 Pro gets you closer to your game. Heighten your experiences. Enrich your adventures. Let the super-charged PS4 Pro lead the way.** GREATNESS AWAITS",
        price: "$399.99",
        img: require("../../../assets/img/pages/eCommerce/7.png"),
        width: 88,
      },
      {
        id: 4,
        name: "Beats by Dr. Dre - Geek Squad Certified Refurbished Beats Studio Wireless On-Ear Headphones - Red",
        desc: "Rock out to your favorite songs with these Beats by Dr. Dre Beats Studio Wireless GS-MH8K2AM/A headphones that feature a Beats Acoustic Engine and DSP software for enhanced clarity. ANC (Adaptive Noise Cancellation) allows you to focus on your tunes.",
        price: "$379.99",
        img: require("../../../assets/img/pages/eCommerce/10.png"),
        width: 75,
      },
      {
        id: 5,
        name: "Sony - 75' Class (74.5' diag) - LED - 2160p - Smart - 3D - 4K Ultra HD TV with High Dynamic Range - Black",
        desc: "This Sony 4K HDR TV boasts 4K technology for vibrant hues. Its X940D series features a bold 75-inch screen and slim design. Wires remain hidden, and the unit is easily wall mounted. This television has a 4K Processor X1 and 4K X-Reality PRO for crisp video. This Sony 4K HDR TV is easy to control via voice commands.",
        price: "$4499.99",
        img: require("../../../assets/img/pages/eCommerce/sony-75class-tv.jpg"),
        width: 100,
        imgClass: "mt-1 pl-50",
      },
      {
        id: 6,
        name: "Nikon - D810 DSLR Camera with AF-S NIKKOR 24-120mm f/4G ED VR Zoom Lens - Black",
        desc: "Shoot arresting photos and 1080p high-definition videos with this Nikon D810 DSLR camera, which features a 36.3-megapixel CMOS sensor and a powerful EXPEED 4 processor for clear, detailed images. The AF-S NIKKOR 24-120mm lens offers shooting versatility. Memory card sold separately.",
        price: "$4099.99",
        img: require("../../../assets/img/pages/eCommerce/canon-camera.jpg"),
        width: 70,
        imgClass: "mt-1 pl-50",
      },
    ],
    suggestions: [],
  };

  changeCountry = (item) => {
    this.setState({ selectedCountry: item });
  };
  changeCity = (item) => {
    console.log("item", item);
    this.setState({
      submitPlaceHandler: item,
    });
  };

  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleAddAddress = (e) => {
    e.preventDefault();
    this.setState({ setAddress: true });
  };
  toggleModal = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };
  loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  async componentDidMount() {
    const user = this.context;
    const mytheme = localStorage.getItem("theme");
    if (mytheme) {
      themeConfig.theme = mytheme;
    } else {
      themeConfig.theme = this.state.theme;
    }
    // console.log(theme);
    this.setState({ theme: mytheme });

    let pageparmission = JSON.parse(localStorage.getItem("userData"));

    this.setState({ LoginData: pageparmission });
    let accessToken = localStorage.getItem("userData");

    if (accessToken === null || accessToken === undefined) {
      history.push("/#/");
      window.location.reload();
      // history.push("/#/pages/login");
    }
    // axiosConfig.get("/api/main-search/data").then(({ data }) => {
    //   this.setState({ suggestions: data.searchResult });
    // });
    let data = JSON.parse(localStorage.getItem("userData")); //forgot to close
    this.setState({ userData: data });
  }

  // handleDeletePartsCate = (e, ele) => {
  //   e.preventDefault();
  //   let userdata = JSON.parse(localStorage.getItem("userData"));

  //   swal("Warning", "Sure You Want to Delete item", {
  //     buttons: {
  //       cancel: "Cancel",
  //       catch: { text: "Delete ", value: "delete" },
  //     },
  //   }).then((value) => {
  //     switch (value) {
  //       case "delete":
  //         let value = {
  //           userId: userdata?._id,
  //           productId: ele?.productId,
  //         };
  //         DeleteCartItemPartsCatelogue(value)
  //           .then((res) => {})
  //           .catch((err) => {
  //             console.log(err);
  //           });
  //         break;
  //       default:
  //     }
  //   });
  // };

  // handleNavbarSearch = () => {
  //   this.setState({
  //     navbarSearch: !this.state.navbarSearch
  //   })
  // }
  changetheme = (value) => {
    // console.log(value);
    localStorage.setItem("theme", value);
    this.setState({ theme: value });
    window.location.reload();
    // if (value) {
    //   themeConfig.theme = value;
    // } else {
    //   themeConfig.theme = this.state.theme;
    // }
  };

  removeItem = (id) => {
    let cart = this.state.shoppingCart;
    let updatedCart = cart.filter((i) => i.id !== id);
    this.setState({
      shoppingCart: updatedCart,
    });
  };
  handleQuantityChange = (e) => {
    console.log(e.target.value);
  };
  HandleAddresIndex = (e, index) => {
    this.setState({ AddressIndex: index });
  };
  // FinalParts = () => {
  //   let userData = JSON.parse(localStorage.getItem("userData"));
  //   console.log(userData?._id);
  //   this.setState({ switchScreen: true });
  //   GetDeliveryAddress(userData?._id)
  //     .then((res) => {
  //       console.log(res?.Address);
  //       this.setState({ AddressList: res?.Address });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  handleDecreaseCount = (ele, index, e) => {
    e.preventDefault();
    this.state.SetTotal[index] =
      ele?.product?.Part_Price * (this.state.Quantity[index] - 1);
    console.log(this.state.SetTotal);
    let findtotal = this.state.SetTotal?.reduce((a, b) => a + b, 0);
    this.setState({ Total: findtotal });
    this.setState((prevState) => {
      const newQuantities = [...prevState.Quantity];
      if (newQuantities[index] > 0) {
        newQuantities[index] -= 1;
      }
      return { Quantity: newQuantities };
    });
  };

  handleIncreaseCount = (ele, index, e) => {
    e.preventDefault();
    this.state.SetTotal[index] =
      ele?.product?.Part_Price * (this.state.Quantity[index] + 1);
    // console.log(this.state.SetTotal);

    let findtotal = this.state.SetTotal?.reduce((a, b) => a + b, 0);
    console.log(findtotal);
    this.setState({ Total: findtotal });
    this.setState((prevState) => {
      const newQuantities = [...prevState.Quantity];
      newQuantities[index] += 1;
      // console.log(ele?.product?.Part_Price * newQuantities);
      return { Quantity: newQuantities };
    });
  };

  handleLangDropdown = () =>
    this.setState({ langDropdown: !this.state.langDropdown });
  render() {
    let pageparmission = JSON.parse(localStorage.getItem("userData"));
    const user = this.context;
    const { userData } = this.state;
    const renderCartItems = this.state.shoppingCart?.map((item) => {
      return (
        <>
          <div className="cart-item" key={item.id}>
            <Media
              className="p-0"
              onClick={() => history.push("/ecommerce/product-detail")}>
              <Media className="text-center pr-0 mr-1" left>
                <img
                  className={`${
                    item.imgClass
                      ? item.imgClass + " cart-item-img"
                      : "cart-item-img"
                  }`}
                  src={item.img}
                  width={item.width}
                  alt="Cart Item"
                />
              </Media>
              <Media className="overflow-hidden pr-1 py-1 pl-0" body>
                <span className="item-title text-truncate text-bold-500 d-block mb-50">
                  {item.name}
                </span>
                <span className="item-desc font-small-2 text-truncate d-block">
                  {item.desc}
                </span>
                <div className="d-flex justify-content-between align-items-center mt-1">
                  <span className="align-middle d-block">1 x {item.price}</span>
                  <Icon.X
                    className="danger"
                    size={15}
                    onClick={(e) => {
                      e.stopPropagation();
                      this.removeItem(item.id);
                    }}
                  />
                </div>
              </Media>
            </Media>
          </div>
        </>
      );
    });

    return (
      <ul className="nav navbar-nav navbar-nav-user float-right">
        {/* <IntlContext.Consumer>
          {(context) => {
            let langArr = {
               "en" : "English",
               "de" : "German",
               "fr" : "French",
              "pt" : "Portuguese"
            };
            return (
              <>
               
                <Dropdown
                  tag="li"
                  className="dropdown-language nav-item"
                  isOpen={this.state.langDropdown}
                  toggle={this.handleLangDropdown}
                  data-tour="language">
                  <DropdownToggle tag="a" className="nav-link">
                    <span className="d-sm-inline-block d-none text-capitalize align-middle ml-50">
                      {langArr[context.state.locale]}
                    </span>
                  </DropdownToggle>
                  <DropdownMenu right></DropdownMenu>
                </Dropdown>
              </>
            );
          }}
        </IntlContext.Consumer>
        {/*
        <div title="Toggle Mode" className="mt-2" style={{ cursor: "pointer" }}>
          {this.state.theme == "semi-dark" ? (
            <>
              <BsMoonFill onClick={() => this.changetheme("dark")} size={19} />
            </>
          ) : (
            <>
              <BsMoon onClick={() => this.changetheme("semi-dark")} size={19} />
            </>
          )}
        </div>*/}
        {/* <UncontrolledDropdown
          tag="li"
          className="dropdown-notification nav-item">
          <DropdownToggle tag="a" className="nav-link nav-link-label">
            <BsCartCheckFill color="#055761" size={19} />
            <Badge pill color="primary" className="badge-up">
              {user?.PartsCatalougueCart?.length > 0 ? (
                <>{user?.PartsCatalougueCart?.length}</>
              ) : (
                <>{this.state.myCart.length}</>
              )}
              {this.state.myCart.length && this.state.myCart.length}
            </Badge>
          </DropdownToggle>
          <DropdownMenu tag="ul" right className="dropdown-menu-media">
            <li className="dropdown-menu-header">
              <div className="dropdown-header mt-0">
                <h3 className="text-white">Products </h3>
                <span className="notification-title">Notifications</span>
              </div>
            </li>
            <PerfectScrollbar
              className="media-list overflow-hidden position-relative"
              options={{
                wheelPropagation: false,
              }}></PerfectScrollbar>
            <li
              onClick={() => {
                this.toggleModal();
              }}
              className="dropdown-menu-footer">
              <DropdownItem tag="a" className="p-1 text-center">
                <span className="align-middle">View all</span>
              </DropdownItem>
            </li>
          </DropdownMenu>
        </UncontrolledDropdown> */}

        {/* end */}

        {/* <UncontrolledDropdown
          tag="li"
          className="dropdown-notification nav-item">
          <DropdownToggle tag="a" className="nav-link nav-link-label">
            <Icon.Bell size={19} />
            <Badge pill color="primary" className="badge-up">
              1
            </Badge>
          </DropdownToggle>
          <DropdownMenu tag="ul" right className="dropdown-menu-media">
            <li className="dropdown-menu-header">
              <div className="dropdown-header mt-0">
                <h3 className="text-white">1 New</h3>
                <span className="notification-title">App Notifications</span>
              </div>
            </li>
            <PerfectScrollbar
              className="media-list overflow-hidden position-relative"
              options={{
                wheelPropagation: false,
              }}>
              <div className="d-flex justify-content-between">
                <Media
                  className="d-flex align-items-start"
                  onClick={() => {
                    history.push("/#/app/softNumen/order/OrderOne");
                    window.location.reload();
                  }}>
                  <Media left href="#">
                    <Icon.PlusSquare
                      className="font-medium-5 primary"
                      size={19}
                    />
                  </Media>
                  <Media body>
                    <Media heading className="primary media-heading" tag="h6">
                      You have new order!
                    </Media>
                    <p className="notification-text">
                      Are your going to meet me tonight?
                    </p>
                  </Media>
                  <small>
                    <time
                      className="media-meta"
                      dateTime="2015-06-11T18:29:20+08:00">
                      9 hours ago
                    </time>
                  </small>
                </Media>
              </div>
              <div className="d-flex justify-content-between">
                <Media className="d-flex align-items-start">
                  <Media left href="#">
                    <Icon.DownloadCloud
                      className="font-medium-5 success"
                      size={21}
                    />
                  </Media>
                  <Media body>
                    <Media heading className="success media-heading" tag="h6">
                      99% Server load
                    </Media>
                    <p className="notification-text">
                      You got new order of goods?
                    </p>
                  </Media>
                  <small>
                    <time
                      className="media-meta"
                      dateTime="2015-06-11T18:29:20+08:00"
                    >
                      5 hours ago
                    </time>
                  </small>
                </Media>
              </div>
              <div className="d-flex justify-content-between">
                <Media className="d-flex align-items-start">
                  <Media left href="#">
                    <Icon.AlertTriangle
                      className="font-medium-5 danger"
                      size={21}
                    />
                  </Media>
                  <Media body>
                    <Media heading className="danger media-heading" tag="h6">
                      Warning Notification
                    </Media>
                    <p className="notification-text">
                      Server has used 99% of CPU
                    </p>
                  </Media>
                  <small>
                    <time
                      className="media-meta"
                      dateTime="2015-06-11T18:29:20+08:00"
                    >
                      Today
                    </time>
                  </small>
                </Media>
              </div>
              <div className="d-flex justify-content-between">
                <Media className="d-flex align-items-start">
                  <Media left href="#">
                    <Icon.CheckCircle
                      className="font-medium-5 info"
                      size={21}
                    />
                  </Media>
                  <Media body>
                    <Media heading className="info media-heading" tag="h6">
                      Complete the task
                    </Media>
                    <p className="notification-text">
                      One of your task is pending.
                    </p>
                  </Media>
                  <small>
                    <time
                      className="media-meta"
                      dateTime="2015-06-11T18:29:20+08:00"
                    >
                      Last week
                    </time>
                  </small>
                </Media>
              </div>
              <div className="d-flex justify-content-between">
                <Media className="d-flex align-items-start">
                  <Media left href="#">
                    <Icon.File className="font-medium-5 warning" size={21} />
                  </Media>
                  <Media body>
                    <Media heading className="warning media-heading" tag="h6">
                      Generate monthly report
                    </Media>
                    <p className="notification-text">
                      Reminder to generate monthly report
                    </p>
                  </Media>
                  <small>
                    <time
                      className="media-meta"
                      dateTime="2015-06-11T18:29:20+08:00"
                    >
                      Last month
                    </time>
                  </small>
                </Media>
              </div>
            </PerfectScrollbar>
            <li className="dropdown-menu-footer">
              <DropdownItem tag="a" className="p-1 text-center">
                <span className="align-middle">Read all notifications</span>
              </DropdownItem>
            </li>
          </DropdownMenu>
        </UncontrolledDropdown> */}
        <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
          <DropdownToggle tag="a" className="nav-link dropdown-user-link">
            <div className="user-nav d-sm-flex d-none">
              <div className="user-name text-bold-600">
                {pageparmission &&
                  `${pageparmission?.firstName && pageparmission?.firstName} ${
                    pageparmission?.lastName && pageparmission?.lastName
                  }`}{" "}
              </div>
              <div>{pageparmission && pageparmission?.rolename?.roleName}</div>
            </div>
            {/*
            <span data-tour="user">
            
              {this.state.LoginData?.profileImage ? (
                <>
                  <img
                    src={`${Image_URL}/Images/${this.state.LoginData?.profileImage}`}
                    className="round"
                    height="30"
                    width="30"
                    alt="avatar"
                  />
                </>
              ) : (
                <>
                  <img
                    src={logoinfo}
                    className="round"
                    height="30"
                    width="30"
                    alt="avatar"
                  />
                </>
              )}
            </span>*/}
          </DropdownToggle>
          <UserDropdown {...this.props} />
        </UncontrolledDropdown>
      </ul>
    );
  }
}
export default NavbarUser;
