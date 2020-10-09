import React, { useEffect, useState } from "react";
import { Icon } from "react-native-elements";
import ResumenVentasStack from "./ResumenVentasStack";
import NotificacionesStack from "./NotificacionesStack";
import PropiedadesStack from "./PropiedadesStack";
import VentaStack from "./VentaStack";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AccountStack from "./AccountStack";
import { firebaseApp } from "../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);
const Tab = createBottomTabNavigator();
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "rgb(255, 45, 85)",
    background: "#000",
    card: "rgb(255, 255, 255)",
    text: "rgb(28, 28, 30)",
    border: "rgb(199, 199, 204)",
    notification: "rgb(255, 69, 58)",
  },
};
export default function Navigation() {
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    db.collection("Users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((response) => {
        const data = response.data();
        setAdmin(data.isAdmin);
      });
  }, []);
  console.log("admin", admin);
  if (admin === true) {
    return (
      <NavigationContainer theme={MyTheme}>
        <Tab.Navigator
          initialRouteName="ResumenVentas"
          tabBarOptions={{
            inactiveTintColor: "#646464",
            activeTintColor: "#419688",
          }}
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color }) => screenOptions(route, color),
          })}
        >
          <Tab.Screen
            name="ResumenVentas"
            component={ResumenVentasStack}
            options={{
              title: "Inicio",
            }}
          />
          <Tab.Screen
            name="Propiedades"
            component={PropiedadesStack}
            options={{
              title: "Propiedades",
            }}
          />
          <Tab.Screen
            name="Notificaciones"
            component={NotificacionesStack}
            options={{
              title: "Notis",
            }}
          />
          <Tab.Screen
            name="Venta"
            component={VentaStack}
            options={{ title: "Mis Consultas" }}
          />
          <Tab.Screen
            name="account"
            component={AccountStack}
            options={{ title: "Cuenta" }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer theme={MyTheme}>
        <Tab.Navigator
          initialRouteName="ResumenVentas"
          tabBarOptions={{
            inactiveTintColor: "#646464",
            activeTintColor: "#419688",
          }}
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color }) => screenOptions(route, color),
          })}
        >
          <Tab.Screen
            name="ResumenVentas"
            component={ResumenVentasStack}
            options={{
              title: "Inicio",
            }}
          />
          <Tab.Screen
            name="Venta"
            component={VentaStack}
            options={{ title: "Mis Consultas" }}
          />
          <Tab.Screen
            name="account"
            component={AccountStack}
            options={{ title: "Cuenta" }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}

function screenOptions(route, color) {
  let iconName;

  switch (route.name) {
    case "Propiedades":
      iconName = "building";
      break;
    case "ResumenVentas":
      iconName = "home";
      break;
    case "Notificaciones":
      iconName = "rss-square";
      break;
    case "Venta":
      iconName = "exclamation-triangle";
      break;
    case "account":
      iconName = "sign-in";
      break;

    default:
      break;
  }
  return <Icon type="font-awesome" name={iconName} size={22} color={color} />;
}
