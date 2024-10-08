import React from "react";
import { Text, View } from "@react-pdf/renderer";

const SalesProductList = ({ invoiceData }) => {
  return (
    <>
      {invoiceData?.orderItems?.map((ele, i) => {
        return (
          <View
            key={i}
            style={{
              marginTop: "1px",
              flexDirection: "row",
              borderRight: "1px solid black",
              borderLeft: "1px solid black",
              height: "20px",
            }}>
            <View
              style={{
                width: "3%",
                padding: "2px 2px",
              }}>
              <Text
                style={{
                  fontSize: "8px",
                  fontWeight: "1000",
                  marginLeft: "5px",
                }}>
                {i + 1}
              </Text>
            </View>

            <View
              style={{
                width: "20%",
                flexDirection: "row",
                justifyContent: "center",
                padding: "2px 2px",
              }}>
              <Text
                style={{
                  fontSize: "8px",
                  fontWeight: "1000",
                  width: "95%",
                  marginLeft: "5px",
                }}>
                {ele?.productId?.Product_Title}
              </Text>
            </View>
            <View
              style={{
                width: "10%",
                padding: "2px 2px",
                flexDirection: "row",
                justifyContent: "center",
              }}>
              <Text
                style={{
                  fontSize: "10px",

                  fontWeight: "1000",
                  marginLeft: "3px",
                }}>
                {ele?.productId?.HSN_Code}
              </Text>
            </View>
            <View
              style={{
                width: "10%",
                marginRight: "2px",
                flexDirection: "row",
                justifyContent: "center",
                padding: "2px 2px",
              }}>
              <Text
                style={{
                  fontSize: "10px",
                  fontWeight: "1000",
                  marginLeft: "5px",
                }}>
                {ele?.qty?.toFixed(2)}
                {/* {ele?.qty / ele?.productId?.secondarySize} */}
              </Text>
            </View>
            <View
              style={{
                width: "12%",
                flexDirection: "row",
                justifyContent: "center",
                padding: "2px 2px",
              }}>
              <Text
                style={{
                  fontSize: "8px",
                  fontWeight: "1000",
                  marginLeft: "3px",
                }}>
                {ele?.productId?.primaryUnit}
              </Text>
            </View>
            <View
              style={{
                width: "15%",
                flexDirection: "row",
                justifyContent: "center",
                padding: "2px 2px",
              }}>
              <Text
                style={{
                  fontSize: "10px",
                  justifyContent: "flex-end",
                  fontWeight: "1000",
                  marginLeft: "5px",
                }}>
                {invoiceData?.purchaseStatus && invoiceData?.purchaseStatus ? (
                  <>
                    {(
                      ele?.price /
                      ((100 + ele?.productId?.GSTRate) / 100)
                    ).toFixed(2)}
                  </>
                ) : (
                  <>
                    {ele?.discountPercentage >= 0 ? (
                      <>
                        {(
                          ele?.price /
                          (((100 + ele?.discountPercentage) / 100) *
                            ((100 + ele?.productId?.GSTRate) / 100))
                        ).toFixed(2)}
                      </>
                    ) : (
                      <>
                        {(
                          ele?.price /
                          ((100 + ele?.productId?.GSTRate) / 100)
                        ).toFixed(2)}
                      </>
                    )}
                  </>
                )}
                {/* {ele?.discountPercentage >= 0 ? (
                  <>
                    {(
                      ele?.price /
                      (((100 + ele?.discountPercentage) / 100) *
                        ((100 + ele?.productId?.GSTRate) / 100))
                    ).toFixed(2)}
                  </>
                ) : (
                  <>
                    {(
                      ele?.price /
                      ((100 + ele?.productId?.GSTRate) / 100)
                    ).toFixed(2)}
                  </>
                )} */}
              </Text>
            </View>
            {/* <View
            style={{
              width: "8%",
              flexDirection: "row",
              justifyContent: "center",
              padding: "2px 2px",
            }}>
            <Text
              style={{
                fontSize: "10px",
                fontWeight: "1000",
                paddingRight: "20px",

                // justifyContent: "flex-start",
              }}>
              {ele?.discountPercentage}
            </Text>
          </View> */}
            {/* <View
            style={{
              width: "8%",
              flexDirection: "row",
              justifyContent: "center",
              padding: "2px 2px",
            }}>
            <Text
              style={{
                fontSize: "10px",
                justifyContent: "flex-start",
                fontWeight: "1000",
                marginLeft: "5px",
              }}>
              {ele?.productId["GSTRate"]}
            </Text>
          </View> */}

            {/* <View
            style={{
              width: "10%",
              marginRight: "2px",
              padding: "2px 2px",
            }}>
            <Text
              style={{
                fontSize: "10px",
                fontWeight: "1000",
                marginLeft: "5px",
              }}>
              {ele?.Size}
            </Text>
          </View> */}

            <View
              style={{
                width: "17%",
                flexDirection: "row",
                justifyContent: "center",
                padding: "2px 2px",
              }}>
              <Text
                style={{
                  fontSize: "10px",
                  fontWeight: "1000",
                  marginLeft: "5px",
                }}>
                <>
                  {/* {ele?.discountPercentage >= 0 ? (
                    <>
                      {ele?.taxableAmount}
                    </>
                  ) : (
                    <>{Number(ele?.price.toFixed(2))}</>
                  )} */}
                  {ele?.taxableAmount}
                </>
              </Text>
            </View>
          </View>
        );
      })}
    </>
  );
};

export default SalesProductList;
