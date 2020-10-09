import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Share,
  TouchableOpacity,
} from "react-native";
import { Button, Icon, Input } from "react-native-elements";
import uuid from "random-uuid-v4";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import Loading from "../../components/Loading";
import Swal from "sweetalert2";
import ShareExample from "../../components/share/ShareExample";
const db = firebase.firestore(firebaseApp);

export default function Propiedad(props) {
  const { navigation, route } = props;
  const { id, ventaOrden } = route.params;
  const titulo = "Orden N°: " + ventaOrden;
  const [ventaF, setVentaF] = useState("");
  const [ventaPrecio, setVentaPrecio] = useState("");
  const [ventaUnidades, setVentaUnidades] = useState("");
  const [ventasNotas, setVentasNotas] = useState("");
  const [isVisibleF, setIsVisible] = useState("");

  navigation.setOptions({ title: titulo });

  useEffect(() => {
    db.collection("ventas")
      .doc(id)
      .get()
      .then((response) => {
        const data = response.data();
        data.id = response.id;
        setVentaF(data);
        setIsVisible(data.isVisible);
      });
  }, []);
  const addVenta = () => {
    Alert.alert(
      "Alerta!",
      "¿Seguro que desea Editar esta Venta?",
      [
        {
          text: "Cancelar",
          onPress: () => navigation.navigate("VentasSinFiltro"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            if (ventaPrecio > 0 && ventaUnidades > 0) {
              db.collection("ventas")
                .doc(id)
                .update({
                  ventaPrecio: ventaPrecio,
                  ventaUnidades: ventaUnidades,
                  ventasNotas: ventasNotas,
                  ventaOrden: ventaF.ventaOrden,
                })
                .then(() => {
                  chageIsVisible();
                });
            } else {
              chageIsVisible();
            }
          },
        },
      ],
      { cancelable: false }
    );
  };
  const chageIsVisible = () => {
    db.collection("ventas")
      .doc(id)
      .update({
        isVisible: isVisibleF,
      })
      .then(() => {
        navigation.navigate("VentasSinFiltro");
      });
  };
  const delVenta = () => {
    Alert.alert(
      "Alerta!",
      "¿Seguro que desea Borrar esta Venta?",
      [
        {
          text: "Cancelar",
          onPress: () => navigation.navigate("VentaPreview"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            db.collection("ventas")
              .doc(id)
              .delete()
              .then(() => {
                navigation.goBack();
              });
          },
        },
      ],
      { cancelable: false }
    );
  };
  const ventaPagada = () => {
    Alert.alert(
      "Confirmación!",
      "¿Seguro que desea cambiar el estado de esta Venta?",
      [
        {
          text: "Cancelar",
          onPress: () => navigation.navigate("VentaPreview"),
          style: "cancel",
        },
        {
          text: "Impago",
          onPress: () => {
            setIsVisible(false);
          },
        },
      ],
      { cancelable: false }
    );
  };
  const ventaImpaga = () => {
    Alert.alert(
      "Confirmación!",
      "¿Seguro que desea cambiar el estado de esta Venta?",
      [
        {
          text: "Cancelar",
          onPress: () => navigation.navigate("VentaPreview"),
          style: "cancel",
        },
        {
          text: "Pagado",
          onPress: () => {
            setIsVisible(true);
          },
        },
      ],
      { cancelable: false }
    );
  };
  const onSharePress = (ventaOrden, ventaF, isVisibleF) => {
    if (isVisibleF) {
      var textoEstado = "Pagado";
    } else {
      var textoEstado = "Impago";
    }
    var messageText =
      "¡Muchas gracias por tu pedido!\n Tu orden es la numero:" +
      ventaOrden +
      "\n El monto de tu orden es: " +
      ventaF.ventaPrecio +
      "\n El estado es:" +
      textoEstado;
    Share.share({
      title: "Gracias por tu Compra!",
      message: messageText,
    });
  };
  if (!ventaF) return <Loading isVisible={true} text="Cargando..." />;

  return (
    <View style={styles.viewFull}>
      <Text style={styles.ventaText}>Venta N°:{ventaOrden}</Text>

      <View style={styles.viewCard}>
        <Text>Total Venta</Text>
        <Input
          style={styles.ventaTextcont}
          placeholder={ventaF.ventaPrecio}
          placeholderTextColor="#31B1C5"
          keyboardType={"numeric"}
          onChange={(e) => setVentaPrecio(e.nativeEvent.text)}
        />
      </View>

      <View style={styles.viewCard}>
        <Text>Total unidades</Text>
        <Input
          style={styles.ventaTextcont}
          placeholder={ventaF.ventaUnidades}
          placeholderTextColor="#31B1C5"
          keyboardType={"numeric"}
          onChange={(e) => setVentaUnidades(e.nativeEvent.text)}
        />
      </View>
      <View style={styles.viewCard}>
        <Text>Estado de la Venta</Text>
        <View style={styles.viewEstado}>
          {isVisibleF ? (
            <Button
              title={"Pagado"}
              onPress={() => ventaPagada()}
              buttonStyle={styles.btnPagado}
            />
          ) : (
            <Button
              title={"Impago"}
              onPress={() => ventaImpaga()}
              buttonStyle={styles.btnImpago}
            />
          )}
        </View>
      </View>

      <View style={styles.viewCard}>
        <Text>Notas</Text>
        <Input
          style={styles.ventaTextcont}
          placeholder={ventaF.ventasNotas}
          value={ventaF.ventasNotas}
          multiline={true}
          onChange={(e) => setVentasNotas(e.nativeEvent.text)}
        />
      </View>

      <View style={styles.btnView}>
        <Icon
          reverse
          type="material-community"
          name="check"
          color="#31B1C5"
          containerStyle={styles.btnContainer}
          onPress={() => addVenta()}
        />
        <Icon
          reverse
          type="material-community"
          name="cancel"
          color="red"
          containerStyle={styles.btnContainerCancel}
          onPress={() => delVenta()}
        />
      </View>
      <Icon
        reverse
        type="material-community"
        name="share"
        color="green"
        containerStyle={styles.btnContainerShare}
        onPress={() => onSharePress(ventaOrden, ventaF, isVisibleF)}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  viewFull: {
    margin: 20,
    backgroundColor: "white",
  },
  ventaText: {
    color: "#31B1C5",
    fontSize: 20,
    marginBottom: 20,
  },
  ventaTextcont: {
    color: "#31B1C5",
    fontSize: 25,
    marginBottom: 20,
    marginLeft: 150,
    alignItems: "center",
    justifyContent: "center",
  },
  viewCard: {
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#31B1C5",
    borderTopLeftRadius: 1,
    borderStyle: "solid",
  },
  viewEstado: {
    flex: 0,
    flexDirection: "row",
    margin: 10,
  },
  btnPagado: {
    backgroundColor: "green",
    marginLeft: 120,
  },
  btnImpago: {
    backgroundColor: "red",
    marginLeft: 120,
  },
  btnContainerShare: {
    marginLeft: 150,
    marginTop: -30,
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
  },

  btnView: {
    flex: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
  },
  btnContainer: {
    marginRight: 40,
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
  },
  btnContainerCancel: {
    marginLeft: 40,
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
  },
});
