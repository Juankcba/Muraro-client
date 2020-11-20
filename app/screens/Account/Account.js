import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  BackHandler,
} from "react-native";
import { Avatar } from "react-native-elements";
import { Input, Button } from "react-native-elements";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

import InfoUser from "../../components/Account/InfoUser";
import { firebaseApp } from "../../utils/firebase";
import CodePush from "react-native-code-push";
import firebase from "firebase/app";
import "firebase/firestore";
import ChangeDniForm from "../../components/Account/ChangeDniForm";
import uuid from "random-uuid-v4";
import Toast from "react-native-simple-toast";
import Loading from "../../components/Loading";
const db = firebase.firestore(firebaseApp);

export default function Account() {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [newDNI, setNewDNI] = useState(null);
  const [uid, setUid] = useState("");
  const [error, setError] = useState(null);
  const [photoURL, setPhotoUrl] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [dni, setDNI] = useState("");
  const [realoadUserInfo, setRealoadUserInfo] = useState(false);
  const userId = firebase.auth().currentUser.uid;
  useEffect(() => {
    (async () => {
      const user = await firebase.auth().currentUser;
      const uidData = firebase.auth().currentUser.uid;
      const displayNameD = user.displayName;
      const emailD = user.email;
      const photoURLD = user.photoURL;
      setPhotoUrl(photoURLD);
      setUserInfo(user);
      setEmail(emailD);
      setDisplayName(displayNameD);
      setUid(uidData);
      const data = db
        .collection("Users")
        .get()
        .then((response) => {
          response.forEach((doc) => {
            const dni = doc.data();

            if (dni.uid === uidData) {
              dni.id = doc.id;
              setDNI(dni.dni);
              setDisplayName(dni.name);
            }
          });
        });
    })();
    setRealoadUserInfo(false);
  }, [realoadUserInfo]);
  const onSubmit = () => {
    if (!newDNI) {
      Toast.showWithGravity("No ha modifico el DNI.", Toast.LONG, Toast.TOP);
    } else if (dni === newDNI && email != "social") {
      Toast.showWithGravity(
        "El DNI no puede ser igual al actual.",
        Toast.LONG,
        Toast.TOP
      );
    } else {
      setIsLoading(true);
      const dniRef = db.collection("Users").doc(userId);

      dniRef
        .update({ dni: newDNI })
        .then(() => {
          setIsLoading(false);
          setRealoadUserInfo(true);
          setShowModal(false);
        })
        .catch(() => {
          setError("Error al actualizar el DNI.");
          setIsLoading(false);
        });
    }
  };
  const toastRef = useRef();

  return (
    <View style={styles.fullBody}>
      <View style={styles.viewUserInfo}>
        {userInfo && (
          <InfoUser
            userInfo={userInfo}
            dni={dni}
            displayName={displayName}
            email={email}
            uid={uid}
            photoURL={photoURL}
            toastRef={toastRef}
            setLoading={setLoading}
            setLoadingText={setLoadingText}
          />
        )}
      </View>
      <View style={styles.view}>
        <Input
          placeholder="DNI"
          placeholderTextColor="#fff"
          keyboardType="numeric"
          inputStyle={{ color: "#fff" }}
          containerStyle={styles.input}
          rightIcon={{
            type: "font-awesome",
            name: "address-card",
            color: "#c2c2c2",
          }}
          defaultValue={dni || ""}
          onChange={(e) => setNewDNI(e.nativeEvent.text)}
          errorMessage={error}
        />
        <Button
          title="Cambiar DNI"
          containerStyle={styles.btnCloseSession}
          buttonStyle={styles.btn}
          onPress={onSubmit}
          loading={isLoading}
        />
      </View>
      <View>
        <Button
          title="Cerrar sesión"
          buttonStyle={styles.btnCloseSession}
          titleStyle={styles.btnCloseSessionText}
          onPress={() => {
            firebase.auth().signOut();
            CodePush.restartApp();
          }}
        />
        <Button
          title="Salir de la App"
          buttonStyle={styles.btnCloseSession}
          titleStyle={styles.btnCloseSessionText}
          onPress={() => {
            BackHandler.exitApp();
          }}
        />
      </View>

      <Loading text={loadingText} isVisible={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  fullBody: {
    flex: 1,
    backgroundColor: "#231F20",
  },
  btn: {
    backgroundColor: "#419688",
  },
  viewUserInfo: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",

    paddingTop: 30,
    paddingBottom: 30,
  },
  userInfoAvatar: {
    marginRight: 20,
  },
  displayName: {
    fontWeight: "bold",
    paddingBottom: 5,
  },
  btnCloseSession: {
    margin: 40,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 0,
    backgroundColor: "#419688",
    borderTopWidth: 1,
    borderTopColor: "#419688",
    borderBottomWidth: 1,
    borderBottomColor: "#419688",
    paddingTop: 10,
    paddingBottom: 10,
  },
  btnCloseSessionText: {
    color: "#fff",
  },
});
