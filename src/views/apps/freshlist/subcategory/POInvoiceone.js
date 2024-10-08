import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Rect,
} from "@react-pdf/renderer";

import logo from "../../../../assets/img/logo/logowithoutback.png";
import signature from "../../../../assets/img/logo/signature.png";
import { Image_URL } from "../../../../ApiEndPoint/Api";
import GstCalculation from "./GstCalculation";
import InvoiceCharges from "./InvoiceCharges";
import PartyData from "./PartyDataUi";
import TransporterDetails from "./TransporterDetails";
import SalesProductList from "./SalesProductList";
import TermsConditionWords from "./TermsConditionWords";
import cancelimage from "../../../../assets/img/cancelledOrder.jpg";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    padding: 30,
    backgroundColor: "#e2f9ff4a",
  },
  watermark: {
    position: "absolute",
    top: "30%",
    left: "25%",
    transform: "translate(-30%, -30%) rotate(-18deg)",
    opacity: 0.3, // Set opacity to make it a watermark
    zIndex: -1, // Ensure it's behind the content
    width: "400px", // Set width based on your requirement
    height: "380px", // Adjust the height as needed
  },
  header: {
    fontSize: "8px",
    marginTop: "1px",
    marginBottom: "2px",
  },
  GSTIN: {
    fontSize: "10px",
    fontWeight: "bold",
    marginTop: "1px",
    marginBottom: "2px",
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
  },
  customername: {
    fontSize: 14,
    marginBottom: 8,
  },
  image: {
    width: 70,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  item: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    padding: 5,
  },
  itemName: {
    flex: 1,
  },
  itemQuantity: {
    flex: 1,
  },
  itemPrice: {
    flex: 1,
  },
  total: {
    marginTop: 20,
    fontSize: 15,
  },
});

const POInvoiceone = ({ invoiceData, BilData }) => {

  const curentDate = new Date();
  console.log(curentDate.toTimeString().split(" ")[0]);
  let day = curentDate.getDate();
  let month = curentDate.getMonth() + 1;
  let year = curentDate.getFullYear();
  let currentDate = `${day}-${month}-${year}`;
  // fixed;
  return (
    <>
      <Document>
        <Page size="A4" style={styles.page}>
          {BilData?.PrintData?.canceledInvoice && (
            <Image src={cancelimage} style={styles.watermark} />
          )}
          {invoiceData?.ARNStatus && (
            <>
              <Text
                style={{
                  fontSize: "8px",
                }}>
                ARN : {invoiceData?.ARN}
              </Text>
            </>
          )}
          <View>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  border: "1px solid black",
                  height: "110px",
                }}>
                {!!BilData?.PrintData?.purchaseStatus &&
                BilData?.PrintData?.purchaseStatus ? (
                  <>
                    {BilData?.CompanyDetails?.logo &&
                    BilData?.CompanyDetails?.logo ? (
                      <>
                        <Image
                          style={{ width: "230px", padding: "25px 10px" }}
                          src={`${Image_URL}/Images/${BilData?.CompanyDetails?.logo}`}></Image>
                      </>
                    ) : (
                      <>
                        <Image
                          style={{ width: "230px", padding: "25px 10px" }}
                          src={logo}></Image>
                      </>
                    )}
                    <View style={{ padding: "10px" }}>
                      <PartyData invoiceData={invoiceData} BilData={BilData} />
                    </View>
                  </>
                ) : (
                  <>
                    {BilData?.CompanyDetails?.imagePosition &&
                    BilData?.CompanyDetails?.imagePosition == "Left" ? (
                      <>
                        {BilData?.CompanyDetails?.logo &&
                        BilData?.CompanyDetails?.logo ? (
                          <>
                            <Image
                              style={{ width: "230px", padding: "25px 10px" }}
                              src={`${Image_URL}/Images/${BilData?.CompanyDetails?.logo}`}></Image>
                          </>
                        ) : (
                          <>
                            <Image
                              style={{ width: "230px", padding: "25px 10px" }}
                              src={logo}></Image>
                          </>
                        )}

                        <View style={{ padding: "10px" }}>
                          <Text
                            style={{ fontSize: "13px", fontWeight: "bold" }}>
                            {BilData?.CompanyDetails?.name &&
                              BilData?.CompanyDetails?.name}
                          </Text>

                          <Text
                            style={{
                              fontSize: "8px",
                              marginTop: "5px",
                              marginBottom: "2px",
                              width: "55%",
                            }}>
                            {BilData?.CompanyDetails?.address &&
                              BilData?.CompanyDetails?.address}
                          </Text>
                          <Text style={styles.header}></Text>
                          <Text style={styles.header}>
                            Email :
                            {BilData?.CompanyDetails?.email &&
                              BilData?.CompanyDetails?.email}
                          </Text>
                          <Text style={styles.header}>
                            MobileNo :
                            {BilData?.CompanyDetails?.mobileNo &&
                              BilData?.CompanyDetails?.mobileNo}
                          </Text>
                          <Text style={styles.GSTIN}>
                            GSTIN :
                            {BilData?.CompanyDetails?.gstNo &&
                              BilData?.CompanyDetails?.gstNo}
                          </Text>
                          <Text style={styles.GSTIN}>
                            {`BankName :${
                              BilData?.CompanyDetails?.bankName &&
                              BilData?.CompanyDetails?.bankName
                            } 
                         Bank IFSC : :${
                           BilData?.CompanyDetails?.bankIFSC &&
                           BilData?.CompanyDetails?.bankIFSC
                         }
                         AccountNumber : :${
                           BilData?.CompanyDetails?.accountNumber &&
                           BilData?.CompanyDetails?.accountNumber
                         } `}
                          </Text>
                        </View>
                      </>
                    ) : (
                      <>
                        <View style={{ padding: "10px" }}>
                          <Text
                            style={{ fontSize: "13px", fontWeight: "bold" }}>
                            {BilData?.CompanyDetails?.name &&
                              BilData?.CompanyDetails?.name}
                          </Text>

                          <Text
                            style={{
                              fontSize: "8px",
                              marginTop: "5px",
                              marginBottom: "2px",
                              width: "55%",
                            }}>
                            {BilData?.CompanyDetails?.address &&
                              BilData?.CompanyDetails?.address}
                          </Text>
                          <Text style={styles.header}></Text>
                          <Text style={styles.header}>
                            Email :
                            {BilData?.CompanyDetails?.email &&
                              BilData?.CompanyDetails?.email}
                          </Text>
                          <Text style={styles.header}>
                            MobileNo :
                            {BilData?.CompanyDetails?.mobileNo &&
                              BilData?.CompanyDetails?.mobileNo}
                          </Text>
                          <Text style={styles.GSTIN}>
                            GSTIN :
                            {BilData?.CompanyDetails?.gstNo &&
                              BilData?.CompanyDetails?.gstNo}
                          </Text>
                          <Text style={styles.GSTIN}>
                            {`BankName :${
                              BilData?.CompanyDetails?.bankName &&
                              BilData?.CompanyDetails?.bankName
                            } 
                         Bank IFSC : :${
                           BilData?.CompanyDetails?.bankIFSC &&
                           BilData?.CompanyDetails?.bankIFSC
                         }
                         AccountNumber : :${
                           BilData?.CompanyDetails?.accountNumber &&
                           BilData?.CompanyDetails?.accountNumber
                         } `}
                          </Text>
                        </View>
                        {BilData?.CompanyDetails?.logo &&
                        BilData?.CompanyDetails?.logo ? (
                          <>
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "flex-end",
                                alignItems: "flex-end",
                              }}>
                              <Image
                                style={{ width: "230px", padding: "25px 10px" }}
                                src={`${Image_URL}/Images/${BilData?.CompanyDetails?.logo}`}></Image>
                            </View>
                          </>
                        ) : (
                          <>
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "flex-end",
                                alignItems: "flex-end",
                              }}>
                              <Image
                                style={{ width: "230px", padding: "25px 10px" }}
                                src={logo}></Image>
                            </View>
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </View>
              {/* <View
              style={{
                flexDirection: "row",
                borderBottom: "1px solid black",
                borderRight: "1px solid black",
                borderLeft: "1px solid black",
                height: "70px",
              }}>
              <View style={{ padding: "10px", width: "50%" }}>
                <View style={{ flexDirection: "row", paddingBottom: "3px" }}>
                  <Text
                    style={{
                      fontSize: "10px",
                      fontWeight: "bold",
                      width: "50%",
                    }}>
                    Place of Supply
                  </Text>{" "}
                  <Text style={{ fontSize: "10px", fontWeight: "bold" }}>
                    : {invoiceData?.city}
                  </Text>
                </View>
              </View>
            </View> */}
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "#00c0ef",
                  borderBottom: "1px solid black",
                  borderRight: "1px solid black",
                  borderLeft: "1px solid black",
                  height: "20px",
                }}>
                <View
                  style={{
                    width: "33%",
                    padding: "2px 2px",
                    borderRight: "1px solid black",
                  }}>
                  <View style={{ flexDirection: "row", paddingBottom: "3px" }}>
                    {BilData?.CompanyDetails?.billTo == "Left" && (
                      <Text
                        style={{
                          fontSize: "10px",
                          fontWeight: "1000",
                          marginLeft: "5px",
                          width: "50%",
                        }}>
                        Bill To
                      </Text>
                    )}
                    {BilData?.CompanyDetails?.shipto == "Left" && (
                      <Text
                        style={{
                          fontSize: "10px",
                          fontWeight: "1000",
                          marginLeft: "5px",
                          width: "50%",
                        }}>
                        {!!BilData?.PrintData?.purchaseStatus &&
                        BilData?.PrintData?.purchaseStatus
                          ? "Billed from"
                          : "Ship To"}
                      </Text>
                    )}
                  </View>
                </View>
                <View
                  style={{
                    padding: "2px",
                    width: "33%",
                    borderRight: "1px solid black",
                  }}>
                  <View style={{ flexDirection: "row", paddingBottom: "3px" }}>
                    {BilData?.CompanyDetails?.billTo == "right" && (
                      <Text
                        style={{
                          fontSize: "10px",
                          fontWeight: "1000",
                          marginLeft: "5px",
                          width: "50%",
                        }}>
                        Bill To
                      </Text>
                    )}
                    {BilData?.CompanyDetails?.shipto == "right" && (
                      <Text
                        style={{
                          fontSize: "10px",
                          fontWeight: "1000",
                          marginLeft: "5px",
                          width: "50%",
                        }}>
                        {!!BilData?.PrintData?.purchaseStatus &&
                        BilData?.PrintData?.purchaseStatus
                          ? "Billed from"
                          : "Ship To"}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={{ padding: "2px", width: "33%" }}>
                  <View style={{ flexDirection: "row", paddingBottom: "3px" }}>
                    <Text
                      style={{
                        fontSize: "10px",
                        fontWeight: "1000",
                        marginLeft: "5px",
                        width: "50%",
                      }}>
                      invoice Detail
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  borderBottom: "1px solid black",
                  borderRight: "1px solid black",
                  borderLeft: "1px solid black",
                  height: "140px",
                }}>
                <View
                  style={{
                    width: "33%",
                    padding: "10px 10px",
                    borderRight: "1px solid black",
                  }}>
                  {BilData?.CompanyDetails?.billTo == "Left" && (
                    <>
                      <View style={{ flexDirection: "", paddingBottom: "3px" }}>
                        <Text
                          style={{
                            fontSize: "13px",
                            fontWeight: "bold",
                          }}>
                          {BilData?.CompanyDetails?.name &&
                            BilData?.CompanyDetails?.name}
                        </Text>
                        <Text
                          style={{
                            fontSize: "8px",
                            marginTop: "5px",
                            marginBottom: "2px",
                            width: "55%",
                          }}>
                          {BilData?.CompanyDetails?.address &&
                            BilData?.CompanyDetails?.address}
                        </Text>
                        <Text style={styles.header}>
                          {BilData?.CompanyDetails?.email &&
                            BilData?.CompanyDetails?.email}
                        </Text>
                        <Text style={styles.header}>
                          {BilData?.CompanyDetails?.mobileNo &&
                            BilData?.CompanyDetails?.mobileNo}
                        </Text>
                      </View>
                    </>
                  )}
                  {/* {!!BilData?.PrintData?.purchaseStatus &&
                  BilData?.PrintData?.purchaseStatus ? (
                    <>
                      <PartyData invoiceData={invoiceData} BilData={BilData} />
                    </>
                  ) : (
                    <>
                      {BilData?.CompanyDetails?.shipto == "Left" && (
                        <>
                          {!!BilData?.PrintData?.purchaseStatus &&
                          BilData?.PrintData?.purchaseStatus ? (
                            <>
                              <PartyData
                                invoiceData={invoiceData}
                                BilData={BilData}
                              />
                            </>
                          ) : (
                            <>

                          <View
                            style={{ flexDirection: "", paddingBottom: "3px" }}>
                            <Text
                              style={{
                                fontSize: "13px",
                                fontWeight: "bold",
                              }}>
                              {`Name: ${BilData?.PrintData?.partyId?.CompanyName}`}
                            </Text>{" "}
                            <Text
                              style={{
                                fontSize: "10px",
                                width: "95%",
                                fontWeight: "bold",
                              }}>
                              {`Address: ${BilData?.PrintData?.partyId?.address1}
                           ${BilData?.PrintData?.partyId?.address2}
                        Mobile No.: ${BilData?.PrintData?.partyId?.contactNumber}
                       State.: ${BilData?.PrintData?.partyId?.State}
                        City.: ${BilData?.PrintData?.partyId?.City}`}
                            </Text>{" "}
                          </View>
                            </>
                          )}
                        </>
                      )}
                    </>
                  )} */}
                  {BilData?.CompanyDetails?.shipto == "Left" && (
                    <>
                      {!!BilData?.PrintData?.purchaseStatus &&
                      BilData?.PrintData?.purchaseStatus ? (
                        <>
                          <PartyData
                            invoiceData={invoiceData}
                            BilData={BilData}
                          />
                        </>
                      ) : (
                        <>
                          <View
                            style={{ flexDirection: "", paddingBottom: "3px" }}>
                            <Text
                              style={{
                                fontSize: "13px",
                                fontWeight: "bold",
                              }}>
                              {`Name: ${BilData?.PrintData?.partyId?.CompanyName}`}
                            </Text>{" "}
                            <Text
                              style={{
                                fontSize: "10px",
                                width: "95%",
                                fontWeight: "bold",
                              }}>
                              {`Address: ${BilData?.PrintData?.partyId?.address}
                        Mobile No.: ${BilData?.PrintData?.partyId?.contactNumber}
                       State.: ${BilData?.PrintData?.partyId?.State}
                        City.: ${BilData?.PrintData?.partyId?.City}`}
                            </Text>{" "}
                          </View>
                          {invoiceData?.ARNStatus && (
                            <>
                              <Text
                                style={{
                                  fontSize: "10px",
                                }}>
                                ARN : {invoiceData?.ARN}
                              </Text>
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                </View>

                <View
                  style={{
                    padding: "10px",
                    width: "33%",
                    borderRight: "1px solid black",
                  }}>
                  {BilData?.CompanyDetails?.billTo == "right" && (
                    <>
                      <View style={{ flexDirection: "", paddingBottom: "3px" }}>
                        <Text
                          style={{
                            fontSize: "13px",
                            fontWeight: "bold",
                          }}>
                          {BilData?.CompanyDetails?.name &&
                            BilData?.CompanyDetails?.name}
                        </Text>
                        <Text
                          style={{
                            fontSize: "8px",
                            marginTop: "5px",
                            marginBottom: "2px",
                            width: "55%",
                          }}>
                          {BilData?.CompanyDetails?.address &&
                            BilData?.CompanyDetails?.address}
                        </Text>
                        <Text style={styles.header}>
                          Email :
                          {BilData?.CompanyDetails?.email &&
                            BilData?.CompanyDetails?.email}
                        </Text>
                        <Text style={styles.header}>
                          MobileNo :
                          {BilData?.CompanyDetails?.mobileNo &&
                            BilData?.CompanyDetails?.mobileNo}
                        </Text>
                      </View>
                    </>
                  )}
                  {BilData?.CompanyDetails?.shipto == "right" && (
                    <>
                      {!!BilData?.PrintData?.purchaseStatus &&
                      BilData?.PrintData?.purchaseStatus ? (
                        <>
                          <PartyData
                            invoiceData={invoiceData}
                            BilData={BilData}
                          />
                        </>
                      ) : (
                        <>
                          <View
                            style={{
                              flexDirection: "",
                              paddingBottom: "3px",
                            }}>
                            <Text
                              style={{
                                fontSize: "13px",
                                fontWeight: "bold",
                              }}>
                              {`${BilData?.PrintData?.partyId?.CompanyName}`}
                            </Text>{" "}
                            <Text
                              style={{
                                fontSize: "10px",
                                width: "95%",
                                fontWeight: "bold",
                              }}>
                              {`${BilData?.PrintData?.partyId?.address}
                       ${BilData?.PrintData?.partyId?.contactNumber}
                      ${BilData?.PrintData?.partyId?.State}
                      ${BilData?.PrintData?.partyId?.City}`}
                            </Text>{" "}
                          </View>
                        </>
                      )}
                      {invoiceData?.ARNStatus && (
                        <>
                          <Text
                            style={{
                              fontSize: "10px",
                            }}>
                            ARN : {invoiceData?.ARN}
                          </Text>
                        </>
                      )}
                    </>
                  )}
                  {/* {!!BilData?.PrintData?.purchaseStatus &&
                  BilData?.PrintData?.purchaseStatus ? (
                    <>
                      <PartyData invoiceData={invoiceData} BilData={BilData} />
                    </>
                  ) : (
                    <>
                     
                    </>
                  )} */}
                </View>
                <View style={{ padding: "5px", width: "33%" }}>
                  <View
                    style={{
                      padding: "3px 3px",
                    }}>
                    <Text
                      style={{
                        fontSize: "10px",
                        fontWeight: "bold",
                      }}>
                      {invoiceData.DeliveryType == "Local" ? (
                        <>
                          <Text style={styles.header}>
                            Challan No:{" "}
                            {invoiceData?.orderNo && invoiceData?.orderNo}
                          </Text>
                        </>
                      ) : (
                        <>
                          {invoiceData?.status == "completed" ? (
                            <>
                              <Text style={styles.header}>
                                Invoice No:{" "}
                                {invoiceData?.invoiceId &&
                                  invoiceData?.invoiceId}
                              </Text>
                            </>
                          ) : (
                            <>
                              <Text style={styles.header}>
                                Challan No:{" "}
                                {invoiceData?.orderNo && invoiceData?.orderNo}
                              </Text>
                            </>
                          )}
                        </>
                      )}
                    </Text>
                    <Text
                      style={{
                        fontSize: "8px",
                        marginTop: "4px",
                        marginBottom: "2px",
                      }}>
                      Payment Note:{" "}
                      {invoiceData?.partyId?.paymentTerm &&
                        invoiceData?.partyId?.paymentTerm}
                    </Text>
                    {/* <Text style={styles.header}>
                      order No:
                      {invoiceData?._id && invoiceData?._id}
                    </Text> */}
                    <Text style={styles.header}>
                      Ledger Balance :
                      {BilData?.PrintData?.lastLedgerBalance &&
                        BilData?.PrintData?.lastLedgerBalance}
                    </Text>
                    <Text style={styles.header}>
                      Date :
                      {invoiceData?.date && invoiceData?.date?.split("T")[0]}
                    </Text>
                    <Text style={styles.header}>
                      SP Name :
                      {BilData?.PrintData?.userId?.firstName &&
                        `${BilData?.PrintData?.userId?.firstName}`}
                    </Text>
                  </View>
                  {invoiceData?.transporter && invoiceData?.transporter ? (
                    <View
                      style={{
                        height: "90px",
                      }}>
                      <TransporterDetails
                        invoiceData={invoiceData}
                        backGround="white"
                      />
                    </View>
                  ) : (
                    <View
                      style={{
                        height: "90px",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                      }}>
                      {/* <Text>by Vehicle</Text> */}
                    </View>
                  )}
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  // borderBottom: "1px solid black",
                  // borderRight: "1px solid black",
                  // borderLeft: "1px solid black",
                  // height: "20px",
                }}>
                {/* <View
                style={{
                  width: "50%",
                  padding: "2px 2px",
                  borderRight: "1px solid black",
                }}> */}
                {/* <View
                  style={{ flexDirection: "row", paddingBottom: "3px 3px" }}>
                  <Text
                    style={{
                      fontSize: "13px",
                      fontWeight: "1000",
                      padding: "12px 12px",

                      width: "90%",
                    }}>
                    Client Code : &nbsp; {invoiceData?.partyId?.firstName}{" "}
                    {invoiceData?.partyId?.lastName}
                  </Text>
                </View> */}
                {/* </View> */}

                {/* <View style={{ padding: "2px", width: "50%" }}>
                <View style={{ flexDirection: "row", paddingBottom: "3px" }}>
                  <Text
                    style={{
                      fontSize: "13px",
                      fontWeight: "1000",
                      padding: "12px 12px",
                      width: "80%",
                    }}>
                    User Code : &nbsp;
                  </Text>
                </View>
              </View> */}
              </View>

              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "#00c0ef",
                  borderBottom: "1px solid black",
                  borderRight: "1px solid black",
                  borderLeft: "1px solid black",
                  height: "23px",
                }}>
                <View
                  style={{
                    width: "3%",
                    padding: "5px 2px",
                    borderRight: "1px solid black",
                  }}>
                  <Text
                    style={{
                      fontSize: "10px",
                      color: "white",
                      fontWeight: "1000",
                      marginLeft: "5px",
                    }}>
                    #
                  </Text>
                </View>
                <View
                  style={{
                    width: "20%",
                    padding: "5px 2px",
                    flexDirection: "row",
                    justifyContent: "center",
                    borderRight: "1px solid black",
                  }}>
                  <Text
                    style={{
                      fontSize: "8px",
                      color: "white",
                      fontWeight: "1000",
                    }}>
                    Product Name
                  </Text>
                </View>
                <View
                  style={{
                    width: "10%",
                    padding: "5px 2px",
                    flexDirection: "row",
                    justifyContent: "center",
                    borderRight: "1px solid black",
                  }}>
                  <Text
                    style={{
                      fontSize: "8px",
                      color: "white",
                      fontWeight: "1000",
                    }}>
                    HSN / SAC
                  </Text>
                </View>

                <View
                  style={{
                    width: "10%",
                    flexDirection: "row",
                    justifyContent: "center",
                    padding: "5px 2px",
                    borderRight: "1px solid black",
                  }}>
                  <Text
                    style={{
                      fontSize: "10px",
                      color: "white",
                      fontWeight: "1000",
                    }}>
                    Qty
                  </Text>
                </View>
                <View
                  style={{
                    width: "15%",
                    flexDirection: "row",
                    justifyContent: "center",
                    padding: "5px 2px",
                    borderRight: "1px solid black",
                  }}>
                  <Text
                    style={{
                      fontSize: "10px",
                      color: "white",
                      fontWeight: "1000",
                    }}>
                    Unit
                  </Text>
                </View>
                <View
                  style={{
                    width: "15%",
                    flexDirection: "row",
                    justifyContent: "center",
                    padding: "5px 2px",
                    borderRight: "1px solid black",
                  }}>
                  <Text
                    style={{
                      fontSize: "10px",
                      color: "white",
                      fontWeight: "1000",
                    }}>
                    Price
                  </Text>
                </View>
                {/* <View
                  style={{
                    width: "8%",
                    flexDirection: "row",
                    justifyContent: "center",
                    padding: "5px 2px",
                    borderRight: "1px solid black",
                  }}
                >
                  <Text
                    style={{
                      fontSize: "10px",
                      color: "white",
                      fontWeight: "1000",
                    }}
                  >
                    Dis%
                  </Text>
                </View> */}
                {/* <View
                  style={{
                    width: "8%",
                    flexDirection: "row",
                    justifyContent: "center",
                    padding: "5px 2px",
                    borderRight: "1px solid black",
                  }}>
                  <Text
                    style={{
                      fontSize: "8px",
                      color: "black",
                      fontWeight: "1000",
                    }}>
                    GST
                  </Text>
                </View> */}

                {/* <View
                  style={{
                    width: "10%",
                    marginRight: "2px",
                    padding: "5px 2px",
                    borderRight: "1px solid black",
                  }}>
                  <Text
                    style={{
                      fontSize: "10px",
                      color: "black",
                      fontWeight: "1000",
                      marginLeft: "5px",
                    }}>
                    Size
                  </Text>
                </View> */}

                <View
                  style={{
                    width: "20%",
                    flexDirection: "row",
                    justifyContent: "center",
                    padding: "5px 2px",
                    borderRight: "1px solid black",
                  }}>
                  <Text
                    style={{
                      fontSize: "10px",
                      color: "white",
                      fontWeight: "1000",
                    }}>
                    Amount
                  </Text>
                </View>
              </View>
              <SalesProductList invoiceData={invoiceData} />

              <View
                style={{
                  flexDirection: "row",
                  borderRight: "1px solid black",
                  borderLeft: "1px solid black",
                  borderTop: "1px solid black",
                  borderBottom: "1px solid black",
                }}>
                <TermsConditionWords BilData={BilData} />

                <InvoiceCharges invoiceData={invoiceData} BilData={BilData} />
              </View>
            </View>

            <View>
              <GstCalculation invoiceData={invoiceData} />
            </View>
            {/* GST CALCULATON */}

            {/* GST CALCULATON */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",

                // alignItems: "flex-end",
              }}>
              <View
                style={{
                  padding: "3px 3px ",
                  height: "180px",
                  borderBottom: "1px solid black",
                  borderLeft: "1px solid black",
                  borderRight: "1px solid black",
                  width: "45%",
                }}>
                <Text style={{ fontSize: "11px" }}> For</Text>
                <Text
                  style={{
                    fontSize: "8px",
                    marginTop: "8px",
                    marginBottom: "8px",
                  }}>
                  {" "}
                  JUPITECH CORPORATE MANAGEMENT SERVICES PVT. LTD.
                </Text>
                <View>
                  <Image
                    style={{ height: "50px", marginTop: "15px" }}
                    src={signature}
                    width="200px"
                    height="200px"></Image>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    marginBottom: "2px",
                    marginTop: "20px",
                    justifyContent: "center",
                  }}>
                  <Text style={{ fontSize: "10px" }}>Authorized Signature</Text>
                </View>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    </>
  );
};

export default POInvoiceone;
