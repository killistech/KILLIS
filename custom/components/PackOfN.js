import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default function PackOfN({ n }) {
  if (Number(n) < 2) {
    return;
  }

  return (
    <View style={styles.holder}>
      <Text style={styles.text}>
        <Text style={{ fontWeight: "bold" }}>{n}</Text> Pack
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  holder: {
    //position: "absolute",
    borderRadius: 6,

    backgroundColor: "#34ad29",
    //bottom: -10,
    paddingHorizontal: 4,
    paddingBottom: 2,
    borderWidth: 2,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  text: {
    fontSize: 14,
    color: "white",
  },
});
