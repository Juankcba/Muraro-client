import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Image, Button } from 'react-native'
import { useFocusEffect } from "@react-navigation/native";
import { Icon } from "react-native-elements"
import { firebaseApp } from "../utils/firebase";
import firebase from "firebase/app"
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);
var userUID = '';

export default function ResumenShow(props) {
    const { mes, mesHoy } = props;
    const [cantidadVentas, setCantidadVentas] = useState("");
    const [unidadesVentas, setUnidadesVentas] = useState("");
    const [montoVentas, setMontoVentas] = useState("");
    const [user, setUser] = useState(null);
    console.log(mesHoy);
    useEffect(() => {

        firebase.auth().onAuthStateChanged((userInfo) => {
            setUser(userInfo);
            userUID = userInfo;
        });
    }, []);
    useFocusEffect(
        useCallback(() => {


            var precio = 0;
            var size = 0;
            var unidades = 0;
            db.collection("ventas")
                .get()

                .then((snap) => {
                    snap.forEach((doc) => {
                        let venta = doc.data();

                        if (venta.createBy === user.uid) {
                            var fecha = venta.createAt.seconds;
                            var mes = new Date(fecha * 1000).getMonth();


                            if (mes === mesHoy) {

                                size++;
                                unidades = parseInt(venta.ventaUnidades, 10) + unidades;
                                precio = parseInt(venta.ventaPrecio, 10) + precio;
                            }
                        }
                    });
                    setUnidadesVentas(unidades);
                    setCantidadVentas(size);
                    setMontoVentas(precio);
                }, []);
        }
        ));
    return (
        <>
            <View>
                {mes ? <Text style={{ backgroundColor: "white", color: "#31B1C5", textAlign: "center", fontSize: 20 }}>Resumen del Mes {mes} </Text> : <Text style={{ backgroundColor: "white", color: "#31B1C5", textAlign: "center", fontSize: 20 }}>Seleccione el Mes</Text>}

            </View>
            <View style={styles.viewContent}>



                <View style={styles.viewInfo}

                >
                    <Text>Cantidad de Ventas</Text>
                    <Text style={styles.textoSPAN}
                    >{cantidadVentas}</Text>
                </View>
                <View style={styles.viewInfo}

                >
                    <Text>Monto Vendido</Text>
                    <Text style={styles.textoSPAN}
                    >${montoVentas}</Text>
                </View>
                <View style={styles.viewInfo}

                >
                    <Text>Unidades Vendidas</Text>
                    <Text style={styles.textoSPAN}
                    >{unidadesVentas}</Text>
                </View>


            </View>
        </>
    );
}
const styles = StyleSheet.create({

    viewBody: {
        flex: 0,
        flexDirection: "row",
        marginTop: 0,
        marginRight: 30,
        marginLeft: 30,
        justifyContent: "center",
        backgroundColor: "white",
    },
    viewContent: {
        marginRight: 30,
        marginLeft: 30,
        flex: 1,
        flexDirection: "column",
        backgroundColor: "white",
    },
    viewInfo: {
        flex: 0,
        marginTop: 10,
        marginRight: 40,
        marginLeft: 40,
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center",
        backgroundColor: "white",
        borderWidth: 2,
        borderColor: '#31B1C5',
        borderTopLeftRadius: 5,
        borderStyle: 'solid',
    },
    viewBtn: {
        flex: 0,
        marginTop: 30,
        marginRight: 40,
        marginLeft: 40,
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center",
        backgroundColor: "white",

    },
    btnCalendar: {
        marginTop: 10,
    },
    btnResumen: {
        marginTop: 20,
        backgroundColor: "#31B1C5",
        marginLeft: 40,
    },
    textoSPAN: {
        fontSize: 30,
    },
    image: {
        marginTop: 20,
        marginRight: 40,
        marginLeft: 80,
    },
    banner: {
        height: 300,
        width: "100%",
    }
});