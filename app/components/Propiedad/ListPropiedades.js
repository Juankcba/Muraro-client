import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Icon } from "react-native-elements";
import { size } from "lodash";
import { useNavigation } from "@react-navigation/native";

export default function ListPropiedades(props) {
  const { propiedades, handleLoadMore, isLoading } = props;

  const navigation = useNavigation();

  return (
    <View style={styles.viewFull}>
      {size(propiedades) > 0 ? (
        <FlatList
          data={propiedades}
          renderItem={(propiedad) => (
            <>
              <Propiedad propiedad={propiedad} navigation={navigation} />
            </>
          )}
          keyExtractor={(item, index) => index.toString()}
          onEndReachedThreshold={0.5}
          onEndReached={handleLoadMore}
          ListFooterComponent={<FooterList isLoading={isLoading} />}
        />
      ) : (
        <View style={styles.loaderVentas}>
          <ActivityIndicator size="large" />
          <Text style={styles.textColor}>Ingrese Una Propiedad</Text>
        </View>
      )}
    </View>
  );
}

function Propiedad(props) {
  const { propiedad, navigation } = props;
  const {
    id,
    propiedadNombre,
    propiedadOrden,
    cantidadDptos,
    cantidadOcupados,

    isVisible,

    createAt,
  } = propiedad.item;

  const goPropiedad = () => {};

  return (
    <TouchableOpacity onPress={goPropiedad}>
      <View style={styles.viewVenta}>
        <View style={styles.columnaVenta}>
          <Text style={styles.textColumVenta}>{propiedadOrden}</Text>
          <Text style={styles.textColumVenta}>{propiedadNombre}</Text>
          <Text style={styles.textColumVenta}> {cantidadDptos} </Text>
          <Text style={styles.textColumVenta}>{cantidadOcupados}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function FooterList(props) {
  const { isLoading } = props;

  if (isLoading) {
    return (
      <View style={styles.loaderVentas}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else {
    return (
      <View style={styles.notFoundVentas}>
        <Text style={styles.textColor}>No quedan Propiedades por cargar</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textColor: {
    color: "#fff",
  },
  btnContainer: {
    position: "absolute",
    top: 70,
    right: 10,
    shadowColor: "white",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
  },
  separador: {
    height: 3,
    width: "100 %",
    backgroundColor: "#1B1A16",
  },
  containerIcon: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 20,
    marginRight: 50,
    height: 40,
    width: 40,

    backgroundColor: "#1B1A16",
  },
  containerIconFalse: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 20,
    marginRight: 50,
    height: 40,
    width: 40,

    backgroundColor: "#1B1A16",
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
    color: "#fff",
  },
  viewFull: {
    backgroundColor: "#1B1A16",
  },
  loaderVentas: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  viewVenta: {
    borderBottomWidth: 5,
    borderBottomColor: "#419688",
    flexDirection: "row",
    backgroundColor: "#1B1A16",
    margin: 10,
  },
  viewVentaImage: {
    marginRight: 15,
  },
  imageVenta: {
    width: 80,
    height: 80,
  },
  ventaName: {
    fontWeight: "bold",
  },
  ventaAddress: {
    paddingTop: 2,
    color: "grey",
  },
  ventaDescription: {
    paddingTop: 2,
    color: "grey",
    width: 300,
  },
  notFoundVentas: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  image: {
    marginTop: 20,
    marginRight: 40,
    marginLeft: 120,
  },
  textView: {
    fontSize: 20,
    color: "#31B1C5",
    margin: 20,
  },
});
