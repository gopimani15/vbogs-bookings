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
  TextInput,
  useWindowDimensions,
} from "react-native";
import { ImageSlider } from "react-native-image-slider-banner";

import { SafeAreaView } from "react-native-safe-area-context";

import { Chip } from "react-native-paper";

import RenderHtml from "react-native-render-html";
import { Controller, useForm } from "react-hook-form";
import { useLocalSearchParams } from "expo-router";
import { API_URL, IMG_PATH } from "@/constants/CONSTANTS";

function EventDetails() {
  const [event, setEvent] = useState<any>(null);
  const [hotels, setHotels] = useState<any>(null);
  const [hotelId, setHotelId] = useState<any>(null);
  const [loader, setLoader] = useState<any>(false);
  const { width } = useWindowDimensions();

  const item = useLocalSearchParams();
  const {
    register,
    setValue,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();
  const resetForm = () => {
    reset({
      name: "",
      noOfAdults: "",
      noOfChilds: "",
      phone: "",
      email: "",
      eventId: "",
    });
  };
  const onSubmit = (data:any) => {
    fetch(API_URL + "/eventMembers", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        phone: data.phone,
        email: data.email,
        noOfAdults: data.noOfAdults,
        noOfChilds: data.noOfChilds,
        createdBy: 1,
        updatedBy: 1,
        isActive: 1,
        eventId: item.id,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        Alert.alert("Success", "Comment posted successfully.");
        resetForm();
        //console.log("[js] movies: ", responseJson);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const loadEventDetails = (eventId:any) => {
    setLoader(true);
    fetch(API_URL + "/events/" + eventId, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setLoader(false);
        setEvent(responseJson);
      })
      .catch((error) => {
        setLoader(false);
        console.error(error);
      });
  };

  const loadHotels = () => {
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
    //alert(JSON.stringify(route.params.hotelId));
    loadEventDetails(item.id);
    loadHotels();
  }, [item.id]);

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

  // const onChange = (e: React.FormEvent<HTMLInputElement>) => {
  //   setHotelId(e.currentTarget.value);
  // };
  // const Select = React.forwardRef(({ onChange, onBlur, name, label }, ref) => (
  //   <>
  //     <View style={styles.selectBox}>
  //       <label>{label}</label>
  //       <select
  //         style={{ padding: 10 }}
  //         name={name}
  //         ref={ref}
  //         onChange={onChange}
  //         onBlur={onBlur}
  //       >
  //         {hotels &&
  //           hotels.map((hotel) => (
  //             <option value={hotel.id}>{hotel.name}</option>
  //           ))}
  //       </select>
  //     </View>
  //   </>
  // ));

  return (
    <>
      {loader && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      {event && (
        <ScrollView style={styles.hotelItem}>
          <>
            <ImageSlider
              data={[
                {
                  img: IMG_PATH + "/" + event.image,
                },
              ]}
              autoPlay={true}
              caroselImageStyle={{ resizeMode: "cover" }}
              // onItemChanged={(item) => console.log("item", item)}
              closeIconColor="#fff"
              style={styles.slider}
            />
            <View style={styles.titleView}>
              <Text style={styles.title}>{event.eventName}</Text>
            </View>
            <View style={styles.details}>
              <Chip
                icon="music"
                style={{ margin: 5, width: "auto" }}
                compact={true}
              >
                {event.eventType}
              </Chip>
              <Chip
                icon="account-star"
                style={{ margin: 5, width: "auto" }}
                compact={true}
              >
                {event.eventBy}
              </Chip>
              <Chip
                style={{ margin: 5, width: "auto" }}
                icon="calendar"
                compact={true}
              >
                {dateToYMD(event.eventDate)}
              </Chip>
            </View>
            <View style={styles.description}>
              <RenderHtml
                contentWidth={width}
                source={{ html: event.description }}
              />
            </View>
            <View>
              <Text style={styles.formTitle}>Leave Comment</Text>
            </View>
            <View style={styles.container}>
              <Text style={styles.label}>Name</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                  />
                )}
                name="name"
                rules={{ required: true }}
              />
              <Text style={styles.label}>Mobile</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    onBlur={onBlur}
                    keyboardType="number-pad"
                    onChangeText={(value) => onChange(value)}
                    value={value}
                    maxLength={10}
                  />
                )}
                name="phone"
                rules={{ required: true }}
              />
              <Text style={styles.label}>Email</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    keyboardType="email-address"
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                  />
                )}
                name="email"
                rules={{ required: true }}
              />
              <Text style={styles.label}>No Of Adults</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                  />
                )}
                name="noOfAdults"
                rules={{ required: true }}
              />
              <Text style={styles.label}>No Of Childs</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                  />
                )}
                name="noOfChilds"
                rules={{ required: true }}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit(onSubmit)}
              >
                <Text style={styles.loginText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </>
        </ScrollView>
      )}
    </>
  );
}

export default EventDetails;

const styles = StyleSheet.create({
  slider: {
    top: -15,
  },
  selectBox: {
    margin: 10,
  },
  details: {
    display: "flex",
    flexDirection: "row",
    padding: 5,
    flexWrap: "wrap",
  },
  formTitle: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  description: {
    padding: 10,
  },
  tinyLogo: {
    width: "100%",
    height: 150,
  },
  subTitle: {
    fontSize: 18,
    marginTop: 10,
    marginLeft: 10,
  },
  amenities: {
    display: "flex",
    flexDirection: "row",
    margin: 5,
    flexWrap: "wrap",
  },
  titleView: {
    display: "flex",
  },
  price: {
    position: "absolute",
    right: 15,
    top: 15,
  },
  bookNow: {
    position: "absolute",
    bottom: 5,
    right: 0,
  },
  list: {
    margin: 10,
  },
  hotelItem: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    backgroundColor: "#fff",
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
    fontSize: 24,
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
    margin: 10,
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#f5694d",
    textAlign: "center",
    alignItems: "center",
  },
  loginText: {
    color: "#fff",
    textTransform: "uppercase",
    fontSize: 15,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    // justifyContent: "center",
    padding: 10,
    backgroundColor: "#fff",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 20,
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
