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
import { firebaseApp } from "../../utils/firebase";

import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);
export default function ListVentas(props) {
  const { ventas, handleLoadMore, isLoading, user } = props;

  const [mesActual, setMesActual] = useState("");
  const navigation = useNavigation();
  useEffect(() => {
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
  }, []);

  return (
    <View style={styles.viewFull}>
      {size(ventas) > 0 ? (
        <FlatList
          data={ventas}
          renderItem={(venta) => (
            <>
              <Venta venta={venta} navigation={navigation} />
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
          <Text style={styles.textColor}>No Tiene Consultas</Text>
        </View>
      )}
    </View>
  );
}

function Venta(props) {
  const { venta, navigation } = props;
  const {
    id,
    images,
    ventaTitulo,
    ventaUnidades,
    ventaOrden,
    isVisible,
    ventasNotas,
    createAt,
    name,
    edificio,
  } = venta.item;
  const imageVenta = images ? images[0] : null;

  const goVenta = () => {
    db.collection("Users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((response) => {
        const data = response.data();
        if (data.isAdmin === true) {
          navigation.navigate("VentaPreview", {
            id,
            ventaTitulo,
            ventaOrden,
            isVisible,
            ventasNotas,
            name,
            edificio,
          });
        }
      });
  };
  var mesHoy = new Date().getMonth();
  var fecha = createAt.seconds;
  var mes = new Date(fecha * 1000).getMonth();
  var dia = new Date(fecha * 1000).getDate() - 1;
  var textDia = dia + "/" + (mes + 1);
  if (isVisible === 0) {
    var nameIcon = "exclamation-circle";
    var colorIcon = "red";
  }
  if (isVisible === 1) {
    var nameIcon = "info-circle";
    var colorIcon = "blue";
  }
  if (isVisible === 2) {
    var nameIcon = "cogs";
    var colorIcon = "yellow";
  }
  if (isVisible === 3) {
    var nameIcon = "check";
    var colorIcon = "white";
  }

  return (
    <TouchableOpacity onPress={goVenta}>
      <View style={styles.viewVenta}>
        <View style={styles.columnaVenta}>
          <Text style={styles.textColumVenta}>{ventaOrden}</Text>
          <Text style={styles.textColumVenta}> {textDia} </Text>
          <Text style={styles.textColumVenta}>{ventaTitulo}</Text>

          <Icon
            type="font-awesome"
            name={nameIcon}
            color={colorIcon}
            containerStyle={styles.containerIcon}
          />
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
        <Text style={styles.textColor}>No quedan Consultas por cargar</Text>
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
    backgroundColor: "#231F20",
  },
  containerIcon: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 20,
    marginRight: 50,
    height: 40,
    width: 40,

    backgroundColor: "#231F20",
  },
  containerIconFalse: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 20,
    marginRight: 50,
    height: 40,
    width: 40,

    backgroundColor: "#231F20",
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
    backgroundColor: "#231F20",
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
    backgroundColor: "#231F20",
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
