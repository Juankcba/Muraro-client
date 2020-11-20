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
import { Picker } from "@react-native-community/picker";
import { map, size, filter, isEmpty } from "lodash";
import Toast from "react-native-simple-toast";
import Icon from "react-native-vector-icons/FontAwesome";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";

import * as ImagePicker from "expo-image-picker";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);
export default function NotisForm(props) {
  const { toastRef, setIsLoading, navigation } = props;
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [mensaje, setmensaje] = useState("");
  const [edificio, setEdificio] = useState("Seleccione Edificio");
  const [edificioKey, setEdificioKey] = useState(0);
  return (
    <ScrollView style={styles.scrollView}>
      <FormAdd
        setTitulo={setTitulo}
        setmensaje={setmensaje}
        setEdificio={setEdificio}
        setEdificioKey={setEdificioKey}
        edificio={edificio}
      />
      <View style={styles.btnView}>
        <Button
          icon={<Icon name="check" size={45} color="white" />}
          onPress={async () => {
            await enviarNotificacion(
              expoPushToken,
              titulo,
              mensaje,
              edificio,
              edificioKey
            );
          }}
          buttonStyle={styles.btnAddVenta}
        />
        <Button
          icon={<Icon name="times" size={45} color="white" />}
          onPress={() => navigation.goBack()}
          buttonStyle={styles.btnCancelVenta}
        />
      </View>
    </ScrollView>
  );
}
async function enviarNotificacion(
  expoPushToken,
  titulo,
  mensaje,
  edificio,
  edificioKey
) {
  console.log("edificioKey", edificioKey);
  if (isEmpty(titulo) || isEmpty(mensaje) || edificioKey == -1) {
    Toast.showWithGravity(
      "Todos los campos son obligatorios.",
      Toast.LONG,
      Toast.TOP
    );
  } else {
    await db
      .collection("Users")
      .get()
      .then((response) => {
        response.forEach((doc) => {
          const propiedad = doc.data();
          if (propiedad.consorcioKey == edificioKey) {
            var tokentosend = propiedad.token;
            fetch("https://exp.host/--/api/v2/push/send", {
              method: "POST",
              headers: {
                host: "exp.host",
                accept: "application/json",
                "Content-Type": "application/json",
                "accept-encoding": "gzip, deflate",
              },
              body: JSON.stringify({
                to: tokentosend,
                sound: "default",
                title: "Notificacion 📬: " + titulo,
                body: mensaje,
                data: {
                  title: titulo,
                  message: mensaje,
                },
              }),
            });
          }
        });
      });
  }
}

function FormAdd(props) {
  const {
    setTitulo,
    setmensaje,
    setEdificio,
    setEdificioKey,
    edificio,
  } = props;
  const [propiedades, setPropiedades] = useState([]);
  const [totalPropiedades, setTotalPropiedades] = useState(0);

  useEffect(() => {
    const resultPropiedades = [];
    var size = 0;
    db.collection("Propiedad")
      .get()
      .then((response) => {
        response.forEach((doc) => {
          const propiedad = doc.data();
          size++;
          propiedad.id = doc.id;
          resultPropiedades.push(propiedad);
        });
        setPropiedades(resultPropiedades);
        setTotalPropiedades(size);
      });
  }, []);
  return (
    <View style={styles.viewForm}>
      <View style={styles.formContainer}>
        <Text style={styles.titulo}>Titulo</Text>
        <View style={styles.viewInput}>
          <Input
            placeholder="Título"
            containerStyle={styles.input}
            onChange={(e) => setTitulo(e.nativeEvent.text)}
          />
        </View>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.titulo}>Mensaje</Text>

        <Input
          placeholder="Su consulta"
          inputContainerStyle={styles.textArea}
          multiline={true}
          onChange={(e) => setmensaje(e.nativeEvent.text)}
        />
      </View>
      <View
        style={{
          borderColor: "white",
          backgroundColor: "#1B1A16",
          borderWidth: 1,
          marginTop: 10,
          marginLeft: "10%",
          marginRight: "10%",
          width: "80%",
        }}
      >
        <Picker
          selectedValue={edificio}
          style={{
            height: 50,
            width: "95%",
            color: "white",
          }}
          onValueChange={(itemValue, itemIndex) => {
            setEdificio(itemValue);
            setEdificioKey(itemIndex - 1);
          }}
        >
          <Picker.Item label={edificio} value={edificio} />
          {propiedades.map((address, i) => {
            return (
              <Picker.Item label={address.id} value={address.id} key={i} />
            );
          })}
        </Picker>
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
