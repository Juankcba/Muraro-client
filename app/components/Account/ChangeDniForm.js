import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Button } from "react-native-elements";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import firestore from '@react-native-firebase/firestore';
import "firebase/storage";
import "firebase/firestore";
import uuid from "random-uuid-v4";

const db = firebase.firestore(firebaseApp);

export default function ChangeDniForm(props) {
    const { dni, setShowModal, email, displayName, toastRef } = props;
    const [newDNI, setNewDNI] = useState(null);

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const userId = firebase.auth().currentUser.uid;
    const [userDNI, setUserDNI] = useState('');
    useEffect(() => {

        const data = db.collection("Users")
            .orderBy("dni", "desc")
            .get()
            .then((response) => {
                response.forEach((doc) => {
                    const dni = doc.data();
                    dni.id = doc.id;
                    if (email === dni.email && userId === dni.uid) {

                        setUserDNI(dni.dni);
                    }
                });
            });

    }, [email, userId]);
    const onSubmit = () => {

        if (!newDNI) {

            setError("El DNI no puede estar vacio.");

        } else if ((userDNI === newDNI) && (email != "social")) {
            setError("El DNI no puede ser igual al actual.");
        } else {
            setIsLoading(true);
            const dniRef = db.collection("Users").doc(userId);


            dniRef.update({ dni: newDNI }).then(() => {

                setIsLoading(false);
                setRealoadUserInfo(true);
                setShowModal(false);


            }).catch(() => {
                setError("Error al actualizar el DNI.");
                setIsLoading(false);
            });
        }

    }

    return (
        <View style={styles.view}>
            <Input
                placeholder="DNI"
                keyboardType="numeric"
                containerStyle={styles.input}
                rightIcon={{
                    type: "font-awesome",
                    name: "address-card",
                    color: "#c2c2c2",
                }}
                defaultValue={dni || ""}

                onChange={(e) => setNewDNI(e.nativeEvent.text)}
                errorMessage={error}
            />
            <Button
                title="Cambiar DNI"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit()}
                loading={isLoading}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    view: {
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10,
    },
    input: {
        marginBottom: 10,
    },
    btnContainer: {
        marginTop: 20,
        width: "95%",
    },
    btn: {
        backgroundColor: "#31B1C5",
    },
});
