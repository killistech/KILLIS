import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import MyText from "./custom/MyText";
import GreenText from "./custom/compons/GreenText";

export default function App() {
  return (
    <View style={styles.container}>
      <MyText />
      <GreenText />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
