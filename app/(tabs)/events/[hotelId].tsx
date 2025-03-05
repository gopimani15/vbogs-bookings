import { API_URL, IMG_PATH } from "@/constants/CONSTANTS";
import { router, useLocalSearchParams } from "expo-router";
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
  ScrollView,
  FlatList,
  ActivityIndicator,
  Button,
} from "react-native";
import { Chip } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

function Events() {
  const [hotels, setHotels] = useState<any>(null);
  const [loader, setLoader] = useState<any>(false);

  const item = useLocalSearchParams();

  const loadHotels = (hotelId:any) => {
    setLoader(true);
    let url = API_URL + "/events";
    if (hotelId) {
      url = API_URL + "/events/byHotel/" + hotelId;
    }
    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setLoader(false);
        setHotels(responseJson);
      })
      .catch((error) => {
        setLoader(false);
        console.error(error);
      });
  };

  useEffect(() => {
    if (item && item.hotelId) {
      loadHotels(item.hotelId);
    } else {
      loadHotels(null);
    }
  }, [item.hotelId]);

  const dateToYMD = (date:any) => {
    let dateObj = new Date(date);
    var strArray = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var d = dateObj.getDate();
    var m = strArray[dateObj.getMonth()];
    var y = dateObj.getFullYear();
    return "" + (d <= 9 ? "0" + d : d) + "-" + m + "-" + y;
  };

  const renderItem = ({ item }:any) => (
    <View style={styles.hotelItem}>
      <Image
        style={styles.tinyLogo}
        source={{
          uri: IMG_PATH + "/" + item.image,
        }}
      />
      <View style={styles.titleView}>
        <Text
          style={styles.title}
          onPress={() =>
            router.push(`/eventdetails/${item.id}`)
          }
        >
          {item.eventName}
        </Text>
      </View>

      <Text style={styles.about}>{item.eventTitle}</Text>
      {/* <Button style={styles.bookNow} title="Book Now"></Button> */}
      <View style={styles.details}>
        <Chip icon="music" style={{ margin: 5, width: "auto" }} compact={true}>
          {item.eventType}
        </Chip>
        <Chip
          icon="account-star"
          style={{ margin: 5, width: "auto" }}
          compact={true}
        >
          {item.eventBy}
        </Chip>
        <Chip
          style={{ margin: 5, width: "auto" }}
          icon="calendar"
          compact={true}
        >
          {dateToYMD(item.eventDate)}
        </Chip>
      </View>
    </View>
  );
  return (
    <ImageBackground
      imageStyle={{ opacity: 0.5 }}
      style={styles.background}
      source={require("../../../assets/images/events_bg.jpg")}
    >
      {loader && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      {(!hotels || hotels.length === 0) && (
        <Text style={{ fontSize: 14, textAlign: "center", padding: 10 }}>
          No events found.
        </Text>
      )}
      <FlatList
        data={hotels}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </ImageBackground>
  );
}

export default Events;

const styles = StyleSheet.create({
  tinyLogo: {
    width: "100%",
    height: 150,
  },
  background: {
    height: "100%",
  },
  details: {
    display: "flex",
    flexDirection: "row",
    padding: 5,
    flexWrap: "wrap",
  },
  titleView: {
    display: "flex",
  },
  price: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  bookNow: {
    position: "absolute",
    bottom: 5,
    right: 0,
  },
  list: {
    margin: 2,
  },
  hotelItem: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    backgroundColor: "#fff",
    margin: 5,
  },
  about: {
    fontSize: 13,
    paddingTop: 5,
    paddingBottom: 10,
    color: "grey",
    marginTop: 5,
    marginLeft: 10,
  },
  titleCont: {
    alignItems: "center",
    marginTop: 2,
  },
  title: {
    fontSize: 20,
    marginTop: 10,
    marginLeft: 10,
  },
  caption: {
    color: "grey",
    paddingTop: 5,
  },
  label: {
    margin: 12,
    marginBottom: 0,
  },
  button: {
    color: "#fff",
    flex: 1,
    margin: 12,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#f5694d",
    textAlign: "center",
    alignItems: "center",
  },
  loginText: {
    color: "#fff",
  },
  container: {
    flex: 1,
    // justifyContent: "center",
    margin: 10,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  loader: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.6,
  },
});
