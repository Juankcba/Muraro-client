import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Notificaciones from "../screens/Notificaciones/Notificaciones";

const Stack = createStackNavigator();

export default function ResumenVentasStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Notificaciones"
        component={Notificaciones}
        options={{
          title: "Notificaciones",
          headerStyle: {
            backgroundColor: "#419688",
          },
          headerTintColor: "#fff",
        }}
      />
    </Stack.Navigator>
  );
}
