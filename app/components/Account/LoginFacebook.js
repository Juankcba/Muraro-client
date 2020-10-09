import React, { useState } from "react";
import { SocialIcon } from "react-native-elements";
import firebase from "firebase/app";
import firestore from '@react-native-firebase/firestore';
import { firebaseApp } from "../../utils/firebase";
import "firebase/storage";
import "firebase/firestore";
import * as Facebook from "expo-facebook";
import { useNavigation } from "@react-navigation/native";
import { FacebookApi } from "../../utils/social";
import Loading from "../Loading";

const db = firebase.firestore(firebaseApp);

export default function LoginFacebook(props) {
    const { toastRef } = props;
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [admin, setAdmin] = useState(false);
    const login = async () => {
        await Facebook.initializeAsync(FacebookApi.application_id);

        const { type, token } = await Facebook.logInWithReadPermissionsAsync({
            permissions: FacebookApi.permissions,
        });

        if (type === "success") {
            setLoading(true);
            const credentials = firebase.auth.FacebookAuthProvider.credential(token);


            firebase
                .auth()
                .signInWithCredential(credentials)
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
                                    setIsLoading(false);
                                    setRealoadUserInfo(true);
                                    setShowModal(false);

                                });
                        });
                    setLoading(false);
                    navigation.navigate("Inicio");
                })
                .catch(() => {
                    setLoading(false);
                    toastRef.current.show("Credenciales incorrectas.");
                });

        } else if (type === "cancel") {
            toastRef.current.show("Inicio de sesion cancelado");
        } else {
            toastRef.current.show("Error desconocido, intentelo más tarde");
        }

    };

    return (
        <>
            <SocialIcon
                title="Iniciar sesión con Facebook"
                button
                type="facebook"
                onPress={login}
            />
            <Loading isVisible={loading} text="Iniciando sesión" />
        </>
    );
}