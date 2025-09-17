import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default function OutOfStock() {
  return (
    <View style={styles.holder}>
      <Text style={styles.text}>Out Of Stock</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  holder: {
    position: "absolute",
    borderRadius: 6,
    flexGrow: 1,
    // backgroundColor: "#74747442",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,

    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 10,

    color: "white",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 4,
    paddingHorizontal: 4,
    backgroundColor: "#7c7c7cff",
  },
});
