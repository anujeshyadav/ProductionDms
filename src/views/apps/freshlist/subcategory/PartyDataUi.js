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

import { Image_URL } from "../../../../ApiEndPoint/Api";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    padding: 30,
    backgroundColor: "#e2f9ff4a",
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

const PartyDataUi = ({ invoiceData, BilData }) => {
  const curentDate = new Date();
  let day = curentDate.getDate();
  let month = curentDate.getMonth() + 1;
  let year = curentDate.getFullYear();
  let currentDate = `${day}-${month}-${year}`;

  return (
    <>
      <View>
        <View>
          {!!BilData?.PrintData?.purchaseStatus &&
          BilData?.PrintData?.purchaseStatus ? (
            <>
              <View style={{ padding: "5px" }}>
                <Text style={{ fontSize: "13px", fontWeight: "bold" }}>
                  {BilData?.PrintData?.partyId?.CompanyName &&
                    BilData?.PrintData?.partyId?.CompanyName}
                </Text>

                <Text
                  style={{
                    fontSize: "8px",
                    marginTop: "5px",
                    marginBottom: "2px",
                    width: "55%",
                  }}>
                  {BilData?.PrintData?.partyId?.address && (
                    <>
                      {BilData?.PrintData?.partyId?.address &&
                        BilData?.PrintData?.partyId?.address}
                    </>
                  )}
                </Text>
                <Text style={styles.header}></Text>
                <Text style={styles.header}>
                  Email :
                  {BilData?.PrintData?.partyId?.email &&
                    BilData?.PrintData?.partyId?.email}
                </Text>
                <Text style={styles.header}>
                  MobileNo :
                  {BilData?.PrintData?.partyId?.mobileNumber &&
                    BilData?.PrintData?.partyId?.mobileNumber}
                </Text>
                <Text style={styles.GSTIN}>
                  GSTIN :
                  {BilData?.PrintData?.partyId?.gstNumber &&
                    BilData?.PrintData?.partyId?.gstNumber}
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
          ) : null}
        </View>
      </View>
    </>
  );
};

export default PartyDataUi;
