import { StyleSheet, Text, View, Image, Pressable, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";

/************* Created for this Application *************************/
import COLORS from "../global/colors";
import { useAppContext } from "../context/AppContext";
import PercentOffTag from "./PercentOffTag";
import Cart from "../global/Cart";
import { myAppRSformat, generateRandomHexColor } from "../global/functions";
import CartButtons from "./CartButtons";
import PackOfN from "./PackOfN";
import OutOfStock from "./OutOfStock";
/********************************************************************/

export default function ProductImage({
  p_data,
  showOutOfStock = true,
  showPackOfN = true,
  randImageBg = false,
}) {
  const globalContext = useAppContext();
  const { globalCONSTANTS, globalAppParams } = globalContext;
  const { p_id, primary_img, pack_of_n, available_cnt } = p_data;
  const bgColor = randImageBg
    ? generateRandomHexColor() + COLORS.opacs[90]
    : "";
  console.log(bgColor);
  return (
    <View
      style={{
        width: "100%",
        aspectRatio: 1 / 1,
        backgroundColor: randImageBg ? bgColor : "transparent",
      }}
    >
      <Image
        style={[styles.image]}
        source={{
          uri: `${globalCONSTANTS.productsDir}/${p_id}/images/${primary_img}/medium.png`,
        }}
      />
      <View style={styles.PackOfN}>
        {showPackOfN && <PackOfN n={pack_of_n} />}
      </View>
      {available_cnt <= 0 && <OutOfStock />}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    //maxWidth: cardImageMaxWidth,

    aspectRatio: 1 / 1,
    borderRadius: 10,
  },
  PackOfN: {
    position: "absolute",
    bottom: -6,
    alignSelf: "center",
  },
});
