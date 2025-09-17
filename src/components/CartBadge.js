import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";

/************* Created for this Application *************************/
import Cart from "../global/Cart";
import { useCart, useDispatchCart } from "../context/AppContext";
/********************************************************************/

export default function CartBadge() {
  // const [count, setCount] = useState(0);
  const count = useCart();
  const dispatch = useDispatchCart();
  useEffect(() => {
    Cart.get().then((data) => {
      const currentCount = data === null ? 0 : data.length;
      dispatch(currentCount);
    });
  }, []);

  if (count > 0) {
    return (
      <View style={styles.badge}>
        <Text style={styles.badgeNumber}>{count}</Text>
      </View>
    );
  } else {
    return null;
  }
}

const styles = StyleSheet.create({
  badge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    // borderWidth: 1,
    borderColor: "#666",
    position: "absolute",
    top: 2,
    right: 0,
    //backgroundColor: "#ff4b04ef",
    backgroundColor: "#0e135cff",
    justifyContent: "center",
    alignItems: "center",
  },

  badgeNumber: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
