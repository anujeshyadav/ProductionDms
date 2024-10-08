import React, { useEffect, useState } from "react";
import UserContext from "./Context";
import {
  _Get,
  CreateAccountView,
  CurrencyConvertor,
  ViewCompanyDetails,
} from "../ApiEndPoint/ApiCalling";
import { View_CustomerGroup } from "../ApiEndPoint/Api";

const State = (props) => {
  const [crateUserXmlView, setcreateUserXmlView] = useState({});
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [CompanyDetails, setCompanyDetails] = useState({});
    const [Mode, setMode] = useState("semi-dark");

    const [PartsCatalougueCart, setPartsCatalougueCart] = useState([]);
    const [UserInformatio, setUserInformatio] = useState({});
    const [PartsCatloguelength, setPartsCatloguelength] = useState(0);
    const [Currencyconvert, setCurrencyconvert] = useState("");
    const [myCustomColor, SetmyCustomColor] = useState("");
    const [PresentCurrency, setPresentCurrency] = useState("USD_$");
    const [Userlanguage, setUserlanguage] = useState(navigator.language);

    let user = JSON.parse(localStorage.getItem("userData"));
    useEffect(() => {
      const handleOnline = () => {
        setIsOnline(true);
      };

      const handleOffline = () => {
        swal("Error", "You Lost Internet connectivity", "error");
        setIsOnline(false);
      };

      // Add event listeners for detecting network changes
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      // Cleanup event listeners on unmount
      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }, []);
  useEffect(() => {
    let myCustomColor = localStorage.getItem("UserDefinedcoler");
    SetmyCustomColor(myCustomColor);
    // document.body.style.backgroundColor = myCustomColor;
  }, [myCustomColor]);

  useEffect(() => {
    (async () => {
      await ViewCompanyDetails(user?._id, user?.database)
        .then((res) => {
          setCompanyDetails(res?.CompanyDetail);
        })
        .catch((err) => {
          console.log(err);
        });
    })();
    //
  }, []);

  useEffect(() => {
    const isLoggedInBefore = localStorage.getItem("userData");
  
    const lastLoginTime = localStorage.getItem("loginTime");
    if (isLoggedInBefore) {
      const TWO_HOURS_MS = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
      const elapsedTime = Date.now() - parseInt(lastLoginTime, 10);

      if (elapsedTime < TWO_HOURS_MS) {
      } else {
        localStorage.clear();
         window.location.replace("/");
      }
    }
  }, []);

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("userData"));

    setUserlanguage(user?.locale);
    setUserInformatio(user);
    // console.log(user?.currency?.split("_")[0]);
    let currency = user?.currency;

    if (currency == undefined) {
      currency = "USD_$";
    }
    CurrencyConvertor(currency?.split("_")[0])
      .then((res) => {
        let fromRate = res?.rates[PresentCurrency.split("_")[0]];
        let toRate = res?.rates[currency?.split("_")[0]];
        const value = toRate / fromRate;
        setCurrencyconvert(value);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user?.currency]);

  return (
    <UserContext.Provider
      value={{
        CompanyDetails,
        setCompanyDetails,
        myCustomColor,
        SetmyCustomColor,
        Currencyconvert,
        Userlanguage,
        setUserlanguage,
        setCurrencyconvert,
        setPresentCurrency,
        PresentCurrency,
        crateUserXmlView,
        setMode,
        Mode,
        setPartsCatalougueCart,
        PartsCatalougueCart,
        setUserInformatio,
        setPartsCatloguelength,
        PartsCatloguelength,
        UserInformatio,
      }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default State;
