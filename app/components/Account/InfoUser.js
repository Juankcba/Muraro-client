import React from "react";
import { StyleSheet, View, Text } from "react-native";

import { Avatar } from "react-native-elements";
import UserDni from "./UserDni";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import Toast from "react-native-simple-toast";
const db = firebase.firestore(firebaseApp);
export default function InfoUser(props) {
  const {
    dni,
    displayName,
    email,
    userInfo: { photoURL },
    uid,
    toastRef,
    setLoading,
    setLoadingText,
  } = props;

  const changeAvatar = async () => {
    const resultPermission = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );
    const resultPermissionCamera =
      resultPermission.permissions.cameraRoll.status;

    if (resultPermissionCamera === "denied") {
      Toast.showWithGravity(
        "Es necesario aceptar los permisos de la galeria.",
        Toast.LONG,
        Toast.TOP
      );
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (result.cancelled) {
        Toast.showWithGravity(
          "Has cerrado la seleccion de imagenes.",
          Toast.LONG,
          Toast.TOP
        );
      } else {
        uploadImage(result.uri)
          .then(() => {
            updatePhotoUrl();
          })
          .catch(() => {
            Toast.showWithGravity(
              "Error al actualizar el avatar.",
              Toast.LONG,
              Toast.TOP
            );
          });
      }
    }
  };

  const uploadImage = async (uri) => {
    setLoadingText("Actualizando Avatar");
    setLoading(true);

    const response = await fetch(uri);
    const blob = await response.blob();

    const ref = firebase.storage().ref().child(`avatar/${uid}`);
    return ref.put(blob);
  };

  const updatePhotoUrl = () => {
    firebase
      .storage()
      .ref(`avatar/${uid}`)
      .getDownloadURL()
      .then(async (response) => {
        const update = {
          photoURL: response,
          displayName: displayName,
        };
        await firebase.auth().currentUser.updateProfile(update);
        setLoading(false);
      })
      .catch(() => {
        toastRef.current.show("Error al actualizar el avatar.");
      });
  };

  return (
    <View style={styles.viewUserInfo}>
      <Avatar
        rounded
        size="large"
        showEditButton
        onEditPress={changeAvatar}
        containerStyle={styles.userInfoAvatar}
        source={
          photoURL
            ? { uri: photoURL }
            : require("../../../assets/img/avatar-default.jpg")
        }
      />
      <View>
        <Text style={styles.displayName}>{displayName}</Text>
        <Text style={styles.textcolor}> {email ? email : "Socia Login"}</Text>
        <Text style={styles.textcolor}>{dni ? dni : "Agrege DNI"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewUserInfo: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "#231F20",
    paddingTop: 30,
    paddingBottom: 30,
  },
  userInfoAvatar: {
    marginRight: 20,
  },
  displayName: {
    fontWeight: "bold",
    paddingBottom: 5,
    color: "#419688",
  },
  textcolor: {
    color: "#fff",
  },
});
