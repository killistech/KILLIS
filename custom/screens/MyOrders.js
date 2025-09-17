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
/********************************************************************/

export default function MyOrders({ navigation, route }) {
  const isFocused = useIsFocused();
  const [test, setTest] = useState(false);
  useEffect(() => {
    const d = new Date();
    console.log("UseEffect", d.getTime());
    // the below is very important to avoid running any API calls here after this screen is navigated to another screen
    if (!isFocused) {
      return () => {};
    }
  }, []);

  return (
    <ScreenContainer
      navigation={navigation}
      route={route}
      ScreenParams={route.params || {}}
    >
      <Text>MyOrders</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  takePicBtn: {
    width: 60,
    heihgt: 60,
    position: "absolute",
    bottom: 60,
    alignSelf: "center",
  },
});
