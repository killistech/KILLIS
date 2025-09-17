import React, {
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useRef,
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
  ImageBackground,
} from "react-native";
import { useIsFocused, useFocusEffect } from "@react-navigation/native";

/************* Created for this Application *************************/
import ScreenContainer from "../components/ScreenContainer";
import GlobalStyles from "../global/styles";
import COLORS from "../global/colors";
import { H1Text, H2Text, H3Text } from "../global/elements";
import { AppContext, useAppContext } from "../context/AppContext";
import { AppUser } from "../global/AppUser";
import PercentOffTag from "../components/PercentOffTag";
import MY_API from "../global/API";
import { myAppRSformat, myTextSpacingOnLineBreak } from "../global/functions";
import PackOfN from "../components/PackOfN";
import OutOfStock from "../components/OutOfStock";
import CartButtons from "../components/CartButtons";
import ProductImage from "../components/ProductImage";
/********************************************************************/

let productsDataObj = "";

export default function ProductsList({ navigation, route }) {
  const [productsDataArr, setProductsDataArr] = useState([]);

  const globalContext = useAppContext();
  const globalCONSTANTS = globalContext.globalCONSTANTS;

  const { pi_id } = route.params.screenData;

  const isFocused = useIsFocused();
  useEffect(() => {
    if (!isFocused) {
      return () => {};
    }
    getProducts(pi_id);
  }, []);

  useFocusEffect(
    useCallback(() => {
      // runs when screen gains focus
      reload();
      // optional cleanup on blur:
      return () => {
        // do nothing or cancel in-flight requests
      };
    }, [reload])
  );

  const itemRefs = useRef(new Map());
  const ensureRefFor = useCallback((id) => {
    if (!itemRefs.current.has(id)) {
      itemRefs.current.set(id, React.createRef());
    }
    return itemRefs.current.get(id);
  }, []);

  const reload = useCallback(() => {
    // your reload logic: re-fetch, or update UI from cache
    console.log("ProductsList reload() called " + pi_id);
    console.log(itemRefs);
    for (const [id, refObj] of itemRefs.current.entries()) {
      const inst = refObj?.current;
      if (!inst) {
        // item not mounted (virtualized) — skip or handle accordingly
        continue;
      }
      // call child imperative method if present
      inst.update?.(); // optional chaining in case method missing
    }
  }, []);

  const getProducts = (pi_id) => {
    AppUser.get(navigation)
      .then((data) => {
        MY_API({
          scriptName: "products_get",
          data: { delc_id: data.activeDelcId, pi_id: pi_id },
          options: { showLoading: true },
        }).then(({ status, data }) => {
          productsDataObj = data;
          console.log("XXXXXXXXXXXXXXXXX");
          const products = Object.values(data);

          setProductsDataArr(products);
        });
      })
      .catch(() => {
        // do nothing
      });
  };

  const renderItem = ({ item, index }) => {
    console.log("YYYYYYYYYYYYYYYYYYYYYYYYYY");
    console.log(index);
    let {
      au_utc,
      available_cnt,
      bike_deliverable,
      container_id,
      extra_info,
      p_id,
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
    } = item;
    // console.log(item);
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
      <View style={styles.card}>
        <View style={styles.cardImageHolder}>
          <ProductImage p_data={item} />
        </View>

        <View style={styles.cardContentHolder}>
          <Text numberOfLines={2}>{totalDesc}</Text>
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
            {available_cnt > 0 && (
              <CartButtonsSection ref={ensureRefFor(p_id)} pData={item} />
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScreenContainer
      navigation={navigation}
      route={route}
      scrollingContainer={false}
    >
      <FlatList
        data={productsDataArr}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </ScreenContainer>
  );
}

const CartButtonsSection = forwardRef(({ pData }, ref) => {
  const cartButtonsRef = useRef();
  //ref
  useImperativeHandle(
    ref,
    () => ({
      update() {
        console.log("UPDATE");
        cartButtonsRef.current.update();
      },
    }),
    [] // stable handle
  );

  return <CartButtons pData={pData} ref={cartButtonsRef} />;
});

const styles = StyleSheet.create({
  card: {
    width: "100%",
    //height: 100,
    borderBottomColor: "#888888",
    borderBottomWidth: 1,
    flexDirection: "row",
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
    color: "red",
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
    marginTop: 8,
    marginBottom: 8,
    alignItems: "flex-end",
  },
  addToCartBtn: {
    backgroundColor: COLORS.primary,
    padding: 4,
    marginRight: 10,
    marginTop: 8,
    borderRadius: 5,
  },
});
