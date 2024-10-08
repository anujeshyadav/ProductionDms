import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Rect,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import logo from "../../../../assets/img/logo/logowithoutback.png";

import cancelimage from "../../../../assets/img/cancelledOrder.jpg";
import { Image_URL } from "../../../../ApiEndPoint/Api";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    padding: 30,
    position: "relative",
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

const Billcomponent1 = ({ invoiceData, BilData }) => {
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

          <View>
            <View
              style={{
                flexDirection: "row",
                borderBottom: "1px solid black",
                borderRight: "1px solid black",
                borderLeft: "1px solid black",
                borderTop: "1px solid black",
                height: "90px",
              }}>
              <View
                style={{
                  width: "25%",
                  padding: "10px 10px",
                  borderRight: "1px solid black",
                }}>
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
              </View>

              <View
                style={{
                  padding: "10px",
                  width: "50%",
                  borderRight: "1px solid black",
                }}>
                <View style={{ flexDirection: "", paddingBottom: "3px" }}>
                  <Text
                    style={{
                      fontSize: "13px",
                      fontWeight: "bold",
                      color: "black",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}>
                    Jupitech Techno Pvt Ltd.
                  </Text>
                  <Text
                    style={{
                      fontSize: "8px",
                      marginTop: "5px",
                      marginBottom: "2px",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}>
                    101 plot no 76 pu4 scheme no 54 behind c21 mall
                  </Text>
                  <Text
                    style={{
                      fontSize: "8px",
                      marginTop: "5px",
                      marginBottom: "2px",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}>
                    Contact details Email id & phone no
                  </Text>
                  <Text
                    style={{
                      fontSize: "9px",
                      marginTop: "5px",
                      marginBottom: "2px",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}>
                    gst no
                  </Text>
                  <Text style={styles.header}></Text>
                  <Text style={styles.header}></Text>
                </View>
              </View>
              <View style={{ padding: "10px", width: "25%" }}>
                <Text style={{ textAlign: "center" }}>qr code</Text>
                <View></View>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",

                borderBottom: "1px solid black",

                borderLeft: "1px solid black",
                height: "96px",
              }}>
              <View
                style={{
                  borderRight: "1px solid black",
                }}>
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      width: "30%",
                      borderRight: "1px solid black",
                      height: "96",
                    }}>
                    <Text
                      style={{
                        fontSize: "9px",
                        fontWeight: "1000",
                        marginLeft: "5px",
                        marginBottom: "5px",

                        textTransform: "uppercase",
                      }}>
                      Bill To
                    </Text>
                    <Text
                      style={{
                        fontSize: "6px",
                        fontWeight: "1000",
                        marginLeft: "5px",

                        textTransform: "uppercase",
                      }}>
                      buyer name
                    </Text>
                    <Text
                      style={{
                        fontSize: "6px",
                        fontWeight: "1000",
                        marginLeft: "5px",
                        marginTop: "3px",
                        textTransform: "uppercase",
                      }}>
                      address
                    </Text>
                    <Text
                      style={{
                        fontSize: "6px",
                        fontWeight: "1000",
                        marginLeft: "5px",
                        marginTop: "3px",
                        textTransform: "uppercase",
                      }}>
                      city & code
                    </Text>
                    <Text
                      style={{
                        fontSize: "6px",
                        fontWeight: "1000",
                        marginLeft: "5px",
                        marginTop: "3px",
                        textTransform: "uppercase",
                      }}>
                      contact details email id & phone no
                    </Text>
                    <Text
                      style={{
                        fontSize: "6px",
                        fontWeight: "1000",
                        marginLeft: "5px",
                        marginTop: "3px",
                        textTransform: "uppercase",
                      }}>
                      gst no
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "30%",
                      borderRight: "1px solid black",
                      height: "96",
                    }}>
                    <Text
                      style={{
                        fontSize: "9px",
                        fontWeight: "1000",
                        marginLeft: "5px",
                        textTransform: "uppercase",
                      }}>
                      Ship To
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "40%",
                      borderBottom: "1px solid black",
                      height: "96px",
                    }}>
                    <View style={{ flexDirection: "row", height: "16px" }}>
                      <View style={{ width: "40%" }}>
                        <Text
                          style={{
                            fontSize: "6px",
                            fontWeight: "1000",
                            padding: "4px",
                            textTransform: "uppercase",
                          }}>
                          date
                        </Text>
                      </View>
                      <View style={{ width: "60%" }}>
                        <Text
                          style={{
                            fontSize: "6px",
                            fontWeight: "1000",
                            padding: "4px",
                            textTransform: "uppercase",
                          }}>
                          s p name
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        height: "16px",
                        borderTop: "1px solid black",
                      }}>
                      <View style={{ width: "50%" }}>
                        <Text
                          style={{
                            fontSize: "6px",
                            fontWeight: "1000",
                            padding: "4px",
                            textTransform: "uppercase",
                          }}>
                          invoice no
                        </Text>
                      </View>
                      <View style={{ width: "50%" }}>
                        <Text
                          style={{
                            fontSize: "6px",
                            fontWeight: "1000",
                            padding: "4px",
                            textTransform: "uppercase",
                          }}>
                          ledger balance
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        height: "16px",
                        borderTop: "1px solid black",
                      }}>
                      <View style={{ width: "50%" }}>
                        <Text
                          style={{
                            fontSize: "6px",
                            fontWeight: "1000",
                            padding: "4px",
                            textTransform: "uppercase",
                          }}>
                          eway bill no
                        </Text>
                      </View>
                      <View style={{ width: "50%" }}>
                        <Text
                          style={{
                            fontSize: "6px",
                            fontWeight: "1000",
                            padding: "4px",
                            textTransform: "uppercase",
                          }}>
                          payment mode
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        height: "16px",
                        borderTop: "1px solid black",
                      }}>
                      <View style={{ width: "100%" }}>
                        <Text
                          style={{
                            fontSize: "6px",
                            fontWeight: "1000",
                            padding: "4px",
                            textTransform: "uppercase",
                          }}>
                          transporter name
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        height: "16px",
                        borderTop: "1px solid black",
                      }}>
                      <View style={{ width: "100%" }}>
                        <Text
                          style={{
                            fontSize: "6px",
                            fontWeight: "1000",
                            padding: "4px",
                            textTransform: "uppercase",
                          }}>
                          address
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        height: "16px",
                        borderTop: "1px solid black",
                      }}>
                      <View style={{ width: "100%" }}>
                        <Text
                          style={{
                            fontSize: "6px",
                            fontWeight: "1000",
                            padding: "4px",
                            textTransform: "uppercase",
                          }}>
                          mobile no
                        </Text>
                      </View>
                    </View>
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

                height: "14px",
              }}>
              <View
                style={{
                  width: "5%",
                  borderRight: "1px solid black",
                  paddingTop: "1px",
                }}>
                <View style={{ flexDirection: "" }}>
                  <Text
                    style={{
                      fontSize: "6px",
                      textAlign: "center",
                      textTransform: "uppercase",
                      paddingTop: "2px",
                    }}>
                    s.no
                  </Text>
                </View>
              </View>
              <View
                style={{
                  width: "25%",
                  borderRight: "1px solid black",
                  paddingTop: "1px",
                }}>
                <View style={{ flexDirection: "" }}>
                  <Text
                    style={{
                      fontSize: "6px",
                      textAlign: "center",
                      textTransform: "uppercase",
                      paddingTop: "2px",
                    }}>
                    particulars
                  </Text>
                </View>
              </View>
              <View
                style={{
                  width: "10%",
                  borderRight: "1px solid black",
                  paddingTop: "1px",
                }}>
                <View style={{ flexDirection: "" }}>
                  <Text
                    style={{
                      fontSize: "6px",
                      paddingTop: "2px",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}>
                    hsn/sac
                  </Text>
                </View>
              </View>
              <View
                style={{
                  width: "10%",
                  borderRight: "1px solid black",
                  paddingTop: "1px",
                }}>
                <View style={{ flexDirection: "" }}>
                  <Text
                    style={{
                      fontSize: "6px",
                      paddingTop: "2px",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}>
                    tax rate
                  </Text>
                </View>
              </View>
              <View
                style={{
                  width: "10%",
                  borderRight: "1px solid black",
                  paddingTop: "1px",
                }}>
                <View style={{ flexDirection: "" }}>
                  <Text
                    style={{
                      fontSize: "6px",
                      paddingTop: "2px",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}>
                    qnty
                  </Text>
                </View>
              </View>
              <View
                style={{
                  width: "10%",
                  borderRight: "1px solid black",
                  paddingTop: "1px",
                }}>
                <View style={{ flexDirection: "" }}>
                  <Text
                    style={{
                      fontSize: "6px",
                      paddingTop: "2px",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}>
                    price
                  </Text>
                </View>
              </View>
              <View
                style={{
                  width: "10%",
                  borderRight: "1px solid black",
                  paddingTop: "1px",
                }}>
                <View style={{ flexDirection: "" }}>
                  <Text
                    style={{
                      fontSize: "6px",
                      paddingTop: "2px",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}>
                    cgst
                  </Text>
                </View>
              </View>
              <View
                style={{
                  width: "10%",
                  borderRight: "1px solid black",
                  paddingTop: "1px",
                }}>
                <View style={{ flexDirection: "" }}>
                  <Text
                    style={{
                      fontSize: "6px",
                      paddingTop: "2px",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}>
                    sgst
                  </Text>
                </View>
              </View>
              <View style={{ width: "10%" }}>
                <View style={{ flexDirection: "", paddingTop: "1px" }}>
                  <Text
                    style={{
                      fontSize: "6px",
                      paddingTop: "2px",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}>
                    amount
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

                height: "200px",
              }}>
              <View style={{ width: "5%", paddingTop: "1px" }}>
                <View style={{ flexDirection: "" }}>
                  <Text
                    style={{
                      fontSize: "9px",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}></Text>
                </View>
              </View>
              <View style={{ width: "25%", paddingTop: "1px" }}>
                <View style={{ flexDirection: "" }}>
                  <Text
                    style={{
                      fontSize: "9px",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}></Text>
                </View>
              </View>
              <View style={{ width: "10%", paddingTop: "1px" }}>
                <View style={{ flexDirection: "" }}>
                  <Text
                    style={{
                      fontSize: "9px",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}></Text>
                </View>
              </View>
              <View style={{ width: "10%", paddingTop: "1px" }}>
                <View style={{ flexDirection: "" }}>
                  <Text
                    style={{
                      fontSize: "9px",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}></Text>
                </View>
              </View>
              <View style={{ width: "10%", paddingTop: "1px" }}>
                <View style={{ flexDirection: "" }}>
                  <Text
                    style={{
                      fontSize: "9px",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}></Text>
                </View>
              </View>
              <View style={{ width: "10%", paddingTop: "1px" }}>
                <View style={{ flexDirection: "" }}>
                  <Text
                    style={{
                      fontSize: "9px",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}></Text>
                </View>
              </View>
              <View style={{ width: "10%", paddingTop: "1px" }}>
                <View style={{ flexDirection: "" }}>
                  <Text
                    style={{
                      fontSize: "9px",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}></Text>
                </View>
              </View>
              <View style={{ width: "10%", paddingTop: "1px" }}>
                <View style={{ flexDirection: "" }}>
                  <Text
                    style={{
                      fontSize: "9px",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}></Text>
                </View>
              </View>
              <View style={{ width: "10%" }}>
                <View style={{ flexDirection: "", paddingTop: "1px" }}>
                  <Text
                    style={{
                      fontSize: "9px",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}></Text>
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                borderBottom: "1px solid black",
                height: "165",
                borderLeft: "1px solid black",
              }}>
              <View style={{ width: "70%", borderRight: "1px solid black" }}>
                <View
                  style={{
                    flexDirection: "",
                    paddingTop: "1px",
                    borderBottom: "1px solid black",
                    height: "14px",
                  }}>
                  <Text
                    style={{
                      fontSize: "6px",
                      padding: "2px",
                      fontWeight: "bold",
                      color: "black",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}>
                    eleven lac twelve thousandeight hundred eighty eight
                  </Text>
                </View>
                <View style={{ flexDirection: "row", padding: "4px" }}>
                  <View style={{ width: "100%" }}>
                    <View style={{ flexDirection: "" }}>
                      <Text
                        style={{
                          fontSize: "6px",

                          color: "black",

                          textTransform: "uppercase",
                        }}>
                        bank name
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={{ flexDirection: "row", padding: "4px" }}>
                  <View style={{ width: "35%" }}>
                    <View style={{ flexDirection: "" }}>
                      <Text
                        style={{
                          fontSize: "6px",

                          color: "black",

                          textTransform: "uppercase",
                        }}>
                        a/c no.
                      </Text>
                    </View>
                  </View>
                  <View style={{ width: "32%" }}>
                    <View style={{ flexDirection: "" }}>
                      <Text
                        style={{
                          fontSize: "6px",

                          color: "black",

                          textTransform: "uppercase",
                        }}>
                        ifsc code
                      </Text>
                    </View>
                  </View>
                  <View style={{ width: "33%" }}>
                    <View style={{ flexDirection: "" }}>
                      <Text
                        style={{
                          fontSize: "6px",

                          color: "black",

                          textTransform: "uppercase",
                        }}>
                        micr no
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    padding: "4px",
                    borderBottom: "1px solid black",
                  }}>
                  <View style={{ width: "100%" }}>
                    <View style={{ flexDirection: "" }}>
                      <Text
                        style={{
                          fontSize: "6px",

                          color: "black",

                          textTransform: "uppercase",
                        }}>
                        address
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "",
                    paddingTop: "1px",
                    paddingLeft: "3px",
                    borderBottom: "1px solid black",
                    height: "15px",
                  }}>
                  <Text
                    style={{
                      fontSize: "6px",
                      padding: "2px",
                      fontWeight: "bold",
                      color: "black",

                      textTransform: "uppercase",
                    }}>
                    arn no:{" "}
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
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "",
                    paddingTop: "1px",
                    padding: "3px",
                  }}>
                  <Text
                    style={{
                      fontSize: "6px",
                      fontWeight: "bold",
                      color: "black",

                      textTransform: "uppercase",
                    }}>
                    terms & conditions :
                  </Text>
                  <Text
                    style={{
                      fontSize: "6px",
                      fontWeight: "bold",
                      color: "black",
                      marginTop: "3px",
                      textTransform: "uppercase",
                    }}>
                    1. payment to be made by a/c payee's cheque or draft only.
                  </Text>
                  <Text
                    style={{
                      fontSize: "6px",
                      fontWeight: "bold",
                      color: "black",
                      marginTop: "2px",
                      textTransform: "uppercase",
                    }}>
                    2. interest @24% per annum will be charged after due date of
                    the bill.
                  </Text>
                  <Text
                    style={{
                      fontSize: "6px",
                      fontWeight: "bold",
                      color: "black",
                      marginTop: "2px",
                      textTransform: "uppercase",
                    }}>
                    3. we are not liable for any loss or damage during transit.
                  </Text>
                  <Text
                    style={{
                      fontSize: "6px",
                      fontWeight: "bold",
                      color: "black",
                      marginTop: "2px",
                      textTransform: "uppercase",
                    }}>
                    4. any complaint regarding good should be reported within 7
                    days.
                  </Text>
                  <Text
                    style={{
                      fontSize: "6px",
                      fontWeight: "bold",
                      color: "black",
                      marginTop: "2px",
                      textTransform: "uppercase",
                    }}>
                    5. goods once sold will not be taken back.
                  </Text>
                  <Text
                    style={{
                      fontSize: "6px",
                      fontWeight: "bold",
                      color: "black",
                      marginTop: "2px",
                      textTransform: "uppercase",
                    }}>
                    subject to surat jurisdiction.
                  </Text>
                </View>
              </View>
              <View
                style={{
                  width: "30%",
                  borderRight: "1px solid black",
                  padding: "3px",
                }}>
                <View style={{ flexDirection: "" }}>
                  <Text
                    style={{
                      fontSize: "6px",

                      color: "black",
                      marginTop: "2px",
                      textTransform: "uppercase",
                    }}>
                    taxable value
                  </Text>
                  <Text
                    style={{
                      fontSize: "6px",

                      color: "black",
                      marginTop: "2px",
                      textTransform: "uppercase",
                    }}>
                    discount
                  </Text>
                  <Text
                    style={{
                      fontSize: "6px",

                      color: "black",
                      marginTop: "2px",
                      textTransform: "uppercase",
                    }}>
                    charges
                  </Text>
                  <Text
                    style={{
                      fontSize: "6px",

                      color: "black",
                      marginTop: "2px",
                      textTransform: "uppercase",
                    }}>
                    cgst
                  </Text>
                  <Text
                    style={{
                      fontSize: "6px",

                      color: "black",
                      marginTop: "2px",
                      textTransform: "uppercase",
                    }}>
                    sgst
                  </Text>
                  <Text
                    style={{
                      fontSize: "6px",

                      color: "black",
                      marginTop: "2px",
                      textTransform: "uppercase",
                    }}>
                    igst
                  </Text>
                  <Text
                    style={{
                      fontSize: "6px",

                      color: "black",
                      marginTop: "2px",
                      textTransform: "uppercase",
                    }}>
                    total
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                borderBottom: "1px solid black",
                height: "150",
                borderLeft: "1px solid black",
              }}>
              <View style={{ width: "70%", borderRight: "1px solid black" }}>
                <View style={{ flexDirection: "row", height: "15px" }}>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "25%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",

                        textAlign: "center",
                        textTransform: "uppercase",
                      }}>
                      hsn/sac
                    </Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "18%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}>
                      taxable value
                    </Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "12%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}>
                      tax rate
                    </Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "10%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}>
                      cgst
                    </Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "10%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}>
                      sgst
                    </Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "10%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}>
                      igst
                    </Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "17%",
                      borderBottom: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}>
                      total
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", height: "15px" }}>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "25%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "18%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "12%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "10%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "10%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "10%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "17%",
                      borderBottom: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", height: "15px" }}>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "25%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "18%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "12%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "10%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "10%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "10%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "17%",
                      borderBottom: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", height: "15px" }}>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "25%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "18%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "12%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "10%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "10%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "10%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "17%",
                      borderBottom: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", height: "15px" }}>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "25%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "18%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "12%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "10%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "10%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "10%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "17%",
                      borderBottom: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", height: "15px" }}>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "25%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "18%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "12%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "10%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "10%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "10%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "17%",
                      borderBottom: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", height: "15px" }}>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "25%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "18%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "12%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "10%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "10%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "10%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "17%",
                      borderBottom: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", height: "15px" }}>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "25%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "18%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "12%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "10%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "10%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "10%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "17%",
                      borderBottom: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", height: "15px" }}>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "25%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "18%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "12%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "10%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "10%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "10%",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "17%",
                      borderBottom: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                </View>

                <View style={{ flexDirection: "row", height: "15px" }}>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "25%",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "6px",
                        paddingTop: "2px",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}>
                      total
                    </Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "18%",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "8px",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "12%",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "8px",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "10%",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "8px",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "10%",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "8px",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View
                    style={{
                      paddingTop: "1px",
                      width: "10%",
                      borderRight: "1px solid black",
                    }}>
                    <Text
                      style={{
                        fontSize: "8px",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                  <View style={{ paddingTop: "1px", width: "17%" }}>
                    <Text
                      style={{
                        fontSize: "8px",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}></Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  width: "30%",
                  borderRight: "1px solid black",
                  padding: "3px",
                }}>
                <View style={{ flexDirection: "", height: "20px" }}>
                  <Text
                    style={{
                      fontSize: "6px",

                      color: "black",

                      textTransform: "uppercase",
                    }}>
                    For
                  </Text>
                </View>
                <View style={{ flexDirection: "", height: "110px" }}>
                  <Text
                    style={{
                      fontSize: "7px",

                      color: "black",
                      textAlign: "center",
                      textTransform: "uppercase",
                    }}>
                    company name
                  </Text>
                </View>
                <View style={{ flexDirection: "", height: "20px" }}>
                  <Text
                    style={{
                      fontSize: "6px",

                      color: "black",
                      textAlign: "right",
                      textTransform: "uppercase",
                    }}>
                    authorized signatoroy
                  </Text>
                </View>
              </View>
            </View>

            <View></View>
          </View>
        </Page>
      </Document>
    </>
  );
};

export default Billcomponent1;
