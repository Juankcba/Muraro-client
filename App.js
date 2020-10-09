import React, { useEffect } from "react";

import { firebaseApp } from "./app/utils/firebase";
import Navigation from "./app/navigations/Navigation";
import * as firebase from "firebase";

import Registro from "./app/screens/Login/Registro";
import { LogBox } from "react-native";

import _ from "lodash";

export default function App() {
  LogBox.ignoreLogs(["Setting a timer"]);
  const _console = _.clone(console);
  console.warn = (message) => {
    if (message.indexOf("Setting a timer") <= -1) {
      _console.warn(message);
    }
  };

  return <Registro />;
}
