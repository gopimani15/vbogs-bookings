import { Image, StyleSheet, Platform, ImageBackground, TouchableOpacity,View,Text } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import Icon from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useRouter } from 'expo-router';

export default function HomeScreen() {

  const router = useRouter();
  return (
    <ImageBackground
      imageStyle={{ opacity: 0.5 }}
      style={styles.background}
      source={require("../../assets/images/homebg.png")}
    >
      <View style={styles.logocont}>
        <Image style={styles.logo} source={require("../../assets/images/logo.png")} />
      </View>
      <View style={styles.homeCont}>
        <TouchableOpacity
          style={styles.hotelCard}
          onPress={() => router.push('/venues')}
        >
          <Icon size={32} color="white" name="hotel" />
          <Text style={styles.textStyle}>Venues</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.groundCard}
          onPress={() => router.push("/grounds")}
        >
          <Icon size={32} color="white" name="volleyball-ball" />
          <Text style={styles.textStyle}>Grounds</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  logocont: {
    top: 50,
    position: "absolute",
    alignItems: "center",
    paddingTop: 10,
  },
  logo: {
    width: 250,
    height: 80,
  },
  homeCont: {
    flex: 1,
    flexDirection: "row",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  hotelCard: {
    display: "flex",
    alignItems: "center",
    margin: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: "#29b7f2",
    borderRadius: 25,
    textAlign: "center",
  },
  groundCard: {
    display: "flex",
    alignItems: "center",
    margin: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: "#ea5974",
    borderRadius: 25,
    textAlign: "center",
  },
  textStyle: {
    color: "#fff",
    paddingTop: 5,
    fontWeight: "bold",
    fontSize: 15,
    width: 100,
    textAlign: "center",
  },
  hotelSection: {
    margin: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
  },
  caption: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  slider: {
    top: -15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  resortText: {
    fontSize: 15,
    margin: 10,
  },
  button: {
    color: "#fff",
    margin: 12,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#f5694d",
    textAlign: "center",
    width: 100,
  },
  loginText: {
    color: "#fff",
    textTransform: "uppercase",
    fontSize: 15,
    fontWeight: "bold",
  },
});
