import { StyleSheet, Text, View, Image, Pressable, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";

/************* Created for this Application *************************/
import COLORS from "../global/colors";
import { AppContext, useAppContext } from "../context/AppContext";
import PercentOffTag from "./PercentOffTag";
import Cart from "../global/Cart";
import { myAppRSformat } from "../global/functions";
import CartButtons from "./CartButtons";
import ProductImage from "./ProductImage";
/********************************************************************/

const cardGap = 8;
export default function ProductGrid({
  products = [],
  numColumns = 2,
  randImageBg = true,
}) {
  const globalContext = useAppContext();
  const { globalCONSTANTS, globalAppParams } = globalContext;
  const { p_id, primary_img, pack_of_n, available_cnt } = products;

  const setWidth = 100 / numColumns + "%";

  return (
    <View style={styles.grid}>
      {products.map((p_data, idx) => {
        const { p_id, p_title } = p_data;
        const isFirstInRow = idx % numColumns === 0;
        const isLasttInRow = (idx + 1) % numColumns === 0;
        let cardStyle = "";
        if (isFirstInRow) {
          cardStyle = styles.LeftCard;
        } else {
          if (isLasttInRow) {
            cardStyle = styles.rightcard;
          } else {
            cardStyle = styles.middleCard;
          }
        }
        return (
          <View
            style={[styles.itemHolder, { width: setWidth }, cardStyle]}
            key={idx}
          >
            <View style={[styles.item]}>
              <ProductImage p_data={p_data} randImageBg={randImageBg} />
              <View style={{ marginTop: 8 }}></View>
              <Text
                numberOfLines={2}
                style={{ color: COLORS.textMedium, fontSize: 12 }}
              >
                {p_title}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap", // allows multiple lines
    //padding: 10,
  },
  itemHolder: {
    // height: undefined,
    //aspectRatio: 1, // makes them square
    alignItems: "center",
    justifyContent: "center",

    marginBottom: 12,
    //borderWidth: 1,
  },
  LeftCard: {
    paddingLeft: 0,
    paddingRight: cardGap,
  },
  rightcard: {
    paddingLeft: cardGap,
    paddingRight: 0,
  },
  middleCard: {
    paddingHorizontal: cardGap / 2,
  },
  item: {
    flex: 1,

    // backgroundColor: "pink",
  },
});
