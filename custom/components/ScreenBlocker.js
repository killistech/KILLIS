import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";

/************* Created for this Application *************************/
import Cart from "../global/Cart";
import { useCart, useDispatchCart } from "../context/AppContext";
/********************************************************************/

export default function ScreenBlocker() {
  useEffect(() => {}, []);

  return <View style={styles.blocker}></View>;
}

const styles = StyleSheet.create({
  blocker: {
    position: "absolute",
    top: 0,
    left: 0,
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#ffffff01",
    // IMP: total transparent is passign the press events to the components behind so keep the transparance to 01
  },
});
