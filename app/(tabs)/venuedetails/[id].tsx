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
//import Gallery from "react-native-image-gallery";
import { SafeAreaView } from "react-native-safe-area-context";

//import HTMLView from "react-native-htmlview";

import { Chip } from "react-native-paper";
import { Controller, useForm } from "react-hook-form";
//import DatePicker from "react-native-datepicker";
import RenderHtml from "react-native-render-html";
import { API_URL, IMG_PATH } from "@/constants/CONSTANTS";
import { router, useLocalSearchParams } from "expo-router";
import DateTimePicker from '@react-native-community/datetimepicker';


export default function VenueDetails() {
  const [hotels, setHotels] = useState<any>(null);
  const [images, setImages] = useState<any>([]);
  const [loader, setLoader] = useState<any>(false);
  const [bookingDate, setBookingDate] = useState<any>(new Date());
  //const { hotelId } = route.params;

  const { width } = useWindowDimensions();
  const item = useLocalSearchParams();

  const [show, setShow] = useState(false);

  const {
    register,
    setValue,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
    },
  });
  const onSubmit = (data: any) => {
    fetch(API_URL + "/bookings", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
        password: "",
        createdBy: 1,
        updatedBy: 1,
        isActive: 1,
        bookingDate: bookingDate,
        bookingTypeId: item.id,
        bookingType: "hotel",
        status: "Pending",
        slotId: ""
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        Alert.alert("Success", responseJson.message);
        router.push(`/confirmation/${responseJson.bookingId}`)
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const resetForm = () => {
    reset({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
    });
  };

  const loadHotels = (hotelId: any) => {
    setHotels(null);
    if (!hotelId) {
      return false;
    }
    setLoader(true);
    fetch(API_URL + "/hotels/" + hotelId, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        let imgs = [
          {
            img: IMG_PATH + "/" + responseJson.hotelimage,
          },
        ];
        let allImgs = responseJson.images.split(",");
        for (let i = 0; i < allImgs.length; i++) {
          imgs.push({
            img: IMG_PATH + "/" + allImgs[i],
          });
        }
        setImages(imgs);
        setHotels(responseJson);
        setLoader(false);
      })
      .catch((error) => {
        setLoader(false);
        console.error(error);
      });
  };

  useEffect(() => {
    loadHotels(item.id);
  }, [item.id]);

  const showMode = (flag: any) => {
    setShow(true);
  };

  return (
    <>
      <ScrollView style={styles.hotelItem}>
        {loader && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
        {hotels && !loader && (
          <>
            <ImageSlider
              data={images}
              autoPlay={true}
              caroselImageStyle={{ resizeMode: "cover" }}
              // onItemChanged={(item) => console.log("item", item)}
              closeIconColor="#fff"

            />
            <View style={styles.titleView}>
              <Text style={styles.title}>{hotels.name}</Text>
              <Text style={styles.price}>$XXX</Text>
            </View>

            <View>
              <Text style={styles.facility}>Facility </Text>
              {/* icon="information" */}
              <View style={styles.amenities}>
                {hotels &&
                  hotels.amenities &&
                  hotels.amenities.map((item: any) => (
                    <>
                      <Chip
                        style={{ margin: 5, width: "auto" }}
                        compact={true}
                        onPress={() => console.log("Pressed")}
                      >
                        {item.name}
                      </Chip>
                    </>
                  ))}
              </View>
            </View>
            <View>
              <Text style={styles.subTitle}>Location </Text>
              <Text style={styles.about}>
                Lake Maracaibo in Venezuela is 9.80°N and 71.56°W.
              </Text>
            </View>
            <View style={styles.about}>
              <Text style={styles.subTitle}>Description </Text>
              <RenderHtml
                contentWidth={width}
                source={{ html: hotels.description }}
                tagsStyles={{ span: { flex: 1 } }}
              />
            </View>

            <View style={styles.formCont}>
              <View>
                <Text style={styles.formTitle}>Request Booking</Text>
              </View>
              <View style={styles.container}>

                <Text style={styles.label}>First name</Text>
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
                  name="firstName"
                  rules={{ required: true }}
                />
                <Text style={styles.label}>Last name</Text>
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
                  name="lastName"
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

                <Text style={styles.dateLabel}>Booking Date:</Text>

                <DateTimePicker
                      testID="dateTimePicker"
                      value={bookingDate}
                      mode="datetime"
                      display={"spinner"}
                      minimumDate={new Date()}
                      
                      onChange={(event:any, selectedDate:any) => {
                       //alert(selectedDate);
                        setBookingDate(selectedDate);
                      }}
                    />

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSubmit(onSubmit)}

                >
                  <Text style={styles.loginText}>Request Booking</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </>
  );
}


const styles = StyleSheet.create({
  slider: {
    top: -15,
  },
  formCont: {
    backgroundColor: "#fff",
  },
  details: {
    display: "flex",
    flexDirection: "row",
    padding: 5,
  },
  formTitle: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  tinyLogo: {
    width: "100%",
    height: 150,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginLeft: 10,
    textAlign: "center",
  },
  facility: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginLeft: 10,
    textAlign: "center",
  },
  amenities: {
    display: "flex",
    flexDirection: "row",
    margin: 5,
    flexWrap: "wrap",
    textAlign: "center",
    justifyContent: "center",
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
    padding: 10,
    color: "grey",
    marginTop: 5,
    marginLeft: 10,
    textAlign: "center",
  },
  titleCont: {
    alignItems: "center",
    marginTop: 2,
  },
  title: {
    fontSize: 24,
    marginTop: 10,
    marginLeft: 15,
  },
  caption: {
    color: "grey",
    paddingTop: 5,
  },
  label: {
    margin: 12,
    marginBottom: 0,
  },
  dateLabel: {
    margin: 12,
  },
  button: {
    color: "#fff",
    flex: 1,
    margin: 10,
    marginBottom:50,
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#f5694d",
    textAlign: "center",
    alignItems: "center",
  },
  loginText: {
    color: "#fff",
    textTransform: "uppercase",
    fontSize: 14,
    fontWeight: "bold",
    padding: 5,
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
    top: 30,
  },
});
