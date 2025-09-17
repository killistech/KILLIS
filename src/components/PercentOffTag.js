import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default function PercentOffTag({ percent }) {
  return (
    <View style={styles.holder}>
      <Text style={styles.percentText}>{percent}%</Text>
      <Text style={styles.offText}>OFF</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  holder: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 50,
    borderTopRightRadius: 0,
    backgroundColor: "#b8321b",
    right: 3,
    top: 3,
    borderWidth: 3,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  percentText: {
    color: "white",
    fontSize: 14,
    marginLeft: 4,
    lineHeight: 14,
  },
  offText: {
    fontSize: 10,
    color: "#CCCCCC",
    lineHeight: 10,
  },
});
