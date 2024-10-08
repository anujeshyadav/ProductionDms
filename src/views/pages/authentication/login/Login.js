import React from "react";
import {
  Container,
  CardTitle,
  FormGroup,
  Input,
  Label,
  Button,
  CardHeader,
  Card,
  Col,
  Row,
  Form,
  TabContent,
  TabPane,
  InputGroup,
  // InputGroupAddon,
} from "reactstrap";
// import { FaBeer } from "react-icons/fa";
import logo from "../../../../assets/img/logo/Rupiologo.png";
import "../../../../assets/scss/pages/authentication.scss";
// import '../../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
// import { history } from "../../../../history";
// import LoginAuth0 from "./LoginAuth0";
import LoginFirebase from "./LoginFirebase";
import LoginJWT from "./LoginJWT";
import { connect } from "react-redux";
import UserContext from "../../../../context/Context";
import OtpInput from "react-otp-input";
import swal from "sweetalert";

import axiosConfig from "../../../../axiosConfig";
import {
  UserLogin,
  UserOTPVerify,
  ViewCompanyDetails,
} from "../../../../ApiEndPoint/ApiCalling";
// import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import axios from "axios";

class Login extends React.Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      Otp: "",
      Location: { latitude: "", longitude: "", timestamp: "" },
      Error: "",
      Otp: "",
      Loader: false,
      emailotp: "",
      type: "password",
      whatsappotp: "",
      smsotp: "",
      OtpScreen: false,
      UserCredential: {},
      password: "",
      resetpassword: false,
    };
  }
  // async componentDidMount() {
  //   this.preventBackButton();
  //   await this.handleUserLocation();
  // }
  async getLocationAndUpdateState() {
    try {
      await this.handleUserLocation();
      // Additional logic after obtaining location, if needed
    } catch (error) {
      console.error("Error obtaining location:", error);
      // Handle the error or update state accordingly
    }
  }
  async componentDidMount() {
    this.preventBackButton();
    await this.getLocationAndUpdateState();
  }
  preventBackButton() {
    window.history.pushState(null, null, window.location.href);
    this.popstateHandler = function () {
      window.history.go(1);
    };
    window.addEventListener("popstate", this.popstateHandler);
  }
  handlechange = (e) => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };
  componentWillUnmount() {
    this.allowBackButton();
  }
  allowBackButton() {
    window.removeEventListener("popstate", this.popstateHandler);
  }
  loginOTPHandler = async (e) => {
    e.preventDefault();
    let UserCredential = this.state.UserCredential;
    if (this.state.emailotp?.length == 4) {
      let Opt = { otp: this.state.emailotp, email: UserCredential?.email };
      await UserOTPVerify(Opt)
        .then((response) => {
          let basicinfor = response?.user;

          if (response?.status) {
            localStorage.setItem("userData", JSON.stringify(basicinfor));
            localStorage.setItem("loginTime", Date.now());
            this.context?.setUserInformatio(basicinfor);

            swal(
              "Success",
              "You are LoggedIn!",
              "success",

              {
                buttons: {
                  ok: { text: "Ok", value: "ok" },
                },
              }
            ).then((value) => {
              switch (value) {
                case "ok":
                  break;
                default:
              }
            });
            setTimeout(() => {
              this.props.history.push("/dashboard");
            }, 1000);
          } else {
            swal("Something Went Wrong");
          }
        })
        .catch((err) => {
          console.log(err.response);
          swal(
            `Error`,
            `${err.response?.data.error} Please Enter correct Details`
          );
        });
    } else {
      swal("Please Enter OTP");
      // swal({
      //   title: "Are you sure?",
      //   text: "Are you sure that you want to leave this page?",
      //   icon: "warning",
      //   dangerMode: true,
      // }).then((willDelete) => {
      //   if (willDelete) {
      //     swal("Deleted!", "Your imaginary file has been deleted!", "success");
      //   }
      // });
    }
  };
  handleUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const date = new Date(position.timestamp);
            const CurentTime = date.toLocaleString();

            this.state.Location.latitude = position.coords.latitude;
            this.state.Location.longitude = position.coords.longitude;
            this.state.Location.timestamp = CurentTime;
            // this.setState((prevState) => ({
            //   Location: {
            //     ...prevState.Location,
            //     latitude: position.coords.latitude,
            //     longitude: position.coords.longitude,
            //     timestamp: currentTime,
            //   },
            //   Error: null, // Reset error if successful
            // }));

            resolve(); // Resolve the promise when location is obtained
          },
          (error) => {
            this.setState({ Error: `Error: ${error.message}` });
            reject(error); // Reject the promise if there's an error
          },
          { timeout: 10000, enableHighAccuracy: true }
        );
      } else {
        this.setState({
          Error: "Geolocation is not supported by this browser.",
        });
        reject(new Error("Geolocation is not supported by this browser."));
      }
    });
  };
  // handleUserLocation = () => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const date = new Date(position.timestamp);
  //         const CurentTime = date.toLocaleString();

  //         this.state.Location.latitude = position.coords.latitude;
  //         this.state.Location.longitude = position.coords.longitude;
  //         this.state.Location.timestamp = CurentTime;
  //       },
  //       (error) => {
  //         this.setState({ Error: `Error: ${error}` });
  //       },
  //       { timeout: 10000, enableHighAccuracy: true }
  //     );
  //   } else {
  //     this.setState({
  //       Error: "Geolocation is not supported by this browser.",
  //     });
  //   }
  // };
  loginHandler = async (e) => {
    e.preventDefault();
    this.setState({ Loader: true });
    // await this.handleUserLocation();
    // this.props.history.push("/dashboard");
    let data = {
      email: this.state.email,
      password: this.state.password,
      // latitude: this.state.Location.latitude,
      // longitude: this.state.Location?.longitude,
      // currentAddress: response.data.display_name,
    };
    await UserLogin(data)
      .then((res) => {
        this.setState({ Loader: false });
        let basicinfor = res?.user;
        this.setState({ UserCredential: basicinfor });
        let CheckMaster = res?.user?.rolename?.roleName == "MASTER";
        if (CheckMaster) {
          // localStorage.setItem("userData", JSON.stringify(basicinfor));
          // this.context?.setUserInformatio(basicinfor);
          this.setState({ OtpScreen: true });
          // for testing

          // setTimeout(() => {
          //   this.props.history.push("/dashboard");
          // }, 1000);
          // for testing
        } else {
          (async () => {
            try {
              await ViewCompanyDetails(basicinfor?._id, basicinfor?.database)
                .then((res) => {
                  localStorage.setItem(
                    "Companydetail",
                    JSON.stringify(res?.CompanyDetail)
                  );
                  this.context?.setCompanyDetails(res?.CompanyDetail);
                })
                .catch((err) => {
                  console.log(err);
                });
            } catch (error) {
              console.error("Error fetching data:", error);
            }
          })();
          localStorage.setItem("userData", JSON.stringify(basicinfor));
          localStorage.setItem("loginTime", Date.now());
          this.context?.setUserInformatio(basicinfor);

          swal(
            "Success",
            "You are LoggedIn!",
            "success",

            {
              buttons: {
                ok: { text: "Ok", value: "ok" },
              },
            }
          ).then((value) => {
            switch (value) {
              case "ok":
                break;
              default:
            }
          });
          setTimeout(() => {
            this.props.history.push("/dashboard");
          }, 1000);
        }
      })
      .catch((err) => {
        this.setState({ Loader: false });

        if (err.response?.data.message == "Incorrect password") {
          swal({
            title: "Some Error Occurred",
            text: `Incorrect Password`,
            icon: "warning",
            dangerMode: false,
          });
        } else if (err.response?.data.message == "Incorrect Email") {
          // swal("Error", "Please Enter Correct Password");
          swal({
            title: "Some Error Occurred",
            text: `Incorrect Email`,
            icon: "warning",
            dangerMode: false,
          });
        } else {
          swal({
            title: "Please Enter Correct Username",
            text: `Incorrect username`,
            icon: "warning",
            dangerMode: false,
          });
        }
      });
    // console.log(this.state.Location);
    // if (this.state.Location.latitude && this.state.Location?.longitude) {
    //   try {
    //     const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${this.state.Location.latitude}&lon=${this.state.Location?.longitude}`;
    //     const response = await axios.get(apiUrl);
    //     // console.log(response);
    //     if (response.data.display_name) {
    //       // setAddress(response.data.display_name);
    //       let data = {
    //         email: this.state.email,
    //         password: this.state.password,
    //         latitude: this.state.Location.latitude,
    //         longitude: this.state.Location?.longitude,
    //         currentAddress: response.data.display_name,
    //       };
    //       await UserLogin(data)
    //         .then((res) => {
    //           let basicinfor = res?.user;
    //           localStorage.setItem("userData", JSON.stringify(basicinfor));
    //           this.context?.setUserInformatio(basicinfor);

    //           swal(
    //             "Sucessfully login",
    //             "You are LoggedIn!",
    //             "Success",

    //             {
    //               buttons: {
    //                 ok: { text: "Ok", value: "ok" },
    //               },
    //             }
    //           ).then((value) => {
    //             switch (value) {
    //               case "ok":
    //                 break;
    //               default:
    //             }
    //           });
    //           setTimeout(() => {
    //             this.props.history.push("/dashboard");
    //           }, 2000);
    //         })
    //         .catch((err) => {
    //           console.log(err.response?.data.message);

    //           if (err.response?.data.message == "Incorrect password") {
    //             swal({
    //               title: "Some Error Occurred",
    //               text: `Incorrect Password`,
    //               icon: "warning",
    //               dangerMode: false,
    //             });
    //           } else if (err.response?.data.message == "Incorrect Email") {
    //             // swal("Error", "Please Enter Correct Password");
    //             swal({
    //               title: "Some Error Occurred",
    //               text: `Incorrect Email`,
    //               icon: "warning",
    //               dangerMode: false,
    //             });
    //           } else {
    //             swal({
    //               title: "Please Enter Correct Username",
    //               text: `Incorrect username`,
    //               icon: "warning",
    //               dangerMode: false,
    //             });
    //           }
    //         });
    //     } else {
    //       // setAddress("No address found");
    //     }
    //   } catch (error) {
    //     console.error("Error fetching geo-Location data:", error);
    //   }
    // } else {
    //   swal("Please Give Persmission of your Current Location");
    // }

    // const fromdata = new FormData();
    // fromdata.append("username", this.state.email);
    // fromdata.append("password", this.state.password);
    // axiosConfig
    //   .post("/usersign", fromdata)
    //   .then((response) => {
    //     let msg = response.data?.success;
    //     if (msg) {
    //       localStorage.setItem("userData", JSON.stringify(response.data?.data));
    //       setTimeout(() => {
    //         this.props.history.push("/dashboard");
    //       }, 2000);
    //       swal(
    //         "Sucessfully login",
    //         "You are LoggedIn!",
    //         "Success",

    //         {
    //           buttons: {
    //             ok: { text: "Ok", value: "ok" },
    //           },
    //         }
    //       ).then((value) => {
    //         switch (value) {
    //           case "ok":
    //             break;
    //           default:
    //         }
    //       });
    //     }
    //   })
    //   .catch((error) => {
    //     let msg = error.response?.data.success;
    //     if (!msg) {
    //       swal("Error", "Invalid Username or Password");
    //     }
    //   });
  };
  changepassword = (e) => {
    e.preventDefault();
    let formdata = new FormData();
    formdata.append("email", this.state.email);
    formdata.append("base_url", "this.state.password");
    axiosConfig
      .post("/forgetPasswordEmailVerify", formdata)
      .then((res) => {
        console.log(res);
        this.setState({ resetpassword: false });
        swal("Email has been sent to Your Mail id", "Please Check and verify");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // handleChangeOTP = (otp) => {
  //   // console.log(otp);
  //   this.setState({ emailotp: otp });
  // };

  render() {
    const { UserCredential } = this.state;
    return (
      <Container>
        <Row className="m-0 justify-content-center">
          <Col
            sm="5"
            xl="5"
            lg="5"
            md="5"
            className="d-flex justify-content-center">
            <Card className="bg-authentication login-card rounded-0 mb-0 w-100">
              <Row className="m-0">
                <Col lg="12" md="12" className="p-1">
                  <Card className="rounded-0 mb-0 px-2 login-tabs-container">
                    <div className="logo-box text-center p-2">
                      <img
                        src={logo}
                        alt="loginImg"
                        width="100%"
                        height="110px"
                      />
                    </div>

                    {this.state.resetpassword ? (
                      <>
                        <CardHeader className="pb-1">
                          <CardTitle>
                            <h4 className="mb-0">
                              <strong>Email Verification</strong>
                            </h4>
                          </CardTitle>
                        </CardHeader>
                        <p className="px-2 auth-title mb-2">
                          Welcome , Please Enter details.
                        </p>
                        <Form onSubmit={this.changepassword}>
                          <Label>Email</Label>
                          <FormGroup className="form-label-group position-relative has-icon-left">
                            <Input
                              type="text"
                              name="email"
                              placeholder="Username"
                              value={this.state.email}
                              onChange={this.handlechange}
                              // required
                            />
                          </FormGroup>
                          <div className="d-flex justify-content-center">
                            <Button.Ripple color="primary" type="submit">
                              Submit
                            </Button.Ripple>
                          </div>
                        </Form>
                      </>
                    ) : (
                      <>
                        <>
                          {this.state.OtpScreen && this.state.OtpScreen ? (
                            <>
                              <CardHeader className="">
                                <CardTitle>
                                  <h4 className="mb-0">
                                    <strong>Login</strong>
                                  </h4>
                                </CardTitle>
                              </CardHeader>
                              <p className="px-2 auth-title">
                                Welcome , Enter OTP to Login your Account.
                              </p>
                              {/* <p className="px-2 auth-title">
                                {this.state.Error}{" "}
                                {
                                  (this.state.Location.latitude,
                                  this.state.Location.longitude,
                                  this.state.Location.timestamp)
                                }
                              </p> */}
                              <Form onSubmit={this.loginOTPHandler}>
                                <div className="d-flex justify-content-center">
                                  <h4 className="px-2 auth-title">
                                    Enter Email OTP
                                  </h4>
                                </div>
                                <div className=" d-flex justify-content-center">
                                  {this.state.OtpScreen && (
                                    <>
                                      <OtpInput
                                        containerStyle="true inputdata"
                                        inputStyle="true inputdataone"
                                        className="otpinputtype"
                                        value={this.state.emailotp}
                                        name="emailotp"
                                        onChange={(otp) =>
                                          this.setState({ emailotp: otp })
                                        }
                                        numInputs={4}
                                        renderSeparator={<span>-</span>}
                                        renderInput={(props) => (
                                          <input
                                            className="inputs"
                                            {...props}
                                          />
                                        )}
                                      />
                                    </>
                                  )}
                                </div>

                                <div className="d-flex justify-content-center">
                                  {/* <Button.Ripple
                                    color="primary"
                                    outline
                                    onClick={(e) => {
                                      e.preventDefault();
                                      this.setState({ resetpassword: true });
                                    }}
                                    // onClick={() => {
                                    //   history.push("/pages/reset-password");
                                    // }}
                                  >
                                    Forget Password
                                  </Button.Ripple> */}
                                  <Button.Ripple
                                    width="80%"
                                    color="primary"
                                    type="submit">
                                    Submit
                                  </Button.Ripple>
                                  <TabContent activeTab={this.state.activeTab}>
                                    <TabPane tabId="1">
                                      <LoginJWT />
                                    </TabPane>
                                    <TabPane tabId="2">
                                      <LoginFirebase />
                                    </TabPane>
                                  </TabContent>
                                </div>
                              </Form>
                            </>
                          ) : (
                            <>
                              <CardHeader
                                style={{
                                  justifyContent: "center",
                                  display: "flex",
                                  marginTop: "-20px",
                                }}>
                                <CardTitle>
                                  <h4 className="mb-0 text-center">Login</h4>
                                </CardTitle>
                              </CardHeader>
                              <div
                                style={{
                                  justifyContent: "center",
                                  display: "flex",
                                }}>
                                <p className=" auth-title mb-2 cssformobileveiwcrm">
                                  Welcome Back, Please Login to Your Account.
                                </p>
                              </div>
                              {this.state.Loader && this.state.Loader ? (
                                <>
                                  <div className="maindivLogin">
                                    <div class="colorful"></div>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <Form onSubmit={this.loginHandler}>
                                    {/* <Label>UserName</Label> */}
                                    <Label style={{ marginBottom: "5px" }}>
                                      User Name
                                    </Label>
                                    <FormGroup className="form-label-group position-relative ">
                                      {/* <InputGroupAddon addonType="prepend">
                                  Password
                                  </InputGroupAddon> */}
                                      <InputGroup>
                                        <Input
                                          style={{ border: "none" }}
                                          type="text"
                                          name="email"
                                          placeholder="User Name"
                                          value={this.state.email}
                                          onChange={this.handlechange}
                                          required
                                        />
                                      </InputGroup>
                                    </FormGroup>

                                    {/* <Label>Password</Label> */}
                                    <Label style={{ marginBottom: "5px" }}>
                                      Password
                                    </Label>
                                    <FormGroup className="passwordlogin form-label-group position-relative ">
                                      <InputGroup>
                                        {/*  <InputGroupAddon addonType="prepend">
                                       Password
                                </InputGroupAddon> */}
                                        <Input
                                          type={this.state.type}
                                          name="password"
                                          placeholder="Password"
                                          value={this.state.password}
                                          onChange={this.handlechange}
                                          required
                                        />
                                      </InputGroup>
                                      {/* <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                      Password
                                    </InputGroupAddon>
                                    <Input
                                      type={this.state.type}
                                      name="password"
                                      placeholder="Password"
                                      value={this.state.password}
                                      onChange={this.handlechange}
                                      required
                                    />
                                    <span
                                      className="eyeviewpassword"
                                      style={{
                                        position: "absolute",
                                        cursor: "pointer",
                                      }}
                                    >
                                      {this.state.type == "text" ? (
                                        <>
                                          {" "}
                                          <AiFillEyeInvisible
                                            onClick={() =>
                                              this.setState({
                                                type: "password",
                                              })
                                            }
                                            size="25px"
                                            color="blue"
                                          />
                                        </>
                                      ) : (
                                        <>
                                          <AiFillEye
                                            onClick={() =>
                                              this.setState({ type: "text" })
                                            }
                                            size="25px"
                                            color="blue"
                                          />
                                        </>
                                      )}
                                    </span>
                                  </InputGroup> */}
                                    </FormGroup>
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "right",
                                        marginTop: "-15px",
                                      }}>
                                      <Button
                                        style={{ border: "none" }}
                                        color="primary"
                                        outline
                                        onClick={(e) => {
                                          e.preventDefault();
                                          this.setState({
                                            resetpassword: true,
                                          });
                                        }}
                                        // onClick={() => {
                                        //   history.push("/pages/reset-password");
                                        // }}
                                      >
                                        Forget Password
                                      </Button>
                                    </div>

                                    <div
                                      style={{
                                        justifyContent: "center",
                                        display: "flex",
                                        marginTop: "20px",
                                      }}>
                                      {this.state.Loader &&
                                      this.state.Loader ? (
                                        <>
                                          <Button.Ripple
                                            width="80%"
                                            color="secondary">
                                            Loading...
                                          </Button.Ripple>
                                        </>
                                      ) : (
                                        <>
                                          <Button.Ripple
                                            width="80%"
                                            color="primary"
                                            type="submit">
                                            Login
                                          </Button.Ripple>
                                        </>
                                      )}
                                      <TabContent
                                        activeTab={this.state.activeTab}>
                                        <TabPane tabId="1">
                                          <LoginJWT />
                                        </TabPane>
                                        <TabPane tabId="2">
                                          <LoginFirebase />
                                        </TabPane>
                                      </TabContent>
                                    </div>
                                  </Form>
                                </>
                              )}
                            </>
                          )}
                        </>
                      </>
                    )}
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    values: state.auth.login,
  };
};
export default connect(mapStateToProps)(Login);
