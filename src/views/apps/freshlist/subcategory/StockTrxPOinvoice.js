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

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    padding: 30,
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

const StockTrxPOinvoice = ({
  UserChoice,
  invoiceData,
  CurrentWords,
  BilData,
  AllData,
  tableList,
  AllCharges,
}) => {
  // console.log("poinvoice");
  // const { items, customerName, date, total, place_supply } = invoiceData;
  const curentDate = new Date();

  let day = curentDate.getDate();
  let month = curentDate.getMonth() + 1;
  let year = curentDate.getFullYear();
  let currentDate = `${day}-${month}-${year}`;

  return (
    <>
      <Document>
        <Page size="A4" style={styles.page}>
          <View>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  border: "1px solid black",
                  height: "100px",
                }}
              >
                {UserChoice?.imagePosition &&
                UserChoice?.imagePosition == "Left" ? (
                  <>
                    {/* <Image
                      style={{ width: "230px", padding: "25px 10px" }}
                      src={logo}></Image> */}
                    {AllData?.CompanyDetails?.logo &&
                    AllData?.CompanyDetails?.logo ? (
                      <>
                        <Image
                          style={{ width: "230px", padding: "25px 10px" }}
                          src={`${Image_URL}/Images/${AllData?.CompanyDetails?.logo}`}
                        ></Image>
                      </>
                    ) : (
                      <>
                        <Image
                          style={{ width: "230px", padding: "25px 10px" }}
                          src={logo}
                        ></Image>
                      </>
                    )}

                    <View style={{ padding: "10px" }}>
                      <Text style={{ fontSize: "13px", fontWeight: "bold" }}>
                        {AllData?.CompanyDetails?.name &&
                          AllData?.CompanyDetails?.name}
                      </Text>

                      <Text
                        style={{
                          fontSize: "8px",
                          marginTop: "5px",
                          marginBottom: "2px",
                        }}
                      >
                        {AllData?.CompanyDetails?.address &&
                          AllData?.CompanyDetails?.address}
                      </Text>
                      <Text style={styles.header}></Text>
                      <Text style={styles.header}>
                        Email :
                        {AllData?.CompanyDetails?.email &&
                          AllData?.CompanyDetails?.email}
                      </Text>
                      <Text style={styles.header}>
                        MobileNo :
                        {AllData?.CompanyDetails?.mobileNo &&
                          AllData?.CompanyDetails?.mobileNo}
                      </Text>
                      <Text style={styles.GSTIN}>
                        GSTIN :
                        {AllData?.CompanyDetails?.gstNo &&
                          AllData?.CompanyDetails?.gstNo}
                      </Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={{ padding: "10px" }}>
                      <Text style={{ fontSize: "13px", fontWeight: "bold" }}>
                        {AllData?.CompanyDetails?.name &&
                          AllData?.CompanyDetails?.name}
                      </Text>

                      <Text
                        style={{
                          fontSize: "8px",
                          marginTop: "5px",
                          marginBottom: "2px",
                        }}
                      >
                        {AllData?.CompanyDetails?.address &&
                          AllData?.CompanyDetails?.address}
                      </Text>
                      <Text style={styles.header}></Text>
                      <Text style={styles.header}>
                        Email :
                        {AllData?.CompanyDetails?.email &&
                          AllData?.CompanyDetails?.email}
                      </Text>
                      <Text style={styles.header}>
                        MobileNo :
                        {AllData?.CompanyDetails?.mobileNo &&
                          AllData?.CompanyDetails?.mobileNo}
                      </Text>
                      <Text style={styles.GSTIN}>
                        GSTIN :
                        {AllData?.CompanyDetails?.gstNo &&
                          AllData?.CompanyDetails?.gstNo}
                      </Text>
                    </View>
                    {AllData?.CompanyDetails?.logo &&
                    AllData?.CompanyDetails?.logo ? (
                      <>
                        <Image
                          style={{ width: "230px", padding: "25px 10px" }}
                          src={`${Image_URL}/Images/${AllData?.CompanyDetails?.logo}`}
                        ></Image>
                      </>
                    ) : (
                      <>
                        <Image
                          style={{ width: "230px", padding: "25px 10px" }}
                          src={logo}
                        ></Image>
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
                  height: "180px",
                }}
              >
                <View style={{ width: "66%" }}>
                  <View
                    style={{
                      width: "100%",
                      borderBottom: "1px solid black",
                      height: "90px",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "grey",
                        padding: "2px 2px",
                        flexDirection: "row",
                      }}
                    >
                      {UserChoice?.billTo == "Left" && (
                        <Text
                          style={{
                            fontSize: "10px",
                            fontWeight: "1000",
                            marginLeft: "5px",
                            width: "100%",
                          }}
                        >
                          Bill To
                        </Text>
                      )}
                      {UserChoice?.shipto == "Left" && (
                        <Text
                          style={{
                            fontSize: "10px",
                            fontWeight: "1000",
                            marginLeft: "5px",
                            width: "100%",
                          }}
                        >
                          Ship To
                        </Text>
                      )}
                    </View>
                    <View
                      style={{
                        // width: "50%",
                        padding: "10px 10px",
                        // borderRight: "1px solid black",
                      }}
                    >
                      {UserChoice?.billTo == "Left" && (
                        <View
                          style={{ flexDirection: "", paddingBottom: "3px" }}
                        >
                          <Text
                            style={{
                              fontSize: "10px",
                              fontWeight: "bold",
                            }}
                          >
                            {`${AllData?.CompanyDetails?.name}
                             ${AllData?.CompanyDetails?.address}
                              ${AllData?.CompanyDetails?.mobileNo} 
                              ${AllData?.CompanyDetails?.email} `}
                          </Text>{" "}
                          <Text
                            style={{
                              fontSize: "10px",
                              width: "45%",
                              fontWeight: "bold",
                            }}
                          >
                            {/* {`${AllData?.CompanyDetails?.currentAddress} `}
                            {`${AllData?.CompanyDetails?.State} `} */}
                          </Text>{" "}
                        </View>
                      )}
                      {UserChoice?.shipto == "Left" && (
                        <View
                          style={{ flexDirection: "", paddingBottom: "3px" }}
                        >
                          <Text
                            style={{
                              fontSize: "10px",
                              fontWeight: "bold",
                            }}
                          >
                            {`${BilData?.ViewOneData?.warehouseToId?.firstName}
                             ${BilData?.ViewOneData?.warehouseToId?.City}
                               ${BilData?.ViewOneData?.warehouseToId?.State} 
                                ${BilData?.ViewOneData?.warehouseToId?.Country} 
                                ${BilData?.ViewOneData?.warehouseToId?.email}`}
                          </Text>{" "}
                          <Text
                            style={{
                              fontSize: "10px",
                              width: "45%",
                              fontWeight: "bold",
                            }}
                          >
                            {`${invoiceData?.address} `}
                            {`${invoiceData?.landMark} `}
                            Mobile No: {`${invoiceData?.MobileNo} `}
                          </Text>{" "}
                        </View>
                      )}
                    </View>
                  </View>
                  <View
                    style={{
                      width: "100%",
                      height: "90px",
                    }}
                  >
                    <View
                      style={{
                        padding: "2px 2px",
                        backgroundColor: "grey",

                        flexDirection: "row",
                      }}
                    >
                      {UserChoice?.billTo == "right" && (
                        <Text
                          style={{
                            fontSize: "10px",
                            fontWeight: "1000",
                            marginLeft: "5px",
                            width: "100%",
                          }}
                        >
                          Bill To
                        </Text>
                      )}
                      {UserChoice?.shipto == "right" && (
                        <Text
                          style={{
                            fontSize: "10px",
                            fontWeight: "1000",
                            marginLeft: "5px",
                            width: "100%",
                          }}
                        >
                          Ship To
                        </Text>
                      )}
                    </View>
                    <View style={{ padding: "10px" }}>
                      {UserChoice?.billTo == "right" && (
                        <View
                          style={{ flexDirection: "", paddingBottom: "3px" }}
                        >
                          <Text
                            style={{
                              fontSize: "10px",
                              fontWeight: "bold",
                            }}
                          >
                            {`${AllData?.CompanyDetails?.name}
                             ${AllData?.CompanyDetails?.address}
                              ${AllData?.CompanyDetails?.mobileNo} 
                              ${AllData?.CompanyDetails?.email} `}
                          </Text>{" "}
                          <Text
                            style={{
                              fontSize: "10px",
                              width: "45%",
                              fontWeight: "bold",
                            }}
                          >
                            {/* {`${invoiceData?.adminDetail?.currentAddress} `}
                            {`${invoiceData?.adminDetail?.State} `} */}
                          </Text>{" "}
                        </View>
                      )}
                      {UserChoice?.shipto == "right" && (
                        <View
                          style={{ flexDirection: "", paddingBottom: "3px" }}
                        >
                          <Text
                            style={{
                              fontSize: "10px",
                              fontWeight: "bold",
                            }}
                          >
                            {`${BilData?.ViewOneData?.warehouseToId?.firstName}
                             ${BilData?.ViewOneData?.warehouseToId?.City}
                               ${BilData?.ViewOneData?.warehouseToId?.State} 
                                ${BilData?.ViewOneData?.warehouseToId?.Country} 
                                ${BilData?.ViewOneData?.warehouseToId?.email}`}
                          </Text>{" "}
                          <Text
                            style={{
                              fontSize: "10px",
                              width: "45%",
                              fontWeight: "bold",
                            }}
                          ></Text>{" "}
                        </View>
                      )}
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    // padding: "4px",
                    width: "34%",
                    borderLeft: "1px solid black",
                  }}
                >
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        backgroundColor: "grey",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          fontWeight: "1000",
                          width: "100%",
                        }}
                      >
                        Invoice Details
                      </Text>{" "}
                    </View>
                    <View style={{ marginTop: "2px", padding: "2px 2px" }}>
                      {/* <View
                        style={{ flexDirection: "row", paddingBottom: "3px" }}>
                        <Text
                          style={{
                            fontSize: "9px",
                            fontWeight: "bold",
                          }}>
                          Receipt No
                        </Text>{" "}
                        <Text style={{ fontSize: "9px", fontWeight: "bold" }}>
                          : {invoiceData?._id}
                        </Text>
                      </View> */}
                      <View
                        style={{ flexDirection: "row", paddingBottom: "3px" }}
                      >
                        <Text
                          style={{
                            fontSize: "9px",
                            fontWeight: "bold",
                            width: "50%",
                          }}
                        >
                          Receipt Date
                        </Text>{" "}
                        <Text style={{ fontSize: "9px", fontWeight: "bold" }}>
                          : {currentDate && currentDate}
                        </Text>
                      </View>
                      <View
                        style={{ flexDirection: "row", paddingBottom: "3px" }}
                      >
                        <Text
                          style={{
                            fontSize: "9px",
                            fontWeight: "bold",
                            width: "50%",
                          }}
                        >
                          Receipt Time
                        </Text>{" "}
                        <Text style={{ fontSize: "9px", fontWeight: "bold" }}>
                          :{" "}
                          {currentDate &&
                            curentDate.toTimeString().split(" ")[0]}
                        </Text>
                      </View>
                      <View
                        style={{ flexDirection: "row", paddingBottom: "3px" }}
                      >
                        <Text
                          style={{
                            fontSize: "8px",
                            fontWeight: "bold",
                            width: "50%",
                          }}
                        >
                          Term
                        </Text>{" "}
                        <Text style={{ fontSize: "8px", fontWeight: "bold" }}>
                          : Due on Receipt
                        </Text>
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
                }}
              >
                <View
                  style={{
                    width: "4%",
                    padding: "5px 2px",
                    justifyContent: "center",

                    borderRight: "1px solid black",
                  }}
                >
                  <Text
                    style={{
                      fontSize: "9px",
                      color: "black",
                      fontWeight: "1000",
                      marginLeft: "3px",
                    }}
                  >
                    #
                  </Text>
                </View>
                {/* <View
                style={{
                  width: "10%",
                  padding: "5px 2px",
                  borderRight: "1px solid black",
                }}
              >
                <Text
                  style={{
                    fontSize: "10px",
                    color: "black",
                    fontWeight: "1000",
                    marginLeft: "5px",
                  }}
                >
                  PO Number
                </Text>
              </View> */}
                {/* <View
                  style={{
                    width: "12%",
                    padding: "5px 2px",

                    borderRight: "1px solid black",
                  }}
                >
                  <Text
                    style={{
                      fontSize: "10px",
                      fontWeight: "1000",
                      color: "black",

                      marginLeft: "5px",
                    }}
                  >
                    PO No.
                  </Text>
                </View> */}
                {/* <View
                  style={{
                    width: "13%",
                    padding: "5px 2px",

                    borderRight: "1px solid black",
                  }}
                >
                  <Text
                    style={{
                      fontSize: "10px",
                      color: "black",
                      fontWeight: "1000",
                      marginLeft: "5px",
                    }}
                  >
                    Client Code
                  </Text>
                </View> */}
                {/* <View
                  style={{
                    width: "13%",
                    padding: "5px 2px",

                    borderRight: "1px solid black",
                  }}
                >
                  <Text
                    style={{
                      fontSize: "10px",
                      color: "black",
                      fontWeight: "1000",
                      marginLeft: "5px",
                    }}
                  >
                    State name
                  </Text>
                </View> */}
                <View
                  style={{
                    width: "18%",
                    padding: "5px 2px",
                    justifyContent: "center",

                    borderRight: "1px solid black",
                  }}
                >
                  <Text
                    style={{
                      fontSize: "9px",
                      color: "black",
                      fontWeight: "1000",
                      marginLeft: "5px",
                    }}
                  >
                    Product Name
                  </Text>
                </View>
                <View
                  style={{
                    width: "12%",
                    padding: "5px 2px",
                    justifyContent: "center",

                    borderRight: "1px solid black",
                  }}
                >
                  <Text
                    style={{
                      fontSize: "9px",
                      color: "black",
                      fontWeight: "1000",
                      marginLeft: "5px",
                    }}
                  >
                    HSN/SAC
                  </Text>
                </View>
                <View
                  style={{
                    width: "12%",
                    marginRight: "2px",
                    justifyContent: "center",

                    padding: "5px 2px",
                    borderRight: "1px solid black",
                  }}
                >
                  <Text
                    style={{
                      fontSize: "9px",
                      color: "black",
                      fontWeight: "1000",
                      marginLeft: "5px",
                    }}
                  >
                    Qty
                  </Text>
                </View>
                <View
                  style={{
                    width: "12%",
                    marginRight: "2px",
                    justifyContent: "center",

                    padding: "5px 2px",
                    borderRight: "1px solid black",
                  }}
                >
                  <Text
                    style={{
                      fontSize: "9px",
                      color: "black",
                      fontWeight: "1000",
                      marginLeft: "5px",
                    }}
                  >
                    Size
                  </Text>
                </View>
                <View
                  style={{
                    width: "12%",
                    marginRight: "2px",
                    justifyContent: "center",

                    padding: "5px 2px",
                    borderRight: "1px solid black",
                  }}
                >
                  <Text
                    style={{
                      fontSize: "9px",
                      color: "black",
                      fontWeight: "1000",
                      marginLeft: "5px",
                    }}
                  >
                    Unit Type
                  </Text>
                </View>

                <View
                  style={{
                    width: "12%",
                    marginRight: "2px",
                    justifyContent: "center",

                    padding: "5px 2px",
                    borderRight: "1px solid black",
                  }}
                >
                  <Text
                    style={{
                      fontSize: "9px",
                      color: "black",
                      fontWeight: "1000",
                      marginLeft: "5px",
                    }}
                  >
                    Price
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    width: "12%",
                    marginRight: "2px",
                    padding: "5px 2px",

                    //   borderRight: "1px solid black",
                  }}
                >
                  <Text
                    style={{
                      fontSize: "9px",
                      color: "black",
                      fontWeight: "1000",
                    }}
                  >
                    Amount
                  </Text>
                </View>
              </View>
              {tableList &&
                tableList?.map((ele, i) => (
                  <View
                    key={i}
                    style={{
                      flexDirection: "row",
                      borderRight: "1px solid black",
                      borderLeft: "1px solid black",
                      height: "20px",
                    }}
                  >
                    <View
                      style={{
                        width: "4%",
                        // padding: "2px 2px",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: "9px",
                          fontWeight: "1000",
                          marginLeft: "3px",
                        }}
                      >
                        {i + 1}
                      </Text>
                    </View>

                    <View
                      style={{
                        width: "18%",
                        // padding: "2px 2px",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: "8px",

                          fontWeight: "1000",
                          marginLeft: "5px",
                        }}
                      >
                        {ele?.product?.Product_Title}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "12%",
                        padding: "5px 2px",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: "8px",

                          fontWeight: "1000",
                          marginLeft: "5px",
                        }}
                      >
                        {ele?.product?.HSN_Code}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "12%",
                        marginRight: "2px",
                        padding: "5px 2px",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: "9px",
                          fontWeight: "1000",

                          marginLeft: "5px",
                        }}
                      >
                        {ele?.transferQty}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "12%",
                        marginRight: "2px",
                        padding: "5px 2px",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: "9px",

                          fontWeight: "1000",
                          marginLeft: "4px",
                        }}
                      >
                        {ele?.Size}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "12%",
                        marginRight: "2px",
                        padding: "2px 2px",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: "8px",
                          fontWeight: "1000",
                          marginLeft: "4px",
                        }}
                      >
                        {ele?.unitType && ele?.unitType?.split("(")[0]}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "12%",
                        marginRight: "2px",
                        padding: "2px 2px",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: "9px",
                          fontWeight: "1000",
                          marginLeft: "4px",
                        }}
                      >
                        {ele?.price}
                      </Text>
                    </View>
                    <View
                      style={{
                        justifyContent: "flex-end",
                        flexDirection: "row",
                        width: "12%",
                        marginRight: "2px",
                        padding: "2px 2px",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: "9px",
                          fontWeight: "1000",
                          // marginLeft: "5px",
                        }}
                      >
                        {ele?.totalPrice}
                      </Text>
                    </View>
                  </View>
                ))}

              <View
                style={{
                  flexDirection: "row",
                  borderRight: "1px solid black",
                  borderLeft: "1px solid black",
                  borderTop: "1px solid black",
                  borderBottom: "1px solid black",
                }}
              >
                <View
                  style={{
                    width: "55%",
                    padding: "10px 10px",
                    borderRight: "1px solid black",
                    //   height: "250px",
                  }}
                >
                  <View style={{ flexDirection: "", paddingBottom: "3px" }}>
                    <Text
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      Total In Words
                    </Text>{" "}
                    <Text
                      style={{
                        fontSize: "12px",
                        width: "95%",
                        fontWeight: "bold",
                      }}
                    >
                      {CurrentWords}
                    </Text>{" "}
                  </View>
                  {/* <View style={{ margingTop: "50px" }}>
                  <Text style={{ fontSize: "8px", marginTop: "15px" }}>
                    Pay To: Jupitech Management Pvt Ltd.
                  </Text>
                  <Text style={{ fontSize: "8px", marginTop: "3px" }}>
                    Bank: Kotak Mahindra
                  </Text>
                  <Text style={{ fontSize: "8px", marginTop: "3px" }}>
                    A/c No.: 54623465
                  </Text>
                  <Text style={{ fontSize: "8px", marginTop: "3px" }}>
                    IFSC: Kotak0001251
                  </Text>
                  <Text style={{ fontSize: "8px", marginTop: "3px" }}>
                    IFSC: MAROLI , ANDHERI EAST
                  </Text>
                </View> */}
                  <View
                    style={
                      {
                        // margingTop: "50px",
                        // marginBottom: "40px",
                      }
                    }
                  >
                    <Text style={{ fontSize: "10px", marginTop: "15px" }}>
                      Terms and Conditions
                    </Text>
                    <Text style={{ fontSize: "9px", marginTop: "3px" }}>
                      1. Paid Amount/Payment are not refundable in any case.
                    </Text>
                    <Text style={{ fontSize: "9px", marginTop: "3px" }}>
                      2. Pay Payment under 30 days.
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    width: "45%",
                    height: "120px",
                  }}
                >
                  <View style={{ height: "120px" }}>
                    <View
                      style={{
                        padding: "10px",

                        height: "120px",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          gap: "10px",
                          paddingBottom: "3px",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: "10px",
                            fontWeight: "bold",

                            marginBottom: "6px",
                          }}
                        >
                          Discount :
                        </Text>{" "}
                        <Text
                          style={{
                            fontSize: "10px",
                            fontWeight: "bold",

                            marginBottom: "6px",
                          }}
                        >
                          {AllCharges?.discount_value}0.00
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          gap: "10px",
                          paddingBottom: "3px",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: "10px",
                            fontWeight: "bold",
                            marginBottom: "6px",
                          }}
                        >
                          Sub Total
                        </Text>{" "}
                        <Text
                          style={{
                            fontSize: "10px",
                            fontWeight: "bold",
                            marginBottom: "6px",
                          }}
                        >
                          {AllCharges?.subtotal}0.00
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          gap: "10px",
                          paddingBottom: "3px",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: "10px",
                            fontWeight: "bold",
                            // width: "70%",
                            marginBottom: "6px",
                          }}
                        >
                          CGST({AllCharges?.cgst}0.00%)
                        </Text>{" "}
                        <Text
                          style={{
                            fontSize: "10px",
                            fontWeight: "bold",

                            marginBottom: "6px",
                          }}
                        >
                          {AllCharges?.totcgst}0.00
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          gap: "10px",
                          paddingBottom: "3px",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: "10px",
                            fontWeight: "bold",

                            marginBottom: "6px",
                          }}
                        >
                          SGST( {AllCharges?.sgst}0.00%)
                        </Text>{" "}
                        <Text
                          style={{
                            fontSize: "10px",
                            fontWeight: "bold",

                            marginBottom: "6px",
                          }}
                        >
                          {AllCharges?.totsgst}0.00
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          gap: "10px",
                          paddingBottom: "3px",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: "10px",
                            fontWeight: "bold",

                            marginBottom: "6px",
                          }}
                        >
                          Courier Charges
                        </Text>{" "}
                        <Text
                          style={{
                            fontSize: "10px",
                            fontWeight: "bold",

                            marginBottom: "6px",
                          }}
                        >
                          {AllCharges?.delivery_charges}0.00
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          gap: "10px",
                          paddingBottom: "3px",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: "10px",
                            fontWeight: "bold",

                            marginBottom: "6px",
                          }}
                        >
                          Other Charges
                        </Text>{" "}
                        <Text
                          style={{
                            fontSize: "10px",
                            fontWeight: "bold",

                            marginBottom: "6px",
                          }}
                        >
                          {AllCharges?.other_charges}0.00
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          gap: "10px",
                          paddingBottom: "3px",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: "11px",
                            fontWeight: "bold",
                            marginTop: "2px",
                          }}
                        >
                          Grand Total :
                        </Text>{" "}
                        <Text
                          style={{
                            fontSize: "11px",
                            fontWeight: "bold",
                            marginTop: "2px",
                          }}
                        >
                          {BilData?.ViewOneData?.grandTotal &&
                            BilData?.ViewOneData?.grandTotal}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View>
                    {/* <View style={{ padding: "3px 3px ", height: "180px" }}>
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
                      <Text style={{ fontSize: "10px" }}>
                        Authorized Signature
                      </Text>
                    </View>
                  </View> */}
                  </View>
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",

                // alignItems: "flex-end",
              }}
            >
              <View
                style={{
                  padding: "3px 3px ",
                  height: "180px",
                  borderBottom: "1px solid black",
                  borderLeft: "1px solid black",
                  borderRight: "1px solid black",
                  width: "45%",
                }}
              >
                <Text style={{ fontSize: "11px" }}> For</Text>
                <Text
                  style={{
                    fontSize: "12px",
                    marginTop: "8px",
                    marginBottom: "8px",
                  }}
                >
                  {" "}
                  {AllData?.CompanyDetails?.name &&
                    AllData?.CompanyDetails?.name}
                </Text>
                <View>
                  {AllData?.CompanyDetails?.signature &&
                  AllData?.CompanyDetails?.signature ? (
                    <>
                      <Image
                        style={{ height: "50px", marginTop: "15px" }}
                        src={`${Image_URL}/Images/${AllData?.CompanyDetails?.signature}`}
                        width="200px"
                        height="200px"
                      ></Image>
                    </>
                  ) : (
                    <>
                      <Image
                        style={{ height: "50px", marginTop: "15px" }}
                        src={signature}
                        width="200px"
                        height="200px"
                      ></Image>
                    </>
                  )}
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    marginBottom: "2px",
                    marginTop: "20px",
                    justifyContent: "center",
                  }}
                >
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

export default StockTrxPOinvoice;
