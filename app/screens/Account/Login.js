import React, { useRef } from "react";
import { StyleSheet, View, ScrollView, Text, Image } from "react-native";
import { Divider } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-easy-toast";
import LoginForm from "../../components/Account/LoginForm";

import LoginFacebook from "../../components/Account/LoginFacebook";

export default function Login() {


    return (
        <ScrollView>

            <Divider style={styles.divider} />
            <View style={styles.viewContainer}>

            </View>
            <Toast ref={toastRef} position="center" opacity={0.9} />
        </ScrollView>
    );
}



const styles = StyleSheet.create({
    logo: {
        width: "100%",
        height: 150,
        marginTop: 20,
    },
    viewContainer: {
        marginRight: 40,
        marginLeft: 40,
    },
    textRegister: {
        marginTop: 15,
        marginLeft: 10,
        marginRight: 10,
    },
    btnRegister: {
        color: "#31B1C5",
        fontWeight: "bold",
    },
    divider: {
        backgroundColor: "#31B1C5",
        margin: 40,
    },
});