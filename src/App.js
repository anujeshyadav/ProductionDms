import React, { useEffect } from "react";
import Router from "./Router";
import "./components/@vuexy/rippleButton/RippleButton";
import axiosConfig from "../src/axiosConfig";
import "react-perfect-scrollbar/dist/css/styles.css";
import "prismjs/themes/prism-tomorrow.css";

const App = (props) => {
  // let isLoggedInBefore = localStorage.getItem("userData");
  // let lastLoginTime = localStorage.getItem("loginTime");
  useEffect(() => {
    const isLoggedInBefore = localStorage.getItem("userData");
    const lastLoginTime = localStorage.getItem("loginTime");
    if (isLoggedInBefore) {
      const TWO_HOURS_MS = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
      const elapsedTime = Date.now() - parseInt(lastLoginTime, 10);

      if (elapsedTime < TWO_HOURS_MS) {
        //  setIsLoggedIn(true);
      } else {
        // Session expired, clear localStorage
        localStorage.clear();
        window.location.replace("/")
      }
    }
  }, []);

  // important function for token passing

  // const requestInterceptor = axiosConfig?.interceptors.request.use(
  //   (config) => {
  //     // Get the token from your authentication mechanism (e.g., localStorage)
  //     let token = JSON.parse(localStorage.getItem("userData"))?.token;

  //     // If a token exists, add it to the request headers
  //     if (token) {
  //       config.headers.Authorization = `Bearer ${token}`;
  //     }

  //     return config;
  //   },
  //   (error) => {
  //     // Handle request error
  //     return Promise.reject(error);
  //   }
  // );
  // const responseInterceptor = axiosConfig?.interceptors.response.use(
  //   (config) => {
  //     // Get the token from your authentication mechanism (e.g., localStorage)
  //     let token = JSON.parse(localStorage.getItem("userData"))?.token;

  //     // If a token exists, add it to the request headers
  //     if (token) {
  //       config.headers.Authorization = `Bearer ${token}`;
  //     }

  //     return config;
  //   },
  //   (error) => {
  //     // Handle request error
  //     return Promise.reject(error);
  //   }
  // );

  return <Router />;
};

export default App;
