import React from "react";
import { Text, View } from "@react-pdf/renderer";

const TransporterDetails = ({ invoiceData, backGround }) => {
  return (
    <>
      <View
        style={{
          borderTop: "1px solid black",
        }}>
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              backgroundColor: backGround,
            }}>
            <Text
              style={{
                fontSize: "12px",
                marginTop: "5px",
                fontWeight: "bold",
                fontWeight: "1000",
                width: "100%",
              }}>
              Transporter Details
            </Text>{" "}
          </View>
          <View style={{ marginTop: "2px", padding: "2px 2px" }}>
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
                Address :
                {!!invoiceData?.transporter &&
                  invoiceData?.transporter?.address1}
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
                Vehicle No: {invoiceData?.vehicleNo && invoiceData?.vehicleNo}
              </Text>
            </>
          </View>
        </View>
      </View>
    </>
  );
};

export default TransporterDetails;
