import React, { useEffect, useState, useContext } from "react";
import logo from "../../../../../assets/img/Untitled.png";
import sign from "../../../../../assets/img/signature.png";
import {
  Card,
  CardBody,
  CardHeader,
  Form,
  FormGroup,
  CustomInput,
  Label,
  Input,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

// import Invoicelogo from "./Invoicesections/Invoicelogo";
import Sallerdetail from "./Invoicesections/Sallerdetail";
import Invoiceiddetail from "./Invoicesections/Invoiceiddetail";
import Invoicebillto from "./Invoicesections/Invoicebillto";
import Invoiceshipto from "./Invoicesections/Invoiceshipto";
import Dispatchdetails from "./Invoicesections/Dispatchdetails";
import Invoicetable from "./Invoicesections/Invoicetable";
import InvoiceConditions from "./Invoicesections/InvoiceConditions";
import InvoiceGrandtotal from "./Invoicesections/InvoiceGrandtotal";
import Incoicehsntable from "./Invoicesections/Incoicehsntable";
import Invoicesignature from "./Invoicesections/Invoicesignature";
import Invoicebankdetail from "./Invoicesections/Invoicebankdetail";
import {
  ViewCompanyDetails,
  _Get,
} from "../../../../../ApiEndPoint/ApiCalling";
import { Purchase_Invoice } from "../../../../../ApiEndPoint/Api";

const Invoicenew = props => {
  const [allData, setallData] = useState([]);
  const [modal, setModal] = useState(true);
  useEffect(() => {
    let pageparmission = JSON.parse(localStorage.getItem("userData"));
    // if (pageparmission?.rolename?.roleName === "MASTER") {

    //   // this.setState({ MasterShow: true });
    // }
    Apicalling(pageparmission?._id, pageparmission?.database);

    ViewCompanyDetails(pageparmission?._id, pageparmission?.database)
      .then(res => {
        console.log(res?.CompanyDetail);
        // this.setState({ CompanyDetails: res?.CompanyDetail });
      })
      .catch(err => {
        console.log(err);
      });
    console.log("object");
  }, []);

  const Apicalling = (id, db) => {
    // this.setState({ Loading: true });

    _Get(Purchase_Invoice, db)
      .then(res => {
        // this.setState({ Loading: false });

        console.log("rowData", res?.Invoice);
        // this.setState({ rowData: res?.Invoice?.reverse() });
        // this.setState({ AllcolumnDefs: this.state.columnDefs });

        // let userHeading = JSON.parse(
        //   localStorage.getItem("PurchaseInvoiceList")
        // );
        // if (userHeading?.length) {
        //   this.setState({ columnDefs: userHeading });
        //   // this.gridApi.setColumnDefs(userHeading);
        //   this.setState({ SelectedcolumnDefs: userHeading });
        // } else {
        //   this.setState({ columnDefs: this.state.columnDefs });
        //   this.setState({ SelectedcolumnDefs: this.state.columnDefs });
        // }
        // this.setState({ SelectedCols: this.state.columnDefs });
      })
      .catch(err => {
        // this.setState({ Loading: false });
        // this.setState({ rowData: [] });

        console.log(err);
      });
  };
  const toggle = () => setModal(!modal);
  return (
    <>
      <div>
        <Modal isOpen={modal} toggle={toggle} size="xl">
          <ModalHeader toggle={toggle}>Invoice Bill</ModalHeader>
          <ModalBody>
            <div>
              <div className="borderinvoice">
                <div className="row ">
                  <div className="col-lg-3 col-xl-3 col-md-3 col-xs-3 sallerdetailborder1 ">
                    <div>
                      <Sallerdetail />
                    </div>
                  </div>
                  <div className="col-lg-3 col-xl-3 col-md-3 col-xs-3 sallerdetailborder">
                    <div className="text-center">
                      <div className="container-fluid">
                        <img src={logo} className="logoinvoicecss" alt="54" />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-xl-6 col-md-6 col-xs-6 sallerdetailborder1">
                    <div>
                      <Invoiceiddetail />
                    </div>
                  </div>
                </div>
              </div>
              <div className="borderinvoice1 ">
                <div className="row ">
                  <div className="col-lg-3 col-xl-3 col-md-3 col-xs-3 sallerdetailborder01  ">
                    <div>
                      <Invoicebillto />
                    </div>
                  </div>
                  <div className="col-lg-3 col-xl-3 col-md-3 col-xs-3 sallerdetailborder0 ">
                    <div className="">
                      <Invoiceshipto />
                    </div>
                  </div>
                  <div className="col-lg-6 col-xl-6 col-md-6 col-xs-6 sallerdetailborder01 ">
                    <div>
                      <Dispatchdetails />
                    </div>
                    <div></div>
                  </div>
                </div>
              </div>
              <div>
                <Invoicetable />
              </div>

              <div className="borderinvoice " style={{ marginTop: "-14px" }}>
                <div className="row ">
                  <div className="col-lg-6 col-xl-6 col-md-6 col-xs-6 sallerdetailborder">
                    <div>
                      <InvoiceConditions />
                    </div>
                  </div>
                  <div className="col-lg-6 col-xl-6 col-md-6 col-xs-6 sallerdetailborder1">
                    <div className="p-1">
                      <InvoiceGrandtotal />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <Incoicehsntable />
              </div>
              <div className="borderinvoice " style={{ marginTop: "-14px" }}>
                <div className="row ">
                  <div className="col-lg-6 col-xl-6 col-md-6 col-xs-6 sallerdetailborder">
                    <div>
                      <Invoicebankdetail />
                    </div>
                  </div>
                  <div className="col-lg-6 col-xl-6 col-md-6 col-xs-6 sallerdetailborder1">
                    <div className="p-1">
                      <Invoicesignature />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    </>
  );
};

export default Invoicenew;
