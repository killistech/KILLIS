import { Alert } from "react-native";
import PersistentStorage from "./PersistentStorage";

const Cart = {
  // get complete cart data
  get: () => {
    return new Promise((resolve, reject) => {
      PersistentStorage.get("cart").then((data) => {
        resolve(data);
      });
    });
  },
  // increase orderCount of p_id
  addItem: (data, maxOrderCount = 6) => {
    //console.log(data);
    const { p_id } = data;
    return new Promise((resolve, reject) => {
      PersistentStorage.get("cart")
        .then((cartData) => {
          cartData = cartData == null ? [] : cartData;

          Cart.isPIDinCart(p_id).then(({ exists, index, cartItem }) => {
            let setData = [];
            let setOrderCount = 0;
            if (exists) {
              if (cartItem.orderCount >= maxOrderCount) {
                Alert.alert(
                  "",
                  "Can't add more than " + maxOrderCount + " items"
                );
                resolve(false);
                return false;
              } else {
                setOrderCount = cartItem.orderCount + 1;
                cartItem.orderCount = setOrderCount;
                cartData.splice(index, 1); // removed the indexed item from array and updated the same array (cartData)
                setData = [cartItem, ...cartData];
              }
            } else {
              setOrderCount = 1;
              setData = [
                { p_id: p_id, orderCount: setOrderCount, p_data: data },
                ...cartData,
              ];
            }
            //console.log(setData);
            PersistentStorage.set("cart", setData)
              .then(() => {
                //DeviceEventEmitter.emit("cart");
                //EventRegister.emit("CartCountRead", null);
                resolve({
                  success: true,
                  orderCount: setOrderCount,
                  cartData: setData,
                });
              })
              .catch(() => {
                resolve({ success: false });
              });
          });
        })

        .catch(() => {
          resolve({ success: false });
        });
    });
  },
  // decrease order count of a p_id
  decreaseOrderCount: (p_id) => {
    return new Promise((resolve, reject) => {
      PersistentStorage.get("cart")
        .then((cartData) => {
          cartData = cartData == null ? [] : cartData;

          Cart.isPIDinCart(p_id).then(({ exists, index, cartItem }) => {
            let setData = [];
            let setOrderCount = 0;
            if (exists) {
              if (cartItem.orderCount > 1) {
                setOrderCount = cartItem.orderCount - 1;

                cartItem.orderCount = setOrderCount;
                cartData.splice(index, 1); // removed the indexed item from array and updated the same array (cartData)
                setData = [cartItem, ...cartData];
                PersistentStorage.set("cart", setData)
                  .then(() => {
                    // DeviceEventEmitter.emit("cart");
                    //EventRegister.emit("CartCountRead", null);
                    resolve({
                      success: true,
                      orderCount: setOrderCount,
                      cartData: setData,
                    });
                  })
                  .catch(() => {
                    resolve({ success: false });
                  });
              } else {
                Cart.removeItem(cartItem.p_id).then((cartData) => {
                  resolve({ success: true, orderCount: 0, cartData });
                });
              }
            } else {
              resolve({ success: true, orderCount: 0 });
            }
          });
        })

        .catch(() => {
          resolve({ success: false });
        });
    });
  },
  // to remove p_id completely
  removeItem: (p_id) => {
    return new Promise((resolve, reject) => {
      PersistentStorage.get("cart")
        .then((cartData) => {
          cartData = cartData == null ? [] : cartData;

          Cart.isPIDinCart(p_id).then(({ exists, index, cartItem }) => {
            if (exists) {
              cartData.splice(index, 1); // removed the indexed item from array and updated the same array (cartData)
              PersistentStorage.set("cart", cartData)
                .then(() => {
                  //DeviceEventEmitter.emit("cart");
                  //EventRegister.emit("CartCountRead", null);
                  resolve({ success: true, cartData: cartData });
                })
                .catch(() => {
                  resolve({ success: false });
                });
            } else {
              resolve({ success: true });
            }
          });
        })

        .catch(() => {
          resolve({ success: false });
        });
    });
  },
  isPIDinCart: (p_id) => {
    return new Promise((resolve, reject) => {
      Cart.get().then((cartData) => {
        if (cartData === null || cartData.length <= 0) {
          resolve({ exists: false, index: -1, cartItem: null });
        } else {
          let index = -1;
          let cartItem = null;

          let exists = false;
          cartData.forEach((item, idx) => {
            if (item.p_id == p_id) {
              index = idx;
              cartItem = item;
              exists = true;
              //return false; // breaks the loop
            }
          });

          resolve({ exists: exists, index: index, cartItem: cartItem });
        }
      });
    });
  },

  empty: () => {
    PersistentStorage.remove("cart").then(() => {
      //EventRegister.emit("CartCountRead", null);
    });
  },
};

//console.log("XXXXXXXXXXXXXXXXXX");
//await Cart.pInCart();
//console.log("YYYYYYYYYYYYYY");
//Cart.empty();
//Cart.add({ p_id: 33, orderCount: 3, p_data: "Somedata" });

/* const sampleData = [
  { p_id: 32, orderCount: 3, p_data: "Somedata" },
  { p_id: 34, orderCount: 4, p_data: "Somedata" },
];
*/

/* Cart.isPIDinCart(34).then((response) => {
  console.log(response);
}); */

export default Cart;
