import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Share,
  TouchableOpacity,
} from "react-native";
import { Button, Input, Icon } from "react-native-elements";
import uuid from "random-uuid-v4";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import Loading from "../../components/Loading";

const db = firebase.firestore(firebaseApp);

export default function Venta(props) {
  const { navigation, route } = props;
  const {
    id,
    isVisible,
    name,
    edificio,
    ventaOrden,
    ventasNotas,
    ventaTitulo,
  } = route.params;
  const titulo = "Consulta N°: " + ventaOrden;
  const [ventaF, setVentaF] = useState("");
  const [isVisibleF, setIsVisible] = useState("");
  console.log("ID", id);
  navigation.setOptions({
    title: titulo,
    headerStyle: {
      backgroundColor: "#419688",
    },
    headerTintColor: "#fff",
  });

  useEffect(() => {}, []);
  const changeState = (valor) => {
    db.collection("ventas")
      .doc(id)
      .update({ isVisible: valor })
      .then(() => {
        navigation.goBack();
      });
  };
  return (
    <View style={styles.viewFull}>
      <View>
        <Text style={styles.ventaText}>
          Consulta N°:{ventaOrden} - {ventaTitulo}{" "}
        </Text>
        <Text style={styles.ventaText}>
          Edificio:{edificio} - Propietaria: {name}{" "}
        </Text>
        <Text>Reclamo: {ventasNotas}</Text>
      </View>
      <View style={styles.viewBotones}>
        <Button
          icon={
            <Icon
              type="font-awesome"
              name="exclamation-circle"
              size={45}
              color="red"
              backgroundColor="#1B1A16"
              containerStyle={styles.containerIconFalse}
            />
          }
          onPress={() => changeState(0)}
          buttonStyle={styles.btnAddVenta}
        />
      </View>
      <View style={styles.viewBotones}>
        <Button
          icon={
            <Icon
              type="font-awesome"
              name="info-circle"
              size={45}
              color="blue"
              backgroundColor="#1B1A16"
              containerStyle={styles.containerIconFalse}
            />
          }
          onPress={() => changeState(1)}
          buttonStyle={styles.btnAddVenta}
        />
      </View>
      <View style={styles.viewBotones}>
        <Button
          icon={
            <Icon
              type="font-awesome"
              name="cogs"
              size={45}
              color="yellow"
              backgroundColor="#1B1A16"
              containerStyle={styles.containerIconFalse}
            />
          }
          onPress={() => changeState(2)}
          buttonStyle={styles.btnAddVenta}
        />
      </View>
      <View style={styles.viewBotones}>
        <Button
          icon={
            <Icon
              type="font-awesome"
              name="check"
              size={45}
              color="white"
              backgroundColor="#1B1A16"
              containerStyle={styles.containerIconFalse}
            />
          }
          onPress={() => changeState(3)}
          buttonStyle={styles.btnAddVenta}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  viewFull: {
    margin: 20,
    backgroundColor: "white",
  },
  viewBotones: {
    display: "flex",
    flexDirection: "column",
  },
  btnAddVenta: {
    backgroundColor: "#00a680",
    marginTop: 10,
    margin: 2,
    marginLeft: 10,
    width: "90%",
    height: 80,
  },

  ventaText: {
    color: "#231F20",
    fontSize: 20,
    marginBottom: 20,
  },
  ventaTextcont: {
    color: "#231F20",
    fontSize: 25,
    marginBottom: 20,
    marginLeft: 150,
    alignItems: "center",
    justifyContent: "center",
  },
  viewCard: {
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#231F20",
    borderTopLeftRadius: 1,
    borderStyle: "solid",
  },
  viewEstado: {
    flex: 0,
    flexDirection: "row",
    margin: 10,
  },
  btnPagado: {
    backgroundColor: "green",
    marginLeft: 120,
  },

  btnImpago: {
    backgroundColor: "red",
    marginLeft: 120,
  },
  btnContainerShare: {
    marginLeft: 150,
    marginTop: -30,
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
  },

  btnView: {
    flex: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
  },
  btnContainer: {
    marginRight: 40,
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
  },
  btnContainerCancel: {
    marginLeft: 40,
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
  },
});
