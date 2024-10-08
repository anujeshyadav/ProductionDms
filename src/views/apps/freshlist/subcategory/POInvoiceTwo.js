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
import InvoiceCharges from "./InvoiceCharges";
import GstCalculation from "./GstCalculation";
import TermsConditionWords from "./TermsConditionWords";
import TransporterDetails from "./TransporterDetails";
import SalesProductList from "./SalesProductList";
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
    fontSize: "8px",
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
  let day = curentDate.getDate();
  let month = curentDate.getMonth() + 1;
  let year = curentDate.getFullYear();
  let currentDate = `${day}-${month}-${year}`;

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
              {/* <Text
                style={{
                  fontSize: "8px",
                }}>
                Ack No. : 182314174528668
              </Text>
              <Text
                style={{
                  fontSize: "8px",
                }}>
                Ack Date : 14-Aug-23
              </Text> */}
            </>
          )}
          <View>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  border: "1px solid black",
                  height: "100px",
                }}>
                {BilData?.CompanyDetails?.imagePosition &&
                BilData?.CompanyDetails?.imagePosition == "Left" ? (
                  <>
                    {BilData?.CompanyDetails?.logo &&
                    BilData?.CompanyDetails?.logo ? (
                      <>
                        <View style={{ width: "30%" }}>
                          <Image
                            style={{
                              width: "100%",
                              height: "100%",
                              padding: "20px 8px",
                            }}
                            src={`${Image_URL}/Images/${BilData?.CompanyDetails?.logo}`}></Image>
                        </View>
                      </>
                    ) : (
                      <>
                        <View style={{ width: "30%" }}>
                          <Image
                            style={{
                              width: "100%",
                              height: "100%",
                              padding: "20px 8px",
                            }}
                            src={logo}></Image>
                        </View>
                      </>
                    )}

                    <View
                      style={{
                        width: "70%",
                        marginLeft: "10px",
                        padding: "10px",
                        justifyContent: "flex-end",
                      }}>
                      <Text style={{ fontSize: "13px", fontWeight: "bold" }}>
                        {BilData?.CompanyDetails?.name &&
                          BilData?.CompanyDetails?.name}
                      </Text>

                      <Text
                        style={{
                          fontSize: "8px",
                          marginTop: "5px",
                          marginBottom: "2px",
                          width: "90%",
                        }}>
                        {BilData?.CompanyDetails?.address &&
                          BilData?.CompanyDetails?.address}
                      </Text>
                      {/* <Text
                        style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          marginTop: "1px",
                          marginBottom: "2px",
                        }}>
                        Company Details
                      </Text> */}
                      <Text style={styles.header}></Text>
                      <Text style={styles.header}>
                        Email:
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
                      {/* <Text style={styles.GSTIN}>
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
                      </Text> */}
                    </View>
                  </>
                ) : (
                  <>
                    <View
                      style={{
                        width: "70%",
                        padding: "10px",
                        justifyContent: "flex-end",
                      }}>
                      <Text style={{ fontSize: "13px", fontWeight: "bold" }}>
                        {BilData?.CompanyDetails?.name &&
                          BilData?.CompanyDetails?.name}
                      </Text>

                      <Text
                        style={{
                          fontSize: "8px",
                          marginTop: "5px",
                          marginBottom: "2px",
                          width: "90%",
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
                        <Image
                          style={{ width: "200px", padding: "25px 10px" }}
                          src={`${Image_URL}/Images/${BilData?.CompanyDetails?.logo}`}></Image>
                      </>
                    ) : (
                      <>
                        <Image
                          style={{ width: "200px", padding: "25px 10px" }}
                          src={logo}></Image>
                      </>
                    )}
                  </>
                )}
              </View>

              <View
                style={{
                  flexDirection: "row",
                  borderBottom: "1px solid black",
                  borderRight: "1px solid black",
                  borderLeft: "1px solid black",
                  height: "100px",
                }}>
                <View style={{ width: "50%" }}>
                  <View
                    style={{
                      width: "100%",
                      // borderBottom: "1px solid black",
                      height: "100px",
                    }}>
                    <View
                      style={{
                        backgroundColor: "grey",
                        padding: "4px 4px",
                        flexDirection: "row",
                      }}>
                      {BilData?.CompanyDetails?.billTo == "Left" && (
                        <Text
                          style={{
                            fontSize: "10px",
                            fontWeight: "1000",
                            marginLeft: "5px",
                            width: "100%",
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
                            width: "100%",
                          }}>
                          Ship To
                        </Text>
                      )}
                    </View>
                    <View
                      style={{
                        padding: "8px 8px",
                      }}>
                      {BilData?.CompanyDetails?.billTo == "Left" && (
                        <View
                          style={{ flexDirection: "", paddingBottom: "3px" }}>
                          <Text
                            style={{
                              fontSize: "10px",
                              fontWeight: "bold",
                            }}>
                            {BilData?.CompanyDetails?.name &&
                              BilData?.CompanyDetails?.name}
                          </Text>
                          <Text
                            style={{
                              fontSize: "8px",
                              marginTop: "4px",
                              marginBottom: "2px",
                              width: "90%",
                            }}>
                            {BilData?.CompanyDetails?.address &&
                              BilData?.CompanyDetails?.address}
                          </Text>
                          <Text style={styles.header}>
                            {BilData?.CompanyDetails?.email &&
                              BilData?.CompanyDetails?.email}
                          </Text>
                          <Text style={styles.header}>
                            MobileNo :
                            {BilData?.CompanyDetails?.mobileNo &&
                              BilData?.CompanyDetails?.mobileNo}
                          </Text>
                        </View>
                      )}
                      {BilData?.CompanyDetails?.shipto == "Left" && (
                        <>
                          <View
                            style={{ flexDirection: "", paddingBottom: "3px" }}>
                            <Text
                              style={{
                                fontSize: "10px",
                                fontWeight: "bold",
                                paddingTop: "5px",
                                paddingBottom: "5px",
                              }}>
                              {`Name: ${BilData?.PrintData?.partyId?.CompanyName}`}
                            </Text>
                            <Text
                              style={{
                                fontSize: "8px",
                                width: "98%",
                                fontWeight: "bold",
                              }}>
                              {`Address: ${BilData?.PrintData?.partyId?.address}
                            Mobile No.: ${BilData?.PrintData?.partyId?.contactNumber}
                            State.: ${BilData?.PrintData?.partyId?.State}
                            City.: ${BilData?.PrintData?.partyId?.City}`}
                            </Text>
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
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    height: "100px",
                    width: "50%",
                    borderLeft: "1px solid black",
                  }}>
                  <View
                    style={{
                      width: "100%",
                      // height: "90px",
                    }}>
                    <View
                      style={{
                        padding: "2px 2px",
                        backgroundColor: "grey",

                        flexDirection: "row",
                      }}>
                      {BilData?.CompanyDetails?.billTo == "right" && (
                        <Text
                          style={{
                            fontSize: "10px",
                            fontWeight: "1000",
                            marginLeft: "5px",
                            width: "100%",
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
                            width: "100%",
                          }}>
                          Ship To
                        </Text>
                      )}
                    </View>
                    <View style={{ padding: "10px" }}>
                      {BilData?.CompanyDetails?.billTo == "right" && (
                        <View
                          style={{ flexDirection: "", paddingBottom: "3px" }}>
                          <Text
                            style={{
                              fontSize: "10px",
                              fontWeight: "bold",
                            }}>
                            {BilData?.CompanyDetails?.name &&
                              BilData?.CompanyDetails?.name}
                          </Text>
                          <Text style={styles.header}>
                            {BilData?.CompanyDetails?.address &&
                              BilData?.CompanyDetails?.address}
                          </Text>

                          <Text
                            style={{
                              fontSize: "8px",
                              width: "95%",
                              fontWeight: "bold",
                            }}>
                            {/* Payment Mode: 
                       
                       Transporter Detail:
                        
                       Order No.:
                     
                        Ledger Balance: 
                        
                         Vehicle No.: 
                        
                         Date:
                          
                          Sales PersonName: */}
                          </Text>
                          {/* <Text style={styles.header}>
                            Email :
                            {BilData?.CompanyDetails?.email &&
                              BilData?.CompanyDetails?.email}
                          </Text>
                          <Text style={styles.header}>
                            MobileNo :
                            {BilData?.CompanyDetails?.mobileNo &&
                              BilData?.CompanyDetails?.mobileNo}
                          </Text> */}
                        </View>
                      )}
                      {BilData?.CompanyDetails?.shipto == "right" && (
                        <>
                          <View
                            style={{ flexDirection: "", paddingBottom: "3px" }}>
                            <Text
                              style={{
                                fontSize: "10px",
                                fontWeight: "bold",
                              }}>
                              {`Name: ${BilData?.PrintData?.partyId?.CompanyName}`}
                            </Text>
                            <Text
                              style={{
                                fontSize: "8px",
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
                    </View>
                  </View>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  borderBottom: "1px solid black",
                  borderRight: "1px solid black",
                  borderLeft: "1px solid black",
                  height: "100px",
                }}>
                <View style={{ width: "50%" }}>
                  <View
                    style={{
                      width: "100%",
                      // borderBottom: "1px solid black",
                      height: "100px",
                    }}>
                    <View
                      style={{
                        backgroundColor: "grey",
                        padding: "4px 4px",
                        flexDirection: "row",
                      }}>
                      <Text
                        style={{
                          fontSize: "10px",
                          fontWeight: "1000",
                          marginLeft: "5px",
                          width: "100%",
                        }}>
                        Invoice Details
                      </Text>
                    </View>
                    <View
                      style={{
                        padding: "6px 6px",
                      }}>
                      <View style={{ flexDirection: "", paddingBottom: "3px" }}>
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
                                    {invoiceData?.orderNo &&
                                      invoiceData?.orderNo}
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
                        <Text style={styles.header}>
                          order No:
                          {invoiceData?._id && invoiceData?._id}
                        </Text>
                        <Text style={styles.header}>
                          Ledger Balance :
                          {BilData?.CompanyDetails?.mobileNo &&
                            BilData?.CompanyDetails?.mobileNo}
                        </Text>
                        <Text style={styles.header}>
                          Date :
                          {invoiceData?.date &&
                            invoiceData?.date?.split("T")[0]}
                        </Text>
                        <Text style={styles.header}>
                          SP Name :
                          {BilData?.PrintData?.userId?.firstName &&
                            `${BilData?.PrintData?.userId?.firstName} ${BilData?.PrintData?.userId?.lastName}`}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    height: "100px",
                    width: "50%",
                    borderLeft: "1px solid black",
                  }}>
                  <View
                    style={{
                      width: "100%",
                      // height: "90px",
                    }}>
                    <View
                      style={{
                        padding: "3px 3px",
                        backgroundColor: "grey",

                        flexDirection: "row",
                      }}>
                      <Text
                        style={{
                          fontSize: "10px",
                          fontWeight: "1000",
                          marginLeft: "5px",
                          width: "100%",
                        }}>
                        Transporter Details
                      </Text>
                    </View>
                    <View style={{ padding: "8px" }}>
                      <View style={{ flexDirection: "", paddingBottom: "3px" }}>
                        {!!invoiceData?.transporter ? (
                          <>
                            <Text
                              style={{
                                fontSize: "10px",
                                fontWeight: "bold",
                              }}>
                              Name :
                              {!!invoiceData?.transporter &&
                                invoiceData?.transporter?.companyName}
                            </Text>
                            <Text
                              style={{
                                fontSize: "10px",
                                fontWeight: "bold",
                              }}>
                              Mobile No:
                              {!!invoiceData?.transporter &&
                                invoiceData?.transporter?.contactNumber}
                            </Text>
                            <Text
                              style={{
                                fontSize: "10px",
                                fontWeight: "bold",
                              }}>
                              Vehicle No:{" "}
                              {invoiceData?.vehicleNo && invoiceData?.vehicleNo}
                            </Text>
                          </>
                        ) : (
                          <>
                            <Text
                              style={{
                                fontSize: "10px",
                                width: "95%",
                                fontWeight: "bold",
                              }}></Text>
                          </>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "grey",
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
                    width: "12%",
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
                  }}>
                  <Text
                    style={{
                      fontSize: "10px",
                      color: "white",
                      fontWeight: "1000",
                    }}>
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

                <InvoiceCharges invoiceData={invoiceData} />
              </View>
            </View>

            <View>
              <GstCalculation invoiceData={invoiceData} />
            </View>
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
                  // borderBottom: "1px solid black",
                  // borderLeft: "1px solid black",
                  // borderRight: "1px solid black",
                  width: "45%",
                }}>
                <Text style={{ fontSize: "11px" }}> For</Text>
                <Text
                  style={{
                    fontSize: "11px",
                    marginTop: "8px",
                    marginBottom: "8px",
                  }}>
                  {" "}
                  {BilData?.CompanyDetails?.name &&
                    BilData?.CompanyDetails?.name}
                </Text>
                <View>
                  {BilData?.CompanyDetails?.signature &&
                  BilData?.CompanyDetails?.signature ? (
                    <>
                      <Image
                        style={{ height: "50px", marginTop: "15px" }}
                        src={`${Image_URL}/Images/${BilData?.CompanyDetails?.signature}`}
                        width="200px"
                        height="200px"></Image>
                    </>
                  ) : (
                    <>
                      <Image
                        style={{ height: "50px", marginTop: "15px" }}
                        src={signature}
                        width="200px"
                        height="200px"></Image>
                    </>
                  )}
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
