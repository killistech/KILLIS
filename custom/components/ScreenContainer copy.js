import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  memo,
  useRef,
} from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Platform,
  StatusBar,
  TouchableOpacity,
  Button,
  Image,
  BackHandler,
  Pressable,
  Animated,
} from "react-native";

/************* Created for this Application *************************/
import GlobalStyles from "../global/styles";
import COLORS from "../global/colors";
import { H2Text, H3Text } from "../global/elements";
import { AppContext, useAppContext } from "../context/AppContext";
import MyAppSearch from "./MyAppSearch";
import DeliveryLocation from "./DeliveryLocation";
/********************************************************************/

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import CartBadge from "./CartBadge";

import { AppUser } from "../global/AppUser";
import { myNavigationHandler } from "../global/functions";

const statusBarHeight = Platform.OS === "android" ? StatusBar.currentHeight : 0;
const footerNavHeight = 55;
const footerIconSize = 24;
const footerIconColor = "#333333";
const footerIconActiveFillColor = COLORS.primaryDark;

const ScreenContainer = forwardRef((props, ref) => {
  const searchInputRef = useRef();

  const [showLoader, setShowLoader] = useState(false);
  const [loaderText, setLoaderText] = useState("Loading");
  console.log(123456);

  const {
    children = null,
    navigation,
    route,
    styleParams = {},
    scrollingContainer = true,
  } = props;
  console.log(route);

  const globalContext = useAppContext();

  globalContext.setLoadingBlocker = (show, title) => {
    title = typeof title == "undefined" ? "" : title;
    //console.log(title);
    //console.log(show);
    setShowLoader(show);
    if (title != "") {
      setLoaderText(title);
    }
  };

  const onBackPress = () => {
    if (route.name == "Home") {
      //console.log("Home --- No goBack");
      return true;
    }
    //console.log(showLoader);
    if (showLoader) {
      // console.log("Loadding yaaar");
      return true;
    }

    return false;
  };

  //const cartBadgeRef = useRef();

  useEffect(() => {
    console.log("Screen Container re rendered");
    //remove listner before this --> BackHandler.addEventListener("hardwareBackPress", onBackPress);
    /* const CartCountReadListner = EventRegister.on("CartCountRead", () => {
      console.log("EVENT: CartCountRead");
      //cartBadgeRef.current.triggerRenderCartCount();
    }); */

    return () => {
      //EventRegister.rm(CartCountReadListner);
    };
  }, []);

  useImperativeHandle(ref, (show, title) => ({
    loader(show, title) {
      title = typeof title == "undefined" ? "" : title;
      console.log(title);
      console.log(show);
      setShowLoader(show);
      if (title != "") {
        setLoaderText(title);
      }
    },
  }));

  const openCartPage = () => {
    myNavigationHandler(navigation, "CartSummary", {});
  };

  const showSearchInput = () => {
    searchInputRef.current.showInputField();
  };

  const headerIconSize = 22;

  const backIconName =
    Platform.OS === "android" ? "arrow-back-sharp" : "chevron-back";
  const { header = true } = route.params || {}; //if the initialParams in MyRotes on Stack.Screen are not set then toutes.params would be undefined
  const headerOptions =
    header && route.params?.headerOptions ? route.params?.headerOptions : {};

  const {
    headerTitle = globalContext.globalAppParams.appName,
    cart = true,
    searchIcon = true,
    deliveryLocation = false,
    coloredHeader = false,
  } = headerOptions;

  const headerIconColor = coloredHeader ? "#FFFFFF" : "#000000";
  const headerTextColor = coloredHeader ? "#FFFFFF" : "#000000";

  const { footerNav = false } = route.params || {};

  const { hCenter = false, vCenter = false } = styleParams;
  const backButton =
    navigation.canGoBack() && route.name != "Home" && route.name != "HomePre"
      ? true
      : false;

  const headerJSX =
    route.name == "Home" || route.name == "HomePre" ? (
      <LinearGradient
        colors={[COLORS.primaryLight, COLORS.primary]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <View style={styles.header}>
          <Pressable
            style={styles.searchHolder}
            onPress={() => {
              navigation.navigate("Search", { screenData: {} });
            }}
          >
            <Ionicons
              name="search"
              size={headerIconSize}
              color={"#888"}
              style={{ marginHorizontal: 8 }}
            />
            <Text style={{ color: "#888", fontSize: 15 }}>
              Search for products
            </Text>
          </Pressable>
        </View>
      </LinearGradient>
    ) : coloredHeader ? (
      <LinearGradient
        colors={[COLORS.primaryLight, COLORS.primaryDark]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <View style={[styles.header]}>
          <View style={styles.headerIconHolder}>
            {backButton && (
              <Pressable
                style={styles.headerIcon}
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <Ionicons
                  name={backIconName}
                  size={headerIconSize}
                  color={headerIconColor}
                />
              </Pressable>
            )}
          </View>
          <View style={styles.headerCenterArea}>
            <Text
              style={[styles.headerTitle, { color: headerTextColor }]}
              numberOfLines={1}
            >
              {headerTitle != ""
                ? headerTitle
                : globalContext.globalAppParams.appName}
            </Text>
          </View>
          <View style={styles.headerIconHolder}>
            {searchIcon && (
              <Pressable
                style={styles.headerIcon}
                onPress={() => {
                  navigation.navigate("Search", { screenData: {} });
                }}
              >
                <Ionicons
                  name="search"
                  size={headerIconSize}
                  color={headerIconColor}
                />
              </Pressable>
            )}
          </View>
        </View>
      </LinearGradient>
    ) : (
      <View
        style={[
          styles.header,
          { backgroundColor: COLORS.appHeaderBackGroundColor },
        ]}
      >
        <View style={styles.headerIconHolder}>
          {backButton && (
            <Pressable
              style={styles.headerIcon}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Ionicons
                name={backIconName}
                size={headerIconSize}
                color={headerIconColor}
              />
            </Pressable>
          )}
        </View>
        <View style={styles.headerCenterArea}>
          <Text
            style={[styles.headerTitle, { color: headerTextColor }]}
            numberOfLines={1}
          >
            {headerTitle != ""
              ? headerTitle
              : globalContext.globalAppParams.appName}
          </Text>
        </View>
        <View style={styles.headerIconHolder}>
          {searchIcon && (
            <Pressable
              style={styles.headerIcon}
              onPress={() => {
                navigation.navigate("Search", { screenData: {} });
              }}
            >
              <Ionicons
                name="search"
                size={headerIconSize}
                color={headerIconColor}
              />
            </Pressable>
          )}
        </View>
      </View>
    );

  return (
    <SafeAreaView
      style={{
        //paddingTop: statusBarHeight,
        paddingTop:
          Platform.OS == "android" &&
          !header &&
          route.name != "FirstLaunch" &&
          route.name != "Search"
            ? StatusBar.currentHeight
            : 0,
        paddingBottom: footerNav ? footerNavHeight : 0,
        flex: 1,
        width: Dimensions.get("window").width,
        //height: Dimensions.get("window").height - statusBarHeight,
        // backgroundColor:
        //  Platform.OS == "android" && !header ? COLORS.primary : "#FFFFFF",

        //borderWidth: 3,
        //borderColor: "red",
      }}
    >
      {header && headerJSX}
      {deliveryLocation && <DeliveryLocation />}
      {scrollingContainer ? (
        <ScrollView
          keyboardShouldPersistTaps="always"
          style={styles.container}
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={styles.container}>{children}</View>
      )}

      {showLoader && (
        <View style={[styles.blocker, { marginTop: statusBarHeight }]}>
          <Image
            source={require("../images/loading.gif")}
            style={{ width: 24, height: 24 }}
          />
          <Text>{loaderText}</Text>
        </View>
      )}
      {footerNav ? (
        <View style={styles.footerNavContainer}>
          <Pressable
            style={styles.iconHolder}
            onPress={() => {
              if (route.name == "HomePre") {
                return false;
              }

              navigation.navigate("Home", { screenData: {} });
            }}
          >
            <Ionicons
              name={
                route.name == "Home" || route.name == "HomePre"
                  ? "home"
                  : "home-outline"
              }
              size={footerIconSize}
              color={
                route.name == "Home" || route.name == "HomePre"
                  ? footerIconActiveFillColor
                  : footerIconColor
              }
            />
            <Text
              style={[
                styles.footerNavIconLabel,
                {
                  fontWeight:
                    route.name == "Home" || route.name == "HomePre"
                      ? "bold"
                      : "normal",
                },
              ]}
            >
              {globalContext.globalAppParams.appName}
            </Text>
          </Pressable>
          <Pressable
            style={styles.iconHolder}
            onPress={() => {
              if (route.name == "HomePre") {
                return false;
              }
              navigation.navigate("ListOrder", { screenData: {} });
            }}
          >
            <View>
              <Ionicons
                name={
                  route.name == "ListOrder"
                    ? "receipt-sharp"
                    : "receipt-outline"
                }
                size={footerIconSize + 0}
                color={
                  route.name == "ListOrder"
                    ? footerIconActiveFillColor
                    : footerIconColor
                }
              />
              <View style={{ position: "absolute", top: 0, left: -8 }}>
                <Ionicons
                  name={
                    route.name == "ListOrder"
                      ? "camera-sharp"
                      : "camera-outline"
                  }
                  size={footerIconSize - 5}
                  color={
                    route.name == "ListOrder"
                      ? footerIconActiveFillColor + COLORS.opacs[15]
                      : footerIconColor
                  }
                />
              </View>
            </View>
            <Text
              style={[
                styles.footerNavIconLabel,
                {
                  fontWeight: route.name == "ListOrder" ? "bold" : "normal",
                },
              ]}
            >
              List Order
            </Text>
          </Pressable>
          <Pressable
            style={styles.iconHolder}
            onPress={() => {
              if (route.name == "HomePre") {
                return false;
              }
              navigation.navigate("CartSummary", { screenData: {} });
            }}
          >
            <Ionicons
              name={route.name == "CartSummary" ? "cart" : "cart-outline"}
              size={footerIconSize + 4}
              color={
                route.name == "CartSummary"
                  ? footerIconActiveFillColor
                  : footerIconColor
              }
            />
            <Text
              style={[
                styles.footerNavIconLabel,
                {
                  fontWeight: route.name == "CartSummary" ? "bold" : "normal",
                },
              ]}
            >
              Cart
            </Text>
            {route.name != "CartSummary" && <CartBadge />}
          </Pressable>
          <Pressable
            style={styles.iconHolder}
            onPress={() => {
              if (route.name == "HomePre") {
                return false;
              }
              navigation.navigate("Account", { screenData: {} });
            }}
          >
            <Ionicons
              name={route.name == "Account" ? "person" : "person-outline"}
              size={footerIconSize}
              color={
                route.name == "Account"
                  ? footerIconActiveFillColor
                  : footerIconColor
              }
            />
            <Text
              style={[
                styles.footerNavIconLabel,
                {
                  fontWeight: route.name == "Account" ? "bold" : "normal",
                },
              ]}
            >
              Account
            </Text>
          </Pressable>
        </View>
      ) : null}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  blocker: {
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99999,
    backgroundColor: "#1212126b",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    //backgroundColor: COLORS.primary,
    paddingTop: Platform.OS == "android" ? StatusBar.currentHeight + 8 : 0,
    paddingVertical: 10,
  },

  headerCenterArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },

  headerTitle: {
    fontSize: 16,
    color: "#ffffff",
    paddingLeft: 20,
    paddingRight: 20,
  },

  headerIconHolder: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  headerIcon: {
    // alignSelf: "flex-start",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: 40,
  },
  userIconHolder: {
    //backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },

  searchHolder: {
    flex: 1,
    height: 45,
    backgroundColor: "#ffffff",
    borderRadius: 3,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 8,
    marginHorizontal: 12,
    borderRadius: 5,
  },
  footerNavContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: footerNavHeight,
    backgroundColor: "#FFFFFF",
    borderTopColor: "#CCCCCC",
    borderTopWidth: 0.5,
  },
  iconHolder: {
    backgroundColor: "transparent",
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  footerNavIconLabel: {
    fontSize: 12,
    color: "#333333ff",
  },
  cartIcon: {
    bottom: 30,
    position: "absolute",
  },
});

export default ScreenContainer;
