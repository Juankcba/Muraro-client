import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import Loading from "../Loading";
import { validateEmail } from "../../utils/validations";
import { size, isEmpty } from "lodash";
import Inicio from "../../screens/Login/Inicio";
import { useNavigation } from "@react-navigation/native";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
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

  const onSubmit = async () => {
    if (
      isEmpty(formData.nombre) ||
      isEmpty(formData.email) ||
      isEmpty(formData.password) ||
      isEmpty(formData.repeatPassword) ||
      isEmpty(formData.dni)
    ) {
      //toastRef.current.show("Todos los campos son obligatorios");
    } else {
      if (!formData.nombre) {
        //  toastRef.current.show("Email no es Correcto");
      } else if (!validateEmail(formData.email)) {
        //  toastRef.current.show("Email no es Correcto");
      } else if (formData.password !== formData.repeatPassword) {
        //toastRef.current.show("Las contraseñas tiene que ser iguales");
      } else if (size(formData.password) < 6) {
        //toastRef.current.show("La contraseña tiene que tener al menos 6 caracteres");
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
        <Button
          title="Unirse"
          containerStyle={styles.btnContainerRegister}
          buttonStyle={styles.btnRegister}
          onPress={onSubmit}
        />

        <Loading isVisible={loading} text="Creando Cuenta" />
      </View>
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
