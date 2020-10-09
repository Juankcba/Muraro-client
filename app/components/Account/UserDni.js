import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, Text } from "react-native";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app"
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);


const UserDni = (props) => {
    const { email } = props;

    const [userDNI, setUserDNI] = useState('');
    useEffect(() => {
        const data = db.collection("Users")
            .get()
            .then((response) => {
                response.forEach((doc) => {
                    const dni = doc.data();

                    if (email === dni.email) {
                        dni.id = doc.id;
                        setUserDNI(dni.dni);


                    }
                });
            });
    }, [email]);



    return (
        <Text>{userDNI}</Text>
    );
}

export default UserDni;