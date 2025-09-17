import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import MyText from "./custom/MyText";
import GreenText from "./custom/compons/GreenText";
import SuccessPopUp from "./custom/components/SuccessPopUp";
import { Button } from "react-native/types_generated/index";
import { useState } from "react";

export default function App() {
  const [showPP, setShowPP] = useState(false);
  return (
    <View style={styles.container}>
      <MyText />
      <GreenText />
      <Button
        title="Show PopUP"
        onPress={() => {
          setShowPP(true);
        }}
      />
      {showPP && <SuccessPopUp message="Success test msg" />}
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
