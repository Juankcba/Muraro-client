import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Account from "../screens/Account/Account";

const Stack = createStackNavigator();

export default function AccountStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Cuenta"
        component={Account}
        options={{
          title: "Tu cuenta",
          headerStyle: {
            backgroundColor: "#419688",
          },
          headerTintColor: "#fff",
        }}
      />
    </Stack.Navigator>
  );
}
