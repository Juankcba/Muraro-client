import React from "react";
import { Button } from "react-native-elements";
import { View, Text, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function IngresoScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.viewFull}>
      <Image
        source={require("../../../assets/img/logo.png")}
        resizeMode="contain"
        style={styles.image}
      />
      <Text style={styles.viewText}>Por Favor Ingresa Primero</Text>
      <Button
        title={"Ingresar"}
        onPress={() => navigation.navigate("login")}
        buttonStyle={styles.btnLogin}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  viewFull: {
    margin: 20,
    backgroundColor: "white",
  },
  viewText: {
    color: "#31B1C5",
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  btnLogin: {
    backgroundColor: "#231F20",
    margin: 20,
  },
  image: {
    marginTop: 20,
    marginRight: 40,
    marginLeft: 80,
  },
});
