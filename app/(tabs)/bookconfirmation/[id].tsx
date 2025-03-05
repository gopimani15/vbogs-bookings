import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
  Button,
} from "react-native";

import Icon from "react-native-vector-icons/FontAwesome";

function BookingConfirmation() {
  const [bookingId, setBookingId] = useState("");

  const item:any = useLocalSearchParams();

  useEffect(() => {
    if(item && item.id) {
      setBookingId(item.id);
    }
  }, [item.id]);
  return (
    <View style={styles.confirmation}>
      <View style={styles.bookingCard}>
        <Icon name="check" size={30} color="green" />
        <Text>Booking Complete!</Text>
        {bookingId && <Text>(#{bookingId})</Text>}

        <View style={styles.emailCont}>
          <Text>
            Confirmation email has been sent to gopi.manikanta15@gmail.com
          </Text>
        </View>
        <View style={styles.thankyou}>
          <Text style={styles.thankyoutitle}>Thank You</Text>
          <Text>
            Thank you for the booking.We look forward to welcoming you to out
            venue soon, and in meantime if you have any questions please do not
            hesitate to get in touch with us via phone or email ans we'll be
            happy to hear from you.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles:any = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  bookingCard: {
    width: "auto",
    backgroundColor: "#fff",
    padding: 10,
    margin: 10,
    textAlign: "center",
    display: "flex",
    alignItems: "center",
  },
  emailCont: {
    padding: 10,
    textAlign: "center",
  },
  thankyou: {
    textAlign: "center",
    width: "auto",
    margin: 10,
  },
  thankyoutitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default BookingConfirmation;
