import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Text, StyleSheet, Image, Button } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import { firebaseApp } from "../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import VerNotis from "../screens/Notificaciones/VerNotis";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
const db = firebase.firestore(firebaseApp);
var userUID = "none";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function ResumenVentas(props) {
  const { navigation } = props;
  const [user, setUser] = useState("null");
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [edificio, setEdificio] = useState("");
  useEffect(() => {
    db.collection("Users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((response) => {
        const data = response.data();
        setEdificio(data.consorcioName);
      });
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log(response);
      }
    );

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  return (
    <View style={styles.viewBody}>
      <View style={styles.viewContent}>
        <Image
          source={require("../../assets/img/logo.png")}
          resizeMode="contain"
          style={styles.image}
        />
        <Text style={styles.textoIntro}>Notificaciones del Consorcio</Text>
        <Text style={styles.textoSPAN}> {edificio}</Text>
      </View>
    </View>
  );
}
// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/notifications
async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Original Title",
    body: "And here is the body!",
    data: { data: "goes here" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}
async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
  if (token) {
    const res = await firebase
      .firestore()
      .collection("Users")
      .doc(firebase.auth().currentUser.uid)
      .set({ token }, { merge: true });
  }
  return token;
}

const styles = StyleSheet.create({
  viewBody: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#231F20",
  },
  viewContent: {
    marginRight: 30,
    marginLeft: 30,
    marginBottom: 0,

    flexDirection: "column",
    backgroundColor: "#231F20",
  },
  flexRow: {
    flex: 0,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 60,
  },
  viewInfo: {
    flex: 0,
    marginTop: 10,
    marginRight: 40,
    marginLeft: 40,

    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#31B1C5",
    borderTopLeftRadius: 5,
    borderStyle: "solid",
  },
  viewBtn: {
    flex: 0,
    marginTop: 30,
    marginRight: 40,
    marginLeft: 40,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
  btnCalendar: {
    marginTop: 3,
    marginRight: 10,
  },
  btnResumen: {
    marginTop: 20,
    backgroundColor: "#31B1C5",
    marginLeft: 40,
  },
  textoSPAN: {
    color: "white",
    textAlign: "center",
    fontSize: 30,
  },
  textoTitulo: {
    textAlign: "left",
  },
  image: {
    marginTop: 20,
    marginRight: 40,
    marginLeft: 40,
    width: "80%",
  },
  banner: {
    marginTop: 10,
    height: 100,
    width: "100%",
  },
  textoIntro: {
    textAlign: "center",
    color: "#419688",
    fontSize: 15,
    marginTop: 20,
  },
  btnContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
  },
});
