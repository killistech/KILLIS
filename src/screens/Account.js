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
  ImageBackground,
  TextInput,
} from "react-native";

import { useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
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
import { myAppRSformat, myNavigationHandler } from "../global/functions";
import ProductGridCard from "../components/ProductGridCard";
import PackOfN from "../components/PackOfN";
import OutOfStock from "../components/OutOfStock";
import ImageSlider from "../components/ImageSlider";
import ReDirecting from "./ReDirecting";
import BottomModal from "../components/BottomModal";
import { StatusBar } from "expo-status-bar";
/********************************************************************/

export default function Account({ navigation, route }) {
  const [userData, setUserData] = useState(null);

  const globalContext = useAppContext();
  const { globalAppParams } = globalContext;

  const nameMobileRef = useRef();
  const walletBalanceRef = useRef();

  const isFocused = useIsFocused();
  useEffect(() => {
    getUserData();
    // the below is very important to avoid running any API calls here after this screen is navigated to another screen
    if (!isFocused) {
      return () => {};
    }
  }, []);

  const reLoad = () => {
    getUserData();
  };

  const getUserData = () => {
    AppUser.get(navigation).then((userData) => {
      console.log("userData", userData);
      setUserData(userData);
    });
  };

  const goToNameMobileUpdate = () => {
    globalContext.callBacks.onNameNumberUpdate = reLoadNameMobile;
    myNavigationHandler(navigation, "UpdateNameMobile", {});
  };

  const reLoadNameMobile = () => {
    nameMobileRef.current.reLoad();
  };

  const reLoadWallet = () => {
    walletBalanceRef.current.reLoad();
  };

  const goTo = (screenName) => {
    myNavigationHandler(navigation, screenName, {});
  };

  return (
    userData != null && (
      <ScreenContainer
        navigation={navigation}
        route={route}
        ScreenParams={route.params || {}}
      >
        <View style={styles.container}>
          <View style={styles.userContainer}>
            <Ionicons
              name="person-circle"
              size={50}
              color={COLORS.primary}
            ></Ionicons>
            <NameMobile ref={nameMobileRef} userData={userData} />
            <Pressable
              style={{
                width: 50,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                goToNameMobileUpdate();
              }}
            >
              <AntDesign name="edit" size={24} color={COLORS.primaryDark} />
            </Pressable>
          </View>
          <View style={styles.walletContainer}>
            <View
              style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
            >
              <Ionicons
                name="wallet"
                size={30}
                color={COLORS.primary}
              ></Ionicons>
              <Text>{globalAppParams.appName + " Wallet"}</Text>
            </View>
            <Text style={{ marginVertical: 6, color: "#666" }}>
              Faster and Secured way to make payments
            </Text>
            <View
              style={{
                borderBottomColor: "#AAA",
                borderBottomWidth: 0.8,
                marginVertical: 10,
              }}
            ></View>
            <View
              style={{ flexDirection: "column", gap: 10, alignItems: "center" }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  gap: 2,
                  alignItems: "center",
                }}
              >
                <Text>Balance: </Text>
                <WalletBalance
                  ref={walletBalanceRef}
                  walletBalance={userData.walletBalance}
                />
              </View>
              <Pressable
                style={styles.rechargeButton}
                onPress={() => {
                  globalContext.callBacks.onWalletRechargeSuccess =
                    reLoadWallet;
                  myNavigationHandler(navigation, "WalletRecharge", {});
                }}
              >
                <Text style={{ color: "#FFF" }}>Recharge</Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.rowsContainer}>
            <TouchableOpacity style={styles.row}>
              <Ionicons
                name="bag-check-outline"
                size={20}
                color={COLORS.primary}
              ></Ionicons>
              <Text style={{ flex: 1, fontSize: 15 }}>Orders</Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={COLORS.primary}
              ></Ionicons>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.row}
              onPress={() => {
                goTo("Addresses");
              }}
            >
              <Ionicons
                name="location-outline"
                size={20}
                color={COLORS.primary}
              ></Ionicons>
              <Text style={{ flex: 1, fontSize: 15 }}>Addresses</Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={COLORS.primary}
              ></Ionicons>
            </TouchableOpacity>
            <TouchableOpacity style={styles.row}>
              <Ionicons
                name="wallet-outline"
                size={20}
                color={COLORS.primary}
              ></Ionicons>
              <Text style={{ flex: 1, fontSize: 15 }}>
                Recharge other's Wallet
              </Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={COLORS.primary}
              ></Ionicons>
            </TouchableOpacity>
            <TouchableOpacity style={styles.row}>
              <Ionicons
                name="list-outline"
                size={20}
                color={COLORS.primary}
              ></Ionicons>
              <Text style={{ flex: 1, fontSize: 15 }}>Transaction History</Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={COLORS.primary}
              ></Ionicons>
            </TouchableOpacity>
            <TouchableOpacity style={styles.row}>
              <Ionicons
                name="ticket-outline"
                size={20}
                color={COLORS.primary}
              ></Ionicons>
              <Text style={{ flex: 1, fontSize: 16 }}>Coupons</Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={COLORS.primary}
              ></Ionicons>
            </TouchableOpacity>
            <TouchableOpacity style={styles.row}>
              <Ionicons
                name="wallet-outline"
                size={20}
                color={COLORS.primary}
              ></Ionicons>
              <Text style={{ flex: 1, fontSize: 15 }}>Support</Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={COLORS.primary}
              ></Ionicons>
            </TouchableOpacity>
            <TouchableOpacity style={styles.row}>
              <Ionicons
                name="wallet-outline"
                size={20}
                color={COLORS.primary}
              ></Ionicons>
              <Text style={{ flex: 1, fontSize: 15 }}>Review's & Feedback</Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={COLORS.primary}
              ></Ionicons>
            </TouchableOpacity>
          </View>
        </View>
      </ScreenContainer>
    )
  );
}

const NameMobile = forwardRef(({ userData }, ref) => {
  const [data, setData] = useState({
    userName: userData.userName,
    mobileNumber: userData.mobileNumber,
  });

  const globalContext = useAppContext();

  useImperativeHandle(ref, () => ({
    reLoad() {
      AppUser.get().then((newData) => {
        setData({
          userName: newData.userName,
          mobileNumber: newData.mobileNumber,
        });
      });
    },
  }));

  useEffect(() => {}, []);

  return (
    <View style={{ flex: 1, gap: 5 }}>
      <Text style={{ fontSize: 16 }}>
        {data.userName == "" ? (
          <Text style={{ fontStyle: "italic" }}>Provide Your Name</Text>
        ) : (
          data.userName
        )}
      </Text>
      <Text style={{ fontSize: 15 }}>
        {data.mobileNumber.substr(0, 5) + " " + data.mobileNumber.substr(5)}
      </Text>
    </View>
  );
});

const WalletBalance = forwardRef(({ walletBalance }, ref) => {
  const [balance, setBalance] = useState(walletBalance);

  const globalContext = useAppContext();

  useImperativeHandle(ref, () => ({
    reLoad() {
      AppUser.getWalletBalance().then((newBalance) => {
        console.log("newBalance", newBalance);
        setBalance(newBalance);
      });
    },
  }));

  useEffect(() => {}, []);

  return (
    <Text style={{ fontSize: 20, fontWeight: "bold" }}>
      {myAppRSformat(balance)}
    </Text>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  userContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    margin: 10,
    marginBottom: 10,
    backgroundColor: COLORS.primary + COLORS.opacs[93],
    padding: 20,
    borderRadius: 20,
  },
  walletContainer: {
    margin: 10,
    marginTop: 0,
    marginBottom: 10,
    backgroundColor: COLORS.primary + COLORS.opacs[93],
    padding: 20,
    borderRadius: 20,
  },
  rechargeButton: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 0,
    backgroundColor: COLORS.sharpButton,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 32,
  },
  rowsContainer: {
    marginTop: 10,
    backgroundColor: COLORS.primary + COLORS.opacs[93],
    borderTopColor: "#CCC",
    borderTopWidth: 0.8,
  },
  row: {
    flexDirection: "row",
    gap: 20,
    paddingHorizontal: 10,
    paddingVertical: 16,
    borderBottomColor: "#CCC",
    borderBottomWidth: 0.8,
  },
});
