import { API_URL } from "@/constants/CONSTANTS";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { useEffect, useState } from "react";
import { Platform, View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { SQIPCardEntry, SQIPCore } from "react-native-square-in-app-payments";

//import { SQIPCardEntry, SQIPCore } from "react-native-square-in-app-payments";

type BuyerVerificationErrorCallback = (error: Error) => Promise<void>;


export default function Payments() {
  const [loader, setLoader] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const item = useLocalSearchParams();
  const onStartCardEntry = async () => {
    //console.log("onStartCardEntry");

    if (Platform.OS === "ios") {
      await SQIPCardEntry.setIOSCardEntryTheme({
        saveButtonFont: {
          size: 25,
          name: "Pay"
        },
        saveButtonTitle: "Pay 💳 ",
        keyboardAppearance: "Light",
        saveButtonTextColor: {
          r: 255,
          g: 0,
          b: 125,
          a: 0.5,
        },
      });
    }

    const verificationDetails = {
      collectPostalCode: true,
      squareLocationId: "LDVGAR2ZQ2RFN",
      amount: bookingDetails.price,
      billingContact: {
        addressLines: ["123 Main Street", "Apartment 1"],
        familyName: "Doe",
        givenName: "John",
        email: "jondoe@gmail.com",
        country: "GB",
        phone: "3214563987",
        region: "LND",
        city: "London",
      },
      currencyCode: "USD",
      intent: "CHARGE",
    };

    // await SQIPCardEntry.startCardEntryFlow(
    //   { collectPostalCode: true },
    //   onCardNonceRequestSuccess,
    //   onCardEntryCancel
    // );

    await SQIPCardEntry.startCardEntryFlowWithBuyerVerification(
      verificationDetails,
      onBuyerVerificationSuccess, // onBuyerVerificationSuccess
      onBuyerVerificationFailure, // onBuyerVerificationFailure
      onCardEntryCancel
    );
  };

  const onBuyerVerificationFailure:any = async (error: any) => {
    // Your code to handle the error
    console.error("Verification failed:", error);
    // Do any other necessary work like showing an alert or logging the error.
  };

  // const onBuyerVerificationFailure:BuyerVerificationErrorCallback = async (error:any,context:any) => {
  //   //console.log("onBuyerVerificationFailure");
  //   await SQIPCardEntry.showCardNonceProcessingError(error.message);
  // };

  const onBuyerVerificationSuccess = async (buyerVerificationDetails:any) => {
    setLoader(true);

    // console.log({
    //   token: buyerVerificationDetails.nonce,
    //   verificationToken: buyerVerificationDetails.token,
    // });
    fetch("https://payment.vbogs.com" + "/createPayment", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: buyerVerificationDetails.nonce,
        verificationToken: buyerVerificationDetails.token,
        amount: bookingDetails.price,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        setLoader(false);
        router.push(`/bookconfirmation/${responseJson.id}`);
        // navigation.navigate("bookingConfirmation", {
        //   bookingId: responseJson.id,
        // });
      })
      .catch((error) => {
        setLoader(false);
        console.error(error);
      });
  };

  // const onBuyerVerificationSuccess = async (buyerVerificationDetails) => {
  //   if (
  //     chargeServerHostIsSet() &&
  //     buyerVerificationDetails.nonce !==
  //       "ccof:customer-card-id-requires-verification"
  //   ) {
  //     try {
  //       await chargeCardNonce(
  //         buyerVerificationDetails.nonce,
  //         buyerVerificationDetails.token
  //       );
  //       setAlertValue(
  //         "Congratulation, Your order was successful",
  //         "Go to your Square dashbord to see this order reflected in the sales tab.",
  //         true
  //       );
  //     } catch (error) {
  //       setAlertValue("Error processing card payment", error.message, false);
  //     }
  //   } else {
  //     printCurlCommand(
  //       buyerVerificationDetails.nonce,
  //       SQUARE_APP_ID,
  //       buyerVerificationDetails.token
  //     );
  //     setAlertValue(
  //       "Nonce and verification token generated but not charged",
  //       "Check your console for a CURL command to charge the nonce, or replace CHARGE_SERVER_HOST with your server host.",
  //       true
  //     );
  //   }
  // };

  const onCardNonceRequestSuccess = async (cardDetails:any) => {
    //console.log("onCardNonceRequestSuccess");
    //console.log(cardDetails);
    try {
      // take payment with the card details
      //await chargeCard(cardDetails);

      fetch(API_URL + "/payments2", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: bookingDetails.price,
          token: cardDetails.nonce,
          nonce: cardDetails.nonce,
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          setLoader(false);
          //console.log(responseJson);
        })
        .catch((error) => {
          setLoader(false);
          console.error(error);
        });

      // payment finished successfully
      // you must call this method to close card entry
      await SQIPCardEntry.completeCardEntry(onCardEntryComplete());
    } catch (ex:any) {
      // payment failed to complete due to error
      // notify card entry to show processing error
      await SQIPCardEntry.showCardNonceProcessingError(ex.message);
    }
  };

  const onCardEntryComplete:any = () => {
    console.log("onCardEntryComplete");
  };

  const onCardEntryCancel = () => {
    console.log("onCardEntryCancel");
  };

  const cardTokenizeResponseReceived = (token:any, buyer:any) => {
    console.log(token, buyer);
  };

  const loadBookingDetails = (bookingId:any) => {
    setLoader(true);
    fetch(API_URL + "/bookings/" + bookingId, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setLoader(false);
        setBookingDetails(responseJson);
        //console.log(responseJson);
      })
      .catch((error) => {
        setLoader(false);
        console.error(error);
      });
  };

  useEffect(() => {
    if(item && item.id) {
      loadBookingDetails(item.id);
    }
  }, [item.id]);

  return (
    <View>
      {bookingDetails && bookingDetails.id && (
        <>
          <Text style={styles.title}>Booking Details</Text>
          <Text style={styles.item}>Booking ID: {bookingDetails.id}</Text>
          <Text style={styles.item}>
            Booking Date: {bookingDetails.bookingDate}
          </Text>
          <Text style={styles.item}>Price: USD {bookingDetails.price}</Text>
          <Text style={styles.item}>Ground: {bookingDetails.groundName}</Text>
          <Text style={styles.item}>
            Customer Name: {bookingDetails.customerName}
          </Text>
          <Button
            style={styles.marginTopBtn}
            icon="camera"
            mode="contained"
            onPress={() => onStartCardEntry()}
          >
            Pay
          </Button>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  item: {
    padding: 10,
    margin: 5,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    fontSize: 13,
    fontWeight: "bold",
  },
  marginTopBtn: {
    margin: 5,
  },
});
