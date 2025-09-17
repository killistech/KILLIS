import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function GreenText() {
  useEffect(() => {
    console.log("MyText Mounted");
  }, []);
  return <Text style={styles.myText}>green text EAS!</Text>;
}

const styles = StyleSheet.create({
  myText: {
    color: "green",
  },
});
