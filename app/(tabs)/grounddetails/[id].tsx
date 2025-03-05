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

import { Calendar, CalendarList, Agenda } from "react-native-calendars";

//import HTMLView from "react-native-htmlview";

import { Chip } from "react-native-paper";
import { Controller, useForm } from "react-hook-form";
// import DatePicker from "react-native-datepicker";
import RenderHtml from "react-native-render-html";
import { API_URL, IMG_PATH } from "@/constants/CONSTANTS";
import { router, useLocalSearchParams, useRouter } from "expo-router";

//import SlotPicker from "slotpicker";

function GroundDetails() {
  const [ground, setGround] = useState<any>(null);
  const [slots, setSlots] = useState<any>([]);
  const [images, setImages] = useState<any>([]);
  const [loader, setLoader] = useState<any>(false);
  const [bookingDate, setBookingDate] = useState<any>(new Date());
  const [availableSlots, setAvailableSlots] = useState<any>(null);
  const [slotSelected, setSlotSelected] = useState<any>(null);
    
  const item = useLocalSearchParams();

  const [slotsForBookings, setSlotsForBookings] = useState<any>(null);
  //const { hotelId } = route.params;

  const { width } = useWindowDimensions();
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
      slotId: "",
    },
  });
  const onSubmit = (data:any) => {
    if (!slotSelected || !slotSelected.id) {
      alert("Please select slot");
      return "";
    }

    if (
      slotSelected &&
      slotSelected.maxBookings - slotSelected.bookedSlots <= 0
    ) {
      alert("Please select valid slot");
      return "";
    }

    setLoader(true);
    // alert(item.id);

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
        bookingTypeId:item.id,
        bookingType: "ground",
        status: "Pending",
        slotId: slotSelected.id,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setLoader(false);
        resetForm();
        setSlotSelected(null);
        Alert.alert("Success", responseJson.bookingId);
        router.push(`/payment/${responseJson.bookingId}`)
        // router.push("Payment", {
        //   bookingId: responseJson.bookingId,
        // });
        //console.log("[js] movies: ", responseJson);
      })
      .catch((error) => {
        setLoader(false);
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
    setAvailableSlots(null);
    setSlotSelected(null);
  };

  const loadGround = (groundId:any) => {
    setGround(null);
    if (!groundId) {
      return false;
    }
    setLoader(true);
    fetch(API_URL + "/grounds/" + groundId, {
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
            img: IMG_PATH + "/" + responseJson.image,
          },
        ];
        let allImgs = responseJson.images.split(",");
        for (let i = 0; i < allImgs.length; i++) {
          imgs.push({
            img: IMG_PATH + "/" + allImgs[i],
          });
        }
        setImages(imgs);
        setGround(responseJson);
        setLoader(false);
      })
      .catch((error) => {
        setLoader(false);
        console.error(error);
      });
  };

  const loadAvailableSlots = (allSlots:any) => {
    let slotItems:any = {};
    allSlots.forEach((slotItem:any) => {
      //slotItems = {};bookedSlots
      if (slotItem.maxBookings - slotItem.bookedSlots > 0) {
        slotItems[formatDate(slotItem.slotDate)] = {
          customStyles: {
            container: {
              backgroundColor: "#ebf8a4",
            },
            text: {
              color: "black",
              fontWeight: "bold",
            },
          },
        };
      } else {
        slotItems[formatDate(slotItem.slotDate)] = {
          customStyles: {
            container: {
              backgroundColor: "#ccc",
            },
            text: {
              color: "#fff",
              fontWeight: "bold",
            },
          },
        };
      }
    });
    setAvailableSlots(slotItems);
    //console.log(slotItems);
  };

  const loadSlots = (groundId:any) => {
    setLoader(true);
    fetch(API_URL + "/slots/byGround/" + groundId, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.length > 0) {
          setSlots(responseJson);
          loadAvailableSlots(responseJson);
        } else {
          setSlots(null);
        }

        setLoader(false);
      })
      .catch((error) => {
        setLoader(false);
        console.error(error);
      });
  };

  useEffect(() => {
    setSlotsForBookings(null);
    setAvailableSlots(null);
    setSlotSelected(null);
    loadGround(item.id);
    loadSlots(item.id);
  }, [item.id]);

  const getSlotsByDate = (date:any) => {
    //setLoader(true);
    setSlotsForBookings(null);
    fetch(
      API_URL + "/slots/byGroundandDate/" + item.id + "/" + date,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        let itemsForBooking = [];
        if (responseJson.length > 0) {
          // responseJson.forEach((item) => {
          //   if (item.maxBookings > 0) {
          //     itemsForBooking.push(item);
          //   }
          // });
          setSlotsForBookings(responseJson);
        } else {
          setSlotsForBookings(null);
        }

        //setLoader(false);
      })
      .catch((error) => {
        setLoader(false);
        console.error(error);
      });
  };

  const formatDate = (date:any) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  return (
    <>
      <ScrollView style={styles.hotelItem}>
        {loader && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
        {ground && !loader && (
          <>
            <ImageSlider
              data={images}
              autoPlay={true}
              caroselImageStyle={{ resizeMode: "cover" }}
              // onItemChanged={(item) => console.log("item", item)}
              closeIconColor="#fff"
              
            />
            <View style={styles.titleView}>
              <Text style={styles.title}>{ground.name}</Text>
              <Text style={styles.price}>USD {ground.price}</Text>
            </View>

            <View>
              <Text style={styles.facility}>Facility </Text>
              {/* icon="information" */}
              <View style={styles.amenities}>
                {ground &&
                  ground.amenities &&
                  ground.amenities.map((item:any) => (
                    <>
                      <Chip
                        style={{ margin: 5, width: "auto" }}
                        compact={true}
                        // onPress={() => console.log("Pressed")}
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
                source={{ html: ground.description }}
                tagsStyles={{ span: { flex: 1 } }}
              />
            </View>

            <View style={styles.formCont}>
              <View>
                <Text style={styles.formTitle}>Request Booking</Text>
              </View>
              <Calendar
                minDate={formatDate(new Date())}
                markingType={"custom"}
                // Collection of dates that have to be marked. Default = {}
                markedDates={availableSlots}
                enableSwipeMonths={true}
                onDayPress={(day:any) => {
                  //alert("selected day" + JSON.stringify(day));
                  getSlotsByDate(day.dateString);
                }}
              />
              {slotsForBookings && slotsForBookings.length > 0 && (
                <Text style={styles.label}>Select a Slot</Text>
              )}
              {(!slotsForBookings || slotsForBookings.length == 0) && (
                <Text style={styles.label}>No slots available</Text>
              )}

              <View>
                {slotsForBookings &&
                  slotsForBookings.map((slot:any) => (
                    <TouchableOpacity
                      onPress={() => setSlotSelected(slot)}
                      style={styles.slotItem}
                    >
                      <Text
                        style={
                          slot && slot.maxBookings - slot.bookedSlots > 0
                            ? slot.id === slotSelected?.id
                              ? styles.selected
                              : styles.slotLabel
                            : styles.notAvailable
                        }
                      >
                        {slot.slotName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                <View style={styles.legends}>
                  <View style={styles.legend}>
                    <View style={styles.green}>
                      <Text>&nbsp;</Text>
                    </View>
                    <Text> Available</Text>
                  </View>
                  <View style={styles.legend}>
                    <View style={styles.yellow}>
                      <Text>&nbsp;</Text>
                    </View>
                    <Text> Selected</Text>
                  </View>
                  <View style={styles.legend}>
                    <View style={styles.red}>
                      <Text>&nbsp;</Text>
                    </View>
                    <Text> Not Available</Text>
                  </View>
                </View>
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
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSubmit(onSubmit)}
                >
                  <Text style={styles.loginText}>Book Ground</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </>
  );
}

export default GroundDetails;

const styles = StyleSheet.create({
  slider: {
    top: -15,
  },
  slotLabel: {
    backgroundColor: "#72bf6a",
    padding: 10,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 15,
    marginRight: 15,
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
  notAvailable: {
    backgroundColor: "#f67676",
    padding: 10,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 15,
    marginRight: 15,
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  selected: {
    backgroundColor: "#bce954",
    padding: 10,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 15,
    marginRight: 15,
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  legends: {
    margin: 15,
    flex: 1,
    flexDirection: "row",
  },
  legend: {
    flex: 1,
    flexDirection: "row",
  },
  green: {
    width: 20,
    backgroundColor: "#72bf6a",
    textAlign: "center",
  },
  red: {
    width: 20,
    backgroundColor: "#f67676",
  },
  yellow: {
    width: 20,
    backgroundColor: "#bce954",
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
    margin: 15,
    marginBottom: 0,
  },
  dateLabel: {
    margin: 12,
  },
  slotItem: {
    borderRadius: 20,
    textAlign: "center",
    color: "#fff",
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
  slotdesign: {
    margin: 15,
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
