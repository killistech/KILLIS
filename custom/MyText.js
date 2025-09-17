import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function MyText() {
  useEffect(() => {
    console.log("MyText Mounted");
  }, []);
  return <Text style={styles.myText}>Red text EAS!</Text>;
}

const styles = StyleSheet.create({
  myText: {
    color: "red",
  },
});
