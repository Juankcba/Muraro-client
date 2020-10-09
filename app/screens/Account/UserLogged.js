import React, { useState, useEffect, useRef } from "react";

import { StyleSheet, View, Text } from "react-native";
import { Button } from "react-native-elements";
import Toast from "react-native-easy-toast";

import Loading from "../../components/Loading";
import InfoUser from "../../components/Account/InfoUser";
import AccountOptions from "../../components/Account/AccountOptions";
import AccountOptionsMail from "../../components/Account/AccountOptions";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app"
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);
import uuid from "random-uuid-v4";

export default function UserLogged() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [realoadUserInfo, setRealoadUserInfo] = useState(false);
  const [dni, setDNI] = useState(null);
  useEffect(() => {
    (async () => {
      const user = await firebase.auth().currentUser;
      setUserInfo(user);
      const data = db.collection("Users")
        .get()
        .then((response) => {
          response.forEach((doc) => {
            const dni = doc.data();

            if ((user.email === dni.email) || (dni.email === "social")) {
              dni.id = doc.id;
              setDNI(dni.dni);


            }
          });
        });
    })();
    setRealoadUserInfo(false);
  }, [realoadUserInfo]);

  const toastRef = useRef();
  return (
    <View style={styles.viewUserInfo}>
      {userInfo && (
        <>
          <InfoUser
            dni={dni}
            userInfo={userInfo}
            toastRef={toastRef}
            setLoading={setLoading}
            setLoadingText={setLoadingText}
          />
          <AccountOptions
            dni={dni}
            userInfo={userInfo}
            toastRef={toastRef}
            setRealoadUserInfo={setRealoadUserInfo}
          />
        </>
      )}



      <Button
        title="Cerrar sesión"
        buttonStyle={styles.btnCloseSession}
        titleStyle={styles.btnCloseSessionText}
        onPress={() => firebase.auth().signOut()}
      />
      <Toast ref={toastRef} position="center" opacity={0.9} />
      <Loading text={loadingText} isVisible={loading} />

    </View>
  );
}
const styles = StyleSheet.create({
  viewUserInfo: {
    minHeight: "100%",
    backgroundColor: "#f2f2f2",
  },
  btnCloseSession: {
    marginTop: 30,
    borderRadius: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e3e3e3",
    borderBottomWidth: 1,
    borderBottomColor: "#e3e3e3",
    paddingTop: 10,
    paddingBottom: 10,
  },
  btnCloseSessionText: {
    color: "#31B1C5",
  },
});
