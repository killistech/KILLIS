import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { AppContext, useAppContext } from "./AppContext";

export default function LoadingBlock(show) {
  console.log("TEMP executed ", show);
  const globalContext = useAppContext();
  globalContext.setLoadingBlocker(show, "Loader from AppContext");

  return null;
}
