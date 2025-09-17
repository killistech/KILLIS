import { Alert } from "react-native";
import PersistentStorage from "./PersistentStorage";

const Cart = {
  get: () => {
    return new Promise((resolve, reject) => {
      PersistentStorage.get("cart").then((data) => {
        console.log(data);
        resolve(data);
      });
    });
  },
  add: (data, maxCartQuantity = 6) => {
    const { p_id } = data;
    return new Promise((resolve, reject) => {
      PersistentStorage.get("cart")
        .then((cartData) => {
          cartData = cartData == null ? [] : cartData;
          if (cartData.length <= 0) {
            Alert.alert("", "Can't add more than " + maxCartQuantity + " items");
            reject();
          } else {
            const { exists, index, cartItem } = Cart.isPIDinCart(p_id, cartData);
            let setData = [];
            if (exists) {
              cartItem.quanity++;
              cartData.splice(index, 1); // removed the indexed item from array and updated the same array (cartData)
              setData = [...cartItem, ...cartData];
            } else {
              setData = [...[{ p_id: p_id, quanity: 1, p_data: data }], ...(cartData || [])];
            }
            PersistentStorage.set("cart", setData)
              .then(() => {
                resolve();
              })
              .catch(() => {
                reject();
              });
          }
        })

        .catch(() => {
          reject();
        });
    });
  },
  updateItem: () => {},
  deleteItem: (callBack) => {
    callBack(1234);
  },
  isPIDinCart: (p_id, cartData) => {
    if (cartData === null || cartData.length <= 0) {
      return { exists: false, index: -1, cartItem: null };
    }
    console.log(cartData);
    let index = -1;
    const cartItem = cartData.filter((item, idx) => {
      index = idx;
      return item.p_id == p_id;
    });

    if (cartItem.length > 0) {
      return { exists: true, index: index, cartItem: cartItem };
    } else {
      return { exists: false, index: -1, cartItem: null };
    }
  },

  remove: () => {
    PersistentStorage.remove("cart").then(() => {});
  },
};

//console.log("XXXXXXXXXXXXXXXXXX");
//await Cart.pInCart();
//console.log("YYYYYYYYYYYYYY");
//Cart.remove();
//Cart.add({ p_id: 33, quanity: 3, p_data: "Somedata" });

/* const sampleData = [
  { p_id: 32, quanity: 3, p_data: "Somedata" },
  { p_id: 34, quanity: 4, p_data: "Somedata" },
];
console.log(Cart.isPIDinCart(34, sampleData)); */

export default Cart;
