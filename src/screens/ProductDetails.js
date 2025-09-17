import React, { useState, useEffect } from "react";
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
import { useIsFocused } from "@react-navigation/native";

/************* Created for this Application *************************/
import ScreenContainer from "../components/ScreenContainer";
import GlobalStyles from "../global/styles";
import COLORS from "../global/colors";
import { H1Text, H2Text, H3Text } from "../global/elements";
import { AppContext, useAppContext } from "../context/AppContext";
import { AppUser } from "../global/AppUser";
import PercentOffTag from "../components/PercentOffTag";
import MY_API from "../global/API";
import Cart from "../global/Cart";
import { myAppRSformat } from "../global/functions";
import ProductGridCard from "../components/ProductGridCard";
import PackOfN from "../components/PackOfN";
import OutOfStock from "../components/OutOfStock";
import ImageSlider from "../components/ImageSlider";
import CartButtons from "../components/CartButtons";
/********************************************************************/

//let productDetailsData = "";
export default function ProductDetails({ navigation, route }) {
  console.log("ProductDetails");
  //const [fetching, setFetching] = useState(true);
  const [apiData, setApiData] = useState({ fetching: true, data: [] });

  const globalContext = useAppContext();
  const globalCONSTANTS = globalContext.globalCONSTANTS;

  let this_p_id = route.params.screenData.p_id;

  const isFocused = useIsFocused();
  useEffect(() => {
    if (!isFocused) {
      return () => {};
    }
    getProductDetails();
  }, []);

  const reloadForSelectedVariant = (p_id) => {
    this_p_id = p_id;
    //getProductDetails();
    navigation.replace("ProductDetails", { screenData: { p_id: p_id } });
  };

  const getProductDetails = () => {
    AppUser.get(navigation).then((data) => {
      MY_API({
        scriptName: "product_details_get",
        data: { p_id: this_p_id, delc_id: data.ActiveDelcId },
        options: { showLoading: false },
      })
        .then(({ status, data }) => {
          //productDetailsData = data;
          setApiData({ fetching: false, data: data });
          //setFetching(false);
        })
        .catch(() => {
          // do nothing
        });
    });
  };

  const DataView = ({ data }) => {
    const { p_data, p_images, p_variants } = data;
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

    const images = p_images.map((imageName) => {
      return (
        globalCONSTANTS.productsDir + "/" + "/" + p_id + "/images/" + imageName
      );
    });
    return (
      <View>
        <View style={styles.section}>
          <Text style={styles.title}>{p_title + extra_info}</Text>

          <View>
            <ImageSlider images={images} onChange={(activeIndex) => {}} />
            {pack_of_n_txt != "" && (
              <View style={{ position: "absolute", bottom: 10, left: 35 }}>
                <PackOfN n={pack_of_n} />
              </View>
            )}
          </View>

          <View
            style={{
              paddingVertical: 10,
              flexDirection: "row",
              marginBottom: 8,
              alignItems: "center",
            }}
          >
            {price_disc_txt != "" && (
              <View style={{ alignItems: "center", marginRight: 10 }}>
                <Text style={styles.priceBD}>{price_bd}</Text>
                <Text style={styles.priceDiscText}>{price_disc_txt}</Text>
              </View>
            )}

            <Text style={styles.priceFinal}>{price_final}</Text>
            <View
              style={
                {
                  // alignItems: "center",
                  //transform: [{ scale: 1.6 }],
                }
              }
            >
              <CartButtonsHolder p_data={p_data} />
            </View>
          </View>
        </View>

        {p_variants.length >
          1 /* variant will always have currently shown item */ && (
          <View style={styles.section}>
            <Text>Also available in below quantities</Text>
            <View style={styles.variantsHolder}>
              {p_variants
                .filter((item) => item.p_id != this_p_id)
                .map((item, index) => {
                  let { p_id } = item;
                  return (
                    <View
                      style={styles.variantCard}
                      key={index.toString()}
                      onPress={() => {
                        reloadForSelectedVariant(p_id);
                      }}
                    >
                      <ProductGridCard pData={item} cartButtons={false} />
                    </View>
                  );
                })}
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScreenContainer
      navigation={navigation}
      route={route}
      scrollingContainer={false}
    >
      {apiData.fetching ? (
        <View styke={styles.skeletonHolder}>
          <View style={styles.skeletonTop}></View>
          <View style={styles.skeletonMiddle}></View>
          <View style={styles.skeletonBottom}></View>
        </View>
      ) : (
        <ScrollView>
          <DataView data={apiData.data} />
        </ScrollView>
      )}
    </ScreenContainer>
  );
}

const CartButtonsHolder = ({ p_data }) => {
  return (
    <CartButtons
      pData={p_data}
      buttonLabel={"  ADD TO CART  "}
      addCallBack={() => {}}
    />
  );
};

const styles = StyleSheet.create({
  skeletonTop: {
    width: "100%",
    height: "24%",
    backgroundColor: "#CCC",
  },
  skeletonMiddle: {
    width: "100%",
    height: "48%",
    backgroundColor: "#CCC",
    marginVertical: "4%",
  },
  skeletonBottom: {
    width: "100%",
    height: "24%",
    backgroundColor: "#CCC",
  },
  section: {
    padding: 10,
    borderBottomWidth: 6,
    borderBottomColor: "#DDDDDD",
  },
  title: {
    fontSize: 16,
    marginBottom: 6,
  },
  packOfN: {
    backgroundColor: "#34ad29",
    borderRadius: 4,
    paddingHorizontal: 4,
    color: "white",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    fontSize: 13,
  },
  priceDetailsHolder: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignContent: "center",
  },
  priceDiscText: {
    fontSize: 12,
    borderWidth: 1,
    borderColor: "#2e6808",
    color: "#2e6808",
    paddingHorizontal: 4,
    alignSelf: "center",
  },
  priceBD: {
    marginHorizontal: 10,
    color: "#555555",
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    fontSize: 18,
  },
  priceFinal: {
    flexGrow: 1,
    //textAlign: "center",
    color: "#df1414",
    fontSize: 18,
    alignItems: "center",
  },
  variantsHolder: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    //alignItems: "center",
    //backgroundColor: "#DDDDDD",
    //padding: 8,
    //marginVertical: 4,
    //borderRadius: 3,
  },
  variantCard: {
    flexBasis: "50%",
    padding: 6,
    /* Setting the flexBasis of a child is similar to setting the width of that child if its parent is a container with flexDirection: row or setting the height of a child if its parent is a container with flexDirection: column */
    //width: "50%",
    // margin: "1%",
  },
});
