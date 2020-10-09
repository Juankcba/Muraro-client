import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { isEmpty } from "lodash";
import { useNavigation } from "@react-navigation/native";
import firebase from "firebase/app";
import firestore from '@react-native-firebase/firestore';
import { firebaseApp } from "../../utils/firebase";
import "firebase/storage";
import "firebase/firestore";
import { validateEmail } from "../../utils/validations";
import Loading from "../Loading";
import UserGuest from "../../screens/Account/UserGuest";
import UserLogged from "../../screens/Account/UserLogged";

const db = firebase.firestore(firebaseApp);
export default function LoginForm(props) {
    const { toastRef } = props;
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(defaultFormValue());
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const [login, setLogin] = useState(null);
    const [admin, setAdmin] = useState(false);
    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            !user ? setLogin(false) : setLogin(true);
        });
    }, []);
    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text });
    };

    const onSubmit = () => {
        if (isEmpty(formData.email) || isEmpty(formData.password)) {
            toastRef.current.show("Todos los campos son obligatorios");
        } else if (!validateEmail(formData.email)) {
            toastRef.current.show("El email no es correcto");
        } else {
            setLoading(true);
            firebase
                .auth()
                .signInWithEmailAndPassword(formData.email, formData.password)
                .then(function (result) {
                    db.collection('Users').doc(firebase.auth().currentUser.uid)
                        .get()
                        .then((response) => {
                            const data = response.data();


                            setAdmin(data.isAdmin);
                        }).catch(() => {

                            db.collection('Users').doc(firebase.auth().currentUser.uid)


                                .set({
                                    name: result.user.displayName,
                                    email: "social",
                                    dni: null,
                                    uid: result.user.uid,
                                    isAdmin: admin,
                                })
                                .then(() => {
                                    console.log('User added!');


                                });
                        });
                    setLoading(false);
                    navigation.navigate("Inicio");
                })
                .catch(() => {
                    setLoading(false);
                    toastRef.current.show("Email o contraseña incorrecta");
                });
        }
    };

    return login ? <UserLogged /> : (
        <View style={styles.formContainer}>
            <Input
                placeholder="Correo electronico"
                keyboardType="email-address"
                containerStyle={styles.inputForm}
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
            <Loading isVisible={loading} text="Iniciando sesión" />
        </View>
    );

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
        backgroundColor: "#31B1C5",
    },
    iconRight: {
        color: "#c1c1c1",
    },
});