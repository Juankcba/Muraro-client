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
import { map, size, filter } from "lodash";
import Toast from "react-native-simple-toast";
import Icon from "react-native-vector-icons/FontAwesome";

import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
import Venta from "../../screens/Ventas/Venta";

const db = firebase.firestore(firebaseApp);
const increment = firebase.firestore.FieldValue.increment(1);
const widthScreen = Dimensions.get("window").width;
var userUID = "";

export default function AddVentaForm(props) {
  const { toastRef, setIsLoading, navigation } = props;
  const [ordenN, setOrdenN] = useState("");
  const [user, setUser] = useState("");
  const [ventaTitulo, setVentaTitulo] = useState("");
  const [ventaUnidades, setVentaUnidades] = useState("");
  const [ventasNotas, setVentasNotas] = useState("");
  const [imagesSelected, setImagesSelected] = useState([]);
  const [ventaOrden, setVentaOrden] = useState("");
  const [tokenAdmin, setTokenAdmin] = useState("");
  const [name, setName] = useState("");
  const [edificio, setEdificio] = useState("");

  useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
      setUser(userInfo);
    });
    const ventaUserID = firebase.auth().currentUser.uid;
    db.collection("ventas")
      .doc(ventaUserID)
      .get()
      .then((response) => {
        setVentaOrden(response.data().ventasCount);
        db.collection("Users")
          .doc(ventaUserID)
          .get()
          .then((response) => {
            setName(response.data().name);
            setEdificio(response.data().consorcioName);
          });
      })
      .catch(() => {
        setVentaOrden(0);
      });
    db.collection("Admin")
      .doc("NotiPush")
      .get()
      .then((respuesta) => {
        setTokenAdmin(respuesta.data().token);
      });
  }, []);

  const addVenta = () => {
    if (ventaTitulo <= 0 || ventasNotas <= 0) {
      Toast.showWithGravity(
        "Todos los campos del formulario son obligatorios.",
        Toast.LONG,
        Toast.TOP
      );
    } else {
      setIsLoading(true);
      const ventaUserID = firebase.auth().currentUser.uid;
      const dbRef = db.collection("ventas").doc(ventaUserID);
      const dbRefventas = db.collection("ventas").doc(`${Math.random()}`);
      const batch = db.batch();
      batch.set(dbRef, { ventasCount: increment }, { merge: true });
      batch.set(dbRefventas, {
        ventaOrden: ventaOrden + 1,
        ventaTitulo: ventaTitulo,
        ventasNotas: ventasNotas,
        isVisible: 0,
        createAt: new Date(),
        createBy: ventaUserID,
        name: name,
        edificio: edificio,
      });
      batch.commit();
      const noti = async () => {
        await db
          .collection("Users")
          .get()
          .then((response) => {
            response.forEach((doc) => {
              const propiedad = doc.data();
              if (propiedad.isAdmin == true) {
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
                    title: "Nueva Consulta 🔥: " + titulo,
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
      };
      console.log(noti);
      setIsLoading(false);
      navigation.goBack();
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <FormAdd
        setVentaTitulo={setVentaTitulo}
        setVentasNotas={setVentasNotas}
        setVentaOrden={setVentaOrden}
        setUser={setUser}
      />
      <View style={styles.btnView}>
        <Button
          icon={<Icon name="check" size={45} color="white" />}
          onPress={async () => {
            await enviarNotificacion(tokenAdmin, ventaTitulo, ventasNotas);
            addVenta();
          }}
          buttonStyle={styles.btnAddVenta}
        />
        <Button
          icon={<Icon name="times" size={45} color="white" />}
          onPress={() => navigation.navigate("VentasSinFiltro")}
          buttonStyle={styles.btnCancelVenta}
        />
      </View>
    </ScrollView>
  );
}
async function enviarNotificacion(tokenAdmin, ventaTitulo, ventasNotas) {
  const message = {
    to: tokenAdmin,
    sound: "default",
    title: ventaTitulo,
    body: ventasNotas,
    data: { data: "goes here" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

function FormAdd(props) {
  const { setVentaTitulo, setVentasNotas, setVentaOrden, setUser } = props;

  return (
    <View style={styles.viewForm}>
      <View style={styles.formContainer}>
        <Text style={styles.titulo}>Titulo</Text>
        <View style={styles.viewInput}>
          <Input
            placeholder="Título"
            containerStyle={styles.input}
            onChange={(e) => setVentaTitulo(e.nativeEvent.text)}
          />
        </View>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.titulo}>Consulta</Text>

        <Input
          placeholder="Su consulta"
          inputContainerStyle={styles.textArea}
          multiline={true}
          onChange={(e) => setVentasNotas(e.nativeEvent.text)}
        />
      </View>
    </View>
  );
}
function UploadImage(props) {
  const { toastRef, imagesSelected, setImagesSelected } = props;

  const imageSelect = async () => {
    const resultPermissions = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );

    if (resultPermissions === "denied") {
      toastRef.current.show(
        "Es necesario aceptar los permisos de la galeria, si los has rechazado tienes que ir ha ajustes y activarlos manualmente.",
        3000
      );
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (result.cancelled) {
        toastRef.current.show(
          "Has cerrado la galeria sin seleccionar ninguna imagen",
          2000
        );
      } else {
        setImagesSelected([...imagesSelected, result.uri]);
      }
    }
  };

  const removeImage = (image) => {
    Alert.alert(
      "Eliminar Imagen",
      "¿Estas seguro de que quieres eliminar la imagen?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: () => {
            setImagesSelected(
              filter(imagesSelected, (imageUrl) => imageUrl !== image)
            );
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.viewImages}>
      {size(imagesSelected) < 4 && (
        <Icon
          type="material-community"
          name="camera"
          color="#7a7a7a"
          containerStyle={styles.containerIcon}
          onPress={imageSelect}
        />
      )}
      {map(imagesSelected, (imageVenta, index) => (
        <Avatar
          key={index}
          style={styles.miniatureStyle}
          source={{ uri: imageVenta }}
          onPress={() => removeImage(imageVenta)}
        />
      ))}
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
