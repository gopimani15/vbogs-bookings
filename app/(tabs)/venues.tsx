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
} from "react-native";
import { Button } from "react-native-paper";

import { API_URL, IMG_PATH } from '../../constants/CONSTANTS';
import { useRouter,router } from "expo-router";
import { Pressable } from "react-native-gesture-handler";

export default function Venues() {
  const [hotels, setHotels] = useState(null);
  const [loader, setLoader] = useState(false);
  const loadHotels = () => {
    setLoader(true);
    fetch(API_URL + "/hotels", {
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
    loadHotels();
  }, []);


  const renderItem = ({ item }: any) => (
    <View style={styles.hotelItem}>
      <Image
        style={styles.tinyLogo}
        source={{
          uri: IMG_PATH + "/" + item.hotelimage,
        }}
      />
      <View style={styles.titleView}>
       
          <Text style={styles.title} onPress={() => router.push(`/venuedetails/${item.id}`)}>
            {item.name}
          </Text>
       

        {/* <Text
          style={styles.event}
          onPress={() => navigation.navigate("Events", { hotelId: item.id })}
        >
          <Icon
            name="calendar-check"
            title="Events"
            size={30}
            color="green"
            style={{ fontSize: 24 }}
          />
        </Text> */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            marginLeft: 10,
            marginTop: 10,
          }}
        >
          {/* <Icon
            name="map-marker-alt"
            size={30}
            style={{ fontSize: 18, marginRight: 5 }}
          ></Icon> */}
          <Text>{item.address}</Text>
        </View>
        <View style={styles.amenities}>
          <Button icon="bed" mode="text" onPress={() => console.log("Pressed")}>
            Bed Rooms: {item.beds}
          </Button>
        </View>
        <Text style={styles.price}>USD {item.price}</Text>
      </View>
    </View>
  );
  return (
    <>
      <View style={styles.titleCont}>
        <Text style={styles.caption}>
          Here you can see the all resorts/hotels available. Please click on
          each item to see more details.
        </Text>
      </View>
      {loader && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}

      <FlatList
        data={hotels}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </>
  );
}

const styles = StyleSheet.create({
  tinyLogo: {
    width: 130,
    height: 130,
  },
  titleView: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
  },
  amenities: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },

  event: {
    position: "absolute",
    right: 10,
    top: 10,
  },

  price: {
    position: "absolute",
    bottom: 10,
    right: 10,
    fontSize: 18,
    color: "#a2299f",
    fontWeight: "600",
  },
  events: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  bookNow: {
    position: "absolute",
    bottom: 5,
    right: 0,
  },
  list: {
    margin: 5,
  },
  hotelItem: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    backgroundColor: "#fff",
    margin: 2,
    display: "flex",
    flexDirection: "row",
    padding: 10,
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
