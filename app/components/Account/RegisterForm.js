import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { Picker } from "@react-native-community/picker";
import Loading from "../Loading";
import { validateEmail } from "../../utils/validations";
import { size, isEmpty } from "lodash";
import Inicio from "../../screens/Login/Inicio";
import { useNavigation } from "@react-navigation/native";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import Toast from "react-native-simple-toast";
import "firebase/storage";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

import uuid from "random-uuid-v4";

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setRepeatShowPassword] = useState(false);
  const [formData, setFormData] = useState(defaultFormValue());
  const [user, setUser] = useState(false);
  const [propiedades, setPropiedades] = useState([]);
  const [totalPropiedades, setTotalPropiedades] = useState(0);
  const [edificio, setEdificio] = useState("Seleccione Edificio");
  const [edificioKey, setEdificioKey] = useState(0);

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

  const onSubmit = async () => {
    if (
      isEmpty(formData.nombre) ||
      isEmpty(formData.email) ||
      isEmpty(formData.password) ||
      isEmpty(formData.repeatPassword) ||
      isEmpty(formData.dni) ||
      edificioKey == -1
    ) {
      Toast.showWithGravity(
        "Todos los campos son obligatorios.",
        Toast.LONG,
        Toast.TOP
      );
    } else {
      if (!formData.nombre) {
        Toast.showWithGravity(
          "El Nombre no es correcto.",
          Toast.LONG,
          Toast.TOP
        );
      } else if (!validateEmail(formData.email)) {
        Toast.showWithGravity("Email no es Correcto.", Toast.LONG, Toast.TOP);
      } else if (formData.password !== formData.repeatPassword) {
        Toast.showWithGravity(
          "Las contraseñas tiene que ser iguales.",
          Toast.LONG,
          Toast.TOP
        );
      } else if (size(formData.password) < 6) {
        Toast.showWithGravity(
          "La contraseña tiene que tener al menos 6 caracteres.",
          Toast.LONG,
          Toast.TOP
        );
      } else {
        setLoading(true);

        firebase
          .auth()
          .createUserWithEmailAndPassword(formData.email, formData.password)
          .then(() => {
            db.collection("Users")
              .doc(firebase.auth().currentUser.uid)
              .set({
                name: formData.nombre,
                email: formData.email,
                dni: formData.dni,
                uid: firebase.auth().currentUser.uid,
                isAdmin: false,
                consorcioKey: edificioKey,
                consorcioName: edificio,
              })
              .then(() => {
                console.log("User added!");
                setLoading(false);
                setUser(true);
              });
          })
          .catch(() => {
            setLoading(false);
            setUser(false);
            //toastRef.current.show("El email ya esta registrado");
          });
      }
    }
  };
  const onChange = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text });
  };

  if (user === true) {
    return <Inicio />;
  } else {
    return (
      <>
        <View style={styles.formContainer}>
          <Text style={styles.registro}> REGISTRO </Text>
          <Input
            placeholder="Nombre y Apellido"
            keyboardType="default"
            containerStyle={styles.inputForm}
            placeholderTextColor="#fff"
            inputStyle={{ color: "#419688" }}
            onChange={(e) => onChange(e, "nombre")}
            rightIcon={
              <Icon
                type="material-community"
                name="account"
                iconStyle={styles.iconRight}
              />
            }
          />
          <Input
            placeholder="Correo electronico"
            keyboardType="email-address"
            containerStyle={styles.inputForm}
            placeholderTextColor="#fff"
            inputStyle={{ color: "#419688" }}
            onChange={(e) => onChange(e, "email")}
            rightIcon={
              <Icon
                type="material-community"
                name="at"
                iconStyle={styles.iconRight}
              />
            }
          />
          <Input
            placeholder="Contraseña"
            containerStyle={styles.inputForm}
            password={true}
            secureTextEntry={showPassword ? false : true}
            placeholderTextColor="#fff"
            inputStyle={{ color: "#419688" }}
            onChange={(e) => onChange(e, "password")}
            rightIcon={
              <Icon
                type="material-community"
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                iconStyle={styles.iconRight}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />
          <Input
            placeholder="Repetir Contraseña"
            containerStyle={styles.inputForm}
            placeholderTextColor="#fff"
            inputStyle={{ color: "#419688" }}
            password={true}
            secureTextEntry={showRepeatPassword ? false : true}
            onChange={(e) => onChange(e, "repeatPassword")}
            rightIcon={
              <Icon
                type="material-community"
                name={showRepeatPassword ? "eye-off-outline" : "eye-outline"}
                iconStyle={styles.iconRight}
                onPress={() => setRepeatShowPassword(!showRepeatPassword)}
              />
            }
          />
          <Input
            placeholder="Ingrese DNI sin puntos"
            containerStyle={styles.inputForm}
            placeholderTextColor="#fff"
            inputStyle={{ color: "#419688" }}
            keyboardType="numeric"
            onChange={(e) => onChange(e, "dni")}
            rightIcon={{
              type: "font-awesome",
              name: "address-card",
              color: "#c2c2c2",
            }}
          />
          <View
            style={{
              borderColor: "white",
              backgroundColor: "#1B1A16",
              borderWidth: 1,
              marginTop: 10,
              width: "90%",
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

          <Button
            title="Registrarse"
            containerStyle={styles.btnContainerRegister}
            buttonStyle={styles.btnRegister}
            onPress={onSubmit}
          />

          <Loading isVisible={loading} text="Creando Cuenta" />
        </View>
      </>
    );
  }
}
function defaultFormValue() {
  return {
    email: "",
    password: "",
    repeatPassword: "",
    dni: "",
  };
}

const styles = StyleSheet.create({
  selectContainer: {
    marginTop: 10,
    backgroundColor: "#fff",
  },
  formContainer: {
    flex: 1,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    marginTop: 30,
    backgroundColor: "#1B1A16",
  },
  registro: {
    marginTop: -100,
    fontSize: 40,
    color: "white",
  },
  inputForm: {
    width: "100%",
    marginTop: 20,
  },
  btnContainerRegister: {
    marginTop: 20,
    width: "95%",
  },
  btnRegister: {
    backgroundColor: "#419688",
  },
  iconRight: {
    color: "#c1c1c1",
  },
});
