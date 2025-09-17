import { StyleSheet, Text, View, Image, Pressable, Alert } from "react-native";
import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Ionicons } from "@expo/vector-icons";

/************* Created for this Application *************************/
import COLORS from "../global/colors";
import { AppContext, useAppContext } from "../context/AppContext";
import PercentOffTag from "../components/PercentOffTag";
import Cart from "../global/Cart";
import { myAppRSformat } from "../global/functions";
import { useDispatchCart } from "../context/AppContext";
/********************************************************************/

const CartButtons = forwardRef(
  (
    {
      pData,
      buttonLabel = "ADD TO CART",
      removeButtonOnZero = false,
      addCallBack = () => {},
      minusCallBack = () => {},
      plusCallBack = () => {},
    },
    ref
  ) => {
    const dispatch = useDispatchCart();
    const globalContext = useAppContext();
    const { globalCONSTANTS, globalAppParams } = globalContext;
    const maxOrderCount = globalAppParams.maxOrderCount;

    const [cartCheck, setCartCheck] = useState({
      fetching: true,
      orderCount: 0,
    });
    let OrderCountSaved = 0;

    useEffect(() => {
      getOrderCount();
    }, []);

    useImperativeHandle(ref, () => ({
      update() {
        getOrderCount();
      },
    }));

    const getOrderCount = () => {
      Cart.isPIDinCart(pData.p_id).then(({ exists, index, cartItem }) => {
        if (exists) {
          setCartCheck({ fetching: false, orderCount: cartItem.orderCount });
        } else {
          setCartCheck({ fetching: false, orderCount: 0 });
        }
        //setCheckingIfInCart(false);
      });
    };

    let inProgress = false;

    if (cartCheck.fetching) {
      return null;
    }

    if (cartCheck.orderCount > 0) {
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
              Cart.decreaseOrderCount(pData.p_id).then(
                ({ success, orderCount, cartData }) => {
                  inProgress = false;
                  if (success) {
                    OrderCountSaved = orderCount;
                    Cart.get().then((data) => {
                      const currentCount = data === null ? 0 : data.length;
                      dispatch(currentCount);
                    });
                    minusCallBack(orderCount, pData.p_id);
                    setCartCheck({ fetching: false, orderCount: orderCount });
                  }
                }
              );
            }}
          >
            <Ionicons name="remove" size={20} color="#FFF"></Ionicons>
          </Pressable>
          <Text style={{ color: "black", fontSize: 20, paddingHorizontal: 6 }}>
            {cartCheck.orderCount}
          </Text>
          <Pressable
            style={styles.cartPlusMinusButtons}
            onPress={() => {
              if (inProgress) {
                return true;
              }
              if (OrderCountSaved >= maxOrderCount) {
                Alert.alert(
                  "",
                  "Can't add more than " + maxOrderCount + " items"
                );
                return true;
              }
              inProgress = true;
              Cart.addItem(pData, maxOrderCount).then(
                ({ success, orderCount, cartData }) => {
                  inProgress = false;
                  if (success) {
                    OrderCountSaved = orderCount;
                    Cart.get().then((data) => {
                      const currentCount = data === null ? 0 : data.length;
                      dispatch(currentCount);
                    });
                    addCallBack(orderCount, pData.p_id);
                    plusCallBack(orderCount, pData.p_id);
                    setCartCheck({ fetching: false, orderCount: orderCount });
                  }
                }
              );
            }}
          >
            <Ionicons name="add" size={20} color="#FFF"></Ionicons>
          </Pressable>
        </View>
      );
    } else {
      // this p_id has zero orderCount in cart
      if (removeButtonOnZero) {
        return null;
      } else {
        return (
          <Pressable
            style={styles.cardCartBtn}
            onPress={() => {
              inProgress = true;
              Cart.addItem(pData, maxOrderCount).then(
                ({ success, orderCount, cartData }) => {
                  inProgress = false;
                  if (success) {
                    OrderCountSaved = orderCount;
                    Cart.get().then((data) => {
                      const currentCount = data === null ? 0 : data.length;
                      dispatch(currentCount);
                    });
                    addCallBack(orderCount, pData.p_id);
                    setCartCheck({ fetching: false, orderCount: orderCount });
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
);

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

export default CartButtons;
