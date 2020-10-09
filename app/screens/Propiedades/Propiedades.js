import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Text, StyleSheet, Image, Button } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { firebaseApp } from "../../utils/firebase";
import { Icon } from "react-native-elements";
import firebase from "firebase/app";
import "firebase/firestore";
import ListPropiedades from "../../components/Propiedad/ListPropiedades";
const db = firebase.firestore(firebaseApp);

export default function Propiedades(props) {
  const { navigation } = props;
  const [totalPropiedades, setTotalPropiedades] = useState(0);
  const limitEdificios = 10;
  const [startEdificios, setStartEdificios] = useState(null);
  const [propiedades, setPropiedades] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useFocusEffect(
    useCallback(() => {
      var size = 0;
      db.collection("Propiedades")
        .get()
        .then((snap) => {
          snap.forEach((doc) => {
            let propiedad = doc.data();

            size++;
          });

          setTotalPropiedades(size);
        });

      const resultPropiedades = [];

      db.collection("Propiedades")
        .orderBy("createAt", "desc")
        .limit(limitEdificios)
        .get()
        .then((response) => {
          setStartEdificios(response.docs[response.docs.length - 1]);

          response.forEach((doc) => {
            const propiedad = doc.data();

            propiedad.id = propiedad.id;

            resultPropiedades.push(propiedad);
          });
          setPropiedades(resultPropiedades);
        });
    }, [])
  );
  const handleLoadMore = () => {
    const resultPropiedades = [];

    propiedades.length < totalPropiedades && setIsLoading(true);

    db.collection("Edificios")
      .orderBy("createAt", "desc")
      .startAfter(startEdificios.data().createAt)
      .limit(limitEdificios)
      .get()
      .then((response) => {
        if (response.docs.length > 0) {
          setStartEdificios(response.docs[response.docs.length - 1]);
        } else {
          setIsLoading(false);
        }

        response.forEach((doc) => {
          const propiedad = doc.data();
          propiedad.id = doc.id;

          resultPropiedades.push(propiedad);
        });

        setPropiedades([...propiedades, ...resultPropiedades]);
      });
  };

  return (
    <>
      <View style={styles.viewBody}>
        <View style={styles.viewContent}>
          <Text style={styles.textView}>Mis Propiedades</Text>
          <View style={styles.columnaVenta}>
            <Text style={styles.textColumVenta}>Número </Text>
            <Text style={styles.textColumVenta}>Nombre </Text>
            <Text style={styles.textColumVenta}>PH</Text>
            <Text style={styles.textColumVenta}>Ocupate</Text>
          </View>
        </View>
        <View style={styles.viewBody}>
          <ListPropiedades
            propiedades={propiedades}
            handleLoadMore={handleLoadMore}
            isLoading={isLoading}
          />
        </View>
      </View>
      <Icon
        reverse
        type="material-community"
        name="plus"
        color="#419688"
        containerStyle={styles.btnContainer}
        onPress={() => navigation.navigate("add-propiedad")}
      />
    </>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#1B1A16",
  },
  viewContent: {
    marginRight: 30,
    marginLeft: 30,
    marginBottom: 0,

    flexDirection: "column",
    backgroundColor: "#1B1A16",
  },
  textView: {
    fontSize: 20,
    color: "#419688",
    margin: 20,
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
  btnContainer: {
    position: "absolute",
    bottom: 1,
    right: 10,
    shadowColor: "white",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
  },
});
