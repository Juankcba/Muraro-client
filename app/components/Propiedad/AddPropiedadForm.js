import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  Dimensions,
  Text,
} from "react-native";
import {
  AppRegistry,
  Avatar,
  Image,
  Input,
  Button,
} from "react-native-elements";
import uuid from "random-uuid-v4";
import { map, size, filter, isEmpty } from "lodash";
import Toast from "react-native-simple-toast";
import Icon from "react-native-vector-icons/FontAwesome";

import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
import Propiedad from "../../screens/Propiedades/Propiedad";

const db = firebase.firestore(firebaseApp);
const increment = firebase.firestore.FieldValue.increment(1);
const widthScreen = Dimensions.get("window").width;
var userUID = "";

export default function AddPropiedadForm(props) {
  const { toastRef, setIsLoading, navigation } = props;
  const [ordenN, setOrdenN] = useState("");
  const [user, setUser] = useState("");
  const [propiedadNombre, setPropiedadNombre] = useState("");
  const [cantidadDptos, setCantidadDptos] = useState(0);
  const [cantidadOcupados, setCantidadOcupados] = useState(0);

  const [propiedadOrden, setPropiedadOrden] = useState("");
  const [tokenAdmin, setTokenAdmin] = useState("");
  useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
      setUser(userInfo);
    });
    const adminUserID = firebase.auth().currentUser.uid;
    db.collection("Propiedades")
      .doc(adminUserID)
      .get()
      .then((response) => {
        setPropiedadOrden(response.data().propiedadCount);
      })
      .catch(() => {
        setPropiedadOrden(0);
      });
  }, []);

  const addPropiedad = () => {
    if (
      cantidadOcupados <= 0 ||
      cantidadDptos <= 0 ||
      isEmpty(propiedadNombre)
    ) {
      Toast.showWithGravity(
        "Todos los campos del formulario son obligatorios.",
        Toast.LONG,
        Toast.TOP
      );
    } else if (cantidadOcupados > cantidadDptos) {
      Toast.showWithGravity(
        "La cantidad ocupada no puede ser mayor que la disponible.",
        Toast.LONG,
        Toast.TOP
      );
    } else {
      var PH = [];
      var Token = [];
      for (let i = 0; i < cantidadDptos; i++) {
        PH[i] = i;
        Token[i] = "token";
      }

      setIsLoading(true);
      const adminUserID = firebase.auth().currentUser.uid;
      const dbRef = db.collection("Propiedades").doc(adminUserID);
      const dbProRef = db.collection("Propiedad").doc(propiedadNombre);
      const dbRefpropiedad = db
        .collection("Propiedades")
        .doc(`${Math.random()}`);
      const batch = db.batch();
      batch.set(dbRef, { propiedadCount: increment }, { merge: true });
      batch.set(dbRefpropiedad, {
        propiedadOrden: propiedadOrden + 1,
        propiedadNombre: propiedadNombre,
        cantidadDptos: cantidadDptos,
        cantidadOcupados: cantidadOcupados,
        isVisible: false,
        createAt: new Date(),
        createBy: adminUserID,
      });
      batch.set(dbProRef, { PH, Token });
      batch.commit();
      setIsLoading(false);
      navigation.goBack();
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <FormAdd
        setPropiedadNombre={setPropiedadNombre}
        setCantidadDptos={setCantidadDptos}
        setCantidadOcupados={setCantidadOcupados}
        setUser={setUser}
      />
      <View style={styles.btnView}>
        <Button
          icon={<Icon name="check" size={45} color="white" />}
          onPress={addPropiedad}
          buttonStyle={styles.btnAddVenta}
        />
        <Button
          icon={<Icon name="times" size={45} color="white" />}
          onPress={() => navigation.navigate("Propiedades")}
          buttonStyle={styles.btnCancelVenta}
        />
      </View>
    </ScrollView>
  );
}

function FormAdd(props) {
  const {
    setPropiedadNombre,
    setCantidadDptos,
    setCantidadOcupados,
    setUser,
  } = props;

  return (
    <View style={styles.viewForm}>
      <View style={styles.formContainer}>
        <Text style={styles.titulo}>Nombre</Text>

        <Input
          placeholder="Nombre"
          containerStyle={styles.input}
          onChange={(e) => setPropiedadNombre(e.nativeEvent.text)}
        />
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.titulo}>Cantidad de PH</Text>

        <Input
          placeholder="Cantidad de PH"
          containerStyle={styles.input}
          keyboardType="numeric"
          onChange={(e) => setCantidadDptos(e.nativeEvent.text)}
        />
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.titulo}>Cantidad de PH Ocupados</Text>

        <Input
          placeholder="Ocupados"
          containerStyle={styles.input}
          keyboardType="numeric"
          onChange={(e) => setCantidadOcupados(e.nativeEvent.text)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    height: "100%",
    backgroundColor: "#231F20",
  },
  containerIcon: {
    marginRight: 10,
    height: 70,
    width: 70,
    backgroundColor: "#e3e3e3",
  },
  formContainer: {
    flex: 1,

    margin: 30,
    marginBottom: 0,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#419688",
    borderTopLeftRadius: 1,
    borderStyle: "solid",
  },
  titulo: {
    marginTop: -15,
    marginLeft: 10,
    backgroundColor: "#419688",
    marginRight: "auto",
    fontSize: 20,
    color: "white",
  },

  viewInput: {
    flex: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    marginLeft: 100,
    marginRight: 100,
  },
  viewInputUnidades: {
    margin: 20,
    flex: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
  },
  dolar: {
    fontSize: 30,
    paddingTop: 2,
  },
  input: {
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  textArea: {
    height: 100,
    width: "90%",
    padding: 0,
    margin: 20,
  },
  viewImages: {
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 30,
  },
  miniatureStyle: {
    width: 70,
    height: 70,
    marginRight: 10,
  },
  viewPhoto: {
    alignItems: "center",
    height: 200,
    marginBottom: 20,
  },
  btnView: {
    flex: 1,
    flexDirection: "row",

    justifyContent: "space-between",
    margin: 20,
  },
  btnAddVenta: {
    backgroundColor: "#00a680",
    margin: 20,
    marginLeft: 10,
    width: 80,
    height: 80,
  },
  btnCancelVenta: {
    width: 90,
    height: 90,
    borderWidth: 10,
    borderColor: "#fff",
    margin: 15,
    borderRadius: 90 / 2,
    backgroundColor: "#ED1D27",

    marginRight: 10,
    borderWidth: 1,
    borderColor: "#fff",
  },
});
