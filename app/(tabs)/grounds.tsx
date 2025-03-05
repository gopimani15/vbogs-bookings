import { API_URL, IMG_PATH } from "@/constants/CONSTANTS";
import { router } from "expo-router";
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


function GroundsScreen() {
  const [grounds, setGrounds] = useState<any>(null);
  const [loader, setLoader] = useState(false);
  const loadGrounds = () => {
    setLoader(true);
    fetch(API_URL + "/grounds", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setLoader(false);
        setGrounds(responseJson);
      })
      .catch((error) => {
        setLoader(false);
        console.error(error);
      });
  };

  useEffect(() => {
    loadGrounds();
  }, []);

  const navigateToDetails = (itemId:any) => {
    //const pushAction = StackActions.push("resortdetails", { hotelId: itemId });

    //router.push("resortdetails", { hotelId: itemId });
  };

  const renderItem = ({ item, key }:any) => (
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
            router.push(`/grounddetails/${item.id}`)
          }
        >
          {item.name}
        </Text>
        <Text style={styles.price}>USD {item.price}</Text>
      </View>

      <Text style={styles.about}>{item.address}</Text>
    </View>
  );
  return (
    <>
      {loader && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      {(!grounds || grounds.length === 0) && (
        <Text style={{ fontSize: 14, textAlign: "center", padding: 10 }}>
          No Grounds found.
        </Text>
      )}
      <FlatList
        data={grounds}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </>
  );
}

export default GroundsScreen;

const styles = StyleSheet.create({
  tinyLogo: {
    width: "100%",
    height: 150,
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
    fontSize: 18,
    color: "#a2299f",
    fontWeight: "600",
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
