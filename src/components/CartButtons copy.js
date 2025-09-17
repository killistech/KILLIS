import { StyleSheet, Text, View, Image, Pressable, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";

/************* Created for this Application *************************/
import COLORS from "../global/colors";
import { AppContext, useAppContext } from "../context/AppContext";
import PercentOffTag from "../components/PercentOffTag";
import Cart from "../global/Cart";
import { myAppRSformat } from "../global/functions";
import { useDispatchCart } from "../context/AppContext";
/********************************************************************/

export default function CartButtons({
  pData,
  buttonLabel = "ADD TO CART",
  removeButtonOnZero = false,
  addCallBack = () => {},
  minusCallBack = () => {},
  plusCallBack = () => {},
}) {
  const dispatch = useDispatchCart();
  const globalContext = useAppContext();
  const { globalCONSTANTS, globalAppParams } = globalContext;
  const maxCartQuantity = globalAppParams.maxCartQuantity;

  const [cartCheck, setCartCheck] = useState({ fetching: true, quantity: 0 });
  let cartQuantitySaved = 0;

  useEffect(() => {
    Cart.isPIDinCart(pData.p_id).then(({ exists, index, cartItem }) => {
      if (exists) {
        setCartCheck({ fetching: false, quantity: cartItem.quantity });
      } else {
        setCartCheck({ fetching: false, quantity: 0 });
      }
      //setCheckingIfInCart(false);
    });
  }, []);

  let inProgress = false;

  if (cartCheck.fetching) {
    return null;
  }

  if (cartCheck.quantity > 0) {
    return (
      <View
        style={styles.cartPlusMinusButtonsHolder}
        onStartShouldSetResponder={(event) => true}
        onTouchEnd={(e) => {
          e.stopPropagation();
        }}
      >
        <Pressable
          style={styles.cartPlusMinusButtons}
          onPress={() => {
            inProgress = true;
            Cart.decreaseQuantity(pData.p_id).then(
              ({ success, quantity, cartData }) => {
                inProgress = false;
                if (success) {
                  cartQuantitySaved = quantity;
                  Cart.get().then((data) => {
                    const currentCount = data === null ? 0 : data.length;
                    dispatch(currentCount);
                  });
                  minusCallBack(quantity, pData.p_id);
                  setCartCheck({ fetching: false, quantity: quantity });
                }
              }
            );
          }}
        >
          <Ionicons name="remove" size={16} color="#FFF"></Ionicons>
        </Pressable>
        <Text style={{ color: "black", fontSize: 16, paddingHorizontal: 6 }}>
          {cartCheck.quantity}
        </Text>
        <Pressable
          style={styles.cartPlusMinusButtons}
          onPress={() => {
            if (inProgress) {
              return true;
            }
            if (cartQuantitySaved >= maxCartQuantity) {
              Alert.alert(
                "",
                "Can't add more than " + maxCartQuantity + " items"
              );
              return true;
            }
            inProgress = true;
            Cart.addItem(pData, maxCartQuantity).then(
              ({ success, quantity, cartData }) => {
                console.log(success, quantity);
                inProgress = false;
                if (success) {
                  cartQuantitySaved = quantity;
                  Cart.get().then((data) => {
                    const currentCount = data === null ? 0 : data.length;
                    dispatch(currentCount);
                  });
                  addCallBack(quantity, pData.p_id);
                  plusCallBack(quantity, pData.p_id);
                  setCartCheck({ fetching: false, quantity: quantity });
                }
              }
            );
          }}
        >
          <Ionicons name="add" size={16} color="#FFF"></Ionicons>
        </Pressable>
      </View>
    );
  } else {
    // this p_id has zero quantity in cart
    if (removeButtonOnZero) {
      return null;
    } else {
      return (
        <Pressable
          style={styles.cardCartBtn}
          onPress={() => {
            inProgress = true;
            Cart.addItem(pData, maxCartQuantity).then(
              ({ success, quantity, cartData }) => {
                inProgress = false;
                if (success) {
                  cartQuantitySaved = quantity;
                  Cart.get().then((data) => {
                    const currentCount = data === null ? 0 : data.length;
                    dispatch(currentCount);
                  });
                  addCallBack(quantity, pData.p_id);
                  setCartCheck({ fetching: false, quantity: quantity });
                }
              }
            );
          }}
        >
          <Text style={{ color: "white", fontSize: 14 }}>{buttonLabel}</Text>
        </Pressable>
      );
    }
  }
}

const styles = StyleSheet.create({
  cardCartBtn: {
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
    fontSize: 12,
    color: "#121212",
    marginVertical: 8,
  },
  cartPlusMinusButtonsHolder: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.cartButtonColor,
    borderRadius: 4,
  },
  cartPlusMinusButtons: {
    backgroundColor: COLORS.cartButtonColor,
    padding: 6,
    paddingTop: 4,
    paddingBottom: 4,
  },
});
