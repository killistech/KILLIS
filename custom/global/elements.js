import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from "react-native";
import React, { memo } from "react";
import COLORS from "./colors";

const windowWidth = Dimensions.get("window").width;
const widthThreshold = 400;

const InputField = (props) => {
  const {
    placeHolder = "",
    defaultValue = "",
    value = "",
    maxLength = undefined,
    autoFocus = false,
    keyboardType = "default",
    css = {},
    onFocus = () => {},
    onBlur = () => {},
    onChangeText = () => {},
  } = props;
  return (
    <TextInput
      style={[styles.TextInput, css]}
      defaultValue={defaultValue}
      value={value}
      maxLength={maxLength}
      //inputMode="search"
      // inlineImageLeft={"search_icon"}
      placeholder={placeHolder}
      keyboardType={keyboardType}
      autoFocus={autoFocus}
      //clearButtonMode="always"
      onFocus={(e) => {
        onFocus(e);
      }}
      onBlur={(val) => {
        onBlur(val);
      }}
      onChangeText={(val) => {
        onChangeText(val);
      }}
    />
  );
};

const RadioButton = (props) => {
  const { checked = false } = props;
  return (
    <View style={styles.radioOuter}>
      {checked && <View style={styles.radioInner}></View>}
    </View>
  );
};

const H1Text = (props) => {
  console.log(props);
  const { text = "", color = "#121212", bold = "normal", css = {} } = props;
  return (
    <Text
      style={[
        {
          fontSize: windowWidth < widthThreshold ? 28 : 32,
          color: color,
          fontWeight: bold,
        },
        css,
      ]}
    >
      {text}
    </Text>
  );
};

const H2Text = (props) => {
  const { text = "", color = "#121212", bold = "normal", css = {} } = props;
  return (
    <Text
      style={[
        {
          fontSize: windowWidth < widthThreshold ? 20 : 24,
          color: color,
          fontWeight: bold,
        },
        css,
      ]}
    >
      {text}
    </Text>
  );
};

const H3Text = (props) => {
  const { text = "", color = "#121212", bold = "normal", css = {} } = props;
  return (
    <Text
      style={[
        {
          fontSize: windowWidth < widthThreshold ? 16 : 20,
          color: color,
          fontWeight: bold,
        },
        css,
      ]}
    >
      {text}
    </Text>
  );
};

const MyActivityIndicator = () => {
  return (
    <View style={styles.indicatorWrapper}>
      <ActivityIndicator size="large" />
      <Text style={styles.indicatorText}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  TextInput: {
    backgroundColor: "white",
    fontSize: 20,
    padding: 6,
    borderRadius: 4,
    borderWidth: 0.8,
    borderColor: "#666666",
  },
  radioOuter: {
    width: 20,
    height: 20,

    borderRadius: 100,
    borderColor: COLORS.primary,
    borderWidth: 2,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 10,
    height: 10,

    borderRadius: 100,
    backgroundColor: COLORS.primary,
  },
  indicatorWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(100, 100, 100, 0)",
  },
  indicatorText: {
    fontSize: 18,
    marginTop: 12,
  },
});

export { InputField, RadioButton, H1Text, H2Text, H3Text, MyActivityIndicator };
