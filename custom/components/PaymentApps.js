import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

/************* Created for this Application *************************/

/********************************************************************/
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../global/colors";
import { useAppContext } from "../context/AppContext";
import { myAppRSformat } from "../global/functions";

const PaymentApps = forwardRef(
  (
    {
      amount = 0,
      minRequied = null,
      maxLimit = null,
      amountReader = null,
      onZeroAmount = "Please set current amount for payment",
      wallet = false,
      walletCB = null,
      onPaymentStart = null,
      onPaymentSuccess = null,
      onPaymentError = null,
    },
    ref
  ) => {
    const globalContext = useAppContext();
    const payButtonRef = useRef();

    useEffect(() => {}, []);

    useImperativeHandle(ref, () => ({
      reset() {
        payButtonRef.current.hide();
      },
    }));

    const triggerPayent = (app) => {
      if (amountReader) {
        amount = amountReader();
      }

      if (amount == 0 || amount.toString().trim() == "") {
        Alert.alert("", onZeroAmount);
        return;
      }
      if (minRequied && amount < Number(minRequied)) {
        Alert.alert(
          "",
          "Minimum amount of " + myAppRSformat(minRequied) + " is required"
        );
        return;
      }
      if (maxLimit && amount > Number(maxLimit)) {
        Alert.alert("", maxLimit + " is the maximum allowed");
        return;
      }
      if (app != "pp" && app != "gp" && app != "pt") {
        return;
      }

      payButtonRef.current.show(app, amount);
    };

    let paymentInProgress = false;
    const onPayButtonPress = (app, amount) => {
      if (paymentInProgress) {
        return;
      }
      paymentInProgress = true;
      startPayment(app, amount);
    };

    const startPayment = (app, amount) => {
      console.log("Proceed", app, amount);

      //temp - MIMIC
      const responseFromUPIApp = {
        status: "Success",
        amount: amount,
        transactionID: "12345678",
      };

      if (onPaymentStart) {
        onPaymentStart();
      }
      setTimeout(() => {
        if (onPaymentSuccess) {
          onPaymentSuccess();
        }
      }, 5000);
      //temp - MIMIC
    };

    return (
      <View style={{}}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <TouchableOpacity
            style={{ flexShrink: 1 }}
            onPress={() => {
              triggerPayent("pp");
            }}
          >
            <Image
              style={styles.paymentIcon}
              source={require("../images/PaymentIcons/phonepe.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flexShrink: 1 }}
            onPress={() => {
              triggerPayent("gp");
            }}
          >
            <Image
              style={styles.paymentIcon}
              source={require("../images/PaymentIcons/googlepay.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flexShrink: 1 }}
            onPress={() => {
              triggerPayent("pt");
            }}
          >
            <Image
              style={styles.paymentIcon}
              source={require("../images/PaymentIcons/paytm.png")}
            />
          </TouchableOpacity>
          {wallet && (
            <TouchableOpacity
              style={{ flexShrink: 1 }}
              onPress={() => {
                if (walletCB) {
                  walletCB();
                }
              }}
            >
              <View
                style={{
                  borderColor: "#10207cff",
                  borderWidth: 2,
                  width: 56,
                  height: 56,
                  borderRadius: 30,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name="wallet"
                  size={25}
                  color={COLORS.primaryDark}
                ></Ionicons>
                <Text style={{ fontSize: 10 }}>Wallet</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
        <PayButton ref={payButtonRef} onPayButtonPress={onPayButtonPress} />
      </View>
    );
  }
);

const PayButton = forwardRef(({ onPayButtonPress }, ref) => {
  const { PaymentAppNames } = useAppContext();
  const [stateData, setStateData] = useState({
    show: false,
    amount: 0,
    app: "",
  });

  useImperativeHandle(ref, () => ({
    show(app, amount) {
      setStateData({ show: true, amount: amount, app: app });
    },
    hide() {
      if (stateData.show) {
        setStateData({ show: false, amount: 0, app: "" });
      }
    },
  }));

  useEffect(() => {}, []);

  return (
    stateData.show &&
    !isNaN(stateData.amount) &&
    Number(stateData.amount > 0) && (
      <Pressable
        style={styles.payButton}
        onPress={() => {
          onPayButtonPress(stateData.app, stateData.amount);
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          Open {PaymentAppNames[stateData.app]} for{" "}
          {myAppRSformat(stateData.amount)}
        </Text>
      </Pressable>
    )
  );
});

const styles = StyleSheet.create({
  paymentIcon: {
    //maxWidth: 70,
    //width: "80%",
    width: 60,
    height: undefined,
    //maxHeight: 150,
    aspectRatio: 1,
    marginVertical: 10,
  },
  payButton: {
    padding: 10,
    backgroundColor: COLORS.primary,
    alignSelf: "center",
    marginVertical: 10,
  },
});

export default PaymentApps;
