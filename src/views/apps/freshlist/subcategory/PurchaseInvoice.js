import React, { useEffect, useState } from "react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";

// import POInVoice from "./POInVoice";
import POInvoiceone from "./POInvoiceone";
// import POInvoiceTwo from "./POInvoiceTwo";
// import PoinvoiceThree from "./PoinvoiceThree";

const PurchaseInvoice = (props) => {
  const [Printview, setPrintview] = useState({});
  const [AllCharges, setAllCharges] = useState({});
  const [details, setDetails] = useState([]);
  useEffect(() => {
    if (props?.PrintData) {
      setPrintview(props?.PrintData);
    }
  }, []);

  return (
    <div>
      <PDFViewer width="1000" height="800">
        {/* {props?.CompanyDetails?.BillNumber == undefined && (
          <POInVoice
            invoiceData={Printview}
            BilData={props}
            tableList={details}
            AllCharges={AllCharges}
            fileName="invoice1.pdf"
          />
        )} */}

        {/* {props?.CompanyDetails?.BillNumber == 1 && (
          <POInvoiceTwo
            invoiceData={Printview}
            BilData={props}
            tableList={details}
            AllCharges={AllCharges}
            fileName="invoice2.pdf"
          />
        )} */}
        {/* {props?.CompanyDetails?.BillNumber == 2 && (
          <PoinvoiceThree
            invoiceData={Printview}
            BilData={props}
            tableList={details}
            AllCharges={AllCharges}
            fileName="invoice3.pdf"
          />
        )} */}
        {/* {props?.CompanyDetails?.BillNumber == 3 && ( */}
        <POInvoiceone
          invoiceData={Printview}
          BilData={props}
          tableList={details}
          AllCharges={AllCharges}
          fileName="invoice4.pdf"
        />
        {/* )} */}
        {/* {props?.CompanyDetails?.BillNumber == 4 && (
          <POInVoice
            invoiceData={Printview}
            BilData={props}
            tableList={details}
            AllCharges={AllCharges}
            fileName="invoice5.pdf"
          />
        )} */}
      </PDFViewer>
    </div>
  );
};

export default PurchaseInvoice;
