import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, StyleSheet, Image } from 'react-native';
import { firebaseApp } from "../../utils/firebase";
import { Icon } from "react-native-elements"
import firebase from "firebase/app"
import "firebase/firestore";

import ListVentas from "../../components/Ventas/ListVentas";
const db = firebase.firestore(firebaseApp);
var userUID = '';

export default function Ventas(props) {
    const { navigation, route } = props;
    const { filtro } = route.params;
    const [user, setUser] = useState(null);
    const [ventas, setVentas] = useState([]);
    const [totalVentas, setTotalVentas] = useState(0);
    const [startVentas, setStartVentas] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const limitVentas = 10;
    const [texto, setTexto] = useState('Mis Ventas');
    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo) => {
            setUser(userInfo.uid);
            userUID = userInfo;
        });

    }, []);

    useFocusEffect(
        useCallback(() => {

            var size = 0;
            db.collection("ventas")
                .get()
                .then((snap) => {
                    snap.forEach((doc) => {
                        let venta = doc.data();
                        if (venta.createBy === userUID.uid) {
                            if (filtro === 1) {
                                size++;
                            }
                            if (filtro === 2) {
                                if (venta.isVisible === true) {
                                    size++;
                                }
                            }
                            if (filtro === 4) {
                                if (venta.isVisible === false) {
                                    size++;
                                }
                            }
                        }
                    });

                    setTotalVentas(size);
                });

            const resultVentas = [];


            db.collection("ventas")
                .orderBy("createAt", "desc")
                .limit(limitVentas)
                .get()
                .then((response) => {
                    setStartVentas(response.docs[response.docs.length - 1]);

                    response.forEach((doc) => {
                        const venta = doc.data();

                        venta.id = doc.id;
                        if (venta.createBy === userUID.uid) {
                            if (filtro === 1) {
                                resultVentas.push(venta);
                                setTexto("Todas las ventas del mes");
                            }
                            if (filtro === 2) {
                                if (venta.isVisible === true) {
                                    resultVentas.push(venta);
                                    setTexto("Solo las ventas Cobradas");
                                }
                            }
                            if (filtro === 4) {
                                if (venta.isVisible === false) {
                                    resultVentas.push(venta);
                                    setTexto("Solo las ventas Impagas");
                                }
                            }
                        }
                    });
                    setVentas(resultVentas);
                });
        }, [filtro])
    );
    const handleLoadMore = () => {
        const resultVentas = [];

        ventas.length < totalVentas && setIsLoading(true);

        db.collection("ventas")
            .orderBy("createAt", "desc")
            .startAfter(startVentas.data().createAt)
            .limit(limitVentas)
            .get()
            .then((response) => {
                if (response.docs.length > 0) {
                    setStartVentas(response.docs[response.docs.length - 1]);
                } else {
                    setIsLoading(false);
                }

                response.forEach((doc) => {
                    const venta = doc.data();
                    venta.id = doc.id;
                    if (venta.createBy === userUID.uid) {
                        resultVentas.push(venta);
                    }
                    if (filtro === 2) {
                        if (venta.isVisible === true) {
                            resultVentas.push(venta);
                        }
                    }
                    if (filtro === 4) {
                        if (venta.isVisible === false) {
                            resultVentas.push(venta);
                        }
                    }

                });

                setVentas([...ventas, ...resultVentas]);
            });
    };

    return (
        <>

            <View style={styles.viewHead}>
                <Image
                    source={require("../../../assets/img/logo.png")}
                    resizeMode="contain"
                    style={styles.image}
                />
                <Text style={styles.textView}> {texto} </Text>
                <View style={styles.columnaVenta}>
                    <Text style={styles.textColumVenta}>Orden N°</Text>
                    <Text style={styles.textColumVenta}>Unidades</Text>
                    <Text style={styles.textColumVenta}>Dinero</Text>
                    <Text style={styles.textColumVenta}>Pagado</Text>
                </View>
            </View>
            <View style={styles.viewBody}>
                <ListVentas
                    user={user}
                    ventas={ventas}
                    handleLoadMore={handleLoadMore}
                    isLoading={isLoading}

                />
            </View>
            <Icon
                reverse
                type="material-community"
                name="plus"
                color="#31B1C5"
                containerStyle={styles.btnContainer}
                onPress={() => navigation.navigate("add-venta")}
            />

        </>
    );

}

const styles = StyleSheet.create({

    image: {
        marginTop: 20,
        marginRight: 40,
        marginLeft: 40,
        width: "80%",
    },
    textView: {
        fontSize: 20,
        color: "#31B1C5",
        margin: 20,
    },
    viewHead: {
        flex: 0,
        backgroundColor: "#fff",
    },
    viewBody: {
        flex: 1,
        backgroundColor: "#fff",
    },
    btnContainer: {
        position: "absolute",
        bottom: 1,
        right: 10,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.5,
    },
    columnaVenta: {
        flex: 0,
        margin: 10,
        marginTop: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
    textColumVenta: {
        alignItems: "center",
        justifyContent: "center",
        margin: 10,
        marginRight: 10,
        marginTop: 1,
        width: "20%",
    },

});