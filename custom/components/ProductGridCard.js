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
/********************************************************************/

export default function ProductGridCard({ pData, cartButtons = false }) {
  const { p_id, p_title, price_bd, price_disc, price_final, primary_img } =
    pData;
  console.log(pData);

  const globalContext = useAppContext();
  const { globalCONSTANTS, globalAppParams } = globalContext;

  return (
    <View>
      <View style={{ flexGrow: 1, aspectRatio: 1 / 1 }}>
        <Image
          style={[styles.cardImage]}
          source={{
            uri:
              globalCONSTANTS.productsDir +
              "/" +
              p_id +
              "/images/" +
              primary_img +
              "/medium.png",
          }}
        />
        <View style={styles.cardPriceHolder}>
          {parseFloat(price_disc) > 0 && (
            <Text style={styles.cardPriceBD}>{myAppRSformat(price_bd)}</Text>
          )}
          <Text style={styles.cardPrice}>{myAppRSformat(price_final)}</Text>
        </View>
      </View>

      <Text
        style={styles.cardProductTitle}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {p_title}
      </Text>
      {cartButtons && (
        <View
          style={{ alignItems: "center" }}
          onStartShouldSetResponder={(event) => true}
          onTouchEnd={(e) => {
            e.stopPropagation();
          }}
        >
          <CartButtons pData={pData} buttonLabel={"CART +"} />
        </View>
      )}
      {price_disc > 0 && <PercentOffTag percent={price_disc} />}
    </View>
  );
}

const styles = StyleSheet.create({
  cardImage: {
    //maxWidth: cardImageMaxWidth,
    flexGrow: 1,
    aspectRatio: 1 / 1,
    borderRadius: 10,
    margin: 4,
  },
  cardPriceHolder: {
    position: "absolute",
    bottom: -2,
    padding: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    //borderWidth: 2,
    backgroundColor: "white",

    alignSelf: "center",
    alignItems: "center",
    elevation: 6,
  },
  cardPriceBD: {
    color: "#666666",
    fontSize: 14,
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
  },
  cardPrice: {
    color: "red",
    fontSize: 16,
  },
  cardCartBtn: {
    marginRight: 10,
    alignSelf: "center",
    backgroundColor: COLORS.cartButtonColor,
    padding: 4,
    borderRadius: 4,
  },
  cardBtmSection: {
    width: "100%",
    //height: cardItemDescHeight,
    padding: 6,
    paddingTop: 6,
  },
  cardProductTitle: {
    fontSize: 14,
    color: "#121212",
    marginTop: 8,
  },
  cartPlusMinusButtonsHolder: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.cartButtonColor,
    borderRadius: 4,
    alignSelf: "center",
  },
  cartPlusMinusButtons: {
    backgroundColor: COLORS.cartButtonColor,
    padding: 6,
    paddingTop: 4,
    paddingBottom: 4,
  },
});
