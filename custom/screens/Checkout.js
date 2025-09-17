import React, {
  useState,
  useEffect,
  forwardRef,
  useRef,
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
  ActivityIndicator,
  Alert,
} from "react-native";

import { useIsFocused } from "@react-navigation/native";

/************* Created for this Application *************************/
import ScreenContainer from "../components/ScreenContainer";
import GlobalStyles from "../global/styles";
import COLORS from "../global/colors";
import { RadioButton, H1Text, H2Text, H3Text } from "../global/elements";
import { AppContext, useAppContext } from "../context/AppContext";
import { AppUser } from "../global/AppUser";
import PercentOffTag from "../components/PercentOffTag";
import MY_API from "../global/API";
import Cart from "../global/Cart";
import {
  myAppRSformat,
  myNavigationHandler,
  myTextSpacingOnLineBreak,
} from "../global/functions";
import ProductGridCard from "../components/ProductGridCard";
import PackOfN from "../components/PackOfN";
import OutOfStock from "../components/OutOfStock";
import ImageSlider from "../components/ImageSlider";
/********************************************************************/
import { Ionicons } from "@expo/vector-icons";
import ShimmerSkeleton from "../components/ShimmerSkeleton";
import BottomModal from "../components/BottomModal";
import PaymentApps from "../components/PaymentApps";

//let p_ids_data = "";
export default function Checkout({ navigation, route }) {
  const [userData, setUserData] = useState(null);

  const walletPaymentRef = useRef();
  const deliveryAddressRef = useRef();
  const globalContext = useAppContext();

  const isFocused = useIsFocused();
  useEffect(() => {
    getUserData();
    // the below is very important to avoid running any API calls here after this screen is navigated to another screen
    if (!isFocused) {
      return () => {};
    }
  }, []);

  const getUserData = () => {
    console.log("getUserData");
    AppUser.get(navigation, true).then((data) => {
      console.log("user data");
      console.log(data);
      setUserData(data);
    });
  };

  const askToSelectAddress = () => {
    setTimeout(() => {
      Alert.alert("", "Please select one or add a new delivery address");
    }, 600);
  };

  const changeDeliveryAddress = () => {
    globalContext.callBacks.onAddessChange = reloadAddress;
    myNavigationHandler(navigation, "Addresses", {});
  };

  const reloadAddress = () => {
    //globalContext.callBacks.onAddessChange = null;
    console.log("XXreloadAddressreloadAddressreloadAddreloadAddress");
    try {
      const { exists, index } = isScreenIsInStack("ListOrder", navigation);
      if (exists) {
        deliveryAddressRef?.current?.reload();
      }
    } catch (err) {}
  };

  const openWalletPayment = () => {
    walletPaymentRef?.current?.show();
  };

  const openWalletRechrge = () => {
    myNavigationHandler(navigation, "WalletRecharge", {});
  };

  const createPODorderStart = () => {
    screenContainerRef?.current?.showActivityIndicator(
      "Creating Order. Please Wait . . ."
    );

    Cart.get().then((data) => {
      const orderData = data.map(({ p_id, orderCount }) => {
        return { pid: p_id, cnt: orderCount };
      });
      //console.log(orderData);

      createPODorder(orderData);
    });
  };

  const createPODorder = (orderData) => {
    const { addressText, lat, lng, contactNumber } =
      deliveryAddressRef.current.get();

    const { userId, accessToken, activeDelcId } = userData;
    MY_API({
      scriptName: "order_create_POD",
      data: {
        user_id: userId,
        access_token: accessToken,
        delc_id: activeDelcId,
        delivery_charge: 0,
        total_amount: route.params.screenData.totalAmount,
        paid_amount: 0,
        refundable_amount: 0,
        delivery_address: addressText,
        address_lat: lat,
        address_lng: lng,
        contact_number: contactNumber,
        order_data_json: JSON.stringify(orderData),
      },
      options: {},
    })
      .then(({ status, data }) => {
        console.log(data);
      })
      .catch(() => {
        // do nothing
      })
      .finally(() => {
        screenContainerRef?.current?.hideActivityIndicator();
      });
  };

  const createWalletOrder = () => {};

  const screenContainerRef = useRef();

  return (
    <ScreenContainer
      navigation={navigation}
      route={route}
      ScreenParams={route.params || {}}
      ref={screenContainerRef}
      scrollingContainer={false}
    >
      {userData && userData.selectedAddress ? (
        <View style={{ flex: 1 }}>
          <View
            style={{
              margin: 10,
              padding: 15,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#313131f3",
              borderRadius: 12,
            }}
          >
            <Text style={{ color: "#fff" }}>Total Amount</Text>
            <Text style={{ color: "#68d182ff", fontSize: 20 }}>
              {myAppRSformat(route.params.screenData.totalAmount)}
            </Text>
          </View>
          <DeliveryAddress
            ref={deliveryAddressRef}
            changeDeliveryAddress={changeDeliveryAddress}
          />
          <ScrollView style={{ paddingVertical: 4, paddingHorizontal: 16 }}>
            <H2Text text="Payment Options" />
            <View style={styles.optionHolder}>
              <Text style={styles.payOptionLabel}>Pay On Delivery</Text>
              <Text style={styles.description}>
                Pay at the time of delivery by cash or by your UPI App -
                PhonePay, GooglePay, Paytm ...
              </Text>
              <Pressable
                style={styles.placeOrderBtn}
                onPress={() => {
                  createPODorderStart();
                }}
              >
                <Text style={{ color: "white", fontSize: 18 }}>
                  PLACE ORDER
                </Text>
              </Pressable>
            </View>
            <View style={styles.optionHolder}>
              <Text style={styles.payOptionLabel}>Pay Now</Text>
              <Text style={styles.description}>
                Make payment Using {globalContext.globalAppParams.appName}{" "}
                Wallet, PhonePe, GooglePay, or Paytm Apps.
              </Text>
              <PaynowOptions
                navigation={navigation}
                totalAmount={route.params.screenData.totalAmount}
                walletPaymentCB={openWalletPayment}
              />
            </View>
          </ScrollView>
          <WalletPayment
            ref={walletPaymentRef}
            navigation={navigation}
            totalAmount={route.params.screenData.totalAmount}
            openWalletRechrge={openWalletRechrge}
            createWalletOrder={createWalletOrder}
          />
        </View>
      ) : (
        <View style={{ flex: 1, gap: 25 }}>
          <ShimmerSkeleton width="90%" height={120} borderRadius={10} />
          <ShimmerSkeleton width="90%" height={120} borderRadius={10} />
          <ShimmerSkeleton
            flex={1}
            width="90%"
            height={120}
            borderRadius={10}
          />
        </View>
      )}
    </ScreenContainer>
  );
}

const DeliveryAddress = forwardRef(({ changeDeliveryAddress }, ref) => {
  const [selectedAddress, setSelectedAddress] = useState(null);

  useImperativeHandle(ref, () => ({
    get() {
      return selectedAddress;
    },
    reload() {
      getSelectedAddress();
    },
  }));

  useEffect(() => {
    getSelectedAddress();
  }, []);

  const getSelectedAddress = () => {
    AppUser.getSelectedAdrress().then((data) => {
      console.log("selectedAddress", data);
      setSelectedAddress(data);
    });
  };

  return selectedAddress ? (
    <View
      style={{
        margin: 10,
        padding: 10,
        justifyContent: "center",
        //alignItems: "center",
        backgroundColor: "#e7e7e7f3",
        borderRadius: 12,
      }}
    >
      <Text style={{ fontSize: 12, color: "#474747ff", marginBottom: 2 }}>
        Deliver To:
      </Text>
      <Text>{selectedAddress.title + ": " + selectedAddress.addressText}</Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons
          name="call-outline"
          size={12}
          color="#797878ff"
          style={{ marginRight: 4 }}
        />
        <Text style={{ flex: 1, marginTop: 4 }}>
          {selectedAddress.contactNumber}
        </Text>
        <Pressable
          style={{ padding: 8, paddingBottom: 0 }}
          onPress={() => {
            changeDeliveryAddress();
          }}
        >
          <Text
            style={{
              //borderWidth: 1,
              //borderColor: COLORS.primaryDark,
              //backgroundColor: "#525252b7",
              // borderRadius: 20,
              textDecorationLine: "underline",
              color: "#272727ff",
              fontSize: 12,
              paddingHorizontal: 2,
            }}
          >
            Change
          </Text>
        </Pressable>
      </View>
    </View>
  ) : (
    <Pressable
      style={{ paddingVertical: 12 }}
      onPress={() => {
        changeDeliveryAddress();
      }}
    >
      <Text
        style={{
          color: "blue",
          alignSelf: "center",
          marginVertical: 10,
        }}
      >
        Select Delivery Address
      </Text>
    </Pressable>
  );
});

const PaynowOptions = ({ navigation, totalAmount, walletPaymentCB }) => {
  const openPhonePay = () => {
    console.log("openPhonePay");
  };

  const openGooglePay = () => {
    console.log("openGooglePay");
  };

  const openPaytm = () => {
    console.log("openPaytm");
  };

  return (
    <View style={{}}>
      <Text style={{ marginTop: 10, fontWeight: "bold", color: "#474747ff" }}>
        Select a Payment Option
      </Text>
      <PaymentApps
        amount={totalAmount}
        wallet={true}
        walletCB={walletPaymentCB}
      />
    </View>
  );
};

const WalletPayment = forwardRef(
  ({ navigation, totalAmount, openWalletRechrge, createWalletOrder }, ref) => {
    const [wallet, setWallet] = useState({ show: false, balance: 0 });

    const globalContext = useAppContext();

    useImperativeHandle(ref, () => ({
      show() {
        readWalletBalance();
      },
      hide() {
        close();
      },
    }));

    useEffect(() => {}, []);

    const close = () => {
      setWallet({ show: false, balance: 0 });
    };

    const readWalletBalance = () => {
      AppUser.get(navigation).then((data) => {
        setWallet({ show: true, balance: data.walletBalance });
      });
    };

    const onModalClose = () => {
      close();
    };

    const triggerWalletRecharge = () => {
      globalContext.callBacks.onWalletRechargeSuccess = readWalletBalance;
      close();
      openWalletRechrge();
    };
    return (
      wallet.show && (
        <BottomModal onModalClose={onModalClose} onOutSidePress={close}>
          <View style={{ padding: 10, alignItems: "center", gap: 12 }}>
            <H2Text
              text={`Pay from your ${globalContext.globalAppParams.appName} Wallet`}
            />
            <View
              style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
            >
              <Ionicons
                name="wallet"
                size={25}
                color={COLORS.primaryDark}
              ></Ionicons>
              <Text>
                Available Balance:{" "}
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                  {myAppRSformat(wallet.balance)}
                </Text>
              </Text>
            </View>
            {Number(wallet.balance) < Number(totalAmount) ? (
              <View style={{ alignItems: "center" }}>
                <Text style={{ color: "red" }}>
                  {myTextSpacingOnLineBreak(`Insufficient balance to pay ${myAppRSformat(
                    totalAmount
                  )} for this
                order`)}
                </Text>
                <Pressable
                  style={{
                    padding: 8,
                    marginVertical: 14,
                    borderRadius: 4,
                    backgroundColor: COLORS.coolButton,
                    alignSelf: "center",
                    flexGrow: 0,
                  }}
                  onPress={() => {
                    triggerWalletRecharge();
                  }}
                >
                  <Text style={{ color: "white" }}>RECHARGE WALLET</Text>
                </Pressable>
                <Text>---------- Or Pay using ----------</Text>
                <PaymentApps amount={totalAmount} />
              </View>
            ) : (
              <View style={{}}>
                <Pressable
                  style={styles.placeOrderBtn}
                  onPress={() => {
                    createWalletOrder();
                  }}
                >
                  <Text style={{ color: "white", fontSize: 18 }}>
                    PLACE ORDER
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </BottomModal>
      )
    );
  }
);

const styles = StyleSheet.create({
  optionHolder: {
    //flexGrow: 1,
    backgroundColor: "#F2F2F2",
    //elevation: 10,
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  payOptionLabel: {
    fontWeight: "bold",
  },
  description: {
    color: "#555",
    marginTop: 10,
  },

  placeOrderBtn: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 0,
    backgroundColor: COLORS.sharpButton,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 32,
    marginTop: 15,
  },
});
