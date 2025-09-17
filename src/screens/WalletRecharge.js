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
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
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
import { myAppRSformat } from "../global/functions";
import ProductGridCard from "../components/ProductGridCard";
import PackOfN from "../components/PackOfN";
import OutOfStock from "../components/OutOfStock";
import ImageSlider from "../components/ImageSlider";
/********************************************************************/
import { Ionicons } from "@expo/vector-icons";
import ShimmerSkeleton from "../components/ShimmerSkeleton";
import PaymentApps from "../components/PaymentApps";
import FakeCaret from "../components/FakeCaret";
import { LinearGradient } from "expo-linear-gradient";
import BottomModal from "../components/BottomModal";
import PaymentStatus from "../components/PaymentStatus";

//let p_ids_data = "";
export default function WalletRecharge({ navigation, route }) {
  const globalContext = useAppContext();
  const { globalAppParams } = globalContext;

  const amountInputRef = useRef();
  const amountBoxesRef = useRef();
  const paymentAppsRef = useRef();
  const paymentStatusRef = useRef();

  const isFocused = useIsFocused();
  useEffect(() => {
    // the below is very important to avoid running any API calls here after this screen is navigated to another screen
    if (!isFocused) {
      return () => {};
    }
  }, []);

  const sendAmountValue = () => {
    return amountInputRef.current.getAmount();
  };

  const onChange = () => {
    paymentAppsRef.current.reset();
  };

  const setBoxAmount = (amount) => {
    console.log("x", amount);
    paymentAppsRef.current.reset();
    amountInputRef.current.setAmount(amount);
    amountInputRef.current.removeFakeCaret();
  };

  const onPaymentStart = () => {
    paymentStatusRef.current.show(1);
  };

  const onPaymentSuccess = () => {
    paymentStatusRef.current.show(2);
    setTimeout(() => {
      const amount = amountInputRef.current.getAmount();
      AppUser.addToWallet(amount).then(() => {
        try {
          globalContext.callBacks.onWalletRechargeSuccess();
        } catch (err) {
          //console.log(err);
        }
        navigation.goBack();
      });
    }, 2000);
  };

  const onPaymentError = () => {};

  return (
    <ScreenContainer
      navigation={navigation}
      route={route}
      ScreenParams={route.params || {}}
      scrollingContainer={true}
    >
      <View style={{ paddingHorizontal: 12 }}>
        <Text
          style={{
            alignSelf: "center",
            marginVertical: 12,
            paddingHorizontal: 5,
          }}
        >
          {globalAppParams.appName} wallet is a faster and secured way of paying
          for the orders
        </Text>
        <KeyboardAvoidingView>
          <AmountInput ref={amountInputRef} onChange={onChange} />
        </KeyboardAvoidingView>
        <AmountBoxes ref={amountBoxesRef} setBoxAmount={setBoxAmount} />
        <Text style={{ fontSize: 12, marginTop: 12, marginLeft: 4 }}>
          Enter recharge amount above and select your PaymentApp
        </Text>
        <View
          style={{
            padding: 20,
            backgroundColor: "#e0e0e098",
            borderRadius: 15,
            marginTop: 12,
          }}
        >
          <Text>Pay with</Text>
          <PaymentApps
            ref={paymentAppsRef}
            amount={0}
            minRequied={100}
            maxLimit={10000}
            amountReader={sendAmountValue}
            wallet={false}
            walletCB={null}
            onPaymentStart={onPaymentStart}
            onPaymentSuccess={onPaymentSuccess}
            onPaymentError={onPaymentError}
          />
        </View>
        <PaymentStatus ref={paymentStatusRef} />
      </View>
    </ScreenContainer>
  );
}

const AmountInput = forwardRef(
  ({ totalAmount, openWalletRechrge, onChange }, ref) => {
    const [value, setValue] = useState("");

    const inputRef = useRef(null);
    const fakeCaretRef = useRef();

    useImperativeHandle(
      ref,
      () => ({
        // returns number (or NaN if empty/invalid)
        getAmount() {
          return parseFloat(value) || 0;
        },
        // sets value using the passed amount
        setAmount(amount, options = { blur: true }) {
          const next = amount == null ? "" : String(amount);
          setValue(next);

          // schedule blur/dismiss after state update/render
          if (options.blur) {
            // small delay ensures TextInput has updated and any focus changes settle
            requestAnimationFrame(() => {
              // try blur on input ref first
              if (
                inputRef.current &&
                typeof inputRef.current.blur === "function"
              ) {
                inputRef.current.blur();
              }
              // also call Keyboard.dismiss() as fallback
              Keyboard.dismiss();
            });
          }
        },
        removeFakeCaret() {
          fakeCaretRef?.current?.remove();
        },
      }),
      [value]
    );

    useEffect(() => {});

    return (
      <View
        style={{
          width: "100%",
          marginTop: 0,
          padding: 20,
          backgroundColor: "#e0e0e098",
          borderRadius: 15,
        }}
      >
        <Text style={GlobalStyles.inputLabel}>Enter Recharge Amount</Text>
        <View>
          <TextInput
            ref={inputRef}
            value={value ?? ""}
            style={[
              GlobalStyles.textInput,
              { backgroundColor: "#fff", borderColor: "#e0dedeff" },
            ]}
            maxLength={30}
            keyboardType="number-pad"
            // update state with the typed value (keep only digits / dot if you want decimals)
            onChangeText={(val) => {
              // sanitize input: keep digits and optional decimal point
              const sanitized = val.replace(/[^0-9.]/g, "");
              onChange();
              setValue(sanitized);
            }}
            placeholder="Recharge Amount. Minimum Rs.100"
            onFocus={() => {
              fakeCaretRef?.current?.remove();
            }}
          />
          <FakeCaret ref={fakeCaretRef} left={6} /* padding of TextInput*/ />
        </View>
      </View>
    );
  }
);

const AmountBoxes = forwardRef(({ setBoxAmount }, ref) => {
  const [value, setValue] = useState({ show: false, balance: 0 });

  const globalContext = useAppContext();

  useImperativeHandle(ref, () => ({
    getAmount() {
      return value;
    },
    setAmount(amount) {
      setValue(amount);
    },
  }));

  useEffect(() => {}, []);

  const setAmount = (amount) => {
    setBoxAmount(amount);
  };

  const amounts = [100, 300, 500, 1000, 2000, 3000, 5000, 10000];
  const Boxes = amounts.map((amount, index) => {
    return (
      <Pressable
        key={index.toString()}
        onPress={() => {
          setAmount(amount);
        }}
      >
        <LinearGradient
          style={styles.amountBox}
          colors={["#616161ff", "#747474ff"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        >
          <Text style={{ color: "white" }}>{myAppRSformat(amount)}</Text>
        </LinearGradient>
      </Pressable>
    );
  });

  return (
    <View
      style={{
        width: "100%",
        marginTop: 12,
        padding: 20,
        borderRadius: 15,
        backgroundColor: "#e0e0e098",
      }}
    >
      <Text style={[GlobalStyles.inputLabel, { marginBottom: 12 }]}>
        (Or) Select Recharge Amount
      </Text>
      <View style={styles.amountBoxes}>{Boxes}</View>
    </View>
  );
});

const styles = StyleSheet.create({
  amountBoxes: {
    flexDirection: "row",
    gap: 16,
    flexWrap: "wrap",
    //justifyContent: "space-evenly",
  },
  amountBox: {
    padding: 8,
    //borderWidth: 1,
    // borderColor: "#ffffffff",
    // backgroundColor: "#fff",
  },
});
