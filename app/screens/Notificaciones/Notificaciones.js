import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import { merge } from "lodash";
import React, { useState, useEffect, useRef } from "react";
import { Text, View, Button, Platform } from "react-native";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";
import NotisForm from "../../components/Notificaciones/NotisForm";

export default function Notificaciones(props) {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const { navigation } = props;
  const [isLoading, setIsLoading] = useState(false);
  const toastRef = useRef();
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "space-around",
        backgroundColor: "white",
      }}
    >
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <NotisForm
          toastRef={toastRef}
          setIsLoading={setIsLoading}
          navigation={navigation}
        />
        <Toast ref={toastRef} positcion="center" opacity={0.9} />
        <Loading isVisible={isLoading} text="Crando Venta" />
      </View>
    </View>
  );
}
