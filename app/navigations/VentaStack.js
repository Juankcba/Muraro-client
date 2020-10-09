import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Ventas from "../screens/Ventas/Ventas";
import AddVenta from "../screens/Ventas/AddVenta";
import VentaPreview from "../screens/Ventas/Venta";
import VentasSinFiltro from "../screens/Ventas/VentasSinFiltro";
const Stack = createStackNavigator();

export default function VentaStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="VentasSinFiltro"
        component={VentasSinFiltro}
        options={{
          title: "Mis Consultas",
          headerStyle: {
            backgroundColor: "#419688",
          },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="add-venta"
        component={AddVenta}
        options={{
          title: "Añadir Nueva Consulta",
          headerStyle: {
            backgroundColor: "#419688",
          },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen name="VentaPreview" component={VentaPreview} />
    </Stack.Navigator>
  );
}
