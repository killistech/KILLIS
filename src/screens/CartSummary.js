import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Button,
  Image,
  Dimensions,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableHighlight,
  Pressable,
  FlatList,
  Animated,
  Alert,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";

/************* Created for this Application *************************/
import ScreenContainer from "../components/ScreenContainer";
import GlobalStyles from "../global/styles";
import COLORS from "../global/colors";
import { H1Text, H2Text, H3Text } from "../global/elements";
import { AppContext, useAppContext } from "../context/AppContext";
import { AppUser } from "../global/AppUser";
import PercentOffTag from "../components/PercentOffTag";
import MY_API from "../global/API";
import {
  myAppRSformat,
  myNavigationHandler,
  myTextSpacingOnLineBreak,
} from "../global/functions";
import PackOfN from "../components/PackOfN";
import OutOfStock from "../components/OutOfStock";
import CartButtons from "../components/CartButtons";
import Cart from "../global/Cart";
import { useDispatchCart } from "../context/AppContext";
import ProductGridCard from "../components/ProductGridCard";
import ProductImage from "../components/ProductImage";
/********************************************************************/
import { LinearGradient } from "expo-linear-gradient";

let checkoutAmountShown = 0;
export default function CartSummary({ navigation, route }) {
  const summaryRef = useRef();
  const [cartData, setCartData] = useState({ fetched: false, data: [] });
  const dispatch = useDispatchCart();
  const globalContext = useAppContext();
  const globalCONSTANTS = globalContext.globalCONSTANTS;

  const isFocused = useIsFocused();
  useEffect(() => {
    // the below is very important to avoid running any API calls here after this screen is navigated to another screen
    if (!isFocused) {
      return () => {};
    }

    Cart.get().then((data) => {
      data = data === null ? [] : data;

      setCartData({ fetched: true, data: data });
    });
  }, [isFocused]);

  const renderItem = (item) => {
    const index = item.index;
    const { p_id, orderCount, p_data } = item.item;
    //const item = data.p_data;
    //console.log(item);
    let {
      available_cnt,
      bike_deliverable,
      container_id,
      extra_info,
      p_title,
      pack_of_n,
      pack_of_n_cb,
      pi_id,
      price_bd,
      price_disc,
      price_final,
      primary_img,
      quantity,
      uom_acronym,
      uom_id,
    } = p_data;

    extra_info = extra_info != "" ? " - " + extra_info : "";
    quantity = parseFloat(quantity);
    const quantity_and_uom =
      uom_acronym != "" ? quantity + " " + uom_acronym : quantity;
    pack_of_n = Number(pack_of_n);
    const pack_of_n_txt = pack_of_n > 0 ? " (Pack of " + pack_of_n + ")" : "";
    let total_size_txt = "";
    if (pack_of_n > 0) {
      let _total = parseFloat(quantity * pack_of_n);
      total_size_txt = " - Total: " + _total + " " + uom_acronym;
    }

    price_final = myAppRSformat(price_final);
    price_bd = myAppRSformat(price_bd);
    price_disc = parseFloat(price_disc);
    const price_disc_txt = price_disc > 0 ? price_disc + "% OFF" : "";
    available_cnt = Number(available_cnt);
    const totalDesc = myTextSpacingOnLineBreak(p_title + extra_info);

    return (
      <View>
        {index === 0 && (
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              marginBottom: 10,
              marginLeft: 2,
            }}
          >
            Items to checkout
          </Text>
        )}
        <View
          style={index == 0 ? [styles.card, styles.cardFirst] : styles.card}
        >
          <View style={styles.cardImageHolder}>
            <ProductImage p_data={p_data} />
          </View>

          <View style={styles.cardContentHolder}>
            <Text numberOfLines={4} style={{ fontSize: 13 }}>
              {totalDesc}
            </Text>
            <View style={styles.cardQuantityHolder}>
              <Text style={styles.cardQuanityText}>
                {quantity_and_uom}
                {pack_of_n > 0 ? "(Pack of " + pack_of_n + ")" : ""}
                {total_size_txt}
              </Text>
            </View>
            <View style={styles.cardPriceHolder}>
              <Text style={styles.priceFinal}>{price_final}</Text>
              {price_disc_txt != "" && (
                <Text style={styles.priceBD}>{price_bd}</Text>
              )}
              {price_disc_txt != "" && (
                <Text style={styles.priceDiscText}>{price_disc_txt}</Text>
              )}
            </View>
            <View style={styles.addToCartBtnHolder}>
              <CartButtons
                key={p_id.toString()}
                pData={p_data}
                removeButtonOnZero={true}
                minusCallBack={(orderCount, pId) => {
                  if (orderCount == 0) {
                    removeItem(pId);
                  }
                  summaryRef.current.reLoadCartSummaryFooter();
                }}
                plusCallBack={(orderCount, pId) => {
                  summaryRef.current.reLoadCartSummaryFooter();
                }}
              />
              <Text
                style={{
                  color: "#006159",
                  marginRight: 20,
                  textDecorationLine: "underline",
                  textDecorationColor: "#006159",
                  alignSelf: "center",
                  fontSize: 12,
                }}
                onPress={() => {
                  removeItemConfirm(p_id);
                }}
              >
                Remove
              </Text>
            </View>
            {available_cnt < orderCount && (
              <Text
                style={{
                  marginVertical: 10,
                  fontSize: 12,
                  color: "red",
                  alignSelf: "flex-end",
                }}
              >
                Only {available_cnt} available.
              </Text>
            )}
          </View>
        </View>
        {
          //dummy area at the end of cards
          index == cartData.data.length - 1 && (
            <View style={{ height: 200 }}></View>
          )
        }
      </View>
    );
  };

  const removeItemConfirm = (pId) => {
    Alert.alert(
      "", // Title
      "Are you sure you want remove this item?", // Message
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            removeItem(pId);
          },
        },
      ],
      { cancelable: false } // prevents dismissing by tapping outside
    );
  };

  const removeItem = (pId) => {
    Cart.removeItem(pId).then(() => {
      Cart.get().then((data) => {
        const currentCount = data === null ? 0 : data.length;
        /*       Not required as setCartData below will re-render the parent and hence the child component
        if (currentCount != 0) {
          summaryRef.current.reLoadCartSummaryFooter();
        } */
        dispatch(currentCount);
      });

      const newcCartData = cartData.data.filter((item) => {
        return item.p_id != pId;
      });
      summaryRef.current.reLoadCartSummaryFooter();
      setCartData({ fetched: true, data: newcCartData });
    });
  };

  const checkOutTrigger = () => {
    Cart.get().then((data) => {
      if (data == null) {
        setCartData({ fetched: true, data: [] });
      } else {
        const reComputedFinalPrice = data.reduce(
          (accumulatedAmount, currentObj) => {
            return (
              accumulatedAmount +
              currentObj.orderCount * Number(currentObj.p_data.price_final)
            );
          },
          0
        );

        if (reComputedFinalPrice != checkoutAmountShown) {
          summaryRef.current.reLoadCartSummaryFooter();
        } else {
          AppUser.get(navigation).then(({ activeDelcId }) => {
            validateAvailability(activeDelcId, data);
          });
        }
      }
    });
  };

  const validateAvailability = (activeDelcId, cartData) => {
    const sendData = cartData.map(({ p_id, orderCount }) => {
      return { p_id: p_id, orderCount: orderCount };
    });
    screenContainerRef?.current?.showActivityIndicator();
    MY_API({
      scriptName: "validate_availability",
      data: { delc_id: activeDelcId, dataJsonStr: JSON.stringify(sendData) },
      options: {},
    })
      .then(({ status, data }) => {
        const issueArr = cartData.filter(({ p_id, orderCount }) => {
          return (
            typeof data[p_id] != "undefined" &&
            data[p_id] &&
            Number(data[p_id]) < orderCount
          );
        });
        if (issueArr && issueArr.length > 0) {
          const newcCartData = cartData.map((obj) => {
            obj.p_data.available_cnt =
              typeof data[obj.p_id] != "undefined" && data[obj.p_id]
                ? data[obj.p_id]
                : obj.p_data.available_cnt;
            return obj;
          });
          setCartData({ fetched: true, data: newcCartData });
          setTimeout(() => {
            Alert.alert(
              "",
              "Some of the items are not available for the requested quantity. Please update."
            );
          }, 300);
        } else {
          checkOutProceed();
        }
        // gets data like {p_id: available_cnt, p_id: available_cnt}
        //cartData.
      })
      .catch(() => {
        // do nothing
      })
      .finally(() => {
        screenContainerRef?.current?.hideActivityIndicator();
      });
  };

  const checkOutProceed = () => {
    summaryRef?.current?.getTotalAmount().then((totalAmount) => {
      if (isNaN(totalAmount) || Number(totalAmount) === 0) {
        summaryRef.current.reLoadCartSummaryFooter();
        return;
      }
      myNavigationHandler(navigation, "Checkout", {
        totalAmount: totalAmount,
      });
    });
  };

  const serachButtonInEmptyCart = () => {
    myNavigationHandler(navigation, "Search", {});
  };

  const screenContainerRef = useRef();
  return (
    <ScreenContainer
      navigation={navigation}
      route={route}
      scrollingContainer={false}
      ref={screenContainerRef}
    >
      {cartData.fetched ? (
        cartData.data.length > 0 ? (
          <View
            style={{
              flexGrow: 1, // flex: 1 is not working. It's going below and beyond the fotternav
            }}
          >
            <FlatList
              data={cartData.data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
            />
            <CartSummaryData
              cartData={cartData}
              ref={summaryRef}
              onCheckOut={checkOutTrigger}
            />
          </View>
        ) : (
          <EmptyCart searchButtonCallback={serachButtonInEmptyCart} />
        )
      ) : (
        <View>
          <View style={styles.fetchingSkeleton}></View>
          <View style={styles.fetchingSkeleton}></View>
          <View style={styles.fetchingSkeleton}></View>
          <View style={styles.fetchingSkeleton}></View>
          <View style={styles.fetchingSkeleton}></View>
          <View style={styles.fetchingSkeleton}></View>
        </View>
      )}
    </ScreenContainer>
  );
}

const EmptyCart = ({ searchButtonCallback }) => {
  const [showSearchButton, setShowSearchButton] = useState(true);
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#01051bff",
          marginBottom: 20,
        }}
      >
        Your cart is empty
      </Text>

      <Image
        style={{
          //maxWidth: 50,
          width: "80%",
          height: undefined,
          //maxHeight: 150,
          aspectRatio: 427 / 301,
          marginVertical: 30,
        }}
        source={require("../images/emptyCart.png")}
      />
      {showSearchButton && (
        <TouchableOpacity
          style={[GlobalStyles.primaryButton, { padding: 10, marginTop: 30 }]}
          onPress={() => {
            searchButtonCallback();
            //setShowSearchButton(false);
          }}
        >
          <Ionicons name="search" size={24} color="white"></Ionicons>
          <Text style={[GlobalStyles.primaryButtonText, { marginLeft: 10 }]}>
            Search for Products
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const CartSummaryData = forwardRef(({ cartData, onCheckOut }, ref) => {
  const initialData = {
    totalItems: 0,
    price_bd: 0,
    savingsAmount: 0,
    price_final: 0,
  };
  const [summaryData, setSummaryData] = useState(initialData);

  const opacity = useRef(new Animated.Value(0)).current;
  const animateStart = () => {
    Animated.timing(opacity, {
      toValue: 1, // Fully visible
      duration: 500, // 1 second
      useNativeDriver: true,
    }).start();
  };

  useImperativeHandle(ref, () => ({
    reLoadCartSummaryFooter() {
      readCartData();
    },
    getTotalAmount() {
      return new Promise((resolve, reject) => {
        resolve(summaryData.price_final);
      });
    },
  }));

  useEffect(() => {
    readCartData();
  }, []);

  const readCartData = () => {
    Cart.get().then((data) => {
      if (data == null) {
        setSummaryData(initialData);
      } else {
        let thisPIDSavings = 0;
        const finalData = data.reduce(
          (accumulatorObj, currentObj) => {
            thisPIDSavings =
              currentObj.orderCount *
              (Number(currentObj.p_data.price_bd) -
                Number(currentObj.p_data.price_final));
            return {
              totalItems:
                accumulatorObj.totalItems + Number(currentObj.orderCount),
              price_bd:
                accumulatorObj.price_bd +
                currentObj.orderCount * Number(currentObj.p_data.price_bd),
              savingsAmount: accumulatorObj.savingsAmount + thisPIDSavings,
              /*                 Number(currentObj.p_data.price_disc) > 0
                  ? accumulatorObj.savingsAmount +
                    currentObj.orderCount *
                      (Number(currentObj.p_data.price_bd) - Number(currentObj.p_data.price_final))
                  : accumulatorObj.savingsAmount, */
              price_final:
                accumulatorObj.price_final +
                currentObj.orderCount * Number(currentObj.p_data.price_final),
            };
          },
          { totalItems: 0, price_bd: 0, savingsAmount: 0, price_final: 0 }
        );

        /*         console.log(finalData);
        console.log(finalData.price_bd - finalData.price_final - finalData.savingsAmount); */

        checkoutAmountShown = finalData.price_final;
        setSummaryData(finalData);
        animateStart();
      }
    });
  };

  return (
    <Animated.View style={[styles.cartSummaryFooter, { opacity: opacity }]}>
      <LinearGradient
        style={styles.cartSummaryFooterLG}
        colors={["#000000ff", "#120479ff"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <View>
          <Text style={{ color: "#CCCCCC", fontSize: 16 }}>
            Total Items:{" "}
            <Text style={{ color: "white", fontSize: 16 }}>
              {summaryData.totalItems}
            </Text>
          </Text>
          {summaryData.savingsAmount > 0 && (
            <Text
              style={{ color: "#68d182ff", fontSize: 16, marginVertical: 5 }}
            >
              Savings:{" "}
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {myAppRSformat(summaryData.savingsAmount)}
              </Text>
            </Text>
          )}
        </View>
        <View>
          <Text
            style={{
              color: "#37f81eff",
              fontSize: 20,
              marginLeft: 10,
              fontWeight: "bold",
            }}
          >
            {myAppRSformat(summaryData.price_final)}
          </Text>
          <Pressable
            style={styles.CheckOutBtn}
            onPress={() => {
              onCheckOut();
            }}
          >
            <Text style={{ color: "white", fontSize: 16 }}>CHECKOUT</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  fetchingSkeleton: {
    width: "100%",
    height: 140,
    backgroundColor: "#c4c4c4",
    marginBottom: 24,
  },
  card: {
    //height: 100,
    borderBottomColor: "#888888",
    //borderBottomWidth: 1,
    flexDirection: "row",
    marginBottom: 8,
    //marginHorizontal: 8,
    backgroundColor: "#FFFFFF",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  cardFirst: {
    marginTop: 0,
    borderTopColor: "#838383ff",
    borderTopWidth: 0.2,
  },
  cardLast: {
    marginBottom: 60,
  },
  cardImageHolder: {
    width: 100,
    padding: 6,
  },
  cardImage: {
    aspectRatio: 1 / 1,
    borderRadius: 4,
  },
  cardContentHolder: {
    flex: 1,
    padding: 6,
  },
  cardQuantityHolder: {
    alignSelf: "flex-start",
    marginTop: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: "#e6e6e6",
  },
  cardQuanityText: {
    color: "#2e6808",
  },
  cardPriceHolder: {
    flexDirection: "row",
    marginTop: 6,
  },
  priceFinal: {
    fontSize: 16,
    color: "#222222ff",
    fontWeight: "bold",
  },
  priceBD: {
    marginLeft: 10,
    color: "#666666",
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
  },
  priceDiscText: {
    fontSize: 12,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: "#2e6808",
    color: "#2e6808",
    paddingHorizontal: 4,
    alignSelf: "center",
  },
  addToCartBtnHolder: {
    marginTop: 12,
    marginBottom: 8,
    alignItems: "flex-end",
    flexDirection: "row-reverse",
  },
  addToCartBtn: {
    backgroundColor: COLORS.primary,
    padding: 4,
    marginRight: 10,
    marginTop: 8,
    borderRadius: 5,
  },
  cartSummaryFooter: {
    position: "absolute",
    bottom: 0,

    width: "100%",

    //height: 60,
    //backgroundColor: "#313131f3",
  },
  cartSummaryFooterLG: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  CheckOutBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 50,
    marginVertical: 10,
  },
});
