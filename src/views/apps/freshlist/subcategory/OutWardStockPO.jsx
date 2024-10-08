import React, { useEffect, useState, useContext } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import InvoiceTemplate from "./InvoiceTemplate";
import ReactPDF from "@react-pdf/renderer";
import POInVoice from "./OutwardPoInvoice";
import axiosConfig from "../../../../axiosConfig";
import { ToWords } from "to-words";
import UserContext from "../../../../context/Context";

const toWords = new ToWords({
  localeCode: "en-IN",
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    currencyOptions: {
      // can be used to override defaults for the selected locale
      name: "Rupee",
      plural: "Rupees",
      symbol: "₹",
      fractionalUnit: {
        name: "Paisa",
        plural: "Paise",
        symbol: "",
      },
    },
  },
});

const StockTrxInvoice = (props) => {
  console.log(props);
  const [Printview, setPrintview] = useState({});
  const [AllCharges, setAllCharges] = useState({});
  const [UserChoice, setUserChoice] = useState({});
  const [details, setDetails] = useState([]);
  const [word, setword] = useState("");

  const Alldata = useContext(UserContext);
  useEffect(() => {
    console.log(props);
    console.log(Alldata);
    let userchoice = JSON.parse(localStorage.getItem("billUI"));
    if (userchoice) {
      setUserChoice(userchoice);
    } else {
      let choice = { imagePosition: "Left", billTo: "Left", shipto: "right" };
      setUserChoice(choice);
    }

    setDetails(props?.ViewOneData.productItems);
    const toWords = new ToWords();
    let word = toWords.convert(Number(props?.ViewOneData?.grandTotal), {
      currency: true,
    });
    setword(word);
  }, []);

  return (
    <div>
      {/* {/ Use PDFViewer to preview the generated PDF /} */}
      <PDFViewer width="1000" height="800">
        <POInVoice
          UserChoice={UserChoice}
          invoiceData={Printview}
          CurrentWords={word}
          BilData={props}
          AllData={Alldata}
          tableList={details}
          AllCharges={AllCharges}
          fileName="invoice.pdf"
        />
      </PDFViewer>
    </div>
  );
};

export default StockTrxInvoice;
