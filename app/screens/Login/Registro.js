import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { SocialIcon, Input, Icon, Button } from "react-native-elements";
import { FacebookApi } from "../../utils/social";
import firebase from "firebase/app";
import firestore from "@react-native-firebase/firestore";
import { firebaseApp } from "../../utils/firebase";
import "firebase/storage";
import "firebase/firestore";
import * as Facebook from "expo-facebook";
import Loading from "../../components/Loading";
import RegisterForm from "../../components/Account/RegisterForm";
import * as GoogleSignIn from "expo-google-sign-in";
import * as Google from "expo-google-app-auth";
import * as AppAuth from "expo-app-auth";
import Inicio from "./Inicio";
import Toast from "react-native-simple-toast";
import { size, isEmpty } from "lodash";
import { validateEmail } from "../../utils/validations";

const db = firebase.firestore(firebaseApp);
export default function Registro() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(defaultFormValue());
  const [loading, setLoading] = useState(false);
  const [registro, setRegistro] = useState(false);
  const [login, setLogin] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [user, setUser] = useState(false);
  const onChange = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text });
  };
  const onSubmit = () => {
    if (isEmpty(formData.email) || isEmpty(formData.password)) {
      Toast.showWithGravity(
        "Todos los campos son obligatorios.",
        Toast.LONG,
        Toast.TOP
      );
    } else if (!validateEmail(formData.email)) {
      Toast.showWithGravity("El email no es correcto.", Toast.LONG, Toast.TOP);
    } else {
      setLoading(true);
      firebase
        .auth()
        .signInWithEmailAndPassword(formData.email, formData.password)
        .then(function (result) {
          setUser(true);
        })
        .catch(() => {
          setLoading(false);
          setUser(false);
          Toast.showWithGravity(
            "Email o contraseña incorrecta.",
            Toast.LONG,
            Toast.TOP
          );
        });
    }
  };
  if (user === true) {
    return <Inicio />;
  } else {
    if (registro == false) {
      return (
        <View style={styles.formContainer}>
          <Image
            source={require("../../../assets/img/logo.png")}
            resizeMode="contain"
            style={styles.image}
          />
          <Input
            placeholder="Correo electronico"
            keyboardType="email-address"
            placeholderTextColor="#fff"
            containerStyle={styles.inputForm}
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
            placeholderTextColor="#fff"
            inputStyle={{ color: "#419688" }}
            secureTextEntry={showPassword ? false : true}
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
          <Button
            title="Iniciar sesión"
            containerStyle={styles.btnContainerLogin}
            buttonStyle={styles.btnLogin}
            onPress={onSubmit}
          />
          <Text style={styles.textRegister}>
            ¿Aún no tienes una cuenta?{" "}
            <Text style={styles.btnRegister} onPress={() => setRegistro(true)}>
              Regístrate
            </Text>
          </Text>
          <Loading isVisible={loading} text="Iniciando sesión" />
        </View>
      );
    } else {
      return <RegisterForm />;
    }
  }
}

function defaultFormValue() {
  return {
    email: "",
    password: "",
  };
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    backgroundColor: "#231F20",
  },
  inputForm: {
    width: "100%",
    marginTop: 20,
  },
  btnContainerLogin: {
    marginTop: 20,
    width: "95%",
  },
  btnLogin: {
    backgroundColor: "#419688",
  },
  iconRight: {
    color: "#c1c1c1",
  },
  image: {
    marginTop: -50,
    marginRight: 40,
    marginLeft: 40,
    width: "80%",
  },
  textRegister: {
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10,
    color: "white",
  },
  btnRegister: {
    color: "#419688",
    fontWeight: "bold",
  },
});
