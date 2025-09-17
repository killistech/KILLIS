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
  TextInput,
  KeyboardAvoidingView,
} from "react-native";

import { useIsFocused } from "@react-navigation/native";

/************* Created for this Application *************************/
import ScreenContainer from "../components/ScreenContainer";
import GlobalStyles from "../global/styles";
import COLORS from "../global/colors";
import { H1Text, H2Text, H3Text, InputField } from "../global/elements";
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

export default function LocationSearch({ navigation, route }) {
  return (
    <ScreenContainer
      navigation={navigation}
      route={route}
      ScreenParams={route.params || {}}
    >
      <Text>
        Location search with react-native-maps -- refer to GMAPSSEARCH app in
        MyPrjects folder
      </Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({});
