import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ResumenVentas from "../screens/ResumenVentas";
import ResumenMes from "../screens/ResumenMes";
import AddVenta from "../screens/Ventas/AddVenta";
import Ventas from "../screens/Ventas/Ventas";
const Stack = createStackNavigator();

export default function ResumenVentasStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ResumenVentas"
        component={ResumenVentas}
        options={{
          title: "Información",
          headerStyle: {
            backgroundColor: "#419688",
          },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="ResumenMes"
        component={ResumenMes}
        options={{
          title: "Historial de Resumen",
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
          title: "Añadir Nueva Venta",
          headerStyle: {
            backgroundColor: "#419688",
          },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="VentasTab"
        component={Ventas}
        options={{
          title: "Resumen > Mis Ventas",
          headerStyle: {
            backgroundColor: "#419688",
          },
          headerTintColor: "#fff",
        }}
      />
    </Stack.Navigator>
  );
}
