import React, { useEffect, useState } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Rect,
} from "@react-pdf/renderer";
import { ToWords } from "to-words";
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
const InvoiceCharges = ({ invoiceData }) => {
  return (
    <>
      <View
        style={{
          width: "45%",
          height: "120px",
        }}>
        <View style={{ height: "120px" }}>
          <View
            style={{
              padding: "10px",

              height: "120px",
            }}>
            <View
              style={{
                flexDirection: "row",
                gap: "10px",
                paddingBottom: "3px",
                justifyContent: "space-between",
              }}>
              <Text
                style={{
                  fontSize: "10px",
                  fontWeight: "bold",
                  marginBottom: "6px",
                }}>
                Sub Total
              </Text>{" "}
              <Text
                style={{
                  fontSize: "10px",
                  fontWeight: "bold",
                  marginBottom: "6px",
                }}>
                {invoiceData?.amount && <>{(invoiceData?.amount).toFixed(2)}</>}
              </Text>
            </View>
            {/* {invoiceData?.localFreight > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  gap: "10px",
                  paddingBottom: "3px",
                  justifyContent: "space-between",
                }}>
                <Text
                  style={{
                    fontSize: "10px",
                    fontWeight: "bold",
                    marginBottom: "6px",
                  }}>
                  Local Freight
                </Text>{" "}
                <Text
                  style={{
                    fontSize: "10px",
                    fontWeight: "bold",
                    marginBottom: "6px",
                  }}>
                  {invoiceData?.localFreight.toFixed(2)}
                </Text>
              </View>
            )} */}
            {/* {invoiceData?.labourCost > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  gap: "10px",
                  paddingBottom: "3px",
                  justifyContent: "space-between",
                }}>
                <Text
                  style={{
                    fontSize: "10px",
                    fontWeight: "bold",
                    marginBottom: "6px",
                  }}>
                  Labour Cost
                </Text>{" "}
                <Text
                  style={{
                    fontSize: "10px",
                    fontWeight: "bold",
                    marginBottom: "6px",
                  }}>
                  {invoiceData?.labourCost?.toFixed(2)}
                </Text>
              </View>
            )} */}
            {invoiceData?.coolieAndCartage > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  gap: "10px",
                  paddingBottom: "3px",
                  justifyContent: "space-between",
                }}>
                <Text
                  style={{
                    fontSize: "10px",
                    fontWeight: "bold",
                    marginBottom: "6px",
                  }}>
                  Coolie and Cartage
                </Text>{" "}
                <Text
                  style={{
                    fontSize: "10px",
                    fontWeight: "bold",
                    marginBottom: "6px",
                  }}>
                  {invoiceData?.coolieAndCartage.toFixed(2)}
                </Text>
              </View>
            )}
            {/* {invoiceData?.miscellaneousCost > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  gap: "10px",
                  paddingBottom: "3px",
                  justifyContent: "space-between",
                }}>
                <Text
                  style={{
                    fontSize: "10px",
                    fontWeight: "bold",
                    marginBottom: "6px",
                  }}>
                  Mis. Cost
                </Text>{" "}
                <Text
                  style={{
                    fontSize: "10px",
                    fontWeight: "bold",
                    marginBottom: "6px",
                  }}>
                  {invoiceData?.miscellaneousCost.toFixed(2)}
                </Text>
              </View>
            )} */}
            {/* {invoiceData?.transportationCost > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  gap: "10px",
                  paddingBottom: "3px",
                  justifyContent: "space-between",
                }}>
                <Text
                  style={{
                    fontSize: "10px",
                    fontWeight: "bold",
                    marginBottom: "6px",
                  }}>
                  Transportation Cost
                </Text>{" "}
                <Text
                  style={{
                    fontSize: "10px",
                    fontWeight: "bold",
                    marginBottom: "6px",
                  }}>
                  {invoiceData?.transportationCost && (
                    <>{(invoiceData?.transportationCost).toFixed(2)}</>
                  )}
                </Text>
              </View>
            )} */}
            {invoiceData?.discountDetails?.length > 0 && (
              <>
                {invoiceData?.discountDetails[0].title && (
                  <>
                    {invoiceData?.discountDetails?.map((ele, i) => (
                      <View
                        key={i}
                        style={{
                          flexDirection: "row",
                          gap: "10px",
                          paddingBottom: "3px",
                          justifyContent: "space-between",
                        }}>
                        <Text
                          style={{
                            fontSize: "10px",
                            fontWeight: "bold",

                            marginBottom: "6px",
                          }}>
                          {ele?.title && (
                            <>
                              {ele?.title}({ele?.percentage}%)
                            </>
                          )}
                        </Text>{" "}
                        <Text
                          style={{
                            fontSize: "10px",
                            fontWeight: "bold",

                            marginBottom: "6px",
                          }}>
                          {ele?.title && <>- {ele?.discountedValue}</>}
                        </Text>
                      </View>
                    ))}
                  </>
                )}
              </>
            )}
            {invoiceData?.chargesDetails > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  gap: "10px",
                  paddingBottom: "3px",
                  justifyContent: "space-between",
                }}>
                <Text
                  style={{
                    fontSize: "10px",
                    fontWeight: "bold",
                    marginBottom: "6px",
                  }}>
                  Charges
                </Text>{" "}
                <Text
                  style={{
                    fontSize: "10px",
                    fontWeight: "bold",
                    marginBottom: "6px",
                  }}>
                  {invoiceData?.chargesDetails && (
                    <>{(invoiceData?.chargesDetails).toFixed(2)}</>
                  )}
                </Text>
              </View>
            )}

            {/* {invoiceData?.chargesDetails?.length > 0 && (
              <>
                {invoiceData?.chargesDetails?.map((ele, i) => (
                  <View
                    key={i}
                    style={{
                      flexDirection: "row",
                      gap: "10px",
                      paddingBottom: "3px",
                      justifyContent: "space-between",
                    }}>
                    <Text
                      style={{
                        fontSize: "10px",
                        fontWeight: "bold",

                        marginBottom: "6px",
                      }}>
                      {ele?.title}({ele?.percentage}%)
                    </Text>{" "}
                    <Text
                      style={{
                        fontSize: "10px",
                        fontWeight: "bold",

                        marginBottom: "6px",
                      }}>
                      +{ele?.chargedAmount}
                    </Text>
                  </View>
                ))}
              </>
            )} */}
            {invoiceData?.igstTaxType == 1 ? (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    gap: "10px",
                    paddingBottom: "3px",
                    justifyContent: "space-between",
                  }}>
                  <Text
                    style={{
                      fontSize: "10px",
                      fontWeight: "bold",
                      // width: "70%",
                      marginBottom: "6px",
                    }}>
                    IGST
                  </Text>
                  <Text
                    style={{
                      fontSize: "10px",
                      fontWeight: "bold",

                      marginBottom: "6px",
                    }}>
                    {invoiceData?.igstTotal}
                  </Text>
                </View>
              </>
            ) : (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    gap: "10px",
                    paddingBottom: "3px",
                    justifyContent: "space-between",
                  }}>
                  <Text
                    style={{
                      fontSize: "10px",
                      fontWeight: "bold",

                      marginBottom: "6px",
                    }}>
                    CGST
                  </Text>{" "}
                  <Text
                    style={{
                      fontSize: "10px",
                      fontWeight: "bold",

                      marginBottom: "6px",
                    }}>
                    {invoiceData?.cgstTotal}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    gap: "10px",
                    paddingBottom: "3px",
                    justifyContent: "space-between",
                  }}>
                  <Text
                    style={{
                      fontSize: "10px",
                      fontWeight: "bold",

                      marginBottom: "6px",
                    }}>
                    SGST
                  </Text>
                  <Text
                    style={{
                      fontSize: "10px",
                      fontWeight: "bold",

                      marginBottom: "6px",
                    }}>
                    {invoiceData?.sgstTotal}
                  </Text>
                </View>
              </>
            )}
            <View
              style={{
                flexDirection: "row",
                gap: "10px",
                borderBottom: "1px solid black",
                paddingBottom: "3px",
                justifyContent: "space-between",
              }}>
              <Text
                style={{
                  fontSize: "10px",
                  fontWeight: "bold",

                  marginBottom: "6px",
                }}>
                RoundOff
              </Text>{" "}
              <Text
                style={{
                  fontSize: "10px",
                  fontWeight: "bold",

                  marginBottom: "6px",
                }}>
                {invoiceData?.roundOff && invoiceData?.roundOff}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: "10px",
                paddingBottom: "3px",
                justifyContent: "space-between",
              }}></View>
            <View
              style={{
                flexDirection: "row",
                gap: "10px",
                paddingBottom: "3px",
                justifyContent: "space-between",
              }}>
              <Text
                style={{
                  fontSize: "11px",
                  fontWeight: "bold",
                  marginTop: "2px",
                }}>
                Grand Total :
              </Text>{" "}
              <Text
                style={{
                  fontSize: "11px",
                  fontWeight: "bold",
                  marginTop: "2px",
                }}>
                {/* {/ {grandTotal} /} */}
                {invoiceData?.grandTotal}
              </Text>
            </View>
          </View>
        </View>
        <View></View>
      </View>
    </>
  );
};

export default InvoiceCharges;
