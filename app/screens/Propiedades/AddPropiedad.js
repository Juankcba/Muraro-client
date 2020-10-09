import React, { useState, useRef } from "react";
import { StyleSheet, View } from "react-native";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";
import AddPropiedadForm from "../../components/Propiedad/AddPropiedadForm";

export default function AddPropiedad(props) {
  const { navigation } = props;
  const [isLoading, setIsLoading] = useState(false);
  const toastRef = useRef();
  return (
    <View>
      <AddPropiedadForm
        toastRef={toastRef}
        setIsLoading={setIsLoading}
        navigation={navigation}
      />
      <Toast ref={toastRef} positcion="center" opacity={0.9} />
      <Loading isVisible={isLoading} text="Crando Propiedad" />
    </View>
  );
}

const styles = StyleSheet.create({});
