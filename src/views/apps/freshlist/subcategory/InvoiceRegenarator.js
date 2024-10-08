// InvoiceRegenarator.js
import React, { useEffect, useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import InvoiceTemplate from "./InvoiceTemplate";
import ReactPDF from "@react-pdf/renderer";
import POInVoice from "./InvoiceRegeTemp";
// import POInVoice from "./POInVoice";
import axiosConfig from "../../../../axiosConfig";
const InvoiceRegenarator = (props) => {
  const [Printview, setPrintview] = useState({});
  const [AllCharges, setAllCharges] = useState({});
  const [details, setDetails] = useState([]);

  useEffect(() => {
  
    console.log(props);

    setDetails(props?.AllbillMerged);
    setAllCharges(props?.Applied_Charges);
   

    if (props?.PrintData) {
      console.log(props?.PrintData);
      setPrintview(props?.PrintData);
    }
  }, []);

  return (
    <div>
      {/* {/ Use PDFViewer to preview the generated PDF /} */}
      <PDFViewer width="1000" height="800">
        <POInVoice
          invoiceData={Printview}
          CurrentWords={props.wordsNumber}
          BilData={props}
          tableList={details}
          AllCharges={AllCharges}
          fileName="invoice.pdf"
        />
      </PDFViewer>
    </div>
  );
};

export default InvoiceRegenarator;
