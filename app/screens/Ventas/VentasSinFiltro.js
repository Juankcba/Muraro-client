import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, StyleSheet, Image } from "react-native";

import { firebaseApp } from "../../utils/firebase";
import { Icon } from "react-native-elements";
import firebase from "firebase/app";
import "firebase/firestore";

import ListVentas from "../../components/Ventas/ListVentas";
const db = firebase.firestore(firebaseApp);
var userUID = "";

export default function Ventas(props) {
  const { navigation } = props;
  const [user, setUser] = useState(null);
  const [ventas, setVentas] = useState([]);
  const [totalVentas, setTotalVentas] = useState(0);
  const [startVentas, setStartVentas] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const limitVentas = 10;
  const [mesActual, setMesActual] = useState("");
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    db.collection("Users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((response) => {
        const data = response.data();
        setAdmin(data.isAdmin);
      });

    var mesHoy = new Date().getMonth();
    switch (mesHoy) {
      case 0:
        setMesActual("Enero");
        break;
      case 1:
        setMesActual("Febrero");
        break;
      case 2:
        setMesActual("Marzo");
        break;
      case 3:
        setMesActual("Abril");
        break;
      case 4:
        setMesActual("Mayo");
        break;
      case 5:
        setMesActual("Junio");
        break;
      case 6:
        setMesActual("Julio");
        break;
      case 7:
        setMesActual("Agosto");
        break;
      case 8:
        setMesActual("Septiembre");
        break;
      case 9:
        setMesActual("Octubre");
        break;
      case 10:
        setMesActual("Noviembre");
        break;
      case 11:
        setMesActual("Diciembre");
        break;
      default:
        break;
    }
  }, [admin]);

  useFocusEffect(
    useCallback(() => {
      var localadmin = false;
      db.collection("Users")
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then((response) => {
          const data = response.data();
          localadmin = data.isAdmin;
        });
      var size = 0;
      db.collection("ventas")
        .get()
        .then((snap) => {
          snap.forEach((doc) => {
            let venta = doc.data();
            if (localadmin === true) {
              size++;
            }
            if (
              venta.createBy === firebase.auth().currentUser.uid &&
              localadmin === false
            ) {
              size++;
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
            if (localadmin === true) {
              resultVentas.push(venta);
            }
            if (
              venta.createBy === firebase.auth().currentUser.uid &&
              localadmin === false
            ) {
              resultVentas.push(venta);
            }
          });
          setVentas(resultVentas);
        });
    }, [])
  );
  const handleLoadMore = () => {
    const resultVentas = [];
    var localadmin = false;
    db.collection("Users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((response) => {
        const data = response.data();
        localadmin = data.isAdmin;
      });
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
          if (localadmin === true) {
            resultVentas.push(venta);
          }
          if (
            venta.createBy === firebase.auth().currentUser.uid &&
            localadmin === false
          ) {
            resultVentas.push(venta);
          }
        });

        setVentas([...ventas, ...resultVentas]);
      });
  };
  if (admin === true) {
    return (
      <>
        <View style={styles.viewHead}>
          <Image
            source={require("../../../assets/img/logo.png")}
            resizeMode="contain"
            style={styles.image}
          />
          <Text style={styles.textView}> Mis Consultas de {mesActual}</Text>
          <View style={styles.columnaVenta}>
            <Text style={styles.textColumVenta}>Consulta </Text>
            <Text style={styles.textColumVenta}>Fecha</Text>
            <Text style={styles.textColumVenta}>Titulo</Text>
            <Text style={styles.textColumVenta}>Estado</Text>
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
      </>
    );
  } else {
    return (
      <>
        <View style={styles.viewHead}>
          <Image
            source={require("../../../assets/img/logo.png")}
            resizeMode="contain"
            style={styles.image}
          />
          <Text style={styles.textView}> Mis Consultas de {mesActual}</Text>
          <View style={styles.columnaVenta}>
            <Text style={styles.textColumVenta}>Consulta </Text>
            <Text style={styles.textColumVenta}>Fecha</Text>
            <Text style={styles.textColumVenta}>Titulo</Text>
            <Text style={styles.textColumVenta}>Estado</Text>
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
          color="#419688"
          containerStyle={styles.btnContainer}
          onPress={() => navigation.navigate("add-venta")}
        />
      </>
    );
  }
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
    color: "#419688",
    margin: 20,
  },
  viewHead: {
    flex: 0,
    backgroundColor: "#231F20",
  },
  viewBody: {
    flex: 1,
    backgroundColor: "#231F20",
  },
  btnContainer: {
    position: "absolute",
    bottom: 1,
    right: 10,
    shadowColor: "white",
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
    color: "#fff",
    width: "20%",
  },
});
