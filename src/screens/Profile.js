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
import {
  H1Text,
  H2Text,
  H3Text,
  MyActivityIndicator,
} from "../global/elements";
import { AppContext, useAppContext } from "../context/AppContext";
import { AppUser } from "../global/AppUser";
import PercentOffTag from "../components/PercentOffTag";
import MY_API from "../global/API";
import Cart from "../global/Cart";
import { myAppRSformat, myNavigationHandler } from "../global/functions";
import ProductGridCard from "../components/ProductGridCard";
import PackOfN from "../components/PackOfN";
import OutOfStock from "../components/OutOfStock";
import ImageSlider from "../components/ImageSlider";
/********************************************************************/

//let p_ids_data = "";
export default function Profile({ navigation, route }) {
  const [userData, setUserData] = useState({ fetched: false, data: {} });

  const isFocused = useIsFocused();
  useEffect(() => {
    // the below is very important to avoid running any API calls here after this screen is navigated to another screen
    if (!isFocused) {
      return () => {};
    }

    AppUser.get(navigation).then((data) => {
      console.log("Profile UseEffect");
      console.log(data);
      setUserData({ fetched: true, data: data });
    });
  }, []);

  return (
    <ScreenContainer
      navigation={navigation}
      route={route}
      ScreenParams={route.params || {}}
    >
      {userData.fetched ? (
        <View>
          <View style={styles.section}>
            <View style={styles.sectionLeft}>
              <Text style={styles.labelText}>Name</Text>
              {userData.data.userName == "" ? (
                <Text style={styles.provideText}>Provide Name</Text>
              ) : (
                <Text style={styles.dataText}>{userData.data.userName}</Text>
              )}
            </View>
            <View style={styles.sectionRight}>
              <Pressable style={styles.changeBtn}>
                <Text style={styles.changeBtnText}>Change</Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.sectionLeft}>
              <Text style={styles.labelText}>Mobile Number</Text>
              {userData.data.userName == "" ? (
                <Text style={styles.provideText}>Provide Mobile Number</Text>
              ) : (
                <Text style={styles.dataText}>{userData.data.userName}</Text>
              )}
            </View>
            <View style={styles.sectionRight}>
              <Pressable
                style={styles.changeBtn}
                onPress={() => {
                  myNavigationHandler(navigation, "UpdateMobile", {});
                }}
              >
                <Text style={styles.changeBtnText}>Change</Text>
              </Pressable>
            </View>
          </View>
        </View>
      ) : (
        <MyActivityIndicator />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: "#F8F8F8",
    padding: 12,
    borderColor: "#DDD",
    borderWidth: 1,
    margin: 10,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  sectionLeft: {
    flex: 1,
  },
  sectionRight: {},
  labelText: {
    marginBottom: 6,
  },
  provideText: {
    fontStyle: "italic",
    color: "#666666",
  },
  dataText: {
    fontSize: 18,
    color: "#121212",
  },
  changeBtn: {
    backgroundColor: COLORS.primary,
    padding: 8,
    borderRadius: 2,
  },
  changeBtnText: {
    color: "white",
  },
});
