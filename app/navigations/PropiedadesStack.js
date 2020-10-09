import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Propiedades from "../screens/Propiedades/Propiedades";
import AddPropiedad from "../screens/Propiedades/AddPropiedad";

const Stack = createStackNavigator();

export default function PropiedadesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Propiedades"
        component={Propiedades}
        options={{
          title: "Propiedades",
          headerStyle: {
            backgroundColor: "#419688",
          },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="add-propiedad"
        component={AddPropiedad}
        options={{
          title: "Añadir Nueva Propiedad",
          headerStyle: {
            backgroundColor: "#419688",
          },
          headerTintColor: "#fff",
        }}
      />
    </Stack.Navigator>
  );
}
